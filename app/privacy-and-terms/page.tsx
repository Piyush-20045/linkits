import type { Metadata } from "next";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { PolicySection } from "./_components/policy-section";
import {
  lastUpdated,
  privacyPolicy,
  termsOfUse,
} from "../../constants/policies";

export const metadata: Metadata = {
  title: "Privacy Policy & Terms | Linkits",
  description:
    "Read the Privacy Policy and Terms of Use for Linkits in one simple page.",
};

export default function PrivacyAndTermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />

      <main>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <header className="border-b border-neutral-200 pb-10 dark:border-neutral-800">
            <p className="text-sm md:text-base uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">
              Privacy & Terms
            </p>
            <h1 className="mt-4 font-instrument text-4xl tracking-tight text-gray-900 sm:text-5xl dark:text-white">
              Clear and simple policies for using Linkits.
            </h1>
            <p className="mt-5 max-w-3xl text-sm md:text-base leading-7 text-gray-600 dark:text-gray-400">
              This page combines the privacy policy and terms of use in one
              place. It covers how Linkits handles saved tools, sign-in, and
              external links in plain language.
            </p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Last updated: {lastUpdated}
            </p>
          </header>

          <div className="grid gap-12 py-10 lg:grid-cols-2 lg:gap-16">
            <PolicySection
              title={privacyPolicy.title}
              description={privacyPolicy.description}
              points={privacyPolicy.points}
            />
            <PolicySection
              title={termsOfUse.title}
              description={termsOfUse.description}
              points={termsOfUse.points}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
