'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageCircle, X, Phone, Calculator, Mail, ArrowUp
} from 'lucide-react';
import { site } from '@/lib/config/site';

const menuItemStyle = {
  background: 'linear-gradient(145deg, #1c1c24, #0b0b0e)',
  boxShadow: '8px 12px 24px rgba(0,0,0,0.8), inset 2px 2px 4px rgba(255,255,255,0.15), inset -2px -2px 6px rgba(0,0,0,0.9)',
} as const;

export default function FloatingActionMenu() {
  const [open, setOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const path = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onPointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [open]);

  if (!mounted) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappUrl = `https://wa.me/${site.phoneHref.replace('+', '')}?text=${encodeURIComponent(
    'Hello Yakunex Technologies, I would like to discuss a project.'
  )}`;

  const itemClass =
    'clay-card group flex items-center gap-3 !rounded-full px-4 py-2.5 text-xs font-bold text-white transition-all hover:scale-105 hover:border-gold hover:text-gold';

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded Action Menu Items */}
      {open && (
        <div
          role="menu"
          aria-label="Quick contact actions"
          className="flex flex-col items-end gap-2.5 pb-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
        >
          {/* WhatsApp Direct */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            className={itemClass}
            style={menuItemStyle}
          >
            <span>WhatsApp Us</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-black shadow-md">
              <MessageCircle className="h-4 w-4 fill-current" />
            </div>
          </a>

          {/* Quick Call */}
          <a
            href={`tel:${site.phoneHref}`}
            role="menuitem"
            className={itemClass}
            style={menuItemStyle}
          >
            <span>Call Hotline</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-black shadow-md">
              <Phone className="h-4 w-4" />
            </div>
          </a>

          {/* Project Estimator */}
          <Link
            href="/estimate"
            onClick={() => setOpen(false)}
            role="menuitem"
            className={itemClass}
            style={menuItemStyle}
          >
            <span>Project Estimator</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-black shadow-md">
              <Calculator className="h-4 w-4" />
            </div>
          </Link>

          {/* Send Email */}
          <a
            href={`mailto:${site.email}`}
            role="menuitem"
            className={itemClass}
            style={menuItemStyle}
          >
            <span>Send Email</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-black shadow-md">
              <Mail className="h-4 w-4" />
            </div>
          </a>
        </div>
      )}

      {/* Auxiliary Scroll to Top Button */}
      {showScrollTop && !open && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="clay-card flex h-11 w-11 items-center justify-center !rounded-full border border-gold/30 text-gold transition-all duration-200 hover:scale-110 hover:border-gold hover:text-white"
          style={{
            background: 'linear-gradient(145deg, #1c1c24, #0a0a0d)',
            boxShadow: '6px 8px 18px rgba(0,0,0,0.7), inset 2px 2px 4px rgba(255,255,255,0.12), inset -2px -2px 5px rgba(0,0,0,0.9)',
          }}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* Main 3D Claymorphic FAB Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? 'Close quick menu' : 'Open quick contact options'}
        className="group relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 active:scale-95 hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, #FFE066 0%, #FFD12F 45%, #D99B00 100%)',
          boxShadow: '8px 14px 28px rgba(217,155,0,0.48), -3px -3px 12px rgba(255,255,255,0.3), inset 2px 2px 5px rgba(255,255,255,0.75), inset -3px -3px 7px rgba(180,115,0,0.8)',
        }}
      >
        {/* Ambient Ping Glow when closed */}
        {!open && (
          <span className="absolute -inset-1 -z-10 animate-ping rounded-full bg-gold opacity-30" />
        )}

        {/* Icon toggle with 3D rotation */}
        <div className="relative text-black transition-transform duration-300">
          {open ? (
            <X className="h-7 w-7 stroke-[2.5]" />
          ) : (
            <MessageCircle className="h-7 w-7 fill-black stroke-black stroke-[1.5]" />
          )}
        </div>
      </button>
    </div>
  );
}

