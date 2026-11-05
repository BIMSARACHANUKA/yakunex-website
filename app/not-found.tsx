import Link from 'next/link';
import CascadeHeading from '@/components/ui/CascadeHeading';

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <CascadeHeading as="h1" centered className="gold-text text-8xl font-bold">404</CascadeHeading>
      <p className="mt-4 text-lg text-white/70">We could not find that page. It may have moved, or the link may be incorrect.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-gold">Back to Home</Link>
        <Link href="/services" className="btn btn-line">Explore Services</Link>
      </div>
    </section>
  );
}
