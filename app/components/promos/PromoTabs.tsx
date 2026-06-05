'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function PromoTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get('filter') || 'todas';

  const setFilter = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('filter', filter);
    router.push(`?${params.toString()}`);
  };

  const tabs = [
    { id: 'todas', label: 'Todas' },
    { id: 'activas', label: 'Activas' },
    { id: 'finalizadas', label: 'Finalizadas' }
  ];

  return (
    <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = currentFilter === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${
              isActive 
                ? 'bg-blue-950 text-white border-blue-950' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
