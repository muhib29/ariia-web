import StoryBehindAriia from '@/components/homepage/story-behind-ariia';
import { aboutQuery } from '@/graphql/querys';
import { fetchAPI } from '@/utils/api-helper';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StoryBehindAriiaPage() {
  const res = await fetchAPI(aboutQuery);

  const about = res?.data?.storyOfAriia ?? res?.data ?? {};

  // console.log('@about:', res, res?.data);
  return <StoryBehindAriia about={about} />;
}
