'use client';

import { useId, useState } from 'react';
import { techTabs } from '@/lib/data/technology';
import CascadeHeading from '@/components/ui/CascadeHeading';

export default function TechnologyMatrix() {
  const [active, setActive] = useState(0);
  const id = useId();
  const tab = techTabs[active];

  const selectAndFocus = (nextIdx: number) => {
    setActive(nextIdx);
    document.getElementById(`${id}-tab-${nextIdx}`)?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Technology areas" className="flex flex-wrap gap-2">
        {techTabs.map((t, i) => (
          <button key={t.key} id={`${id}-tab-${i}`} role="tab" type="button" aria-selected={i === active}
            aria-controls={`${id}-panel`} tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                selectAndFocus((i + 1) % techTabs.length);
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                selectAndFocus((i - 1 + techTabs.length) % techTabs.length);
              } else if (e.key === 'Home') {
                e.preventDefault();
                selectAndFocus(0);
              } else if (e.key === 'End') {
                e.preventDefault();
                selectAndFocus(techTabs.length - 1);
              }
            }}
            className={`rounded-full border px-4 py-2 text-sm transition ${i === active ? 'border-gold bg-gold font-medium text-black' : 'border-gold/30 text-white/70 hover:border-gold'}`}>
            {t.key}
          </button>
        ))}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} className="mt-6 grid gap-4 sm:grid-cols-2">
        {tab.items.map(([name, desc]) => (
          <div key={name} className="card p-5"><CascadeHeading as="h3" className="font-semibold text-gold">{name}</CascadeHeading><p className="mt-2 text-sm text-white/65">{desc}</p></div>
        ))}
      </div>
    </div>
  );
}
