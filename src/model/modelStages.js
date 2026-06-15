export const MODEL_STAGES = {
  rawInput: {
    label: "Raw input",
    description: "Assessment answers submitted by the user."
  },
  inputIndex: {
    label: "Input index / intermediate",
    description: "Normalized enum indexes or simple intermediate values."
  },
  derivedFactor: {
    label: "Derived factor",
    description: "Rule-based factor scores calculated from raw inputs."
  },
  scorecardRisk: {
    label: "Scorecard risk",
    description: "Normalized risks and strengths used by later calculations."
  },
  planFit: {
    label: "MUI plan fit",
    description:
      "Fit, gap, integration, and support artifacts for Core, Premium, and Enterprise paths."
  },
  pathScore: {
    label: "Path score",
    description:
      "Rule-based Build/Core/Premium/Enterprise scores and selection flags."
  },
  scenarioLever: {
    label: "Scenario lever",
    description:
      "Path-specific levers that shape effort, risk, uncertainty, and path credibility."
  },
  simulationPrep: {
    label: "Simulation preparation",
    description:
      "Shields, penalties, exposures, and velocity factors used by estimates."
  },
  buildEstimate: {
    label: "Build estimate",
    description:
      "Build-path effort, rework, slip, launch, maintenance, and TCO artifacts."
  },
  muiEstimate: {
    label: "MUI estimate",
    description:
      "MUI-path effort, rework, slip, launch, maintenance, license, and TCO artifacts."
  },
  output: {
    label: "Output",
    description: "Displayed Build/MUI estimates and comparison metrics."
  },
  recommendation: {
    label: "Recommendation",
    description: "Final recommendation option, summary, and confidence."
  }
};
