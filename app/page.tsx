import Image from 'next/image';
import Link from 'next/link';
import BrandSequence from '@/components/scrollytelling/BrandSequence';
import { Container, SectionHeading } from '@/components/ui/Section';
import CascadeHeading from '@/components/ui/CascadeHeading';
import { services } from '@/lib/data/services';
import { site } from '@/lib/config/site';

const steps = [
  { num: '01', title: 'Discover', desc: 'Requirements analysis, domain modeling & strategic scoping.', img: '/images/services/step-1-discover.webp' },
  { num: '02', title: 'Plan', desc: 'Architecture blueprints, technical stack selection & milestone roadmaps.', img: '/images/services/step-2-plan.webp' },
  { num: '03', title: 'Build', desc: 'Iterative agile sprints, robust automated testing & continuous review.', img: '/images/services/step-3-build.webp' },
  { num: '04', title: 'Deliver', desc: 'Production deployment, security verification & long-term maintenance.', img: '/images/services/step-4-deliver.webp' },
];

const capabilities = [
  'Custom Software Architecture',
  'Full-Stack Web Platforms',
  'Native & Cross-Platform Mobile',
  'Practical AI & Machine Learning',
  'Cloud Hosting & DevOps Automation',
  'Enterprise Data Analytics',
  'Cybersecurity Hardening',
  'Product & UI/UX Design',
];

export default function Home() {
  return (
    <>
      <BrandSequence />

      {/* Vision & Mission with Claymorphic Cards */}
      <section className="py-20">
        <Container className="grid gap-8 md:grid-cols-2">
          <div className="card p-8 sm:p-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-gold">
              Core Purpose
            </div>
            <CascadeHeading as="h2" className="mb-3 text-2xl font-bold text-gold">Vision</CascadeHeading>
            <p className="leading-relaxed text-white/75">{site.vision}</p>
          </div>
          <div className="card p-8 sm:p-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-gold">
              Our Commitment
            </div>
            <CascadeHeading as="h2" className="mb-3 text-2xl font-bold text-gold">Mission</CascadeHeading>
            <p className="leading-relaxed text-white/75">{site.mission}</p>
          </div>
        </Container>
      </section>

      {/* About Company */}
      <section className="py-16">
        <Container className="grid items-center gap-12 md:grid-cols-2">
          <div className="card p-8 sm:p-10">
            <SectionHeading eyebrow="Who We Are" title="A technology company built to ship useful products.">
              Yakunex Technologies engineers digital products, bespoke enterprise software, and scalable cloud solutions, from first idea to long-term operational support.
            </SectionHeading>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/about" className="btn btn-gold">Learn More About Us</Link>
              <Link href="/contact" className="btn btn-line">Contact Team</Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="clay-card relative flex items-center justify-center p-8 sm:p-12">
              <Image
                src="/images/logo.webp"
                alt="Yakunex Technologies emblem"
                width={300}
                height={300}
                className="h-64 w-auto object-contain drop-shadow-[0_12px_24px_rgba(255,209,47,0.25)] sm:h-72"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Services with 3D Clay Images */}
      <section className="py-20">
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Featured Services" title="What we build for you">
              Engineered with modern architectures, resilient security, and tactile perfection.
            </SectionHeading>
            <Link href="/services" className="btn btn-line mb-10 text-sm">View All 16 Services →</Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="card group flex flex-col overflow-hidden transition"
              >
                {/* 3D Claymorphic Service Image Banner */}
                <div className="relative h-48 w-full overflow-hidden bg-[#070709]">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-transparent to-transparent opacity-80" />
                  <span className="absolute top-3 left-3 rounded-full border border-gold/40 bg-[#050505]/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold backdrop-blur-md">
                    {s.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <CascadeHeading as="h3" className="text-xl font-bold transition-colors group-hover:text-gold">{s.title}</CascadeHeading>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-white/65">{s.short}</p>
                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-gold">
                    <span>Explore Service</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Engineering Process with 3D Clay Badges */}
      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Our Process" title="Four connected stages of delivery">
            Every software system undergoes systematic engineering from scoping to live production.
          </SectionHeading>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((st) => (
              <div key={st.num} className="card flex flex-col overflow-hidden">
                <div className="relative h-36 w-full overflow-hidden bg-[#070709]">
                  <Image
                    src={st.img}
                    alt={st.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] to-transparent opacity-80" />
                  <span className="absolute top-3 right-3 rounded-full border border-gold/40 bg-[#050505]/80 px-2.5 py-0.5 font-mono text-xs font-bold text-gold">
                    {st.num}
                  </span>
                </div>
                <div className="p-6">
                  <CascadeHeading as="h3" className="text-lg font-bold text-gold">{st.title}</CascadeHeading>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Technical Capabilities */}
      <section className="py-16">
        <Container>
          <div className="card p-8 sm:p-12">
            <SectionHeading eyebrow="Technical Capabilities" title="Breadth across the modern technology stack">
              From low-latency architectures to intuitive client-facing portals.
            </SectionHeading>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {capabilities.map((c) => (
                <div
                  key={c}
                  className="clay-card flex items-center gap-3 p-4 transition-transform hover:-translate-y-1"
                >
                  <div className="h-2 w-2 flex-shrink-0 rounded-full bg-gold shadow-[0_0_8px_#FFD12F]" />
                  <span className="text-sm font-semibold text-white/85">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Call to action */}
      <section className="py-24 text-center">
        <Container>
          <div className="clay-card p-10 sm:p-16">
            <CascadeHeading as="h2" centered className="gold-text text-3xl font-extrabold sm:text-5xl">
              Let&apos;s create technology that moves your business forward.
            </CascadeHeading>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/70">
              Speak directly with our engineering team to architect your next digital platform or enterprise solution.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn btn-gold">Start a Project</Link>
              <Link href="/estimate" className="btn btn-line">Estimate Project</Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
