import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/common/Layout';
import HomePage from './pages/HomePage';
import CreateActivityPage from './pages/CreateActivityPage';
import EditActivityPage from './pages/EditActivityPage';
import ComingSoonPage from './pages/ComingSoonPage';
import LoginPage from './pages/LoginPage';
import CapacityPage from './pages/CapacityPage';
import ProgressPage from './pages/ProgressPage';
import ProtectedRoute from './components/common/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/hoy', element: <HomePage /> },
      { path: '/crear', element: <CreateActivityPage /> },
      { path: '/editar/:id', element: <EditActivityPage /> },
      { path: '/capacidad', element: <CapacityPage /> },
      { path: '/progreso', element: <ProgressPage /> },
      // Rutas con el mensaje de Próximamente
    ],
  },
]);
