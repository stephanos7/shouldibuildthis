# Model Architecture

## Current runtime

The active backend model is deterministic.

It does not run seeded iteration loops.

The backend response now centers on:

- `derivedFactors`
- `planFits`
- `pathFits`
- `recommendation`
- `confidence`
- `diagnostics`
- `assumptions`
- `publicSources`

## Responsibilities

`CALIBRATION` remains the numeric source of truth for the active model weights.

The active runtime primarily uses:

- `DERIVED_FACTOR_WEIGHTS`
- `PLAN_FIT_WEIGHTS`
- `PATH_SCORE_WEIGHTS`
- `SCENARIO_LEVER_WEIGHTS`

`MODEL_ARTIFACT_GLOSSARY` owns artifact meaning and lifecycle notes.

`MODEL_IMPACT_MAP` owns causal relationships and calibration traceability. New behavior should be documented against the deterministic path-fit model.

## Flow

The backend model now follows this sequence:

1. Normalize and validate raw assessment input.
2. Build deterministic `derivedFactors`.
3. Build MUI-tier `planFits`.
4. Build a scorecard and scenario levers.
5. Build four `pathFits`: Build, Core, Premium, Enterprise.
6. Rank the path fits and synthesize a deterministic recommendation.
7. Compute deterministic confidence from score margin, signal consistency, and ambiguity.

## Path fits

`buildPathFits(input, derivedFactors, scorecard, planFits)` returns:

- `build`
- `core`
- `premium`
- `enterprise`

Each path fit contains:

- `score`
- `level`
- `components`
- `strengths`
- `drags`

These are fit signals, not delivery or cost estimates.

## Recommendation

`buildDeterministicRecommendation(input, derivedFactors, scorecard, pathFits)`:

1. Ranks all four paths.
2. Filters by eligibility where appropriate.
3. Selects the highest eligible path.
4. Identifies the runner-up.
5. Computes confidence deterministically.
6. Returns reasons and tradeoffs.

Confidence is not probabilistic. It is derived from:

- winner-versus-runner-up score gap
- signal consistency bonus
- ambiguity penalty when top paths are close

## Assumptions

The active backend assumptions are:

- This is a deterministic fit model.
- It does not estimate delivery dates.
- Scores are heuristic decision-support signals, not guarantees.
- Public sources inform variable selection and risk direction, not exact coefficients.

## Change rules

When changing model behavior:

1. Put numeric changes in `CALIBRATION`.
2. Keep `MODEL_ARTIFACT_GLOSSARY` aligned with the active output artifacts.
3. Keep `MODEL_IMPACT_MAP` aligned with active deterministic behavior, or clearly mark transitional legacy entries.
4. Validate at least:
   - a low-risk simple case where Build/Core remain plausible
   - a complex data-grid case where Premium can win
   - a support/procurement platform case where Enterprise can win
