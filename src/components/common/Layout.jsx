import React from 'react';
import { Outlet } from 'react-router-dom'; // Importante para rutas anidadas
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-[#0b0f1a]">
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
