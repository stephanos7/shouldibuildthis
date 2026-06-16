import { DEFAULT_BUSINESS_CALIBRATION_PROFILE } from "./businessCalibrationDefaults.js";
import { DEFAULT_CALIBRATION } from "./calibration.js";
import {
  CALIBRATION_OUTCOME_KEYS,
  IMPACT_DIRECTIONS,
  INPUT_CALIBRATION_REGISTRY,
  INPUT_SCALE_TYPES
} from "./inputCalibrationRegistry.js";

export const INPUT_IMPACT_ROUTE_STATUS = {
  active: "active",
  savedOnly: "savedOnly",
  unsupported: "unsupported"
};

function isPlainObject(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function cloneValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, cloneValue(child)])
    );
  }

  return value;
}

function formatPath(path) {
  return path.length > 0 ? path.join(".") : "<root>";
}

function createDiagnostic(level, path, message, details = {}) {
  return {
    level,
    path: formatPath(path),
    message,
    ...details
  };
}

function normalizeImpactDirection(direction) {
  return direction === IMPACT_DIRECTIONS.none ||
    direction === IMPACT_DIRECTIONS.positive ||
    direction === IMPACT_DIRECTIONS.negative ||
    direction === IMPACT_DIRECTIONS.contextual
    ? direction
    : null;
}

function normalizeImpactStrength(strength) {
  const numericStrength = Number(strength);

  if (!Number.isFinite(numericStrength)) {
    return null;
  }

  return Math.min(100, Math.max(0, numericStrength));
}

function setRouteStatus(routeStatuses, inputKey, outcomeKey, status, diagnostic = null) {
  if (!routeStatuses[inputKey]) {
    routeStatuses[inputKey] = {};
  }

  routeStatuses[inputKey][outcomeKey] = {
    status,
    level: diagnostic?.level ?? null,
    message: diagnostic?.message ?? ""
  };
}

function routesEqual(leftRoute, rightRoute) {
  return (
    normalizeImpactDirection(leftRoute?.direction) === normalizeImpactDirection(rightRoute?.direction) &&
    normalizeImpactStrength(leftRoute?.strength) === normalizeImpactStrength(rightRoute?.strength)
  );
}

export function rankOrderToShares(order = []) {
  const rawWeights = order.map((_, index) => order.length - index);
  const total = rawWeights.reduce((sum, value) => sum + value, 0);

  if (!(total > 0)) {
    return {};
  }

  return Object.fromEntries(
    order.map((signalKey, index) => [signalKey, rawWeights[index] / total])
  );
}

function buildOrderedSignalOrder(baseSignals, requestedOrder, diagnostics, path) {
  const knownKeys = Object.keys(baseSignals ?? {});
  const knownKeySet = new Set(knownKeys);
  const seen = new Set();
  const order = [];

  for (const signalKey of requestedOrder ?? []) {
    if (!knownKeySet.has(signalKey)) {
      diagnostics.push(
        createDiagnostic("warning", path, `Unknown signal key "${signalKey}" will be ignored.`)
      );
      continue;
    }

    if (seen.has(signalKey)) {
      diagnostics.push(
        createDiagnostic("warning", path, `Signal key "${signalKey}" appears more than once.`)
      );
      continue;
    }

    seen.add(signalKey);
    order.push(signalKey);
  }

  for (const signalKey of knownKeys) {
    if (!seen.has(signalKey)) {
      order.push(signalKey);
    }
  }

  return order;
}

function compileInputScales(profile, baseCalibration, diagnostics, overrides) {
  const inputScales = profile?.inputScales;

  if (!isPlainObject(inputScales)) {
    return;
  }

  const nextInputIndexes = {};

  for (const [inputKey, scaleProfile] of Object.entries(inputScales)) {
    const registryEntry = INPUT_CALIBRATION_REGISTRY[inputKey];
    const baseInputIndex = baseCalibration?.inputIndexes?.[inputKey];
    const scalePath = ["inputScales", inputKey, "optionPositions"];

    if (!registryEntry) {
      diagnostics.push(
        createDiagnostic("warning", ["inputScales", inputKey], `Unknown input scale "${inputKey}" will be ignored.`)
      );
      continue;
    }

    if (registryEntry.scaleType !== INPUT_SCALE_TYPES.ordered) {
      diagnostics.push(
        createDiagnostic(
          "warning",
          ["inputScales", inputKey],
          `Input scale "${inputKey}" is not ordered and cannot be compiled as a business scale.`
        )
      );
      continue;
    }

    if (!isPlainObject(scaleProfile?.optionPositions)) {
      diagnostics.push(
        createDiagnostic("warning", scalePath, "optionPositions must be a plain object.")
      );
      continue;
    }

    const compiledPositions = {};
    const orderedOptions = registryEntry.options ?? [];
    const positions = scaleProfile.optionPositions;
    let previousPosition = -Infinity;
    let hasAnyPosition = false;

    for (let index = 0; index < orderedOptions.length; index += 1) {
      const optionKey = String(orderedOptions[index].key);
      const rawPosition = positions[optionKey];
      const numericPosition = Number(rawPosition);

      if (!Number.isFinite(numericPosition)) {
        diagnostics.push(
          createDiagnostic(
            "error",
            [...scalePath, optionKey],
            `Option "${optionKey}" must have a finite numeric position.`
          )
        );
        continue;
      }

      if (numericPosition < 0 || numericPosition > 100) {
        diagnostics.push(
          createDiagnostic(
            "error",
            [...scalePath, optionKey],
            `Option "${optionKey}" must stay within 0..100.`
          )
        );
      }

      if (numericPosition < previousPosition) {
        diagnostics.push(
          createDiagnostic(
            "error",
            [...scalePath, optionKey],
            `Option "${optionKey}" must not move backward on an ordered scale.`
          )
        );
      }

      previousPosition = numericPosition;
      hasAnyPosition = true;
      compiledPositions[optionKey] = numericPosition / 100;
    }

    if (hasAnyPosition) {
      nextInputIndexes[inputKey] = compiledPositions;
    }

    if (orderedOptions.length > 0) {
      const firstKey = String(orderedOptions[0].key);
      const lastKey = String(orderedOptions[orderedOptions.length - 1].key);
      const firstPosition = Number(positions[firstKey]);
      const lastPosition = Number(positions[lastKey]);

      if (Number.isFinite(firstPosition) && (firstPosition < 0 || firstPosition > 100)) {
        diagnostics.push(
          createDiagnostic(
            "error",
            [...scalePath, firstKey],
            `The first ordered option must stay within 0..100.`
          )
        );
      }

      if (Number.isFinite(lastPosition) && (lastPosition < 0 || lastPosition > 100)) {
        diagnostics.push(
          createDiagnostic(
            "error",
            [...scalePath, lastKey],
            `The last ordered option must stay within 0..100.`
          )
        );
      }
    }

    if (baseInputIndex && !isPlainObject(baseInputIndex)) {
      diagnostics.push(
        createDiagnostic(
          "warning",
          ["inputIndexes", inputKey],
          `Base calibration does not expose "${inputKey}" as an input index target.`
        )
      );
      continue;
    }
  }

  if (Object.keys(nextInputIndexes).length > 0) {
    overrides.inputIndexes = nextInputIndexes;
  }
}

function compileInputImpacts(profile, baseCalibration, diagnostics, overrides, routeStatuses) {
  const inputImpacts = profile?.inputImpacts;

  if (!isPlainObject(inputImpacts)) {
    return;
  }

  const nextDerivedFactorContributions = {};
  const supportedTargets = baseCalibration?.derivedFactorContributions;
  const allowedOutcomeKeys = new Set(CALIBRATION_OUTCOME_KEYS);

  for (const [inputKey, impactMap] of Object.entries(inputImpacts)) {
    const registryEntry = INPUT_CALIBRATION_REGISTRY[inputKey];

    if (!registryEntry) {
      diagnostics.push(
        createDiagnostic("warning", ["inputImpacts", inputKey], `Unknown input "${inputKey}" will be ignored.`)
      );
      continue;
    }

    if (!isPlainObject(impactMap)) {
      diagnostics.push(
        createDiagnostic("warning", ["inputImpacts", inputKey], "Impacts must be a plain object.")
      );
      continue;
    }

    for (const [targetKey, impactProfile] of Object.entries(impactMap)) {
      const supportedTarget = supportedTargets?.[inputKey]?.[targetKey];
      const isSupportedRoute = isPlainObject(supportedTarget);
      const isExplicitBusinessRoute = Boolean(registryEntry.impacts && targetKey in registryEntry.impacts);
      const defaultRoute = DEFAULT_BUSINESS_CALIBRATION_PROFILE.inputImpacts?.[inputKey]?.[targetKey] ?? {
        direction: IMPACT_DIRECTIONS.none,
        strength: 0
      };
      const routeMatchesDefault = routesEqual(impactProfile, defaultRoute);
      const shouldReportDiagnostic = isExplicitBusinessRoute || !routeMatchesDefault;
      const direction = normalizeImpactDirection(impactProfile?.direction);
      const strength = normalizeImpactStrength(impactProfile?.strength);
      const routePath = ["inputImpacts", inputKey, targetKey];

      if (!allowedOutcomeKeys.has(targetKey)) {
        const diagnostic = createDiagnostic(
          "warning",
          routePath,
          `Outcome "${targetKey}" is not recognized and will not be compiled.`,
          {
            inputKey,
            outcomeKey: targetKey,
            routeStatus: INPUT_IMPACT_ROUTE_STATUS.unsupported
          }
        );

        if (shouldReportDiagnostic) {
          diagnostics.push(diagnostic);
        }
        setRouteStatus(
          routeStatuses,
          inputKey,
          targetKey,
          INPUT_IMPACT_ROUTE_STATUS.unsupported,
          diagnostic
        );
        continue;
      }

      if (direction === null) {
        const diagnostic = createDiagnostic(
          "error",
          [...routePath, "direction"],
          `Direction "${impactProfile?.direction}" is not valid.`,
          {
            inputKey,
            outcomeKey: targetKey,
            routeStatus: INPUT_IMPACT_ROUTE_STATUS.unsupported
          }
        );

        if (shouldReportDiagnostic) {
          diagnostics.push(diagnostic);
        }
        setRouteStatus(
          routeStatuses,
          inputKey,
          targetKey,
          INPUT_IMPACT_ROUTE_STATUS.unsupported,
          diagnostic
        );
        continue;
      }

      if (strength === null) {
        const diagnostic = createDiagnostic(
          "error",
          [...routePath, "strength"],
          "Impact strength must be a finite number between 0 and 100.",
          {
            inputKey,
            outcomeKey: targetKey,
            routeStatus: INPUT_IMPACT_ROUTE_STATUS.unsupported
          }
        );

        if (shouldReportDiagnostic) {
          diagnostics.push(diagnostic);
        }
        setRouteStatus(
          routeStatuses,
          inputKey,
          targetKey,
          INPUT_IMPACT_ROUTE_STATUS.unsupported,
          diagnostic
        );
        continue;
      }

      if (!isSupportedRoute) {
        const diagnostic = createDiagnostic(
          "warning",
          routePath,
          "This impact is saved in the business profile but is not yet wired into runtime scoring.",
          {
            inputKey,
            outcomeKey: targetKey,
            routeStatus: INPUT_IMPACT_ROUTE_STATUS.savedOnly
          }
        );

        if (shouldReportDiagnostic) {
          diagnostics.push(diagnostic);
        }
        setRouteStatus(
          routeStatuses,
          inputKey,
          targetKey,
          INPUT_IMPACT_ROUTE_STATUS.savedOnly,
          diagnostic
        );
        continue;
      }

      if (direction === IMPACT_DIRECTIONS.contextual) {
        const diagnostic = createDiagnostic(
          "warning",
          routePath,
          "Contextual routing is saved in the business profile but is not compiled into runtime scoring yet.",
          {
            inputKey,
            outcomeKey: targetKey,
            routeStatus: INPUT_IMPACT_ROUTE_STATUS.savedOnly
          }
        );

        if (shouldReportDiagnostic) {
          diagnostics.push(diagnostic);
        }
        setRouteStatus(
          routeStatuses,
          inputKey,
          targetKey,
          INPUT_IMPACT_ROUTE_STATUS.savedOnly,
          diagnostic
        );
        continue;
      }

      const diagnostic = createDiagnostic(
        "info",
        routePath,
        "This route is compiled into derived factor contribution overrides.",
        {
          inputKey,
          outcomeKey: targetKey,
          routeStatus: INPUT_IMPACT_ROUTE_STATUS.active
        }
      );

      setRouteStatus(routeStatuses, inputKey, targetKey, INPUT_IMPACT_ROUTE_STATUS.active, diagnostic);

      if (isExplicitBusinessRoute || !routeMatchesDefault) {
        if (!nextDerivedFactorContributions[inputKey]) {
          nextDerivedFactorContributions[inputKey] = {};
        }

        const compiledStrength = direction === IMPACT_DIRECTIONS.none || strength === 0 ? 0 : strength;

        nextDerivedFactorContributions[inputKey][targetKey] = {
          direction,
          defaultStrength: compiledStrength
        };
      }

      if (shouldReportDiagnostic) {
        diagnostics.push(diagnostic);
      }
    }
  }

  if (Object.keys(nextDerivedFactorContributions).length > 0) {
    overrides.derivedFactorContributions = nextDerivedFactorContributions;
  }
}

function compilePathPriorities(profile, baseCalibration, diagnostics, overrides) {
  const pathPriorities = profile?.pathPriorities;

  if (!isPlainObject(pathPriorities)) {
    return;
  }

  const nextPathFitWeights = {};
  const basePathFitWeights = baseCalibration?.pathFitComponentWeights;

  for (const [pathKey, priorityProfile] of Object.entries(pathPriorities)) {
    const basePath = basePathFitWeights?.[pathKey];

    if (!basePath || !isPlainObject(basePath)) {
      diagnostics.push(
        createDiagnostic("warning", ["pathPriorities", pathKey], `Unknown path "${pathKey}" will be ignored.`)
      );
      continue;
    }

    const nextPath = cloneValue(basePath);

    for (const groupKey of ["positiveSignalsOrder", "dragSignalsOrder"]) {
      const signalGroupKey = groupKey === "positiveSignalsOrder" ? "positiveSignals" : "dragSignals";
      const signalGroup = basePath?.[signalGroupKey];
      const requestedOrder = Array.isArray(priorityProfile?.[groupKey])
        ? priorityProfile[groupKey].map((signalKey) => String(signalKey))
        : [];

      if (!isPlainObject(signalGroup)) {
        diagnostics.push(
          createDiagnostic(
            "warning",
            ["pathPriorities", pathKey, groupKey],
            `Path "${pathKey}" does not expose a ${signalGroupKey} group.`
          )
        );
        continue;
      }

      if (requestedOrder.length === 0) {
        continue;
      }

      const compiledOrder = buildOrderedSignalOrder(
        signalGroup,
        requestedOrder,
        diagnostics,
        ["pathPriorities", pathKey, groupKey]
      );
      const shares = rankOrderToShares(compiledOrder);

      for (const signalKey of Object.keys(signalGroup)) {
        if (!shares[signalKey]) {
          continue;
        }

        nextPath[signalGroupKey][signalKey] = {
          ...cloneValue(signalGroup[signalKey]),
          share: shares[signalKey]
        };
      }
    }

    nextPathFitWeights[pathKey] = nextPath;
  }

  if (Object.keys(nextPathFitWeights).length > 0) {
    overrides.pathFitComponentWeights = nextPathFitWeights;
  }
}

export function validateBusinessCalibrationProfile(
  profile = DEFAULT_BUSINESS_CALIBRATION_PROFILE,
  baseCalibration = DEFAULT_CALIBRATION
) {
  const errors = [];
  const warnings = [];
  const candidate = isPlainObject(profile) ? profile : null;
  const base = isPlainObject(baseCalibration) ? baseCalibration : DEFAULT_CALIBRATION;

  if (!candidate) {
    return {
      valid: false,
      errors: ["Business calibration profile must be a plain object."],
      warnings: []
    };
  }

  if (isPlainObject(candidate.inputScales)) {
    for (const [inputKey, scaleProfile] of Object.entries(candidate.inputScales)) {
      const registryEntry = INPUT_CALIBRATION_REGISTRY[inputKey];

      if (!registryEntry) {
        errors.push(`inputScales.${inputKey} is not a recognized input scale.`);
        continue;
      }

      if (registryEntry.scaleType !== INPUT_SCALE_TYPES.ordered) {
        errors.push(`inputScales.${inputKey} must target an ordered input scale.`);
        continue;
      }

      if (!isPlainObject(scaleProfile?.optionPositions)) {
        errors.push(`inputScales.${inputKey}.optionPositions must be a plain object.`);
        continue;
      }

      const orderedOptions = registryEntry.options ?? [];
      let previousPosition = -Infinity;

      for (let index = 0; index < orderedOptions.length; index += 1) {
        const optionKey = String(orderedOptions[index].key);
        const position = Number(scaleProfile.optionPositions[optionKey]);

        if (!Number.isFinite(position)) {
          errors.push(`inputScales.${inputKey}.optionPositions.${optionKey} must be a finite number.`);
          continue;
        }

        if (position < 0 || position > 100) {
          errors.push(`inputScales.${inputKey}.optionPositions.${optionKey} must stay within 0..100.`);
        }

        if (position < previousPosition) {
          errors.push(
            `inputScales.${inputKey}.optionPositions must remain non-decreasing across the ordered options.`
          );
        }

        previousPosition = position;
      }

      if (orderedOptions.length > 0) {
        const firstKey = String(orderedOptions[0].key);
        const lastKey = String(orderedOptions[orderedOptions.length - 1].key);
        const firstPosition = Number(scaleProfile.optionPositions[firstKey]);
        const lastPosition = Number(scaleProfile.optionPositions[lastKey]);

        if (Number.isFinite(firstPosition) && (firstPosition < 0 || firstPosition > 100)) {
          errors.push(`inputScales.${inputKey}.optionPositions.${firstKey} must stay within 0..100.`);
        }

        if (Number.isFinite(lastPosition) && (lastPosition < 0 || lastPosition > 100)) {
          errors.push(`inputScales.${inputKey}.optionPositions.${lastKey} must stay within 0..100.`);
        }
      }
    }
  }

  if (isPlainObject(candidate.inputImpacts)) {
    const allowedOutcomeKeys = new Set(CALIBRATION_OUTCOME_KEYS);

    for (const [inputKey, impactMap] of Object.entries(candidate.inputImpacts)) {
      const registryEntry = INPUT_CALIBRATION_REGISTRY[inputKey];

      if (!registryEntry) {
        errors.push(`inputImpacts.${inputKey} is not a recognized input.`);
        continue;
      }

      if (!isPlainObject(impactMap)) {
        errors.push(`inputImpacts.${inputKey} must be a plain object.`);
        continue;
      }

      for (const [targetKey, impactProfile] of Object.entries(impactMap)) {
        if (!allowedOutcomeKeys.has(targetKey)) {
          errors.push(`inputImpacts.${inputKey}.${targetKey} is not a recognized impact target.`);
          continue;
        }

        if (normalizeImpactDirection(impactProfile?.direction) === null) {
          errors.push(`inputImpacts.${inputKey}.${targetKey}.direction is not valid.`);
        }

        const strength = normalizeImpactStrength(impactProfile?.strength);
        if (strength === null) {
          errors.push(`inputImpacts.${inputKey}.${targetKey}.strength must be between 0 and 100.`);
        }
      }
    }
  }

  if (isPlainObject(candidate.pathPriorities)) {
    const supportedPaths = base?.pathFitComponentWeights ?? {};

    for (const [pathKey, priorityProfile] of Object.entries(candidate.pathPriorities)) {
      const pathConfig = supportedPaths[pathKey];

      if (!pathConfig || !isPlainObject(pathConfig)) {
        errors.push(`pathPriorities.${pathKey} is not a recognized path.`);
        continue;
      }

      for (const groupKey of ["positiveSignalsOrder", "dragSignalsOrder"]) {
        const signalGroupKey = groupKey === "positiveSignalsOrder" ? "positiveSignals" : "dragSignals";
        const signalGroup = pathConfig[signalGroupKey];
        const order = priorityProfile?.[groupKey];

        if (!isPlainObject(signalGroup)) {
          errors.push(`pathPriorities.${pathKey}.${groupKey} targets an unsupported signal group.`);
          continue;
        }

        if (!Array.isArray(order)) {
          errors.push(`pathPriorities.${pathKey}.${groupKey} must be an array.`);
          continue;
        }

        const knownSignals = new Set(Object.keys(signalGroup));
        const hasSignals = knownSignals.size > 0;
        const seen = new Set();

        if (order.length === 0 && hasSignals) {
          errors.push(`pathPriorities.${pathKey}.${groupKey} must contain at least one signal.`);
          continue;
        }

        for (const signalKey of order) {
          if (typeof signalKey !== "string") {
            errors.push(`pathPriorities.${pathKey}.${groupKey} entries must be strings.`);
            continue;
          }

          if (!knownSignals.has(signalKey)) {
            errors.push(`pathPriorities.${pathKey}.${groupKey} contains unknown signal "${signalKey}".`);
            continue;
          }

          if (seen.has(signalKey)) {
            warnings.push(
              `pathPriorities.${pathKey}.${groupKey} contains duplicate signal "${signalKey}" and will keep the first occurrence.`
            );
            continue;
          }

          seen.add(signalKey);
        }

        if (!hasSignals && order.length > 0) {
          errors.push(`pathPriorities.${pathKey}.${groupKey} cannot include signals because the path exposes none.`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export function compileBusinessCalibrationProfile(
  profile = DEFAULT_BUSINESS_CALIBRATION_PROFILE,
  baseCalibration = DEFAULT_CALIBRATION
) {
  const diagnostics = [];
  const routeStatuses = {};
  const validation = validateBusinessCalibrationProfile(profile, baseCalibration);

  for (const error of validation.errors) {
    diagnostics.push({
      level: "error",
      path: "<profile>",
      message: error
    });
  }

  for (const warning of validation.warnings) {
    diagnostics.push({
      level: "warning",
      path: "<profile>",
      message: warning
    });
  }

  const overrides = {};
  const candidate = isPlainObject(profile) ? profile : DEFAULT_BUSINESS_CALIBRATION_PROFILE;
  const base = isPlainObject(baseCalibration) ? baseCalibration : DEFAULT_CALIBRATION;

  compileInputScales(candidate, base, diagnostics, overrides);
  compileInputImpacts(candidate, base, diagnostics, overrides, routeStatuses);
  compilePathPriorities(candidate, base, diagnostics, overrides);

  return {
    calibrationOverrides: overrides,
    diagnostics,
    routeStatuses
  };
}
