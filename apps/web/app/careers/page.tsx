import { CareersSection } from '@/components/homepage/careers-section';
import { allCareersQuery, careerQuery } from '@/graphql/querys';
import { fetchAPI } from '@/utils/api-helper';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CareersPage() {
  const [pageRes, careersRes] = await Promise.all([fetchAPI(careerQuery), fetchAPI(allCareersQuery)]);

  const careerPage = pageRes?.data?.careerPage || {};
  const allCareers = careersRes?.data?.careers || [];

  const career = {
    ...careerPage,
    career_details: allCareers.length > 0 ? allCareers : (careerPage?.career_details ?? []),
  };

  return <CareersSection career={career} />;
}
