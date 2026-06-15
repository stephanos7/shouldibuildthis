import { DEFAULT_CALIBRATION } from "./calibration.js";

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

function stableStringify(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  const entries = Object.keys(value)
    .filter((key) => value[key] !== undefined)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`);

  return `{${entries.join(",")}}`;
}

function hashString(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function validateNode(node, baseNode, path, errors) {
  if (node === undefined) {
    return;
  }

  if (path.length === 1 && path[0] === "version") {
    errors.push("calibrationOverrides.version cannot be overridden.");
    return;
  }

  if (Array.isArray(node)) {
    if (!Array.isArray(baseNode)) {
      errors.push(`${path.join(".")} must be an object-compatible array.`);
      return;
    }

    node.forEach((item, index) => {
      validateNode(item, baseNode[index], [...path, String(index)], errors);
    });
    return;
  }

  if (isPlainObject(node)) {
    if (!isPlainObject(baseNode)) {
      errors.push(`${path.join(".")} is not a valid override target.`);
      return;
    }

    for (const [key, value] of Object.entries(node)) {
      if (!(key in baseNode)) {
        errors.push(`${[...path, key].join(".")} is not a recognized calibration path.`);
        continue;
      }

      validateNode(value, baseNode[key], [...path, key], errors);
    }
    return;
  }

  if (path[path.length - 1] === "share") {
    if (typeof node !== "number" || !Number.isFinite(node) || node <= 0) {
      errors.push(`${path.join(".")} must be a positive finite number.`);
    }
    return;
  }

  const valueType = typeof node;
  if (!["string", "number", "boolean"].includes(valueType) && node !== null) {
    errors.push(`${path.join(".")} must be a JSON-serializable primitive, object, or array.`);
  }
}

function collectOverridePaths(node, path = [], paths = []) {
  if (node === undefined) {
    return paths;
  }

  if (Array.isArray(node)) {
    if (node.length === 0) {
      paths.push(path.join("."));
      return paths;
    }

    node.forEach((item, index) => {
      collectOverridePaths(item, [...path, String(index)], paths);
    });
    return paths;
  }

  if (isPlainObject(node)) {
    const keys = Object.keys(node);

    if (keys.length === 0) {
      paths.push(path.join("."));
      return paths;
    }

    for (const key of keys) {
      collectOverridePaths(node[key], [...path, key], paths);
    }
    return paths;
  }

  paths.push(path.join("."));
  return paths;
}

function normalizeSignalGroup(group) {
  const entries = Object.entries(group);
  const totalShare = entries.reduce((sum, [, config]) => sum + (config?.share ?? 0), 0);

  if (!Number.isFinite(totalShare) || totalShare <= 0) {
    throw new Error("Path-fit signal shares must sum to a positive value.");
  }

  return Object.fromEntries(
    entries.map(([key, config]) => [
      key,
      {
        ...config,
        normalizedShare: config.share / totalShare
      }
    ])
  );
}

function normalizePathFitGroups(calibration) {
  const nextCalibration = cloneValue(calibration);
  const pathFitGroups = nextCalibration?.pathFitComponentWeights;

  if (!isPlainObject(pathFitGroups)) {
    return nextCalibration;
  }

  for (const pathKey of Object.keys(pathFitGroups)) {
    const pathGroup = pathFitGroups[pathKey];

    if (!isPlainObject(pathGroup)) {
      continue;
    }

    if (isPlainObject(pathGroup.positiveSignals)) {
      pathGroup.positiveSignals = normalizeSignalGroup(pathGroup.positiveSignals);
    }

    if (isPlainObject(pathGroup.dragSignals)) {
      pathGroup.dragSignals = normalizeSignalGroup(pathGroup.dragSignals);
    }
  }

  if (nextCalibration.pathFit) {
    nextCalibration.pathFit = pathFitGroups;
  }

  return nextCalibration;
}

export function deepMergeCalibration(base, overrides) {
  if (overrides === undefined || overrides === null) {
    return cloneValue(base);
  }

  if (!isPlainObject(base) || !isPlainObject(overrides)) {
    return cloneValue(overrides);
  }

  const merged = cloneValue(base);

  for (const [key, overrideValue] of Object.entries(overrides)) {
    const baseValue = base[key];

    if (Array.isArray(overrideValue)) {
      merged[key] = cloneValue(overrideValue);
    } else if (isPlainObject(overrideValue) && isPlainObject(baseValue)) {
      merged[key] = deepMergeCalibration(baseValue, overrideValue);
    } else {
      merged[key] = cloneValue(overrideValue);
    }
  }

  return merged;
}

export function validateCalibrationOverrides(overrides, base = DEFAULT_CALIBRATION) {
  const errors = [];

  if (overrides === undefined || overrides === null) {
    return { valid: true, errors, paths: [] };
  }

  if (!isPlainObject(overrides)) {
    return {
      valid: false,
      errors: ["calibrationOverrides must be a plain object."],
      paths: []
    };
  }

  validateNode(overrides, base, ["calibrationOverrides"], errors);

  return {
    valid: errors.length === 0,
    errors,
    paths: getCalibrationOverridePaths(overrides)
  };
}

export function getCalibrationOverridePaths(overrides) {
  if (overrides === undefined || overrides === null) {
    return [];
  }

  return Array.from(new Set(collectOverridePaths(overrides))).filter(Boolean);
}

export function hashCalibrationOverrides(overrides) {
  if (overrides === undefined || overrides === null) {
    return null;
  }

  return hashString(stableStringify(overrides));
}

export function normalizeCalibrationShares(calibration) {
  return normalizePathFitGroups(calibration);
}
