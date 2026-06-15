import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import PageHero from "../components/PageHero.jsx";
import CalibrationPreview from "../components/admin/CalibrationPreview.jsx";
import CalibrationSectionCard from "../components/admin/CalibrationSectionCard.jsx";
import CalibrationNumberField from "../components/admin/CalibrationNumberField.jsx";
import PathFitSignalTable from "../components/admin/PathFitSignalTable.jsx";
import {
  clearCalibrationOverrides,
  exportCalibrationOverrides,
  importCalibrationOverrides,
  mergeCalibrationDraft,
  readCalibrationOverrides,
  writeCalibrationOverrides
} from "../model/calibrationStorage.js";
import { DEFAULT_CALIBRATION } from "../model/calibration.js";
import { getCalibrationOverridePaths, validateCalibrationOverrides } from "../model/calibrationOverrides.js";

const PATH_KEYS = ["build", "core", "premium", "enterprise"];

const inputScaleSections = [
  {
    title: "Support requirement",
    description: "Vendor support pressure mapped into normalized signal scales.",
    path: ["fitSignalScales", "supportLightness"],
    helper: "Normalized scale used by support-related signals."
  },
  {
    title: "Ownership model",
    description: "Ownership clarity mapped into normalized signal scales.",
    path: ["fitSignalScales", "ownershipClarity"],
    helper: "Higher values mean clearer ownership."
  },
  {
    title: "Knowledge concentration",
    description: "How shared the implementation knowledge is across the team.",
    path: ["fitSignalScales", "knowledgeSpread"],
    helper: "Higher values mean knowledge is more distributed."
  },
  {
    title: "Delivery maturity",
    description: "Maturity scale used by the scenario levers.",
    path: ["fitSignalScales", "maturityStrength"],
    helper: "Higher values mean stronger delivery maturity."
  },
  {
    title: "Handoff alignment",
    description: "Design-dev handoff quality mapped into the normalized scale.",
    path: ["fitSignalScales", "handoffAlignment"],
    helper: "Higher values mean better handoff alignment."
  },
  {
    title: "MUI usage readiness",
    description: "Existing MUI usage readiness for adoption and leverage.",
    path: ["fitSignalScales", "muiUsageReadiness"],
    helper: "Higher values mean the codebase is more ready for MUI."
  },
  {
    title: "MUI usage leverage",
    description: "Leverage scale used by the scenario levers.",
    path: ["fitSignalScales", "muiUsageLeverage"],
    helper: "Higher values mean existing usage is more reusable."
  }
];

const derivedFactorSections = [
  {
    key: "functionalComplexity",
    title: "Functional complexity",
    description: "Inputs that shape the functional complexity derived factor."
  },
  {
    key: "qualityBurden",
    title: "Quality burden",
    description: "Inputs that shape the verification and regression burden."
  },
  {
    key: "deliveryMaturity",
    title: "Delivery maturity",
    description: "Inputs that shape the team's maturity and delivery slack."
  },
  {
    key: "ownershipBurden",
    title: "Ownership burden",
    description: "Inputs that shape long-term ownership and continuity burden."
  },
  {
    key: "enterpriseReadiness",
    title: "Enterprise readiness",
    description: "Inputs that shape support and standardization readiness."
  }
];

const policyGroups = [
  {
    title: "Score bands",
    path: ["scoreBands"],
    fields: [
      { path: ["scoreBands", "low", "min"], label: "Low min", step: 0.1 },
      { path: ["scoreBands", "low", "maxExclusive"], label: "Low max (exclusive)", step: 0.1 },
      { path: ["scoreBands", "medium", "min"], label: "Medium min", step: 0.1 },
      { path: ["scoreBands", "medium", "maxExclusive"], label: "Medium max (exclusive)", step: 0.1 },
      { path: ["scoreBands", "high", "min"], label: "High min", step: 0.1 },
      { path: ["scoreBands", "high", "maxInclusive"], label: "High max (inclusive)", step: 0.1 }
    ]
  },
  {
    title: "Contained scope",
    path: ["deterministicPolicy", "containedScope"],
    fields: [
      { path: ["deterministicPolicy", "containedScope", "maxFunctionalRisk"], label: "Max functional risk", step: 0.01, min: 0, max: 1 },
      { path: ["deterministicPolicy", "containedScope", "maxQualityRisk"], label: "Max quality risk", step: 0.01, min: 0, max: 1 },
      { path: ["deterministicPolicy", "containedScope", "maxAdvancedFeatures"], label: "Max advanced features", step: 1, min: 0 },
      { path: ["deterministicPolicy", "containedScope", "maxDataHeavyScreens"], label: "Max data-heavy screens", step: 1, min: 0 },
      { path: ["deterministicPolicy", "containedScope", "maxRowScale"], label: "Max row scale", step: 1, min: 0 },
      { path: ["deterministicPolicy", "containedScope", "maxColumnScale"], label: "Max column scale", step: 1, min: 0 }
    ]
  },
  {
    title: "Premium / Enterprise eligibility",
    path: ["pathScores"],
    fields: [
      { path: ["pathScores", "premiumEligibility", "minCoverageScore"], label: "Premium min coverage", step: 0.1 },
      { path: ["pathScores", "premiumEligibility", "disallowForSimpleLowSupportScope"], label: "Premium disallow flag", readOnly: true },
      { path: ["pathScores", "premiumEligibility", "minFunctionalRisk"], label: "Premium min functional risk", step: 0.01, min: 0, max: 1 },
      { path: ["pathScores", "premiumEligibility", "minQualityRisk"], label: "Premium min quality risk", step: 0.01, min: 0, max: 1 },
      { path: ["pathScores", "premiumEligibility", "minRowScale"], label: "Premium min row scale", step: 1, min: 0 },
      { path: ["pathScores", "premiumEligibility", "minColumnScale"], label: "Premium min column scale", step: 1, min: 0 },
      { path: ["pathScores", "premiumEligibility", "minAdvancedFeatureCount"], label: "Premium min features", step: 1, min: 0 },
      { path: ["pathScores", "enterpriseEligibility", "minEnterpriseNeed"], label: "Enterprise min need", step: 0.01, min: 0, max: 1 },
      { path: ["pathScores", "enterpriseEligibility", "minSupportNeed"], label: "Enterprise min support need", step: 1, min: 0 },
      { path: ["pathScores", "enterpriseEligibility", "minEnterpriseTierScore"], label: "Enterprise min tier score", step: 0.1 },
      { path: ["pathScores", "enterpriseEligibility", "minCoverageScore"], label: "Enterprise min coverage", step: 0.1 },
      { path: ["pathScores", "enterpriseEligibility", "maxSupportGap"], label: "Enterprise max support gap", step: 0.01, min: 0, max: 1 }
    ]
  },
  {
    title: "Build-friendly context",
    path: ["deterministicPolicy", "buildFriendlyContext"],
    fields: [
      { path: ["deterministicPolicy", "buildFriendlyContext", "maxSupportNeed"], label: "Max support need", step: 1, min: 0 },
      { path: ["deterministicPolicy", "buildFriendlyContext", "maxRowScale"], label: "Max row scale", step: 1, min: 0 },
      { path: ["deterministicPolicy", "buildFriendlyContext", "maxColumnScale"], label: "Max column scale", step: 1, min: 0 },
      { path: ["deterministicPolicy", "buildFriendlyContext", "maxAdvancedFeatures"], label: "Max advanced features", step: 1, min: 0 },
      { path: ["recommendationPolicy", "buildFriendlyCoreCoverageScore"], label: "Friendly Core coverage", step: 0.1 },
      { path: ["recommendationPolicy", "buildFriendlyBuildCompetitiveIndex"], label: "Friendly Build index", step: 0.1 },
      { path: ["recommendationPolicy", "buildFriendlyContextCoverageThreshold"], label: "Friendly Build coverage", step: 0.1 }
    ]
  },
  {
    title: "Confidence thresholds",
    path: ["confidencePolicy"],
    fields: [
      { path: ["confidencePolicy", "levels", "high"], label: "High confidence", step: 1 },
      { path: ["confidencePolicy", "levels", "moderate"], label: "Moderate confidence", step: 1 },
      { path: ["confidencePolicy", "score", "base"], label: "Confidence base", step: 1 },
      { path: ["confidencePolicy", "score", "scoreGapMultiplier"], label: "Score gap multiplier", step: 0.1 },
      { path: ["confidencePolicy", "score", "min"], label: "Confidence min", step: 1 },
      { path: ["confidencePolicy", "score", "max"], label: "Confidence max", step: 1 }
    ]
  }
];

function isPlainObject(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function cloneValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, cloneValue(child)])
    );
  }

  return value;
}

function getValueAtPath(value, path) {
  return path.reduce((current, key) => current?.[key], value);
}

function setValueAtPath(value, path, nextValue) {
  const next = cloneValue(value);
  let cursor = next;

  for (let index = 0; index < path.length - 1; index += 1) {
    cursor = cursor[path[index]];
  }

  cursor[path[path.length - 1]] = nextValue;
  return next;
}

function normalizeCalibrationDraftForPreview(draft) {
  return sanitizeCalibrationDraft(normalizePathFitShares(draft));
}

function buildOverrideDiff(baseValue, currentValue) {
  if (Array.isArray(baseValue) || Array.isArray(currentValue)) {
    const baseJson = JSON.stringify(baseValue);
    const currentJson = JSON.stringify(currentValue);
    return baseJson === currentJson ? undefined : cloneValue(currentValue);
  }

  if (isPlainObject(baseValue) && isPlainObject(currentValue)) {
    const result = {};
    const keys = new Set([...Object.keys(baseValue), ...Object.keys(currentValue)]);

    for (const key of keys) {
      const child = buildOverrideDiff(baseValue[key], currentValue[key]);
      if (child !== undefined) {
        result[key] = child;
      }
    }

    return Object.keys(result).length > 0 ? result : undefined;
  }

  if (Object.is(baseValue, currentValue)) {
    return undefined;
  }

  return cloneValue(currentValue);
}

function normalizePathFitShares(calibration) {
  const next = cloneValue(calibration);
  const pathFit = next.pathFitComponentWeights ?? {};

  for (const pathKey of PATH_KEYS) {
    const pathGroup = pathFit[pathKey];

    if (!isPlainObject(pathGroup)) {
      continue;
    }

    for (const groupKey of ["positiveSignals", "dragSignals"]) {
      const group = pathGroup[groupKey];

      if (!isPlainObject(group)) {
        continue;
      }

      const entries = Object.entries(group);
      const total = entries.reduce((sum, [, config]) => sum + (Number(config?.share) || 0), 0);

      if (!(total > 0)) {
        continue;
      }

      for (const [signalKey, config] of entries) {
        if (!isPlainObject(config)) {
          continue;
        }

        group[signalKey] = {
          ...config,
          share: (Number(config.share) || 0) / total
        };
      }
    }
  }

  next.pathFitComponentWeights = pathFit;
  return next;
}

function sanitizeCalibrationDraft(calibration) {
  let next = cloneValue(calibration);

  for (const section of inputScaleSections) {
    const mapValue = getValueAtPath(next, section.path);

    if (!isPlainObject(mapValue)) {
      continue;
    }

    for (const key of Object.keys(mapValue)) {
      mapValue[key] = toFiniteNumber(mapValue[key]);
    }
  }

  for (const section of derivedFactorSections) {
    const weights = next.derivedFactorWeights?.[section.key];

    if (!isPlainObject(weights)) {
      continue;
    }

    for (const key of Object.keys(weights)) {
      weights[key] = toFiniteNumber(weights[key]);
    }
  }

  for (const group of policyGroups) {
    for (const field of group.fields) {
      if (field.readOnly) {
        continue;
      }

      const value = getValueAtPath(next, field.path);
      next = setValueAtPath(next, field.path, toFiniteNumber(value));
    }
  }

  for (const pathKey of PATH_KEYS) {
    const pathConfig = next.pathFitComponentWeights?.[pathKey];

    if (!isPlainObject(pathConfig)) {
      continue;
    }

    pathConfig.baseScore = toFiniteNumber(pathConfig.baseScore);
    pathConfig.positiveBudget = toFiniteNumber(pathConfig.positiveBudget);
    pathConfig.dragBudget = toFiniteNumber(pathConfig.dragBudget);

    for (const groupKey of ["positiveSignals", "dragSignals"]) {
      const group = pathConfig[groupKey];

      if (!isPlainObject(group)) {
        continue;
      }

      for (const signalKey of Object.keys(group)) {
        const signal = group[signalKey];

        if (!isPlainObject(signal)) {
          continue;
        }

        signal.share = toFiniteNumber(signal.share);
      }
    }
  }

  return next;
}

function formatPercent(value) {
  if (!Number.isFinite(value)) {
    return "N/A";
  }

  return `${(value * 100).toFixed(1)}%`;
}

function toFiniteNumber(rawValue, fallback = 0) {
  const parsed = Number(rawValue);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function FieldGroup({ title, description, fields, draft, onChange }) {
  return (
    <Card elevation={0} sx={{ border: 1, borderColor: "divider", height: "100%" }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="h6" component="h3">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Stack>
          <Grid container spacing={1.5}>
            {fields.map((field) => {
              const value = getValueAtPath(draft, field.path);

              return (
                <Grid key={field.path.join(".")} size={{ xs: 12, sm: 6 }}>
                  <CalibrationNumberField
                    label={field.label}
                    value={typeof value === "boolean" ? (value ? 1 : 0) : value ?? ""}
                    helperText={field.readOnly ? "Read-only numeric policy flag." : field.helperText}
                    step={field.step}
                    min={field.min}
                    max={field.max}
                    readOnly={Boolean(field.readOnly)}
                    onChange={
                      field.readOnly
                        ? undefined
                        : (event) => {
                            const raw = event.target.value;
                            const nextValue = raw === "" ? 0 : toFiniteNumber(raw);
                            onChange(field.path, nextValue);
                          }
                    }
                  />
                </Grid>
              );
            })}
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
}

function MapEditor({ title, description, value, onChange, helper }) {
  const entries = Object.entries(value ?? {});

  return (
    <Card elevation={0} sx={{ border: 1, borderColor: "divider", height: "100%" }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="h6" component="h3">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Stack>
          <Grid container spacing={1.5}>
            {entries.map(([key, mapValue]) => (
              <Grid key={key} size={{ xs: 12, sm: 6 }}>
                <CalibrationNumberField
                  label={key}
                  value={Number.isFinite(mapValue) ? mapValue : ""}
                  helperText={helper}
                  step={0.01}
                  min={0}
                  max={1}
                  onChange={(event) => {
                    const raw = event.target.value;
                    const nextValue = raw === "" ? 0 : toFiniteNumber(raw);
                    onChange(key, nextValue);
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
}

function AdminCalibrationPage() {
  const [persistedOverrides, setPersistedOverrides] = useState(() => readCalibrationOverrides());
  const [draft, setDraft] = useState(() => mergeCalibrationDraft(persistedOverrides));
  const [jsonValue, setJsonValue] = useState(() =>
    persistedOverrides ? exportCalibrationOverrides(persistedOverrides) : ""
  );
  const [status, setStatus] = useState(null);
  const [statusDetails, setStatusDetails] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const currentOverrideDiff = buildOverrideDiff(DEFAULT_CALIBRATION, draft) ?? {};
  const previewOverrideDiff =
    buildOverrideDiff(DEFAULT_CALIBRATION, normalizeCalibrationDraftForPreview(draft)) ?? {};
  const activeOverridePaths = getCalibrationOverridePaths(persistedOverrides);
  const activeOverrideCount = activeOverridePaths.length;

  const setNestedValue = (path, nextValue) => {
    setDraft((current) => setValueAtPath(current, path, nextValue));
    setHasUnsavedChanges(true);
  };

  const setMapEntry = (path, key, nextValue) => {
    setDraft((current) => {
      const currentMap = getValueAtPath(current, path) ?? {};
      return setValueAtPath(current, path, {
        ...currentMap,
        [key]: nextValue
      });
    });
    setHasUnsavedChanges(true);
  };

  const setPathShare = (pathKey, groupKey, signalKey, rawValue) => {
    setDraft((current) => {
      const next = cloneValue(current);
      const signalGroup = next.pathFitComponentWeights?.[pathKey]?.[groupKey];

      if (!isPlainObject(signalGroup) || !isPlainObject(signalGroup[signalKey])) {
        return current;
      }

      signalGroup[signalKey] = {
        ...signalGroup[signalKey],
        share: rawValue === "" ? 0 : toFiniteNumber(rawValue) / 100
      };

      return next;
    });
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    const normalized = sanitizeCalibrationDraft(normalizePathFitShares(draft));
    const overrides = buildOverrideDiff(DEFAULT_CALIBRATION, normalized) ?? {};
    const validation = validateCalibrationOverrides(overrides, DEFAULT_CALIBRATION);

    if (!validation.valid) {
      setStatus("error");
      setStatusDetails(validation.errors.join(" "));
      return;
    }

    if (Object.keys(overrides).length === 0) {
      clearCalibrationOverrides();
      setPersistedOverrides(null);
      setDraft(cloneValue(DEFAULT_CALIBRATION));
      setJsonValue("");
      setHasUnsavedChanges(false);
      setStatus("success");
      setStatusDetails("Local calibration overrides cleared because the draft matches defaults.");
      return;
    }

    writeCalibrationOverrides(overrides);
    setPersistedOverrides(overrides);
    setDraft(mergeCalibrationDraft(overrides));
    setJsonValue(exportCalibrationOverrides(overrides));
    setHasUnsavedChanges(false);
    setStatus("success");
    setStatusDetails(
      `Saved locally. ${getCalibrationOverridePaths(overrides).length} override path(s) are active.`
    );
  };

  const handleReset = () => {
    setDraft(cloneValue(DEFAULT_CALIBRATION));
    setJsonValue("");
    setHasUnsavedChanges(false);
    setStatus("info");
    setStatusDetails("Draft reset to the built-in defaults.");
  };

  const handleClear = () => {
    clearCalibrationOverrides();
    setPersistedOverrides(null);
    setDraft(cloneValue(DEFAULT_CALIBRATION));
    setJsonValue("");
    setHasUnsavedChanges(false);
    setStatus("info");
    setStatusDetails("Local overrides cleared from storage.");
  };

  const handleExport = () => {
    const exported = exportCalibrationOverrides(currentOverrideDiff);
    setJsonValue(exported);
    setStatus("info");
    setStatusDetails("Exported the current draft overrides into the JSON panel.");

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(exported);
    }
  };

  const handleImport = () => {
    try {
      const imported = importCalibrationOverrides(jsonValue);

      if (!imported.valid) {
        setStatus("error");
        setStatusDetails(imported.errors.join(" "));
        return;
      }

      const mergedDraft = sanitizeCalibrationDraft(mergeCalibrationDraft(imported.overrides));
      setDraft(mergedDraft);
      setHasUnsavedChanges(true);
      setStatus("success");
      setStatusDetails("Imported overrides into the draft. Save locally to persist them.");
    } catch {
      setStatus("error");
      setStatusDetails("Import failed because the JSON could not be parsed.");
    }
  };

  return (
    <Stack spacing={4}>
      <PageHero
        eyebrow="Admin"
        title="Edit local calibration overrides"
        description="This interface edits deterministic calibration values only in your local browser storage. No auth is required, and nothing is persisted server-side."
        chips={[
          "LocalStorage overrides",
          "Deterministic fit calibration",
          `Active override paths: ${activeOverrideCount}`
        ]}
      />

      {status ? (
        <Alert severity={status} variant="outlined">
          {statusDetails}
        </Alert>
      ) : null}

      <CalibrationSectionCard
        title="Calibration preview"
        description="Compare the built-in defaults with the current draft overrides against deterministic golden scenarios."
      >
        <CalibrationPreview
          calibrationOverrides={
            Object.keys(previewOverrideDiff).length > 0 ? previewOverrideDiff : null
          }
        />
      </CalibrationSectionCard>

      <CalibrationSectionCard
        title="Overview"
        description="Check the current local state before editing or exporting calibration changes."
        action={
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button variant="outlined" onClick={handleExport}>
              Export JSON
            </Button>
            <Button variant="outlined" onClick={handleImport}>
              Import JSON
            </Button>
            <Button variant="outlined" onClick={handleReset}>
              Reset to defaults
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save locally
            </Button>
          </Stack>
        }
      >
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              color={persistedOverrides ? "warning" : "default"}
              label={persistedOverrides ? "Custom calibration stored" : "Using defaults"}
            />
            <Chip label={`Override paths: ${activeOverrideCount}`} variant="outlined" />
            <Chip label={hasUnsavedChanges ? "Unsaved draft changes" : "Draft matches saved state"} variant="outlined" />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Storage key: <Box component="span" sx={{ fontFamily: "monospace" }}>calibrationOverrides</Box>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            When shares are saved, they are normalized so each positive and drag group sums to 100%.
          </Typography>
        </Stack>
      </CalibrationSectionCard>

      <CalibrationSectionCard
        title="Input scales"
        description="Edit the normalized maps that feed the deterministic factor calculations."
      >
        <Grid container spacing={2.5}>
          {inputScaleSections.map((section) => {
            const mapValue = getValueAtPath(draft, section.path);

            return (
              <Grid key={section.title} size={{ xs: 12, md: 6 }}>
                <MapEditor
                  title={section.title}
                  description={section.description}
                  value={mapValue}
                  helper={section.helper}
                  onChange={(key, nextValue) => setMapEntry(section.path, key, nextValue)}
                />
              </Grid>
            );
          })}
        </Grid>
      </CalibrationSectionCard>

      <CalibrationSectionCard
        title="Derived factor weights"
        description="Edit the numeric weights that shape the derived factors used by the simulator."
      >
        <Grid container spacing={2.5}>
          {derivedFactorSections.map((section) => {
            const weights = draft.derivedFactorWeights?.[section.key] ?? {};
            const fieldEntries = Object.entries(weights);

            return (
              <Grid key={section.key} size={{ xs: 12, md: 6 }}>
                <Card elevation={0} sx={{ border: 1, borderColor: "divider", height: "100%" }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack spacing={0.5}>
                        <Typography variant="h6" component="h3">
                          {section.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {section.description}
                        </Typography>
                      </Stack>
                      <Grid container spacing={1.5}>
                        {fieldEntries.map(([fieldKey, fieldValue]) => (
                          <Grid key={fieldKey} size={{ xs: 12, sm: 6 }}>
                            <CalibrationNumberField
                              label={fieldKey}
                              value={fieldValue ?? ""}
                              step={0.1}
                              onChange={(event) => {
                                const raw = event.target.value;
                                const nextValue = raw === "" ? 0 : toFiniteNumber(raw);
                                setDraft((current) =>
                                  setValueAtPath(
                                    current,
                                    ["derivedFactorWeights", section.key, fieldKey],
                                    nextValue
                                  )
                                );
                                setHasUnsavedChanges(true);
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </CalibrationSectionCard>

      <CalibrationSectionCard
        title="Plan fit budgets and shares"
        description="Tune the budgets and signal shares for each path. Shares are stored as decimals and shown as percentages."
      >
        <Grid container spacing={2.5}>
          {PATH_KEYS.map((pathKey) => {
            const pathConfig = draft.pathFitComponentWeights?.[pathKey];

            if (!pathConfig) {
              return null;
            }

            return (
              <Grid key={pathKey} size={{ xs: 12 }}>
                <Card elevation={0} sx={{ border: 1, borderColor: "divider" }}>
                  <CardContent>
                    <Stack spacing={2.5}>
                      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" component="h3">
                            {pathKey === "build"
                              ? "Build"
                              : pathKey === "core"
                                ? "Core"
                                : pathKey === "premium"
                                  ? "Premium"
                                  : "Enterprise"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Base score and budget controls for this path.
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          <CalibrationNumberField
                            label="Base score"
                            value={pathConfig.baseScore ?? ""}
                            step={0.1}
                            onChange={(event) => {
                              const raw = event.target.value;
                              const nextValue = raw === "" ? 0 : toFiniteNumber(raw);
                              setNestedValue(["pathFitComponentWeights", pathKey, "baseScore"], nextValue);
                            }}
                          />
                          <CalibrationNumberField
                            label="Positive budget"
                            value={pathConfig.positiveBudget ?? ""}
                            step={0.1}
                            onChange={(event) => {
                              const raw = event.target.value;
                              const nextValue = raw === "" ? 0 : toFiniteNumber(raw);
                              setNestedValue(["pathFitComponentWeights", pathKey, "positiveBudget"], nextValue);
                            }}
                          />
                          <CalibrationNumberField
                            label="Drag budget"
                            value={pathConfig.dragBudget ?? ""}
                            step={0.1}
                            onChange={(event) => {
                              const raw = event.target.value;
                              const nextValue = raw === "" ? 0 : toFiniteNumber(raw);
                              setNestedValue(["pathFitComponentWeights", pathKey, "dragBudget"], nextValue);
                            }}
                          />
                        </Stack>
                      </Stack>

                      <PathFitSignalTable
                        pathLabel={
                          pathKey === "build"
                            ? "Build"
                            : pathKey === "core"
                              ? "Core"
                              : pathKey === "premium"
                                ? "Premium"
                                : "Enterprise"
                        }
                        pathKey={pathKey}
                        pathConfig={pathConfig}
                        value={pathConfig}
                        onShareChange={setPathShare}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </CalibrationSectionCard>

      <CalibrationSectionCard
        title="Policies and thresholds"
        description="Adjust the deterministic thresholds that gate fit scoring and recommendation confidence."
      >
        <Stack spacing={2.5}>
          {policyGroups.map((group) => (
            <FieldGroup
              key={group.title}
              title={group.title}
              description="Threshold values used by the recommendation engine."
              fields={group.fields}
              draft={draft}
              onChange={setNestedValue}
            />
          ))}
          <Typography variant="body2" color="text.secondary">
            The remaining contextual labels in these policies stay fixed in the editor because they are categorical guardrails rather than calibrated thresholds.
          </Typography>
        </Stack>
      </CalibrationSectionCard>

      <CalibrationSectionCard
        title="Import / export"
        description="Use this box to move the current override JSON in and out of local storage."
        action={
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button variant="outlined" onClick={handleExport}>
              Export JSON
            </Button>
            <Button variant="outlined" onClick={handleImport}>
              Import JSON
            </Button>
            <Button variant="outlined" onClick={handleClear}>
              Clear local overrides
            </Button>
          </Stack>
        }
      >
        <Stack spacing={2}>
          <TextField
            label="Overrides JSON"
            value={jsonValue}
            onChange={(event) => {
              setJsonValue(event.target.value);
              setHasUnsavedChanges(true);
            }}
            multiline
            minRows={12}
            fullWidth
            helperText="Paste override JSON here, then import or save locally."
          />
          <Divider />
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button variant="contained" onClick={handleSave}>
              Save locally
            </Button>
            <Button variant="outlined" onClick={handleReset}>
              Reset to defaults
            </Button>
            <Button variant="outlined" onClick={handleClear}>
              Clear local overrides
            </Button>
          </Stack>
        </Stack>
      </CalibrationSectionCard>
    </Stack>
  );
}

export default AdminCalibrationPage;
