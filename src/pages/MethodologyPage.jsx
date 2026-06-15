import { Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from "@mui/material";
import PageHero from "../components/PageHero.jsx";
import { PUBLIC_BENCHMARK_SOURCES, PUBLIC_SOURCES } from "../data/publicSources.js";

const inputChips = [
  "Accessibility target",
  "Change lead time",
  "UI rework frequency",
  "Performance sensitivity",
  "Knowledge concentration",
  "Design-dev handoff friction",
  "Component standardization goal",
  "Production criticality",
  "Dependent teams",
  "Ownership model",
  "Expected rows",
  "Expected columns"
];

const factorRows = [
  "Functional complexity",
  "Quality burden",
  "Delivery maturity",
  "Ownership burden",
  "Enterprise readiness"
];

const flowRows = [
  "Raw assessment inputs capture the team context, component scope, and operating pressure.",
  "Those inputs are compressed into five derived factors so the model stays readable.",
  "The derived factors feed four path-fit scores: Build in-house, MUI Core, MUI X Premium, and MUI X Enterprise.",
  "The recommendation picks the highest-fit path and explains the runner-up gap in plain language."
];

const guardrailRows = [
  "The model is deterministic and rule-based.",
  "It does not estimate delivery dates.",
  "It does not estimate cost.",
  "Scores are heuristic decision-support signals, not guarantees.",
  "Public sources inform variable selection and risk direction."
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

function SourceCard({ source }) {
  return (
    <Card elevation={0} sx={{ height: "100%", border: 1, borderColor: "divider" }}>
      <CardContent sx={{ p: 2.25 }}>
        <Stack spacing={1.25}>
          <Box>
            <Typography variant="subtitle1" component="h3">
              {source.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {source.publisher}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {source.note}
          </Typography>
          <Button component="a" href={source.url} target="_blank" rel="noreferrer" variant="text" sx={{ alignSelf: "flex-start" }}>
            Open source
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function MethodologyPage() {
  const sourceMap = Object.fromEntries(
    [...PUBLIC_BENCHMARK_SOURCES, ...PUBLIC_SOURCES].map((source) => [source.key, source])
  );

  return (
    <Stack spacing={4}>
      <PageHero
        eyebrow="Methodology"
        title="How the deterministic fit model works"
        description="Raw inputs are compressed into derived factors, the factors are scored against the available paths, and the strongest fit becomes the recommendation."
        chips={["Raw inputs", "Derived factors", "Path fit scores"]}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard
            title="Flow"
            description="The report is meant to read as a decision aid, not a model dump."
          >
            <Stack spacing={1.25}>
              {flowRows.map((row) => (
                <Bullet key={row}>{row}</Bullet>
              ))}
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard
            title="Input schema"
            description="The current fields focus on the delivery context that changes fit, ownership, and support pressure."
          >
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                The question set captures team scale, component complexity, operational pressure, and support posture.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The model uses those fields to shape the five derived factors below.
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {inputChips.map((chip) => (
                  <Chip key={chip} label={chip} size="small" variant="outlined" />
                ))}
              </Stack>
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard
            title="Derived factors"
            description="The model compresses the raw inputs into five readable factors."
          >
            <Stack spacing={1.25}>
              {factorRows.map((row) => (
                <Bullet key={row}>{row}</Bullet>
              ))}
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard
            title="Source families"
            description="Public sources steer which variables matter and how the risk direction is interpreted."
          >
            <Stack spacing={1.25}>
              <Bullet>COCOMO II informs effort, reuse, and schedule pressure thinking.</Bullet>
              <Bullet>Flyvbjerg research informs the model’s caution around large, interdependent work.</Bullet>
              <Bullet>NIST software-error research informs quality and rework burden.</Bullet>
              <Bullet>ISBSG benchmarking informs productivity and delivery framing.</Bullet>
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>

      <SectionCard
        title="Benchmark-informed assumptions"
        description="These sources help explain why the model includes the variables it does."
      >
        <Grid container spacing={2.5}>
          {benchmarkSourceCards.map((card) => {
            const source = sourceMap[card.key];

            if (!source) {
              return null;
            }

            return (
              <Grid key={card.key} size={{ xs: 12, md: 6 }}>
                <SourceCard source={{ ...source, note: card.note }} />
              </Grid>
            );
          })}
        </Grid>
      </SectionCard>

      <SectionCard
        title="Guardrails"
        description="The report stays explicit about what the model does and does not claim."
      >
        <Stack spacing={1.25}>
          {guardrailRows.map((row) => (
            <Bullet key={row}>{row}</Bullet>
          ))}
        </Stack>
      </SectionCard>
    </Stack>
  );
}

export default MethodologyPage;
