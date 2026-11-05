import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, Container, SectionHeading } from '@/components/ui/Section';
import CascadeHeading from '@/components/ui/CascadeHeading';
import { site } from '@/lib/config/site';

export const metadata: Metadata = { title: 'About Us', description: 'Who Yakunex Technologies is, what we value and how we engineer software.' };

const values = [
  ['Innovation', 'We explore new approaches where they solve real problems.'],
  ['Excellence', 'We review and test our work before it reaches users.'],
  ['Integrity', 'We are honest about scope, timelines and limitations.'],
  ['Collaboration', 'We work openly with clients and within our team.'],
  ['Customer Focus', 'We start from the people who will use the product.'],
  ['Continuous Learning', 'We keep our skills current and share what we learn.'],
  ['Responsibility', 'We build systems we are prepared to maintain.'],
];
const method = ['Discovery', 'Planning', 'Architecture', 'Implementation', 'Quality assurance', 'Deployment', 'Continuous improvement'];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title="About Yakunex Technologies">
        {site.name} is a technology and software development company focused on engineering useful digital products and business solutions.
      </PageHero>
      <Container className="space-y-16 pb-24">
        <section>
          <SectionHeading eyebrow="Core values" title="What guides us" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(([t, d]) => <li key={t} className="card p-5"><CascadeHeading as="h3" className="font-semibold">{t}</CascadeHeading><p className="mt-2 text-sm text-white/60">{d}</p></li>)}
          </ul>
        </section>
        <section>
          <SectionHeading eyebrow="Engineering methodology" title="From discovery to improvement" />
          <ol className="flex flex-wrap gap-3">{method.map((m, i) => <li key={m} className="card px-4 py-2 text-sm"><span className="mr-2 text-gold">{i + 1}.</span>{m}</li>)}</ol>
        </section>
        <section className="card p-8">
          <CascadeHeading as="h2" className="mb-2 font-semibold text-gold">Headquarters</CascadeHeading>
          <p className="text-white/70">{site.address}</p>
          <Link href="/contact" className="btn btn-gold mt-6">Contact Us</Link>
        </section>
      </Container>
    </>
  );
}
