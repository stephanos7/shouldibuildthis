import {
  CALIBRATION_OUTCOME_KEYS,
  IMPACT_DIRECTIONS,
  INPUT_CALIBRATION_REGISTRY,
  INPUT_SCALE_TYPES
} from "./inputCalibrationRegistry.js";
import { PATH_FIT_COMPONENT_WEIGHTS } from "./calibration.js";

export const BUSINESS_CALIBRATION_PATH_ORDER = ["build", "core", "premium", "enterprise"];

export const BUSINESS_CALIBRATION_PATH_LABELS = {
  build: "Build in-house",
  core: "MUI Core",
  premium: "MUI X Premium",
  enterprise: "MUI X Enterprise"
};

export const BUSINESS_CALIBRATION_PATH_PRIORITY_GROUPS = {
  positiveSignalsOrder: "Helps this path",
  dragSignalsOrder: "Drags on this path"
};

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
    const nextImpacts = {};

    for (const targetKey of CALIBRATION_OUTCOME_KEYS) {
      const targetConfig = config.impacts?.[targetKey];

      nextImpacts[targetKey] = {
        direction: targetConfig?.direction ?? IMPACT_DIRECTIONS.none,
        strength: Number(targetConfig?.strength) || 0
      };
    }

    inputImpacts[inputKey] = nextImpacts;
  }

  return inputImpacts;
}

function buildDefaultPathPriorities() {
  const pathPriorities = {};

  for (const pathKey of BUSINESS_CALIBRATION_PATH_ORDER) {
    const pathConfig = PATH_FIT_COMPONENT_WEIGHTS[pathKey];

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
