export function getStrapiURL(path = '') {
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${path}`;
}

// Shared GraphQL fetch helper
export async function fetchAPI(query: string, variables?: Record<string, any>) {
  try {
    const response = await fetch(getStrapiURL('/graphql'), {
      method: 'POST',
      next: { revalidate: 300 },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
