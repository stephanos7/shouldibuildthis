const ITERATIONS = 10000;
const MODEL_VERSION = "benchmark-informed-v2";

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
  const maturity = MATURITY_INDEX[input.designSystemMaturity];

  const functionalDrivers = [
    `${input.primaryUseCase} is the primary use case, which sets the baseline interaction complexity.`,
    `Expected volume sits in the ${input.expectedRows} row band and the ${input.expectedColumns} column band.`
  ];

  if (input.advancedFeatures.length > 0) {
    functionalDrivers.push(
      `${input.advancedFeatures.length} advanced feature${input.advancedFeatures.length === 1 ? "" : "s"} expand the component surface area.`
    );
  }

  if (screenLoad > 0) {
    functionalDrivers.push(
      `${screenLoad} data-heavy screen${screenLoad === 1 ? "" : "s"} add state and edge-case pressure.`
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
    `${input.accessibilityTarget} accessibility target sets the baseline QA and interaction burden.`,
    `Expected volume at ${input.expectedRows} rows by ${input.expectedColumns} columns increases regression risk.`
  ];
  const qualityFeatures = [
    "keyboard-navigation",
    "virtualization",
    "custom-rendering",
    "server-side-data",
    "timezone-logic",
    "drag-and-drop"
  ].filter((feature) => input.advancedFeatures.includes(feature));

  if (qualityFeatures.length > 0) {
    qualityDrivers.push(
      `${qualityFeatures.join(", ")} require deeper behavior coverage and regression checking.`
    );
  }

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
    `${input.changeLeadTime} change lead time is the main delivery throughput input.`,
    `${input.reworkFrequency} rework frequency affects how much churn the team should expect.`,
    `${input.deadlinePressure} deadline pressure affects how much schedule slack the team has.`
  ];

  if (
    input.changeLeadTime === "unknown" ||
    input.reworkFrequency === "unknown"
  ) {
    deliveryDrivers.push(
      "Unknown cadence inputs widen the delivery uncertainty band."
    );
  }

  const deliveryMaturity = buildFactor(
    28 +
      changeLeadTime * 12.5 +
      reworkFrequency * 11 +
      { low: 16, medium: 4, high: -12 }[input.deadlinePressure],
    deliveryDrivers
  );

  const ownershipDrivers = [
    `${input.dependentTeams} dependent team band and ${input.ownershipModel} ownership model shape the coordination load.`,
    `${input.reactApps} React app${input.reactApps === 1 ? "" : "s"} widen the long-term component ownership surface.`,
    `${input.frontendDevelopers} frontend developer${input.frontendDevelopers === 1 ? "" : "s"} influence coordination and onboarding cost.`
  ];

  ownershipDrivers.push(
    `${input.designSystemMaturity} design-system maturity changes how much shared groundwork already exists.`
  );

  const ownershipBurden = buildFactor(
    dependentTeams * 14 +
      ownershipModel * 10 +
      Math.min(input.reactApps, 8) * 4.5 +
      Math.min(input.frontendDevelopers, 12) * 2.2 +
      (4 - maturity) * 9,
    ownershipDrivers
  );

  const enterpriseDrivers = [
    `${input.supportRequirement} support expectations drive the need for vendor-backed response and procurement paths.`,
    `${input.maintenanceHorizonMonths} months of planned maintenance raises the value of durable support and upgrades.`,
    `${input.dependentTeams} dependent team band and ${input.reactApps} React app${input.reactApps === 1 ? "" : "s"} define the rollout footprint.`
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
  const advancedNeeds =
    functionalRisk >= 0.62 ||
    qualityRisk >= 0.56 ||
    rowScale >= 3 ||
    columnScale >= 3 ||
    input.advancedFeatures.length >= 4;

  console.log(
    "functionalRisk",
    functionalRisk,
    "and qualityRisk ",
    qualityRisk
  );
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
      (advancedNeeds ? 16 : 0) +
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

  let autoSelectedMuiPlan = "core";

  if (
    enterpriseFitStrong &&
    enterpriseTierScore >= 78 &&
    planFits.enterprise.coverageScore >= 66
  ) {
    autoSelectedMuiPlan = "enterprise";
  } else if (
    advancedNeeds &&
    planFits.premium.coverageScore >= 62 &&
    !(simpleScope && supportNeed <= 1)
  ) {
    autoSelectedMuiPlan = "premium";
  }

  const effectiveMuiPlan = autoSelectedMuiPlan;
  const effectivePlanFit = planFits[effectiveMuiPlan];
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

  if (advancedNeeds) {
    icpReasons.push(
      "Complex component requirements increase the value of a packaged path with proven coverage."
    );
  }

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
    advancedNeeds,
    enterpriseFitStrong,
    lowSupportNeed,
    supportOrProcurementNeed,
    muiAdoptionUseful,
    autoSelectedMuiPlan,
    effectiveMuiPlan,
    buildCompetitiveIndex,
    icpFitSegment:
      icpScore >= 70 ? "strong" : icpScore >= 50 ? "moderate" : "limited",
    icpReasons
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

  const buildVelocity = clamp(
    0.84 +
      scorecard.deliveryStrength * 0.36 -
      scorecard.ownershipRisk * 0.06 +
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
    const buildEngineeringMean =
      3.4 +
      scorecard.functionalRisk * 11.8 +
      scorecard.qualityRisk * 7.4 +
      scorecard.ownershipRisk * 6.6 +
      scorecard.deliveryRisk * 5.2 +
      scorecard.enterpriseNeed * 1.1 +
      (scaleDemand >= 5 ? 0.9 : 0);
    const buildEngineeringVariance =
      0.08 +
      scorecard.functionalRisk * 0.11 +
      scorecard.qualityRisk * 0.08 +
      scorecard.ownershipRisk * 0.07 +
      scorecard.deliveryRisk * 0.06;
    const buildReworkMean =
      0.7 +
      scorecard.functionalRisk * 2.6 +
      scorecard.qualityRisk * 2 +
      scorecard.ownershipRisk * 1.5 +
      scorecard.deliveryRisk * 1 +
      (scaleDemand >= 5 ? 0.4 : 0);
    const buildRework = Math.max(
      0,
      randomNormal(rng, buildReworkMean, 0.72 + scorecard.functionalRisk * 0.35)
    );
    const buildEngineering = Math.max(
      2,
      buildEngineeringMean *
        (1 + randomNormal(rng, 0, buildEngineeringVariance)) +
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
    const buildSlip = Math.max(
      0.6,
      randomNormal(rng, buildSlipMean, 0.82 + scorecard.deliveryRisk * 0.25)
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
    const muiEngineeringVariance =
      0.06 +
      scorecard.functionalRisk * 0.05 +
      planFit.integrationRisk * 0.05 +
      planFit.coverageGap * 0.05 -
      coverageShield * 0.01;
    const muiReworkMean =
      0.35 +
      planFit.coverageGap * 1.3 +
      planFit.integrationRisk * 1.05 +
      scorecard.qualityRisk * 0.65 +
      planFit.supportGap * 0.35 -
      coverageShield * 0.08;
    const muiRework = Math.max(
      0,
      randomNormal(rng, muiReworkMean, 0.42 + planFit.coverageGap * 0.18)
    );
    const muiEngineering = Math.max(
      1.5,
      muiEngineeringMean * (1 + randomNormal(rng, 0, muiEngineeringVariance)) +
        muiRework
    );

    const muiSlipMean =
      0.85 +
      scorecard.deliveryRisk * 1 +
      planFit.coverageGap * 0.9 +
      planFit.integrationRisk * 0.7 +
      planFit.supportGap * 0.35 -
      coverageShield * 0.1;
    const muiSlip = Math.max(
      0.3,
      randomNormal(rng, muiSlipMean, 0.46 + planFit.coverageGap * 0.14)
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
    const buildMaintenance = Math.max(
      0.8,
      buildMaintenanceBase *
        (1 + randomNormal(rng, 0, 0.2 + scorecard.ownershipRisk * 0.06))
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
    const muiMaintenance = Math.max(
      0.4,
      muiMaintenanceBase *
        (1 + randomNormal(rng, 0, 0.14 + planFit.coverageGap * 0.03))
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
    estimatedLicensedDevelopers
  };
}

function buildRecommendation(input, scorecard, simulation) {
  const comparison = simulation.comparison;
  const selectedPlan = PLAN_CONFIG[scorecard.effectiveMuiPlan];
  const planFit = scorecard.effectivePlanFit;
  const deliveryRiskReduction =
    comparison.probabilityBuildExceeds20Weeks -
    comparison.probabilityMuiExceeds20Weeks;
  const muiDeliveryFavored =
    comparison.probabilityMuiFaster >= 55 || deliveryRiskReduction >= 12;
  const muiCostFavored = comparison.probabilityMuiLowerTco >= 55;
  const buildStillCompetitive =
    simulation.buildPath.medianLaunchWeeks <=
      simulation.muiPath.medianLaunchWeeks + 1.5 &&
    simulation.buildPath.medianTco <= simulation.muiPath.medianTco * 1.1;

  let option = "Build in-house";
  let summary =
    "The modeled tradeoff stays close enough that owning the component internally remains a credible option for this input set.";

  if (
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
    scorecard.enterpriseFitStrong &&
    scorecard.effectiveMuiPlan === "enterprise" &&
    (muiDeliveryFavored || planFit.supportGap < 0.18)
  ) {
    option = "Enterprise";
    summary =
      "Enterprise support expectations are elevated and the modeled downside is meaningfully lower with the enterprise tier.";
  } else if (
    scorecard.effectiveMuiPlan === "premium" &&
    scorecard.advancedNeeds &&
    !scorecard.supportOrProcurementNeed &&
    (muiDeliveryFavored || planFit.coverageScore >= 68)
  ) {
    option = "Premium";
    summary =
      "The workload is advanced enough to benefit from packaged component coverage, but it does not show strong enterprise procurement pressure.";
  } else if (
    scorecard.effectiveMuiPlan === "core" &&
    scorecard.simpleScope &&
    scorecard.muiAdoptionUseful &&
    (muiDeliveryFavored || muiCostFavored)
  ) {
    option = "MUI Core";
    summary =
      "The scope stays relatively standard and existing MUI familiarity makes the lighter packaged path easier to absorb.";
  } else if (
    scorecard.buildCompetitiveIndex >= 62 &&
    !scorecard.enterpriseFitStrong &&
    scorecard.functionalRisk < 0.55 &&
    buildStillCompetitive
  ) {
    option = "Build in-house";
    summary =
      "Even after factoring in delivery variance, the internal path remains competitive on both timing and total ownership cost.";
  } else if (muiDeliveryFavored || muiCostFavored) {
    option = selectedPlan.recommendationLabel;
    summary =
      "The simulation leans toward the selected MUI tier on delivery risk, cost, or both, so the packaged path is the safer default here.";
  }

  const ruleAlignment =
    (option === "Build in-house"
      ? scorecard.buildTierScore
      : scorecard[`${scorecard.effectiveMuiPlan}TierScore`]) / 100;
  const probabilitySeparation =
    Math.abs(comparison.probabilityMuiFaster - 50) * 0.42 +
    Math.abs(comparison.probabilityMuiLowerTco - 50) * 0.32 +
    Math.abs(deliveryRiskReduction) * 0.45;
  const confidenceScore = clamp(
    Math.round(
      50 +
        probabilitySeparation +
        ruleAlignment * 14 +
        (option === "Build in-house" && scorecard.simpleScope ? 5 : 0) +
        (option === "Enterprise" && scorecard.enterpriseFitStrong ? 7 : 0) +
        (option === "Premium" && scorecard.advancedNeeds ? 4 : 0)
    ),
    52,
    92
  );

  return {
    recommendation: {
      option,
      summary
    },
    confidence: {
      score: confidenceScore,
      level:
        confidenceScore >= 78
          ? "high"
          : confidenceScore >= 64
            ? "moderate"
            : "qualified",
      rationale:
        "Confidence reflects how strongly the rules-based tiering and the simulation point to the same path, not a guarantee of outcome."
    }
  };
}

function buildEvidenceBasis(input, scorecard) {
  return [
    {
      factor: "functionalComplexity",
      basis: "benchmark-informed",
      explanation:
        "Primary use case, expected row and column scale, data-heavy screens, and advanced features raise effort because complex component programs typically expand integration and QA scope."
    },
    {
      factor: "qualityBurden",
      basis: "standard-backed",
      explanation:
        "Accessibility target, expected scale, keyboard support, virtualization, custom rendering, and similar behaviors increase the verification burden because they expand behavioral requirements."
    },
    {
      factor: "deliveryMaturity",
      basis: "practice-backed",
      explanation:
        "Change lead time, rework frequency, and deadline pressure are used as delivery health signals because teams with faster change cycles and less churn absorb change with less schedule variance."
    },
    {
      factor: "ownershipBurden",
      basis: "practice-backed",
      explanation:
        "Dependent teams, ownership model, React footprint, and design-system maturity shape long-term ownership cost because shared components create maintenance and onboarding obligations."
    },
    {
      factor: "enterpriseReadiness",
      basis: "benchmark-informed",
      explanation:
        "Support expectations, maintenance horizon, existing MUI usage, and organizational footprint raise enterprise fit because vendor-backed procurement and response matter more in larger or longer-lived programs."
    },
    {
      factor: `${PLAN_CONFIG[scorecard.effectiveMuiPlan].label} plan fit`,
      basis: "product-specific heuristic",
      explanation: `The model estimates ${PLAN_CONFIG[scorecard.effectiveMuiPlan].label} fit from this payload's use case, feature demand, support need, and existing MUI usage.`
    },
    {
      factor: "recommendation synthesis",
      basis: "product-specific heuristic",
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
    "Derived factors are benchmark-informed heuristics meant to keep the model transparent and evolvable, not to imply precise industry averages."
  );
  assumptions.push(
    "The latest model version is benchmark-informed-v2, and older saved reports may not reflect the current input schema."
  );

  return {
    ...recommendation,
    modelVersion: MODEL_VERSION,
    derivedFactors,
    evidenceBasis,
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
