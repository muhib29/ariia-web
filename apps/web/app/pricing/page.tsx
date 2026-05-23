import { Header } from '../../components/homepage/header';
import { NewsletterFooter } from '../../components/homepage/footer';
import { PricingSection } from '../../components/homepage/pricing-section';
import { pricingQuery } from '../../graphql/querys';
import { fetchAPI } from '../../utils/api-helper';

const PRICE_PER_MINUTE = 0.22;
const MIN_MINUTES = 1;
const MAX_MINUTES = 6000;

export default async function PricingPage() {
  const res = await fetchAPI(pricingQuery);
  const pricing = res?.data?.pricing || {};

  // console.log('Pricing Data:', JSON.stringify(pricing, null, 2));

  return (
    <>
      <Header isHomePage={false} />
      <PricingSection pricing={pricing} />
      <NewsletterFooter isHomePage={false} />
    </>
  );
}
