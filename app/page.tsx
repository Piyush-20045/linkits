import Hero from "@/components/sections/hero";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CategoriesGrid from "@/components/sections/categories-grid";
import Cta from "@/components/sections/cta";

export default function Home() {
  return (
    <div className="bg-white dark:bg-black">
      <Navbar />
      <Hero />
      <CategoriesGrid />
      <Cta />
      <Footer />
    </div>
  );
}
