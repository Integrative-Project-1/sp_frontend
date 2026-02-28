import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/common/Layout';
import HomePage from './pages/HomePage';
import CreateActivityPage from './pages/CreateActivityPage';
import EditActivityPage from './pages/EditActivityPage';
import ComingSoonPage from './pages/ComingSoonPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/hoy', element: <HomePage /> },
      { path: '/crear', element: <CreateActivityPage /> },
      { path: '/editar/:id', element: <EditActivityPage /> },
      // Rutas con el mensaje de Próximamente
      { path: '/calendario', element: <ComingSoonPage title="Calendario" /> },
      { path: '/cursos', element: <ComingSoonPage title="Mis Cursos" /> },
      { path: '/evaluaciones', element: <ComingSoonPage title="Evaluaciones" /> },
    ],
  },
]);
