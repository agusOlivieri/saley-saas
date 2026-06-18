import { getPromos } from '@/app/actions/promos';
import { getInteraccionesPorPromo } from '@/app/actions/interacciones';
import PromosClient from '@/app/components/promos/PromosClient';

export default async function PromosPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const [{ data: promos, success }, { data: interaccionesMap }] = await Promise.all([
    getPromos(),
    getInteraccionesPorPromo()
  ]);

  const resolvedSearchParams = await searchParams;
  const filter = resolvedSearchParams.filter || 'todas';

  return <PromosClient initialPromos={promos || []} currentFilter={filter} interaccionesMap={interaccionesMap || {}} />;
}
