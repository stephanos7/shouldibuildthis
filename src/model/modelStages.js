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
  deterministicSensitivity: {
    label: "Deterministic sensitivity",
    description:
      "Deterministic guardrails, sensitivity signals, and path-fit adjustments used by fit scoring."
  },
  buildFitOutput: {
    label: "Build fit output",
    description:
      "Deterministic Build fit artifacts and recommendation support signals."
  },
  muiFitOutput: {
    label: "MUI fit output",
    description:
      "Deterministic MUI fit artifacts and recommendation support signals."
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
