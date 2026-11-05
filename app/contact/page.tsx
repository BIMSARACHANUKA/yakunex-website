import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHero, Container } from '@/components/ui/Section';
import InquiryForm from '@/components/forms/InquiryForm';
import { site } from '@/lib/config/site';

export const metadata: Metadata = { title: 'Contact Us', description: `Contact ${site.name} about your project.` };

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's discuss your project" />
      <Container className="grid gap-10 pb-24 lg:grid-cols-[1fr_1.2fr]">
        <aside className="space-y-5">
          <div className="card space-y-3 p-6 text-white/75">
            <p>Email: <a className="text-gold hover:underline" href={`mailto:${site.email}`}>{site.email}</a></p>
            <p>Phone / WhatsApp: <a className="text-gold hover:underline" href={`tel:${site.phoneHref}`}>{site.phone}</a></p>
            <p>Registered address: {site.address}</p>
          </div>
          <div className="card p-6 text-sm text-white/65">
            <p className="mb-2 font-semibold text-white">Helpful details to include</p>
            <p>The type of product, the problem it solves, your rough timeline and any existing systems.</p>
          </div>
        </aside>
        <Suspense fallback={<p className="text-white/60">Loading form…</p>}>
          <InquiryForm kind="contact" />
        </Suspense>
      </Container>
    </>
  );
}
