'use server';

import { createClient } from '@/app/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createPromo(formData: any) {
  const supabase = await createClient();

  // En un entorno real, primero obtenemos el comercio_id del usuario autenticado
  // const { data: { user } } = await supabase.auth.getUser();
  // const comercio_id = user?.id; // asumiendo que el ID del user = ID del comercio

  // Por ahora mockeamos el comercio_id (debes reemplazar esto con el ID real de tu comercio en Supabase)
  const mockComercioId = "6facc619-7dfc-4cb4-ad4e-82923a0141ff"; 

  try {
    const { data, error } = await supabase
      .from('promos')
      .insert({
        comercio_id: mockComercioId,
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
