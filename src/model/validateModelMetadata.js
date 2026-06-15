import { auditModelConfig } from "./auditModelConfig.js";

export function validateModelMetadata({
  calibration,
  impactMap,
  artifactGlossary
}) {
  return auditModelConfig({ calibration, impactMap, artifactGlossary });
}
