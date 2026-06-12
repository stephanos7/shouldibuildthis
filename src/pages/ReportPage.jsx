import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";

function readStoredSimulationResult() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem("simulationResult");

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);

    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function DebugCard({ title, value }) {
  return (
    <Card elevation={0} sx={{ border: 1, borderColor: "divider" }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          <Box
            component="pre"
            sx={{
              m: 0,
              p: 2,
              borderRadius: 2,
              bgcolor: "grey.100",
              overflowX: "auto",
              fontSize: 13,
              lineHeight: 1.6,
              fontFamily: "monospace"
            }}
          >
            {JSON.stringify(value, null, 2)}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function ReportPage() {
  const simulationResult = readStoredSimulationResult();

  if (!simulationResult) {
    return (
      <Stack spacing={4}>
        <PageHero
          eyebrow="Report"
          title="No saved simulation result"
          description="Run the assessment first so this route has a stored simulation result to display."
          chips={["Assessment required", "Local result cache"]}
        />
        <Card elevation={0} sx={{ border: 1, borderColor: "divider" }}>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="body1" color="text.secondary">
                This report page currently reads from `localStorage` only. Start
                a new assessment to generate a result.
              </Typography>
              <Box>
                <Button component={NavLink} to="/assess" variant="contained">
                  Go to assessment
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack spacing={4}>
      <PageHero
        eyebrow="Report"
        title="Simulation result debug view"
        description="This is a temporary report surface that reads the saved simulation result and exposes the core output without a full report UI yet."
        chips={["Debug summary", "Evidence-first", "No overclaiming"]}
      />
      <DebugCard
        title="Recommendation"
        value={{
          recommendation: simulationResult.recommendation,
          confidence: simulationResult.confidence
        }}
      />
      <DebugCard
        title="Comparison Snapshot"
        value={{
          icpFit: simulationResult.icpFit,
          buildPath: simulationResult.buildPath,
          muiPath: simulationResult.muiPath,
          comparison: simulationResult.comparison
        }}
      />
      <DebugCard
        title="Full Simulation Result"
        value={simulationResult}
      />
    </Stack>
  );
}

export default ReportPage;
