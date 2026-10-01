"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/constants/categories";
import { Form } from "./_components/form";
import Footer from "@/components/layout/footer";

export default function SubmitToolPage() {
  const router = useRouter();
  const { status } = useSession();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0].label);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, url, category }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit tool");
      }

      toast.success(data.message || "Suggestion sent for review", {
        position: "top-center",
      });
      router.push("/directory");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-neutral-950 sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold">Suggest a Tool</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Send us a name, link, and category — we review every suggestion
              and add the good ones ourselves.
            </p>
          </div>

          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 rounded-md border border-gray-200 p-2 dark:border-gray-800">
                <ShieldCheck size={16} />
              </span>
              <div>
                <h2 className="text-sm font-semibold">How it works</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Suggest a genuine, useful website. We personally review each
                  suggestion before adding it to the directory.
                </p>
              </div>
            </div>
          </div>

          {status === "loading" ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Checking your account...
            </p>
          ) : status !== "authenticated" ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center dark:border-gray-700 dark:bg-black">
              <h2 className="text-xl font-semibold">Login required</h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Please sign in with Google before submitting a tool.
              </p>
              <Button className="mt-6" onClick={() => signIn("google")}>
                Sign in with Google
              </Button>
            </div>
          ) : (
            <Form
              title={title}
              url={url}
              category={category}
              error={error}
              isSubmitting={isSubmitting}
              onTitleChange={setTitle}
              onUrlChange={setUrl}
              onCategoryChange={setCategory}
              onSubmit={handleSubmit}
            />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
