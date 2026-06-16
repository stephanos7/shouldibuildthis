import {
  Box,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";

function formatScore(value) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return value.toFixed(1);
}

function formatDelta(value) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  const rounded = Math.abs(value) < 0.05 ? "0.0" : Math.abs(value).toFixed(1);
  return `${value >= 0 ? "+" : "-"}${rounded}`;
}

function getDeltaTone(delta) {
  if (!Number.isFinite(delta) || Math.abs(delta) < 0.05) {
    return "default";
  }

  return delta > 0 ? "success" : "error";
}

function ScenarioDeltaTable({ rows = [] }) {
  return (
    <Stack spacing={1.25}>
      <Box>
        <Typography variant="subtitle1" component="h4">
          Path score changes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Compare the default calibration against the current draft overrides for each path.
        </Typography>
      </Box>

      <TableContainer sx={{ overflowX: "auto" }}>
        <Table size="small" aria-label="Path score changes table">
          <TableHead>
            <TableRow>
              <TableCell>Path</TableCell>
              <TableCell align="right">Default score</TableCell>
              <TableCell align="right">Custom score</TableCell>
              <TableCell align="right">Delta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography variant="body2" color="text.secondary">
                    No path score changes are available for this scenario.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}
            {rows.map((row) => {
              const deltaTone = getDeltaTone(row.delta);
              const isChanged = Math.abs(Number(row.delta) || 0) >= 0.05;

              return (
                <TableRow key={row.key} hover>
                  <TableCell>
                    <Stack spacing={0.25}>
                      <Typography variant="body2" fontWeight={700}>
                        {row.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.key}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                      {formatScore(row.defaultScore)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                      {formatScore(row.customScore)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack spacing={0.5} alignItems="flex-end">
                      <Chip
                        label={`${isChanged ? "Changed" : "Unchanged"} ${formatDelta(row.delta)}`}
                        color={deltaTone}
                        variant="outlined"
                        size="small"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {isChanged ? "Changed" : "Unchanged"}
                      </Typography>
                    </Stack>
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

export default ScenarioDeltaTable;
