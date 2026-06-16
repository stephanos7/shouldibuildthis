import { DEFAULT_CALIBRATION } from "./calibration.js";
import { resolveCalibrationRef } from "./evaluateCalibration.js";
import { MODEL_IMPACT_MAP } from "./modelImpactMap.js";
import {
  CALIBRATION_TEST_SCENARIOS,
  LEGACY_CALIBRATION_TOKENS
} from "./calibrationTestScenarios.js";

function isPlainObject(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function formatPath(path) {
  return path.length > 0 ? path.join(".") : "<root>";
}

function getValueAtPath(value, path) {
  return path.reduce((current, key) => current?.[key], value);
}

function validateAgainstSchema(node, schemaNode, path, errors) {
  if (Array.isArray(schemaNode)) {
    if (!Array.isArray(node)) {
      errors.push(`${formatPath(path)} must be an array.`);
      return;
    }

    if (schemaNode.length === 0) {
      return;
    }

    node.forEach((item, index) => {
      validateAgainstSchema(item, schemaNode[Math.min(index, schemaNode.length - 1)], [...path, String(index)], errors);
    });
    return;
  }

  if (isPlainObject(schemaNode)) {
    if (!isPlainObject(node)) {
      errors.push(`${formatPath(path)} must be a plain object.`);
      return;
    }

    for (const [key, schemaValue] of Object.entries(schemaNode)) {
      validateAgainstSchema(node[key], schemaValue, [...path, key], errors);
    }

    for (const key of Object.keys(node)) {
      if (!(key in schemaNode)) {
        errors.push(`${formatPath([...path, key])} is not a recognized calibration path.`);
      }
    }
    return;
  }

  if (schemaNode === null) {
    if (node !== null) {
      errors.push(`${formatPath(path)} must be null.`);
    }
    return;
  }

  const expectedType = typeof schemaNode;
  if (typeof node !== expectedType) {
    errors.push(`${formatPath(path)} must be a ${expectedType}.`);
    return;
  }

  if (expectedType === "number" && !Number.isFinite(node)) {
    errors.push(`${formatPath(path)} must be a finite number.`);
  }
}

function validateNonNegativeBudgets(node, path, errors) {
  if (Array.isArray(node)) {
    node.forEach((item, index) =>
      validateNonNegativeBudgets(item, [...path, String(index)], errors)
    );
    return;
  }

  if (!isPlainObject(node)) {
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    const nextPath = [...path, key];

    if (
      typeof value === "number" &&
      key.toLowerCase().includes("budget") &&
      value < 0
    ) {
      errors.push(`${formatPath(nextPath)} must be non-negative.`);
    }

    validateNonNegativeBudgets(value, nextPath, errors);
  }
}

function validateShareGroups(node, path, errors, warnings) {
  if (Array.isArray(node)) {
    node.forEach((item, index) =>
      validateShareGroups(item, [...path, String(index)], errors, warnings)
    );
    return;
  }

  if (!isPlainObject(node)) {
    return;
  }

  const entries = Object.entries(node);
  const shareValues = entries.filter(
    ([, child]) => isPlainObject(child) && Object.prototype.hasOwnProperty.call(child, "share")
  );

  if (shareValues.length > 0) {
    let totalShare = 0;

    for (const [key, child] of shareValues) {
      const share = child.share;

      if (typeof share !== "number" || !Number.isFinite(share)) {
        errors.push(`${formatPath([...path, key, "share"])} must be a finite number.`);
        continue;
      }

      if (share < 0) {
        errors.push(`${formatPath([...path, key, "share"])} must be non-negative.`);
      }

      totalShare += share;
    }

    if (!(totalShare > 0)) {
      errors.push(`${formatPath(path)} share values must sum to more than 0.`);
    } else if (Math.abs(totalShare - 1) > 0.0001) {
      warnings.push(
        `${formatPath(path)} share values sum to ${totalShare.toFixed(
          3
        )}; they will be normalized before use.`
      );
    }
  }

  for (const [key, value] of entries) {
    validateShareGroups(value, [...path, key], errors, warnings);
  }
}

function validateOrderedSequence(sequence, scenario, warnings) {
  const values = [];

  for (const path of sequence) {
    const value = getValueAtPath(scenario.calibration, path);

    if (typeof value !== "number" || !Number.isFinite(value)) {
      return;
    }

    values.push({ path, value });
  }

  for (let index = 1; index < values.length; index += 1) {
    const previous = values[index - 1].value;
    const current = values[index].value;
    const isAscending = scenario.direction === "ascending";
    const isOrdered = isAscending ? previous <= current : previous >= current;

    if (!isOrdered) {
      warnings.push(
        `${scenario.title}: ${formatPath(values[index - 1].path)} (${previous}) and ${formatPath(
          values[index].path
        )} (${current}) are out of ${isAscending ? "ascending" : "descending"} order.`
      );
      return;
    }

    if (!scenario.allowEqual && previous === current) {
      warnings.push(
        `${scenario.title}: ${formatPath(values[index - 1].path)} and ${formatPath(
          values[index].path
        )} should not be equal.`
      );
      return;
    }
  }
}

function validateScalarMonotonicity(scenario, warnings) {
  const value = getValueAtPath(scenario.calibration, scenario.path);

  if (typeof value !== "number" || !Number.isFinite(value)) {
    return;
  }

  if (scenario.direction === "positive" && value <= 0) {
    warnings.push(`${scenario.title}: ${formatPath(scenario.path)} should be positive.`);
  }

  if (scenario.direction === "negative" && value >= 0) {
    warnings.push(`${scenario.title}: ${formatPath(scenario.path)} should be negative.`);
  }
}

function validateMonotonicity(calibration, warnings) {
  for (const scenario of CALIBRATION_TEST_SCENARIOS) {
    const scenarioContext = { ...scenario, calibration };

    if (scenario.kind === "sequence") {
      validateOrderedSequence(scenario.pathGroup, scenarioContext, warnings);
    } else if (scenario.kind === "scalar") {
      validateScalarMonotonicity(scenarioContext, warnings);
    }
  }
}

function validateKnownCalibrationRefs(calibration, impactMap, errors) {
  for (const [impactKey, impactEntry] of Object.entries(impactMap)) {
    const impacts = Array.isArray(impactEntry?.impacts) ? impactEntry.impacts : [];

    for (const [index, impact] of impacts.entries()) {
      if (!impact?.calibrationRef) {
        continue;
      }

      const resolved = resolveCalibrationRef(calibration, impact.calibrationRef);

      if (resolved === undefined) {
        errors.push(
          `${impactKey}.impacts[${index}].calibrationRef=${impact.calibrationRef} does not resolve in CALIBRATION.`
        );
      }
    }
  }
}

function validateLegacyArtifacts(calibration, warnings) {
  const serialized = JSON.stringify(calibration).toLowerCase();

  for (const token of LEGACY_CALIBRATION_TOKENS) {
    if (serialized.includes(token)) {
      warnings.push(
        `Legacy calibration artifact token "${token}" is still present. This model is expected to be free of removed Monte Carlo/TCO artifacts.`
      );
    }
  }
}

export function validateCalibrationModel(
  calibration = DEFAULT_CALIBRATION,
  { impactMap = MODEL_IMPACT_MAP } = {}
) {
  const errors = [];
  const warnings = [];

  if (!isPlainObject(calibration)) {
    return {
      valid: false,
      errors: ["Calibration must be a plain object."],
      warnings: []
    };
  }

  validateAgainstSchema(calibration, DEFAULT_CALIBRATION, [], errors);
  validateNonNegativeBudgets(calibration, [], errors);
  validateShareGroups(calibration, [], errors, warnings);
  validateKnownCalibrationRefs(calibration, impactMap, errors);
  validateMonotonicity(calibration, warnings);
  validateLegacyArtifacts(calibration, warnings);

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
