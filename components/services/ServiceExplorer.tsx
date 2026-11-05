'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { services, type ServiceCategory } from '@/lib/data/services';
import CascadeHeading from '@/components/ui/CascadeHeading';

const filters = ['All', 'Build', 'Design', 'Infrastructure', 'Advisory'] as const;

export default function ServiceExplorer() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<(typeof filters)[number]>('All');

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return services.filter((s) =>
      (cat === 'All' || s.category === (cat as ServiceCategory)) &&
      `${s.title} ${s.short} ${s.category}`.toLowerCase().includes(term));
  }, [q, cat]);

  return (
    <>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2.5">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={cat === f}
              onClick={() => setCat(f)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                cat === f
                  ? 'btn-gold !py-2 text-black'
                  : 'clay-card !rounded-full border-gold/30 px-5 py-2 text-white/75 hover:border-gold hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <label className="sm:w-80">
          <span className="sr-only">Search services</span>
          <input
            className="input !rounded-2xl"
            type="search"
            placeholder="Search all 16 services..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
      </div>

      {list.length === 0 ? (
        <div className="card p-12 text-center text-white/60">
          <p className="text-lg">No services match “{q}”.</p>
          <p className="mt-2 text-sm text-white/40">Try searching for keywords like software, web, mobile, cloud, or design.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <article
              key={s.slug}
              className="card group flex flex-col overflow-hidden transition"
            >
              {/* 3D Claymorphic Service Image Header */}
              <div className="relative h-44 w-full overflow-hidden bg-[#070709]">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-transparent to-transparent opacity-85" />
                <span className="absolute top-3 left-3 rounded-full border border-gold/40 bg-[#050505]/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold backdrop-blur-md">
                  {s.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <CascadeHeading as="h2" className="text-xl font-bold transition-colors group-hover:text-gold">{s.title}</CascadeHeading>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-white/65">{s.short}</p>
                <Link
                  href={`/services/${s.slug}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-white"
                >
                  <span>Explore Service</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
