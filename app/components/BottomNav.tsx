'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Tags, BarChart2, User } from 'lucide-react';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center gap-1 transition-colors ${
        active ? 'text-blue-900' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      {icon}
      <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 z-50">
      <div className="flex justify-between items-center h-16 px-6">
        <NavItem href="/" icon={<Home size={24} />} label="Dashboard" active={isActive('/')} />
        <NavItem href="/promos" icon={<Tags size={24} />} label="Promos" active={isActive('/promos')} />
        <NavItem href="/analiticas" icon={<BarChart2 size={24} />} label="Analíticas" active={isActive('/analiticas')} />
        <NavItem href="/perfil" icon={<User size={24} />} label="Perfil" active={isActive('/perfil')} />
      </div>
    </nav>
  );
}
