import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import PageHero from '../components/PageHero.jsx';

function MethodologyPage() {
  return (
    <Stack spacing={4}>
      <PageHero
        eyebrow="Methodology"
        title="How the recommendation is produced"
        description="This page explains the rules and scenario analysis behind the recommendation so users can inspect the assumptions instead of treating the output as a black box."
        chips={['Scenario analysis', 'Transparent rules', 'Uncertainty-aware']}
      />

      <Grid container spacing={3}>
        {[
          {
            title: 'Not a guarantee',
            body: 'This is scenario analysis, not a promise that one path will always win. The output is a structured decision aid, not certainty.',
          },
          {
            title: 'Inputs plus evidence',
            body: 'The recommendation is based on user inputs together with simulation evidence, so the final answer reflects both context and modeled outcomes.',
          },
          {
            title: 'Rules for fit and tier',
            body: 'Simple rules classify component fit and delivery tier before the simulator combines them into a final recommendation.',
          },
          {
            title: 'Uncertainty estimation',
            body: 'The simulation estimates uncertainty around delivery, rework, maintenance, and total cost of ownership so tradeoffs stay visible.',
          },
        ].map((item) => (
          <Grid key={item.title} size={{ xs: 12, md: 6 }}>
            <Card elevation={0} sx={{ height: '100%', border: 1, borderColor: 'divider' }}>
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="h5" component="h2">
                    {item.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {item.body}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
            When build-in-house can be the right answer
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The tool may recommend building in-house when the team has the capacity, the component is strategically
            important, the MUI X fit is strong, and the modeled risk stays within an acceptable range.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default MethodologyPage;
