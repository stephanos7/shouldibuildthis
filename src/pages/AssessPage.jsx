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
import { readCompiledCalibrationOverrides } from "../model/businessCalibrationStorage.js";

const ASSESSMENT_INPUT_SCHEMA_VERSION = 2;

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

const knowledgeConcentrationOptions = [
  { value: "shared", label: "Shared across the team" },
  { value: "few-owners", label: "A few owners" },
  { value: "single-owner", label: "Mostly one owner" },
  { value: "unknown", label: "Unknown" }
];

const designDevHandoffFrictionOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "unknown", label: "Unknown" }
];

const componentStandardizationGoalOptions = [
  { value: "none", label: "No standardization goal" },
  { value: "reduce-one-offs", label: "Reduce one-off components" },
  { value: "shared-pattern", label: "Shared pattern" },
  { value: "platform-standard", label: "Platform standard" }
];

const dependentTeamsOptions = [
  { value: "one", label: "One" },
  { value: "two-three", label: "Two to three" },
  { value: "four-seven", label: "Four to seven" },
  { value: "eight-plus", label: "Eight or more" }
];

const ownershipModelOptions = [
  { value: "same-product-team", label: "Same product team" },
  { value: "frontend-platform-team", label: "Frontend platform team" },
  { value: "several-teams-informal", label: "Several teams informally" },
  { value: "unclear", label: "Unclear" }
];

const primaryUseCaseOptions = [
  { value: "data-grid", label: "Data grid" },
  { value: "charts", label: "Charts" },
  { value: "date-pickers", label: "Date pickers" },
  { value: "tree-view", label: "Tree view" },
  { value: "scheduler", label: "Scheduler" },
  { value: "multi-component", label: "Multi-component evaluation" }
];

const accessibilityTargetOptions = [
  { value: "none", label: "None" },
  { value: "wcag-a", label: "WCAG A" },
  { value: "wcag-aa", label: "WCAG AA" },
  { value: "wcag-aaa-regulated", label: "WCAG AAA / regulated" }
];

const changeLeadTimeOptions = [
  { value: "less-than-day", label: "Less than a day" },
  { value: "one-day-to-one-week", label: "One day to one week" },
  { value: "one-week-to-one-month", label: "One week to one month" },
  { value: "more-than-month", label: "More than a month" },
  { value: "unknown", label: "Unknown" }
];

const reworkFrequencyOptions = [
  { value: "rare", label: "Rare" },
  { value: "occasional", label: "Occasional" },
  { value: "frequent", label: "Frequent" },
  { value: "unknown", label: "Unknown" }
];

const performanceSensitivityOptions = [
  { value: "not-critical", label: "Not critical" },
  { value: "important", label: "Important" },
  { value: "strict-budget", label: "Strict performance budget" },
  {
    value: "measured-core-web-vitals-target",
    label: "Measured Core Web Vitals target"
  }
];

const expectedRowsOptions = [
  { value: "under-1k", label: "Under 1k" },
  { value: "1k-10k", label: "1k to 10k" },
  { value: "10k-100k", label: "10k to 100k" },
  { value: "over-100k", label: "Over 100k" }
];

const expectedColumnsOptions = [
  { value: "under-10", label: "Under 10" },
  { value: "10-30", label: "10 to 30" },
  { value: "over-30", label: "Over 30" }
];

const pressureOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" }
];

const supportRequirementOptions = [
  { value: "community", label: "Community" },
  { value: "standard", label: "Standard" },
  { value: "priority", label: "Priority" },
  { value: "procurement-sla", label: "Procurement-backed SLA" }
];

const productionCriticalityOptions = [
  { value: "internal-tool", label: "Internal tool" },
  { value: "customer-facing", label: "Customer-facing" },
  { value: "revenue-critical", label: "Revenue-critical" },
  { value: "regulated-or-sla-backed", label: "Regulated or SLA-backed" }
];

const ownershipHorizonOptions = [
  { value: "12", label: "12 months" },
  { value: "24", label: "24 months" },
  { value: "36", label: "36 months" }
];

const advancedFeatureOptions = [
  { value: "virtualization", label: "Virtualization at scale" },
  { value: "inline-editing", label: "Inline editing workflows" },
  { value: "server-side-data", label: "Server-side data operations" },
  { value: "keyboard-navigation", label: "Deep keyboard navigation" },
  { value: "exporting", label: "Export or print requirements" },
  { value: "drag-and-drop", label: "Drag-and-drop interactions" },
  { value: "custom-rendering", label: "Complex custom cell or item rendering" },
  { value: "timezone-logic", label: "Timezone logic" },
  { value: "i18n-localization", label: "i18n and localization requirements" }
];

const steps = [
  {
    label: "Organization and ownership",
    title: "Map the team and platform baseline",
    description:
      "Capture the React footprint, current MUI familiarity, and how ownership is distributed across teams."
  },
  {
    label: "UI requirement",
    title: "Describe the component workload",
    description:
      "Define the primary UI category, row and column scale, and the advanced behaviors that can raise delivery, quality, integration, and maintenance uncertainty."
  },
  {
    label: "Delivery context",
    title: "Set the delivery pressure and quality bar",
    description:
      "These inputs frame accessibility expectations, change lead time, rework frequency, and schedule pressure."
  },
  {
    label: "Support and operating context",
    title: "Capture the support and operating context",
    description:
      "Collect the support posture, ownership horizon, and operating context used by the simulator."
  }
];

const defaultFormValues = {
  frontendDevelopers: "",
  reactApps: "",
  dependentTeams: "",
  ownershipModel: "",
  existingMuiUsage: "",
  designSystemMaturity: "",
  knowledgeConcentration: "",
  designDevHandoffFriction: "",
  componentStandardizationGoal: "",
  primaryUseCase: "",
  dataHeavyScreens: "",
  expectedRows: "",
  expectedColumns: "",
  advancedFeatures: [],
  accessibilityTarget: "",
  changeLeadTime: "",
  performanceSensitivity: "",
  reworkFrequency: "",
  deadlinePressure: "",
  ownershipHorizon: "",
  supportRequirement: "",
  productionCriticality: ""
};

const optionLabelMaps = {
  existingMuiUsage: toLabelMap(existingMuiUsageOptions),
  designSystemMaturity: toLabelMap(designSystemMaturityOptions),
  knowledgeConcentration: toLabelMap(knowledgeConcentrationOptions),
  designDevHandoffFriction: toLabelMap(designDevHandoffFrictionOptions),
  componentStandardizationGoal: toLabelMap(componentStandardizationGoalOptions),
  dependentTeams: toLabelMap(dependentTeamsOptions),
  ownershipModel: toLabelMap(ownershipModelOptions),
  primaryUseCase: toLabelMap(primaryUseCaseOptions),
  accessibilityTarget: toLabelMap(accessibilityTargetOptions),
  changeLeadTime: toLabelMap(changeLeadTimeOptions),
  performanceSensitivity: toLabelMap(performanceSensitivityOptions),
  reworkFrequency: toLabelMap(reworkFrequencyOptions),
  deadlinePressure: toLabelMap(pressureOptions),
  expectedRows: toLabelMap(expectedRowsOptions),
  expectedColumns: toLabelMap(expectedColumnsOptions),
  ownershipHorizon: toLabelMap(ownershipHorizonOptions),
  supportRequirement: toLabelMap(supportRequirementOptions),
  productionCriticality: toLabelMap(productionCriticalityOptions),
  advancedFeatures: toLabelMap(advancedFeatureOptions)
};

const assessmentStorageKeys = Object.keys(defaultFormValues);

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

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return defaultFormValues;
    }

    if (parsed.assessmentSchemaVersion !== ASSESSMENT_INPUT_SCHEMA_VERSION) {
      window.localStorage.removeItem("assessmentInput");
      window.localStorage.removeItem("fitResult");
      return defaultFormValues;
    }

    return assessmentStorageKeys.reduce((accumulator, key) => {
      if (key === "advancedFeatures") {
        accumulator[key] = Array.isArray(parsed.advancedFeatures)
          ? parsed.advancedFeatures.filter((feature) => typeof feature === "string")
          : [];
        return accumulator;
      }

      accumulator[key] = stringifyValue(parsed[key]);
      return accumulator;
    }, { ...defaultFormValues });
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
    errors.dependentTeams = validateRequired(
      formValues.dependentTeams,
      "Dependent teams"
    );
    errors.ownershipModel = validateRequired(
      formValues.ownershipModel,
      "Ownership model"
    );
    errors.existingMuiUsage = validateRequired(
      formValues.existingMuiUsage,
      "Existing MUI usage"
    );
    errors.designSystemMaturity = validateRequired(
      formValues.designSystemMaturity,
      "Design system maturity"
    );
    errors.knowledgeConcentration = validateRequired(
      formValues.knowledgeConcentration,
      "Knowledge concentration"
    );
    errors.designDevHandoffFriction = validateRequired(
      formValues.designDevHandoffFriction,
      "Design-dev handoff friction"
    );
    errors.componentStandardizationGoal = validateRequired(
      formValues.componentStandardizationGoal,
      "Component standardization goal"
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
    errors.expectedRows = validateRequired(
      formValues.expectedRows,
      "Expected rows"
    );
    errors.expectedColumns = validateRequired(
      formValues.expectedColumns,
      "Expected columns"
    );
    errors.performanceSensitivity = validateRequired(
      formValues.performanceSensitivity,
      "Performance sensitivity"
    );
  }

  if (stepIndex === 2) {
    errors.accessibilityTarget = validateRequired(
      formValues.accessibilityTarget,
      "Accessibility target"
    );
    errors.changeLeadTime = validateRequired(
      formValues.changeLeadTime,
      "Change lead time"
    );
    errors.reworkFrequency = validateRequired(
      formValues.reworkFrequency,
      "Rework frequency"
    );
    errors.deadlinePressure = validateRequired(
      formValues.deadlinePressure,
      "Deadline pressure"
    );
  }

  if (stepIndex === 3) {
    errors.supportRequirement = validateRequired(
      formValues.supportRequirement,
      "Support requirement"
    );
    errors.productionCriticality = validateRequired(
      formValues.productionCriticality,
      "Production criticality"
    );
    errors.ownershipHorizon = validateRequired(
      formValues.ownershipHorizon,
      "Expected ownership horizon"
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
    dependentTeams: formValues.dependentTeams,
    ownershipModel: formValues.ownershipModel,
    dataHeavyScreens: Number(formValues.dataHeavyScreens),
    expectedRows: formValues.expectedRows,
    expectedColumns: formValues.expectedColumns,
    knowledgeConcentration: formValues.knowledgeConcentration,
    designDevHandoffFriction: formValues.designDevHandoffFriction,
    componentStandardizationGoal: formValues.componentStandardizationGoal,
    accessibilityTarget: formValues.accessibilityTarget,
    changeLeadTime: formValues.changeLeadTime,
    performanceSensitivity: formValues.performanceSensitivity,
    reworkFrequency: formValues.reworkFrequency,
    deadlinePressure: formValues.deadlinePressure,
    ownershipHorizon: Number(formValues.ownershipHorizon),
    supportRequirement: formValues.supportRequirement,
    productionCriticality: formValues.productionCriticality,
    advancedFeatures: [...new Set(formValues.advancedFeatures)],
    assessmentSchemaVersion: ASSESSMENT_INPUT_SCHEMA_VERSION
  };
}

function writeStorageItem(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function removeStorageItem(key) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(key);
}

async function runFitRequest(input) {
  const response = await fetch("/.netlify/functions/simulate", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(input)
  });

  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const details = Array.isArray(payload?.details)
      ? ` ${payload.details.join(" ")}`
      : "";
    const message =
      payload?.error ?? `Fit request failed with status ${response.status}.`;

    throw new Error(`${message}${details}`);
  }

  return payload;
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
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStep = steps[activeStep];
  const isFinalStep = activeStep === steps.length - 1;
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

  const submitAssessment = async () => {
    const validationResults = steps.map((_, stepIndex) =>
      validateStep(stepIndex, formValues)
    );
    const nextErrors = Object.fromEntries(
      validationResults.flatMap((stepErrors) => Object.entries(stepErrors))
    );

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstInvalidStep = validationResults.findIndex(
        (stepErrors) => Object.keys(stepErrors).length > 0
      );

      if (firstInvalidStep >= 0) {
        setActiveStep(firstInvalidStep);
      }

      return;
    }

    const normalizedInput = normalizeAssessmentInput(formValues);
    const compiledCalibration = readCompiledCalibrationOverrides();

    if (!compiledCalibration.valid) {
      setSubmitError(
        compiledCalibration.diagnostics
          .map((diagnostic) => diagnostic.message)
          .join(" ")
      );
      setIsSubmitting(false);
      return;
    }

    const calibrationOverrides = compiledCalibration.calibrationOverrides;
    const payload = calibrationOverrides
      ? {
          ...normalizedInput,
          calibrationOverrides
        }
      : normalizedInput;

    setErrors({});
    setSubmitError("");
    setIsSubmitting(true);

    try {
      writeStorageItem("assessmentInput", normalizedInput);
      removeStorageItem("fitResult");

      const fitResult = await runFitRequest(payload);

      writeStorageItem("fitResult", fitResult);
      navigate("/report");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to run the fit analysis right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrimaryAction = () => {
    if (!isFinalStep) {
      handleNext();
      return;
    }

    void submitAssessment();
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!isFinalStep) {
      handleNext();
      return;
    }

    void submitAssessment();
  };

  return (
    <Stack spacing={4}>
      <PageHero
        eyebrow="Assess"
      title="Capture the inputs for a build-vs-buy recommendation"
      description="Work through the wizard to describe your React team, the component workload, and the support assumptions. Submitting this form runs the fit analysis, saves the input and result locally, and opens the report route."
        chips={[
          "MUI stepper flow",
          "Netlify function submit",
          "Local result cache"
        ]}
      />

      <Grid container spacing={3} alignItems="flex-start">
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card elevation={0} sx={{ border: 1, borderColor: "divider" }}>
            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              <Stack component="form" noValidate spacing={4} onSubmit={handleFormSubmit}>
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

                {submitError ? (
                  <Alert severity="error" variant="outlined">
                    {submitError}
                  </Alert>
                ) : null}

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
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        fullWidth
                        required
                        name="dependentTeams"
                        label="Dependent teams"
                        value={formValues.dependentTeams}
                        onChange={handleFieldChange}
                        error={Boolean(errors.dependentTeams)}
                        helperText={
                          errors.dependentTeams ||
                          "Count the teams that would directly depend on this component or pattern."
                        }
                      >
                        {dependentTeamsOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        fullWidth
                        required
                        name="ownershipModel"
                        label="Ownership model"
                        value={formValues.ownershipModel}
                        onChange={handleFieldChange}
                        error={Boolean(errors.ownershipModel)}
                        helperText={
                          errors.ownershipModel ||
                          "Choose the most realistic ownership pattern for the component after launch."
                        }
                      >
                        {ownershipModelOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
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
                        label="Knowledge concentration"
                        name="knowledgeConcentration"
                        value={formValues.knowledgeConcentration}
                        onChange={handleFieldChange}
                        options={knowledgeConcentrationOptions}
                        error={errors.knowledgeConcentration}
                        helperText="How concentrated is knowledge of this UI area or custom component logic?"
                        row
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <RadioField
                        label="Design-dev handoff friction"
                        name="designDevHandoffFriction"
                        value={formValues.designDevHandoffFriction}
                        onChange={handleFieldChange}
                        options={designDevHandoffFrictionOptions}
                        error={errors.designDevHandoffFriction}
                        helperText="How much friction exists between design specs, coded components, and shipped UI?"
                        row
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <RadioField
                        label="Component standardization goal"
                        name="componentStandardizationGoal"
                        value={formValues.componentStandardizationGoal}
                        onChange={handleFieldChange}
                        options={componentStandardizationGoalOptions}
                        error={errors.componentStandardizationGoal}
                        helperText="Is the goal simply to ship this UI, or to reduce one-off components and standardize a reusable pattern?"
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
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        fullWidth
                        required
                        name="expectedRows"
                        label="Expected rows"
                        value={formValues.expectedRows}
                        onChange={handleFieldChange}
                        error={Boolean(errors.expectedRows)}
                        helperText={
                          errors.expectedRows ||
                          "Estimate the typical row scale for the main data-intensive scenario."
                        }
                      >
                        {expectedRowsOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        fullWidth
                        required
                        name="expectedColumns"
                        label="Expected columns"
                        value={formValues.expectedColumns}
                        onChange={handleFieldChange}
                        error={Boolean(errors.expectedColumns)}
                        helperText={
                          errors.expectedColumns ||
                          "Estimate the typical column scale for the main data-intensive scenario."
                        }
                      >
                        {expectedColumnsOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <RadioField
                        label="Performance sensitivity"
                        name="performanceSensitivity"
                        value={formValues.performanceSensitivity}
                        onChange={handleFieldChange}
                        options={performanceSensitivityOptions}
                        error={errors.performanceSensitivity}
                        helperText="How important are runtime performance, bundle-size pressure, or Core Web Vitals-style targets for this UI?"
                        row
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
                          Optional. Choose every feature likely to increase effort, quality, integration, and maintenance uncertainty.
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                )}

                {activeStep === 2 && (
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <RadioField
                        label="Accessibility target"
                        name="accessibilityTarget"
                        value={formValues.accessibilityTarget}
                        onChange={handleFieldChange}
                        options={accessibilityTargetOptions}
                        error={errors.accessibilityTarget}
                        helperText="Pick the strongest accessibility target the component must reliably meet."
                        row
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <RadioField
                        label="Change lead time"
                        name="changeLeadTime"
                        value={formValues.changeLeadTime}
                        onChange={handleFieldChange}
                        options={changeLeadTimeOptions}
                        error={errors.changeLeadTime}
                        helperText="Unknown or slower delivery cadence widens the fit band."
                        row
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <RadioField
                        label="UI rework/regression frequency"
                        name="reworkFrequency"
                        value={formValues.reworkFrequency}
                        onChange={handleFieldChange}
                        options={reworkFrequencyOptions}
                        error={errors.reworkFrequency}
                        helperText="How often do UI changes require rework, regression fixes, retesting, or follow-up bug fixes?"
                        row
                      />
                    </Grid>
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
                  </Grid>
                )}

                {activeStep === 3 && (
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <Alert severity="info" variant="outlined">
                        Submitting from this step sends the assessment to the
                        Netlify fit function, stores the response locally,
                        and then opens the report route.
                      </Alert>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <RadioField
                        label="Production criticality"
                        name="productionCriticality"
                        value={formValues.productionCriticality}
                        onChange={handleFieldChange}
                        options={productionCriticalityOptions}
                        error={errors.productionCriticality}
                        helperText="How critical is this UI if it fails, regresses, or blocks users in production?"
                        row
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
                          "Higher support expectations increase the value of packaged or vendor-backed paths."
                        }
                      >
                        {supportRequirementOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        fullWidth
                        required
                        name="ownershipHorizon"
                        label="Expected ownership horizon"
                        value={formValues.ownershipHorizon}
                        onChange={handleFieldChange}
                        error={Boolean(errors.ownershipHorizon)}
                        helperText={
                          errors.ownershipHorizon ||
                          "How long is the component expected to stay under active ownership?"
                        }
                      >
                        {ownershipHorizonOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
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
                    disabled={activeStep === 0 || isSubmitting}
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
                      disabled={isSubmitting}
                    >
                      Review methodology
                    </Button>
                    <Button
                      type="button"
                      variant="contained"
                      onClick={handlePrimaryAction}
                      size="large"
                      disabled={isSubmitting}
                    >
                      {isFinalStep
                        ? isSubmitting
                          ? "Running fit analysis..."
                          : "Submit and open report"
                        : "Next section"}
                    </Button>
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
                    label="Dependent teams"
                    value={formatValue(
                      formValues.dependentTeams,
                      optionLabelMaps.dependentTeams
                    )}
                  />
                  <SummaryRow
                    label="Ownership model"
                    value={formatValue(
                      formValues.ownershipModel,
                      optionLabelMaps.ownershipModel
                    )}
                  />
                  <SummaryRow
                    label="Existing MUI usage"
                    value={formatValue(
                      formValues.existingMuiUsage,
                      optionLabelMaps.existingMuiUsage
                    )}
                  />
                  <SummaryRow
                    label="UI/platform maturity"
                    value={formatValue(
                      formValues.designSystemMaturity,
                      optionLabelMaps.designSystemMaturity
                    )}
                  />
                  <SummaryRow
                    label="Knowledge concentration"
                    value={formatValue(
                      formValues.knowledgeConcentration,
                      optionLabelMaps.knowledgeConcentration
                    )}
                  />
                  <SummaryRow
                    label="Design-dev handoff friction"
                    value={formatValue(
                      formValues.designDevHandoffFriction,
                      optionLabelMaps.designDevHandoffFriction
                    )}
                  />
                  <SummaryRow
                    label="Component standardization goal"
                    value={formatValue(
                      formValues.componentStandardizationGoal,
                      optionLabelMaps.componentStandardizationGoal
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
                    label="Expected rows"
                    value={formatValue(
                      formValues.expectedRows,
                      optionLabelMaps.expectedRows
                    )}
                  />
                  <SummaryRow
                    label="Expected columns"
                    value={formatValue(
                      formValues.expectedColumns,
                      optionLabelMaps.expectedColumns
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
                    label="Accessibility target"
                    value={formatValue(
                      formValues.accessibilityTarget,
                      optionLabelMaps.accessibilityTarget
                    )}
                  />
                  <SummaryRow
                    label="Change lead time"
                    value={formatValue(
                      formValues.changeLeadTime,
                      optionLabelMaps.changeLeadTime
                    )}
                  />
                  <SummaryRow
                    label="Performance sensitivity"
                    value={formatValue(
                      formValues.performanceSensitivity,
                      optionLabelMaps.performanceSensitivity
                    )}
                  />
                  <SummaryRow
                    label="UI rework/regression frequency"
                    value={formatValue(
                      formValues.reworkFrequency,
                      optionLabelMaps.reworkFrequency
                    )}
                  />
                  <SummaryRow
                    label="Production criticality"
                    value={formatValue(
                      formValues.productionCriticality,
                      optionLabelMaps.productionCriticality
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
                    label="Expected ownership horizon"
                    value={formatValue(
                      formValues.ownershipHorizon,
                      optionLabelMaps.ownershipHorizon
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
