export function SectionHead({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <div className="mx-auto mb-14 max-w-2xl text-center">
      {title && <h2 className="display text-3xl font-extrabold leading-snug md:text-4xl">{title}</h2>}
      {subtitle && <p className="mt-4 text-lg text-slate-400">{subtitle}</p>}
    </div>
  );
}

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative px-4 py-20 md:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
