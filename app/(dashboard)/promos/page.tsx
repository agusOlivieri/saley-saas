import { getPromos } from '@/app/actions/promos';
import PromosClient from '@/app/components/promos/PromosClient';

export default async function PromosPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { data: promos, success } = await getPromos();
  const resolvedSearchParams = await searchParams;
  const filter = resolvedSearchParams.filter || 'todas';

  return <PromosClient initialPromos={promos || []} currentFilter={filter} />;
}
