import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'website-speed-optimization',
  title: 'Website speed optimisation: Core Web Vitals in 2026',
  description:
    'How to speed up an online store or landing page: LCP, CLS, INP. Image compression, caching, CDN. Real numbers and tools.',
  metaTitle: 'Website speed optimisation: 0 → 95 points | Neuronix',
  metaDescription:
    'How to push a site above 90 in PageSpeed: image optimisation, lazy loading, caching, CDN, JS minification. Guide for OpenCart, Horoshop and Next.js.',
  keywords: [
    'website speed optimisation',
    'core web vitals',
    'pagespeed insights',
    'lcp optimisation',
    'cls optimisation',
    'fast website',
  ],
  category: 'Development',
  publishedAt: '2026-04-29',
  updatedAt: '2026-05-12',
  readingTimeMin: 10,
  tldr:
    'Site speed drives both conversion (every extra second costs about 7%) and SEO. Core Web Vitals targets: LCP under 2.5s, INP under 200ms, CLS under 0.1. Baseline work is WebP/AVIF images, caching, CDN and lazy loading. Advanced work is server caching, code splitting and prefetch.',
  sections: [
    {
      heading: 'Why speed is critical',
      paragraphs: [
        'Google has used Core Web Vitals as a ranking factor since 2021. A slow site ranks lower, which means less organic traffic.',
        'Every additional second of load time cuts conversion by roughly 7%. A site loading in five seconds instead of two loses 21% of potential customers.',
        'Mobile users are even less patient: 53% abandon a site that takes longer than three seconds.',
      ],
    },
    {
      heading: 'What Core Web Vitals measure',
      paragraphs: [
        'LCP (Largest Contentful Paint) — time until the largest visible element renders, usually the hero image or headline. Target under 2.5s; poor above 4s.',
        'INP (Interaction to Next Paint) — responsiveness to a user action such as a click or tap. Replaced FID in 2024. Target under 200ms; poor above 500ms.',
        'CLS (Cumulative Layout Shift) — how much content jumps around during load. Target under 0.1; poor above 0.25.',
        'Test your own site at pagespeed.web.dev or with Lighthouse in Chrome DevTools.',
      ],
    },
    {
      heading: 'The five problems in 90% of sites',
      paragraphs: ['From auditing 100+ sites, these come up most often:'],
      list: [
        'Oversized JPG/PNG images — 1,000kb where 80kb of WebP would do',
        'Render-blocking JavaScript: jQuery, heavy sliders, analytics loaded synchronously',
        'No page caching, so every request hits the database',
        'Google Fonts loaded in a render-blocking way',
        'Ads or video without reserved space, sending CLS through the roof',
      ],
    },
    {
      heading: 'Image optimisation',
      paragraphs: [
        'Format: WebP for universal support, or AVIF for better compression where browser support allows. JPG and PNG are legacy.',
        'Dimensions: serve exactly what you display. If the image renders at 800x600, do not ship 4000x3000. Use responsive images with srcset for different screens.',
        'Compression: 70-85% quality on JPG/WebP is visually indistinguishable and 3-5× smaller.',
        'Lazy loading: add loading="lazy" to every image below the fold so they load only as they approach the viewport.',
        'CDN: Cloudflare, Bunny or Imgix serve images from the edge nearest the visitor, cutting latency by 100-500ms.',
      ],
    },
    {
      heading: 'JavaScript and CSS',
      paragraphs: [
        'Minification: compress all JS and CSS with Terser, esbuild or swc for a 30-60% size reduction.',
        'Code splitting: break bundles into chunks. A delivery information page should not load checkout scripts.',
        'Defer and async: non-critical JS — analytics, chat widgets, ads — should never block rendering.',
        'Drop jQuery where you can. Vanilla JS or lightweight libraries like Alpine.js or htmx usually cover the same ground.',
        'CSS: inline the critical above-the-fold rules in the head and lazy-load or preload the rest.',
      ],
    },
    {
      heading: 'Fonts',
      paragraphs: [
        'Self-host: serve Google Fonts from your own server instead of an external link. Saves 100-300ms of DNS and connection time.',
        'Use font-display: swap so text renders in a system font first and swaps in without blocking the first paint.',
        'Preload critical fonts with <link rel="preload">.',
        'Subset: ship only the character ranges you need rather than Latin plus Cyrillic plus Greek.',
        'One typeface instead of three. Modern faces like Inter, Manrope or Geist hold up across a whole site.',
      ],
    },
    {
      heading: 'Server-side caching',
      paragraphs: [
        'OpenCart: OCDC or Hyperion Cache store generated HTML so a repeat visit lands under 300ms.',
        'WordPress: WP Rocket, W3 Total Cache or LiteSpeed Cache do the same.',
        'Custom builds (Next.js, Nuxt): ISR or SSG for static pages plus edge caching on Cloudflare or Vercel for dynamic ones.',
        'Redis or Memcached for database query caching — especially effective on catalogs above 5,000 products.',
        'PHP OPcache, enabled in php.ini, speeds PHP execution 2-5×.',
      ],
    },
    {
      heading: 'CDN and geography',
      paragraphs: [
        'Cloudflare Free: a CDN with 250+ edge locations worldwide, connected in ten minutes by changing nameservers.',
        'Bonus: DDoS protection, static caching, on-the-fly HTML/CSS/JS minification and Brotli compression.',
        'Bunny CDN: a cheap alternative at around $0.01/GB. Not free, but very fast.',
        'If your audience is one country, host near it. Latency of 20-50ms beats 100-200ms from across the Atlantic.',
      ],
    },
    {
      heading: 'Real numbers from our work',
      paragraphs: ['What optimisation delivered on live clients:'],
      list: [
        'Abertime store: mobile PageSpeed 35 → 89, LCP 5.2s → 1.8s, add-to-cart conversion +18%',
        'Calculator landing page: PageSpeed 62 → 97, LCP 2.4s → 1.1s, +40 seconds average time on site',
        'B2B services site: 71 → 95, rankings up 8-15 positions over two months',
        'Apparel store: WebP conversion plus lazy loading took page load from 4.1s to 1.4s',
      ],
    },
    {
      heading: 'Testing tools',
      paragraphs: [
        'PageSpeed Insights (pagespeed.web.dev) — Google\'s own, reporting Core Web Vitals with recommendations.',
        'WebPageTest (webpagetest.org) — a detailed per-request waterfall.',
        'GTmetrix — combines PageSpeed and WebPageTest in a readable format.',
        'Chrome DevTools Lighthouse — local analysis, and the only way to test authenticated pages like an admin panel.',
        'Calibre and SpeedCurve — paid continuous monitoring with alerts on regression.',
      ],
    },
  ],
  faq: [
    {
      question: 'What does speed optimisation cost?',
      answer:
        'Baseline work (images, caching, CDN, lazy loading): $200-500 over 1-2 weeks. Advanced (code splitting, server cache, prefetch, fonts): $500-1,500 over 2-4 weeks. ROI arrives as a 10-30% conversion lift.',
    },
    {
      question: 'What gives the biggest gain for the least effort?',
      answer:
        'One: Cloudflare Free (five minutes, +20-30 points). Two: WebP instead of JPG (1-2 hours, +10-20). Three: lazy loading images (30 minutes, +5-10). That is 90% of the result in about four hours.',
    },
    {
      question: 'Can we reach 100/100 in PageSpeed?',
      answer:
        'Technically possible for a simple static site. For real e-commerce carrying ad code, analytics and a chat widget, 85-95 is the realistic target — enough to sit in Google\'s "good" band.',
    },
    {
      question: 'Does speed really affect conversion?',
      answer:
        'Yes. Walmart cut LCP by one second and gained 2% conversion. Pinterest reduced wait times 40% and saw signups rise 15%. Amazon has publicly estimated every 100ms of latency at $1.6bn a year.',
    },
    {
      question: 'Does a small store need all of this?',
      answer:
        'The basics — Cloudflare, WebP, lazy loading — yes, because they are free or cheap. Heavy optimisation like Redis and code splitting starts paying off around 10,000 visits a day.',
    },
  ],
  related: ['website-launch-checklist', 'opencart-store-development', 'landing-price-lviv'],
}
