'use client'

import { useState, useCallback } from 'react'
import { completeOnboarding } from '@/app/actions/auth'
import { MapPin } from 'lucide-react'
import LocationPicker from '@/app/components/ui/LocationPicker'

export default function OnboardingPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [coordinates, setCoordinates] = useState({ lat: -34.6037, lng: -58.3816 })

  const handleLocationChange = useCallback((lat: number, lng: number) => {
    setCoordinates({ lat, lng })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    // Agregamos las coordenadas al FormData
    formData.append('latitude', coordinates.lat.toString())
    formData.append('longitude', coordinates.lng.toString())
    
    const result = await completeOnboarding(formData)
    
    if (result && !result.success) {
      setError(result.error || 'Ocurrió un error al guardar tu perfil')
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-blue-950 text-center mb-2">Completar Perfil</h2>
      <p className="text-sm text-gray-500 text-center mb-6">Necesitamos conocer la ubicación y detalles de tu local para poder mostrar tus ofertas a clientes cercanos.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Nombre del Comercio</label>
          <input
            name="nombre_comercial"
            type="text"
            required
            className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-4 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all"
            placeholder="Ej. Café de Barrio"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Categoría Principal</label>
          <select
            name="categoria"
            required
            className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-4 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all"
          >
            <option value="Bebidas">Bebidas / Cafetería</option>
            <option value="Restaurante">Restaurante</option>
            <option value="Indumentaria">Indumentaria</option>
            <option value="Servicios">Servicios</option>
            <option value="Entretenimiento">Entretenimiento</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Descripción (Opcional)</label>
          <textarea
            name="descripcion"
            className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-4 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all min-h-[60px]"
            placeholder="Breve descripción de tu local..."
          />
        </div>

        <div className="pt-2 border-t border-gray-100">
          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider flex items-center gap-1">
            <MapPin size={14} className="text-orange-500" /> Dirección Exacta
          </label>
          <input
            name="direccion_texto"
            type="text"
            required
            className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-4 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all mb-4"
            placeholder="Ej. Av. Corrientes 1234, CABA"
          />
          
          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
            Ubicación en el Mapa
          </label>
          <LocationPicker onLocationChange={handleLocationChange} />
          
          <div className="bg-blue-50/50 p-3 mt-3 rounded-lg flex items-start gap-2 border border-blue-100">
            <MapPin size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-gray-600 leading-tight">
              Asegúrate de marcar la ubicación exacta en el mapa. Los clientes verán tus ofertas únicamente si están geográficamente cerca de este marcador.
            </p>
          </div>
        </div>
        
        {error && <p className="text-sm text-red-500 font-medium text-center pt-2">{error}</p>}
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full mt-4 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center shadow-sm transition-colors text-sm ${isLoading ? 'bg-orange-400 cursor-not-allowed' : 'bg-[#FF5A1F] hover:bg-orange-600'}`}
        >
          {isLoading ? 'Guardando...' : 'Finalizar configuración'}
        </button>
      </form>
    </div>
  )
}
