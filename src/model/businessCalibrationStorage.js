import { DEFAULT_CALIBRATION } from "./calibration.js";
import {
  compileBusinessCalibrationProfile,
  validateBusinessCalibrationProfile
} from "./businessCalibrationCompiler.js";
import { DEFAULT_BUSINESS_CALIBRATION_PROFILE } from "./businessCalibrationDefaults.js";

export const BUSINESS_CALIBRATION_STORAGE_KEY = "businessCalibrationProfile";
export const CALIBRATION_OVERRIDES_STORAGE_KEY = "calibrationOverrides";

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

function deepMergeValue(baseValue, overrideValue) {
  if (Array.isArray(baseValue) || Array.isArray(overrideValue)) {
    return cloneValue(
      overrideValue === undefined ? baseValue : overrideValue
    );
  }

  if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
    const next = cloneValue(baseValue);

    for (const [key, childValue] of Object.entries(overrideValue)) {
      next[key] = deepMergeValue(baseValue[key], childValue);
    }

    return next;
  }

  if (overrideValue === undefined) {
    return cloneValue(baseValue);
  }

  return cloneValue(overrideValue);
}

function safeParse(jsonText) {
  try {
    return JSON.parse(jsonText);
  } catch {
    return null;
  }
}

function readStoredJson(key) {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(key);

  if (!raw) {
    return null;
  }

  return safeParse(raw);
}

function writeStoredJson(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function removeStoredJson(key) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(key);
}

function hasOwnOverrides(calibrationOverrides) {
  return isPlainObject(calibrationOverrides) && Object.keys(calibrationOverrides).length > 0;
}

export function mergeBusinessCalibrationProfile(profile) {
  return deepMergeValue(DEFAULT_BUSINESS_CALIBRATION_PROFILE, profile ?? {});
}

export function readBusinessCalibrationProfile() {
  return readStoredJson(BUSINESS_CALIBRATION_STORAGE_KEY);
}

export function exportBusinessCalibrationProfile(profile) {
  return JSON.stringify(cloneValue(profile ?? DEFAULT_BUSINESS_CALIBRATION_PROFILE), null, 2);
}

export function importBusinessCalibrationProfile(jsonText) {
  let parsed;

  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return {
      valid: false,
      errors: ["Profile JSON could not be parsed."],
      warnings: [],
      profile: null
    };
  }

  if (!isPlainObject(parsed)) {
    return {
      valid: false,
      errors: ["Business calibration profile must be a plain object."],
      warnings: [],
      profile: null
    };
  }

  const profile = mergeBusinessCalibrationProfile(parsed);
  const validation = validateBusinessCalibrationProfile(profile, DEFAULT_CALIBRATION);

  return {
    valid: validation.valid,
    errors: validation.errors,
    warnings: validation.warnings,
    profile: validation.valid ? profile : null
  };
}

function storeCompiledOverrides(profile) {
  const mergedProfile = mergeBusinessCalibrationProfile(profile);
  const { calibrationOverrides, diagnostics } = compileBusinessCalibrationProfile(
    mergedProfile,
    DEFAULT_CALIBRATION
  );
  const hasErrors = diagnostics.some((diagnostic) => diagnostic.level === "error");
  const compiledOverrides = hasOwnOverrides(calibrationOverrides) ? calibrationOverrides : null;

  if (hasErrors || !compiledOverrides) {
    removeStoredJson(CALIBRATION_OVERRIDES_STORAGE_KEY);
  } else {
    writeStoredJson(CALIBRATION_OVERRIDES_STORAGE_KEY, compiledOverrides);
  }

  return {
    valid: !hasErrors,
    calibrationOverrides: compiledOverrides,
    diagnostics
  };
}

export function writeBusinessCalibrationProfile(profile) {
  if (typeof window === "undefined") {
    return {
      valid: false,
      calibrationOverrides: null,
      diagnostics: [
        {
          level: "warning",
          path: "<storage>",
          message: "Business calibration profile storage is unavailable outside the browser."
        }
      ]
    };
  }

  if (!profile) {
    clearBusinessCalibrationProfile();
    return {
      valid: true,
      calibrationOverrides: null,
      diagnostics: []
    };
  }

  const nextProfile = mergeBusinessCalibrationProfile(profile);
  writeStoredJson(BUSINESS_CALIBRATION_STORAGE_KEY, nextProfile);

  return storeCompiledOverrides(nextProfile);
}

export function clearBusinessCalibrationProfile() {
  removeStoredJson(BUSINESS_CALIBRATION_STORAGE_KEY);
  removeStoredJson(CALIBRATION_OVERRIDES_STORAGE_KEY);
}

export function readCompiledCalibrationOverrides() {
  const storedProfile = readBusinessCalibrationProfile();

  if (!storedProfile) {
    return {
      profile: null,
      calibrationOverrides: null,
      valid: true,
      diagnostics: []
    };
  }

  const nextProfile = mergeBusinessCalibrationProfile(storedProfile);
  const { calibrationOverrides, diagnostics } = compileBusinessCalibrationProfile(
    nextProfile,
    DEFAULT_CALIBRATION
  );
  const valid = !diagnostics.some((diagnostic) => diagnostic.level === "error");
  const compiledOverrides = hasOwnOverrides(calibrationOverrides) ? calibrationOverrides : null;

  return {
    profile: nextProfile,
    calibrationOverrides: compiledOverrides,
    valid,
    diagnostics
  };
}
