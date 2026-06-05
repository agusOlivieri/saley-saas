'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PromoTabs from './PromoTabs';
import SummaryCards from './SummaryCards';
import PromoCard from './PromoCard';
import ReactivateModal from './ReactivateModal';
import { Plus } from 'lucide-react';

interface PromosClientProps {
  initialPromos: any[];
  currentFilter: string;
}

export default function PromosClient({ initialPromos, currentFilter }: PromosClientProps) {
  const [reactivatePromoId, setReactivatePromoId] = useState<string | null>(null);

  const filteredPromos = initialPromos.filter(promo => {
    if (currentFilter === 'activas') return promo.activa === true;
    if (currentFilter === 'finalizadas') return promo.activa === false;
    return true; // 'todas'
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-2xl font-bold text-blue-950 mb-1">Historial de promociones</h1>
          <p className="text-sm text-gray-500 mb-6">Revisa el rendimiento de tus promociones y gestiona tu catálogo.</p>
        </div>
        
        <Link 
          href="/promos/nueva" 
          className="bg-[#FF5A1F] hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-sm transition-colors text-sm whitespace-nowrap"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Nueva promoción</span>
        </Link>
      </div>

      <PromoTabs />
      <SummaryCards />

      <div className="space-y-4">
        {filteredPromos.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
            No tienes promociones {currentFilter !== 'todas' && currentFilter} para mostrar.
          </div>
        ) : (
          filteredPromos.map((promo) => (
            <PromoCard 
              key={promo.id} 
              promo={promo} 
              onReactivate={(id) => setReactivatePromoId(id)}
            />
          ))
        )}
      </div>

      {reactivatePromoId && (
        <ReactivateModal 
          promoId={reactivatePromoId} 
          onClose={() => setReactivatePromoId(null)}
          onSuccess={() => setReactivatePromoId(null)}
        />
      )}
    </div>
  );
}
