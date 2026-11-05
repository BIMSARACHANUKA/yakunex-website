import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, Container, SectionHeading } from '@/components/ui/Section';
import CascadeHeading from '@/components/ui/CascadeHeading';
import TechnologyMatrix from '@/components/technology/TechnologyMatrix';

export const metadata: Metadata = { title: 'Technology', description: 'The technologies and architecture approaches Yakunex uses to build reliable digital products.' };

const flow = ['User Interface', 'Frontend', 'Backend API', 'Business Logic', 'Database / External APIs / AI Services'];

export default function TechnologyPage() {
  return (
    <>
      <PageHero eyebrow="Technology" title="Engineering the Right Technology">
        We choose tools for the problem in front of us. Listed technologies are suitable implementation options, not a claim about every project.
      </PageHero>
      <Container className="space-y-20 pb-24">
        <section>
          <SectionHeading eyebrow="Technology Matrix" title="Explore the options" />
          <TechnologyMatrix />
        </section>
        <section>
          <SectionHeading eyebrow="Example Architecture" title="How data moves" >
            A request starts in the interface, passes through the frontend to a backend API, runs business rules, then reads and writes to storage or external services.
          </SectionHeading>
          <ol className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
            {flow.map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                <span className="card px-4 py-3 text-sm">{step}</span>
                {i < flow.length - 1 && <span aria-hidden="true" className="text-gold">→</span>}
              </li>
            ))}
          </ol>
        </section>
        <section className="grid gap-6 md:grid-cols-2">
          <div className="card p-6"><CascadeHeading as="h2" className="mb-2 font-semibold text-gold">Security principles</CascadeHeading><p className="text-sm text-white/65">Least-privilege access, server-side validation, secrets kept out of client code, and dependencies kept current. Security claims for any specific project should be confirmed by a review.</p></div>
          <div className="card p-6"><CascadeHeading as="h2" className="mb-2 font-semibold text-gold">Performance and reliability</CascadeHeading><p className="text-sm text-white/65">Measure first, then optimise. Use caching, efficient assets, monitoring and tested backups. We do not promise fixed benchmark scores.</p></div>
        </section>
        <div className="text-center"><Link href="/contact" className="btn btn-gold">Discuss Your Technology Needs</Link></div>
      </Container>
    </>
  );
}
