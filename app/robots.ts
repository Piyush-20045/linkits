export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/api/", "/login"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
