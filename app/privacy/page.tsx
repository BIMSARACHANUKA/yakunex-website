import type { Metadata } from 'next';
import { PageHero, Container } from '@/components/ui/Section';
import CascadeHeading from '@/components/ui/CascadeHeading';
import { site } from '@/lib/config/site';

export const metadata: Metadata = { title: 'Privacy Policy', description: 'How Yakunex Technologies handles information submitted through this website.' };

const sections = [
  ['Information you submit', 'Contact and career forms collect your name, email, and any phone number, service interest, budget, timeline, background or CV file you provide.'],
  ['How it is used', 'Submitted information is used only to respond to your inquiry or application.'],
  ['Delivery and storage', 'Submissions are recorded securely in our inquiry database when configured and also open a pre-filled email to our team. Email and hosting providers process messages under their own policies.'],
  ['Third-party services', 'Your email application, database storage and hosting provider process information according to their own policies.'],
  ['Security practices', 'We limit access to inquiry records and emails and avoid collecting unnecessary information.'],
  ['Retention', 'Inquiry records and emails are kept only as long as needed to respond and for legitimate business records.'],
  ['Your requests', `You may ask to access, correct or delete your information by emailing ${site.email}.`],
  ['Policy updates', 'We may update this policy. The date of the latest revision will be shown here.'],
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy">
        How {site.name} collects, uses, and safeguards information submitted through this website.
      </PageHero>
      <Container className="max-w-3xl pb-24 space-y-6">
        {sections.map(([t, d]) => <section key={t}><CascadeHeading as="h2" className="mb-2 text-xl font-semibold text-gold">{t}</CascadeHeading><p className="text-white/65">{d}</p></section>)}
        <section><CascadeHeading as="h2" className="mb-2 text-xl font-semibold text-gold">Contact</CascadeHeading><p className="text-white/65">{site.name}, {site.address} · {site.email} · {site.phone}</p></section>
      </Container>
    </>
  );
}
