import type { Metadata } from 'next';
import { PageHero, Container } from '@/components/ui/Section';
import FaqList from '@/components/faq/FaqList';

export const metadata: Metadata = { title: 'FAQ', description: 'Answers to common questions about Yakunex services, estimates, security and careers.' };

export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="Knowledge Base" title="Frequently asked questions" />
      <Container className="pb-24"><FaqList /></Container>
    </>
  );
}
