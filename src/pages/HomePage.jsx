import { Box, Button, Card, CardContent, Grid, Link, Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';

function HomePage() {
  return (
    <Stack spacing={4}>
      <Box
        sx={{
          borderRadius: 4,
          p: { xs: 3, md: 5 },
          background: 'linear-gradient(135deg, rgba(20,83,45,0.10), rgba(180,83,9,0.08))',
          border: 1,
          borderColor: 'divider',
        }}
      >
        <Stack spacing={3}>
          <PageHero
            eyebrow="Build vs Buy"
            title="Should your React team build this UI in-house?"
            description="Should I Build This compares delivery risk, maintenance burden, and MUI X fit so you can judge whether a custom component effort is worth it."
            chips={['React teams', 'Advanced UI components', 'Scenario-based evidence']}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button component={NavLink} to="/assess" variant="contained" size="large">
              Start assessment
            </Button>
            <Button component={NavLink} to="/methodology" variant="text" size="large" sx={{ alignSelf: 'flex-start' }}>
              Read methodology
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {[
          {
            title: 'Delivery risk',
            body: 'Estimate whether the component can be delivered within the team’s timeline, staffing, and integration constraints.',
          },
          {
            title: 'Maintenance burden',
            body: 'Compare the likely ongoing effort for upgrades, fixes, and edge cases against the cost of adopting a vendor solution.',
          },
          {
            title: 'Enterprise fit',
            body: 'Check whether the component aligns with MUI X requirements, design consistency, and the needs of a React product team.',
          },
        ].map((item) => (
          <Grid key={item.title} size={{ xs: 12, md: 4 }}>
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

      <Typography variant="body2" color="text.secondary">
        The report stays transparent about uncertainty and does not pretend the answer is universal.
        <Link component={NavLink} to="/methodology" sx={{ ml: 0.5 }}>
          Review how the recommendation is formed.
        </Link>
      </Typography>
    </Stack>
  );
}

export default HomePage;
