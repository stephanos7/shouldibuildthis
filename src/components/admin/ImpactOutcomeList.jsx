import {
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography
} from "@mui/material";
import ImpactDirectionToggle from "./ImpactDirectionToggle.jsx";
import ImpactStrengthControl, { getImpactValueText } from "./ImpactStrengthControl.jsx";
import { CALIBRATION_OUTCOMES } from "../../model/inputCalibrationRegistry.js";
import { INPUT_IMPACT_ROUTE_STATUS } from "../../model/businessCalibrationCompiler.js";

const STATUS_META = {
  [INPUT_IMPACT_ROUTE_STATUS.active]: {
    label: "Active",
    color: "success"
  },
  [INPUT_IMPACT_ROUTE_STATUS.savedOnly]: {
    label: "Saved only",
    color: "warning"
  },
  [INPUT_IMPACT_ROUTE_STATUS.unsupported]: {
    label: "Unsupported",
    color: "default"
  }
};

function ImpactOutcomeList({ inputKey, inputLabel, outcomes, routeStatuses, onChange }) {
  return (
    <Stack spacing={1.5}>
      {Object.entries(CALIBRATION_OUTCOMES).map(([outcomeKey, outcomeMeta]) => {
        const route = outcomes?.[outcomeKey] ?? { direction: "none", strength: 0 };
        const routeStatus = routeStatuses?.[outcomeKey]?.status ?? INPUT_IMPACT_ROUTE_STATUS.savedOnly;
        const statusMeta = STATUS_META[routeStatus] ?? STATUS_META[INPUT_IMPACT_ROUTE_STATUS.unsupported];

        return (
          <Card key={`${inputKey}-${outcomeKey}`} elevation={0} sx={{ border: 1, borderColor: "divider" }}>
            <CardContent>
              <Stack spacing={2}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  justifyContent="space-between"
                >
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle1" component="h4">
                      {outcomeMeta.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {outcomeMeta.description}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip label={statusMeta.label} size="small" color={statusMeta.color} />
                    <Chip
                      label={route.direction === "none" ? "No impact" : getImpactValueText(route.strength)}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </Stack>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <ImpactDirectionToggle
                      value={route.direction}
                      inputLabel={inputLabel}
                      outcomeLabel={outcomeMeta.label}
                      onChange={(nextDirection) => onChange(outcomeKey, { direction: nextDirection })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <ImpactStrengthControl
                      value={route.strength}
                      direction={route.direction}
                      outcomeLabel={outcomeMeta.label}
                      onChange={(nextStrength) => onChange(outcomeKey, { strength: nextStrength })}
                    />
                  </Grid>
                </Grid>

                {routeStatuses?.[outcomeKey]?.message ? (
                  <Typography variant="caption" color="text.secondary">
                    {routeStatuses[outcomeKey].message}
                  </Typography>
                ) : null}
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}

export default ImpactOutcomeList;
