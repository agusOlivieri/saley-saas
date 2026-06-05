'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, UserCog, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';

export default function DashboardNotFound() {
  const pathname = usePathname();

  // Detect which section the user wanted to enter
  const isMetrics = pathname?.includes('analiticas');
  const isProfile = pathname?.includes('perfil');

  // Customize UI text and icon based on route
  let icon = <AlertCircle size={48} className="text-[#FF5A1F]" />;
  let subtitle = "Página no encontrada";
  let description = "La sección que estás buscando no existe o aún no está disponible en la plataforma.";
  let accentColor = "bg-orange-50 text-[#FF5A1F]";
  let iconBg = "bg-orange-50 border-orange-100";

  if (isMetrics) {
    icon = <BarChart3 size={48} className="text-blue-950 animate-pulse" />;
    subtitle = "Panel de Analíticas";
    description = "Pronto vas a poder medir en detalle el rendimiento, visualizaciones e interacciones de tus promociones en tiempo real.";
    accentColor = "bg-blue-50 text-blue-950";
    iconBg = "bg-blue-50 border-blue-100";
  } else if (isProfile) {
    icon = <UserCog size={48} className="text-blue-950" />;
    subtitle = "Configuración del Perfil";
    description = "La sección de configuración de perfil y comercio estará lista muy pronto para que puedas gestionar tus datos y credenciales.";
    accentColor = "bg-blue-50 text-blue-950";
    iconBg = "bg-blue-50 border-blue-100";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-8 animate-fade-in">
      {/* Decorative floating sparkles */}
      <div className="relative w-full max-w-xs flex justify-center mb-6">

        {/* Outer Icon Ring with soft pulse */}
        <div className={`relative w-28 h-28 rounded-full border flex items-center justify-center shadow-sm ${iconBg}`}>
          <div className="absolute inset-0 rounded-full bg-current opacity-5 animate-ping" />
          <div className="relative z-10">
            {icon}
          </div>
        </div>
      </div>

      {/* Main Badges */}
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 ${accentColor} border border-current/10 shadow-sm`}>
        {isMetrics || isProfile ? 'Próxima funcionalidad' : '404'}
      </span>

      {/* Hero Headings */}
      <h1 className="text-4xl font-extrabold text-blue-950 tracking-tight leading-none mb-2">
        Próximamente!
      </h1>
      <h2 className="text-lg font-bold text-gray-700 mb-3">
        {subtitle}
      </h2>

      {/* Explanatory description */}
      <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-8">
        {description}
      </p>

      {/* CTA Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-[#FF5A1F] hover:bg-orange-600 active:scale-95 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all duration-200"
      >
        <ArrowLeft size={18} />
        Volver al Dashboard
      </Link>
    </div>
  );
}
