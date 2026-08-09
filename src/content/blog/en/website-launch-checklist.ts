import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'website-launch-checklist',
  title: 'Website launch checklist: 40 items before you publish',
  description:
    'A complete pre-launch checklist for a website or online store: SEO, analytics, security, legal pages, testing. Do not forget anything important.',
  metaTitle: 'Website launch checklist 2026: 40 essential items | Neuronix',
  metaDescription:
    'Check your site before launch: meta tags, analytics, forms, GDPR, backups, speed. A checklist for developers and business owners.',
  keywords: [
    'website launch checklist',
    'pre-launch checklist',
    'go live checklist',
    'what to check before launching a website',
    'ecommerce launch checklist',
    'website deployment checklist',
  ],
  category: 'Development',
  publishedAt: '2026-04-22',
  updatedAt: '2026-05-12',
  readingTimeMin: 7,
  tldr:
    'Run this 40-point checklist before publishing. It splits into five blocks: SEO, technical, legal, analytics, testing. Skip items and you will meet the consequences in week one.',
  sections: [
    {
      heading: 'Block 1: SEO (10 items)',
      paragraphs: ['Without an SEO foundation your site is invisible in search. Verify before launch:'],
      list: [
        'A unique title per page (50-60 characters, keyword plus brand)',
        'A unique description (140-160 characters, keyword plus call to action)',
        'Open Graph and Twitter tags (1200x630 image, title, description)',
        'H1-H3 headings carrying keywords, structurally correct',
        'A canonical URL on every page (self-referencing)',
        'sitemap.xml covering every public URL — products, categories, articles, landing pages',
        'robots.txt allowing indexing while blocking /admin, /cart, /checkout',
        'JSON-LD structured data: Organization, WebSite, Product, FAQ, BreadcrumbList',
        'Alt text on every image, for accessibility and Google Images',
        'Clean URLs — no ?id=123, readable words only',
      ],
    },
    {
      heading: 'Block 2: Technical (10 items)',
      paragraphs: ['What breaks in week one if you skip the checks:'],
      list: [
        'SSL certificate active (https:// with no browser warning)',
        'The site resolves with and without www (one canonical, the other a 301)',
        'Load speed: LCP under 2.5s, CLS under 0.1, INP under 200ms — test in PageSpeed Insights',
        'Images optimised (WebP/AVIF), lazy loading below the fold',
        'Responsive at 360px, 768px, 1024px and 1920px — check on a real phone',
        'No 404s on internal links (crawl with Screaming Frog or Sitebulb)',
        'Database and file backups configured, daily minimum with an offsite copy',
        'Error logs collected (Sentry, Rollbar or your own logging)',
        'Cron jobs running: sitemap regeneration, email queue, backups',
        'Email notifications working — place a test order and confirm both customer and manager receive it',
      ],
    },
    {
      heading: 'Block 3: Legal and security (8 items)',
      paragraphs: ['Skip these and you risk a fine or a complaint:'],
      list: [
        'A privacy policy page (required for GDPR and Google Ads)',
        'Terms of service / user agreement',
        'Cookie banner, if you take EU traffic',
        'Visible owner contact details — for trust and for Google Ads requirements',
        'Company registration details in the footer, for legal transparency',
        'Form spam protection (reCAPTCHA v3 or a honeypot)',
        'Admin panel restricted by IP or protected with 2FA',
        'No secrets in client-side code — no API keys or passwords in JS',
      ],
    },
    {
      heading: 'Block 4: Analytics and tracking (6 items)',
      paragraphs: ['Launching without analytics is driving blindfolded:'],
      list: [
        'Google Analytics 4 installed and receiving test events',
        'Google Search Console connected and the sitemap submitted',
        'Google Tag Manager (optional but recommended) for flexible tag deployment',
        'Meta Pixel, if you plan to advertise on Facebook or Instagram',
        'TikTok Pixel, if your audience is there',
        'Microsoft Clarity or Hotjar for heatmaps and session recordings',
      ],
    },
    {
      heading: 'Block 5: Testing (6 items)',
      paragraphs: ['Final checks before publishing:'],
      list: [
        'Every form submitted in test and the submission arrived where it should',
        'A full test purchase completed: product → cart → checkout → payment → confirmation email',
        'Verified on three or more browsers (Chrome, Safari, Firefox)',
        'Verified on two or more operating systems (Windows, macOS, iOS, Android)',
        'Managers and administrators trained on the admin panel',
        'Documentation handed to the client: credentials, how to add products, what to do when something breaks',
      ],
    },
    {
      heading: 'What to do in the first week after launch',
      paragraphs: ['Launching is not "publish and forget". Monitor through week one:'],
      list: [
        'Days 1-3: watch error logs for 500s and unhandled exceptions',
        'Days 1-7: check Search Console for indexing progress',
        'Days 1-7: watch analytics — traffic sources, exit points, where users stall',
        'Days 7-14: collect manager feedback on the admin panel and adjust',
        'Days 14-30: SEO review — which keywords rank, what is missing',
      ],
    },
  ],
  faq: [
    {
      question: 'Can we launch without HTTPS?',
      answer:
        'Technically yes, but do not. Chrome and Safari flag HTTP sites as "not secure" and trust collapses. A Let\'s Encrypt certificate is free and takes five minutes.',
    },
    {
      question: 'How long does the whole checklist take?',
      answer:
        'For a new build where this was baked into development, 1-2 days of developer time. For an existing site that never went through it, 3-7 days — because you will find problems.',
    },
    {
      question: 'What if we find a bug after launch?',
      answer:
        'First question: does it block users? If yes, fix immediately and roll back if needed. If no, add it to the backlog for the next release. Do not panic-patch production without a backup.',
    },
    {
      question: 'Should we do a soft launch?',
      answer:
        'If the site is business-critical, yes. Launch on a staging domain, test with the team for a week, fix what surfaces, then switch the main domain. It cuts risk by 5-10×.',
    },
    {
      question: 'What about a mobile app at launch?',
      answer:
        'Do not start with an app. Build a responsive site first. If a year in you see half your customers returning regularly, then consider a native app or a PWA.',
    },
  ],
  related: ['website-speed-optimization', 'opencart-store-development', 'horoshop-setup'],
}
