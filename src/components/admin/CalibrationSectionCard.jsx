import { Card, CardContent, Stack, Typography } from "@mui/material";

function CalibrationSectionCard({ title, description, action, children }) {
  return (
    <Card elevation={0} sx={{ border: 1, borderColor: "divider" }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
          >
            <Stack spacing={0.75}>
              <Typography variant="h5" component="h2">
                {title}
              </Typography>
              {description ? (
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              ) : null}
            </Stack>
            {action ?? null}
          </Stack>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default CalibrationSectionCard;
