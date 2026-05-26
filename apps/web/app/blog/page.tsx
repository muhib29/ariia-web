import { BlogSection } from '@/components/homepage/blog-section';
import { allBlogsQuery } from '@/graphql/querys';
import { fetchAPI } from '@/utils/api-helper';

export const revalidate = 60;

export default async function BlogPage() {
  const res = await fetchAPI(allBlogsQuery);
  // console.log("🚀 ~ BlogPage ~ res:", res);

  const blogs =
    res?.data?.blogs?.map((blog: any) => {
      const card = blog.Card || {};
      const author = card.custom_author || {};
      return {
        date: card.date,
        title: card.title,
        image: card.image?.url,
        author: author.Name,
        authorRole: author.role,
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
      };
    }) || [];

  return <BlogSection blogs={blogs} />;
}
