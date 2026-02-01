import Link from "next/link";
import { Button } from "../ui/button";

const Cta = () => {
  return (
    <section className="mx-auto max-w-4xl pt-20 pb-32 px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
        Join the community
      </h2>
      <p className="text-gray-500 mb-8 dark:text-gray-400">
        Create your personal dashboard and save your favorite tools for quick
        access.
      </p>
      <Link href="/login">
        <Button size="lg" className="rounded-full px-10">
          Get Started for Free
        </Button>
      </Link>
    </section>
  );
};

export default Cta;
