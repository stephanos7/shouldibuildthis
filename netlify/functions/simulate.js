import { PUBLIC_BENCHMARK_SOURCES } from "../../src/data/publicSources.js";

const ITERATIONS = 10000;
const MODEL_VERSION = "benchmark-informed-v3";

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
  "timezone-logic"
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
  "timezone-logic": 0.9
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
    licensePerDeveloperYear: 0,
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
    licensePerDeveloperYear: 1800,
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
    licensePerDeveloperYear: 3600,
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
  { exposure = 0, threshold = 0.58, probabilityCap = 0.16, maxImpact = 0.18 } = {}
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
    reworkFrequency: payload.reworkFrequency,
    deadlinePressure: payload.deadlinePressure,
    maintenanceHorizonMonths: Number(payload.maintenanceHorizonMonths),
    supportRequirement: payload.supportRequirement,
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
  const reworkFrequency = REWORK_FREQUENCY_INDEX[input.reworkFrequency];
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
        "timezone-logic": "timezone logic"
      };

      return labels[feature] ?? feature;
    })
  );
  const accessibilityTargetLabel = {
    none: "No formal accessibility target was selected, so the model does not add WCAG-specific verification burden.",
    "wcag-a": "The WCAG A target adds accessibility verification burden because the implementation still needs formal keyboard and interaction checks.",
    "wcag-aa": "The WCAG AA target adds accessibility verification burden because the implementation needs broader keyboard, focus, and semantic validation.",
    "wcag-aaa-regulated": "The WCAG AAA / regulated target adds heavier accessibility verification burden because the implementation needs stricter compliance checks."
  }[input.accessibilityTarget];
  const changeLeadTimeLabel = {
    "less-than-day": "Less-than-day change lead time indicates strong delivery flow.",
    "one-day-to-one-week": "One-day-to-one-week change lead time indicates healthy delivery flow with some release coordination.",
    "one-week-to-one-month": "One-week-to-one-month change lead time indicates slower delivery flow and more schedule variance.",
    "more-than-month": "More-than-month change lead time indicates a slow delivery cadence and a wider uncertainty band.",
    unknown: "Unknown change lead time widens the delivery uncertainty band."
  }[input.changeLeadTime];
  const reworkLabel = {
    rare: "Rare rework suggests the team usually absorbs changes without heavy churn.",
    occasional: "Occasional rework suggests the team can absorb changes, but with some churn.",
    frequent: "Frequent rework suggests the team is likely to spend more time revisiting prior decisions.",
    unknown: "Unknown rework frequency widens the delivery uncertainty band."
  }[input.reworkFrequency];
  const deadlinePressureLabel = {
    low: "Low deadline pressure reduces schedule-compression risk.",
    medium: "Medium deadline pressure leaves some schedule compression risk in play.",
    high: "High deadline pressure increases schedule-compression risk."
  }[input.deadlinePressure];
  const ownershipLeadLabel = {
    one: "One dependent team and same-product-team ownership keep coordination load low.",
    "two-three": "Two to three dependent teams and the current ownership model keep coordination load manageable but no longer trivial.",
    "four-seven": "Four to seven dependent teams and the current ownership model raise coordination load.",
    "eight-plus": "Eight or more dependent teams make coordination load high unless ownership is very tightly managed."
  }[input.dependentTeams];
  const dependentTeamLabel = {
    one: "one dependent team",
    "two-three": "two to three dependent teams",
    "four-seven": "four to seven dependent teams",
    "eight-plus": "eight or more dependent teams"
  }[input.dependentTeams];
  const appSurfaceLabel = {
    1: "One React app keeps the rollout and maintenance surface contained.",
    2: "Two React apps broaden the rollout and maintenance surface.",
    3: "Three React apps broaden the rollout and maintenance surface further.",
    4: "Four React apps make the rollout and maintenance surface substantial.",
    5: "Five React apps make the rollout and maintenance surface broad.",
    6: "Six React apps make the rollout and maintenance surface broad.",
    7: "Seven React apps make the rollout and maintenance surface broad.",
    8: "Eight or more React apps make the rollout and maintenance surface wide."
  }[Math.min(input.reactApps, 8)] ?? `${countLabel(input.reactApps, "React app")} widen the rollout and maintenance surface.`;
  const developerCapacityLabel = `${countLabel(input.frontendDevelopers, "frontend developer")} ${
    input.frontendDevelopers === 1 ? "increases" : "increase"
  } internal capacity for build and maintenance.`;
  const maturityLabel = {
    low: "Low UI/platform maturity leaves more shared groundwork to establish.",
    medium: "Medium UI/platform maturity provides some shared patterns, but not enough to remove ownership burden.",
    high: "High UI/platform maturity reduces ownership burden because shared patterns and groundwork already exist."
  }[input.designSystemMaturity];
  const scaleLabel = rowsUnder1k && columnsUnder10
    ? "Small data volume keeps the complexity contained: under 1k rows and under 10 columns."
    : `Expected volume sits in the ${input.expectedRows} row band and the ${input.expectedColumns} column band, which expands the component surface as scale rises.`;
  const functionalFeatureLabel = noAdvancedBehaviors
    ? "No advanced behaviors were selected, so the model does not add extra interaction or data-state complexity."
    : `Selected advanced behaviors (${selectedAdvancedBehaviors}) expand interaction, state, and integration complexity.`;
  const qualityScaleLabel = rowsUnder1k && columnsUnder10
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
    functionalFeatureLabel
  ];

  if (screenLoad > 0) {
    functionalDrivers.push(
      `${countLabel(screenLoad, "data-heavy screen")} ${
        screenLoad === 1 ? "adds" : "add"
      } state and edge-case pressure.`
    );
  }

  const functionalComplexity = buildFactor(
    useCaseComplexity * 11.5 +
      featureWeight * 8.9 +
      screenLoad * 2.6 +
      rowScale * 5.2 +
      columnScale * 4.6 +
      (input.primaryUseCase === "data-grid" ? rowScale * 2.4 : 0) +
      (input.primaryUseCase === "scheduler" ? columnScale * 1.9 : 0),
    functionalDrivers
  );

  const qualityDrivers = [
    accessibilityTargetLabel,
    qualityScaleLabel,
    qualityFeatureLabel
  ];

  const qualityBurden = buildFactor(
    accessibilityTarget * 18 +
      rowScale * 8.5 +
      columnScale * 7.5 +
      (input.advancedFeatures.includes("keyboard-navigation") ? 11 : 0) +
      (input.advancedFeatures.includes("virtualization") ? 13 : 0) +
      (input.advancedFeatures.includes("custom-rendering") ? 12 : 0) +
      (input.advancedFeatures.includes("server-side-data") ? 10 : 0) +
      (input.advancedFeatures.includes("timezone-logic") ? 7 : 0) +
      (input.advancedFeatures.includes("drag-and-drop") ? 6 : 0),
    qualityDrivers
  );

  const deliveryDrivers = [
    changeLeadTimeLabel,
    reworkLabel,
    deadlinePressureLabel
  ];

  const deliveryMaturity = buildFactor(
    28 +
      changeLeadTime * 12.5 +
      reworkFrequency * 11 +
      { low: 16, medium: 4, high: -12 }[input.deadlinePressure],
    deliveryDrivers
  );

  const ownershipDrivers = [
    ownershipLeadLabel,
    appSurfaceLabel,
    developerCapacityLabel,
    maturityLabel
  ];

  const ownershipBurden = buildFactor(
    12 +
      dependentTeams * 7.5 +
      ownershipModel * 6.5 +
      Math.min(input.reactApps, 8) * 3.5 +
      { low: 12, medium: 7, high: 0 }[input.designSystemMaturity],
    ownershipDrivers
  );

  const enterpriseDrivers = [
    `${input.supportRequirement} support expectations drive the need for vendor-backed response and procurement paths.`,
    `${input.maintenanceHorizonMonths} months of planned maintenance raises the value of durable support and upgrades.`,
    `${dependentTeamLabel} and ${countLabel(input.reactApps, "React app")} define the rollout footprint.`
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
    { community: 14, standard: 30, priority: 54, "procurement-sla": 72 }[
      input.supportRequirement
    ] +
      Math.min(input.reactApps, 6) * 4 +
      Math.min(input.frontendDevelopers, 10) * 2.5 +
      dependentTeams * 4 +
      muiUsage * 8 +
      { 12: 6, 24: 12, 36: 18 }[input.maintenanceHorizonMonths],
    enterpriseDrivers
  );

  return {
    functionalComplexity,
    qualityBurden,
    deliveryMaturity,
    ownershipBurden,
    enterpriseReadiness
  };
}

function buildPlanFit(planKey, input, derivedFactors) {
  const plan = PLAN_CONFIG[planKey];
  const featureDemand = input.advancedFeatures.reduce(
    (sum, feature) => sum + ADVANCED_FEATURE_WEIGHTS[feature],
    0
  );
  const useCaseCoverage = plan.useCaseCoverage[input.primaryUseCase];
  const rowScale = EXPECTED_ROWS_INDEX[input.expectedRows];
  const columnScale = EXPECTED_COLUMNS_INDEX[input.expectedColumns];
  const scaleDemand = rowScale * 0.85 + columnScale * 0.65;
  const planScaleCapacity = { core: 1.6, premium: 2.6, enterprise: 3.2 }[
    planKey
  ];
  const featureCoverage = clamp(
    1 - Math.max(0, featureDemand - plan.featureCapacity) / 5.2,
    0.18,
    1
  );
  const scaleCoverage = clamp(
    1 - Math.max(0, scaleDemand - planScaleCapacity) / 2.2,
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
        3.2,
    0.15,
    1
  );
  const qualityFit = clamp(
    1 -
      Math.max(
        0,
        derivedFactors.qualityBurden.score / 100 -
          (planKey === "core" ? 0.42 : planKey === "premium" ? 0.68 : 0.8)
      ) *
        1.1,
    0.2,
    1
  );

  const coverageScore = clamp(
    (useCaseCoverage * 0.34 +
      featureCoverage * 0.23 +
      scaleCoverage * 0.17 +
      supportFit * 0.14 +
      qualityFit * 0.1 +
      adoptionBoost) *
      100,
    0,
    100
  );
  const coverageGap = clamp(1 - coverageScore / 100, 0, 1);
  const baseIntegrationRisk = clamp(
    { none: 0.52, some: 0.28, standardized: 0.14 }[input.existingMuiUsage] +
      (input.advancedFeatures.includes("custom-rendering") ? 0.11 : 0) +
      (input.advancedFeatures.includes("drag-and-drop") ? 0.07 : 0) +
      (input.advancedFeatures.includes("timezone-logic") ? 0.06 : 0) +
      (rowScale >= 3 ? 0.06 : 0) +
      (columnScale >= 3 ? 0.04 : 0) +
      (planKey === "core" ? 0.05 : 0),
    0.08,
    0.92
  );
  const integrationRisk = clamp(
    baseIntegrationRisk * (1 - (coverageScore / 100) * 0.48),
    0.05,
    0.82
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
  const teamScale = bucket(input.frontendDevelopers, 3, 8);
  const appScale = bucket(input.reactApps, 1, 4);

  const planFits = {
    core: buildPlanFit("core", input, derivedFactors),
    premium: buildPlanFit("premium", input, derivedFactors),
    enterprise: buildPlanFit("enterprise", input, derivedFactors)
  };

  const buildTierScore = clamp(
    88 -
      functionalRisk * 41 -
      qualityRisk * 29 -
      ownershipRisk * 23 -
      deliveryRisk * 24 +
      (maturity - 2) * 6 -
      supportNeed * 6 -
      (rowScale >= 3 ? 5 : 0) -
      (columnScale >= 3 ? 4 : 0),
    0,
    100
  );

  const simpleScope =
    functionalRisk <= 0.38 &&
    qualityRisk <= 0.38 &&
    input.advancedFeatures.length <= 2 &&
    input.dataHeavyScreens <= 3 &&
    rowScale <= 2 &&
    columnScale <= 2;
  const coreTierScore = clamp(
    26 +
      planFits.core.coverageScore * 0.46 +
      (simpleScope ? 18 : 0) +
      muiUsage * 8 -
      functionalRisk * 12 -
      qualityRisk * 8 -
      Math.max(0, enterpriseNeed - 0.45) * 24,
    0,
    100
  );

  const premiumTierScore = clamp(
    18 +
      planFits.premium.coverageScore * 0.42 +
      functionalRisk * 12 +
      qualityRisk * 10 +
      muiUsage * 5 -
      (simpleScope ? 18 : 0) -
      Math.max(0, enterpriseNeed - 0.72) * 14,
    0,
    100
  );

  const enterpriseTierScore = clamp(
    8 +
      planFits.enterprise.coverageScore * 0.32 +
      enterpriseNeed * 34 +
      supportNeed * 9 +
      appScale * 4 +
      teamScale * 3 -
      dependentTeams * 1.5 -
      (simpleScope ? 10 : 0),
    0,
    100
  );

  const icpScore = clamp(
    12 +
      functionalRisk * 22 +
      qualityRisk * 12 +
      ownershipRisk * 14 +
      enterpriseNeed * 24 +
      muiUsage * 4 +
      appScale * 3 +
      teamScale * 3 +
      dependentTeams * 2 -
      (simpleScope ? 6 : 0),
    0,
    100
  );
  const enterpriseFitStrong = enterpriseNeed >= 0.68 && supportNeed >= 2;
  const lowSupportNeed = supportNeed <= 1;
  const supportOrProcurementNeed = supportNeed >= 2;
  const muiAdoptionUseful = muiUsage > 0 || input.reactApps >= 2;
  const buildFriendlyContext =
    lowSupportNeed &&
    input.designSystemMaturity === "high" &&
    input.dependentTeams === "one" &&
    input.ownershipModel === "same-product-team" &&
    input.changeLeadTime === "less-than-day" &&
    input.reworkFrequency === "rare" &&
    input.deadlinePressure === "low" &&
    rowScale <= 2 &&
    columnScale <= 2 &&
    input.advancedFeatures.length === 0 &&
    ["none", "wcag-a"].includes(input.accessibilityTarget);

  let autoSelectedMuiPlan = "core";

  if (
    enterpriseFitStrong &&
    enterpriseTierScore >= 78 &&
    planFits.enterprise.coverageScore >= 66
  ) {
    autoSelectedMuiPlan = "enterprise";
  } else if (
    planFits.premium.coverageScore >= 62 &&
    !(simpleScope && supportNeed <= 1) &&
    (functionalRisk >= 0.62 ||
      qualityRisk >= 0.56 ||
      rowScale >= 3 ||
      columnScale >= 3 ||
      input.advancedFeatures.length >= 4)
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
  });
  const buildCompetitiveIndex = clamp(
    100 -
      functionalRisk * 36 -
      qualityRisk * 22 -
      ownershipRisk * 22 -
      deliveryRisk * 20 +
      (maturity - 1) * 6 -
      supportNeed * 7,
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
  const planFit = scorecard.effectivePlanFit;
  const featureCount = input.advancedFeatures.length;
  const rowScale = EXPECTED_ROWS_INDEX[input.expectedRows];
  const columnScale = EXPECTED_COLUMNS_INDEX[input.expectedColumns];
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

  const internalAbsorption = buildLever(
    scorecard.deliveryStrength * 0.28 +
      maturityStrength * 0.18 +
      ownershipClarity * 0.18 +
      teamFocus * 0.13 +
      reworkStability * 0.1 +
      deadlineSlack * 0.08 +
      supportLightness * 0.03 +
      appFocus * 0.02,
    [
      `${input.changeLeadTime} lead time, ${input.reworkFrequency} rework, and ${input.deadlinePressure} pressure set the delivery absorption baseline.`,
      `${input.designSystemMaturity} design-system maturity and ${input.ownershipModel} ownership determine how much custom work the team can absorb cleanly.`,
      `${input.dependentTeams} dependent teams and ${input.reactApps} React app${input.reactApps === 1 ? "" : "s"} limit how much coordination drag the build path has to carry.`
    ]
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
  const buildReuseLeverage = buildLever(
    maturityStrength * 0.28 +
      ownershipClarity * 0.16 +
      teamFocus * 0.1 +
      scopeSimplicity * 0.26 +
      clamp(1 - featureCount / 7, 0.18, 1) * 0.1 +
      clamp(1 - (rowScale + columnScale - 2) / 5, 0.18, 1) * 0.1 +
      buildReuseBonus,
    [
      `${input.designSystemMaturity} design-system maturity and ${input.ownershipModel} ownership determine how much prior UI investment can be reused.`,
      `${input.existingMuiUsage} MUI usage ${input.existingMuiUsage === "standardized" ? "reduces build-side reuse leverage because packaged standards already exist" : "keeps more room for internal reuse to matter on the build path"}.`,
      `${input.primaryUseCase}, ${featureCount} advanced feature${featureCount === 1 ? "" : "s"}, and the ${input.expectedRows}/${input.expectedColumns} scale profile still limit how much reuse can offset complexity.`
    ]
  );

  const muiLeverage = buildLever(
    clamp(planFit.coverageScore / 100, 0, 1) * 0.42 +
      clamp(1 - planFit.coverageGap, 0, 1) * 0.2 +
      clamp(1 - planFit.supportGap, 0, 1) * 0.14 +
      { none: 0.22, some: 0.58, standardized: 1 }[input.existingMuiUsage] *
        0.12 +
      packagedAffinity * 0.07 +
      clamp(featureCount / 6, 0.08, 1) * 0.05,
    [
      `${PLAN_CONFIG[scorecard.effectiveMuiPlan].label} coverage is ${roundTo(planFit.coverageScore)}/100, which sets the main packaged leverage baseline.`,
      `${input.existingMuiUsage} MUI usage and ${input.primaryUseCase} determine how much implementation work the packaged path can realistically absorb.`,
      `${featureCount} advanced feature${featureCount === 1 ? "" : "s"} and the remaining coverage/support gaps limit leverage when fit is incomplete.`
    ]
  );

  const muiAdoptionBurden = buildLever(
    { none: 0.34, some: 0.16, standardized: 0.05 }[input.existingMuiUsage] +
      (input.existingMuiUsage === "none" &&
      input.designSystemMaturity === "high"
        ? 0.1
        : input.existingMuiUsage === "none" &&
            input.designSystemMaturity === "medium"
          ? 0.05
          : 0) +
      {
        "same-product-team": 0.05,
        "frontend-platform-team": 0.09,
        "several-teams-informal": 0.13,
        unclear: 0.15
      }[input.ownershipModel] +
      (input.advancedFeatures.includes("custom-rendering") ? 0.1 : 0) +
      (input.advancedFeatures.includes("drag-and-drop") ? 0.08 : 0) +
      (input.advancedFeatures.includes("timezone-logic") ? 0.06 : 0) +
      planFit.coverageGap * 0.12,
    [
      `${input.existingMuiUsage} current MUI usage sets the base adoption burden.`,
      `${input.designSystemMaturity} design-system maturity ${input.existingMuiUsage === "none" && input.designSystemMaturity === "high" ? "adds modest adaptation work because existing internal patterns still need to be preserved" : "changes how much theming and adaptation work remains"}.`,
      `${["custom-rendering", "drag-and-drop", "timezone-logic"].filter((feature) => input.advancedFeatures.includes(feature)).join(", ") || "No major customization-heavy features"} affect how much integration work the packaged path still carries.`
    ]
  );

  const downsideTailRisk = buildLever(
    scorecard.ownershipRisk * 0.22 +
      scorecard.deliveryRisk * 0.2 +
      scorecard.qualityRisk * 0.17 +
      scorecard.functionalRisk * 0.16 +
      {
        one: 0.12,
        "two-three": 0.32,
        "four-seven": 0.58,
        "eight-plus": 0.78
      }[input.dependentTeams] *
        0.08 +
      clamp(input.reactApps / 5, 0.08, 1) * 0.04 +
      { none: 0.08, "wcag-a": 0.18, "wcag-aa": 0.38, "wcag-aaa-regulated": 0.62 }[
        input.accessibilityTarget
      ] *
        0.04 +
      clamp(featureCount / 6, 0, 1) * 0.03 +
      clamp((rowScale + columnScale - 2) / 5, 0, 1) * 0.03 +
      { low: 0.08, medium: 0.36, high: 0.72 }[input.deadlinePressure] * 0.03,
    [
      `Functional, quality, delivery, and ownership risk still dominate the downside tail in the model.`,
      `${input.dependentTeams} dependent teams, ${input.reactApps} React app${input.reactApps === 1 ? "" : "s"}, and ${input.accessibilityTarget} accessibility increase long-tail coordination and QA exposure.`,
      `${featureCount} advanced feature${featureCount === 1 ? "" : "s"}, ${input.expectedRows}/${input.expectedColumns} scale, and ${input.deadlinePressure} deadline pressure determine whether variance should widen materially.`
    ]
  );

  return {
    internalAbsorption,
    buildReuseLeverage,
    muiLeverage,
    muiAdoptionBurden,
    downsideTailRisk
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

function runSimulation(input, scorecard) {
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
  const laborCostPerWeek = input.engineerCostPerDay * 5;
  const rowScale = EXPECTED_ROWS_INDEX[input.expectedRows];
  const columnScale = EXPECTED_COLUMNS_INDEX[input.expectedColumns];
  const scaleDemand = rowScale + columnScale;
  const coverageStrength = clamp(planFit.coverageScore / 100, 0, 1);
  const coverageShield =
    coverageStrength >= 0.72 ? 0.14 : coverageStrength >= 0.58 ? 0.08 : 0;
  const internalAbsorption = scorecard.internalAbsorption;
  const buildReuseLeverage = scorecard.buildReuseLeverage;
  const muiLeverage = scorecard.muiLeverage;
  const muiAdoptionBurden = scorecard.muiAdoptionBurden;
  const downsideTailRisk = scorecard.downsideTailRisk;
  const buildAbsorptionShield = clamp(
    internalAbsorption * 0.18 + buildReuseLeverage * 0.12,
    0,
    0.24
  );
  const buildTailPenalty =
    downsideTailRisk >= 0.45 ? (downsideTailRisk - 0.45) * 0.22 : 0;
  const muiLeverageShield = clamp(muiLeverage * 0.22, 0, 0.18);
  const muiAdoptionLoad = clamp(muiAdoptionBurden * 0.26, 0.02, 0.18);
  const buildFatTailExposure = clamp(
    downsideTailRisk * 0.82 +
      (scorecard.deliveryRisk >= 0.45 ? 0.06 : 0) +
      (scorecard.ownershipRisk >= 0.55 ? 0.05 : 0) +
      (scaleDemand >= 5 ? 0.04 : 0) -
      internalAbsorption * 0.1,
    0,
    1
  );
  const muiFatTailExposure = clamp(
    (muiAdoptionBurden >= 0.42 ? muiAdoptionBurden * 0.58 : 0) +
      (planFit.coverageGap >= 0.28 ? planFit.coverageGap * 0.34 : 0) +
      (planFit.integrationRisk >= 0.42 ? planFit.integrationRisk * 0.28 : 0) -
      muiLeverage * 0.08,
    0,
    0.82
  );

  const buildVelocity = clamp(
    0.84 +
      scorecard.deliveryStrength * 0.36 -
      scorecard.ownershipRisk * 0.06 +
      internalAbsorption * 0.08 +
      (input.frontendDevelopers >= 8
        ? 0.08
        : input.frontendDevelopers >= 4
          ? 0.03
          : -0.03),
    0.58,
    1.32
  );
  const muiVelocity = clamp(
    0.96 +
      scorecard.deliveryStrength * 0.18 -
      scorecard.ownershipRisk * 0.03 +
      muiLeverage * 0.06 -
      muiAdoptionBurden * 0.04 +
      (input.frontendDevelopers >= 8
        ? 0.06
        : input.frontendDevelopers >= 4
          ? 0.02
          : -0.01),
    0.72,
    1.4
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
      deviation: 0.024 + buildTailPenalty * 0.1,
      min: 0.95,
      max: 1.07
    });
    const muiBaselineSampler = sampleBoundedMultiplier(rng, {
      deviation: 0.02 + muiAdoptionLoad * 0.06,
      min: 0.96,
      max: 1.06
    });
    const buildFatTailMultiplier = sampleCappedFatTailMultiplier(rng, {
      exposure: buildFatTailExposure,
      threshold: 0.58,
      probabilityCap: 0.16,
      maxImpact: 0.18
    });
    const muiFatTailMultiplier = sampleCappedFatTailMultiplier(rng, {
      exposure: muiFatTailExposure,
      threshold: 0.62,
      probabilityCap: 0.1,
      maxImpact: 0.1
    });
    const buildEngineeringMean =
      3.4 +
      scorecard.functionalRisk * 11.8 +
      scorecard.qualityRisk * 7.4 +
      scorecard.ownershipRisk * 6.6 +
      scorecard.deliveryRisk * 5.2 +
      scorecard.enterpriseNeed * 1.1 +
      (scaleDemand >= 5 ? 0.9 : 0);
    const buildEngineeringMeanCalibrated = Math.max(
      2.4,
      (buildEngineeringMean * (1 - buildAbsorptionShield) +
        downsideTailRisk * 0.9) *
        buildBaselineSampler *
        buildFatTailMultiplier
    );
    const buildEngineeringVariance =
      0.08 +
      scorecard.functionalRisk * 0.11 +
      scorecard.qualityRisk * 0.08 +
      scorecard.ownershipRisk * 0.07 +
      scorecard.deliveryRisk * 0.06;
    const buildEngineeringVarianceCalibrated = clamp(
      buildEngineeringVariance * (1 - buildAbsorptionShield * 0.7) +
        buildTailPenalty,
      0.06,
      0.36
    );
    const buildReworkMean =
      0.7 +
      scorecard.functionalRisk * 2.6 +
      scorecard.qualityRisk * 2 +
      scorecard.ownershipRisk * 1.5 +
      scorecard.deliveryRisk * 1 +
      (scaleDemand >= 5 ? 0.4 : 0);
    const buildReworkMeanCalibrated = Math.max(
      0.35,
      (buildReworkMean * (1 - buildAbsorptionShield * 0.85) +
        downsideTailRisk * 0.28) *
        sampleBoundedMultiplier(rng, {
          deviation: 0.022 + buildTailPenalty * 0.08,
          min: 0.96,
          max: 1.08
        }) *
        (1 + (buildFatTailMultiplier - 1) * 0.65)
    );
    const buildRework = Math.max(
      0,
      randomNormal(
        rng,
        buildReworkMeanCalibrated,
        0.68 +
          scorecard.functionalRisk * 0.3 +
          buildTailPenalty * 1.8 -
          buildAbsorptionShield * 0.45
      )
    );
    const buildEngineering = Math.max(
      2,
      buildEngineeringMeanCalibrated *
        (1 + randomNormal(rng, 0, buildEngineeringVarianceCalibrated)) +
        buildRework
    );

    const buildSlipMean =
      1.5 +
      scorecard.deliveryRisk * 2.3 +
      scorecard.functionalRisk * 1.2 +
      scorecard.qualityRisk * 0.8 +
      scorecard.ownershipRisk * 0.6 +
      scorecard.enterpriseNeed * 0.2 +
      (scaleDemand >= 5 ? 0.3 : 0);
    const buildSlipMeanCalibrated = Math.max(
      0.5,
      (buildSlipMean * (1 - buildAbsorptionShield * 0.72) +
        buildTailPenalty * 3.6) *
        sampleBoundedMultiplier(rng, {
          deviation: 0.02 + buildTailPenalty * 0.06,
          min: 0.97,
          max: 1.09
        }) *
        (1 + (buildFatTailMultiplier - 1) * 0.82)
    );
    const buildSlip = Math.max(
      0.6,
      randomNormal(
        rng,
        buildSlipMeanCalibrated,
        0.74 +
          scorecard.deliveryRisk * 0.22 +
          buildTailPenalty * 1.6 -
          internalAbsorption * 0.12
      )
    );
    const buildLaunch = Math.max(
      2,
      buildEngineering / buildVelocity + buildSlip + scorecard.appScale * 0.65
    );

    const muiEngineeringMean =
      2.2 +
      scorecard.functionalRisk * 5.2 +
      scorecard.qualityRisk * 2.9 +
      scorecard.deliveryRisk * 1.5 +
      planFit.integrationRisk * 2.4 +
      planFit.coverageGap * 3.8 +
      planFit.supportGap * 1.5 -
      coverageShield * 0.18;
    const muiEngineeringMeanCalibrated = Math.max(
      1.6,
      (muiEngineeringMean +
        1 +
        muiAdoptionBurden * 2.4 -
        muiLeverage * 1.6 -
        coverageShield * 0.15) *
        muiBaselineSampler *
        muiFatTailMultiplier
    );
    const muiEngineeringVariance =
      0.06 +
      scorecard.functionalRisk * 0.05 +
      planFit.integrationRisk * 0.05 +
      planFit.coverageGap * 0.05 -
      coverageShield * 0.01;
    const muiEngineeringVarianceCalibrated = clamp(
      muiEngineeringVariance +
        muiAdoptionBurden * 0.04 -
        muiLeverageShield * 0.18,
      0.05,
      0.24
    );
    const muiReworkMean =
      0.35 +
      planFit.coverageGap * 1.3 +
      planFit.integrationRisk * 1.05 +
      scorecard.qualityRisk * 0.65 +
      planFit.supportGap * 0.35 -
      coverageShield * 0.08;
    const muiReworkMeanCalibrated = Math.max(
      0.18,
      (muiReworkMean +
        muiAdoptionBurden * 0.85 -
        muiLeverage * 0.58 -
        coverageShield * 0.1) *
        sampleBoundedMultiplier(rng, {
          deviation: 0.018 + muiAdoptionLoad * 0.05,
          min: 0.97,
          max: 1.07
        }) *
        (1 + (muiFatTailMultiplier - 1) * 0.55)
    );
    const muiRework = Math.max(
      0,
      randomNormal(
        rng,
        muiReworkMeanCalibrated,
        0.36 +
          planFit.coverageGap * 0.16 +
          muiAdoptionLoad * 0.45 -
          muiLeverageShield * 0.35
      )
    );
    const muiEngineering = Math.max(
      1.5,
      muiEngineeringMeanCalibrated *
        (1 + randomNormal(rng, 0, muiEngineeringVarianceCalibrated)) +
        muiRework
    );

    const muiSlipMean =
      0.85 +
      scorecard.deliveryRisk * 1 +
      planFit.coverageGap * 0.9 +
      planFit.integrationRisk * 0.7 +
      planFit.supportGap * 0.35 -
      coverageShield * 0.1;
    const muiSlipMeanCalibrated = Math.max(
      0.25,
      (muiSlipMean +
        muiAdoptionBurden * 0.8 -
        muiLeverage * 0.52 -
        coverageShield * 0.08) *
        sampleBoundedMultiplier(rng, {
          deviation: 0.017 + muiAdoptionLoad * 0.04,
          min: 0.97,
          max: 1.06
        }) *
        (1 + (muiFatTailMultiplier - 1) * 0.62)
    );
    const muiSlip = Math.max(
      0.3,
      randomNormal(
        rng,
        muiSlipMeanCalibrated,
        0.4 +
          planFit.coverageGap * 0.12 +
          muiAdoptionLoad * 0.3 -
          muiLeverageShield * 0.25
      )
    );
    const muiLaunch = Math.max(
      1.4,
      muiEngineering / muiVelocity + muiSlip + scorecard.appScale * 0.38
    );

    const buildMaintenanceBase =
      horizonYears *
      (0.95 +
        scorecard.functionalRisk * 2.8 +
        scorecard.qualityRisk * 1.7 +
        scorecard.ownershipRisk * 2 +
        scorecard.deliveryRisk * 0.55 +
        (scaleDemand >= 5 ? 0.18 : 0));
    const buildMaintenanceBaseCalibrated = Math.max(
      0.75,
      (buildMaintenanceBase * (1 - buildAbsorptionShield * 0.68) +
        downsideTailRisk * 0.32 * horizonYears) *
        sampleBoundedMultiplier(rng, {
          deviation: 0.018 + buildTailPenalty * 0.05,
          min: 0.97,
          max: 1.08
        }) *
        (1 + (buildFatTailMultiplier - 1) * 0.58)
    );
    const buildMaintenance = Math.max(
      0.8,
      buildMaintenanceBaseCalibrated *
        (1 +
          randomNormal(
            rng,
            0,
            0.18 +
              scorecard.ownershipRisk * 0.05 +
              buildTailPenalty * 0.42
          ))
    );

    const muiMaintenanceBase =
      horizonYears *
      (0.55 +
        scorecard.functionalRisk * 1 +
        scorecard.qualityRisk * 0.68 +
        planFit.integrationRisk * 0.88 +
        planFit.coverageGap * 1.22 +
        planFit.supportGap * 0.68 -
        scorecard.muiUsage * 0.08 -
        coverageShield * 0.12);
    const muiMaintenanceBaseCalibrated = Math.max(
      0.42,
      (muiMaintenanceBase +
        muiAdoptionBurden * 0.42 * horizonYears -
        muiLeverage * 0.32 * horizonYears -
        coverageShield * 0.08) *
        sampleBoundedMultiplier(rng, {
          deviation: 0.016 + muiAdoptionLoad * 0.03,
          min: 0.98,
          max: 1.06
        }) *
        (1 + (muiFatTailMultiplier - 1) * 0.42)
    );
    const muiMaintenance = Math.max(
      0.4,
      muiMaintenanceBaseCalibrated *
        (1 +
          randomNormal(
            rng,
            0,
            0.13 +
              planFit.coverageGap * 0.03 +
              muiAdoptionLoad * 0.16 -
              muiLeverageShield * 0.08
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
      buildTailImpactCap: roundTo(0.18, 2),
      muiTailImpactCap: roundTo(0.1, 2),
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
  const comparison = simulation.comparison;
  const selectedPlan = PLAN_CONFIG[scorecard.effectiveMuiPlan];
  const planFit = scorecard.effectivePlanFit;
  const internalAbsorption = scorecard.internalAbsorption;
  const deliveryRiskReduction =
    comparison.probabilityBuildExceeds20Weeks -
    comparison.probabilityMuiExceeds20Weeks;
  const muiDeliveryFavored =
    comparison.probabilityMuiFaster >= 55 || deliveryRiskReduction >= 12;
  const muiCostFavored = comparison.probabilityMuiLowerTco >= 55;
  const packagedPathCostPenalty =
    comparison.probabilityMuiLowerTco <= 50 && comparison.tcoDeltaMedian >= 0;
  const deliveryOnlyMuiAdvantage =
    comparison.probabilityMuiFaster >= 75 &&
    comparison.launchWeekDeltaMedian < 0 &&
    (comparison.probabilityMuiLowerTco < 60 || comparison.tcoDeltaMedian > 0);
  const buildStillCompetitive =
    simulation.buildPath.medianLaunchWeeks <=
      simulation.muiPath.medianLaunchWeeks + 1.5 &&
    simulation.buildPath.medianTco <= simulation.muiPath.medianTco * 1.1;
  const nonSpeedMuiSignal =
    scorecard.muiAdoptionUseful ||
    scorecard.supportOrProcurementNeed ||
    input.dependentTeams !== "one" ||
    input.reactApps >= 2 ||
    (planFit.coverageScore >= 74 && scorecard.buildCompetitiveIndex < 58);
  const muiDominatesSimulation =
    comparison.probabilityMuiFaster >= 75 &&
    comparison.probabilityMuiLowerTco >= 75 &&
    comparison.launchWeekDeltaMedian < 0 &&
    comparison.tcoDeltaMedian <= 0;
  const buildDominatesSimulation =
    comparison.probabilityMuiFaster <= 25 &&
    comparison.probabilityMuiLowerTco <= 25 &&
    comparison.launchWeekDeltaMedian >= 0 &&
    comparison.tcoDeltaMedian >= 0;
  const coreNeedsStrongerEvidence =
    scorecard.effectiveMuiPlan === "core" &&
    input.existingMuiUsage === "none" &&
    input.dependentTeams === "one" &&
    input.reactApps === 1 &&
    input.supportRequirement === "community" &&
    scorecard.buildFriendlyContext;
  const coreMaterialAdvantage =
    muiCostFavored &&
    muiDeliveryFavored &&
    comparison.launchWeekDeltaMedian <= -2;

  let option = "Build in-house";
  let summary =
    "The modeled tradeoff stays close enough that owning the component internally remains a credible option for this input set.";

  if (muiDominatesSimulation) {
    option = selectedPlan.recommendationLabel;
    summary =
      `${selectedPlan.label} is both faster and lower in modeled total cost across the simulation, so the packaged path now has the stronger recommendation case. Build still remains credible only as a higher-control tradeoff, not the favored path.`;
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
    scorecard.buildCompetitiveIndex >= 58 &&
    buildStillCompetitive
  ) {
    option = "Build in-house";
    summary =
      "The scope is controlled, support need is low, and the existing design-system baseline is strong enough that an internal build remains competitive.";
  } else if (
    deliveryOnlyMuiAdvantage &&
    internalAbsorption >= 0.74 &&
    scorecard.buildCompetitiveIndex >= 58 &&
    !scorecard.enterpriseFitStrong
  ) {
    option = "Build in-house";
    summary =
      `${selectedPlan.label} is modeled to land sooner, but not to win clearly enough on total ownership cost. With strong internal absorption and build-friendly context, owning the component remains a credible recommendation with an explicit speed tradeoff.`;
  } else if (
    scorecard.enterpriseFitStrong &&
    scorecard.effectiveMuiPlan === "enterprise" &&
    (muiDeliveryFavored || planFit.supportGap < 0.18)
  ) {
    option = "Enterprise";
    summary =
      "Enterprise support expectations are elevated and the modeled downside is meaningfully lower with the enterprise tier.";
  } else if (
    scorecard.effectiveMuiPlan === "premium" &&
    !scorecard.supportOrProcurementNeed &&
    (muiDeliveryFavored || planFit.coverageScore >= 68 || nonSpeedMuiSignal)
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
    ((muiDominatesSimulation || coreMaterialAdvantage) &&
      (!coreNeedsStrongerEvidence || muiDominatesSimulation))
  ) {
    option = "MUI Core";
    summary =
      coreNeedsStrongerEvidence && !muiDominatesSimulation
        ? "The Core path only clears the recommendation bar because it is materially faster and lower in modeled cost, not just because it is the default packaged comparison."
        : "The Core path is modeled to remove enough delivery and ownership work to justify the packaged recommendation here.";
  } else if (
    scorecard.buildCompetitiveIndex >= 62 &&
    !scorecard.enterpriseFitStrong &&
    scorecard.functionalRisk < 0.55 &&
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
    (deliveryOnlyMuiAdvantage && isBuildRecommendation ? 6 : 0) -
    (deliveryOnlyMuiAdvantage && !isBuildRecommendation && !muiCostFavored
      ? 8
      : 0) -
    (coreNeedsStrongerEvidence && option === "MUI Core" && !muiDominatesSimulation
      ? 6
      : 0);
  const confidenceScore = clamp(
    Math.round(confidenceBase),
    recommendationOpposed ? 42 : deliveryOnlyMuiAdvantage && isBuildRecommendation ? 62 : 48,
    96
  );

  return {
    recommendation: {
      option,
      summary
    },
    confidence: {
      score: confidenceScore,
      level:
      confidenceScore >= 80
          ? "high"
          : confidenceScore >= 62
            ? "moderate"
            : "qualified",
      rationale:
        "Confidence reflects whether the selected recommendation is supported by the same-direction delivery and cost evidence, together with the rule-based fit scores. It is not a guarantee of outcome."
    }
  };
}

function buildEvidenceBasis(input, scorecard) {
  return [
    {
      factor: "functionalComplexity",
      basis: "benchmark-informed",
      sourceKeys: ["cocomo-ii"],
      explanation:
        "Primary use case, expected row and column scale, data-heavy screens, and advanced features raise effort because component work expands scope, integration, and verification effort."
    },
    {
      factor: "qualityBurden",
      basis: "standard-backed",
      sourceKeys: ["nist-software-errors"],
      explanation:
        "Accessibility target, expected scale, keyboard support, virtualization, custom rendering, and similar behaviors increase the verification burden because they expand defect exposure and rework cost."
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
        "Dependent teams, ownership model, React footprint, and design-system maturity shape long-term ownership cost because shared components create maintenance, rollout, and coordination obligations."
    },
    {
      factor: "enterpriseReadiness",
      basis: "benchmark-informed",
      sourceKeys: [],
      explanation:
        "Support expectations, maintenance horizon, existing MUI usage, and organizational footprint raise enterprise fit because vendor-backed procurement and response matter more in larger or longer-lived programs."
    },
    {
      factor: "implementationInterdependency",
      basis: "benchmark-informed",
      sourceKeys: ["flyvbjerg-it-overruns"],
      explanation:
        "Feature coupling, custom rendering, and integration-heavy behavior create interdependency risk because large programs tend to accumulate downside from linked work streams."
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
    "The latest model version is benchmark-informed-v3, and older saved reports may not reflect the current input schema."
  );

  return {
    ...recommendation,
    modelVersion: MODEL_VERSION,
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
