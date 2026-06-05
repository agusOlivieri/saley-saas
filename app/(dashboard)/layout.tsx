import { Bell } from 'lucide-react';
import Logo from '@/app/components/Logo';
import { createClient } from '@/app/lib/supabase/server';
import BottomNav from '@/app/components/BottomNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const nombre = user?.user_metadata?.nombre || '';
  const apellido = user?.user_metadata?.apellido || '';
  const initials = nombre && apellido
    ? `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
    : 'CB';

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 md:pb-0 flex justify-center">
      {/* Contenedor simulando la vista Mobile-First */}
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-sm flex flex-col">

        {/* Top Header Global */}
        <header className="flex justify-between items-center py-3 px-4 bg-white sticky top-0 z-10">
          <Logo />
          <div className="flex items-center gap-3">
            <button className="text-gray-600 relative" data-testid="notification-btn">
              <Bell size={24} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full border border-white"></span>
            </button>
            <div className="w-9 h-9 bg-blue-950 text-white rounded-full flex items-center justify-center font-semibold text-sm" data-testid="user-avatar">
              {initials}
            </div>
          </div>
        </header>

        {/* Contenido Específico de la Página */}
        <main className="flex-1 overflow-y-auto px-4 pb-6">
          {children}
        </main>

        {/* Navegación Inferior */}
        <BottomNav />
      </div>
    </div>
  );
}
