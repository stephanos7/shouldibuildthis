import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  PUBLIC_SOURCES,
  PUBLIC_BENCHMARK_SOURCES,
  getPublicSourceMap
} from "../data/publicSources.js";
import { RECOMMENDATION_POLICY_VERSION } from "../model/recommendationPolicy.js";

const ASSESSMENT_INPUT_SCHEMA_VERSION = 2;
const CURRENT_MODEL_VERSION = "deterministic-fit-v1";
const LEGACY_MODEL_VERSION = "benchmark-informed-v5";
const CURRENT_CALIBRATION_VERSION = "heuristic-v1";
const CURRENT_RECOMMENDATION_POLICY_VERSION = RECOMMENDATION_POLICY_VERSION;

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

function formatBreakdownCurrency(value) {
  if (!Number.isFinite(value)) {
    return "N/A";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "standard",
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

function buildEstimateBreakdownSections(pathKey, breakdown) {
  if (!breakdown) {
    return [];
  }

  const isBuild = pathKey === "build";

  const effortRows = isBuild
    ? [
        ["Base engineering", formatWeeks(breakdown.effort?.baseEngineeringWeeks)],
        ["Functional risk", formatWeeks(breakdown.effort?.functionalRiskWeeks)],
        ["Quality risk", formatWeeks(breakdown.effort?.qualityRiskWeeks)],
        ["Ownership risk", formatWeeks(breakdown.effort?.ownershipRiskWeeks)],
        ["Delivery risk", formatWeeks(breakdown.effort?.deliveryRiskWeeks)],
        ["Enterprise need", formatWeeks(breakdown.effort?.enterpriseNeedWeeks)],
        ["Scale adjustment", formatWeeks(breakdown.effort?.scaleAdjustmentWeeks)],
        ["Pre-adjustment engineering", formatWeeks(breakdown.effort?.preAdjustmentEngineeringWeeks)],
        ["Absorption reduction", formatWeeks(breakdown.effort?.absorptionReductionWeeks)],
        ["Downside tail addition", formatWeeks(breakdown.effort?.downsideTailAdditionWeeks)],
        ["Adjusted engineering", formatWeeks(breakdown.effort?.adjustedEngineeringWeeks)],
        ["Rework allowance", formatWeeks(breakdown.effort?.reworkAllowanceWeeks)],
        ["Total engineering", formatWeeks(breakdown.effort?.totalEngineeringWeeks)]
      ]
    : [
        ["Base engineering", formatWeeks(breakdown.effort?.baseEngineeringWeeks)],
        ["Functional risk", formatWeeks(breakdown.effort?.functionalRiskWeeks)],
        ["Quality risk", formatWeeks(breakdown.effort?.qualityRiskWeeks)],
        ["Delivery risk", formatWeeks(breakdown.effort?.deliveryRiskWeeks)],
        ["Integration risk", formatWeeks(breakdown.effort?.integrationRiskWeeks)],
        ["Coverage gap", formatWeeks(breakdown.effort?.coverageGapWeeks)],
        ["Support gap", formatWeeks(breakdown.effort?.supportGapWeeks)],
        ["Coverage shield reduction", formatWeeks(breakdown.effort?.coverageShieldReductionWeeks)],
        ["Pre-adjustment engineering", formatWeeks(breakdown.effort?.preAdjustmentEngineeringWeeks)],
        ["Adoption burden", formatWeeks(breakdown.effort?.adoptionBurdenWeeks)],
        ["Leverage reduction", formatWeeks(breakdown.effort?.leverageReductionWeeks)],
        ["Adjusted engineering", formatWeeks(breakdown.effort?.adjustedEngineeringWeeks)],
        ["Rework allowance", formatWeeks(breakdown.effort?.reworkAllowanceWeeks)],
        ["Total engineering", formatWeeks(breakdown.effort?.totalEngineeringWeeks)]
      ];

  const scheduleRows = [
    ["Velocity factor", `${formatNumber(breakdown.schedule?.velocityFactor, 2)}x`],
    ["Engineering calendar", formatWeeks(breakdown.schedule?.engineeringCalendarWeeks)],
    ["Schedule slip", formatWeeks(breakdown.schedule?.slipWeeks)],
    ["Rollout overhead", formatWeeks(breakdown.schedule?.appRolloutOverheadWeeks)],
    ["Launch estimate", formatWeeks(breakdown.schedule?.launchWeeks)]
  ];

  const maintenanceRows = isBuild
    ? [
        ["Base maintenance", formatWeeks(breakdown.maintenance?.baseMaintenanceWeeks)],
        ["Absorption reduction", formatWeeks(breakdown.maintenance?.absorptionReductionWeeks)],
        ["Downside tail addition", formatWeeks(breakdown.maintenance?.downsideTailAdditionWeeks)],
        ["Maintenance estimate", formatWeeks(breakdown.maintenance?.maintenanceWeeks)]
      ]
    : [
        ["Base maintenance", formatWeeks(breakdown.maintenance?.baseMaintenanceWeeks)],
        ["Integration risk", formatWeeks(breakdown.maintenance?.integrationRiskWeeks)],
        ["Coverage gap", formatWeeks(breakdown.maintenance?.coverageGapWeeks)],
        ["Support gap", formatWeeks(breakdown.maintenance?.supportGapWeeks)],
        ["Adoption burden", formatWeeks(breakdown.maintenance?.adoptionBurdenWeeks)],
        ["Leverage reduction", formatWeeks(breakdown.maintenance?.leverageReductionWeeks)],
        ["Maintenance estimate", formatWeeks(breakdown.maintenance?.maintenanceWeeks)]
      ];

  const costRows = [
    ["Labor cost per week", formatBreakdownCurrency(breakdown.cost?.laborCostPerWeek)],
    [
      "Engineering + maintenance",
      formatWeeks(breakdown.cost?.engineeringAndMaintenanceWeeks)
    ],
    ["Labor cost", formatBreakdownCurrency(breakdown.cost?.laborCost)],
    ...(isBuild
      ? []
      : [
          [
            "Estimated licensed developers",
            Number.isFinite(Number(breakdown.cost?.estimatedLicensedDevelopers))
              ? `${Number(breakdown.cost.estimatedLicensedDevelopers)}`
              : "N/A"
          ]
        ]),
    ["License cost", formatBreakdownCurrency(breakdown.cost?.licenseCost)],
    ["Total cost", formatBreakdownCurrency(breakdown.cost?.totalCost)]
  ];

  return [
    { title: "Engineering effort", rows: effortRows },
    { title: "Schedule", rows: scheduleRows },
    { title: "Maintenance", rows: maintenanceRows },
    { title: "Cost", rows: costRows }
  ];
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

const factorDisplayConfig = {
  functionalComplexity: {
    title: "Functional complexity",
    scaleType: "burden",
    labelNoun: "scope complexity"
  },
  qualityBurden: {
    title: "Quality burden",
    scaleType: "burden",
    labelNoun: "quality burden"
  },
  deliveryMaturity: {
    title: "Delivery maturity",
    scaleType: "strength",
    labelNoun: "delivery strength"
  },
  ownershipBurden: {
    title: "Ownership burden",
    scaleType: "burden",
    labelNoun: "ownership burden"
  },
  enterpriseReadiness: {
    title: "Enterprise readiness",
    scaleType: "readiness",
    labelNoun: "enterprise readiness"
  },
  implementationInterdependency: {
    title: "Implementation interdependency",
    scaleType: "burden",
    labelNoun: "implementation interdependency"
  },
  performancePressure: {
    title: "Performance pressure",
    scaleType: "burden",
    labelNoun: "performance pressure"
  },
  muiPerformanceReadiness: {
    title: "MUI performance readiness",
    scaleType: "strength",
    labelNoun: "MUI performance readiness"
  },
  muiPerformanceBurden: {
    title: "MUI performance burden",
    scaleType: "burden",
    labelNoun: "MUI performance burden"
  },
  buildPerformanceReadiness: {
    title: "Build performance readiness",
    scaleType: "strength",
    labelNoun: "build performance readiness"
  },
  buildPerformanceBurden: {
    title: "Build performance burden",
    scaleType: "burden",
    labelNoun: "build performance burden"
  }
};

function getBand(score) {
  if (!Number.isFinite(score)) {
    return "unknown";
  }

  if (score >= 67) {
    return "high";
  }

  if (score >= 34) {
    return "medium";
  }

  return "low";
}

function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

function getFactorDisplayLabel(factorKey, score) {
  const config = factorDisplayConfig[factorKey];
  const band = getBand(score);

  if (!config) {
    return capitalize(band);
  }

  return `${capitalize(band)} ${config.labelNoun}`;
}

function getFactorTitle(factorKey) {
  return factorDisplayConfig[factorKey]?.title ?? factorKey ?? "Factor";
}

function getFactorTone(factorKey, score) {
  const config = factorDisplayConfig[factorKey];
  const band = getBand(score);

  if (!config) {
    return "neutral";
  }

  if (config.scaleType === "strength") {
    if (band === "high") {
      return "positive";
    }

    if (band === "medium") {
      return "caution";
    }

    return "risk";
  }

  if (config.scaleType === "burden") {
    if (band === "high") {
      return "risk";
    }

    if (band === "medium") {
      return "caution";
    }

    return "positive";
  }

  if (band === "high") {
    return "positive";
  }

  if (band === "medium") {
    return "caution";
  }

  return "neutral";
}

function getToneColor(tone) {
  return {
    positive: "success.main",
    caution: "warning.main",
    risk: "error.main",
    neutral: "grey.500"
  }[tone] ?? "grey.500";
}

function getToneChipColor(tone) {
  return {
    positive: "success",
    caution: "warning",
    risk: "error",
    neutral: "default"
  }[tone] ?? "default";
}

function getDecisionFactorTone(title, score) {
  const band = getBand(score);

  if (title === "Scope burden") {
    if (band === "high") {
      return "risk";
    }

    if (band === "medium") {
      return "caution";
    }

    return "positive";
  }

  if (title === "Internal absorption") {
    if (band === "high") {
      return "positive";
    }

    if (band === "medium") {
      return "caution";
    }

    return "risk";
  }

  if (band === "high") {
    return "positive";
  }

  if (band === "medium") {
    return "caution";
  }

  return "neutral";
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

function buildDecisionFactors(result, assessmentInput) {
  const comparison = result.comparison ?? {};
  const derived = result.derivedFactors ?? {};
  const modeledMuiPathFit = result.modeledMuiPathFit ?? {};
  const functionalScore = Number(derived.functionalComplexity?.score) || 0;
  const qualityScore = Number(derived.qualityBurden?.score) || 0;
  const deliveryScore = Number(derived.deliveryMaturity?.score) || 0;
  const ownershipScore = Number(derived.ownershipBurden?.score) || 0;
  const existingMuiUsage = assessmentInput?.existingMuiUsage;
  const performanceSensitivity = assessmentInput?.performanceSensitivity;
  const knowledgeConcentration = assessmentInput?.knowledgeConcentration;
  const designDevHandoffFriction = assessmentInput?.designDevHandoffFriction;
  const componentStandardizationGoal =
    assessmentInput?.componentStandardizationGoal;
  const productionCriticality = assessmentInput?.productionCriticality;
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
      label: "Rule-based fit",
      summary:
        "How much work the UI requirement creates before delivery timing and TCO are modeled.",
      details: [
        `Functional complexity is ${formatNumber(functionalScore)}/100 and quality burden is ${formatNumber(qualityScore)}/100.`,
        `Performance sensitivity is ${formatLabel("performanceSensitivity", performanceSensitivity)} and design-dev handoff friction is ${formatLabel("designDevHandoffFriction", designDevHandoffFriction)}.`,
        "Higher scope burden makes a custom build harder to keep predictable."
      ]
    },
    {
      title: "Internal absorption",
      score: internalAbsorptionScore,
      label: "Rule-based fit",
      summary:
        "How well the team can absorb custom build work with the current delivery and ownership setup.",
      details: [
        `Delivery maturity is ${formatNumber(deliveryScore)}/100 and ownership burden is ${formatNumber(ownershipScore)}/100.`,
        `Knowledge concentration is ${formatLabel("knowledgeConcentration", knowledgeConcentration)}.`,
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
        `Component standardization goal is ${formatLabel("componentStandardizationGoal", componentStandardizationGoal)} and production criticality is ${formatLabel("productionCriticality", productionCriticality)}.`,
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
  const ownershipHorizon = Number(assessmentInput?.ownershipHorizon) || 0;
  const reactApps = Number(assessmentInput?.reactApps) || 0;
  const frontendDevelopers = Number(assessmentInput?.frontendDevelopers) || 0;
  const deadlinePressure = assessmentInput?.deadlinePressure;
  const performanceSensitivity = assessmentInput?.performanceSensitivity;
  const accessibilityTarget = assessmentInput?.accessibilityTarget;
  const changeLeadTime = assessmentInput?.changeLeadTime;
  const reworkFrequency = assessmentInput?.reworkFrequency;
  const knowledgeConcentration = assessmentInput?.knowledgeConcentration;
  const designDevHandoffFriction = assessmentInput?.designDevHandoffFriction;
  const componentStandardizationGoal =
    assessmentInput?.componentStandardizationGoal;
  const productionCriticality = assessmentInput?.productionCriticality;
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
  const operatingPressureScore = clamp(
    (productionCriticality === "regulated-or-sla-backed"
      ? 44
      : productionCriticality === "revenue-critical"
        ? 34
        : productionCriticality === "customer-facing"
          ? 22
          : 10) +
      (performanceSensitivity === "measured-core-web-vitals-target"
        ? 16
        : performanceSensitivity === "strict-budget"
          ? 11
          : performanceSensitivity === "important"
            ? 6
            : 0),
    0,
    100
  );
  const maintenanceScore = clamp(
    (ownershipHorizon / 36) * 42 +
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
      detail:
        `${formatLabel("primaryUseCase", primaryUseCase)} currently carries ${advancedFeatureCount || "no"} additional advanced behavior${advancedFeatureCount === 1 ? "" : "s"}, ${dataHeavyScreens} data-heavy screen${dataHeavyScreens === 1 ? "" : "s"}, and a ${formatLabel("expectedRows", expectedRows)} by ${formatLabel("expectedColumns", expectedColumns)} scale profile. Performance sensitivity is ${formatLabel("performanceSensitivity", performanceSensitivity)}.`,
      implication:
        "More advanced behaviors and larger data scale raise implementation, integration, and QA risk."
    },
    {
      title: "Schedule overrun exposure",
      score: scheduleRiskScore,
      detail: `The model puts the in-house path above 20 weeks in about ${formatProbability(comparison.probabilityBuildExceeds20Weeks)}, versus ${formatProbability(comparison.probabilityMuiExceeds20Weeks)} for ${result.muiPath?.label ?? "the packaged path"}.`,
      implication:
        "Higher schedule pressure increases the chance that the build path slips beyond the preferred window."
    },
    {
      title: "Support and accessibility expectations",
      score: supportScore,
      detail: `Current support need is ${formatLabel("supportRequirement", supportRequirement)} with a ${formatLabel("accessibilityTarget", accessibilityTarget)} accessibility target and ${formatLabel("productionCriticality", productionCriticality)} production criticality.`,
      implication:
        "Higher assurance requirements increase the value of vendor-backed behavior, fixes, and support channels."
    },
    {
      title: "Ownership continuity",
      score: maintenanceScore,
      detail: `The model assumes a ${formatLabel("ownershipHorizon", assessmentInput?.ownershipHorizon)} ownership horizon with ${formatLabel("dependentTeams", dependentTeams)} dependent teams, ${formatLabel("ownershipModel", ownershipModel)} ownership, and ${formatLabel("knowledgeConcentration", knowledgeConcentration)} knowledge concentration.`,
      implication:
        "Longer ownership windows and staffing churn make ongoing custom maintenance more consequential."
    },
    {
      title: "Rollout footprint and reuse",
      score: rolloutScore,
      detail: `${frontendDevelopers || "A small number of"} frontend developer${frontendDevelopers === 1 ? "" : "s"} support ${reactApps || "a limited number of"} React app${reactApps === 1 ? "" : "s"}, with ${formatLabel("existingMuiUsage", existingMuiUsage)} MUI usage, ${formatLabel("designSystemMaturity", assessmentInput?.designSystemMaturity)} maturity, ${formatLabel("designDevHandoffFriction", designDevHandoffFriction)} handoff friction, and a ${formatLabel("componentStandardizationGoal", componentStandardizationGoal)} standardization goal today.`,
      implication:
        "More shared usage increases the value of consistency, but also raises the cost of a poorly governed component layer."
    },
    {
      title: "Operating pressure",
      score: operatingPressureScore,
      detail: `Production pressure is framed by ${formatLabel("productionCriticality", productionCriticality)} criticality and ${formatLabel("performanceSensitivity", performanceSensitivity)} performance sensitivity.`,
      implication:
        "SLA-style or revenue-sensitive operating pressure raises the cost of regressions and sustained underperformance."
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
    `Knowledge: ${formatLabel("knowledgeConcentration", assessmentInput.knowledgeConcentration)}`,
    `Handoff: ${formatLabel("designDevHandoffFriction", assessmentInput.designDevHandoffFriction)}`,
    `Standardization: ${formatLabel("componentStandardizationGoal", assessmentInput.componentStandardizationGoal)}`,
    `Performance: ${formatLabel("performanceSensitivity", assessmentInput.performanceSensitivity)}`,
    `Criticality: ${formatLabel("productionCriticality", assessmentInput.productionCriticality)}`,
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

function getSensitivityDriverScore(driver, metricKey) {
  const deltas = driver?.deltas ?? {};

  if (metricKey === "buildLaunchWeeks") {
    return clamp(
      Math.abs(deltas.buildLaunchWeeks ?? 0) * 16 +
        Math.abs(deltas.confidence ?? 0) * 1.4,
      0,
      100
    );
  }

  if (metricKey === "muiLaunchWeeks") {
    return clamp(
      Math.abs(deltas.muiLaunchWeeks ?? 0) * 16 +
        Math.abs(deltas.confidence ?? 0) * 1.4,
      0,
      100
    );
  }

  if (metricKey === "tcoDelta") {
    return clamp(
      Math.abs(deltas.tcoDelta ?? 0) / 2200 + Math.abs(deltas.confidence ?? 0) * 1.1,
      0,
      100
    );
  }

  return clamp(
    Math.abs(deltas.confidence ?? 0) * 1.6 +
      Math.abs(deltas.buildLaunchWeeks ?? 0) * 5 +
      Math.abs(deltas.muiLaunchWeeks ?? 0) * 5,
    0,
    100
  );
}

function SensitivityDriverCard({ driver, metricKey }) {
  const score = getSensitivityDriverScore(driver, metricKey);

  return (
    <Card elevation={0} sx={{ height: "100%", border: 1, borderColor: "divider" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="flex-start">
            <Box>
              <Typography variant="h6" component="h3">
                {driver.label ?? driver.inputKey}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tested change: {driver.testedChange}
              </Typography>
            </Box>
            <Chip label={driver.direction ?? "mixed"} size="small" variant="outlined" />
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
                bgcolor:
                  driver.direction === "cost-only"
                    ? "secondary.main"
                    : driver.direction?.startsWith("increases")
                      ? "error.main"
                      : driver.direction?.startsWith("reduces")
                        ? "success.main"
                        : "primary.main"
              }
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {driver.impactSummary}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function EstimateBreakdownCard({ title, breakdown, pathKey }) {
  const sections = buildEstimateBreakdownSections(pathKey, breakdown);

  if (!breakdown || sections.length === 0) {
    return null;
  }

  return (
    <Card
      elevation={0}
      sx={{ height: "100%", border: 1, borderColor: "divider", bgcolor: "background.default" }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h6" component="h3">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Central estimate components before uncertainty is sampled. Not a guarantee.
            </Typography>
          </Box>

          <Stack spacing={2}>
            {sections.map((section) => (
              <Box key={section.title}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  {section.title}
                </Typography>
                <TableContainer sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}>
                  <Table size="small">
                    <TableBody>
                      {section.rows.map(([label, value]) => (
                        <TableRow key={label}>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ color: "text.secondary", py: 1 }}
                          >
                            {label}
                          </TableCell>
                          <TableCell align="right" sx={{ py: 1, fontWeight: 700 }}>
                            {value}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

const modelLeverLabels = {
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

function SourceChipRow({ sourceKeys, sourceMap }) {
  const sources = (Array.isArray(sourceKeys) ? sourceKeys : [])
    .map((key) => sourceMap[key])
    .filter(Boolean);

  if (sources.length === 0) {
    return null;
  }

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {sources.map((source) => (
        <Chip
          key={source.key}
          label={source.shortLabel}
          size="small"
          component="a"
          clickable
          href={source.url}
          target="_blank"
          rel="noreferrer"
          variant="outlined"
        />
      ))}
    </Stack>
  );
}

function FactorCard({ title, factor }) {
  const score = Number(factor?.score);
  const drivers = Array.isArray(factor?.drivers) ? factor.drivers.slice(0, 4) : [];
  const key = factor?.key;
  const config = factorDisplayConfig[key] ?? null;
  const tone = getFactorTone(key, score);
  const label = getFactorDisplayLabel(key, score);
  const barColor = getToneColor(tone);

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
                {config ? label : "Model factor"}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="flex-end">
              {Number.isFinite(score) ? (
                <Chip label={`${formatNumber(score)}/100`} size="small" />
              ) : null}
              <Chip
                label={config ? label : (factor?.level ?? "unknown")}
                size="small"
                color={getToneChipColor(tone)}
                variant={tone === "neutral" ? "outlined" : "filled"}
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
                bgcolor: barColor
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

function EvidenceItem({ item, sourceMap }) {
  const appliesBecause = Array.isArray(item?.appliesBecause) ? item.appliesBecause.filter(Boolean) : [];

  return (
    <Stack spacing={1.25}>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Typography variant="subtitle2" component="h4">
          {getFactorTitle(item?.factor)}
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
      <SourceChipRow sourceKeys={item?.sourceKeys} sourceMap={sourceMap} />
    </Stack>
  );
}

function EvidenceBasisGroup({ basis, items, sourceMap }) {
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
                <EvidenceItem item={item} sourceMap={sourceMap} />
              </Box>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function ReportPage() {
  const assessmentInput = readStoredAssessmentInput();
  const simulationResult = readStoredObject("simulationResult");
  const isDeterministicFitReport =
    simulationResult?.modelVersion === CURRENT_MODEL_VERSION;
  const isLegacyReport =
    Boolean(simulationResult) &&
    (isDeterministicFitReport
      ? simulationResult.calibrationVersion !== CURRENT_CALIBRATION_VERSION
      : simulationResult.modelVersion !== LEGACY_MODEL_VERSION ||
        simulationResult.calibrationVersion !== CURRENT_CALIBRATION_VERSION ||
        simulationResult.recommendationPolicyVersion !==
          CURRENT_RECOMMENDATION_POLICY_VERSION);

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

  if (isDeterministicFitReport) {
    const recommendation = simulationResult.recommendation ?? {};
    const confidence = simulationResult.confidence ?? {};
    const derivedFactors = simulationResult.derivedFactors ?? {};
    const pathFits = simulationResult.pathFits ?? {};
    const diagnostics = simulationResult.diagnostics ?? {};
    const publicSourceMap = getPublicSourceMap(
      [
        ...(Array.isArray(simulationResult.publicSources)
          ? simulationResult.publicSources
          : []),
        ...PUBLIC_SOURCES,
        ...PUBLIC_BENCHMARK_SOURCES
      ]
    );
    const derivedFactorEntries = [
      ["functionalComplexity", derivedFactors.functionalComplexity],
      ["qualityBurden", derivedFactors.qualityBurden],
      ["deliveryMaturity", derivedFactors.deliveryMaturity],
      ["ownershipBurden", derivedFactors.ownershipBurden],
      ["enterpriseReadiness", derivedFactors.enterpriseReadiness]
    ].filter(([, factor]) => factor);
    const pathFitEntries = Object.values(pathFits).sort(
      (left, right) => (right?.score ?? 0) - (left?.score ?? 0)
    );
    const evidenceBasisGroups = groupEvidenceBasis(diagnostics.evidenceBasis);
    const scenarioChips = assessmentInput
      ? [
          formatLabel("primaryUseCase", assessmentInput.primaryUseCase),
          `${formatLabel("supportRequirement", assessmentInput.supportRequirement)} support`,
          formatLabel(
            "productionCriticality",
            assessmentInput.productionCriticality
          )
        ]
      : ["Deterministic fit model"];

    return (
      <Stack spacing={4}>
        {isLegacyReport ? (
          <Alert severity="warning" variant="outlined">
            This report was generated with an older deterministic calibration. Rerun the assessment for the latest fit model.
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
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={3}>
                <PageHero
                  eyebrow="1. Recommendation"
                  title={recommendation.option ?? "Recommendation unavailable"}
                  description={
                    recommendation.summary ??
                    "The model did not return a deterministic recommendation."
                  }
                  chips={scenarioChips}
                />
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 760 }}>
                  This report uses deterministic fit scoring. It does not estimate launch dates, TCO, or probabilities.
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
                      Deterministic confidence
                    </Typography>
                    <MeterRow
                      label="Confidence"
                      valueLabel={`${confidence.score ?? 0}/100`}
                      progress={confidence.score ?? 0}
                      helper={confidence.rationale}
                    />
                    <Divider />
                    <MeterRow
                      label="Runner-up gap"
                      valueLabel={formatNumber(
                        recommendation.runnerUp?.scoreGap ?? confidence.components?.scoreGap ?? 0
                      )}
                      progress={clamp(
                        (recommendation.runnerUp?.scoreGap ??
                          confidence.components?.scoreGap ??
                          0) * 4,
                        0,
                        100
                      )}
                      helper={`${recommendation.runnerUp?.label ?? "Runner-up"} is the next-closest path.`}
                      barColor="secondary.main"
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <SectionCard
          title="2. Path ranking"
          description="Each path fit is a deterministic scorecard, not a delivery or cost estimate."
        >
          <Grid container spacing={2.5}>
            {pathFitEntries.map((path) => (
              <Grid key={path.key} size={{ xs: 12, md: 6 }}>
                <Card elevation={0} sx={{ height: "100%", border: 1, borderColor: "divider" }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                        <Typography variant="h6">{path.label}</Typography>
                        <Chip
                          size="small"
                          label={`${formatNumber(path.score)}/100`}
                          color={path.key === recommendation.key ? "secondary" : "default"}
                        />
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={clamp(path.score ?? 0, 0, 100)}
                        sx={{ height: 10, borderRadius: 999 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {path.eligible === false
                          ? "Not currently eligible even if some fit signals are positive."
                          : `${path.level} fit for this input set.`}
                      </Typography>
                      {Array.isArray(path.strengths) && path.strengths.length > 0 ? (
                        <Stack spacing={0.75}>
                          <Typography variant="subtitle2">Strengths</Typography>
                          {path.strengths.slice(0, 3).map((item) => (
                            <Typography key={`${path.key}-strength-${item}`} variant="body2" color="text.secondary">
                              {item}
                            </Typography>
                          ))}
                        </Stack>
                      ) : null}
                      {Array.isArray(path.drags) && path.drags.length > 0 ? (
                        <Stack spacing={0.75}>
                          <Typography variant="subtitle2">Drags</Typography>
                          {path.drags.slice(0, 3).map((item) => (
                            <Typography key={`${path.key}-drag-${item}`} variant="body2" color="text.secondary">
                              {item}
                            </Typography>
                          ))}
                        </Stack>
                      ) : null}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </SectionCard>

        {derivedFactorEntries.length > 0 ? (
          <SectionCard
            title="3. Derived factors"
            description="These five factor scores are the base signals that feed the deterministic path-fit model."
          >
            <Grid container spacing={2.5}>
              {derivedFactorEntries.map(([key, factor]) => (
                <Grid key={key} size={{ xs: 12, md: 6 }}>
                  <FactorCard
                    title={getFactorTitle(key)}
                    factor={{ ...factor, key }}
                  />
                </Grid>
              ))}
            </Grid>
          </SectionCard>
        ) : null}

        {evidenceBasisGroups.length > 0 ? (
          <SectionCard
            title="4. Evidence basis"
            description="Public sources inform variable selection and risk direction, not exact coefficients."
          >
            <Stack spacing={2.5}>
              <SourceChipRow
                sourceKeys={(simulationResult.publicSources ?? PUBLIC_BENCHMARK_SOURCES).map((source) => source.key)}
                sourceMap={publicSourceMap}
              />
              <Grid container spacing={2.5}>
                {evidenceBasisGroups.map((group) => (
                  <Grid key={group.basis} size={{ xs: 12, md: 6 }}>
                    <EvidenceBasisGroup
                      basis={group.basis}
                      items={group.items}
                      sourceMap={publicSourceMap}
                    />
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </SectionCard>
        ) : null}

        <SectionCard
          title="5. Assumptions"
          description="These are the active modeling guardrails for the saved result."
        >
          <Stack spacing={1.25}>
            {(simulationResult.assumptions ?? []).map((assumption) => (
              <Typography key={assumption} variant="body2" color="text.secondary">
                {assumption}
              </Typography>
            ))}
          </Stack>
        </SectionCard>
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
  const estimateBreakdown =
    simulationResult.diagnostics?.estimateBreakdown ??
    simulationResult.estimateBreakdown ??
    null;
  const sensitivity =
    simulationResult.sensitivity ?? simulationResult.diagnostics?.sensitivity ?? null;
  const showEstimateBreakdown =
    Boolean(estimateBreakdown?.build) && Boolean(estimateBreakdown?.mui);
  const showSensitivity =
    Boolean(sensitivity) &&
    (Array.isArray(sensitivity.topDrivers) && sensitivity.topDrivers.length > 0);
  const publicSourceMap = getPublicSourceMap(
    [
      ...(Array.isArray(simulationResult.publicSources)
        ? simulationResult.publicSources
        : []),
      ...PUBLIC_SOURCES,
      ...PUBLIC_BENCHMARK_SOURCES
    ]
  );
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
        ["downsideTailRisk", modelLevers.downsideTailRisk],
        ["performancePressure", modelLevers.performancePressure],
        ["muiPerformanceReadiness", modelLevers.muiPerformanceReadiness],
        ["muiPerformanceBurden", modelLevers.muiPerformanceBurden],
        ["buildPerformanceReadiness", modelLevers.buildPerformanceReadiness],
        ["buildPerformanceBurden", modelLevers.buildPerformanceBurden]
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
          description="This is a scenario model, not a guarantee. Public sources inform variable selection and risk direction, not the exact coefficients used in the simulation."
        >
          <Stack spacing={4}>
            {derivedFactorEntries.length > 0 ? (
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="h6" component="h3">
                    Derived factors
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    These summarize the input set into the five derived factors used by the recommendation and simulation.
                  </Typography>
                </Box>
                <Grid container spacing={2.5}>
                  {derivedFactorEntries.map(([key, factor]) => (
                    <Grid key={key} size={{ xs: 12, md: 6 }}>
                      <FactorCard
                        title={getFactorTitle(key)}
                        factor={{ ...factor, key }}
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
                    Benchmark-informed assumptions
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Public sources justify the uncertainty families included in the model. The numeric ranges are calibrated by the assessment inputs and product heuristics.
                  </Typography>
                </Box>
                <SourceChipRow
                  sourceKeys={(simulationResult.publicSources ?? PUBLIC_BENCHMARK_SOURCES).map((source) => source.key)}
                  sourceMap={publicSourceMap}
                />
                <Typography variant="caption" color="text.secondary">
                  Public sources inform variable selection and risk-shape choices; they are not used as exact certified coefficients.
                </Typography>
                <Grid container spacing={2.5}>
                  {evidenceBasisGroups.map((group) => (
                    <Grid key={group.basis} size={{ xs: 12, md: 6 }}>
                      <EvidenceBasisGroup
                        basis={group.basis}
                        items={group.items}
                        sourceMap={publicSourceMap}
                      />
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
                label="Overall recommendation fit"
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
                helper="Useful context, but deliberately not the dominant factor."
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
                  These scores are rule-based fit scores only. The final recommendation also
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
                            </Stack>
                          </Stack>

                          <MeterRow
                            label={factor.title}
                            valueLabel={`${formatNumber(factor.score)}/100`}
                            progress={factor.score}
                            helper="Rule-based fit score only"
                            barColor={getToneColor(
                              getDecisionFactorTone(factor.title, factor.score)
                            )}
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

              <Divider />

              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="h6" component="h3">
                    Estimate breakdown
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 760 }}>
                    How the model assembles launch time and TCO before uncertainty is sampled.
                    These are central estimate components, not a guarantee. The Monte Carlo
                    median and P90 can differ because random variance and tail risk are sampled.
                  </Typography>
                </Box>

                {showEstimateBreakdown ? (
                  <Accordion
                    elevation={0}
                    disableGutters
                    expandIcon={
                      <Box
                        component="span"
                        sx={{ color: "text.secondary", fontSize: 18, lineHeight: 1 }}
                      >
                        ⌄
                      </Box>
                    }
                    sx={{
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 3,
                      overflow: "hidden",
                      "&:before": { display: "none" }
                    }}
                  >
                    <AccordionSummary sx={{ px: 2.5, py: 1.5 }}>
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle1" component="div">
                          Deterministic breakdown
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Central estimate components for Build and the modeled MUI path.
                        </Typography>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 2.5, pb: 2.5 }}>
                      <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <EstimateBreakdownCard
                            title="Build in-house"
                            breakdown={estimateBreakdown.build}
                            pathKey="build"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <EstimateBreakdownCard
                            title={muiPath.label ?? "MUI path"}
                            breakdown={estimateBreakdown.mui}
                            pathKey="mui"
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ) : (
                  <Alert severity="info" variant="outlined">
                    This saved result predates deterministic estimate breakdowns. Rerun the
                    assessment to see the assembled launch and TCO components.
                  </Alert>
                )}
              </Stack>
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
          <Typography variant="caption" color="text.secondary">
            P90 TCO includes downside risk from overrun, rework, integration, and maintenance uncertainty.
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

      <SectionCard
        title="8. Top model drivers"
        description="Inputs that most changed the deterministic estimate or recommendation signal."
      >
        {showSensitivity ? (
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              This diagnostic reruns the deterministic estimate with nearby input changes. It does
              not rerun the full uncertainty simulation, so it is best read as a model-debugging
              signal.
            </Typography>
            <Accordion
              elevation={0}
              disableGutters
              defaultExpanded
              expandIcon={
                <Box component="span" sx={{ color: "text.secondary", fontSize: 18, lineHeight: 1 }}>
                  ⌄
                </Box>
              }
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 3,
                overflow: "hidden",
                "&:before": { display: "none" }
              }}
            >
              <AccordionSummary sx={{ px: 2.5, py: 1.5 }}>
                <Stack spacing={0.5}>
                  <Typography variant="subtitle1" component="div">
                    Deterministic adjacent-input sensitivity
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nearby input perturbations only. Not a Monte Carlo rerun.
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Evaluated {formatNumber(sensitivity.candidateCount ?? 0)} candidate changes.
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2.5, pb: 2.5 }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="overline" color="secondary.main">
                      Top 5 overall
                    </Typography>
                    <Grid container spacing={2.5} sx={{ mt: 0.25 }}>
                      {sensitivity.topDrivers.map((driver) => (
                        <Grid key={`${driver.inputKey}-${driver.testedChange}`} size={{ xs: 12, md: 6 }}>
                          <SensitivityDriverCard driver={driver} metricKey="overall" />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="overline" color="secondary.main">
                      Build launch drivers
                    </Typography>
                    <Grid container spacing={2.5} sx={{ mt: 0.25 }}>
                      {sensitivity.buildLaunchDrivers.map((driver) => (
                        <Grid key={`build-${driver.inputKey}-${driver.testedChange}`} size={{ xs: 12, md: 6 }}>
                          <SensitivityDriverCard driver={driver} metricKey="buildLaunchWeeks" />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="overline" color="secondary.main">
                      MUI launch drivers
                    </Typography>
                    <Grid container spacing={2.5} sx={{ mt: 0.25 }}>
                      {sensitivity.muiLaunchDrivers.map((driver) => (
                        <Grid key={`mui-${driver.inputKey}-${driver.testedChange}`} size={{ xs: 12, md: 6 }}>
                          <SensitivityDriverCard driver={driver} metricKey="muiLaunchWeeks" />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="overline" color="secondary.main">
                      TCO drivers
                    </Typography>
                    <Grid container spacing={2.5} sx={{ mt: 0.25 }}>
                      {sensitivity.tcoDrivers.map((driver) => (
                        <Grid key={`tco-${driver.inputKey}-${driver.testedChange}`} size={{ xs: 12, md: 6 }}>
                          <SensitivityDriverCard driver={driver} metricKey="tcoDelta" />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Stack>
        ) : (
          <Alert severity="info" variant="outlined">
            This saved result predates the deterministic sensitivity diagnostics. Rerun the
            assessment to see top model drivers.
          </Alert>
        )}
      </SectionCard>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard
            title="9. Assumptions"
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
                        `Ownership horizon: ${formatLabel("ownershipHorizon", assessmentInput.ownershipHorizon)}`
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
            title="10. What would change the recommendation"
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
        title="11. CTA to rerun assessment"
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
