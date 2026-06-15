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
const CURRENT_MODEL_VERSION = "deterministic-fit-v1";
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

const driverLabels = {
  internalAbsorption: "Internal absorption",
  buildReuseLeverage: "Build reuse leverage",
  muiLeverage: "MUI leverage",
  muiAdoptionBurden: "MUI adoption burden",
  downsideTailRisk: "Downside tail risk",
  performancePressure: "Performance pressure",
  muiPerformanceReadiness: "MUI performance readiness",
  muiPerformanceBurden: "MUI performance burden",
  buildPerformanceReadiness: "Build performance readiness",
  buildPerformanceBurden: "Build performance burden"
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

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits
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

function formatConfidenceLevel(value) {
  if (!value) {
    return "Unclear confidence";
  }

  return `${value[0].toUpperCase()}${value.slice(1)} confidence`;
}

function getFactorTitle(factorKey) {
  return factorLabels[factorKey] ?? factorKey;
}

function getDriverTitle(driverKey) {
  return driverLabels[driverKey] ?? driverKey;
}

function getToneColor(level) {
  return {
    high: "success.main",
    medium: "warning.main",
    low: "text.disabled"
  }[level] ?? "text.secondary";
}

function getToneChipColor(level) {
  return {
    high: "success",
    medium: "warning",
    low: "default"
  }[level] ?? "default";
}

function getConfidenceChipColor(level) {
  return {
    high: "success",
    moderate: "warning",
    qualified: "default"
  }[level] ?? "default";
}

function getPathTone(pathKey, winnerKey) {
  return pathKey === winnerKey ? "secondary.main" : "divider";
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
      result.confidence
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

function ScoreCard({ title, score, level, highlighted = false, levelLabel, children }) {
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
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              size="small"
              label={levelLabel ?? formatLevel(level)}
              color={getToneChipColor(level)}
              variant="outlined"
            />
          </Stack>
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

function DriverCard({ title, score, level, drivers }) {
  return (
    <Card elevation={0} sx={{ height: "100%", border: 1, borderColor: "divider" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Typography variant="subtitle1" component="h3">
              {title}
            </Typography>
            <Chip size="small" label={formatScore(score * 100)} color={getToneChipColor(level)} />
          </Stack>
          <Typography variant="body2" sx={{ color: getToneColor(level) }}>
            {formatLevel(level)}
          </Typography>
          <Stack spacing={0.75}>
            {(Array.isArray(drivers) ? drivers : []).slice(0, 2).map((driver) => (
              <Typography key={driver} variant="body2" color="text.secondary">
                {driver}
              </Typography>
            ))}
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
  const confidence = simulationResult.confidence ?? {};
  const derivedFactors = simulationResult.derivedFactors ?? {};
  const pathFits = simulationResult.pathFits ?? {};
  const diagnostics = simulationResult.diagnostics ?? {};
  const rankedPaths = Object.values(pathFits)
    .filter(Boolean)
    .sort((left, right) => (right.score ?? 0) - (left.score ?? 0));
  const winner = pathFits[recommendation.key] ?? rankedPaths[0] ?? null;
  const runnerUp =
    pathFits[recommendation.runnerUp?.key] ?? rankedPaths.find((path) => path?.key !== winner?.key) ?? null;
  const winnerSignals = buildWinnerSignals(recommendation, winner ?? {}, runnerUp ?? {});
  const changeItems = buildChangeItems(recommendation.key, assessmentInput);
  const scenarioLevers = diagnostics.scenarioLevers ?? {};
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
  const leverEntries = Object.entries(scenarioLevers)
    .filter(([, lever]) => lever && Number.isFinite(Number(lever.score)))
    .sort((left, right) => Number(right[1].score) - Number(left[1].score))
    .slice(0, 6);

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
                    <Chip label={`Confidence: ${formatNumber(confidence.score ?? NaN, 0)}/100`} color="secondary" />
                    <Chip
                      label={formatConfidenceLevel(confidence.level)}
                      color={getConfidenceChipColor(confidence.level)}
                      variant="outlined"
                    />
                    <Chip label={`Runner-up: ${runnerUp?.label ?? "Not set"}`} variant="outlined" />
                  </Stack>
                  <Divider />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Score gap
                    </Typography>
                    <Typography variant="h4" component="div">
                      {formatNumber(recommendation.runnerUp?.scoreGap ?? confidence.components?.scoreGap ?? 0, 0)}
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
                Margin: {formatNumber(recommendation.runnerUp?.scoreGap ?? confidence.components?.scoreGap ?? 0, 0)} points.
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
              score={recommendation.runnerUp?.scoreGap ?? confidence.components?.scoreGap}
              level={confidence.level}
              levelLabel={formatConfidenceLevel(confidence.level)}
            >
              <Stack spacing={0.75}>
                <Typography variant="body2" color="text.secondary">
                  Score gap
                </Typography>
                <Typography variant="h6">
                  {formatNumber(recommendation.runnerUp?.scoreGap ?? confidence.components?.scoreGap ?? 0, 0)}
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

      {leverEntries.length > 0 ? (
        <SectionCard
          title="Key decision drivers"
          description="These are the deterministic driver diagnostics the model exposes for the winning result."
        >
          <Grid container spacing={2.5}>
            {leverEntries.map(([key, lever]) => (
              <Grid key={key} size={{ xs: 12, md: 6 }}>
                <DriverCard
                  title={getDriverTitle(key)}
                  score={Number(lever.score) || 0}
                  level={lever.level}
                  drivers={lever.drivers}
                />
              </Grid>
            ))}
          </Grid>
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
