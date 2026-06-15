/*
 * Semantic impact map
 * -------------------
 *
 * This file explains relationships, not artifact meaning. Artifact meanings
 * live in MODEL_ARTIFACT_GLOSSARY. Keep entries concise and causal: what
 * affects what, which path it touches, what direction it pushes, and which
 * calibration key controls the effect when applicable.
 *
 * The active backend now uses deterministic fit scoring. Some simulation-era
 * entries remain here temporarily as historical metadata while the broader UI
 * and docs transition away from Monte Carlo terminology.
 */

export const MODEL_IMPACT_MAP = {
  frontendDevelopers: {
    label: "Frontend developers",
    group: "Organization and capacity",
    direction: "mixed",
    summary:
      "Frontend capacity can improve delivery speed and packaged-path adoption while also changing paid-seat exposure.",
    impacts: [
      {
        artifact: "buildVelocity",
        stage: "simulationPrep",
        path: "Build",
        direction: "good",
        effectType: "threshold",
        effectScale: "small",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.velocity.frontendDevelopers.build",
        formulaSummary: "Capacity bonus changes by team-size threshold.",
        thresholds: "Under 4, 4-7, and 8+ frontend developers.",
        reason: "More frontend capacity improves internal implementation velocity on the Build path."
      },
      {
        artifact: "muiVelocity",
        stage: "simulationPrep",
        path: "MUI",
        direction: "good",
        effectType: "threshold",
        effectScale: "small",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.velocity.frontendDevelopers.mui",
        formulaSummary: "Capacity bonus changes by team-size threshold.",
        thresholds: "Under 4, 4-7, and 8+ frontend developers.",
        reason: "More frontend capacity improves MUI implementation and configuration velocity."
      },
      {
        artifact: "enterpriseReadiness",
        stage: "derivedFactor",
        path: "Vendor-backed / standardized paths",
        direction: "contextual",
        effectType: "capped-linear",
        effectScale: "moderate",
        calculatedIn: "buildDerivedFactors",
        formulaSummary: "Math.min(frontendDevelopers, 10) * 2.5",
        reason: "Larger frontend orgs can increase standardization and supportability relevance."
      },
      {
        artifact: "estimatedLicensedDevelopers",
        stage: "muiEstimate",
        path: "Paid MUI",
        direction: "cost",
        effectType: "plan-conditional",
        calculatedIn: "estimateLicensedDevelopers",
        reason: "Paid MUI plans can scale seat exposure with frontend developer count."
      },
      {
        artifact: "muiLicenseCost",
        stage: "muiEstimate",
        path: "Paid MUI",
        direction: "cost",
        effectType: "cost-only",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.mui.licensing",
        reason: "Estimated licensed developers flow into license cost and TCO."
      },
      {
        artifact: "ownershipBurden",
        stage: "derivedFactor",
        path: "Build",
        direction: "neutral",
        effectType: "guardrail",
        calculatedIn: "buildDerivedFactors",
        reason: "Developer count should not increase ownership burden; capacity and coordination should be modeled separately."
      }
    ]
  },
  buildVelocity: {
    label: "Build velocity",
    group: "Delivery and velocity",
    direction: "good",
    summary:
      "Build velocity is calibrated from delivery strength, ownership risk, internal absorption, and frontend capacity thresholds.",
    impacts: [
      {
        artifact: "buildVelocity",
        stage: "simulationPrep",
        path: "Build",
        direction: "good",
        effectType: "linear",
        effectScale: "small",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.velocity.build",
        reason: "Base velocity, risk modifiers, and calibrated bounds determine the Build velocity multiplier."
      }
    ]
  },
  muiVelocity: {
    label: "MUI velocity",
    group: "Delivery and velocity",
    direction: "good",
    summary:
      "MUI velocity is calibrated from delivery strength, ownership risk, adoption burden, and frontend capacity thresholds.",
    impacts: [
      {
        artifact: "muiVelocity",
        stage: "simulationPrep",
        path: "MUI",
        direction: "good",
        effectType: "linear",
        effectScale: "small",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.velocity.mui",
        reason: "Base velocity, risk modifiers, leverage, burden, and calibrated bounds determine the MUI velocity multiplier."
      }
    ]
  },
  coverageShield: {
    label: "Coverage shield",
    group: "Simulation prep",
    direction: "good",
    summary:
      "Coverage strength can reduce effort when the selected MUI plan fits well enough.",
    impacts: [
      {
        artifact: "coverageShield",
        stage: "simulationPrep",
        path: "MUI",
        direction: "good",
        effectType: "threshold",
        effectScale: "small",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.prep.coverageShield",
        reason: "Coverage shield thresholds and values are named in calibration."
      }
    ]
  },
  buildAbsorptionShield: {
    label: "Build absorption shield",
    group: "Simulation prep",
    direction: "good",
    summary:
      "Internal absorption and reuse can reduce Build effort when the team can take on custom work cleanly.",
    impacts: [
      {
        artifact: "buildAbsorptionShield",
        stage: "simulationPrep",
        path: "Build",
        direction: "good",
        effectType: "interaction",
        effectScale: "small",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.prep.buildAbsorptionShield",
        reason: "Build absorption shielding is controlled by named calibration weights."
      }
    ]
  },
  buildTailPenalty: {
    label: "Build tail penalty",
    group: "Simulation prep",
    direction: "bad",
    summary:
      "Downside tail risk can widen Build variance, slip, and long-tail exposure.",
    impacts: [
      {
        artifact: "buildTailPenalty",
        stage: "simulationPrep",
        path: "Build",
        direction: "bad",
        effectType: "interaction",
        effectScale: "small",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.prep.buildTailPenalty",
        reason: "Build tail penalty thresholds and multipliers are named in calibration."
      }
    ]
  },
  muiLeverageShield: {
    label: "MUI leverage shield",
    group: "Simulation prep",
    direction: "good",
    summary:
      "MUI leverage can reduce MUI effort when fit and adoption signals are strong.",
    impacts: [
      {
        artifact: "muiLeverageShield",
        stage: "simulationPrep",
        path: "MUI",
        direction: "good",
        effectType: "interaction",
        effectScale: "small",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.prep.muiLeverageShield",
        reason: "MUI leverage shielding is controlled by named calibration weights."
      }
    ]
  },
  muiAdoptionLoad: {
    label: "MUI adoption load",
    group: "Simulation prep",
    direction: "bad",
    summary:
      "Adoption burden can increase MUI effort, slip, and variance when the team has to adapt a packaged path.",
    impacts: [
      {
        artifact: "muiAdoptionLoad",
        stage: "simulationPrep",
        path: "MUI",
        direction: "bad",
        effectType: "interaction",
        effectScale: "small",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.prep.muiAdoptionLoad",
        reason: "MUI adoption load is controlled by named calibration weights."
      }
    ]
  },
  buildEngineeringMean: {
    label: "Build engineering mean",
    group: "Build estimate",
    direction: "bad",
    summary:
      "The central Build effort estimate is driven by named risk weights in calibration.",
    impacts: [
      {
        artifact: "buildEngineeringMean",
        stage: "buildEstimate",
        path: "Build",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.build.engineeringMeanWeeks",
        reason: "Build engineering mean weights are controlled by calibration."
      }
    ]
  },
  buildEngineeringVariance: {
    label: "Build engineering variance",
    group: "Build estimate",
    direction: "bad",
    summary:
      "Build variance is driven by named calibration weights and shield reduction factors.",
    impacts: [
      {
        artifact: "buildEngineeringVariance",
        stage: "buildEstimate",
        path: "Build",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.build.engineeringVariance",
        reason: "Build engineering variance weights are controlled by calibration."
      }
    ]
  },
  buildReworkMean: {
    label: "Build rework mean",
    group: "Build estimate",
    direction: "bad",
    summary:
      "Build rework is driven by named calibration weights and downside tail additions.",
    impacts: [
      {
        artifact: "buildReworkMean",
        stage: "buildEstimate",
        path: "Build",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.build.reworkMeanWeeks",
        reason: "Build rework mean weights are controlled by calibration."
      }
    ]
  },
  buildSlipMean: {
    label: "Build slip mean",
    group: "Build estimate",
    direction: "bad",
    summary:
      "Build slip is driven by named calibration weights and tail penalty multipliers.",
    impacts: [
      {
        artifact: "buildSlipMean",
        stage: "buildEstimate",
        path: "Build",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.build.slipMeanWeeks",
        reason: "Build slip mean weights are controlled by calibration."
      }
    ]
  },
  buildLaunch: {
    label: "Build launch",
    group: "Build estimate",
    direction: "bad",
    summary:
      "Build launch combines engineering, slip, and rollout overhead from calibration.",
    impacts: [
      {
        artifact: "buildLaunch",
        stage: "buildEstimate",
        path: "Build",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.build.launch",
        reason: "Build launch overhead is controlled by calibration."
      }
    ]
  },
  buildMaintenance: {
    label: "Build maintenance",
    group: "Build estimate",
    direction: "bad",
    summary:
      "Build maintenance exposure is driven by named calibration weights over the chosen horizon.",
    impacts: [
      {
        artifact: "buildMaintenance",
        stage: "buildEstimate",
        path: "Build",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.build.maintenanceWeeks",
        reason: "Build maintenance weights are controlled by calibration."
      }
    ]
  },
  muiEngineeringMean: {
    label: "MUI engineering mean",
    group: "MUI estimate",
    direction: "bad",
    summary:
      "The central MUI effort estimate is driven by named fit, burden, and leverage weights.",
    impacts: [
      {
        artifact: "muiEngineeringMean",
        stage: "muiEstimate",
        path: "MUI",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.mui.engineeringMeanWeeks",
        reason: "MUI engineering mean weights are controlled by calibration."
      }
    ]
  },
  muiEngineeringVariance: {
    label: "MUI engineering variance",
    group: "MUI estimate",
    direction: "bad",
    summary:
      "MUI variance is driven by named calibration weights and leverage/shield effects.",
    impacts: [
      {
        artifact: "muiEngineeringVariance",
        stage: "muiEstimate",
        path: "MUI",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.mui.engineeringVariance",
        reason: "MUI engineering variance weights are controlled by calibration."
      }
    ]
  },
  muiReworkMean: {
    label: "MUI rework mean",
    group: "MUI estimate",
    direction: "bad",
    summary:
      "MUI rework is driven by named calibration weights and coverage/shield effects.",
    impacts: [
      {
        artifact: "muiReworkMean",
        stage: "muiEstimate",
        path: "MUI",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.mui.reworkMeanWeeks",
        reason: "MUI rework mean weights are controlled by calibration."
      }
    ]
  },
  muiSlipMean: {
    label: "MUI slip mean",
    group: "MUI estimate",
    direction: "bad",
    summary:
      "MUI slip is driven by named calibration weights and tail penalty multipliers.",
    impacts: [
      {
        artifact: "muiSlipMean",
        stage: "muiEstimate",
        path: "MUI",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.mui.slipMeanWeeks",
        reason: "MUI slip mean weights are controlled by calibration."
      }
    ]
  },
  muiLaunch: {
    label: "MUI launch",
    group: "MUI estimate",
    direction: "bad",
    summary:
      "MUI launch combines engineering, slip, and rollout overhead from calibration.",
    impacts: [
      {
        artifact: "muiLaunch",
        stage: "muiEstimate",
        path: "MUI",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.mui.launch",
        reason: "MUI launch overhead is controlled by calibration."
      }
    ]
  },
  muiMaintenance: {
    label: "MUI maintenance",
    group: "MUI estimate",
    direction: "bad",
    summary:
      "MUI maintenance exposure is driven by named calibration weights over the chosen horizon.",
    impacts: [
      {
        artifact: "muiMaintenance",
        stage: "muiEstimate",
        path: "MUI",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.mui.maintenanceWeeks",
        reason: "MUI maintenance weights are controlled by calibration."
      }
    ]
  },
  reactApps: {
    label: "React apps",
    group: "Footprint and rollout",
    direction: "mixed",
    summary:
      "A wider app footprint can increase ownership and rollout drag while making standardized paths more relevant.",
    impacts: [
      {
        artifact: "ownershipBurden",
        stage: "derivedFactor",
        path: "Build",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "buildDerivedFactors",
        reason: "More apps widen the surface area that Build must own and maintain."
      },
      {
        artifact: "enterpriseReadiness",
        stage: "derivedFactor",
        path: "Vendor-backed / standardized paths",
        direction: "contextual",
        effectType: "interaction",
        effectScale: "moderate",
        calculatedIn: "buildDerivedFactors",
        reason: "A broader footprint increases the relevance of rollout support and standardization."
      },
      {
        artifact: "buildLaunch",
        stage: "buildEstimate",
        path: "Build",
        direction: "bad",
        effectType: "conditional",
        effectScale: "small",
        calculatedIn: "runSimulation",
        reason: "More apps increase rollout overhead and can slow the Build path."
      },
      {
        artifact: "muiLaunch",
        stage: "muiEstimate",
        path: "MUI",
        direction: "bad",
        effectType: "conditional",
        effectScale: "small",
        calculatedIn: "runSimulation",
        reason: "More apps increase rollout overhead even when using a packaged path."
      },
      {
        artifact: "estimatedLicensedDevelopers",
        stage: "muiEstimate",
        path: "Paid MUI",
        direction: "cost",
        effectType: "plan-conditional",
        calculatedIn: "estimateLicensedDevelopers",
        reason: "A large app footprint can increase Enterprise seat exposure."
      }
    ]
  },
  dependentTeams: {
    label: "Dependent teams",
    group: "Organization and dependencies",
    direction: "mixed",
    summary:
      "More dependent teams increase coordination drag, support relevance, long-tail risk, and Enterprise cost exposure.",
    impacts: [
      {
        artifact: "ownershipBurden",
        stage: "derivedFactor",
        path: "Build",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "buildDerivedFactors",
        reason: "More dependent teams increase coordination load and long-term ownership drag."
      },
      {
        artifact: "internalAbsorption",
        stage: "scenarioLever",
        path: "Build",
        direction: "bad",
        effectType: "inverse",
        effectScale: "moderate",
        calculatedIn: "buildScenarioLevers",
        reason: "More dependent teams reduce the team’s ability to absorb custom work cleanly."
      },
      {
        artifact: "downsideTailRisk",
        stage: "scenarioLever",
        path: "Both",
        direction: "bad",
        effectType: "interaction",
        effectScale: "moderate",
        calculatedIn: "buildScenarioLevers",
        reason: "More dependent teams widen the long-tail coordination and QA downside."
      },
      {
        artifact: "enterpriseReadiness",
        stage: "derivedFactor",
        path: "Vendor-backed / standardized paths",
        direction: "contextual",
        effectType: "interaction",
        effectScale: "moderate",
        calculatedIn: "buildDerivedFactors",
        reason: "A larger dependency graph increases the relevance of rollout coordination and vendor-backed support."
      },
      {
        artifact: "estimatedLicensedDevelopers",
        stage: "muiEstimate",
        path: "Enterprise",
        direction: "cost",
        effectType: "plan-conditional",
        effectScale: "small",
        calculatedIn: "estimateLicensedDevelopers",
        reason: "A wider dependency graph can increase Enterprise seat exposure."
      }
    ]
  },
  ownershipModel: {
    label: "Ownership model",
    group: "Organization and ownership",
    direction: "mixed",
    summary:
      "Ownership clarity improves absorption and reuse, while unclear ownership increases coordination and packaged-path friction.",
    impacts: [
      {
        artifact: "internalAbsorption",
        stage: "scenarioLever",
        path: "Build",
        direction: "good",
        effectType: "enum-step",
        effectScale: "moderate",
        calculatedIn: "buildScenarioLevers",
        reason: "Clearer ownership makes it easier for the team to absorb custom work."
      },
      {
        artifact: "buildReuseLeverage",
        stage: "scenarioLever",
        path: "Build",
        direction: "good",
        effectType: "enum-step",
        effectScale: "moderate",
        calculatedIn: "buildScenarioLevers",
        reason: "Clear ownership helps internal patterns and previous work be reused cleanly."
      },
      {
        artifact: "ownershipBurden",
        stage: "derivedFactor",
        path: "Build",
        direction: "bad",
        effectType: "enum-step",
        effectScale: "moderate",
        calculatedIn: "buildDerivedFactors",
        reason: "Unclear ownership increases coordination and maintenance burden."
      },
      {
        artifact: "muiAdoptionBurden",
        stage: "scenarioLever",
        path: "MUI",
        direction: "bad",
        effectType: "conditional",
        effectScale: "moderate",
        calculatedIn: "buildScenarioLevers",
        reason: "Unclear ownership makes packaged-path adaptation harder to absorb."
      },
      {
        artifact: "buildFriendlyContext",
        stage: "pathScore",
        path: "Build",
        direction: "contextual",
        effectType: "interaction",
        effectScale: "small",
        calculatedIn: "buildScorecard",
        reason: "Ownership clarity can make Build more credible when the rest of the context is favorable."
      }
    ]
  },
  existingMuiUsage: {
    label: "Existing MUI usage",
    group: "Adoption and standards",
    direction: "mixed",
    summary:
      "Existing MUI reduces adoption and integration friction while changing the remaining leverage available to Build.",
    impacts: [
      {
        artifact: "adoptionBoost",
        stage: "planFit",
        path: "MUI",
        direction: "good",
        effectType: "enum-step",
        effectScale: "small",
        calculatedIn: "buildPlanFit",
        reason: "Existing usage increases the chance that the packaged path fits the current codebase."
      },
      {
        artifact: "coverageScore",
        stage: "planFit",
        path: "MUI",
        direction: "good",
        effectType: "enum-step",
        effectScale: "small",
        calculatedIn: "buildPlanFit",
        reason: "Existing usage improves overall fit by lowering adoption friction."
      },
      {
        artifact: "integrationRisk",
        stage: "planFit",
        path: "MUI",
        direction: "good",
        effectType: "inverse",
        effectScale: "moderate",
        calculatedIn: "buildPlanFit",
        reason: "A larger existing MUI footprint reduces remaining integration risk."
      },
      {
        artifact: "muiLeverage",
        stage: "scenarioLever",
        path: "MUI",
        direction: "good",
        effectType: "conditional",
        effectScale: "moderate",
        calculatedIn: "buildScenarioLevers",
        reason: "Existing MUI usage lets the selected MUI path absorb more work."
      },
      {
        artifact: "muiAdoptionBurden",
        stage: "scenarioLever",
        path: "MUI",
        direction: "good",
        effectType: "inverse",
        effectScale: "moderate",
        calculatedIn: "buildScenarioLevers",
        reason: "More prior usage lowers the remaining adoption burden on the packaged path."
      },
      {
        artifact: "buildReuseLeverage",
        stage: "scenarioLever",
        path: "Build",
        direction: "bad",
        effectType: "conditional",
        effectScale: "small",
        calculatedIn: "buildScenarioLevers",
        reason: "Standardized MUI can reduce the amount of internal reuse leverage left for Build."
      }
    ]
  },
  designSystemMaturity: {
    label: "Design system maturity",
    group: "Adoption and standards",
    direction: "mixed",
    summary:
      "Strong internal standards help Build absorb work, while a low-MUI baseline can make packaged adoption harder.",
    impacts: [
      {
        artifact: "internalAbsorption",
        stage: "scenarioLever",
        path: "Build",
        direction: "good",
        effectType: "enum-step",
        effectScale: "moderate",
        calculatedIn: "buildScenarioLevers",
        reason: "Higher maturity makes the team better able to absorb custom implementation work."
      },
      {
        artifact: "buildReuseLeverage",
        stage: "scenarioLever",
        path: "Build",
        direction: "good",
        effectType: "enum-step",
        effectScale: "moderate",
        calculatedIn: "buildScenarioLevers",
        reason: "Mature internal patterns increase the amount of useful reuse on the Build path."
      },
      {
        artifact: "ownershipBurden",
        stage: "derivedFactor",
        path: "Build",
        direction: "bad",
        effectType: "enum-step",
        effectScale: "small",
        calculatedIn: "buildDerivedFactors",
        reason: "Higher maturity lowers the burden of maintaining shared internal UI."
      },
      {
        artifact: "muiAdoptionBurden",
        stage: "scenarioLever",
        path: "MUI",
        direction: "bad",
        effectType: "conditional",
        effectScale: "moderate",
        calculatedIn: "buildScenarioLevers",
        conditions: "Especially when existingMuiUsage is none.",
        reason: "When there is no MUI baseline, strong internal patterns can make MUI adaptation more work."
      },
      {
        artifact: "buildFriendlyContext",
        stage: "pathScore",
        path: "Build",
        direction: "contextual",
        effectType: "interaction",
        effectScale: "small",
        calculatedIn: "buildScorecard",
        reason: "Maturity can strengthen Build credibility when other signals are already favorable."
      }
    ]
  },
  primaryUseCase: {
    label: "Primary use case",
    group: "Functional scope",
    direction: "mixed",
    summary:
      "The selected use case anchors complexity, coverage, and which packaged path is a plausible fit.",
    impacts: [
      {
        artifact: "useCaseComplexity",
        stage: "inputIndex",
        path: "Both",
        direction: "neutral",
        effectType: "enum-step",
        effectScale: "small",
        calculatedIn: "buildDerivedFactors",
        reason: "The selected use case sets the baseline complexity index."
      },
      {
        artifact: "functionalComplexity",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        effectType: "interaction",
        effectScale: "moderate",
        calculatedIn: "buildDerivedFactors",
        reason: "Different component families carry different levels of implementation complexity."
      },
      {
        artifact: "useCaseCoverage",
        stage: "planFit",
        path: "MUI",
        direction: "contextual",
        effectType: "enum-step",
        effectScale: "moderate",
        calculatedIn: "buildPlanFit",
        reason: "The selected use case determines how well each MUI plan covers the workload."
      },
      {
        artifact: "coverageScore",
        stage: "planFit",
        path: "MUI",
        direction: "contextual",
        effectType: "interaction",
        effectScale: "moderate",
        calculatedIn: "buildPlanFit",
        reason: "Use case fit is a major part of the total plan-fit score."
      },
      {
        artifact: "effectiveMuiPlan",
        stage: "pathScore",
        path: "MUI",
        direction: "contextual",
        effectType: "guardrail",
        effectScale: "small",
        calculatedIn: "buildScorecard",
        reason: "The use case helps select the best-fit MUI tier."
      }
    ]
  },
  dataHeavyScreens: {
    label: "Data-heavy screens",
    group: "Functional scope",
    direction: "bad",
    summary:
      "More dense screens increase interaction complexity, functional risk, and downstream effort.",
    impacts: [
      {
        artifact: "screenLoad",
        stage: "inputIndex",
        path: "Both",
        direction: "neutral",
        effectType: "enum-step",
        effectScale: "small",
        calculatedIn: "buildDerivedFactors",
        reason: "More data-heavy screens increase the screen-load index."
      },
      {
        artifact: "functionalComplexity",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "buildDerivedFactors",
        reason: "More dense screens increase interaction and state complexity."
      },
      {
        artifact: "functionalRisk",
        stage: "scorecardRisk",
        path: "Both",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "buildScorecard",
        reason: "Higher functional complexity raises the normalized functional-risk score."
      },
      {
        artifact: "simpleScope",
        stage: "pathScore",
        path: "Both",
        direction: "bad",
        effectType: "guardrail",
        effectScale: "small",
        calculatedIn: "buildScorecard",
        calibrationRef: "pathScores.simpleScope",
        reason:
          "Higher screen density can push the scorecard outside the contained-scope guardrail and make paid tiers easier to justify."
      }
    ]
  },
  expectedRows: {
    label: "Expected rows",
    group: "Scale and verification",
    direction: "bad",
    summary:
      "Row scale drives functional load, quality burden, coverage gaps, and tail risk.",
    impacts: [
      {
        artifact: "rowScale",
        stage: "inputIndex",
        path: "Both",
        direction: "neutral",
        effectType: "enum-step",
        effectScale: "small",
        calculatedIn: "buildDerivedFactors",
        reason: "More rows increase the normalized row-scale index."
      },
      {
        artifact: "functionalComplexity",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "buildDerivedFactors",
        reason: "More rows increase scope and state complexity."
      },
      {
        artifact: "qualityBurden",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "buildDerivedFactors",
        reason: "Larger row counts increase performance and regression burden."
      },
      {
        artifact: "scaleCoverage",
        stage: "planFit",
        path: "MUI",
        direction: "bad",
        effectType: "conditional",
        effectScale: "moderate",
        calculatedIn: "buildPlanFit",
        reason: "Large row counts can exceed the selected MUI plan’s scale capacity."
      },
      {
        artifact: "coverageGap",
        stage: "planFit",
        path: "MUI",
        direction: "bad",
        effectType: "inverse",
        effectScale: "moderate",
        calculatedIn: "buildPlanFit",
        reason: "Lower scale coverage increases the remaining fit gap."
      },
      {
        artifact: "integrationRisk",
        stage: "planFit",
        path: "MUI",
        direction: "bad",
        effectType: "conditional",
        effectScale: "small",
        calculatedIn: "buildPlanFit",
        reason: "Larger row bands raise integration and tuning risk."
      },
      {
        artifact: "downsideTailRisk",
        stage: "scenarioLever",
        path: "Both",
        direction: "bad",
        effectType: "interaction",
        effectScale: "moderate",
        calculatedIn: "buildScenarioLevers",
        reason: "High scale widens the long-tail downside distribution."
      },
      {
        artifact: "simpleScope",
        stage: "pathScore",
        path: "Both",
        direction: "bad",
        effectType: "guardrail",
        effectScale: "small",
        calculatedIn: "buildScorecard",
        calibrationRef: "pathScores.simpleScope",
        reason:
          "Larger row bands can disable the contained-scope guardrail, which removes Core's simple-scope boost and makes paid tiers easier to justify."
      }
    ]
  },
  expectedColumns: {
    label: "Expected columns",
    group: "Scale and verification",
    direction: "bad",
    summary:
      "Column scale drives functional load, quality burden, coverage gaps, and tail risk.",
    impacts: [
      {
        artifact: "columnScale",
        stage: "inputIndex",
        path: "Both",
        direction: "neutral",
        effectType: "enum-step",
        effectScale: "small",
        calculatedIn: "buildDerivedFactors",
        reason: "More columns increase the normalized column-scale index."
      },
      {
        artifact: "functionalComplexity",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "buildDerivedFactors",
        reason: "More columns increase scope and state complexity."
      },
      {
        artifact: "qualityBurden",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "buildDerivedFactors",
        reason: "Wider column counts increase performance and regression burden."
      },
      {
        artifact: "scaleCoverage",
        stage: "planFit",
        path: "MUI",
        direction: "bad",
        effectType: "conditional",
        effectScale: "moderate",
        calculatedIn: "buildPlanFit",
        reason: "Large column counts can exceed the selected MUI plan’s scale capacity."
      },
      {
        artifact: "coverageGap",
        stage: "planFit",
        path: "MUI",
        direction: "bad",
        effectType: "inverse",
        effectScale: "moderate",
        calculatedIn: "buildPlanFit",
        reason: "Lower scale coverage increases the remaining fit gap."
      },
      {
        artifact: "integrationRisk",
        stage: "planFit",
        path: "MUI",
        direction: "bad",
        effectType: "conditional",
        effectScale: "small",
        calculatedIn: "buildPlanFit",
        reason: "Wider column bands raise integration and tuning risk."
      },
      {
        artifact: "downsideTailRisk",
        stage: "scenarioLever",
        path: "Both",
        direction: "bad",
        effectType: "interaction",
        effectScale: "moderate",
        calculatedIn: "buildScenarioLevers",
        reason: "High scale widens the long-tail downside distribution."
      },
      {
        artifact: "simpleScope",
        stage: "pathScore",
        path: "Both",
        direction: "bad",
        effectType: "guardrail",
        effectScale: "small",
        calculatedIn: "buildScorecard",
        calibrationRef: "pathScores.simpleScope",
        reason:
          "Wider column bands can disable the contained-scope guardrail, which removes Core's simple-scope boost and makes paid tiers easier to justify."
      }
    ]
  },
  advancedFeatures: {
    label: "Advanced features",
    group: "Functional scope",
    direction: "mixed",
    summary:
      "Advanced behaviors raise functional demand and can also increase QA burden, integration friction, and adoption cost.",
    impacts: [
      {
        artifact: "featureWeight",
        stage: "inputIndex",
        path: "Both",
        direction: "neutral",
        effectType: "enum-step",
        effectScale: "small",
        calculatedIn: "buildDerivedFactors",
        reason: "Selected advanced features are aggregated into a feature-demand weight."
      },
      {
        artifact: "featureDemand",
        stage: "inputIndex",
        path: "Both",
        direction: "neutral",
        effectType: "enum-step",
        effectScale: "small",
        calculatedIn: "buildPlanFit",
        reason: "Advanced features are aggregated into plan-fit feature demand."
      },
      {
        artifact: "functionalComplexity",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        effectType: "interaction",
        effectScale: "large",
        calculatedIn: "buildDerivedFactors",
        reason: "Advanced behaviors raise implementation scope and interaction complexity."
      },
      {
        artifact: "qualityBurden",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        effectType: "interaction",
        effectScale: "large",
        calculatedIn: "buildDerivedFactors",
        reason: "Advanced behaviors add keyboard, virtualization, rendering, and localization QA burden."
      },
      {
        artifact: "featureCoverage",
        stage: "planFit",
        path: "MUI",
        direction: "contextual",
        effectType: "conditional",
        effectScale: "moderate",
        calculatedIn: "buildPlanFit",
        reason: "Advanced features can be covered well by some plans and poorly by others."
      },
      {
        artifact: "simpleScope",
        stage: "pathScore",
        path: "Both",
        direction: "bad",
        effectType: "guardrail",
        effectScale: "small",
        calculatedIn: "buildScorecard",
        calibrationRef: "pathScores.simpleScope",
        reason:
          "More advanced features can disable the contained-scope guardrail, which removes Core's simple-scope boost and makes paid tiers easier to justify."
      }
    ]
  },
  accessibilityTarget: {
    label: "Accessibility target",
    group: "Quality and compliance",
    direction: "bad",
    summary:
      "Stricter accessibility requirements increase verification burden and can widen risk if coverage is weak.",
    impacts: [
      {
        artifact: "accessibilityIndex",
        stage: "inputIndex",
        path: "Both",
        direction: "neutral",
        effectType: "enum-step",
        effectScale: "small",
        calculatedIn: "buildDerivedFactors",
        reason: "The selected accessibility target becomes a numeric index."
      },
      {
        artifact: "qualityBurden",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        effectType: "linear",
        effectScale: "large",
        calculatedIn: "buildDerivedFactors",
        reason: "Higher accessibility standards increase verification burden."
      },
      {
        artifact: "qualityRisk",
        stage: "scorecardRisk",
        path: "Both",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "buildScorecard",
        reason: "More accessibility burden raises the normalized quality-risk score."
      },
      {
        artifact: "simpleScope",
        stage: "pathScore",
        path: "Both",
        direction: "bad",
        effectType: "guardrail",
        effectScale: "small",
        calculatedIn: "buildScorecard",
        calibrationRef: "pathScores.simpleScope",
        reason:
          "Stricter accessibility targets can raise quality risk enough to disable the contained-scope guardrail."
      }
    ]
  },
  changeLeadTime: {
    label: "Change lead time",
    group: "Delivery maturity",
    direction: "good",
    summary:
      "Faster change lead time improves delivery maturity and Build absorption.",
    impacts: [
      {
        artifact: "changeLeadTimeIndex",
        stage: "inputIndex",
        path: "Both",
        direction: "neutral",
        effectType: "enum-step",
        effectScale: "small",
        calculatedIn: "buildDerivedFactors",
        reason: "Change lead time is normalized into an index."
      },
      {
        artifact: "deliveryMaturity",
        stage: "derivedFactor",
        path: "Both",
        direction: "good",
        effectType: "enum-step",
        effectScale: "moderate",
        calculatedIn: "buildDerivedFactors",
        reason: "Faster lead time improves delivery maturity and absorption."
      },
      {
        artifact: "internalAbsorption",
        stage: "scenarioLever",
        path: "Build",
        direction: "good",
        effectType: "interaction",
        effectScale: "small",
        calculatedIn: "buildScenarioLevers",
        reason: "Fast-moving teams can absorb Build work more easily."
      },
      {
        artifact: "buildVelocity",
        stage: "simulationPrep",
        path: "Build",
        direction: "good",
        effectType: "linear",
        effectScale: "small",
        calculatedIn: "runSimulation",
        reason: "Faster teams tend to sustain higher Build velocity."
      }
    ]
  },
  reworkFrequency: {
    label: "Rework frequency",
    group: "Delivery maturity",
    direction: "good",
    summary:
      "Lower rework frequency improves delivery maturity and reduces slip pressure.",
    impacts: [
      {
        artifact: "reworkFrequencyIndex",
        stage: "inputIndex",
        path: "Both",
        direction: "neutral",
        effectType: "enum-step",
        effectScale: "small",
        calculatedIn: "buildDerivedFactors",
        reason: "Rework frequency is normalized into an index."
      },
      {
        artifact: "deliveryMaturity",
        stage: "derivedFactor",
        path: "Both",
        direction: "good",
        effectType: "enum-step",
        effectScale: "moderate",
        calculatedIn: "buildDerivedFactors",
        reason: "Less churn improves delivery maturity."
      },
      {
        artifact: "downsideTailRisk",
        stage: "scenarioLever",
        path: "Both",
        direction: "bad",
        effectType: "interaction",
        effectScale: "small",
        calculatedIn: "buildScenarioLevers",
        reason: "Frequent rework raises the chance of a worse-than-expected outcome."
      },
      {
        artifact: "buildSlip",
        stage: "buildEstimate",
        path: "Build",
        direction: "bad",
        effectType: "conditional",
        effectScale: "small",
        calculatedIn: "runSimulation",
        reason: "More rework tends to add slip to the Build schedule."
      }
    ]
  },
  deadlinePressure: {
    label: "Deadline pressure",
    group: "Delivery maturity",
    direction: "bad",
    summary:
      "Higher pressure lowers delivery maturity, increases slip, and widens tail risk.",
    impacts: [
      {
        artifact: "deliveryMaturity",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        effectType: "enum-step",
        effectScale: "moderate",
        calculatedIn: "buildDerivedFactors",
        reason: "Higher deadline pressure lowers delivery maturity."
      },
      {
        artifact: "deliveryRisk",
        stage: "scorecardRisk",
        path: "Both",
        direction: "bad",
        effectType: "inverse",
        effectScale: "moderate",
        calculatedIn: "buildScorecard",
        reason: "More deadline pressure increases the normalized delivery-risk score."
      },
      {
        artifact: "buildSlipMean",
        stage: "buildEstimate",
        path: "Build",
        direction: "bad",
        effectType: "conditional",
        effectScale: "small",
        calculatedIn: "runSimulation",
        reason: "Deadline pressure raises expected Build slip."
      },
      {
        artifact: "muiSlipMean",
        stage: "muiEstimate",
        path: "MUI",
        direction: "bad",
        effectType: "conditional",
        effectScale: "small",
        calculatedIn: "runSimulation",
        reason: "Deadline pressure also raises expected MUI slip."
      },
      {
        artifact: "downsideTailRisk",
        stage: "scenarioLever",
        path: "Both",
        direction: "bad",
        effectType: "interaction",
        effectScale: "moderate",
        calculatedIn: "buildScenarioLevers",
        reason: "Compressed deadlines widen the long-tail downside distribution."
      }
    ]
  },
  supportRequirement: {
    label: "Support requirement",
    group: "Enterprise relevance",
    direction: "contextual",
    summary:
      "Higher support need increases enterprise relevance and can create support gaps, but it should not force Enterprise alone.",
    impacts: [
      {
        artifact: "supportNeed",
        stage: "inputIndex",
        path: "MUI / vendor-backed paths",
        direction: "neutral",
        effectType: "enum-step",
        effectScale: "small",
        calculatedIn: "buildScorecard",
        reason: "Support requirement becomes a normalized support-needs index."
      },
      {
        artifact: "enterpriseReadiness",
        stage: "derivedFactor",
        path: "Vendor-backed / standardized paths",
        direction: "contextual",
        effectType: "interaction",
        effectScale: "moderate",
        calculatedIn: "buildDerivedFactors",
        reason: "Higher support need increases the relevance of vendor-backed support."
      },
      {
        artifact: "supportGap",
        stage: "planFit",
        path: "MUI",
        direction: "bad",
        effectType: "plan-conditional",
        effectScale: "moderate",
        calculatedIn: "buildPlanFit",
        reason: "Weaker packaged paths can leave part of the support need uncovered."
      },
      {
        artifact: "buildTierScore",
        stage: "pathScore",
        path: "Build",
        direction: "bad",
        effectType: "interaction",
        effectScale: "small",
        calculatedIn: "buildScorecard",
        reason: "High support and procurement needs can reduce Build attractiveness when support matters."
      },
      {
        artifact: "enterpriseTierScore",
        stage: "pathScore",
        path: "MUI Enterprise",
        direction: "good",
        effectType: "interaction",
        effectScale: "small",
        calculatedIn: "buildScorecard",
        reason: "Support demand can strengthen Enterprise relevance when the rest of the fit is aligned."
      }
    ]
  },
  simpleScope: {
    label: "Contained-scope guardrail",
    group: "Scope and policy",
    direction: "contextual",
    summary:
      "A contained-scope guardrail can change which packaged paths remain attractive.",
    impacts: [
      {
        artifact: "simpleScope",
        stage: "pathScore",
        path: "Both",
        direction: "contextual",
        effectType: "guardrail",
        effectScale: "small",
        calculatedIn: "buildScorecard",
        calibrationRef: "pathScores.simpleScope",
        reason:
          "The contained-scope guardrail is controlled by calibrated functional-risk, quality-risk, feature-count, data-density, and row/column-scale caps."
      }
    ]
  },
  buildFriendlyContext: {
    label: "Build-friendly context",
    group: "Scope and policy",
    direction: "contextual",
    summary:
      "A strong internal context can keep Build credible when the scope is narrow and support need is low.",
    impacts: [
      {
        artifact: "buildFriendlyContext",
        stage: "pathScore",
        path: "Build",
        direction: "contextual",
        effectType: "interaction",
        effectScale: "small",
        calculatedIn: "buildScorecard",
        calibrationRef: "pathScores.buildFriendlyContext",
        reason: "The build-friendly guardrail uses calibrated row, column, feature, and accessibility caps."
      }
    ]
  },
  enterpriseFitStrong: {
    label: "Enterprise fit strong",
    group: "Scope and policy",
    direction: "contextual",
    summary:
      "A strong Enterprise fit can make the enterprise tier eligible when support and coverage are aligned.",
    impacts: [
      {
        artifact: "enterpriseFitStrong",
        stage: "pathScore",
        path: "MUI Enterprise",
        direction: "contextual",
        effectType: "guardrail",
        effectScale: "small",
        calculatedIn: "buildScorecard",
        calibrationRef: "pathScores.enterpriseEligibility",
        reason: "Enterprise fit is gated by calibrated enterprise-need, support, tier-score, and coverage thresholds."
      }
    ]
  },
  effectiveMuiPlan: {
    label: "Effective MUI plan",
    group: "Scope and policy",
    direction: "contextual",
    summary:
      "The selected MUI tier is controlled by plan fit and calibrated eligibility thresholds.",
    impacts: [
      {
        artifact: "effectiveMuiPlan",
        stage: "pathScore",
        path: "MUI Enterprise",
        direction: "contextual",
        effectType: "guardrail",
        effectScale: "small",
        calculatedIn: "buildScorecard",
        calibrationRef: "pathScores.enterpriseEligibility",
        reason: "Enterprise eligibility governs when the enterprise tier is selected."
      },
      {
        artifact: "effectiveMuiPlan",
        stage: "pathScore",
        path: "MUI Premium",
        direction: "contextual",
        effectType: "guardrail",
        effectScale: "small",
        calculatedIn: "buildScorecard",
        calibrationRef: "pathScores.premiumEligibility",
        reason: "Premium eligibility governs when the premium tier is selected."
      }
    ]
  },
  maintenanceHorizonMonths: {
    label: "Maintenance horizon months",
    group: "Lifecycle cost",
    direction: "cost",
    summary:
      "A longer horizon increases post-launch maintenance exposure and makes license cost more meaningful.",
    impacts: [
      {
        artifact: "horizonYears",
        stage: "simulationPrep",
        path: "Both",
        direction: "neutral",
        effectType: "enum-step",
        effectScale: "small",
        calculatedIn: "runSimulation",
        reason: "The maintenance horizon is converted into years for simulation math."
      },
      {
        artifact: "buildMaintenance",
        stage: "buildEstimate",
        path: "Build",
        direction: "cost",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.build.maintenanceWeeks",
        reason: "Longer horizons increase Build maintenance exposure."
      },
      {
        artifact: "muiMaintenance",
        stage: "muiEstimate",
        path: "MUI",
        direction: "cost",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "runSimulation",
        calibrationRef: "simulation.mui.maintenanceWeeks",
        reason: "Longer horizons increase MUI maintenance exposure."
      },
      {
        artifact: "muiTotalCost",
        stage: "muiEstimate",
        path: "Paid MUI",
        direction: "cost",
        effectType: "cost-only",
        effectScale: "moderate",
        calculatedIn: "runSimulation",
        reason: "Longer horizons flow into the total MUI TCO."
      }
    ]
  },
  engineerCostPerDay: {
    label: "Engineer cost per day",
    group: "Lifecycle cost",
    direction: "cost",
    summary:
      "Day rate converts effort into labor TCO and must not be treated as an effort signal.",
    impacts: [
      {
        artifact: "laborCostPerWeek",
        stage: "simulationPrep",
        path: "Both",
        direction: "cost",
        effectType: "cost-only",
        calculatedIn: "runSimulation",
        reason: "The day rate is converted into a weekly labor rate for TCO math."
      },
      {
        artifact: "buildTotalCost",
        stage: "buildEstimate",
        path: "Build",
        direction: "cost",
        effectType: "cost-only",
        calculatedIn: "runSimulation",
        reason: "Labor cost flows directly into Build TCO."
      },
      {
        artifact: "muiTotalCost",
        stage: "muiEstimate",
        path: "Paid MUI",
        direction: "cost",
        effectType: "cost-only",
        calculatedIn: "runSimulation",
        reason: "Labor cost flows directly into MUI TCO."
      }
    ]
  },
  performanceSensitivity: {
    label: "Performance sensitivity",
    group: "Quality and runtime pressure",
    direction: "mixed",
    summary:
      "Performance constraints increase quality burden and can widen risk if a path is not performance-ready.",
    impacts: [
      {
        artifact: "qualityBurden",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "buildDerivedFactors",
        reason: "Stricter performance sensitivity raises quality burden."
      },
      {
        artifact: "qualityRisk",
        stage: "scorecardRisk",
        path: "Both",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "buildScorecard",
        reason: "Performance pressure increases normalized quality risk."
      },
      {
        artifact: "integrationRisk",
        stage: "planFit",
        path: "MUI",
        direction: "bad",
        effectType: "conditional",
        effectScale: "small",
        calculatedIn: "buildPlanFit",
        reason: "Strict performance expectations can increase plan-fit risk."
      }
    ]
  },
  knowledgeConcentration: {
    label: "Knowledge concentration",
    group: "Organization and risk",
    direction: "mixed",
    summary:
      "Concentrated knowledge raises continuity risk, while shared knowledge improves absorption and resilience.",
    impacts: [
      {
        artifact: "ownershipBurden",
        stage: "derivedFactor",
        path: "Build",
        direction: "bad",
        effectType: "conditional",
        effectScale: "moderate",
        calculatedIn: "buildDerivedFactors",
        reason: "Concentrated knowledge increases ownership burden and key-person risk."
      },
      {
        artifact: "internalAbsorption",
        stage: "scenarioLever",
        path: "Build",
        direction: "bad",
        effectType: "inverse",
        effectScale: "small",
        calculatedIn: "buildScenarioLevers",
        reason: "Concentrated knowledge lowers the team’s ability to absorb Build work."
      },
      {
        artifact: "downsideTailRisk",
        stage: "scenarioLever",
        path: "Both",
        direction: "bad",
        effectType: "interaction",
        effectScale: "moderate",
        calculatedIn: "buildScenarioLevers",
        reason: "Knowledge concentration widens downside tail risk."
      }
    ]
  },
  designDevHandoffFriction: {
    label: "Design-dev handoff friction",
    group: "Workflow quality",
    direction: "mixed",
    summary:
      "Handoff friction adds rework and adaptation cost across Build and packaged paths.",
    impacts: [
      {
        artifact: "qualityBurden",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "buildDerivedFactors",
        reason: "Higher handoff friction raises quality burden."
      },
      {
        artifact: "buildReuseLeverage",
        stage: "scenarioLever",
        path: "Build",
        direction: "bad",
        effectType: "interaction",
        effectScale: "small",
        calculatedIn: "buildScenarioLevers",
        reason: "Friction reduces the amount of reusable internal work that Build can capture."
      },
      {
        artifact: "muiAdoptionBurden",
        stage: "scenarioLever",
        path: "MUI",
        direction: "bad",
        effectType: "interaction",
        effectScale: "small",
        calculatedIn: "buildScenarioLevers",
        reason: "Handoff friction increases the effort needed to adapt a packaged path."
      },
      {
        artifact: "integrationRisk",
        stage: "planFit",
        path: "MUI",
        direction: "bad",
        effectType: "conditional",
        effectScale: "small",
        calculatedIn: "buildPlanFit",
        reason: "Fractured handoffs can create more integration risk."
      }
    ]
  },
  componentStandardizationGoal: {
    label: "Component standardization goal",
    group: "Standards and governance",
    direction: "contextual",
    summary:
      "Standardization goals increase the relevance of reusable and vendor-backed paths without making one path universally best.",
    impacts: [
      {
        artifact: "enterpriseReadiness",
        stage: "derivedFactor",
        path: "Vendor-backed / standardized paths",
        direction: "contextual",
        effectType: "interaction",
        effectScale: "moderate",
        calculatedIn: "buildDerivedFactors",
        reason: "A stronger standardization goal increases the relevance of standardized delivery."
      },
      {
        artifact: "buildReuseLeverage",
        stage: "scenarioLever",
        path: "Build",
        direction: "good",
        effectType: "linear",
        effectScale: "small",
        calculatedIn: "buildScenarioLevers",
        reason: "Standardization goals can make internal reuse more valuable."
      },
      {
        artifact: "muiLeverage",
        stage: "scenarioLever",
        path: "MUI",
        direction: "good",
        effectType: "linear",
        effectScale: "small",
        calculatedIn: "buildScenarioLevers",
        reason: "Standardization goals can also make packaged adoption more compelling."
      }
    ]
  },
  productionCriticality: {
    label: "Production criticality",
    group: "Operational risk",
    direction: "contextual",
    summary:
      "More critical production contexts raise quality burden and support relevance without making vendor-backed paths mandatory.",
    impacts: [
      {
        artifact: "qualityBurden",
        stage: "derivedFactor",
        path: "Both",
        direction: "bad",
        effectType: "linear",
        effectScale: "moderate",
        calculatedIn: "buildDerivedFactors",
        reason: "Higher production criticality raises verification burden."
      },
      {
        artifact: "enterpriseReadiness",
        stage: "derivedFactor",
        path: "Vendor-backed / standardized paths",
        direction: "contextual",
        effectType: "interaction",
        effectScale: "moderate",
        calculatedIn: "buildDerivedFactors",
        reason: "More critical work makes vendor-backed support more relevant."
      },
      {
        artifact: "supportNeed",
        stage: "inputIndex",
        path: "MUI / vendor-backed paths",
        direction: "contextual",
        effectType: "interaction",
        effectScale: "small",
        calculatedIn: "buildScorecard",
        reason: "Operationally sensitive work tends to amplify support demand."
      }
    ]
  },
  recommendation: {
    label: "Recommendation",
    group: "Policy and output",
    direction: "contextual",
    summary:
      "Final recommendation selection is driven by dominance and evidence thresholds.",
    impacts: [
      {
        artifact: "recommendation",
        stage: "recommendation",
        path: "Both",
        direction: "contextual",
        effectType: "guardrail",
        effectScale: "small",
        calculatedIn: "runSimulation",
        calibrationRef: "recommendationPolicy.dominance",
        reason: "Dominance thresholds decide when one path clearly wins on delivery or cost."
      },
      {
        artifact: "recommendation",
        stage: "recommendation",
        path: "Both",
        direction: "contextual",
        effectType: "guardrail",
        effectScale: "small",
        calculatedIn: "runSimulation",
        calibrationRef: "recommendationPolicy.coreEvidence",
        reason: "Core recommendations require stronger evidence when the context is otherwise build-friendly."
      }
    ]
  },
  confidence: {
    label: "Confidence",
    group: "Policy and output",
    direction: "neutral",
    summary:
      "Recommendation confidence is bounded by calibrated policy floors, ceilings, and cutoffs.",
    impacts: [
      {
        artifact: "confidence",
        stage: "recommendation",
        path: "Both",
        direction: "neutral",
        effectType: "guardrail",
        effectScale: "small",
        calculatedIn: "runSimulation",
        calibrationRef: "recommendationPolicy.confidence",
        reason: "Confidence scoring uses calibrated floors, ceilings, and high/medium cutoffs."
      }
    ]
  }
};
