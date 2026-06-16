import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import PathPriorityCard from "./PathPriorityCard.jsx";
import {
  BUSINESS_CALIBRATION_PATH_LABELS,
  BUSINESS_CALIBRATION_PATH_ORDER
} from "../../model/businessCalibrationDefaults.js";

function PathPriorityEditor({
  draft,
  defaultProfile,
  calibration,
  validationErrors = [],
  onOrderChange
}) {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedPathKey, setSelectedPathKey] = useState(BUSINESS_CALIBRATION_PATH_ORDER[0]);

  const pathEntries = useMemo(
    () =>
      BUSINESS_CALIBRATION_PATH_ORDER.map((pathKey) => ({
        pathKey,
        pathLabel: BUSINESS_CALIBRATION_PATH_LABELS[pathKey] ?? pathKey,
        pathConfig: calibration?.pathFitComponentWeights?.[pathKey] ?? null,
        value: draft.pathPriorities?.[pathKey],
        defaultValue: defaultProfile.pathPriorities?.[pathKey]
      })).filter((entry) => Boolean(entry.pathConfig)),
    [calibration?.pathFitComponentWeights, defaultProfile.pathPriorities, draft.pathPriorities]
  );

  useEffect(() => {
    if (!pathEntries.some((entry) => entry.pathKey === selectedPathKey) && pathEntries[0]) {
      setSelectedPathKey(pathEntries[0].pathKey);
    }
  }, [pathEntries, selectedPathKey]);

  const selectedPathEntry = pathEntries.find((entry) => entry.pathKey === selectedPathKey) ?? pathEntries[0];
  const pathPriorityIssues = validationErrors.filter((message) => message.startsWith("pathPriorities."));

  return (
    <Stack spacing={2.5}>
      <Stack spacing={1}>
        <Typography variant="h5" component="h2">
          What matters most by path
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Rank the signals that help or drag on each recommendation path. The app converts the
          order into calibration shares.
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip label={`Paths: ${pathEntries.length}`} variant="outlined" />
        <Chip label={isCompact ? "Compact view" : "Expanded view"} variant="outlined" />
      </Stack>

      <Alert severity="info" variant="outlined">
        Higher-ranked signals receive larger normalized shares when the profile is saved. You
        only need to order the signals, not edit raw weights.
      </Alert>

      {pathPriorityIssues.length > 0 ? (
        <Alert severity="error" variant="outlined">
          <Stack spacing={0.5}>
            <Typography variant="body2" fontWeight={700}>
              Resolve the path priority issues before saving.
            </Typography>
            {pathPriorityIssues.slice(0, 6).map((message) => (
              <Typography key={message} variant="body2">
                {message}
              </Typography>
            ))}
            {pathPriorityIssues.length > 6 ? (
              <Typography variant="body2">
                {pathPriorityIssues.length - 6} more issues are hidden.
              </Typography>
            ) : null}
          </Stack>
        </Alert>
      ) : null}

      {isCompact ? (
        <Box>
          <ToggleButtonGroup
            exclusive
            value={selectedPathKey}
            onChange={(_, nextValue) => {
              if (nextValue !== null) {
                setSelectedPathKey(nextValue);
              }
            }}
            aria-label="Select recommendation path"
            fullWidth
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 1
            }}
          >
            {pathEntries.map((entry) => (
              <ToggleButton key={entry.pathKey} value={entry.pathKey} sx={{ whiteSpace: "nowrap" }}>
                {entry.pathKey === "build"
                  ? "Build"
                  : entry.pathKey === "core"
                    ? "Core"
                    : entry.pathKey === "premium"
                      ? "Premium"
                      : "Enterprise"}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Box sx={{ mt: 2 }}>
            {selectedPathEntry ? (
              <PathPriorityCard
                pathKey={selectedPathEntry.pathKey}
                pathLabel={selectedPathEntry.pathLabel}
                pathConfig={selectedPathEntry.pathConfig}
                value={selectedPathEntry.value}
                defaultValue={selectedPathEntry.defaultValue}
                onOrderChange={onOrderChange}
              />
            ) : null}
          </Box>
        </Box>
      ) : (
        <Stack spacing={2}>
          {pathEntries.map((entry) => (
            <PathPriorityCard
              key={entry.pathKey}
              pathKey={entry.pathKey}
              pathLabel={entry.pathLabel}
              pathConfig={entry.pathConfig}
              value={entry.value}
              defaultValue={entry.defaultValue}
              onOrderChange={onOrderChange}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export default PathPriorityEditor;
