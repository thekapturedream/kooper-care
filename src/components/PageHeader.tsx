type Props = {
  eyebrow?: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, lede, children }: Props) {
  return (
    <section className="relative border-b border-kapture-fog/60 bg-white dark:border-kapture-ash dark:bg-kapture-black">
      <div className="grid-bg" />
      <div className="container-kapture relative py-20 md:py-28">
        {eyebrow && (
          <p className="chip">
            <span className="divider-dot" />
            {eyebrow}
          </p>
        )}
        <h1 className="mt-5 max-w-4xl font-display text-hero-lg text-balance text-kapture-black dark:text-kapture-white">
          {title}
        </h1>
        {lede && (
          <p className="lede mt-6 max-w-2xl">{lede}</p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
