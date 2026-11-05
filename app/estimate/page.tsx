import type { Metadata } from 'next';
import { PageHero, Container } from '@/components/ui/Section';
import ProjectEstimator from '@/components/estimate/ProjectEstimator';

export const metadata: Metadata = { title: 'Estimate Your Project', description: 'An indicative, interactive project estimate. Not a binding quotation.' };

export default function EstimatePage() {
  return (
    <>
      <PageHero eyebrow="Project Estimator" title="Estimate your project">
        Choose options to see an indicative budget and duration. This is not a binding quotation.
      </PageHero>
      <Container className="pb-24"><ProjectEstimator /></Container>
    </>
  );
}
