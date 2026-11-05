import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, Container } from '@/components/ui/Section';
import CascadeHeading from '@/components/ui/CascadeHeading';

export const metadata: Metadata = {
  title: 'Client Portfolio & Case Studies',
  description: 'Enterprise engagements and production systems delivered by Yakunex Technologies.',
};

export default function WorkPage() {
  return (
    <>
      <PageHero eyebrow="Portfolio" title="Enterprise Deployments & Solutions">
        Engineering bespoke systems, software, and AI solutions for forward-thinking organizations.
      </PageHero>

      <Container className="max-w-4xl pb-28">
        <div className="card p-8 sm:p-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 font-mono text-xs font-semibold tracking-widest uppercase text-gold">
            ENTERPRISE CONFIDENTIALITY // NDA PROTECTED
          </div>
          <CascadeHeading as="h2" className="text-2xl font-bold sm:text-3xl">Private Client Case Studies Available Upon Request</CascadeHeading>
          <p className="mt-4 leading-relaxed text-white/70">
            In accordance with strict mutual non-disclosure agreements (NDAs) and enterprise security standards, our live client production systems, proprietary algorithmic pipelines, and infrastructure deployments are kept confidential.
          </p>
          <p className="mt-3 leading-relaxed text-white/70">
            We regularly share targeted, redacted architectural case studies and demonstrations with prospective clients during initial discovery consultations.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="clay-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold">Sectors</p>
              <p className="mt-2 text-sm text-white/80">FinTech, Logistics, Healthcare, E-Commerce & IoT</p>
            </div>
            <div className="clay-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold">Engineering</p>
              <p className="mt-2 text-sm text-white/80">Bespoke Web & Mobile, AI Agents, Cloud Infrastructure</p>
            </div>
            <div className="clay-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold">Standards</p>
              <p className="mt-2 text-sm text-white/80">Full IP Transfer, SOC2-Ready, Strict Mutual NDA</p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/contact" className="btn btn-gold">Request Relevant Case Studies</Link>
            <Link href="/services" className="btn btn-line">Explore Capabilities</Link>
          </div>
        </div>
      </Container>
    </>
  );
}
