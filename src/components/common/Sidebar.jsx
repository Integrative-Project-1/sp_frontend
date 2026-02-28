import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  FileCheck,
  Settings,
  Plus,
  GraduationCap,
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  // Configuración de los links del menú traducidos
  const menuItems = [
    { name: 'Panel Principal', icon: LayoutDashboard, path: '/' },
    { name: 'Calendario', icon: Calendar, path: '/calendario' },
    { name: 'Cursos', icon: BookOpen, path: '/cursos' },
    { name: 'Evaluaciones', icon: FileCheck, path: '/evaluaciones' },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0f172a] border-r border-gray-800 flex flex-col p-6 sticky top-0">
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-blue-500 p-2 rounded-xl shadow-lg shadow-blue-500/30">
          <GraduationCap className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">StudyPlanner</span>
      </div>

      {/* User Profile Section */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-12 h-12 rounded-full bg-orange-100 border-2 border-orange-200 flex items-center justify-center overflow-hidden">
          {/* Imagen de perfil placeholder */}
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jorge"
            alt="Avatar de usuario"
          />
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm">Jorge</h4>
          <p className="text-gray-500 text-xs">Ingeniería de Sistemas</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
              ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }
            `}
          >
            <item.icon size={20} />
            <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Action Button (US-01 Entry Point) */}
      <button
        onClick={() => navigate('/crear')}
        className="mt-auto bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
      >
        <Plus size={20} />
        Nueva Actividad
      </button>
    </aside>
  );
};

export default Sidebar;
