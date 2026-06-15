import { DEFAULT_CALIBRATION } from "./calibration.js";
import { deepMergeCalibration, validateCalibrationOverrides } from "./calibrationOverrides.js";

export const CALIBRATION_STORAGE_KEY = "calibrationOverrides";

function isPlainObject(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function normalizeStoredOverrides(value) {
  if (!isPlainObject(value)) {
    return null;
  }

  if (value.pathFit && !value.pathFitComponentWeights) {
    return {
      ...value,
      pathFitComponentWeights: value.pathFit
    };
  }

  return value;
}

function clonePlain(value) {
  if (Array.isArray(value)) {
    return value.map((item) => clonePlain(item));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, clonePlain(child)])
    );
  }

  return value;
}

export function readCalibrationOverrides() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(CALIBRATION_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = normalizeStoredOverrides(JSON.parse(raw));

    if (!parsed) {
      window.localStorage.removeItem(CALIBRATION_STORAGE_KEY);
      return null;
    }

    const validation = validateCalibrationOverrides(parsed, DEFAULT_CALIBRATION);

    if (!validation.valid) {
      window.localStorage.removeItem(CALIBRATION_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(CALIBRATION_STORAGE_KEY);
    }

    return null;
  }
}

export function writeCalibrationOverrides(overrides) {
  if (typeof window === "undefined") {
    return;
  }

  if (!overrides) {
    window.localStorage.removeItem(CALIBRATION_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(CALIBRATION_STORAGE_KEY, JSON.stringify(clonePlain(overrides)));
}

export function clearCalibrationOverrides() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(CALIBRATION_STORAGE_KEY);
}

export function exportCalibrationOverrides(overrides) {
  return JSON.stringify(clonePlain(overrides ?? {}), null, 2);
}

export function importCalibrationOverrides(jsonText) {
  const parsed = normalizeStoredOverrides(JSON.parse(jsonText));
  const validation = validateCalibrationOverrides(parsed, DEFAULT_CALIBRATION);

  if (!validation.valid) {
    return {
      valid: false,
      errors: validation.errors
    };
  }

  return {
    valid: true,
    overrides: parsed
  };
}

export function mergeCalibrationDraft(overrides) {
  return deepMergeCalibration(DEFAULT_CALIBRATION, overrides ?? {});
}
