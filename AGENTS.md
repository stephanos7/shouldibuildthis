# AGENTS.md

## Project

This project is `shouldibuildthis`, a launch-oriented React app that helps engineering leaders compare building advanced React UI in-house against using MUI/MUI X.

The app is a recommendation-first decision-support tool. The final user-facing output is a recommendation supported by probability/range evidence from a deterministic Monte Carlo-style simulation.

The app should answer:

> What path should this team take, and why?

It should not behave like a generic ROI calculator or a precise financial forecast.

## Stack constraints

Use only:

- React
- Vite
- JavaScript
- React Router
- MUI Core
- Netlify Functions
- localStorage for the current assessment/report flow

Do not add unless explicitly requested:

- TypeScript
- unit test frameworks
- Playwright/Cypress
- databases
- authentication
- charting libraries
- state-management libraries
- additional dependencies
- MUI X components inside this app

Use `.jsx` for React components and `.js` for utilities/functions.

## Core user journey

The core journey is:

```txt
/assess
→ user completes assessment
→ frontend builds payload
→ POST /.netlify/functions/simulate
→ function returns simulation result
→ frontend saves assessmentInput and simulationResult in localStorage
→ /report renders the result
```
