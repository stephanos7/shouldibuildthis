import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";

const existingMuiUsageOptions = [
  { value: "none", label: "None" },
  { value: "some", label: "Some usage" },
  { value: "standardized", label: "Standardized" }
];

const designSystemMaturityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" }
];

const primaryUseCaseOptions = [
  { value: "data-grid", label: "Data grid" },
  { value: "charts", label: "Charts" },
  { value: "date-pickers", label: "Date pickers" },
  { value: "tree-view", label: "Tree view" },
  { value: "scheduler", label: "Scheduler" },
  { value: "multi-component", label: "Multi-component evaluation" }
];

const pressureOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" }
];

const capacityOptions = [
  { value: "constrained", label: "Constrained" },
  { value: "manageable", label: "Manageable" },
  { value: "ample", label: "Ample" }
];

const supportRequirementOptions = [
  { value: "community", label: "Community" },
  { value: "standard", label: "Standard" },
  { value: "priority", label: "Priority" },
  { value: "procurement-sla", label: "Procurement-backed SLA" }
];

const maintenanceHorizonOptions = [
  { value: "12", label: "12 months" },
  { value: "24", label: "24 months" },
  { value: "36", label: "36 months" }
];

const comparedMuiPlanOptions = [
  { value: "premium", label: "Premium" },
  { value: "enterprise", label: "Enterprise" },
  { value: "auto", label: "Auto-select later" }
];

const advancedFeatureOptions = [
  { value: "virtualization", label: "Virtualization at scale" },
  { value: "inline-editing", label: "Inline editing workflows" },
  { value: "server-side-data", label: "Server-side data operations" },
  { value: "keyboard-navigation", label: "Deep keyboard navigation" },
  { value: "exporting", label: "Export or print requirements" },
  { value: "drag-and-drop", label: "Drag-and-drop interactions" },
  { value: "custom-rendering", label: "Complex custom cell or item rendering" },
  { value: "timezone-logic", label: "Timezone and localization logic" }
];

const steps = [
  {
    label: "Team context",
    title: "Map the team and platform baseline",
    description:
      "Capture the React footprint, current MUI familiarity, and the environment this component would land in."
  },
  {
    label: "Use case",
    title: "Describe the component workload",
    description:
      "Define the primary UI category and the advanced behaviors that are likely to raise delivery and maintenance risk."
  },
  {
    label: "Delivery constraints",
    title: "Set the delivery pressure and long-term burden",
    description:
      "These inputs frame the schedule tolerance, staffing flexibility, and maintenance expectations for the effort."
  },
  {
    label: "Commercial inputs",
    title: "Capture the commercial comparison inputs",
    description:
      "Collect the cost and licensing assumptions needed later for the build-versus-buy comparison model."
  }
];

const defaultFormValues = {
  frontendDevelopers: "",
  reactApps: "",
  existingMuiUsage: "",
  designSystemMaturity: "",
  primaryUseCase: "",
  dataHeavyScreens: "",
  advancedFeatures: [],
  deadlinePressure: "",
  internalCapacity: "",
  delayImpact: "",
  accessibilityStrictness: "",
  maintenanceHorizonMonths: "",
  supportRequirement: "",
  turnoverRisk: "",
  engineerCostPerDay: "",
  licensedDevelopers: "",
  comparedMuiPlan: ""
};

const optionLabelMaps = {
  existingMuiUsage: toLabelMap(existingMuiUsageOptions),
  designSystemMaturity: toLabelMap(designSystemMaturityOptions),
  primaryUseCase: toLabelMap(primaryUseCaseOptions),
  deadlinePressure: toLabelMap(pressureOptions),
  internalCapacity: toLabelMap(capacityOptions),
  delayImpact: toLabelMap(pressureOptions),
  accessibilityStrictness: toLabelMap(pressureOptions),
  maintenanceHorizonMonths: toLabelMap(maintenanceHorizonOptions),
  supportRequirement: toLabelMap(supportRequirementOptions),
  turnoverRisk: toLabelMap(pressureOptions),
  comparedMuiPlan: toLabelMap(comparedMuiPlanOptions),
  advancedFeatures: toLabelMap(advancedFeatureOptions)
};

function toLabelMap(options) {
  return Object.fromEntries(
    options.map((option) => [option.value, option.label])
  );
}

function readStoredAssessmentInput() {
  if (typeof window === "undefined") {
    return defaultFormValues;
  }

  try {
    const raw = window.localStorage.getItem("assessmentInput");

    if (!raw) {
      return defaultFormValues;
    }

    const parsed = JSON.parse(raw);

    return {
      ...defaultFormValues,
      ...parsed,
      frontendDevelopers: stringifyValue(parsed.frontendDevelopers),
      reactApps: stringifyValue(parsed.reactApps),
      dataHeavyScreens: stringifyValue(parsed.dataHeavyScreens),
      maintenanceHorizonMonths: stringifyValue(parsed.maintenanceHorizonMonths),
      engineerCostPerDay: stringifyValue(parsed.engineerCostPerDay),
      licensedDevelopers: stringifyValue(parsed.licensedDevelopers),
      advancedFeatures: Array.isArray(parsed.advancedFeatures)
        ? parsed.advancedFeatures
        : []
    };
  } catch {
    return defaultFormValues;
  }
}

function stringifyValue(value) {
  return value === undefined || value === null ? "" : String(value);
}

function validatePositiveInteger(value, label) {
  if (value === "") {
    return `${label} is required.`;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return `${label} must be a whole number greater than 0.`;
  }

  return "";
}

function validateNonNegativeInteger(value, label) {
  if (value === "") {
    return `${label} is required.`;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    return `${label} must be a whole number of 0 or more.`;
  }

  return "";
}

function validatePositiveNumber(value, label) {
  if (value === "") {
    return `${label} is required.`;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return `${label} must be greater than 0.`;
  }

  return "";
}

function validateRequired(value, label) {
  return value ? "" : `${label} is required.`;
}

function validateStep(stepIndex, formValues) {
  const errors = {};

  if (stepIndex === 0) {
    errors.frontendDevelopers = validatePositiveInteger(
      formValues.frontendDevelopers,
      "Frontend developers"
    );
    errors.reactApps = validatePositiveInteger(
      formValues.reactApps,
      "React apps"
    );
    errors.existingMuiUsage = validateRequired(
      formValues.existingMuiUsage,
      "Existing MUI usage"
    );
    errors.designSystemMaturity = validateRequired(
      formValues.designSystemMaturity,
      "Design system maturity"
    );
    errors.accessibilityStrictness = validateRequired(
      formValues.accessibilityStrictness,
      "Accessibility strictness"
    );
    errors.turnoverRisk = validateRequired(
      formValues.turnoverRisk,
      "Turnover risk"
    );
  }

  if (stepIndex === 1) {
    errors.primaryUseCase = validateRequired(
      formValues.primaryUseCase,
      "Primary use case"
    );
    errors.dataHeavyScreens = validateNonNegativeInteger(
      formValues.dataHeavyScreens,
      "Data-heavy screens"
    );
  }

  if (stepIndex === 2) {
    errors.deadlinePressure = validateRequired(
      formValues.deadlinePressure,
      "Deadline pressure"
    );
    errors.internalCapacity = validateRequired(
      formValues.internalCapacity,
      "Internal capacity"
    );
    errors.delayImpact = validateRequired(
      formValues.delayImpact,
      "Delay impact"
    );
    errors.maintenanceHorizonMonths = validateRequired(
      formValues.maintenanceHorizonMonths,
      "Maintenance horizon"
    );
    errors.supportRequirement = validateRequired(
      formValues.supportRequirement,
      "Support requirement"
    );
  }

  if (stepIndex === 3) {
    errors.engineerCostPerDay = validatePositiveNumber(
      formValues.engineerCostPerDay,
      "Engineer cost per day"
    );
    errors.licensedDevelopers = validatePositiveInteger(
      formValues.licensedDevelopers,
      "Licensed developers"
    );
    errors.comparedMuiPlan = validateRequired(
      formValues.comparedMuiPlan,
      "Compared MUI plan"
    );
  }

  return Object.fromEntries(
    Object.entries(errors).filter(([, message]) => message)
  );
}

function normalizeAssessmentInput(formValues) {
  return {
    ...formValues,
    frontendDevelopers: Number(formValues.frontendDevelopers),
    reactApps: Number(formValues.reactApps),
    dataHeavyScreens: Number(formValues.dataHeavyScreens),
    maintenanceHorizonMonths: Number(formValues.maintenanceHorizonMonths),
    engineerCostPerDay: Number(formValues.engineerCostPerDay),
    licensedDevelopers: Number(formValues.licensedDevelopers)
  };
}

function formatValue(value, labelMap) {
  if (value === "" || value === undefined || value === null) {
    return "Not set";
  }

  return labelMap?.[value] ?? value;
}

function SummaryRow({ label, value }) {
  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="space-between"
      alignItems="flex-start"
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ textAlign: "right", fontWeight: 600 }}>
        {value}
      </Typography>
    </Stack>
  );
}

function RadioField({
  label,
  name,
  value,
  onChange,
  options,
  error,
  helperText,
  row = false
}) {
  return (
    <FormControl error={Boolean(error)}>
      <FormLabel>{label}</FormLabel>
      <RadioGroup name={name} value={value} onChange={onChange} row={row}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
      <FormHelperText>{error || helperText}</FormHelperText>
    </FormControl>
  );
}

function AssessPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState(readStoredAssessmentInput);
  const [errors, setErrors] = useState({});

  const currentStep = steps[activeStep];
  const selectedAdvancedFeatures = formValues.advancedFeatures.map(
    (feature) => optionLabelMaps.advancedFeatures[feature] ?? feature
  );

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value
    }));

    setErrors((currentErrors) => {
      if (!currentErrors[name]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const handleAdvancedFeaturesChange = (event) => {
    const value = event.target.value;

    setFormValues((currentValues) => ({
      ...currentValues,
      advancedFeatures: typeof value === "string" ? value.split(",") : value
    }));
  };

  const handleNext = () => {
    const nextErrors = validateStep(activeStep, formValues);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setActiveStep((currentStepIndex) => currentStepIndex + 1);
  };

  const handleBack = () => {
    setErrors({});
    setActiveStep((currentStepIndex) => currentStepIndex - 1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = Object.fromEntries(
      [0, 1, 2, 3]
        .map((stepIndex) => validateStep(stepIndex, formValues))
        .flatMap((stepErrors) => Object.entries(stepErrors))
    );

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const normalizedInput = normalizeAssessmentInput(formValues);
    window.localStorage.setItem(
      "assessmentInput",
      JSON.stringify(normalizedInput)
    );
    navigate("/report");
  };
  console.log(activeStep, steps.length);
  return (
    <Stack spacing={4}>
      <PageHero
        eyebrow="Assess"
        title="Capture the inputs for a build-vs-buy recommendation"
        description="Work through the wizard to describe your React team, the component workload, and the commercial assumptions. Submitting this form only saves the input locally and opens the report route."
        chips={[
          "MUI stepper flow",
          "Local-only save",
          "Simulation not run yet"
        ]}
      />

      <Grid container spacing={3} alignItems="flex-start">
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card elevation={0} sx={{ border: 1, borderColor: "divider" }}>
            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              <Stack component="form" spacing={4} onSubmit={handleSubmit}>
                <Box sx={{ overflowX: "auto", pb: 1 }}>
                  <Stepper activeStep={activeStep} sx={{ minWidth: 640 }}>
                    {steps.map((step) => (
                      <Step key={step.label}>
                        <StepLabel>{step.label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>

                <Stack spacing={1}>
                  <Typography variant="h4" component="h2">
                    {currentStep.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {currentStep.description}
                  </Typography>
                </Stack>

                {activeStep === 0 && (
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        required
                        type="number"
                        name="frontendDevelopers"
                        label="Frontend developers"
                        value={formValues.frontendDevelopers}
                        onChange={handleFieldChange}
                        error={Boolean(errors.frontendDevelopers)}
                        helperText={
                          errors.frontendDevelopers ||
                          "Count the developers likely to contribute to this UI area."
                        }
                        inputProps={{ min: 1, step: 1 }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        required
                        type="number"
                        name="reactApps"
                        label="React apps in scope"
                        value={formValues.reactApps}
                        onChange={handleFieldChange}
                        error={Boolean(errors.reactApps)}
                        helperText={
                          errors.reactApps ||
                          "How many active React products would need the component or pattern?"
                        }
                        inputProps={{ min: 1, step: 1 }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        select
                        fullWidth
                        required
                        name="existingMuiUsage"
                        label="Existing MUI usage"
                        value={formValues.existingMuiUsage}
                        onChange={handleFieldChange}
                        error={Boolean(errors.existingMuiUsage)}
                        helperText={
                          errors.existingMuiUsage ||
                          "Use the level that best describes today’s MUI footprint."
                        }
                      >
                        {existingMuiUsageOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <RadioField
                        label="Design system maturity"
                        name="designSystemMaturity"
                        value={formValues.designSystemMaturity}
                        onChange={handleFieldChange}
                        options={designSystemMaturityOptions}
                        error={errors.designSystemMaturity}
                        helperText="Assess the consistency of your design tokens, patterns, and governance."
                        row
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <RadioField
                        label="Accessibility strictness"
                        name="accessibilityStrictness"
                        value={formValues.accessibilityStrictness}
                        onChange={handleFieldChange}
                        options={pressureOptions}
                        error={errors.accessibilityStrictness}
                        helperText="Use high when audits, regulated workflows, or strict accessibility acceptance criteria apply."
                        row
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <RadioField
                        label="Turnover risk"
                        name="turnoverRisk"
                        value={formValues.turnoverRisk}
                        onChange={handleFieldChange}
                        options={pressureOptions}
                        error={errors.turnoverRisk}
                        helperText="Estimate the likelihood that maintenance ownership changes over the next year."
                        row
                      />
                    </Grid>
                  </Grid>
                )}

                {activeStep === 1 && (
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        select
                        fullWidth
                        required
                        name="primaryUseCase"
                        label="Primary use case"
                        value={formValues.primaryUseCase}
                        onChange={handleFieldChange}
                        error={Boolean(errors.primaryUseCase)}
                        helperText={
                          errors.primaryUseCase ||
                          "Pick the category that best represents the evaluation target."
                        }
                      >
                        {primaryUseCaseOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        required
                        type="number"
                        name="dataHeavyScreens"
                        label="Data-heavy screens"
                        value={formValues.dataHeavyScreens}
                        onChange={handleFieldChange}
                        error={Boolean(errors.dataHeavyScreens)}
                        helperText={
                          errors.dataHeavyScreens ||
                          "Enter 0 if the component is not used in data-dense product surfaces."
                        }
                        inputProps={{ min: 0, step: 1 }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <FormControl fullWidth>
                        <FormLabel sx={{ mb: 1 }}>Advanced features</FormLabel>
                        <Select
                          multiple
                          name="advancedFeatures"
                          value={formValues.advancedFeatures}
                          onChange={handleAdvancedFeaturesChange}
                          displayEmpty
                          renderValue={(selected) => {
                            if (selected.length === 0) {
                              return "Select any advanced requirements that apply";
                            }

                            return (
                              <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                                useFlexGap
                              >
                                {selected.map((feature) => (
                                  <Chip
                                    key={feature}
                                    label={
                                      optionLabelMaps.advancedFeatures[
                                        feature
                                      ] ?? feature
                                    }
                                    size="small"
                                  />
                                ))}
                              </Stack>
                            );
                          }}
                        >
                          {advancedFeatureOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          Optional. Choose every feature likely to increase
                          implementation or support complexity.
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                )}

                {activeStep === 2 && (
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <RadioField
                        label="Deadline pressure"
                        name="deadlinePressure"
                        value={formValues.deadlinePressure}
                        onChange={handleFieldChange}
                        options={pressureOptions}
                        error={errors.deadlinePressure}
                        helperText="Use high when the component is tied to a committed launch, sale, or contractual milestone."
                        row
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <RadioField
                        label="Internal capacity"
                        name="internalCapacity"
                        value={formValues.internalCapacity}
                        onChange={handleFieldChange}
                        options={capacityOptions}
                        error={errors.internalCapacity}
                        helperText="This reflects real available bandwidth, not ideal staffing on paper."
                        row
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <RadioField
                        label="Delay impact"
                        name="delayImpact"
                        value={formValues.delayImpact}
                        onChange={handleFieldChange}
                        options={pressureOptions}
                        error={errors.delayImpact}
                        helperText="Estimate the business cost if delivery slips because the component runs longer than expected."
                        row
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <RadioField
                        label="Maintenance horizon"
                        name="maintenanceHorizonMonths"
                        value={formValues.maintenanceHorizonMonths}
                        onChange={handleFieldChange}
                        options={maintenanceHorizonOptions}
                        error={errors.maintenanceHorizonMonths}
                        helperText="How long should the recommendation account for likely maintenance work?"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        fullWidth
                        required
                        name="supportRequirement"
                        label="Support requirement"
                        value={formValues.supportRequirement}
                        onChange={handleFieldChange}
                        error={Boolean(errors.supportRequirement)}
                        helperText={
                          errors.supportRequirement ||
                          "Choose the support posture your procurement or delivery team expects."
                        }
                      >
                        {supportRequirementOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                )}

                {activeStep === 3 && (
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <Alert severity="info" variant="outlined">
                        Submitting from this step saves the assessment locally
                        and opens the report route. The submission only runs
                        when the user explicitly clicks the submit button.
                      </Alert>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        required
                        type="number"
                        name="engineerCostPerDay"
                        label="Engineer cost per day"
                        value={formValues.engineerCostPerDay}
                        onChange={handleFieldChange}
                        error={Boolean(errors.engineerCostPerDay)}
                        helperText={
                          errors.engineerCostPerDay ||
                          "Use your fully loaded internal estimate for one engineer day."
                        }
                        inputProps={{ min: 1, step: 1 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        required
                        type="number"
                        name="licensedDevelopers"
                        label="Licensed developers"
                        value={formValues.licensedDevelopers}
                        onChange={handleFieldChange}
                        error={Boolean(errors.licensedDevelopers)}
                        helperText={
                          errors.licensedDevelopers ||
                          "Enter the likely number of developer seats that would need licensing."
                        }
                        inputProps={{ min: 1, step: 1 }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <RadioField
                        label="Compared MUI plan"
                        name="comparedMuiPlan"
                        value={formValues.comparedMuiPlan}
                        onChange={handleFieldChange}
                        options={comparedMuiPlanOptions}
                        error={errors.comparedMuiPlan}
                        helperText="Auto-select later keeps the input open until the recommendation logic is implemented."
                        row
                      />
                    </Grid>
                  </Grid>
                )}

                <Divider />

                <Stack
                  direction={{ xs: "column-reverse", sm: "row" }}
                  spacing={2}
                  justifyContent="space-between"
                >
                  <Button
                    type="button"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    size="large"
                  >
                    Back
                  </Button>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Button
                      component={NavLink}
                      to="/methodology"
                      variant="text"
                      size="large"
                    >
                      Review methodology
                    </Button>
                    {activeStep != steps.length - 1 ? (
                      <Button
                        type="button"
                        variant="contained"
                        onClick={handleNext}
                        size="large"
                      >
                        Next section
                      </Button>
                    ) : (
                      <Button variant="contained" type="submit" size="large">
                        Submit and open report
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack
            spacing={3}
            sx={{ position: { lg: "sticky" }, top: { lg: 24 } }}
          >
            <Card elevation={0} sx={{ border: 1, borderColor: "divider" }}>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6" component="h2">
                    Assessment snapshot
                  </Typography>
                  <SummaryRow
                    label="Frontend developers"
                    value={formValues.frontendDevelopers || "Not set"}
                  />
                  <SummaryRow
                    label="React apps"
                    value={formValues.reactApps || "Not set"}
                  />
                  <SummaryRow
                    label="Existing MUI usage"
                    value={formatValue(
                      formValues.existingMuiUsage,
                      optionLabelMaps.existingMuiUsage
                    )}
                  />
                  <SummaryRow
                    label="Primary use case"
                    value={formatValue(
                      formValues.primaryUseCase,
                      optionLabelMaps.primaryUseCase
                    )}
                  />
                  <SummaryRow
                    label="Deadline pressure"
                    value={formatValue(
                      formValues.deadlinePressure,
                      optionLabelMaps.deadlinePressure
                    )}
                  />
                  <SummaryRow
                    label="Internal capacity"
                    value={formatValue(
                      formValues.internalCapacity,
                      optionLabelMaps.internalCapacity
                    )}
                  />
                  <SummaryRow
                    label="Support requirement"
                    value={formatValue(
                      formValues.supportRequirement,
                      optionLabelMaps.supportRequirement
                    )}
                  />
                  <SummaryRow
                    label="Compared plan"
                    value={formatValue(
                      formValues.comparedMuiPlan,
                      optionLabelMaps.comparedMuiPlan
                    )}
                  />
                </Stack>
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ border: 1, borderColor: "divider" }}>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6" component="h2">
                    Advanced features
                  </Typography>
                  {selectedAdvancedFeatures.length > 0 ? (
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {selectedAdvancedFeatures.map((feature) => (
                        <Chip
                          key={feature}
                          label={feature}
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No advanced features selected yet.
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default AssessPage;
