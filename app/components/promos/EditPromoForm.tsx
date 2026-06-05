'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Sparkles, Calendar, Tag, Clock, Info, MapPin, Eye } from 'lucide-react';
import Link from 'next/link';
import { updatePromo } from '@/app/actions/promos';
import { useRouter } from 'next/navigation';

const promoSchema = z.object({
  titulo: z.string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(60, 'El título no puede superar los 60 caracteres'),
  tipo_beneficio: z.string().min(1, 'Selecciona un tipo de beneficio'),
  descripcion: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(200, 'La descripción no puede superar los 200 caracteres'),
  fecha_inicio: z.string().min(1, 'Fecha de inicio requerida'),
  fecha_fin: z.string().min(1, 'Fecha de fin requerida'),
  categoria: z.string().min(1, 'Selecciona una categoría'),
  hora_inicio: z.string().min(1, 'Hora de inicio requerida'),
  hora_fin: z.string().min(1, 'Hora de fin requerida'),
  activa: z.boolean(),
}).refine(data => new Date(data.fecha_fin) >= new Date(data.fecha_inicio), {
  message: 'La fecha de fin debe ser posterior a la fecha de inicio',
  path: ['fecha_fin']
});

type PromoFormValues = z.infer<typeof promoSchema>;

interface EditPromoFormProps {
  promoId: string;
  initialData: PromoFormValues;
}

export default function EditPromoForm({ promoId, initialData }: EditPromoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<PromoFormValues>({
    resolver: zodResolver(promoSchema),
    defaultValues: initialData
  });

  const tituloValue = watch('titulo') || '';
  const descripcionValue = watch('descripcion') || '';
  const fechaInicioVal = watch('fecha_inicio');
  const fechaFinVal = watch('fecha_fin');

  // Calcular duración en días
  const duracionDias = React.useMemo(() => {
    if (!fechaInicioVal || !fechaFinVal) return 0;
    const diffTime = Math.abs(new Date(fechaFinVal).getTime() - new Date(fechaInicioVal).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [fechaInicioVal, fechaFinVal]);

  const onSubmit = async (data: PromoFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await updatePromo(promoId, data);
      if (response.success) {
        alert('Promoción actualizada con éxito.');
        router.push(`/promos/${promoId}`);
      } else {
        alert('Error al actualizar: ' + response.error);
      }
    } catch (err) {
      alert('Error inesperado al actualizar la promoción.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-2 pb-10 space-y-6">
      
      {/* Header del Formulario */}
      <div className="flex items-center justify-between">
        <Link href={`/promos/${promoId}`} className="text-blue-950 flex items-center justify-center p-2 hover:bg-gray-50 rounded-full transition-colors" id="btn-back">
          <ArrowLeft size={20} />
        </Link>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-blue-950">Editar promoción</h2>
        <p className="text-xs text-gray-500 mt-1">Actualizá los datos de tu promoción.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" id="form-editar-promo">
        
        {/* Campo: Título */}
        <div className="space-y-2">
          <label htmlFor="titulo" className="block text-xs font-bold text-blue-950 uppercase tracking-wider">Título</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500">
              <Sparkles size={16} />
            </span>
            <input
              type="text"
              id="titulo"
              {...register('titulo')}
              placeholder="2x1 en Cafés Clásicos"
              className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 pl-10 pr-16 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all font-semibold"
              maxLength={60}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-mono">
              {tituloValue.length}/60
            </span>
          </div>
          {errors.titulo && <p className="text-xs text-red-500 font-medium" id="error-titulo">{errors.titulo.message}</p>}
        </div>

        {/* Campo: Tipo de Beneficio / Descuento */}
        <div className="space-y-2">
          <label htmlFor="tipo_beneficio" className="block text-xs font-bold text-blue-950 uppercase tracking-wider">Descuento</label>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <select
                id="tipo_beneficio"
                {...register('tipo_beneficio')}
                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-4 text-sm text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all"
              >
                <option value="2x1">2x1 (lleva 2, paga 1)</option>
                <option value="3x2">3x2 (lleva 3, paga 2)</option>
                <option value="20%">20% OFF</option>
                <option value="50%_segunda">50% en la segunda unidad</option>
                <option value="Precio_Especial">Precio especial</option>
              </select>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0 text-xl font-bold text-[#FF5A1F]">
              %
            </div>
          </div>
          {errors.tipo_beneficio && <p className="text-xs text-red-500 font-medium">{errors.tipo_beneficio.message}</p>}
        </div>

        {/* Campo: Descripción */}
        <div className="space-y-2">
          <label htmlFor="descripcion" className="block text-xs font-bold text-blue-950 uppercase tracking-wider">Descripción</label>
          <div className="relative">
            <textarea
              id="descripcion"
              {...register('descripcion')}
              placeholder="Disfrutá cualquier café clásico al 2x1. Válido en el local y para pedidos para llevar."
              className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-4 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all min-h-20 pr-16"
              maxLength={200}
            />
            <span className="absolute right-3 bottom-3 text-[10px] text-gray-400 font-mono">
              {descripcionValue.length}/200
            </span>
          </div>
          {errors.descripcion && <p className="text-xs text-red-500 font-medium" id="error-descripcion">{errors.descripcion.message}</p>}
        </div>

        {/* Campo: Duración (Fechas) */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-blue-950 uppercase tracking-wider">Duración</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Calendar size={16} />
              </span>
              <input
                type="date"
                id="fecha_inicio"
                {...register('fecha_inicio')}
                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 pl-10 pr-3 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Calendar size={16} />
              </span>
              <input
                type="date"
                id="fecha_fin"
                {...register('fecha_fin')}
                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 pl-10 pr-3 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all"
              />
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">La promoción estará activa por {duracionDias} {duracionDias === 1 ? 'día' : 'días'}.</p>
          {errors.fecha_fin && <p className="text-xs text-red-500 font-medium">{errors.fecha_fin.message}</p>}
        </div>

        {/* Campo: Categoría */}
        <div className="space-y-2">
          <label htmlFor="categoria" className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1">
            <Tag size={12} /> Categoría
          </label>
          <select
            id="categoria"
            {...register('categoria')}
            className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-4 text-sm text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all"
          >
            <option value="Bebidas">Bebidas</option>
            <option value="Comidas">Comidas</option>
            <option value="Combos">Combos</option>
            <option value="Postres">Postres</option>
          </select>
          {errors.categoria && <p className="text-xs text-red-500 font-medium">{errors.categoria.message}</p>}
        </div>

        {/* Campo: Horario */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1">
            <Clock size={12} /> Horario
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="time"
              id="hora_inicio"
              {...register('hora_inicio')}
              className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-4 text-sm text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all"
            />
            <input
              type="time"
              id="hora_fin"
              {...register('hora_fin')}
              className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-4 text-sm text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all"
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Todos los días de la semana</p>
        </div>

        {/* Toggle: Activar en tiempo real */}
        <div className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-blue-950">Promoción activa</span>
              <Info size={14} className="text-gray-400 cursor-pointer" />
            </div>
            <p className="text-[10px] text-gray-500">Puedes pausar la promoción desactivando esto.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="activa"
              {...register('activa')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>

        {/* Botón de Publicación */}
        <button
          type="submit"
          id="btn-submit"
          disabled={isSubmitting}
          className={`w-full text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors text-sm ${isSubmitting ? 'bg-orange-400 cursor-not-allowed' : 'bg-[#FF5A1F] hover:bg-orange-600'}`}
        >
          {isSubmitting ? (
            'Guardando...'
          ) : (
            'Guardar cambios'
          )}
        </button>

      </form>
    </div>
  );
}
