import type { Metadata } from 'next';
import { PageHero, Container } from '@/components/ui/Section';
import ServiceExplorer from '@/components/services/ServiceExplorer';

export const metadata: Metadata = { title: 'Services', description: 'Software, web, mobile, AI, data, cloud, security, design and training services from Yakunex Technologies.' };

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="All Services" title="Engineering services for every stage">
        Sixteen services across build, design, infrastructure and advisory. Filter or search to find what you need.
      </PageHero>
      <Container className="pb-24"><ServiceExplorer /></Container>
    </>
  );
}
