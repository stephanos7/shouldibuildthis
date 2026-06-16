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

`INPUT_CALIBRATION_REGISTRY` is sales-facing metadata for assessment inputs.
It describes editable defaults such as option ordering, business-language
impact direction, impact strength, and which stable artifacts each input
matters to.

`businessCalibrationProfile.inputImpacts` is the sales-facing routing layer.
Admins edit impact direction and strength in business terms, then the compiler
translates supported routes into `calibrationOverrides`.

`INPUT_CALIBRATION_REGISTRY` does not replace `MODEL_IMPACT_MAP`.
`MODEL_IMPACT_MAP` remains the model-facing relationship map for the active
deterministic runtime.

`DERIVED_FACTOR_CONTRIBUTIONS` controls executable derived-factor routing.
`MODEL_IMPACT_MAP` remains the audit and explanation map.

## Sales-facing calibration

Sales users edit a business calibration profile, not raw model coefficients.

The profile supports:

- ordered input scale positions,
- input impact direction and strength,
- path signal ranking,
- scenario preview.

## Compilation flow

business profile
→ compiler
→ calibration overrides
→ deterministic model
→ report

## Input scales

Input scales define how assessment options map to normalized model intensity.

Ordered input scales use continuous option positions from 0 to 100.

Support requirement is one input scale among many. It should not be documented as a special first-class admin control.

## Input impact matrix

The input impact matrix defines where each input matters and whether it helps, hurts, is contextual, or has no impact.

## Derived factor contributions

`DERIVED_FACTOR_CONTRIBUTIONS` is executable routing/config for selected input-to-derived-factor relationships.

## Model impact map

`MODEL_IMPACT_MAP` is not replaced by `DERIVED_FACTOR_CONTRIBUTIONS`.

It remains the explainability and audit layer across:

- inputs,
- derived factors,
- scenario levers,
- path fits,
- recommendation,
- report explanation.

The intended future split is:

- `INPUT_CALIBRATION_REGISTRY` feeds the admin UI and future compiler.
- `businessCalibrationProfile.inputImpacts` stores business-facing routing decisions.
- `businessCalibrationCompiler` converts supported business routes into runtime derived-factor contribution overrides and diagnostics.
- `MODEL_IMPACT_MAP` continues to explain runtime relationships and calibration traceability.
- `CALIBRATION` continues to own live numeric scoring behavior until a compiler replaces direct runtime wiring.

## Path priorities

Path priorities let sales reorder positive and drag signals per path.

The compiler converts rankings into normalized shares.

The UI should use:

- Helps this path
- Drags on this path

The internal configuration should use:

- `positiveSignals`
- `dragSignals`

## Calibration admin

The calibration editor lives at `/admin/calibration`.

It edits local browser overrides only:

- admin changes update `businessCalibrationProfile`
- supported business routes compile into `calibrationOverrides`
- overrides are stored in `localStorage`
- overrides are included in assessment requests
- overrides are not persisted server-side
- overrides are for demo and admin calibration only

The admin editor validates the draft before save or preview and shows:

- `Valid`
- `Warnings`
- `Errors`

Warnings can be acknowledged so admins can keep experimenting without hiding the model issues.

## Scenario preview

Every calibration change should be reviewed against golden scenarios before relying on it.

## Admin UI standards

The admin UI is for sales users, not model engineers.

Use business language.

Use:

- cards,
- accordions,
- sliders with labelled marks,
- toggle button groups,
- accessible move-up/move-down ranking controls,
- explicit preview buttons,
- clear validation alerts,
- simple tables for score deltas.

Avoid:

- raw coefficient tables as the primary UI,
- DataGrid for simple configuration screens,
- drag-and-drop dependencies,
- chart libraries,
- auto-running simulations on every slider or ranking change,
- color-only status indicators.

MUI conventions:

- use Stack, Box, Grid, Card, Accordion, Slider, ToggleButtonGroup, Table, Alert, and Chip;
- label every Slider and ToggleButtonGroup;
- provide getAriaValueText for sliders;
- use text plus color for status;
- keep mobile layout single-column where possible;
- use Button/IconButton for ranking movement;
- do not add dependencies for UI patterns MUI can already cover.

React conventions:

- keep profile state controlled;
- compile on save or preview, not on every render;
- avoid firing scenario previews from useEffect after every input change;
- keep localStorage read/write behind storage helpers;
- keep admin components small and focused.

## Calibration validation

Validation should check:

- ordered input positions are non-decreasing,
- impact strengths are finite 0..100,
- directions are valid,
- share groups compile to valid shares,
- score bands are ordered,
- override paths are known,
- model impact map refs still resolve where possible.

Errors block preview/save.

Warnings should be visible but do not always need to block experimentation.

## Calibration levels

Calibration is tuned in three layers:

1. Input scales
2. Budgets and shares
3. Policies and thresholds

Budget means the maximum score influence of a local group.

Share means the relative split inside that local group.

Policy means a decision boundary or eligibility rule.

Guidance for tuning:

- change shares to reorder importance within a path
- change budgets to alter total influence
- change thresholds to move decision gates
- validate changes against the golden scenarios before saving

Avoid these mistakes:

- comparing shares across unrelated groups
- assuming weights are benchmark-derived
- tuning from one scenario only

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

Internally, each path now calibrates component impact with:

- `baseScore`
- `positiveBudget`
- `dragBudget`
- `positiveSignals`
- `dragSignals`

Signal shares are only comparable within their local positive or drag group.
The runtime normalizes those shares before converting them into absolute
0 to 100 score influence. Report-level `strengths` and `drags` remain derived
summaries of the calibrated component list.

These are fit signals, not delivery or cost estimates.

## Score display semantics

The report distinguishes input-profile metrics from path-fit metrics.

Input-profile metrics use factor-specific labels such as `Low quality burden`
or `High delivery strength`. Path-fit metrics use `Strong fit`, `Mixed fit`,
or `Low fit`.

Numeric scores remain visible because they help calibration and show movement
within a band, but the qualitative label carries the user-facing interpretation.

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

Recent note:

- Path-fit calibration now uses normalized positive/drag budgets across Build, Core, Premium, and Enterprise. Exact recommendations may shift slightly at the margins because component impacts are now constrained to explicit per-path budgets instead of mixed raw multipliers.
