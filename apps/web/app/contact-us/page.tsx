import { ContactUs } from '../../components/homepage/contact-us';
import { contactUsQuery } from '../../graphql/querys';
import { fetchAPI } from '../../utils/api-helper';

export const revalidate = 60;

export default async function ContactPage() {
  const res = await fetchAPI(contactUsQuery);
  const contact = res?.data?.contactUs || {};
  return <ContactUs contact={contact} />;
}
