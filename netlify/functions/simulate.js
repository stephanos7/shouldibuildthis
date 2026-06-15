import { PUBLIC_BENCHMARK_SOURCES } from "../../src/data/publicSources.js";
import {
  CALIBRATION,
  CALIBRATION_VERSION,
  DERIVED_FACTOR_WEIGHTS,
  PATH_SCORE_WEIGHTS,
  PLAN_FIT_WEIGHTS,
  RECOMMENDATION_POLICY_WEIGHTS,
  SCENARIO_LEVER_WEIGHTS,
  SIMULATION_CALIBRATION
} from "../../src/model/calibration.js";
import { evaluateThresholdTable } from "../../src/model/evaluateCalibration.js";
import { RECOMMENDATION_POLICY_VERSION } from "../../src/model/recommendationPolicy.js";

const ITERATIONS = 10000;
const MODEL_VERSION = "benchmark-informed-v5";

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
const MAINTENANCE_HORIZONS = new Set([12, 24, 36]);
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

const USE_CASE_COMPLEXITY = {
  "data-grid": 4.7,
  charts: 3.1,
  "date-pickers": 2.3,
  "tree-view": 3.3,
  scheduler: 5.0,
  "multi-component": 3.2
};

const ADVANCED_FEATURE_WEIGHTS = {
  virtualization: 1.5,
  "inline-editing": 1.0,
  "server-side-data": 1.2,
  "keyboard-navigation": 0.9,
  exporting: 0.5,
  "drag-and-drop": 1.0,
  "custom-rendering": 1.2,
  "timezone-logic": 0.9,
  "i18n-localization": 0.8
};

const PRESSURE_INDEX = {
  low: 1,
  medium: 2,
  high: 3
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

const DEPENDENT_TEAMS_ORDER = ["one", "two-three", "four-seven", "eight-plus"];
const OWNERSHIP_MODEL_ORDER = [
  "same-product-team",
  "frontend-platform-team",
  "several-teams-informal",
  "unclear"
];
const EXISTING_MUI_USAGE_ORDER = ["none", "some", "standardized"];
const DESIGN_SYSTEM_MATURITY_ORDER = ["low", "medium", "high"];
const EXPECTED_ROWS_ORDER = ["under-1k", "1k-10k", "10k-100k", "over-100k"];
const EXPECTED_COLUMNS_ORDER = ["under-10", "10-30", "over-30"];
const ACCESSIBILITY_TARGET_ORDER = [
  "none",
  "wcag-a",
  "wcag-aa",
  "wcag-aaa-regulated"
];
const CHANGE_LEAD_TIME_ORDER = [
  "less-than-day",
  "one-day-to-one-week",
  "one-week-to-one-month",
  "more-than-month",
  "unknown"
];
const REWORK_FREQUENCY_ORDER = ["rare", "occasional", "frequent", "unknown"];
const PRESSURE_LEVEL_ORDER = ["low", "medium", "high"];
const SUPPORT_REQUIREMENT_ORDER = [
  "community",
  "standard",
  "priority",
  "procurement-sla"
];
const MAINTENANCE_HORIZON_ORDER = [12, 24, 36];
const PERFORMANCE_SENSITIVITY_ORDER = [
  "not-critical",
  "important",
  "strict-budget",
  "measured-core-web-vitals-target"
];
const KNOWLEDGE_CONCENTRATION_ORDER = [
  "shared",
  "few-owners",
  "single-owner",
  "unknown"
];
const DESIGN_DEV_HANDOFF_FRICTION_ORDER = ["low", "medium", "high", "unknown"];
const COMPONENT_STANDARDIZATION_GOAL_ORDER = [
  "none",
  "reduce-one-offs",
  "shared-pattern",
  "platform-standard"
];
const PRODUCTION_CRITICALITY_ORDER = [
  "internal-tool",
  "customer-facing",
  "revenue-critical",
  "regulated-or-sla-backed"
];

const SENSITIVITY_LABELS = {
  dependentTeams: "Dependent teams",
  ownershipModel: "Ownership model",
  existingMuiUsage: "Existing MUI usage",
  designSystemMaturity: "Design-system maturity",
  expectedRows: "Expected rows",
  expectedColumns: "Expected columns",
  accessibilityTarget: "Accessibility target",
  changeLeadTime: "Change lead time",
  reworkFrequency: "Rework frequency",
  deadlinePressure: "Deadline pressure",
  supportRequirement: "Support requirement",
  performanceSensitivity: "Performance sensitivity",
  knowledgeConcentration: "Knowledge concentration",
  designDevHandoffFriction: "Design-dev handoff friction",
  componentStandardizationGoal: "Component standardization goal",
  productionCriticality: "Production criticality",
  frontendDevelopers: "Frontend developers",
  reactApps: "React apps",
  dataHeavyScreens: "Data-heavy screens",
  engineerCostPerDay: "Engineer cost per day",
  maintenanceHorizonMonths: "Maintenance horizon",
  advancedFeatures: "Advanced features"
};

function getAdjacentValue(order, currentValue, direction) {
  const index = order.indexOf(currentValue);
  if (index === -1) {
    return null;
  }

  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= order.length) {
    return null;
  }

  return order[nextIndex];
}

function getSensitivityLabel(inputKey) {
  return (
    SENSITIVITY_LABELS[inputKey] ??
    inputKey
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/-/g, " ")
      .replace(/^./, (char) => char.toUpperCase())
  );
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

const PLAN_CONFIG = {
  core: {
    key: "core",
    label: "MUI Core",
    recommendationLabel: "MUI Core",
    licensePerDeveloperYear: CALIBRATION.simulation.mui.licensing.core,
    supportCapability: 0.15,
    featureCapacity: 2.0,
    useCaseCoverage: {
      "data-grid": 0.28,
      charts: 0.45,
      "date-pickers": 0.92,
      "tree-view": 0.5,
      scheduler: 0.12,
      "multi-component": 0.32
    }
  },
  premium: {
    key: "premium",
    label: "MUI X Premium",
    recommendationLabel: "Premium",
    licensePerDeveloperYear: CALIBRATION.simulation.mui.licensing.premium,
    supportCapability: 0.45,
    featureCapacity: 4.4,
    useCaseCoverage: {
      "data-grid": 0.9,
      charts: 0.72,
      "date-pickers": 0.96,
      "tree-view": 0.84,
      scheduler: 0.66,
      "multi-component": 0.76
    }
  },
  enterprise: {
    key: "enterprise",
    label: "MUI X Enterprise",
    recommendationLabel: "Enterprise",
    licensePerDeveloperYear: CALIBRATION.simulation.mui.licensing.enterprise,
    supportCapability: 0.78,
    featureCapacity: 5.8,
    useCaseCoverage: {
      "data-grid": 0.94,
      charts: 0.78,
      "date-pickers": 0.97,
      "tree-view": 0.88,
      scheduler: 0.74,
      "multi-component": 0.82
    }
  }
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

function percentage(value) {
  return roundTo(clamp(value, 0, 1) * 100, 1);
}

function integerCurrency(value) {
  return Math.round(value);
}

function percentile(sortedValues, ratio) {
  const index = Math.min(
    sortedValues.length - 1,
    Math.max(0, Math.floor((sortedValues.length - 1) * ratio))
  );
  return sortedValues[index];
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

function levelFromScore(score) {
  if (score >= 67) {
    return "high";
  }

  if (score >= 34) {
    return "medium";
  }

  return "low";
}

function buildFactor(score, drivers) {
  const normalizedScore = roundTo(clamp(score, 0, 100));

  return {
    score: normalizedScore,
    level: levelFromScore(normalizedScore),
    drivers
  };
}

function buildLever(score, drivers) {
  const normalizedScore = clamp(score, 0, 1);

  return {
    score: roundTo(normalizedScore, 2),
    level: levelFromScore(normalizedScore * 100),
    drivers
  };
}

function xmur3(value) {
  let hash = 1779033703 ^ value.length;

  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }

  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    return (hash ^= hash >>> 16) >>> 0;
  };
}

function mulberry32(seed) {
  return () => {
    let next = (seed += 0x6d2b79f5);
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function createRng(seedInput) {
  const seed = xmur3(seedInput)();
  return mulberry32(seed);
}

function randomNormal(rng, mean = 0, deviation = 1) {
  let first = 0;
  let second = 0;

  while (first === 0) {
    first = rng();
  }

  while (second === 0) {
    second = rng();
  }

  const standard =
    Math.sqrt(-2 * Math.log(first)) * Math.cos(2 * Math.PI * second);
  return mean + standard * deviation;
}

function randomTriangular(rng, min, mode, max) {
  const sample = rng();
  const breakpoint = (mode - min) / (max - min);

  if (sample < breakpoint) {
    return min + Math.sqrt(sample * (max - min) * (mode - min));
  }

  return max - Math.sqrt((1 - sample) * (max - min) * (max - mode));
}

function sampleBoundedMultiplier(
  rng,
  { mean = 1, deviation = 0.03, min = 0.94, max = 1.08 } = {}
) {
  return clamp(mean + randomNormal(rng, 0, deviation), min, max);
}

function sampleCappedFatTailMultiplier(
  rng,
  {
    exposure = 0,
    threshold = 0.58,
    probabilityCap = 0.16,
    maxImpact = 0.18
  } = {}
) {
  if (exposure <= threshold) {
    return 1;
  }

  const normalizedExposure = clamp(
    (exposure - threshold) / (1 - threshold),
    0,
    1
  );
  const eventProbability = normalizedExposure * probabilityCap;

  if (rng() >= eventProbability) {
    return 1;
  }

  const severity = randomTriangular(rng, 0.2, 0.48, 1);
  return 1 + normalizedExposure * maxImpact * (0.45 + severity * 0.55);
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
    maintenanceHorizonMonths: Number(payload.maintenanceHorizonMonths),
    supportRequirement: payload.supportRequirement,
    productionCriticality: payload.productionCriticality,
    engineerCostPerDay: Number(payload.engineerCostPerDay)
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

function validateNumber(value, label, { minimum = 0 } = {}) {
  if (!Number.isFinite(value)) {
    return `${label} must be a number.`;
  }

  if (value <= minimum) {
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

  if (isBlank(originalPayload.maintenanceHorizonMonths)) {
    errors.push("maintenanceHorizonMonths is required.");
  } else if (!MAINTENANCE_HORIZONS.has(normalized.maintenanceHorizonMonths)) {
    errors.push("maintenanceHorizonMonths is invalid.");
  }

  if (isBlank(originalPayload.engineerCostPerDay)) {
    errors.push("engineerCostPerDay is required.");
  } else {
    errors.push(
      validateNumber(normalized.engineerCostPerDay, "engineerCostPerDay", {
        minimum: 0
      })
    );
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

function buildDerivedFactors(input) {
  const derivedWeights = DERIVED_FACTOR_WEIGHTS;
  const useCaseComplexity = USE_CASE_COMPLEXITY[input.primaryUseCase];
  const featureWeight = input.advancedFeatures.reduce(
    (sum, feature) => sum + ADVANCED_FEATURE_WEIGHTS[feature],
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
  const accessibilityTargetLabel = {
    none: "No formal accessibility target was selected, so the model does not add WCAG-specific verification burden.",
    "wcag-a":
      "The WCAG A target adds accessibility verification burden because the implementation still needs formal keyboard and interaction checks.",
    "wcag-aa":
      "The WCAG AA target adds accessibility verification burden because the implementation needs broader keyboard, focus, and semantic validation.",
    "wcag-aaa-regulated":
      "The WCAG AAA / regulated target adds heavier accessibility verification burden because the implementation needs stricter compliance checks."
  }[input.accessibilityTarget];
  const changeLeadTimeLabel = {
    "less-than-day":
      "Less-than-day change lead time indicates strong delivery flow.",
    "one-day-to-one-week":
      "One-day-to-one-week change lead time indicates healthy delivery flow with some release coordination.",
    "one-week-to-one-month":
      "One-week-to-one-month change lead time indicates slower delivery flow and more schedule variance.",
    "more-than-month":
      "More-than-month change lead time indicates a slow delivery cadence and a wider uncertainty band.",
    unknown: "Unknown change lead time widens the delivery uncertainty band."
  }[input.changeLeadTime];
  const performanceSensitivityLabel = {
    "not-critical":
      "Performance is not a critical constraint, so runtime and bundle pressure stay low.",
    important:
      "Performance matters, but it is not being measured against a strict budget.",
    "strict-budget":
      "A strict performance budget raises runtime and bundle-size pressure.",
    "measured-core-web-vitals-target":
      "Measured Core Web Vitals targets create the strongest performance pressure."
  }[input.performanceSensitivity];
  const reworkLabel = {
    rare: "Rare UI rework or regression churn suggests the team usually absorbs changes without heavy churn.",
    occasional:
      "Occasional UI rework or regression churn suggests the team can absorb changes, but with some follow-up work.",
    frequent:
      "Frequent UI rework or regression churn suggests the team is likely to spend more time revisiting prior decisions.",
    unknown:
      "Unknown UI rework or regression frequency widens the delivery uncertainty band."
  }[input.reworkFrequency];
  const knowledgeConcentrationLabel = {
    shared:
      "Knowledge is shared across the team, which reduces key-person risk.",
    "few-owners":
      "A few owners know the area well, so key-person risk is moderate.",
    "single-owner":
      "Knowledge is concentrated in a single owner, so continuity risk is high.",
    unknown: "Unknown knowledge concentration widens the ownership risk band."
  }[input.knowledgeConcentration];
  const handoffFrictionLabel = {
    low: "Low design-to-dev handoff friction keeps spec-to-code rework contained.",
    medium:
      "Medium handoff friction adds some design and implementation rework risk.",
    high: "High design-to-dev handoff friction raises spec-to-code rework and clarification risk.",
    unknown: "Unknown handoff friction widens the quality-risk band."
  }[input.designDevHandoffFriction];
  const standardizationGoalLabel = {
    none: "There is no active standardization goal, so reuse pressure stays low.",
    "reduce-one-offs":
      "The goal is to reduce one-off components and trim custom variation.",
    "shared-pattern":
      "The goal is to create a shared pattern that multiple screens can reuse.",
    "platform-standard":
      "The goal is platform standardization, which raises the value of a reusable component layer."
  }[input.componentStandardizationGoal];
  const productionCriticalityLabel = {
    "internal-tool":
      "Internal-tool criticality keeps production pressure relatively contained.",
    "customer-facing":
      "Customer-facing production criticality raises the operational bar.",
    "revenue-critical":
      "Revenue-critical production criticality raises the cost of regressions and downtime.",
    "regulated-or-sla-backed":
      "Regulated or SLA-backed criticality creates the strongest operating pressure."
  }[input.productionCriticality];
  const deadlinePressureLabel = {
    low: "Low deadline pressure reduces schedule-compression risk.",
    medium:
      "Medium deadline pressure leaves some schedule compression risk in play.",
    high: "High deadline pressure increases schedule-compression risk."
  }[input.deadlinePressure];
  const ownershipLeadLabel = {
    one: "One dependent team and same-product-team ownership keep coordination load low.",
    "two-three":
      "Two to three dependent teams and the current ownership model keep coordination load manageable but no longer trivial.",
    "four-seven":
      "Four to seven dependent teams and the current ownership model raise coordination load.",
    "eight-plus":
      "Eight or more dependent teams make coordination load high unless ownership is very tightly managed."
  }[input.dependentTeams];
  const dependentTeamLabel = {
    one: "one dependent team",
    "two-three": "two to three dependent teams",
    "four-seven": "four to seven dependent teams",
    "eight-plus": "eight or more dependent teams"
  }[input.dependentTeams];
  const appSurfaceLabel =
    {
      1: "One React app keeps the rollout and maintenance surface contained.",
      2: "Two React apps broaden the rollout and maintenance surface.",
      3: "Three React apps broaden the rollout and maintenance surface further.",
      4: "Four React apps make the rollout and maintenance surface substantial.",
      5: "Five React apps make the rollout and maintenance surface broad.",
      6: "Six React apps make the rollout and maintenance surface broad.",
      7: "Seven React apps make the rollout and maintenance surface broad.",
      8: "Eight or more React apps make the rollout and maintenance surface wide."
    }[Math.min(input.reactApps, 8)] ??
    `${countLabel(input.reactApps, "React app")} widen the rollout and maintenance surface.`;
  const developerCapacityLabel = `${countLabel(input.frontendDevelopers, "frontend developer")} ${
    input.frontendDevelopers === 1 ? "increases" : "increase"
  } internal capacity for build and maintenance.`;
  const maturityLabel = {
    low: "Low UI/platform maturity leaves more shared groundwork to establish.",
    medium:
      "Medium UI/platform maturity provides some shared patterns, but not enough to remove ownership burden.",
    high: "High UI/platform maturity reduces ownership burden because shared patterns and groundwork already exist."
  }[input.designSystemMaturity];
  const scaleLabel =
    rowsUnder1k && columnsUnder10
      ? "Small data volume keeps the complexity contained: under 1k rows and under 10 columns."
      : `Expected volume sits in the ${input.expectedRows} row band and the ${input.expectedColumns} column band, which expands the component surface as scale rises.`;
  const functionalFeatureLabel = noAdvancedBehaviors
    ? "No advanced behaviors were selected, so the model does not add extra interaction or data-state complexity."
    : `Selected advanced behaviors (${selectedAdvancedBehaviors}) expand interaction, state, and integration complexity.`;
  const qualityScaleLabel =
    rowsUnder1k && columnsUnder10
      ? "Small row and column counts keep performance and regression risk low."
      : `Larger row and column counts increase performance and regression risk as scale rises.`;
  const qualityFeatureLabel = noAdvancedBehaviors
    ? "No advanced behaviors were selected, so keyboard, virtualization, server-side data, and custom-rendering QA are not added."
    : `Selected advanced behaviors (${selectedAdvancedBehaviors}) add keyboard, virtualization, server-side data, or custom-rendering QA burden where relevant.`;

  const functionalDrivers = [
    input.primaryUseCase === "multi-component"
      ? "Multi-component evaluation creates moderate implementation scope because more than one UI pattern may need to work together."
      : `${input.primaryUseCase} is the primary use case, which sets the baseline interaction complexity.`,
    scaleLabel,
    functionalFeatureLabel,
    performanceSensitivityLabel
  ];

  if (screenLoad > 0) {
    functionalDrivers.push(
      `${countLabel(screenLoad, "data-heavy screen")} ${
        screenLoad === 1 ? "adds" : "add"
      } state and edge-case pressure.`
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
    functionalDrivers
  );

  const qualityDrivers = [
    accessibilityTargetLabel,
    qualityScaleLabel,
    qualityFeatureLabel,
    handoffFrictionLabel,
    input.advancedFeatures.includes("i18n-localization")
      ? "i18n and localization requirements add QA and edge-case burden."
      : "No i18n and localization requirements were selected."
  ];

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
    qualityDrivers
  );

  const deliveryDrivers = [
    changeLeadTimeLabel,
    reworkLabel,
    deadlinePressureLabel
  ];

  const deliveryMaturity = buildFactor(
    derivedWeights.deliveryMaturity.base +
      changeLeadTime * derivedWeights.deliveryMaturity.changeLeadTime +
      reworkFrequency * derivedWeights.deliveryMaturity.reworkFrequency +
      derivedWeights.deliveryMaturity.deadlinePressure[input.deadlinePressure],
    deliveryDrivers
  );

  const ownershipDrivers = [
    ownershipLeadLabel,
    appSurfaceLabel,
    developerCapacityLabel,
    maturityLabel,
    knowledgeConcentrationLabel
  ];

  const ownershipBurden = buildFactor(
    derivedWeights.ownershipBurden.base +
      dependentTeams * derivedWeights.ownershipBurden.dependentTeams +
      ownershipModel * derivedWeights.ownershipBurden.ownershipModel +
      Math.min(input.reactApps, 8) * derivedWeights.ownershipBurden.reactApps +
      knowledgeConcentration *
        derivedWeights.ownershipBurden.knowledgeConcentration +
      derivedWeights.ownershipBurden.designSystemMaturity[
        input.designSystemMaturity
      ],
    ownershipDrivers
  );

  const enterpriseDrivers = [
    `${input.supportRequirement} support expectations drive the need for vendor-backed response and procurement paths.`,
    `${input.maintenanceHorizonMonths} months of planned maintenance raises the value of durable support and upgrades.`,
    `${dependentTeamLabel} and ${countLabel(input.reactApps, "React app")} define the rollout footprint.`,
    standardizationGoalLabel,
    productionCriticalityLabel
  ];

  if (muiUsage > 0) {
    enterpriseDrivers.push(
      `${input.existingMuiUsage} MUI usage lowers adoption friction for a packaged path.`
    );
  }

  if (input.reactApps >= 2 || input.frontendDevelopers >= 5) {
    enterpriseDrivers.push(
      "The React footprint is broad enough that standardization has meaningful leverage."
    );
  }

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
        derivedWeights.enterpriseReadiness.productionCriticality +
      derivedWeights.enterpriseReadiness.maintenanceHorizonMonths[
        input.maintenanceHorizonMonths
      ],
    enterpriseDrivers
  );

  return {
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
}

function buildPlanFit(planKey, input, derivedFactors) {
  const planFitWeights = PLAN_FIT_WEIGHTS;
  const plan = PLAN_CONFIG[planKey];
  const featureDemand = input.advancedFeatures.reduce(
    (sum, feature) => sum + ADVANCED_FEATURE_WEIGHTS[feature],
    0
  );
  const performancePressure =
    PERFORMANCE_SENSITIVITY_INDEX[input.performanceSensitivity] / 3;
  const useCaseCoverage = plan.useCaseCoverage[input.primaryUseCase];
  const rowScale = EXPECTED_ROWS_INDEX[input.expectedRows];
  const columnScale = EXPECTED_COLUMNS_INDEX[input.expectedColumns];
  const scaleDemand = rowScale * 0.85 + columnScale * 0.65;
  const planScaleCapacity = { core: 1.6, premium: 2.6, enterprise: 3.2 }[
    planKey
  ];
  const featureCoverage = clamp(
    1 -
      Math.max(0, featureDemand - plan.featureCapacity) /
        planFitWeights.featureCoverageDenominator,
    0.18,
    1
  );
  const scaleCoverage = clamp(
    1 -
      Math.max(0, scaleDemand - planScaleCapacity) /
        planFitWeights.scaleCoverageDenominator,
    0.18,
    1
  );
  const adoptionBoost = { none: 0, some: 0.06, standardized: 0.12 }[
    input.existingMuiUsage
  ];
  const supportFit = clamp(
    1 -
      Math.max(
        0,
        SUPPORT_INDEX[input.supportRequirement] - plan.supportCapability * 4
      ) /
        planFitWeights.supportFitDenominator,
    0.15,
    1
  );
  const qualityFit = clamp(
    1 -
      Math.max(
        0,
        derivedFactors.qualityBurden.score / 100 -
          planFitWeights.qualityFitThresholds[planKey]
      ) *
        planFitWeights.qualityFitSlope,
    0.2,
    1
  );
  const performanceFit = clamp(
    1 - performancePressure * planFitWeights.performanceFitMultipliers[planKey],
    0.72,
    1
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
    ) * 0.8,
    0,
    0.75
  );

  return {
    coverageScore,
    coverageGap,
    integrationRisk,
    supportGap
  };
}

function buildScorecard(input, derivedFactors) {
  const pathScoreWeights = PATH_SCORE_WEIGHTS;
  const pathScores = CALIBRATION.pathScores;
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
  const performanceSensitivity =
    PERFORMANCE_SENSITIVITY_INDEX[input.performanceSensitivity];
  const teamScale = bucket(input.frontendDevelopers, 3, 8);
  const appScale = bucket(input.reactApps, 1, 4);

  const planFits = {
    core: buildPlanFit("core", input, derivedFactors),
    premium: buildPlanFit("premium", input, derivedFactors),
    enterprise: buildPlanFit("enterprise", input, derivedFactors)
  };

  const buildTierScore = clamp(
    pathScoreWeights.buildTierScore.base -
      functionalRisk * pathScoreWeights.buildTierScore.functionalRisk -
      qualityRisk * pathScoreWeights.buildTierScore.qualityRisk -
      ownershipRisk * pathScoreWeights.buildTierScore.ownershipRisk -
      deliveryRisk * pathScoreWeights.buildTierScore.deliveryRisk +
      (maturity - 2) * pathScoreWeights.buildTierScore.maturityBonus -
      supportNeed * pathScoreWeights.buildTierScore.supportNeed -
      (rowScale >= 3 ? pathScoreWeights.buildTierScore.rowPenalty : 0) -
      (columnScale >= 3 ? pathScoreWeights.buildTierScore.columnPenalty : 0),
    0,
    100
  );

  const simpleScope =
    functionalRisk <= pathScores.simpleScope.maxFunctionalRisk &&
    qualityRisk <= pathScores.simpleScope.maxQualityRisk &&
    input.advancedFeatures.length <= pathScores.simpleScope.maxAdvancedFeatures &&
    input.dataHeavyScreens <= pathScores.simpleScope.maxDataHeavyScreens &&
    rowScale <= pathScores.simpleScope.maxRowScale &&
    columnScale <= pathScores.simpleScope.maxColumnScale;
  const coreTierScore = clamp(
    pathScoreWeights.coreTierScore.base +
      planFits.core.coverageScore *
        pathScoreWeights.coreTierScore.coverageScore +
      (simpleScope ? pathScoreWeights.coreTierScore.simpleScopeBonus : 0) +
      muiUsage * pathScoreWeights.coreTierScore.muiUsageBonus -
      functionalRisk * pathScoreWeights.coreTierScore.functionalRisk -
      qualityRisk * pathScoreWeights.coreTierScore.qualityRisk -
      Math.max(0, enterpriseNeed - 0.45) *
        pathScoreWeights.coreTierScore.enterpriseNeedPenalty,
    0,
    100
  );

  const premiumTierScore = clamp(
    pathScoreWeights.premiumTierScore.base +
      planFits.premium.coverageScore *
        pathScoreWeights.premiumTierScore.coverageScore +
      functionalRisk * pathScoreWeights.premiumTierScore.functionalRisk +
      qualityRisk * pathScoreWeights.premiumTierScore.qualityRisk +
      muiUsage * pathScoreWeights.premiumTierScore.muiUsageBonus -
      (simpleScope ? pathScoreWeights.premiumTierScore.simpleScopePenalty : 0) -
      Math.max(0, enterpriseNeed - 0.72) *
        pathScoreWeights.premiumTierScore.enterpriseNeedPenalty,
    0,
    100
  );

  const enterpriseTierScore = clamp(
    pathScoreWeights.enterpriseTierScore.base +
      planFits.enterprise.coverageScore *
        pathScoreWeights.enterpriseTierScore.coverageScore +
      enterpriseNeed * pathScoreWeights.enterpriseTierScore.enterpriseNeed +
      supportNeed * pathScoreWeights.enterpriseTierScore.supportNeed +
      appScale * pathScoreWeights.enterpriseTierScore.appScale +
      teamScale * pathScoreWeights.enterpriseTierScore.teamScale -
      dependentTeams * pathScoreWeights.enterpriseTierScore.dependentTeams -
      productionCriticalityNormalized *
        supportNeed *
        pathScoreWeights.enterpriseTierScore.productionCriticality +
      (simpleScope ? pathScoreWeights.enterpriseTierScore.simpleScopeBonus : 0),
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
      (simpleScope ? pathScoreWeights.icpScore.simpleScopePenalty : 0),
    0,
    100
  );
  const enterpriseFitStrong =
    enterpriseNeed >= pathScores.enterpriseEligibility.minEnterpriseNeed &&
    supportNeed >= pathScores.enterpriseEligibility.minSupportNeed;
  const lowSupportNeed =
    supportNeed <= pathScores.buildFriendlyContext.maxSupportNeed;
  const supportOrProcurementNeed =
    supportNeed >= pathScores.enterpriseEligibility.minSupportNeed;
  const muiAdoptionUseful = muiUsage > 0 || input.reactApps >= 2;
  const buildFriendlyContext =
    lowSupportNeed &&
    input.designSystemMaturity === "high" &&
    input.dependentTeams === "one" &&
    input.ownershipModel === "same-product-team" &&
    input.changeLeadTime === "less-than-day" &&
    input.reworkFrequency === "rare" &&
    input.deadlinePressure === "low" &&
    rowScale <= pathScores.buildFriendlyContext.maxRowScale &&
    columnScale <= pathScores.buildFriendlyContext.maxColumnScale &&
    input.advancedFeatures.length <= pathScores.buildFriendlyContext.maxAdvancedFeatures &&
    pathScores.buildFriendlyContext.allowedAccessibilityTargets.includes(
      input.accessibilityTarget
    );

  let autoSelectedMuiPlan = "core";

  if (
    enterpriseFitStrong &&
    enterpriseTierScore >=
      pathScores.enterpriseEligibility.minEnterpriseTierScore &&
    planFits.enterprise.coverageScore >=
      pathScores.enterpriseEligibility.minCoverageScore
  ) {
    autoSelectedMuiPlan = "enterprise";
  } else if (
    planFits.premium.coverageScore >=
      pathScores.premiumEligibility.minCoverageScore &&
    !(
      pathScores.premiumEligibility.disallowForSimpleLowSupportScope &&
      simpleScope &&
      supportNeed <= pathScores.buildFriendlyContext.maxSupportNeed
    ) &&
    (functionalRisk >= pathScores.premiumEligibility.minFunctionalRisk ||
      qualityRisk >= pathScores.premiumEligibility.minQualityRisk ||
      rowScale >= pathScores.premiumEligibility.minRowScale ||
      columnScale >= pathScores.premiumEligibility.minColumnScale ||
      input.advancedFeatures.length >=
        pathScores.premiumEligibility.minAdvancedFeatureCount)
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
    effectivePlanFit,
    standardizationIntent,
    productionCriticalityNormalized,
    knowledgeConcentration,
    handoffFriction,
    performanceSensitivity
  });
  const buildCompetitiveIndex = clamp(
    pathScoreWeights.buildCompetitiveIndex.base -
      functionalRisk * pathScoreWeights.buildCompetitiveIndex.functionalRisk -
      qualityRisk * pathScoreWeights.buildCompetitiveIndex.qualityRisk -
      ownershipRisk * pathScoreWeights.buildCompetitiveIndex.ownershipRisk -
      deliveryRisk * pathScoreWeights.buildCompetitiveIndex.deliveryRisk +
      (maturity - 1) * pathScoreWeights.buildCompetitiveIndex.maturityBonus -
      supportNeed * pathScoreWeights.buildCompetitiveIndex.supportNeed +
      standardizationIntent *
        pathScoreWeights.buildCompetitiveIndex.standardizationIntent -
      productionCriticalityNormalized *
        pathScoreWeights.buildCompetitiveIndex.productionCriticality,
    0,
    100
  );

  const icpReasons = [];

  if (supportOrProcurementNeed) {
    icpReasons.push(
      "Commercial support expectations make vendor responsiveness materially more important."
    );
  }

  if (input.reactApps >= 2 || input.frontendDevelopers >= 4) {
    icpReasons.push(
      "The React footprint is large enough that reuse and standardization have leverage."
    );
  }

  if (
    input.dependentTeams !== "one" ||
    input.ownershipModel !== "same-product-team"
  ) {
    icpReasons.push(
      "Multiple dependent teams or shared ownership increase the cost of bespoke maintenance."
    );
  }

  if (muiUsage > 0) {
    icpReasons.push(
      "Existing MUI usage lowers adoption friction for a packaged option."
    );
  }

  if (standardizationIntent >= 0.67) {
    icpReasons.push(
      "A stronger standardization goal increases the value of a packaged path."
    );
  }

  if (productionCriticalityNormalized >= 0.67 && supportOrProcurementNeed) {
    icpReasons.push(
      "Higher production criticality makes support and procurement readiness more important."
    );
  }

  if (icpReasons.length === 0) {
    icpReasons.push(
      "The workload remains narrow enough that the rules do not strongly prefer a packaged path."
    );
  }

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
    buildTierScore,
    coreTierScore,
    premiumTierScore,
    enterpriseTierScore,
    icpScore,
    simpleScope,
    buildFriendlyContext,
    enterpriseFitStrong,
    lowSupportNeed,
    supportOrProcurementNeed,
    muiAdoptionUseful,
    autoSelectedMuiPlan,
    effectiveMuiPlan,
    scenarioLevers,
    internalAbsorption: scenarioLevers.internalAbsorption.score,
    buildReuseLeverage: scenarioLevers.buildReuseLeverage.score,
    muiLeverage: scenarioLevers.muiLeverage.score,
    muiAdoptionBurden: scenarioLevers.muiAdoptionBurden.score,
    downsideTailRisk: scenarioLevers.downsideTailRisk.score,
    buildCompetitiveIndex,
    icpFitSegment:
      icpScore >= 70 ? "strong" : icpScore >= 50 ? "moderate" : "limited",
    icpReasons
  };
}

function buildScenarioLevers(input, scorecard) {
  const scenarioWeights = SCENARIO_LEVER_WEIGHTS;
  const planFit = scorecard.effectivePlanFit;
  const featureCount = input.advancedFeatures.length;
  const rowScale = EXPECTED_ROWS_INDEX[input.expectedRows];
  const columnScale = EXPECTED_COLUMNS_INDEX[input.expectedColumns];
  const knowledgeConcentrationLabel = {
    shared: "shared knowledge",
    "few-owners": "a few owners",
    "single-owner": "single-owner knowledge",
    unknown: "unknown knowledge concentration"
  }[input.knowledgeConcentration];
  const handoffFrictionLabel = {
    low: "low handoff friction",
    medium: "medium handoff friction",
    high: "high handoff friction",
    unknown: "unknown handoff friction"
  }[input.designDevHandoffFriction];
  const standardizationGoalLabel = {
    none: "no standardization goal",
    "reduce-one-offs": "a reduce-one-offs goal",
    "shared-pattern": "a shared-pattern goal",
    "platform-standard": "a platform-standard goal"
  }[input.componentStandardizationGoal];
  const performanceSensitivityLabel = {
    "not-critical": "not-critical performance pressure",
    important: "important performance pressure",
    "strict-budget": "strict performance-budget pressure",
    "measured-core-web-vitals-target": "Core Web Vitals pressure"
  }[input.performanceSensitivity];
  const productionCriticalityLabel = {
    "internal-tool": "internal-tool criticality",
    "customer-facing": "customer-facing criticality",
    "revenue-critical": "revenue-critical pressure",
    "regulated-or-sla-backed": "regulated or SLA-backed pressure"
  }[input.productionCriticality];
  const knowledgeSpread = {
    shared: 1,
    "few-owners": 0.62,
    "single-owner": 0.22,
    unknown: 0.44
  }[input.knowledgeConcentration];
  const handoffAlignment = {
    low: 1,
    medium: 0.68,
    high: 0.32,
    unknown: 0.52
  }[input.designDevHandoffFriction];
  const standardizationIntent =
    COMPONENT_STANDARDIZATION_GOAL_INDEX[input.componentStandardizationGoal] /
    3;
  const performancePressure =
    PERFORMANCE_SENSITIVITY_INDEX[input.performanceSensitivity] / 3;
  const productionPressure =
    PRODUCTION_CRITICALITY_INDEX[input.productionCriticality] / 3;
  const ownershipClarity = {
    "same-product-team": 1,
    "frontend-platform-team": 0.84,
    "several-teams-informal": 0.48,
    unclear: 0.24
  }[input.ownershipModel];
  const teamFocus = {
    one: 1,
    "two-three": 0.74,
    "four-seven": 0.42,
    "eight-plus": 0.18
  }[input.dependentTeams];
  const reworkStability = {
    rare: 1,
    occasional: 0.62,
    frequent: 0.22,
    unknown: 0.44
  }[input.reworkFrequency];
  const deadlineSlack = {
    low: 1,
    medium: 0.62,
    high: 0.26
  }[input.deadlinePressure];
  const supportLightness = {
    community: 1,
    standard: 0.74,
    priority: 0.46,
    "procurement-sla": 0.18
  }[input.supportRequirement];
  const appFocus = clamp(1 - Math.max(0, input.reactApps - 1) * 0.16, 0.42, 1);
  const maturityStrength = {
    low: 0.3,
    medium: 0.62,
    high: 1
  }[input.designSystemMaturity];
  const scopeSimplicity = clamp(
    1 -
      ((featureCount / 6) * 0.42 +
        ((rowScale - 1) / 3) * 0.2 +
        ((columnScale - 1) / 2) * 0.14 +
        {
          "date-pickers": 0.08,
          charts: 0.14,
          "multi-component": 0.2,
          "tree-view": 0.24,
          "data-grid": 0.32,
          scheduler: 0.38
        }[input.primaryUseCase]),
    0.12,
    1
  );
  const packagedAffinity = {
    "date-pickers": 0.66,
    charts: 0.58,
    "multi-component": 0.62,
    "tree-view": 0.62,
    "data-grid": 0.72,
    scheduler: 0.78
  }[input.primaryUseCase];

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
        ? 0.16
        : input.designSystemMaturity === "medium"
          ? 0.09
          : 0.04
      : input.existingMuiUsage === "some"
        ? 0.02
        : -0.08;
  const buildReuseLeverageScore = clamp(
    maturityStrength * scenarioWeights.buildReuse.maturityStrength +
      ownershipClarity * scenarioWeights.buildReuse.ownershipClarity +
      teamFocus * scenarioWeights.buildReuse.teamFocus +
      knowledgeSpread * scenarioWeights.buildReuse.knowledgeSpread +
      handoffAlignment * scenarioWeights.buildReuse.handoffAlignment +
      scopeSimplicity * scenarioWeights.buildReuse.scopeSimplicity +
      clamp(1 - featureCount / 7, 0.18, 1) *
        scenarioWeights.buildReuse.featureCount +
      standardizationIntent *
        maturityStrength *
        ownershipClarity *
        scenarioWeights.buildReuse.standardizationInteraction +
      clamp(1 - (rowScale + columnScale - 2) / 5, 0.18, 1) *
        scenarioWeights.buildReuse.scaleProfile +
      buildReuseBonus,
    0,
    1
  );
  const muiUsageReadiness =
    { none: 0.25, some: 0.65, standardized: 1 }[input.existingMuiUsage] ?? 0.25;
  const planPowerReadiness =
    scorecard.effectiveMuiPlan === "core"
      ? 0.45
      : scorecard.effectiveMuiPlan === "premium"
        ? 0.78
        : 0.95;
  const featurePerformanceStress = clamp(
    (input.advancedFeatures.includes("custom-rendering") ? 0.22 : 0) +
      (input.advancedFeatures.includes("drag-and-drop") ? 0.16 : 0) +
      (input.advancedFeatures.includes("server-side-data") ? 0.14 : 0) +
      (input.advancedFeatures.includes("virtualization") ? 0.12 : 0) +
      (input.advancedFeatures.includes("i18n-localization") ? 0.08 : 0) +
      (input.advancedFeatures.includes("timezone-logic") ? 0.08 : 0),
    0,
    0.55
  );
  const muiPerformanceReadiness = clamp(
    (planFit.coverageScore / 100) * scenarioWeights.muiLeverage.coverageScore +
      (1 - planFit.coverageGap) * scenarioWeights.muiLeverage.coverageGap +
      (1 - planFit.integrationRisk) * scenarioWeights.muiLeverage.supportGap +
      muiUsageReadiness * scenarioWeights.muiLeverage.existingMuiUsage +
      handoffAlignment * scenarioWeights.muiLeverage.handoffAlignment +
      scorecard.deliveryStrength * 0.07 +
      planPowerReadiness * 0.05 -
      featurePerformanceStress,
    0,
    1
  );
  const muiPerformanceRelief = performancePressure * muiPerformanceReadiness;
  const muiPerformanceBurden =
    performancePressure * (1 - muiPerformanceReadiness);
  const buildPerformanceReadiness = clamp(
    internalAbsorptionScore * 0.34 +
      buildReuseLeverageScore * 0.24 +
      knowledgeSpread * 0.16 +
      handoffAlignment * 0.12 +
      ownershipClarity * 0.08 +
      scorecard.deliveryStrength * 0.06,
    0,
    1
  );
  const buildPerformanceBurden =
    performancePressure * (1 - buildPerformanceReadiness);

  const internalAbsorption = buildLever(internalAbsorptionScore, [
    `${input.changeLeadTime} lead time, ${input.reworkFrequency} rework, and ${input.deadlinePressure} pressure set the delivery absorption baseline.`,
    `${input.designSystemMaturity} design-system maturity and ${input.ownershipModel} ownership determine how much custom work the team can absorb cleanly.`,
    `${input.dependentTeams} dependent teams and ${input.reactApps} React app${input.reactApps === 1 ? "" : "s"} limit how much coordination drag the build path has to carry.`,
    `${knowledgeConcentrationLabel} and ${handoffFrictionLabel} shape key-person and rework resilience.`
  ]);

  const buildReuseLeverage = buildLever(buildReuseLeverageScore, [
    `${input.designSystemMaturity} design-system maturity and ${input.ownershipModel} ownership determine how much prior UI investment can be reused.`,
    `${input.existingMuiUsage} MUI usage ${input.existingMuiUsage === "standardized" ? "reduces build-side reuse leverage because packaged standards already exist" : "keeps more room for internal reuse to matter on the build path"}.`,
    `${input.primaryUseCase}, ${featureCount} advanced feature${featureCount === 1 ? "" : "s"}, and the ${input.expectedRows}/${input.expectedColumns} scale profile still limit how much reuse can offset complexity.`,
    `${standardizationGoalLabel} only helps the build path when the team can actually reuse patterns cleanly.`
  ]);

  const muiPerformanceReadinessDrivers = [];

  if (muiPerformanceReadiness >= 0.67) {
    muiPerformanceReadinessDrivers.push(
      "MUI performance readiness is high because coverage, integration fit, and adoption conditions are strong enough to manage performance-sensitive requirements."
    );
  } else if (muiPerformanceBurden >= 0.45) {
    muiPerformanceReadinessDrivers.push(
      "Performance sensitivity increases MUI adoption burden because the selected MUI path has coverage, integration, adoption, or customization constraints."
    );
  }

  const muiLeverage = buildLever(
    clamp(planFit.coverageScore / 100, 0, 1) *
      scenarioWeights.muiLeverage.coverageScore +
      clamp(1 - planFit.coverageGap, 0, 1) *
        scenarioWeights.muiLeverage.coverageGap +
      clamp(1 - planFit.supportGap, 0, 1) *
        scenarioWeights.muiLeverage.supportGap +
      { none: 0.22, some: 0.58, standardized: 1 }[input.existingMuiUsage] *
        scenarioWeights.muiLeverage.existingMuiUsage +
      standardizationIntent *
        clamp(planFit.coverageScore / 100, 0, 1) *
        scenarioWeights.muiLeverage.standardizationIntent +
      packagedAffinity * scenarioWeights.muiLeverage.packagedAffinity +
      clamp(featureCount / 6, 0.08, 1) *
        scenarioWeights.muiLeverage.featureCount +
      muiPerformanceRelief * scenarioWeights.muiLeverage.performanceRelief,
    [
      `${PLAN_CONFIG[scorecard.effectiveMuiPlan].label} coverage is ${roundTo(planFit.coverageScore)}/100, which sets the main packaged leverage baseline.`,
      `${input.existingMuiUsage} MUI usage and ${input.primaryUseCase} determine how much implementation work the packaged path can realistically absorb.`,
      `${featureCount} advanced feature${featureCount === 1 ? "" : "s"} and the remaining coverage/support gaps limit leverage when fit is incomplete.`,
      `${standardizationGoalLabel} boosts the packaged path only when coverage is already strong enough to absorb it.`,
      ...muiPerformanceReadinessDrivers
    ]
  );

  const muiAdoptionBurden = buildLever(
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
      `${input.existingMuiUsage} current MUI usage sets the base adoption burden.`,
      `${input.designSystemMaturity} design-system maturity ${input.existingMuiUsage === "none" && input.designSystemMaturity === "high" ? "adds modest adaptation work because existing internal patterns still need to be preserved" : "changes how much theming and adaptation work remains"}.`,
      `${["custom-rendering", "drag-and-drop", "timezone-logic", "i18n-localization"].filter((feature) => input.advancedFeatures.includes(feature)).join(", ") || "No major customization-heavy features"} affect how much integration work the packaged path still carries.`,
      `${handoffFrictionLabel}, ${performanceSensitivityLabel}, and ${productionCriticalityLabel} only add a small amount of adoption friction.`,
      ...(muiPerformanceBurden >= 0.45
        ? [
            "Performance sensitivity increases MUI adoption burden because the selected MUI path has coverage, integration, adoption, or customization constraints."
          ]
        : [])
    ]
  );

  const buildPerformanceDrivers = [];

  if (buildPerformanceReadiness >= 0.67) {
    buildPerformanceDrivers.push(
      "Build performance readiness is high because internal absorption, shared knowledge, handoff alignment, and delivery maturity are strong."
    );
  } else if (buildPerformanceBurden >= 0.45) {
    buildPerformanceDrivers.push(
      "Performance sensitivity increases build-side downside risk because internal readiness to manage performance-sensitive complexity is limited."
    );
  }

  const downsideTailRisk = buildLever(
    scorecard.ownershipRisk * scenarioWeights.downsideTailRisk.ownershipRisk +
      scorecard.deliveryRisk * scenarioWeights.downsideTailRisk.deliveryRisk +
      scorecard.qualityRisk * scenarioWeights.downsideTailRisk.qualityRisk +
      scorecard.functionalRisk *
        scenarioWeights.downsideTailRisk.functionalRisk +
      scenarioWeights.downsideTailRisk.dependentTeams[input.dependentTeams] *
        scenarioWeights.downsideTailRisk.dependentTeamsMultiplier +
      clamp(input.reactApps / 5, 0.08, 1) *
        scenarioWeights.downsideTailRisk.reactApps +
      scenarioWeights.downsideTailRisk.accessibilityTarget[
        input.accessibilityTarget
      ] *
        scenarioWeights.downsideTailRisk.accessibilityTargetMultiplier +
      clamp(featureCount / 6, 0, 1) *
        scenarioWeights.downsideTailRisk.featureCount +
      clamp((rowScale + columnScale - 2) / 5, 0, 1) *
        scenarioWeights.downsideTailRisk.scaleProfile +
      scenarioWeights.downsideTailRisk.deadlinePressure[
        input.deadlinePressure
      ] *
        scenarioWeights.downsideTailRisk.deadlinePressureMultiplier +
      (1 - knowledgeSpread) * scenarioWeights.downsideTailRisk.knowledgeSpread +
      (1 - handoffAlignment) *
        scenarioWeights.downsideTailRisk.handoffAlignment +
      performancePressure *
        scenarioWeights.downsideTailRisk.performancePressure +
      buildPerformanceBurden *
        scenarioWeights.downsideTailRisk.buildPerformanceBurden +
      muiPerformanceBurden *
        scenarioWeights.downsideTailRisk.muiPerformanceBurden +
      productionPressure * scenarioWeights.downsideTailRisk.productionPressure +
      standardizationIntent *
        (input.dependentTeams === "one" || input.dependentTeams === "two-three"
          ? 0
          : scenarioWeights.downsideTailRisk.standardizationIntent),
    [
      `Functional, quality, delivery, and ownership risk still dominate the downside tail in the model.`,
      `${input.dependentTeams} dependent teams, ${input.reactApps} React app${input.reactApps === 1 ? "" : "s"}, and ${input.accessibilityTarget} accessibility increase long-tail coordination and QA exposure.`,
      `${featureCount} advanced feature${featureCount === 1 ? "" : "s"}, ${input.expectedRows}/${input.expectedColumns} scale, and ${input.deadlinePressure} deadline pressure determine whether variance should widen materially.`,
      `${knowledgeConcentrationLabel}, ${handoffFrictionLabel}, ${performanceSensitivityLabel}, and ${productionCriticalityLabel} influence the tail mainly through ownership, rework, performance, and support pressure.`,
      ...(buildPerformanceDrivers.length > 0 ? buildPerformanceDrivers : [])
    ]
  );

  return {
    internalAbsorption,
    buildReuseLeverage,
    muiLeverage,
    muiAdoptionBurden,
    downsideTailRisk,
    performancePressure: buildLever(performancePressure, [
      "Normalized pressure from the selected performance-sensitivity requirement."
    ]),
    muiPerformanceReadiness: buildLever(muiPerformanceReadiness, [
      "How well the selected MUI path appears positioned to manage performance-sensitive complexity.",
      `${planFit.coverageScore >= 67 ? "Coverage, integration fit, and adoption conditions are strong enough to absorb more of the performance burden." : "Coverage, integration, or adoption conditions leave more performance burden on the packaged path."}`
    ]),
    muiPerformanceRelief: buildLever(muiPerformanceRelief, [
      "The share of performance burden the selected MUI path can relieve when its fit is strong enough."
    ]),
    muiPerformanceBurden: buildLever(muiPerformanceBurden, [
      "Remaining performance-sensitive burden on the MUI path after coverage, integration, and adoption conditions are considered.",
      ...muiPerformanceReadinessDrivers
    ]),
    buildPerformanceReadiness: buildLever(buildPerformanceReadiness, [
      "How well internal conditions appear positioned to manage performance-sensitive custom implementation.",
      `${input.ownershipModel === "same-product-team" && input.designDevHandoffFriction === "low" ? "Ownership clarity and low handoff friction make the build path easier to tune for performance-sensitive work." : "Internal alignment and delivery maturity determine how much performance-sensitive work the build path can absorb cleanly."}`
    ]),
    buildPerformanceBurden: buildLever(buildPerformanceBurden, [
      "Remaining performance-sensitive burden on the Build path after internal readiness is considered.",
      ...buildPerformanceDrivers
    ])
  };
}

function estimateLicensedDevelopers(input, effectiveMuiPlan) {
  if (effectiveMuiPlan === "core") {
    return 0;
  }

  if (effectiveMuiPlan === "premium") {
    return Math.max(1, input.frontendDevelopers);
  }

  let estimatedSeats = Math.max(15, input.frontendDevelopers);

  if (
    input.dependentTeams === "four-seven" ||
    input.dependentTeams === "eight-plus" ||
    input.reactApps >= 3
  ) {
    estimatedSeats += 5;
  }

  return estimatedSeats;
}

function buildDeterministicConfidence(scorecard, estimateBreakdown) {
  const buildLaunchWeeks = estimateBreakdown.build.schedule.launchWeeks;
  const muiLaunchWeeks = estimateBreakdown.mui.schedule.launchWeeks;
  const buildTco = estimateBreakdown.build.cost.totalCost;
  const muiTco = estimateBreakdown.mui.cost.totalCost;
  const buildTierScore = scorecard.buildTierScore;
  const selectedMuiPlanScore =
    scorecard[`${scorecard.effectiveMuiPlan}TierScore`];
  const launchSeparation = Math.abs(buildLaunchWeeks - muiLaunchWeeks);
  const tcoSeparation =
    Math.abs(buildTco - muiTco) / Math.max(Math.max(buildTco, muiTco), 1);
  const pathScoreSeparation =
    Math.abs(selectedMuiPlanScore - buildTierScore) / 100;

  return clamp(
    Math.round(
      42 +
        launchSeparation * 4.5 +
        tcoSeparation * 110 +
        pathScoreSeparation * 24
    ),
    0,
    100
  );
}

function buildDeterministicSnapshot(input) {
  const derivedFactors = buildDerivedFactors(input);
  const scorecard = buildScorecard(input, derivedFactors);
  const estimateBreakdown = buildDeterministicEstimate(input, scorecard);
  const buildLaunchWeeks = estimateBreakdown.build.schedule.launchWeeks;
  const muiLaunchWeeks = estimateBreakdown.mui.schedule.launchWeeks;
  const buildTco = estimateBreakdown.build.cost.totalCost;
  const muiTco = estimateBreakdown.mui.cost.totalCost;
  const buildTierScore = scorecard.buildTierScore;
  const selectedMuiPlanScore =
    scorecard[`${scorecard.effectiveMuiPlan}TierScore`];
  const confidence = buildDeterministicConfidence(scorecard, estimateBreakdown);

  return {
    scorecard,
    estimateBreakdown,
    buildLaunchWeeks,
    muiLaunchWeeks,
    buildTco,
    muiTco,
    tcoDelta: muiTco - buildTco,
    buildTierScore,
    selectedMuiPlanScore,
    confidence
  };
}

function formatSignedWeeks(value) {
  const normalized = roundTo(value, 1);
  return `${normalized >= 0 ? "+" : ""}${normalized}w`;
}

function formatSignedCurrency(value) {
  const rounded = Math.round(value);
  return `${rounded >= 0 ? "+" : ""}$${Math.abs(rounded).toLocaleString("en-US")}`;
}

function formatSignedScore(value) {
  const normalized = roundTo(value, 1);
  return `${normalized >= 0 ? "+" : ""}${normalized}`;
}

function buildDirectionLabel(candidate, base) {
  const buildLaunchDelta = candidate.buildLaunchWeeks - base.buildLaunchWeeks;
  const muiLaunchDelta = candidate.muiLaunchWeeks - base.muiLaunchWeeks;
  const buildTcoDelta = candidate.buildTco - base.buildTco;
  const muiTcoDelta = candidate.muiTco - base.muiTco;
  const selectedMuiScoreDelta =
    candidate.selectedMuiPlanScore - base.selectedMuiPlanScore;
  const buildBurden =
    Math.max(0, buildLaunchDelta) * 1.8 + Math.max(0, buildTcoDelta) / 18000;
  const buildRelief =
    Math.max(0, -buildLaunchDelta) * 1.8 + Math.max(0, -buildTcoDelta) / 18000;
  const muiBurden =
    Math.max(0, muiLaunchDelta) * 1.8 + Math.max(0, muiTcoDelta) / 18000;
  const muiRelief =
    Math.max(0, -muiLaunchDelta) * 1.8 + Math.max(0, -muiTcoDelta) / 18000;
  const recommendationShift =
    candidate.selectedMuiPlanScore -
    candidate.buildTierScore -
    (base.selectedMuiPlanScore - base.buildTierScore);

  if (candidate.costOnly) {
    return "cost-only";
  }

  if (buildBurden >= muiBurden * 1.2 && buildBurden > 0.05) {
    return buildRelief > buildBurden
      ? "reduces-build-burden"
      : "increases-build-burden";
  }

  if (muiBurden >= buildBurden * 1.2 && muiBurden > 0.05) {
    return muiRelief > muiBurden
      ? "reduces-mui-burden"
      : "increases-mui-burden";
  }

  if (recommendationShift > 1.5) {
    return "increases-mui-relevance";
  }

  if (recommendationShift < -1.5) {
    return "increases-build-credibility";
  }

  if (
    selectedMuiScoreDelta > 0 &&
    buildLaunchDelta >= 0 &&
    muiLaunchDelta <= 0
  ) {
    return "increases-mui-relevance";
  }

  if (
    selectedMuiScoreDelta < 0 &&
    buildLaunchDelta <= 0 &&
    muiLaunchDelta >= 0
  ) {
    return "increases-build-credibility";
  }

  return "mixed";
}

function buildImpactSummary(candidate, base) {
  const parts = [];
  const buildLaunchDelta = candidate.buildLaunchWeeks - base.buildLaunchWeeks;
  const muiLaunchDelta = candidate.muiLaunchWeeks - base.muiLaunchWeeks;
  const tcoDeltaDelta = candidate.tcoDelta - base.tcoDelta;
  const buildTierDelta = candidate.buildTierScore - base.buildTierScore;
  const selectedMuiPlanScoreDelta =
    candidate.selectedMuiPlanScore - base.selectedMuiPlanScore;
  const confidenceDelta = candidate.confidence - base.confidence;

  if (Math.abs(buildLaunchDelta) >= 0.1) {
    parts.push(`Build launch ${formatSignedWeeks(buildLaunchDelta)}`);
  }

  if (Math.abs(muiLaunchDelta) >= 0.1) {
    parts.push(`MUI launch ${formatSignedWeeks(muiLaunchDelta)}`);
  }

  if (Math.abs(tcoDeltaDelta) >= 1) {
    parts.push(`TCO delta ${formatSignedCurrency(tcoDeltaDelta)}`);
  }

  if (
    Math.abs(buildTierDelta) >= 0.5 ||
    Math.abs(selectedMuiPlanScoreDelta) >= 0.5
  ) {
    parts.push(
      `Path score gap ${formatSignedScore(
        selectedMuiPlanScoreDelta - buildTierDelta
      )}`
    );
  }

  if (Math.abs(confidenceDelta) >= 1) {
    parts.push(`Confidence ${formatSignedScore(confidenceDelta)}`);
  }

  return parts.length > 0
    ? parts.join("; ")
    : "No material deterministic change.";
}

function scoreSensitivityCandidate(candidate, base) {
  return (
    Math.abs(candidate.buildLaunchWeeks - base.buildLaunchWeeks) * 2.4 +
    Math.abs(candidate.muiLaunchWeeks - base.muiLaunchWeeks) * 2.4 +
    Math.abs(candidate.tcoDelta - base.tcoDelta) / 2200 +
    Math.abs(candidate.buildTierScore - base.buildTierScore) * 0.7 +
    Math.abs(candidate.selectedMuiPlanScore - base.selectedMuiPlanScore) * 0.7 +
    Math.abs(candidate.confidence - base.confidence) * 1.2
  );
}

function buildSensitivityDiagnostics(input, baseResult) {
  const baseSnapshot =
    baseResult?.scorecard && baseResult?.estimateBreakdown
      ? {
          scorecard: baseResult.scorecard,
          estimateBreakdown: baseResult.estimateBreakdown,
          buildLaunchWeeks: baseResult.buildLaunchWeeks,
          muiLaunchWeeks: baseResult.muiLaunchWeeks,
          buildTco: baseResult.buildTco,
          muiTco: baseResult.muiTco,
          tcoDelta: baseResult.tcoDelta,
          buildTierScore: baseResult.buildTierScore,
          selectedMuiPlanScore: baseResult.selectedMuiPlanScore,
          confidence:
            Number.isFinite(baseResult.confidence) &&
            baseResult.confidence !== null
              ? baseResult.confidence
              : buildDeterministicConfidence(
                  baseResult.scorecard,
                  baseResult.estimateBreakdown
                )
        }
      : buildDeterministicSnapshot(input);
  const candidateSpecs = [];
  const seenInputs = new Set([JSON.stringify(input)]);

  const addCandidate = (inputKey, testedChange, mutate, costOnly = false) => {
    const candidateInput = mutate();
    const candidateSignature = JSON.stringify(candidateInput);
    if (seenInputs.has(candidateSignature)) {
      return;
    }

    seenInputs.add(candidateSignature);
    candidateSpecs.push({
      inputKey,
      label: getSensitivityLabel(inputKey),
      testedChange,
      costOnly,
      candidateInput
    });
  };

  const addAdjacentCandidates = (
    inputKey,
    order,
    testedChangeFromValue,
    costOnly = false
  ) => {
    const currentValue = input[inputKey];
    const previousValue = getAdjacentValue(order, currentValue, -1);
    const nextValue = getAdjacentValue(order, currentValue, 1);

    if (previousValue !== null) {
      addCandidate(
        inputKey,
        testedChangeFromValue(currentValue, previousValue),
        () => ({ ...input, [inputKey]: previousValue }),
        costOnly
      );
    }

    if (nextValue !== null) {
      addCandidate(
        inputKey,
        testedChangeFromValue(currentValue, nextValue),
        () => ({ ...input, [inputKey]: nextValue }),
        costOnly
      );
    }
  };

  addAdjacentCandidates(
    "dependentTeams",
    DEPENDENT_TEAMS_ORDER,
    (currentValue, nextValue) => `${currentValue} -> ${nextValue}`
  );
  addAdjacentCandidates(
    "ownershipModel",
    OWNERSHIP_MODEL_ORDER,
    (currentValue, nextValue) => `${currentValue} -> ${nextValue}`
  );
  addAdjacentCandidates(
    "existingMuiUsage",
    EXISTING_MUI_USAGE_ORDER,
    (currentValue, nextValue) => `${currentValue} -> ${nextValue}`
  );
  addAdjacentCandidates(
    "designSystemMaturity",
    DESIGN_SYSTEM_MATURITY_ORDER,
    (currentValue, nextValue) => `${currentValue} -> ${nextValue}`
  );
  addAdjacentCandidates(
    "expectedRows",
    EXPECTED_ROWS_ORDER,
    (currentValue, nextValue) => `${currentValue} -> ${nextValue}`
  );
  addAdjacentCandidates(
    "expectedColumns",
    EXPECTED_COLUMNS_ORDER,
    (currentValue, nextValue) => `${currentValue} -> ${nextValue}`
  );
  addAdjacentCandidates(
    "accessibilityTarget",
    ACCESSIBILITY_TARGET_ORDER,
    (currentValue, nextValue) => `${currentValue} -> ${nextValue}`
  );
  addAdjacentCandidates(
    "changeLeadTime",
    CHANGE_LEAD_TIME_ORDER,
    (currentValue, nextValue) => `${currentValue} -> ${nextValue}`
  );
  addAdjacentCandidates(
    "reworkFrequency",
    REWORK_FREQUENCY_ORDER,
    (currentValue, nextValue) => `${currentValue} -> ${nextValue}`
  );
  addAdjacentCandidates(
    "deadlinePressure",
    PRESSURE_LEVEL_ORDER,
    (currentValue, nextValue) => `${currentValue} -> ${nextValue}`
  );
  addAdjacentCandidates(
    "supportRequirement",
    SUPPORT_REQUIREMENT_ORDER,
    (currentValue, nextValue) => `${currentValue} -> ${nextValue}`
  );
  addAdjacentCandidates(
    "performanceSensitivity",
    PERFORMANCE_SENSITIVITY_ORDER,
    (currentValue, nextValue) => `${currentValue} -> ${nextValue}`
  );
  addAdjacentCandidates(
    "knowledgeConcentration",
    KNOWLEDGE_CONCENTRATION_ORDER,
    (currentValue, nextValue) => `${currentValue} -> ${nextValue}`
  );
  addAdjacentCandidates(
    "designDevHandoffFriction",
    DESIGN_DEV_HANDOFF_FRICTION_ORDER,
    (currentValue, nextValue) => `${currentValue} -> ${nextValue}`
  );
  addAdjacentCandidates(
    "componentStandardizationGoal",
    COMPONENT_STANDARDIZATION_GOAL_ORDER,
    (currentValue, nextValue) => `${currentValue} -> ${nextValue}`
  );
  addAdjacentCandidates(
    "productionCriticality",
    PRODUCTION_CRITICALITY_ORDER,
    (currentValue, nextValue) => `${currentValue} -> ${nextValue}`
  );

  for (const delta of [-2, 2]) {
    const nextValue = Math.max(1, input.frontendDevelopers + delta);
    if (nextValue !== input.frontendDevelopers) {
      addCandidate(
        "frontendDevelopers",
        delta > 0 ? `+${delta}` : `${delta}`,
        () => ({ ...input, frontendDevelopers: nextValue })
      );
    }
  }

  for (const delta of [-1, 1]) {
    const nextValue = Math.max(1, input.reactApps + delta);
    if (nextValue !== input.reactApps) {
      addCandidate("reactApps", delta > 0 ? `+1` : `-1`, () => ({
        ...input,
        reactApps: nextValue
      }));
    }
  }

  for (const delta of [-2, 2]) {
    const nextValue = Math.max(0, input.dataHeavyScreens + delta);
    if (nextValue !== input.dataHeavyScreens) {
      addCandidate(
        "dataHeavyScreens",
        delta > 0 ? `+${delta}` : `${delta}`,
        () => ({ ...input, dataHeavyScreens: nextValue })
      );
    }
  }

  for (const multiplier of [0.8, 1.2]) {
    const nextValue = Math.max(
      1,
      Math.round(input.engineerCostPerDay * multiplier)
    );
    if (nextValue !== input.engineerCostPerDay) {
      addCandidate(
        "engineerCostPerDay",
        multiplier > 1 ? "+20%" : "-20%",
        () => ({ ...input, engineerCostPerDay: nextValue }),
        true
      );
    }
  }

  addAdjacentCandidates(
    "maintenanceHorizonMonths",
    MAINTENANCE_HORIZON_ORDER,
    (currentValue, nextValue) => `${currentValue} -> ${nextValue}`,
    true
  );

  if (
    Array.isArray(input.advancedFeatures) &&
    input.advancedFeatures.length === 0
  ) {
    addCandidate("advancedFeatures", "add custom-rendering", () => ({
      ...input,
      advancedFeatures: ["custom-rendering"]
    }));
  } else if (
    Array.isArray(input.advancedFeatures) &&
    input.advancedFeatures.length > 0
  ) {
    const featuresToTest = [...input.advancedFeatures]
      .sort(
        (left, right) =>
          (ADVANCED_FEATURE_WEIGHTS[right] ?? 0) -
          (ADVANCED_FEATURE_WEIGHTS[left] ?? 0)
      )
      .slice(0, 6);

    for (const feature of featuresToTest) {
      addCandidate("advancedFeatures", `remove ${feature}`, () => ({
        ...input,
        advancedFeatures: input.advancedFeatures.filter(
          (selectedFeature) => selectedFeature !== feature
        )
      }));
    }
  }

  const evaluatedCandidates = [];

  for (const spec of candidateSpecs.slice(0, 40)) {
    const snapshot = buildDeterministicSnapshot(spec.candidateInput);
    const candidate = {
      ...spec,
      direction: buildDirectionLabel(
        {
          ...snapshot,
          costOnly: spec.costOnly
        },
        baseSnapshot
      ),
      impactSummary: buildImpactSummary(snapshot, baseSnapshot),
      deltas: {
        buildLaunchWeeks: roundTo(
          snapshot.buildLaunchWeeks - baseSnapshot.buildLaunchWeeks
        ),
        muiLaunchWeeks: roundTo(
          snapshot.muiLaunchWeeks - baseSnapshot.muiLaunchWeeks
        ),
        tcoDelta: Math.round(snapshot.tcoDelta - baseSnapshot.tcoDelta),
        buildTco: Math.round(snapshot.buildTco - baseSnapshot.buildTco),
        muiTco: Math.round(snapshot.muiTco - baseSnapshot.muiTco),
        buildTierScore: roundTo(
          snapshot.buildTierScore - baseSnapshot.buildTierScore
        ),
        selectedMuiPlanScore: roundTo(
          snapshot.selectedMuiPlanScore - baseSnapshot.selectedMuiPlanScore
        ),
        confidence: roundTo(snapshot.confidence - baseSnapshot.confidence)
      },
      score: scoreSensitivityCandidate(snapshot, baseSnapshot)
    };

    evaluatedCandidates.push(candidate);
  }

  const topDrivers = [...evaluatedCandidates]
    .sort((left, right) => right.score - left.score)
    .slice(0, 5)
    .map(({ score, ...driver }) => driver);

  const buildLaunchDrivers = [...evaluatedCandidates]
    .sort(
      (left, right) =>
        Math.abs(right.deltas.buildLaunchWeeks) -
        Math.abs(left.deltas.buildLaunchWeeks)
    )
    .slice(0, 5)
    .map(({ score, ...driver }) => driver);

  const muiLaunchDrivers = [...evaluatedCandidates]
    .sort(
      (left, right) =>
        Math.abs(right.deltas.muiLaunchWeeks) -
        Math.abs(left.deltas.muiLaunchWeeks)
    )
    .slice(0, 5)
    .map(({ score, ...driver }) => driver);

  const tcoDrivers = [...evaluatedCandidates]
    .sort(
      (left, right) =>
        Math.abs(right.deltas.tcoDelta) - Math.abs(left.deltas.tcoDelta)
    )
    .slice(0, 5)
    .map(({ score, ...driver }) => driver);

  const recommendationDrivers = [...evaluatedCandidates]
    .sort(
      (left, right) =>
        Math.abs(right.deltas.confidence) +
        Math.abs(
          right.deltas.selectedMuiPlanScore - right.deltas.buildTierScore
        ) -
        (Math.abs(left.deltas.confidence) +
          Math.abs(
            left.deltas.selectedMuiPlanScore - left.deltas.buildTierScore
          ))
    )
    .slice(0, 5)
    .map(({ score, ...driver }) => driver);

  return {
    method: "deterministic-adjacent-input-perturbation",
    topDrivers,
    buildLaunchDrivers,
    muiLaunchDrivers,
    tcoDrivers,
    recommendationDrivers
  };
}

function buildDeterministicEstimate(input, scorecard) {
  const buildCalibration = SIMULATION_CALIBRATION.build;
  const muiCalibration = SIMULATION_CALIBRATION.mui;
  const simulationPrepCalibration = CALIBRATION.simulation.prep;
  const buildVelocityCalibration = CALIBRATION.simulation.velocity.build;
  const muiVelocityCalibration = CALIBRATION.simulation.velocity.mui;
  const frontendDeveloperVelocityCalibration =
    CALIBRATION.simulation.velocity.frontendDevelopers;
  const planFit = scorecard.effectivePlanFit;
  const estimatedLicensedDevelopers = estimateLicensedDevelopers(
    input,
    scorecard.effectiveMuiPlan
  );
  const horizonYears = input.maintenanceHorizonMonths / 12;
  // Engineer cost only feeds TCO through the weekly labor rate; it does not
  // affect launch time or effort.
  const laborCostPerWeek = input.engineerCostPerDay * 5;
  const rowScale = EXPECTED_ROWS_INDEX[input.expectedRows];
  const columnScale = EXPECTED_COLUMNS_INDEX[input.expectedColumns];
  const scaleDemand = rowScale + columnScale;
  const coverageStrength = clamp(planFit.coverageScore / 100, 0, 1);
  const coverageShield =
    coverageStrength >= simulationPrepCalibration.coverageShield.strongThreshold
      ? simulationPrepCalibration.coverageShield.strongValue
      : coverageStrength >=
          simulationPrepCalibration.coverageShield.mediumThreshold
        ? simulationPrepCalibration.coverageShield.mediumValue
        : simulationPrepCalibration.coverageShield.fallbackValue;
  const internalAbsorption = scorecard.internalAbsorption;
  const buildReuseLeverage = scorecard.buildReuseLeverage;
  const muiLeverage = scorecard.muiLeverage;
  const muiAdoptionBurden = scorecard.muiAdoptionBurden;
  const downsideTailRisk = scorecard.downsideTailRisk;
  const buildAbsorptionShield = clamp(
    internalAbsorption *
      simulationPrepCalibration.buildAbsorptionShield.internalAbsorption +
      buildReuseLeverage *
        simulationPrepCalibration.buildAbsorptionShield.buildReuseLeverage,
    simulationPrepCalibration.buildAbsorptionShield.minimum,
    simulationPrepCalibration.buildAbsorptionShield.maximum
  );
  const buildTailPenalty =
    downsideTailRisk >= simulationPrepCalibration.buildTailPenalty.threshold
      ? (downsideTailRisk -
          simulationPrepCalibration.buildTailPenalty.threshold) *
        simulationPrepCalibration.buildTailPenalty.multiplier
      : 0;
  const buildDeveloperVelocityAdjustment = evaluateThresholdTable(
    input.frontendDevelopers,
    frontendDeveloperVelocityCalibration.build
  );
  const muiDeveloperVelocityAdjustment = evaluateThresholdTable(
    input.frontendDevelopers,
    frontendDeveloperVelocityCalibration.mui
  );
  const buildVelocity = clamp(
    buildVelocityCalibration.base +
      scorecard.deliveryStrength * buildVelocityCalibration.deliveryStrength +
      scorecard.ownershipRisk * buildVelocityCalibration.ownershipRisk +
      internalAbsorption * buildVelocityCalibration.internalAbsorption +
      buildDeveloperVelocityAdjustment,
    buildVelocityCalibration.minimum,
    buildVelocityCalibration.maximum
  );
  const muiVelocity = clamp(
    muiVelocityCalibration.base +
      scorecard.deliveryStrength * muiVelocityCalibration.deliveryStrength +
      scorecard.ownershipRisk * muiVelocityCalibration.ownershipRisk +
      muiLeverage * muiVelocityCalibration.muiLeverage +
      muiAdoptionBurden * muiVelocityCalibration.muiAdoptionBurden +
      muiDeveloperVelocityAdjustment,
    muiVelocityCalibration.minimum,
    muiVelocityCalibration.maximum
  );

  const buildBaseEngineeringWeeks = buildCalibration.engineeringMeanWeeks.base;
  const buildFunctionalRiskWeeks =
    scorecard.functionalRisk *
    buildCalibration.engineeringMeanWeeks.functionalRisk;
  const buildQualityRiskWeeks =
    scorecard.qualityRisk * buildCalibration.engineeringMeanWeeks.qualityRisk;
  const buildOwnershipRiskWeeks =
    scorecard.ownershipRisk *
    buildCalibration.engineeringMeanWeeks.ownershipRisk;
  const buildDeliveryRiskWeeks =
    scorecard.deliveryRisk * buildCalibration.engineeringMeanWeeks.deliveryRisk;
  const buildEnterpriseNeedWeeks =
    scorecard.enterpriseNeed *
    buildCalibration.engineeringMeanWeeks.enterpriseNeed;
  const buildScaleAdjustmentWeeks =
    scaleDemand >= 5
      ? buildCalibration.engineeringMeanWeeks.largeScaleAdjustment
      : 0;
  const buildPreAdjustmentEngineeringWeeks =
    buildBaseEngineeringWeeks +
    buildFunctionalRiskWeeks +
    buildQualityRiskWeeks +
    buildOwnershipRiskWeeks +
    buildDeliveryRiskWeeks +
    buildEnterpriseNeedWeeks +
    buildScaleAdjustmentWeeks;
  const buildAbsorptionReductionWeeks =
    buildPreAdjustmentEngineeringWeeks * buildAbsorptionShield;
  const buildDownsideTailAdditionWeeks =
    downsideTailRisk *
    buildCalibration.fatTail.build.downsideTailRiskMeanMultiplier;
  const buildAdjustedEngineeringWeeks = Math.max(
    buildCalibration.engineeringMeanWeeks.minimum,
    buildPreAdjustmentEngineeringWeeks -
      buildAbsorptionReductionWeeks +
      buildDownsideTailAdditionWeeks
  );
  const buildReworkBaseWeeks =
    buildCalibration.reworkMeanWeeks.base +
    scorecard.functionalRisk * buildCalibration.reworkMeanWeeks.functionalRisk +
    scorecard.qualityRisk * buildCalibration.reworkMeanWeeks.qualityRisk +
    scorecard.ownershipRisk * buildCalibration.reworkMeanWeeks.ownershipRisk +
    scorecard.deliveryRisk * buildCalibration.reworkMeanWeeks.deliveryRisk +
    (scaleDemand >= 5
      ? buildCalibration.reworkMeanWeeks.largeScaleAdjustment
      : 0);
  const buildReworkAllowanceWeeks = Math.max(
    buildCalibration.reworkMeanWeeks.minimum,
    buildReworkBaseWeeks *
      (1 - buildAbsorptionShield *
        buildCalibration.reworkMeanWeeks.absorptionShieldReductionFactor) +
      downsideTailRisk *
        buildCalibration.reworkMeanWeeks.downsideTailRiskAddition
  );
  const buildTotalEngineeringWeeks =
    buildAdjustedEngineeringWeeks + buildReworkAllowanceWeeks;
  const buildEngineeringCalendarWeeks =
    buildTotalEngineeringWeeks / buildVelocity;
  const buildSlipBaseWeeks =
    buildCalibration.slipMeanWeeks.base +
    scorecard.deliveryRisk * buildCalibration.slipMeanWeeks.deliveryRisk +
    scorecard.functionalRisk * buildCalibration.slipMeanWeeks.functionalRisk +
    scorecard.qualityRisk * buildCalibration.slipMeanWeeks.qualityRisk +
    scorecard.ownershipRisk * buildCalibration.slipMeanWeeks.ownershipRisk +
    scorecard.enterpriseNeed * buildCalibration.slipMeanWeeks.enterpriseNeed +
    (scaleDemand >= 5
      ? buildCalibration.slipMeanWeeks.largeScaleAdjustment
      : 0);
  const buildSlipWeeks = Math.max(
    buildCalibration.slipFloorWeeks,
    buildSlipBaseWeeks *
      (1 -
        buildAbsorptionShield *
          buildCalibration.slipMeanWeeks.absorptionShieldReductionFactor) +
      buildTailPenalty * buildCalibration.slipMeanWeeks.tailPenaltyMultiplier
  );
  const buildAppRolloutOverheadWeeks =
    scorecard.appScale * buildCalibration.launch.appScaleOverheadWeeks;
  const buildLaunchWeeks = Math.max(
    buildCalibration.launch.minimumWeeks,
    buildEngineeringCalendarWeeks +
      buildSlipWeeks +
      buildAppRolloutOverheadWeeks
  );
  const buildBaseMaintenanceWeeks =
    horizonYears *
    (buildCalibration.maintenanceWeeks.base +
      scorecard.functionalRisk *
        buildCalibration.maintenanceWeeks.functionalRisk +
      scorecard.qualityRisk * buildCalibration.maintenanceWeeks.qualityRisk +
      scorecard.ownershipRisk *
        buildCalibration.maintenanceWeeks.ownershipRisk +
      scorecard.deliveryRisk * buildCalibration.maintenanceWeeks.deliveryRisk +
      (scaleDemand >= 5
        ? buildCalibration.maintenanceWeeks.largeScaleAdjustment
        : 0));
  const buildAbsorptionReductionMaintenanceWeeks =
    buildBaseMaintenanceWeeks *
    buildAbsorptionShield *
    buildCalibration.maintenanceWeeks.absorptionShieldReductionFactor;
  const buildDownsideTailMaintenanceAdditionWeeks =
    downsideTailRisk *
    buildCalibration.maintenanceWeeks.downsideTailRiskHorizonMultiplier *
    horizonYears;
  const buildMaintenanceWeeks = Math.max(
    buildCalibration.maintenanceWeeks.minimum,
    Math.max(
      buildCalibration.maintenanceWeeks.minimumBase,
      buildBaseMaintenanceWeeks
    ) -
      buildAbsorptionReductionMaintenanceWeeks +
      buildDownsideTailMaintenanceAdditionWeeks
  );
  const buildEngineeringAndMaintenanceWeeks =
    buildTotalEngineeringWeeks + buildMaintenanceWeeks;
  const buildLaborCost = buildEngineeringAndMaintenanceWeeks * laborCostPerWeek;

  const muiBaseEngineeringWeeks =
    muiCalibration.engineeringMeanWeeks.base +
    scorecard.functionalRisk *
      muiCalibration.engineeringMeanWeeks.functionalRisk +
    scorecard.qualityRisk * muiCalibration.engineeringMeanWeeks.qualityRisk +
    scorecard.deliveryRisk * muiCalibration.engineeringMeanWeeks.deliveryRisk +
    planFit.integrationRisk *
      muiCalibration.engineeringMeanWeeks.integrationRisk +
    planFit.coverageGap * muiCalibration.engineeringMeanWeeks.coverageGap +
    planFit.supportGap * muiCalibration.engineeringMeanWeeks.supportGap;
  const muiCoverageShieldReductionWeeks =
    coverageShield *
    muiCalibration.engineeringMeanWeeks.coverageShieldReduction;
  const muiPreAdjustmentEngineeringWeeks =
    muiBaseEngineeringWeeks -
    muiCoverageShieldReductionWeeks +
    muiCalibration.engineeringMeanWeeks.baseAdoptionOffset;
  const muiAdoptionBurdenWeeks =
    muiAdoptionBurden * muiCalibration.engineeringMeanWeeks.adoptionBurden;
  const muiLeverageReductionWeeks =
    muiLeverage * muiCalibration.engineeringMeanWeeks.leverageReduction;
  const muiAdjustedEngineeringWeeks = Math.max(
    muiCalibration.engineeringMeanWeeks.minimum,
    muiPreAdjustmentEngineeringWeeks +
      muiAdoptionBurdenWeeks -
      muiLeverageReductionWeeks -
      coverageShield *
        muiCalibration.engineeringMeanWeeks.coverageShieldAdditionalReduction
  );
  const muiReworkBaseWeeks =
    muiCalibration.reworkMeanWeeks.base +
    planFit.coverageGap * muiCalibration.reworkMeanWeeks.coverageGap +
    planFit.integrationRisk * muiCalibration.reworkMeanWeeks.integrationRisk +
    scorecard.qualityRisk * muiCalibration.reworkMeanWeeks.qualityRisk +
    planFit.supportGap * muiCalibration.reworkMeanWeeks.supportGap;
  const muiReworkAllowanceWeeks = Math.max(
    muiCalibration.reworkMeanWeeks.minimum,
    muiReworkBaseWeeks +
      muiAdoptionBurden * muiCalibration.reworkMeanWeeks.adoptionBurden -
      muiLeverage * muiCalibration.reworkMeanWeeks.leverageReduction -
      coverageShield *
        muiCalibration.reworkMeanWeeks.coverageShieldAdditionalReduction
  );
  const muiTotalEngineeringWeeks =
    muiAdjustedEngineeringWeeks + muiReworkAllowanceWeeks;
  const muiEngineeringCalendarWeeks = muiTotalEngineeringWeeks / muiVelocity;
  const muiSlipBaseWeeks =
    muiCalibration.slipMeanWeeks.base +
    scorecard.deliveryRisk * muiCalibration.slipMeanWeeks.deliveryRisk +
    planFit.coverageGap * muiCalibration.slipMeanWeeks.coverageGap +
    planFit.integrationRisk * muiCalibration.slipMeanWeeks.integrationRisk +
    planFit.supportGap * muiCalibration.slipMeanWeeks.supportGap;
  const muiSlipWeeks = Math.max(
    muiCalibration.slipFloorWeeks,
    muiSlipBaseWeeks
  );
  const muiAppRolloutOverheadWeeks =
    scorecard.appScale * muiCalibration.launch.appScaleOverheadWeeks;
  const muiLaunchWeeks = Math.max(
    muiCalibration.launch.minimumWeeks,
    muiEngineeringCalendarWeeks + muiSlipWeeks + muiAppRolloutOverheadWeeks
  );
  const muiBaseMaintenanceWeeks =
    horizonYears *
    (muiCalibration.maintenanceWeeks.base +
      scorecard.functionalRisk *
        muiCalibration.maintenanceWeeks.functionalRisk +
      scorecard.qualityRisk * muiCalibration.maintenanceWeeks.qualityRisk +
      planFit.integrationRisk *
        muiCalibration.maintenanceWeeks.integrationRisk +
      planFit.coverageGap * muiCalibration.maintenanceWeeks.coverageGap +
      planFit.supportGap * muiCalibration.maintenanceWeeks.supportGap -
      scorecard.muiUsage * muiCalibration.maintenanceWeeks.muiUsageReduction -
      coverageShield * muiCalibration.maintenanceWeeks.coverageShieldReduction);
  const muiAdoptionMaintenanceWeeks =
    muiAdoptionBurden *
    muiCalibration.maintenanceWeeks.adoptionBurden *
    horizonYears;
  const muiLeverageMaintenanceReductionWeeks =
    muiLeverage *
    muiCalibration.maintenanceWeeks.leverageReduction *
    horizonYears;
  const muiMaintenanceWeeks = Math.max(
    muiCalibration.maintenanceWeeks.minimum,
    Math.max(
      muiCalibration.maintenanceWeeks.minimumBase,
      muiBaseMaintenanceWeeks
    ) +
      muiAdoptionMaintenanceWeeks -
      muiLeverageMaintenanceReductionWeeks -
      coverageShield *
        muiCalibration.maintenanceWeeks.coverageShieldAdditionalReduction
  );
  const muiEngineeringAndMaintenanceWeeks =
    muiTotalEngineeringWeeks + muiMaintenanceWeeks;
  const muiLaborCost = muiEngineeringAndMaintenanceWeeks * laborCostPerWeek;
  const muiLicenseCost =
    PLAN_CONFIG[scorecard.effectiveMuiPlan].licensePerDeveloperYear *
    estimatedLicensedDevelopers *
    horizonYears;
  const muiTotalCost = muiLaborCost + muiLicenseCost;

  return {
    build: {
      effort: {
        baseEngineeringWeeks: roundTo(buildBaseEngineeringWeeks),
        functionalRiskWeeks: roundTo(buildFunctionalRiskWeeks),
        qualityRiskWeeks: roundTo(buildQualityRiskWeeks),
        ownershipRiskWeeks: roundTo(buildOwnershipRiskWeeks),
        deliveryRiskWeeks: roundTo(buildDeliveryRiskWeeks),
        enterpriseNeedWeeks: roundTo(buildEnterpriseNeedWeeks),
        scaleAdjustmentWeeks: roundTo(buildScaleAdjustmentWeeks),
        preAdjustmentEngineeringWeeks: roundTo(
          buildPreAdjustmentEngineeringWeeks
        ),
        absorptionReductionWeeks: roundTo(buildAbsorptionReductionWeeks),
        downsideTailAdditionWeeks: roundTo(buildDownsideTailAdditionWeeks),
        adjustedEngineeringWeeks: roundTo(buildAdjustedEngineeringWeeks),
        reworkAllowanceWeeks: roundTo(buildReworkAllowanceWeeks),
        totalEngineeringWeeks: roundTo(buildTotalEngineeringWeeks)
      },
      schedule: {
        velocityFactor: roundTo(buildVelocity, 2),
        engineeringCalendarWeeks: roundTo(buildEngineeringCalendarWeeks),
        slipWeeks: roundTo(buildSlipWeeks),
        appRolloutOverheadWeeks: roundTo(buildAppRolloutOverheadWeeks),
        launchWeeks: roundTo(buildLaunchWeeks)
      },
      maintenance: {
        baseMaintenanceWeeks: roundTo(buildBaseMaintenanceWeeks),
        absorptionReductionWeeks: roundTo(
          buildAbsorptionReductionMaintenanceWeeks
        ),
        downsideTailAdditionWeeks: roundTo(
          buildDownsideTailMaintenanceAdditionWeeks
        ),
        maintenanceWeeks: roundTo(buildMaintenanceWeeks)
      },
      cost: {
        laborCostPerWeek: roundTo(laborCostPerWeek, 0),
        engineeringAndMaintenanceWeeks: roundTo(
          buildEngineeringAndMaintenanceWeeks
        ),
        laborCost: Math.round(buildLaborCost),
        licenseCost: 0,
        totalCost: Math.round(buildLaborCost)
      }
    },
    mui: {
      effort: {
        baseEngineeringWeeks: roundTo(muiBaseEngineeringWeeks),
        functionalRiskWeeks: roundTo(
          scorecard.functionalRisk *
            muiCalibration.engineeringMeanWeeks.functionalRisk
        ),
        qualityRiskWeeks: roundTo(
          scorecard.qualityRisk *
            muiCalibration.engineeringMeanWeeks.qualityRisk
        ),
        deliveryRiskWeeks: roundTo(
          scorecard.deliveryRisk *
            muiCalibration.engineeringMeanWeeks.deliveryRisk
        ),
        integrationRiskWeeks: roundTo(
          planFit.integrationRisk *
            muiCalibration.engineeringMeanWeeks.integrationRisk
        ),
        coverageGapWeeks: roundTo(
          planFit.coverageGap * muiCalibration.engineeringMeanWeeks.coverageGap
        ),
        supportGapWeeks: roundTo(
          planFit.supportGap * muiCalibration.engineeringMeanWeeks.supportGap
        ),
        coverageShieldReductionWeeks: roundTo(muiCoverageShieldReductionWeeks),
        preAdjustmentEngineeringWeeks: roundTo(
          muiPreAdjustmentEngineeringWeeks
        ),
        adoptionBurdenWeeks: roundTo(muiAdoptionBurdenWeeks),
        leverageReductionWeeks: roundTo(muiLeverageReductionWeeks),
        adjustedEngineeringWeeks: roundTo(muiAdjustedEngineeringWeeks),
        reworkAllowanceWeeks: roundTo(muiReworkAllowanceWeeks),
        totalEngineeringWeeks: roundTo(muiTotalEngineeringWeeks)
      },
      schedule: {
        velocityFactor: roundTo(muiVelocity, 2),
        engineeringCalendarWeeks: roundTo(muiEngineeringCalendarWeeks),
        slipWeeks: roundTo(muiSlipWeeks),
        appRolloutOverheadWeeks: roundTo(muiAppRolloutOverheadWeeks),
        launchWeeks: roundTo(muiLaunchWeeks)
      },
      maintenance: {
        baseMaintenanceWeeks: roundTo(muiBaseMaintenanceWeeks),
        integrationRiskWeeks: roundTo(
          planFit.integrationRisk *
            muiCalibration.maintenanceWeeks.integrationRisk *
            horizonYears
        ),
        coverageGapWeeks: roundTo(
          planFit.coverageGap *
            muiCalibration.maintenanceWeeks.coverageGap *
            horizonYears
        ),
        supportGapWeeks: roundTo(
          planFit.supportGap *
            muiCalibration.maintenanceWeeks.supportGap *
            horizonYears
        ),
        adoptionBurdenWeeks: roundTo(muiAdoptionMaintenanceWeeks),
        leverageReductionWeeks: roundTo(muiLeverageMaintenanceReductionWeeks),
        maintenanceWeeks: roundTo(muiMaintenanceWeeks)
      },
      cost: {
        laborCostPerWeek: roundTo(laborCostPerWeek, 0),
        engineeringAndMaintenanceWeeks: roundTo(
          muiEngineeringAndMaintenanceWeeks
        ),
        laborCost: Math.round(muiLaborCost),
        estimatedLicensedDevelopers,
        licenseCost: Math.round(muiLicenseCost),
        totalCost: Math.round(muiTotalCost)
      }
    }
  };
}

function runSimulation(input, scorecard) {
  const buildCalibration = SIMULATION_CALIBRATION.build;
  const muiCalibration = SIMULATION_CALIBRATION.mui;
  const simulationPrepCalibration = CALIBRATION.simulation.prep;
  const buildVelocityCalibration = CALIBRATION.simulation.velocity.build;
  const muiVelocityCalibration = CALIBRATION.simulation.velocity.mui;
  const frontendDeveloperVelocityCalibration =
    CALIBRATION.simulation.velocity.frontendDevelopers;
  const rng = createRng(
    JSON.stringify({
      ...input,
      advancedFeatures: [...input.advancedFeatures].sort(),
      effectiveMuiPlan: scorecard.effectiveMuiPlan,
      modelVersion: MODEL_VERSION
    })
  );
  const muiPlan = PLAN_CONFIG[scorecard.effectiveMuiPlan];
  const planFit = scorecard.effectivePlanFit;
  const estimatedLicensedDevelopers = estimateLicensedDevelopers(
    input,
    scorecard.effectiveMuiPlan
  );
  const horizonYears = input.maintenanceHorizonMonths / 12;
  // Engineer cost only feeds TCO through the weekly labor rate; it does not
  // affect launch time or effort.
  const laborCostPerWeek = input.engineerCostPerDay * 5;
  const rowScale = EXPECTED_ROWS_INDEX[input.expectedRows];
  const columnScale = EXPECTED_COLUMNS_INDEX[input.expectedColumns];
  const scaleDemand = rowScale + columnScale;
  const coverageStrength = clamp(planFit.coverageScore / 100, 0, 1);
  const coverageShield =
    coverageStrength >= simulationPrepCalibration.coverageShield.strongThreshold
      ? simulationPrepCalibration.coverageShield.strongValue
      : coverageStrength >=
          simulationPrepCalibration.coverageShield.mediumThreshold
        ? simulationPrepCalibration.coverageShield.mediumValue
        : simulationPrepCalibration.coverageShield.fallbackValue;
  const internalAbsorption = scorecard.internalAbsorption;
  const buildReuseLeverage = scorecard.buildReuseLeverage;
  const muiLeverage = scorecard.muiLeverage;
  const muiAdoptionBurden = scorecard.muiAdoptionBurden;
  const downsideTailRisk = scorecard.downsideTailRisk;
  const buildAbsorptionShield = clamp(
    internalAbsorption *
      simulationPrepCalibration.buildAbsorptionShield.internalAbsorption +
      buildReuseLeverage *
        simulationPrepCalibration.buildAbsorptionShield.buildReuseLeverage,
    simulationPrepCalibration.buildAbsorptionShield.minimum,
    simulationPrepCalibration.buildAbsorptionShield.maximum
  );
  const buildTailPenalty =
    downsideTailRisk >= simulationPrepCalibration.buildTailPenalty.threshold
      ? (downsideTailRisk -
          simulationPrepCalibration.buildTailPenalty.threshold) *
        simulationPrepCalibration.buildTailPenalty.multiplier
      : 0;
  const muiLeverageShield = clamp(
    muiLeverage * simulationPrepCalibration.muiLeverageShield.muiLeverage,
    simulationPrepCalibration.muiLeverageShield.minimum,
    simulationPrepCalibration.muiLeverageShield.maximum
  );
  const muiAdoptionLoad = clamp(
    muiAdoptionBurden *
      simulationPrepCalibration.muiAdoptionLoad.muiAdoptionBurden,
    simulationPrepCalibration.muiAdoptionLoad.minimum,
    simulationPrepCalibration.muiAdoptionLoad.maximum
  );
  const buildFatTailCalibration = buildCalibration.fatTail.build;
  const muiFatTailCalibration = buildCalibration.fatTail.mui;
  const buildFatTailExposure = clamp(
    downsideTailRisk *
      buildFatTailCalibration.exposureWeights.downsideTailRisk +
      (scorecard.deliveryRisk >=
      buildFatTailCalibration.exposureWeights.deliveryRiskThreshold
        ? buildFatTailCalibration.exposureWeights.deliveryRiskBonus
        : 0) +
      (scorecard.ownershipRisk >=
      buildFatTailCalibration.exposureWeights.ownershipRiskThreshold
        ? buildFatTailCalibration.exposureWeights.ownershipRiskBonus
        : 0) +
      (scaleDemand >= buildFatTailCalibration.exposureWeights.scaleDemandThreshold
        ? buildFatTailCalibration.exposureWeights.scaleDemandBonus
        : 0) -
      internalAbsorption *
        buildFatTailCalibration.exposureWeights.internalAbsorptionReduction,
    0,
    1
  );
  const muiFatTailExposure = clamp(
    (muiAdoptionBurden >=
    muiFatTailCalibration.exposureWeights.muiAdoptionBurdenThreshold
      ? muiAdoptionBurden *
        muiFatTailCalibration.exposureWeights.muiAdoptionBurdenMultiplier
      : 0) +
      (planFit.coverageGap >=
      muiFatTailCalibration.exposureWeights.coverageGapThreshold
        ? planFit.coverageGap *
          muiFatTailCalibration.exposureWeights.coverageGapMultiplier
        : 0) +
      (planFit.integrationRisk >=
      muiFatTailCalibration.exposureWeights.integrationRiskThreshold
        ? planFit.integrationRisk *
          muiFatTailCalibration.exposureWeights.integrationRiskMultiplier
        : 0) -
      muiLeverage * muiFatTailCalibration.exposureWeights.muiLeverageReduction,
    0,
    0.82
  );

  const buildDeveloperVelocityAdjustment = evaluateThresholdTable(
    input.frontendDevelopers,
    frontendDeveloperVelocityCalibration.build
  );
  const muiDeveloperVelocityAdjustment = evaluateThresholdTable(
    input.frontendDevelopers,
    frontendDeveloperVelocityCalibration.mui
  );

  const buildVelocity = clamp(
    buildVelocityCalibration.base +
      scorecard.deliveryStrength * buildVelocityCalibration.deliveryStrength -
      scorecard.ownershipRisk * buildVelocityCalibration.ownershipRisk +
      internalAbsorption * buildVelocityCalibration.internalAbsorption +
      buildDeveloperVelocityAdjustment,
    buildVelocityCalibration.minimum,
    buildVelocityCalibration.maximum
  );
  const muiVelocity = clamp(
    muiVelocityCalibration.base +
      scorecard.deliveryStrength * muiVelocityCalibration.deliveryStrength -
      scorecard.ownershipRisk * muiVelocityCalibration.ownershipRisk +
      muiLeverage * muiVelocityCalibration.muiLeverage -
      muiAdoptionBurden * muiVelocityCalibration.muiAdoptionBurden +
      muiDeveloperVelocityAdjustment,
    muiVelocityCalibration.minimum,
    muiVelocityCalibration.maximum
  );

  const buildLaunchWeeks = [];
  const buildEngineeringWeeks = [];
  const buildTco = [];
  const muiLaunchWeeks = [];
  const muiEngineeringWeeks = [];
  const muiTco = [];

  let muiFasterCount = 0;
  let muiLowerTcoCount = 0;
  let buildExceeds20WeeksCount = 0;
  let muiExceeds20WeeksCount = 0;

  for (let iteration = 0; iteration < ITERATIONS; iteration += 1) {
    const buildBaselineSampler = sampleBoundedMultiplier(rng, {
      deviation:
        buildFatTailCalibration.baselineDeviation +
        buildTailPenalty *
          buildCalibration.sampling.build.baselineTailPenaltyFactor,
      min: buildFatTailCalibration.baselineMin,
      max: buildFatTailCalibration.baselineMax
    });
    const muiBaselineSampler = sampleBoundedMultiplier(rng, {
      deviation:
        muiFatTailCalibration.baselineDeviation +
        muiAdoptionLoad *
          buildCalibration.sampling.mui.baselineAdoptionLoadFactor,
      min: muiFatTailCalibration.baselineMin,
      max: muiFatTailCalibration.baselineMax
    });
    const buildFatTailMultiplier = sampleCappedFatTailMultiplier(rng, {
      exposure: buildFatTailExposure,
      threshold: buildFatTailCalibration.threshold,
      probabilityCap: buildFatTailCalibration.probabilityCap,
      maxImpact: buildFatTailCalibration.maxImpact
    });
    const muiFatTailMultiplier = sampleCappedFatTailMultiplier(rng, {
      exposure: muiFatTailExposure,
      threshold: muiFatTailCalibration.threshold,
      probabilityCap: muiFatTailCalibration.probabilityCap,
      maxImpact: muiFatTailCalibration.maxImpact
    });
    const buildEngineeringMean =
      buildCalibration.engineeringMeanWeeks.base +
      scorecard.functionalRisk *
        buildCalibration.engineeringMeanWeeks.functionalRisk +
      scorecard.qualityRisk *
        buildCalibration.engineeringMeanWeeks.qualityRisk +
      scorecard.ownershipRisk *
        buildCalibration.engineeringMeanWeeks.ownershipRisk +
      scorecard.deliveryRisk *
        buildCalibration.engineeringMeanWeeks.deliveryRisk +
      scorecard.enterpriseNeed *
        buildCalibration.engineeringMeanWeeks.enterpriseNeed +
      (scaleDemand >= 5
        ? buildCalibration.engineeringMeanWeeks.largeScaleAdjustment
        : 0);
    const buildEngineeringMeanCalibrated = Math.max(
      buildCalibration.engineeringMeanWeeks.minimum,
      (buildEngineeringMean * (1 - buildAbsorptionShield) +
        downsideTailRisk *
          buildFatTailCalibration.downsideTailRiskMeanMultiplier) *
        buildBaselineSampler *
        buildFatTailMultiplier
    );
    const buildEngineeringVariance =
      buildCalibration.engineeringVariance.base +
      scorecard.functionalRisk *
        buildCalibration.engineeringVariance.functionalRisk +
      scorecard.qualityRisk * buildCalibration.engineeringVariance.qualityRisk +
      scorecard.ownershipRisk *
        buildCalibration.engineeringVariance.ownershipRisk +
      scorecard.deliveryRisk *
        buildCalibration.engineeringVariance.deliveryRisk;
    const buildEngineeringVarianceCalibrated = clamp(
      buildEngineeringVariance *
        (1 -
          buildAbsorptionShield *
            buildCalibration.engineeringVariance
              .absorptionShieldReductionFactor) +
        buildTailPenalty,
      buildCalibration.engineeringVariance.minimum,
      buildCalibration.engineeringVariance.maximum
    );
    const buildReworkMean =
      buildCalibration.reworkMeanWeeks.base +
      scorecard.functionalRisk *
        buildCalibration.reworkMeanWeeks.functionalRisk +
      scorecard.qualityRisk * buildCalibration.reworkMeanWeeks.qualityRisk +
      scorecard.ownershipRisk * buildCalibration.reworkMeanWeeks.ownershipRisk +
      scorecard.deliveryRisk * buildCalibration.reworkMeanWeeks.deliveryRisk +
      (scaleDemand >= 5
        ? buildCalibration.reworkMeanWeeks.largeScaleAdjustment
        : 0);
    const buildReworkMeanCalibrated = Math.max(
      buildCalibration.reworkMeanWeeks.minimum,
      (buildReworkMean *
        (1 -
          buildAbsorptionShield *
            buildCalibration.reworkMeanWeeks
              .absorptionShieldReductionFactor) +
        downsideTailRisk *
          buildCalibration.reworkMeanWeeks.downsideTailRiskAddition) *
        sampleBoundedMultiplier(rng, {
          deviation:
            buildFatTailCalibration.reworkDeviation +
            buildTailPenalty *
              buildCalibration.sampling.build.reworkTailPenaltyFactor,
          min: buildFatTailCalibration.reworkMin,
          max: buildFatTailCalibration.reworkMax
        }) *
        (1 + (buildFatTailMultiplier - 1) * buildFatTailCalibration.reworkBlend)
    );
    const buildRework = Math.max(
      0,
      randomNormal(
        rng,
        buildReworkMeanCalibrated,
        buildCalibration.sampling.build.reworkStdDevBase +
          scorecard.functionalRisk *
            buildCalibration.sampling.build.reworkStdDevFunctionalRisk +
          buildTailPenalty *
            buildCalibration.sampling.build.reworkStdDevTailPenalty -
          buildAbsorptionShield *
            buildCalibration.sampling.build.reworkStdDevAbsorptionReduction
      )
    );
    const buildEngineering = Math.max(
      buildCalibration.engineeringFloorWeeks,
      buildEngineeringMeanCalibrated *
        (1 + randomNormal(rng, 0, buildEngineeringVarianceCalibrated)) +
        buildRework
    );

    const buildSlipMean =
      buildCalibration.slipMeanWeeks.base +
      scorecard.deliveryRisk * buildCalibration.slipMeanWeeks.deliveryRisk +
      scorecard.functionalRisk * buildCalibration.slipMeanWeeks.functionalRisk +
      scorecard.qualityRisk * buildCalibration.slipMeanWeeks.qualityRisk +
      scorecard.ownershipRisk * buildCalibration.slipMeanWeeks.ownershipRisk +
      scorecard.enterpriseNeed * buildCalibration.slipMeanWeeks.enterpriseNeed +
      (scaleDemand >= 5
        ? buildCalibration.slipMeanWeeks.largeScaleAdjustment
        : 0);
    const buildSlipMeanCalibrated = Math.max(
      buildCalibration.slipMeanWeeks.minimum,
      (buildSlipMean *
        (1 -
          buildAbsorptionShield *
            buildCalibration.slipMeanWeeks
              .absorptionShieldReductionFactor) +
        buildTailPenalty * buildCalibration.slipMeanWeeks.tailPenaltyMultiplier) *
        sampleBoundedMultiplier(rng, {
          deviation:
            buildFatTailCalibration.slipDeviation +
            buildTailPenalty *
              buildCalibration.sampling.build.slipTailPenaltyFactor,
          min: buildFatTailCalibration.slipMin,
          max: buildFatTailCalibration.slipMax
        }) *
        (1 + (buildFatTailMultiplier - 1) * buildFatTailCalibration.slipBlend)
    );
    const buildSlip = Math.max(
      buildCalibration.slipFloorWeeks,
      randomNormal(
        rng,
        buildSlipMeanCalibrated,
        buildCalibration.sampling.build.slipStdDevBase +
          scorecard.deliveryRisk *
            buildCalibration.sampling.build.slipStdDevDeliveryRisk +
          buildTailPenalty *
            buildCalibration.sampling.build.slipStdDevTailPenalty -
          internalAbsorption *
            buildCalibration.sampling.build.slipStdDevAbsorptionReduction
      )
    );
    const buildLaunch = Math.max(
      buildCalibration.launch.minimumWeeks,
      buildEngineering / buildVelocity +
        buildSlip +
        scorecard.appScale * buildCalibration.launch.appScaleOverheadWeeks
    );

    const muiEngineeringMean =
      muiCalibration.engineeringMeanWeeks.base +
      scorecard.functionalRisk *
        muiCalibration.engineeringMeanWeeks.functionalRisk +
      scorecard.qualityRisk * muiCalibration.engineeringMeanWeeks.qualityRisk +
      scorecard.deliveryRisk *
        muiCalibration.engineeringMeanWeeks.deliveryRisk +
      planFit.integrationRisk *
        muiCalibration.engineeringMeanWeeks.integrationRisk +
      planFit.coverageGap * muiCalibration.engineeringMeanWeeks.coverageGap +
      planFit.supportGap * muiCalibration.engineeringMeanWeeks.supportGap -
      coverageShield *
        muiCalibration.engineeringMeanWeeks.coverageShieldReduction;
    const muiEngineeringMeanCalibrated = Math.max(
      muiCalibration.engineeringMeanWeeks.minimum,
      (muiEngineeringMean +
        muiCalibration.engineeringMeanWeeks.baseAdoptionOffset +
        muiAdoptionBurden * muiCalibration.engineeringMeanWeeks.adoptionBurden -
        muiLeverage * muiCalibration.engineeringMeanWeeks.leverageReduction -
        coverageShield *
          muiCalibration.engineeringMeanWeeks
            .coverageShieldAdditionalReduction) *
        muiBaselineSampler *
        muiFatTailMultiplier
    );
    const muiEngineeringVariance =
      muiCalibration.engineeringVariance.base +
      scorecard.functionalRisk *
        muiCalibration.engineeringVariance.functionalRisk +
      planFit.integrationRisk *
        muiCalibration.engineeringVariance.integrationRisk +
      planFit.coverageGap * muiCalibration.engineeringVariance.coverageGap -
      coverageShield *
        muiCalibration.engineeringVariance.coverageShieldReduction;
    const muiEngineeringVarianceCalibrated = clamp(
      muiEngineeringVariance +
        muiAdoptionBurden * muiCalibration.engineeringVariance.adoptionBurden -
        muiLeverageShield *
          muiCalibration.engineeringVariance.leverageShieldReduction,
      muiCalibration.engineeringVariance.minimum,
      muiCalibration.engineeringVariance.maximum
    );
    const muiReworkMean =
      muiCalibration.reworkMeanWeeks.base +
      planFit.coverageGap * muiCalibration.reworkMeanWeeks.coverageGap +
      planFit.integrationRisk * muiCalibration.reworkMeanWeeks.integrationRisk +
      scorecard.qualityRisk * muiCalibration.reworkMeanWeeks.qualityRisk +
      planFit.supportGap * muiCalibration.reworkMeanWeeks.supportGap -
      coverageShield * muiCalibration.reworkMeanWeeks.coverageShieldReduction;
    const muiReworkMeanCalibrated = Math.max(
      muiCalibration.reworkMeanWeeks.minimum,
      (muiReworkMean +
        muiAdoptionBurden * muiCalibration.reworkMeanWeeks.adoptionBurden -
        muiLeverage * muiCalibration.reworkMeanWeeks.leverageReduction -
        coverageShield *
          muiCalibration.reworkMeanWeeks.coverageShieldAdditionalReduction) *
        sampleBoundedMultiplier(rng, {
          deviation:
            muiFatTailCalibration.reworkDeviation +
            muiAdoptionLoad *
              buildCalibration.sampling.mui.reworkAdoptionLoadFactor,
          min: muiFatTailCalibration.reworkMin,
          max: muiFatTailCalibration.reworkMax
        }) *
        (1 + (muiFatTailMultiplier - 1) * muiFatTailCalibration.reworkBlend)
    );
    const muiRework = Math.max(
      0,
      randomNormal(
        rng,
        muiReworkMeanCalibrated,
        buildCalibration.sampling.mui.reworkStdDevBase +
          planFit.coverageGap *
            buildCalibration.sampling.mui.reworkStdDevCoverageGap +
          muiAdoptionLoad *
            buildCalibration.sampling.mui.reworkStdDevAdoptionLoad -
          muiLeverageShield *
            buildCalibration.sampling.mui.reworkStdDevLeverageShield
      )
    );
    const muiEngineering = Math.max(
      muiCalibration.engineeringFloorWeeks,
      muiEngineeringMeanCalibrated *
        (1 + randomNormal(rng, 0, muiEngineeringVarianceCalibrated)) +
        muiRework
    );

    const muiSlipMean =
      muiCalibration.slipMeanWeeks.base +
      scorecard.deliveryRisk * muiCalibration.slipMeanWeeks.deliveryRisk +
      planFit.coverageGap * muiCalibration.slipMeanWeeks.coverageGap +
      planFit.integrationRisk * muiCalibration.slipMeanWeeks.integrationRisk +
      planFit.supportGap * muiCalibration.slipMeanWeeks.supportGap -
      coverageShield * muiCalibration.slipMeanWeeks.coverageShieldReduction;
    const muiSlipMeanCalibrated = Math.max(
      muiCalibration.slipMeanWeeks.minimum,
      (muiSlipMean +
        muiAdoptionBurden * muiCalibration.slipMeanWeeks.adoptionBurden -
        muiLeverage * muiCalibration.slipMeanWeeks.leverageReduction -
        coverageShield *
          muiCalibration.slipMeanWeeks.coverageShieldAdditionalReduction) *
        sampleBoundedMultiplier(rng, {
          deviation:
            muiFatTailCalibration.slipDeviation +
            muiAdoptionLoad * buildCalibration.sampling.mui.slipAdoptionLoadFactor,
          min: muiFatTailCalibration.slipMin,
          max: muiFatTailCalibration.slipMax
        }) *
        (1 + (muiFatTailMultiplier - 1) * muiFatTailCalibration.slipBlend)
    );
    const muiSlip = Math.max(
      muiCalibration.slipFloorWeeks,
      randomNormal(
        rng,
        muiSlipMeanCalibrated,
        buildCalibration.sampling.mui.slipStdDevBase +
          planFit.coverageGap *
            buildCalibration.sampling.mui.slipStdDevCoverageGap +
          muiAdoptionLoad *
            buildCalibration.sampling.mui.slipStdDevAdoptionLoad -
          muiLeverageShield *
            buildCalibration.sampling.mui.slipStdDevLeverageShield
      )
    );
    const muiLaunch = Math.max(
      muiCalibration.launch.minimumWeeks,
      muiEngineering / muiVelocity +
        muiSlip +
        scorecard.appScale * muiCalibration.launch.appScaleOverheadWeeks
    );

    const buildMaintenanceBase =
      horizonYears *
      (buildCalibration.maintenanceWeeks.base +
        scorecard.functionalRisk *
          buildCalibration.maintenanceWeeks.functionalRisk +
        scorecard.qualityRisk * buildCalibration.maintenanceWeeks.qualityRisk +
        scorecard.ownershipRisk *
          buildCalibration.maintenanceWeeks.ownershipRisk +
        scorecard.deliveryRisk *
          buildCalibration.maintenanceWeeks.deliveryRisk +
        (scaleDemand >= 5
          ? buildCalibration.maintenanceWeeks.largeScaleAdjustment
          : 0));
    const buildMaintenanceBaseCalibrated = Math.max(
      buildCalibration.maintenanceWeeks.minimumBase,
      (buildMaintenanceBase *
        (1 -
          buildAbsorptionShield *
            buildCalibration.maintenanceWeeks
              .absorptionShieldReductionFactor) +
        downsideTailRisk *
          buildCalibration.maintenanceWeeks
            .downsideTailRiskHorizonMultiplier *
          horizonYears) *
        sampleBoundedMultiplier(rng, {
          deviation:
            buildFatTailCalibration.maintenanceDeviation +
            buildTailPenalty *
              buildCalibration.sampling.build.maintenanceTailPenaltyFactor,
          min: buildFatTailCalibration.maintenanceMin,
          max: buildFatTailCalibration.maintenanceMax
        }) *
        (1 + (buildFatTailMultiplier - 1) * buildFatTailCalibration.maintenanceBlend)
    );
    const buildMaintenance = Math.max(
      buildCalibration.maintenanceWeeks.minimum,
      buildMaintenanceBaseCalibrated *
        (1 +
          randomNormal(
            rng,
            0,
            buildCalibration.sampling.build.maintenanceStdDevBase +
              scorecard.ownershipRisk *
                buildCalibration.sampling.build
                  .maintenanceStdDevOwnershipRisk +
              buildTailPenalty *
                buildCalibration.sampling.build.maintenanceStdDevTailPenalty
          ))
    );

    const muiMaintenanceBase =
      horizonYears *
      (muiCalibration.maintenanceWeeks.base +
        scorecard.functionalRisk *
          muiCalibration.maintenanceWeeks.functionalRisk +
        scorecard.qualityRisk * muiCalibration.maintenanceWeeks.qualityRisk +
        planFit.integrationRisk *
          muiCalibration.maintenanceWeeks.integrationRisk +
        planFit.coverageGap * muiCalibration.maintenanceWeeks.coverageGap +
        planFit.supportGap * muiCalibration.maintenanceWeeks.supportGap -
        scorecard.muiUsage * muiCalibration.maintenanceWeeks.muiUsageReduction -
        coverageShield *
          muiCalibration.maintenanceWeeks.coverageShieldReduction);
    const muiMaintenanceBaseCalibrated = Math.max(
      muiCalibration.maintenanceWeeks.minimumBase,
      (muiMaintenanceBase +
        muiAdoptionBurden *
          muiCalibration.maintenanceWeeks.adoptionBurden *
          horizonYears -
        muiLeverage *
          muiCalibration.maintenanceWeeks.leverageReduction *
          horizonYears -
        coverageShield *
          muiCalibration.maintenanceWeeks.coverageShieldAdditionalReduction) *
        sampleBoundedMultiplier(rng, {
          deviation:
            muiFatTailCalibration.maintenanceDeviation +
            muiAdoptionLoad *
              buildCalibration.sampling.mui.maintenanceAdoptionLoadFactor,
          min: muiFatTailCalibration.maintenanceMin,
          max: muiFatTailCalibration.maintenanceMax
        }) *
        (1 + (muiFatTailMultiplier - 1) * muiFatTailCalibration.maintenanceBlend)
    );
    const muiMaintenance = Math.max(
      muiCalibration.maintenanceWeeks.minimum,
      muiMaintenanceBaseCalibrated *
        (1 +
          randomNormal(
            rng,
            0,
        buildCalibration.sampling.mui.maintenanceStdDevBase +
          planFit.coverageGap *
                buildCalibration.sampling.mui.maintenanceStdDevCoverageGap +
              muiAdoptionLoad *
                buildCalibration.sampling.mui.maintenanceStdDevAdoptionLoad -
              muiLeverageShield *
                buildCalibration.sampling.mui.maintenanceStdDevLeverageShield
          ))
    );

    const buildTotalCost =
      (buildEngineering + buildMaintenance) * laborCostPerWeek;
    const muiLicenseCost =
      muiPlan.licensePerDeveloperYear *
      estimatedLicensedDevelopers *
      horizonYears;
    const muiTotalCost =
      (muiEngineering + muiMaintenance) * laborCostPerWeek + muiLicenseCost;

    buildLaunchWeeks.push(buildLaunch);
    buildEngineeringWeeks.push(buildEngineering);
    buildTco.push(buildTotalCost);
    muiLaunchWeeks.push(muiLaunch);
    muiEngineeringWeeks.push(muiEngineering);
    muiTco.push(muiTotalCost);

    if (muiLaunch < buildLaunch) {
      muiFasterCount += 1;
    }

    if (muiTotalCost < buildTotalCost) {
      muiLowerTcoCount += 1;
    }

    if (buildLaunch > 20) {
      buildExceeds20WeeksCount += 1;
    }

    if (muiLaunch > 20) {
      muiExceeds20WeeksCount += 1;
    }
  }

  buildLaunchWeeks.sort((left, right) => left - right);
  buildEngineeringWeeks.sort((left, right) => left - right);
  buildTco.sort((left, right) => left - right);
  muiLaunchWeeks.sort((left, right) => left - right);
  muiEngineeringWeeks.sort((left, right) => left - right);
  muiTco.sort((left, right) => left - right);

  const buildPath = {
    label: "Build in-house",
    medianLaunchWeeks: roundTo(percentile(buildLaunchWeeks, 0.5)),
    p90LaunchWeeks: roundTo(percentile(buildLaunchWeeks, 0.9)),
    medianEngineeringWeeks: roundTo(percentile(buildEngineeringWeeks, 0.5)),
    p90EngineeringWeeks: roundTo(percentile(buildEngineeringWeeks, 0.9)),
    medianTco: integerCurrency(percentile(buildTco, 0.5)),
    p90Tco: integerCurrency(percentile(buildTco, 0.9))
  };

  const muiPath = {
    label: muiPlan.label,
    plan: muiPlan.key,
    medianLaunchWeeks: roundTo(percentile(muiLaunchWeeks, 0.5)),
    p90LaunchWeeks: roundTo(percentile(muiLaunchWeeks, 0.9)),
    medianEngineeringWeeks: roundTo(percentile(muiEngineeringWeeks, 0.5)),
    p90EngineeringWeeks: roundTo(percentile(muiEngineeringWeeks, 0.9)),
    medianTco: integerCurrency(percentile(muiTco, 0.5)),
    p90Tco: integerCurrency(percentile(muiTco, 0.9))
  };

  const comparison = {
    probabilityMuiFaster: percentage(muiFasterCount / ITERATIONS),
    probabilityMuiLowerTco: percentage(muiLowerTcoCount / ITERATIONS),
    probabilityBuildExceeds20Weeks: percentage(
      buildExceeds20WeeksCount / ITERATIONS
    ),
    probabilityMuiExceeds20Weeks: percentage(
      muiExceeds20WeeksCount / ITERATIONS
    ),
    launchWeekDeltaMedian: roundTo(
      muiPath.medianLaunchWeeks - buildPath.medianLaunchWeeks
    ),
    engineeringWeekDeltaMedian: roundTo(
      muiPath.medianEngineeringWeeks - buildPath.medianEngineeringWeeks
    ),
    tcoDeltaMedian: integerCurrency(muiPath.medianTco - buildPath.medianTco)
  };

  return {
    buildPath,
    muiPath,
    comparison,
    estimatedLicensedDevelopers,
    modelLevers: scorecard.scenarioLevers,
    riskLayer: {
      methodology: "conservative-capped-fat-tail-v1",
      buildFatTailExposure: roundTo(buildFatTailExposure, 2),
      muiFatTailExposure: roundTo(muiFatTailExposure, 2),
      buildTailImpactCap: roundTo(buildFatTailCalibration.maxImpact, 2),
      muiTailImpactCap: roundTo(muiFatTailCalibration.maxImpact, 2),
      sourceKeys: [
        "dora-metrics",
        "wcag-22",
        "aria-apg",
        "webdev-virtualization"
      ]
    }
  };
}

function buildRecommendation(input, scorecard, simulation) {
  const recommendationWeights = RECOMMENDATION_POLICY_WEIGHTS;
  const recommendationPolicy = CALIBRATION.recommendationPolicy;
  const pathScores = CALIBRATION.pathScores;
  const comparison = simulation.comparison;
  const selectedPlan = PLAN_CONFIG[scorecard.effectiveMuiPlan];
  const planFit = scorecard.effectivePlanFit;
  const internalAbsorption = scorecard.internalAbsorption;
  const deliveryRiskReduction =
    comparison.probabilityBuildExceeds20Weeks -
    comparison.probabilityMuiExceeds20Weeks;
  const muiDeliveryFavored =
    comparison.probabilityMuiFaster >=
      recommendationWeights.muiDeliveryFavoredProbability ||
    deliveryRiskReduction >= recommendationWeights.deliveryRiskReduction;
  const muiCostFavored =
    comparison.probabilityMuiLowerTco >=
    recommendationWeights.muiCostFavoredProbability;
  const packagedPathCostPenalty =
    comparison.probabilityMuiLowerTco <= 50 && comparison.tcoDeltaMedian >= 0;
  const deliveryOnlyMuiAdvantage =
    comparison.probabilityMuiFaster >=
      recommendationWeights.deliveryOnlyMuiAdvantageProbability &&
    comparison.launchWeekDeltaMedian < 0 &&
    (comparison.probabilityMuiLowerTco <
      recommendationPolicy.dominance.deliveryOnlyMuiAdvantage
        .minProbabilityLowerTco ||
      comparison.tcoDeltaMedian >
        recommendationPolicy.dominance.deliveryOnlyMuiAdvantage
          .maxTcoDeltaMedian);
  const buildStillCompetitive =
    simulation.buildPath.medianLaunchWeeks <=
      simulation.muiPath.medianLaunchWeeks +
        recommendationPolicy.buildCredibility.maxLaunchDisadvantageWeeks &&
    simulation.buildPath.medianTco <=
      simulation.muiPath.medianTco *
        (1 + recommendationPolicy.buildCredibility.maxTcoDisadvantageRatio);
  const nonSpeedMuiSignal =
    scorecard.muiAdoptionUseful ||
    scorecard.supportOrProcurementNeed ||
    input.dependentTeams !== "one" ||
    input.reactApps >= 2 ||
    (["shared-pattern", "platform-standard"].includes(
      input.componentStandardizationGoal
    ) &&
      (planFit.coverageScore >=
        recommendationPolicy.buildCredibility.minCoverageForNonCoreReuse ||
        input.existingMuiUsage !== "none")) ||
    (planFit.coverageScore >=
      recommendationPolicy.buildCredibility.minCoverageForStrongNonCoreSignal &&
      scorecard.buildCompetitiveIndex <
        recommendationPolicy.buildCredibility.minCompetitiveIndex);
  const muiDominatesSimulation =
    comparison.probabilityMuiFaster >=
      recommendationPolicy.dominance.mui.minProbabilityFaster &&
    comparison.probabilityMuiLowerTco >=
      recommendationPolicy.dominance.mui.minProbabilityLowerTco &&
    comparison.launchWeekDeltaMedian <
      recommendationPolicy.dominance.mui.maxLaunchWeekDeltaMedian &&
    comparison.tcoDeltaMedian <=
      recommendationPolicy.dominance.mui.maxTcoDeltaMedian;
  const buildDominatesSimulation =
    comparison.probabilityMuiFaster <=
      recommendationPolicy.dominance.build.maxProbabilityMuiFaster &&
    comparison.probabilityMuiLowerTco <=
      recommendationPolicy.dominance.build.maxProbabilityMuiLowerTco &&
    comparison.launchWeekDeltaMedian >=
      recommendationPolicy.dominance.build.minLaunchWeekDeltaMedian &&
    comparison.tcoDeltaMedian >=
      recommendationPolicy.dominance.build.minTcoDeltaMedian;
  const coreNeedsStrongerEvidence =
    recommendationPolicy.coreEvidence.buildFriendlyRequiresStrongerEvidence &&
    scorecard.effectiveMuiPlan === "core" &&
    input.existingMuiUsage === "none" &&
    input.dependentTeams === "one" &&
    input.reactApps === 1 &&
    input.supportRequirement === "community" &&
    scorecard.buildFriendlyContext;
  const coreMaterialAdvantage =
    muiCostFavored &&
    muiDeliveryFavored &&
    comparison.launchWeekDeltaMedian <=
      -recommendationPolicy.coreEvidence.minLaunchAdvantageWeeks;

  let option = "Build in-house";
  let summary =
    "The modeled tradeoff stays close enough that owning the component internally remains a credible option for this input set.";

  if (
    scorecard.effectiveMuiPlan === "core" &&
    input.designSystemMaturity === "high" &&
    input.ownershipModel === "same-product-team" &&
    input.knowledgeConcentration === "shared" &&
    input.designDevHandoffFriction === "low" &&
    ["shared-pattern", "platform-standard"].includes(
      input.componentStandardizationGoal
    ) &&
    input.existingMuiUsage === "none" &&
    scorecard.lowSupportNeed &&
    input.dependentTeams === "one" &&
    input.changeLeadTime === "less-than-day" &&
    input.reworkFrequency === "rare" &&
    input.deadlinePressure === "low" &&
    ["none", "wcag-a"].includes(input.accessibilityTarget)
  ) {
    // Policy config keeps the build-friendly exception explicit rather than
    // burying the thresholds inside the branch body.
    option = "Build in-house";
    summary =
      "High maturity, shared knowledge, low handoff friction, and a reusable-pattern goal keep the build path credible even with a core packaged comparison available.";
  } else if (muiDominatesSimulation) {
    option = selectedPlan.recommendationLabel;
    summary = `${selectedPlan.label} is both faster and lower in modeled total cost across the simulation, so the packaged path now has the stronger recommendation case. Build still remains credible only as a higher-control tradeoff, not the favored path.`;
  } else if (buildDominatesSimulation) {
    option = "Build in-house";
    summary =
      "The custom path is at least as fast and as cheap in the modeled distribution, so the recommendation should stay with building in-house.";
  } else if (
    scorecard.simpleScope &&
    scorecard.lowSupportNeed &&
    input.designSystemMaturity === "high" &&
    input.dependentTeams === "one" &&
    input.ownershipModel === "same-product-team" &&
    scorecard.buildCompetitiveIndex >=
      recommendationPolicy.buildCredibility.minCompetitiveIndex &&
    buildStillCompetitive
  ) {
    option = "Build in-house";
    summary =
      "The scope is controlled, support need is low, and the existing design-system baseline is strong enough that an internal build remains competitive.";
  } else if (
    deliveryOnlyMuiAdvantage &&
    internalAbsorption >=
      recommendationPolicy.buildCredibility
        .minInternalAbsorptionForBuildTradeoff &&
    scorecard.buildCompetitiveIndex >=
      recommendationPolicy.buildCredibility.minCompetitiveIndex &&
    !scorecard.enterpriseFitStrong
  ) {
    option = "Build in-house";
    summary = `${selectedPlan.label} is modeled to land sooner, but not to win clearly enough on total ownership cost. With strong internal absorption and build-friendly context, owning the component remains a credible recommendation with an explicit speed tradeoff.`;
  } else if (
    scorecard.enterpriseFitStrong &&
    scorecard.effectiveMuiPlan === "enterprise" &&
    (muiDeliveryFavored ||
      planFit.supportGap < pathScores.enterpriseEligibility.maxSupportGap)
  ) {
    option = "Enterprise";
    summary =
      "Enterprise support expectations are elevated and the modeled downside is meaningfully lower with the enterprise tier.";
  } else if (
    scorecard.effectiveMuiPlan === "premium" &&
    !scorecard.supportOrProcurementNeed &&
    (muiDeliveryFavored ||
      planFit.coverageScore >= pathScores.premiumEligibility.minCoverageScore ||
      nonSpeedMuiSignal)
  ) {
    option = "Premium";
    summary =
      "The workload is advanced enough to benefit from packaged component coverage, but it does not show strong enterprise procurement pressure.";
  } else if (
    scorecard.buildFriendlyContext &&
    !scorecard.enterpriseFitStrong &&
    scorecard.effectiveMuiPlan === "core"
  ) {
    option = "Build in-house";
    summary =
      deliveryOnlyMuiAdvantage || packagedPathCostPenalty
        ? "The inputs show strong internal ownership, mature delivery conditions, and low support pressure. The modeled MUI path may be faster, but it is not cost-favored enough to outweigh the current build-friendly context."
        : "The inputs show strong internal ownership, mature delivery conditions, and low support pressure. Even with the Core path modeled as the faster comparison option, the context is internally credible enough that building in-house remains the better recommendation.";
  } else if (
    scorecard.effectiveMuiPlan === "core" &&
    (muiDominatesSimulation || coreMaterialAdvantage) &&
    (!coreNeedsStrongerEvidence || muiDominatesSimulation)
  ) {
    option = "MUI Core";
    summary =
      coreNeedsStrongerEvidence && !muiDominatesSimulation
        ? "The Core path only clears the recommendation bar because it is materially faster and lower in modeled cost, not just because it is the default packaged comparison."
        : "The Core path is modeled to remove enough delivery and ownership work to justify the packaged recommendation here.";
  } else if (
    scorecard.buildCompetitiveIndex >=
      recommendationPolicy.buildCredibility.minStrongCompetitiveIndex &&
    !scorecard.enterpriseFitStrong &&
    scorecard.functionalRisk <
      recommendationPolicy.buildCredibility.maxFunctionalRisk &&
    buildStillCompetitive
  ) {
    option = "Build in-house";
    summary =
      "Even after factoring in delivery variance, the internal path remains competitive on both timing and total ownership cost.";
  } else if (
    !scorecard.buildFriendlyContext &&
    (muiDeliveryFavored || muiCostFavored) &&
    nonSpeedMuiSignal
  ) {
    option = selectedPlan.recommendationLabel;
    summary =
      "The simulation leans toward the selected MUI tier on delivery risk, cost, or both, so the packaged path is the safer default here.";
  }

  const isBuildRecommendation = option === "Build in-house";
  const deliverySupport = isBuildRecommendation
    ? 100 - comparison.probabilityMuiFaster
    : comparison.probabilityMuiFaster;
  const costSupport = isBuildRecommendation
    ? 100 - comparison.probabilityMuiLowerTco
    : comparison.probabilityMuiLowerTco;
  const ruleAlignment =
    (isBuildRecommendation
      ? scorecard.buildTierScore
      : scorecard[`${scorecard.effectiveMuiPlan}TierScore`]) / 100;
  const recommendationAligned =
    (isBuildRecommendation && buildDominatesSimulation) ||
    (!isBuildRecommendation && muiDominatesSimulation);
  const recommendationOpposed =
    (isBuildRecommendation && muiDominatesSimulation) ||
    (!isBuildRecommendation && buildDominatesSimulation);
  const confidenceBase =
    deliverySupport * 0.38 +
    costSupport * 0.28 +
    clamp(ruleAlignment * 100, 0, 100) * 0.18 +
    clamp(Math.abs(deliveryRiskReduction) * 2.2, 0, 100) * 0.08 +
    (recommendationAligned ? 10 : 0) -
    (recommendationOpposed ? 28 : 0) -
    (deliveryOnlyMuiAdvantage && isBuildRecommendation
      ? recommendationWeights.deliveryOnlyMuiAdvantagePenalty
      : 0) -
    (deliveryOnlyMuiAdvantage && !isBuildRecommendation && !muiCostFavored
      ? recommendationWeights.deliveryOnlyMuiAdvantageMuiPenalty
      : 0) -
    (coreNeedsStrongerEvidence &&
    option === "MUI Core" &&
    !muiDominatesSimulation
      ? recommendationWeights.coreNeedsStrongerEvidencePenalty
      : 0);
  const confidenceScore = clamp(
    Math.round(confidenceBase),
    recommendationOpposed
      ? recommendationPolicy.confidence.minOpposed
      : deliveryOnlyMuiAdvantage && isBuildRecommendation
        ? recommendationPolicy.confidence.minBuildWithDeliveryOnlyAdvantage
        : recommendationPolicy.confidence.minQualified,
    recommendationPolicy.confidence.max
  );

  return {
    recommendation: {
      option,
      summary
    },
    confidence: {
      score: confidenceScore,
      level:
        confidenceScore >= recommendationPolicy.confidence.high
          ? "high"
          : confidenceScore >= recommendationPolicy.confidence.medium
            ? "moderate"
            : "qualified",
      rationale:
        "Confidence reflects whether the selected recommendation is supported by the same-direction delivery and cost evidence, together with the rule-based fit scores. It is not a guarantee of outcome."
    },
    recommendationPolicyVersion: RECOMMENDATION_POLICY_VERSION
  };
}

function buildEvidenceBasis(input, scorecard) {
  return [
    {
      factor: "functionalComplexity",
      basis: "benchmark-informed",
      sourceKeys: ["cocomo-ii"],
      explanation:
        "Primary use case, expected row and column scale, data-heavy screens, performance sensitivity, and advanced features raise effort because component work expands scope, integration, and verification effort."
    },
    {
      factor: "qualityBurden",
      basis: "standard-backed",
      sourceKeys: ["nist-software-errors"],
      explanation:
        "Accessibility target, expected scale, performance sensitivity, design-dev handoff friction, i18n/localization, keyboard support, virtualization, custom rendering, and similar behaviors increase the verification burden because they expand defect exposure and rework cost."
    },
    {
      factor: "deliveryMaturity",
      basis: "benchmark-informed",
      sourceKeys: ["cocomo-ii", "isbsg"],
      explanation:
        "Change lead time, rework frequency, and deadline pressure are used as delivery health inputs because faster change cycles and less churn usually absorb work with less schedule variance."
    },
    {
      factor: "ownershipBurden",
      basis: "practice-backed",
      sourceKeys: ["cocomo-ii"],
      explanation:
        "Dependent teams, ownership model, React footprint, knowledge concentration, and design-system maturity shape long-term ownership cost because shared components create maintenance, rollout, and coordination obligations."
    },
    {
      factor: "enterpriseReadiness",
      basis: "benchmark-informed",
      sourceKeys: [],
      explanation:
        "Support expectations, maintenance horizon, production criticality, component standardization goals, existing MUI usage, and organizational footprint raise enterprise fit because vendor-backed procurement and response matter more in larger or longer-lived programs."
    },
    {
      factor: "implementationInterdependency",
      basis: "benchmark-informed",
      sourceKeys: ["flyvbjerg-it-overruns"],
      explanation:
        "Feature coupling, custom rendering, i18n/localization, and integration-heavy behavior create interdependency risk because large programs tend to accumulate downside from linked work streams."
    },
    {
      factor: `${PLAN_CONFIG[scorecard.effectiveMuiPlan].label} plan fit`,
      basis: "product-specific heuristic",
      sourceKeys: [],
      explanation: `The model estimates ${PLAN_CONFIG[scorecard.effectiveMuiPlan].label} fit from this payload's use case, feature demand, support need, and existing MUI usage.`
    },
    {
      factor: "recommendation synthesis",
      basis: "product-specific heuristic",
      sourceKeys: [],
      explanation: `The final recommendation combines the factor model with seeded scenario simulation instead of using a single threshold for ${input.primaryUseCase}.`
    }
  ];
}

function buildResult(input) {
  const derivedFactors = buildDerivedFactors(input);
  const scorecard = buildScorecard(input, derivedFactors);
  const simulation = runSimulation(input, scorecard);
  const recommendation = buildRecommendation(input, scorecard, simulation);
  const evidenceBasis = buildEvidenceBasis(input, scorecard);
  const estimateBreakdown = buildDeterministicEstimate(input, scorecard);
  const baseDeterministicResult = {
    scorecard,
    estimateBreakdown,
    buildLaunchWeeks: estimateBreakdown.build.schedule.launchWeeks,
    muiLaunchWeeks: estimateBreakdown.mui.schedule.launchWeeks,
    buildTco: estimateBreakdown.build.cost.totalCost,
    muiTco: estimateBreakdown.mui.cost.totalCost,
    tcoDelta:
      estimateBreakdown.mui.cost.totalCost -
      estimateBreakdown.build.cost.totalCost,
    buildTierScore: scorecard.buildTierScore,
    selectedMuiPlanScore: scorecard[`${scorecard.effectiveMuiPlan}TierScore`],
    confidence: buildDeterministicConfidence(scorecard, estimateBreakdown)
  };
  const sensitivity = buildSensitivityDiagnostics(
    input,
    baseDeterministicResult
  );

  const assumptions = [
    "The simulation uses 10,000 seeded iterations, so the same validated input returns the same result.",
    "TCO includes internal engineering labor and estimated MUI licensing, but excludes revenue effects, non-component migration work, and negotiated vendor discounts.",
    "Launch weeks represent modeled delivery timing under the stated capacity and risk inputs, not guaranteed calendar commitments.",
    `The comparison internally models ${PLAN_CONFIG[scorecard.effectiveMuiPlan].label} as the best-fit MUI path for these requirements.`,
    `Estimated license exposure for the modeled MUI path is ${simulation.estimatedLicensedDevelopers} developer seat${simulation.estimatedLicensedDevelopers === 1 ? "" : "s"}.`
  ];

  assumptions.push(
    "Public sources inform variable selection and risk-shape choices; they are not used as exact licensed benchmark parameters."
  );
  assumptions.push(
    "Numerical outputs are scenario estimates based on user input and transparent heuristics."
  );
  assumptions.push(
    `The latest model version is benchmark-informed-v5 and the active recommendation policy is ${RECOMMENDATION_POLICY_VERSION}. Older saved reports may not reflect the current input schema.`
  );

  return {
    ...recommendation,
    modelVersion: MODEL_VERSION,
    calibrationVersion: CALIBRATION_VERSION,
    recommendationPolicyVersion: RECOMMENDATION_POLICY_VERSION,
    publicSources: PUBLIC_BENCHMARK_SOURCES,
    derivedFactors,
    evidenceBasis,
    modeledMuiPathFit: {
      label: PLAN_CONFIG[scorecard.effectiveMuiPlan].label,
      plan: scorecard.effectiveMuiPlan,
      coverageScore: roundTo(scorecard.effectivePlanFit.coverageScore),
      coverageGap: roundTo(scorecard.effectivePlanFit.coverageGap),
      supportGap: roundTo(scorecard.effectivePlanFit.supportGap),
      integrationRisk: roundTo(scorecard.effectivePlanFit.integrationRisk)
    },
    icpFit: {
      score: roundTo(scorecard.icpScore),
      segment: scorecard.icpFitSegment,
      effectiveMuiPlan: scorecard.effectiveMuiPlan,
      autoSelectedMuiPlan: scorecard.autoSelectedMuiPlan,
      tierScores: {
        enterprise: roundTo(scorecard.enterpriseTierScore),
        premium: roundTo(scorecard.premiumTierScore),
        core: roundTo(scorecard.coreTierScore),
        build: roundTo(scorecard.buildTierScore)
      },
      reasons: scorecard.icpReasons
    },
    buildPath: simulation.buildPath,
    muiPath: simulation.muiPath,
    comparison: simulation.comparison,
    modelLevers: simulation.modelLevers,
    riskLayer: simulation.riskLayer,
    diagnostics: {
      estimateBreakdown,
      sensitivity
    },
    sensitivity,
    assumptions
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
      body: JSON.stringify({
        error: "Method not allowed."
      })
    };
  }

  const parsedBody = parseJsonBody(event);

  if (parsedBody.error) {
    return badRequest(parsedBody.error);
  }

  const normalized = normalizeInput(parsedBody.value);
  const { errors } = validatePayload(normalized, parsedBody.value);

  if (errors.length > 0) {
    return badRequest("Invalid assessment input.", errors);
  }

  return jsonResponse(200, buildResult(normalized));
};
