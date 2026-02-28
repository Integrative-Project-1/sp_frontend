import React from 'react';
import { Construction } from 'lucide-react';

const ComingSoonPage = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="p-4 bg-blue-500/10 rounded-full text-blue-400">
        <Construction size={48} />
      </div>
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      <p className="text-gray-400 max-w-md">Estamos trabajando para esta sección.</p>
      <div className="inline-block px-4 py-1 bg-gray-800 rounded-full text-xs font-medium text-gray-500 uppercase tracking-widest">
        Próximamente
      </div>
    </div>
  );
};

export default ComingSoonPage;
