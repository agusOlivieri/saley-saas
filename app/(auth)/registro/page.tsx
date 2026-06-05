'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '@/app/actions/auth'

export default function RegistroPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await signup(formData)
    
    if (result && !result.success) {
      setError(result.error || 'Ocurrió un error al registrarse')
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-blue-950 text-center mb-6">Crear cuenta comercial</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
            <input
              name="nombre"
              type="text"
              required
              className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-4 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all"
              placeholder="Ej. Juan"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido</label>
            <input
              name="apellido"
              type="text"
              required
              className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-4 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all"
              placeholder="Ej. Pérez"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Correo electrónico</label>
          <input
            name="email"
            type="email"
            required
            className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-4 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all"
            placeholder="tu@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full bg-[#F8FAFC] border border-gray-100 rounded-xl py-3 px-4 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all"
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        
        {error && <p className="text-sm text-red-500 font-medium text-center">{error}</p>}
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center shadow-sm transition-colors text-sm ${isLoading ? 'bg-orange-400 cursor-not-allowed' : 'bg-[#FF5A1F] hover:bg-orange-600'}`}
        >
          {isLoading ? 'Creando...' : 'Crear cuenta'}
        </button>
      </form>
      
      <p className="mt-6 text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="font-bold text-blue-900 hover:text-orange-500">
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  )
}
