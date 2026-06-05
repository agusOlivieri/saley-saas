'use client';

import React, { useState } from 'react';
import { reactivatePromo } from '@/app/actions/promos';
import { X } from 'lucide-react';

interface ReactivateModalProps {
  promoId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReactivateModal({ promoId, onClose, onSuccess }: ReactivateModalProps) {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await reactivatePromo(promoId, fechaInicio, fechaFin);
    if (res?.success) {
      onSuccess();
    } else {
      setError(res?.error || 'Error al reactivar la promoción');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative shadow-xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        
        <h3 className="text-lg font-bold text-blue-950 mb-2">Volver a activar</h3>
        <p className="text-sm text-gray-500 mb-6">Selecciona las nuevas fechas de validez para esta promoción.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Nueva Fecha de Inicio</label>
            <input 
              type="date" 
              required
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Nueva Fecha de Fin</label>
            <input 
              type="date" 
              required
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 py-2.5 bg-[#FF5A1F] text-white font-bold rounded-xl text-sm hover:bg-orange-600 transition-colors disabled:bg-orange-300"
            >
              {isLoading ? 'Activando...' : 'Activar Promo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
