'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { estimator, type FeatureKey, type ProjectTypeKey, type TimelineKey } from '@/lib/config/estimator';
import CascadeHeading from '@/components/ui/CascadeHeading';

const fmt = (n: number) => new Intl.NumberFormat('en-LK').format(n);
const stepTitle = 'mb-3 text-lg font-semibold';

export default function ProjectEstimator() {
  const [type, setType] = useState<ProjectTypeKey>('web');
  const [features, setFeatures] = useState<FeatureKey[]>([]);
  const [timeline, setTimeline] = useState<TimelineKey>('3m');

  const r = useMemo(() => {
    const t = estimator.projectTypes[type];
    const picked = features.map((k) => estimator.features[k]);
    const base = t.base + picked.reduce((s, f) => s + f.cost, 0);
    const weeks = t.weeks + picked.reduce((s, f) => s + f.weeks, 0);
    const maxW = estimator.timelines[timeline].maxWeeks;
    const rush = weeks > maxW ? 0.15 : 0; // shorter requested window adds a premium
    const total = base * (1 + rush);
    const low = Math.round((total * estimator.rangeLow) / estimator.roundTo) * estimator.roundTo;
    const high = Math.round((total * estimator.rangeHigh) / estimator.roundTo) * estimator.roundTo;
    return { low, high, weeks: Math.ceil(weeks), months: Math.max(1, Math.round(weeks / 4.3)), rush, tlLabel: estimator.timelines[timeline].label };
  }, [type, features, timeline]);

  const toggle = (k: FeatureKey) => setFeatures((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));
  const budget = `${fmt(r.low)} – ${fmt(r.high)} ${estimator.currency}`;
  const params = new URLSearchParams({
    estimate_type: type, features: features.join(','), timeline, budget,
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-10">
        <fieldset>
          <legend className={stepTitle}>1. Project type</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(estimator.projectTypes) as ProjectTypeKey[]).map((k) => (
              <label key={k} className={`card flex cursor-pointer items-center gap-3 p-4 ${type === k ? 'border-gold' : ''}`}>
                <input type="radio" name="type" value={k} checked={type === k} onChange={() => setType(k)} className="accent-[#FFD12F]" />
                {estimator.projectTypes[k].label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={stepTitle}>2. Features required</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(estimator.features) as FeatureKey[]).map((k) => (
              <label key={k} className={`card flex cursor-pointer items-center gap-3 p-4 ${features.includes(k) ? 'border-gold' : ''}`}>
                <input type="checkbox" checked={features.includes(k)} onChange={() => toggle(k)} className="accent-[#FFD12F]" />
                {estimator.features[k].label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={stepTitle}>3. Delivery expectations</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(estimator.timelines) as TimelineKey[]).map((k) => (
              <label key={k} className={`card flex cursor-pointer items-center gap-3 p-4 ${timeline === k ? 'border-gold' : ''}`}>
                <input type="radio" name="timeline" value={k} checked={timeline === k} onChange={() => setTimeline(k)} className="accent-[#FFD12F]" />
                {estimator.timelines[k].label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <aside aria-live="polite" className="card h-fit space-y-4 p-6 lg:sticky lg:top-24">
        <CascadeHeading as="h2" className="text-lg font-semibold">4. Project summary</CascadeHeading>
        <div>
          <p className="text-xs uppercase tracking-widest text-gold">Estimated budget</p>
          <p className="mt-1 text-2xl font-bold">{budget}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-gold">Indicative duration</p>
          <p className="mt-1">About {r.months} month{r.months > 1 ? 's' : ''} (≈ {r.weeks} weeks) · {r.tlLabel}</p>
        </div>
        <ul className="list-disc space-y-1 pl-5 text-sm text-white/65">
          <li>Project type: {estimator.projectTypes[type].label}</li>
          <li>Features: {features.length ? features.map((f) => estimator.features[f].label).join(', ') : 'None selected'}</li>
          {r.rush > 0 && <li>Requested window is shorter than estimated, so a rush premium is included.</li>}
          <li>Final quotation is provided after requirements discovery.</li>
        </ul>
        <p className="rounded-lg border border-gold/30 p-3 text-xs text-white/65">{estimator.disclaimer}</p>
        <Link href={`/contact?${params.toString()}`} className="btn btn-gold w-full justify-center">Discuss This Estimate</Link>
      </aside>
    </div>
  );
}
