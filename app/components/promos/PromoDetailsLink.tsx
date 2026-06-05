import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface PromoDetailsLinkProps {
  id: string;
  size?: number;
  className?: string;
}

export default function PromoDetailsLink({ id, size = 20, className = "p-1 text-gray-400 hover:text-blue-600 transition-colors" }: PromoDetailsLinkProps) {
  return (
    <Link 
      href={`/promos/${id}`} 
      className={className}
    >
      <ChevronRight size={size} />
    </Link>
  );
}
