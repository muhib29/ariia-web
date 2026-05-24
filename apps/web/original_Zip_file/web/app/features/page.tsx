import { Header } from '../../components/homepage/header';
import { NewsletterFooter } from '../../components/homepage/footer';
import { FeaturesSection } from '../../components/homepage/FeaturesSection';

export default async function FeaturesPage() {
  return (
    <>
      <Header isHomePage={false} />
      <FeaturesSection />
      <NewsletterFooter isHomePage={false} />
    </>
  );
}
