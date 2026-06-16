import { Box, Chip, Slider, Stack, Typography } from "@mui/material";

function clampPosition(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(numericValue)));
}

function getOptionPositions(options, optionPositions) {
  const fallbackStep = options.length > 1 ? 100 / (options.length - 1) : 0;
  const positions = options.map((option, index) => {
    const fallbackValue = index === options.length - 1 ? 100 : fallbackStep * index;
    return clampPosition(optionPositions?.[option.key] ?? fallbackValue);
  });

  for (let index = 1; index < positions.length; index += 1) {
    if (positions[index] < positions[index - 1]) {
      positions[index] = positions[index - 1];
    }
  }

  return positions;
}

function describeGap(gap) {
  if (gap <= 0) {
    return "touching";
  }

  if (gap <= 12) {
    return "tight";
  }

  if (gap <= 30) {
    return "moderate";
  }

  if (gap <= 55) {
    return "wide";
  }

  return "very wide";
}

function buildGapSummary(options, positions) {
  if (options.length < 2) {
    return "This scale has a single option, so no gaps need to be managed.";
  }

  const segments = [];

  for (let index = 0; index < options.length - 1; index += 1) {
    const left = options[index];
    const right = options[index + 1];
    const gap = positions[index + 1] - positions[index];

    segments.push(
      `${left.label} to ${right.label} is ${describeGap(gap)} (${gap} points)`
    );
  }

  return `Gap summary: ${segments.join(". ")}.`;
}

function buildVisualScaleLine(options, positions) {
  if (options.length === 0) {
    return "";
  }

  const parts = [];

  for (let index = 0; index < options.length; index += 1) {
    parts.push(options[index].label);

    if (index < options.length - 1) {
      const gap = positions[index + 1] - positions[index];
      const dashCount = Math.max(2, Math.round(gap / 5));
      parts.push(` ${"—".repeat(dashCount)} `);
    }
  }

  return parts.join("");
}

function formatCurrentPositions(options, positions) {
  return options.map((option, index) => `${option.label} ${positions[index]}`).join(", ");
}

function OrderedOptionScaleSlider({
  label,
  description,
  options,
  optionPositions,
  onChange
}) {
  const positions = getOptionPositions(options, optionPositions);
  const marks = options.map((option, index) => ({
    value: positions[index],
    label: option.label
  }));

  const handleChange = (_, newValue) => {
    const rawValues = Array.isArray(newValue) ? newValue : [newValue];
    const nextPositions = rawValues.map((value) => clampPosition(value));

    for (let index = 1; index < nextPositions.length; index += 1) {
      if (nextPositions[index] < nextPositions[index - 1]) {
        nextPositions[index] = nextPositions[index - 1];
      }
    }

    onChange(
      Object.fromEntries(
        options.map((option, index) => [option.key, nextPositions[index] ?? 0])
      )
    );
  };

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
        <Stack spacing={0.5}>
          <Typography variant="h6" component="h3">
            {label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Stack>
        <Chip label="Ordered scale" size="small" variant="outlined" />
      </Stack>

      <Box
        sx={{
          px: 1.5,
          pt: 1.5,
          pb: 0.5,
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper"
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontFamily: "monospace",
            lineHeight: 1.7,
            overflowWrap: "anywhere"
          }}
        >
          {buildVisualScaleLine(options, positions)}
        </Typography>
        <Box sx={{ pt: 2, px: 0.5 }}>
          <Slider
            aria-label={label}
            value={positions}
            min={0}
            max={100}
            step={1}
            marks={marks}
            disableSwap
            onChange={handleChange}
            valueLabelDisplay="off"
          />
        </Box>
      </Box>

      <Typography variant="body2">{buildGapSummary(options, positions)}</Typography>
      <Typography variant="caption" color="text.secondary">
        Current positions: {formatCurrentPositions(options, positions)}
      </Typography>
    </Stack>
  );
}

export default OrderedOptionScaleSlider;
