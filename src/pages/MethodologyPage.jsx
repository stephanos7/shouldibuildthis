import { Stack } from '@mui/material';
import PageHero from '../components/PageHero.jsx';
import PlaceholderSection from '../components/PlaceholderSection.jsx';

function MethodologyPage() {
  return (
    <Stack spacing={4}>
      <PageHero
        eyebrow="Methodology"
        title="Transparent methodology placeholder"
        description="This route is reserved for explaining the future scoring assumptions, scenario model, and limitations in a way users can inspect."
        chips={['Transparent assumptions', 'Simple model']}
      />
      <PlaceholderSection
        title="Why this page matters"
        body="The final app should make its reasoning easy to audit so teams understand how any recommendation was produced."
      />
    </Stack>
  );
}

export default MethodologyPage;
