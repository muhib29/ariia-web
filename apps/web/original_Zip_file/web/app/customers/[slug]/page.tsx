import { fetchAPI } from '@/utils/api-helper';
import { CustomerDetail } from '../../../components/homepage/customer-detail';
import { customerQuery } from '@/graphql/querys';

function toPlainText(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    return value
      .map((item) => toPlainText(item))
      .filter(Boolean)
      .join('\n\n')
      .trim();
  }

  if (typeof value === 'object') {
    // Handle rich text/blocks style payloads from CMS.
    if (Array.isArray(value.children)) {
      return value.children
        .map((child: any) => toPlainText(child))
        .join('')
        .trim();
    }

    return [value.text, value.content, value.description, value.body]
      .map((item) => toPlainText(item))
      .filter(Boolean)
      .join('\n\n')
      .trim();
  }

  return String(value);
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await fetchAPI(customerQuery, { slug });

  const customerRaw = res?.data?.customers?.[0];

  const card = customerRaw?.card || {};
  const content = customerRaw?.customerContent || {};
  const nestedSections =
    Array.isArray(content?.contentSections) && content.contentSections.length > 0
      ? content.contentSections
      : content?.contentSections
        ? [content.contentSections]
        : [];
  const rootSections =
    Array.isArray(customerRaw?.contentSections) && customerRaw.contentSections.length > 0
      ? customerRaw.contentSections
      : customerRaw?.contentSections
        ? [customerRaw.contentSections]
        : [];
  const sections = nestedSections.length > 0 ? nestedSections : rootSections;

  const customer = {
    id: card.id,
    date: card.date,
    title: content.title || card.title,
    styledTitle: content.styledTitle || '',
    tag: content.tag || card.tag,
    image: card.image?.url,
    heroImage: Array.isArray(content.heroImage) ? content.heroImage[0]?.url : undefined,
    slug: card.slug,
    content:
      sections.length > 0
        ? sections.map((section: any) => ({
            heading: section.showTitle !== false ? section.title : undefined,
            text: toPlainText(
              section.content || section.text || section.description || section.body,
            ),
          }))
        : [
            {
              heading: undefined,
              text: toPlainText(content?.content || content?.description || content?.text),
            },
          ],
    feedback: customerRaw?.feedback,
    industry: customerRaw?.industry,
    employeeRange: customerRaw?.employeeRange,
    location: customerRaw?.location,
    linkedinUrl: customerRaw?.linkedinUrl,
    twitterUrl: customerRaw?.twitterUrl,
    facebookUrl: customerRaw?.facebookUrl,
    jobFounderName: customerRaw?.jobFounderName,
  };

  return <CustomerDetail customer={customer} />;
}
