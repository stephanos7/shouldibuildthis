import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { auditModelConfig } from './model/auditModelConfig.js';
import { CALIBRATION } from './model/calibration.js';
import { MODEL_ARTIFACT_GLOSSARY } from './model/modelArtifactGlossary.js';
import { MODEL_IMPACT_MAP } from './model/modelImpactMap.js';
import router from './router.jsx';
import theme from './theme.js';

if (import.meta.env.DEV) {
  const audit = auditModelConfig({
    calibration: CALIBRATION,
    impactMap: MODEL_IMPACT_MAP,
    artifactGlossary: MODEL_ARTIFACT_GLOSSARY,
  });

  if (!audit.valid || audit.warnings.length > 0) {
    console.warn('Model config audit', audit);
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
