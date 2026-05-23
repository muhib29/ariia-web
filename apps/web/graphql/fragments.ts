export const ImageFragment = `
  fragment ImageFragment on UploadFile {
  alternativeText
  previewUrl
  url
  name
}`;

export const SEOFragment = `
  fragment SEOFragment on ComponentSharedSeo {
    id
    metaDescription
    metaTitle
    shareImage {
      ...ImageFragment
    }
  }
`;
