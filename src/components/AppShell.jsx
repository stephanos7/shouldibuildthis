import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';

const navigationItems = [
  { label: 'Home', to: '/' },
  { label: 'Assess', to: '/assess' },
  { label: 'Report', to: '/report' },
  { label: 'Methodology', to: '/methodology' },
  { label: 'Calibration', to: '/admin/calibration' },
];

function AppShell() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 1.5, gap: 2, flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <Typography variant="h6" component={NavLink} to="/" sx={{ color: 'text.primary', textDecoration: 'none' }}>
              Should I Build This?
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {navigationItems.map((item) => (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  color="inherit"
                  sx={{
                    color: 'text.primary',
                    '&.active': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flex: 1, py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>

      <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', py: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            Build-vs-buy risk simulator scaffold for React teams evaluating advanced UI components.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default AppShell;
