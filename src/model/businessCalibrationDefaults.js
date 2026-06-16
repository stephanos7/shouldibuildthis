import { INPUT_CALIBRATION_REGISTRY, INPUT_SCALE_TYPES } from "./inputCalibrationRegistry.js";
import { PATH_FIT_COMPONENT_WEIGHTS } from "./calibration.js";

function cloneValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, cloneValue(child)])
    );
  }

  return value;
}

function sortSignalKeysByShare(signalGroup) {
  return Object.entries(signalGroup ?? {})
    .map(([signalKey, config], index) => ({
      signalKey,
      share: Number(config?.share) || 0,
      index
    }))
    .sort((left, right) => {
      if (right.share !== left.share) {
        return right.share - left.share;
      }

      return left.index - right.index;
    })
    .map(({ signalKey }) => signalKey);
}

function buildDefaultInputScales() {
  const inputScales = {};

  for (const [inputKey, config] of Object.entries(INPUT_CALIBRATION_REGISTRY)) {
    if (config.scaleType !== INPUT_SCALE_TYPES.ordered) {
      continue;
    }

    const orderedOptions = config.options ?? [];
    const rawPositions = config.defaultOptionPositions ?? {};
    const orderedValues = orderedOptions.map((option) =>
      Number(rawPositions[String(option.key)])
    );
    const hasMonotonicDefaults =
      orderedValues.length > 0 &&
      orderedValues.every((value) => Number.isFinite(value)) &&
      orderedValues.every(
        (value, index) => index === 0 || value >= orderedValues[index - 1]
      );

    inputScales[inputKey] = {
      optionPositions: hasMonotonicDefaults
        ? cloneValue(config.defaultOptionPositions ?? {})
        : Object.fromEntries(
            orderedOptions.map((option, index) => {
              const optionKey = String(option.key);

              if (orderedOptions.length <= 1) {
                return [optionKey, 0];
              }

              const position = index === orderedOptions.length - 1
                ? 100
                : Number(((100 * index) / (orderedOptions.length - 1)).toFixed(2));

              return [optionKey, position];
            })
          )
    };
  }

  return inputScales;
}

function buildDefaultInputImpacts() {
  const inputImpacts = {};

  for (const [inputKey, config] of Object.entries(INPUT_CALIBRATION_REGISTRY)) {
    const impacts = config.impacts ?? {};
    const nextImpacts = {};

    for (const [targetKey, targetConfig] of Object.entries(impacts)) {
      nextImpacts[targetKey] = {
        direction: targetConfig.direction,
        strength: targetConfig.strength
      };
    }

    if (Object.keys(nextImpacts).length > 0) {
      inputImpacts[inputKey] = nextImpacts;
    }
  }

  return inputImpacts;
}

function buildDefaultPathPriorities() {
  const pathPriorities = {};

  for (const [pathKey, pathConfig] of Object.entries(PATH_FIT_COMPONENT_WEIGHTS)) {
    if (
      !pathConfig ||
      typeof pathConfig !== "object" ||
      !("positiveSignals" in pathConfig) ||
      !("dragSignals" in pathConfig)
    ) {
      continue;
    }

    pathPriorities[pathKey] = {
      positiveSignalsOrder: sortSignalKeysByShare(pathConfig.positiveSignals),
      dragSignalsOrder: sortSignalKeysByShare(pathConfig.dragSignals)
    };
  }

  return pathPriorities;
}

export function buildDefaultBusinessCalibrationProfile() {
  return {
    inputScales: buildDefaultInputScales(),
    inputImpacts: buildDefaultInputImpacts(),
    pathPriorities: buildDefaultPathPriorities()
  };
}

export const DEFAULT_BUSINESS_CALIBRATION_PROFILE = buildDefaultBusinessCalibrationProfile();
