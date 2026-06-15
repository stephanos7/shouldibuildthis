export const MODEL_ARTIFACT_GLOSSARY = {
  frontendDevelopers: {
    artifact: "frontendDevelopers",
    stage: "rawInput",
    label: "Frontend developers",
    direction: "mixed",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Counts frontend capacity available to the team. More developers improve capacity, can increase standardization relevance, and should not increase ownership burden."
  },
  reactApps: {
    artifact: "reactApps",
    stage: "rawInput",
    label: "React apps",
    direction: "mixed",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Measures the React footprint that must absorb the change. More apps widen rollout and ownership surface while increasing the relevance of standardization and vendor-backed rollout paths."
  },
  dependentTeams: {
    artifact: "dependentTeams",
    stage: "rawInput",
    label: "Dependent teams",
    direction: "mixed",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Captures how many other teams depend on this work. More dependent teams raise coordination drag, enterprise relevance, downside risk, and cost exposure on Enterprise-style plans."
  },
  ownershipModel: {
    artifact: "ownershipModel",
    stage: "rawInput",
    label: "Ownership model",
    direction: "mixed",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Describes how clearly the team owns the UI surface. Clear ownership improves absorption and reuse; unclear ownership increases coordination and adoption burden."
  },
  existingMuiUsage: {
    artifact: "existingMuiUsage",
    stage: "rawInput",
    label: "Existing MUI usage",
    direction: "mixed",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Indicates how much MUI is already present in the codebase. More existing usage increases adoption, coverage, and leverage for packaged paths while lowering integration risk and remaining burden."
  },
  designSystemMaturity: {
    artifact: "designSystemMaturity",
    stage: "rawInput",
    label: "Design system maturity",
    direction: "mixed",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Represents the maturity of internal UI standards and patterns. Higher maturity improves Build reuse and absorption, but can increase MUI adaptation burden when no MUI baseline exists."
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
      "Counts screens that carry large tables or similar dense data states. More screens increase interaction complexity, quality burden, and effort pressure."
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
      "Represents how quickly the team can ship change. Faster lead time improves delivery maturity, internal absorption, and velocity."
  },
  reworkFrequency: {
    artifact: "reworkFrequency",
    stage: "rawInput",
    label: "Rework frequency",
    direction: "good",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Describes how often the team revisits or churns UI work. Rarer rework improves delivery maturity and reduces slip burden."
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
      "Expresses the desired vendor or support level. Higher support need raises enterprise readiness and can create support gaps for weaker packaged paths without forcing Enterprise alone."
  },
  ownershipHorizon: {
    artifact: "ownershipHorizon",
    stage: "rawInput",
    label: "Ownership horizon",
    direction: "contextual",
    path: "Vendor-backed / standardized paths",
    calculatedIn: "normalizeInput",
    description:
      "Defines how long the component is expected to remain under active ownership. Longer horizons increase long-lived support relevance and paid-path fit."
  },
  performanceSensitivity: {
    artifact: "performanceSensitivity",
    stage: "rawInput",
    label: "Performance sensitivity",
    direction: "mixed",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Captures how tightly performance is constrained. Stronger sensitivity raises quality burden and changes path fit only when Build or the selected MUI path appears ready to absorb it."
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
    direction: "contextual",
    path: "Both",
    calculatedIn: "normalizeInput",
    description:
      "Describes how operationally sensitive the component is. Higher criticality increases quality burden and makes vendor-backed support more relevant."
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
      "Numeric index for design system maturity used in the scorecard."
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
      "Combined scale signal used to measure coverage and fit."
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
    path: "Vendor-backed / standardized paths",
    calculatedIn: "buildDerivedFactors",
    description:
      "Measures support, procurement, rollout, and standardization relevance. Higher values increase the relevance of vendor-backed or standardized paths but are not inherently better."
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
    path: "Vendor-backed / standardized paths",
    calculatedIn: "buildScorecard",
    description:
      "Normalizes enterprise readiness into a signal that increases the relevance of vendor-backed and standardized paths."
  },
  useCaseCoverage: {
    artifact: "useCaseCoverage",
    stage: "planFit",
    label: "Use case coverage",
    direction: "good",
    path: "MUI",
    calculatedIn: "buildPlanFit",
    description:
      "Measures how well the selected plan covers the primary use case."
  },
  featureCoverage: {
    artifact: "featureCoverage",
    stage: "planFit",
    label: "Feature coverage",
    direction: "good",
    path: "MUI",
    calculatedIn: "buildPlanFit",
    description:
      "Measures how well the selected plan covers the selected advanced features."
  },
  scaleCoverage: {
    artifact: "scaleCoverage",
    stage: "planFit",
    label: "Scale coverage",
    direction: "good",
    path: "MUI",
    calculatedIn: "buildPlanFit",
    description:
      "Measures whether the selected plan can handle the expected row and column scale."
  },
  supportFit: {
    artifact: "supportFit",
    stage: "planFit",
    label: "Support fit",
    direction: "good",
    path: "MUI",
    calculatedIn: "buildPlanFit",
    description:
      "Measures whether the selected plan’s support capability matches the stated support requirement."
  },
  qualityFit: {
    artifact: "qualityFit",
    stage: "planFit",
    label: "Quality fit",
    direction: "good",
    path: "MUI",
    calculatedIn: "buildPlanFit",
    description:
      "Measures whether the selected plan fits the quality burden implied by the assessment."
  },
  adoptionBoost: {
    artifact: "adoptionBoost",
    stage: "planFit",
    label: "Adoption boost",
    direction: "good",
    path: "MUI",
    calculatedIn: "buildPlanFit",
    description:
      "Captures prior MUI adoption that makes packaged-path rollout easier."
  },
  coverageScore: {
    artifact: "coverageScore",
    stage: "planFit",
    label: "Coverage score",
    direction: "good",
    path: "MUI",
    calculatedIn: "buildPlanFit",
    description:
      "Aggregated fit score across use case, feature, scale, support, quality, and adoption signals."
  },
  coverageGap: {
    artifact: "coverageGap",
    stage: "planFit",
    label: "Coverage gap",
    direction: "bad",
    path: "MUI",
    calculatedIn: "buildPlanFit",
    description:
      "Represents the remaining fit gap after plan coverage is scored."
  },
  integrationRisk: {
    artifact: "integrationRisk",
    stage: "planFit",
    label: "Integration risk",
    direction: "bad",
    path: "MUI",
    calculatedIn: "buildPlanFit",
    description:
      "Captures the likelihood that the selected plan will be difficult to integrate cleanly."
  },
  supportGap: {
    artifact: "supportGap",
    stage: "planFit",
    label: "Support gap",
    direction: "bad",
    path: "MUI",
    calculatedIn: "buildPlanFit",
    description:
      "Captures the remaining mismatch between support need and plan capability."
  },
  effectiveMuiPlan: {
    artifact: "effectiveMuiPlan",
    stage: "pathScore",
    label: "Effective MUI plan",
    direction: "contextual",
    path: "MUI",
    calculatedIn: "buildScorecard",
    description:
      "The selected Core, Premium, or Enterprise MUI path after plan-fit and scorecard evaluation."
  },
  buildFit: {
    artifact: "buildFit",
    stage: "pathScore",
    label: "Build fit",
    direction: "good",
    path: "Build",
    calculatedIn: "buildScorecard",
    description:
      "Build-path fit score before recommendation."
  },
  coreFit: {
    artifact: "coreFit",
    stage: "pathScore",
    label: "Core fit",
    direction: "good",
    path: "MUI Core",
    calculatedIn: "buildScorecard",
    description:
      "Core-path fit score before recommendation."
  },
  premiumFit: {
    artifact: "premiumFit",
    stage: "pathScore",
    label: "Premium fit",
    direction: "good",
    path: "MUI Premium",
    calculatedIn: "buildScorecard",
    description:
      "Premium-path fit score before recommendation."
  },
  enterpriseFit: {
    artifact: "enterpriseFit",
    stage: "pathScore",
    label: "Enterprise fit",
    direction: "good",
    path: "MUI Enterprise",
    calculatedIn: "buildScorecard",
    description:
      "Enterprise-path fit score before recommendation."
  },
  icpScore: {
    artifact: "icpScore",
    stage: "pathScore",
    label: "ICP score",
    direction: "contextual",
    path: "Both",
    calculatedIn: "buildScorecard",
    description:
      "Overall ideal-customer-profile score used to compare Build and packaged paths."
  },
  simpleScope: {
    artifact: "simpleScope",
    stage: "pathScore",
    label: "Contained-scope guardrail",
    direction: "contextual",
    path: "Both",
    calculatedIn: "buildScorecard",
    description:
      "Boolean guardrail indicating that the UI scope is contained enough that Build or MUI Core should remain credible and paid MUI tiers should require stronger justification. It is not an effort estimate."
  },
  buildFriendlyContext: {
    artifact: "buildFriendlyContext",
    stage: "pathScore",
    label: "Build-friendly context",
    direction: "contextual",
    path: "Build",
    calculatedIn: "buildScorecard",
    description:
      "Flags a context where Build has enough structural advantages to stay credible."
  },
  enterpriseFitStrong: {
    artifact: "enterpriseFitStrong",
    stage: "pathScore",
    label: "Enterprise fit strong",
    direction: "contextual",
    path: "MUI Enterprise",
    calculatedIn: "buildScorecard",
    description:
      "Flags a strong Enterprise fit when support, scale, and rollout conditions are aligned."
  },
  internalAbsorption: {
    artifact: "internalAbsorption",
    stage: "scenarioLever",
    label: "Internal absorption",
    direction: "good",
    path: "Build",
    calculatedIn: "buildScenarioLevers",
    description:
      "Measures how readily the team can absorb Build-path work without excessive drag."
  },
  buildReuseLeverage: {
    artifact: "buildReuseLeverage",
    stage: "scenarioLever",
    label: "Build reuse leverage",
    direction: "good",
    path: "Build",
    calculatedIn: "buildScenarioLevers",
    description:
      "Measures how much internal reuse and shared pattern leverage the Build path can capture."
  },
  muiLeverage: {
    artifact: "muiLeverage",
    stage: "scenarioLever",
    label: "MUI leverage",
    direction: "good",
    path: "MUI",
    calculatedIn: "buildScenarioLevers",
    description:
      "Measures how much the packaged path can absorb existing adoption and standardization advantages."
  },
  muiAdoptionBurden: {
    artifact: "muiAdoptionBurden",
    stage: "scenarioLever",
    label: "MUI adoption burden",
    direction: "bad",
    path: "MUI",
    calculatedIn: "buildScenarioLevers",
    description:
      "Measures the effort required to adopt and adapt a packaged path."
  },
  downsideTailRisk: {
    artifact: "downsideTailRisk",
    stage: "scenarioLever",
    label: "Downside tail risk",
    direction: "bad",
    path: "Both",
    calculatedIn: "buildScenarioLevers",
    description:
      "Measures downside pressure that weakens path fit when delivery, ownership, and quality conditions are unstable."
  },
  pathFits: {
    artifact: "pathFits",
    stage: "output",
    label: "Path fits",
    direction: "neutral",
    path: "Both",
    calculatedIn: "buildPathFits",
    description:
      "Displayed deterministic fit scores, strengths, and drags for Build, Core, Premium, and Enterprise."
  },
  planFits: {
    artifact: "planFits",
    stage: "output",
    label: "Plan fits",
    direction: "neutral",
    path: "MUI",
    calculatedIn: "buildPlanFit",
    description:
      "Displayed plan-fit metrics for the MUI tiers, including coverage, support gap, and integration risk."
  },
  recommendation: {
    artifact: "recommendation",
    stage: "recommendation",
    label: "Recommendation",
    direction: "contextual",
    path: "Both",
    calculatedIn: "buildDeterministicRecommendation",
    description:
      "Final recommendation artifact that explains the chosen path."
  },
  confidence: {
    artifact: "confidence",
    stage: "recommendation",
    label: "Confidence",
    direction: "neutral",
    path: "Both",
    calculatedIn: "buildDeterministicRecommendation",
    description:
      "Deterministic confidence level attached to the recommendation."
  }
};
