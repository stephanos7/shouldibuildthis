import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { GOLDEN_SCENARIOS } from "../../data/goldenScenarios.js";

function formatScore(value) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return value.toFixed(1);
}

function formatSignedDelta(value) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  const rounded = value.toFixed(1);
  return value > 0 ? `+${rounded}` : rounded;
}

function formatRecommendation(recommendation) {
  return recommendation?.option ?? recommendation?.key ?? "—";
}

function formatConfidence(confidence) {
  if (!confidence) {
    return "—";
  }

  const score = Number.isFinite(confidence.score) ? `${confidence.score.toFixed(0)}/100` : "—";
  const level = confidence.level
    ? `${confidence.level[0].toUpperCase()}${confidence.level.slice(1)}`
    : null;

  return level ? `${level} (${score})` : score;
}

function ScoreCell({ before, after, delta }) {
  return (
    <Stack spacing={0.25} sx={{ minWidth: 96 }}>
      <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
        {formatScore(before)} → {formatScore(after)}
      </Typography>
      <Typography variant="caption" color={delta >= 0 ? "success.main" : "error.main"}>
        Δ {formatSignedDelta(delta)}
      </Typography>
    </Stack>
  );
}

async function runScenario(input, calibrationOverrides) {
  const payload =
    calibrationOverrides && Object.keys(calibrationOverrides).length > 0
      ? { ...input, calibrationOverrides }
      : input;

  const response = await fetch("/.netlify/functions/simulate", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
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

function CalibrationPreview({ calibrationOverrides, canRun = true, canRunMessage = "" }) {
  const [rows, setRows] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const [lastRunLabel, setLastRunLabel] = useState("");

  const handleRun = async () => {
    if (!canRun) {
      setRows([]);
      setLastRunLabel("");
      setError(canRunMessage || "Resolve validation issues before running the preview.");
      return;
    }

    setIsRunning(true);
    setError("");

    try {
      const nextRows = await Promise.all(
        GOLDEN_SCENARIOS.map(async (scenario) => {
          const [defaultResult, customResult] = await Promise.all([
            runScenario(scenario.input),
            runScenario(scenario.input, calibrationOverrides)
          ]);

          const defaultRecommendation = defaultResult?.recommendation ?? {};
          const customRecommendation = customResult?.recommendation ?? {};

          return {
            id: scenario.id,
            title: scenario.title,
            description: scenario.description,
            defaultRecommendation,
            customRecommendation,
            defaultPathFits: defaultResult?.pathFits ?? {},
            customPathFits: customResult?.pathFits ?? {},
            defaultConfidence: defaultResult?.confidence ?? {},
            customConfidence: customResult?.confidence ?? {},
            changed: defaultRecommendation.key !== customRecommendation.key
          };
        })
      );

      setRows(nextRows);
      setLastRunLabel(new Date().toLocaleString());
    } catch (previewError) {
      setError(
        previewError instanceof Error
          ? previewError.message
          : "Unable to run calibration preview."
      );
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (!canRun) {
      setRows([]);
      setLastRunLabel("");
      setError(canRunMessage || "Resolve validation issues before running the preview.");
      return;
    }

    void handleRun();
  }, [canRun, canRunMessage]);

  const changedCount = rows.filter((row) => row.changed).length;

  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h6" component="h3">
            Golden scenario preview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Compare the built-in defaults with the current draft overrides before saving them locally.
          </Typography>
        </Stack>
        <Button variant="contained" onClick={handleRun} disabled={isRunning || !canRun}>
          {isRunning ? "Running preview..." : "Run preview"}
        </Button>
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip label={`${GOLDEN_SCENARIOS.length} scenarios`} variant="outlined" />
        <Chip
          label={`${changedCount} changed recommendations`}
          color={changedCount > 0 ? "warning" : "default"}
          variant="outlined"
        />
        <Chip
          label={lastRunLabel ? `Last run: ${lastRunLabel}` : "Not run yet"}
          variant="outlined"
        />
      </Stack>

      {error ? <Alert severity={canRun ? "error" : "warning"} variant="outlined">{error}</Alert> : null}

      {isRunning ? <LinearProgress /> : null}

      <TableContainer component={Paper} variant="outlined" sx={{ overflowX: "auto" }}>
        <Table size="small" aria-label="Calibration preview table">
          <TableHead>
            <TableRow>
              <TableCell>Scenario</TableCell>
              <TableCell>Default recommendation</TableCell>
              <TableCell>Custom recommendation</TableCell>
              <TableCell align="right">Build Δ</TableCell>
              <TableCell align="right">Core Δ</TableCell>
              <TableCell align="right">Premium Δ</TableCell>
              <TableCell align="right">Enterprise Δ</TableCell>
              <TableCell align="right">Margin Δ</TableCell>
              <TableCell align="right">Confidence Δ</TableCell>
              <TableCell>Changed?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10}>
                  <Typography variant="body2" color="text.secondary">
                    Run the preview to compare the default calibration against the current draft overrides.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}
            {rows.map((row) => {
              const defaultMargin = row.defaultRecommendation?.runnerUp?.scoreGap;
              const customMargin = row.customRecommendation?.runnerUp?.scoreGap;
              const defaultConfidence = row.defaultConfidence?.score;
              const customConfidence = row.customConfidence?.score;

              return (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Stack spacing={0.25}>
                      <Typography variant="subtitle2">{row.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {row.description}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatRecommendation(row.defaultRecommendation)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatConfidence(row.defaultConfidence)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.25}>
                      <Typography variant="body2">
                        {formatRecommendation(row.customRecommendation)}
                      </Typography>
                      <Typography
                        variant="caption"
                        color={row.changed ? "warning.main" : "text.secondary"}
                      >
                        {formatConfidence(row.customConfidence)}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <ScoreCell
                      before={row.defaultPathFits?.build?.score}
                      after={row.customPathFits?.build?.score}
                      delta={(row.customPathFits?.build?.score ?? 0) - (row.defaultPathFits?.build?.score ?? 0)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <ScoreCell
                      before={row.defaultPathFits?.core?.score}
                      after={row.customPathFits?.core?.score}
                      delta={(row.customPathFits?.core?.score ?? 0) - (row.defaultPathFits?.core?.score ?? 0)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <ScoreCell
                      before={row.defaultPathFits?.premium?.score}
                      after={row.customPathFits?.premium?.score}
                      delta={(row.customPathFits?.premium?.score ?? 0) - (row.defaultPathFits?.premium?.score ?? 0)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <ScoreCell
                      before={row.defaultPathFits?.enterprise?.score}
                      after={row.customPathFits?.enterprise?.score}
                      delta={(row.customPathFits?.enterprise?.score ?? 0) - (row.defaultPathFits?.enterprise?.score ?? 0)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <ScoreCell
                      before={defaultMargin}
                      after={customMargin}
                      delta={(customMargin ?? 0) - (defaultMargin ?? 0)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <ScoreCell
                      before={defaultConfidence}
                      after={customConfidence}
                      delta={(customConfidence ?? 0) - (defaultConfidence ?? 0)}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.changed ? "Yes" : "No"}
                      color={row.changed ? "warning" : "success"}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

export default CalibrationPreview;
