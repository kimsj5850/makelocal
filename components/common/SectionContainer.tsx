type SectionContainerProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export function SectionContainer({
  children,
  className = "",
  id,
}: SectionContainerProps) {
  return (
    <section id={id} className={`px-5 py-20 sm:px-8 lg:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}
