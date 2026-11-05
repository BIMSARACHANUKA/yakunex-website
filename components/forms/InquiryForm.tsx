'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect, type FormEvent, type ChangeEvent, type DragEvent } from 'react';
import { UploadCloud, FileText, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { services } from '@/lib/data/services';
import { careerTracks } from '@/lib/data/careers';
import { estimator, type FeatureKey, type ProjectTypeKey, type TimelineKey } from '@/lib/config/estimator';
import { site } from '@/lib/config/site';
import { supabase } from '@/lib/supabase';

type Kind = 'contact' | 'career';
type Errors = Record<string, string>;
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/** Reads estimator selections from the URL, accepting only known keys. */
function readEstimate(p: URLSearchParams) {
  const type = p.get('estimate_type') as ProjectTypeKey | null;
  if (!type || !(type in estimator.projectTypes)) return null;
  const features = (p.get('features') ?? '')
    .split(',')
    .filter((k): k is FeatureKey => k in estimator.features)
    .map((k) => estimator.features[k].label);
  const tl = p.get('timeline') as TimelineKey | null;
  return {
    typeLabel: estimator.projectTypes[type].label,
    features,
    timeline: tl && tl in estimator.timelines ? estimator.timelines[tl].label : '',
    budget: (p.get('budget') ?? '').slice(0, 80),
  };
}

function validate(v: Record<string, string>, kind: Kind, cvFile: File | null): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = 'Please enter your full name.';
  if (!v.email.trim()) e.email = 'Please enter your email address.';
  else if (!emailOk(v.email.trim())) e.email = 'Please enter a valid email address, such as name@example.com.';
  if (kind === 'contact') {
    if (!v.service) e.service = 'Please choose the service you need.';
    if (v.details.trim().length < 10) e.details = 'Please describe your project in at least 10 characters.';
  } else {
    if (!v.area) e.area = 'Please choose your preferred area.';
    if (v.intro.trim().length < 20) e.intro = 'Please write a short introduction of at least 20 characters.';
    if (!cvFile) e.cv = 'Please upload your CV / Resume (PDF or DOC).';
  }
  return e;
}

export default function InquiryForm({ kind }: { kind: Kind }) {
  const params = useSearchParams();
  const serviceParam = params.get('service');
  const service = services.find((s) => s.slug === serviceParam);
  const est = kind === 'contact' ? readEstimate(params) : null;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [v, setV] = useState<Record<string, string>>(() => ({
    name: '', email: '', phone: '', service: service?.slug ?? '', details: '',
    budget: est?.budget ?? '', timeline: est?.timeline ?? '',
    area: '', background: '', intro: '', website: '',
  }));
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [savedToDb, setSavedToDb] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'error' | 'handoff'>('idle');

  // Keep pre-filled URL query fields in sync on client-side navigation
  useEffect(() => {
    if (kind !== 'contact') return;
    const matchedService = services.find((s) => s.slug === params.get('service'));
    const nextEst = readEstimate(params);
    setV((prev) => ({
      ...prev,
      service: matchedService?.slug ?? prev.service,
      budget: nextEst?.budget || prev.budget,
      timeline: nextEst?.timeline || prev.timeline,
    }));
  }, [params, kind]);

  const set = (k: string) => (e: { target: { value: string } }) => setV((p) => ({ ...p, [k]: e.target.value }));
  const ctl = (k: string) => ({
    id: k, name: k, value: v[k], onChange: set(k), className: 'input',
    'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `${k}-err` : undefined,
  });
  const E = ({ k }: { k: string }) => errors[k] ? <p id={`${k}-err`} className="mt-1 text-sm text-red-400">{errors[k]}</p> : null;
  const L = ({ k, label, req }: { k: string; label: string; req?: boolean }) => (
    <label htmlFor={k} className="mb-1 block text-sm text-white/80">{label}{req ? ' *' : ' (optional)'}</label>
  );

  const validateAndSetFile = (file: File | undefined) => {
    if (!file) return;

    // Check size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, cv: 'File size must be less than 10MB.' }));
      return;
    }

    // Check format
    const validExts = ['pdf', 'doc', 'docx'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !validExts.includes(ext)) {
      setErrors((prev) => ({ ...prev, cv: 'Only PDF, DOC, or DOCX files are accepted.' }));
      return;
    }

    setCvFile(file);
    setUploadedUrl(null);
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.cv;
      return copy;
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    validateAndSetFile(e.target.files?.[0]);
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const removeFile = () => {
    setCvFile(null);
    setUploadedUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (submitting) return;
    if (v.website) return; // honeypot
    const e = validate(v, kind, cvFile);
    setErrors(e);
    if (Object.keys(e).length) {
      setStatus('error');
      document.getElementById('form-errors')?.focus();
      return;
    }

    setSubmitting(true);
    setSavedToDb(false);
    const n = v.name.trim();
    let publicCvUrl = uploadedUrl;
    let dbRecorded = false;

    try {
      // 1. Upload CV to Supabase Storage if file attached and not yet uploaded
      if (kind === 'career' && cvFile && !publicCvUrl && supabase) {
        try {
          const cleanName = cvFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const filePath = `${Date.now()}_${cleanName}`;

          const { error: uploadError } = await supabase.storage
            .from('resumes')
            .upload(filePath, cvFile, { upsert: false });

          if (!uploadError) {
            const { data } = supabase.storage.from('resumes').getPublicUrl(filePath);
            publicCvUrl = data.publicUrl;
            setUploadedUrl(publicCvUrl);
          } else {
            console.warn('Supabase storage upload note:', uploadError.message);
          }
        } catch (err) {
          console.warn('Storage upload error:', err);
        }
      }

      // 2. Persist record to Supabase inquiries table (awaited before mailto navigation)
      if (supabase) {
        try {
          const payload: Record<string, unknown> = {
            kind,
            name: n,
            email: v.email.trim(),
            phone: v.phone.trim() || null,
            service: v.service || null,
            details: v.details.trim() || null,
            budget: v.budget.trim() || null,
            timeline: v.timeline.trim() || null,
            area: v.area || null,
            background: v.background.trim() || null,
            intro: v.intro.trim() || null,
          };

          if (publicCvUrl) payload.cv_url = publicCvUrl;
          if (cvFile) payload.cv_name = cvFile.name;

          const { error } = await supabase.from('inquiries').insert([payload]);
          if (error) {
            // Fallback retry without cv columns if not migrated yet
            delete payload.cv_url;
            delete payload.cv_name;
            const { error: retryErr } = await supabase.from('inquiries').insert([payload]);
            dbRecorded = !retryErr;
          } else {
            dbRecorded = true;
          }
        } catch (err) {
          console.warn('Database insert note:', err);
        }
      }
    } finally {
      setSubmitting(false);
    }

    setSavedToDb(dbRecorded);

    // 3. Prepare Email Mailto Payload
    let subject: string;
    let lines: string[];
    if (kind === 'contact') {
      const selectedServiceTitle =
        v.service === 'other'
          ? 'Not sure / Other'
          : services.find((s) => s.slug === v.service)?.title ?? 'Not specified';
      subject = `Project inquiry from ${n}`;
      lines = [
        `Name: ${n}`,
        `Email: ${v.email.trim()}`,
        `Phone: ${v.phone.trim() || 'Not provided'}`,
        `Service: ${selectedServiceTitle}`,
        `Budget range: ${v.budget.trim() || 'Not provided'}`,
        `Preferred timeline: ${v.timeline.trim() || 'Not provided'}`,
      ];
      if (est) lines.push(`Estimator selections: ${est.typeLabel}; features: ${est.features.join(', ') || 'none'}`);
      lines.push('', 'Project details:', v.details.trim());
    } else {
      subject = `Internship application from ${n}`;
      lines = [
        `Name: ${n}`,
        `Email: ${v.email.trim()}`,
        `Phone: ${v.phone.trim() || 'Not provided'}`,
        `Preferred area: ${v.area}`,
        `Education / background: ${v.background.trim() || 'Not provided'}`,
      ];
      if (cvFile) lines.push(`Uploaded CV: ${cvFile.name}`);
      if (publicCvUrl) lines.push(`CV Online Download: ${publicCvUrl}`);
      lines.push('', 'Introduction:', v.intro.trim(), '', 'CV attached / linked above.');
    }

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    setStatus('handoff');
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-6 p-6 sm:p-8">
      {status === 'error' && (
        <div id="form-errors" role="alert" tabIndex={-1} className="rounded-xl border border-red-400/50 p-3 text-sm text-red-300">
          Please correct the highlighted fields and try again.
        </div>
      )}
      {est && kind === 'contact' && (
        <div className="rounded-xl border border-gold/40 p-4 text-sm text-white/75">
          <p className="mb-1 font-semibold text-gold">Your estimate selections</p>
          <p>{est.typeLabel}{est.features.length ? ` · ${est.features.join(', ')}` : ''}</p>
          {est.budget && <p>Indicative budget: {est.budget}</p>}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div><L k="name" label="Full Name" req /><input {...ctl('name')} autoComplete="name" /><E k="name" /></div>
        <div><L k="email" label="Email Address" req /><input {...ctl('email')} type="email" autoComplete="email" /><E k="email" /></div>
        <div><L k="phone" label="Phone Number" /><input {...ctl('phone')} type="tel" autoComplete="tel" /></div>
        {kind === 'contact' ? (
          <div>
            <L k="service" label="Service Required" req />
            <select {...ctl('service')}>
              <option value="">Choose a service</option>
              {services.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
              <option value="other">Not sure / Other</option>
            </select>
            <E k="service" />
          </div>
        ) : (
          <div>
            <L k="area" label="Preferred Area" req />
            <select {...ctl('area')}>
              <option value="">Choose an area</option>
              {careerTracks.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <E k="area" />
          </div>
        )}
      </div>

      {kind === 'contact' ? (
        <>
          <div><L k="details" label="Project Details" req /><textarea {...ctl('details')} rows={5} /><E k="details" /></div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div><L k="budget" label="Budget Range" /><input {...ctl('budget')} placeholder="e.g. LKR 1,000,000 – 2,000,000" /></div>
            <div><L k="timeline" label="Preferred Timeline" /><input {...ctl('timeline')} placeholder="e.g. 3 months" /></div>
          </div>
        </>
      ) : (
        <>
          <div><L k="background" label="Education or Relevant Background" /><input {...ctl('background')} placeholder="e.g. BSc in IT / Software Engineering" /></div>
          <div><L k="intro" label="Short Introduction" req /><textarea {...ctl('intro')} rows={4} placeholder="Tell us about yourself, your interests and projects..." /><E k="intro" /></div>

          {/* Real 3D Claymorphic CV / Resume File Upload Dropzone */}
          <div className="space-y-2">
            <label htmlFor="cv-file-upload" className="block text-sm text-white/80">
              Upload CV / Resume <span className="text-gold">*</span> (PDF, DOC, DOCX - Max 10MB)
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="sr-only peer"
              id="cv-file-upload"
              aria-invalid={!!errors.cv}
              aria-describedby={errors.cv ? 'cv-err' : undefined}
            />

            {!cvFile ? (
              <label
                htmlFor="cv-file-upload"
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`clay-card group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all peer-focus-visible:border-gold peer-focus-visible:ring-2 peer-focus-visible:ring-gold/40 ${
                  isDragging
                    ? 'border-gold bg-gold/10 scale-[1.01]'
                    : 'border-gold/30 hover:border-gold hover:bg-gold/5'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold transition-transform group-hover:scale-110">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <p className="mt-3 text-sm font-semibold text-white">
                  Click to select or drag your CV here
                </p>
                <p className="mt-1 text-xs text-white/50">Supports PDF, DOC, DOCX up to 10MB</p>
              </label>
            ) : (
              <div className="clay-card flex items-center justify-between rounded-2xl border border-gold/40 p-4">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gold text-black shadow-md">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{cvFile.name}</p>
                    <p className="text-xs text-gold/80">{(cvFile.size / (1024 * 1024)).toFixed(2)} MB • Ready</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <button
                    type="button"
                    onClick={removeFile}
                    aria-label="Remove uploaded CV"
                    className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            <E k="cv" />
          </div>
        </>
      )}

      {/* Honeypot: hidden from people, often filled by bots */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={v.website} onChange={set('website')} />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-gold disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{kind === 'career' ? 'Uploading CV & Preparing...' : 'Submitting Inquiry...'}</span>
          </>
        ) : (
          kind === 'contact' ? 'Send Project Inquiry' : 'Submit Internship Application'
        )}
      </button>

      {status === 'handoff' && (
        <div role="status" className="clay-card rounded-2xl border border-gold/60 p-5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold"></span>
            </span>
            <p className="font-bold text-gold">
              {savedToDb
                ? kind === 'career'
                  ? 'Application Successfully Recorded!'
                  : 'Inquiry Successfully Recorded!'
                : 'Email Message Prepared!'}
            </p>
          </div>
          <p className="mt-2 text-sm text-white/80">
            {savedToDb ? (
              kind === 'career' && cvFile ? (
                <>Your application and CV ({cvFile.name}) have been recorded in our database. Your email client should also open with a copy ready.</>
              ) : (
                <>Your inquiry has been stored securely in our system. Your default email client should also open with a copy ready to send.</>
              )
            ) : kind === 'career' && cvFile ? (
              <>Your default email client should open with your pre-filled application. If your CV link was not generated, please attach {cvFile.name} before sending.</>
            ) : (
              <>Your default email client should open with your pre-filled inquiry ready to send.</>
            )}
          </p>
          <p className="mt-1.5 text-xs text-white/50">
            If your email client did not launch automatically, you can write directly to <a className="text-gold underline" href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </div>
      )}
    </form>
  );
}
