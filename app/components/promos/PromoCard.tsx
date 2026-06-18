import React from 'react';
import Link from 'next/link';
import { Eye, MessageCircle, Calendar, Tag, ChevronRight } from 'lucide-react';
import PromoDetailsLink from './PromoDetailsLink';

interface Promo {
  id: string;
  titulo: string;
  categoria: string;
  fecha_inicio: string;
  fecha_fin: string;
  activa: boolean;
  vistas?: number;
  interacciones?: number;
}

interface PromoCardProps {
  promo: Promo;
  onReactivate?: (id: string) => void;
}

// Función simple para generar un color de fondo genérico basado en el texto
const getGenericColor = (text: string) => {
  const colors = [
    'from-orange-400 to-red-500',
    'from-blue-400 to-indigo-500',
    'from-green-400 to-emerald-500',
    'from-purple-400 to-pink-500',
    'from-yellow-400 to-orange-500',
  ];
  const index = text.length % colors.length;
  return colors[index];
};

export default function PromoCard({ promo, onReactivate }: PromoCardProps) {
  // En la vida real, determinaríamos si está vencida comparando fecha_fin con hoy.
  // Por simplicidad en el MVP, usaremos la propiedad `activa`.
  const isFinished = !promo.activa;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };

  const bgColorClass = getGenericColor(promo.titulo || promo.categoria);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 items-center relative overflow-hidden transition-all hover:shadow-md">
      {/* Generic Image/Color block */}
      <div className={`w-24 h-24 rounded-xl shrink-0 bg-linear-to-br ${bgColorClass} flex items-center justify-center text-white text-center p-2 font-bold leading-tight shadow-inner`}>
        {promo.titulo}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-bold text-blue-950 truncate pr-2">{promo.titulo}</h4>
          {isFinished ? (
            <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-200">Finalizada</span>
          ) : (
            <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200">Activa</span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-1">
          <Tag size={10} />
          <span>{promo.categoria}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-3">
          <Calendar size={10} />
          <span>{formatDate(promo.fecha_inicio)} - {formatDate(promo.fecha_fin)}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Eye size={12} className="text-blue-500" />
            <div>
              <p className="text-xs font-bold text-gray-800 leading-none">{promo.vistas ?? 0}</p>
              <p className="text-[8px] text-gray-500">Visualizaciones</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageCircle size={12} className="text-blue-500" />
            <div>
              <p className="text-xs font-bold text-gray-800 leading-none">{promo.interacciones ?? 0}</p>
              <p className="text-[8px] text-gray-500">Interacciones</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-col items-end justify-between self-stretch">
        <PromoDetailsLink id={promo.id} />

        {isFinished && onReactivate && (
          <button
            onClick={() => onReactivate(promo.id)}
            className="text-[10px] font-semibold text-gray-600 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            Volver a activar
          </button>
        )}
      </div>
    </div>
  );
}
