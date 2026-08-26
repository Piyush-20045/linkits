import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { Database } from "lucide-react";

const Cta = () => {
  return (
    <section className="relative py-16 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
        <div className="relative grid md:grid-cols-2 gap-8 md:gap-0 items-center rounded-3xl border border-border/60 bg-card dark:bg-card/60 overflow-hidden shadow-xl">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 dark:bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent/5 dark:bg-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 px-8 py-14 md:px-16 md:py-24">
            <span className="inline-flex items-center gap-2 mb-8 px-3 py-1 rounded-full text-xs md:text-sm font-medium border border-border/60 bg-background/10 dark:bg-black backdrop-blur-sm text-foreground dark:text-foreground/80">
              <Database className="size-4 text-blue-500" />
              Everything you need in one place
            </span>
            <h2 className="text-3xl md:text-5xl font-semibold mb-6 text-foreground font-instrument [word-spacing:0.25rem] leading-[1.1]">
              Build your personal{" "}
              <span className="italic text-primary">toolbox</span>.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md leading-relaxed">
              Stop losing track of great resources. Save, organize, and access
              your favorite developer tools in one private space.
            </p>
            <Link href="/directory">
              <Button
                size="lg"
                className="rounded-full px-10 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
              >
                Start Curating Free
              </Button>
            </Link>
          </div>

          <div className="relative h-72 md:h-120 hidden md:block">
            <Image
              src="/cta/cta-light.png"
              alt="Linkits dashboard preview"
              fill
              className="p-4 object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
