import { Stack } from '@mui/material';
import PageHero from '../components/PageHero.jsx';
import PlaceholderSection from '../components/PlaceholderSection.jsx';

function ReportPage() {
  return (
    <Stack spacing={4}>
      <PageHero
        eyebrow="Report"
        title="Recommendation output placeholder"
        description="This page will eventually present the build-vs-buy recommendation with probability-based scenario evidence and appropriately limited claims."
        chips={['Evidence-first', 'No overclaiming']}
      />
      <PlaceholderSection
        title="Planned content"
        body="Recommendation summary, scenario ranges, and confidence caveats will live here after the simulator logic exists."
      />
    </Stack>
  );
}

export default ReportPage;
