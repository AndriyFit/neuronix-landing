import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'opencart-1c-integration',
  title: 'OpenCart and accounting-system integration: a step-by-step guide',
  description:
    'How to set up two-way sync between OpenCart and 1C accounting: products, prices, stock, orders. Integration methods, common mistakes, cost.',
  metaTitle: 'OpenCart + 1C: 4 ways to sync your store | Neuronix',
  metaDescription:
    'Connecting OpenCart to 1C Enterprise: products, stock and orders in both directions. CommerceML, REST API, XML, direct SQL. Timelines and pricing.',
  keywords: [
    'opencart 1c integration',
    'opencart erp sync',
    'opencart commerceml',
    'opencart accounting integration',
    'opencart product sync',
    'opencart inventory sync',
  ],
  category: 'Integrations',
  publishedAt: '2026-02-05',
  updatedAt: '2026-05-12',
  readingTimeMin: 12,
  tldr:
    'OpenCart syncs with 1C — the accounting suite that dominates Eastern European retail — through CommerceML 2 (the standard), REST API (most flexible), XML exchange (simplest) or an SQL bridge (for very high volume). Cost runs $250-1,500 depending on scale, setup takes 3-10 days.',
  sections: [
    {
      heading: 'What actually gets synced',
      paragraphs: [
        'Accounting to site: products (name, description, SKU, brand), categories, prices (retail, wholesale, promotional), warehouse stock, attributes and images.',
        'Site to accounting: orders with full detail (line items, payment, shipping), new customers as counterparty cards, and order statuses.',
        'Frequency: products and prices hourly or on change. Stock every 5-15 minutes — this is the one that hurts when it drifts. Orders instantly at checkout.',
      ],
    },
    {
      heading: 'Method 1: CommerceML 2 (the standard)',
      paragraphs: [
        'CommerceML is a standard XML exchange format supported by both 1C and OpenCart. 1C has built-in export processing; on OpenCart you install a receiver module.',
        'How it works: 1C generates XML files with products and stock and posts them to the site over HTTP. OpenCart parses the XML and updates its database. In reverse, the site publishes order XML that 1C collects.',
        'Upside: works out of the box, no 1C programming needed. Downside: slow at scale (15,000+ products) and awkward for non-standard fields.',
        'Best for: stores with a conventional catalog under 10,000 items running stock 1C Trade Management.',
      ],
    },
    {
      heading: 'Method 2: REST API (most flexible)',
      paragraphs: [
        'OpenCart 4 ships a full REST API. On the 1C side we write a job that reads receipt, price and stock documents and sends PUT/POST requests to the site API.',
        'Upside: near real time (1-5 minute lag), flexible fields, delta-only updates, and clean error logging.',
        'Downside: you need a developer who knows both 1C and REST. A first integration costs $800-1,500.',
        'Best for: large catalogs (50,000+ products), customised 1C configurations, complex business processes.',
      ],
    },
    {
      heading: 'Method 3: XML exchange over FTP/SFTP',
      paragraphs: [
        'The simple option: 1C drops an XML file (products, stock) onto an FTP server every N minutes, and a cron script on OpenCart picks it up and updates the database.',
        'Upside: cheap ($250-500), simple, and works without a persistent connection — even when 1C sits on a closed local network.',
        'Downside: not real time. Stock lags 5-30 minutes, and orders travel back on the same schedule.',
        'Best for: lower-velocity stores (1-50 orders a day) where a 15-minute stock lag is acceptable.',
      ],
    },
    {
      heading: 'Method 4: SQL bridge',
      paragraphs: [
        'The extreme case: connect 1C directly to the OpenCart database (MySQL/MariaDB) and let it run SELECT/INSERT/UPDATE with no XML or JSON in between.',
        'Upside: instant sync, minimal overhead, no limits on what you exchange.',
        'Downside: requires direct network access between the 1C server and the web server, is hard to test, and risks collisions on concurrent writes. Not recommended without an experienced DBA.',
        'Best for: large-scale e-commerce (100,000+ products, thousands of orders a day) with a single in-house IT team.',
      ],
    },
    {
      heading: 'Real example: Abertime',
      paragraphs: [
        'Abertime is a watch retailer with a catalog of 15,000+ products. We run a combination of REST API and XML.',
        'Products and prices go over REST from 1C Trade Management 11.4 hourly, delta only — roughly 200-500 items per run, which never strains the server.',
        'Stock moves as an XML file every 5 minutes carrying just SKU and quantity, so parsing stays fast.',
        'Orders fire instantly via webhook: OpenCart → REST API → a customer order document created in 1C within 3-5 seconds.',
        'Total integration cost $1,200, eight days of development, running stably for over a year.',
      ],
    },
    {
      heading: 'Common failures and how to avoid them',
      paragraphs: ['What breaks integrations in 80% of cases:'],
      list: [
        'A product SKU changes in accounting and the site creates a duplicate. Fix: match on a fixed unique ID (GUID) — let the SKU be mutable',
        'Categories renamed in accounting leave the site on the old structure. Fix: sync by category ID, never by name',
        'Identical product names with different variants produce five identical listings. Fix: use attributes and variants properly',
        'Negative stock (items sold outside the system) means customers order what does not exist. Fix: block ordering at zero or below',
        'UTF-8 versus Windows-1251 encoding mangles Cyrillic text. Fix: pin UTF-8 with BOM at every stage',
      ],
    },
    {
      heading: 'Pre-launch checklist',
      paragraphs: ['Verify before pushing an integration to production:'],
      list: [
        'A staging environment with copies of both accounting and the site — in place?',
        'Exchange logs collected (requests, responses, errors) — in place?',
        'Alerts on critical failures via Telegram or email — in place?',
        'Daily backups of both databases — in place?',
        'A fallback channel for when the API goes down — in place?',
        'A written procedure for managers when data drifts out of sync — in place?',
      ],
    },
  ],
  faq: [
    {
      question: 'Can OpenCart integrate with 1C Accounting rather than Trade Management?',
      answer:
        'Yes, but it costs more. 1C Accounting is not built for retail, so products are stored differently. We usually recommend either moving to Trade Management or adding a middleware layer.',
    },
    {
      question: 'Do discounts and promotions sync?',
      answer:
        'Yes. Standard price types (retail, wholesale, promotional) are supported by most modules. Conditional discounts — "15% off for VIP customers" — need custom code, $100-300.',
    },
    {
      question: 'How much load does this put on the accounting server?',
      answer:
        'Delta sync is minimal, 1-3% CPU. Full exchange peaks around 50% during export. We recommend a full run overnight and deltas during the day.',
    },
    {
      question: 'What about VAT and fiscal receipts?',
      answer:
        'OpenCart passes the VAT rate and net/gross amounts to accounting. The fiscal receipt is generated there through a connected fiscal service (Checkbox, Vchasno.Kasa). Fiscal hardware integration is a separate job, $300-800.',
    },
    {
      question: 'Can we sync with 1C Enterprise 7.7?',
      answer:
        '7.7 is a legacy platform with no modern API. Integration is limited to XML exchange with reduced functionality. We recommend upgrading before building the integration.',
    },
  ],
  related: [
    'opencart-store-development',
    'opencart-marketplace-sync',
    'keycrm-integration',
  ],
}
