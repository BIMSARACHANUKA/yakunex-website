'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { site } from '@/lib/config/site';

const links = [...site.nav, { href: '/estimate', label: 'Estimate Project' }];

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = ''; // always restore on cleanup
    };
  }, [open]);

  const active = (href: string) =>
    href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(255,209,47,.14)] bg-[#050505]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Yakunex home" className="flex items-center gap-2">
          <Image src="/images/logo.webp" alt="Yakunex logo" width={40} height={40} priority className="h-10 w-10 object-contain" />
          <span className="font-semibold tracking-wide">Yakunex</span>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          {site.nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active(n.href) ? 'page' : undefined}
              className={`border-b pb-1 text-sm transition hover:text-gold ${
                active(n.href) ? 'border-gold text-gold font-medium' : 'border-transparent text-white/70'
              }`}
            >
              {n.label}
            </Link>
          ))}
          <Link href="/estimate" className="btn btn-line !py-2 text-sm">
            Estimate Project
          </Link>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="rounded-lg p-2 text-gold hover:bg-gold/10"
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-[rgba(255,209,47,.14)] bg-[#0A0A0A] px-4 py-3 lg:hidden">
          {links.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              aria-current={active(n.href) ? 'page' : undefined}
              className={`block py-3 transition hover:text-gold ${
                active(n.href) ? 'font-semibold text-gold' : 'text-white/80'
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
