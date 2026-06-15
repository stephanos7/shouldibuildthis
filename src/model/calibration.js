/*
 * Model calibration
 * =================
 *
 * This file contains heuristic calibration weights for the build-vs-MUI
 * decision model.
 *
 * These coefficients convert normalized model artifacts such as
 * functionalRisk, qualityRisk, coverageGap, integrationRisk, supportGap,
 * internalAbsorption, buildReuseLeverage, muiLeverage, and
 * muiAdoptionBurden into estimated engineering weeks, rework, schedule
 * slip, maintenance, TCO, and recommendation signals.
 *
 * These values are not externally certified benchmark constants and are not
 * trained from a project-history dataset. Public software-delivery and
 * quality sources can inform which variables the model considers and how
 * uncertainty is shaped, but they do not justify the exact numeric values in
 * this file.
 *
 * Treat this file as executable model documentation. When changing a value,
 * update related model documentation and validate low-risk, medium-risk, and
 * high-risk scenarios.
 *
 * Glossary
 * --------
 *
 * base:
 *   Starting estimate before risk, fit, burden, or leverage terms are applied.
 *
 * risk coefficient:
 *   Multiplier that converts a normalized 0..1 risk score into weeks,
 *   variance, or downside exposure.
 *
 * fit coefficient:
 *   Weight that decides how strongly a fit signal contributes to coverage,
 *   leverage, or recommendation logic.
 *
 * shield:
 *   Reduction applied when the model believes a path has good conditions
 *   to absorb complexity.
 *
 * burden:
 *   Increase applied when a path carries adoption, ownership, integration,
 *   support, or operating-model drag.
 *
 * tail:
 *   Downside-risk adjustment that widens pessimistic outcomes more than
 *   central estimates.
 *
 * variance:
 *   Random spread around a central estimate. Higher variance should mostly
 *   affect ranges and P90 outputs.
 *
 * slip:
 *   Schedule time not explained by implementation effort alone, such as
 *   release coordination, retesting, decision latency, or delivery friction.
 *
 * maintenance:
 *   Post-launch engineering exposure over the selected maintenance horizon.
 *
 * minimum / maximum:
 *   Bounds used to prevent a single low/high input from collapsing or
 *   exploding the estimate.
 *
 * Tuning rules
 * ------------
 *
 * 1. Do not change a coefficient because one scenario looks wrong.
 *    Validate low-risk, medium-risk, and high-risk payloads.
 *
 * 2. If a change is intended to alter Build vs MUI competitiveness,
 *    state that explicitly in the PR description.
 *
 * 3. If a coefficient changes engineering weeks, also inspect launch weeks
 *    and TCO because those values flow downstream.
 *
 * 4. If a coefficient changes variance, tail exposure, or slip, inspect
 *    P90 outputs, not only medians.
 *
 * 5. If adding or removing a coefficient, update the model impact map,
 *    artifact glossary, dependency diagram, and deterministic breakdown
 *    when applicable.
 *
 * 6. Do not describe a coefficient as benchmark-derived unless it is
 *    actually derived from a dataset or cited source.
 */

export const CALIBRATION_VERSION = "heuristic-v1";

/*
 * Calibration glossary
 * --------------------
 *
 * base:
 *   Starting value before risk, fit, burden, or leverage terms are applied.
 *
 * coefficient:
 *   Multiplier that converts a normalized artifact into effort, risk,
 *   cost, or recommendation impact.
 *
 * threshold:
 *   A branch point where the model changes behavior because a value crosses
 *   a meaningful boundary.
 *
 * cap / floor:
 *   Upper and lower bounds that keep a term from dominating or collapsing
 *   the estimate.
 *
 * shield:
 *   A reduction that protects a path when conditions are favorable.
 *
 * burden:
 *   An added drag from adoption, ownership, support, or operational load.
 *
 * tail:
 *   A downside adjustment that widens pessimistic outcomes more than median
 *   outcomes.
 *
 * variance:
 *   Spread around a central estimate. Higher variance should mostly affect
 *   range outputs such as P90.
 *
 * slip:
 *   Schedule time not explained by implementation effort alone, such as
 *   coordination, testing, release friction, or decision latency.
 *
 * maintenance:
 *   Post-launch engineering exposure over the selected maintenance horizon.
 *
 * policy threshold:
 *   A recommendation cutoff that controls how much evidence is needed before
 *   the model prefers one path over another.
 *
 * Tuning rules
 * ------------
 *
 * 1. Do not change a coefficient because one scenario looks wrong.
 *    Validate low-risk, medium-risk, and high-risk payloads.
 *
 * 2. If changing Build vs MUI competitiveness, state that explicitly in the
 *    PR description.
 *
 * 3. If a value affects effort, check launch and TCO.
 *
 * 4. If a value affects variance, tail, or slip, check P90.
 *
 * 5. If adding a calibration key, update the impact map and docs.
 *
 * 6. Do not call a value benchmark-derived unless it actually is.
 */

/*
 * Derived factor weights
 * ----------------------
 *
 * These constants transform raw assessment inputs into normalized derived
 * factors such as functionalComplexity, qualityBurden, deliveryMaturity,
 * ownershipBurden, and enterpriseReadiness.
 *
 * Higher values generally increase the downstream risk or importance of the
 * corresponding input. These weights influence later scorecards, scenario
 * levers, and simulation estimates, so changing them can affect both medians
 * and tails.
 */
export const DERIVED_FACTOR_WEIGHTS = {
  functionalComplexity: {
    // Unit: normalized score contribution.
    // Higher values increase functional complexity and therefore Build effort.
    useCaseComplexity: 11.5,
    // Unit: normalized score contribution.
    // Higher values increase functional complexity and therefore Build effort.
    featureWeight: 8.9,
    // Unit: normalized score contribution.
    // Higher values increase functional complexity and quality burden.
    performanceSensitivity: 3.2,
    // Unit: normalized score contribution.
    // Higher values increase functional complexity through larger screen density.
    screenLoad: 2.6,
    // Unit: normalized score contribution.
    // Higher values increase functional complexity for row-heavy UIs.
    rowScale: 5.2,
    // Unit: normalized score contribution.
    // Higher values increase functional complexity for wide UIs.
    columnScale: 4.6,
    // Unit: normalized score contribution.
    // Higher values reduce the amount of complexity pushed into raw row scaling.
    dataGridRowScale: 2.4,
    // Unit: normalized score contribution.
    // Higher values reduce the amount of complexity pushed into raw column scaling.
    schedulerColumnScale: 1.9
  },
  qualityBurden: {
    // Unit: normalized score contribution.
    // Higher values increase verification burden and downstream quality risk.
    accessibilityTarget: 18,
    // Unit: normalized score contribution.
    // Higher values increase quality burden when performance matters.
    performanceSensitivity: 7.5,
    // Unit: normalized score contribution.
    // Higher values increase regression and QA burden for row-heavy screens.
    rowScale: 8.5,
    // Unit: normalized score contribution.
    // Higher values increase regression and QA burden for column-heavy screens.
    columnScale: 7.5,
    // Unit: normalized score contribution.
    // Higher values increase handoff friction and implementation churn.
    handoffFriction: 6,
    // Unit: normalized score contribution.
    // Higher values increase quality burden in production-sensitive contexts.
    productionCriticality: 5.5,
    // Unit: normalized score contribution.
    // Higher values increase keyboard and accessibility verification burden.
    keyboardNavigation: 11,
    // Unit: normalized score contribution.
    // Higher values increase quality burden because virtualization adds edge cases.
    virtualization: 13,
    // Unit: normalized score contribution.
    // Higher values increase quality burden due to implementation-specific rendering.
    customRendering: 12,
    // Unit: normalized score contribution.
    // Higher values increase quality burden for server-backed loading paths.
    serverSideData: 10,
    // Unit: normalized score contribution.
    // Higher values increase quality burden for timezone-sensitive logic.
    timezoneLogic: 7,
    // Unit: normalized score contribution.
    // Higher values increase quality burden for drag-and-drop behavior.
    dragAndDrop: 6,
    // Unit: normalized score contribution.
    // Higher values increase quality burden for localized and translated UI.
    i18nLocalization: 8
  },
  deliveryMaturity: {
    // Unit: normalized score baseline.
    // Higher values improve delivery maturity and reduce delivery risk.
    base: 28,
    // Unit: normalized score contribution.
    // Faster lead time improves delivery maturity and Build absorption.
    changeLeadTime: 12.5,
    // Unit: normalized score contribution.
    // Lower rework frequency improves delivery maturity and lowers slip risk.
    reworkFrequency: 11,
    deadlinePressure: {
      // Higher deadline pressure lowers delivery maturity.
      low: 16,
      // Moderate deadline pressure still lowers delivery maturity.
      medium: 4,
      // High pressure is modeled as a strong maturity reduction.
      high: -12
    }
  },
  ownershipBurden: {
    // Unit: normalized score baseline.
    // Higher values increase coordination and maintenance burden.
    base: 12,
    // Unit: normalized score contribution.
    // More dependent teams increase ownership burden.
    dependentTeams: 7.5,
    // Unit: normalized score contribution.
    // Unclear ownership increases burden; clearer ownership should reduce it upstream.
    ownershipModel: 6.5,
    // Unit: normalized score contribution.
    // More React apps widen the surface area that must be owned.
    reactApps: 3.5,
    // Unit: normalized score contribution.
    // Concentrated knowledge increases ownership burden and tail risk.
    knowledgeConcentration: 9,
    designSystemMaturity: {
      // Lower maturity increases burden.
      low: 10,
      // Medium maturity is still a net burden but less severe.
      medium: 5,
      // High maturity reduces burden by lowering coordination and reinvention.
      high: -4
    }
  },
  enterpriseReadiness: {
    supportRequirement: {
      // Community support is the weakest enterprise signal.
      community: 14,
      // Standard support is a moderate enterprise signal.
      standard: 30,
      // Priority support is a strong enterprise signal.
      priority: 54,
      // Procurement/SLA level support is the strongest enterprise signal.
      "procurement-sla": 72
    },
    // Unit: normalized score contribution.
    // More apps increase enterprise relevance and deployment coordination.
    reactApps: 4,
    // Unit: normalized score contribution.
    // Larger frontend teams increase enterprise readiness for standardization.
    frontendDevelopers: 2.5,
    // Unit: normalized score contribution.
    // More dependent teams increase enterprise relevance and rollout complexity.
    dependentTeams: 4,
    // Unit: normalized score contribution.
    // Existing MUI usage increases enterprise readiness for vendor-backed paths.
    muiUsage: 8,
    // Unit: normalized score contribution.
    // Stronger standardization goals raise enterprise relevance.
    standardizationGoal: 7,
    // Unit: normalized score contribution.
    // More production-critical work increases the need for enterprise support.
    productionCriticality: 8,
    maintenanceHorizonMonths: {
      // Longer horizons increase enterprise readiness and long-term support relevance.
      12: 6,
      // Longer horizons increase enterprise readiness and long-term support relevance.
      24: 12,
      // Long horizons most strongly increase enterprise readiness.
      36: 18
    }
  }
};

/*
 * Plan fit weights
 * ---------------
 *
 * These constants shape coverage, gap, support, and integration fit for the
 * packaged MUI paths. They affect MUI adoption behavior, the effective plan
 * selection, and downstream leverage or burden signals.
 *
 * Higher coverage weights improve fit and reduce MUI gaps. Higher integration
 * risk weights make weak fits hurt more. Thresholds and floors here influence
 * medians, tail behavior, and recommendation eligibility.
 */
export const PLAN_FIT_WEIGHTS = {
  coverageScore: {
    // Higher use-case coverage improves MUI fit.
    useCaseCoverage: 0.34,
    // Higher feature coverage improves MUI fit.
    featureCoverage: 0.23,
    // Higher scale coverage improves MUI fit.
    scaleCoverage: 0.17,
    // Higher support fit improves MUI fit.
    supportFit: 0.14,
    // Higher quality fit improves MUI fit.
    qualityFit: 0.08,
    // Higher performance fit improves MUI fit.
    performanceFit: 0.02,
    // Existing usage boosts adoption and coverage.
    adoptionBoost: 1
  },
  // Unit: normalized divisor.
  // Higher values reduce the effect of raw feature coverage differences.
  featureCoverageDenominator: 5.2,
  // Unit: normalized divisor.
  // Higher values reduce the effect of raw scale coverage differences.
  scaleCoverageDenominator: 2.2,
  planScaleCapacity: {
    // Core handles the least scale.
    core: 1.6,
    // Premium handles more scale than Core.
    premium: 2.6,
    // Enterprise handles the most scale.
    enterprise: 3.2
  },
  // Unit: normalized divisor.
  // Higher values reduce sensitivity of support fit.
  supportFitDenominator: 3.2,
  qualityFitThresholds: {
    // Core needs only modest quality fit.
    core: 0.42,
    // Premium needs stronger quality fit.
    premium: 0.68,
    // Enterprise needs the strongest quality fit.
    enterprise: 0.8
  },
  // Unit: slope.
  // Higher values make quality fit change more sharply near thresholds.
  qualityFitSlope: 1.1,
  performanceFitMultipliers: {
    // Core is least performance-tolerant.
    core: 0.08,
    // Premium is moderately performance-tolerant.
    premium: 0.04,
    // Enterprise is most performance-tolerant.
    enterprise: 0.025
  },
  baseIntegrationRisk: {
    existingMuiUsage: {
      // No existing usage creates the highest integration risk.
      none: 0.52,
      // Some usage creates moderate integration risk.
      some: 0.28,
      // Standardized usage creates the lowest integration risk.
      standardized: 0.14
    },
    // Unit: normalized risk contribution.
    // Higher values increase integration risk.
    customRendering: 0.11,
    // Unit: normalized risk contribution.
    // Higher values increase integration risk.
    dragAndDrop: 0.07,
    // Unit: normalized risk contribution.
    // Higher values increase integration risk.
    timezoneLogic: 0.06,
    // Unit: normalized risk contribution.
    // Higher values increase integration risk.
    i18nLocalization: 0.04,
    // Unit: normalized risk contribution.
    // Higher values increase integration risk for larger row scale.
    rowScaleAtLeast3: 0.06,
    // Unit: normalized risk contribution.
    // Higher values increase integration risk for larger column scale.
    columnScaleAtLeast3: 0.04,
    // Unit: normalized risk contribution.
    // Core plan has a small default integration risk.
    corePlan: 0.05,
    // Lower bound to keep integration risk from collapsing to zero.
    minimum: 0.08,
    // Upper bound to keep integration risk from dominating the model.
    maximum: 0.92,
    // Unit: scaling factor.
    // Higher values make integrationRisk respond more strongly.
    integrationRiskScale: 0.48,
    // Lower bound for the derived integration floor.
    floor: 0.05,
    // Upper bound for the derived integration ceiling.
    ceiling: 0.82
  }
};

/*
 * Path score weights
 * ------------------
 *
 * These scorecards rank Build and the MUI tiers before simulation. They do
 * not directly produce time or cost estimates, but they influence which path
 * is treated as more competitive or better aligned with the assessment.
 */
export const PATH_SCORE_WEIGHTS = {
  buildTierScore: {
    // Baseline Build competitiveness before risk modifiers.
    base: 88,
    // Higher functional risk favors Build because custom implementation can fit better.
    functionalRisk: 41,
    // Higher quality burden favors Build only when packaged options are a poor fit.
    qualityRisk: 29,
    // Higher ownership burden raises Build complexity and lowers competitiveness.
    ownershipRisk: 23,
    // Higher delivery risk lowers Build competitiveness.
    deliveryRisk: 24,
    // Higher maturity makes Build more competitive.
    maturityBonus: 6,
    // Higher support need can make Build more competitive when vendor support matters.
    supportNeed: 6,
    // Larger row-heavy scopes can favor Build in some cases.
    rowPenalty: 5,
    // Larger column-heavy scopes can favor Build in some cases.
    columnPenalty: 4
  },
  coreTierScore: {
    // Baseline Core competitiveness.
    base: 26,
    // Higher coverage score makes Core more competitive.
    coverageScore: 0.46,
    // Simpler scope makes Core more competitive.
    simpleScopeBonus: 18,
    // Existing MUI usage makes Core more competitive.
    muiUsageBonus: 8,
    // Higher functional risk can favor Core when it fits well.
    functionalRisk: 12,
    // Higher quality risk can favor Core when the path is already fit.
    qualityRisk: 8,
    // Higher enterprise need makes Core less competitive.
    enterpriseNeedPenalty: 24
  },
  premiumTierScore: {
    // Baseline Premium competitiveness.
    base: 18,
    // Higher coverage score makes Premium more competitive.
    coverageScore: 0.42,
    // Higher functional risk can favor Premium when packaged coverage is strong.
    functionalRisk: 12,
    // Higher quality risk can favor Premium when quality fit is strong.
    qualityRisk: 10,
    // Existing MUI usage makes Premium more competitive.
    muiUsageBonus: 5,
    // Simple scope makes Premium less necessary.
    simpleScopePenalty: 18,
    // Higher enterprise need makes Premium less competitive versus Enterprise.
    enterpriseNeedPenalty: 14
  },
  enterpriseTierScore: {
    // Baseline Enterprise competitiveness.
    base: 8,
    // Higher coverage score makes Enterprise more competitive.
    coverageScore: 0.32,
    // Higher enterprise need strongly favors Enterprise.
    enterpriseNeed: 34,
    // Higher support need strongly favors Enterprise.
    supportNeed: 9,
    // Larger apps increase Enterprise relevance.
    appScale: 4,
    // Larger teams increase Enterprise relevance.
    teamScale: 3,
    // More dependent teams increase Enterprise relevance.
    dependentTeams: 1.5,
    // More production-critical work increases Enterprise relevance.
    productionCriticality: 4,
    // Simple scopes reduce Enterprise necessity.
    simpleScopeBonus: 10
  },
  icpScore: {
    // Baseline ICP strength.
    base: 12,
    // Higher functional risk increases Build-vs-MUI importance in the ICP score.
    functionalRisk: 22,
    // Higher quality risk increases enterprise and vendor relevance.
    qualityRisk: 12,
    // Higher ownership risk increases the need for a well-defined path.
    ownershipRisk: 14,
    // Higher enterprise need increases ICP strength.
    enterpriseNeed: 24,
    // Existing MUI usage is a small positive ICP signal.
    muiUsage: 4,
    // Larger apps increase ICP strength for standardized paths.
    appScale: 3,
    // Larger teams increase ICP strength for standardized paths.
    teamScale: 3,
    // Stronger standardization intent increases ICP strength.
    standardizationIntent: 8,
    // More dependent teams increase ICP strength.
    dependentTeams: 2,
    // Simple scopes reduce ICP pressure.
    simpleScopePenalty: 6
  },
  buildCompetitiveIndex: {
    // Baseline Build competitiveness index.
    base: 100,
    // Higher functional risk makes custom Build relatively more attractive.
    functionalRisk: 36,
    // Higher quality risk makes packaged paths relatively more attractive.
    qualityRisk: 22,
    // Higher ownership risk makes Build less attractive.
    ownershipRisk: 22,
    // Higher delivery risk makes Build less attractive.
    deliveryRisk: 20,
    // Delivery maturity improves Build competitiveness.
    maturityBonus: 6,
    // Higher support need can either help or hurt depending on the rest of the model.
    supportNeed: 7,
    // Standardization intent slightly increases Build competitiveness.
    standardizationIntent: 2,
    // Production criticality slightly increases Build competitiveness.
    productionCriticality: 2
  }
};

/*
 * Scenario lever weights
 * ----------------------
 *
 * These constants shape how the model translates fit, burden, ownership, and
 * platform conditions into shields, leverage, adoption burden, and tail risk.
 *
 * Higher internalAbsorption and buildReuse values help Build. Higher muiLeverage
 * values help MUI when fit is strong. Higher muiAdoptionBurden values hurt MUI.
 * Tail-risk coefficients widen pessimistic cases more than central estimates.
 */
export const SCENARIO_LEVER_WEIGHTS = {
  internalAbsorption: {
    // Better delivery strength helps the team absorb Build work.
    deliveryStrength: 0.28,
    // Better maturity helps the team absorb Build work.
    maturityStrength: 0.18,
    // Clear ownership helps the team absorb Build work.
    ownershipClarity: 0.18,
    // Focused teams absorb more custom work.
    teamFocus: 0.13,
    // Stable rework patterns help absorb Build work.
    reworkStability: 0.1,
    // Wider knowledge spread improves absorption.
    knowledgeSpread: 0.08,
    // Better handoff alignment improves absorption.
    handoffAlignment: 0.04,
    // More deadline slack improves absorption.
    deadlineSlack: 0.08,
    // Lighter support need improves absorption.
    supportLightness: 0.03,
    // More app focus improves absorption.
    appFocus: 0.02
  },
  buildReuse: {
    // Higher maturity makes reuse easier.
    maturityStrength: 0.28,
    // Clear ownership makes reuse easier.
    ownershipClarity: 0.16,
    // Focused teams make reuse easier.
    teamFocus: 0.1,
    // Wider knowledge spread makes reuse easier.
    knowledgeSpread: 0.05,
    // Better handoff alignment makes reuse easier.
    handoffAlignment: 0.06,
    // Simpler scope makes reuse easier.
    scopeSimplicity: 0.26,
    // More features increase reuse opportunity but only modestly.
    featureCount: 0.1,
    // Standardization intent increases reuse leverage.
    standardizationInteraction: 0.08,
    // Larger-scale profiles can increase reuse leverage.
    scaleProfile: 0.1
  },
  muiLeverage: {
    // Strong coverage makes MUI leverage higher.
    coverageScore: 0.42,
    // Smaller coverage gaps increase leverage.
    coverageGap: 0.2,
    // Smaller support gaps increase leverage.
    supportGap: 0.14,
    // Existing MUI usage increases leverage.
    existingMuiUsage: 0.12,
    // Better handoff alignment increases leverage.
    handoffAlignment: 0.08,
    // Standardization intent increases leverage.
    standardizationIntent: 0.08,
    // Packaged affinity increases leverage.
    packagedAffinity: 0.07,
    // More features slightly increase leverage opportunity.
    featureCount: 0.05,
    // Performance relief increases leverage when MUI can absorb the burden.
    performanceRelief: 0.06
  },
  muiAdoptionBurden: {
    existingMuiUsage: {
      // No existing usage creates the highest adoption burden.
      none: 0.34,
      // Some usage creates moderate adoption burden.
      some: 0.16,
      // Standardized usage creates the lowest adoption burden.
      standardized: 0.05
    },
    // Higher maturity with no MUI baseline can still require adaptation effort.
    noMuiHighMaturity: 0.1,
    // Medium maturity with no MUI baseline still adds some adaptation effort.
    noMuiMediumMaturity: 0.05,
    ownershipModel: {
      // Same-product-team ownership has the lowest burden.
      "same-product-team": 0.05,
      // Platform ownership creates some burden.
      "frontend-platform-team": 0.09,
      // Informal multi-team ownership creates more burden.
      "several-teams-informal": 0.13,
      // Unclear ownership creates the highest burden.
      unclear: 0.15
    },
    // Custom rendering increases adoption burden.
    customRendering: 0.1,
    // Drag-and-drop increases adoption burden.
    dragAndDrop: 0.08,
    // Timezone logic increases adoption burden.
    timezoneLogic: 0.06,
    // Localization increases adoption burden.
    i18nLocalization: 0.06,
    // Poor handoff alignment increases adoption burden.
    handoffAlignment: 0.08,
    // Performance burden increases adoption burden.
    performanceBurden: 0.1,
    // Strong support pressure increases adoption burden when coverage is weak.
    productionPressureSupportGap: 0.05,
    // Coverage gap directly increases adoption burden.
    coverageGap: 0.12
  },
  downsideTailRisk: {
    // Ownership risk contributes to long-tail downside.
    ownershipRisk: 0.22,
    // Delivery risk contributes to long-tail downside.
    deliveryRisk: 0.2,
    // Quality risk contributes to long-tail downside.
    qualityRisk: 0.17,
    // Functional risk contributes to long-tail downside.
    functionalRisk: 0.16,
    dependentTeams: {
      // One dependent team adds some tail risk.
      one: 0.12,
      // Two to three dependent teams add more tail risk.
      "two-three": 0.32,
      // Four to seven dependent teams add substantial tail risk.
      "four-seven": 0.58,
      // Eight-plus dependent teams add the most tail risk.
      "eight-plus": 0.78
    },
    // More dependent teams scale tail risk upward.
    dependentTeamsMultiplier: 0.08,
    // More React apps scale tail risk upward.
    reactApps: 0.04,
    accessibilityTarget: {
      // No accessibility target adds little tail risk.
      none: 0.08,
      // WCAG A adds moderate tail risk.
      "wcag-a": 0.18,
      // WCAG AA adds stronger tail risk.
      "wcag-aa": 0.38,
      // WCAG AAA or regulated targets add the most tail risk.
      "wcag-aaa-regulated": 0.62
    },
    // Stronger accessibility targets scale tail risk upward.
    accessibilityTargetMultiplier: 0.04,
    // More features scale tail risk upward.
    featureCount: 0.03,
    // Larger scale profiles scale tail risk upward.
    scaleProfile: 0.03,
    deadlinePressure: {
      // Low deadline pressure adds little tail risk.
      low: 0.08,
      // Medium deadline pressure adds more tail risk.
      medium: 0.36,
      // High deadline pressure adds the most tail risk.
      high: 0.72
    },
    // Deadline pressure scales tail risk upward.
    deadlinePressureMultiplier: 0.03,
    // Wider knowledge spread reduces some tail exposure.
    knowledgeSpread: 0.08,
    // Better handoff alignment reduces some tail exposure.
    handoffAlignment: 0.05,
    // Performance pressure increases tail risk.
    performancePressure: 0.03,
    // Build performance burden increases tail risk.
    buildPerformanceBurden: 0.05,
    // MUI performance burden increases tail risk.
    muiPerformanceBurden: 0.03,
    // Production pressure increases tail risk.
    productionPressure: 0.08,
    // Standardization intent slightly increases tail risk because it raises the bar.
    standardizationIntent: 0.04
  },
  performancePressure: {
    // Threshold above which performance pressure becomes material.
    threshold: 0.67,
    // Readiness threshold for performance-sensitive use cases.
    readinessThreshold: 0.67,
    // Burden threshold for performance-sensitive use cases.
    burdenThreshold: 0.45
  }
};

/*
 * Simulation calibration
 * ----------------------
 *
 * These constants convert the derived factors and scenario levers into
 * engineering weeks, variance, rework, slip, launch overhead, maintenance,
 * and TCO for each path.
 *
 * Build coefficients generally increase Build effort, launch time, and
 * maintenance when they rise. MUI coefficients can either increase or reduce
 * effort depending on whether they represent burden, leverage, or shield
 * effects.
 */
export const SIMULATION_CALIBRATION = {
  build: {
    engineeringMeanWeeks: {
      // Starting central Build effort in weeks before risk terms.
      base: 3.4,
      // Maximum contribution from functional risk to Build engineering weeks.
      functionalRisk: 11.8,
      // Maximum contribution from quality risk to Build engineering weeks.
      qualityRisk: 7.4,
      // Maximum contribution from ownership risk to Build engineering weeks.
      ownershipRisk: 6.6,
      // Maximum contribution from delivery risk to Build engineering weeks.
      deliveryRisk: 5.2,
      // Maximum contribution from enterprise need to Build engineering weeks.
      enterpriseNeed: 1.1,
      // Extra Build effort for larger-scale applications.
      largeScaleAdjustment: 0.9,
      // Lower bound for the central Build estimate.
      minimum: 2.4
    },
    // Lower bound for Build engineering weeks after downstream adjustments.
    engineeringFloorWeeks: 2,
    // Lower bound for Build launch slip.
    slipFloorWeeks: 0.6,
    engineeringVariance: {
      // Base variance around the central Build estimate.
      base: 0.08,
      // Functional risk increases Build variance.
      functionalRisk: 0.11,
      // Quality risk increases Build variance.
      qualityRisk: 0.08,
      // Ownership risk increases Build variance.
      ownershipRisk: 0.07,
      // Delivery risk increases Build variance.
      deliveryRisk: 0.06,
      // Minimum variance clamp.
      minimum: 0.06,
      // Maximum variance clamp.
      maximum: 0.36
    },
    reworkMeanWeeks: {
      // Starting Build rework before risk terms.
      base: 0.7,
      // Functional risk increases rework.
      functionalRisk: 2.6,
      // Quality risk increases rework.
      qualityRisk: 2,
      // Ownership risk increases rework.
      ownershipRisk: 1.5,
      // Delivery risk increases rework.
      deliveryRisk: 1,
      // Larger scale increases rework.
      largeScaleAdjustment: 0.4,
      // Lower bound for Build rework.
      minimum: 0.35
    },
    slipMeanWeeks: {
      // Starting Build slip before risk terms.
      base: 1.5,
      // Delivery risk is the strongest Build slip driver.
      deliveryRisk: 2.3,
      // Functional risk adds schedule slip.
      functionalRisk: 1.2,
      // Quality risk adds schedule slip.
      qualityRisk: 0.8,
      // Ownership risk adds schedule slip.
      ownershipRisk: 0.6,
      // Enterprise need adds a small amount of Build slip.
      enterpriseNeed: 0.2,
      // Larger scale increases Build slip.
      largeScaleAdjustment: 0.3,
      // Lower bound for Build slip.
      minimum: 0.5
    },
    launch: {
      // Hard minimum launch overhead in weeks.
      minimumWeeks: 2,
      // Additional launch overhead for more apps.
      appScaleOverheadWeeks: 0.65
    },
    maintenanceWeeks: {
      // Starting Build maintenance exposure in weeks.
      base: 0.95,
      // Functional risk increases Build maintenance.
      functionalRisk: 2.8,
      // Quality risk increases Build maintenance.
      qualityRisk: 1.7,
      // Ownership risk increases Build maintenance.
      ownershipRisk: 2,
      // Delivery risk increases Build maintenance.
      deliveryRisk: 0.55,
      // Larger scale increases Build maintenance.
      largeScaleAdjustment: 0.18,
      // Minimum base maintenance before floor logic.
      minimumBase: 0.75,
      // Absolute lower bound for Build maintenance.
      minimum: 0.8
    }
  },
  mui: {
    engineeringMeanWeeks: {
      // Starting MUI effort in weeks before fit, burden, and leverage terms.
      base: 2.2,
      // Functional risk still costs engineering weeks on MUI.
      functionalRisk: 5.2,
      // Quality risk still costs engineering weeks on MUI.
      qualityRisk: 2.9,
      // Delivery risk adds some MUI effort.
      deliveryRisk: 1.5,
      // Integration risk is a major MUI effort driver.
      integrationRisk: 2.4,
      // Coverage gap increases MUI effort.
      coverageGap: 3.8,
      // Support gap increases MUI effort.
      supportGap: 1.5,
      // Offset keeps the central estimate from collapsing too low.
      offset: 1,
      // Coverage shields reduce MUI engineering effort.
      coverageShieldReduction: 0.18,
      // Adoption burden increases MUI engineering effort.
      adoptionBurden: 2.4,
      // Strong leverage reduces MUI engineering effort.
      leverageReduction: 1.6,
      // Extra shield reduction for stronger coverage effects.
      coverageShieldAdditionalReduction: 0.15,
      // Lower bound for the central MUI estimate.
      minimum: 1.6
    },
    engineeringVariance: {
      // Base variance around the central MUI estimate.
      base: 0.06,
      // Functional risk increases MUI variance.
      functionalRisk: 0.05,
      // Integration risk increases MUI variance.
      integrationRisk: 0.05,
      // Coverage gap increases MUI variance.
      coverageGap: 0.05,
      // Coverage shield reduction lowers MUI variance.
      coverageShieldReduction: 0.01,
      // Adoption burden increases MUI variance.
      adoptionBurden: 0.04,
      // Leverage shield reduction lowers MUI variance.
      leverageShieldReduction: 0.18,
      // Minimum variance clamp.
      minimum: 0.05,
      // Maximum variance clamp.
      maximum: 0.24
    },
    // Lower bound for MUI engineering weeks after downstream adjustments.
    engineeringFloorWeeks: 1.5,
    // Lower bound for MUI launch slip.
    slipFloorWeeks: 0.3,
    reworkMeanWeeks: {
      // Starting MUI rework before fit, burden, and leverage terms.
      base: 0.35,
      // Coverage gap increases MUI rework.
      coverageGap: 1.3,
      // Integration risk increases MUI rework.
      integrationRisk: 1.05,
      // Quality risk increases MUI rework.
      qualityRisk: 0.65,
      // Support gap increases MUI rework.
      supportGap: 0.35,
      // Coverage shield reduction lowers MUI rework.
      coverageShieldReduction: 0.08,
      // Adoption burden increases MUI rework.
      adoptionBurden: 0.85,
      // Leverage reduction lowers MUI rework.
      leverageReduction: 0.58,
      // Extra shield reduction for stronger coverage effects.
      coverageShieldAdditionalReduction: 0.1,
      // Lower bound for MUI rework.
      minimum: 0.18
    },
    slipMeanWeeks: {
      // Starting MUI slip before fit, burden, and leverage terms.
      base: 0.85,
      // Delivery risk increases MUI slip.
      deliveryRisk: 1,
      // Coverage gap increases MUI slip.
      coverageGap: 0.9,
      // Integration risk increases MUI slip.
      integrationRisk: 0.7,
      // Support gap increases MUI slip.
      supportGap: 0.35,
      // Coverage shield reduction lowers MUI slip.
      coverageShieldReduction: 0.1,
      // Adoption burden increases MUI slip.
      adoptionBurden: 0.8,
      // Leverage reduction lowers MUI slip.
      leverageReduction: 0.52,
      // Extra shield reduction for stronger coverage effects.
      coverageShieldAdditionalReduction: 0.08,
      // Lower bound for MUI slip.
      minimum: 0.25
    },
    launch: {
      // Hard minimum launch overhead in weeks.
      minimumWeeks: 1.4,
      // Additional launch overhead for more apps.
      appScaleOverheadWeeks: 0.38
    },
    maintenanceWeeks: {
      // Starting MUI maintenance exposure in weeks.
      base: 0.55,
      // Functional risk increases MUI maintenance.
      functionalRisk: 1,
      // Quality risk increases MUI maintenance.
      qualityRisk: 0.68,
      // Integration risk increases MUI maintenance.
      integrationRisk: 0.88,
      // Coverage gap increases MUI maintenance.
      coverageGap: 1.22,
      // Support gap increases MUI maintenance.
      supportGap: 0.68,
      // Existing MUI usage reduces MUI maintenance.
      muiUsageReduction: 0.08,
      // Coverage shield reduction lowers MUI maintenance.
      coverageShieldReduction: 0.12,
      // Adoption burden increases MUI maintenance.
      adoptionBurden: 0.42,
      // Leverage reduction lowers MUI maintenance.
      leverageReduction: 0.32,
      // Extra shield reduction for stronger coverage effects.
      coverageShieldAdditionalReduction: 0.08,
      // Minimum base maintenance before floor logic.
      minimumBase: 0.42,
      // Absolute lower bound for MUI maintenance.
      minimum: 0.4
    }
  }
};

/*
 * Recommendation policy weights
 * -----------------------------
 *
 * These thresholds and penalties convert the simulated outputs into final
 * recommendation behavior and confidence scoring.
 *
 * They affect recommendation eligibility, how much evidence is required for
 * a clear recommendation, and how strongly opposed evidence reduces confidence.
 * Change these deliberately because they influence user-facing decisions even
 * when the underlying estimates stay the same.
 */
export const RECOMMENDATION_POLICY_WEIGHTS = {
  // Probability threshold where MUI delivery becomes favored.
  muiDeliveryFavoredProbability: 55,
  // Delivery-risk reduction used when evaluating MUI delivery advantage.
  deliveryRiskReduction: 12,
  // Probability threshold where MUI cost becomes favored.
  muiCostFavoredProbability: 55,
  // Probability threshold for delivery-only MUI advantage.
  deliveryOnlyMuiAdvantageProbability: 75,
  // Buffer in weeks before Build is still considered competitive.
  buildStillCompetitiveLaunchBufferWeeks: 1.5,
  // Cost multiplier before Build is still considered competitive.
  buildStillCompetitiveCostMultiplier: 1.1,
  // Coverage score threshold for enterprise fit.
  enterpriseFitCoverageScore: 68,
  // Coverage score threshold for premium fit.
  premiumFitCoverageScore: 68,
  // Coverage score threshold for a friendly Core fit.
  buildFriendlyCoreCoverageScore: 74,
  // Build competitive index threshold for a friendly Build context.
  buildFriendlyBuildCompetitiveIndex: 58,
  // Maximum support gap tolerated before enterprise fit weakens.
  enterpriseSupportGapThreshold: 0.18,
  // Launch delta where Core is materially advantaged.
  coreMaterialAdvantageLaunchDelta: -2,
  // Penalty when Core needs stronger evidence.
  coreNeedsStrongerEvidencePenalty: 6,
  // Penalty when delivery-only MUI advantage is present.
  deliveryOnlyMuiAdvantagePenalty: 6,
  // Additional MUI penalty when delivery-only advantage is present.
  deliveryOnlyMuiAdvantageMuiPenalty: 8,
  // Confidence penalty when the recommendation is opposed by evidence.
  recommendationOpposedConfidencePenalty: 28,
  // Confidence bonus when the recommendation is aligned with evidence.
  recommendationAlignedConfidenceBonus: 10,
  // Lower bound for qualified recommendation confidence.
  confidenceMinQualified: 48,
  // Confidence floor for Build when MUI only has delivery advantage.
  confidenceMinBuildWithDeliveryOnlyAdvantage: 62,
  // Confidence floor for opposed recommendations.
  confidenceMinOpposed: 42,
  // Upper cap for recommendation confidence.
  confidenceMax: 96,
  // Threshold for a high Build tier score.
  buildTierScoreHigh: 67,
  // Coverage score threshold for a friendly Build context.
  buildFriendlyContextCoverageThreshold: 58
};

export const CALIBRATION = {
  version: CALIBRATION_VERSION,

  inputIndexes: {},

  derivedFactors: {
    functionalComplexity: {},
    qualityBurden: {},
    deliveryMaturity: {},
    ownershipBurden: {},
    enterpriseReadiness: {}
  },

  planFit: {
    featureCoverage: {},
    scaleCoverage: {},
    supportFit: {},
    qualityFit: {},
    coverageScore: {},
    integrationRisk: {},
    supportGap: {},
    planScaleCapacity: {}
  },

  pathScores: {
    buildTierScore: {},
    coreTierScore: {},
    premiumTierScore: {},
    enterpriseTierScore: {},
    icpScore: {},
    simpleScope: {},
    buildFriendlyContext: {},
    enterpriseEligibility: {},
    premiumEligibility: {}
  },

  scenarioLevers: {
    internalAbsorption: {},
    buildReuseLeverage: {},
    muiLeverage: {},
    muiAdoptionBurden: {},
    downsideTailRisk: {}
  },

  simulation: {
    velocity: {
      frontendDevelopers: {
        build: {
          unit: "velocity multiplier adjustment",
          description:
            "Adjusts Build delivery velocity based on frontend implementation capacity.",
          thresholds: [
            {
              maxExclusive: 4,
              adjustment: -0.03,
              label: "small-team-capacity-constraint"
            },
            {
              minInclusive: 4,
              maxExclusive: 8,
              adjustment: 0.03,
              label: "medium-team-capacity-bonus"
            },
            {
              minInclusive: 8,
              adjustment: 0.08,
              label: "larger-team-capacity-bonus"
            }
          ]
        },
        mui: {
          unit: "velocity multiplier adjustment",
          description:
            "Adjusts MUI delivery velocity based on frontend implementation capacity.",
          thresholds: [
            {
              maxExclusive: 4,
              adjustment: -0.01,
              label: "small-team-capacity-constraint"
            },
            {
              minInclusive: 4,
              maxExclusive: 8,
              adjustment: 0.02,
              label: "medium-team-capacity-bonus"
            },
            {
              minInclusive: 8,
              adjustment: 0.06,
              label: "larger-team-capacity-bonus"
            }
          ]
        }
      },
      build: {},
      mui: {}
    },

    build: {
      engineeringMeanWeeks: {},
      engineeringVariance: {},
      reworkMeanWeeks: {},
      slipMeanWeeks: {},
      launch: {},
      maintenanceWeeks: {},
      fatTail: {}
    },

    mui: {
      engineeringMeanWeeks: {},
      engineeringVariance: {},
      reworkMeanWeeks: {},
      slipMeanWeeks: {},
      launch: {},
      maintenanceWeeks: {},
      fatTail: {},
      licensing: {}
    }
  },

  recommendationPolicy: {
    dominance: {},
    coreEvidence: {},
    enterpriseEligibility: {},
    premiumEligibility: {},
    buildCredibility: {},
    confidence: {}
  }
};
