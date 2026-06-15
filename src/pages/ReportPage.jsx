import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
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
const CURRENT_CALIBRATION_VERSION = "heuristic-v1";

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
      window.localStorage.removeItem("simulationResult");
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

  return `${formatNumber(value, 0)}/100`;
}

function formatLevel(value) {
  if (!value) {
    return "Unclear";
  }

  return `${value[0].toUpperCase()}${value.slice(1)} fit`;
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

function getToneChipColor(level) {
  return {
    high: "success",
    medium: "warning",
    low: "default"
  }[level] ?? "default";
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

  return {
    topReasons,
    tradeoff,
    decidingSignals: [
      ...topReasons,
      ...(Array.isArray(winner.drags) && winner.drags.length > 0
        ? [`${winner.label} still carries: ${winner.drags[0]}`]
        : []),
      ...(Array.isArray(runnerUp.strengths) && runnerUp.strengths.length > 0
        ? [`Runner-up counterweight: ${runnerUp.strengths[0]}`]
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

function ScoreCard({
  title,
  score,
  level,
  highlighted = false,
  levelLabel,
  showLevelChip = true,
  children
}) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: 1,
        borderColor: highlighted ? "secondary.main" : "divider",
        bgcolor: highlighted ? "rgba(244,114,182,0.04)" : "background.paper"
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Typography variant="subtitle1" component="h3">
              {title}
            </Typography>
            <Chip size="small" label={formatScore(score)} color={highlighted ? "secondary" : "default"} />
          </Stack>
          <LinearProgress
            variant="determinate"
            value={clamp(Number(score) || 0, 0, 100)}
            sx={{ height: 10, borderRadius: 999, bgcolor: "action.hover" }}
          />
          {showLevelChip ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                size="small"
                label={levelLabel ?? formatLevel(level)}
                color={getToneChipColor(level)}
                variant="outlined"
              />
            </Stack>
          ) : null}
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

function FactorCard({ factor }) {
  return (
    <ScoreCard title={getFactorTitle(factor.key)} score={factor.score} level={factor.level}>
      <Stack spacing={1}>
        {(Array.isArray(factor.drivers) ? factor.drivers : []).slice(0, 3).map((driver) => (
          <Typography key={driver} variant="body2" color="text.secondary">
            {driver}
          </Typography>
        ))}
      </Stack>
    </ScoreCard>
  );
}

function PathCard({ path, winnerKey }) {
  return (
    <ScoreCard
      title={pathLabels[path.key] ?? path.label}
      score={path.score}
      level={path.level}
      highlighted={path.key === winnerKey}
    >
      <Stack spacing={1.25}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip size="small" label={path.level === "high" ? "Strong fit" : path.level === "medium" ? "Mixed fit" : "Low fit"} />
          {path.eligible === false ? <Chip size="small" label="Not eligible" variant="outlined" /> : null}
        </Stack>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Strengths
          </Typography>
          <Stack spacing={0.5}>
            {(Array.isArray(path.strengths) ? path.strengths : []).slice(0, 3).map((item) => (
              <Typography key={item} variant="body2" color="text.secondary">
                {item}
              </Typography>
            ))}
          </Stack>
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Drags
          </Typography>
          <Stack spacing={0.5}>
            {(Array.isArray(path.drags) ? path.drags : []).slice(0, 3).map((item) => (
              <Typography key={item} variant="body2" color="text.secondary">
                {item}
              </Typography>
            ))}
          </Stack>
        </Box>
      </Stack>
    </ScoreCard>
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
  const simulationResult = readStoredObject("simulationResult");
  const sourceMap = getPublicSourceMap([...PUBLIC_BENCHMARK_SOURCES, ...PUBLIC_SOURCES]);
  const inputChips = buildInputChips(assessmentInput);

  if (!simulationResult || !isCurrentResult(simulationResult)) {
    const staleSavedResult = Boolean(simulationResult);

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

  const recommendation = simulationResult.recommendation ?? {};
  const derivedFactors = simulationResult.derivedFactors ?? {};
  const pathFits = simulationResult.pathFits ?? {};
  const sensitivity = simulationResult.sensitivity ?? simulationResult.diagnostics?.sensitivity ?? {};
  const diagnostics = simulationResult.diagnostics ?? {};
  const rankedPaths = Object.values(pathFits)
    .filter(Boolean)
    .sort((left, right) => (right.score ?? 0) - (left.score ?? 0));
  const winner = pathFits[recommendation.key] ?? rankedPaths[0] ?? null;
  const runnerUp =
    pathFits[recommendation.runnerUp?.key] ?? rankedPaths.find((path) => path?.key !== winner?.key) ?? null;
  const winnerSignals = buildWinnerSignals(recommendation, winner ?? {}, runnerUp ?? {});
  const changeItems = buildChangeItems(recommendation.key, assessmentInput);
  const evidenceBasis = Array.isArray(diagnostics.evidenceBasis) ? diagnostics.evidenceBasis : [];
  const sourceChips = (simulationResult.publicSources ?? PUBLIC_BENCHMARK_SOURCES).map(
    (source) => source.shortLabel ?? source.title
  );
  const factorEntries = Object.entries({
    functionalComplexity: derivedFactors.functionalComplexity,
    qualityBurden: derivedFactors.qualityBurden,
    deliveryMaturity: derivedFactors.deliveryMaturity,
    ownershipBurden: derivedFactors.ownershipBurden,
    enterpriseReadiness: derivedFactors.enterpriseReadiness
  }).filter(([, factor]) => factor);
  const pathEntries = [
    ["build", pathFits.build],
    ["core", pathFits.core],
    ["premium", pathFits.premium],
    ["enterprise", pathFits.enterprise]
  ].filter(([, path]) => path);
  const topModelDrivers = Array.isArray(sensitivity.topDrivers) ? sensitivity.topDrivers : [];
  const buildFitDrivers = Array.isArray(sensitivity.buildFitDrivers) ? sensitivity.buildFitDrivers : [];
  const coreFitDrivers = Array.isArray(sensitivity.coreFitDrivers) ? sensitivity.coreFitDrivers : [];
  const premiumFitDrivers = Array.isArray(sensitivity.premiumFitDrivers) ? sensitivity.premiumFitDrivers : [];
  const enterpriseFitDrivers = Array.isArray(sensitivity.enterpriseFitDrivers) ? sensitivity.enterpriseFitDrivers : [];
  const recommendationDrivers = Array.isArray(sensitivity.recommendationDrivers)
    ? sensitivity.recommendationDrivers
    : [];

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
            <Card elevation={0} sx={{ height: "100%", border: 1, borderColor: "divider", bgcolor: "rgba(255,255,255,0.78)" }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={2.25}>
                  <Typography variant="overline" color="secondary.main">
                    Decision signal
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip
                      label={`Margin: ${formatNumber(recommendation.runnerUp?.scoreGap ?? 0, 0)} points`}
                      color="secondary"
                    />
                    <Chip label={`Runner-up: ${runnerUp?.label ?? "Not set"}`} variant="outlined" />
                    <Chip label={recommendation.option ?? "Recommendation unavailable"} variant="outlined" />
                  </Stack>
                  <Divider />
                  <Box>
                    <Typography variant="h4" component="div">
                      {formatNumber(recommendation.runnerUp?.scoreGap ?? 0, 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      points between the winner and the runner-up
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <SectionCard
        title="Recommendation"
        description="The report is recommendation-first. The headline answer comes before the supporting diagnostics."
      >
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Recommended path
              </Typography>
              <Typography variant="h4" component="div">
                {recommendation.option ?? "Not available"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {recommendation.summary ?? "No summary is available for this result."}
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Runner-up
              </Typography>
              <Typography variant="h4" component="div">
                {runnerUp?.label ?? "Not available"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Margin: {formatNumber(recommendation.runnerUp?.scoreGap ?? 0, 0)} points.
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider />
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Top reasons
              </Typography>
              {(Array.isArray(recommendation.primaryReasons) ? recommendation.primaryReasons : []).slice(0, 3).map((reason) => (
                <Typography key={reason} variant="body2" color="text.secondary">
                  {reason}
                </Typography>
              ))}
              {winnerSignals.topReasons.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  The backend did not provide a reason list for this result.
                </Typography>
              ) : null}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Tradeoff note
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {winnerSignals.tradeoff ?? "No tradeoff note is available for this result."}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard
        title="Input profile"
        description="The model compresses the raw assessment into five derived factors to keep the recommendation readable."
      >
        <Grid container spacing={2.5}>
          {factorEntries.map(([key, factor]) => (
            <Grid key={key} size={{ xs: 12, md: 6 }}>
              <FactorCard factor={{ ...factor, key }} />
            </Grid>
          ))}
        </Grid>
      </SectionCard>

      <SectionCard
        title="Path fit comparison"
        description="Each path is scored on the same input set. These are fit signals, not delivery or cost forecasts."
      >
        <Grid container spacing={2.5}>
          {pathEntries.map(([key, path]) => (
            <Grid key={key} size={{ xs: 12, md: 6 }}>
              <PathCard path={{ ...path, key }} winnerKey={winner?.key} />
            </Grid>
          ))}
        </Grid>
      </SectionCard>

      <SectionCard
        title="Why this path wins"
        description="This compares the winner with the runner-up and spells out the signals that decide the margin."
      >
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 4 }}>
            <ScoreCard title={winner?.label ?? "Winner"} score={winner?.score} level={winner?.level} highlighted>
              <Stack spacing={0.75}>
                <Typography variant="body2" color="text.secondary">
                  Winner score
                </Typography>
                <Typography variant="h6">{formatScore(winner?.score)}</Typography>
              </Stack>
            </ScoreCard>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <ScoreCard title={runnerUp?.label ?? "Runner-up"} score={runnerUp?.score} level={runnerUp?.level}>
              <Stack spacing={0.75}>
                <Typography variant="body2" color="text.secondary">
                  Runner-up score
                </Typography>
                <Typography variant="h6">{formatScore(runnerUp?.score)}</Typography>
              </Stack>
            </ScoreCard>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <ScoreCard
              title="Margin"
              score={recommendation.runnerUp?.scoreGap ?? 0}
              level={winner?.level}
              showLevelChip={false}
            >
              <Stack spacing={0.75}>
                <Typography variant="body2" color="text.secondary">
                  Score gap
                </Typography>
                <Typography variant="h6">
                  {formatNumber(recommendation.runnerUp?.scoreGap ?? 0, 0)}
                </Typography>
              </Stack>
            </ScoreCard>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Deciding signals
              </Typography>
              <Stack spacing={0.75}>
                {winnerSignals.decidingSignals.map((signal) => (
                  <Typography key={signal} variant="body2" color="text.secondary">
                    {signal}
                  </Typography>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </SectionCard>

      {topModelDrivers.length > 0 || buildFitDrivers.length > 0 || coreFitDrivers.length > 0 || premiumFitDrivers.length > 0 || enterpriseFitDrivers.length > 0 || recommendationDrivers.length > 0 ? (
        <SectionCard
          title="Sensitivity diagnostics"
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
        title="Benchmark-informed assumptions"
        description="Public sources inform which variables matter and how the risk direction is interpreted."
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
            Deterministic fit model.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No delivery-date estimate.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No cost estimate.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Scores are heuristic decision-support signals, not guarantees.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Public sources inform variable selection and risk direction.
          </Typography>
        </Stack>
      </SectionCard>

      <SectionCard
        title="Selected public sources"
        description="The report links the main evidence families used to steer variable choice and direction."
      >
        <Grid container spacing={2.5}>
          {PUBLIC_BENCHMARK_SOURCES.map((source) => (
            <Grid key={source.key} size={{ xs: 12, md: 6 }}>
              <SourceCard source={source} />
            </Grid>
          ))}
        </Grid>
      </SectionCard>

      <SectionCard
        title="Path scores"
        description="A compact view of all four path-fit scores."
      >
        <TableContainer sx={{ border: 1, borderColor: "divider", borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "background.default" }}>
                <TableCell>Path</TableCell>
                <TableCell align="right">Score</TableCell>
                <TableCell align="right">Level</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pathEntries.map(([key, path]) => (
                <TableRow key={key} hover>
                  <TableCell sx={{ fontWeight: key === winner?.key ? 700 : 400 }}>
                    {pathLabels[key] ?? path.label}
                  </TableCell>
                  <TableCell align="right">{formatScore(path.score)}</TableCell>
                  <TableCell align="right">{formatLevel(path.level)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </SectionCard>
    </Stack>
  );
}

export default ReportPage;
