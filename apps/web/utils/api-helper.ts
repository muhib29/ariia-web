export function getStrapiURL(path = '') {
  const base = process.env.NEXT_PUBLIC_STRAPI_API_URL?.replace(/\/$/, '');
  if (!base) return '';
  return `${base}${path}`;
}

export function hasStrapiConfig() {
  return Boolean(process.env.NEXT_PUBLIC_STRAPI_API_URL && process.env.NEXT_PUBLIC_STRAPI_API_TOKEN);
}

// Shared GraphQL fetch helper
export async function fetchAPI(query: string, variables?: Record<string, any>) {
  if (!hasStrapiConfig()) {
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(getStrapiURL('/graphql'), {
      method: 'POST',
      next: { revalidate: 300 },
      signal: controller.signal,
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
    if ((error as Error).name !== 'AbortError') {
      console.error(error);
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
