import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography
} from "@mui/material";
import ScenarioDeltaTable from "./ScenarioDeltaTable.jsx";
import { BUSINESS_CALIBRATION_PATH_LABELS, BUSINESS_CALIBRATION_PATH_ORDER } from "../../model/businessCalibrationDefaults.js";
import { validateScenarioPreviewResult } from "../../model/businessCalibrationValidation.js";

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

  const rounded = Math.abs(value) < 0.05 ? "0.0" : Math.abs(value).toFixed(1);
  return `${value >= 0 ? "+" : "-"}${rounded}`;
}

function formatRecommendation(recommendation) {
  return recommendation?.option ?? recommendation?.label ?? "—";
}

function formatConfidenceLevel(level) {
  if (!level) {
    return "—";
  }

  return `${level[0].toUpperCase()}${level.slice(1)}`;
}

function buildDeltaRows(defaultResult, customResult) {
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

function ScenarioResultCard({ scenario, result }) {
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const validation = useMemo(
    () =>
      result?.status === "success"
        ? validateScenarioPreviewResult({
            scenario,
            defaultResult: result.defaultResult,
            customResult: result.customResult
          })
        : { valid: true, errors: [] },
    [result, scenario]
  );

  const warnings = result?.warnings ?? [];
  const info = result?.info ?? [];
  const errors = result?.errors ?? [];
  const isChanged = Boolean(result?.winnerChanged);
  const hasWarning = warnings.length > 0;
  const hasError = result?.status === "error" || !validation.valid;

  return (
    <Card elevation={0} sx={{ border: 1, borderColor: "divider" }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3.25 } }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Stack spacing={0.5}>
              <Typography variant="h6" component="h3">
                {scenario.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {scenario.description}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label={isChanged ? "Changed" : "Unchanged"}
                color={isChanged ? "warning" : "success"}
                variant="outlined"
                size="small"
              />
              {hasWarning ? (
                <Chip label={`Warnings ${warnings.length}`} color="warning" variant="outlined" size="small" />
              ) : null}
              {hasError ? <Chip label="Failed" color="error" variant="outlined" size="small" /> : null}
            </Stack>
          </Stack>

          {result?.status === "error" ? (
            <Alert severity="error" variant="outlined">
              {result.errorText ?? "This scenario could not be previewed."}
            </Alert>
          ) : (
            <>
              <Box>
                <Typography variant="body2">
                  <strong>Default:</strong> {formatRecommendation(result.defaultResult?.recommendation)}
                </Typography>
                <Typography variant="body2">
                  <strong>Custom:</strong> {formatRecommendation(result.customResult?.recommendation)}
                </Typography>
                <Typography variant="body2">
                  <strong>Margin:</strong> {formatSignedDelta(result.marginDelta)}
                </Typography>
                <Typography variant="body2">
                  <strong>Confidence:</strong>{" "}
                  {formatConfidenceLevel(result.defaultResult?.confidence?.level)}{" "}
                  {"\u2192"} {formatConfidenceLevel(result.customResult?.confidence?.level)}
                </Typography>
              </Box>

              {validation.errors.length > 0 ? (
                <Alert severity="error" variant="outlined">
                  {validation.errors[0]}
                </Alert>
              ) : null}

              <ScenarioDeltaTable rows={buildDeltaRows(result.defaultResult, result.customResult)} />

              <Accordion
                disableGutters
                elevation={0}
                expanded={diagnosticsOpen}
                onChange={(_, nextOpen) => setDiagnosticsOpen(nextOpen)}
                sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
              >
                <AccordionSummary expandIcon={<Typography variant="body2">Open</Typography>}>
                  <Stack spacing={0.25}>
                    <Typography variant="subtitle2">Diagnostics</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Warning and info details for the default and custom runs.
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1.25}>
                    {warnings.length === 0 && info.length === 0 && errors.length === 0 ? (
                      <Alert severity="success" variant="outlined">
                        No diagnostics were generated for this scenario.
                      </Alert>
                    ) : null}
                    {errors.length > 0 ? (
                      <Alert severity="error" variant="outlined">
                        <Stack spacing={0.5}>
                          <Typography variant="body2" fontWeight={700}>
                            Errors
                          </Typography>
                          {errors.map((message) => (
                            <Typography key={message} variant="body2">
                              {message}
                            </Typography>
                          ))}
                        </Stack>
                      </Alert>
                    ) : null}
                    {warnings.length > 0 ? (
                      <Alert severity="warning" variant="outlined">
                        <Stack spacing={0.5}>
                          <Typography variant="body2" fontWeight={700}>
                            Warnings
                          </Typography>
                          {warnings.map((message) => (
                            <Typography key={message} variant="body2">
                              {message}
                            </Typography>
                          ))}
                        </Stack>
                      </Alert>
                    ) : null}
                    {info.length > 0 ? (
                      <Alert severity="info" variant="outlined">
                        <Stack spacing={0.5}>
                          <Typography variant="body2" fontWeight={700}>
                            Info
                          </Typography>
                          {info.map((message) => (
                            <Typography key={message} variant="body2">
                              {message}
                            </Typography>
                          ))}
                        </Stack>
                      </Alert>
                    ) : null}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ScenarioResultCard;
