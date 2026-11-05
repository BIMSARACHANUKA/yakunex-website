import type { ReactNode } from 'react';
import CascadeHeading from '@/components/ui/CascadeHeading';

export function SectionHeading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-10 max-w-2xl">
      {eyebrow && <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">{eyebrow}</p>}
      <CascadeHeading as="h2" className="text-3xl font-bold sm:text-4xl">{title}</CascadeHeading>
      {children && <p className="mt-4 text-white/65">{children}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-20 pb-10 sm:px-6">
      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
      <CascadeHeading as="h1" className="gold-text text-4xl font-bold sm:text-6xl">{title}</CascadeHeading>
      {children && <p className="mt-5 max-w-2xl text-lg text-white/65">{children}</p>}
    </section>
  );
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 ${className}`}>{children}</div>;
}
