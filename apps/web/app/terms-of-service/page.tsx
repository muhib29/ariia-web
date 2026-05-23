import { TermsOfService } from '@/components/homepage/terms-of-service';
import { termsOfServiceQuery } from '@/graphql/querys';
import { fetchAPI } from '@/utils/api-helper';

export default async function TermsPage() {
  const res = await fetchAPI(termsOfServiceQuery);
  const terms = res?.data?.termOfService ?? null;
  if (!terms) {
    return <div className="min-h-screen flex items-center justify-center">No terms of service data available from Strapi.</div>;
  }
  return <TermsOfService terms={terms} />;
}
