# whileone.se - AI Project Instructions

## Project goal
Build and maintain a simple, modern, super-fast website for a tech consulting firm.

## Business context
- Brand/domain: `whileone.se`
- Company type: tech consulting firm
- Hosting target: free hosting on GitHub Pages

## Core principles (always prioritize in this order)
1. Performance first
2. Simplicity over complexity
3. Low maintenance and low cost
4. Clear business messaging and conversion

## Technical constraints
- Prefer a static site with minimal dependencies.
- Avoid heavy frameworks unless there is a clear business reason.
- Default stack: semantic HTML + modern CSS + tiny vanilla JS only when needed.
- Keep bundle sizes very small; do not add large libraries for small UI effects.
- No server required for core site functionality.

## Hosting and deployment
- Site must work on GitHub Pages.
- Keep build/deploy flow simple enough for free GitHub hosting.
- Ensure custom domain support for `whileone.se` (GitHub Pages compatible setup).

## UX and design direction
- Clean, modern, professional visual style.
- Fast load and responsive on mobile-first layouts.
- Clear information architecture:
  - What we do
  - Services
  - Proof/credibility
  - Contact/CTA
- Avoid visual clutter and unnecessary animation.

## Content and copy guidelines
- Tone: expert, practical, trustworthy, concise.
- Focus on business outcomes, not buzzwords.
- Use plain language with concrete value propositions.
- Every page should have one primary call to action.

## SEO, accessibility, and quality
- Use semantic headings and landmark elements.
- Include basic technical SEO (title, meta description, Open Graph).
- Ensure accessible color contrast, keyboard access, and meaningful alt text.
- Do not ship console errors.

## What to avoid
- Over-engineered architecture.
- Large JS bundles and unnecessary npm dependencies.
- Fancy effects that hurt performance.
- Vendor lock-in or paid hosting assumptions.

## Definition of done
- Runs as a static site on GitHub Pages.
- Configured for `whileone.se` custom domain.
- Lighthouse-friendly (performance and accessibility prioritized).
- Content clearly positions the firm and drives contact.
