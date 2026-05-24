import { CustomersSection } from '../../components/homepage/customers-section';
import { allCustomersQuery } from '../../graphql/querys';
import { fetchAPI } from '../../utils/api-helper';

export default async function CustomersPage() {
  const res = await fetchAPI(allCustomersQuery);
  const customers =
    res?.data?.customers?.map((customer: any) => {
      const card = customer.card || {};
      return {
        id: card.id,
        date: card.date,
        title: card.title,
        styledTitle: card.styledTitle,
        slug: card.slug,
        tag: card.tag,
        image: card.image?.url,
      };
    }) || [];

  // console.log('@data', customers);
  return <CustomersSection customers={customers} />;
}
