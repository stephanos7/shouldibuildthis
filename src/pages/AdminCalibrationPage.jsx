import { useMemo, useState } from "react";
import { Alert, Button, Chip, Grid, Stack, TextField } from "@mui/material";
import PageHero from "../components/PageHero.jsx";
import CalibrationSectionCard from "../components/admin/CalibrationSectionCard.jsx";
import CalibrationScenarioPreview from "../components/admin/CalibrationScenarioPreview.jsx";
import CalibrationValidationPanel from "../components/admin/CalibrationValidationPanel.jsx";
import PathPriorityEditor from "../components/admin/PathPriorityEditor.jsx";
import InputScaleEditor from "../components/admin/InputScaleEditor.jsx";
import InputImpactEditor from "../components/admin/InputImpactEditor.jsx";
import {
  clearBusinessCalibrationProfile,
  exportBusinessCalibrationProfile,
  importBusinessCalibrationProfile,
  mergeBusinessCalibrationProfile,
  readBusinessCalibrationProfile,
  writeBusinessCalibrationProfile
} from "../model/businessCalibrationStorage.js";
import { DEFAULT_BUSINESS_CALIBRATION_PROFILE } from "../model/businessCalibrationDefaults.js";
import { DEFAULT_CALIBRATION } from "../model/calibration.js";
import { validateBusinessCalibrationPreview } from "../model/businessCalibrationValidation.js";
import {
  INPUT_CALIBRATION_REGISTRY,
  INPUT_SCALE_TYPES
} from "../model/inputCalibrationRegistry.js";

function loadInitialDraft() {
  const storedProfile = readBusinessCalibrationProfile();
  return mergeBusinessCalibrationProfile(storedProfile ?? DEFAULT_BUSINESS_CALIBRATION_PROFILE);
}

function formatDiagnostics(diagnostics) {
  return diagnostics.map((diagnostic) => diagnostic.message).join(" ");
}

function AdminCalibrationPage() {
  const [draft, setDraft] = useState(() => loadInitialDraft());
  const [jsonValue, setJsonValue] = useState(() =>
    exportBusinessCalibrationProfile(loadInitialDraft())
  );
  const [status, setStatus] = useState(null);

  const validation = useMemo(
    () => validateBusinessCalibrationPreview(draft, { baseCalibration: DEFAULT_CALIBRATION }),
    [draft]
  );
  const registryEntries = Object.entries(INPUT_CALIBRATION_REGISTRY);
  const orderedInputCount = registryEntries.filter(
    ([, config]) => config.scaleType === INPUT_SCALE_TYPES.ordered
  ).length;
  const placeholderCount = registryEntries.length - orderedInputCount;
  const canSave = validation.valid;

  const setStatusMessage = (severity, message) => {
    setStatus({ severity, message });
  };

  const syncDraft = (nextDraft) => {
    setDraft(nextDraft);
    setJsonValue(exportBusinessCalibrationProfile(nextDraft));
  };

  const handleInputScaleChange = (inputKey, nextScale) => {
    setDraft((currentDraft) => {
      const nextDraft = {
        ...currentDraft,
        inputScales: {
          ...(currentDraft.inputScales ?? {}),
          [inputKey]: {
            ...(currentDraft.inputScales?.[inputKey] ?? {}),
            ...nextScale
          }
        }
      };

      setJsonValue(exportBusinessCalibrationProfile(nextDraft));
      return nextDraft;
    });
    setStatus(null);
  };

  const handleInputImpactChange = (inputKey, outcomeKey, nextRoutePatch) => {
    setDraft((currentDraft) => {
      const currentRoute = currentDraft.inputImpacts?.[inputKey]?.[outcomeKey] ?? {
        direction: "none",
        strength: 0
      };
      const nextDirection = nextRoutePatch.direction ?? currentRoute.direction;
      const rawStrength = nextRoutePatch.strength ?? currentRoute.strength;
      const nextStrength = nextDirection === "none" ? 0 : Math.min(100, Math.max(0, Number(rawStrength) || 0));
      const resolvedDirection =
        nextRoutePatch.direction
          ? nextDirection
          : nextStrength > 0 && currentRoute.direction === "none"
            ? "positive"
            : currentRoute.direction;

      const nextDraft = {
        ...currentDraft,
        inputImpacts: {
          ...(currentDraft.inputImpacts ?? {}),
          [inputKey]: {
            ...(currentDraft.inputImpacts?.[inputKey] ?? {}),
            [outcomeKey]: {
              direction: resolvedDirection === "none" ? "none" : resolvedDirection,
              strength: resolvedDirection === "none" ? 0 : nextStrength
            }
          }
        }
      };

      setJsonValue(exportBusinessCalibrationProfile(nextDraft));
      return nextDraft;
    });
    setStatus(null);
  };

  const handlePathPriorityChange = (pathKey, groupKey, nextOrder) => {
    setDraft((currentDraft) => {
      const nextDraft = {
        ...currentDraft,
        pathPriorities: {
          ...(currentDraft.pathPriorities ?? {}),
          [pathKey]: {
            ...(currentDraft.pathPriorities?.[pathKey] ?? {}),
            [groupKey]: nextOrder
          }
        }
      };

      setJsonValue(exportBusinessCalibrationProfile(nextDraft));
      return nextDraft;
    });
    setStatus(null);
  };

  const handleSave = () => {
    if (!validation.valid) {
      setStatusMessage("error", validation.errors.join(" "));
      return;
    }

    const result = writeBusinessCalibrationProfile(draft);

    if (!result.valid) {
      setStatusMessage("error", formatDiagnostics(result.diagnostics));
      return;
    }

    setJsonValue(exportBusinessCalibrationProfile(draft));
    setStatusMessage(
      "success",
      result.calibrationOverrides
        ? "Saved locally. Compiled calibration overrides are active for assessment submission."
        : "Saved locally. No compiled overrides were needed."
    );
  };

  const handleResetInputScales = () => {
    const nextDraft = mergeBusinessCalibrationProfile({
      ...draft,
      inputScales: DEFAULT_BUSINESS_CALIBRATION_PROFILE.inputScales
    });

    syncDraft(nextDraft);
    setStatusMessage("info", "Input scales reset to the built-in defaults.");
  };

  const handleResetInputImpacts = (inputKey) => {
    const nextDraft = mergeBusinessCalibrationProfile({
      ...draft,
      inputImpacts: {
        ...(draft.inputImpacts ?? {}),
        [inputKey]: DEFAULT_BUSINESS_CALIBRATION_PROFILE.inputImpacts[inputKey]
      }
    });

    syncDraft(nextDraft);
    setStatusMessage("info", `Reset ${INPUT_CALIBRATION_REGISTRY[inputKey]?.label ?? inputKey} to the built-in defaults.`);
  };

  const handleResetAllInputImpacts = () => {
    const nextDraft = mergeBusinessCalibrationProfile({
      ...draft,
      inputImpacts: DEFAULT_BUSINESS_CALIBRATION_PROFILE.inputImpacts
    });

    syncDraft(nextDraft);
    setStatusMessage("info", "All input impacts reset to the built-in defaults.");
  };

  const handleResetAllCalibration = () => {
    clearBusinessCalibrationProfile();

    const nextDraft = mergeBusinessCalibrationProfile(DEFAULT_BUSINESS_CALIBRATION_PROFILE);
    syncDraft(nextDraft);
    setStatusMessage("info", "All calibration state reset to the built-in defaults.");
  };

  const handleExportProfile = () => {
    const exported = exportBusinessCalibrationProfile(draft);
    setJsonValue(exported);
    setStatusMessage("info", "Exported the current profile JSON into the editor.");

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(exported);
    }
  };

  const handleImportProfile = () => {
    const imported = importBusinessCalibrationProfile(jsonValue);

    if (!imported.valid) {
      setStatusMessage("error", imported.errors.join(" "));
      return;
    }

    if (!imported.profile) {
      setStatusMessage("error", "The imported profile could not be loaded.");
      return;
    }

    syncDraft(imported.profile);
    setStatusMessage("success", "Imported profile JSON into the draft.");
  };

  return (
    <Stack spacing={4}>
      <PageHero
        eyebrow="Admin"
        title="Calibration admin"
        description="Edit local business calibration profile data in browser storage. Input impact routing stays business-facing and compiles into runtime calibration overrides when supported."
        chips={[
          "LocalStorage profile",
          "Compiled overrides on save",
          `Ordered inputs: ${orderedInputCount}`
        ]}
      />

      {status ? (
        <Alert severity={status.severity} variant="outlined">
          {status.message}
        </Alert>
      ) : null}

      <CalibrationSectionCard
        title="Profile tools"
        description="Save, reset, export, and import the local business calibration profile. JSON stays available for portability, but the primary editor uses business-facing controls."
        action={
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ flexWrap: "wrap" }}>
            <Button variant="outlined" onClick={handleExportProfile}>
              Export profile JSON
            </Button>
            <Button variant="outlined" onClick={handleImportProfile}>
              Import profile JSON
            </Button>
            <Button variant="outlined" onClick={handleResetAllCalibration}>
              Reset all calibration
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={!canSave}>
              Save changes
            </Button>
          </Stack>
        }
      >
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label={`Ordered inputs: ${orderedInputCount}`} variant="outlined" />
            <Chip label={`Placeholders: ${placeholderCount}`} variant="outlined" />
            <Chip
              label={validation.valid ? "Draft valid" : "Draft has blocking errors"}
              color={validation.valid ? "success" : "error"}
            />
          </Stack>

          {validation.errors.length > 0 ? (
            <Alert severity="error" variant="outlined">
              Resolve the blocking profile issues before saving.
            </Alert>
          ) : (
            <Alert severity="success" variant="outlined">
              The current business calibration profile is valid.
            </Alert>
          )}

          <TextField
            label="Profile JSON"
            value={jsonValue}
            onChange={(event) => setJsonValue(event.target.value)}
            multiline
            minRows={10}
            fullWidth
            helperText="Paste exported profile JSON here, then import it or save the current draft."
          />
        </Stack>
      </CalibrationSectionCard>

      <CalibrationValidationPanel validation={validation} />

      <CalibrationScenarioPreview
        calibrationOverrides={validation.compiledOverrides}
        validation={validation}
      />

      <CalibrationSectionCard>
        <InputImpactEditor
          draft={draft}
          defaultProfile={DEFAULT_BUSINESS_CALIBRATION_PROFILE}
          diagnostics={validation.diagnostics}
          routeStatuses={validation.routeStatuses}
          onImpactChange={handleInputImpactChange}
          onResetInput={handleResetInputImpacts}
          onResetAll={handleResetAllInputImpacts}
        />
      </CalibrationSectionCard>

      <CalibrationSectionCard>
        <PathPriorityEditor
          draft={draft}
          defaultProfile={DEFAULT_BUSINESS_CALIBRATION_PROFILE}
          calibration={DEFAULT_CALIBRATION}
          validationErrors={validation.errors}
          onOrderChange={handlePathPriorityChange}
        />
      </CalibrationSectionCard>

      <CalibrationSectionCard
        title="Input scales"
        description="Ordered inputs use marked sliders. Categorical, numeric, and multi-select inputs keep placeholder scale cards for now."
        action={
          <Button variant="outlined" onClick={handleResetInputScales}>
            Reset input scales
          </Button>
        }
      >
        <Grid container spacing={2.5}>
          {registryEntries.map(([inputKey, config]) => (
            <Grid key={inputKey} size={{ xs: 12, md: 6 }}>
              <InputScaleEditor
                inputKey={inputKey}
                config={config}
                value={draft.inputScales?.[inputKey]}
                onChange={handleInputScaleChange}
              />
            </Grid>
          ))}
        </Grid>
      </CalibrationSectionCard>
    </Stack>
  );
}

export default AdminCalibrationPage;
