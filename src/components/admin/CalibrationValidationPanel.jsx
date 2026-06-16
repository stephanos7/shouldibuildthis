import { Card, CardContent, Chip, Stack, Typography, Alert } from "@mui/material";

function renderMessages(messages) {
  return messages.map((message) => (
    <Typography key={message} variant="body2">
      {message}
    </Typography>
  ));
}

function CalibrationValidationPanel({ validation }) {
  const errorCount = validation?.errors?.length ?? 0;
  const warningCount = validation?.warnings?.length ?? 0;
  const infoCount = validation?.info?.length ?? 0;

  return (
    <Card elevation={0} sx={{ border: 1, borderColor: "divider" }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3.25 } }}>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="h6" component="h2">
              Validation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Preview runs are blocked only when the current calibration draft has schema errors.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label={`Errors: ${errorCount}`} color={errorCount > 0 ? "error" : "default"} variant="outlined" />
            <Chip
              label={`Warnings: ${warningCount}`}
              color={warningCount > 0 ? "warning" : "default"}
              variant="outlined"
            />
            <Chip label={`Info: ${infoCount}`} color="info" variant="outlined" />
            <Chip
              label={validation?.valid ? "Preview allowed" : "Preview blocked"}
              color={validation?.valid ? "success" : "error"}
              variant="outlined"
            />
          </Stack>

          {errorCount === 0 && warningCount === 0 && infoCount === 0 ? (
            <Alert severity="success" variant="outlined">
              No validation messages were generated for the current draft.
            </Alert>
          ) : null}

          {errorCount > 0 ? (
            <Alert severity="error" variant="outlined">
              <Stack spacing={0.5}>
                <Typography variant="body2" fontWeight={700}>
                  Errors
                </Typography>
                {renderMessages(validation.errors)}
              </Stack>
            </Alert>
          ) : null}

          {warningCount > 0 ? (
            <Alert severity="warning" variant="outlined">
              <Stack spacing={0.5}>
                <Typography variant="body2" fontWeight={700}>
                  Warnings
                </Typography>
                {renderMessages(validation.warnings)}
              </Stack>
            </Alert>
          ) : null}

          {infoCount > 0 ? (
            <Alert severity="info" variant="outlined">
              <Stack spacing={0.5}>
                <Typography variant="body2" fontWeight={700}>
                  Info
                </Typography>
                {renderMessages(validation.info)}
              </Stack>
            </Alert>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default CalibrationValidationPanel;
