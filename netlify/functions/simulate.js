const ITERATIONS = 10000;

const EXISTING_MUI_USAGE = new Set(['none', 'some', 'standardized']);
const DESIGN_SYSTEM_MATURITY = new Set(['low', 'medium', 'high']);
const PRIMARY_USE_CASES = new Set([
  'data-grid',
  'charts',
  'date-pickers',
  'tree-view',
  'scheduler',
  'multi-component',
]);
const PRESSURE_LEVELS = new Set(['low', 'medium', 'high']);
const CAPACITY_LEVELS = new Set(['constrained', 'manageable', 'ample']);
const SUPPORT_REQUIREMENTS = new Set(['community', 'standard', 'priority', 'procurement-sla']);
const MAINTENANCE_HORIZONS = new Set([12, 24, 36]);
const COMPARED_MUI_PLANS = new Set(['premium', 'enterprise', 'auto']);
const ADVANCED_FEATURES = new Set([
  'virtualization',
  'inline-editing',
  'server-side-data',
  'keyboard-navigation',
  'exporting',
  'drag-and-drop',
  'custom-rendering',
  'timezone-logic',
]);

const USE_CASE_COMPLEXITY = {
  'data-grid': 4.6,
  charts: 3.2,
  'date-pickers': 2.4,
  'tree-view': 3.4,
  scheduler: 5.0,
  'multi-component': 4.8,
};

const ADVANCED_FEATURE_WEIGHTS = {
  virtualization: 1.4,
  'inline-editing': 1.1,
  'server-side-data': 1.1,
  'keyboard-navigation': 0.8,
  exporting: 0.5,
  'drag-and-drop': 1.0,
  'custom-rendering': 1.0,
  'timezone-logic': 0.8,
};

const PRESSURE_INDEX = {
  low: 1,
  medium: 2,
  high: 3,
};

const CAPACITY_INDEX = {
  constrained: 1,
  manageable: 2,
  ample: 3,
};

const SUPPORT_INDEX = {
  community: 0,
  standard: 1,
  priority: 2,
  'procurement-sla': 3,
};

const MUI_USAGE_INDEX = {
  none: 0,
  some: 1,
  standardized: 2,
};

const MATURITY_INDEX = {
  low: 1,
  medium: 2,
  high: 3,
};

const PLAN_CONFIG = {
  core: {
    key: 'core',
    label: 'MUI Core',
    recommendationLabel: 'MUI Core',
    licensePerDeveloperYear: 0,
    baseAdjustment: 0.9,
    featureCapacity: 1.8,
    supportCredit: 0.0,
    useCasePenalty: {
      'data-grid': 2.8,
      charts: 1.2,
      'date-pickers': 0.4,
      'tree-view': 1.1,
      scheduler: 3.2,
      'multi-component': 2.4,
    },
  },
  premium: {
    key: 'premium',
    label: 'MUI X Premium',
    recommendationLabel: 'Premium',
    licensePerDeveloperYear: 1800,
    baseAdjustment: -0.4,
    featureCapacity: 4.2,
    supportCredit: 0.6,
    useCasePenalty: {
      'data-grid': 0.3,
      charts: 0.5,
      'date-pickers': 0.1,
      'tree-view': 0.2,
      scheduler: 0.8,
      'multi-component': 0.4,
    },
  },
  enterprise: {
    key: 'enterprise',
    label: 'MUI X Enterprise',
    recommendationLabel: 'Enterprise',
    licensePerDeveloperYear: 3600,
    baseAdjustment: -0.6,
    featureCapacity: 5.5,
    supportCredit: 1.2,
    useCasePenalty: {
      'data-grid': 0.2,
      charts: 0.4,
      'date-pickers': 0.1,
      'tree-view': 0.1,
      scheduler: 0.5,
      'multi-component': 0.3,
    },
  },
};

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  };
}

function badRequest(message, details) {
  return jsonResponse(400, {
    error: message,
    ...(details ? { details } : {}),
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
  const index = Math.min(sortedValues.length - 1, Math.max(0, Math.floor((sortedValues.length - 1) * ratio)));
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

  const standard = Math.sqrt(-2 * Math.log(first)) * Math.cos(2 * Math.PI * second);
  return mean + standard * deviation;
}

function parseJsonBody(event) {
  if (!event?.body || typeof event.body !== 'string') {
    return { error: 'Invalid JSON body.' };
  }

  const rawBody = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;

  try {
    const parsed = JSON.parse(rawBody);

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { error: 'Invalid JSON body.' };
    }

    return { value: parsed };
  } catch {
    return { error: 'Invalid JSON body.' };
  }
}

function validateInteger(value, label, { minimum = 0, allowZero = false } = {}) {
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

  return '';
}

function validateNumber(value, label, { minimum = 0 } = {}) {
  if (!Number.isFinite(value)) {
    return `${label} must be a number.`;
  }

  if (value <= minimum) {
    return `${label} must be greater than ${minimum}.`;
  }

  return '';
}

function validateEnum(value, label, allowedValues) {
  return allowedValues.has(value) ? '' : `${label} is invalid.`;
}

function normalizeInput(payload) {
  const advancedFeatures = Array.isArray(payload.advancedFeatures)
    ? [...new Set(payload.advancedFeatures.filter((feature) => typeof feature === 'string'))]
    : [];

  return {
    frontendDevelopers: Number(payload.frontendDevelopers),
    reactApps: Number(payload.reactApps),
    existingMuiUsage: payload.existingMuiUsage,
    designSystemMaturity: payload.designSystemMaturity,
    primaryUseCase: payload.primaryUseCase,
    dataHeavyScreens: Number(payload.dataHeavyScreens),
    advancedFeatures,
    deadlinePressure: payload.deadlinePressure,
    internalCapacity: payload.internalCapacity,
    delayImpact: payload.delayImpact,
    accessibilityStrictness: payload.accessibilityStrictness,
    maintenanceHorizonMonths: Number(payload.maintenanceHorizonMonths),
    supportRequirement: payload.supportRequirement,
    turnoverRisk: payload.turnoverRisk,
    engineerCostPerDay: Number(payload.engineerCostPerDay),
    licensedDevelopers: Number(payload.licensedDevelopers),
    comparedMuiPlan: payload.comparedMuiPlan,
  };
}

function validatePayload(payload) {
  const normalized = normalizeInput(payload);
  const errors = [];

  errors.push(validateInteger(normalized.frontendDevelopers, 'frontendDevelopers', { minimum: 0 }));
  errors.push(validateInteger(normalized.reactApps, 'reactApps', { minimum: 0 }));
  errors.push(validateEnum(normalized.existingMuiUsage, 'existingMuiUsage', EXISTING_MUI_USAGE));
  errors.push(validateEnum(normalized.designSystemMaturity, 'designSystemMaturity', DESIGN_SYSTEM_MATURITY));
  errors.push(validateEnum(normalized.primaryUseCase, 'primaryUseCase', PRIMARY_USE_CASES));
  errors.push(validateInteger(normalized.dataHeavyScreens, 'dataHeavyScreens', { minimum: 0, allowZero: true }));
  errors.push(validateEnum(normalized.deadlinePressure, 'deadlinePressure', PRESSURE_LEVELS));
  errors.push(validateEnum(normalized.internalCapacity, 'internalCapacity', CAPACITY_LEVELS));
  errors.push(validateEnum(normalized.delayImpact, 'delayImpact', PRESSURE_LEVELS));
  errors.push(validateEnum(normalized.accessibilityStrictness, 'accessibilityStrictness', PRESSURE_LEVELS));
  errors.push(validateEnum(normalized.supportRequirement, 'supportRequirement', SUPPORT_REQUIREMENTS));
  errors.push(validateEnum(normalized.turnoverRisk, 'turnoverRisk', PRESSURE_LEVELS));
  errors.push(validateNumber(normalized.engineerCostPerDay, 'engineerCostPerDay', { minimum: 0 }));
  errors.push(validateInteger(normalized.licensedDevelopers, 'licensedDevelopers', { minimum: 0 }));
  errors.push(validateEnum(normalized.comparedMuiPlan, 'comparedMuiPlan', COMPARED_MUI_PLANS));

  if (!MAINTENANCE_HORIZONS.has(normalized.maintenanceHorizonMonths)) {
    errors.push('maintenanceHorizonMonths is invalid.');
  }

  if (!Array.isArray(payload.advancedFeatures)) {
    errors.push('advancedFeatures must be an array.');
  } else if (normalized.advancedFeatures.some((feature) => !ADVANCED_FEATURES.has(feature))) {
    errors.push('advancedFeatures contains an invalid value.');
  }

  return {
    errors: errors.filter(Boolean),
    normalized,
  };
}

function buildScorecard(input) {
  const useCaseComplexity = USE_CASE_COMPLEXITY[input.primaryUseCase];
  const advancedFeatureWeight = input.advancedFeatures.reduce(
    (sum, feature) => sum + ADVANCED_FEATURE_WEIGHTS[feature],
    0,
  );
  const featureCount = input.advancedFeatures.length;
  const accessibility = PRESSURE_INDEX[input.accessibilityStrictness];
  const deadlinePressure = PRESSURE_INDEX[input.deadlinePressure];
  const delayImpact = PRESSURE_INDEX[input.delayImpact];
  const turnoverRisk = PRESSURE_INDEX[input.turnoverRisk];
  const supportNeed = SUPPORT_INDEX[input.supportRequirement];
  const capacity = CAPACITY_INDEX[input.internalCapacity];
  const muiUsage = MUI_USAGE_INDEX[input.existingMuiUsage];
  const maturity = MATURITY_INDEX[input.designSystemMaturity];
  const horizonYears = input.maintenanceHorizonMonths / 12;
  const teamScale = bucket(input.frontendDevelopers, 3, 8);
  const appScale = bucket(input.reactApps, 1, 4);
  const screenLoad = Math.min(input.dataHeavyScreens, 12);

  const advancedNeedsRaw =
    useCaseComplexity * 3 +
    advancedFeatureWeight * 2.5 +
    featureCount * 1.1 +
    screenLoad * 0.6 +
    accessibility * 2;
  const advancedNeedsScore = clamp((advancedNeedsRaw / 42) * 100, 0, 100);

  const icpRaw =
    advancedNeedsRaw +
    supportNeed * 5 +
    teamScale * 4 +
    appScale * 4 +
    muiUsage * 3 +
    horizonYears * 2;
  const icpScore = clamp((icpRaw / 74) * 100, 0, 100);

  const enterpriseTierScore = clamp(
    18 +
      advancedNeedsScore * 0.34 +
      supportNeed * 15 +
      teamScale * 6 +
      appScale * 6 +
      delayImpact * 4 +
      deadlinePressure * 3 +
      accessibility * 3,
    0,
    100,
  );

  const premiumTierScore = clamp(
    28 +
      advancedNeedsScore * 0.48 +
      muiUsage * 8 +
      teamScale * 4 +
      appScale * 3 +
      Math.min(supportNeed, 2) * 5,
    0,
    100,
  );

  const coreTierScore = clamp(
    42 +
      muiUsage * 12 +
      (advancedNeedsScore < 42 ? 20 : advancedNeedsScore < 58 ? 8 : -16) +
      (supportNeed <= 1 ? 8 : -10) +
      (maturity >= 2 ? 6 : -4),
    0,
    100,
  );

  const buildTierScore = clamp(
    24 +
      (advancedNeedsScore < 38 ? 24 : advancedNeedsScore < 55 ? 8 : -12) +
      (maturity === 3 ? 22 : maturity === 2 ? 8 : -10) +
      (capacity === 3 ? 14 : capacity === 2 ? 5 : -12) +
      (supportNeed === 0 ? 14 : supportNeed === 1 ? 4 : -10) -
      appScale * 4 -
      teamScale * 3 -
      turnoverRisk * 4,
    0,
    100,
  );

  const simpleScope =
    useCaseComplexity <= 3 &&
    featureCount <= 2 &&
    advancedFeatureWeight <= 2.2 &&
    input.dataHeavyScreens <= 3;
  const advancedNeeds = advancedNeedsScore >= 55 || useCaseComplexity >= 4.5 || featureCount >= 3;
  const enterpriseFitStrong = enterpriseTierScore >= 72;
  const lowSupportNeed = supportNeed <= 1;
  const supportOrProcurementNeed = supportNeed >= 2;
  const muiAdoptionUseful = muiUsage > 0 || input.reactApps >= 2;

  const icpReasons = [];

  if (advancedNeeds) {
    icpReasons.push('Advanced component demands materially increase delivery and maintenance risk.');
  }

  if (supportOrProcurementNeed) {
    icpReasons.push('Commercial support expectations make vendor-backed delivery risk reduction more relevant.');
  }

  if (input.reactApps >= 2 || input.frontendDevelopers >= 4) {
    icpReasons.push('The component affects a meaningful React footprint, so reuse and standardization matter.');
  }

  if (muiUsage > 0) {
    icpReasons.push('Existing MUI usage lowers adoption friction for a packaged path.');
  }

  if (icpReasons.length === 0) {
    icpReasons.push('The workload looks narrow enough that build-vs-buy fit is not strongly tilted by the rules.');
  }

  const autoSelectedMuiPlan = enterpriseFitStrong && supportOrProcurementNeed
    ? 'enterprise'
    : advancedNeeds
      ? 'premium'
      : 'core';
  const effectiveMuiPlan = input.comparedMuiPlan === 'auto' ? autoSelectedMuiPlan : input.comparedMuiPlan;

  return {
    useCaseComplexity,
    advancedFeatureWeight,
    featureCount,
    accessibility,
    deadlinePressure,
    delayImpact,
    turnoverRisk,
    supportNeed,
    capacity,
    muiUsage,
    maturity,
    horizonYears,
    teamScale,
    appScale,
    screenLoad,
    advancedNeedsScore,
    icpScore,
    enterpriseTierScore,
    premiumTierScore,
    coreTierScore,
    buildTierScore,
    simpleScope,
    advancedNeeds,
    enterpriseFitStrong,
    lowSupportNeed,
    supportOrProcurementNeed,
    muiAdoptionUseful,
    autoSelectedMuiPlan,
    effectiveMuiPlan,
    icpFitSegment: icpScore >= 70 ? 'strong' : icpScore >= 50 ? 'moderate' : 'limited',
    icpReasons,
  };
}

function runSimulation(input, scorecard) {
  const rng = createRng(JSON.stringify({
    ...input,
    advancedFeatures: [...input.advancedFeatures].sort(),
    effectiveMuiPlan: scorecard.effectiveMuiPlan,
  }));
  const muiPlan = PLAN_CONFIG[scorecard.effectiveMuiPlan];

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

  const buildVelocity =
    ({ constrained: 0.74, manageable: 0.98, ample: 1.18 })[input.internalCapacity] *
    (input.frontendDevelopers >= 8 ? 1.08 : input.frontendDevelopers >= 4 ? 1 : 0.92);
  const muiVelocity =
    ({ constrained: 0.84, manageable: 1.08, ample: 1.25 })[input.internalCapacity] *
    (input.frontendDevelopers >= 8 ? 1.08 : input.frontendDevelopers >= 4 ? 1 : 0.94);

  for (let iteration = 0; iteration < ITERATIONS; iteration += 1) {
    const buildBaseEngineering =
      3.4 +
      scorecard.useCaseComplexity * 1.8 +
      scorecard.advancedFeatureWeight * 0.95 +
      scorecard.featureCount * 0.45 +
      scorecard.screenLoad * 0.22 +
      scorecard.accessibility * 0.45 +
      scorecard.appScale * 0.4 +
      ({ low: 1.8, medium: 0.8, high: -0.9 })[input.designSystemMaturity] +
      ({ constrained: 1.6, manageable: 0.6, ample: 0 })[input.internalCapacity] +
      ({ low: 0, medium: 0.5, high: 1.0 })[input.turnoverRisk];

    const buildRework = Math.max(
      0,
      randomNormal(
        rng,
        0.75 + scorecard.advancedFeatureWeight * 0.22 + scorecard.turnoverRisk * 0.25 + scorecard.accessibility * 0.18,
        0.65,
      ),
    );
    const buildEngineering = Math.max(2, buildBaseEngineering * (1 + randomNormal(rng, 0, 0.14)) + buildRework);

    const buildSlip = Math.max(
      0.5,
      randomNormal(
        rng,
        1.4 + scorecard.deadlinePressure * 0.55 + scorecard.delayImpact * 0.24 + scorecard.appScale * 0.2,
        0.85,
      ),
    );
    const buildLaunch = Math.max(2, buildEngineering / buildVelocity + buildSlip + scorecard.appScale * 0.7);

    const muiBaseEngineering =
      2.1 +
      scorecard.useCaseComplexity * 1.05 +
      scorecard.advancedFeatureWeight * 0.55 +
      scorecard.featureCount * 0.25 +
      scorecard.screenLoad * 0.12 +
      scorecard.accessibility * 0.28 +
      scorecard.appScale * 0.22 +
      ({ none: 1.4, some: 0.5, standardized: -0.35 })[input.existingMuiUsage] +
      muiPlan.baseAdjustment +
      Math.max(0, scorecard.advancedFeatureWeight - muiPlan.featureCapacity) * 0.55 +
      muiPlan.useCasePenalty[input.primaryUseCase];

    const muiRework = Math.max(
      0,
      randomNormal(
        rng,
        0.4 +
          Math.max(0, scorecard.advancedFeatureWeight - muiPlan.featureCapacity * 0.85) * 0.18 +
          scorecard.accessibility * 0.1 -
          muiPlan.supportCredit * 0.1,
        0.45,
      ),
    );
    const muiEngineering = Math.max(1.5, muiBaseEngineering * (1 + randomNormal(rng, 0, 0.11)) + muiRework);

    const muiSlip = Math.max(
      0.35,
      randomNormal(
        rng,
        0.9 +
          scorecard.deadlinePressure * 0.34 +
          scorecard.appScale * 0.15 +
          Math.max(0, scorecard.advancedFeatureWeight - muiPlan.featureCapacity * 0.8) * 0.09 -
          muiPlan.supportCredit * 0.16,
        0.55,
      ),
    );
    const muiLaunch = Math.max(1.5, muiEngineering / muiVelocity + muiSlip + scorecard.appScale * 0.45);

    const buildMaintenanceBase =
      scorecard.horizonYears *
      (0.8 +
        scorecard.useCaseComplexity * 0.35 +
        scorecard.advancedFeatureWeight * 0.22 +
        scorecard.featureCount * 0.12 +
        scorecard.turnoverRisk * 0.22 +
        scorecard.accessibility * 0.15 -
        (scorecard.maturity - 1) * 0.25);
    const buildMaintenance = Math.max(0.8, buildMaintenanceBase * (1 + randomNormal(rng, 0, 0.2)));

    const muiMaintenanceBase =
      scorecard.horizonYears *
      (0.45 +
        scorecard.useCaseComplexity * 0.18 +
        Math.max(0, scorecard.advancedFeatureWeight - muiPlan.featureCapacity * 0.35) * 0.16 +
        scorecard.featureCount * 0.06 +
        scorecard.accessibility * 0.08 +
        scorecard.turnoverRisk * 0.12 -
        muiPlan.supportCredit * 0.14 -
        scorecard.muiUsage * 0.08);
    const muiMaintenance = Math.max(0.4, muiMaintenanceBase * (1 + randomNormal(rng, 0, 0.16)));

    const laborCostPerWeek = input.engineerCostPerDay * 5;
    const buildTotalCost = (buildEngineering + buildMaintenance) * laborCostPerWeek;
    const muiLicenseCost = muiPlan.licensePerDeveloperYear * input.licensedDevelopers * scorecard.horizonYears;
    const muiTotalCost = (muiEngineering + muiMaintenance) * laborCostPerWeek + muiLicenseCost;

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
    label: 'Build in-house',
    medianLaunchWeeks: roundTo(percentile(buildLaunchWeeks, 0.5)),
    p90LaunchWeeks: roundTo(percentile(buildLaunchWeeks, 0.9)),
    medianEngineeringWeeks: roundTo(percentile(buildEngineeringWeeks, 0.5)),
    p90EngineeringWeeks: roundTo(percentile(buildEngineeringWeeks, 0.9)),
    medianTco: integerCurrency(percentile(buildTco, 0.5)),
    p90Tco: integerCurrency(percentile(buildTco, 0.9)),
  };

  const muiPath = {
    label: muiPlan.label,
    plan: muiPlan.key,
    medianLaunchWeeks: roundTo(percentile(muiLaunchWeeks, 0.5)),
    p90LaunchWeeks: roundTo(percentile(muiLaunchWeeks, 0.9)),
    medianEngineeringWeeks: roundTo(percentile(muiEngineeringWeeks, 0.5)),
    p90EngineeringWeeks: roundTo(percentile(muiEngineeringWeeks, 0.9)),
    medianTco: integerCurrency(percentile(muiTco, 0.5)),
    p90Tco: integerCurrency(percentile(muiTco, 0.9)),
  };

  const comparison = {
    probabilityMuiFaster: percentage(muiFasterCount / ITERATIONS),
    probabilityMuiLowerTco: percentage(muiLowerTcoCount / ITERATIONS),
    probabilityBuildExceeds20Weeks: percentage(buildExceeds20WeeksCount / ITERATIONS),
    probabilityMuiExceeds20Weeks: percentage(muiExceeds20WeeksCount / ITERATIONS),
    launchWeekDeltaMedian: roundTo(muiPath.medianLaunchWeeks - buildPath.medianLaunchWeeks),
    engineeringWeekDeltaMedian: roundTo(muiPath.medianEngineeringWeeks - buildPath.medianEngineeringWeeks),
    tcoDeltaMedian: integerCurrency(muiPath.medianTco - buildPath.medianTco),
  };

  return {
    buildPath,
    muiPath,
    comparison,
  };
}

function buildRecommendation(input, scorecard, simulation) {
  const comparison = simulation.comparison;
  const selectedPlan = PLAN_CONFIG[scorecard.effectiveMuiPlan];
  const muiDeliveryRiskFavored =
    comparison.probabilityMuiFaster >= 55 ||
    comparison.probabilityBuildExceeds20Weeks - comparison.probabilityMuiExceeds20Weeks >= 10;
  const buildStillCompetitive =
    simulation.buildPath.medianLaunchWeeks <= simulation.muiPath.medianLaunchWeeks + 1.5 &&
    simulation.buildPath.medianTco <= simulation.muiPath.medianTco * 1.08;

  let option = 'Build in-house';
  let summary =
    'The modeled tradeoff stays close enough that owning the component internally looks reasonable for this input set.';

  if (scorecard.simpleScope && scorecard.lowSupportNeed && input.designSystemMaturity === 'high' && buildStillCompetitive) {
    option = 'Build in-house';
    summary =
      'The scope is simple, support expectations are low, and the design-system baseline is strong enough that an internal build remains credible in this model.';
  } else if (
    scorecard.effectiveMuiPlan === 'enterprise' &&
    scorecard.enterpriseFitStrong &&
    scorecard.supportOrProcurementNeed &&
    muiDeliveryRiskFavored
  ) {
    option = 'Enterprise';
    summary =
      'Enterprise fit is strong, support expectations are elevated, and the simulation reduces launch-risk enough to justify the higher-tier packaged path.';
  } else if (scorecard.effectiveMuiPlan === 'premium' && scorecard.advancedNeeds && !scorecard.supportOrProcurementNeed) {
    option = 'Premium';
    summary =
      'Advanced component needs are present, but the rules do not show a strong requirement for enterprise procurement or support overhead.';
  } else if (scorecard.effectiveMuiPlan === 'core' && scorecard.simpleScope && scorecard.muiAdoptionUseful) {
    option = 'MUI Core';
    summary =
      'The requirements stay relatively simple and existing MUI usage makes a lighter packaged path easier to absorb.';
  } else if (comparison.probabilityMuiFaster >= 55 || comparison.probabilityMuiLowerTco >= 55) {
    option = selectedPlan.recommendationLabel;
    summary =
      'The simulation leans toward the packaged path on either delivery speed or total cost, so the selected MUI tier is the safer default for this scenario.';
  }

  const confidenceMargin =
    Math.abs(comparison.probabilityMuiFaster - 50) * 0.45 +
    Math.abs(comparison.probabilityMuiLowerTco - 50) * 0.35 +
    Math.abs(scorecard.buildTierScore - scorecard.enterpriseTierScore) * 0.08;
  const confidenceScore = clamp(
    Math.round(
      52 +
        confidenceMargin +
        (option === 'Build in-house' && scorecard.simpleScope ? 8 : 0) +
        (option === 'Enterprise' && scorecard.enterpriseFitStrong ? 8 : 0) +
        (option === 'Premium' && scorecard.advancedNeeds ? 6 : 0) +
        (option === 'MUI Core' && scorecard.simpleScope ? 6 : 0),
    ),
    52,
    92,
  );

  return {
    recommendation: {
      option,
      summary,
    },
    confidence: {
      score: confidenceScore,
      level: confidenceScore >= 78 ? 'high' : confidenceScore >= 64 ? 'moderate' : 'qualified',
      rationale:
        'Confidence reflects how strongly the rules and simulation agree, not a guarantee that the path will win in every execution scenario.',
    },
  };
}

function buildResult(input) {
  const scorecard = buildScorecard(input);
  const simulation = runSimulation(input, scorecard);
  const recommendation = buildRecommendation(input, scorecard, simulation);

  const assumptions = [
    'The simulation uses 10,000 seeded iterations, so the same validated input returns the same result.',
    'TCO includes internal engineering labor and estimated MUI licensing, but excludes revenue effects, migration effort outside this component, and negotiated vendor discounts.',
    'Launch weeks represent modeled delivery timing under the stated capacity and risk inputs, not guaranteed calendar commitments.',
    `The comparison models ${PLAN_CONFIG[scorecard.effectiveMuiPlan].label} because comparedMuiPlan was "${input.comparedMuiPlan}".`,
  ];

  if (input.comparedMuiPlan === 'auto') {
    assumptions.push(`Auto-selection chose the ${PLAN_CONFIG[scorecard.autoSelectedMuiPlan].label} tier from the rules-based tier score.`);
  }

  return {
    ...recommendation,
    icpFit: {
      score: roundTo(scorecard.icpScore),
      segment: scorecard.icpFitSegment,
      effectiveMuiPlan: scorecard.effectiveMuiPlan,
      autoSelectedMuiPlan: scorecard.autoSelectedMuiPlan,
      tierScores: {
        enterprise: roundTo(scorecard.enterpriseTierScore),
        premium: roundTo(scorecard.premiumTierScore),
        core: roundTo(scorecard.coreTierScore),
        build: roundTo(scorecard.buildTierScore),
      },
      reasons: scorecard.icpReasons,
    },
    buildPath: simulation.buildPath,
    muiPath: simulation.muiPath,
    comparison: simulation.comparison,
    assumptions,
  };
}

export const handler = async (event) => {
  if (event?.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        allow: 'POST',
        'content-type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        error: 'Method not allowed.',
      }),
    };
  }

  const parsedBody = parseJsonBody(event);

  if (parsedBody.error) {
    return badRequest(parsedBody.error);
  }

  const { errors, normalized } = validatePayload(parsedBody.value);

  if (errors.length > 0) {
    return badRequest('Invalid assessment input.', errors);
  }

  return jsonResponse(200, buildResult(normalized));
};
