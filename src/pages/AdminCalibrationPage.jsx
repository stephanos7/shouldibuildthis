import { useState } from "react";
import { Alert, Button, Chip, Grid, Stack, TextField, Typography } from "@mui/material";
import PageHero from "../components/PageHero.jsx";
import CalibrationSectionCard from "../components/admin/CalibrationSectionCard.jsx";
import InputScaleEditor from "../components/admin/InputScaleEditor.jsx";
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
import {
  INPUT_CALIBRATION_REGISTRY,
  INPUT_SCALE_TYPES
} from "../model/inputCalibrationRegistry.js";
import { validateBusinessCalibrationProfile } from "../model/businessCalibrationCompiler.js";

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

  const validation = validateBusinessCalibrationProfile(draft, DEFAULT_CALIBRATION);
  const registryEntries = Object.entries(INPUT_CALIBRATION_REGISTRY);
  const orderedInputCount = registryEntries.filter(([, config]) => config.scaleType === INPUT_SCALE_TYPES.ordered).length;
  const placeholderCount = registryEntries.length - orderedInputCount;
  const canSave = validation.valid;

  const setStatusMessage = (severity, message) => {
    setStatus({ severity, message });
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
        ? "Saved locally. Compiled calibration overrides are active."
        : "Saved locally. No compiled overrides were needed."
    );
  };

  const handleResetInputScales = () => {
    const nextDraft = mergeBusinessCalibrationProfile({
      ...draft,
      inputScales: DEFAULT_BUSINESS_CALIBRATION_PROFILE.inputScales
    });

    setDraft(nextDraft);
    setJsonValue(exportBusinessCalibrationProfile(nextDraft));
    setStatusMessage("info", "Input scales reset to the built-in defaults.");
  };

  const handleResetAllCalibration = () => {
    clearBusinessCalibrationProfile();

    const nextDraft = mergeBusinessCalibrationProfile(DEFAULT_BUSINESS_CALIBRATION_PROFILE);
    setDraft(nextDraft);
    setJsonValue(exportBusinessCalibrationProfile(nextDraft));
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

    setDraft(imported.profile);
    setJsonValue(exportBusinessCalibrationProfile(imported.profile));
    setStatusMessage("success", "Imported profile JSON into the draft.");
  };

  return (
    <Stack spacing={4}>
      <PageHero
        eyebrow="Admin"
        title="Calibration admin"
        description="Edit local business calibration profile data with ordered input scales. No auth is required, and changes stay in browser storage."
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
        title="Calibration admin"
        description="Use the JSON editor for import/export and save the local business calibration profile back into browser storage."
        action={
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ flexWrap: "wrap" }}>
            <Button variant="outlined" onClick={handleExportProfile}>
              Export profile JSON
            </Button>
            <Button variant="outlined" onClick={handleImportProfile}>
              Import profile JSON
            </Button>
            <Button variant="outlined" onClick={handleResetInputScales}>
              Reset input scales
            </Button>
            <Button variant="outlined" onClick={handleResetAllCalibration}>
              Reset all calibration
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={!canSave}>
              Save
            </Button>
          </Stack>
        }
      >
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              label={`Ordered inputs: ${orderedInputCount}`}
              variant="outlined"
            />
            <Chip
              label={`Placeholders: ${placeholderCount}`}
              variant="outlined"
            />
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

      <CalibrationSectionCard
        title="Input scales"
        description="Ordered inputs use marked sliders. Categorical and numeric inputs are shown as placeholders for a later PR."
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
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
          Ordered input editor count: {orderedInputCount}. Non-ordered placeholders: {placeholderCount}.
        </Typography>
      </CalibrationSectionCard>
    </Stack>
  );
}

export default AdminCalibrationPage;
