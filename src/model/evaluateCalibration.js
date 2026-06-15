export function evaluateThresholdTable(value, table) {
  const match = table.thresholds.find((rule) => {
    const aboveMin =
      rule.minInclusive === undefined || value >= rule.minInclusive;
    const belowMax =
      rule.maxExclusive === undefined || value < rule.maxExclusive;

    return aboveMin && belowMax;
  });

  return match?.adjustment ?? table.defaultAdjustment ?? 0;
}

export function resolveCalibrationRef(calibration, ref) {
  return ref.split(".").reduce((current, key) => current?.[key], calibration);
}
