import { Stack } from '@mui/material';
import PageHero from '../components/PageHero.jsx';
import PlaceholderSection from '../components/PlaceholderSection.jsx';

function AssessPage() {
  return (
    <Stack spacing={4}>
      <PageHero
        eyebrow="Assess"
        title="Assessment workflow placeholder"
        description="This route is reserved for the future input flow where React teams will describe component complexity, constraints, and risk tolerances."
        chips={['Form not implemented', 'Route ready']}
      />
      <PlaceholderSection
        title="Next implementation step"
        body="Add a structured MUI form here once the assessment model and questions are finalized."
      />
    </Stack>
  );
}

export default AssessPage;
