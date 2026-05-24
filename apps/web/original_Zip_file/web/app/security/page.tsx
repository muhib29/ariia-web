import { SecurityPageSection } from '../../components/homepage/security-page';
import { fetchAPI } from '../../utils/api-helper';
import { homeQuery } from '../../graphql/querys';

export default async function SecurityPage() {
  const res = await fetchAPI(homeQuery);
  const securitySection = res?.data?.home?.securitySection;
  console.log('Fetched securitySection data:', securitySection);
  const securityProps = securitySection
    ? {
        header: securitySection.header || {},
        imageWithContent: (securitySection.imageWithContent || []).map((item: any) => ({
          id: item.id,
          image: item.image?.url || null,
          description: item.description,
        })),
      }
    : {};

  return <SecurityPageSection security={securityProps} />;
}
