import React from 'react';

const StatCard = ({ title, value, footer, icon: Icon, colorClass, bgColorClass }) => (
  <div className="bg-[#1e293b]/50 border border-gray-800 p-5 rounded-2xl flex flex-col justify-between hover:bg-[#1e293b]/80 transition-all">
    <div className="flex justify-between items-start">
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      {/* Contenedor del icono con color de fondo suave */}
      <div className={`p-2 rounded-xl ${bgColorClass} ${colorClass}`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="mt-4">
      <p className="text-3xl font-bold text-white">{value}</p>
      {/* Texto inferior con el color correspondiente */}
      <p className={`text-xs mt-1 font-medium ${colorClass}`}>{footer}</p>
    </div>
  </div>
);

export default StatCard;
