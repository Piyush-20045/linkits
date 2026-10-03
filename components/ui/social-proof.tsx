"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const FACES = [
  { src: "https://i.pravatar.cc/64?img=12", fallback: "AR", alt: "Developer" },
  { src: "https://i.pravatar.cc/64?img=32", fallback: "SK", alt: "Developer" },
  { src: "https://i.pravatar.cc/64?img=54", fallback: "JM", alt: "Developer" },
  { src: "https://i.pravatar.cc/64?img=47", fallback: "TP", alt: "Developer" },
  { src: "https://i.pravatar.cc/64?img=68", fallback: "NW", alt: "Developer" },
];

// Social proof row for the hero. Swap FACES for real users when available.
export function SocialProof() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <div className="flex -space-x-2.5">
        {FACES.map((face) => (
          <Avatar
            key={face.src}
            className="h-8 w-8 ring-2 ring-white dark:ring-black"
          >
            <AvatarImage src={face.src} alt={face.alt} />
            <AvatarFallback className="text-[10px]">
              {face.fallback}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Loved by{" "}
        <span className="font-medium text-gray-900 dark:text-white">
          developers
        </span>{" "}
        everywhere
      </p>
    </div>
  );
}
