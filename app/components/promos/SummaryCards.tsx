import React from 'react';
import { Eye, MessageCircle, Percent, Target } from 'lucide-react';

export default function SummaryCards() {
  return (
    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-bold text-gray-800 text-sm">Resumen del historial</h3>
          <p className="text-xs text-gray-500">Últimos 90 días</p>
        </div>
        <select className="bg-white border border-gray-200 text-gray-700 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option>Últimos 90 días</option>
          <option>Últimos 30 días</option>
          <option>Últimos 7 días</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Visualizaciones */}
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-2">
            <Eye size={16} className="text-blue-500" />
          </div>
          <p className="text-[10px] text-gray-500 font-semibold mb-1">Visualizaciones</p>
          <p className="text-lg font-bold text-gray-900 leading-none mb-1">28.456</p>
          <p className="text-[10px] text-green-600 font-medium flex items-center gap-1">
            ↑ 24% <span className="text-gray-400 font-normal">vs anterior</span>
          </p>
        </div>

        {/* Interacciones */}
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-2">
            <MessageCircle size={16} className="text-blue-500" />
          </div>
          <p className="text-[10px] text-gray-500 font-semibold mb-1">Interacciones</p>
          <p className="text-lg font-bold text-gray-900 leading-none mb-1">6.243</p>
          <p className="text-[10px] text-green-600 font-medium flex items-center gap-1">
            ↑ 18% <span className="text-gray-400 font-normal">vs anterior</span>
          </p>
        </div>

        {/* Tasa de interacción */}
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-2">
            <Percent size={16} className="text-blue-500" />
          </div>
          <p className="text-[10px] text-gray-500 font-semibold mb-1">Tasa de interacción</p>
          <p className="text-lg font-bold text-gray-900 leading-none mb-1">21,9%</p>
          <p className="text-[10px] text-green-600 font-medium flex items-center gap-1">
            ↑ 2,1 pp <span className="text-gray-400 font-normal">vs anterior</span>
          </p>
        </div>

        {/* Prom. completadas */}
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-2">
            <Target size={16} className="text-blue-500" />
          </div>
          <p className="text-[10px] text-gray-500 font-semibold mb-1">Prom. completadas</p>
          <p className="text-lg font-bold text-gray-900 leading-none mb-1">12</p>
          <p className="text-[10px] text-green-600 font-medium flex items-center gap-1">
            ↑ 20% <span className="text-gray-400 font-normal">vs anterior</span>
          </p>
        </div>
      </div>
    </div>
  );
}
