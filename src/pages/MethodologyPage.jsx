import { Box, Card, CardContent, Chip, Grid, Stack, Typography } from "@mui/material";
import PageHero from "../components/PageHero.jsx";
import {
  PUBLIC_BENCHMARK_SOURCES,
  PUBLIC_SOURCES
} from "../data/publicSources.js";

const benchmarkInputChips = [
  "Accessibility target (accessibilityTarget)",
  "Change lead time (changeLeadTime)",
  "Rework frequency (reworkFrequency)",
  "Dependent teams (dependentTeams)",
  "Ownership model (ownershipModel)",
  "Expected rows (expectedRows)",
  "Expected columns (expectedColumns)"
];

const derivedFactorRows = [
  "Functional complexity",
  "Quality burden",
  "Delivery maturity",
  "Ownership burden",
  "Enterprise readiness"
];

const limitationRows = [
  "The model is scenario analysis, not a guaranteed forecast.",
  "Some factors are standards-backed or benchmark-informed, but the numeric weights remain model assumptions.",
  "The tool may recommend build in-house when scope is simple and internal ownership is credible.",
  "TCO excludes revenue impact, negotiated pricing, and broader migration work unless the user inputs represent them."
];

const benchmarkSourceCards = [
  {
    key: "cocomo-ii",
    title: "COCOMO II",
    note: "Effort drivers, schedule pressure, and reuse/COTS adjustment."
  },
  {
    key: "flyvbjerg-it-overruns",
    title: "Flyvbjerg et al.",
    note: "Fat-tailed overrun risk and interdependency risk."
  },
  {
    key: "nist-software-errors",
    title: "NIST software errors",
    note: "Defect remediation and quality/rework burden."
  },
  {
    key: "isbsg",
    title: "ISBSG",
    note: "Software productivity and effort benchmarking."
  }
];

const workflowRows = [
  "User inputs capture the delivery context, UI scale, and support assumptions.",
  "The model derives five factors from those inputs to keep the recommendation readable.",
  "The simulation then applies calibrated internal levers for build absorption, reuse, packaged leverage, adoption burden, and a capped downside-tail layer before estimating outcomes.",
  "Monte Carlo simulation then estimates median and p90 outcomes for build-in-house and MUI paths.",
  "Recommendation rules combine the user inputs, derived factors, simulation output, and internally inferred MUI path fit."
];

function Bullet({ children }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Box
        sx={{
          width: 8,
          height: 8,
          mt: "9px",
          borderRadius: "50%",
          bgcolor: "secondary.main",
          flexShrink: 0
        }}
      />
      <Typography variant="body2" color="text.secondary">
        {children}
      </Typography>
    </Stack>
  );
}

function SectionCard({ title, description, children }) {
  return (
    <Card elevation={0} sx={{ height: "100%", border: 1, borderColor: "divider" }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Stack spacing={2.25}>
          <Box>
            <Typography variant="h5" component="h2">
              {title}
            </Typography>
            {description ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 760 }}>
                {description}
              </Typography>
            ) : null}
          </Box>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

function MethodologyPage() {
  const benchmarkSourceMap = Object.fromEntries(
    [...PUBLIC_BENCHMARK_SOURCES, ...PUBLIC_SOURCES].map((source) => [source.key, source])
  );

  return (
    <Stack spacing={4}>
      <PageHero
        eyebrow="Methodology"
        title="How the benchmark-informed recommendation is produced"
        description="The app stays recommendation-first. It combines user inputs, derived factors, and simulated risk evidence into a build-vs-buy answer that stays transparent about what it can and cannot know."
        chips={["Benchmark-informed inputs", "Scenario simulation", "Recommendation first"]}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard
            title="Recommendation flow"
            description="The output is not a model dump. It is a decision aid that explains the recommendation in layers."
          >
            <Stack spacing={1.25}>
              {workflowRows.map((row) => (
                <Bullet key={row}>{row}</Bullet>
              ))}
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard
            title="Benchmark-informed schema"
            description="PR B replaced the older delivery-capacity and turnover fields with captures that better reflect how React teams evaluate advanced UI components."
          >
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                The current schema emphasizes organization ownership, UI scale, and delivery cadence.
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {benchmarkInputChips.map((chip) => (
                  <Chip key={chip} label={chip} size="small" variant="outlined" />
                ))}
              </Stack>
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard
            title="Derived factors"
            description="The simulation first compresses the inputs into five factors so the report can explain the result in plain language."
          >
            <Stack spacing={1.25}>
              {derivedFactorRows.map((row) => (
                <Bullet key={row}>{row}</Bullet>
              ))}
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard
            title="Monte Carlo simulation"
            description="The factor model feeds a seeded Monte Carlo simulation that estimates the medians and long-tail p90 ranges for both paths."
          >
            <Stack spacing={1.25}>
              <Bullet>Build-in-house and MUI paths are both simulated under the same input set.</Bullet>
              <Bullet>The simulation uses public software-estimation concepts such as effort drivers, delivery maturity, integration/adoption risk, rework, and lifecycle maintenance. The coefficients are product heuristics calibrated to the assessment inputs; they are not claimed as externally certified benchmark coefficients.</Bullet>
              <Bullet>Median and p90 ranges help expose long-tail delivery and cost risk.</Bullet>
              <Bullet>Probability outputs summarize how often each path wins across repeated modeled scenarios.</Bullet>
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>

      <SectionCard
        title="Evidence basis and limits"
        description="This is a scenario model, not a guarantee. The evidence basis explains why each factor is included, not that the numeric coefficient is externally certified."
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1.5}>
              <Typography variant="h6" component="h3">
                Evidence basis
              </Typography>
              <Bullet>Standard-backed means the factor is linked to a recognized standard or formal practice area, such as accessibility or software quality.</Bullet>
              <Bullet>Benchmark-informed means the factor is inspired by industry measurement practices, such as delivery performance metrics.</Bullet>
              <Bullet>Practice-backed means the factor reflects widely used engineering practice, such as performance concerns for large data tables.</Bullet>
              <Bullet>Product-specific heuristic means it is an assumption specific to MUI adoption, licensing, support, or tier fit.</Bullet>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1.5}>
              <Typography variant="h6" component="h3">
                Practical limits
              </Typography>
              {limitationRows.map((row) => (
                <Bullet key={row}>{row}</Bullet>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard
        title="Selected public sources"
        description="Public sources inform which uncertainty families are modeled. They do not define the exact coefficients used in the simulation."
      >
        <Grid container spacing={2}>
          {benchmarkSourceCards.map((card) => {
            const source = benchmarkSourceMap[card.key];

            if (!source) {
              return null;
            }

            return (
              <Grid key={card.key} size={{ xs: 12, md: 6 }}>
                <Card elevation={0} sx={{ height: "100%", border: 1, borderColor: "divider" }}>
                  <CardContent sx={{ p: 2.25 }}>
                    <Stack spacing={1.5}>
                      <Box>
                        <Typography variant="subtitle1" component="h3">
                          {card.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {card.note}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {source.publisher}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {(source.supports ?? []).map((support) => (
                          <Chip key={support} label={support} size="small" variant="outlined" />
                        ))}
                      </Stack>
                      <Chip
                        label="Open source"
                        component="a"
                        clickable
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        size="small"
                        variant="outlined"
                        sx={{ alignSelf: "flex-start" }}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </SectionCard>

      <Card elevation={0} sx={{ border: 1, borderColor: "divider" }}>
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Stack spacing={1.5}>
            <Typography variant="h6" component="h2">
              When build-in-house can be the right answer
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The tool may recommend building in-house when the scope is simple, the team has credible ownership, the React footprint is manageable, and the modeled risk stays within an acceptable range.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default MethodologyPage;
