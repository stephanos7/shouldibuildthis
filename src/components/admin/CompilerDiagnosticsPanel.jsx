import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Chip,
  Stack,
  Typography
} from "@mui/material";

function CompilerDiagnosticsPanel({ diagnostics }) {
  const routeDiagnostics = diagnostics.filter(
    (diagnostic) => diagnostic.inputKey || diagnostic.outcomeKey || diagnostic.path.startsWith("inputImpacts.")
  );

  const infoCount = routeDiagnostics.filter((diagnostic) => diagnostic.level === "info").length;
  const warningCount = routeDiagnostics.filter((diagnostic) => diagnostic.level === "warning").length;
  const errorCount = routeDiagnostics.filter((diagnostic) => diagnostic.level === "error").length;

  return (
    <Accordion disableGutters elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}>
      <AccordionSummary expandIcon={<Typography variant="body2">Open</Typography>}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h6" component="h3">
              Compiler diagnostics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Route status comes from the compiler, including active overrides and saved-only business profile routes.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label={`Info: ${infoCount}`} size="small" color="info" variant="outlined" />
            <Chip label={`Warnings: ${warningCount}`} size="small" color="warning" variant="outlined" />
            <Chip label={`Errors: ${errorCount}`} size="small" color="error" variant="outlined" />
          </Stack>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={1.25}>
          {routeDiagnostics.length === 0 ? (
            <Alert severity="success" variant="outlined">
              No route diagnostics were generated for the current draft.
            </Alert>
          ) : (
            routeDiagnostics.map((diagnostic, index) => (
              <Alert key={`${diagnostic.path}-${index}`} severity={diagnostic.level} variant="outlined">
                {diagnostic.message}
              </Alert>
            ))
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

export default CompilerDiagnosticsPanel;
