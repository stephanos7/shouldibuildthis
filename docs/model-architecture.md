# Model Architecture

## Responsibilities

`CALIBRATION` is the numeric source of truth. It holds the tunable thresholds, coefficients, caps, floors, multipliers, and policy cutoffs that shape model behavior. Thresholds and recommendation policy values should live here instead of in branching logic.

`MODEL_ARTIFACT_GLOSSARY` is the artifact source of truth. It defines meaning, stage, path, and lifecycle notes for each artifact.

`MODEL_IMPACT_MAP` is the semantic dependency source of truth. It explains what affects what, the direction of each effect, where the effect is calculated, why it exists, and which calibration key controls it. It should not repeat artifact definitions.

`MODEL_STAGES` defines the stage vocabulary used across the glossary, impact map, and dependency docs.

Calculation code should read numeric values from `CALIBRATION`. The impact map should reference those values through `calibrationRef` instead of duplicating numbers inline.

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
node --input-type=module -e "import { validateModelMetadata } from './src/model/validateModelMetadata.js'; import { CALIBRATION } from './src/model/calibration.js'; import { MODEL_IMPACT_MAP } from './src/model/modelImpactMap.js'; console.log(validateModelMetadata({ calibration: CALIBRATION, impactMap: MODEL_IMPACT_MAP }));"
```

## Example

```txt
To change how frontend developer count affects Build velocity:
1. Change CALIBRATION.simulation.velocity.frontendDevelopers.build.
2. Confirm MODEL_IMPACT_MAP.frontendDevelopers references that calibration key.
3. Validate representative scenarios.
```

## Practical Notes

- A calibration change changes behavior.
- An impact map change changes the explanation of behavior.
- A stage or glossary change changes the model vocabulary and documentation surface.
- A documentation-only change should not be used to smuggle in runtime formula changes.
