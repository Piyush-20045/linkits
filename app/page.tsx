import Hero from "@/components/sections/hero";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CategoriesGrid from "@/components/sections/categories-grid";
import Faq from "@/components/sections/faq";
import Cta from "@/components/sections/cta";
import TrendingTools from "@/components/sections/trending-tools";

export const metadata = {
  title: "Linkits — Curated Developer Tools & Resources",
  description:
    "Discover, save, and organize the best developer tools, resources, and platforms. Your personal toolbox for building and growing projects.",
};

export default function Home() {
  return (
    <div className="bg-white dark:bg-black">
      <Navbar />
      <Hero />
      <TrendingTools />
      <CategoriesGrid />
      <Faq />
      <Cta />
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Linkits",
            description:
              "Curated directory of developer tools, resources, and platforms.",
            url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${
                  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
                }/directory?search={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </div>
  );
}
