import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/'],
    },
    sitemap: 'https://nafij.bro.bd/sitemap.xml',
  };
}
