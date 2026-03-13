import React from 'react';
import { Outlet } from 'react-router-dom'; // Importante para rutas anidadas
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top,_#0A753F_0%,_#06592F_28%,_#01230F_58%,_#001507_100%)]">
      {/* Sidebar fijo (Trazabilidad UX - Navegación coherente) */}
      <Sidebar />

      {/* Área de contenido principal */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto p-8">
          {/* Aquí se renderizarán HomePage, CreateActivityPage, etc. */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
