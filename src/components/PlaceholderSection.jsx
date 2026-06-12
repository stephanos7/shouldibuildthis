import { Card, CardContent, Stack, Typography } from '@mui/material';

function PlaceholderSection({ title, body }) {
  return (
    <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="h5" component="h2">
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {body}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default PlaceholderSection;
