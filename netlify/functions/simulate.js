import { PUBLIC_BENCHMARK_SOURCES } from "../../src/data/publicSources.js";
import {
  CALIBRATION_VERSION,
  DERIVED_FACTOR_WEIGHTS,
  PATH_SCORE_WEIGHTS,
  PLAN_FIT_WEIGHTS,
  SCENARIO_LEVER_WEIGHTS
} from "../../src/model/calibration.js";

const MODEL_VERSION = "deterministic-fit-v1";

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

const PATH_LABELS = {
  build: "Build in-house",
  core: "MUI Core",
  premium: "MUI X Premium",
  enterprise: "MUI X Enterprise"
};

const PLAN_CONFIG = {
  core: {
    key: "core",
    label: "MUI Core",
    useCaseCoverage: {
      "data-grid": 0.28,
      charts: 0.45,
      "date-pickers": 0.92,
      "tree-view": 0.5,
      scheduler: 0.12,
      "multi-component": 0.32
    },
    supportCapability: 0.15,
    featureCapacity: 2.0
  },
  premium: {
    key: "premium",
    label: "MUI X Premium",
    useCaseCoverage: {
      "data-grid": 0.9,
      charts: 0.72,
      "date-pickers": 0.96,
      "tree-view": 0.84,
      scheduler: 0.66,
      "multi-component": 0.76
    },
    supportCapability: 0.45,
    featureCapacity: 4.4
  },
  enterprise: {
    key: "enterprise",
    label: "MUI X Enterprise",
    useCaseCoverage: {
      "data-grid": 0.94,
      charts: 0.78,
      "date-pickers": 0.97,
      "tree-view": 0.88,
      scheduler: 0.74,
      "multi-component": 0.82
    },
    supportCapability: 0.78,
    featureCapacity: 5.8
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

function bucket(value, small, medium) {
  if (value <= small) {
    return 1;
  }

  if (value <= medium) {
    return 2;
  }

  return 3;
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
    functionalDrivers
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
    ]
  );

  const deliveryMaturity = buildFactor(
    derivedWeights.deliveryMaturity.base +
      changeLeadTime * derivedWeights.deliveryMaturity.changeLeadTime +
      reworkFrequency * derivedWeights.deliveryMaturity.reworkFrequency +
      derivedWeights.deliveryMaturity.deadlinePressure[input.deadlinePressure],
    [
      `${input.changeLeadTime} lead time sets the delivery-flow baseline.`,
      `${input.reworkFrequency} rework frequency changes how reliably work sticks.`,
      `${input.deadlinePressure} deadline pressure adjusts delivery slack.`
    ]
  );

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
    [
      `${input.dependentTeams} dependent teams and ${countLabel(input.reactApps, "React app")} define coordination load.`,
      `${input.ownershipModel} ownership and ${input.knowledgeConcentration} knowledge concentration shape continuity risk.`,
      `${input.designSystemMaturity} design-system maturity changes how much groundwork already exists.`
    ]
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
        derivedWeights.enterpriseReadiness.productionCriticality +
      derivedWeights.enterpriseReadiness.ownershipHorizon[
        input.ownershipHorizon
      ],
    [
      `${input.supportRequirement} support expectations raise enterprise relevance.`,
      `${countLabel(input.reactApps, "React app")} and ${input.dependentTeams} dependent teams widen the rollout footprint.`,
      `${input.componentStandardizationGoal} standardization intent and ${input.productionCriticality} criticality affect platform pressure.`,
      `${input.ownershipHorizon}-month ownership horizon reinforces long-lived support planning.`
    ]
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
  const planScaleCapacity = PLAN_FIT_WEIGHTS.planScaleCapacity[planKey];
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
    coverageScore: roundTo(coverageScore),
    coverageGap: roundTo(coverageGap, 2),
    integrationRisk: roundTo(integrationRisk, 2),
    supportGap: roundTo(supportGap, 2)
  };
}

function buildScenarioLevers(input, scorecard) {
  const scenarioWeights = SCENARIO_LEVER_WEIGHTS;
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

  return {
    internalAbsorption: buildLever(internalAbsorptionScore, [
      "Delivery flow, ownership clarity, knowledge spread, and handoff quality define how cleanly the team can absorb custom work."
    ]),
    buildReuseLeverage: buildLever(buildReuseLeverageScore, [
      "Design-system maturity, ownership clarity, and scope simplicity determine how much internal reuse the build path can capture."
    ]),
    muiLeverage: buildLever(
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
        "Coverage fit, support fit, existing MUI usage, and packaged affinity determine how much leverage a packaged path can realistically deliver."
      ]
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
      ]
    ),
    downsideTailRisk: buildLever(
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
      ]
    ),
    performancePressure: buildLever(performancePressure, [
      "Normalized pressure from the selected performance-sensitivity requirement."
    ]),
    muiPerformanceReadiness: buildLever(muiPerformanceReadiness, [
      "Coverage, integration fit, and adoption conditions determine how ready the packaged path is for performance-sensitive work."
    ]),
    muiPerformanceBurden: buildLever(muiPerformanceBurden, [
      "Remaining performance-sensitive burden on the packaged path after fit conditions are considered."
    ]),
    buildPerformanceReadiness: buildLever(buildPerformanceReadiness, [
      "Internal absorption, reuse, knowledge spread, and handoff quality determine build-side readiness for performance-sensitive work."
    ]),
    buildPerformanceBurden: buildLever(buildPerformanceBurden, [
      "Remaining performance-sensitive burden on the build path after internal readiness is considered."
    ])
  };
}

function buildScorecard(input, derivedFactors) {
  const pathScoreWeights = PATH_SCORE_WEIGHTS;
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

  const containedScope =
    functionalRisk <= 0.45 &&
    qualityRisk <= 0.45 &&
    input.advancedFeatures.length <= 2 &&
    input.dataHeavyScreens <= 2 &&
    rowScale <= 2 &&
    columnScale <= 2;

  const coreTierScore = clamp(
    pathScoreWeights.coreTierScore.base +
      planFits.core.coverageScore *
        pathScoreWeights.coreTierScore.coverageScore +
      (containedScope ? pathScoreWeights.coreTierScore.simpleScopeBonus : 0) +
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
      (containedScope ? pathScoreWeights.premiumTierScore.simpleScopePenalty : 0) -
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
      (containedScope
        ? pathScoreWeights.enterpriseTierScore.simpleScopeAdjustment
        : 0),
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

  const enterpriseFitStrong = enterpriseNeed >= 0.6 && supportNeed >= 2;
  const lowSupportNeed = supportNeed <= 1;
  const supportOrProcurementNeed = supportNeed >= 2;
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
    input.advancedFeatures.length <= 2 &&
    ["none", "wcag-a"].includes(input.accessibilityTarget);

  let autoSelectedMuiPlan = "core";

  if (
    planFits.enterprise.coverageScore >= 70 &&
    (enterpriseFitStrong ||
      input.componentStandardizationGoal === "platform-standard" ||
      input.supportRequirement === "procurement-sla")
  ) {
    autoSelectedMuiPlan = "enterprise";
  } else if (
    planFits.premium.coverageScore >= 66 &&
    !(
      containedScope &&
      lowSupportNeed &&
      input.advancedFeatures.length === 0 &&
      input.primaryUseCase !== "data-grid"
    ) &&
    (functionalRisk >= 0.46 ||
      qualityRisk >= 0.46 ||
      rowScale >= 3 ||
      columnScale >= 3 ||
      input.advancedFeatures.length >= 2)
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
    buildTierScore: roundTo(buildTierScore),
    coreTierScore: roundTo(coreTierScore),
    premiumTierScore: roundTo(premiumTierScore),
    enterpriseTierScore: roundTo(enterpriseTierScore),
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

function summarizeComponents(components, minImpact = 4) {
  const positive = components
    .filter((component) => component.signal === "help" && component.impact >= minImpact)
    .sort((left, right) => right.impact - left.impact)
    .slice(0, 4)
    .map((component) => component.detail);

  const negative = components
    .filter((component) => component.signal === "hurt" && component.impact >= minImpact)
    .sort((left, right) => right.impact - left.impact)
    .slice(0, 4)
    .map((component) => component.detail);

  return { positive, negative };
}

function buildPathFitEntry(key, label, score, components, eligible = true) {
  const normalizedScore = roundTo(clamp(score, 0, 100));
  const summaries = summarizeComponents(components);

  return {
    key,
    label,
    score: normalizedScore,
    level: levelFromScore(normalizedScore),
    eligible,
    components,
    strengths: summaries.positive,
    drags: summaries.negative
  };
}

function buildPathFits(input, derivedFactors, scorecard, planFits) {
  const featureDemandRaw = input.advancedFeatures.reduce(
    (sum, feature) => sum + ADVANCED_FEATURE_WEIGHTS[feature],
    0
  );
  const featureDemand = clamp((featureDemandRaw / 6) * 100, 0, 100);
  const containedScopeScore = scorecard.containedScope ? 90 : 22;
  const supportLightness = supportLightnessScore(input);
  const ownershipClarity = ownershipClarityScore(input);
  const knowledgeSpread = knowledgeSpreadScore(input);
  const advancedDataNeed =
    input.primaryUseCase === "data-grid" || input.primaryUseCase === "scheduler"
      ? clamp(
          52 +
            (EXPECTED_ROWS_INDEX[input.expectedRows] - 1) * 14 +
            (EXPECTED_COLUMNS_INDEX[input.expectedColumns] - 1) * 10 +
            input.advancedFeatures.length * 6,
          0,
          100
        )
      : clamp(featureDemand * 0.72, 0, 100);
  const standardizationContext = clamp(
    scorecard.standardizationIntent * 42 +
      bucket(input.reactApps, 1, 4) * 14 +
      bucket(input.frontendDevelopers, 3, 8) * 10 +
      DEPENDENT_TEAMS_INDEX[input.dependentTeams] * 8,
    0,
    100
  );
  const buildScore = clamp(
    scorecard.buildTierScore +
      (scorecard.buildFriendlyContext ? 12 : 0) +
      (input.existingMuiUsage === "none" ? 4 : 0) +
      (ownershipClarity >= 80 ? 3 : 0),
    0,
    100
  );
  const coreScore = clamp(
    scorecard.coreTierScore -
      (scorecard.buildFriendlyContext && input.existingMuiUsage === "none"
        ? 8
        : 0),
    0,
    100
  );
  const premiumScore = clamp(
    scorecard.premiumTierScore +
      (advancedDataNeed >= 70 ? 6 : 0) -
      (derivedFactors.enterpriseReadiness.score >= 78 &&
      scorecard.supportNeed >= 2
        ? 6
        : 0),
    0,
    100
  );
  const enterpriseScore = clamp(
    scorecard.enterpriseTierScore +
      (input.supportRequirement === "procurement-sla" ? 10 : 0) +
      (input.componentStandardizationGoal === "platform-standard" ? 8 : 0) +
      (input.reactApps >= 4 ? 6 : 0) +
      (scorecard.productionCriticalityNormalized >= 0.67 ? 6 : 0) -
      (scorecard.supportNeed <= 1 ? 18 : scorecard.supportNeed === 2 ? 6 : 0) -
      (input.componentStandardizationGoal !== "platform-standard" ? 8 : 0) -
      (input.reactApps < 3 ? 8 : 0),
    0,
    100
  );

  const buildComponents = [
    buildPathComponent(
      "deliveryMaturity",
      "Delivery maturity",
      derivedFactors.deliveryMaturity.score * 0.16,
      "help",
      "High delivery maturity supports an internal build."
    ),
    buildPathComponent(
      "internalAbsorption",
      "Internal absorption",
      scorecard.internalAbsorption * 18,
      "help",
      "The team appears able to absorb custom implementation work."
    ),
    buildPathComponent(
      "buildReuseLeverage",
      "Build reuse leverage",
      scorecard.buildReuseLeverage * 16,
      "help",
      "Existing internal patterns and reuse potential help the build path."
    ),
    buildPathComponent(
      "ownershipClarity",
      "Ownership clarity",
      ownershipClarity * 0.12,
      "help",
      "Clear ownership improves build accountability and maintenance viability."
    ),
    buildPathComponent(
      "knowledgeSpread",
      "Shared knowledge",
      knowledgeSpread * 0.1,
      "help",
      "Shared implementation knowledge reduces build continuity risk."
    ),
    buildPathComponent(
      "supportLightness",
      "Low support pressure",
      supportLightness * 0.08,
      "help",
      "Lower support and procurement pressure keeps internal ownership more plausible."
    ),
    buildPathComponent(
      "functionalComplexity",
      "Functional complexity",
      derivedFactors.functionalComplexity.score * 0.2,
      "hurt",
      "High functional complexity increases the bespoke implementation burden."
    ),
    buildPathComponent(
      "qualityBurden",
      "Quality burden",
      derivedFactors.qualityBurden.score * 0.16,
      "hurt",
      "High QA and verification pressure drag on a build-first path."
    ),
    buildPathComponent(
      "ownershipBurden",
      "Ownership burden",
      derivedFactors.ownershipBurden.score * 0.14,
      "hurt",
      "Long-term ownership load reduces build fit."
    ),
    buildPathComponent(
      "enterpriseReadiness",
      "Enterprise pressure",
      derivedFactors.enterpriseReadiness.score *
        (scorecard.supportOrProcurementNeed ? 0.12 : 0.05),
      "hurt",
      "Support, procurement, or standardization pressure weakens the build path."
    ),
    buildPathComponent(
      "productionCriticality",
      "Production criticality",
      derivedFactors.productionCriticality *
        (scorecard.supportNeed <= 1 ? 4 : 2),
      "hurt",
      "Production criticality hurts Build when support readiness is limited."
    )
  ];

  const coreComponents = [
    buildPathComponent(
      "coverageScore",
      "Core coverage",
      planFits.core.coverageScore * 0.28,
      "help",
      "Core coverage is strong enough to make the base MUI path credible."
    ),
    buildPathComponent(
      "containedScope",
      "Contained scope",
      containedScopeScore * 0.18,
      "help",
      "Contained scope makes MUI Core more plausible."
    ),
    buildPathComponent(
      "supportRequirement",
      "Low support requirement",
      supportLightness * 0.12,
      "help",
      "Low support expectations fit MUI Core better than higher tiers."
    ),
    buildPathComponent(
      "productionCriticality",
      "Lower production criticality",
      (100 - scorecard.productionCriticalityNormalized * 100) * 0.08,
      "help",
      "Lower operational sensitivity keeps Core viable."
    ),
    buildPathComponent(
      "advancedFeatureDemand",
      "Contained advanced demand",
      (100 - featureDemand) * 0.1,
      "help",
      "Lower advanced-feature demand helps the Core path."
    ),
    buildPathComponent(
      "existingMuiUsage",
      "Existing MUI usage",
      scorecard.muiUsage * 10,
      "help",
      "Existing MUI usage lowers adoption friction for Core."
    ),
    buildPathComponent(
      "supportGap",
      "Support gap",
      planFits.core.supportGap * 28,
      "hurt",
      "A larger support gap weakens the Core path."
    ),
    buildPathComponent(
      "coverageGap",
      "Coverage gap",
      planFits.core.coverageGap * 26,
      "hurt",
      "Coverage gaps hurt Core when requirements move beyond contained scope."
    ),
    buildPathComponent(
      "integrationRisk",
      "Integration risk",
      planFits.core.integrationRisk * 22,
      "hurt",
      "Integration risk drags on Core fit."
    ),
    buildPathComponent(
      "muiAdoptionBurden",
      "Adoption burden",
      scorecard.muiAdoptionBurden * 20,
      "hurt",
      "Adopting Core still creates adaptation work in this context."
    ),
    buildPathComponent(
      "enterpriseReadiness",
      "Enterprise pressure",
      derivedFactors.enterpriseReadiness.score * 0.12,
      "hurt",
      "Enterprise-level support or standardization pressure pulls away from Core."
    )
  ];

  const premiumComponents = [
    buildPathComponent(
      "coverageScore",
      "Premium coverage",
      planFits.premium.coverageScore * 0.3,
      "help",
      "Premium coverage aligns well with the required feature set."
    ),
    buildPathComponent(
      "featureDemand",
      "Advanced feature demand",
      featureDemand * 0.16,
      "help",
      "Advanced feature demand makes Premium more relevant."
    ),
    buildPathComponent(
      "functionalComplexity",
      "Functional complexity",
      derivedFactors.functionalComplexity.score * 0.1,
      "help",
      "Moderate to high complexity favors Premium over Core."
    ),
    buildPathComponent(
      "advancedDataNeed",
      "Advanced data needs",
      advancedDataNeed * 0.12,
      "help",
      "Data-grid, scheduler, or feature-heavy needs favor Premium."
    ),
    buildPathComponent(
      "supportRequirement",
      "Mid-tier support fit",
      clamp(scorecard.supportNeed * 34, 0, 100) * 0.06,
      "help",
      "Medium support needs can justify Premium without requiring Enterprise."
    ),
    buildPathComponent(
      "muiLeverage",
      "MUI leverage",
      scorecard.muiLeverage * 18,
      "help",
      "Existing MUI leverage improves the Premium case."
    ),
    buildPathComponent(
      "containedScope",
      "Contained scope",
      containedScopeScore * 0.14,
      "hurt",
      "Contained scope weakens the case for Premium."
    ),
    buildPathComponent(
      "enterpriseReadiness",
      "Enterprise pull",
      derivedFactors.enterpriseReadiness.score * 0.1,
      "hurt",
      "Higher enterprise pressure can pull the decision toward Enterprise instead."
    ),
    buildPathComponent(
      "muiAdoptionBurden",
      "Adoption burden",
      scorecard.muiAdoptionBurden * 18,
      "hurt",
      "Adoption burden can still drag on Premium."
    )
  ];

  const enterpriseComponents = [
    buildPathComponent(
      "coverageScore",
      "Enterprise coverage",
      planFits.enterprise.coverageScore * 0.24,
      "help",
      "Enterprise coverage is strong enough to support the evaluated workload."
    ),
    buildPathComponent(
      "enterpriseReadiness",
      "Enterprise readiness",
      derivedFactors.enterpriseReadiness.score * 0.22,
      "help",
      "Support, organizational footprint, and standardization pressure favor Enterprise."
    ),
    buildPathComponent(
      "supportRequirement",
      "Support requirement",
      clamp(scorecard.supportNeed * 34, 0, 100) * 0.16,
      "help",
      "Higher support and procurement expectations favor Enterprise."
    ),
    buildPathComponent(
      "productionCriticality",
      "Production criticality",
      scorecard.productionCriticalityNormalized * 100 * 0.12,
      "help",
      "Higher production criticality raises the value of Enterprise readiness."
    ),
    buildPathComponent(
      "standardizationContext",
      "Standardization context",
      standardizationContext * 0.12,
      "help",
      "Platform-scale standardization pressure helps Enterprise."
    ),
    buildPathComponent(
      "existingMuiUsage",
      "Existing MUI usage",
      scorecard.muiUsage * 12,
      "help",
      "Existing MUI usage lowers the activation cost for Enterprise."
    ),
    buildPathComponent(
      "containedScope",
      "Contained scope",
      containedScopeScore * 0.16,
      "hurt",
      "Contained scope drags on Enterprise unless the platform footprint clearly justifies it."
    ),
    buildPathComponent(
      "lowSupportRequirement",
      "Low support requirement",
      supportLightness * 0.14,
      "hurt",
      "Low support pressure weakens the Enterprise case."
    ),
    buildPathComponent(
      "lowCriticality",
      "Low production criticality",
      (100 - scorecard.productionCriticalityNormalized * 100) * 0.12,
      "hurt",
      "Low production criticality weakens the Enterprise case."
    ),
    buildPathComponent(
      "coverageWeakness",
      "Coverage weakness",
      planFits.enterprise.coverageGap * 20,
      "hurt",
      "Enterprise still needs strong coverage to justify itself."
    )
  ];

  const enterpriseEligible =
    enterpriseScore >= 52 ||
    scorecard.enterpriseFitStrong ||
    input.supportRequirement === "procurement-sla" ||
    input.componentStandardizationGoal === "platform-standard";
  const premiumEligible =
    premiumScore >= 42 ||
    input.primaryUseCase === "data-grid" ||
    input.primaryUseCase === "scheduler" ||
    input.advancedFeatures.length >= 2;

  return {
    build: buildPathFitEntry("build", PATH_LABELS.build, buildScore, buildComponents),
    core: buildPathFitEntry("core", PATH_LABELS.core, coreScore, coreComponents),
    premium: buildPathFitEntry(
      "premium",
      PATH_LABELS.premium,
      premiumScore,
      premiumComponents,
      premiumEligible
    ),
    enterprise: buildPathFitEntry(
      "enterprise",
      PATH_LABELS.enterprise,
      enterpriseScore,
      enterpriseComponents,
      enterpriseEligible
    )
  };
}

function buildDeterministicRecommendation(input, derivedFactors, scorecard, pathFits) {
  const rankedPaths = Object.values(pathFits).sort(
    (left, right) => right.score - left.score
  );
  const eligiblePaths = rankedPaths.filter((path) => path.eligible);
  const winner = eligiblePaths[0] ?? rankedPaths[0];
  const runnerUp =
    eligiblePaths.find((path) => path.key !== winner.key) ?? rankedPaths[1] ?? winner;
  const scoreGap = clamp(roundTo(winner.score - runnerUp.score), 0, 100);
  const strongStrengthCount = winner.components.filter(
    (component) => component.signal === "help" && component.impact >= 8
  ).length;
  const strongDragCount = winner.components.filter(
    (component) => component.signal === "hurt" && component.impact >= 8
  ).length;
  const signalConsistencyBonus = clamp(
    strongStrengthCount * 4 +
      Math.max(0, winner.strengths.length - winner.drags.length) * 2 +
      (winner.level === "high" ? 4 : winner.level === "medium" ? 2 : 0),
    0,
    18
  );
  const ambiguityPenalty = clamp(
    (scoreGap < 4 ? 14 : scoreGap < 8 ? 10 : scoreGap < 12 ? 6 : 0) +
      Math.max(0, strongDragCount - strongStrengthCount) * 2,
    0,
    18
  );
  const confidenceScore = clamp(
    Math.round(46 + scoreGap * 2.2 + signalConsistencyBonus - ambiguityPenalty),
    35,
    94
  );
  const confidenceLevel =
    confidenceScore >= 78
      ? "high"
      : confidenceScore >= 62
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

function buildDiagnostics(input, scorecard, pathFits, evidenceBasis) {
  return {
    effectiveMuiPlan: scorecard.effectiveMuiPlan,
    containedScope: scorecard.containedScope,
    buildFriendlyContext: scorecard.buildFriendlyContext,
    enterpriseFitStrong: scorecard.enterpriseFitStrong,
    scorecard: {
      buildTierScore: scorecard.buildTierScore,
      coreTierScore: scorecard.coreTierScore,
      premiumTierScore: scorecard.premiumTierScore,
      enterpriseTierScore: scorecard.enterpriseTierScore,
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
      }))
  };
}

function buildResult(input) {
  const derivedFactors = buildDerivedFactors(input);
  const scorecard = buildScorecard(input, derivedFactors);
  const planFits = scorecard.planFits;
  const pathFits = buildPathFits(input, derivedFactors, scorecard, planFits);
  const evidenceBasis = buildEvidenceBasis(input, scorecard);
  const { recommendation, confidence } = buildDeterministicRecommendation(
    input,
    derivedFactors,
    scorecard,
    pathFits
  );
  const diagnostics = buildDiagnostics(
    input,
    scorecard,
    pathFits,
    evidenceBasis
  );

  return {
    modelVersion: MODEL_VERSION,
    calibrationVersion: CALIBRATION_VERSION,
    derivedFactors,
    planFits,
    pathFits,
    recommendation,
    confidence,
    diagnostics,
    assumptions: [
      "This is a deterministic fit model.",
      "It does not estimate delivery dates or TCO.",
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

  const normalized = normalizeInput(parsed.value);
  const validation = validatePayload(normalized, parsed.value);

  if (validation.errors.length > 0) {
    return badRequest("Validation failed.", validation.errors);
  }

  return jsonResponse(200, buildResult(normalized));
};
