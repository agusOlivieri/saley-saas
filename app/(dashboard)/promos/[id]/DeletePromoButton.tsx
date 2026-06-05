'use client';

import React, { useState } from 'react';
import { deletePromo } from '@/app/actions/promos';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeletePromoButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta promoción?')) return;

    setIsDeleting(true);
    const res = await deletePromo(id);
    if (res?.success) {
      router.push('/promos');
    } else {
      alert(res?.error || 'Error al eliminar');
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
    >
      <Trash2 size={16} /> {isDeleting ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
}
