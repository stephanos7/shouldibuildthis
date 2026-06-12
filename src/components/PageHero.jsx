import { Box, Chip, Stack, Typography } from '@mui/material';

function PageHero({ eyebrow, title, description, chips = [] }) {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="overline" color="secondary.main">
          {eyebrow}
        </Typography>
        <Typography variant="h1" component="h1" sx={{ mt: 1, mb: 2 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
          {description}
        </Typography>
      </Box>
      {chips.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {chips.map((chip) => (
            <Chip key={chip} label={chip} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export default PageHero;
