"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "What is Linkits?",
    answer:
      "Linkits is a curated directory of developer tools, resources, and platforms. It helps you discover, save, and organize the best tools for building and growing your projects.",
  },
  {
    question: "Is Linkits free to use?",
    answer:
      "Yes. Browsing and exploring the directory is completely free. You can also create a free account to save your favorite tools and build your personal toolbox.",
  },
  {
    question: "Can I submit a tool to Linkits?",
    answer:
      "Absolutely. If you have built or discovered a useful tool, you can submit it for review. We regularly update the directory with high-quality resources.",
  },
  {
    question: "How do I save tools?",
    answer:
      "Sign in with your Google account, then use the bookmark icon on any tool card to save it. Access your saved tools anytime from your dashboard.",
  },
  {
    question: "Are the tools vetted?",
    answer:
      "Yes. We manually review submissions to ensure quality, relevance, and usefulness before adding them to the directory.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-gray-50 py-16 md:py-20 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start gap-10 md:gap-16">
          <div className="hidden md:flex w-full md:w-5/12">
            <div className="relative aspect-11/12 w-full max-w-sm mx-auto md:mx-0 overflow-hidden rounded-2xl">
              <Image
                src="/faq.jpg"
                alt="FAQ illustration"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          <div className="w-full md:w-7/12">
            <p className="text-sm font-medium text-primary mb-2">FAQ&apos;s</p>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
              Looking for answers?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-lg">
              Everything you need to know about using Linkits. Can&apos;t find
              what you&apos;re looking for?{" "}
              <Link href="/directory" className="text-primary hover:underline">
                Explore the directory
              </Link>
              .
            </p>

            <div className="space-y-0">
              {FAQS.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 dark:border-neutral-800 py-4 cursor-pointer"
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-base font-medium text-foreground">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`size-4 text-muted-foreground transition-transform duration-300 ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openIndex === index
                        ? "max-h-40 opacity-100 mt-3"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-sm text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
