import {
  Alert,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";

function formatPercent(value) {
  if (!Number.isFinite(value)) {
    return "N/A";
  }

  return `${value.toFixed(1)}%`;
}

function PathFitSignalTable({
  pathLabel,
  pathKey,
  pathConfig,
  value,
  onShareChange
}) {
  const positiveSignals = Object.entries(value?.positiveSignals ?? {});
  const dragSignals = Object.entries(value?.dragSignals ?? {});
  const positiveTotal = positiveSignals.reduce(
    (sum, [, signal]) => sum + (Number(signal.share) || 0),
    0
  );
  const dragTotal = dragSignals.reduce(
    (sum, [, signal]) => sum + (Number(signal.share) || 0),
    0
  );
  const positiveWarning = Math.abs(positiveTotal - 1) > 0.01;
  const dragWarning = Math.abs(dragTotal - 1) > 0.01;

  const rows = [
    ...positiveSignals.map(([signalKey, signal]) => ({
      group: "Positive",
      budget: pathConfig.positiveBudget,
      signalKey,
      signal
    })),
    ...dragSignals.map(([signalKey, signal]) => ({
      group: "Drag",
      budget: pathConfig.dragBudget,
      signalKey,
      signal
    }))
  ];

  return (
    <Stack spacing={1.5}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between">
        <Box>
          <Typography variant="subtitle1" component="div">
            {pathLabel}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Base score {pathConfig.baseScore}, positive budget {pathConfig.positiveBudget}, drag budget{" "}
            {pathConfig.dragBudget}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Typography variant="body2" color={positiveWarning ? "warning.main" : "text.secondary"}>
            Positive total {formatPercent(positiveTotal)}
          </Typography>
          <Typography variant="body2" color={dragWarning ? "warning.main" : "text.secondary"}>
            Drag total {formatPercent(dragTotal)}
          </Typography>
        </Stack>
      </Stack>

      {positiveWarning || dragWarning ? (
        <Alert severity="warning" variant="outlined">
          Signal shares should total 100% in each group. They will be normalized when saved.
        </Alert>
      ) : null}

      <TableContainer sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "background.default" }}>
              <TableCell>Path</TableCell>
              <TableCell>Group</TableCell>
              <TableCell align="right">Budget</TableCell>
              <TableCell>Signal</TableCell>
              <TableCell align="right">Share %</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={`${pathKey}-${row.group}-${row.signalKey}`} hover>
                <TableCell>{pathLabel}</TableCell>
                <TableCell>{row.group}</TableCell>
                <TableCell align="right">{row.budget}</TableCell>
                <TableCell>
                  <Stack spacing={0.25}>
                    <Typography variant="body2" fontWeight={600}>
                      {row.signal.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.signal.description}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="right" sx={{ minWidth: 120 }}>
                  <TextField
                    size="small"
                    type="number"
                    value={Number.isFinite(row.signal.share) ? (row.signal.share * 100).toFixed(2) : ""}
                    onChange={(event) => onShareChange(pathKey, row.group, row.signalKey, event.target.value)}
                    inputProps={{ step: 0.01, min: 0 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

export default PathFitSignalTable;
