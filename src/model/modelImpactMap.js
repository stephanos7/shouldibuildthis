export const MODEL_IMPACT_MAP = {
  frontendDevelopers: {
    label: "Frontend developers",
    group: "Team capacity and ownership",
    direction: "mixed",
    impacts: [
      {
        artifact: "buildVelocity",
        stage: "simulationPrep",
        path: "Build",
        direction: "good",
        calculatedIn: "runSimulation",
        reason:
          "More frontend capacity increases internal delivery velocity on the Build path."
      },
      {
        artifact: "enterpriseReadiness",
        stage: "derivedFactor",
        path: "MUI / vendor-backed paths",
        direction: "contextual",
        calculatedIn: "buildDerivedFactors",
        reason:
          "A larger frontend organization can increase the relevance of standardization and vendor-backed rollout paths."
      },
      {
        artifact: "estimatedLicensedDevelopers",
        stage: "muiSimulation",
        path: "MUI",
        direction: "cost",
        calculatedIn: "estimateLicensedDevelopers",
        reason:
          "More frontend developers can increase paid seat exposure on Premium and Enterprise paths."
      }
    ]
  },
  reactApps: {
    label: "React apps",
    group: "Team capacity and footprint",
    direction: "mixed",
    impacts: [
      {
        artifact: "ownershipBurden",
        stage: "derivedFactor",
        path: "Build",
        direction: "bad",
        calculatedIn: "buildDerivedFactors",
        reason:
          "A larger app footprint expands rollout and long-term ownership drag for custom components."
      },
      {
        artifact: "enterpriseReadiness",
        stage: "derivedFactor",
        path: "MUI / vendor-backed paths",
        direction: "contextual",
        calculatedIn: "buildDerivedFactors",
        reason:
          "A broader footprint increases the relevance of standardization and vendor-backed deployment support."
      },
      {
        artifact: "buildLaunch",
        stage: "buildSimulation",
        path: "Build",
        direction: "bad",
        calculatedIn: "runSimulation",
        reason:
          "More apps increase rollout overhead and can slow the Build path."
      },
      {
        artifact: "muiLaunch",
        stage: "muiSimulation",
        path: "MUI",
        direction: "bad",
        calculatedIn: "runSimulation",
        reason:
          "More apps increase rollout overhead even when using a packaged path."
      },
      {
        artifact: "estimatedLicensedDevelopers",
        stage: "muiSimulation",
        path: "MUI",
        direction: "cost",
        calculatedIn: "estimateLicensedDevelopers",
        reason:
          "A large app footprint can increase Enterprise seat exposure."
      }
    ]
  },
  dependentTeams: {
    label: "Dependent teams",
    group: "Organization and ownership",
    direction: "mixed",
    impacts: [
      {
        artifact: "ownershipBurden",
        stage: "derivedFactor",
        path: "Build",
        direction: "bad",
        calculatedIn: "buildDerivedFactors",
        reason:
          "More dependent teams increase coordination load and long-term ownership drag."
      },
      {
        artifact: "internalAbsorption",
        stage: "scenarioLever",
        path: "Build",
        direction: "bad",
        calculatedIn: "buildScenarioLevers",
        reason:
          "More dependent teams reduce the team’s ability to absorb custom work cleanly."
      },
      {
        artifact: "downsideTailRisk",
        stage: "scenarioLever",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildScenarioLevers",
        reason:
          "More dependent teams widen the long-tail coordination and QA downside."
      },
      {
        artifact: "enterpriseReadiness",
        stage: "derivedFactor",
        path: "MUI / vendor-backed paths",
        direction: "contextual",
        calculatedIn: "buildDerivedFactors",
        reason:
          "A larger dependency graph increases the relevance of rollout coordination and vendor-backed support."
      },
      {
        artifact: "estimatedLicensedDevelopers",
        stage: "muiSimulation",
        path: "MUI",
        direction: "cost",
        calculatedIn: "estimateLicensedDevelopers",
        reason:
          "A wide dependency graph can increase Enterprise seat exposure."
      }
    ]
  },
  ownershipModel: {
    label: "Ownership model",
    group: "Organization and ownership",
    direction: "mixed",
    impacts: [
      {
        artifact: "internalAbsorption",
        stage: "scenarioLever",
        path: "Build",
        direction: "good",
        calculatedIn: "buildScenarioLevers",
        reason:
          "Clearer ownership makes it easier for the team to absorb custom work."
      },
      {
        artifact: "buildReuseLeverage",
        stage: "scenarioLever",
        path: "Build",
        direction: "good",
        calculatedIn: "buildScenarioLevers",
        reason:
          "Clear ownership helps internal patterns and previous work be reused cleanly."
      },
      {
        artifact: "ownershipBurden",
        stage: "derivedFactor",
        path: "Build",
        direction: "bad",
        calculatedIn: "buildDerivedFactors",
        reason:
          "Unclear ownership increases coordination and maintenance burden."
      },
      {
        artifact: "muiAdoptionBurden",
        stage: "scenarioLever",
        path: "MUI",
        direction: "bad",
        calculatedIn: "buildScenarioLevers",
        reason:
          "Unclear ownership makes packaged-path adaptation harder to absorb."
      }
    ]
  },
  existingMuiUsage: {
    label: "Existing MUI usage",
    group: "Adoption and standards",
    direction: "mixed",
    impacts: [
      {
        artifact: "adoptionBoost",
        stage: "planFit",
        path: "MUI",
        direction: "good",
        calculatedIn: "buildPlanFit",
        reason:
          "Existing usage increases the chance that the packaged path fits the current codebase."
      },
      {
        artifact: "coverageScore",
        stage: "planFit",
        path: "MUI",
        direction: "good",
        calculatedIn: "buildPlanFit",
        reason:
          "Existing usage improves overall fit by lowering adoption friction."
      },
      {
        artifact: "muiLeverage",
        stage: "scenarioLever",
        path: "MUI",
        direction: "good",
        calculatedIn: "buildScenarioLevers",
        reason:
          "Existing MUI usage lets the selected MUI path absorb more work."
      },
      {
        artifact: "integrationRisk",
        stage: "planFit",
        path: "MUI",
        direction: "bad",
        calculatedIn: "buildPlanFit",
        reason:
          "A larger existing MUI footprint reduces remaining integration risk."
      },
      {
        artifact: "muiAdoptionBurden",
        stage: "scenarioLever",
        path: "MUI",
        direction: "bad",
        calculatedIn: "buildScenarioLevers",
        reason:
          "More prior usage lowers the remaining adoption burden on the packaged path."
      },
      {
        artifact: "buildReuseLeverage",
        stage: "scenarioLever",
        path: "Build",
        direction: "bad",
        calculatedIn: "buildScenarioLevers",
        reason:
          "Standardized MUI can reduce the amount of internal reuse leverage left for Build."
      }
    ]
  },
  designSystemMaturity: {
    label: "Design system maturity",
    group: "Adoption and standards",
    direction: "mixed",
    impacts: [
      {
        artifact: "internalAbsorption",
        stage: "scenarioLever",
        path: "Build",
        direction: "good",
        calculatedIn: "buildScenarioLevers",
        reason:
          "Higher maturity makes the team better able to absorb custom implementation work."
      },
      {
        artifact: "buildReuseLeverage",
        stage: "scenarioLever",
        path: "Build",
        direction: "good",
        calculatedIn: "buildScenarioLevers",
        reason:
          "Mature internal patterns increase the amount of useful reuse on the Build path."
      },
      {
        artifact: "ownershipBurden",
        stage: "derivedFactor",
        path: "Build",
        direction: "bad",
        calculatedIn: "buildDerivedFactors",
        reason:
          "Higher maturity lowers the burden of maintaining shared internal UI."
      },
      {
        artifact: "muiAdoptionBurden",
        stage: "scenarioLever",
        path: "MUI",
        direction: "bad",
        calculatedIn: "buildScenarioLevers",
        reason:
          "When existing MUI usage is none, strong internal patterns can make MUI adaptation more work, not less."
      }
    ]
  },
  primaryUseCase: {
    label: "Primary use case",
    group: "Functional scope",
    direction: "mixed",
    impacts: [
      {
        artifact: "useCaseComplexity",
        stage: "inputIndex",
        path: "Both",
        direction: "neutral",
        calculatedIn: "buildDerivedFactors",
        reason:
          "The selected use case sets the baseline complexity index."
      },
      {
        artifact: "useCaseCoverage",
        stage: "planFit",
        path: "MUI",
        direction: "good",
        calculatedIn: "buildPlanFit",
        reason:
          "The selected use case determines how well each MUI plan covers the workload."
      },
      {
        artifact: "packagedAffinity",
        stage: "scenarioLever",
        path: "MUI",
        direction: "good",
        calculatedIn: "buildScenarioLevers",
        reason:
          "The use case determines how naturally a packaged path fits the problem space."
      },
      {
        artifact: "functionalComplexity",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildDerivedFactors",
        reason:
          "Different component families carry different levels of implementation complexity."
      },
      {
        artifact: "coverageScore",
        stage: "planFit",
        path: "MUI",
        direction: "good",
        calculatedIn: "buildPlanFit",
        reason:
          "Use case fit is a major part of the total plan-fit score."
      },
      {
        artifact: "effectiveMuiPlan",
        stage: "pathScore",
        path: "MUI",
        direction: "contextual",
        calculatedIn: "buildScorecard",
        reason:
          "The use case helps select the best-fit MUI tier."
      }
    ]
  },
  dataHeavyScreens: {
    label: "Data-heavy screens",
    group: "Functional scope",
    direction: "bad",
    impacts: [
      {
        artifact: "screenLoad",
        stage: "inputIndex",
        path: "Both",
        direction: "neutral",
        calculatedIn: "buildDerivedFactors",
        reason:
          "More data-heavy screens increase the screen-load index."
      },
      {
        artifact: "functionalComplexity",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildDerivedFactors",
        reason:
          "More dense screens increase interaction and state complexity."
      },
      {
        artifact: "functionalRisk",
        stage: "scorecardRisk",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildScorecard",
        reason:
          "Higher functional complexity raises the normalized functional-risk score."
      }
    ]
  },
  expectedRows: {
    label: "Expected rows",
    group: "Scale and verification",
    direction: "bad",
    impacts: [
      {
        artifact: "rowScale",
        stage: "inputIndex",
        path: "Both",
        direction: "neutral",
        calculatedIn: "buildDerivedFactors",
        reason:
          "More rows increase the normalized row-scale index."
      },
      {
        artifact: "functionalComplexity",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildDerivedFactors",
        reason:
          "More rows increase scope and state complexity."
      },
      {
        artifact: "qualityBurden",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildDerivedFactors",
        reason:
          "Larger row counts increase performance and regression burden."
      },
      {
        artifact: "scaleCoverage",
        stage: "planFit",
        path: "MUI",
        direction: "bad",
        calculatedIn: "buildPlanFit",
        reason:
          "Large row counts can exceed the selected MUI plan’s scale capacity."
      },
      {
        artifact: "coverageGap",
        stage: "planFit",
        path: "MUI",
        direction: "bad",
        calculatedIn: "buildPlanFit",
        reason:
          "Lower scale coverage increases the remaining fit gap."
      },
      {
        artifact: "integrationRisk",
        stage: "planFit",
        path: "MUI",
        direction: "bad",
        calculatedIn: "buildPlanFit",
        reason:
          "Larger row bands raise integration and tuning risk."
      },
      {
        artifact: "downsideTailRisk",
        stage: "scenarioLever",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildScenarioLevers",
        reason:
          "High scale widens the long-tail downside distribution."
      }
    ]
  },
  expectedColumns: {
    label: "Expected columns",
    group: "Scale and verification",
    direction: "bad",
    impacts: [
      {
        artifact: "columnScale",
        stage: "inputIndex",
        path: "Both",
        direction: "neutral",
        calculatedIn: "buildDerivedFactors",
        reason:
          "More columns increase the normalized column-scale index."
      },
      {
        artifact: "functionalComplexity",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildDerivedFactors",
        reason:
          "More columns increase scope and state complexity."
      },
      {
        artifact: "qualityBurden",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildDerivedFactors",
        reason:
          "Wider column counts increase performance and regression burden."
      },
      {
        artifact: "scaleCoverage",
        stage: "planFit",
        path: "MUI",
        direction: "bad",
        calculatedIn: "buildPlanFit",
        reason:
          "Large column counts can exceed the selected MUI plan’s scale capacity."
      },
      {
        artifact: "coverageGap",
        stage: "planFit",
        path: "MUI",
        direction: "bad",
        calculatedIn: "buildPlanFit",
        reason:
          "Lower scale coverage increases the remaining fit gap."
      },
      {
        artifact: "integrationRisk",
        stage: "planFit",
        path: "MUI",
        direction: "bad",
        calculatedIn: "buildPlanFit",
        reason:
          "Wider column bands raise integration and tuning risk."
      },
      {
        artifact: "downsideTailRisk",
        stage: "scenarioLever",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildScenarioLevers",
        reason:
          "High scale widens the long-tail downside distribution."
      }
    ]
  },
  advancedFeatures: {
    label: "Advanced features",
    group: "Functional scope",
    direction: "mixed",
    impacts: [
      {
        artifact: "featureWeight",
        stage: "inputIndex",
        path: "Both",
        direction: "neutral",
        calculatedIn: "buildDerivedFactors",
        reason:
          "Selected features are aggregated into a feature-weight index."
      },
      {
        artifact: "featureDemand",
        stage: "inputIndex",
        path: "Both",
        direction: "neutral",
        calculatedIn: "buildPlanFit",
        reason:
          "Selected features are aggregated into the feature-demand index for plan fit."
      },
      {
        artifact: "functionalComplexity",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildDerivedFactors",
        reason:
          "Advanced behaviors add implementation complexity."
      },
      {
        artifact: "qualityBurden",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildDerivedFactors",
        reason:
          "Advanced behaviors add verification and edge-case burden."
      },
      {
        artifact: "featureCoverage",
        stage: "planFit",
        path: "MUI",
        direction: "bad",
        calculatedIn: "buildPlanFit",
        reason:
          "More advanced features can exceed packaged feature capacity."
      },
      {
        artifact: "coverageGap",
        stage: "planFit",
        path: "MUI",
        direction: "bad",
        calculatedIn: "buildPlanFit",
        reason:
          "Lower feature coverage increases the remaining fit gap."
      },
      {
        artifact: "muiAdoptionBurden",
        stage: "scenarioLever",
        path: "MUI",
        direction: "bad",
        calculatedIn: "buildScenarioLevers",
        reason:
          "Custom-heavy features make the packaged path harder to adapt."
      },
      {
        artifact: "downsideTailRisk",
        stage: "scenarioLever",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildScenarioLevers",
        reason:
          "More advanced behaviors widen the long-tail downside distribution."
      }
    ]
  },
  accessibilityTarget: {
    label: "Accessibility target",
    group: "Quality and compliance",
    direction: "bad",
    impacts: [
      {
        artifact: "qualityBurden",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildDerivedFactors",
        reason:
          "Stricter accessibility targets increase verification burden."
      },
      {
        artifact: "qualityRisk",
        stage: "scorecardRisk",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildScorecard",
        reason:
          "Stricter accessibility targets increase the normalized quality-risk score."
      },
      {
        artifact: "qualityFit",
        stage: "planFit",
        path: "MUI",
        direction: "good",
        calculatedIn: "buildPlanFit",
        reason:
          "Accessibility fit changes as the plan has to absorb more or less QA burden."
      },
      {
        artifact: "downsideTailRisk",
        stage: "scenarioLever",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildScenarioLevers",
        reason:
          "Stricter accessibility targets can widen the long-tail QA downside."
      }
    ]
  },
  changeLeadTime: {
    label: "Change lead time",
    group: "Delivery maturity",
    direction: "good",
    impacts: [
      {
        artifact: "deliveryMaturity",
        stage: "derivedFactor",
        path: "Both",
        direction: "good",
        calculatedIn: "buildDerivedFactors",
        reason:
          "Faster lead time improves the delivery-maturity score."
      },
      {
        artifact: "deliveryStrength",
        stage: "scorecardRisk",
        path: "Both",
        direction: "good",
        calculatedIn: "buildScorecard",
        reason:
          "Faster lead time improves normalized delivery strength."
      },
      {
        artifact: "deliveryRisk",
        stage: "scorecardRisk",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildScorecard",
        reason:
          "Faster lead time lowers the normalized delivery-risk score."
      },
      {
        artifact: "internalAbsorption",
        stage: "scenarioLever",
        path: "Build",
        direction: "good",
        calculatedIn: "buildScenarioLevers",
        reason:
          "Faster lead time improves the team’s capacity to absorb work."
      },
      {
        artifact: "buildVelocity",
        stage: "simulationPrep",
        path: "Build",
        direction: "good",
        calculatedIn: "runSimulation",
        reason:
          "Faster lead time supports faster Build delivery velocity."
      },
      {
        artifact: "muiVelocity",
        stage: "simulationPrep",
        path: "MUI",
        direction: "good",
        calculatedIn: "runSimulation",
        reason:
          "Faster lead time also improves packaged-path delivery velocity."
      }
    ]
  },
  reworkFrequency: {
    label: "Rework frequency",
    group: "Delivery maturity",
    direction: "good",
    impacts: [
      {
        artifact: "deliveryMaturity",
        stage: "derivedFactor",
        path: "Both",
        direction: "good",
        calculatedIn: "buildDerivedFactors",
        reason:
          "Rare rework improves the delivery-maturity score."
      },
      {
        artifact: "deliveryRisk",
        stage: "scorecardRisk",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildScorecard",
        reason:
          "Rare rework lowers delivery risk."
      },
      {
        artifact: "internalAbsorption",
        stage: "scenarioLever",
        path: "Build",
        direction: "good",
        calculatedIn: "buildScenarioLevers",
        reason:
          "Rare rework improves the team’s capacity to absorb work without churn."
      },
      {
        artifact: "buildReworkMean",
        stage: "buildSimulation",
        path: "Build",
        direction: "bad",
        calculatedIn: "runSimulation",
        reason:
          "Frequent rework increases the Build rework baseline."
      },
      {
        artifact: "muiReworkMean",
        stage: "muiSimulation",
        path: "MUI",
        direction: "bad",
        calculatedIn: "runSimulation",
        reason:
          "Frequent rework increases the packaged-path rework baseline."
      }
    ]
  },
  deadlinePressure: {
    label: "Deadline pressure",
    group: "Delivery maturity",
    direction: "bad",
    impacts: [
      {
        artifact: "deliveryMaturity",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildDerivedFactors",
        reason:
          "Higher deadline pressure lowers the delivery-maturity score."
      },
      {
        artifact: "deliveryRisk",
        stage: "scorecardRisk",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildScorecard",
        reason:
          "Higher deadline pressure increases delivery risk."
      },
      {
        artifact: "internalAbsorption",
        stage: "scenarioLever",
        path: "Build",
        direction: "bad",
        calculatedIn: "buildScenarioLevers",
        reason:
          "Schedule compression lowers the team’s ability to absorb work."
      },
      {
        artifact: "downsideTailRisk",
        stage: "scenarioLever",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildScenarioLevers",
        reason:
          "Schedule compression widens downside tail risk."
      },
      {
        artifact: "buildSlip",
        stage: "buildSimulation",
        path: "Build",
        direction: "bad",
        calculatedIn: "runSimulation",
        reason:
          "Higher deadline pressure increases Build slip risk."
      }
    ]
  },
  supportRequirement: {
    label: "Support requirement",
    group: "Support and procurement",
    direction: "contextual",
    impacts: [
      {
        artifact: "supportNeed",
        stage: "inputIndex",
        path: "MUI / vendor-backed paths",
        direction: "contextual",
        calculatedIn: "buildScorecard",
        reason:
          "The requirement directly sets the support-demand index."
      },
      {
        artifact: "enterpriseReadiness",
        stage: "derivedFactor",
        path: "MUI / vendor-backed paths",
        direction: "contextual",
        calculatedIn: "buildDerivedFactors",
        reason:
          "Higher support demand increases the relevance of vendor-backed paths."
      },
      {
        artifact: "supportGap",
        stage: "planFit",
        path: "MUI / vendor-backed paths",
        direction: "bad",
        calculatedIn: "buildPlanFit",
        reason:
          "Weaker plans leave more support demand uncovered."
      },
      {
        artifact: "buildTierScore",
        stage: "pathScore",
        path: "Build",
        direction: "bad",
        calculatedIn: "buildScorecard",
        reason:
          "Higher support demand lowers Build attractiveness when procurement and response expectations rise."
      }
    ]
  },
  maintenanceHorizonMonths: {
    label: "Maintenance horizon months",
    group: "Cost and horizon",
    direction: "cost",
    impacts: [
      {
        artifact: "horizonYears",
        stage: "simulationPrep",
        path: "Both",
        direction: "neutral",
        calculatedIn: "runSimulation",
        reason:
          "The horizon is converted into years for maintenance and license modeling."
      },
      {
        artifact: "buildMaintenance",
        stage: "buildSimulation",
        path: "Build",
        direction: "cost",
        calculatedIn: "runSimulation",
        reason:
          "A longer horizon increases Build maintenance exposure."
      },
      {
        artifact: "muiMaintenance",
        stage: "muiSimulation",
        path: "MUI",
        direction: "cost",
        calculatedIn: "runSimulation",
        reason:
          "A longer horizon increases MUI maintenance exposure."
      },
      {
        artifact: "muiLicenseCost",
        stage: "muiSimulation",
        path: "MUI",
        direction: "cost",
        calculatedIn: "runSimulation",
        reason:
          "A longer horizon increases paid license cost for Premium and Enterprise tiers."
      },
      {
        artifact: "enterpriseReadiness",
        stage: "derivedFactor",
        path: "MUI / vendor-backed paths",
        direction: "contextual",
        calculatedIn: "buildDerivedFactors",
        reason:
          "Longer maintenance horizons increase the relevance of durable support and upgrade paths."
      }
    ]
  },
  engineerCostPerDay: {
    label: "Engineer cost per day",
    group: "Cost and horizon",
    direction: "cost",
    impacts: [
      {
        artifact: "laborCostPerWeek",
        stage: "simulationPrep",
        path: "Both",
        direction: "cost",
        calculatedIn: "runSimulation",
        reason:
          "The daily labor rate is converted into weekly labor cost."
      },
      {
        artifact: "buildTotalCost",
        stage: "buildSimulation",
        path: "Build",
        direction: "cost",
        calculatedIn: "runSimulation",
        reason:
          "Higher labor cost increases Build TCO."
      },
      {
        artifact: "muiTotalCost",
        stage: "muiSimulation",
        path: "MUI",
        direction: "cost",
        calculatedIn: "runSimulation",
        reason:
          "Higher labor cost increases MUI TCO."
      }
    ]
  },
  performanceSensitivity: {
    label: "Performance sensitivity",
    group: "Performance and risk",
    direction: "mixed",
    impacts: [
      {
        artifact: "qualityBurden",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildDerivedFactors",
        reason:
          "Stricter performance constraints increase verification burden."
      },
      {
        artifact: "functionalComplexity",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildDerivedFactors",
        reason:
          "Performance work can slightly increase the overall functional load."
      },
      {
        artifact: "downsideTailRisk",
        stage: "scenarioLever",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildScenarioLevers",
        reason:
          "Performance sensitivity increases tail-risk exposure."
      },
      {
        artifact: "muiAdoptionBurden",
        stage: "scenarioLever",
        path: "MUI",
        direction: "bad",
        calculatedIn: "buildScenarioLevers",
        reason:
          "Weak fit conditions can make performance-sensitive MUI adoption harder."
      }
    ]
  },
  knowledgeConcentration: {
    label: "Knowledge concentration",
    group: "Knowledge and continuity",
    direction: "mixed",
    impacts: [
      {
        artifact: "internalAbsorption",
        stage: "scenarioLever",
        path: "Build",
        direction: "good",
        calculatedIn: "buildScenarioLevers",
        reason:
          "Shared knowledge improves the team’s ability to absorb custom work."
      },
      {
        artifact: "ownershipBurden",
        stage: "derivedFactor",
        path: "Build",
        direction: "bad",
        calculatedIn: "buildDerivedFactors",
        reason:
          "Concentrated knowledge increases continuity and ownership burden."
      },
      {
        artifact: "downsideTailRisk",
        stage: "scenarioLever",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildScenarioLevers",
        reason:
          "Concentrated knowledge increases long-tail failure exposure."
      },
      {
        artifact: "buildMaintenance",
        stage: "buildSimulation",
        path: "Build",
        direction: "bad",
        calculatedIn: "runSimulation",
        reason:
          "Knowledge concentration increases Build maintenance risk."
      }
    ]
  },
  designDevHandoffFriction: {
    label: "Design-dev handoff friction",
    group: "Process and quality",
    direction: "mixed",
    impacts: [
      {
        artifact: "qualityBurden",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildDerivedFactors",
        reason:
          "Higher handoff friction increases verification and clarification burden."
      },
      {
        artifact: "buildReuseLeverage",
        stage: "scenarioLever",
        path: "Build",
        direction: "bad",
        calculatedIn: "buildScenarioLevers",
        reason:
          "Friction between design and implementation reduces internal reuse leverage."
      },
      {
        artifact: "muiAdoptionBurden",
        stage: "scenarioLever",
        path: "MUI",
        direction: "bad",
        calculatedIn: "buildScenarioLevers",
        reason:
          "Handoff friction increases adaptation work on the packaged path."
      },
      {
        artifact: "downsideTailRisk",
        stage: "scenarioLever",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildScenarioLevers",
        reason:
          "More friction widens the downside tail."
      }
    ]
  },
  componentStandardizationGoal: {
    label: "Component standardization goal",
    group: "Standards and reuse",
    direction: "contextual",
    impacts: [
      {
        artifact: "enterpriseReadiness",
        stage: "derivedFactor",
        path: "MUI / vendor-backed paths",
        direction: "contextual",
        calculatedIn: "buildDerivedFactors",
        reason:
          "A standardization goal increases the relevance of vendor-backed rollout and governance."
      },
      {
        artifact: "muiLeverage",
        stage: "scenarioLever",
        path: "MUI",
        direction: "good",
        calculatedIn: "buildScenarioLevers",
        reason:
          "A strong standardization goal can increase packaged leverage when MUI fit is already strong."
      },
      {
        artifact: "buildReuseLeverage",
        stage: "scenarioLever",
        path: "Build",
        direction: "good",
        calculatedIn: "buildScenarioLevers",
        reason:
          "A strong standardization goal can also support Build when internal maturity and ownership are strong."
      }
    ]
  },
  productionCriticality: {
    label: "Production criticality",
    group: "Quality and support",
    direction: "mixed",
    impacts: [
      {
        artifact: "qualityBurden",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildDerivedFactors",
        reason:
          "More critical production surfaces increase verification burden."
      },
      {
        artifact: "enterpriseReadiness",
        stage: "derivedFactor",
        path: "MUI / vendor-backed paths",
        direction: "contextual",
        calculatedIn: "buildDerivedFactors",
        reason:
          "Critical production surfaces increase the relevance of support and vendor-backed response."
      },
      {
        artifact: "supportGap",
        stage: "planFit",
        path: "MUI / vendor-backed paths",
        direction: "bad",
        calculatedIn: "buildPlanFit",
        reason:
          "Weaker packaged paths can leave more support demand uncovered when production stakes are high."
      },
      {
        artifact: "downsideTailRisk",
        stage: "scenarioLever",
        path: "Both",
        direction: "bad",
        calculatedIn: "buildScenarioLevers",
        reason:
          "Higher criticality widens the long-tail downside exposure."
      }
    ]
  }
};
