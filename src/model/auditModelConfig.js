import { resolveCalibrationRef } from "./evaluateCalibration.js";
import { MODEL_ARTIFACT_GLOSSARY } from "./modelArtifactGlossary.js";
import { MODEL_IMPACT_MAP } from "./modelImpactMap.js";

const ALLOWED_DIRECTIONS = new Set([
  "good",
  "bad",
  "positive",
  "negative",
  "contextual",
  "cost",
  "mixed",
  "neutral"
]);

const ALLOWED_EFFECT_TYPES = new Set([
  "linear",
  "capped-linear",
  "threshold",
  "inverse",
  "boolean",
  "enum-step",
  "conditional",
  "plan-conditional",
  "interaction",
  "guardrail",
  "cost-only"
]);

const ALLOWED_EFFECT_SCALES = new Set([
  "none",
  "very-small",
  "small",
  "moderate",
  "large",
  "dominant",
  "unknown"
]);

function getRawInputArtifacts(artifactGlossary) {
  return Object.values(artifactGlossary)
    .filter((artifact) => artifact?.stage === "rawInput" && artifact?.artifact)
    .map((artifact) => artifact.artifact);
}

export function auditModelConfig({
  calibration,
  impactMap = MODEL_IMPACT_MAP,
  artifactGlossary = MODEL_ARTIFACT_GLOSSARY
}) {
  const errors = [];
  const warnings = [];

  for (const [impactKey, impactEntry] of Object.entries(impactMap)) {
    if (!impactEntry || typeof impactEntry !== "object") {
      errors.push(`Impact entry for ${impactKey} must be an object.`);
      continue;
    }

    const impacts = Array.isArray(impactEntry.impacts) ? impactEntry.impacts : [];
    if (!Array.isArray(impactEntry.impacts)) {
      warnings.push(`Impact entry for ${impactKey} is missing an impacts array.`);
    }

    for (const [index, impact] of impacts.entries()) {
      const location = `${impactKey}.impacts[${index}]`;

      for (const field of [
        "artifact",
        "stage",
        "path",
        "direction",
        "calculatedIn",
        "reason"
      ]) {
        if (!impact?.[field]) {
          errors.push(`${location} is missing required field ${field}.`);
        }
      }

      if (impact?.artifact && !artifactGlossary[impact.artifact]) {
        errors.push(
          `${location}.artifact references ${impact.artifact}, which is not defined in MODEL_ARTIFACT_GLOSSARY.`
        );
      }

      if (impact?.direction && !ALLOWED_DIRECTIONS.has(impact.direction)) {
        errors.push(
          `${location}.direction uses unsupported value ${impact.direction}.`
        );
      }

      if (impact?.effectType && !ALLOWED_EFFECT_TYPES.has(impact.effectType)) {
        errors.push(
          `${location}.effectType uses unsupported value ${impact.effectType}.`
        );
      }

      if (impact?.effectScale && !ALLOWED_EFFECT_SCALES.has(impact.effectScale)) {
        errors.push(
          `${location}.effectScale uses unsupported value ${impact.effectScale}.`
        );
      }

      if (impact?.calibrationRef) {
        const resolved = resolveCalibrationRef(calibration, impact.calibrationRef);

        if (resolved === undefined) {
          errors.push(
            `${location}.calibrationRef=${impact.calibrationRef} does not resolve in CALIBRATION.`
          );
        }
      }
    }
  }

  for (const rawInput of getRawInputArtifacts(artifactGlossary)) {
    if (!impactMap[rawInput]) {
      errors.push(
        `Raw input ${rawInput} exists in MODEL_ARTIFACT_GLOSSARY but is missing from MODEL_IMPACT_MAP.`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
