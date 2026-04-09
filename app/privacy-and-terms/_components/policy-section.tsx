type PolicySectionProps = {
  title: string;
  description: string;
  points: string[];
};

export function PolicySection({
  title,
  description,
  points,
}: PolicySectionProps) {
  return (
    <section className="border-t border-neutral-200 pt-8 dark:border-neutral-800">
      <h2 className="font-instrument text-3xl tracking-tight text-gray-900 dark:text-white">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl text-sm md:text-base leading-7 text-gray-600 dark:text-gray-400">
        {description}
      </p>

      <ul className="mt-6 space-y-3 text-sm md:text-base leading-7 text-gray-600 dark:text-gray-400">
        {points.map((point) => (
          <li key={point} className="flex gap-3">
            <span className="mt-3 h-1.5 w-1.5 shrink-0 bg-gray-900 dark:bg-white" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
