import React from 'react';
import { createClient } from '@/app/lib/supabase/server';
import { redirect } from 'next/navigation';
import DeletePromoButton from './DeletePromoButton';
import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';

export default async function PromoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const resolvedParams = await params;

  const { data: promo, error } = await supabase
    .from('promos')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (error || !promo || promo.comercio_id !== user.id) {
    redirect('/promos');
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/promos" className="flex items-center gap-2 text-gray-500 hover:text-blue-900 transition-colors mb-6 text-sm font-semibold">
        <ArrowLeft size={16} /> Volver al historial
      </Link>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-950 mb-2">{promo.titulo}</h1>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${promo.activa ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
              {promo.activa ? 'Activa' : 'Finalizada'}
            </span>
          </div>
          
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors">
              <Edit size={16} /> Editar
            </button>
            <DeletePromoButton id={promo.id} />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Descripción</h3>
            <p className="text-gray-800">{promo.descripcion}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Categoría</h3>
              <p className="text-gray-800 font-medium">{promo.categoria}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tipo de Beneficio</h3>
              <p className="text-gray-800 font-medium">{promo.tipo_beneficio}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Vigencia</h3>
              <p className="text-blue-950 font-bold">{formatDate(promo.fecha_inicio)}</p>
              <p className="text-blue-950 font-bold">al {formatDate(promo.fecha_fin)}</p>
            </div>
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Horario</h3>
              <p className="text-blue-950 font-bold">{promo.hora_inicio.slice(0,5)} a {promo.hora_fin.slice(0,5)} hs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
