export const IMPACT_DIRECTIONS = {
  none: "none",
  positive: "positive",
  negative: "negative",
  contextual: "contextual"
};

export const INPUT_SCALE_TYPES = {
  ordered: "ordered",
  categorical: "categorical",
  numeric: "numeric",
  multiSelect: "multiSelect"
};

export const INPUT_CALIBRATION_REGISTRY = {
  existingMuiUsage: {
    label: "Existing MUI usage",
    description:
      "How much MUI is already present in the current React codebase and team workflow.",
    scaleType: INPUT_SCALE_TYPES.ordered,
    options: [
      { key: "none", label: "None" },
      { key: "some", label: "Some usage" },
      { key: "standardized", label: "Standardized" }
    ],
    defaultOptionPositions: {
      none: 0,
      some: 45,
      standardized: 100
    },
    impacts: {
      buildFit: {
        direction: IMPACT_DIRECTIONS.negative,
        strength: 35,
        explanation:
          "Higher existing MUI usage reduces the relative case for starting a custom in-house path."
      },
      coreFit: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 70,
        explanation:
          "Existing MUI usage improves Core fit because adoption friction and integration risk are lower."
      },
      premiumFit: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 70,
        explanation:
          "Existing MUI usage improves Premium fit because more of the packaged path can be adopted directly."
      },
      enterpriseFit: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 60,
        explanation:
          "Existing MUI usage improves Enterprise fit by making the vendor-backed path easier to absorb."
      }
    }
  },
  designSystemMaturity: {
    label: "Design system maturity",
    description:
      "How mature the internal design system, standards, and shared UI patterns already are.",
    scaleType: INPUT_SCALE_TYPES.ordered,
    options: [
      { key: "low", label: "Low" },
      { key: "medium", label: "Medium" },
      { key: "high", label: "High" }
    ],
    defaultOptionPositions: {
      low: 0,
      medium: 50,
      high: 100
    },
    impacts: {
      ownershipBurden: {
        direction: IMPACT_DIRECTIONS.negative,
        strength: 55,
        explanation:
          "Higher maturity reduces long-term ownership burden because standards and reuse are already in place."
      },
      buildFit: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 60,
        explanation:
          "A mature internal system makes the Build path more credible because the team can absorb custom UI work more cleanly."
      },
      coreFit: {
        direction: IMPACT_DIRECTIONS.contextual,
        strength: 30,
        explanation:
          "Higher maturity can either help packaged adoption through discipline or hurt it when strong internal patterns do not align with MUI."
      },
      premiumFit: {
        direction: IMPACT_DIRECTIONS.contextual,
        strength: 30,
        explanation:
          "Higher maturity can either help packaged adoption through discipline or hurt it when strong internal patterns do not align with MUI X."
      }
    }
  },
  dependentTeams: {
    label: "Dependent teams",
    description:
      "How many other teams depend on this UI capability, directly increasing coordination and rollout complexity.",
    scaleType: INPUT_SCALE_TYPES.ordered,
    options: [
      { key: "one", label: "One" },
      { key: "two-three", label: "Two to three" },
      { key: "four-seven", label: "Four to seven" },
      { key: "eight-plus", label: "Eight or more" }
    ],
    defaultOptionPositions: {
      one: 0,
      "two-three": 35,
      "four-seven": 70,
      "eight-plus": 100
    },
    impacts: {
      ownershipBurden: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 80,
        explanation:
          "More dependent teams increase coordination load and long-term ownership drag."
      },
      enterpriseReadiness: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 55,
        explanation:
          "A wider dependency graph makes vendor-backed support and standardized rollout more relevant."
      },
      buildFit: {
        direction: IMPACT_DIRECTIONS.negative,
        strength: 45,
        explanation:
          "More dependent teams make the Build path harder to sustain because custom ownership spreads across more consumers."
      },
      enterpriseFit: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 40,
        explanation:
          "More dependent teams strengthen Enterprise fit when a broadly supported path is needed."
      }
    }
  },
  ownershipModel: {
    label: "Ownership model",
    description:
      "How clearly ownership of the UI surface is assigned across product and platform teams.",
    scaleType: INPUT_SCALE_TYPES.categorical,
    options: [
      { key: "same-product-team", label: "Same product team" },
      { key: "frontend-platform-team", label: "Frontend platform team" },
      { key: "several-teams-informal", label: "Several teams informally" },
      { key: "unclear", label: "Unclear" }
    ],
    impacts: {
      ownershipBurden: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 75,
        explanation:
          "Informal or unclear ownership increases coordination and maintenance burden."
      },
      buildFit: {
        direction: IMPACT_DIRECTIONS.contextual,
        strength: 65,
        explanation:
          "Clear ownership helps Build fit, while unclear ownership makes a custom path harder to absorb."
      },
      coreFit: {
        direction: IMPACT_DIRECTIONS.contextual,
        strength: 30,
        explanation:
          "Packaged adoption is easier when ownership is clear and harder when several teams adapt it informally."
      },
      premiumFit: {
        direction: IMPACT_DIRECTIONS.contextual,
        strength: 30,
        explanation:
          "Packaged adoption is easier when ownership is clear and harder when several teams adapt it informally."
      }
    }
  },
  primaryUseCase: {
    label: "Primary use case",
    description:
      "The dominant UI problem being evaluated, which anchors scope, complexity, and likely path fit.",
    scaleType: INPUT_SCALE_TYPES.categorical,
    options: [
      { key: "data-grid", label: "Data grid" },
      { key: "charts", label: "Charts" },
      { key: "date-pickers", label: "Date pickers" },
      { key: "tree-view", label: "Tree view" },
      { key: "scheduler", label: "Scheduler" },
      { key: "multi-component", label: "Multi-component evaluation" }
    ],
    impacts: {
      functionalComplexity: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 75,
        explanation:
          "The selected use case sets the baseline complexity of the UI capability."
      },
      coreFit: {
        direction: IMPACT_DIRECTIONS.contextual,
        strength: 70,
        explanation:
          "Some use cases fit Core well while others clearly push beyond it."
      },
      premiumFit: {
        direction: IMPACT_DIRECTIONS.contextual,
        strength: 70,
        explanation:
          "Some use cases align strongly with Premium while others do not need that tier."
      },
      enterpriseFit: {
        direction: IMPACT_DIRECTIONS.contextual,
        strength: 60,
        explanation:
          "Some use cases increase the relevance of Enterprise-grade packaged coverage."
      }
    }
  },
  accessibilityTarget: {
    label: "Accessibility target",
    description:
      "The accessibility standard the team expects this UI capability to meet.",
    scaleType: INPUT_SCALE_TYPES.ordered,
    options: [
      { key: "none", label: "None" },
      { key: "wcag-a", label: "WCAG A" },
      { key: "wcag-aa", label: "WCAG AA" },
      { key: "wcag-aaa-regulated", label: "WCAG AAA / regulated" }
    ],
    defaultOptionPositions: {
      none: 0,
      "wcag-a": 35,
      "wcag-aa": 70,
      "wcag-aaa-regulated": 100
    },
    impacts: {
      qualityBurden: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 85,
        explanation:
          "Stricter accessibility targets directly increase verification and regression burden."
      },
      enterpriseReadiness: {
        direction: IMPACT_DIRECTIONS.contextual,
        strength: 25,
        explanation:
          "Highly regulated accessibility expectations can make vendor-backed assurances more relevant."
      }
    }
  },
  changeLeadTime: {
    label: "Change lead time",
    description:
      "How quickly the team can typically ship changes to this UI surface.",
    scaleType: INPUT_SCALE_TYPES.ordered,
    options: [
      { key: "less-than-day", label: "Less than a day" },
      { key: "one-day-to-one-week", label: "One day to one week" },
      { key: "one-week-to-one-month", label: "One week to one month" },
      { key: "more-than-month", label: "More than a month" },
      { key: "unknown", label: "Unknown" }
    ],
    defaultOptionPositions: {
      "less-than-day": 100,
      "one-day-to-one-week": 70,
      "one-week-to-one-month": 35,
      "more-than-month": 0,
      unknown: 20
    },
    impacts: {
      deliveryMaturity: {
        direction: IMPACT_DIRECTIONS.negative,
        strength: 80,
        explanation:
          "Longer lead time lowers delivery maturity, while faster lead time improves it."
      },
      buildFit: {
        direction: IMPACT_DIRECTIONS.negative,
        strength: 35,
        explanation:
          "Slower lead time weakens Build fit because custom delivery work is harder to absorb quickly."
      }
    }
  },
  performanceSensitivity: {
    label: "Performance sensitivity",
    description:
      "How tightly runtime performance is constrained for this UI capability.",
    scaleType: INPUT_SCALE_TYPES.ordered,
    options: [
      { key: "not-critical", label: "Not critical" },
      { key: "important", label: "Important" },
      { key: "strict-budget", label: "Strict performance budget" },
      {
        key: "measured-core-web-vitals-target",
        label: "Measured Core Web Vitals target"
      }
    ],
    defaultOptionPositions: {
      "not-critical": 0,
      important: 35,
      "strict-budget": 70,
      "measured-core-web-vitals-target": 100
    },
    impacts: {
      qualityBurden: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 70,
        explanation:
          "Tighter performance expectations increase profiling, tuning, and regression burden."
      },
      premiumFit: {
        direction: IMPACT_DIRECTIONS.contextual,
        strength: 25,
        explanation:
          "Stricter performance constraints can strengthen the case for a more performance-ready packaged path when the rest of the scope is also demanding."
      }
    }
  },
  reworkFrequency: {
    label: "Rework frequency",
    description:
      "How often the team revisits or churns this area of UI after initial delivery.",
    scaleType: INPUT_SCALE_TYPES.ordered,
    options: [
      { key: "rare", label: "Rare" },
      { key: "occasional", label: "Occasional" },
      { key: "frequent", label: "Frequent" },
      { key: "unknown", label: "Unknown" }
    ],
    defaultOptionPositions: {
      rare: 100,
      occasional: 60,
      frequent: 0,
      unknown: 30
    },
    impacts: {
      deliveryMaturity: {
        direction: IMPACT_DIRECTIONS.negative,
        strength: 70,
        explanation:
          "More rework lowers delivery maturity because churn makes delivery less predictable."
      },
      ownershipBurden: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 25,
        explanation:
          "Frequent rework modestly increases the long-term cost of owning a custom UI surface."
      }
    }
  },
  knowledgeConcentration: {
    label: "Knowledge concentration",
    description:
      "How widely implementation knowledge is shared versus concentrated in a few people.",
    scaleType: INPUT_SCALE_TYPES.ordered,
    options: [
      { key: "shared", label: "Shared across the team" },
      { key: "few-owners", label: "A few owners" },
      { key: "single-owner", label: "Mostly one owner" },
      { key: "unknown", label: "Unknown" }
    ],
    defaultOptionPositions: {
      shared: 100,
      "few-owners": 55,
      "single-owner": 0,
      unknown: 25
    },
    impacts: {
      ownershipBurden: {
        direction: IMPACT_DIRECTIONS.negative,
        strength: 70,
        explanation:
          "More shared knowledge lowers ownership burden, while concentrated knowledge raises key-person risk."
      },
      buildFit: {
        direction: IMPACT_DIRECTIONS.negative,
        strength: 50,
        explanation:
          "Concentrated knowledge weakens Build fit because a custom path depends on fewer people to maintain it."
      },
      confidence: {
        direction: IMPACT_DIRECTIONS.negative,
        strength: 25,
        explanation:
          "Concentrated knowledge reduces confidence because long-term execution depends on less resilient team coverage."
      }
    }
  },
  designDevHandoffFriction: {
    label: "Design-dev handoff friction",
    description:
      "How much friction exists between design intent and engineering implementation.",
    scaleType: INPUT_SCALE_TYPES.ordered,
    options: [
      { key: "low", label: "Low" },
      { key: "medium", label: "Medium" },
      { key: "high", label: "High" },
      { key: "unknown", label: "Unknown" }
    ],
    defaultOptionPositions: {
      low: 0,
      medium: 50,
      high: 100,
      unknown: 60
    },
    impacts: {
      qualityBurden: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 65,
        explanation:
          "Higher handoff friction increases QA and regression burden because implementation diverges more often from intent."
      },
      buildFit: {
        direction: IMPACT_DIRECTIONS.negative,
        strength: 35,
        explanation:
          "Higher friction weakens Build fit because custom implementation absorbs more rework and coordination cost."
      },
      coreFit: {
        direction: IMPACT_DIRECTIONS.negative,
        strength: 20,
        explanation:
          "Higher friction can also weaken packaged adoption because adapting shared components still requires coordination."
      }
    }
  },
  componentStandardizationGoal: {
    label: "Component standardization goal",
    description:
      "How strongly the organization wants this UI capability to become a repeatable shared standard.",
    scaleType: INPUT_SCALE_TYPES.ordered,
    options: [
      { key: "none", label: "No standardization goal" },
      { key: "reduce-one-offs", label: "Reduce one-off components" },
      { key: "shared-pattern", label: "Shared pattern" },
      { key: "platform-standard", label: "Platform standard" }
    ],
    defaultOptionPositions: {
      none: 0,
      "reduce-one-offs": 35,
      "shared-pattern": 70,
      "platform-standard": 100
    },
    impacts: {
      enterpriseReadiness: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 70,
        explanation:
          "A stronger standardization goal increases the relevance of standardized and vendor-backed delivery."
      },
      buildFit: {
        direction: IMPACT_DIRECTIONS.contextual,
        strength: 35,
        explanation:
          "Standardization can help Build when internal reuse is strong, but it can also strengthen the case for packaged adoption."
      },
      coreFit: {
        direction: IMPACT_DIRECTIONS.contextual,
        strength: 45,
        explanation:
          "Standardization goals can improve Core fit when the desired shared pattern is well covered by Core."
      },
      premiumFit: {
        direction: IMPACT_DIRECTIONS.contextual,
        strength: 50,
        explanation:
          "Standardization goals can improve Premium fit when broader reusable coverage is needed across teams."
      },
      enterpriseFit: {
        direction: IMPACT_DIRECTIONS.contextual,
        strength: 50,
        explanation:
          "Standardization goals can improve Enterprise fit when support and governance matter across a larger platform context."
      }
    }
  },
  deadlinePressure: {
    label: "Deadline pressure",
    description:
      "How compressed the delivery timeline is for this UI capability.",
    scaleType: INPUT_SCALE_TYPES.ordered,
    options: [
      { key: "low", label: "Low" },
      { key: "medium", label: "Medium" },
      { key: "high", label: "High" }
    ],
    defaultOptionPositions: {
      low: 0,
      medium: 50,
      high: 100
    },
    impacts: {
      deliveryMaturity: {
        direction: IMPACT_DIRECTIONS.negative,
        strength: 80,
        explanation:
          "Higher deadline pressure lowers delivery maturity because it compresses execution and recovery time."
      },
      buildFit: {
        direction: IMPACT_DIRECTIONS.negative,
        strength: 45,
        explanation:
          "Higher deadline pressure weakens Build fit because more custom implementation must land under less schedule slack."
      }
    }
  },
  ownershipHorizon: {
    label: "Ownership horizon",
    description:
      "How long the team expects to actively own and evolve this UI capability.",
    scaleType: INPUT_SCALE_TYPES.ordered,
    options: [
      { key: 12, label: "12 months" },
      { key: 24, label: "24 months" },
      { key: 36, label: "36 months" }
    ],
    defaultOptionPositions: {
      12: 0,
      24: 50,
      36: 100
    },
    impacts: {
      ownershipBurden: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 45,
        explanation:
          "Longer ownership horizons can increase long-term maintenance burden when continuity and coordination are weak."
      },
      buildFit: {
        direction: IMPACT_DIRECTIONS.contextual,
        strength: 40,
        explanation:
          "Longer horizons can help Build when internal maturity is strong, but hurt it when continuity risk is high."
      },
      enterpriseFit: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 55,
        explanation:
          "Longer ownership horizons increase Enterprise fit when support continuity and long-lived vendor backing matter."
      }
    }
  },
  supportRequirement: {
    label: "Support requirement",
    description:
      "The level of support, escalation, or procurement assurance expected for this UI capability.",
    scaleType: "ordered",
    options: [
      { key: "community", label: "Community" },
      { key: "standard", label: "Standard" },
      { key: "priority", label: "Priority" },
      { key: "procurement-sla", label: "Procurement-backed SLA" }
    ],
    defaultOptionPositions: {
      community: 0,
      standard: 30,
      priority: 70,
      "procurement-sla": 100
    },
    impacts: {
      enterpriseReadiness: {
        direction: "positive",
        strength: 85,
        explanation:
          "Higher support expectations increase enterprise readiness because accountable vendor support becomes more relevant."
      },
      ownershipBurden: {
        direction: "positive",
        strength: 45,
        explanation:
          "Higher support expectations increase ownership and operating burden when handled internally."
      },
      qualityBurden: {
        direction: "none",
        strength: 0,
        explanation:
          "Support requirement should not directly increase quality burden."
      },
      coreFit: {
        direction: "negative",
        strength: 75,
        explanation:
          "Higher support expectations make Core less sufficient."
      },
      premiumFit: {
        direction: "positive",
        strength: 45,
        explanation:
          "Moderate support expectations can strengthen Premium fit."
      },
      enterpriseFit: {
        direction: "positive",
        strength: 85,
        explanation:
          "Priority or procurement-backed support strengthens Enterprise fit."
      }
    }
  },
  productionCriticality: {
    label: "Production criticality",
    description:
      "How operationally sensitive the capability is in production once it is launched.",
    scaleType: INPUT_SCALE_TYPES.ordered,
    options: [
      { key: "internal-tool", label: "Internal tool" },
      { key: "customer-facing", label: "Customer-facing" },
      { key: "revenue-critical", label: "Revenue-critical" },
      { key: "regulated-or-sla-backed", label: "Regulated or SLA-backed" }
    ],
    defaultOptionPositions: {
      "internal-tool": 0,
      "customer-facing": 35,
      "revenue-critical": 70,
      "regulated-or-sla-backed": 100
    },
    impacts: {
      qualityBurden: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 65,
        explanation:
          "Higher production criticality increases verification and regression burden."
      },
      enterpriseReadiness: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 65,
        explanation:
          "More critical production contexts make vendor-backed support and stronger operational assurances more relevant."
      },
      enterpriseFit: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 50,
        explanation:
          "Higher criticality can strengthen Enterprise fit when accountability and support depth matter."
      }
    }
  },
  frontendDevelopers: {
    label: "Frontend developers",
    description:
      "The number of frontend developers available to absorb, standardize, and maintain this UI work.",
    scaleType: INPUT_SCALE_TYPES.numeric,
    numeric: {
      min: 1,
      step: 1,
      integerOnly: true,
      suggestedMax: 20,
      unit: "developers"
    },
    impacts: {
      enterpriseReadiness: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 40,
        explanation:
          "Larger frontend organizations make standardization and supportability more relevant."
      },
      ownershipBurden: {
        direction: IMPACT_DIRECTIONS.none,
        strength: 0,
        explanation:
          "Developer count should not directly increase ownership burden."
      },
      buildFit: {
        direction: IMPACT_DIRECTIONS.contextual,
        strength: 25,
        explanation:
          "More frontend capacity can improve Build credibility, but it does not guarantee that building is the best path."
      }
    }
  },
  reactApps: {
    label: "React apps",
    description:
      "The number of React apps or surfaces that would need to absorb the chosen UI path.",
    scaleType: INPUT_SCALE_TYPES.numeric,
    numeric: {
      min: 1,
      step: 1,
      integerOnly: true,
      suggestedMax: 20,
      unit: "apps"
    },
    impacts: {
      ownershipBurden: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 65,
        explanation:
          "More React apps widen the ownership and rollout surface area."
      },
      enterpriseReadiness: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 50,
        explanation:
          "A broader app footprint makes standardization and rollout support more relevant."
      },
      enterpriseFit: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 35,
        explanation:
          "A wider footprint can strengthen Enterprise fit when coordination and support need to scale."
      }
    }
  },
  dataHeavyScreens: {
    label: "Data-heavy screens",
    description:
      "The count of screens that carry large tables or similarly dense data interaction patterns.",
    scaleType: INPUT_SCALE_TYPES.numeric,
    numeric: {
      min: 0,
      step: 1,
      integerOnly: true,
      suggestedMax: 20,
      unit: "screens"
    },
    impacts: {
      functionalComplexity: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 70,
        explanation:
          "More data-heavy screens increase interaction and state complexity."
      },
      qualityBurden: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 45,
        explanation:
          "More dense screens increase performance and regression burden."
      },
      premiumFit: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 40,
        explanation:
          "More dense screens can strengthen Premium fit when packaged data-grid capabilities matter more."
      }
    }
  },
  expectedRows: {
    label: "Expected rows",
    description:
      "The row-scale band the team expects the capability to handle in production.",
    scaleType: INPUT_SCALE_TYPES.ordered,
    options: [
      { key: "under-1k", label: "Under 1k" },
      { key: "1k-10k", label: "1k to 10k" },
      { key: "10k-100k", label: "10k to 100k" },
      { key: "over-100k", label: "Over 100k" }
    ],
    defaultOptionPositions: {
      "under-1k": 0,
      "1k-10k": 35,
      "10k-100k": 70,
      "over-100k": 100
    },
    impacts: {
      functionalComplexity: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 75,
        explanation:
          "Larger row bands increase scope and state complexity."
      },
      qualityBurden: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 70,
        explanation:
          "Larger row bands increase performance, QA, and regression burden."
      },
      coreFit: {
        direction: IMPACT_DIRECTIONS.negative,
        strength: 60,
        explanation:
          "Higher row-scale expectations make Core less sufficient."
      },
      premiumFit: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 60,
        explanation:
          "Higher row-scale expectations strengthen Premium fit because scale coverage matters more."
      },
      enterpriseFit: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 45,
        explanation:
          "Very high row-scale expectations can strengthen Enterprise fit when the packaged path must cover more demanding scale."
      }
    }
  },
  expectedColumns: {
    label: "Expected columns",
    description:
      "The column-scale band the team expects the capability to handle in production.",
    scaleType: INPUT_SCALE_TYPES.ordered,
    options: [
      { key: "under-10", label: "Under 10" },
      { key: "10-30", label: "10 to 30" },
      { key: "over-30", label: "Over 30" }
    ],
    defaultOptionPositions: {
      "under-10": 0,
      "10-30": 55,
      "over-30": 100
    },
    impacts: {
      functionalComplexity: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 65,
        explanation:
          "Wider column bands increase scope and state complexity."
      },
      qualityBurden: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 60,
        explanation:
          "Wider column bands increase tuning, QA, and regression burden."
      },
      coreFit: {
        direction: IMPACT_DIRECTIONS.negative,
        strength: 50,
        explanation:
          "Higher column-scale expectations make Core less sufficient."
      },
      premiumFit: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 55,
        explanation:
          "Higher column-scale expectations strengthen Premium fit because richer data-grid coverage matters more."
      }
    }
  },
  advancedFeatures: {
    label: "Advanced features",
    description:
      "Advanced behaviors that add interaction complexity, integration load, and verification burden.",
    scaleType: INPUT_SCALE_TYPES.multiSelect,
    options: [
      { key: "virtualization", label: "Virtualization at scale" },
      { key: "inline-editing", label: "Inline editing workflows" },
      { key: "server-side-data", label: "Server-side data operations" },
      { key: "keyboard-navigation", label: "Deep keyboard navigation" },
      { key: "exporting", label: "Export or print requirements" },
      { key: "drag-and-drop", label: "Drag-and-drop interactions" },
      { key: "custom-rendering", label: "Complex custom cell or item rendering" },
      { key: "timezone-logic", label: "Timezone logic" },
      { key: "i18n-localization", label: "i18n and localization requirements" }
    ],
    impacts: {
      functionalComplexity: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 90,
        explanation:
          "Adding more advanced behaviors directly increases implementation complexity."
      },
      qualityBurden: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 80,
        explanation:
          "Advanced behaviors increase QA burden across keyboard support, rendering, localization, and regression coverage."
      },
      coreFit: {
        direction: IMPACT_DIRECTIONS.negative,
        strength: 65,
        explanation:
          "A heavier advanced-feature set makes Core less likely to cover the workload well."
      },
      premiumFit: {
        direction: IMPACT_DIRECTIONS.positive,
        strength: 70,
        explanation:
          "A heavier advanced-feature set can strengthen Premium fit when packaged coverage aligns well."
      },
      enterpriseFit: {
        direction: IMPACT_DIRECTIONS.contextual,
        strength: 45,
        explanation:
          "A heavier advanced-feature set can strengthen Enterprise fit when those behaviors also need broader support and governance."
      }
    }
  }
};
