import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://calculator.kleverbill.de'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/de/calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          de: `${siteUrl}/de/calculator`,
          en: `${siteUrl}/en/calculator`,
        },
      },
    },
    {
      url: `${siteUrl}/en/calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: {
        languages: {
          de: `${siteUrl}/de/calculator`,
          en: `${siteUrl}/en/calculator`,
        },
      },
    },
    {
      url: `${siteUrl}/de/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          de: `${siteUrl}/de/pricing`,
          en: `${siteUrl}/en/pricing`,
        },
      },
    },
    {
      url: `${siteUrl}/en/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          de: `${siteUrl}/de/pricing`,
          en: `${siteUrl}/en/pricing`,
        },
      },
    },
  ]
}
