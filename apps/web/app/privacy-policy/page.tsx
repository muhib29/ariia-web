import { PrivacyPolicy } from '@/components/homepage/privacy-policy';
import { privacyPolicyQuery } from '@/graphql/querys';
import { fetchAPI } from '@/utils/api-helper';

export default async function PrivacyPage() {
  const res = await fetchAPI(privacyPolicyQuery);
  const policy = res?.data?.privacyPolicy ?? null;
  if (!policy) {
    return <div className="min-h-screen flex items-center justify-center">No privacy policy data available from Strapi.</div>;
  }
  console.log('privacy policy:', JSON.stringify(policy, null, 2));
  return <PrivacyPolicy policy={policy} />;
}
