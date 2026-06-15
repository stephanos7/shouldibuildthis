export const RECOMMENDATION_POLICY_VERSION = "policy-v1";

export const RECOMMENDATION_POLICY = {
  dominance: {
    mui: {
      minProbabilityFaster: 75,
      minProbabilityLowerTco: 75,
      maxLaunchWeekDeltaMedian: 0,
      maxTcoDeltaMedian: 0
    },
    build: {
      maxProbabilityMuiFaster: 25,
      maxProbabilityMuiLowerTco: 25,
      minLaunchWeekDeltaMedian: 0,
      minTcoDeltaMedian: 0
    },
    deliveryOnlyMuiAdvantage: {
      minProbabilityFaster: 75,
      minProbabilityLowerTco: 60,
      maxTcoDeltaMedian: 0
    }
  },
  coreEvidence: {
    buildFriendlyRequiresStrongerEvidence: true,
    minProbabilityFaster: 75,
    minProbabilityLowerTco: 75,
    minLaunchAdvantageWeeks: 2
  },
  enterpriseEligibility: {
    minEnterpriseNeed: 0.68,
    minSupportNeed: 2,
    minEnterpriseTierScore: 78,
    minCoverageScore: 66,
    maxSupportGap: 0.18
  },
  premiumEligibility: {
    minCoverageScore: 62,
    disallowForSimpleLowSupportScope: true
  },
  buildCredibility: {
    maxLaunchDisadvantageWeeks: 1.5,
    maxTcoDisadvantageRatio: 0.1,
    minCompetitiveIndex: 58,
    minStrongCompetitiveIndex: 62,
    minCoverageForNonCoreReuse: 65,
    minCoverageForStrongNonCoreSignal: 74,
    minInternalAbsorptionForBuildTradeoff: 0.74
  },
  confidence: {
    high: 80,
    medium: 62,
    minQualified: 48,
    minBuildWithDeliveryOnlyAdvantage: 62,
    minOpposed: 42,
    max: 96
  }
};
