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

function storeCompiledOverrides(profile) {
  const { calibrationOverrides, diagnostics } = compileBusinessCalibrationProfile(
    profile,
    DEFAULT_CALIBRATION
  );
  const hasErrors = diagnostics.some((diagnostic) => diagnostic.level === "error");

  if (hasErrors) {
    removeStoredJson(CALIBRATION_OVERRIDES_STORAGE_KEY);
    return {
      valid: false,
      calibrationOverrides: null,
      diagnostics
    };
  }

  writeStoredJson(CALIBRATION_OVERRIDES_STORAGE_KEY, calibrationOverrides);
  return {
    valid: true,
    calibrationOverrides,
    diagnostics
  };
}

export function readBusinessCalibrationProfile() {
  const parsed = readStoredJson(BUSINESS_CALIBRATION_STORAGE_KEY);

  if (!parsed) {
    return null;
  }

  const validation = validateBusinessCalibrationProfile(parsed, DEFAULT_CALIBRATION);

  if (!validation.valid) {
    removeStoredJson(BUSINESS_CALIBRATION_STORAGE_KEY);
    removeStoredJson(CALIBRATION_OVERRIDES_STORAGE_KEY);
    return null;
  }

  return parsed;
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

  writeStoredJson(BUSINESS_CALIBRATION_STORAGE_KEY, cloneValue(profile));
  return storeCompiledOverrides(profile);
}

export function clearBusinessCalibrationProfile() {
  removeStoredJson(BUSINESS_CALIBRATION_STORAGE_KEY);
  removeStoredJson(CALIBRATION_OVERRIDES_STORAGE_KEY);
}

export function readCompiledCalibrationOverrides() {
  const storedOverrides = readStoredJson(CALIBRATION_OVERRIDES_STORAGE_KEY);

  if (isPlainObject(storedOverrides)) {
    return storedOverrides;
  }

  const profile = readBusinessCalibrationProfile() ?? DEFAULT_BUSINESS_CALIBRATION_PROFILE;
  const { calibrationOverrides, diagnostics } = storeCompiledOverrides(profile);

  if (diagnostics.some((diagnostic) => diagnostic.level === "error")) {
    return null;
  }

  return calibrationOverrides;
}
