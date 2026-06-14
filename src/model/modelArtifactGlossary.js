export const MODEL_ARTIFACT_GLOSSARY = {
  frontendDevelopers: {
    artifact: "frontendDevelopers",
    stage: "rawInput",
    label: "Frontend developers",
    direction: "mixed",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Counts the frontend capacity available to the team. More developers increase build velocity and can increase enterprise relevance for standardization, but this input should not increase ownership burden."
  },
  reactApps: {
    artifact: "reactApps",
    stage: "rawInput",
    label: "React apps",
    direction: "mixed",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Measures the React footprint that must absorb the implementation and rollout. More apps widen coordination and maintenance surface area, but they also increase the relevance of standardization and vendor-backed rollout paths."
  },
  dependentTeams: {
    artifact: "dependentTeams",
    stage: "rawInput",
    label: "Dependent teams",
    direction: "mixed",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Captures how many other teams depend on this work. More dependent teams raise coordination drag, enterprise relevance, and downside risk."
  },
  ownershipModel: {
    artifact: "ownershipModel",
    stage: "rawInput",
    label: "Ownership model",
    direction: "mixed",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Describes how clearly the team owns the component or design surface. Clear ownership improves absorption and reuse; unclear ownership increases coordination and adoption burden."
  },
  existingMuiUsage: {
    artifact: "existingMuiUsage",
    stage: "rawInput",
    label: "Existing MUI usage",
    direction: "mixed",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Indicates how much MUI is already present in the codebase. More existing usage improves adoption and leverage for packaged paths, while reducing internal reuse leverage for a custom build."
  },
  designSystemMaturity: {
    artifact: "designSystemMaturity",
    stage: "rawInput",
    label: "Design system maturity",
    direction: "mixed",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Represents the maturity of internal UI standards and patterns. Higher maturity improves build reuse and absorption, while a low-MUI baseline can increase adaptation burden on packaged adoption."
  },
  primaryUseCase: {
    artifact: "primaryUseCase",
    stage: "rawInput",
    label: "Primary use case",
    direction: "mixed",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Identifies the dominant component pattern being evaluated. It drives complexity, fit, coverage, and the selected effective MUI plan."
  },
  dataHeavyScreens: {
    artifact: "dataHeavyScreens",
    stage: "rawInput",
    label: "Data-heavy screens",
    direction: "bad",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Counts screens that carry large tables or similar dense data states. More screens increase functional load, QA burden, and effort pressure."
  },
  expectedRows: {
    artifact: "expectedRows",
    stage: "rawInput",
    label: "Expected rows",
    direction: "bad",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Defines the row-scale band the component must handle. Larger row bands raise complexity, quality burden, and tail risk."
  },
  expectedColumns: {
    artifact: "expectedColumns",
    stage: "rawInput",
    label: "Expected columns",
    direction: "bad",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Defines the column-scale band the component must handle. Wider column bands raise complexity, quality burden, and tail risk."
  },
  advancedFeatures: {
    artifact: "advancedFeatures",
    stage: "rawInput",
    label: "Advanced features",
    direction: "mixed",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Captures advanced behaviors such as virtualization, custom rendering, drag-and-drop, and localization. These features raise functional demand and can increase quality burden, adoption burden, and downside risk."
  },
  accessibilityTarget: {
    artifact: "accessibilityTarget",
    stage: "rawInput",
    label: "Accessibility target",
    direction: "bad",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Sets the accessibility standard the implementation must meet. Higher standards increase verification burden, quality risk, and tail exposure."
  },
  changeLeadTime: {
    artifact: "changeLeadTime",
    stage: "rawInput",
    label: "Change lead time",
    direction: "good",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Represents how quickly the team can ship change. Faster lead time improves delivery maturity, internal absorption, and velocity on both paths."
  },
  reworkFrequency: {
    artifact: "reworkFrequency",
    stage: "rawInput",
    label: "Rework frequency",
    direction: "good",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Describes how often the team revisits or churns UI work. Rarer rework improves delivery maturity and reduces rework and slip burden."
  },
  deadlinePressure: {
    artifact: "deadlinePressure",
    stage: "rawInput",
    label: "Deadline pressure",
    direction: "bad",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Captures schedule compression and urgency. Higher pressure lowers delivery maturity, increases slip risk, and widens downside tail exposure."
  },
  supportRequirement: {
    artifact: "supportRequirement",
    stage: "rawInput",
    label: "Support requirement",
    direction: "contextual",
    path: "MUI / vendor-backed paths",
    calculatedIn: "normalizeInput",
    description:
      "Expresses the desired vendor or support level. Higher support need raises enterprise readiness and can create support gaps for weaker packaged paths without forcing Enterprise by itself."
  },
  maintenanceHorizonMonths: {
    artifact: "maintenanceHorizonMonths",
    stage: "rawInput",
    label: "Maintenance horizon months",
    direction: "cost",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Defines how long the component is expected to remain in service. Longer horizons increase maintenance exposure and MUI license cost for paid tiers."
  },
  engineerCostPerDay: {
    artifact: "engineerCostPerDay",
    stage: "rawInput",
    label: "Engineer cost per day",
    direction: "cost",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Converts engineering and maintenance weeks into labor TCO. It does not affect launch time or effort."
  },
  performanceSensitivity: {
    artifact: "performanceSensitivity",
    stage: "rawInput",
    label: "Performance sensitivity",
    direction: "mixed",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Captures how tightly performance is constrained. Stronger sensitivity raises quality burden and tail risk and only helps MUI conditionally when the selected path is performance-ready."
  },
  knowledgeConcentration: {
    artifact: "knowledgeConcentration",
    stage: "rawInput",
    label: "Knowledge concentration",
    direction: "mixed",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Measures whether implementation knowledge is shared or concentrated. Shared knowledge supports Build; concentrated knowledge increases ownership burden, lowers absorption, and raises tail risk."
  },
  designDevHandoffFriction: {
    artifact: "designDevHandoffFriction",
    stage: "rawInput",
    label: "Design-dev handoff friction",
    direction: "mixed",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Measures how much friction exists between design and implementation. Higher friction raises quality burden, reduces reuse leverage, and increases adoption burden."
  },
  componentStandardizationGoal: {
    artifact: "componentStandardizationGoal",
    stage: "rawInput",
    label: "Component standardization goal",
    direction: "contextual",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Describes whether the team wants to reduce one-offs, create a shared pattern, or enforce platform standards. This increases enterprise relevance and can support either Build or MUI when other conditions are strong."
  },
  productionCriticality: {
    artifact: "productionCriticality",
    stage: "rawInput",
    label: "Production criticality",
    direction: "mixed",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Describes how sensitive the production surface is to failure or downtime. Higher criticality raises quality burden, enterprise readiness, and downside tail risk."
  },
  useCaseComplexity: {
    artifact: "useCaseComplexity",
    stage: "inputIndex",
    label: "Use case complexity",
    direction: "neutral",
    path: "Both",
    calculatedIn: "buildDerivedFactors",
    description:
      "Numeric baseline for the selected primary use case. It is the complexity anchor used to build the functional score."
  },
  featureWeight: {
    artifact: "featureWeight",
    stage: "inputIndex",
    label: "Feature weight",
    direction: "neutral",
    path: "Both",
    calculatedIn: "buildDerivedFactors",
    description:
      "Numeric weight for selected advanced features. It aggregates feature-level complexity before the functional factor is scored."
  },
  screenLoad: {
    artifact: "screenLoad",
    stage: "inputIndex",
    label: "Screen load",
    direction: "neutral",
    path: "Both",
    calculatedIn: "buildDerivedFactors",
    description:
      "Counts the normalized data-screen load used in functional and quality scoring."
  },
  rowScale: {
    artifact: "rowScale",
    stage: "inputIndex",
    label: "Row scale",
    direction: "neutral",
    path: "Both",
    calculatedIn: "buildDerivedFactors",
    description:
      "Normalizes the expected row band into a simple scale index."
  },
  columnScale: {
    artifact: "columnScale",
    stage: "inputIndex",
    label: "Column scale",
    direction: "neutral",
    path: "Both",
    calculatedIn: "buildDerivedFactors",
    description:
      "Normalizes the expected column band into a simple scale index."
  },
  accessibilityIndex: {
    artifact: "accessibilityIndex",
    stage: "inputIndex",
    label: "Accessibility index",
    direction: "neutral",
    path: "Both",
    calculatedIn: "buildDerivedFactors",
    description:
      "Numeric index for the selected accessibility target."
  },
  changeLeadTimeIndex: {
    artifact: "changeLeadTimeIndex",
    stage: "inputIndex",
    label: "Change lead time index",
    direction: "neutral",
    path: "Both",
    calculatedIn: "buildDerivedFactors",
    description:
      "Numeric index for the selected change lead time band."
  },
  reworkFrequencyIndex: {
    artifact: "reworkFrequencyIndex",
    stage: "inputIndex",
    label: "Rework frequency index",
    direction: "neutral",
    path: "Both",
    calculatedIn: "buildDerivedFactors",
    description:
      "Numeric index for the selected rework frequency band."
  },
  dependentTeamsIndex: {
    artifact: "dependentTeamsIndex",
    stage: "inputIndex",
    label: "Dependent teams index",
    direction: "neutral",
    path: "Both",
    calculatedIn: "buildDerivedFactors",
    description:
      "Numeric index for the number of dependent teams."
  },
  ownershipModelIndex: {
    artifact: "ownershipModelIndex",
    stage: "inputIndex",
    label: "Ownership model index",
    direction: "neutral",
    path: "Both",
    calculatedIn: "buildDerivedFactors",
    description:
      "Numeric index for the selected ownership model."
  },
  muiUsage: {
    artifact: "muiUsage",
    stage: "inputIndex",
    label: "MUI usage index",
    direction: "neutral",
    path: "Both",
    calculatedIn: "buildDerivedFactors",
    description:
      "Numeric index for existing MUI usage."
  },
  maturity: {
    artifact: "maturity",
    stage: "inputIndex",
    label: "Maturity index",
    direction: "neutral",
    path: "Both",
    calculatedIn: "buildScorecard",
    description:
      "Numeric index for design-system maturity used in the scorecard."
  },
  supportNeed: {
    artifact: "supportNeed",
    stage: "inputIndex",
    label: "Support need",
    direction: "contextual",
    path: "MUI / vendor-backed paths",
    calculatedIn: "buildScorecard",
    description:
      "Support-demand index used in the scorecard and plan-fit logic."
  },
  teamScale: {
    artifact: "teamScale",
    stage: "inputIndex",
    label: "Team scale",
    direction: "neutral",
    path: "Both",
    calculatedIn: "buildScorecard",
    description:
      "Coarse frontend-team size band used in path scoring."
  },
  appScale: {
    artifact: "appScale",
    stage: "inputIndex",
    label: "App scale",
    direction: "neutral",
    path: "Both",
    calculatedIn: "buildScorecard",
    description:
      "Coarse React-app footprint band used in path scoring."
  },
  scaleDemand: {
    artifact: "scaleDemand",
    stage: "inputIndex",
    label: "Scale demand",
    direction: "neutral",
    path: "Both",
    calculatedIn: "buildPlanFit",
    description:
      "Combined scale signal used to measure coverage, fit, and simulation exposure."
  },
  featureDemand: {
    artifact: "featureDemand",
    stage: "inputIndex",
    label: "Feature demand",
    direction: "neutral",
    path: "Both",
    calculatedIn: "buildPlanFit",
    description:
      "Aggregate advanced-feature demand used when estimating coverage and fit."
  },
  horizonYears: {
    artifact: "horizonYears",
    stage: "simulationPrep",
    label: "Horizon years",
    direction: "neutral",
    path: "Both",
    calculatedIn: "runSimulation",
    description:
      "Maintenance horizon converted from months to years for the simulation."
  },
  laborCostPerWeek: {
    artifact: "laborCostPerWeek",
    stage: "simulationPrep",
    label: "Labor cost per week",
    direction: "cost",
    path: "Both",
    calculatedIn: "runSimulation",
    description:
      "Weekly engineering labor rate used to convert effort into TCO."
  },
  functionalComplexity: {
    artifact: "functionalComplexity",
    stage: "derivedFactor",
    label: "Functional complexity",
    direction: "bad",
    path: "Both",
    calculatedIn: "buildDerivedFactors",
    description:
      "Scores implementation complexity from use case, feature demand, scale, and screen load."
  },
  qualityBurden: {
    artifact: "qualityBurden",
    stage: "derivedFactor",
    label: "Quality burden",
    direction: "bad",
    path: "Both",
    calculatedIn: "buildDerivedFactors",
    description:
      "Scores verification burden from accessibility, scale, performance pressure, and demanding interactions."
  },
  deliveryMaturity: {
    artifact: "deliveryMaturity",
    stage: "derivedFactor",
    label: "Delivery maturity",
    direction: "good",
    path: "Both",
    calculatedIn: "buildDerivedFactors",
    description:
      "Scores the team’s ability to absorb work quickly and with low churn."
  },
  ownershipBurden: {
    artifact: "ownershipBurden",
    stage: "derivedFactor",
    label: "Ownership burden",
    direction: "bad",
    path: "Build",
    calculatedIn: "buildDerivedFactors",
    description:
      "Scores the coordination and maintenance drag of owning the component internally."
  },
  enterpriseReadiness: {
    artifact: "enterpriseReadiness",
    stage: "derivedFactor",
    label: "Enterprise readiness",
    direction: "contextual",
    path: "MUI / vendor-backed paths",
    calculatedIn: "buildDerivedFactors",
    description:
      "Measures support, procurement, rollout, and standardization relevance. Higher does not mean generally better; it increases relevance of stronger or vendor-backed paths."
  },
  functionalRisk: {
    artifact: "functionalRisk",
    stage: "scorecardRisk",
    label: "Functional risk",
    direction: "bad",
    path: "Both",
    calculatedIn: "buildScorecard",
    description:
      "Normalizes functional complexity into a risk signal for later calculations."
  },
  qualityRisk: {
    artifact: "qualityRisk",
    stage: "scorecardRisk",
    label: "Quality risk",
    direction: "bad",
    path: "Both",
    calculatedIn: "buildScorecard",
    description:
      "Normalizes quality burden into a risk signal for later calculations."
  },
  deliveryStrength: {
    artifact: "deliveryStrength",
    stage: "scorecardRisk",
    label: "Delivery strength",
    direction: "good",
    path: "Both",
    calculatedIn: "buildScorecard",
    description:
      "Normalizes delivery maturity into a strength signal for later calculations."
  },
  deliveryRisk: {
    artifact: "deliveryRisk",
    stage: "scorecardRisk",
    label: "Delivery risk",
    direction: "bad",
    path: "Both",
    calculatedIn: "buildScorecard",
    description:
      "Inverts delivery strength into a risk signal for later calculations."
  },
  ownershipRisk: {
    artifact: "ownershipRisk",
    stage: "scorecardRisk",
    label: "Ownership risk",
    direction: "bad",
    path: "Build",
    calculatedIn: "buildScorecard",
    description:
      "Normalizes ownership burden into a Build-path risk signal."
  },
  enterpriseNeed: {
    artifact: "enterpriseNeed",
    stage: "scorecardRisk",
    label: "Enterprise need",
    direction: "contextual",
    path: "MUI / vendor-backed paths",
    calculatedIn: "buildScorecard",
    description:
      "Normalizes enterprise readiness into a vendor-backed relevance signal."
  },
  useCaseCoverage: {
    artifact: "useCaseCoverage",
    stage: "planFit",
    label: "Use case coverage",
    direction: "good",
    path: "MUI",
    calculatedIn: "buildPlanFit",
    description:
      "Measures how well a specific MUI plan covers the selected primary use case."
  },
  featureCoverage: {
    artifact: "featureCoverage",
    stage: "planFit",
    label: "Feature coverage",
    direction: "good",
    path: "MUI",
    calculatedIn: "buildPlanFit",
    description:
      "Measures how much advanced-feature demand a MUI plan can absorb."
  },
  scaleCoverage: {
    artifact: "scaleCoverage",
    stage: "planFit",
    label: "Scale coverage",
    direction: "good",
    path: "MUI",
    calculatedIn: "buildPlanFit",
    description:
      "Measures how much scale demand a MUI plan can absorb."
  },
  supportFit: {
    artifact: "supportFit",
    stage: "planFit",
    label: "Support fit",
    direction: "good",
    path: "MUI / vendor-backed paths",
    calculatedIn: "buildPlanFit",
    description:
      "Measures how well a plan’s support capability matches the support requirement."
  },
  qualityFit: {
    artifact: "qualityFit",
    stage: "planFit",
    label: "Quality fit",
    direction: "good",
    path: "MUI",
    calculatedIn: "buildPlanFit",
    description:
      "Measures how well a plan can absorb the current quality burden."
  },
  adoptionBoost: {
    artifact: "adoptionBoost",
    stage: "planFit",
    label: "Adoption boost",
    direction: "good",
    path: "MUI",
    calculatedIn: "buildPlanFit",
    description:
      "Captures the lift from existing MUI usage when evaluating plan fit."
  },
  coverageScore: {
    artifact: "coverageScore",
    stage: "planFit",
    label: "Coverage score",
    direction: "good",
    path: "MUI",
    calculatedIn: "buildPlanFit",
    description:
      "Blends use case, feature, scale, support, quality, and adoption signals into a single plan-fit score."
  },
  coverageGap: {
    artifact: "coverageGap",
    stage: "planFit",
    label: "Coverage gap",
    direction: "bad",
    path: "MUI",
    calculatedIn: "buildPlanFit",
    description:
      "Inverts the coverage score into a remaining-fit gap."
  },
  integrationRisk: {
    artifact: "integrationRisk",
    stage: "planFit",
    label: "Integration risk",
    direction: "bad",
    path: "MUI",
    calculatedIn: "buildPlanFit",
    description:
      "Estimates the remaining integration and customization risk for the selected plan."
  },
  supportGap: {
    artifact: "supportGap",
    stage: "planFit",
    label: "Support gap",
    direction: "bad",
    path: "MUI / vendor-backed paths",
    calculatedIn: "buildPlanFit",
    description:
      "Estimates how much support demand remains beyond the plan’s support capability."
  },
  effectiveMuiPlan: {
    artifact: "effectiveMuiPlan",
    stage: "pathScore",
    label: "Effective MUI plan",
    direction: "contextual",
    path: "MUI",
    calculatedIn: "buildScorecard",
    description:
      "Selects the MUI tier the scorecard treats as the best-fit comparison path."
  },
  packagedAffinity: {
    artifact: "packagedAffinity",
    stage: "inputIndex",
    label: "Packaged affinity",
    direction: "contextual",
    path: "MUI",
    calculatedIn: "buildScenarioLevers",
    description:
      "Measures how naturally the selected use case aligns with a packaged MUI path."
  },
  buildTierScore: {
    artifact: "buildTierScore",
    stage: "pathScore",
    label: "Build tier score",
    direction: "good",
    path: "Build",
    calculatedIn: "buildScorecard",
    description:
      "Rule-based score for the Build path."
  },
  coreTierScore: {
    artifact: "coreTierScore",
    stage: "pathScore",
    label: "Core tier score",
    direction: "good",
    path: "MUI Core",
    calculatedIn: "buildScorecard",
    description:
      "Rule-based score for the MUI Core path."
  },
  premiumTierScore: {
    artifact: "premiumTierScore",
    stage: "pathScore",
    label: "Premium tier score",
    direction: "good",
    path: "MUI X Premium",
    calculatedIn: "buildScorecard",
    description:
      "Rule-based score for the MUI X Premium path."
  },
  enterpriseTierScore: {
    artifact: "enterpriseTierScore",
    stage: "pathScore",
    label: "Enterprise tier score",
    direction: "good",
    path: "MUI X Enterprise",
    calculatedIn: "buildScorecard",
    description:
      "Rule-based score for the MUI X Enterprise path."
  },
  icpScore: {
    artifact: "icpScore",
    stage: "pathScore",
    label: "ICP score",
    direction: "contextual",
    path: "MUI",
    calculatedIn: "buildScorecard",
    description:
      "Indicates how strongly the input set resembles an ideal customer profile for the packaged paths."
  },
  simpleScope: {
    artifact: "simpleScope",
    stage: "pathScore",
    label: "Simple scope",
    direction: "contextual",
    path: "Build",
    calculatedIn: "buildScorecard",
    description:
      "Flags whether the component scope is simple enough to keep Build competitive."
  },
  buildFriendlyContext: {
    artifact: "buildFriendlyContext",
    stage: "pathScore",
    label: "Build-friendly context",
    direction: "good",
    path: "Build",
    calculatedIn: "buildScorecard",
    description:
      "Flags whether the delivery and ownership context strongly favors an internal build."
  },
  enterpriseFitStrong: {
    artifact: "enterpriseFitStrong",
    stage: "pathScore",
    label: "Enterprise fit strong",
    direction: "contextual",
    path: "MUI X Enterprise",
    calculatedIn: "buildScorecard",
    description:
      "Flags whether enterprise support expectations are high enough to favor the Enterprise tier."
  },
  internalAbsorption: {
    artifact: "internalAbsorption",
    stage: "scenarioLever",
    label: "Internal absorption",
    direction: "good",
    path: "Build",
    calculatedIn: "buildScenarioLevers",
    description:
      "Measures how well the team can absorb custom implementation work."
  },
  buildReuseLeverage: {
    artifact: "buildReuseLeverage",
    stage: "scenarioLever",
    label: "Build reuse leverage",
    direction: "good",
    path: "Build",
    calculatedIn: "buildScenarioLevers",
    description:
      "Measures how much existing internal structure can be reused on the Build path."
  },
  muiLeverage: {
    artifact: "muiLeverage",
    stage: "scenarioLever",
    label: "MUI leverage",
    direction: "good",
    path: "MUI",
    calculatedIn: "buildScenarioLevers",
    description:
      "Measures how much work the selected MUI path can absorb because fit and adoption conditions are strong."
  },
  muiAdoptionBurden: {
    artifact: "muiAdoptionBurden",
    stage: "scenarioLever",
    label: "MUI adoption burden",
    direction: "bad",
    path: "MUI",
    calculatedIn: "buildScenarioLevers",
    description:
      "Measures the remaining adoption and adaptation burden for the selected MUI path."
  },
  downsideTailRisk: {
    artifact: "downsideTailRisk",
    stage: "scenarioLever",
    label: "Downside tail risk",
    direction: "bad",
    path: "Both",
    calculatedIn: "buildScenarioLevers",
    description:
      "Measures the long-tail downside exposure that can widen effort, slip, and maintenance variance."
  },
  coverageStrength: {
    artifact: "coverageStrength",
    stage: "simulationPrep",
    label: "Coverage strength",
    direction: "good",
    path: "MUI",
    calculatedIn: "runSimulation",
    description:
      "Normalizes the selected plan’s coverage score before simulation."
  },
  coverageShield: {
    artifact: "coverageShield",
    stage: "simulationPrep",
    label: "Coverage shield",
    direction: "good",
    path: "MUI",
    calculatedIn: "runSimulation",
    description:
      "Small simulation shield applied when coverage is strong enough."
  },
  buildAbsorptionShield: {
    artifact: "buildAbsorptionShield",
    stage: "simulationPrep",
    label: "Build absorption shield",
    direction: "good",
    path: "Build",
    calculatedIn: "runSimulation",
    description:
      "Simulation shield that reduces Build effort and maintenance when absorption is strong."
  },
  buildTailPenalty: {
    artifact: "buildTailPenalty",
    stage: "simulationPrep",
    label: "Build tail penalty",
    direction: "bad",
    path: "Build",
    calculatedIn: "runSimulation",
    description:
      "Penalty that widens Build variance when downside tail risk crosses the model threshold."
  },
  muiLeverageShield: {
    artifact: "muiLeverageShield",
    stage: "simulationPrep",
    label: "MUI leverage shield",
    direction: "good",
    path: "MUI",
    calculatedIn: "runSimulation",
    description:
      "Simulation shield that reduces MUI variance when leverage is strong."
  },
  muiAdoptionLoad: {
    artifact: "muiAdoptionLoad",
    stage: "simulationPrep",
    label: "MUI adoption load",
    direction: "bad",
    path: "MUI",
    calculatedIn: "runSimulation",
    description:
      "Simulation load factor that converts adoption burden into variance pressure."
  },
  buildFatTailExposure: {
    artifact: "buildFatTailExposure",
    stage: "simulationPrep",
    label: "Build fat-tail exposure",
    direction: "bad",
    path: "Build",
    calculatedIn: "runSimulation",
    description:
      "Exposure score used to decide whether Build experiences fat-tail downside events."
  },
  muiFatTailExposure: {
    artifact: "muiFatTailExposure",
    stage: "simulationPrep",
    label: "MUI fat-tail exposure",
    direction: "bad",
    path: "MUI",
    calculatedIn: "runSimulation",
    description:
      "Exposure score used to decide whether the MUI path experiences fat-tail downside events."
  },
  buildVelocity: {
    artifact: "buildVelocity",
    stage: "simulationPrep",
    label: "Build velocity",
    direction: "good",
    path: "Build",
    calculatedIn: "runSimulation",
    description:
      "Velocity factor used to convert Build engineering effort into launch timing."
  },
  muiVelocity: {
    artifact: "muiVelocity",
    stage: "simulationPrep",
    label: "MUI velocity",
    direction: "good",
    path: "MUI",
    calculatedIn: "runSimulation",
    description:
      "Velocity factor used to convert MUI engineering effort into launch timing."
  },
  buildEngineeringMean: {
    artifact: "buildEngineeringMean",
    stage: "buildSimulation",
    label: "Build engineering mean",
    direction: "bad",
    path: "Build",
    calculatedIn: "runSimulation",
    description:
      "Mean Build engineering effort before calibration and stochastic variance are applied."
  },
  buildEngineeringVariance: {
    artifact: "buildEngineeringVariance",
    stage: "buildSimulation",
    label: "Build engineering variance",
    direction: "mixed",
    path: "Build",
    calculatedIn: "runSimulation",
    description:
      "Variance band applied to Build engineering effort."
  },
  buildReworkMean: {
    artifact: "buildReworkMean",
    stage: "buildSimulation",
    label: "Build rework mean",
    direction: "bad",
    path: "Build",
    calculatedIn: "runSimulation",
    description:
      "Mean Build rework effort before calibration."
  },
  buildRework: {
    artifact: "buildRework",
    stage: "buildSimulation",
    label: "Build rework",
    direction: "bad",
    path: "Build",
    calculatedIn: "runSimulation",
    description:
      "Stochastic Build rework effort added to the engineering total."
  },
  buildEngineering: {
    artifact: "buildEngineering",
    stage: "buildSimulation",
    label: "Build engineering",
    direction: "bad",
    path: "Build",
    calculatedIn: "runSimulation",
    description:
      "Total Build engineering effort after calibration and rework."
  },
  buildSlipMean: {
    artifact: "buildSlipMean",
    stage: "buildSimulation",
    label: "Build slip mean",
    direction: "bad",
    path: "Build",
    calculatedIn: "runSimulation",
    description:
      "Mean Build slip burden before calibration."
  },
  buildSlip: {
    artifact: "buildSlip",
    stage: "buildSimulation",
    label: "Build slip",
    direction: "bad",
    path: "Build",
    calculatedIn: "runSimulation",
    description:
      "Stochastic Build slip burden added to launch time."
  },
  buildLaunch: {
    artifact: "buildLaunch",
    stage: "buildSimulation",
    label: "Build launch",
    direction: "bad",
    path: "Build",
    calculatedIn: "runSimulation",
    description:
      "Modeled Build launch duration in weeks."
  },
  buildMaintenance: {
    artifact: "buildMaintenance",
    stage: "buildSimulation",
    label: "Build maintenance",
    direction: "bad",
    path: "Build",
    calculatedIn: "runSimulation",
    description:
      "Modeled Build maintenance effort over the maintenance horizon."
  },
  buildTotalCost: {
    artifact: "buildTotalCost",
    stage: "buildSimulation",
    label: "Build total cost",
    direction: "cost",
    path: "Build",
    calculatedIn: "runSimulation",
    description:
      "Modeled Build TCO from engineering and maintenance labor."
  },
  muiEngineeringMean: {
    artifact: "muiEngineeringMean",
    stage: "muiSimulation",
    label: "MUI engineering mean",
    direction: "bad",
    path: "MUI",
    calculatedIn: "runSimulation",
    description:
      "Mean MUI engineering effort before calibration and stochastic variance are applied."
  },
  muiEngineeringVariance: {
    artifact: "muiEngineeringVariance",
    stage: "muiSimulation",
    label: "MUI engineering variance",
    direction: "mixed",
    path: "MUI",
    calculatedIn: "runSimulation",
    description:
      "Variance band applied to MUI engineering effort."
  },
  muiReworkMean: {
    artifact: "muiReworkMean",
    stage: "muiSimulation",
    label: "MUI rework mean",
    direction: "bad",
    path: "MUI",
    calculatedIn: "runSimulation",
    description:
      "Mean MUI rework effort before calibration."
  },
  muiRework: {
    artifact: "muiRework",
    stage: "muiSimulation",
    label: "MUI rework",
    direction: "bad",
    path: "MUI",
    calculatedIn: "runSimulation",
    description:
      "Stochastic MUI rework effort added to the engineering total."
  },
  muiEngineering: {
    artifact: "muiEngineering",
    stage: "muiSimulation",
    label: "MUI engineering",
    direction: "bad",
    path: "MUI",
    calculatedIn: "runSimulation",
    description:
      "Total MUI engineering effort after calibration and rework."
  },
  muiSlipMean: {
    artifact: "muiSlipMean",
    stage: "muiSimulation",
    label: "MUI slip mean",
    direction: "bad",
    path: "MUI",
    calculatedIn: "runSimulation",
    description:
      "Mean MUI slip burden before calibration."
  },
  muiSlip: {
    artifact: "muiSlip",
    stage: "muiSimulation",
    label: "MUI slip",
    direction: "bad",
    path: "MUI",
    calculatedIn: "runSimulation",
    description:
      "Stochastic MUI slip burden added to launch time."
  },
  muiLaunch: {
    artifact: "muiLaunch",
    stage: "muiSimulation",
    label: "MUI launch",
    direction: "bad",
    path: "MUI",
    calculatedIn: "runSimulation",
    description:
      "Modeled MUI launch duration in weeks."
  },
  muiMaintenance: {
    artifact: "muiMaintenance",
    stage: "muiSimulation",
    label: "MUI maintenance",
    direction: "bad",
    path: "MUI",
    calculatedIn: "runSimulation",
    description:
      "Modeled MUI maintenance effort over the maintenance horizon."
  },
  estimatedLicensedDevelopers: {
    artifact: "estimatedLicensedDevelopers",
    stage: "muiSimulation",
    label: "Estimated licensed developers",
    direction: "cost",
    path: "MUI",
    calculatedIn: "estimateLicensedDevelopers / runSimulation",
    description:
      "Estimated developer seat count used to calculate paid MUI license cost."
  },
  muiLicenseCost: {
    artifact: "muiLicenseCost",
    stage: "muiSimulation",
    label: "MUI license cost",
    direction: "cost",
    path: "MUI",
    calculatedIn: "runSimulation",
    description:
      "Modeled license cost for the selected MUI plan over the maintenance horizon."
  },
  muiTotalCost: {
    artifact: "muiTotalCost",
    stage: "muiSimulation",
    label: "MUI total cost",
    direction: "cost",
    path: "MUI",
    calculatedIn: "runSimulation",
    description:
      "Modeled MUI TCO from engineering, maintenance, and license cost."
  },
  buildPath: {
    artifact: "buildPath",
    stage: "output",
    label: "Build path",
    direction: "neutral",
    path: "Build",
    calculatedIn: "runSimulation",
    description:
      "Displayed Build-path summary of launch, engineering, and TCO percentiles."
  },
  muiPath: {
    artifact: "muiPath",
    stage: "output",
    label: "MUI path",
    direction: "neutral",
    path: "MUI",
    calculatedIn: "runSimulation",
    description:
      "Displayed MUI-path summary of launch, engineering, and TCO percentiles."
  },
  comparison: {
    artifact: "comparison",
    stage: "output",
    label: "Comparison",
    direction: "mixed",
    path: "Both",
    calculatedIn: "runSimulation",
    description:
      "Displayed probability and median deltas comparing Build against the selected MUI path."
  },
  recommendation: {
    artifact: "recommendation",
    stage: "recommendation",
    label: "Recommendation",
    direction: "contextual",
    path: "Both",
    calculatedIn: "buildRecommendation",
    description:
      "Final path recommendation and summary."
  },
  confidence: {
    artifact: "confidence",
    stage: "recommendation",
    label: "Confidence",
    direction: "contextual",
    path: "Both",
    calculatedIn: "buildRecommendation",
    description:
      "Final confidence score and rationale for the recommendation."
  }
};
