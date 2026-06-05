import React from 'react';
import { createClient } from '@/app/lib/supabase/server';
import { redirect } from 'next/navigation';
import EditPromoForm from '@/app/components/promos/EditPromoForm';

export default async function EditarPromoPage({ params }: { params: Promise<{ id: string }> }) {
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

  const initialData = {
    titulo: promo.titulo,
    descripcion: promo.descripcion,
    tipo_beneficio: promo.tipo_beneficio,
    categoria: promo.categoria,
    fecha_inicio: promo.fecha_inicio,
    fecha_fin: promo.fecha_fin,
    hora_inicio: promo.hora_inicio,
    hora_fin: promo.hora_fin,
    activa: promo.activa,
  };

  return <EditPromoForm promoId={promo.id} initialData={initialData} />;
}
