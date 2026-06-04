import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-blue-900 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">S.</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-950 leading-none">Saley</h1>
            <span className="text-xs text-gray-500">para Comercios</span>
          </div>
        </div>
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  )
}
