import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Base routes
  const routes = ['', '/en', '/vi', '/en/blog', '/vi/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // Fetch posts for dynamic URLs
    const res = await fetch(`${apiUrl}/posts?limit=1000`);
    if (res.ok) {
      const data = await res.json();
      const posts = data.posts || [];
      
      const postRoutes = posts.flatMap((post: any) => [
        {
          url: `${baseUrl}/vi/blog/${post.slug}`,
          lastModified: new Date(post.updatedAt || post.createdAt).toISOString(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        },
        {
          url: `${baseUrl}/en/blog/${post.slug}`,
          lastModified: new Date(post.updatedAt || post.createdAt).toISOString(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }
      ]);
      return [...routes, ...postRoutes];
    }
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
  }

  return routes;
}
