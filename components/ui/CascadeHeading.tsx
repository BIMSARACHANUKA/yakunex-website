'use client';

/**
 * CascadeHeading
 * Wraps spring-text-engine's TextEngine to apply the "Cascade Down"
 * spring animation (words fall in from above) to any h1–h6 heading.
 *
 * Rules obeyed:
 *  - All animated values are plain numbers (no unit mixing).
 *  - mode is always "once" (never "manual").
 *  - Centering via justifyContent flex utility, never text-align.
 *  - Spring config (tension: 200, friction: 22) matches the spec exactly.
 */

import { useReducedMotion } from 'framer-motion';
import TextEngine from 'spring-text-engine';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface CascadeHeadingProps {
  /** Which HTML heading element to render. Defaults to 'h2'. */
  as?: HeadingTag;
  /** Extra Tailwind / CSS classes forwarded to the TextEngine container. */
  className?: string;
  /** Pass true when the heading should be horizontally centred. */
  centered?: boolean;
  children: React.ReactNode;
}

const WORD_OUT = { opacity: 0, y: -20 } as const;
const WORD_IN  = { opacity: 1, y: 0  } as const;
const WORD_CFG = { tension: 200, friction: 22 } as const;

export default function CascadeHeading({
  as = 'h2',
  className = '',
  centered = false,
  children,
}: CascadeHeadingProps) {
  const reduceMotion = useReducedMotion();
  const justify = centered ? 'justify-center' : '';
  // overflow-hidden clips words while they spring in from above — prevents
  // letters appearing as floating artefacts outside the heading's own bounds.
  // pb-[0.08em] ensures descenders (g, y, p, q) are not clipped by overflow-hidden.
  const combined = [justify, 'overflow-hidden pb-[0.08em]', className].filter(Boolean).join(' ');

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={[centered ? 'text-center' : '', className].filter(Boolean).join(' ')}>{children}</Tag>;
  }

  return (
    <TextEngine
      tag={as}
      mode="once"
      seo={false}
      wordOut={WORD_OUT}
      wordIn={WORD_IN}
      wordConfig={WORD_CFG}
      wordStagger={70}
      className={combined}
    >
      {children}
    </TextEngine>
  );
}

