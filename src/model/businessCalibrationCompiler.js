import { DEFAULT_BUSINESS_CALIBRATION_PROFILE } from "./businessCalibrationDefaults.js";
import { DEFAULT_CALIBRATION } from "./calibration.js";
import { INPUT_CALIBRATION_REGISTRY, INPUT_SCALE_TYPES } from "./inputCalibrationRegistry.js";

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

function createDiagnostic(level, path, message) {
  return {
    level,
    path: formatPath(path),
    message
  };
}

function normalizeStrength(strength) {
  return Number(strength) / 100;
}

function rankOrderToShares(order) {
  const uniqueOrder = [];
  const seen = new Set();

  for (const signalKey of order ?? []) {
    if (seen.has(signalKey)) {
      continue;
    }

    seen.add(signalKey);
    uniqueOrder.push(signalKey);
  }

  const weights = uniqueOrder.map((_, index) => uniqueOrder.length - index);
  const totalWeight = weights.reduce((sum, value) => sum + value, 0);

  if (!(totalWeight > 0)) {
    return {};
  }

  return Object.fromEntries(
    uniqueOrder.map((signalKey, index) => [signalKey, weights[index] / totalWeight])
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

function compileInputImpacts(profile, baseCalibration, diagnostics, overrides) {
  const inputImpacts = profile?.inputImpacts;

  if (!isPlainObject(inputImpacts)) {
    return;
  }

  const nextDerivedFactorWeights = {};
  const supportedTargets = baseCalibration?.derivedFactorWeights;

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
      const supportedTarget = supportedTargets?.[targetKey];
      const registryImpact = registryEntry.impacts?.[targetKey];
      const direction = impactProfile?.direction;
      const strength = Number(impactProfile?.strength);

      if (!registryImpact) {
        diagnostics.push(
          createDiagnostic(
            "warning",
            ["inputImpacts", inputKey, targetKey],
            `Unknown impact target "${targetKey}" will be ignored.`
          )
        );
        continue;
      }

      if (!supportedTarget || !isPlainObject(supportedTarget)) {
        diagnostics.push(
          createDiagnostic(
            "warning",
            ["inputImpacts", inputKey, targetKey],
            `Target "${targetKey}" is not directly supported by the runtime calibration targets.`
          )
        );
        continue;
      }

      if (direction === "contextual") {
        diagnostics.push(
          createDiagnostic(
            "warning",
            ["inputImpacts", inputKey, targetKey],
            `Contextual routing for "${targetKey}" is not supported yet, so no numeric override was generated.`
          )
        );
        continue;
      }

      if (direction === "none") {
        if (!nextDerivedFactorWeights[targetKey]) {
          nextDerivedFactorWeights[targetKey] = {};
        }

        nextDerivedFactorWeights[targetKey][inputKey] = 0;
        continue;
      }

      if (!Number.isFinite(strength) || strength < 0 || strength > 100) {
        diagnostics.push(
          createDiagnostic(
            "error",
            ["inputImpacts", inputKey, targetKey, "strength"],
            "Impact strength must be a finite number between 0 and 100."
          )
        );
        continue;
      }

      if (direction !== "positive" && direction !== "negative") {
        diagnostics.push(
          createDiagnostic(
            "error",
            ["inputImpacts", inputKey, targetKey, "direction"],
            `Direction "${direction}" is not valid.`
          )
        );
        continue;
      }

      if (!nextDerivedFactorWeights[targetKey]) {
        nextDerivedFactorWeights[targetKey] = {};
      }

      nextDerivedFactorWeights[targetKey][inputKey] =
        (direction === "negative" ? -1 : 1) * normalizeStrength(strength);
    }
  }

  if (Object.keys(nextDerivedFactorWeights).length > 0) {
    overrides.derivedFactorWeights = nextDerivedFactorWeights;
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
        const knownImpact = registryEntry.impacts?.[targetKey];

        if (!knownImpact) {
          errors.push(`inputImpacts.${inputKey}.${targetKey} is not a recognized impact target.`);
          continue;
        }

        if (
          impactProfile?.direction !== "none" &&
          impactProfile?.direction !== "positive" &&
          impactProfile?.direction !== "negative" &&
          impactProfile?.direction !== "contextual"
        ) {
          errors.push(`inputImpacts.${inputKey}.${targetKey}.direction is not valid.`);
        }

        const strength = Number(impactProfile?.strength);
        if (!Number.isFinite(strength) || strength < 0 || strength > 100) {
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
        const seen = new Set();

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
            errors.push(`pathPriorities.${pathKey}.${groupKey} contains duplicate signal "${signalKey}".`);
            continue;
          }

          seen.add(signalKey);
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
  compileInputImpacts(candidate, base, diagnostics, overrides);
  compilePathPriorities(candidate, base, diagnostics, overrides);

  return {
    calibrationOverrides: overrides,
    diagnostics
  };
}
