'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, MessageCircle, Users, ExternalLink, MapPin, ChevronRight, BarChart2 } from 'lucide-react';
import Link from 'next/link';

const performanceData = [
  { name: 'Lun', visualizaciones: 1500, interacciones: 200 },
  { name: 'Mar', visualizaciones: 3000, interacciones: 1800 },
  { name: 'Mié', visualizaciones: 4800, interacciones: 1000 },
  { name: 'Jue', visualizaciones: 4500, interacciones: 2800 },
  { name: 'Vie', visualizaciones: 6000, interacciones: 1800 },
  { name: 'Sáb', visualizaciones: 7000, interacciones: 3200 },
  { name: 'Dom', visualizaciones: 5800, interacciones: 2000 },
];

export default function DashboardPage() {
  return (
    <div className="pt-4 pb-10 space-y-6">
      
      {/* Saludo y CTA */}
      <section>
        <h2 className="text-2xl font-bold text-blue-950">Hola, Café de Barrio</h2>
        <p className="text-sm text-gray-500 mt-1 mb-4">Atraé más clientes cerca de tu local y medí resultados.</p>
        <Link 
          href="/promos/nueva" 
          className="w-full bg-[#FF5A1F] hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
        >
          <span className="text-xl leading-none text-[#FF5A1F] bg-white rounded-full px-1">+</span> Crear promoción
        </Link>
      </section>

      {/* Tarjetas de Métricas */}
      <section className="grid grid-cols-3 gap-3">
        <StatCard title="Visualizaciones" value="12.458" increase="23%" icon={<Eye size={16} className="text-blue-600" />} />
        <StatCard title="Interacciones" value="1.245" increase="18%" icon={<MessageCircle size={16} className="text-blue-600" />} />
        <StatCard title="Clientes alcanzados" value="892" increase="31%" icon={<Users size={16} className="text-blue-600" />} />
      </section>

      {/* Gráfico de Rendimiento */}
      <section className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-gray-800">Rendimiento de los últimos 7 días</h3>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-900"></div> Visualizaciones</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Interacciones</span>
            </div>
          </div>
          <select className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-gray-600 outline-none">
            <option>Últimos 7 días</option>
            <option>Último mes</option>
          </select>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <Tooltip />
              <Area type="monotone" dataKey="visualizaciones" stroke="#1e3a8a" strokeWidth={2} fillOpacity={1} fill="url(#colorVis)" />
              <Area type="monotone" dataKey="interacciones" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorInt)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Mapa de Interacción (Placeholder para Mapbox) */}
      <section className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800 flex items-center gap-1">Mapa de interacción <span className="text-gray-400 text-xs text-center border border-gray-300 rounded-full w-4 h-4 leading-3">i</span></h3>
          <button className="text-xs flex items-center gap-1 text-gray-500 border border-gray-200 rounded-lg px-2 py-1">
            Ver en mapa <ExternalLink size={12} />
          </button>
        </div>
        <div className="bg-gray-100 w-full h-40 rounded-xl relative overflow-hidden flex items-center justify-center">
          {/* Aquí iría la integración real con React Map GL / Mapbox */}
          <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-58.43,-34.60,12/600x300?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJja3Bq...' )] bg-cover opacity-50"></div>
          <div className="absolute z-10 w-8 h-8 bg-blue-950 rounded-full flex items-center justify-center border-2 border-white shadow-md">
            <MapPin size={16} className="text-white" />
          </div>
          <p className="z-10 absolute bottom-2 text-xs font-semibold text-blue-900 bg-white/80 px-2 py-1 rounded">Vista previa del Heatmap</p>
        </div>
      </section>

      {/* Promociones Activas */}
      <section className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Promociones activas</h3>
          <button className="text-xs font-semibold text-orange-500">Ver todas</button>
        </div>
        <div className="space-y-4">
          <PromoItem title="2x1 en Cafés" schedule="Todos los días • 8 AM - 12 PM" status="Activa" interactions="642" color="bg-orange-100" />
          <PromoItem title="Desayuno Completo" schedule="Lun a Vie • 7 AM - 11 AM" status="Activa" interactions="321" color="bg-amber-100" />
          <PromoItem title="Happy Hour Merienda" schedule="Todos los días • 16 PM - 19 PM" status="Activa" interactions="282" color="bg-green-100" />
        </div>
      </section>

    </div>
  );
}

function StatCard({ title, value, increase, icon }: { title: string, value: string, increase: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-semibold text-gray-500 leading-tight">{title}</span>
        <div className="bg-blue-50 p-1 rounded-full">{icon}</div>
      </div>
      <div>
        <p className="text-xl font-bold text-gray-800">{value}</p>
        <p className="text-[10px] font-medium text-green-600 mt-1 flex items-center gap-1">
          <span className="leading-none mb-0.5">↗</span> {increase} vs ayer
        </p>
      </div>
    </div>
  );
}

function PromoItem({ title, schedule, status, interactions, color }: { title: string, schedule: string, status: string, interactions: string, color: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
          ☕
        </div>
        <div>
          <h4 className="font-bold text-sm text-gray-800">{title}</h4>
          <p className="text-xs text-gray-500">{schedule}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{status}</span>
        <span className="text-[10px] text-gray-500 flex items-center gap-1">
          <BarChart2 size={10} /> {interactions} interacciones
        </span>
      </div>
      <ChevronRight size={16} className="text-gray-300 ml-2" />
    </div>
  );
}
