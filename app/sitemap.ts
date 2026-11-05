import type { MetadataRoute } from 'next';
import { site } from '@/lib/config/site';
import { services } from '@/lib/data/services';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ['', '/about', '/services', '/work', '/technology', '/estimate', '/careers', '/faq', '/contact', '/privacy', '/terms'];
  return [
    ...staticPaths.map((p) => ({ url: `${site.url}${p}` })),
    ...services.map((s) => ({ url: `${site.url}/services/${s.slug}` })),
  ];
}
