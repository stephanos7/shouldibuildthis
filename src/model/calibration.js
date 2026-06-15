/*
 * These are heuristic calibration weights.
 * Public software-delivery and quality sources may inform variable selection
 * and risk-shape choices, but these coefficients are not externally certified
 * benchmark parameters and are not trained from a project-history dataset.
 */

export const CALIBRATION_VERSION = "heuristic-v1";

export const DERIVED_FACTOR_WEIGHTS = {
  functionalComplexity: {
    useCaseComplexity: 11.5,
    featureWeight: 8.9,
    performanceSensitivity: 3.2,
    screenLoad: 2.6,
    rowScale: 5.2,
    columnScale: 4.6,
    dataGridRowScale: 2.4,
    schedulerColumnScale: 1.9
  },
  qualityBurden: {
    accessibilityTarget: 18,
    performanceSensitivity: 7.5,
    rowScale: 8.5,
    columnScale: 7.5,
    handoffFriction: 6,
    productionCriticality: 5.5,
    keyboardNavigation: 11,
    virtualization: 13,
    customRendering: 12,
    serverSideData: 10,
    timezoneLogic: 7,
    dragAndDrop: 6,
    i18nLocalization: 8
  },
  deliveryMaturity: {
    base: 28,
    changeLeadTime: 12.5,
    reworkFrequency: 11,
    deadlinePressure: {
      low: 16,
      medium: 4,
      high: -12
    }
  },
  ownershipBurden: {
    base: 12,
    dependentTeams: 7.5,
    ownershipModel: 6.5,
    reactApps: 3.5,
    knowledgeConcentration: 9,
    designSystemMaturity: {
      low: 10,
      medium: 5,
      high: -4
    }
  },
  enterpriseReadiness: {
    supportRequirement: {
      community: 14,
      standard: 30,
      priority: 54,
      "procurement-sla": 72
    },
    reactApps: 4,
    frontendDevelopers: 2.5,
    dependentTeams: 4,
    muiUsage: 8,
    standardizationGoal: 7,
    productionCriticality: 8,
    maintenanceHorizonMonths: {
      12: 6,
      24: 12,
      36: 18
    }
  }
};

export const PLAN_FIT_WEIGHTS = {
  coverageScore: {
    useCaseCoverage: 0.34,
    featureCoverage: 0.23,
    scaleCoverage: 0.17,
    supportFit: 0.14,
    qualityFit: 0.08,
    performanceFit: 0.02,
    adoptionBoost: 1
  },
  featureCoverageDenominator: 5.2,
  scaleCoverageDenominator: 2.2,
  planScaleCapacity: {
    core: 1.6,
    premium: 2.6,
    enterprise: 3.2
  },
  supportFitDenominator: 3.2,
  qualityFitThresholds: {
    core: 0.42,
    premium: 0.68,
    enterprise: 0.8
  },
  qualityFitSlope: 1.1,
  performanceFitMultipliers: {
    core: 0.08,
    premium: 0.04,
    enterprise: 0.025
  },
  baseIntegrationRisk: {
    existingMuiUsage: {
      none: 0.52,
      some: 0.28,
      standardized: 0.14
    },
    customRendering: 0.11,
    dragAndDrop: 0.07,
    timezoneLogic: 0.06,
    i18nLocalization: 0.04,
    rowScaleAtLeast3: 0.06,
    columnScaleAtLeast3: 0.04,
    corePlan: 0.05,
    minimum: 0.08,
    maximum: 0.92,
    integrationRiskScale: 0.48,
    floor: 0.05,
    ceiling: 0.82
  }
};

export const PATH_SCORE_WEIGHTS = {
  buildTierScore: {
    base: 88,
    functionalRisk: 41,
    qualityRisk: 29,
    ownershipRisk: 23,
    deliveryRisk: 24,
    maturityBonus: 6,
    supportNeed: 6,
    rowPenalty: 5,
    columnPenalty: 4
  },
  coreTierScore: {
    base: 26,
    coverageScore: 0.46,
    simpleScopeBonus: 18,
    muiUsageBonus: 8,
    functionalRisk: 12,
    qualityRisk: 8,
    enterpriseNeedPenalty: 24
  },
  premiumTierScore: {
    base: 18,
    coverageScore: 0.42,
    functionalRisk: 12,
    qualityRisk: 10,
    muiUsageBonus: 5,
    simpleScopePenalty: 18,
    enterpriseNeedPenalty: 14
  },
  enterpriseTierScore: {
    base: 8,
    coverageScore: 0.32,
    enterpriseNeed: 34,
    supportNeed: 9,
    appScale: 4,
    teamScale: 3,
    dependentTeams: 1.5,
    productionCriticality: 4,
    simpleScopeBonus: 10
  },
  icpScore: {
    base: 12,
    functionalRisk: 22,
    qualityRisk: 12,
    ownershipRisk: 14,
    enterpriseNeed: 24,
    muiUsage: 4,
    appScale: 3,
    teamScale: 3,
    standardizationIntent: 8,
    dependentTeams: 2,
    simpleScopePenalty: 6
  },
  buildCompetitiveIndex: {
    base: 100,
    functionalRisk: 36,
    qualityRisk: 22,
    ownershipRisk: 22,
    deliveryRisk: 20,
    maturityBonus: 6,
    supportNeed: 7,
    standardizationIntent: 2,
    productionCriticality: 2
  }
};

export const SCENARIO_LEVER_WEIGHTS = {
  internalAbsorption: {
    deliveryStrength: 0.28,
    maturityStrength: 0.18,
    ownershipClarity: 0.18,
    teamFocus: 0.13,
    reworkStability: 0.1,
    knowledgeSpread: 0.08,
    handoffAlignment: 0.04,
    deadlineSlack: 0.08,
    supportLightness: 0.03,
    appFocus: 0.02
  },
  buildReuse: {
    maturityStrength: 0.28,
    ownershipClarity: 0.16,
    teamFocus: 0.1,
    knowledgeSpread: 0.05,
    handoffAlignment: 0.06,
    scopeSimplicity: 0.26,
    featureCount: 0.1,
    standardizationInteraction: 0.08,
    scaleProfile: 0.1
  },
  muiLeverage: {
    coverageScore: 0.42,
    coverageGap: 0.2,
    supportGap: 0.14,
    existingMuiUsage: 0.12,
    handoffAlignment: 0.08,
    standardizationIntent: 0.08,
    packagedAffinity: 0.07,
    featureCount: 0.05,
    performanceRelief: 0.06
  },
  muiAdoptionBurden: {
    existingMuiUsage: {
      none: 0.34,
      some: 0.16,
      standardized: 0.05
    },
    noMuiHighMaturity: 0.1,
    noMuiMediumMaturity: 0.05,
    ownershipModel: {
      "same-product-team": 0.05,
      "frontend-platform-team": 0.09,
      "several-teams-informal": 0.13,
      unclear: 0.15
    },
    customRendering: 0.1,
    dragAndDrop: 0.08,
    timezoneLogic: 0.06,
    i18nLocalization: 0.06,
    handoffAlignment: 0.08,
    performanceBurden: 0.1,
    productionPressureSupportGap: 0.05,
    coverageGap: 0.12
  },
  downsideTailRisk: {
    ownershipRisk: 0.22,
    deliveryRisk: 0.2,
    qualityRisk: 0.17,
    functionalRisk: 0.16,
    dependentTeams: {
      one: 0.12,
      "two-three": 0.32,
      "four-seven": 0.58,
      "eight-plus": 0.78
    },
    dependentTeamsMultiplier: 0.08,
    reactApps: 0.04,
    accessibilityTarget: {
      none: 0.08,
      "wcag-a": 0.18,
      "wcag-aa": 0.38,
      "wcag-aaa-regulated": 0.62
    },
    accessibilityTargetMultiplier: 0.04,
    featureCount: 0.03,
    scaleProfile: 0.03,
    deadlinePressure: {
      low: 0.08,
      medium: 0.36,
      high: 0.72
    },
    deadlinePressureMultiplier: 0.03,
    knowledgeSpread: 0.08,
    handoffAlignment: 0.05,
    performancePressure: 0.03,
    buildPerformanceBurden: 0.05,
    muiPerformanceBurden: 0.03,
    productionPressure: 0.08,
    standardizationIntent: 0.04
  },
  performancePressure: {
    threshold: 0.67,
    readinessThreshold: 0.67,
    burdenThreshold: 0.45
  }
};

export const SIMULATION_CALIBRATION = {
  build: {
    engineeringMeanWeeks: {
      base: 3.4,
      functionalRisk: 11.8,
      qualityRisk: 7.4,
      ownershipRisk: 6.6,
      deliveryRisk: 5.2,
      enterpriseNeed: 1.1,
      largeScaleAdjustment: 0.9,
      minimum: 2.4
    },
    engineeringFloorWeeks: 2,
    slipFloorWeeks: 0.6,
    engineeringVariance: {
      base: 0.08,
      functionalRisk: 0.11,
      qualityRisk: 0.08,
      ownershipRisk: 0.07,
      deliveryRisk: 0.06,
      minimum: 0.06,
      maximum: 0.36
    },
    reworkMeanWeeks: {
      base: 0.7,
      functionalRisk: 2.6,
      qualityRisk: 2,
      ownershipRisk: 1.5,
      deliveryRisk: 1,
      largeScaleAdjustment: 0.4,
      minimum: 0.35
    },
    slipMeanWeeks: {
      base: 1.5,
      deliveryRisk: 2.3,
      functionalRisk: 1.2,
      qualityRisk: 0.8,
      ownershipRisk: 0.6,
      enterpriseNeed: 0.2,
      largeScaleAdjustment: 0.3,
      minimum: 0.5
    },
    launch: {
      minimumWeeks: 2,
      appScaleOverheadWeeks: 0.65
    },
    maintenanceWeeks: {
      base: 0.95,
      functionalRisk: 2.8,
      qualityRisk: 1.7,
      ownershipRisk: 2,
      deliveryRisk: 0.55,
      largeScaleAdjustment: 0.18,
      minimumBase: 0.75,
      minimum: 0.8
    }
  },
  mui: {
    engineeringMeanWeeks: {
      base: 2.2,
      functionalRisk: 5.2,
      qualityRisk: 2.9,
      deliveryRisk: 1.5,
      integrationRisk: 2.4,
      coverageGap: 3.8,
      supportGap: 1.5,
      offset: 1,
      coverageShieldReduction: 0.18,
      adoptionBurden: 2.4,
      leverageReduction: 1.6,
      coverageShieldAdditionalReduction: 0.15,
      minimum: 1.6
    },
    engineeringVariance: {
      base: 0.06,
      functionalRisk: 0.05,
      integrationRisk: 0.05,
      coverageGap: 0.05,
      coverageShieldReduction: 0.01,
      adoptionBurden: 0.04,
      leverageShieldReduction: 0.18,
      minimum: 0.05,
      maximum: 0.24
    },
    engineeringFloorWeeks: 1.5,
    slipFloorWeeks: 0.3,
    reworkMeanWeeks: {
      base: 0.35,
      coverageGap: 1.3,
      integrationRisk: 1.05,
      qualityRisk: 0.65,
      supportGap: 0.35,
      coverageShieldReduction: 0.08,
      adoptionBurden: 0.85,
      leverageReduction: 0.58,
      coverageShieldAdditionalReduction: 0.1,
      minimum: 0.18
    },
    slipMeanWeeks: {
      base: 0.85,
      deliveryRisk: 1,
      coverageGap: 0.9,
      integrationRisk: 0.7,
      supportGap: 0.35,
      coverageShieldReduction: 0.1,
      adoptionBurden: 0.8,
      leverageReduction: 0.52,
      coverageShieldAdditionalReduction: 0.08,
      minimum: 0.25
    },
    launch: {
      minimumWeeks: 1.4,
      appScaleOverheadWeeks: 0.38
    },
    maintenanceWeeks: {
      base: 0.55,
      functionalRisk: 1,
      qualityRisk: 0.68,
      integrationRisk: 0.88,
      coverageGap: 1.22,
      supportGap: 0.68,
      muiUsageReduction: 0.08,
      coverageShieldReduction: 0.12,
      adoptionBurden: 0.42,
      leverageReduction: 0.32,
      coverageShieldAdditionalReduction: 0.08,
      minimumBase: 0.42,
      minimum: 0.4
    }
  }
};

export const RECOMMENDATION_POLICY_WEIGHTS = {
  muiDeliveryFavoredProbability: 55,
  deliveryRiskReduction: 12,
  muiCostFavoredProbability: 55,
  deliveryOnlyMuiAdvantageProbability: 75,
  buildStillCompetitiveLaunchBufferWeeks: 1.5,
  buildStillCompetitiveCostMultiplier: 1.1,
  enterpriseFitCoverageScore: 68,
  premiumFitCoverageScore: 68,
  buildFriendlyCoreCoverageScore: 74,
  buildFriendlyBuildCompetitiveIndex: 58,
  enterpriseSupportGapThreshold: 0.18,
  coreMaterialAdvantageLaunchDelta: -2,
  coreNeedsStrongerEvidencePenalty: 6,
  deliveryOnlyMuiAdvantagePenalty: 6,
  deliveryOnlyMuiAdvantageMuiPenalty: 8,
  recommendationOpposedConfidencePenalty: 28,
  recommendationAlignedConfidenceBonus: 10,
  confidenceMinQualified: 48,
  confidenceMinBuildWithDeliveryOnlyAdvantage: 62,
  confidenceMinOpposed: 42,
  confidenceMax: 96,
  buildTierScoreHigh: 67,
  buildFriendlyContextCoverageThreshold: 58
};
