import { fetchAPI } from '@/utils/api-helper';
import { careerSlugQuery } from '@/graphql/querys';
import { CareerDetailClient } from '@/components/careers/CareerDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await fetchAPI(careerSlugQuery, { slug });

  const careerData = res?.data?.careers?.[0] ?? {};

  return <CareerDetailClient careerData={careerData} />;
}
