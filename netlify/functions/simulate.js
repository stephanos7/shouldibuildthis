import { PUBLIC_BENCHMARK_SOURCES } from "../../src/data/publicSources.js";
import {
  CALIBRATION_VERSION,
} from "../../src/model/calibration.js";
import { resolveActiveCalibration } from "../../src/model/calibrationRegistry.js";

const MODEL_VERSION = "deterministic-fit-v2";

const EXISTING_MUI_USAGE = new Set(["none", "some", "standardized"]);
const DESIGN_SYSTEM_MATURITY = new Set(["low", "medium", "high"]);
const DEPENDENT_TEAMS = new Set([
  "one",
  "two-three",
  "four-seven",
  "eight-plus"
]);
const OWNERSHIP_MODELS = new Set([
  "same-product-team",
  "frontend-platform-team",
  "several-teams-informal",
  "unclear"
]);
const PRIMARY_USE_CASES = new Set([
  "data-grid",
  "charts",
  "date-pickers",
  "tree-view",
  "scheduler",
  "multi-component"
]);
const ACCESSIBILITY_TARGETS = new Set([
  "none",
  "wcag-a",
  "wcag-aa",
  "wcag-aaa-regulated"
]);
const CHANGE_LEAD_TIMES = new Set([
  "less-than-day",
  "one-day-to-one-week",
  "one-week-to-one-month",
  "more-than-month",
  "unknown"
]);
const PERFORMANCE_SENSITIVITY = new Set([
  "not-critical",
  "important",
  "strict-budget",
  "measured-core-web-vitals-target"
]);
const KNOWLEDGE_CONCENTRATION = new Set([
  "shared",
  "few-owners",
  "single-owner",
  "unknown"
]);
const DESIGN_DEV_HANDOFF_FRICTION = new Set([
  "low",
  "medium",
  "high",
  "unknown"
]);
const COMPONENT_STANDARDIZATION_GOALS = new Set([
  "none",
  "reduce-one-offs",
  "shared-pattern",
  "platform-standard"
]);
const PRODUCTION_CRITICALITY = new Set([
  "internal-tool",
  "customer-facing",
  "revenue-critical",
  "regulated-or-sla-backed"
]);
const REWORK_FREQUENCIES = new Set([
  "rare",
  "occasional",
  "frequent",
  "unknown"
]);
const PRESSURE_LEVELS = new Set(["low", "medium", "high"]);
const EXPECTED_ROWS = new Set(["under-1k", "1k-10k", "10k-100k", "over-100k"]);
const EXPECTED_COLUMNS = new Set(["under-10", "10-30", "over-30"]);
const SUPPORT_REQUIREMENTS = new Set([
  "community",
  "standard",
  "priority",
  "procurement-sla"
]);
const OWNERSHIP_HORIZONS = new Set([12, 24, 36]);
const ADVANCED_FEATURES = new Set([
  "virtualization",
  "inline-editing",
  "server-side-data",
  "keyboard-navigation",
  "exporting",
  "drag-and-drop",
  "custom-rendering",
  "timezone-logic",
  "i18n-localization"
]);

const ACCESSIBILITY_TARGET_INDEX = {
  none: 0,
  "wcag-a": 1,
  "wcag-aa": 2,
  "wcag-aaa-regulated": 3
};

const CHANGE_LEAD_TIME_INDEX = {
  "less-than-day": 4,
  "one-day-to-one-week": 3,
  "one-week-to-one-month": 2,
  "more-than-month": 1,
  unknown: 2
};

const REWORK_FREQUENCY_INDEX = {
  rare: 4,
  occasional: 3,
  frequent: 1,
  unknown: 2
};

const PERFORMANCE_SENSITIVITY_INDEX = {
  "not-critical": 0,
  important: 1,
  "strict-budget": 2,
  "measured-core-web-vitals-target": 3
};

const KNOWLEDGE_CONCENTRATION_INDEX = {
  shared: 0,
  "few-owners": 1,
  "single-owner": 2,
  unknown: 1.4
};

const DESIGN_DEV_HANDOFF_FRICTION_INDEX = {
  low: 0,
  medium: 1,
  high: 2,
  unknown: 1.2
};

const COMPONENT_STANDARDIZATION_GOAL_INDEX = {
  none: 0,
  "reduce-one-offs": 1,
  "shared-pattern": 2,
  "platform-standard": 3
};

const PRODUCTION_CRITICALITY_INDEX = {
  "internal-tool": 0,
  "customer-facing": 1,
  "revenue-critical": 2,
  "regulated-or-sla-backed": 3
};

const DEPENDENT_TEAMS_INDEX = {
  one: 1,
  "two-three": 2,
  "four-seven": 3,
  "eight-plus": 4
};

const OWNERSHIP_MODEL_INDEX = {
  "same-product-team": 1,
  "frontend-platform-team": 2,
  "several-teams-informal": 3,
  unclear: 4
};

const EXPECTED_ROWS_INDEX = {
  "under-1k": 1,
  "1k-10k": 2,
  "10k-100k": 3,
  "over-100k": 4
};

const EXPECTED_COLUMNS_INDEX = {
  "under-10": 1,
  "10-30": 2,
  "over-30": 3
};

const SUPPORT_INDEX = {
  community: 0,
  standard: 1,
  priority: 2,
  "procurement-sla": 3
};

const MUI_USAGE_INDEX = {
  none: 0,
  some: 1,
  standardized: 2
};

const MATURITY_INDEX = {
  low: 1,
  medium: 2,
  high: 3
};

const OWNERSHIP_HORIZON_INDEX = {
  12: 0,
  24: 0.5,
  36: 1
};

const DERIVED_FACTOR_CONTRIBUTION_SCALE = 0.25;

const DERIVED_FACTOR_CONTRIBUTION_SOURCE_NORMALIZERS = {
  supportRequirement: (input) => (SUPPORT_INDEX[input.supportRequirement] ?? 0) / 3,
  productionCriticality: (input) =>
    (PRODUCTION_CRITICALITY_INDEX[input.productionCriticality] ?? 0) / 3,
  ownershipHorizon: (input) => OWNERSHIP_HORIZON_INDEX[input.ownershipHorizon] ?? 0,
  designSystemMaturity: (input) => Math.max(0, (MATURITY_INDEX[input.designSystemMaturity] ?? 0) - 1) / 2,
  ownershipModel: (input) => Math.max(0, (OWNERSHIP_MODEL_INDEX[input.ownershipModel] ?? 0) - 1) / 3,
  knowledgeConcentration: (input) =>
    (KNOWLEDGE_CONCENTRATION_INDEX[input.knowledgeConcentration] ?? 0) / 2,
  componentStandardizationGoal: (input) =>
    (COMPONENT_STANDARDIZATION_GOAL_INDEX[input.componentStandardizationGoal] ?? 0) / 3,
  performanceSensitivity: (input) =>
    (PERFORMANCE_SENSITIVITY_INDEX[input.performanceSensitivity] ?? 0) / 3,
  accessibilityTarget: (input) =>
    (ACCESSIBILITY_TARGET_INDEX[input.accessibilityTarget] ?? 0) / 3
};

const PATH_LABELS = {
  build: "Build in-house",
  core: "MUI Core",
  premium: "MUI X Premium",
  enterprise: "MUI X Enterprise"
};

const SENSITIVITY_INPUT_LABELS = {
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

const SENSITIVITY_VALUE_LABELS = {
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

const SENSITIVITY_ORDERED_VALUES = {
  existingMuiUsage: ["none", "some", "standardized"],
  designSystemMaturity: ["low", "medium", "high"],
  dependentTeams: ["one", "two-three", "four-seven", "eight-plus"],
  ownershipModel: [
    "same-product-team",
    "frontend-platform-team",
    "several-teams-informal",
    "unclear"
  ],
  primaryUseCase: [
    "date-pickers",
    "tree-view",
    "charts",
    "multi-component",
    "data-grid",
    "scheduler"
  ],
  accessibilityTarget: ["none", "wcag-a", "wcag-aa", "wcag-aaa-regulated"],
  changeLeadTime: [
    "more-than-month",
    "one-week-to-one-month",
    "one-day-to-one-week",
    "less-than-day"
  ],
  performanceSensitivity: [
    "not-critical",
    "important",
    "strict-budget",
    "measured-core-web-vitals-target"
  ],
  reworkFrequency: ["rare", "occasional", "unknown", "frequent"],
  knowledgeConcentration: ["shared", "few-owners", "unknown", "single-owner"],
  designDevHandoffFriction: ["low", "medium", "unknown", "high"],
  componentStandardizationGoal: [
    "none",
    "reduce-one-offs",
    "shared-pattern",
    "platform-standard"
  ],
  deadlinePressure: ["low", "medium", "high"],
  ownershipHorizon: [12, 24, 36],
  supportRequirement: ["community", "standard", "priority", "procurement-sla"],
  productionCriticality: [
    "internal-tool",
    "customer-facing",
    "revenue-critical",
    "regulated-or-sla-backed"
  ],
  expectedRows: ["under-1k", "1k-10k", "10k-100k", "over-100k"],
  expectedColumns: ["under-10", "10-30", "over-30"]
};

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(body)
  };
}

function badRequest(message, details) {
  return jsonResponse(400, {
    error: message,
    ...(details ? { details } : {})
  });
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function roundTo(value, decimals = 1) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function levelFromScore(score, scoreBands) {
  const bands = scoreBands ?? {
    low: { min: 0, maxExclusive: 34 },
    medium: { min: 34, maxExclusive: 67 },
    high: { min: 67, maxInclusive: 100 }
  };

  if (score >= bands.high.min) {
    return "high";
  }

  if (score >= bands.medium.min) {
    return "medium";
  }

  return "low";
}

function buildFactor(score, drivers, calibration) {
  const normalizedScore = roundTo(clamp(score, 0, 100));

  return {
    score: normalizedScore,
    level: levelFromScore(normalizedScore, calibration.scoreBands),
    drivers
  };
}

function formatContributionLabel(value) {
  return String(value)
    .replace(/-/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatContributionDelta(value) {
  const rounded = roundTo(value, 1);
  return `${rounded > 0 ? "+" : ""}${rounded}`;
}

function getDerivedFactorContributionSourceValue(input, sourceScale) {
  const normalizer = DERIVED_FACTOR_CONTRIBUTION_SOURCE_NORMALIZERS[sourceScale];

  if (!normalizer) {
    return null;
  }

  const normalizedValue = normalizer(input);

  if (!Number.isFinite(normalizedValue)) {
    return null;
  }

  return clamp(normalizedValue, 0, 1);
}

function applyDerivedFactorContributions({
  input,
  baseScores,
  calibration,
  contributionRegistry
}) {
  const nextScores = Object.fromEntries(
    Object.entries(baseScores).map(([factorKey, factor]) => [
      factorKey,
      {
        ...factor,
        drivers: Array.isArray(factor.drivers) ? [...factor.drivers] : []
      }
    ])
  );
  const contributionTotals = {};
  const routeConfigs = contributionRegistry ?? {};

  for (const [inputKey, factorRoutes] of Object.entries(routeConfigs)) {
    if (!factorRoutes || typeof factorRoutes !== "object") {
      continue;
    }

    for (const [factorKey, routeConfig] of Object.entries(factorRoutes)) {
      const sourceValue = getDerivedFactorContributionSourceValue(
        input,
        routeConfig?.sourceScale
      );

      if (sourceValue === null || sourceValue <= 0) {
        continue;
      }

      const strength = Number(routeConfig?.defaultStrength);

      if (!Number.isFinite(strength) || strength <= 0) {
        continue;
      }

      if (routeConfig?.direction === "none") {
        continue;
      }

      const directionMultiplier = routeConfig?.direction === "negative" ? -1 : 1;
      const contribution = sourceValue * strength * DERIVED_FACTOR_CONTRIBUTION_SCALE * directionMultiplier;

      if (!contributionTotals[factorKey]) {
        contributionTotals[factorKey] = {
          total: 0,
          drivers: []
        };
      }

      contributionTotals[factorKey].total += contribution;
      contributionTotals[factorKey].drivers.push(
        `${formatContributionLabel(inputKey)} -> ${formatContributionLabel(factorKey)} ${formatContributionDelta(contribution)} via ${formatContributionLabel(routeConfig.sourceScale)} routing.`
      );
    }
  }

  for (const [factorKey, adjustment] of Object.entries(contributionTotals)) {
    if (!nextScores[factorKey]) {
      continue;
    }

    nextScores[factorKey] = buildFactor(
      nextScores[factorKey].score + adjustment.total,
      [...nextScores[factorKey].drivers, ...adjustment.drivers],
      calibration
    );
  }

  return nextScores;
}

function buildLever(score, drivers, calibration) {
  const normalizedScore = clamp(score, 0, 1);

  return {
    score: roundTo(normalizedScore, 2),
    level: levelFromScore(normalizedScore * 100, calibration.scoreBands),
    drivers
  };
}

function bucket(value, small, medium) {
  if (value <= small) {
    return 1;
  }

  if (value <= medium) {
    return 2;
  }

  return 3;
}

function buildOwnershipHorizonEffects(input, calibration, overrides = {}) {
  const horizonEffects = calibration.ownershipHorizonEffects;
  const horizonScale = horizonEffects.scale[input.ownershipHorizon] ?? 0;
  const ownershipBurdenWeights = horizonEffects.ownershipBurden;
  const enterpriseHorizonWeights = horizonEffects.enterpriseFit;
  const buildHorizonWeights = horizonEffects.buildFit;
  const ownershipClarity =
    overrides.ownershipClarity ??
    ({
      "same-product-team": 1,
      "frontend-platform-team": 0.84,
      "several-teams-informal": 0.48,
      unclear: 0.24
    }[input.ownershipModel] ?? 0);
  const knowledgeSpread =
    overrides.knowledgeSpread ??
    ({
      shared: 1,
      "few-owners": 0.62,
      "single-owner": 0.22,
      unknown: 0.44
    }[input.knowledgeConcentration] ?? 0);
  const dependentTeamsWeakness =
    overrides.dependentTeamsWeakness ??
    clamp(
      (DEPENDENT_TEAMS_INDEX[input.dependentTeams] ??
        ownershipBurdenWeights.dependentTeamsMaxIndex) /
        ownershipBurdenWeights.dependentTeamsMaxIndex,
      0,
      1
    );
  const ownershipWeakness = clamp(
    (1 - ownershipClarity) * ownershipBurdenWeights.ownershipWeakness +
      (1 - knowledgeSpread) *
        ownershipBurdenWeights.knowledgeConcentration +
      dependentTeamsWeakness * ownershipBurdenWeights.dependentTeams,
    0,
    1
  );
  const supportNeed =
    overrides.supportNeed ?? SUPPORT_INDEX[input.supportRequirement] ?? 0;
  const productionCriticalityNormalized =
    overrides.productionCriticalityNormalized ??
    clamp(
      (PRODUCTION_CRITICALITY_INDEX[input.productionCriticality] ?? 0) /
        enterpriseHorizonWeights.productionCriticalityMaxIndex,
      0,
      1
    );
  const standardizationIntent =
    overrides.standardizationIntent ??
    clamp(
      (COMPONENT_STANDARDIZATION_GOAL_INDEX[
        input.componentStandardizationGoal
      ] ?? 0) / enterpriseHorizonWeights.standardizationGoalMaxIndex,
      0,
      1
    );
  const appScale =
    overrides.appScale ??
    bucket(
      input.reactApps,
      calibration.inputScales.appScaleBucket.smallMax,
      calibration.inputScales.appScaleBucket.mediumMax
    );
  const teamScale =
    overrides.teamScale ??
    bucket(
      input.frontendDevelopers,
      calibration.inputScales.teamScaleBucket.smallMax,
      calibration.inputScales.teamScaleBucket.mediumMax
    );
  const internalAbsorptionStrength =
    overrides.internalAbsorptionStrength ?? 0;
  const ownershipBurdenEffect =
    horizonScale * ownershipWeakness * ownershipBurdenWeights.maximumImpact;
  const enterpriseHorizonContext = clamp(
    (supportNeed / enterpriseHorizonWeights.supportRequirementMaxIndex) *
      enterpriseHorizonWeights.supportRequirement +
      productionCriticalityNormalized *
        enterpriseHorizonWeights.productionCriticality +
      standardizationIntent *
        enterpriseHorizonWeights.standardizationIntent +
      appScale * enterpriseHorizonWeights.appScale +
      teamScale * enterpriseHorizonWeights.teamScale,
    0,
    1
  );
  const enterpriseFitEffect =
    horizonScale *
    enterpriseHorizonContext *
    enterpriseHorizonWeights.maximumImpact;
  const internalOwnershipStrength = clamp(
    ownershipClarity * buildHorizonWeights.ownershipClarity +
      knowledgeSpread * buildHorizonWeights.knowledgeSpread +
      (overrides.maturityStrength ?? 0) *
        buildHorizonWeights.designSystemMaturity +
      internalAbsorptionStrength * buildHorizonWeights.internalAbsorption,
    0,
    1
  );
  const buildFitEffect =
    horizonScale * internalOwnershipStrength * buildHorizonWeights.maximumImpact;

  return {
    scale: horizonScale,
    ownershipWeakness,
    internalOwnershipStrength,
    enterpriseHorizonContext,
    ownershipBurdenEffect,
    buildFitEffect,
    enterpriseFitEffect
  };
}

function countLabel(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function describeList(items, emptyLabel = "No additional items selected") {
  if (!Array.isArray(items) || items.length === 0) {
    return emptyLabel;
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function parseJsonBody(event) {
  if (!event?.body || typeof event.body !== "string") {
    return { error: "Invalid JSON body." };
  }

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;

  try {
    const parsed = JSON.parse(rawBody);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { error: "Invalid JSON body." };
    }

    return { value: parsed };
  } catch {
    return { error: "Invalid JSON body." };
  }
}

function normalizeInput(payload) {
  const advancedFeatures = Array.isArray(payload.advancedFeatures)
    ? [
        ...new Set(
          payload.advancedFeatures.filter(
            (feature) => typeof feature === "string"
          )
        )
      ]
    : [];
  const ownershipHorizon =
    payload.ownershipHorizon ?? payload.maintenanceHorizonMonths;

  return {
    frontendDevelopers: Number(payload.frontendDevelopers),
    reactApps: Number(payload.reactApps),
    dependentTeams: payload.dependentTeams,
    ownershipModel: payload.ownershipModel,
    existingMuiUsage: payload.existingMuiUsage,
    designSystemMaturity: payload.designSystemMaturity,
    primaryUseCase: payload.primaryUseCase,
    dataHeavyScreens: Number(payload.dataHeavyScreens),
    expectedRows: payload.expectedRows,
    expectedColumns: payload.expectedColumns,
    advancedFeatures,
    accessibilityTarget: payload.accessibilityTarget,
    changeLeadTime: payload.changeLeadTime,
    performanceSensitivity: payload.performanceSensitivity,
    reworkFrequency: payload.reworkFrequency,
    knowledgeConcentration: payload.knowledgeConcentration,
    designDevHandoffFriction: payload.designDevHandoffFriction,
    componentStandardizationGoal: payload.componentStandardizationGoal,
    deadlinePressure: payload.deadlinePressure,
    ownershipHorizon: Number(ownershipHorizon),
    supportRequirement: payload.supportRequirement,
    productionCriticality: payload.productionCriticality
  };
}

function validateInteger(
  value,
  label,
  { minimum = 0, allowZero = false } = {}
) {
  if (!Number.isInteger(value)) {
    return `${label} must be an integer.`;
  }

  if (allowZero) {
    if (value < minimum) {
      return `${label} must be ${minimum} or more.`;
    }
  } else if (value <= minimum) {
    return `${label} must be greater than ${minimum}.`;
  }

  return "";
}

function validateEnum(value, label, allowedValues) {
  return allowedValues.has(value) ? "" : `${label} is invalid.`;
}

function isBlank(value) {
  return value === undefined || value === null || value === "";
}

function validatePayload(normalized, originalPayload) {
  const errors = [];
  const ownershipHorizon =
    originalPayload.ownershipHorizon ?? originalPayload.maintenanceHorizonMonths;

  if (isBlank(originalPayload.frontendDevelopers)) {
    errors.push("frontendDevelopers is required.");
  } else {
    errors.push(
      validateInteger(normalized.frontendDevelopers, "frontendDevelopers", {
        minimum: 0
      })
    );
  }

  if (isBlank(originalPayload.reactApps)) {
    errors.push("reactApps is required.");
  } else {
    errors.push(
      validateInteger(normalized.reactApps, "reactApps", { minimum: 0 })
    );
  }

  if (isBlank(originalPayload.dependentTeams)) {
    errors.push("dependentTeams is required.");
  } else {
    errors.push(
      validateEnum(normalized.dependentTeams, "dependentTeams", DEPENDENT_TEAMS)
    );
  }

  if (isBlank(originalPayload.ownershipModel)) {
    errors.push("ownershipModel is required.");
  } else {
    errors.push(
      validateEnum(
        normalized.ownershipModel,
        "ownershipModel",
        OWNERSHIP_MODELS
      )
    );
  }

  if (isBlank(originalPayload.existingMuiUsage)) {
    errors.push("existingMuiUsage is required.");
  } else {
    errors.push(
      validateEnum(
        normalized.existingMuiUsage,
        "existingMuiUsage",
        EXISTING_MUI_USAGE
      )
    );
  }

  if (isBlank(originalPayload.designSystemMaturity)) {
    errors.push("designSystemMaturity is required.");
  } else {
    errors.push(
      validateEnum(
        normalized.designSystemMaturity,
        "designSystemMaturity",
        DESIGN_SYSTEM_MATURITY
      )
    );
  }

  if (isBlank(originalPayload.primaryUseCase)) {
    errors.push("primaryUseCase is required.");
  } else {
    errors.push(
      validateEnum(
        normalized.primaryUseCase,
        "primaryUseCase",
        PRIMARY_USE_CASES
      )
    );
  }

  if (isBlank(originalPayload.dataHeavyScreens)) {
    errors.push("dataHeavyScreens is required.");
  } else {
    errors.push(
      validateInteger(normalized.dataHeavyScreens, "dataHeavyScreens", {
        minimum: 0,
        allowZero: true
      })
    );
  }

  if (isBlank(originalPayload.expectedRows)) {
    errors.push("expectedRows is required.");
  } else {
    errors.push(
      validateEnum(normalized.expectedRows, "expectedRows", EXPECTED_ROWS)
    );
  }

  if (isBlank(originalPayload.expectedColumns)) {
    errors.push("expectedColumns is required.");
  } else {
    errors.push(
      validateEnum(
        normalized.expectedColumns,
        "expectedColumns",
        EXPECTED_COLUMNS
      )
    );
  }

  if (isBlank(originalPayload.accessibilityTarget)) {
    errors.push("accessibilityTarget is required.");
  } else {
    errors.push(
      validateEnum(
        normalized.accessibilityTarget,
        "accessibilityTarget",
        ACCESSIBILITY_TARGETS
      )
    );
  }

  if (isBlank(originalPayload.changeLeadTime)) {
    errors.push("changeLeadTime is required.");
  } else {
    errors.push(
      validateEnum(
        normalized.changeLeadTime,
        "changeLeadTime",
        CHANGE_LEAD_TIMES
      )
    );
  }

  if (isBlank(originalPayload.performanceSensitivity)) {
    errors.push("performanceSensitivity is required.");
  } else {
    errors.push(
      validateEnum(
        normalized.performanceSensitivity,
        "performanceSensitivity",
        PERFORMANCE_SENSITIVITY
      )
    );
  }

  if (isBlank(originalPayload.reworkFrequency)) {
    errors.push("reworkFrequency is required.");
  } else {
    errors.push(
      validateEnum(
        normalized.reworkFrequency,
        "reworkFrequency",
        REWORK_FREQUENCIES
      )
    );
  }

  if (isBlank(originalPayload.knowledgeConcentration)) {
    errors.push("knowledgeConcentration is required.");
  } else {
    errors.push(
      validateEnum(
        normalized.knowledgeConcentration,
        "knowledgeConcentration",
        KNOWLEDGE_CONCENTRATION
      )
    );
  }

  if (isBlank(originalPayload.designDevHandoffFriction)) {
    errors.push("designDevHandoffFriction is required.");
  } else {
    errors.push(
      validateEnum(
        normalized.designDevHandoffFriction,
        "designDevHandoffFriction",
        DESIGN_DEV_HANDOFF_FRICTION
      )
    );
  }

  if (isBlank(originalPayload.componentStandardizationGoal)) {
    errors.push("componentStandardizationGoal is required.");
  } else {
    errors.push(
      validateEnum(
        normalized.componentStandardizationGoal,
        "componentStandardizationGoal",
        COMPONENT_STANDARDIZATION_GOALS
      )
    );
  }

  if (isBlank(originalPayload.deadlinePressure)) {
    errors.push("deadlinePressure is required.");
  } else {
    errors.push(
      validateEnum(
        normalized.deadlinePressure,
        "deadlinePressure",
        PRESSURE_LEVELS
      )
    );
  }

  if (isBlank(originalPayload.supportRequirement)) {
    errors.push("supportRequirement is required.");
  } else {
    errors.push(
      validateEnum(
        normalized.supportRequirement,
        "supportRequirement",
        SUPPORT_REQUIREMENTS
      )
    );
  }

  if (isBlank(originalPayload.productionCriticality)) {
    errors.push("productionCriticality is required.");
  } else {
    errors.push(
      validateEnum(
        normalized.productionCriticality,
        "productionCriticality",
        PRODUCTION_CRITICALITY
      )
    );
  }

  if (isBlank(ownershipHorizon)) {
    errors.push("ownershipHorizon is required.");
  } else if (!OWNERSHIP_HORIZONS.has(normalized.ownershipHorizon)) {
    errors.push("ownershipHorizon is invalid.");
  }

  if (!Array.isArray(originalPayload.advancedFeatures)) {
    errors.push("advancedFeatures must be an array.");
  } else if (
    normalized.advancedFeatures.some(
      (feature) => !ADVANCED_FEATURES.has(feature)
    )
  ) {
    errors.push("advancedFeatures contains an invalid value.");
  }

  return {
    errors: errors.filter(Boolean)
  };
}

function buildDerivedFactors(input, calibration) {
  const derivedWeights = calibration.derivedFactorWeights;
  const useCaseComplexity = calibration.inputScales.useCaseComplexity[input.primaryUseCase];
  const featureWeight = input.advancedFeatures.reduce(
    (sum, feature) => sum + calibration.inputScales.advancedFeatureWeights[feature],
    0
  );
  const screenLoad = Math.min(input.dataHeavyScreens, 12);
  const rowScale = EXPECTED_ROWS_INDEX[input.expectedRows];
  const columnScale = EXPECTED_COLUMNS_INDEX[input.expectedColumns];
  const accessibilityTarget =
    ACCESSIBILITY_TARGET_INDEX[input.accessibilityTarget];
  const changeLeadTime = CHANGE_LEAD_TIME_INDEX[input.changeLeadTime];
  const performanceSensitivity =
    PERFORMANCE_SENSITIVITY_INDEX[input.performanceSensitivity];
  const reworkFrequency = REWORK_FREQUENCY_INDEX[input.reworkFrequency];
  const knowledgeConcentration =
    KNOWLEDGE_CONCENTRATION_INDEX[input.knowledgeConcentration];
  const handoffFriction =
    DESIGN_DEV_HANDOFF_FRICTION_INDEX[input.designDevHandoffFriction];
  const standardizationGoal =
    COMPONENT_STANDARDIZATION_GOAL_INDEX[input.componentStandardizationGoal];
  const productionCriticality =
    PRODUCTION_CRITICALITY_INDEX[input.productionCriticality];
  const dependentTeams = DEPENDENT_TEAMS_INDEX[input.dependentTeams];
  const ownershipModel = OWNERSHIP_MODEL_INDEX[input.ownershipModel];
  const muiUsage = MUI_USAGE_INDEX[input.existingMuiUsage];
  const rowsUnder1k = input.expectedRows === "under-1k";
  const columnsUnder10 = input.expectedColumns === "under-10";
  const noAdvancedBehaviors = input.advancedFeatures.length === 0;
  const selectedAdvancedBehaviors = describeList(
    input.advancedFeatures.map((feature) => {
      const labels = {
        virtualization: "virtualization at scale",
        "inline-editing": "inline editing",
        "server-side-data": "server-side data",
        "keyboard-navigation": "keyboard navigation",
        exporting: "exporting or print support",
        "drag-and-drop": "drag and drop",
        "custom-rendering": "custom rendering",
        "timezone-logic": "timezone logic",
        "i18n-localization": "i18n and localization"
      };

      return labels[feature] ?? feature;
    })
  );
  const ownershipHorizonEffects = buildOwnershipHorizonEffects(input, calibration, {
    ownershipClarity:
      ({
        "same-product-team": 1,
        "frontend-platform-team": 0.84,
        "several-teams-informal": 0.48,
        unclear: 0.24
      }[input.ownershipModel] ?? 0),
    knowledgeSpread:
      ({
        shared: 1,
        "few-owners": 0.62,
        "single-owner": 0.22,
        unknown: 0.44
      }[input.knowledgeConcentration] ?? 0),
    dependentTeamsWeakness: clamp(
      dependentTeams /
        calibration.ownershipHorizonEffects.ownershipBurden
          .dependentTeamsMaxIndex,
      0,
      1
    )
  });

  const functionalDrivers = [
    input.primaryUseCase === "multi-component"
      ? "Multi-component evaluation creates moderate implementation scope."
      : `${input.primaryUseCase} sets the baseline interaction complexity.`,
    rowsUnder1k && columnsUnder10
      ? "Small data volume keeps the complexity contained."
      : `Expected volume sits in the ${input.expectedRows} row band and ${input.expectedColumns} column band.`,
    noAdvancedBehaviors
      ? "No advanced behaviors were selected."
      : `Selected advanced behaviors (${selectedAdvancedBehaviors}) expand interaction and state complexity.`,
    `${input.performanceSensitivity} performance pressure raises complexity when optimization matters.`
  ];

  if (screenLoad > 0) {
    functionalDrivers.push(
      `${countLabel(screenLoad, "data-heavy screen")} add state and edge-case pressure.`
    );
  }

  const functionalComplexity = buildFactor(
    useCaseComplexity * derivedWeights.functionalComplexity.useCaseComplexity +
      featureWeight * derivedWeights.functionalComplexity.featureWeight +
      performanceSensitivity *
        derivedWeights.functionalComplexity.performanceSensitivity +
      screenLoad * derivedWeights.functionalComplexity.screenLoad +
      rowScale * derivedWeights.functionalComplexity.rowScale +
      columnScale * derivedWeights.functionalComplexity.columnScale +
      (input.primaryUseCase === "data-grid"
        ? rowScale * derivedWeights.functionalComplexity.dataGridRowScale
        : 0) +
      (input.primaryUseCase === "scheduler"
        ? columnScale * derivedWeights.functionalComplexity.schedulerColumnScale
        : 0),
    functionalDrivers,
    calibration
  );

  const qualityBurden = buildFactor(
    accessibilityTarget * derivedWeights.qualityBurden.accessibilityTarget +
      performanceSensitivity *
        derivedWeights.qualityBurden.performanceSensitivity +
      rowScale * derivedWeights.qualityBurden.rowScale +
      columnScale * derivedWeights.qualityBurden.columnScale +
      handoffFriction * derivedWeights.qualityBurden.handoffFriction +
      productionCriticality *
        derivedWeights.qualityBurden.productionCriticality +
      (input.advancedFeatures.includes("keyboard-navigation")
        ? derivedWeights.qualityBurden.keyboardNavigation
        : 0) +
      (input.advancedFeatures.includes("virtualization")
        ? derivedWeights.qualityBurden.virtualization
        : 0) +
      (input.advancedFeatures.includes("custom-rendering")
        ? derivedWeights.qualityBurden.customRendering
        : 0) +
      (input.advancedFeatures.includes("server-side-data")
        ? derivedWeights.qualityBurden.serverSideData
        : 0) +
      (input.advancedFeatures.includes("timezone-logic")
        ? derivedWeights.qualityBurden.timezoneLogic
        : 0) +
      (input.advancedFeatures.includes("drag-and-drop")
        ? derivedWeights.qualityBurden.dragAndDrop
        : 0) +
      (input.advancedFeatures.includes("i18n-localization")
        ? derivedWeights.qualityBurden.i18nLocalization
        : 0),
    [
      `${input.accessibilityTarget} accessibility target shapes verification burden.`,
      `${input.performanceSensitivity} performance pressure and ${input.designDevHandoffFriction} handoff friction affect QA drag.`,
      noAdvancedBehaviors
        ? "No advanced feature-specific QA burden was selected."
        : `Advanced behaviors (${selectedAdvancedBehaviors}) add extra QA coverage.`
    ],
    calibration
  );

  const rawDeliveryMaturity =
    derivedWeights.deliveryMaturity.base +
    changeLeadTime * derivedWeights.deliveryMaturity.changeLeadTime +
    reworkFrequency * derivedWeights.deliveryMaturity.reworkFrequency +
    derivedWeights.deliveryMaturity.deadlinePressure[input.deadlinePressure];
  const deliveryMaturityCaps = calibration.deliveryMaturityCaps;
  const deliveryMaturityCap = Math.min(
    deliveryMaturityCaps.changeLeadTime[input.changeLeadTime],
    deliveryMaturityCaps.reworkFrequency[input.reworkFrequency],
    deliveryMaturityCaps.deadlinePressure[input.deadlinePressure]
  );
  const deliveryMaturityDrivers = [
    input.changeLeadTime === "more-than-month"
      ? "More-than-month lead time limits delivery strength because changes move slowly through the system."
      : `${input.changeLeadTime} lead time sets the delivery-flow baseline.`,
    input.reworkFrequency === "rare"
      ? "Rare rework supports delivery maturity because changes usually stick without repeated correction."
      : `${input.reworkFrequency} rework frequency changes how reliably work sticks.`,
    input.deadlinePressure === "low"
      ? "Low deadline pressure preserves delivery slack."
      : `${input.deadlinePressure} deadline pressure adjusts delivery slack.`
  ];

  if (rawDeliveryMaturity > deliveryMaturityCap) {
    deliveryMaturityDrivers.push(
      "The lead-time constraint caps the delivery maturity score despite favorable rework and deadline-pressure inputs."
    );
  }

  const deliveryMaturity = buildFactor(
    Math.min(rawDeliveryMaturity, deliveryMaturityCap),
    deliveryMaturityDrivers,
    calibration
  );

  const ownershipBurden = buildFactor(
    derivedWeights.ownershipBurden.base +
      dependentTeams * derivedWeights.ownershipBurden.dependentTeams +
      ownershipModel * derivedWeights.ownershipBurden.ownershipModel +
      Math.min(input.reactApps, 8) * derivedWeights.ownershipBurden.reactApps +
      knowledgeConcentration *
        derivedWeights.ownershipBurden.knowledgeConcentration +
      ownershipHorizonEffects.ownershipBurdenEffect +
      derivedWeights.ownershipBurden.designSystemMaturity[
        input.designSystemMaturity
      ],
    [
      `${input.dependentTeams} dependent teams and ${countLabel(input.reactApps, "React app")} define coordination load.`,
      `${input.ownershipModel} ownership and ${input.knowledgeConcentration} knowledge concentration shape continuity risk.`,
      `${input.designSystemMaturity} design-system maturity changes how much groundwork already exists.`
    ],
    calibration
  );

  const enterpriseReadiness = buildFactor(
    derivedWeights.enterpriseReadiness.supportRequirement[
      input.supportRequirement
    ] +
      Math.min(input.reactApps, 6) *
        derivedWeights.enterpriseReadiness.reactApps +
      Math.min(input.frontendDevelopers, 10) *
        derivedWeights.enterpriseReadiness.frontendDevelopers +
      dependentTeams * derivedWeights.enterpriseReadiness.dependentTeams +
      muiUsage * derivedWeights.enterpriseReadiness.muiUsage +
      standardizationGoal *
        derivedWeights.enterpriseReadiness.standardizationGoal +
      productionCriticality *
        derivedWeights.enterpriseReadiness.productionCriticality,
    [
      `${input.supportRequirement} support expectations raise enterprise relevance.`,
      `${countLabel(input.reactApps, "React app")} and ${input.dependentTeams} dependent teams widen the rollout footprint.`,
      `${input.componentStandardizationGoal} standardization intent and ${input.productionCriticality} criticality affect platform pressure.`
    ],
    calibration
  );

  const baseDerivedFactors = {
    functionalComplexity,
    qualityBurden,
    deliveryMaturity,
    ownershipBurden,
    enterpriseReadiness,
    performanceSensitivity,
    knowledgeConcentration,
    handoffFriction,
    standardizationGoal,
    productionCriticality
  };

  return applyDerivedFactorContributions({
    input,
    baseScores: baseDerivedFactors,
    calibration,
    contributionRegistry: calibration.derivedFactorContributions
  });
}

function buildPlanFit(planKey, input, derivedFactors, calibration) {
  const planFitWeights = calibration.planFitWeights;
  const planFitRuntime = calibration.planFitRuntime;
  const plan = calibration.planConfig[planKey];
  const featureDemand = input.advancedFeatures.reduce(
    (sum, feature) => sum + calibration.inputScales.advancedFeatureWeights[feature],
    0
  );
  const performancePressure =
    PERFORMANCE_SENSITIVITY_INDEX[input.performanceSensitivity] /
    planFitRuntime.performanceSensitivityMaxIndex;
  const useCaseCoverage = plan.useCaseCoverage[input.primaryUseCase];
  const rowScale = EXPECTED_ROWS_INDEX[input.expectedRows];
  const columnScale = EXPECTED_COLUMNS_INDEX[input.expectedColumns];
  const scaleDemand =
    rowScale * planFitRuntime.scaleDemand.rowScale +
    columnScale * planFitRuntime.scaleDemand.columnScale;
  const planScaleCapacity = planFitWeights.planScaleCapacity[planKey];
  const featureCoverage = clamp(
    1 -
      Math.max(0, featureDemand - plan.featureCapacity) /
        planFitWeights.featureCoverageDenominator,
    planFitRuntime.featureCoverage.floor,
    planFitRuntime.featureCoverage.ceiling
  );
  const scaleCoverage = clamp(
    1 -
      Math.max(0, scaleDemand - planScaleCapacity) /
        planFitWeights.scaleCoverageDenominator,
    planFitRuntime.scaleCoverage.floor,
    planFitRuntime.scaleCoverage.ceiling
  );
  const adoptionBoost = planFitRuntime.adoptionBoost[input.existingMuiUsage];
  const supportFit = clamp(
    1 -
      Math.max(
        0,
        SUPPORT_INDEX[input.supportRequirement] -
          plan.supportCapability *
            planFitRuntime.supportFit.supportCapabilityMultiplier
      ) /
        planFitWeights.supportFitDenominator,
    planFitRuntime.supportFit.floor,
    planFitRuntime.supportFit.ceiling
  );
  const qualityFit = clamp(
    1 -
      Math.max(
        0,
        derivedFactors.qualityBurden.score / 100 -
          planFitWeights.qualityFitThresholds[planKey]
      ) *
        planFitWeights.qualityFitSlope,
    planFitRuntime.qualityFit.floor,
    planFitRuntime.qualityFit.ceiling
  );
  const performanceFit = clamp(
    1 - performancePressure * planFitWeights.performanceFitMultipliers[planKey],
    planFitRuntime.performanceFit.floor,
    planFitRuntime.performanceFit.ceiling
  );

  const coverageScore = clamp(
    (useCaseCoverage * planFitWeights.coverageScore.useCaseCoverage +
      featureCoverage * planFitWeights.coverageScore.featureCoverage +
      scaleCoverage * planFitWeights.coverageScore.scaleCoverage +
      supportFit * planFitWeights.coverageScore.supportFit +
      qualityFit * planFitWeights.coverageScore.qualityFit +
      performanceFit * planFitWeights.coverageScore.performanceFit +
      adoptionBoost) *
      100,
    0,
    100
  );
  const coverageGap = clamp(1 - coverageScore / 100, 0, 1);
  const baseIntegrationRisk = clamp(
    planFitWeights.baseIntegrationRisk.existingMuiUsage[
      input.existingMuiUsage
    ] +
      (input.advancedFeatures.includes("custom-rendering")
        ? planFitWeights.baseIntegrationRisk.customRendering
        : 0) +
      (input.advancedFeatures.includes("drag-and-drop")
        ? planFitWeights.baseIntegrationRisk.dragAndDrop
        : 0) +
      (input.advancedFeatures.includes("timezone-logic")
        ? planFitWeights.baseIntegrationRisk.timezoneLogic
        : 0) +
      (input.advancedFeatures.includes("i18n-localization")
        ? planFitWeights.baseIntegrationRisk.i18nLocalization
        : 0) +
      (rowScale >= 3
        ? planFitWeights.baseIntegrationRisk.rowScaleAtLeast3
        : 0) +
      (columnScale >= 3
        ? planFitWeights.baseIntegrationRisk.columnScaleAtLeast3
        : 0) +
      (planKey === "core" ? planFitWeights.baseIntegrationRisk.corePlan : 0),
    planFitWeights.baseIntegrationRisk.minimum,
    planFitWeights.baseIntegrationRisk.maximum
  );
  const integrationRisk = clamp(
    baseIntegrationRisk *
      (1 -
        (coverageScore / 100) *
          planFitWeights.baseIntegrationRisk.integrationRiskScale),
    planFitWeights.baseIntegrationRisk.floor,
    planFitWeights.baseIntegrationRisk.ceiling
  );
  const supportGap = clamp(
    Math.max(
      0,
      derivedFactors.enterpriseReadiness.score / 100 - plan.supportCapability
    ) * planFitRuntime.supportGap.multiplier,
    planFitRuntime.supportGap.floor,
    planFitRuntime.supportGap.ceiling
  );

  return {
    coverageScore: roundTo(coverageScore),
    coverageGap: roundTo(coverageGap, 2),
    integrationRisk: roundTo(integrationRisk, 2),
    supportGap: roundTo(supportGap, 2)
  };
}

function buildScenarioLevers(input, scorecard, calibration) {
  const scenarioWeights = calibration.scenarioLeverWeights;
  const signalScales = calibration.fitSignalScales;
  const runtime = calibration.scenarioLeverRuntime;
  const planFit = scorecard.effectivePlanFit;
  const featureCount = input.advancedFeatures.length;
  const rowScale = EXPECTED_ROWS_INDEX[input.expectedRows];
  const columnScale = EXPECTED_COLUMNS_INDEX[input.expectedColumns];
  const standardizationIntent =
    COMPONENT_STANDARDIZATION_GOAL_INDEX[input.componentStandardizationGoal] /
    3;
  const performancePressure =
    PERFORMANCE_SENSITIVITY_INDEX[input.performanceSensitivity] / 3;
  const productionPressure =
    PRODUCTION_CRITICALITY_INDEX[input.productionCriticality] / 3;
  const ownershipClarity = signalScales.ownershipClarity[input.ownershipModel];
  const teamFocus = signalScales.teamFocus[input.dependentTeams];
  const reworkStability = signalScales.reworkStability[input.reworkFrequency];
  const deadlineSlack = signalScales.deadlineSlack[input.deadlinePressure];
  const supportLightness = signalScales.supportLightness[input.supportRequirement];
  const appFocus = clamp(
    1 -
      Math.max(0, input.reactApps - runtime.appFocus.baselineApps) *
        runtime.appFocus.perAdditionalAppPenalty,
    runtime.appFocus.floor,
    runtime.appFocus.ceiling
  );
  const maturityStrength =
    signalScales.maturityStrength[input.designSystemMaturity];
  const knowledgeSpread = signalScales.knowledgeSpread[
    input.knowledgeConcentration
  ];
  const handoffAlignment = signalScales.handoffAlignment[
    input.designDevHandoffFriction
  ];
  const scopeSimplicity = clamp(
    1 -
      ((featureCount / runtime.scopeSimplicity.featureDenominator) *
        runtime.scopeSimplicity.featureWeight +
        ((rowScale - 1) / runtime.scopeSimplicity.rowDenominator) *
          runtime.scopeSimplicity.rowWeight +
        ((columnScale - 1) / runtime.scopeSimplicity.columnDenominator) *
          runtime.scopeSimplicity.columnWeight +
        runtime.scopeSimplicity.useCasePenalties[input.primaryUseCase]),
    runtime.scopeSimplicity.floor,
    runtime.scopeSimplicity.ceiling
  );
  const packagedAffinity = signalScales.packagedAffinity[input.primaryUseCase];

  const internalAbsorptionScore = clamp(
    scorecard.deliveryStrength *
      scenarioWeights.internalAbsorption.deliveryStrength +
      maturityStrength * scenarioWeights.internalAbsorption.maturityStrength +
      ownershipClarity * scenarioWeights.internalAbsorption.ownershipClarity +
      teamFocus * scenarioWeights.internalAbsorption.teamFocus +
      reworkStability * scenarioWeights.internalAbsorption.reworkStability +
      knowledgeSpread * scenarioWeights.internalAbsorption.knowledgeSpread +
      handoffAlignment * scenarioWeights.internalAbsorption.handoffAlignment +
      deadlineSlack * scenarioWeights.internalAbsorption.deadlineSlack +
      supportLightness * scenarioWeights.internalAbsorption.supportLightness +
      appFocus * scenarioWeights.internalAbsorption.appFocus,
    0,
    1
  );
  const buildReuseBonus =
    input.existingMuiUsage === "none"
      ? input.designSystemMaturity === "high"
        ? runtime.buildReuseBonus.existingMuiUsage.none.high
        : input.designSystemMaturity === "medium"
          ? runtime.buildReuseBonus.existingMuiUsage.none.medium
          : runtime.buildReuseBonus.existingMuiUsage.none.low
      : input.existingMuiUsage === "some"
        ? runtime.buildReuseBonus.existingMuiUsage.some
        : runtime.buildReuseBonus.existingMuiUsage.standardized;
  const buildReuseLeverageScore = clamp(
    maturityStrength * scenarioWeights.buildReuse.maturityStrength +
      ownershipClarity * scenarioWeights.buildReuse.ownershipClarity +
      teamFocus * scenarioWeights.buildReuse.teamFocus +
      knowledgeSpread * scenarioWeights.buildReuse.knowledgeSpread +
      handoffAlignment * scenarioWeights.buildReuse.handoffAlignment +
      scopeSimplicity * scenarioWeights.buildReuse.scopeSimplicity +
      clamp(
        1 - featureCount / runtime.buildReuseBonus.featureCountDenominator,
        runtime.buildReuseBonus.featureCountFloor,
        1
      ) *
        scenarioWeights.buildReuse.featureCount +
      standardizationIntent *
        maturityStrength *
        ownershipClarity *
        scenarioWeights.buildReuse.standardizationInteraction +
      clamp(
        1 - (rowScale + columnScale - 2) /
          runtime.buildReuseBonus.scaleProfileDenominator,
        runtime.buildReuseBonus.scaleProfileFloor,
        1
      ) *
        scenarioWeights.buildReuse.scaleProfile +
      buildReuseBonus,
    0,
    1
  );
  const muiUsageReadiness =
    signalScales.muiUsageReadiness[input.existingMuiUsage] ??
    signalScales.muiUsageReadiness.none;
  const planPowerReadiness =
    signalScales.planPowerReadiness[scorecard.effectiveMuiPlan] ??
    signalScales.planPowerReadiness.enterprise;
  const featurePerformanceStress = clamp(
    (input.advancedFeatures.includes("custom-rendering")
      ? runtime.featurePerformanceStress.featureWeights["custom-rendering"]
      : 0) +
      (input.advancedFeatures.includes("drag-and-drop")
        ? runtime.featurePerformanceStress.featureWeights["drag-and-drop"]
        : 0) +
      (input.advancedFeatures.includes("server-side-data")
        ? runtime.featurePerformanceStress.featureWeights["server-side-data"]
        : 0) +
      (input.advancedFeatures.includes("virtualization")
        ? runtime.featurePerformanceStress.featureWeights.virtualization
        : 0) +
      (input.advancedFeatures.includes("i18n-localization")
        ? runtime.featurePerformanceStress.featureWeights[
            "i18n-localization"
          ]
        : 0) +
      (input.advancedFeatures.includes("timezone-logic")
        ? runtime.featurePerformanceStress.featureWeights["timezone-logic"]
        : 0),
    0,
    runtime.featurePerformanceStress.maximum
  );
  const muiPerformanceReadiness = clamp(
    (planFit.coverageScore / 100) * scenarioWeights.muiLeverage.coverageScore +
      (1 - planFit.coverageGap) * scenarioWeights.muiLeverage.coverageGap +
      (1 - planFit.integrationRisk) * scenarioWeights.muiLeverage.supportGap +
      muiUsageReadiness * scenarioWeights.muiLeverage.existingMuiUsage +
      handoffAlignment * scenarioWeights.muiLeverage.handoffAlignment +
      scorecard.deliveryStrength *
        runtime.performanceReadiness.mui.deliveryStrength +
      planPowerReadiness * runtime.performanceReadiness.mui.planPowerReadiness -
      featurePerformanceStress,
    0,
    1
  );
  const muiPerformanceRelief = performancePressure * muiPerformanceReadiness;
  const muiPerformanceBurden =
    performancePressure * (1 - muiPerformanceReadiness);
  const buildPerformanceReadiness = clamp(
    internalAbsorptionScore *
      runtime.performanceReadiness.build.internalAbsorption +
      buildReuseLeverageScore *
        runtime.performanceReadiness.build.buildReuseLeverage +
      knowledgeSpread * runtime.performanceReadiness.build.knowledgeSpread +
      handoffAlignment * runtime.performanceReadiness.build.handoffAlignment +
      ownershipClarity * runtime.performanceReadiness.build.ownershipClarity +
      scorecard.deliveryStrength *
        runtime.performanceReadiness.build.deliveryStrength,
    0,
    1
  );
  const buildPerformanceBurden =
    performancePressure * (1 - buildPerformanceReadiness);

  return {
    internalAbsorption: buildLever(internalAbsorptionScore, [
      "Delivery flow, ownership clarity, knowledge spread, and handoff quality define how cleanly the team can absorb custom work."
    ], calibration),
    buildReuseLeverage: buildLever(buildReuseLeverageScore, [
      "Design-system maturity, ownership clarity, and scope simplicity determine how much internal reuse the build path can capture."
    ], calibration),
    muiLeverage: buildLever(
      clamp(planFit.coverageScore / 100, 0, 1) *
        scenarioWeights.muiLeverage.coverageScore +
        clamp(1 - planFit.coverageGap, 0, 1) *
          scenarioWeights.muiLeverage.coverageGap +
        clamp(1 - planFit.supportGap, 0, 1) *
          scenarioWeights.muiLeverage.supportGap +
        signalScales.muiUsageLeverage[input.existingMuiUsage] *
          scenarioWeights.muiLeverage.existingMuiUsage +
        standardizationIntent *
          clamp(planFit.coverageScore / 100, 0, 1) *
          scenarioWeights.muiLeverage.standardizationIntent +
        packagedAffinity * scenarioWeights.muiLeverage.packagedAffinity +
        clamp(
          featureCount / runtime.muiLeverageFeatureCount.denominator,
          runtime.muiLeverageFeatureCount.floor,
          runtime.muiLeverageFeatureCount.ceiling
        ) *
          scenarioWeights.muiLeverage.featureCount +
        muiPerformanceRelief * scenarioWeights.muiLeverage.performanceRelief,
      [
        "Coverage fit, support fit, existing MUI usage, and packaged affinity determine how much leverage a packaged path can realistically deliver."
      ],
      calibration
    ),
    muiAdoptionBurden: buildLever(
      scenarioWeights.muiAdoptionBurden.existingMuiUsage[input.existingMuiUsage] +
        (input.existingMuiUsage === "none" &&
        input.designSystemMaturity === "high"
          ? scenarioWeights.muiAdoptionBurden.noMuiHighMaturity
          : input.existingMuiUsage === "none" &&
              input.designSystemMaturity === "medium"
            ? scenarioWeights.muiAdoptionBurden.noMuiMediumMaturity
            : 0) +
        scenarioWeights.muiAdoptionBurden.ownershipModel[input.ownershipModel] +
        (input.advancedFeatures.includes("custom-rendering")
          ? scenarioWeights.muiAdoptionBurden.customRendering
          : 0) +
        (input.advancedFeatures.includes("drag-and-drop")
          ? scenarioWeights.muiAdoptionBurden.dragAndDrop
          : 0) +
        (input.advancedFeatures.includes("timezone-logic")
          ? scenarioWeights.muiAdoptionBurden.timezoneLogic
          : 0) +
        (input.advancedFeatures.includes("i18n-localization")
          ? scenarioWeights.muiAdoptionBurden.i18nLocalization
          : 0) +
        (1 - handoffAlignment) *
          scenarioWeights.muiAdoptionBurden.handoffAlignment +
        muiPerformanceBurden *
          scenarioWeights.muiAdoptionBurden.performanceBurden +
        productionPressure *
          planFit.supportGap *
          scenarioWeights.muiAdoptionBurden.productionPressureSupportGap +
        planFit.coverageGap * scenarioWeights.muiAdoptionBurden.coverageGap,
      [
        "Existing MUI usage, ownership clarity, customization demand, and coverage gaps define adoption drag."
      ],
      calibration
    ),
    downsideTailRisk: buildLever(
      scorecard.ownershipRisk * scenarioWeights.downsideTailRisk.ownershipRisk +
        scorecard.deliveryRisk * scenarioWeights.downsideTailRisk.deliveryRisk +
        scorecard.qualityRisk * scenarioWeights.downsideTailRisk.qualityRisk +
      scorecard.functionalRisk *
          scenarioWeights.downsideTailRisk.functionalRisk +
        scenarioWeights.downsideTailRisk.dependentTeams[input.dependentTeams] *
          scenarioWeights.downsideTailRisk.dependentTeamsMultiplier +
        clamp(
          input.reactApps / runtime.downsideTailRisk.reactApps.denominator,
          runtime.downsideTailRisk.reactApps.floor,
          runtime.downsideTailRisk.reactApps.ceiling
        ) *
          scenarioWeights.downsideTailRisk.reactApps +
        scenarioWeights.downsideTailRisk.accessibilityTarget[
          input.accessibilityTarget
        ] *
          scenarioWeights.downsideTailRisk.accessibilityTargetMultiplier +
        clamp(
          featureCount / runtime.downsideTailRisk.featureCount.denominator,
          runtime.downsideTailRisk.featureCount.floor,
          runtime.downsideTailRisk.featureCount.ceiling
        ) *
          scenarioWeights.downsideTailRisk.featureCount +
        clamp((rowScale + columnScale - 2) / 5, 0, 1) *
          scenarioWeights.downsideTailRisk.scaleProfile +
        scenarioWeights.downsideTailRisk.deadlinePressure[
          input.deadlinePressure
        ] *
          scenarioWeights.downsideTailRisk.deadlinePressureMultiplier +
        (1 - knowledgeSpread) *
          scenarioWeights.downsideTailRisk.knowledgeSpread +
        (1 - handoffAlignment) *
          scenarioWeights.downsideTailRisk.handoffAlignment +
        performancePressure *
          scenarioWeights.downsideTailRisk.performancePressure +
        buildPerformanceBurden *
          scenarioWeights.downsideTailRisk.buildPerformanceBurden +
        muiPerformanceBurden *
          scenarioWeights.downsideTailRisk.muiPerformanceBurden +
        productionPressure *
          scenarioWeights.downsideTailRisk.productionPressure +
        standardizationIntent *
          (input.dependentTeams === "one" || input.dependentTeams === "two-three"
            ? 0
            : scenarioWeights.downsideTailRisk.standardizationIntent),
      [
        "Delivery, ownership, quality, and scale still define the downside-risk floor even in a deterministic fit model."
      ],
      calibration
    ),
    performancePressure: buildLever(performancePressure, [
      "Normalized pressure from the selected performance-sensitivity requirement."
    ], calibration),
    muiPerformanceReadiness: buildLever(muiPerformanceReadiness, [
      "Coverage, integration fit, and adoption conditions determine how ready the packaged path is for performance-sensitive work."
    ], calibration),
    muiPerformanceBurden: buildLever(muiPerformanceBurden, [
      "Remaining performance-sensitive burden on the packaged path after fit conditions are considered."
    ], calibration),
    buildPerformanceReadiness: buildLever(buildPerformanceReadiness, [
      "Internal absorption, reuse, knowledge spread, and handoff quality determine build-side readiness for performance-sensitive work."
    ], calibration),
    buildPerformanceBurden: buildLever(buildPerformanceBurden, [
      "Remaining performance-sensitive burden on the build path after internal readiness is considered."
    ], calibration)
  };
}

function buildScorecard(input, derivedFactors, calibration) {
  const pathScoreWeights = calibration.pathScoreWeights;
  const scenarioWeights = calibration.scenarioLeverWeights;
  const policy = calibration.deterministicPolicy;
  const buildFitWeights = pathScoreWeights.buildFit;
  const coreFitWeights = pathScoreWeights.coreFit;
  const premiumFitWeights = pathScoreWeights.premiumFit;
  const enterpriseFitWeights = pathScoreWeights.enterpriseFit;
  const functionalRisk = derivedFactors.functionalComplexity.score / 100;
  const qualityRisk = derivedFactors.qualityBurden.score / 100;
  const deliveryStrength = derivedFactors.deliveryMaturity.score / 100;
  const deliveryRisk = 1 - deliveryStrength;
  const ownershipRisk = derivedFactors.ownershipBurden.score / 100;
  const enterpriseNeed = derivedFactors.enterpriseReadiness.score / 100;
  const supportNeed = SUPPORT_INDEX[input.supportRequirement];
  const muiUsage = MUI_USAGE_INDEX[input.existingMuiUsage];
  const maturity = MATURITY_INDEX[input.designSystemMaturity];
  const dependentTeams = DEPENDENT_TEAMS_INDEX[input.dependentTeams];
  const rowScale = EXPECTED_ROWS_INDEX[input.expectedRows];
  const columnScale = EXPECTED_COLUMNS_INDEX[input.expectedColumns];
  const standardizationIntent =
    COMPONENT_STANDARDIZATION_GOAL_INDEX[input.componentStandardizationGoal] /
    3;
  const productionCriticalityNormalized =
    PRODUCTION_CRITICALITY_INDEX[input.productionCriticality] / 3;
  const knowledgeConcentration =
    KNOWLEDGE_CONCENTRATION_INDEX[input.knowledgeConcentration];
  const handoffFriction =
    DESIGN_DEV_HANDOFF_FRICTION_INDEX[input.designDevHandoffFriction];
  const signalScales = calibration.fitSignalScales;
  const runtime = calibration.scenarioLeverRuntime;
  const knowledgeSpread = signalScales.knowledgeSpread[input.knowledgeConcentration];
  const handoffAlignment =
    signalScales.handoffAlignment[input.designDevHandoffFriction];
  const performanceSensitivity =
    PERFORMANCE_SENSITIVITY_INDEX[input.performanceSensitivity];
  const teamScale = bucket(
    input.frontendDevelopers,
    calibration.inputScales.teamScaleBucket.smallMax,
    calibration.inputScales.teamScaleBucket.mediumMax
  );
  const appScale = bucket(
    input.reactApps,
    calibration.inputScales.appScaleBucket.smallMax,
    calibration.inputScales.appScaleBucket.mediumMax
  );

  const planFits = {
    core: buildPlanFit("core", input, derivedFactors, calibration),
    premium: buildPlanFit("premium", input, derivedFactors, calibration),
    enterprise: buildPlanFit("enterprise", input, derivedFactors, calibration)
  };
  const ownershipClarity = signalScales.ownershipClarity[input.ownershipModel];
  const teamFocus = signalScales.teamFocus[input.dependentTeams];
  const reworkStability = signalScales.reworkStability[input.reworkFrequency];
  const deadlineSlack = signalScales.deadlineSlack[input.deadlinePressure];
  const supportLightness = signalScales.supportLightness[input.supportRequirement];
  const appFocus = clamp(
    1 -
      Math.max(0, input.reactApps - runtime.appFocus.baselineApps) *
        runtime.appFocus.perAdditionalAppPenalty,
    runtime.appFocus.floor,
    runtime.appFocus.ceiling
  );
  const maturityStrength =
    signalScales.maturityStrength[input.designSystemMaturity];
  const internalAbsorptionStrength = clamp(
    deliveryStrength * scenarioWeights.internalAbsorption.deliveryStrength +
      maturityStrength * scenarioWeights.internalAbsorption.maturityStrength +
      ownershipClarity * scenarioWeights.internalAbsorption.ownershipClarity +
      teamFocus * scenarioWeights.internalAbsorption.teamFocus +
      reworkStability * scenarioWeights.internalAbsorption.reworkStability +
      knowledgeSpread *
        scenarioWeights.internalAbsorption.knowledgeSpread +
      handoffAlignment *
        scenarioWeights.internalAbsorption.handoffAlignment +
      deadlineSlack * scenarioWeights.internalAbsorption.deadlineSlack +
      supportLightness * scenarioWeights.internalAbsorption.supportLightness +
      appFocus * scenarioWeights.internalAbsorption.appFocus,
    0,
    1
  );
  const ownershipHorizonEffects = buildOwnershipHorizonEffects(input, calibration, {
    ownershipClarity,
    knowledgeSpread,
    dependentTeamsWeakness: clamp(
      dependentTeams /
      calibration.ownershipHorizonEffects.ownershipBurden
          .dependentTeamsMaxIndex,
      0,
      1
    ),
    supportNeed,
    productionCriticalityNormalized,
    standardizationIntent,
    appScale,
    teamScale,
    maturityStrength,
    internalAbsorptionStrength
  });

  const buildFit = clamp(
    buildFitWeights.base -
      functionalRisk * buildFitWeights.functionalRisk -
      qualityRisk * buildFitWeights.qualityRisk -
      ownershipRisk * buildFitWeights.ownershipRisk -
      deliveryRisk * buildFitWeights.deliveryRisk +
      (maturity - 2) * buildFitWeights.maturityBonus -
      supportNeed * buildFitWeights.supportNeed -
      (rowScale >= 3 ? buildFitWeights.rowPenalty : 0) -
      (columnScale >= 3 ? buildFitWeights.columnPenalty : 0) +
      ownershipHorizonEffects.buildFitEffect,
    0,
    100
  );

  const containedScope =
    functionalRisk <= policy.containedScope.maxFunctionalRisk &&
    qualityRisk <= policy.containedScope.maxQualityRisk &&
    input.advancedFeatures.length <= policy.containedScope.maxAdvancedFeatures &&
    input.dataHeavyScreens <= policy.containedScope.maxDataHeavyScreens &&
    rowScale <= policy.containedScope.maxRowScale &&
    columnScale <= policy.containedScope.maxColumnScale;

  const coreFit = clamp(
    coreFitWeights.base +
      planFits.core.coverageScore * coreFitWeights.coverageScore +
      (containedScope ? coreFitWeights.simpleScopeBonus : 0) +
      muiUsage * coreFitWeights.muiUsageBonus -
      functionalRisk * coreFitWeights.functionalRisk -
      qualityRisk * coreFitWeights.qualityRisk -
      Math.max(
        0,
        enterpriseNeed - policy.enterpriseNeedThresholds.corePenaltyStartsAt
      ) *
        coreFitWeights.enterpriseNeedPenalty,
    0,
    100
  );

  const premiumFit = clamp(
    premiumFitWeights.base +
      planFits.premium.coverageScore * premiumFitWeights.coverageScore +
      functionalRisk * premiumFitWeights.functionalRisk +
      qualityRisk * premiumFitWeights.qualityRisk +
      muiUsage * premiumFitWeights.muiUsageBonus -
      (containedScope ? premiumFitWeights.simpleScopePenalty : 0) -
      Math.max(
        0,
        enterpriseNeed - policy.enterpriseNeedThresholds.premiumPenaltyStartsAt
      ) *
        premiumFitWeights.enterpriseNeedPenalty,
    0,
    100
  );

  const enterpriseFit = clamp(
    enterpriseFitWeights.base +
      planFits.enterprise.coverageScore * enterpriseFitWeights.coverageScore +
      enterpriseNeed * enterpriseFitWeights.enterpriseNeed +
      supportNeed * enterpriseFitWeights.supportNeed +
      appScale * enterpriseFitWeights.appScale +
      teamScale * enterpriseFitWeights.teamScale -
      dependentTeams * enterpriseFitWeights.dependentTeams -
      productionCriticalityNormalized *
        supportNeed *
        enterpriseFitWeights.productionCriticality +
      (containedScope
        ? enterpriseFitWeights.simpleScopeAdjustment
        : 0) +
      ownershipHorizonEffects.enterpriseFitEffect,
    0,
    100
  );

  const icpScore = clamp(
    pathScoreWeights.icpScore.base +
      functionalRisk * pathScoreWeights.icpScore.functionalRisk +
      qualityRisk * pathScoreWeights.icpScore.qualityRisk +
      ownershipRisk * pathScoreWeights.icpScore.ownershipRisk +
      enterpriseNeed * pathScoreWeights.icpScore.enterpriseNeed +
      muiUsage * pathScoreWeights.icpScore.muiUsage +
      appScale * pathScoreWeights.icpScore.appScale +
      teamScale * pathScoreWeights.icpScore.teamScale +
      standardizationIntent * pathScoreWeights.icpScore.standardizationIntent +
      dependentTeams * pathScoreWeights.icpScore.dependentTeams -
      (containedScope ? pathScoreWeights.icpScore.simpleScopePenalty : 0),
    0,
    100
  );

  const enterpriseFitStrong =
    enterpriseNeed >= policy.enterpriseNeedThresholds.strongEnterpriseNeed &&
    supportNeed >= policy.supportNeedThresholds.supportOrProcurementMin;
  const lowSupportNeed = supportNeed <= policy.supportNeedThresholds.lowMax;
  const supportOrProcurementNeed =
    supportNeed >= policy.supportNeedThresholds.supportOrProcurementMin;
  const buildFriendlyContext =
    lowSupportNeed &&
    input.designSystemMaturity === policy.buildFriendlyContext.requiredDesignSystemMaturity &&
    input.dependentTeams === policy.buildFriendlyContext.requiredDependentTeams &&
    input.ownershipModel === policy.buildFriendlyContext.requiredOwnershipModel &&
    input.changeLeadTime === policy.buildFriendlyContext.requiredChangeLeadTime &&
    input.reworkFrequency === policy.buildFriendlyContext.requiredReworkFrequency &&
    input.deadlinePressure === policy.buildFriendlyContext.requiredDeadlinePressure &&
    rowScale <= policy.buildFriendlyContext.maxRowScale &&
    columnScale <= policy.buildFriendlyContext.maxColumnScale &&
    input.advancedFeatures.length <= policy.buildFriendlyContext.maxAdvancedFeatures &&
    policy.buildFriendlyContext.allowedAccessibilityTargets.includes(
      input.accessibilityTarget
    );

  let autoSelectedMuiPlan = "core";

  if (
    planFits.enterprise.coverageScore >=
      policy.muiPlanSelection.enterprise.minCoverageScore &&
    (enterpriseFitStrong ||
      input.componentStandardizationGoal === "platform-standard" ||
      input.supportRequirement === "procurement-sla")
  ) {
    autoSelectedMuiPlan = "enterprise";
  } else if (
    planFits.premium.coverageScore >=
      policy.muiPlanSelection.premium.minCoverageScore &&
    !(
      containedScope &&
      lowSupportNeed &&
      input.advancedFeatures.length === 0 &&
      input.primaryUseCase !== "data-grid"
    ) &&
    (functionalRisk >= policy.muiPlanSelection.premium.minFunctionalRisk ||
      qualityRisk >= policy.muiPlanSelection.premium.minQualityRisk ||
      rowScale >= policy.muiPlanSelection.premium.minRowScale ||
      columnScale >= policy.muiPlanSelection.premium.minColumnScale ||
      input.advancedFeatures.length >=
        policy.muiPlanSelection.premium.minAdvancedFeatures)
  ) {
    autoSelectedMuiPlan = "premium";
  }

  const effectiveMuiPlan = autoSelectedMuiPlan;
  const effectivePlanFit = planFits[effectiveMuiPlan];
  const scenarioLevers = buildScenarioLevers(input, {
    functionalRisk,
    qualityRisk,
    deliveryStrength,
    deliveryRisk,
    ownershipRisk,
    enterpriseNeed,
    supportNeed,
    muiUsage,
    maturity,
    effectiveMuiPlan,
    effectivePlanFit
  }, calibration);

  return {
    derivedFactors,
    planFits,
    effectivePlanFit,
    functionalRisk,
    qualityRisk,
    deliveryStrength,
    deliveryRisk,
    ownershipRisk,
    enterpriseNeed,
    supportNeed,
    muiUsage,
    maturity,
    standardizationIntent,
    productionCriticalityNormalized,
    knowledgeConcentration,
    handoffFriction,
    performanceSensitivity,
    teamScale,
    appScale,
    buildFit: roundTo(buildFit),
    coreFit: roundTo(coreFit),
    premiumFit: roundTo(premiumFit),
    enterpriseFit: roundTo(enterpriseFit),
    icpScore: roundTo(icpScore),
    containedScope,
    simpleScope: containedScope,
    buildFriendlyContext,
    enterpriseFitStrong,
    lowSupportNeed,
    supportOrProcurementNeed,
    autoSelectedMuiPlan,
    effectiveMuiPlan,
    scenarioLevers,
    internalAbsorption: scenarioLevers.internalAbsorption.score,
    buildReuseLeverage: scenarioLevers.buildReuseLeverage.score,
    muiLeverage: scenarioLevers.muiLeverage.score,
    muiAdoptionBurden: scenarioLevers.muiAdoptionBurden.score
  };
}

function ownershipClarityScore(input) {
  return {
    "same-product-team": 90,
    "frontend-platform-team": 72,
    "several-teams-informal": 44,
    unclear: 24
  }[input.ownershipModel];
}

function knowledgeSpreadScore(input) {
  return {
    shared: 92,
    "few-owners": 62,
    "single-owner": 28,
    unknown: 46
  }[input.knowledgeConcentration];
}

function supportLightnessScore(input) {
  return {
    community: 92,
    standard: 68,
    priority: 42,
    "procurement-sla": 18
  }[input.supportRequirement];
}

function buildPathComponent(key, label, rawImpact, signal, detail) {
  return {
    key,
    label,
    impact: roundTo(rawImpact),
    signal,
    detail
  };
}

function normalizeShares(signalConfig) {
  const entries = Object.entries(signalConfig);
  const totalShare = entries.reduce((sum, [, config]) => sum + config.share, 0);

  if (!Number.isFinite(totalShare) || totalShare <= 0) {
    throw new Error("Path-fit signal shares must sum to a positive value.");
  }

  return Object.fromEntries(
    entries.map(([key, config]) => [
      key,
      {
        ...config,
        normalizedShare: config.share / totalShare
      }
    ])
  );
}

function budgetContribution(budget, signalConfig, normalizedSignals) {
  return Object.keys(signalConfig).reduce((sum, key) => {
    const score = clamp(normalizedSignals[key] ?? 0, 0, 100);
    const share = signalConfig[key].normalizedShare ?? 0;

    return sum + budget * share * (score / 100);
  }, 0);
}

function buildBudgetComponents(budget, signalConfig, normalizedSignals, signalType) {
  return Object.entries(signalConfig).map(([key, config]) =>
    buildPathComponent(
      key,
      config.label,
      budget * config.normalizedShare * (clamp(normalizedSignals[key] ?? 0, 0, 100) / 100),
      signalType,
      config.description
    )
  );
}

function summarizeComponents(components, calibration) {
  const summaryConfig = calibration.pathFitComponentWeights.shared.componentSummary;
  const minImpact = summaryConfig.minImpact;
  const maxItems = summaryConfig.maxItems;
  const positive = components
    .filter((component) => component.signal === "help" && component.impact >= minImpact)
    .sort((left, right) => right.impact - left.impact)
    .slice(0, maxItems)
    .map((component) => component.detail);

  const negative = components
    .filter((component) => component.signal === "hurt" && component.impact >= minImpact)
    .sort((left, right) => right.impact - left.impact)
    .slice(0, maxItems)
    .map((component) => component.detail);

  return { positive, negative };
}

function buildPathFitEntry(
  key,
  label,
  score,
  components,
  calibration,
  eligible = true,
  metadata = null
) {
  const normalizedScore = roundTo(clamp(score, 0, 100));
  const summaries = summarizeComponents(components, calibration);

  return {
    key,
    label,
    score: normalizedScore,
    level: levelFromScore(normalizedScore, calibration.scoreBands),
    eligible,
    components,
    calibration: metadata,
    strengths: summaries.positive,
    drags: summaries.negative
  };
}

function buildPathFits(input, derivedFactors, scorecard, planFits, calibration) {
  const pathFitWeights = calibration.pathFitComponentWeights;
  const sharedWeights = pathFitWeights.shared;
  const scoreAdjustments = pathFitWeights.scoreAdjustments;
  const buildPathConfig = pathFitWeights.build;
  const corePathConfig = pathFitWeights.core;
  const premiumPathConfig = pathFitWeights.premium;
  const enterprisePathConfig = pathFitWeights.enterprise;
  const eligibility = pathFitWeights.eligibility;
  const featureDemandRaw = input.advancedFeatures.reduce(
    (sum, feature) => sum + calibration.inputScales.advancedFeatureWeights[feature],
    0
  );
  const featureDemand = clamp(
    (featureDemandRaw / sharedWeights.featureDemand.denominator) *
      sharedWeights.featureDemand.multiplier,
    0,
    100
  );
  const containedScopeScore = scorecard.containedScope
    ? sharedWeights.containedScopeScore.trueValue
    : sharedWeights.containedScopeScore.falseValue;
  const supportLightness = supportLightnessScore(input);
  const ownershipClarity = ownershipClarityScore(input);
  const knowledgeSpread = knowledgeSpreadScore(input);
  const supportNeedFitScore = clamp(scorecard.supportNeed * 34, 0, 100);
  const muiUsageScore = clamp(scorecard.muiUsage * 50, 0, 100);
  const lowProductionCriticalityScore = clamp(
    100 - scorecard.productionCriticalityNormalized * 100,
    0,
    100
  );
  const containedAdvancedDemandScore = clamp(100 - featureDemand, 0, 100);
  const advancedDataNeed =
    input.primaryUseCase === "data-grid" || input.primaryUseCase === "scheduler"
      ? clamp(
          sharedWeights.advancedDataNeed.base +
            (EXPECTED_ROWS_INDEX[input.expectedRows] - 1) *
              sharedWeights.advancedDataNeed.rowIncrement +
            (EXPECTED_COLUMNS_INDEX[input.expectedColumns] - 1) *
              sharedWeights.advancedDataNeed.columnIncrement +
            input.advancedFeatures.length *
              sharedWeights.advancedDataNeed.featureIncrement,
          0,
          100
        )
      : clamp(
          featureDemand * sharedWeights.advancedDataNeed.fallbackMultiplier,
          0,
          100
        );
  const standardizationContext = clamp(
    scorecard.standardizationIntent *
      sharedWeights.standardizationContext.standardizationIntent +
      bucket(
        input.reactApps,
        calibration.inputScales.appScaleBucket.smallMax,
        calibration.inputScales.appScaleBucket.mediumMax
      ) * sharedWeights.standardizationContext.appScale +
      bucket(
        input.frontendDevelopers,
        calibration.inputScales.teamScaleBucket.smallMax,
        calibration.inputScales.teamScaleBucket.mediumMax
      ) * sharedWeights.standardizationContext.teamScale +
      DEPENDENT_TEAMS_INDEX[input.dependentTeams] *
        sharedWeights.standardizationContext.dependentTeams,
    0,
    100
  );
  const buildScore = clamp(
    scorecard.buildFit +
      (scorecard.buildFriendlyContext
        ? scoreAdjustments.build.buildFriendlyContextBonus
        : 0) +
      (input.existingMuiUsage === "none"
        ? scoreAdjustments.build.noMuiUsageBonus
        : 0) +
      (ownershipClarity >= scoreAdjustments.build.ownershipClarityThreshold
        ? scoreAdjustments.build.ownershipClarityBonus
        : 0),
    0,
    100
  );
  const coreScore = clamp(
    scorecard.coreFit -
      (scorecard.buildFriendlyContext && input.existingMuiUsage === "none"
        ? scoreAdjustments.core.buildFriendlyNoMuiPenalty
        : 0),
    0,
    100
  );
  const premiumScore = clamp(
    scorecard.premiumFit +
      (advancedDataNeed >= scoreAdjustments.premium.advancedDataNeedThreshold
        ? scoreAdjustments.premium.advancedDataNeedBonus
        : 0) -
      (derivedFactors.enterpriseReadiness.score >=
        scoreAdjustments.premium.enterpriseReadinessThreshold &&
      scorecard.supportNeed >= scoreAdjustments.premium.enterpriseSupportThreshold
        ? scoreAdjustments.premium.enterprisePullPenalty
        : 0),
    0,
    100
  );
  const enterpriseScore = clamp(
    scorecard.enterpriseFit +
      (input.supportRequirement === "procurement-sla"
        ? scoreAdjustments.enterprise.procurementSlaBonus
        : 0) +
      (input.componentStandardizationGoal === "platform-standard"
        ? scoreAdjustments.enterprise.platformStandardBonus
        : 0) +
      (input.reactApps >= scoreAdjustments.enterprise.reactAppsThreshold
        ? scoreAdjustments.enterprise.reactAppsBonus
        : 0) +
      (scorecard.productionCriticalityNormalized >=
      scoreAdjustments.enterprise.productionCriticalityThreshold
        ? scoreAdjustments.enterprise.productionCriticalityBonus
        : 0) -
      (scorecard.supportNeed <= scoreAdjustments.enterprise.lowSupportThreshold
        ? scoreAdjustments.enterprise.lowSupportPenalty
        : scorecard.supportNeed ===
            scoreAdjustments.enterprise.prioritySupportThreshold
          ? scoreAdjustments.enterprise.prioritySupportPenalty
          : 0) -
      (input.componentStandardizationGoal !== "platform-standard"
        ? scoreAdjustments.enterprise.noPlatformStandardPenalty
        : 0) -
      (input.reactApps < scoreAdjustments.enterprise.reactAppsPenaltyThreshold
        ? scoreAdjustments.enterprise.reactAppsLessThan3Penalty
        : 0),
    0,
    100
  );

  const buildPositiveSignals = normalizeShares(buildPathConfig.positiveSignals);
  const buildDragSignals = normalizeShares(buildPathConfig.dragSignals);
  const corePositiveSignals = normalizeShares(corePathConfig.positiveSignals);
  const coreDragSignals = normalizeShares(corePathConfig.dragSignals);
  const premiumPositiveSignals = normalizeShares(premiumPathConfig.positiveSignals);
  const premiumDragSignals = normalizeShares(premiumPathConfig.dragSignals);
  const enterprisePositiveSignals = normalizeShares(enterprisePathConfig.positiveSignals);
  const enterpriseDragSignals = normalizeShares(enterprisePathConfig.dragSignals);

  const buildPositiveScores = {
    deliveryMaturity: derivedFactors.deliveryMaturity.score,
    internalAbsorption: scorecard.internalAbsorption,
    buildReuseLeverage: scorecard.buildReuseLeverage,
    ownershipClarity,
    knowledgeSpread,
    supportLightness
  };
  const buildDragScores = {
    functionalComplexity: derivedFactors.functionalComplexity.score,
    qualityBurden: derivedFactors.qualityBurden.score,
    ownershipBurden: derivedFactors.ownershipBurden.score,
    enterpriseReadiness: derivedFactors.enterpriseReadiness.score,
    productionCriticality: clamp(
      derivedFactors.productionCriticality *
        (scorecard.supportNeed <= 1 ? 1 : 0.65),
      0,
      100
    )
  };
  const corePositiveScores = {
    coverageScore: planFits.core.coverageScore,
    containedScope: containedScopeScore,
    supportLightness,
    lowProductionCriticality: lowProductionCriticalityScore,
    containedAdvancedDemand: containedAdvancedDemandScore,
    existingMuiUsage: muiUsageScore
  };
  const coreDragScores = {
    supportGap: planFits.core.supportGap,
    coverageGap: planFits.core.coverageGap,
    integrationRisk: planFits.core.integrationRisk,
    muiAdoptionBurden: scorecard.muiAdoptionBurden,
    enterpriseReadiness: derivedFactors.enterpriseReadiness.score
  };
  const premiumPositiveScores = {
    coverageScore: planFits.premium.coverageScore,
    featureDemand,
    functionalComplexity: derivedFactors.functionalComplexity.score,
    advancedDataNeed,
    midTierSupportFit: supportNeedFitScore,
    muiLeverage: scorecard.muiLeverage
  };
  const premiumDragScores = {
    containedScope: containedScopeScore,
    enterpriseReadiness: derivedFactors.enterpriseReadiness.score,
    muiAdoptionBurden: scorecard.muiAdoptionBurden
  };
  const enterprisePositiveScores = {
    coverageScore: planFits.enterprise.coverageScore,
    enterpriseReadiness: derivedFactors.enterpriseReadiness.score,
    supportRequirement: supportNeedFitScore,
    productionCriticality: clamp(
      scorecard.productionCriticalityNormalized * 100,
      0,
      100
    ),
    standardizationContext,
    existingMuiUsage: muiUsageScore
  };
  const enterpriseDragScores = {
    containedScope: containedScopeScore,
    lowSupportRequirement: supportLightness,
    lowCriticality: lowProductionCriticalityScore,
    coverageWeakness: planFits.enterprise.coverageGap
  };

  const buildPositiveContribution = budgetContribution(
    buildPathConfig.positiveBudget,
    buildPositiveSignals,
    buildPositiveScores
  );
  const buildDragContribution = budgetContribution(
    buildPathConfig.dragBudget,
    buildDragSignals,
    buildDragScores
  );
  const corePositiveContribution = budgetContribution(
    corePathConfig.positiveBudget,
    corePositiveSignals,
    corePositiveScores
  );
  const coreDragContribution = budgetContribution(
    corePathConfig.dragBudget,
    coreDragSignals,
    coreDragScores
  );
  const premiumPositiveContribution = budgetContribution(
    premiumPathConfig.positiveBudget,
    premiumPositiveSignals,
    premiumPositiveScores
  );
  const premiumDragContribution = budgetContribution(
    premiumPathConfig.dragBudget,
    premiumDragSignals,
    premiumDragScores
  );
  const enterprisePositiveContribution = budgetContribution(
    enterprisePathConfig.positiveBudget,
    enterprisePositiveSignals,
    enterprisePositiveScores
  );
  const enterpriseDragContribution = budgetContribution(
    enterprisePathConfig.dragBudget,
    enterpriseDragSignals,
    enterpriseDragScores
  );

  const buildComponents = [
    ...buildBudgetComponents(
      buildPathConfig.positiveBudget,
      buildPositiveSignals,
      buildPositiveScores,
      "help"
    ),
    ...buildBudgetComponents(
      buildPathConfig.dragBudget,
      buildDragSignals,
      buildDragScores,
      "hurt"
    )
  ];
  const coreComponents = [
    ...buildBudgetComponents(
      corePathConfig.positiveBudget,
      corePositiveSignals,
      corePositiveScores,
      "help"
    ),
    ...buildBudgetComponents(
      corePathConfig.dragBudget,
      coreDragSignals,
      coreDragScores,
      "hurt"
    )
  ];
  const premiumComponents = [
    ...buildBudgetComponents(
      premiumPathConfig.positiveBudget,
      premiumPositiveSignals,
      premiumPositiveScores,
      "help"
    ),
    ...buildBudgetComponents(
      premiumPathConfig.dragBudget,
      premiumDragSignals,
      premiumDragScores,
      "hurt"
    )
  ];
  const enterpriseComponents = [
    ...buildBudgetComponents(
      enterprisePathConfig.positiveBudget,
      enterprisePositiveSignals,
      enterprisePositiveScores,
      "help"
    ),
    ...buildBudgetComponents(
      enterprisePathConfig.dragBudget,
      enterpriseDragSignals,
      enterpriseDragScores,
      "hurt"
    )
  ];

  const enterpriseEligible =
    enterpriseScore >= eligibility.enterprise.minScore ||
    scorecard.enterpriseFitStrong ||
    input.supportRequirement === "procurement-sla" ||
    input.componentStandardizationGoal === "platform-standard" ||
    eligibility.enterprise.supportedUseCases.includes(input.primaryUseCase);
  const premiumEligible =
    premiumScore >= eligibility.premium.minScore ||
    eligibility.premium.supportedUseCases.includes(input.primaryUseCase) ||
    input.advancedFeatures.length >= eligibility.premium.minAdvancedFeatures;

  return {
    build: buildPathFitEntry("build", PATH_LABELS.build, buildScore, buildComponents, calibration, true, {
      baseScore: buildPathConfig.baseScore,
      positiveBudget: buildPathConfig.positiveBudget,
      dragBudget: buildPathConfig.dragBudget,
      positiveContribution: roundTo(buildPositiveContribution),
      dragContribution: roundTo(buildDragContribution)
    }),
    core: buildPathFitEntry("core", PATH_LABELS.core, coreScore, coreComponents, calibration, true, {
      baseScore: corePathConfig.baseScore,
      positiveBudget: corePathConfig.positiveBudget,
      dragBudget: corePathConfig.dragBudget,
      positiveContribution: roundTo(corePositiveContribution),
      dragContribution: roundTo(coreDragContribution)
    }),
    premium: buildPathFitEntry(
      "premium",
      PATH_LABELS.premium,
      premiumScore,
      premiumComponents,
      calibration,
      premiumEligible,
      {
        baseScore: premiumPathConfig.baseScore,
        positiveBudget: premiumPathConfig.positiveBudget,
        dragBudget: premiumPathConfig.dragBudget,
        positiveContribution: roundTo(premiumPositiveContribution),
        dragContribution: roundTo(premiumDragContribution)
      }
    ),
    enterprise: buildPathFitEntry(
      "enterprise",
      PATH_LABELS.enterprise,
      enterpriseScore,
      enterpriseComponents,
      calibration,
      enterpriseEligible,
      {
        baseScore: enterprisePathConfig.baseScore,
        positiveBudget: enterprisePathConfig.positiveBudget,
        dragBudget: enterprisePathConfig.dragBudget,
        positiveContribution: roundTo(enterprisePositiveContribution),
        dragContribution: roundTo(enterpriseDragContribution)
      }
    )
  };
}

function buildDeterministicRecommendation(input, derivedFactors, scorecard, pathFits, calibration) {
  const confidencePolicy = calibration.confidencePolicy;
  const rankedPaths = Object.values(pathFits).sort(
    (left, right) => right.score - left.score
  );
  const eligiblePaths = rankedPaths.filter((path) => path.eligible);
  const winner = eligiblePaths[0] ?? rankedPaths[0];
  const runnerUp =
    eligiblePaths.find((path) => path.key !== winner.key) ?? rankedPaths[1] ?? winner;
  const scoreGap = clamp(roundTo(winner.score - runnerUp.score), 0, 100);
  const strongStrengthCount = winner.components.filter(
    (component) =>
      component.signal === "help" &&
      component.impact >= confidencePolicy.strongComponentImpact
  ).length;
  const strongDragCount = winner.components.filter(
    (component) =>
      component.signal === "hurt" &&
      component.impact >= confidencePolicy.strongComponentImpact
  ).length;
  const signalConsistencyBonus = clamp(
    strongStrengthCount *
      confidencePolicy.signalConsistency.strongStrengthMultiplier +
      Math.max(0, winner.strengths.length - winner.drags.length) *
        confidencePolicy.signalConsistency.winnerBalanceMultiplier +
      (confidencePolicy.signalConsistency.winnerLevelBonus[winner.level] ?? 0),
    0,
    confidencePolicy.signalConsistency.max
  );
  const scoreGapPenalty =
    confidencePolicy.ambiguityPenalty.scoreGapThresholds.find(
      (band) => scoreGap < band.lt
    )?.penalty ?? 0;
  const ambiguityPenalty = clamp(
    scoreGapPenalty +
      Math.max(0, strongDragCount - strongStrengthCount) *
        confidencePolicy.ambiguityPenalty.strongDragPenaltyMultiplier,
    0,
    confidencePolicy.ambiguityPenalty.max
  );
  const confidenceScore = clamp(
    Math.round(
      confidencePolicy.score.base +
        scoreGap * confidencePolicy.score.scoreGapMultiplier +
        signalConsistencyBonus -
        ambiguityPenalty
    ),
    confidencePolicy.score.min,
    confidencePolicy.score.max
  );
  const confidenceLevel =
    confidenceScore >= confidencePolicy.levels.high
      ? "high"
      : confidenceScore >= confidencePolicy.levels.moderate
        ? "moderate"
        : "qualified";

  const summaryLead = {
    build: "The team conditions favor owning the component internally.",
    core: "The requirements fit MUI Core without needing the heavier paid tiers.",
    premium:
      "The workload is advanced enough to justify Premium without a clear need for Enterprise.",
    enterprise:
      "Support, platform footprint, and standardization pressure justify Enterprise."
  }[winner.key];
  const tradeoffs =
    winner.drags.length > 0
      ? winner.drags.slice(0, 3)
      : [`${PATH_LABELS[runnerUp.key]} remains the closest alternative if conditions change.`];

  return {
    recommendation: {
      key: winner.key,
      option: winner.label,
      summary: `${summaryLead} ${winner.strengths[0] ?? "The top fit signals align most strongly here."}`,
      rankedPaths: rankedPaths.map((path, index) => ({
        rank: index + 1,
        key: path.key,
        label: path.label,
        score: path.score,
        eligible: path.eligible,
        level: path.level
      })),
      runnerUp: {
        key: runnerUp.key,
        label: runnerUp.label,
        score: runnerUp.score,
        scoreGap
      },
      primaryReasons: winner.strengths.slice(0, 4),
      tradeoffs
    },
    confidence: {
      score: confidenceScore,
      level: confidenceLevel,
      rationale:
        "Confidence is deterministic. It comes from the winner-versus-runner-up score margin, a signal-consistency bonus, and an ambiguity penalty when the top paths are close.",
      components: {
        scoreGap,
        signalConsistencyBonus,
        ambiguityPenalty
      }
    }
  };
}

function buildFitSnapshot(input, calibration) {
  const derivedFactors = buildDerivedFactors(input, calibration);
  const scorecard = buildScorecard(input, derivedFactors, calibration);
  const pathFits = buildPathFits(input, derivedFactors, scorecard, scorecard.planFits, calibration);
  const { recommendation, confidence } = buildDeterministicRecommendation(
    input,
    derivedFactors,
    scorecard,
    pathFits,
    calibration
  );

  return {
    derivedFactors,
    scorecard,
    pathFits,
    recommendation,
    confidence
  };
}

function cloneInput(input) {
  return {
    ...input,
    advancedFeatures: [...input.advancedFeatures]
  };
}

function formatSensitivityValueLabel(inputKey, value) {
  if (value === undefined || value === null || value === "") {
    return "Not set";
  }

  const label = SENSITIVITY_VALUE_LABELS[inputKey]?.[value];

  if (label) {
    return label;
  }

  return typeof value === "number" ? String(value) : String(value);
}

function formatSensitivityFieldLabel(inputKey) {
  return SENSITIVITY_INPUT_LABELS[inputKey] ?? inputKey;
}

function formatSensitivityDelta(value) {
  const rounded = roundTo(value, 1);
  return `${rounded > 0 ? "+" : ""}${rounded}`;
}

function buildSensitivityChangeLabel(inputKey, before, after) {
  return `${formatSensitivityValueLabel(inputKey, before)} -> ${formatSensitivityValueLabel(inputKey, after)}`;
}

function createSensitivityCandidate(inputKey, label, testedChange, apply) {
  return {
    inputKey,
    label,
    testedChange,
    apply
  };
}

function buildAdjacentEnumCandidates(inputKey, currentValue, values, label) {
  const candidates = [];
  const currentIndex = values.indexOf(currentValue);

  if (currentIndex === -1) {
    return candidates;
  }

  const previousValue = values[currentIndex - 1];
  const nextValue = values[currentIndex + 1];

  if (previousValue !== undefined) {
    candidates.push(
      createSensitivityCandidate(
        inputKey,
        label,
        buildSensitivityChangeLabel(inputKey, currentValue, previousValue),
        (input) => ({ ...cloneInput(input), [inputKey]: previousValue })
      )
    );
  }

  if (nextValue !== undefined) {
    candidates.push(
      createSensitivityCandidate(
        inputKey,
        label,
        buildSensitivityChangeLabel(inputKey, currentValue, nextValue),
        (input) => ({ ...cloneInput(input), [inputKey]: nextValue })
      )
    );
  }

  return candidates;
}

function buildNumericCandidates(inputKey, currentValue, label, step = 1, minimum = 0) {
  const candidates = [];
  const lowerValue = Math.max(minimum, currentValue - step);
  const upperValue = currentValue + step;

  if (lowerValue !== currentValue) {
    candidates.push(
      createSensitivityCandidate(
        inputKey,
        label,
        `${currentValue} -> ${lowerValue}`,
        (input) => ({ ...cloneInput(input), [inputKey]: lowerValue })
      )
    );
  }

  if (upperValue !== currentValue) {
    candidates.push(
      createSensitivityCandidate(
        inputKey,
        label,
        `${currentValue} -> ${upperValue}`,
        (input) => ({ ...cloneInput(input), [inputKey]: upperValue })
      )
    );
  }

  return candidates;
}

function buildFeatureToggleCandidates(input, label) {
  return Array.from(ADVANCED_FEATURES).map((feature) => {
    const selected = input.advancedFeatures.includes(feature);
    const nextFeatures = selected
      ? input.advancedFeatures.filter((item) => item !== feature)
      : [...input.advancedFeatures, feature];
    const action = selected ? "Remove" : "Add";

    return createSensitivityCandidate(
      "advancedFeatures",
      label,
      `${action} ${formatSensitivityValueLabel("advancedFeatures", feature)}`,
      (candidateInput) => ({
        ...cloneInput(candidateInput),
        advancedFeatures: [...nextFeatures]
      })
    );
  });
}

function buildSensitivityCandidates(input) {
  const candidates = [
    ...buildNumericCandidates(
      "frontendDevelopers",
      input.frontendDevelopers,
      formatSensitivityFieldLabel("frontendDevelopers")
    ),
    ...buildNumericCandidates(
      "reactApps",
      input.reactApps,
      formatSensitivityFieldLabel("reactApps")
    ),
    ...buildNumericCandidates(
      "dataHeavyScreens",
      input.dataHeavyScreens,
      formatSensitivityFieldLabel("dataHeavyScreens")
    ),
    ...buildAdjacentEnumCandidates(
      "dependentTeams",
      input.dependentTeams,
      SENSITIVITY_ORDERED_VALUES.dependentTeams,
      formatSensitivityFieldLabel("dependentTeams")
    ),
    ...buildAdjacentEnumCandidates(
      "ownershipModel",
      input.ownershipModel,
      SENSITIVITY_ORDERED_VALUES.ownershipModel,
      formatSensitivityFieldLabel("ownershipModel")
    ),
    ...buildAdjacentEnumCandidates(
      "existingMuiUsage",
      input.existingMuiUsage,
      SENSITIVITY_ORDERED_VALUES.existingMuiUsage,
      formatSensitivityFieldLabel("existingMuiUsage")
    ),
    ...buildAdjacentEnumCandidates(
      "designSystemMaturity",
      input.designSystemMaturity,
      SENSITIVITY_ORDERED_VALUES.designSystemMaturity,
      formatSensitivityFieldLabel("designSystemMaturity")
    ),
    ...buildAdjacentEnumCandidates(
      "primaryUseCase",
      input.primaryUseCase,
      SENSITIVITY_ORDERED_VALUES.primaryUseCase,
      formatSensitivityFieldLabel("primaryUseCase")
    ),
    ...buildAdjacentEnumCandidates(
      "expectedRows",
      input.expectedRows,
      SENSITIVITY_ORDERED_VALUES.expectedRows,
      formatSensitivityFieldLabel("expectedRows")
    ),
    ...buildAdjacentEnumCandidates(
      "expectedColumns",
      input.expectedColumns,
      SENSITIVITY_ORDERED_VALUES.expectedColumns,
      formatSensitivityFieldLabel("expectedColumns")
    ),
    ...buildAdjacentEnumCandidates(
      "accessibilityTarget",
      input.accessibilityTarget,
      SENSITIVITY_ORDERED_VALUES.accessibilityTarget,
      formatSensitivityFieldLabel("accessibilityTarget")
    ),
    ...buildAdjacentEnumCandidates(
      "changeLeadTime",
      input.changeLeadTime,
      SENSITIVITY_ORDERED_VALUES.changeLeadTime,
      formatSensitivityFieldLabel("changeLeadTime")
    ),
    ...buildAdjacentEnumCandidates(
      "performanceSensitivity",
      input.performanceSensitivity,
      SENSITIVITY_ORDERED_VALUES.performanceSensitivity,
      formatSensitivityFieldLabel("performanceSensitivity")
    ),
    ...buildAdjacentEnumCandidates(
      "reworkFrequency",
      input.reworkFrequency,
      SENSITIVITY_ORDERED_VALUES.reworkFrequency,
      formatSensitivityFieldLabel("reworkFrequency")
    ),
    ...buildAdjacentEnumCandidates(
      "knowledgeConcentration",
      input.knowledgeConcentration,
      SENSITIVITY_ORDERED_VALUES.knowledgeConcentration,
      formatSensitivityFieldLabel("knowledgeConcentration")
    ),
    ...buildAdjacentEnumCandidates(
      "designDevHandoffFriction",
      input.designDevHandoffFriction,
      SENSITIVITY_ORDERED_VALUES.designDevHandoffFriction,
      formatSensitivityFieldLabel("designDevHandoffFriction")
    ),
    ...buildAdjacentEnumCandidates(
      "componentStandardizationGoal",
      input.componentStandardizationGoal,
      SENSITIVITY_ORDERED_VALUES.componentStandardizationGoal,
      formatSensitivityFieldLabel("componentStandardizationGoal")
    ),
    ...buildAdjacentEnumCandidates(
      "deadlinePressure",
      input.deadlinePressure,
      SENSITIVITY_ORDERED_VALUES.deadlinePressure,
      formatSensitivityFieldLabel("deadlinePressure")
    ),
    ...buildAdjacentEnumCandidates(
      "ownershipHorizon",
      input.ownershipHorizon,
      SENSITIVITY_ORDERED_VALUES.ownershipHorizon,
      formatSensitivityFieldLabel("ownershipHorizon")
    ),
    ...buildAdjacentEnumCandidates(
      "supportRequirement",
      input.supportRequirement,
      SENSITIVITY_ORDERED_VALUES.supportRequirement,
      formatSensitivityFieldLabel("supportRequirement")
    ),
    ...buildAdjacentEnumCandidates(
      "productionCriticality",
      input.productionCriticality,
      SENSITIVITY_ORDERED_VALUES.productionCriticality,
      formatSensitivityFieldLabel("productionCriticality")
    ),
    ...buildFeatureToggleCandidates(input, formatSensitivityFieldLabel("advancedFeatures"))
  ];

  return candidates;
}

function buildSensitivityDirection(candidate, baseline, evaluated) {
  const deltas = evaluated.deltas;
  const pathDeltas = [
    ["buildFit", deltas.buildFit],
    ["coreFit", deltas.coreFit],
    ["premiumFit", deltas.premiumFit],
    ["enterpriseFit", deltas.enterpriseFit]
  ].sort((left, right) => Math.abs(right[1]) - Math.abs(left[1]));
  const [topPathKey, topDelta] = pathDeltas[0] ?? [];
  const winnerPathKey = `${baseline.recommendation.key}Fit`;
  const meaningfulPathChange = Math.abs(topDelta ?? 0) >= 0.5;

  if (topPathKey === "buildFit") {
    return topDelta > 0 ? "increases-build-fit" : "reduces-build-fit";
  }

  if (topPathKey === "coreFit" && topDelta > 0) {
    return "increases-core-fit";
  }

  if (topPathKey === "premiumFit" && topDelta > 0) {
    return "increases-premium-fit";
  }

  if (topPathKey === "enterpriseFit" && topDelta > 0) {
    return "increases-enterprise-fit";
  }

  if (topPathKey === winnerPathKey && topDelta < 0) {
    return "reduces-selected-path-fit";
  }

  if (Math.abs(deltas.winnerMargin) >= 0.5) {
    return deltas.winnerMargin > 0 ? "increases-winner-margin" : "reduces-winner-margin";
  }

  return meaningfulPathChange ? "mixed" : "mixed";
}

function buildSensitivityImpactSummary(evaluated, baseline) {
  const deltas = evaluated.deltas;
  const pathEntries = [
    ["Build in-house fit", deltas.buildFit],
    ["MUI Core fit", deltas.coreFit],
    ["MUI X Premium fit", deltas.premiumFit],
    ["MUI X Enterprise fit", deltas.enterpriseFit]
  ]
    .filter(([, delta]) => Math.abs(delta) >= 0.5)
    .sort((left, right) => Math.abs(right[1]) - Math.abs(left[1]));
  const parts = [];

  for (const [label, delta] of pathEntries.slice(0, 2)) {
    parts.push(
      `${delta > 0 ? "Raises" : "Lowers"} ${label} by ${roundTo(Math.abs(delta), 1)}`
    );
  }

  if (Math.abs(deltas.winnerMargin) >= 0.5) {
    parts.push(
      `${deltas.winnerMargin > 0 ? "Widens" : "Narrows"} the recommendation margin by ${roundTo(Math.abs(deltas.winnerMargin), 1)} points`
    );
  }

  if (evaluated.recommendationChanged) {
    parts.push(
      `Flips the recommendation from ${baseline.recommendation.option} to ${evaluated.recommendation.option}`
    );
  }

  return parts.length > 0
    ? `${parts[0]}${parts[1] ? `; ${parts[1]}` : ""}${parts[2] ? `; ${parts[2]}` : ""}${parts[3] ? `; ${parts[3]}` : ""}.`
    : "Leaves the path mix nearly unchanged.";
}

function buildSensitivityDriver(input, baseline, candidate, evaluated) {
  return {
    inputKey: candidate.inputKey,
    label: candidate.label,
    testedChange: candidate.testedChange,
    direction: buildSensitivityDirection(candidate, baseline, evaluated),
    impactSummary: buildSensitivityImpactSummary(evaluated, baseline),
    deltas: {
      buildFit: roundTo(evaluated.deltas.buildFit),
      coreFit: roundTo(evaluated.deltas.coreFit),
      premiumFit: roundTo(evaluated.deltas.premiumFit),
      enterpriseFit: roundTo(evaluated.deltas.enterpriseFit),
      winnerMargin: roundTo(evaluated.deltas.winnerMargin),
      confidence: roundTo(evaluated.deltas.confidence)
    },
    recommendationChanged: evaluated.recommendationChanged
  };
}

function buildSensitivityDiagnostics(input, baseline, calibration) {
  const candidates = buildSensitivityCandidates(input);
  const evaluated = candidates
    .map((candidate) => {
      const perturbedInput = candidate.apply(input);
      const snapshot = buildFitSnapshot(perturbedInput, calibration);
      const deltas = {
        buildFit: snapshot.pathFits.build.score - baseline.pathFits.build.score,
        coreFit: snapshot.pathFits.core.score - baseline.pathFits.core.score,
        premiumFit: snapshot.pathFits.premium.score - baseline.pathFits.premium.score,
        enterpriseFit:
          snapshot.pathFits.enterprise.score - baseline.pathFits.enterprise.score,
        winnerMargin:
          (snapshot.recommendation.runnerUp?.scoreGap ?? 0) -
          (baseline.recommendation.runnerUp?.scoreGap ?? 0),
        confidence: snapshot.confidence.score - baseline.confidence.score
      };

      return {
        candidate,
        recommendation: snapshot.recommendation,
        deltas,
        recommendationChanged: snapshot.recommendation.key !== baseline.recommendation.key
      };
    })
    .map((entry) => ({
      ...entry,
      driver: buildSensitivityDriver(input, baseline, entry.candidate, entry)
    }));

  const rankedTopDrivers = [...evaluated]
    .sort((left, right) => {
      const leftScore =
        Math.abs(left.deltas.winnerMargin) * 2 +
        Math.max(
          Math.abs(left.deltas.buildFit),
          Math.abs(left.deltas.coreFit),
          Math.abs(left.deltas.premiumFit),
          Math.abs(left.deltas.enterpriseFit)
        ) +
        (left.recommendationChanged ? 4 : 0);
      const rightScore =
        Math.abs(right.deltas.winnerMargin) * 2 +
        Math.max(
          Math.abs(right.deltas.buildFit),
          Math.abs(right.deltas.coreFit),
          Math.abs(right.deltas.premiumFit),
          Math.abs(right.deltas.enterpriseFit)
        ) +
        (right.recommendationChanged ? 4 : 0);

      return rightScore - leftScore;
    })
    .slice(0, 6)
    .map((entry) => entry.driver);

  const buildFitDrivers = [...evaluated]
    .filter((entry) => Math.abs(entry.deltas.buildFit) >= 0.5)
    .sort((left, right) => Math.abs(right.deltas.buildFit) - Math.abs(left.deltas.buildFit))
    .slice(0, 4)
    .map((entry) => entry.driver);

  const coreFitDrivers = [...evaluated]
    .filter((entry) => Math.abs(entry.deltas.coreFit) >= 0.5)
    .sort((left, right) => Math.abs(right.deltas.coreFit) - Math.abs(left.deltas.coreFit))
    .slice(0, 4)
    .map((entry) => entry.driver);

  const premiumFitDrivers = [...evaluated]
    .filter((entry) => Math.abs(entry.deltas.premiumFit) >= 0.5)
    .sort(
      (left, right) => Math.abs(right.deltas.premiumFit) - Math.abs(left.deltas.premiumFit)
    )
    .slice(0, 4)
    .map((entry) => entry.driver);

  const enterpriseFitDrivers = [...evaluated]
    .filter((entry) => Math.abs(entry.deltas.enterpriseFit) >= 0.5)
    .sort(
      (left, right) =>
        Math.abs(right.deltas.enterpriseFit) - Math.abs(left.deltas.enterpriseFit)
    )
    .slice(0, 4)
    .map((entry) => entry.driver);

  const recommendationDrivers = [...evaluated]
    .filter((entry) => entry.recommendationChanged || Math.abs(entry.deltas.winnerMargin) >= 0.5)
    .sort((left, right) => Math.abs(right.deltas.winnerMargin) - Math.abs(left.deltas.winnerMargin))
    .slice(0, 4)
    .map((entry) => entry.driver);

  return {
    method: "deterministic-path-fit-adjacent-input-perturbation",
    candidateCount: candidates.length,
    topDrivers: rankedTopDrivers,
    buildFitDrivers,
    coreFitDrivers,
    premiumFitDrivers,
    enterpriseFitDrivers,
    recommendationDrivers
  };
}

function buildEvidenceBasis(input, scorecard) {
  return [
    {
      factor: "functionalComplexity",
      basis: "benchmark-informed",
      sourceKeys: ["cocomo-ii"],
      explanation:
        "Primary use case, expected row and column scale, data-heavy screens, performance sensitivity, and advanced features raise implementation burden because they widen the surface area the team must own."
    },
    {
      factor: "qualityBurden",
      basis: "standard-backed",
      sourceKeys: ["nist-software-errors"],
      explanation:
        "Accessibility targets, performance pressure, handoff friction, and advanced behaviors increase verification burden because they expand QA and regression exposure."
    },
    {
      factor: "deliveryMaturity",
      basis: "benchmark-informed",
      sourceKeys: ["cocomo-ii", "isbsg"],
      explanation:
        "Change lead time, rework frequency, and deadline pressure act as delivery health signals because they affect how confidently a team can absorb implementation work."
    },
    {
      factor: "ownershipBurden",
      basis: "practice-backed",
      sourceKeys: ["cocomo-ii"],
      explanation:
        "Dependent teams, ownership clarity, React footprint, knowledge concentration, and design-system maturity shape the long-term burden of owning the UI."
    },
    {
      factor: "enterpriseReadiness",
      basis: "benchmark-informed",
      sourceKeys: [],
      explanation:
        "Support expectations, standardization goals, production criticality, and organizational footprint raise enterprise-path fit because vendor-backed readiness matters more in broader or higher-stakes programs."
    },
    {
      factor: `${PATH_LABELS[scorecard.effectiveMuiPlan]} fit`,
      basis: "product-specific heuristic",
      sourceKeys: [],
      explanation: `${PATH_LABELS[scorecard.effectiveMuiPlan]} fit is derived from coverage, support fit, integration risk, and existing MUI usage instead of a delivery or cost simulation.`
    },
    {
      factor: "recommendation synthesis",
      basis: "product-specific heuristic",
      sourceKeys: [],
      explanation: `The final recommendation ranks Build in-house, MUI Core, MUI X Premium, and MUI X Enterprise by deterministic fit score for ${input.primaryUseCase}.`
    }
  ];
}

function buildDiagnostics(input, scorecard, pathFits, evidenceBasis, sensitivity, calibration) {
  const ownershipHorizonEffects = buildOwnershipHorizonEffects(input, calibration, {
    maturityStrength:
      {
        low: 0.3,
        medium: 0.62,
        high: 1
      }[input.designSystemMaturity],
    supportNeed: scorecard.supportNeed,
    productionCriticalityNormalized: scorecard.productionCriticalityNormalized,
    standardizationIntent: scorecard.standardizationIntent,
    appScale: scorecard.appScale,
    teamScale: scorecard.teamScale,
    internalAbsorptionStrength: scorecard.internalAbsorption
  });

  return {
    effectiveMuiPlan: scorecard.effectiveMuiPlan,
    containedScope: scorecard.containedScope,
    buildFriendlyContext: scorecard.buildFriendlyContext,
    enterpriseFitStrong: scorecard.enterpriseFitStrong,
    ownershipHorizonEffects,
    scorecard: {
      buildFit: scorecard.buildFit,
      coreFit: scorecard.coreFit,
      premiumFit: scorecard.premiumFit,
      enterpriseFit: scorecard.enterpriseFit,
      icpScore: scorecard.icpScore
    },
    scenarioLevers: scorecard.scenarioLevers,
    evidenceBasis,
    inputSummary: {
      primaryUseCase: input.primaryUseCase,
      advancedFeatureCount: input.advancedFeatures.length,
      supportRequirement: input.supportRequirement,
      productionCriticality: input.productionCriticality
    },
    pathOrdering: Object.values(pathFits)
      .sort((left, right) => right.score - left.score)
      .map((path, index) => ({
        rank: index + 1,
        key: path.key,
        label: path.label,
        score: path.score,
        eligible: path.eligible
      })),
    sensitivity
  };
}

function buildResult(input, activeCalibration, calibrationMetadata) {
  const fitSnapshot = buildFitSnapshot(input, activeCalibration);
  const { derivedFactors, scorecard, pathFits } = fitSnapshot;
  const evidenceBasis = buildEvidenceBasis(input, scorecard);
  const sensitivity = buildSensitivityDiagnostics(input, fitSnapshot, activeCalibration);
  const diagnostics = buildDiagnostics(
    input,
    scorecard,
    pathFits,
    evidenceBasis,
    sensitivity,
    activeCalibration
  );

  return {
    modelVersion: MODEL_VERSION,
    calibrationVersion: CALIBRATION_VERSION,
    activeCalibration: calibrationMetadata,
    derivedFactors,
    planFits: scorecard.planFits,
    pathFits,
    recommendation: fitSnapshot.recommendation,
    confidence: fitSnapshot.confidence,
    sensitivity,
    diagnostics,
    assumptions: [
      "This is a deterministic fit model.",
      "It does not estimate delivery dates or cost.",
      "Scores are heuristic decision-support signals, not guarantees.",
      "Public sources inform variable selection and risk direction, not exact coefficients."
    ],
    publicSources: PUBLIC_BENCHMARK_SOURCES
  };
}

export const handler = async (event) => {
  if (event?.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        allow: "POST",
        "content-type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({ error: "Method not allowed." })
    };
  }

  const parsed = parseJsonBody(event);

  if (parsed.error) {
    return badRequest(parsed.error);
  }

  const calibrationResolution = resolveActiveCalibration(
    parsed.value?.calibrationOverrides
  );

  if (!calibrationResolution.valid) {
    return badRequest("Invalid calibrationOverrides.", calibrationResolution.errors);
  }

  const normalized = normalizeInput(parsed.value);
  const validation = validatePayload(normalized, parsed.value);

  if (validation.errors.length > 0) {
    return badRequest("Validation failed.", validation.errors);
  }

  return jsonResponse(
    200,
    buildResult(normalized, calibrationResolution.calibration, calibrationResolution.metadata)
  );
};
