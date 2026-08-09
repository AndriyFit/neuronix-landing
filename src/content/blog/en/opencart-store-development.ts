import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'opencart-store-development',
  title: 'Building an OpenCart store: the 2026 guide',
  description:
    'How to build an OpenCart store from scratch: stages, timelines, cost, required modules and integrations. Real agency experience from 100+ launches.',
  metaTitle: 'OpenCart store development: cost and stages | Neuronix',
  metaDescription:
    'A 2026 guide to OpenCart development: from $700, 2-6 weeks, essential modules, accounting and marketplace integration.',
  keywords: [
    'opencart development',
    'build opencart store',
    'opencart from scratch',
    'opencart cost',
    'opencart agency',
    'opencart developer',
  ],
  category: 'OpenCart',
  publishedAt: '2026-01-22',
  updatedAt: '2026-05-12',
  readingTimeMin: 11,
  tldr:
    'Building an OpenCart store from scratch takes 2-6 weeks and costs $700-3,000 depending on complexity. A basic themed store is two weeks at $700. Custom design with accounting, CRM and marketplace integrations runs 4-6 weeks at $1,500-3,000.',
  sections: [
    {
      heading: 'What you get at the end',
      paragraphs: [
        'A working OpenCart 4.x store with a responsive theme, full catalog, cart, checkout, and integration with your chosen payment gateway and carriers.',
        'An admin panel where you or a manager adds products, runs promotions, sees orders, manages customers and pulls reports.',
        'An SEO foundation: correct titles and descriptions, schema.org product markup, sitemap.xml, clean URLs, and Google Analytics plus Tag Manager wired in.',
        'Documentation covering the admin panel, database, backups and credentials. A week in, you will know exactly how to add a product or swap a homepage banner.',
      ],
    },
    {
      heading: 'Development stages and realistic timelines',
      paragraphs: [
        'Stage 1. Brief and specification (1-3 days). We agree product types, catalog size, required integrations, design direction, shipping and payment options, and special features such as filters, search or configurators.',
        'Stage 2. Hosting and base install (1-2 days). Register hosting, install OpenCart, configure SSL.',
        'Stage 3. Design and front-end (5-15 days). A stock theme adapted to your brand, or a custom design from scratch. Mobile adaptation included.',
        'Stage 4. Integrations (3-10 days). Payment gateway, carriers, CRM. Accounting and marketplaces are scoped separately.',
        'Stage 5. Catalog loading (2-5 days). Import from your source — Excel, accounting, or the previous site. Under 100 products can go in manually; beyond that we import.',
        'Stage 6. Testing and launch (2-3 days). Test purchase, end-to-end checks of every flow, migration to the live domain, and 301 redirects from the old site.',
      ],
    },
    {
      heading: 'What it actually costs',
      paragraphs: [
        'Starter store (stock theme, up to 100 products, basic integrations): $700-1,000 over two weeks.',
        'Mid-size store (adapted design, 100-1,000 products, 2-3 integrations, CRM): $1,200-2,000 over 3-4 weeks.',
        'Complex store (custom design, configurators, accounting sync, marketplaces, deep filtering): $2,000-4,000+ over 5-8 weeks.',
        'Separate budget lines: hosting ($5-20/mo), domain ($10-15/yr), catalog imagery ($50-200), SSL (usually free via Let\'s Encrypt).',
      ],
    },
    {
      heading: 'Essential OpenCart modules',
      paragraphs: ['Modules we install in almost every store:'],
      list: [
        'SEO Pack — clean URLs, templated meta tags, sitemap',
        'Carrier integration — API connection and automatic waybill creation',
        'Payment gateway — LiqPay, Fondy, Wayforpay or Stripe',
        'One-step checkout — lifts conversion by 20-40%',
        'Stock module — inventory tracking and accounting sync',
        'Google Shopping feed — generation for Merchant Center',
        'Backup Pro — automated backups shipped to cloud storage',
      ],
    },
    {
      heading: 'The integrations clients ask for most',
      paragraphs: [
        'Accounting integration (from $250). Two-way sync: products, stock and prices from accounting to the site; orders and customers back the other way. Runs over XML exchange or REST API.',
        'Marketplace integration (from $150 per platform). Catalog export via XML feed, order import from the marketplace into OpenCart and onward to CRM.',
        'CRM integration with KeyCRM or SalesDrive (from $200). Website orders land in the CRM automatically, statuses sync back to the site.',
        'Telephony integration with Binotel or Stream Telecom (from $150). Call customers straight from the admin panel with conversation history on the customer card.',
      ],
    },
    {
      heading: 'Common client mistakes',
      paragraphs: ['Six years of OpenCart work, and these are the mistakes we see most often:'],
      list: [
        'Cheap hosting — $1/mo means a 5-second load and half your traffic gone',
        'An unmodified stock theme — customers do not trust a design they have seen on a hundred other sites',
        'No analytics or ad pixel from day one — a month of advertising with no data',
        'A 50-product catalog with no filters — customers cannot find what they want and leave',
        'Product pages without three-plus photos and a real description — conversion runs 2-3× below normal',
        'No live chat or contact form — a hesitant customer just closes the tab',
      ],
    },
    {
      heading: 'Support after launch',
      paragraphs: [
        'The first month is free. We fix anything you or your customers find and make minor adjustments.',
        'After that it is hourly (from $20/hr) or a retainer. For most clients 5-10 hours a month covers everything: banners, new categories, module tweaks, monitoring.',
        'Separately: OpenCart version upgrades every year or two ($100-300) and module updates as needed.',
      ],
    },
    {
      heading: 'How to choose an agency',
      paragraphs: ['What to ask a prospective contractor before signing:'],
      list: [
        'Show me 3-5 live OpenCart stores you built',
        'Do you have experience with my specific integration stack',
        'How is communication organised — Telegram, chat, scheduled calls',
        'Do you provide a staging environment for review before deploy',
        'Warranty: how many months of free fixes after launch',
        'Who owns the code after handover (it should be the client, not the agency)',
      ],
    },
  ],
  faq: [
    {
      question: 'Can an old OpenCart 2.x store be upgraded to 4.x?',
      answer:
        'Yes, but it is a migration rather than a button press. We export products, categories and customers, install a clean OpenCart 4, import the data, rebuild the theme and rewrite modules. Two to four weeks, $800-2,000.',
    },
    {
      question: 'How many products can an OpenCart store hold?',
      answer:
        'On decent hosting OpenCart comfortably handles 50,000+ products and 10,000+ orders a month. Beyond that you want a VPS plus caching, ElasticSearch for search, and a CDN for images.',
    },
    {
      question: 'What does a mobile app for an OpenCart store cost?',
      answer:
        'A native app starts at $3,000. A cheaper route is a PWA that installs to the home screen and behaves like an app — $500-1,500.',
    },
    {
      question: 'Can we add multi-language and multi-currency?',
      answer:
        'OpenCart supports both out of the box. You can run Ukrainian, English and Polish with several currencies simultaneously. Configuration and interface translation costs $100-300.',
    },
    {
      question: 'What about GDPR and a cookie banner?',
      answer:
        'We install a cookie consent module and add Privacy Policy and Terms pages. If you serve EU customers, that means full GDPR compliance. Four to eight hours of work.',
    },
  ],
  related: ['opencart-1c-integration', 'opencart-marketplace-sync', 'opencart-vs-horoshop'],
}
