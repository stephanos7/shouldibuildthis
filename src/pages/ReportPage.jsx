import {
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
  primaryUseCase: {
    "data-grid": "Data grid",
    charts: "Charts",
    "date-pickers": "Date pickers",
    "tree-view": "Tree view",
    scheduler: "Scheduler",
    "multi-component": "Multi-component evaluation"
  },
  deadlinePressure: {
    low: "Low",
    medium: "Medium",
    high: "High"
  },
  internalCapacity: {
    constrained: "Constrained",
    manageable: "Manageable",
    ample: "Ample"
  },
  delayImpact: {
    low: "Low",
    medium: "Medium",
    high: "High"
  },
  accessibilityStrictness: {
    low: "Low",
    medium: "Medium",
    high: "High"
  },
  maintenanceHorizonMonths: {
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
  turnoverRisk: {
    low: "Low",
    medium: "Medium",
    high: "High"
  },
  comparedMuiPlan: {
    premium: "Premium",
    enterprise: "Enterprise",
    auto: "Auto-select later"
  },
  advancedFeatures: {
    virtualization: "Virtualization at scale",
    "inline-editing": "Inline editing workflows",
    "server-side-data": "Server-side data operations",
    "keyboard-navigation": "Deep keyboard navigation",
    exporting: "Export or print requirements",
    "drag-and-drop": "Drag-and-drop interactions",
    "custom-rendering": "Complex custom cell or item rendering",
    "timezone-logic": "Timezone and localization logic"
  }
};

const useCaseWeightMap = {
  "data-grid": 18,
  charts: 10,
  "date-pickers": 8,
  "tree-view": 12,
  scheduler: 20,
  "multi-component": 18
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

function formatProbability(value) {
  if (!Number.isFinite(value)) {
    return "N/A";
  }

  return `${Math.round(value)}%`;
}

function formatWeeks(value) {
  if (!Number.isFinite(value)) {
    return "N/A";
  }

  return `${formatNumber(value)} weeks`;
}

function formatCurrency(value) {
  if (!Number.isFinite(value)) {
    return "N/A";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 0
  }).format(value);
}

function formatSignedWeeks(value) {
  if (!Number.isFinite(value) || value === 0) {
    return "about even";
  }

  const direction = value < 0 ? "faster" : "slower";

  return `${formatNumber(Math.abs(value))} weeks ${direction}`;
}

function formatSignedCurrency(value) {
  if (!Number.isFinite(value) || value === 0) {
    return "about even";
  }

  const direction = value < 0 ? "lower" : "higher";

  return `${formatCurrency(Math.abs(value))} ${direction}`;
}

function summarizeAdvancedFeatures(features) {
  if (!Array.isArray(features) || features.length === 0) {
    return "no additional advanced behaviors selected";
  }

  const labels = features.map((feature) => formatLabel("advancedFeatures", feature));

  if (labels.length === 1) {
    return labels[0];
  }

  if (labels.length === 2) {
    return `${labels[0]} and ${labels[1]}`;
  }

  return `${labels[0]}, ${labels[1]}, and ${labels.length - 2} more`;
}

function buildProbabilityMetrics(result) {
  const comparison = result.comparison ?? {};
  const muiLabel = result.muiPath?.label ?? "Selected MUI path";

  return [
    {
      title: `${muiLabel} lands sooner`,
      value: comparison.probabilityMuiFaster,
      detail: `In about ${formatProbability(comparison.probabilityMuiFaster)} of modeled scenarios, the packaged path ships before an in-house build.`
    },
    {
      title: `${muiLabel} has lower modeled TCO`,
      value: comparison.probabilityMuiLowerTco,
      detail: `Cost is supporting evidence only, but the packaged path still comes in lower in about ${formatProbability(comparison.probabilityMuiLowerTco)} of scenarios.`
    },
    {
      title: "In-house build exceeds 20 weeks",
      value: comparison.probabilityBuildExceeds20Weeks,
      detail: `This is the long-tail schedule risk for the custom build path under the stated capacity and pressure inputs.`
    },
    {
      title: `${muiLabel} exceeds 20 weeks`,
      value: comparison.probabilityMuiExceeds20Weeks,
      detail: `This shows how much schedule overrun risk remains even with the packaged path.`
    }
  ];
}

function buildRiskDrivers(result, assessmentInput) {
  const comparison = result.comparison ?? {};
  const advancedFeatureCount = Array.isArray(assessmentInput?.advancedFeatures)
    ? assessmentInput.advancedFeatures.length
    : 0;
  const dataHeavyScreens = Number(assessmentInput?.dataHeavyScreens) || 0;
  const supportRequirement = assessmentInput?.supportRequirement;
  const maintenanceHorizonMonths = Number(assessmentInput?.maintenanceHorizonMonths) || 0;
  const reactApps = Number(assessmentInput?.reactApps) || 0;
  const frontendDevelopers = Number(assessmentInput?.frontendDevelopers) || 0;
  const deadlinePressure = assessmentInput?.deadlinePressure;
  const internalCapacity = assessmentInput?.internalCapacity;
  const delayImpact = assessmentInput?.delayImpact;
  const turnoverRisk = assessmentInput?.turnoverRisk;
  const existingMuiUsage = assessmentInput?.existingMuiUsage;
  const primaryUseCase = assessmentInput?.primaryUseCase;

  const advancedScopeScore = clamp(
    advancedFeatureCount * 14 +
      Math.min(dataHeavyScreens, 10) * 3 +
      (useCaseWeightMap[primaryUseCase] ?? 10) +
      (result.icpFit?.score ?? 0) * 0.2,
    0,
    100
  );
  const scheduleRiskScore = clamp(
    (comparison.probabilityBuildExceeds20Weeks ?? 0) * 0.8 -
      (comparison.probabilityMuiExceeds20Weeks ?? 0) * 0.3 +
      (deadlinePressure === "high" ? 18 : deadlinePressure === "medium" ? 10 : 0) +
      (delayImpact === "high" ? 16 : delayImpact === "medium" ? 8 : 0) +
      (internalCapacity === "constrained" ? 18 : internalCapacity === "manageable" ? 8 : 0),
    0,
    100
  );
  const supportScore = clamp(
    (supportRequirement === "procurement-sla"
      ? 48
      : supportRequirement === "priority"
        ? 36
        : supportRequirement === "standard"
          ? 20
          : 8) +
      (assessmentInput?.accessibilityStrictness === "high"
        ? 12
        : assessmentInput?.accessibilityStrictness === "medium"
          ? 6
          : 0),
    0,
    100
  );
  const maintenanceScore = clamp(
    (maintenanceHorizonMonths / 36) * 42 +
      (turnoverRisk === "high" ? 26 : turnoverRisk === "medium" ? 15 : 6) +
      (reactApps >= 4 ? 18 : reactApps >= 2 ? 10 : 4),
    0,
    100
  );
  const rolloutScore = clamp(
    (frontendDevelopers >= 8 ? 28 : frontendDevelopers >= 4 ? 18 : 8) +
      (reactApps >= 4 ? 28 : reactApps >= 2 ? 16 : 8) +
      (existingMuiUsage === "standardized" ? 24 : existingMuiUsage === "some" ? 14 : 4),
    0,
    100
  );

  const drivers = [
    {
      title: "Advanced scope complexity",
      score: advancedScopeScore,
      detail: `${formatLabel("primaryUseCase", primaryUseCase)} currently carries ${advancedFeatureCount || "no"} additional advanced behavior${advancedFeatureCount === 1 ? "" : "s"} and ${dataHeavyScreens} data-heavy screen${dataHeavyScreens === 1 ? "" : "s"}.`,
      implication: "This expands the edge-case surface area and makes a clean custom build harder to keep predictable."
    },
    {
      title: "Schedule overrun exposure",
      score: scheduleRiskScore,
      detail: `The model puts the in-house path above 20 weeks in about ${formatProbability(comparison.probabilityBuildExceeds20Weeks)}, versus ${formatProbability(comparison.probabilityMuiExceeds20Weeks)} for ${result.muiPath?.label ?? "the packaged path"}.`,
      implication: "This is the clearest delivery-risk signal in the result."
    },
    {
      title: "Support and accessibility expectations",
      score: supportScore,
      detail: `Current support need is ${formatLabel("supportRequirement", supportRequirement)} with ${formatLabel("accessibilityStrictness", assessmentInput?.accessibilityStrictness)} accessibility strictness.`,
      implication: "Higher assurance requirements increase the value of vendor-backed behavior, fixes, and support channels."
    },
    {
      title: "Maintenance continuity",
      score: maintenanceScore,
      detail: `The model assumes a ${formatLabel("maintenanceHorizonMonths", assessmentInput?.maintenanceHorizonMonths)} horizon with ${formatLabel("turnoverRisk", turnoverRisk)} turnover risk.`,
      implication: "Longer ownership windows and staffing churn make ongoing custom maintenance more consequential."
    },
    {
      title: "Rollout footprint and reuse",
      score: rolloutScore,
      detail: `${frontendDevelopers || "A small number of"} frontend developer${frontendDevelopers === 1 ? "" : "s"} support ${reactApps || "a limited number of"} React app${reactApps === 1 ? "" : "s"}, with ${formatLabel("existingMuiUsage", existingMuiUsage)} MUI usage today.`,
      implication: "As more teams and apps share the component, consistency and standardization matter more."
    }
  ];

  return drivers
    .filter((driver) => driver.score >= 20)
    .sort((left, right) => right.score - left.score)
    .slice(0, 4);
}

function buildRecommendationChangeItems(result, assessmentInput) {
  const recommendation = result.recommendation?.option ?? "";
  const muiLabel = result.muiPath?.label ?? "the packaged path";
  const advancedFeatureCount = Array.isArray(assessmentInput?.advancedFeatures)
    ? assessmentInput.advancedFeatures.length
    : 0;
  const reactApps = Number(assessmentInput?.reactApps) || 0;
  const isBuildRecommendation = recommendation === "Build in-house";
  const scopeLabel = formatLabel("primaryUseCase", assessmentInput?.primaryUseCase);

  if (isBuildRecommendation) {
    return [
      {
        title: "Scope becomes less contained",
        body: `If the workload expands beyond the current ${scopeLabel} profile, especially with more advanced behaviors or heavier accessibility needs, a packaged path would look safer.`
      },
      {
        title: "Delivery pressure rises",
        body: `If deadline pressure moves above the current ${formatLabel("deadlinePressure", assessmentInput?.deadlinePressure)} state or internal capacity falls below ${formatLabel("internalCapacity", assessmentInput?.internalCapacity)}, the schedule-risk gap would widen.`
      },
      {
        title: "Shared rollout grows",
        body: `If the component needs to serve more than the current ${reactApps || 1} app${reactApps === 1 ? "" : "s"}, the standardization benefit of a packaged tier becomes more important.`
      },
      {
        title: "Support expectations increase",
        body: `If support needs rise above the current ${formatLabel("supportRequirement", assessmentInput?.supportRequirement)} level, vendor-backed delivery would become more attractive.`
      }
    ];
  }

  return [
    {
      title: "Scope narrows materially",
      body:
        advancedFeatureCount > 0
          ? `If the current ${scopeLabel} workload simplified and dropped some of the ${advancedFeatureCount} advanced behavior${advancedFeatureCount === 1 ? "" : "s"}, the in-house option would become more credible.`
          : `If the current ${scopeLabel} workload simplified further or kept its edge-case count contained, the in-house option would become more credible.`
    },
    {
      title: "Internal leverage improves",
      body: `More available capacity than the current ${formatLabel("internalCapacity", assessmentInput?.internalCapacity)} state, paired with less deadline pressure than ${formatLabel("deadlinePressure", assessmentInput?.deadlinePressure)}, would reduce custom-build risk.`
    },
    {
      title: "Support burden softens",
      body: `If support expectations fell below the current ${formatLabel("supportRequirement", assessmentInput?.supportRequirement)} requirement, the premium for ${muiLabel} would be harder to justify.`
    },
    {
      title: "Build timing closes the gap",
      body: `If the build path's median launch timing and long-tail delay risk moved closer to ${muiLabel}, confidence in the packaged recommendation would weaken.`
    }
  ];
}

function buildScenarioSnapshot(assessmentInput, result) {
  if (!assessmentInput) {
    return [
      `Compared path: ${result.muiPath?.label ?? "Not set"}`,
      `Confidence: ${result.confidence?.level ?? "Not set"}`
    ];
  }

  const chips = [
    `${Number(assessmentInput.frontendDevelopers) || 0} devs`,
    `${Number(assessmentInput.reactApps) || 0} apps`,
    `Use case: ${formatLabel("primaryUseCase", assessmentInput.primaryUseCase)}`,
    `Capacity: ${formatLabel("internalCapacity", assessmentInput.internalCapacity)}`,
    `Support: ${formatLabel("supportRequirement", assessmentInput.supportRequirement)}`,
    `Compared path: ${result.muiPath?.label ?? formatLabel("comparedMuiPlan", assessmentInput.comparedMuiPlan)}`
  ];

  return chips.filter(Boolean);
}

function BulletItem({ children }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Box
        sx={{
          width: 8,
          height: 8,
          mt: "9px",
          borderRadius: "50%",
          bgcolor: "secondary.main",
          flexShrink: 0
        }}
      />
      <Typography variant="body2" color="text.secondary">
        {children}
      </Typography>
    </Stack>
  );
}

function SectionCard({ title, description, children, action }) {
  return (
    <Card elevation={0} sx={{ height: "100%", border: 1, borderColor: "divider" }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "flex-start" }}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h5" component="h2">
                {title}
              </Typography>
              {description ? (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 720 }}>
                  {description}
                </Typography>
              ) : null}
            </Box>
            {action ? <Box sx={{ flexShrink: 0 }}>{action}</Box> : null}
          </Stack>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

function MeterRow({ label, valueLabel, progress, helper, barColor = "primary.main" }) {
  return (
    <Stack spacing={1}>
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {valueLabel}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={clamp(progress, 0, 100)}
        sx={{
          height: 10,
          borderRadius: 999,
          bgcolor: "action.hover",
          "& .MuiLinearProgress-bar": {
            borderRadius: 999,
            bgcolor: barColor
          }
        }}
      />
      {helper ? (
        <Typography variant="caption" color="text.secondary">
          {helper}
        </Typography>
      ) : null}
    </Stack>
  );
}

function ProbabilityCard({ title, value, detail }) {
  const color =
    value >= 65 ? "primary.main" : value >= 45 ? "secondary.main" : "text.secondary";

  return (
    <Card elevation={0} sx={{ height: "100%", border: 1, borderColor: "divider" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h3" component="div">
            {formatProbability(value)}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={clamp(value ?? 0, 0, 100)}
            sx={{
              height: 10,
              borderRadius: 999,
              bgcolor: "action.hover",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                bgcolor: color
              }
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {detail}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function DriverCard({ title, score, detail, implication }) {
  return (
    <Card elevation={0} sx={{ height: "100%", border: 1, borderColor: "divider" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Typography variant="h6" component="h3">
              {title}
            </Typography>
            <Chip label={`${Math.round(score)}/100`} size="small" />
          </Stack>
          <LinearProgress
            variant="determinate"
            value={clamp(score, 0, 100)}
            sx={{
              height: 10,
              borderRadius: 999,
              bgcolor: "action.hover",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                bgcolor: score >= 65 ? "primary.main" : "secondary.main"
              }
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {detail}
          </Typography>
          <Typography variant="body2">{implication}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function ReportPage() {
  const simulationResult = readStoredObject("simulationResult");
  const assessmentInput = readStoredObject("assessmentInput");

  if (!simulationResult) {
    return (
      <Stack spacing={4}>
        <PageHero
          eyebrow="Report"
          title="No saved simulation result"
          description="Run the assessment first so this route has a stored simulation result to display."
          chips={["Assessment required", "Local result cache"]}
        />
        <Card elevation={0} sx={{ border: 1, borderColor: "divider" }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Stack spacing={3}>
              <Typography variant="body1" color="text.secondary">
                This page reads from `localStorage`. Run a fresh assessment to create a
                reportable result set.
              </Typography>
              <Box>
                <Button component={NavLink} to="/assess" variant="contained">
                  Go to assessment
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
  const icpFit = simulationResult.icpFit ?? {};
  const buildPath = simulationResult.buildPath ?? {};
  const muiPath = simulationResult.muiPath ?? {};
  const comparison = simulationResult.comparison ?? {};
  const probabilityMetrics = buildProbabilityMetrics(simulationResult);
  const riskDrivers = buildRiskDrivers(simulationResult, assessmentInput);
  const recommendationChangeItems = buildRecommendationChangeItems(
    simulationResult,
    assessmentInput ?? {}
  );
  const scenarioSnapshot = buildScenarioSnapshot(assessmentInput, simulationResult);
  const tierScores = [
    { label: "Build in-house", value: icpFit.tierScores?.build ?? 0 },
    { label: "MUI Core", value: icpFit.tierScores?.core ?? 0 },
    { label: "Premium", value: icpFit.tierScores?.premium ?? 0 },
    { label: "Enterprise", value: icpFit.tierScores?.enterprise ?? 0 }
  ];

  return (
    <Stack spacing={4}>
      <Box
        sx={{
          borderRadius: 4,
          p: { xs: 3, md: 4 },
          border: 1,
          borderColor: "divider",
          background:
            "linear-gradient(135deg, rgba(20,83,45,0.11), rgba(255,255,255,0.96) 50%, rgba(180,83,9,0.10))"
        }}
      >
        <Grid container spacing={3} alignItems="stretch">
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={3}>
              <PageHero
                eyebrow="1. Recommendation"
                title={recommendation.option ?? "Recommendation unavailable"}
                description={
                  recommendation.summary ??
                  "The model did not return a recommendation summary."
                }
                chips={scenarioSnapshot}
              />

              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 760 }}>
                This recommendation is the headline. The probabilities below are supporting
                evidence for this input set, not a guarantee that one path will win in every
                delivery context. Cost is included as context, not the main claim.
              </Typography>

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
                <Stack spacing={2.5}>
                  <Typography variant="overline" color="secondary.main">
                    Evidence Snapshot
                  </Typography>
                  <MeterRow
                    label="Confidence"
                    valueLabel={`${confidence.score ?? 0}/100`}
                    progress={confidence.score ?? 0}
                    helper={confidence.rationale}
                  />
                  <Divider />
                  <MeterRow
                    label={`${muiPath.label ?? "Packaged path"} lands sooner`}
                    valueLabel={formatProbability(comparison.probabilityMuiFaster)}
                    progress={comparison.probabilityMuiFaster ?? 0}
                    helper={`Median launch delta: ${formatSignedWeeks(comparison.launchWeekDeltaMedian)}.`}
                    barColor="secondary.main"
                  />
                  <MeterRow
                    label={`${muiPath.label ?? "Packaged path"} lowers TCO`}
                    valueLabel={formatProbability(comparison.probabilityMuiLowerTco)}
                    progress={comparison.probabilityMuiLowerTco ?? 0}
                    helper={`Median TCO delta: ${formatSignedCurrency(comparison.tcoDeltaMedian)}.`}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <SectionCard
            title="2. Confidence"
            description="Confidence reflects how strongly the rules and scenario simulation agree. It does not mean certainty."
          >
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} alignItems="baseline" flexWrap="wrap" useFlexGap>
                <Typography variant="h2" component="div">
                  {confidence.score ?? 0}
                </Typography>
                <Chip
                  label={`${confidence.level ?? "qualified"} confidence`}
                  color={confidence.level === "high" ? "primary" : "secondary"}
                  variant={confidence.level === "high" ? "filled" : "outlined"}
                />
              </Stack>

              <MeterRow
                label="Overall recommendation signal"
                valueLabel={`${confidence.score ?? 0}/100`}
                progress={confidence.score ?? 0}
                helper={confidence.rationale}
              />
              <MeterRow
                label="Delivery evidence separation"
                valueLabel={formatProbability(comparison.probabilityMuiFaster)}
                progress={Math.abs((comparison.probabilityMuiFaster ?? 50) - 50) * 2}
                helper="How far the modeled speed outcome moves away from a coin-flip."
                barColor="secondary.main"
              />
              <MeterRow
                label="Cost evidence separation"
                valueLabel={formatProbability(comparison.probabilityMuiLowerTco)}
                progress={Math.abs((comparison.probabilityMuiLowerTco ?? 50) - 50) * 2}
                helper="Useful context, but deliberately not the dominant signal."
              />
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <SectionCard
            title="3. ICP fit score and reasons"
            description="This score reflects how strongly the workload matches an advanced packaged-component decision profile."
          >
            <Stack spacing={3}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={2} alignItems="baseline">
                  <Typography variant="h2" component="div">
                    {formatNumber(icpFit.score ?? 0)}
                  </Typography>
                  <Chip
                    label={`${icpFit.segment ?? "limited"} fit`}
                    color={icpFit.segment === "strong" ? "primary" : "secondary"}
                    variant={icpFit.segment === "strong" ? "filled" : "outlined"}
                  />
                </Stack>
                <Chip
                  label={`Compared with ${muiPath.label ?? "selected MUI path"}`}
                  variant="outlined"
                />
              </Stack>

              <MeterRow
                label="ICP fit score"
                valueLabel={`${formatNumber(icpFit.score ?? 0)}/100`}
                progress={icpFit.score ?? 0}
                helper="A higher fit score means the component profile aligns more closely with advanced packaged paths."
              />

              <Stack spacing={1.5}>
                {(icpFit.reasons ?? []).map((reason) => (
                  <BulletItem key={reason}>{reason}</BulletItem>
                ))}
              </Stack>

              <Divider />

              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Relative tier fit
                </Typography>
                {tierScores.map((tier) => (
                  <MeterRow
                    key={tier.label}
                    label={tier.label}
                    valueLabel={`${formatNumber(tier.value)}/100`}
                    progress={tier.value}
                    barColor={
                      tier.label === buildPath.label ||
                      tier.label === recommendation.option ||
                      (tier.label === "Premium" && recommendation.option === "Premium") ||
                      (tier.label === "Enterprise" && recommendation.option === "Enterprise")
                        ? "primary.main"
                        : "secondary.main"
                    }
                  />
                ))}
              </Stack>
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>

      <SectionCard
        title="4. Scenario comparison table"
        description={`Modeled medians and P90 outcomes comparing a custom build against ${muiPath.label ?? "the selected MUI path"}.`}
      >
        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card elevation={0} sx={{ border: 1, borderColor: "divider", bgcolor: "background.default" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Median launch delta
                    </Typography>
                    <Typography variant="h4" component="div">
                      {formatSignedWeeks(comparison.launchWeekDeltaMedian)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Negative values favor the packaged path because the delta is MUI minus build.
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card elevation={0} sx={{ border: 1, borderColor: "divider", bgcolor: "background.default" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Median engineering delta
                    </Typography>
                    <Typography variant="h4" component="div">
                      {formatSignedWeeks(comparison.engineeringWeekDeltaMedian)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This focuses on engineering effort, separate from schedule slip.
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card elevation={0} sx={{ border: 1, borderColor: "divider", bgcolor: "background.default" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Median TCO delta
                    </Typography>
                    <Typography variant="h4" component="div">
                      {formatSignedCurrency(comparison.tcoDeltaMedian)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Money is contextual here. The recommendation still prioritizes delivery and maintenance risk.
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <TableContainer sx={{ border: 1, borderColor: "divider", borderRadius: 3 }}>
            <Table sx={{ minWidth: 760 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "background.default" }}>
                  <TableCell>Path</TableCell>
                  <TableCell align="right">Median launch</TableCell>
                  <TableCell align="right">P90 launch</TableCell>
                  <TableCell align="right">Median engineering</TableCell>
                  <TableCell align="right">P90 engineering</TableCell>
                  <TableCell align="right">Median TCO</TableCell>
                  <TableCell align="right">P90 TCO</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[buildPath, muiPath].map((path) => (
                  <TableRow key={path.label} hover>
                    <TableCell sx={{ minWidth: 180 }}>
                      <Stack spacing={0.5}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {path.label}
                        </Typography>
                        {path.plan ? (
                          <Typography variant="caption" color="text.secondary">
                            Selected packaged comparison tier
                          </Typography>
                        ) : null}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">{formatWeeks(path.medianLaunchWeeks)}</TableCell>
                    <TableCell align="right">{formatWeeks(path.p90LaunchWeeks)}</TableCell>
                    <TableCell align="right">{formatWeeks(path.medianEngineeringWeeks)}</TableCell>
                    <TableCell align="right">{formatWeeks(path.p90EngineeringWeeks)}</TableCell>
                    <TableCell align="right">{formatCurrency(path.medianTco)}</TableCell>
                    <TableCell align="right">{formatCurrency(path.p90Tco)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="caption" color="text.secondary">
            The table shows modeled ranges, not guarantees. P90 values are useful for spotting long-tail delivery and cost exposure.
          </Typography>
        </Stack>
      </SectionCard>

      <SectionCard
        title="5. Probability metrics"
        description="These probabilities support the recommendation by showing how often each path wins under repeated modeled scenarios."
      >
        <Grid container spacing={2.5}>
          {probabilityMetrics.map((metric) => (
            <Grid key={metric.title} size={{ xs: 12, sm: 6, xl: 3 }}>
              <ProbabilityCard
                title={metric.title}
                value={metric.value}
                detail={metric.detail}
              />
            </Grid>
          ))}
        </Grid>
      </SectionCard>

      <SectionCard
        title="6. Main risk drivers"
        description="These are the factors doing the most work in the recommendation, based on the stored assessment input and the modeled output."
      >
        {riskDrivers.length > 0 ? (
          <Grid container spacing={2.5}>
            {riskDrivers.map((driver) => (
              <Grid key={driver.title} size={{ xs: 12, md: 6 }}>
                <DriverCard {...driver} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">
            The stored result does not include enough assessment context to rank the main
            drivers beyond the recommendation and probability sections above.
          </Typography>
        )}
      </SectionCard>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard
            title="7. Assumptions"
            description="The report should stay transparent about what the model includes and what it does not."
          >
            <Stack spacing={2}>
              {(simulationResult.assumptions ?? []).map((assumption) => (
                <BulletItem key={assumption}>{assumption}</BulletItem>
              ))}

              {assessmentInput ? (
                <>
                  <Divider />
                  <Stack spacing={1.5}>
                    <Typography variant="body2" color="text.secondary">
                      Current scenario basis
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {[
                        `Design system: ${formatLabel("designSystemMaturity", assessmentInput.designSystemMaturity)}`,
                        `MUI usage: ${formatLabel("existingMuiUsage", assessmentInput.existingMuiUsage)}`,
                        `Advanced features: ${summarizeAdvancedFeatures(assessmentInput.advancedFeatures)}`,
                        `Maintenance: ${formatLabel("maintenanceHorizonMonths", assessmentInput.maintenanceHorizonMonths)}`
                      ].map((chip) => (
                        <Chip key={chip} label={chip} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </Stack>
                </>
              ) : null}
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard
            title="8. What would change the recommendation"
            description="These are the shifts most likely to move the result, not promises that the recommendation would definitely flip."
          >
            <Stack spacing={2}>
              {recommendationChangeItems.map((item) => (
                <Stack key={item.title} spacing={0.75}>
                  <Typography variant="h6" component="h3">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.body}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>

      <SectionCard
        title="9. CTA to rerun assessment"
        description="If the team context, component scope, or commercial assumptions change, rerun the model rather than stretching this result past its input set."
        action={
          <Button component={NavLink} to="/assess" variant="contained">
            Rerun assessment
          </Button>
        }
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 760 }}>
            Use a rerun when the scope becomes more advanced, staffing changes, support
            expectations change, or you want to compare a different MUI tier. The route will
            refresh from the newly stored local result.
          </Typography>
          <Button component={NavLink} to="/methodology" variant="outlined">
            Read methodology
          </Button>
        </Stack>
      </SectionCard>
    </Stack>
  );
}

export default ReportPage;
