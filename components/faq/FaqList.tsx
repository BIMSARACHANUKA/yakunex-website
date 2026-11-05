'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqs, faqCategories } from '@/lib/data/faqs';

export default function FaqList() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string>('All');

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return faqs.filter((f) => (cat === 'All' || f.category === cat) && `${f.q} ${f.a}`.toLowerCase().includes(term));
  }, [q, cat]);

  return (
    <>
      <div className="mb-8 space-y-4">
        <label className="block">
          <span className="sr-only">Search FAQs</span>
          <input className="input" type="search" placeholder="Search questions and answers" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {['All', ...faqCategories].map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}
              className={`rounded-full border px-3 py-1 text-xs transition ${cat === c ? 'border-gold bg-gold font-medium text-black' : 'border-gold/30 text-white/70 hover:border-gold'}`}>{c}</button>
          ))}
        </div>
      </div>
      {list.length === 0 ? (
        <p className="card p-8 text-center text-white/60">No questions match “{q}”. Try other words, or <Link className="text-gold underline" href="/contact">contact us</Link>.</p>
      ) : (
        <div className="space-y-3">
          {list.map((f) => (
            <details key={f.q} className="card group p-5 open:border-gold">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                <span>
                  <span className="mr-3 text-xs font-normal text-gold">{f.category}</span>
                  {f.q}
                </span>
                <ChevronDown aria-hidden="true" className="h-4 w-4 flex-shrink-0 text-gold transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-white/65">{f.a}</p>
            </details>
          ))}
        </div>
      )}
    </>
  );
}
