import Hero from "@/components/sections/hero";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CategoriesGrid from "@/components/sections/categories-grid";
import Faq from "@/components/sections/faq";
import Cta from "@/components/sections/cta";
import TrendingTools from "@/components/sections/trending-tools";

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
    </div>
  );
}
