import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Grid,
  Stack,
  Typography
} from "@mui/material";
import { CALIBRATION_SCENARIOS } from "../../data/calibrationScenarios.js";
import { BUSINESS_CALIBRATION_PATH_LABELS, BUSINESS_CALIBRATION_PATH_ORDER } from "../../model/businessCalibrationDefaults.js";
import { validateScenarioPreviewResult } from "../../model/businessCalibrationValidation.js";
import ScenarioResultCard from "./ScenarioResultCard.jsx";

function formatScore(value) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  const rounded = Math.abs(value) < 0.05 ? 0 : value;
  return `${rounded >= 0 ? "+" : "-"}${Math.abs(rounded).toFixed(1)}`;
}

async function runSimulation(payload, calibrationOverrides) {
  const requestBody =
    calibrationOverrides && Object.keys(calibrationOverrides).length > 0
      ? { ...payload, calibrationOverrides }
      : payload;

  const response = await fetch("/.netlify/functions/simulate", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  let body = null;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const details = Array.isArray(body?.details) ? ` ${body.details.join(" ")}` : "";
    throw new Error(body?.error ?? `Simulation failed with status ${response.status}.${details}`);
  }

  return body;
}

function buildPathDeltaRows(defaultResult, customResult) {
  return BUSINESS_CALIBRATION_PATH_ORDER.map((pathKey) => ({
    key: pathKey,
    label: BUSINESS_CALIBRATION_PATH_LABELS[pathKey] ?? pathKey,
    defaultScore: defaultResult?.pathFits?.[pathKey]?.score,
    customScore: customResult?.pathFits?.[pathKey]?.score,
    delta:
      (customResult?.pathFits?.[pathKey]?.score ?? NaN) -
      (defaultResult?.pathFits?.[pathKey]?.score ?? NaN)
  }));
}

function buildScenarioResult(scenario, defaultResult, customResult) {
  const resultValidation = validateScenarioPreviewResult({
    scenario,
    defaultResult,
    customResult
  });

  const defaultWarnings = Array.isArray(defaultResult?.diagnostics)
    ? defaultResult.diagnostics.filter((entry) => entry?.level === "warning")
    : [];
  const customWarnings = Array.isArray(customResult?.diagnostics)
    ? customResult.diagnostics.filter((entry) => entry?.level === "warning")
    : [];
  const warnings = [...new Set([...defaultWarnings, ...customWarnings].map((entry) => entry.message))];
  const defaultInfo = Array.isArray(defaultResult?.diagnostics)
    ? defaultResult.diagnostics.filter((entry) => entry?.level === "info")
    : [];
  const customInfo = Array.isArray(customResult?.diagnostics)
    ? customResult.diagnostics.filter((entry) => entry?.level === "info")
    : [];
  const info = [...new Set([...defaultInfo, ...customInfo].map((entry) => entry.message))];
  const defaultErrors = Array.isArray(defaultResult?.diagnostics)
    ? defaultResult.diagnostics.filter((entry) => entry?.level === "error")
    : [];
  const customErrors = Array.isArray(customResult?.diagnostics)
    ? customResult.diagnostics.filter((entry) => entry?.level === "error")
    : [];
  const errors = [...new Set([...defaultErrors, ...customErrors].map((entry) => entry.message))];
  const winnerChanged = defaultResult?.recommendation?.key !== customResult?.recommendation?.key;
  const marginDelta =
    (customResult?.recommendation?.runnerUp?.scoreGap ?? NaN) -
    (defaultResult?.recommendation?.runnerUp?.scoreGap ?? NaN);
  const confidenceDelta =
    (customResult?.confidence?.score ?? NaN) - (defaultResult?.confidence?.score ?? NaN);
  const deltaRows = buildPathDeltaRows(defaultResult, customResult);

  return {
    key: scenario.key,
    label: scenario.label,
    description: scenario.description,
    status: resultValidation.valid && errors.length === 0 ? "success" : "error",
    defaultResult,
    customResult,
    winnerChanged,
    marginDelta,
    confidenceDelta,
    warnings,
    info,
    errors: [...errors, ...resultValidation.errors],
    errorText: resultValidation.valid
      ? errors[0] ?? ""
      : resultValidation.errors[0] ?? errors[0] ?? "Scenario validation failed.",
    deltaRows
  };
}

function CalibrationScenarioPreview({ calibrationOverrides, validation }) {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [lastRunLabel, setLastRunLabel] = useState("");

  const canRun = validation?.valid ?? false;
  const disabledReason = canRun
    ? ""
    : "Resolve blocking validation errors before running the preview.";

  const summary = useMemo(() => {
    const successfulResults = results.filter((result) => result.status === "success");
    const changedCount = successfulResults.filter((result) => result.winnerChanged).length;
    const warningsCount = successfulResults.reduce((count, result) => count + result.warnings.length, 0);
    let largestMovement = null;

    for (const result of successfulResults) {
      for (const row of result.deltaRows) {
        const delta = Number(row.delta);

        if (!Number.isFinite(delta)) {
          continue;
        }

        if (!largestMovement || Math.abs(delta) > Math.abs(largestMovement.delta)) {
          largestMovement = {
            label: row.label,
            delta
          };
        }
      }
    }

    return {
      changedCount,
      warningsCount,
      largestMovement
    };
  }, [results]);

  const handleRun = async () => {
    if (!canRun) {
      setError(disabledReason);
      return;
    }

    setIsRunning(true);
    setError("");

    try {
      const settled = await Promise.all(
        CALIBRATION_SCENARIOS.map(async (scenario) => {
          const [defaultRun, customRun] = await Promise.allSettled([
            runSimulation(scenario.payload),
            runSimulation(scenario.payload, calibrationOverrides)
          ]);

          if (defaultRun.status !== "fulfilled") {
            return {
              key: scenario.key,
              label: scenario.label,
              description: scenario.description,
              status: "error",
              errorText: defaultRun.reason instanceof Error ? defaultRun.reason.message : "Default run failed."
            };
          }

          if (customRun.status !== "fulfilled") {
            return {
              key: scenario.key,
              label: scenario.label,
              description: scenario.description,
              status: "error",
              errorText: customRun.reason instanceof Error ? customRun.reason.message : "Custom run failed."
            };
          }

          return buildScenarioResult(scenario, defaultRun.value, customRun.value);
        })
      );

      setResults(settled);
      setLastRunLabel(new Date().toLocaleString());
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : "Unable to run calibration preview.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={0} sx={{ border: 1, borderColor: "divider", height: "100%" }}>
            <CardContent sx={{ p: { xs: 2.25, md: 2.75 } }}>
              <Stack spacing={0.75}>
                <Chip label="Scenario coverage" variant="outlined" size="small" sx={{ alignSelf: "flex-start" }} />
                <Typography variant="body2" color="text.secondary">
                  Scenarios changed
                </Typography>
                <Typography variant="h4" component="p">
                  {summary.changedCount} of {CALIBRATION_SCENARIOS.length}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={0} sx={{ border: 1, borderColor: "divider", height: "100%" }}>
            <CardContent sx={{ p: { xs: 2.25, md: 2.75 } }}>
              <Stack spacing={0.75}>
                <Chip label="Largest movement" variant="outlined" size="small" sx={{ alignSelf: "flex-start" }} />
                <Typography variant="body2" color="text.secondary">
                  Biggest path score shift
                </Typography>
                <Typography variant="h4" component="p">
                  {summary.largestMovement
                    ? `${summary.largestMovement.label} ${formatScore(summary.largestMovement.delta)}`
                    : "—"}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={0} sx={{ border: 1, borderColor: "divider", height: "100%" }}>
            <CardContent sx={{ p: { xs: 2.25, md: 2.75 } }}>
              <Stack spacing={0.75}>
                <Chip label="Diagnostics" variant="outlined" size="small" sx={{ alignSelf: "flex-start" }} />
                <Typography variant="body2" color="text.secondary">
                  Preview warnings
                </Typography>
                <Typography variant="h4" component="p">
                  {summary.warningsCount}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card elevation={0} sx={{ border: 1, borderColor: "divider" }}>
        <CardContent sx={{ p: { xs: 2.5, md: 3.25 } }}>
          <Stack spacing={2.25}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Stack spacing={0.5}>
                <Typography variant="h6" component="h2">
                  Calibration scenario preview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Run the built-in scenarios only when you are ready to compare the default calibration against the current compiled overrides.
                </Typography>
              </Stack>
              <Button
                variant="contained"
                onClick={handleRun}
                disabled={isRunning || !canRun}
                startIcon={isRunning ? <CircularProgress size={16} color="inherit" /> : null}
              >
                {isRunning ? "Running preview..." : "Run preview"}
              </Button>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={`Scenarios: ${CALIBRATION_SCENARIOS.length}`} variant="outlined" />
              <Chip
                label={`Scenarios changed: ${summary.changedCount} of ${CALIBRATION_SCENARIOS.length}`}
                color={summary.changedCount > 0 ? "warning" : "default"}
                variant="outlined"
              />
              <Chip
                label={
                  summary.largestMovement
                    ? `Largest score movement: ${summary.largestMovement.label} ${formatScore(
                        summary.largestMovement.delta
                      )}`
                    : "Largest score movement: —"
                }
                variant="outlined"
              />
              <Chip
                label={`Warnings: ${summary.warningsCount}`}
                color={summary.warningsCount > 0 ? "warning" : "default"}
                variant="outlined"
              />
              <Chip label={lastRunLabel ? `Last run: ${lastRunLabel}` : "Not run yet"} variant="outlined" />
            </Stack>

            {error ? <Alert severity="error" variant="outlined">{error}</Alert> : null}
            {!canRun ? <Alert severity="error" variant="outlined">{disabledReason}</Alert> : null}
            {isRunning ? <Box sx={{ minHeight: 4 }}><Typography variant="body2">Running preview...</Typography></Box> : null}
          </Stack>
        </CardContent>
      </Card>

      {results.length === 0 ? (
        <Alert severity="info" variant="outlined">
          Run the preview to compare the default calibration against the current draft overrides.
        </Alert>
      ) : null}

      <Grid container spacing={2}>
        {results.map((result) => (
          <Grid key={result.key} size={{ xs: 12 }}>
            <ScenarioResultCard
              scenario={{
                key: result.key,
                label: result.label,
                description: result.description
              }}
              result={result}
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

export default CalibrationScenarioPreview;
