import { Grid, Stack } from '@mui/material';
import PageHero from '../components/PageHero.jsx';
import PlaceholderSection from '../components/PlaceholderSection.jsx';

function HomePage() {
  return (
    <Stack spacing={4}>
      <PageHero
        eyebrow="Build vs Buy"
        title="Estimate whether a custom component investment is justified."
        description="This scaffold sets up the navigation, layout, and page structure for a probability-based build-vs-buy risk simulator aimed at React teams."
        chips={['Vite', 'React Router', 'MUI Core', 'Netlify-ready']}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <PlaceholderSection
            title="What this app will do"
            body="Teams will assess advanced UI component needs, review scenario-weighted evidence, and receive a recommendation that stays transparent about uncertainty."
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PlaceholderSection
            title="What is intentionally not built yet"
            body="The assessment form, simulator logic, and report calculations are deferred so the first iteration stays launchable and easy to evolve."
          />
        </Grid>
      </Grid>
    </Stack>
  );
}

export default HomePage;
