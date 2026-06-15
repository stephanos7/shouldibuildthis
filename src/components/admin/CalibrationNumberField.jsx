import { TextField } from "@mui/material";

function CalibrationNumberField({
  label,
  value,
  onChange,
  helperText,
  step = 0.01,
  min,
  max,
  fullWidth = true,
  readOnly = false
}) {
  return (
    <TextField
      fullWidth={fullWidth}
      type="number"
      label={label}
      value={value}
      onChange={onChange}
      helperText={helperText}
      InputProps={{
        readOnly
      }}
      inputProps={{
        step,
        min,
        max
      }}
    />
  );
}

export default CalibrationNumberField;
