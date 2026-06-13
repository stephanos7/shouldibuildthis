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

const CURRENT_MODEL_VERSION = "benchmark-informed-v3";

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

function getSignalLabel(score) {
  if (!Number.isFinite(score)) {
    return "Not available";
  }

  if (score >= 70) {
    return "High";
  }

  if (score >= 40) {
    return "Moderate";
  }

  return "Low";
}

function buildDecisionFactors(result, assessmentInput) {
  const comparison = result.comparison ?? {};
  const derived = result.derivedFactors ?? {};
  const modeledMuiPathFit = result.modeledMuiPathFit ?? {};
  const functionalScore = Number(derived.functionalComplexity?.score) || 0;
  const qualityScore = Number(derived.qualityBurden?.score) || 0;
  const deliveryScore = Number(derived.deliveryMaturity?.score) || 0;
  const ownershipScore = Number(derived.ownershipBurden?.score) || 0;
  const existingMuiUsage = assessmentInput?.existingMuiUsage;
  const coverageScore = Number(modeledMuiPathFit.coverageScore);
  const coverageGap = Number(modeledMuiPathFit.coverageGap);
  const supportGap = Number(modeledMuiPathFit.supportGap);

  const scopeBurdenScore = clamp(functionalScore * 0.58 + qualityScore * 0.42, 0, 100);
  const internalAbsorptionScore = clamp(
    deliveryScore * 0.55 + (100 - ownershipScore) * 0.45,
    0,
    100
  );
  const muiLeverageScore = Number.isFinite(coverageScore) ? coverageScore : 0;
  const tradeoffScore = clamp(
    ((comparison.probabilityMuiFaster ?? 0) + (comparison.probabilityMuiLowerTco ?? 0)) / 2,
    0,
    100
  );

  return [
    {
      title: "Scope burden",
      score: scopeBurdenScore,
      label: "Rule-based signal",
      summary:
        "How much work the UI requirement creates before delivery timing and TCO are modeled.",
      details: [
        `Functional complexity is ${formatNumber(functionalScore)}/100 and quality burden is ${formatNumber(qualityScore)}/100.`,
        "Higher scope burden makes a custom build harder to keep predictable."
      ]
    },
    {
      title: "Internal absorption",
      score: internalAbsorptionScore,
      label: "Rule-based signal",
      summary:
        "How well the team can absorb custom build work with the current delivery and ownership setup.",
      details: [
        `Delivery maturity is ${formatNumber(deliveryScore)}/100 and ownership burden is ${formatNumber(ownershipScore)}/100.`,
        "Higher delivery maturity and lower ownership burden make in-house work easier to absorb."
      ]
    },
    {
      title: "MUI leverage",
      score: muiLeverageScore,
      label: `Modeled MUI comparison path: ${modeledMuiPathFit.label ?? "MUI Core"}`,
      summary:
        "How much the modeled MUI path reduces effort, risk, or support burden for this input set.",
      details: [
        `Coverage score is ${formatNumber(coverageScore)}/100 with a coverage gap of ${formatNumber(Number.isFinite(coverageGap) ? coverageGap * 100 : NaN)}/100 and a support gap of ${formatNumber(Number.isFinite(supportGap) ? supportGap * 100 : NaN)}/100.`,
        `Existing MUI usage is ${formatLabel("existingMuiUsage", existingMuiUsage)}.`,
        "This is the MUI path used for the Build vs MUI simulation, not automatically the recommended path."
      ]
    },
    {
      title: "Modeled tradeoff",
      score: tradeoffScore,
      label: "Simulation comparison",
      summary:
        "How the Build and MUI paths compare across repeated simulated scenarios.",
      details: [
        `MUI is faster in ${formatProbability(comparison.probabilityMuiFaster)} of modeled scenarios and lower in TCO in ${formatProbability(comparison.probabilityMuiLowerTco)}.`,
        `Median launch delta is ${formatSignedWeeks(comparison.launchWeekDeltaMedian)} and median TCO delta is ${formatSignedCurrency(comparison.tcoDeltaMedian)}.`
      ]
    }
  ];
}

function buildRiskDrivers(result, assessmentInput) {
  const comparison = result.comparison ?? {};
  const derived = result.derivedFactors ?? {};
  const advancedFeatureCount = Array.isArray(assessmentInput?.advancedFeatures)
    ? assessmentInput.advancedFeatures.length
    : 0;
  const dataHeavyScreens = Number(assessmentInput?.dataHeavyScreens) || 0;
  const supportRequirement = assessmentInput?.supportRequirement;
  const maintenanceHorizonMonths = Number(assessmentInput?.maintenanceHorizonMonths) || 0;
  const reactApps = Number(assessmentInput?.reactApps) || 0;
  const frontendDevelopers = Number(assessmentInput?.frontendDevelopers) || 0;
  const deadlinePressure = assessmentInput?.deadlinePressure;
  const accessibilityTarget = assessmentInput?.accessibilityTarget;
  const changeLeadTime = assessmentInput?.changeLeadTime;
  const reworkFrequency = assessmentInput?.reworkFrequency;
  const dependentTeams = assessmentInput?.dependentTeams;
  const ownershipModel = assessmentInput?.ownershipModel;
  const existingMuiUsage = assessmentInput?.existingMuiUsage;
  const primaryUseCase = assessmentInput?.primaryUseCase;
  const expectedRows = assessmentInput?.expectedRows;
  const expectedColumns = assessmentInput?.expectedColumns;
  const functionalScore = Number(derived.functionalComplexity?.score) || 0;
  const qualityScore = Number(derived.qualityBurden?.score) || 0;
  const deliveryScore = Number(derived.deliveryMaturity?.score) || 0;
  const ownershipScore = Number(derived.ownershipBurden?.score) || 0;
  const enterpriseScore = Number(derived.enterpriseReadiness?.score) || 0;
  const rowWeights = {
    "under-1k": 2,
    "1k-10k": 8,
    "10k-100k": 15,
    "over-100k": 22
  };
  const columnWeights = {
    "under-10": 2,
    "10-30": 7,
    "over-30": 14
  };

  const advancedScopeScore = clamp(
    advancedFeatureCount * 14 +
      Math.min(dataHeavyScreens, 10) * 3 +
      (useCaseWeightMap[primaryUseCase] ?? 10) +
      (rowWeights[expectedRows] ?? 0) +
      (columnWeights[expectedColumns] ?? 0) +
      functionalScore * 0.18,
    0,
    100
  );
  const scheduleRiskScore = clamp(
    (comparison.probabilityBuildExceeds20Weeks ?? 0) * 0.8 -
      (comparison.probabilityMuiExceeds20Weeks ?? 0) * 0.3 +
      (deadlinePressure === "high" ? 18 : deadlinePressure === "medium" ? 10 : 0) +
      (changeLeadTime === "more-than-month"
        ? 18
        : changeLeadTime === "one-week-to-one-month"
          ? 11
          : changeLeadTime === "one-day-to-one-week"
            ? 5
            : changeLeadTime === "less-than-day"
              ? 2
              : 7) +
      (reworkFrequency === "frequent" ? 16 : reworkFrequency === "occasional" ? 8 : reworkFrequency === "rare" ? 2 : 6),
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
      (accessibilityTarget === "wcag-aaa-regulated"
        ? 16
        : accessibilityTarget === "wcag-aa"
          ? 10
          : accessibilityTarget === "wcag-a"
            ? 5
            : 0),
    0,
    100
  );
  const maintenanceScore = clamp(
    (maintenanceHorizonMonths / 36) * 42 +
      (dependentTeams === "eight-plus"
        ? 22
        : dependentTeams === "four-seven"
          ? 16
          : dependentTeams === "two-three"
            ? 10
            : 6) +
      (ownershipModel === "unclear"
        ? 18
        : ownershipModel === "several-teams-informal"
          ? 12
          : ownershipModel === "frontend-platform-team"
            ? 8
            : 4) +
      (reactApps >= 4 ? 16 : reactApps >= 2 ? 10 : 4),
    0,
    100
  );
  const rolloutScore = clamp(
    (frontendDevelopers >= 8 ? 28 : frontendDevelopers >= 4 ? 18 : 8) +
      (reactApps >= 4 ? 28 : reactApps >= 2 ? 16 : 8) +
      (existingMuiUsage === "standardized" ? 24 : existingMuiUsage === "some" ? 14 : 4) +
      (assessmentInput?.designSystemMaturity === "high" ? 10 : assessmentInput?.designSystemMaturity === "medium" ? 6 : 0) +
      (dependentTeams === "one" ? 2 : dependentTeams === "two-three" ? 5 : dependentTeams === "four-seven" ? 10 : 14),
    0,
    100
  );

  const drivers = [
    {
      title: "Advanced scope complexity",
      score: advancedScopeScore,
      detail: `${formatLabel("primaryUseCase", primaryUseCase)} currently carries ${advancedFeatureCount || "no"} additional advanced behavior${advancedFeatureCount === 1 ? "" : "s"}, ${dataHeavyScreens} data-heavy screen${dataHeavyScreens === 1 ? "" : "s"}, and a ${formatLabel("expectedRows", expectedRows)} by ${formatLabel("expectedColumns", expectedColumns)} scale profile.`,
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
      detail: `Current support need is ${formatLabel("supportRequirement", supportRequirement)} with a ${formatLabel("accessibilityTarget", accessibilityTarget)} accessibility target.`,
      implication: "Higher assurance requirements increase the value of vendor-backed behavior, fixes, and support channels."
    },
    {
      title: "Maintenance continuity",
      score: maintenanceScore,
      detail: `The model assumes a ${formatLabel("maintenanceHorizonMonths", assessmentInput?.maintenanceHorizonMonths)} horizon with ${formatLabel("dependentTeams", dependentTeams)} dependent teams and ${formatLabel("ownershipModel", ownershipModel)} ownership.`,
      implication: "Longer ownership windows and staffing churn make ongoing custom maintenance more consequential."
    },
    {
      title: "Rollout footprint and reuse",
      score: rolloutScore,
      detail: `${frontendDevelopers || "A small number of"} frontend developer${frontendDevelopers === 1 ? "" : "s"} support ${reactApps || "a limited number of"} React app${reactApps === 1 ? "" : "s"}, with ${formatLabel("existingMuiUsage", existingMuiUsage)} MUI usage and ${formatLabel("designSystemMaturity", assessmentInput?.designSystemMaturity)} maturity today.`,
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
        body: `If the workload expands beyond the current ${scopeLabel} profile, especially with more advanced behaviors, heavier accessibility needs, or larger row and column counts, a packaged path would look safer.`
      },
      {
        title: "Delivery pressure rises",
        body: `If deadline pressure moves above the current ${formatLabel("deadlinePressure", assessmentInput?.deadlinePressure)} state or change lead time stretches beyond ${formatLabel("changeLeadTime", assessmentInput?.changeLeadTime)}, the schedule-risk gap would widen.`
      },
      {
        title: "Shared rollout grows",
        body: `If the component needs to serve more than the current ${reactApps || 1} app${reactApps === 1 ? "" : "s"} or a broader dependent-team footprint than today, the standardization benefit of a packaged tier becomes more important.`
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
      body: `A shorter change lead time than the current ${formatLabel("changeLeadTime", assessmentInput?.changeLeadTime)} state, paired with less deadline pressure than ${formatLabel("deadlinePressure", assessmentInput?.deadlinePressure)}, would reduce custom-build risk.`
    },
    {
      title: "Ownership gets clearer",
      body: "If the component had clearer ownership and fewer dependent teams than today, the internal option would carry less long-term coordination risk."
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
      `Modeled MUI path: ${result.muiPath?.label ?? "Not set"}`,
      `Confidence: ${result.confidence?.level ?? "Not set"}`
    ];
  }

  const chips = [
    `${Number(assessmentInput.frontendDevelopers) || 0} devs`,
    `${Number(assessmentInput.reactApps) || 0} apps`,
    `Use case: ${formatLabel("primaryUseCase", assessmentInput.primaryUseCase)}`,
    `Rows: ${formatLabel("expectedRows", assessmentInput.expectedRows)}`,
    `Columns: ${formatLabel("expectedColumns", assessmentInput.expectedColumns)}`,
    `Ownership: ${formatLabel("ownershipModel", assessmentInput.ownershipModel)}`,
    `Support: ${formatLabel("supportRequirement", assessmentInput.supportRequirement)}`,
    `Modeled MUI path: ${result.muiPath?.label ?? "Not set"}`
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

const derivedFactorLabels = {
  functionalComplexity: "Functional complexity",
  qualityBurden: "Quality burden",
  deliveryMaturity: "Delivery maturity",
  ownershipBurden: "Ownership burden",
  enterpriseReadiness: "Enterprise readiness"
};

const modelLeverLabels = {
  internalAbsorption: "Internal absorption",
  buildReuseLeverage: "Build reuse leverage",
  muiLeverage: "MUI leverage",
  muiAdoptionBurden: "MUI adoption burden",
  downsideTailRisk: "Downside tail risk"
};

const evidenceBasisOrder = [
  "standard-backed",
  "benchmark-informed",
  "practice-backed",
  "product-specific heuristic"
];

const evidenceBasisLabels = {
  "standard-backed": "Standard-backed",
  "benchmark-informed": "Benchmark-informed",
  "practice-backed": "Practice-backed",
  "product-specific heuristic": "Product-specific heuristic"
};

const evidenceBasisDescriptions = {
  "standard-backed":
    "Linked to a recognized standard or formal practice area, such as accessibility or software quality.",
  "benchmark-informed":
    "Inspired by industry measurement practices, such as delivery performance metrics.",
  "practice-backed":
    "Reflects widely used engineering practice, such as concerns that rise with large data tables or complex interactions.",
  "product-specific heuristic":
    "A product assumption specific to MUI adoption, licensing, support, or model-specific path fit."
};

function groupEvidenceBasis(items) {
  const grouped = Object.fromEntries(
    evidenceBasisOrder.map((basis) => [basis, []])
  );

  (Array.isArray(items) ? items : []).forEach((item) => {
    const basis = evidenceBasisOrder.includes(item?.basis)
      ? item.basis
      : "product-specific heuristic";

    grouped[basis].push(item);
  });

  return evidenceBasisOrder
    .map((basis) => ({
      basis,
      items: grouped[basis].filter(Boolean)
    }))
    .filter((group) => group.items.length > 0);
}

function FactorCard({ title, factor }) {
  const score = Number(factor?.score);
  const drivers = Array.isArray(factor?.drivers) ? factor.drivers.slice(0, 4) : [];
  const level = factor?.level ?? "unknown";

  return (
    <Card elevation={0} sx={{ height: "100%", border: 1, borderColor: "divider" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="flex-start">
            <Box>
              <Typography variant="h6" component="h3">
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {level.charAt(0).toUpperCase() + level.slice(1)} signal
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="flex-end">
              {Number.isFinite(score) ? (
                <Chip label={`${formatNumber(score)}/100`} size="small" />
              ) : null}
              <Chip
                label={level}
                size="small"
                color={level === "high" ? "primary" : "secondary"}
                variant={level === "high" ? "filled" : "outlined"}
              />
            </Stack>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={clamp(Number.isFinite(score) ? score : 0, 0, 100)}
            sx={{
              height: 10,
              borderRadius: 999,
              bgcolor: "action.hover",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                bgcolor: level === "high" ? "primary.main" : "secondary.main"
              }
            }}
          />

          <Stack spacing={1}>
            {drivers.length > 0 ? (
              drivers.map((driver) => (
                <BulletItem key={driver}>{driver}</BulletItem>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No driver notes were stored for this factor.
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function EvidenceItem({ item }) {
  const appliesBecause = Array.isArray(item?.appliesBecause) ? item.appliesBecause.filter(Boolean) : [];

  return (
    <Stack spacing={1.25}>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Typography variant="subtitle2" component="h4">
          {derivedFactorLabels[item?.factor] ?? item?.factor ?? "Factor"}
        </Typography>
        {item?.basis ? <Chip label={evidenceBasisLabels[item.basis] ?? item.basis} size="small" variant="outlined" /> : null}
      </Stack>
      <Typography variant="body2" color="text.secondary">
        {item?.explanation ?? item?.detail ?? "No explanation was stored for this item."}
      </Typography>
      {appliesBecause.length > 0 ? (
        <Stack spacing={0.75}>
          {appliesBecause.map((line) => (
            <BulletItem key={line}>{line}</BulletItem>
          ))}
        </Stack>
      ) : null}
    </Stack>
  );
}

function EvidenceBasisGroup({ basis, items }) {
  return (
    <Card elevation={0} sx={{ height: "100%", border: 1, borderColor: "divider" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" component="h3">
              {evidenceBasisLabels[basis] ?? basis}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {evidenceBasisDescriptions[basis] ?? "Grouped model evidence."}
            </Typography>
          </Box>
          <Stack spacing={2}>
            {items.map((item, index) => (
              <Box key={`${item?.factor ?? basis}-${index}`}>
                {index > 0 ? <Divider sx={{ mb: 2 }} /> : null}
                <EvidenceItem item={item} />
              </Box>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function ReportPage() {
  const simulationResult = readStoredObject("simulationResult");
  const assessmentInput = readStoredObject("assessmentInput");
  const isLegacyReport =
    Boolean(simulationResult) &&
    simulationResult.modelVersion !== CURRENT_MODEL_VERSION;

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
  const modeledMuiPathFit = simulationResult.modeledMuiPathFit ?? {};
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
  const derivedFactors = simulationResult.derivedFactors ?? null;
  const modelLevers = simulationResult.modelLevers ?? null;
  const derivedFactorEntries = derivedFactors
    ? [
        ["functionalComplexity", derivedFactors.functionalComplexity],
        ["qualityBurden", derivedFactors.qualityBurden],
        ["deliveryMaturity", derivedFactors.deliveryMaturity],
        ["ownershipBurden", derivedFactors.ownershipBurden],
        ["enterpriseReadiness", derivedFactors.enterpriseReadiness]
      ].filter(([, factor]) => factor)
    : [];
  const modelLeverEntries = modelLevers
    ? [
        ["internalAbsorption", modelLevers.internalAbsorption],
        ["buildReuseLeverage", modelLevers.buildReuseLeverage],
        ["muiLeverage", modelLevers.muiLeverage],
        ["muiAdoptionBurden", modelLevers.muiAdoptionBurden],
        ["downsideTailRisk", modelLevers.downsideTailRisk]
      ]
        .filter(([, lever]) => lever)
        .map(([key, lever]) => [
          key,
          {
            ...lever,
            score: Number.isFinite(Number(lever?.score))
              ? Number(lever.score) * 100
              : lever?.score
          }
        ])
    : [];
  const evidenceBasisGroups = groupEvidenceBasis(simulationResult.evidenceBasis);
  const showModelExplanation =
    derivedFactorEntries.length > 0 ||
    modelLeverEntries.length > 0 ||
    evidenceBasisGroups.length > 0;
  const decisionFactors = buildDecisionFactors(simulationResult, assessmentInput);

  return (
    <Stack spacing={4}>
      {isLegacyReport ? (
        <Alert severity="warning" variant="outlined">
          This report was generated with an older model. Rerun the assessment for the latest benchmark-informed inputs.
        </Alert>
      ) : null}
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

      {showModelExplanation ? (
        <SectionCard
          title="2. Why the model reached this view"
          description="This is a scenario model, not a guarantee. The evidence basis explains why each factor is included, not that the numeric coefficient is externally certified."
        >
          <Stack spacing={4}>
            {derivedFactorEntries.length > 0 ? (
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="h6" component="h3">
                    Derived factors
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    These summarize the input set into the five signals used by the recommendation and simulation.
                  </Typography>
                </Box>
                <Grid container spacing={2.5}>
                  {derivedFactorEntries.map(([key, factor]) => (
                    <Grid key={key} size={{ xs: 12, md: 6 }}>
                      <FactorCard
                        title={derivedFactorLabels[key] ?? key}
                        factor={factor}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            ) : null}

            {modelLeverEntries.length > 0 ? (
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="h6" component="h3">
                    Model levers
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    These show the internal heuristics the simulation used to give Build and the modeled MUI path their explicit sources of advantage and drag.
                  </Typography>
                </Box>
                <Grid container spacing={2.5}>
                  {modelLeverEntries.map(([key, lever]) => (
                    <Grid key={key} size={{ xs: 12, md: 6 }}>
                      <FactorCard
                        title={modelLeverLabels[key] ?? key}
                        factor={lever}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            ) : null}

            {(
              derivedFactorEntries.length > 0 || modelLeverEntries.length > 0
            ) && evidenceBasisGroups.length > 0 ? (
              <Divider />
            ) : null}

            {evidenceBasisGroups.length > 0 ? (
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="h6" component="h3">
                    Evidence basis
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Standard-backed means a recognized standard or formal practice area. Benchmark-informed means an industry measurement pattern. Practice-backed means a widely used engineering concern. Product-specific heuristic means an MUI adoption or model-specific path-fit assumption.
                  </Typography>
                </Box>
                <Grid container spacing={2.5}>
                  {evidenceBasisGroups.map((group) => (
                    <Grid key={group.basis} size={{ xs: 12, md: 6 }}>
                      <EvidenceBasisGroup basis={group.basis} items={group.items} />
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            ) : null}
          </Stack>
        </SectionCard>
      ) : null}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <SectionCard
            title="3. Confidence"
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
            title="4. Decision factors"
            description="These scores show how the input profile fits each path before timing and TCO simulation are applied. They are not the final recommendation."
          >
            <Stack spacing={3}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
              >
              <Stack spacing={0.5}>
                <Typography variant="overline" color="secondary.main">
                  Path fit before simulation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  These scores are rule-based fit signals only. The final recommendation also
                  considers simulated launch time, TCO, support context, and ownership credibility.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Modeled MUI comparison path: {modeledMuiPathFit.label ?? "MUI Core"}. This is the
                  MUI path used for the Build vs MUI simulation, not automatically the recommended
                  path.
                </Typography>
              </Stack>
              </Stack>

              <Grid container spacing={2.5}>
                {decisionFactors.map((factor) => (
                  <Grid key={factor.title} size={{ xs: 12, md: 6 }}>
                    <Card elevation={0} sx={{ height: "100%", border: 1, borderColor: "divider" }}>
                      <CardContent sx={{ p: 2.5 }}>
                        <Stack spacing={2}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={2}
                            alignItems="flex-start"
                          >
                            <Box>
                              <Typography variant="h6" component="h3">
                                {factor.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {factor.summary}
                              </Typography>
                            </Box>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="flex-end">
                              <Chip label={factor.label} size="small" variant="outlined" />
                              <Chip
                                label={`${getSignalLabel(factor.score)} fit`}
                                size="small"
                                color={factor.score >= 70 ? "primary" : "secondary"}
                                variant={factor.score >= 70 ? "filled" : "outlined"}
                              />
                            </Stack>
                          </Stack>

                          <MeterRow
                            label={factor.title}
                            valueLabel={`${formatNumber(factor.score)}/100`}
                            progress={factor.score}
                            helper="Rule-based signal only"
                            barColor={factor.score >= 70 ? "primary.main" : "secondary.main"}
                          />

                          <Stack spacing={1}>
                            {factor.details.map((detail) => (
                              <BulletItem key={detail}>{detail}</BulletItem>
                            ))}
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>

      <SectionCard
        title="5. Scenario comparison table"
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
        title="6. Probability metrics"
        description="These probabilities show how the modeled Build and MUI paths compare across repeated simulated scenarios."
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
        title="7. Main risk drivers"
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
            title="8. Assumptions"
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
                        `UI/platform maturity: ${formatLabel("designSystemMaturity", assessmentInput.designSystemMaturity)}`,
                        `MUI usage: ${formatLabel("existingMuiUsage", assessmentInput.existingMuiUsage)}`,
                        `Accessibility target: ${formatLabel("accessibilityTarget", assessmentInput.accessibilityTarget)}`,
                        `Rows: ${formatLabel("expectedRows", assessmentInput.expectedRows)}`,
                        `Columns: ${formatLabel("expectedColumns", assessmentInput.expectedColumns)}`,
                        `Ownership: ${formatLabel("ownershipModel", assessmentInput.ownershipModel)}`,
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
            title="9. What would change the recommendation"
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
        title="10. CTA to rerun assessment"
        description="If the team context, component scope, or support assumptions change, rerun the model rather than stretching this result past its input set."
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
