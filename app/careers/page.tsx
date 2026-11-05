import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHero, Container, SectionHeading } from '@/components/ui/Section';
import CascadeHeading from '@/components/ui/CascadeHeading';
import InquiryForm from '@/components/forms/InquiryForm';
import { careerTracks } from '@/lib/data/careers';
import { site } from '@/lib/config/site';

export const metadata: Metadata = { title: 'Careers & Internships', description: 'IT education, internship tracks and how to apply to Yakunex Technologies.' };

const journey = ['Orientation and tooling', 'Guided learning tasks', 'Supervised project work', 'Review and next steps'];

export default function CareersPage() {
  return (
    <>
      <PageHero eyebrow="Careers & Internship Academy" title="Learn by building real software">
        Our internship academy pairs IT education with mentoring and hands-on project work.
      </PageHero>
      <Container className="space-y-16 pb-24">
        <section>
          <SectionHeading eyebrow="Areas of interest" title="Internship tracks" >
            These are areas of interest for applications, not confirmed vacancies.
          </SectionHeading>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{careerTracks.map((t) => <li key={t} className="card px-4 py-3 text-sm">{t}</li>)}</ul>
        </section>
        <section>
          <SectionHeading eyebrow="Learning journey" title="How the programme works" />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{journey.map((j, i) => <li key={j} className="card p-5"><p className="text-gold">0{i + 1}</p><p className="mt-2">{j}</p></li>)}</ol>
        </section>
        <section>
          <SectionHeading eyebrow="Open positions" title="Current openings">
            No positions are currently confirmed as open. You can still send an expression of interest below.
          </SectionHeading>
        </section>
        <section className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4 text-sm text-white/70">
            <CascadeHeading as="h2" className="text-xl font-semibold text-white">How to apply</CascadeHeading>
            <ol className="list-decimal space-y-2 pl-5">
              <li>Complete the form with your details and a short introduction.</li>
              <li>Upload your CV or Resume directly in the form (PDF, DOC, DOCX).</li>
              <li>Submit — your application is saved instantly and your email client opens with a copy.</li>
            </ol>
            <p>Questions? Email <a className="text-gold hover:underline" href={`mailto:${site.email}`}>{site.email}</a>.</p>
          </div>
          <Suspense fallback={<p className="text-white/60">Loading form…</p>}>
            <InquiryForm kind="career" />
          </Suspense>
        </section>
      </Container>
    </>
  );
}
