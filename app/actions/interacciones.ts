'use server';

import { createClient } from '@/app/lib/supabase/server';

export async function getTotalesMetricas(periodo: '7d' | '30d' = '7d') {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Usuario no autenticado', data: null };

  const dias = periodo === '7d' ? 7 : 30;
  const desde = new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('interacciones')
    .select('tipo_accion, consumidor_id')
    .gte('creado_el', desde);

  if (error) {
    console.error('Error fetching totales de métricas:', error);
    return { success: false, error: error.message, data: null };
  }

  const rows = data || [];
  const vistas = rows.filter(r => r.tipo_accion === 'vista').length;
  const interacciones = rows.filter(r => r.tipo_accion === 'interaccion').length;
  const consumidores = new Set(rows.map(r => r.consumidor_id).filter(Boolean)).size;

  return { success: true, data: { vistas, interacciones, consumidores } };
}

export async function getRendimientoPorDia(periodo: '7d' | '30d' = '7d') {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Usuario no autenticado', data: null };

  const dias = periodo === '7d' ? 7 : 30;
  const desde = new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('interacciones')
    .select('tipo_accion, creado_el')
    .gte('creado_el', desde);

  if (error) {
    console.error('Error fetching rendimiento por día:', error);
    return { success: false, error: error.message, data: null };
  }

  const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const ordenSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const agrupado: Record<string, { visualizaciones: number; interacciones: number }> = {};

  (data || []).forEach(row => {
    const fecha = new Date(row.creado_el);
    const key = nombresDias[fecha.getDay()];
    if (!agrupado[key]) agrupado[key] = { visualizaciones: 0, interacciones: 0 };
    if (row.tipo_accion === 'vista') {
      agrupado[key].visualizaciones++;
    } else {
      agrupado[key].interacciones++;
    }
  });

  const resultado = ordenSemana.map(dia => ({
    name: dia,
    visualizaciones: agrupado[dia]?.visualizaciones ?? 0,
    interacciones: agrupado[dia]?.interacciones ?? 0,
  }));

  return { success: true, data: resultado };
}

export async function getInteraccionesPorPromo() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Usuario no autenticado', data: null };

  const { data, error } = await supabase
    .from('interacciones')
    .select('oferta_id, tipo_accion');

  if (error) {
    console.error('Error fetching interacciones por promo:', error);
    return { success: false, error: error.message, data: null };
  }

  const mapa = (data || []).reduce<Record<string, { vistas: number; interacciones: number }>>((acc, row) => {
    const id = row.oferta_id;
    if (!id) return acc;
    if (!acc[id]) acc[id] = { vistas: 0, interacciones: 0 };
    if (row.tipo_accion === 'vista') {
      acc[id].vistas++;
    } else {
      acc[id].interacciones++;
    }
    return acc;
  }, {});

  return { success: true, data: mapa };
}
