# Model Architecture

## Responsibilities

`CALIBRATION` is the numeric source of truth. It holds the tunable thresholds, coefficients, caps, floors, multipliers, and policy cutoffs that shape model behavior. Thresholds and recommendation policy values should live here instead of in branching logic.

Core effort, rework, slip, maintenance, shield, load, and tail coefficients now live in `CALIBRATION`. Simulation formulas should read those values by name instead of introducing new hardcoded effort constants.

`MODEL_ARTIFACT_GLOSSARY` is the artifact source of truth. It defines meaning, stage, path, and lifecycle notes for each artifact.

`MODEL_IMPACT_MAP` is the semantic dependency source of truth. It explains what affects what, the direction of each effect, where the effect is calculated, why it exists, and which calibration key controls it. It should not repeat artifact definitions.

`MODEL_STAGES` defines the stage vocabulary used across the glossary, impact map, and dependency docs.

`auditModelConfig()` is a lightweight developer audit helper. It checks that impact-map calibration references resolve, that impact artifacts exist in the glossary, that every raw input has a matching impact-map entry, and that the allowed direction and effect enums stay within the documented vocabulary.

Calculation code should read numeric values from `CALIBRATION`. The impact map should reference those values through `calibrationRef` instead of duplicating numbers inline.

All new model-behavior numbers should be named, documented, and placed in calibration first. The impact map should point at the same calibration key so reviewers can trace causal claims back to the exact numeric source.

## Contained-scope guardrail

The model uses a boolean contained-scope guardrail, historically named `simpleScope`, to prevent small or low-risk cases from being over-escalated to paid MUI tiers.

It is not an estimate of effort. It affects tier selection and path scoring.

When active, it:

- increases Core credibility,
- makes Premium harder to select,
- lowers packaged-path ICP strength,
- and keeps Build/Core plausible for contained cases.

When inactive, paid tiers can be considered more freely if coverage, support, scale, or complexity justify them.

Enterprise handling for this guardrail should be treated as a negative or neutral adjustment unless there is an explicit, documented reason for a positive value.

## Change Rules

When changing a threshold or coefficient:

1. Update the numeric value in `CALIBRATION`.
2. Confirm the matching `MODEL_IMPACT_MAP` entry still points to the right `calibrationRef`.
3. Validate representative low-risk, medium-risk, and high-risk scenarios.
4. Check launch, TCO, and P90 outputs if the change affects effort, cost, or variance.

When adding a new model threshold:

1. Add it to `CALIBRATION`.
2. Reference it from the relevant formula or policy branch.
3. Add or update the corresponding `MODEL_IMPACT_MAP` entry.
4. Avoid introducing a new hardcoded threshold directly in simulation or scorecard code.

To validate the metadata split locally, run the lightweight non-runtime checker:

```txt
node --input-type=module -e "import { auditModelConfig } from './src/model/auditModelConfig.js'; import { CALIBRATION } from './src/model/calibration.js'; import { MODEL_IMPACT_MAP } from './src/model/modelImpactMap.js'; import { MODEL_ARTIFACT_GLOSSARY } from './src/model/modelArtifactGlossary.js'; console.log(auditModelConfig({ calibration: CALIBRATION, impactMap: MODEL_IMPACT_MAP, artifactGlossary: MODEL_ARTIFACT_GLOSSARY }));"
```

## Example

```txt
To change how frontend developer count affects Build velocity:
1. Change CALIBRATION.simulation.velocity.frontendDevelopers.build.
2. Confirm MODEL_IMPACT_MAP.frontendDevelopers references that calibration key.
3. Validate representative scenarios.
```

## How To Change Effort Sensitivity

To make Build more sensitive to functional complexity:

1. Change `CALIBRATION.simulation.build.engineeringMeanWeeks.functionalRisk`.
2. Update comments if the interpretation changes.
3. Check the deterministic breakdown and Monte Carlo outputs.
4. Validate low-risk, medium-risk, and high-risk payloads.

## Deterministic Breakdown

The report includes a deterministic estimate breakdown for Build and the selected MUI path. It is the model's central estimate assembled from calibrated components before any random sampling is applied.

Use it to review:

- where launch time comes from,
- how rework and slip are assembled,
- how maintenance and TCO are built up,
- and whether a calibration change moved the central estimate in the intended direction.

The deterministic breakdown can differ from the Monte Carlo medians and P90s because the simulation samples variance and tail risk around the same central structure. That is expected. The breakdown is for explainability and calibration review, not as a replacement for the simulated distribution.

When reviewing calibration changes, compare the deterministic breakdown before and after the edit first. If the central estimate moved in the right direction, then confirm that the Monte Carlo medians and P90s still behave as expected.

## Sensitivity Diagnostics

The report also includes deterministic adjacent-input sensitivity diagnostics. This reruns the deterministic estimate with nearby input changes and compares each candidate against the base deterministic result.

The method is intentionally deterministic. It does not rerun the full Monte Carlo simulation for each candidate because that would be expensive, slow, and noisy for a debugging view. The goal is to identify which nearby input changes most moved the central estimate and recommendation signal, not to re-estimate the full probabilistic distribution.

The diagnostics reuse the deterministic breakdown and then compare the following deltas for each candidate:

- Build launch weeks
- MUI launch weeks
- launch delta
- Build TCO
- MUI TCO
- TCO delta
- Build tier score
- selected MUI plan score
- confidence

Candidate changes are capped to keep runtime bounded.

The candidate labels and impact references should reuse `MODEL_IMPACT_MAP` and `MODEL_ARTIFACT_GLOSSARY` where practical. That keeps the diagnostic output aligned with the same vocabulary used in the model metadata and helps explain why a nearby change matters.

Interpret cost-only inputs carefully:

- `engineerCostPerDay` is cost-only. It should affect Build TCO, MUI TCO, and TCO delta.
- It should not affect launch time, effort, fit, velocity, or rework.
- A cost-only diagnostic may still move recommendation confidence indirectly because the modeled cost separation changed.

The resulting summary is best read as a model-debugging signal. It shows which nearby input changes had the largest modeled effect. It does not claim exact causality and it does not prove that the real-world outcome will move the same way.

## Practical Notes

- A calibration change changes behavior.
- An impact map change changes the explanation of behavior.
- A stage or glossary change changes the model vocabulary and documentation surface.
- A documentation-only change should not be used to smuggle in runtime formula changes.
- `MODEL_IMPACT_MAP` entries should reference calibration keys for major effort, shield, load, and tail effects.
