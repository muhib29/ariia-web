import { ImageFragment, SEOFragment } from './fragments';

export const allBlogsQuery = `
  ${ImageFragment}
  query AllBlogs {
    blogs(pagination: { page: 1, pageSize: 100 }) {
      Card {
        id
        title
        slug
        date
        readTime
        image {
          ...ImageFragment
        }
        custom_author {
          Name
          role
          avatar {
            ...ImageFragment
          }
        }
      }
    }
  }
`;

// Use Card.slug for filtering, as slug is not a top-level filter
export const blogQuery = `
  ${ImageFragment}
  ${SEOFragment}
  query Blog($slug: String!) {
    blogs(filters: { Card: { slug: { eq: $slug } } }) {
      SEO {
        ...SEOFragment
      }
      Card {
        id
        slug
        title
        date
        readTime
        image {
          ...ImageFragment
        }
        custom_author {
          Name
          role
          avatar {
            ...ImageFragment
          }
        }
      }
      content {
        tag
        title
        styledTitle
        heroImage {
          ...ImageFragment
        }
        contentSections {
          id
          content
          showTitle
          title
        }
      }
    }
  }
`;

export const allCustomersQuery = `
  ${ImageFragment}
  ${SEOFragment}
  query AllCustomers {
    customers {
      customerSeo {
        ...SEOFragment
      }
      card {
        id
        date
        title
        slug
        tag
        image {
          ...ImageFragment
        }
      }
    }
  }
`;

export const customerQuery = `
  ${ImageFragment}
  ${SEOFragment}
  query Customers($slug: String!) {
    customers(filters: { card: { slug: { eq: $slug } } }) {
      customerSeo {
        ...SEOFragment
      }
      card {
        id
        date
        title
        slug
        tag
        image {
          ...ImageFragment
        }
      }
      customerContent {
        title
        tag
        styledTitle
        heroImage {
          ...ImageFragment
        }
        contentSections {
          id
          title
          showTitle
          content
        }
      }
      feedback
      industry
      employeeRange
      location
      linkedinUrl
      twitterUrl
      facebookUrl
      jobFounderName
    }
  }
`;

export const privacyPolicyQuery = `
  ${ImageFragment}
  ${SEOFragment}
  query Privacy {
    privacyPolicy {
      seo {
        ...SEOFragment
      }
      tag
      title
      styledTitle
      content
      effectiveDate
    }
  }
`;

export const termsOfServiceQuery = `
  ${ImageFragment}
  ${SEOFragment}
  query Terms {
    termOfService {
      seo {
        ...SEOFragment
      }
      tag
      title
      styledTitle
      content
      effectiveDate
    }

  }
`;

export const aboutQuery = `
  ${ImageFragment}
  ${SEOFragment}
  query About {
    storyOfAriia {
      seo {
        ...SEOFragment
      }
      content {
        tag
        title
        styledTitle
        contentSections {
          content
        }
      }
      below {
        title
        description
        image {
          ...ImageFragment
        }
      }
    }
  }
`;

export const homeQuery = `
  fragment ImageFragment on UploadFile {
    alternativeText
    previewUrl
    url
    name
  }
  fragment SEOFragment on ComponentSharedSeo {
    id
    metaDescription
    metaTitle
    shareImage {
      ...ImageFragment
    }
  }
  fragment HeaderFragment on ComponentSharedHeader {
    id
    title
    styledTitle
    tag
    description
  }
  query Home {
    home {
      seo { ...SEOFragment }
      heroSection {
        backgroundImage { ...ImageFragment }
        Video { ...ImageFragment }
        leftContent {
          title
          typerwriteText { text { id text } }
          Description
          cta { ctaText httpsUrl internalUrl }
        }
        rightContent {
          Title
          listOfWork { text { id text } }
          image { ...ImageFragment }
          cta { ctaText httpsUrl internalUrl }
        }
      }
      useCaseSection {
        header { ...HeaderFragment }
        audioWithContent {
          id
          title
          name
          description
          image { ...ImageFragment }
          audio { ...ImageFragment }
        }
      }
      innovationSection {
        header { ...HeaderFragment }
        image { ...ImageFragment }
      }
      securitySection {
        header { ...HeaderFragment }
        imageWithContent {
          id
          image { ...ImageFragment }
          description
        }
      }
      faqSection {
        header { ...HeaderFragment }
        questions(pagination: { page: 1, pageSize: 100 }) { id title content }
      }
    }
  }
`;

export const contactUsQuery = `
  ${ImageFragment}
  ${SEOFragment}
  query Contact {
    contactUs {
      seo {
        ...SEOFragment
      }
      title
      styledTitle
      tag
      card {
        id
        title
        email
        redirection
      }
    }
  }
`;

export const pricingQuery = `
  fragment ImageFragment on UploadFile {
    alternativeText
    previewUrl
    url
    name
    width
    height
  }

  fragment SEOFragment on ComponentSharedSeo {
    id
    metaDescription
    metaTitle
    shareImage {
      ...ImageFragment
    }
  }

  fragment HeaderFragment on ComponentSharedHeader {
    id
    title
    styledTitle
    tag
    description
  }

  fragment CTAFragment on ComponentSharedCta {
    id
    ctaText
    httpsUrl
    internalUrl
  }

  query Pricing {
    pricing {
      seo {
        ...SEOFragment
      }
      title
      styledTitle
      tag
      heroSection {
        title
        tag
        description
        backgroundImage {
          ...ImageFragment
        }
        sliderInfo {
          title
          subtext
          startRange
          endRange
          pricePerMin
          cta {
            ...CTAFragment
          }
        }
      }
      subscriptionSection {
        header {
          ...HeaderFragment
        }
        pricingDetails {
          plans {
            planType
            planOptions {
              id
              icon {
                ...ImageFragment
              }
              title
              planValue
              description
              backgroundImage {
                ...ImageFragment
              }
              cta {
                ...CTAFragment
              }
              extraCharges {
                id
                text
              }
            }
          }
        }
      }
      pricingTable {
        title
        header {
          ...HeaderFragment
        }
        featurePricing {
          id
          title
          feature_pricings {
            documentId
            title
            featureValue {
              id
              value
              check
              plan_feature {
                title
                pricing
              }
            }
          }
        }
      }
    }
  }
`;

export const allCareersQuery = `
  query AllCareers {
    careers(sort: "publishedAt:asc") {
      documentId
      title
      slug
      careerCard {
        description
        jobInfo {
          employment
          equity
          experience
          location
          salary
          benefits
        }
      }
    }
  }
`;

export const careerQuery = `
  ${ImageFragment}
  ${SEOFragment}
  fragment HeaderFragment on ComponentSharedHeader {
    id
    title
    styledTitle
    tag
    description
  }
  query Career {
    careerPage {
      seo {
        ...SEOFragment
      }
      header {
        ...HeaderFragment
      }
      careerHero {
        ... on ComponentSharedImageWithTitle {
          id
          title
          description
          image {
            ...ImageFragment
          }
        }
      }
      career_details {
        title
        slug
        careerCard {
          description
          jobDescription
          jobInfo {
            employment
            equity
            experience
            location
            salary
            benefits
          }
        }
      }
    }
  }
`;

export const careerSlugQuery = `
  ${ImageFragment}
  ${SEOFragment}
  query Career($slug: String!) {
    careers(filters: {
      slug: {
        eq: $slug
      }
    }) {
      seo {
        ...SEOFragment
      }
      title
      slug
      careerCard {
        description
        jobDescription
        jobInfo {
          employment
          equity
          experience
          location
          salary
          benefits
        }
        cta {
          ctaText
          httpsUrl
          internalUrl
        }
      }
      whyJoinUs {
        title
        description
      }
    }
  }
`;

export const industryQuery = `
  ${ImageFragment}
  ${SEOFragment}
  query Industry {
    industry {
      seo {
        ...SEOFragment
      }
      title
      styledTitle
      tag
      card {
        id
        title
        description
        fullWidth
        image {
          ...ImageFragment
        }
        backgroundImage {
          ...ImageFragment
        }
      }
    }
  }
`;
