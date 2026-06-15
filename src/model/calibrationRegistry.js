import { DEFAULT_CALIBRATION, CALIBRATION_VERSION } from "./calibration.js";
import {
  deepMergeCalibration,
  getCalibrationOverridePaths,
  hashCalibrationOverrides,
  normalizeCalibrationShares,
  validateCalibrationOverrides
} from "./calibrationOverrides.js";

export const CALIBRATION_REGISTRY = Object.freeze({
  [CALIBRATION_VERSION]: DEFAULT_CALIBRATION
});

export function resolveActiveCalibration(calibrationOverrides) {
  const normalizedOverrides =
    calibrationOverrides && calibrationOverrides.pathFit && !calibrationOverrides.pathFitComponentWeights
      ? {
          ...calibrationOverrides,
          pathFitComponentWeights: calibrationOverrides.pathFit
        }
      : calibrationOverrides;
  const validation = validateCalibrationOverrides(normalizedOverrides, DEFAULT_CALIBRATION);

  if (!validation.valid) {
    return {
      valid: false,
      errors: validation.errors,
      metadata: {
        baseVersion: CALIBRATION_VERSION,
        hasOverrides: Boolean(calibrationOverrides),
        overrideHash: hashCalibrationOverrides(normalizedOverrides),
        overriddenPaths: getCalibrationOverridePaths(normalizedOverrides)
      }
    };
  }

  const mergedCalibration = deepMergeCalibration(
    CALIBRATION_REGISTRY[CALIBRATION_VERSION],
    normalizedOverrides
  );
  const overriddenPaths = getCalibrationOverridePaths(normalizedOverrides);
  let activeCalibration;

  try {
    activeCalibration = normalizeCalibrationShares(mergedCalibration);
  } catch (error) {
    return {
      valid: false,
      errors: [error instanceof Error ? error.message : "Unable to normalize calibration shares."],
      metadata: {
        baseVersion: CALIBRATION_VERSION,
        hasOverrides: overriddenPaths.length > 0,
        overrideHash: hashCalibrationOverrides(normalizedOverrides),
        overriddenPaths
      }
    };
  }

  return {
    valid: true,
    calibration: activeCalibration,
    metadata: {
      baseVersion: CALIBRATION_VERSION,
      hasOverrides: overriddenPaths.length > 0,
      overrideHash: hashCalibrationOverrides(normalizedOverrides),
      overriddenPaths
    }
  };
}
