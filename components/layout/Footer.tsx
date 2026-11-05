import Image from 'next/image';
import Link from 'next/link';
import TechArtCanvas from '@/components/ui/TechArtCanvas';
import CascadeHeading from '@/components/ui/CascadeHeading';
import { site } from '@/lib/config/site';

const cols = [
  { title: 'Company', links: [['/about', 'About Us'], ['/work', 'Client Portfolio'], ['/careers', 'Careers'], ['/contact', 'Contact Us']] },
  { title: 'Services', links: [['/services', 'All Services'], ['/services/software-development', 'Software Development'], ['/services/web-development', 'Web & Mobile Solutions'], ['/services/ai-solutions', 'AI Solutions'], ['/services/cloud-solutions', 'Cloud & Infrastructure'], ['/services/it-consulting', 'IT Consulting']] },
  { title: 'Resources', links: [['/technology', 'Technology Stack'], ['/estimate', 'Estimate Project'], ['/faq', 'FAQs'], ['/privacy', 'Privacy Policy'], ['/terms', 'Terms & Conditions']] },
] as const;

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-[rgba(255,209,47,.25)] bg-[#070707]">
      {/* Animated IT Circuit Board & Data Network Art */}
      <TechArtCanvas />

      {/* Glowing Tech Divider Bar */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FFD12F] to-transparent opacity-60" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="space-y-4">
          <div className="inline-block rounded-xl border border-gold/30 bg-[#050505]/70 p-3 backdrop-blur-sm">
            <Image src="/images/logo.webp" alt="Yakunex Technologies logo" width={80} height={80} className="h-20 w-auto object-contain" />
          </div>
          <p className="text-sm leading-relaxed text-white/70">{site.description}</p>
          <div className="flex items-center gap-2 text-xs font-mono text-gold/80">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold"></span>
            </span>
            SYSTEMS OPERATIONAL // SRI LANKA
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.title} className="space-y-4">
            <CascadeHeading as="h2" className="text-sm font-semibold tracking-wider uppercase text-gold">{c.title}</CascadeHeading>
            <ul className="space-y-2.5 text-sm text-white/70">
              {c.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="transition-colors hover:text-gold hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="md:col-span-4 grid gap-4 border-t border-gold/20 pt-8 text-sm text-white/70 sm:grid-cols-2">
          <p>Email: <a className="text-gold hover:underline" href={`mailto:${site.email}`}>{site.email}</a></p>
          <p>Phone / WhatsApp: <a className="text-gold hover:underline" href={`tel:${site.phoneHref}`}>{site.phone}</a></p>
          <p className="sm:col-span-2">Registered Address: {site.address}</p>
          <p className="sm:col-span-2 text-xs font-mono text-white/40">
            © {new Date().getFullYear()} {site.name}. All rights reserved. Built with modern engineering.
          </p>
        </div>
      </div>
    </footer>
  );
}
