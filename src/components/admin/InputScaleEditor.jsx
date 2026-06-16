import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import OrderedOptionScaleSlider from "./OrderedOptionScaleSlider.jsx";
import { INPUT_SCALE_TYPES } from "../../model/inputCalibrationRegistry.js";

function InputScaleEditor({ inputKey, config, value, onChange }) {
  if (config.scaleType === INPUT_SCALE_TYPES.ordered) {
    return (
      <Card elevation={0} sx={{ border: 1, borderColor: "divider", height: "100%" }}>
        <CardContent>
          <OrderedOptionScaleSlider
            label={config.label}
            description={config.description}
            options={config.options ?? []}
            optionPositions={value?.optionPositions ?? {}}
            onChange={(nextOptionPositions) => onChange(inputKey, { optionPositions: nextOptionPositions })}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={0} sx={{ border: 1, borderColor: "divider", height: "100%" }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Stack spacing={0.5}>
              <Typography variant="h6" component="h3">
                {config.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {config.description}
              </Typography>
            </Stack>
            <Chip label={config.scaleType} size="small" variant="outlined" />
          </Stack>
          <Typography variant="body2">
            This input uses categorical/numeric calibration. Editing will be added in a later PR.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default InputScaleEditor;
