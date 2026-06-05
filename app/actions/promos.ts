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
      })
      .select()
      .single();

    if (error) {
      console.error('Error insertando promoción:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/promos');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getPromos() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, data: [] };

  const { data, error } = await supabase
    .from('promos')
    .select('*')
    .eq('comercio_id', user.id)
    .order('creado_el', { ascending: false });

  if (error) {
    console.error('Error fetching from promos', error);
    return { success: false, error: error.message };
  }

  return { success: true, data: data || [] };
}

export async function deletePromo(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('promos')
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/promos');
  return { success: true };
}

export async function reactivatePromo(id: string, fechaInicio: string, fechaFin: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('promos')
    .update({ 
      fecha_inicio: fechaInicio, 
      fecha_fin: fechaFin,
      activa: true 
    })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/promos');
  return { success: true };
}

export async function updatePromo(id: string, formData: any) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Usuario no autenticado' };
  }

  try {
    const { data, error } = await supabase
      .from('promos')
      .update({
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        tipo_beneficio: formData.tipo_beneficio,
        categoria: formData.categoria,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        hora_inicio: formData.hora_inicio,
        hora_fin: formData.hora_fin,
        activa: formData.activa,
      })
      .eq('id', id)
      .eq('comercio_id', user.id) // Security check
      .select()
      .single();

    if (error) {
      console.error('Error actualizando promoción:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/promos');
    revalidatePath(`/promos/${id}`);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
