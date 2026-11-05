# Yakunex Technologies — Website

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 3 · Framer Motion · Lucide icons.

## Prerequisites
- Node.js 18.18 or newer (20+ recommended)
- npm

## Install and run
```bash
npm install
npm run dev        # development server at http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to your real production domain.

## Structure
- `app/` — routes: `/`, `/about`, `/services`, `/services/[slug]`, `/work`, `/technology`, `/estimate`, `/careers`, `/faq`, `/privacy`, `/terms`, `/contact`, plus `not-found.tsx`, `sitemap.ts`, `robots.ts`.
- `components/` — layout, scrollytelling (`BrandSequence.tsx`), forms, estimator, FAQ, services, technology, UI.
- `lib/config/site.ts` — company details, vision, mission, navigation.
- `lib/config/estimator.ts` — estimator rates and project options (**illustrative values**).
- `lib/data/` — services (16), career tracks, FAQs, technology matrix.
- `public/images/logo.webp` & `public/images/logo.png` — Yakunex logos.
- `public/sequence/frame_000.webp` … `frame_299.webp` — homepage scroll sequence (300 frames).

## Common edits
- **Company information:** edit `lib/config/site.ts`.
- **Services:** edit `lib/data/services.ts`. Each slug creates `/services/<slug>` automatically.
- **Estimate assumptions:** edit `lib/config/estimator.ts`.
- **FAQs:** edit `lib/data/faqs.ts`.
- **Sequence frames:** replace or regenerate the 300 files in `public/sequence/` with the same names. If they are missing, the homepage shows a static hero with setup guidance.

## How forms work
The contact and career forms validate input, persist submissions (and uploaded CVs for career applications) to Supabase when configured, and open the visitor's email app with a pre-filled message to `yakunextechnologies@gmail.com`.

## Testing checklist
- Navigate every header and footer link; load each route directly.
- Test the mobile menu (open, close with Escape, close via link).
- Submit the contact and career forms with empty and invalid fields.
- Check the homepage sequence on a slow connection and with the frames removed.
- Enable “reduce motion” in the OS and confirm the static hero appears.
- Run `npm run build` and review console warnings.
