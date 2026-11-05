import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Section';
import CascadeHeading from '@/components/ui/CascadeHeading';
import { services } from '@/lib/data/services';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  return s ? { title: s.title, description: s.short } : { title: 'Service not found' };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();
  const related = services.filter((x) => x.category === s.category && x.slug !== s.slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-4xl px-4 pt-16 pb-24 sm:px-6">
      <Link href="/services" className="inline-flex items-center gap-1.5 text-sm text-gold hover:underline">
        ← All services
      </Link>

      {/* 3D Claymorphic Service Feature Hero */}
      <div className="card mt-6 overflow-hidden">
        <div className="relative h-64 w-full sm:h-80">
          <Image
            src={s.image}
            alt={s.title}
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-[#0a0a0d]/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="rounded-full border border-gold/40 bg-[#050505]/85 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold backdrop-blur-md">
              {s.category}
            </span>
            <CascadeHeading as="h1" className="gold-text mt-3 text-3xl font-extrabold sm:text-5xl">{s.title}</CascadeHeading>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <p className="text-xl leading-relaxed text-white/90">{s.short}</p>
        <p className="text-base leading-relaxed text-white/70">{s.detail}</p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <section className="card p-6 sm:p-8">
          <CascadeHeading as="h2" className="mb-4 text-lg font-bold text-gold">Customer Problems Addressed</CascadeHeading>
          <ul className="space-y-3">
            {s.problems.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-white/75">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold shadow-[0_0_6px_#FFD12F]" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-6 sm:p-8">
          <CascadeHeading as="h2" className="mb-4 text-lg font-bold text-gold">Key Capabilities &amp; Deliverables</CascadeHeading>
          <ul className="space-y-3">
            {s.capabilities.map((c) => (
              <li key={c} className="flex items-start gap-3 text-sm text-white/75">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold shadow-[0_0_6px_#FFD12F]" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card mt-10 p-6 sm:p-8">
        <CascadeHeading as="h2" className="mb-3 text-xl font-bold text-gold">Proposed Engagement Model</CascadeHeading>
        <p className="leading-relaxed text-white/70">
          We begin with a focused discovery session, agree on architecture scope and milestone deliverables, ship in transparent weekly sprints with continuous code reviews, and provide long-term SLA maintenance.
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href={`/contact?service=${s.slug}`} className="btn btn-gold">Discuss This Service</Link>
        <Link href="/services" className="btn btn-line">Browse All Services</Link>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <CascadeHeading as="h2" className="mb-6 text-2xl font-bold">Related Services</CascadeHeading>
          <Container className="!px-0 grid gap-5 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/services/${r.slug}`}
                className="card group flex flex-col overflow-hidden p-5 transition hover:border-gold"
              >
                <div className="relative mb-3 h-28 w-full overflow-hidden rounded-xl bg-[#070709]">
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CascadeHeading as="h3" className="font-bold text-white transition-colors group-hover:text-gold">{r.title}</CascadeHeading>
                <p className="mt-1.5 text-xs text-white/60 line-clamp-2">{r.short}</p>
              </Link>
            ))}
          </Container>
        </section>
      )}
    </article>
  );
}
