import { Chip, FormControl, FormLabel, Slider, Stack, Typography } from "@mui/material";

function getStrengthTier(value) {
  if (value === 0) {
    return "Off";
  }

  if (value < 35) {
    return "Light";
  }

  if (value < 65) {
    return "Moderate";
  }

  if (value < 90) {
    return "Strong";
  }

  return "Dominant";
}

export function getImpactValueText(value) {
  if (value === 0) {
    return "No impact";
  }

  if (value < 35) {
    return "Light impact";
  }

  if (value < 65) {
    return "Moderate impact";
  }

  if (value < 90) {
    return "Strong impact";
  }

  return "Dominant impact";
}

function ImpactStrengthControl({ value, direction, onChange, outcomeLabel }) {
  const normalizedValue = direction === "none" ? 0 : value;

  return (
    <FormControl fullWidth>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        <FormLabel>Impact strength</FormLabel>
        <Chip label={getStrengthTier(normalizedValue)} size="small" variant="outlined" />
      </Stack>
      <Slider
        value={normalizedValue}
        onChange={(_, nextValue) => onChange(Array.isArray(nextValue) ? nextValue[0] : nextValue)}
        min={0}
        max={100}
        step={1}
        disabled={direction === "none"}
        marks={[
          { value: 0, label: "Off" },
          { value: 25, label: "Light" },
          { value: 50, label: "Moderate" },
          { value: 75, label: "Strong" },
          { value: 100, label: "Dominant" }
        ]}
        valueLabelDisplay="auto"
        aria-label={`Impact strength for ${outcomeLabel}`}
        getAriaValueText={getImpactValueText}
      />
      <Typography variant="caption" color="text.secondary">
        Use the slider to express business impact strength without editing raw numeric model weights.
      </Typography>
    </FormControl>
  );
}

export default ImpactStrengthControl;
