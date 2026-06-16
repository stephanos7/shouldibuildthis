import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { NavLink } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import {
  PUBLIC_BENCHMARK_SOURCES,
  PUBLIC_SOURCES,
  getPublicSourceMap
} from "../data/publicSources.js";

const ASSESSMENT_INPUT_SCHEMA_VERSION = 2;
const CURRENT_MODEL_VERSION = "deterministic-fit-v2";
const CURRENT_CALIBRATION_VERSION = "heuristic-v2";

const optionLabelMaps = {
  existingMuiUsage: {
    none: "None",
    some: "Some usage",
    standardized: "Standardized"
  },
  designSystemMaturity: {
    low: "Low",
    medium: "Medium",
    high: "High"
  },
  knowledgeConcentration: {
    shared: "Shared across the team",
    "few-owners": "A few owners",
    "single-owner": "Mostly one owner",
    unknown: "Unknown"
  },
  designDevHandoffFriction: {
    low: "Low",
    medium: "Medium",
    high: "High",
    unknown: "Unknown"
  },
  componentStandardizationGoal: {
    none: "No standardization goal",
    "reduce-one-offs": "Reduce one-off components",
    "shared-pattern": "Shared pattern",
    "platform-standard": "Platform standard"
  },
  dependentTeams: {
    one: "One",
    "two-three": "Two to three",
    "four-seven": "Four to seven",
    "eight-plus": "Eight or more"
  },
  ownershipModel: {
    "same-product-team": "Same product team",
    "frontend-platform-team": "Frontend platform team",
    "several-teams-informal": "Several teams informally",
    unclear: "Unclear"
  },
  primaryUseCase: {
    "data-grid": "Data grid",
    charts: "Charts",
    "date-pickers": "Date pickers",
    "tree-view": "Tree view",
    scheduler: "Scheduler",
    "multi-component": "Multi-component evaluation"
  },
  accessibilityTarget: {
    none: "None",
    "wcag-a": "WCAG A",
    "wcag-aa": "WCAG AA",
    "wcag-aaa-regulated": "WCAG AAA / regulated"
  },
  changeLeadTime: {
    "less-than-day": "Less than a day",
    "one-day-to-one-week": "One day to one week",
    "one-week-to-one-month": "One week to one month",
    "more-than-month": "More than a month",
    unknown: "Unknown"
  },
  performanceSensitivity: {
    "not-critical": "Not critical",
    important: "Important",
    "strict-budget": "Strict performance budget",
    "measured-core-web-vitals-target": "Measured Core Web Vitals target"
  },
  reworkFrequency: {
    rare: "Rare",
    occasional: "Occasional",
    frequent: "Frequent",
    unknown: "Unknown"
  },
  deadlinePressure: {
    low: "Low",
    medium: "Medium",
    high: "High"
  },
  expectedRows: {
    "under-1k": "Under 1k",
    "1k-10k": "1k to 10k",
    "10k-100k": "10k to 100k",
    "over-100k": "Over 100k"
  },
  expectedColumns: {
    "under-10": "Under 10",
    "10-30": "10 to 30",
    "over-30": "Over 30"
  },
  ownershipHorizon: {
    12: "12 months",
    24: "24 months",
    36: "36 months"
  },
  supportRequirement: {
    community: "Community",
    standard: "Standard",
    priority: "Priority",
    "procurement-sla": "Procurement-backed SLA"
  },
  productionCriticality: {
    "internal-tool": "Internal tool",
    "customer-facing": "Customer-facing",
    "revenue-critical": "Revenue-critical",
    "regulated-or-sla-backed": "Regulated or SLA-backed"
  },
  advancedFeatures: {
    virtualization: "Virtualization at scale",
    "inline-editing": "Inline editing workflows",
    "server-side-data": "Server-side data operations",
    "keyboard-navigation": "Deep keyboard navigation",
    exporting: "Export or print requirements",
    "drag-and-drop": "Drag-and-drop interactions",
    "custom-rendering": "Complex custom cell or item rendering",
    "timezone-logic": "Timezone logic",
    "i18n-localization": "i18n and localization requirements"
  }
};

const factorLabels = {
  functionalComplexity: "Functional complexity",
  qualityBurden: "Quality burden",
  deliveryMaturity: "Delivery maturity",
  ownershipBurden: "Ownership burden",
  enterpriseReadiness: "Enterprise readiness"
};

const pathLabels = {
  build: "Build in-house fit",
  core: "MUI Core fit",
  premium: "MUI X Premium fit",
  enterprise: "MUI X Enterprise fit"
};

const metricDisplayConfig = {
  functionalComplexity: {
    type: "burden",
    label: "Functional complexity",
    noun: "scope complexity",
    helper:
      "Higher means the UI requirement creates more custom implementation surface."
  },
  qualityBurden: {
    type: "burden",
    label: "Quality burden",
    noun: "quality burden",
    helper:
      "Higher means more verification, accessibility, performance, or regression burden."
  },
  deliveryMaturity: {
    type: "strength",
    label: "Delivery maturity",
    noun: "delivery strength",
    helper:
      "Higher means the team context is stronger for absorbing delivery work."
  },
  ownershipBurden: {
    type: "burden",
    label: "Ownership burden",
    noun: "ownership burden",
    helper:
      "Higher means long-term coordination and maintenance are heavier."
  },
  enterpriseReadiness: {
    type: "contextual",
    label: "Enterprise readiness",
    noun: "enterprise readiness",
    helper:
      "Higher means vendor-backed support, standardization, or procurement context is more relevant."
  }
};

const sensitivityInputLabels = {
  frontendDevelopers: "Frontend developers",
  reactApps: "React apps",
  dependentTeams: "Dependent teams",
  ownershipModel: "Ownership model",
  existingMuiUsage: "Existing MUI usage",
  designSystemMaturity: "Design system maturity",
  primaryUseCase: "Primary use case",
  dataHeavyScreens: "Data-heavy screens",
  expectedRows: "Expected rows",
  expectedColumns: "Expected columns",
  advancedFeatures: "Advanced features",
  accessibilityTarget: "Accessibility target",
  changeLeadTime: "Change lead time",
  performanceSensitivity: "Performance sensitivity",
  reworkFrequency: "Rework frequency",
  knowledgeConcentration: "Knowledge concentration",
  designDevHandoffFriction: "Design-dev handoff friction",
  componentStandardizationGoal: "Component standardization goal",
  deadlinePressure: "Deadline pressure",
  ownershipHorizon: "Ownership horizon",
  supportRequirement: "Support requirement",
  productionCriticality: "Production criticality"
};

function readStoredObject(key) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);

    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function readStoredAssessmentInput() {
  const assessmentInput = readStoredObject("assessmentInput");

  if (!assessmentInput) {
    return null;
  }

  if (assessmentInput.assessmentSchemaVersion !== ASSESSMENT_INPUT_SCHEMA_VERSION) {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("assessmentInput");
      window.localStorage.removeItem("fitResult");
    }

    return null;
  }

  return assessmentInput;
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function formatLabel(group, value) {
  if (value === undefined || value === null || value === "") {
    return "Not set";
  }

  return optionLabelMaps[group]?.[value] ?? value;
}

function formatNumber(value, maximumFractionDigits = 1) {
  if (!Number.isFinite(value)) {
    return "N/A";
  }

  const maxFractionDigits = Number.isFinite(maximumFractionDigits)
    ? clamp(Math.floor(maximumFractionDigits), 0, 20)
    : 1;

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: maxFractionDigits === 0 ? 0 : value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: maxFractionDigits
  }).format(value);
}

function formatScore(value) {
  if (!Number.isFinite(value)) {
    return "N/A";
  }

  return `${formatNumber(value, 1)}/100`;
}

function getFactorTitle(factorKey) {
  return factorLabels[factorKey] ?? factorKey;
}

function getDriverTitle(driverKey) {
  return sensitivityInputLabels[driverKey] ?? driverKey;
}

function formatSensitivityDirection(direction) {
  const labels = {
    "increases-build-fit": "Increases build fit",
    "reduces-build-fit": "Reduces build fit",
    "increases-core-fit": "Increases Core fit",
    "increases-premium-fit": "Increases Premium fit",
    "increases-enterprise-fit": "Increases Enterprise fit",
    "reduces-selected-path-fit": "Reduces selected path fit",
    "increases-winner-margin": "Increases winner margin",
    "reduces-winner-margin": "Reduces winner margin",
    mixed: "Mixed effect"
  };

  return labels[direction] ?? direction;
}

function formatSignedDelta(value) {
  if (!Number.isFinite(value)) {
    return "N/A";
  }

  const rounded = formatNumber(value, 1);
  return `${value > 0 ? "+" : ""}${rounded}`;
}

function getDeltaChipColor(value) {
  if (value > 0) {
    return "success";
  }

  if (value < 0) {
    return "warning";
  }

  return "default";
}

function getChipColorForTone(tone) {
  return {
    success: "success",
    warning: "warning",
    error: "error",
    info: "info",
    secondary: "secondary",
    default: "default"
  }[tone] ?? "default";
}

function getMetricTone(metricType, level) {
  if (metricType === "strength") {
    return {
      high: "success",
      medium: "warning",
      low: "error"
    }[level] ?? "default";
  }

  if (metricType === "burden") {
    return {
      low: "success",
      medium: "warning",
      high: "error"
    }[level] ?? "default";
  }

  return {
    low: "default",
    medium: "warning",
    high: "info"
  }[level] ?? "default";
}

function getMetricDisplay(metricKey, score, level) {
  const config = metricDisplayConfig[metricKey] ?? {
    type: "contextual",
    label: metricKey,
    noun: metricKey,
    helper: ""
  };

  const levelLabel = {
    burden: {
      low: `Low ${config.noun}`,
      medium: `Medium ${config.noun}`,
      high: `High ${config.noun}`
    },
    strength: {
      low: `Low ${config.noun}`,
      medium: `Moderate ${config.noun}`,
      high: `High ${config.noun}`
    },
    contextual: {
      low: `Low ${config.noun}`,
      medium: `Medium ${config.noun}`,
      high: `High ${config.noun}`
    }
  }[config.type]?.[level] ?? `Unclear ${config.noun}`;

  return {
    key: metricKey,
    title: config.label,
    levelLabel,
    helper: config.helper,
    tone: getMetricTone(config.type, level),
    scoreLabel: `Model score: ${formatScore(score)}`
  };
}

function getPathFitDisplay(pathKey, score, level) {
  const levelLabel = {
    high: "Strong fit",
    medium: "Mixed fit",
    low: "Low fit"
  }[level] ?? "Unclear fit";

  const tone = {
    high: "success",
    medium: "warning",
    low: "default"
  }[level] ?? "default";

  return {
    key: pathKey,
    title: pathLabels[pathKey] ?? pathKey,
    levelLabel,
    tone,
    scoreLabel: formatScore(score)
  };
}

function getMarginLabel(scoreGap) {
  if (scoreGap < 5) {
    return "Close fit";
  }

  if (scoreGap < 10) {
    return "Moderate margin";
  }

  if (scoreGap < 20) {
    return "Clear margin";
  }

  return "Strong margin";
}

function getMarginDisplay(scoreGap, runnerUpLabel) {
  const gapValue = Number.isFinite(scoreGap) ? scoreGap : 0;
  const label = getMarginLabel(gapValue);

  return {
    label,
    tone:
      gapValue < 5 ? "default" : gapValue < 10 ? "warning" : gapValue < 20 ? "info" : "success",
    scoreLabel: `Margin: +${formatNumber(gapValue, 1)} over ${runnerUpLabel ?? "the runner-up"}`
  };
}

function buildInputChips(assessmentInput) {
  if (!assessmentInput) {
    return ["Saved result needs refresh"];
  }

  return [
    `Use case: ${formatLabel("primaryUseCase", assessmentInput.primaryUseCase)}`,
    `Rows: ${formatLabel("expectedRows", assessmentInput.expectedRows)}`,
    `Columns: ${formatLabel("expectedColumns", assessmentInput.expectedColumns)}`,
    `Ownership: ${formatLabel("ownershipModel", assessmentInput.ownershipModel)}`,
    `Support: ${formatLabel("supportRequirement", assessmentInput.supportRequirement)}`,
    `Criticality: ${formatLabel("productionCriticality", assessmentInput.productionCriticality)}`,
    `MUI usage: ${formatLabel("existingMuiUsage", assessmentInput.existingMuiUsage)}`,
    `Standardization: ${formatLabel(
      "componentStandardizationGoal",
      assessmentInput.componentStandardizationGoal
    )}`
  ].filter(Boolean);
}

function buildWinnerSignals(recommendation, winner, runnerUp) {
  const topReasons = Array.isArray(recommendation.primaryReasons)
    ? recommendation.primaryReasons.slice(0, 3)
    : [];
  const tradeoff = Array.isArray(recommendation.tradeoffs)
    ? recommendation.tradeoffs[0]
    : null;
  const winnerStrengths = Array.isArray(winner.strengths) ? winner.strengths.slice(0, 2) : [];
  const runnerUpCounterweights = Array.isArray(runnerUp.strengths)
    ? runnerUp.strengths.slice(0, 2)
    : [];

  return {
    topReasons,
    tradeoff,
    winnerStrengths,
    runnerUpCounterweights,
    decidingSignals: [
      ...topReasons,
      ...(Array.isArray(winner.drags) && winner.drags.length > 0
        ? [`${winner.label} still carries: ${winner.drags[0]}`]
        : []),
      ...(runnerUpCounterweights.length > 0
        ? [`Runner-up counterweight: ${runnerUpCounterweights[0]}`]
        : [])
    ].slice(0, 4)
  };
}

function buildChangeItems(recommendationKey, assessmentInput) {
  const useCase = formatLabel("primaryUseCase", assessmentInput?.primaryUseCase);
  const support = formatLabel("supportRequirement", assessmentInput?.supportRequirement);
  const criticality = formatLabel(
    "productionCriticality",
    assessmentInput?.productionCriticality
  );
  const ownership = formatLabel("ownershipModel", assessmentInput?.ownershipModel);
  const standardization = formatLabel(
    "componentStandardizationGoal",
    assessmentInput?.componentStandardizationGoal
  );

  if (recommendationKey === "build") {
    return [
      `If the ${useCase.toLowerCase()} scope grows more complex or adds more advanced behaviors, the packaged paths gain relative fit.`,
      `If support expectations rise above ${support} or operating pressure becomes more formal, vendor-backed options become more attractive.`,
      `If ownership becomes less stable than the current ${ownership} setup, internal build fit weakens.`
    ];
  }

  if (recommendationKey === "core") {
    return [
      `If feature demand expands beyond the current ${useCase.toLowerCase()} scope, Premium or Enterprise gains more relevance.`,
      `If the team standardizes more aggressively than the current ${standardization} goal, higher tiers gain more value.`,
      `If support needs rise above ${support} or criticality moves beyond ${criticality}, Core becomes less sufficient.`
    ];
  }

  if (recommendationKey === "premium") {
    return [
      `If support pressure moves beyond the current ${support} level, Enterprise can overtake Premium.`,
      `If the scope simplifies materially, Core may be enough for the same ${useCase.toLowerCase()} workload.`,
      `If the organization keeps more of the work inside the current ${ownership} model, Premium remains well aligned.`
    ];
  }

  return [
    `If support expectations fall below ${support} or criticality eases, Premium or Core can close some of the gap.`,
    `If standardization pressure drops from ${standardization}, Enterprise loses part of its advantage.`,
    `If the scope narrows materially from the current ${useCase.toLowerCase()} profile, a lighter path becomes more plausible.`
  ];
}

function isCurrentResult(result) {
  return Boolean(
    result &&
      result.modelVersion === CURRENT_MODEL_VERSION &&
      result.calibrationVersion === CURRENT_CALIBRATION_VERSION &&
      result.recommendation &&
      result.pathFits &&
      result.sensitivity
  );
}

function SectionCard({ title, description, children, action }) {
  return (
    <Card elevation={0} sx={{ height: "100%", border: 1, borderColor: "divider" }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Stack spacing={2.25}>
          <Box>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Box>
                <Typography variant="h5" component="h2">
                  {title}
                </Typography>
                {description ? (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 780 }}>
                    {description}
                  </Typography>
                ) : null}
              </Box>
              {action}
            </Stack>
          </Box>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

function ScoreMeter({ value, tone, ariaLabel, ariaValueText }) {
  const normalizedValue = clamp(Number(value) || 0, 0, 100);

  return (
    <Box
      role="meter"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(normalizedValue)}
      aria-valuetext={ariaValueText}
      sx={{ width: "100%" }}
    >
      <Box
        sx={{
          position: "relative",
          height: 14,
          borderRadius: 999,
          bgcolor: "action.hover",
          overflow: "hidden",
          border: 1,
          borderColor: "divider"
        }}
      >
        <Box
          sx={(theme) => ({
            position: "absolute",
            inset: 0,
            width: `${normalizedValue}%`,
            borderRadius: 999,
            background: {
              success: `linear-gradient(90deg, ${theme.palette.success.light}, ${theme.palette.success.main})`,
              warning: `linear-gradient(90deg, ${theme.palette.warning.light}, ${theme.palette.warning.main})`,
              error: `linear-gradient(90deg, ${theme.palette.error.light}, ${theme.palette.error.main})`,
              info: `linear-gradient(90deg, ${theme.palette.info.light}, ${theme.palette.info.main})`,
              secondary: `linear-gradient(90deg, ${theme.palette.secondary.light}, ${theme.palette.secondary.main})`,
              default: `linear-gradient(90deg, ${theme.palette.text.secondary}, ${theme.palette.text.primary})`
            }[tone] ?? theme.palette.text.secondary
          })}
        />
        {[33, 66].map((marker) => (
          <Box
            key={marker}
            aria-hidden="true"
            sx={{
              position: "absolute",
              top: -4,
              left: `${marker}%`,
              width: 1,
              height: 22,
              bgcolor: "divider",
              opacity: 0.8
            }}
          />
        ))}
      </Box>
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          0
        </Typography>
        <Typography variant="caption" color="text.secondary">
          33
        </Typography>
        <Typography variant="caption" color="text.secondary">
          66
        </Typography>
        <Typography variant="caption" color="text.secondary">
          100
        </Typography>
      </Stack>
    </Box>
  );
}

function MetricCard({ metricKey, factor }) {
  const display = getMetricDisplay(metricKey, factor.score, factor.level);

  return (
    <Card elevation={0} sx={{ height: "100%", border: 1, borderColor: "divider" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box>
              <Typography variant="subtitle1" component="h3">
                {display.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {display.helper}
              </Typography>
            </Box>
            <Chip
              size="small"
              label={formatScore(factor.score)}
              color={getChipColorForTone(display.tone)}
            />
          </Stack>
          <ScoreMeter
            value={factor.score}
            tone={display.tone}
            ariaLabel={`${display.title} model score`}
            ariaValueText={`${display.levelLabel}, ${formatScore(factor.score)}`}
          />
          <Stack spacing={0.5}>
            <Chip
              size="small"
              label={display.levelLabel}
              color={getChipColorForTone(display.tone)}
              variant="outlined"
              sx={{ alignSelf: "flex-start" }}
            />
            <Typography variant="body2" color="text.secondary">
              {display.scoreLabel}
            </Typography>
          </Stack>
          {(Array.isArray(factor.drivers) ? factor.drivers : []).slice(0, 3).map((driver) => (
            <Typography key={driver} variant="body2" color="text.secondary">
              {driver}
            </Typography>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

function PathFitCard({ path, rank, winnerKey, runnerUpKey, marginFromWinner }) {
  const display = getPathFitDisplay(path.key, path.score, path.level);

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: 1,
        borderColor: path.key === winnerKey ? "secondary.main" : "divider",
        bgcolor: path.key === winnerKey ? "rgba(124,58,237,0.04)" : "background.paper"
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 0.5 }}>
                <Chip size="small" label={`#${rank}`} variant="outlined" />
                {path.key === winnerKey ? (
                  <Chip size="small" label="Recommended" color="secondary" />
                ) : null}
                {path.key === runnerUpKey ? <Chip size="small" label="Runner-up" variant="outlined" /> : null}
                {path.eligible === false ? <Chip size="small" label="Not eligible" variant="outlined" /> : null}
              </Stack>
              <Typography variant="subtitle1" component="h3">
                {display.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {path.eligible === false
                  ? "This path is not eligible under the current input set."
                  : path.key === winnerKey
                    ? "This is the selected path."
                    : path.key === runnerUpKey
                      ? "This is the closest alternative."
                      : "This path remains in the comparison set."}
              </Typography>
            </Box>
            <Chip size="small" label={formatScore(path.score)} color={getChipColorForTone(display.tone)} />
          </Stack>
          <ScoreMeter
            value={path.score}
            tone={display.tone}
            ariaLabel={`${display.title} fit score`}
            ariaValueText={`${display.levelLabel}, ${formatScore(path.score)}`}
          />
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip size="small" label={display.levelLabel} color={getChipColorForTone(display.tone)} variant="outlined" />
            <Chip
              size="small"
              label={marginFromWinner === null ? "Margin: —" : `Margin: ${marginFromWinner}`}
              variant="outlined"
            />
          </Stack>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Main strengths
            </Typography>
            <Stack spacing={0.5}>
              {(Array.isArray(path.strengths) ? path.strengths : []).slice(0, 2).map((item) => (
                <Typography key={item} variant="body2" color="text.secondary">
                  {item}
                </Typography>
              ))}
            </Stack>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Main drags
            </Typography>
            <Stack spacing={0.5}>
              {(Array.isArray(path.drags) ? path.drags : []).slice(0, 2).map((item) => (
                <Typography key={item} variant="body2" color="text.secondary">
                  {item}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function RecommendationSignalCard({ recommendation, confidence, winner, runnerUp }) {
  const scoreGap = recommendation?.runnerUp?.scoreGap ?? 0;
  const marginDisplay = getMarginDisplay(scoreGap, runnerUp?.label);
  const confidenceLevel = confidence?.level ?? recommendation?.confidence?.level;
  const confidenceScore = confidence?.score ?? recommendation?.confidence?.score;
  const confidenceLabel = confidenceLevel
    ? `${confidenceLevel[0].toUpperCase()}${confidenceLevel.slice(1)}`
    : "Unknown";
  const confidenceRationale =
    confidence?.rationale ??
    recommendation?.confidence?.rationale ??
    "Confidence reflects the score gap and whether the main factor signals point in the same direction.";

  return (
    <Card elevation={0} sx={{ height: "100%", border: 1, borderColor: "divider", bgcolor: "rgba(255,255,255,0.78)" }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack spacing={2}>
          <Typography variant="overline" color="secondary.main">
            Recommendation signal
          </Typography>
          <Stack spacing={0.75}>
            <Typography variant="subtitle2" color="text.secondary">
              Recommendation
            </Typography>
            <Typography variant="h5" component="div">
              {recommendation?.option ?? "Not available"}
            </Typography>
          </Stack>
          <Stack spacing={0.75}>
            <Typography variant="subtitle2" color="text.secondary">
              Runner-up
            </Typography>
            <Typography variant="h6" component="div">
              {runnerUp?.label ?? "Not available"}
            </Typography>
          </Stack>
          <Stack spacing={0.75}>
            <Typography variant="subtitle2" color="text.secondary">
              Margin
            </Typography>
            <Typography variant="h6" component="div">
              {marginDisplay.scoreLabel}
            </Typography>
            <Chip
              size="small"
              label={marginDisplay.label}
              color={getChipColorForTone(marginDisplay.tone)}
              variant="outlined"
              sx={{ alignSelf: "flex-start" }}
            />
          </Stack>
          <Divider />
          <Stack spacing={0.75}>
            <Typography variant="subtitle2" color="text.secondary">
              Confidence
            </Typography>
            <Typography variant="body1">{confidenceLabel}</Typography>
            {Number.isFinite(confidenceScore) ? (
              <Typography variant="body2" color="text.secondary">
                Score: {formatNumber(confidenceScore, 0)}/100
              </Typography>
            ) : null}
            <Typography variant="body2" color="text.secondary">
              {confidenceRationale}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function SensitivityDriverCard({ driver, compact = false }) {
  const deltas = driver?.deltas ?? {};
  const visibleDeltas = compact
    ? [
        ["Build", deltas.buildFit],
        ["Core", deltas.coreFit],
        ["Margin", deltas.winnerMargin]
      ]
    : [
        ["Build", deltas.buildFit],
        ["Core", deltas.coreFit],
        ["Premium", deltas.premiumFit],
        ["Enterprise", deltas.enterpriseFit],
        ["Margin", deltas.winnerMargin]
      ];

  return (
    <Card elevation={0} sx={{ height: "100%", border: 1, borderColor: "divider" }}>
      <CardContent sx={{ p: compact ? 1.75 : 2.5 }}>
        <Stack spacing={compact ? 1.5 : 2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Typography variant={compact ? "subtitle2" : "subtitle1"} component="h3">
              {driver?.label ?? "Driver"}
            </Typography>
            <Chip size="small" label={getDriverTitle(driver?.inputKey ?? "input")} variant="outlined" />
          </Stack>
          <Stack spacing={0.75}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                size="small"
                label={driver?.testedChange ?? "Unknown change"}
                variant="outlined"
              />
              <Chip
                size="small"
                label={formatSensitivityDirection(driver?.direction)}
                color={driver?.direction === "mixed" ? "default" : "secondary"}
                variant="outlined"
              />
              {driver?.recommendationChanged ? (
                <Chip size="small" label="Recommendation changed" color="secondary" />
              ) : null}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {driver?.impactSummary ?? "No impact summary available."}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {visibleDeltas.map(([label, value]) => (
                <Chip
                  key={label}
                  size="small"
                  label={`${label} ${formatSignedDelta(value)}`}
                  color={getDeltaChipColor(value)}
                  variant="outlined"
                />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function SensitivityGroupCard({ title, drivers }) {
  const visibleDrivers = Array.isArray(drivers) ? drivers.slice(0, 2) : [];

  return (
    <Card elevation={0} sx={{ height: "100%", border: 1, borderColor: "divider" }}>
      <CardContent sx={{ p: 2.25 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle1" component="h3">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {visibleDrivers.length > 0
                ? `${visibleDrivers.length} adjacent perturbations`
                : "No material nearby changes"}
            </Typography>
          </Box>
          <Stack spacing={1.25}>
            {visibleDrivers.length > 0 ? (
              visibleDrivers.map((driver) => (
                <SensitivityDriverCard key={`${driver.inputKey}-${driver.testedChange}`} driver={driver} compact />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No adjacent perturbations produced a meaningful shift here.
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function EvidenceCard({ item, sourceMap }) {
  const sourceKeys = Array.isArray(item.sourceKeys) ? item.sourceKeys : [];
  const sources = sourceKeys.map((key) => sourceMap[key]).filter(Boolean);

  return (
    <Card elevation={0} sx={{ height: "100%", border: 1, borderColor: "divider" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={1.5}>
          <Box>
            <Typography variant="subtitle1" component="h3">
              {getFactorTitle(item.factor)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.basis}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {item.explanation}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {sources.length > 0 ? (
              sources.map((source) => (
                <Chip key={source.key} size="small" label={source.shortLabel ?? source.title} variant="outlined" />
              ))
            ) : (
              <Chip size="small" label="No external source" variant="outlined" />
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function SourceCard({ source }) {
  return (
    <Card elevation={0} sx={{ height: "100%", border: 1, borderColor: "divider" }}>
      <CardContent sx={{ p: 2.25 }}>
        <Stack spacing={1.25}>
          <Box>
            <Typography variant="subtitle1" component="h3">
              {source.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {source.publisher}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {(source.supports ?? []).join(", ")}
          </Typography>
          <Button component="a" href={source.url} target="_blank" rel="noreferrer" variant="text" sx={{ alignSelf: "flex-start" }}>
            Open source
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function ReportPage() {
  const assessmentInput = readStoredAssessmentInput();
  const fitResult = readStoredObject("fitResult");
  const sourceMap = getPublicSourceMap([...PUBLIC_BENCHMARK_SOURCES, ...PUBLIC_SOURCES]);
  const inputChips = buildInputChips(assessmentInput);

  if (!fitResult || !isCurrentResult(fitResult)) {
    const staleSavedResult = Boolean(fitResult);

    return (
      <Stack spacing={4}>
        <PageHero
          eyebrow="Report"
          title={staleSavedResult ? "Saved report needs refresh" : "No saved report found"}
          description={
            staleSavedResult
              ? "This saved result came from an older model version. Rerun the assessment to generate the current deterministic fit report."
              : "Run the assessment first so this route has a saved result to display."
          }
          chips={inputChips}
        />
        <Card elevation={0} sx={{ border: 1, borderColor: "divider" }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Stack spacing={2.5}>
              <Alert severity={staleSavedResult ? "warning" : "info"} variant="outlined">
                {staleSavedResult
                  ? "The stored result is not compatible with the current deterministic report."
                  : "No compatible report data is stored yet."}
              </Alert>
              <Typography variant="body2" color="text.secondary">
                Rerun the assessment to refresh local storage with the current result shape.
              </Typography>
              <Box>
                <Button component={NavLink} to="/assess" variant="contained">
                  Rerun assessment
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    );
  }

  const recommendation = fitResult.recommendation ?? {};
  const derivedFactors = fitResult.derivedFactors ?? {};
  const pathFits = fitResult.pathFits ?? {};
  const sensitivity = fitResult.sensitivity ?? fitResult.diagnostics?.sensitivity ?? {};
  const diagnostics = fitResult.diagnostics ?? {};
  const activeCalibration = fitResult.activeCalibration ?? {};
  const hasCustomCalibration = Boolean(activeCalibration.hasOverrides);
  const rankedPaths = Object.values(pathFits)
    .filter(Boolean)
    .sort((left, right) => (right.score ?? 0) - (left.score ?? 0));
  const winner = pathFits[recommendation.key] ?? rankedPaths[0] ?? null;
  const runnerUp =
    pathFits[recommendation.runnerUp?.key] ?? rankedPaths.find((path) => path?.key !== winner?.key) ?? null;
  const winnerSignals = buildWinnerSignals(recommendation, winner ?? {}, runnerUp ?? {});
  const changeItems = buildChangeItems(recommendation.key, assessmentInput);
  const evidenceBasis = Array.isArray(diagnostics.evidenceBasis) ? diagnostics.evidenceBasis : [];
  const sourceChips = (fitResult.publicSources ?? PUBLIC_BENCHMARK_SOURCES).map(
    (source) => source.shortLabel ?? source.title
  );
  const factorEntries = Object.entries({
    functionalComplexity: derivedFactors.functionalComplexity,
    qualityBurden: derivedFactors.qualityBurden,
    deliveryMaturity: derivedFactors.deliveryMaturity,
    ownershipBurden: derivedFactors.ownershipBurden,
    enterpriseReadiness: derivedFactors.enterpriseReadiness
  }).filter(([, factor]) => factor);
  const rankedPathEntries = rankedPaths.map((path) => [path.key, path]);
  const topModelDrivers = Array.isArray(sensitivity.topDrivers) ? sensitivity.topDrivers : [];
  const buildFitDrivers = Array.isArray(sensitivity.buildFitDrivers) ? sensitivity.buildFitDrivers : [];
  const coreFitDrivers = Array.isArray(sensitivity.coreFitDrivers) ? sensitivity.coreFitDrivers : [];
  const premiumFitDrivers = Array.isArray(sensitivity.premiumFitDrivers) ? sensitivity.premiumFitDrivers : [];
  const enterpriseFitDrivers = Array.isArray(sensitivity.enterpriseFitDrivers) ? sensitivity.enterpriseFitDrivers : [];
  const recommendationDrivers = Array.isArray(sensitivity.recommendationDrivers)
    ? sensitivity.recommendationDrivers
    : [];
  const winnerScore = winner?.score ?? 0;
  const runnerUpScore = runnerUp?.score ?? 0;
  const winnerGap = Number.isFinite(recommendation.runnerUp?.scoreGap)
    ? recommendation.runnerUp.scoreGap
    : clamp(winnerScore - runnerUpScore, 0, 100);
  const topWinnerStrengths = winnerSignals.winnerStrengths.slice(0, 2);
  const topRunnerUpCounterweights = winnerSignals.runnerUpCounterweights.slice(0, 2);

  return (
    <Stack spacing={4}>
      <Box
        sx={{
          borderRadius: 4,
          p: { xs: 3, md: 4 },
          border: 1,
          borderColor: "divider",
          background:
            "linear-gradient(135deg, rgba(20,83,45,0.10), rgba(255,255,255,0.96) 50%, rgba(180,83,9,0.09))"
        }}
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={3}>
              <PageHero
                eyebrow="1. Recommendation"
                title={recommendation.option ?? "Recommendation unavailable"}
                description={
                  recommendation.summary ??
                  "The current result did not include a recommendation summary."
                }
                chips={inputChips}
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button component={NavLink} to="/assess" variant="contained">
                  Rerun assessment
                </Button>
                <Button component={NavLink} to="/methodology" variant="outlined">
                  Review methodology
                </Button>
              </Stack>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <RecommendationSignalCard
              recommendation={recommendation}
              confidence={fitResult.confidence ?? {}}
              winner={winner ?? {}}
              runnerUp={runnerUp ?? {}}
            />
          </Grid>
        </Grid>
      </Box>

      {hasCustomCalibration ? (
        <Alert severity="info" variant="outlined">
          Custom calibration active
        </Alert>
      ) : null}

      <SectionCard
        title="Path fit comparison"
        description="The paths are ranked by deterministic fit score so the winner and nearest alternative are obvious."
      >
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <Stack spacing={2.25}>
            {rankedPathEntries.map(([key, path], index) => (
              <PathFitCard
                key={key}
                path={{ ...path, key }}
                rank={index + 1}
                winnerKey={winner?.key}
                runnerUpKey={runnerUp?.key}
                marginFromWinner={index === 0 ? null : formatSignedDelta((path?.score ?? 0) - winnerScore)}
              />
            ))}
          </Stack>
        </Box>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <TableContainer sx={{ border: 1, borderColor: "divider", borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "background.default" }}>
                  <TableCell>Rank</TableCell>
                  <TableCell>Path</TableCell>
                  <TableCell align="right">Fit score</TableCell>
                  <TableCell align="right">Margin from winner</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Main strengths</TableCell>
                  <TableCell>Main drags</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rankedPathEntries.map(([key, path], index) => {
                  const isWinner = path?.key === winner?.key;
                  const isRunnerUp = path?.key === runnerUp?.key;
                  const margin = index === 0 ? "—" : formatSignedDelta((path?.score ?? 0) - winnerScore);

                  return (
                    <TableRow
                      key={key}
                      hover
                      sx={{
                        bgcolor: isWinner ? "rgba(124,58,237,0.04)" : "inherit"
                      }}
                    >
                      <TableCell sx={{ fontWeight: isWinner ? 700 : 400 }}>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: isWinner ? 700 : 400 }}>
                        {pathLabels[key] ?? path.label}
                      </TableCell>
                      <TableCell align="right">{formatScore(path.score)}</TableCell>
                      <TableCell align="right">{margin}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {isWinner ? <Chip size="small" label="Recommended" color="secondary" /> : null}
                          {isRunnerUp ? <Chip size="small" label="Runner-up" variant="outlined" /> : null}
                          {path.eligible === false ? <Chip size="small" label="Not eligible" variant="outlined" /> : null}
                          {!isWinner && !isRunnerUp && path.eligible !== false ? (
                            <Chip size="small" label="Eligible" variant="outlined" />
                          ) : null}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          {(Array.isArray(path.strengths) ? path.strengths : []).slice(0, 2).map((item) => (
                            <Typography key={item} variant="body2" color="text.secondary">
                              {item}
                            </Typography>
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          {(Array.isArray(path.drags) ? path.drags : []).slice(0, 2).map((item) => (
                            <Typography key={item} variant="body2" color="text.secondary">
                              {item}
                            </Typography>
                          ))}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </SectionCard>

      <SectionCard
        title="Input profile"
        description="The model compresses the raw assessment into five derived factors to keep the recommendation readable."
      >
        <Grid container spacing={2.5}>
          {factorEntries.map(([key, factor]) => (
            <Grid key={key} size={{ xs: 12, md: 6 }}>
              <MetricCard metricKey={key} factor={{ ...factor, key }} />
            </Grid>
          ))}
        </Grid>
      </SectionCard>

      <SectionCard
        title="Why this path wins"
        description="This compares the winner with the runner-up and spells out the signals that decide the margin."
      >
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Winner vs runner-up
              </Typography>
              <Typography variant="h5" component="div">
                {winner?.label ?? "Not available"} leads {runnerUp?.label ?? "the runner-up"} by{" "}
                {formatNumber(winnerGap, 1)} points.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {winner?.label ?? "The selected path"} wins because the strongest signals point in the same
                direction and the runner-up still leaves some of the same work unresolved.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {winnerSignals.tradeoff ?? "No tradeoff note is available for this result."}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Winner strengths
              </Typography>
              <Stack spacing={0.75}>
                {topWinnerStrengths.length > 0 ? (
                  topWinnerStrengths.map((item) => (
                    <Typography key={item} variant="body2" color="text.secondary">
                      {item}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No winner strength list is available.
                  </Typography>
                )}
              </Stack>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Runner-up counterweights
              </Typography>
              <Stack spacing={0.75}>
                {topRunnerUpCounterweights.length > 0 ? (
                  topRunnerUpCounterweights.map((item) => (
                    <Typography key={item} variant="body2" color="text.secondary">
                      {item}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No runner-up counterweights are available.
                  </Typography>
                )}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </SectionCard>

      {topModelDrivers.length > 0 || buildFitDrivers.length > 0 || coreFitDrivers.length > 0 || premiumFitDrivers.length > 0 || enterpriseFitDrivers.length > 0 || recommendationDrivers.length > 0 ? (
        <SectionCard
          title="Key model drivers"
          description="Nearby input changes show how the deterministic path-fit scores and recommendation margin move."
        >
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Top model drivers
              </Typography>
              <Grid container spacing={2.5}>
                {topModelDrivers.slice(0, 4).map((driver) => (
                  <Grid key={`${driver.inputKey}-${driver.testedChange}`} size={{ xs: 12, md: 6 }}>
                    <SensitivityDriverCard driver={driver} />
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Path-fit drivers
              </Typography>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <SensitivityGroupCard title="Build in-house fit" drivers={buildFitDrivers} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <SensitivityGroupCard title="MUI Core fit" drivers={coreFitDrivers} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <SensitivityGroupCard title="MUI X Premium fit" drivers={premiumFitDrivers} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <SensitivityGroupCard title="MUI X Enterprise fit" drivers={enterpriseFitDrivers} />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Recommendation-margin drivers
              </Typography>
              <Grid container spacing={2.5}>
                {recommendationDrivers.slice(0, 4).map((driver) => (
                  <Grid key={`${driver.inputKey}-${driver.testedChange}`} size={{ xs: 12, md: 6 }}>
                    <SensitivityDriverCard driver={driver} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Stack>
        </SectionCard>
      ) : null}

      <SectionCard
        title="Assumptions"
        description="These guardrails make the report explicit about what the model does and does not do."
        action={
          <Button component={NavLink} to="/assess" variant="contained">
            Rerun assessment
          </Button>
        }
      >
        <Stack spacing={1.25}>
          <Typography variant="body2" color="text.secondary">
            This is a deterministic fit model.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Scores are heuristic decision-support signals.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            A score of 100 means the model reached the top of its configured scale, not a guarantee or perfect real-world condition.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Path-fit scores are relative signals for this input set.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Public sources inform variable selection and risk direction.
          </Typography>
        </Stack>
      </SectionCard>

      <SectionCard
        title="What would change the recommendation"
        description="These shifts would move the result, even if they do not guarantee a flip."
      >
        <Stack spacing={1.25}>
          {changeItems.map((item) => (
            <Typography key={item} variant="body2" color="text.secondary">
              {item}
            </Typography>
          ))}
        </Stack>
      </SectionCard>

      <SectionCard
        title="Selected public sources"
        description="The report links the main evidence families used to steer variable choice and direction."
      >
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {sourceChips.map((chip) => (
              <Chip key={chip} label={chip} size="small" variant="outlined" />
            ))}
          </Stack>
          <Grid container spacing={2.5}>
            {evidenceBasis.map((item) => (
              <Grid key={item.factor} size={{ xs: 12, md: 6 }}>
                <EvidenceCard item={item} sourceMap={sourceMap} />
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={2.5}>
            {PUBLIC_BENCHMARK_SOURCES.map((source) => (
              <Grid key={source.key} size={{ xs: 12, md: 6 }}>
                <SourceCard source={source} />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </SectionCard>
    </Stack>
  );
}

export default ReportPage;
