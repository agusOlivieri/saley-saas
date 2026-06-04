'use server';

import { createClient } from '@/app/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createPromo(formData: any) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Usuario no autenticado' };
  }
  const comercioId = user.id;

  try {
    const { data, error } = await supabase
      .from('promos')
      .insert({
        comercio_id: comercioId,
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        tipo_beneficio: formData.tipo_beneficio,
        categoria: formData.categoria,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        hora_inicio: formData.hora_inicio,
        hora_fin: formData.hora_fin,
        activa: formData.activa,
        // dias_semana: [1,2,3,4,5,6,7] // asumiendo 'todos los dias' por defecto
      })
      .select()
      .single();

    if (error) {
      console.error('Error insertando promoción:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/'); // Revalidar el dashboard para que muestre la nueva promo
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getPromos() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, data: [] };

  // Intentamos primero con la tabla 'ofertas' según migration.sql, o 'promos' según promos.ts
  const { data, error } = await supabase
    .from('promos')
    .select('*')
    .eq('comercio_id', user.id)
    .order('creado_el', { ascending: false });

  if (error) {
    console.error('Error fetching from promos', error);
  }

  return { success: true, data: data || [] };
}
