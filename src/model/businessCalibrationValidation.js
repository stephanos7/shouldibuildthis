import { DEFAULT_CALIBRATION } from "./calibration.js";
import { deepMergeCalibration, validateCalibrationOverrides } from "./calibrationOverrides.js";
import { compileBusinessCalibrationProfile } from "./businessCalibrationCompiler.js";
import { validateCalibrationModel } from "./calibrationValidation.js";
import { DEFAULT_BUSINESS_CALIBRATION_PROFILE } from "./businessCalibrationDefaults.js";
import { MODEL_IMPACT_MAP } from "./modelImpactMap.js";

function isPlainObject(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function addDiagnostic(bucket, level, message, path = "<root>") {
  bucket.push({ level, path, message });
}

function countRouteStatuses(routeStatuses) {
  let active = 0;
  let savedOnly = 0;
  let unsupported = 0;

  for (const statusMap of Object.values(routeStatuses ?? {})) {
    for (const status of Object.values(statusMap ?? {})) {
      if (status?.status === "active") {
        active += 1;
      } else if (status?.status === "savedOnly") {
        savedOnly += 1;
      } else if (status?.status === "unsupported") {
        unsupported += 1;
      }
    }
  }

  return { active, savedOnly, unsupported };
}

function validateScenarioScore(value, path, errors) {
  if (!Number.isFinite(value)) {
    errors.push(`${path} must be a finite score.`);
  }
}

export function validateBusinessCalibrationPreview(
  profile = DEFAULT_BUSINESS_CALIBRATION_PROFILE,
  {
    baseCalibration = DEFAULT_CALIBRATION,
    impactMap = MODEL_IMPACT_MAP
  } = {}
) {
  const errors = [];
  const warnings = [];
  const info = [];
  const compilerDiagnostics = [];

  const mergedBase = isPlainObject(baseCalibration) ? baseCalibration : DEFAULT_CALIBRATION;
  const compilation = compileBusinessCalibrationProfile(profile, mergedBase);
  const overrideValidation = validateCalibrationOverrides(
    compilation.calibrationOverrides,
    mergedBase
  );
  const runtimeCalibration = deepMergeCalibration(mergedBase, compilation.calibrationOverrides);
  const runtimeValidation = validateCalibrationModel(runtimeCalibration, { impactMap });

  for (const diagnostic of compilation.diagnostics ?? []) {
    compilerDiagnostics.push(diagnostic);

    if (diagnostic.level === "error") {
      errors.push(diagnostic.message);
    } else if (diagnostic.level === "warning") {
      warnings.push(diagnostic.message);
    } else if (diagnostic.level === "info") {
      info.push(diagnostic.message);
    }
  }

  for (const message of overrideValidation.errors) {
    errors.push(message);
    addDiagnostic(compilerDiagnostics, "error", message, "calibrationOverrides");
  }

  for (const message of runtimeValidation.errors) {
    errors.push(message);
    addDiagnostic(compilerDiagnostics, "error", message, "<runtime>");
  }

  for (const message of runtimeValidation.warnings) {
    warnings.push(message);
    addDiagnostic(compilerDiagnostics, "warning", message, "<runtime>");
  }

  const overridePaths = Array.isArray(compilation.calibrationOverrides)
    ? []
    : Object.keys(compilation.calibrationOverrides ?? {});
  const routeCounts = countRouteStatuses(compilation.routeStatuses);

  if (overridePaths.length > 0) {
    info.push(`Compiled ${overridePaths.length} top-level calibration override section(s).`);
  } else {
    info.push("No runtime calibration overrides were compiled from the current profile.");
  }

  info.push(
    `${routeCounts.active} input impact route(s) are active, ${routeCounts.savedOnly} are saved-only, and ${routeCounts.unsupported} are unsupported.`
  );

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    info,
    diagnostics: compilerDiagnostics,
    routeStatuses: compilation.routeStatuses ?? {},
    compiledOverrides:
      compilation.calibrationOverrides && Object.keys(compilation.calibrationOverrides).length > 0
        ? compilation.calibrationOverrides
        : null,
    runtimeCalibration
  };
}

export function validateScenarioPreviewResult({ scenario, defaultResult, customResult }) {
  const errors = [];

  if (!scenario?.key) {
    errors.push("Scenario key is missing.");
  }

  for (const [label, result] of [
    ["Default", defaultResult],
    ["Custom", customResult]
  ]) {
    if (!result || typeof result !== "object") {
      errors.push(`${scenario?.label ?? scenario?.key ?? "Scenario"} ${label.toLowerCase()} result is missing.`);
      continue;
    }

    for (const [pathKey, pathResult] of Object.entries(result.pathFits ?? {})) {
      validateScenarioScore(pathResult?.score, `${label} path score ${pathKey}`, errors);
    }

    validateScenarioScore(
      result?.recommendation?.runnerUp?.scoreGap,
      `${label} recommendation margin`,
      errors
    );
    validateScenarioScore(result?.confidence?.score, `${label} confidence score`, errors);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function buildBusinessCalibrationValidationSummary(validation) {
  return {
    errorCount: validation?.errors?.length ?? 0,
    warningCount: validation?.warnings?.length ?? 0,
    infoCount: validation?.info?.length ?? 0,
    routeCounts: countRouteStatuses(validation?.routeStatuses)
  };
}
