import { fetchAPI } from '@/utils/api-helper';
import { BlogDetail } from '@/components/homepage/blog-detail';
import { blogQuery, allBlogsQuery } from '@/graphql/querys';

export const revalidate = 60;

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await fetchAPI(blogQuery, { slug });
  // console.log(res);

  const blogRaw = res?.data?.blogs?.[0];

  const card = blogRaw?.Card || {};
  const author = card.custom_author || {};
  const content = blogRaw?.content || {};

  // Normalize contentSections to an array (Strapi may return single object or array)
  const sections =
    (Array.isArray(content.contentSections) && content.contentSections.length > 0
      ? content.contentSections
      : content.contentSections
        ? [content.contentSections]
        : []) || [];

  const authorRole = author.role || '';

  const blog = {
    title: content.title || 'Untitled Blog',
    styledTitle: content.styledTitle || '',
    tag: content.tag || '',
    date: card.date,
    image: card.image?.url,
    heroImage: Array.isArray(content.heroImage) ? content.heroImage[0]?.url : undefined,
    author: author.Name,
    authorRole,
    readTime: card.readTime,
    avatar: author.avatar?.url,
    slug:
      card.slug ||
      (card.title
        ? card.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        : undefined),
    content:
      sections.length > 0
        ? sections.map((section: any) => ({
            heading: section.showTitle !== false ? section.title : undefined,
            text: section.content ?? section.text ?? section.body ?? section.description ?? '',
          }))
        : [{ heading: '', text: '' }],
  };

  // Fetch all blogs for 'Other Blogs' section
  const allRes = await fetchAPI(allBlogsQuery);
  const otherBlogs = (allRes?.data?.blogs || [])
    .map((b: any) => {
      const c = b.Card || {};
      const a = c.author || {};
      return {
        date: c.date,
        title: c.title,
        image: c.image?.url,
        author: a.name,
        authorRole: a.role,
        readTime: c.readTime,
        avatar: a.avatar?.url,
        slug:
          c.slug ||
          (c.title
            ? c.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            : undefined),
      };
    })
    .filter((b: any) => b.slug !== blog.slug);

  return <BlogDetail blog={blog} otherBlogs={otherBlogs} />;
}
