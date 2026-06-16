import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Divider,
  Stack,
  Typography
} from "@mui/material";
import { CALIBRATION_OUTCOMES, INPUT_SCALE_TYPES } from "../../model/inputCalibrationRegistry.js";
import ImpactOutcomeList from "./ImpactOutcomeList.jsx";

const SCALE_TYPE_LABELS = {
  [INPUT_SCALE_TYPES.ordered]: "Ordered scale",
  [INPUT_SCALE_TYPES.categorical]: "Categorical input",
  [INPUT_SCALE_TYPES.numeric]: "Numeric input",
  [INPUT_SCALE_TYPES.multiSelect]: "Multi-select input"
};

function areRoutesEqual(leftRoute, rightRoute) {
  return (
    (leftRoute?.direction ?? "none") === (rightRoute?.direction ?? "none") &&
    Number(leftRoute?.strength ?? 0) === Number(rightRoute?.strength ?? 0)
  );
}

function getOutcomeLabel(outcomeKey) {
  return CALIBRATION_OUTCOMES[outcomeKey]?.label ?? outcomeKey;
}

function buildOutcomeSummary(config, outcomes, defaultRoutes) {
  const explicitOutcomeKeys = new Set(Object.keys(config.impacts ?? {}));
  const changedOutcomeKeys = Object.keys(CALIBRATION_OUTCOMES).filter((outcomeKey) =>
    !areRoutesEqual(outcomes?.[outcomeKey], defaultRoutes?.[outcomeKey])
  );
  const summaryKeys = Array.from(new Set([...explicitOutcomeKeys, ...changedOutcomeKeys]));

  return summaryKeys.map((outcomeKey) => {
    const outcomeLabel = getOutcomeLabel(outcomeKey);
    const route = outcomes?.[outcomeKey] ?? { direction: "none", strength: 0 };
    const strength = Number(route.strength) || 0;

    if (route.direction === "none" || strength === 0) {
      return `${outcomeLabel}: No impact`;
    }

    const tier =
      strength < 35 ? "Light" : strength < 65 ? "Moderate" : strength < 90 ? "Strong" : "Dominant";
    const directionLabel = route.direction === "positive"
      ? "positive"
      : route.direction === "negative"
        ? "negative"
        : "contextual";

    return `${outcomeLabel}: ${tier} ${directionLabel}`;
  });
}

function hasRouteWarnings(routeStatuses) {
  return Object.values(routeStatuses ?? {}).some((status) => status?.level === "warning");
}

function isChanged(currentRoutes, defaultRoutes) {
  return Object.keys(CALIBRATION_OUTCOMES).some((outcomeKey) =>
    !areRoutesEqual(currentRoutes?.[outcomeKey], defaultRoutes?.[outcomeKey])
  );
}

function InputImpactCard({
  inputKey,
  config,
  value,
  defaultValue,
  routeStatuses,
  onChange,
  onReset
}) {
  const changed = isChanged(value, defaultValue);
  const summaryLines = buildOutcomeSummary(config, value, defaultValue);
  const warningState = hasRouteWarnings(routeStatuses);

  return (
    <Accordion disableGutters elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}>
      <AccordionSummary
        expandIcon={<Typography variant="body2">Open</Typography>}
        aria-controls={`${inputKey}-impact-content`}
      >
        <Stack spacing={1.25} sx={{ width: "100%" }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
          >
            <Stack spacing={0.5}>
              <Typography variant="h6" component="h3">
                {config.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {config.description}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={SCALE_TYPE_LABELS[config.scaleType] ?? config.scaleType} size="small" variant="outlined" />
              <Chip
                label={changed ? "Changed" : "Unchanged"}
                size="small"
                color={changed ? "primary" : "default"}
                variant={changed ? "filled" : "outlined"}
              />
              {warningState ? <Chip label="Has warnings" size="small" color="warning" /> : null}
            </Stack>
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              Impacts
            </Typography>
            {summaryLines.map((line) => (
              <Typography key={`${inputKey}-${line}`} variant="body2">
                {line}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="flex-end">
            <Button variant="outlined" size="small" onClick={() => onReset(inputKey)}>
              Reset this input
            </Button>
          </Stack>
          <Divider />
          <ImpactOutcomeList
            inputKey={inputKey}
            inputLabel={config.label}
            outcomes={value}
            routeStatuses={routeStatuses}
            onChange={(outcomeKey, nextRoutePatch) => onChange(inputKey, outcomeKey, nextRoutePatch)}
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

export default InputImpactCard;
