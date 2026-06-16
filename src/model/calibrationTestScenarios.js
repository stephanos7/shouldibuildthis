export const CALIBRATION_TEST_SCENARIOS = [
  {
    id: "support-expectation",
    title: "Support expectation should increase enterprise readiness",
    kind: "sequence",
    pathGroup: [
      ["derivedFactorWeights", "enterpriseReadiness", "supportRequirement", "community"],
      ["derivedFactorWeights", "enterpriseReadiness", "supportRequirement", "standard"],
      ["derivedFactorWeights", "enterpriseReadiness", "supportRequirement", "priority"],
      ["derivedFactorWeights", "enterpriseReadiness", "supportRequirement", "procurement-sla"]
    ],
    direction: "ascending"
  },
  {
    id: "accessibility-target",
    title: "Accessibility target should not reduce quality burden",
    kind: "scalar",
    path: ["derivedFactorWeights", "qualityBurden", "accessibilityTarget"],
    direction: "positive"
  },
  {
    id: "lead-time",
    title: "Worsening lead time should not improve delivery maturity",
    kind: "sequence",
    pathGroup: [
      ["deliveryMaturityCaps", "changeLeadTime", "less-than-day"],
      ["deliveryMaturityCaps", "changeLeadTime", "one-day-to-one-week"],
      ["deliveryMaturityCaps", "changeLeadTime", "one-week-to-one-month"],
      ["deliveryMaturityCaps", "changeLeadTime", "more-than-month"]
    ],
    direction: "descending"
  },
  {
    id: "existing-mui-usage",
    title: "Existing MUI usage should not increase adoption burden",
    kind: "sequence",
    pathGroup: [
      ["scenarioLeverWeights", "muiAdoptionBurden", "existingMuiUsage", "none"],
      ["scenarioLeverWeights", "muiAdoptionBurden", "existingMuiUsage", "some"],
      ["scenarioLeverWeights", "muiAdoptionBurden", "existingMuiUsage", "standardized"]
    ],
    direction: "descending"
  },
  {
    id: "production-criticality",
    title: "Production criticality should not reduce enterprise readiness",
    kind: "scalar",
    path: ["derivedFactorWeights", "enterpriseReadiness", "productionCriticality"],
    direction: "positive"
  },
  {
    id: "score-bands",
    title: "Score bands should remain ordered",
    kind: "sequence",
    pathGroup: [
      ["scoreBands", "low", "min"],
      ["scoreBands", "low", "maxExclusive"],
      ["scoreBands", "medium", "min"],
      ["scoreBands", "medium", "maxExclusive"],
      ["scoreBands", "high", "min"],
      ["scoreBands", "high", "maxInclusive"]
    ],
    direction: "ascending",
    allowEqual: true
  },
  {
    id: "confidence-levels",
    title: "Confidence levels should remain ordered",
    kind: "sequence",
    pathGroup: [
      ["confidencePolicy", "levels", "moderate"],
      ["confidencePolicy", "levels", "high"]
    ],
    direction: "ascending"
  },
  {
    id: "confidence-score",
    title: "Confidence score bounds should remain ordered",
    kind: "sequence",
    pathGroup: [
      ["confidencePolicy", "score", "min"],
      ["confidencePolicy", "score", "base"],
      ["confidencePolicy", "score", "max"]
    ],
    direction: "ascending",
    allowEqual: true
  }
];

export const LEGACY_CALIBRATION_TOKENS = ["tco", "monte carlo", "monte-carlo"];
