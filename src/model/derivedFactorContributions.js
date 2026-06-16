/*
 * Derived factor contributions
 * ============================
 *
 * This registry is executable routing. It controls which selected raw
 * inputs can add to or subtract from derived-factor scores at runtime.
 *
 * Keep this separate from MODEL_IMPACT_MAP:
 * - this file drives deterministic scoring
 * - MODEL_IMPACT_MAP remains the audit / explanation map
 */

export const DERIVED_FACTOR_CONTRIBUTIONS = {
  supportRequirement: {
    enterpriseReadiness: {
      direction: "positive",
      defaultStrength: 85,
      sourceScale: "supportRequirement",
      explanation:
        "Higher support expectations increase enterprise readiness."
    },
    ownershipBurden: {
      direction: "positive",
      defaultStrength: 45,
      sourceScale: "supportRequirement",
      explanation:
        "Higher support expectations increase ownership and operating burden."
    },
    qualityBurden: {
      direction: "none",
      defaultStrength: 0,
      sourceScale: "supportRequirement",
      explanation:
        "Support requirement does not directly increase quality burden."
    }
  },
  productionCriticality: {
    enterpriseReadiness: {
      direction: "positive",
      defaultStrength: 72,
      sourceScale: "productionCriticality",
      explanation:
        "Production-critical work increases the need for enterprise support."
    },
    qualityBurden: {
      direction: "positive",
      defaultStrength: 40,
      sourceScale: "productionCriticality",
      explanation:
        "Production-critical work increases verification and regression burden."
    },
    ownershipBurden: {
      direction: "positive",
      defaultStrength: 22,
      sourceScale: "productionCriticality",
      explanation:
        "Production-critical work raises long-term ownership accountability."
    }
  },
  ownershipHorizon: {
    ownershipBurden: {
      direction: "positive",
      defaultStrength: 60,
      sourceScale: "ownershipHorizon",
      explanation:
        "Longer ownership horizons increase long-term ownership burden."
    },
    enterpriseReadiness: {
      direction: "positive",
      defaultStrength: 38,
      sourceScale: "ownershipHorizon",
      explanation:
        "Longer ownership horizons make enterprise support more relevant."
    }
  },
  designSystemMaturity: {
    ownershipBurden: {
      direction: "negative",
      defaultStrength: 55,
      sourceScale: "designSystemMaturity",
      explanation:
        "Higher design-system maturity reduces long-term ownership burden."
    },
    enterpriseReadiness: {
      direction: "positive",
      defaultStrength: 24,
      sourceScale: "designSystemMaturity",
      explanation:
        "Higher design-system maturity improves enterprise readiness for standardized delivery."
    }
  },
  ownershipModel: {
    ownershipBurden: {
      direction: "positive",
      defaultStrength: 70,
      sourceScale: "ownershipModel",
      explanation:
        "Clearer ownership models reduce burden; weaker ownership increases it."
    },
    enterpriseReadiness: {
      direction: "positive",
      defaultStrength: 22,
      sourceScale: "ownershipModel",
      explanation:
        "Weaker ownership models increase the need for enterprise support."
    }
  },
  knowledgeConcentration: {
    ownershipBurden: {
      direction: "positive",
      defaultStrength: 80,
      sourceScale: "knowledgeConcentration",
      explanation:
        "Concentrated knowledge increases continuity and maintenance burden."
    },
    enterpriseReadiness: {
      direction: "positive",
      defaultStrength: 24,
      sourceScale: "knowledgeConcentration",
      explanation:
        "Concentrated knowledge increases the need for formal support and governance."
    }
  },
  componentStandardizationGoal: {
    enterpriseReadiness: {
      direction: "positive",
      defaultStrength: 72,
      sourceScale: "componentStandardizationGoal",
      explanation:
        "Stronger standardization goals increase enterprise readiness."
    },
    ownershipBurden: {
      direction: "negative",
      defaultStrength: 28,
      sourceScale: "componentStandardizationGoal",
      explanation:
        "Stronger standardization goals reduce ownership burden by lowering reinvention."
    }
  },
  performanceSensitivity: {
    qualityBurden: {
      direction: "positive",
      defaultStrength: 85,
      sourceScale: "performanceSensitivity",
      explanation:
        "Performance-sensitive work increases verification and regression burden."
    },
    functionalComplexity: {
      direction: "positive",
      defaultStrength: 40,
      sourceScale: "performanceSensitivity",
      explanation:
        "Performance-sensitive work also increases implementation complexity."
    }
  },
  accessibilityTarget: {
    qualityBurden: {
      direction: "positive",
      defaultStrength: 90,
      sourceScale: "accessibilityTarget",
      explanation:
        "Higher accessibility targets increase quality assurance burden."
    }
  }
};
