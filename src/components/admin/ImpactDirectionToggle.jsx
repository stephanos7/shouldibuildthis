import { FormControl, FormLabel, ToggleButton, ToggleButtonGroup } from "@mui/material";

const DIRECTION_OPTIONS = [
  { value: "none", label: "No impact" },
  { value: "positive", label: "Helps / increases" },
  { value: "negative", label: "Hurts / decreases" },
  { value: "contextual", label: "Contextual" }
];

function ImpactDirectionToggle({ value, onChange, inputLabel, outcomeLabel }) {
  const ariaLabel = `${inputLabel} direction for ${outcomeLabel}`;

  const handleDirectionChange = (event, nextDirection) => {
    if (nextDirection === null) {
      return;
    }

    onChange(nextDirection);
  };

  return (
    <FormControl fullWidth>
      <FormLabel sx={{ mb: 1 }}>Direction</FormLabel>
      <ToggleButtonGroup
        exclusive
        value={value}
        onChange={handleDirectionChange}
        aria-label={ariaLabel}
        fullWidth
        sx={{ flexWrap: "wrap", justifyContent: "flex-start" }}
      >
        {DIRECTION_OPTIONS.map((option) => (
          <ToggleButton
            key={option.value}
            value={option.value}
            aria-label={`${option.label} for ${outcomeLabel}`}
            sx={{ flexGrow: 1 }}
          >
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </FormControl>
  );
}

export default ImpactDirectionToggle;
