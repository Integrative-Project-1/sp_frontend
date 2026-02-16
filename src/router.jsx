import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/common/Layout';
import HomePage from './pages/HomePage';
import CreateActivityPage from './pages/CreateActivityPage';
import ActivityDetailPage from './pages/ActivityDetailPage';
import ProgressPage from './pages/ProgressPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/hoy', element: <HomePage /> },
      { path: '/crear', element: <CreateActivityPage /> },
      { path: '/actividad/:id', element: <ActivityDetailPage /> },
      { path: '/progreso', element: <ProgressPage /> },
    ],
  },
]);
