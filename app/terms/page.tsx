import type { Metadata } from 'next';
import { PageHero, Container } from '@/components/ui/Section';
import CascadeHeading from '@/components/ui/CascadeHeading';
import { site } from '@/lib/config/site';

export const metadata: Metadata = { title: 'Terms & Conditions', description: 'Terms for using the Yakunex Technologies website.' };

const sections = [
  ['Website usage', 'Use this website lawfully and for its intended purpose.'],
  ['Intellectual property', 'Content, designs and logos belong to Yakunex Technologies or their respective owners. Do not reuse them without permission.'],
  ['Content and accuracy', 'We aim for accurate information but do not guarantee that all content is complete or current.'],
  ['Project proposals and estimates', 'The online estimator is not a binding quotation. Estimates provide an indicative range prior to formal scoping.'],
  ['Engagement terms', 'Any project is governed by a separate written agreement, which takes precedence over this page.'],
  ['Third-party services', 'Links and integrations to third parties are subject to those parties\u2019 terms.'],
  ['Acceptable use', 'Do not attempt to disrupt, probe or misuse the website or its forms.'],
  ['Limitations and disclaimers', 'The website is provided as is for informational purposes without warranties of any kind.'],
  ['Contact', `${site.name}, ${site.address} · ${site.email}`],
];

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms & Conditions">
        Terms governing the use of the {site.name} website, online project estimator, and inquiry services.
      </PageHero>
      <Container className="max-w-3xl pb-24 space-y-6">
        {sections.map(([t, d]) => <section key={t}><CascadeHeading as="h2" className="mb-2 text-xl font-semibold text-gold">{t}</CascadeHeading><p className="text-white/65">{d}</p></section>)}
      </Container>
    </>
  );
}
