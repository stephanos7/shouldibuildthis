import { createBrowserRouter } from 'react-router-dom';
import AppShell from './components/AppShell.jsx';
import HomePage from './pages/HomePage.jsx';
import AssessPage from './pages/AssessPage.jsx';
import ReportPage from './pages/ReportPage.jsx';
import MethodologyPage from './pages/MethodologyPage.jsx';
import AdminCalibrationPage from './pages/AdminCalibrationPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'assess',
        element: <AssessPage />,
      },
      {
        path: 'report',
        element: <ReportPage />,
      },
      {
        path: 'methodology',
        element: <MethodologyPage />,
      },
      {
        path: 'admin/calibration',
        element: <AdminCalibrationPage />,
      },
    ],
  },
]);

export default router;
