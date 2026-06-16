import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Stack,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import InputImpactCard from "./InputImpactCard.jsx";
import CompilerDiagnosticsPanel from "./CompilerDiagnosticsPanel.jsx";
import {
  CALIBRATION_OUTCOMES,
  INPUT_CALIBRATION_CATEGORIES_BY_INPUT,
  INPUT_CALIBRATION_CATEGORY_LABELS,
  INPUT_CALIBRATION_REGISTRY
} from "../../model/inputCalibrationRegistry.js";

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "changed", label: "Changed" },
  { value: "warnings", label: "Has warnings" },
  { value: "active", label: "Active routes only" }
];

function routesEqual(leftRoute, rightRoute) {
  return (
    (leftRoute?.direction ?? "none") === (rightRoute?.direction ?? "none") &&
    Number(leftRoute?.strength ?? 0) === Number(rightRoute?.strength ?? 0)
  );
}

function hasChangedInput(inputKey, draft, defaults) {
  return Object.keys(CALIBRATION_OUTCOMES).some((outcomeKey) =>
    !routesEqual(
      draft?.inputImpacts?.[inputKey]?.[outcomeKey],
      defaults?.inputImpacts?.[inputKey]?.[outcomeKey]
    )
  );
}

function hasWarnings(routeStatuses) {
  return Object.values(routeStatuses ?? {}).some((status) => status?.level === "warning");
}

function hasActiveRoutes(routeStatuses) {
  return Object.values(routeStatuses ?? {}).some((status) => status?.status === "active");
}

function InputImpactEditor({
  draft,
  defaultProfile,
  diagnostics,
  routeStatuses,
  onImpactChange,
  onResetInput,
  onResetAll
}) {
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [categoryValue, setCategoryValue] = useState("all");

  const categoryEntries = useMemo(
    () => [["all", "All"], ...Object.entries(INPUT_CALIBRATION_CATEGORY_LABELS)],
    []
  );

  const filteredEntries = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return Object.entries(INPUT_CALIBRATION_REGISTRY).filter(([inputKey, config]) => {
      const routeStatusMap = routeStatuses?.[inputKey] ?? {};
      const changed = hasChangedInput(inputKey, draft, defaultProfile);
      const matchesSearch =
        normalizedSearch.length === 0 ||
        config.label.toLowerCase().includes(normalizedSearch) ||
        config.description.toLowerCase().includes(normalizedSearch);
      const matchesCategory =
        categoryValue === "all" || INPUT_CALIBRATION_CATEGORIES_BY_INPUT[inputKey] === categoryValue;
      const matchesFilter =
        filterValue === "all" ||
        (filterValue === "changed" && changed) ||
        (filterValue === "warnings" && hasWarnings(routeStatusMap)) ||
        (filterValue === "active" && hasActiveRoutes(routeStatusMap));

      return matchesSearch && matchesCategory && matchesFilter;
    });
  }, [categoryValue, defaultProfile, draft, filterValue, routeStatuses, searchValue]);

  const changedCount = Object.keys(INPUT_CALIBRATION_REGISTRY).filter((inputKey) =>
    hasChangedInput(inputKey, draft, defaultProfile)
  ).length;
  const warningCount = Object.values(routeStatuses ?? {}).filter((statusMap) => hasWarnings(statusMap)).length;
  const activeRouteCount = Object.values(routeStatuses ?? {}).reduce(
    (count, statusMap) =>
      count + Object.values(statusMap ?? {}).filter((status) => status?.status === "active").length,
    0
  );

  return (
    <Stack spacing={2.5}>
      <Stack spacing={1}>
        <Typography variant="h5" component="h2">
          Where inputs matter
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Choose which outcomes each assessment input affects. Set direction and strength in business terms. The app converts these choices into calibration overrides.
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip label={`Inputs: ${Object.keys(INPUT_CALIBRATION_REGISTRY).length}`} variant="outlined" />
        <Chip label={`Changed: ${changedCount}`} color={changedCount > 0 ? "primary" : "default"} variant="outlined" />
        <Chip label={`With warnings: ${warningCount}`} color={warningCount > 0 ? "warning" : "default"} variant="outlined" />
        <Chip label={`Active routes: ${activeRouteCount}`} color="success" variant="outlined" />
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField
          label="Search inputs"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          fullWidth
          helperText="Search by input label or description."
        />
        <ToggleButtonGroup
          exclusive
          value={filterValue}
          onChange={(_, nextValue) => {
            if (nextValue !== null) {
              setFilterValue(nextValue);
            }
          }}
          aria-label="Filter inputs"
          sx={{ flexWrap: "wrap", justifyContent: "flex-start" }}
        >
          {FILTER_OPTIONS.map((option) => (
            <ToggleButton key={option.value} value={option.value}>
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

      <Tabs
        value={categoryValue}
        onChange={(_, nextValue) => setCategoryValue(nextValue)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Input category"
      >
        {categoryEntries.map(([categoryKey, categoryLabel]) => (
          <Tab key={categoryKey} value={categoryKey} label={categoryLabel} />
        ))}
      </Tabs>

      {filteredEntries.length === 0 ? (
        <Alert severity="info" variant="outlined">
          No inputs match the current search and filters.
        </Alert>
      ) : (
        <Stack spacing={2}>
          {filteredEntries.map(([inputKey, config]) => (
            <InputImpactCard
              key={inputKey}
              inputKey={inputKey}
              config={config}
              value={draft.inputImpacts?.[inputKey]}
              defaultValue={defaultProfile.inputImpacts?.[inputKey]}
              routeStatuses={routeStatuses?.[inputKey]}
              onChange={onImpactChange}
              onReset={onResetInput}
            />
          ))}
        </Stack>
      )}

      <Box>
        <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
          Reset all input impacts returns every input and outcome route to the built-in business defaults.
        </Alert>
        <Stack direction="row" justifyContent="flex-end">
          <Button variant="outlined" onClick={onResetAll}>
            Reset all input impacts
          </Button>
        </Stack>
      </Box>

      <CompilerDiagnosticsPanel diagnostics={diagnostics} />
    </Stack>
  );
}

export default InputImpactEditor;
