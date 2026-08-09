import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'opencart-marketplace-sync',
  title: 'Connecting OpenCart to Rozetka and Prom.ua',
  description:
    'How to connect OpenCart to the Rozetka and Prom.ua marketplaces: XML feed, order sync, statuses and stock. Real examples.',
  metaTitle: 'OpenCart + Rozetka + Prom.ua: marketplace integration | Neuronix',
  metaDescription:
    'Exporting an OpenCart catalog to Rozetka and Prom.ua through YML/XML. Importing marketplace orders. Full automation.',
  keywords: [
    'opencart rozetka',
    'opencart prom.ua',
    'opencart marketplace integration',
    'opencart yml feed',
    'marketplace sync ukraine',
    'opencart xml export',
  ],
  category: 'Integrations',
  publishedAt: '2026-02-19',
  updatedAt: '2026-05-12',
  readingTimeMin: 9,
  tldr:
    'OpenCart connects to Rozetka and Prom.ua — Ukraine\'s two largest marketplaces — through a YML/XML catalog feed plus an API for orders. Setup takes 5-10 days at $300-800 per platform and pays back within 1-3 months on 20-50% sales growth.',
  sections: [
    {
      heading: 'Why a store needs Rozetka and Prom',
      paragraphs: [
        'Rozetka is Ukraine\'s largest marketplace with 25+ million visits a month. Prom.ua is second at 15+ million. Your products become visible to thousands of new buyers without additional ad spend.',
        'Marketplaces take 5-15% commission per sale depending on category. That is less than acquiring a new customer through Google or Facebook ads, which runs $5-20 per order.',
        'Real case: after connecting to Rozetka, Abertime added 35% to total turnover within two months. Marketplace margin is lower, but volume more than compensates.',
      ],
    },
    {
      heading: 'Method 1: YML feed (for Prom.ua)',
      paragraphs: [
        'YML is an XML catalog standard supported by both Prom.ua and Rozetka.',
        'On OpenCart we install a YML generation module or build one. We configure which categories to export, what data goes in which field, and how site categories map to marketplace ones.',
        'The marketplace pulls the file daily or hourly from a URL like https://yoursite.com/feed/prom.xml and refreshes its catalog. Stock and prices sync through that same feed.',
        'Setup time: 3-5 working days. Cost $300-500.',
      ],
    },
    {
      heading: 'Method 2: Rozetka API (full integration)',
      paragraphs: [
        'Rozetka offers a REST API for full two-way integration. Beyond catalog export you can:',
      ],
      list: [
        'Pull Rozetka orders into OpenCart automatically',
        'Push order statuses back (shipped, delivered, cancelled)',
        'Sync stock in real time',
        'Manage discounts and promotions centrally from the OpenCart admin panel',
        'Receive customer reviews and reply to them without leaving the admin',
      ],
    },
    {
      heading: 'The launch sequence',
      paragraphs: [
        'Step 1. Register as a seller on Rozetka and Prom. Submit documents, receive API keys and dashboard access. Takes 5-15 days including moderation.',
        'Step 2. Prepare the catalog. Verify every product has GTIN/EAN codes, unique SKUs, at least three photos, a description of 200+ words and the correct category. Without these the marketplace rejects a lot of listings.',
        'Step 3. Map categories. Your site categories map onto the marketplace tree. This is often the hardest part — Rozetka has 5,000+ categories and each product needs the right one.',
        'Step 4. Test upload of 10-50 products. Check that everything pulled through correctly, photos render, descriptions read well. Fix what broke.',
        'Step 5. Full upload and moderation. The marketplace reviews each product manually and comments on problems. Budget 7-14 days.',
        'Step 6. Turn on orders. Place a test order from the marketplace, confirm it reaches OpenCart and the CRM, then go live.',
      ],
    },
    {
      heading: 'Common problems and fixes',
      paragraphs: ['From our launch experience:'],
      list: [
        'A product fails moderation — usually the description is too thin or photos carry logos and watermarks. Rewrite the copy, replace images with clean unbranded ones',
        'Duplicate listings — the same SKU across variations creates duplicates. Group them and set a parent SKU',
        'Stock not syncing — check the feed is regenerating and the marketplace has re-read it. Their cache runs 1-4 hours',
        'Duplicate orders in CRM — configure the webhook properly and include the marketplace ID in the order identifier',
        'Commission eating the margin — marketplaces make sense for products with 30%+ markup, or as a volume play',
      ],
    },
    {
      heading: 'How the economics work out',
      paragraphs: [
        'Setup across two platforms (Rozetka plus Prom): $500-1,500 over 2-3 weeks including moderation.',
        'Month one: 5-20% of turnover comes through the marketplace, since your listings have no ranking history yet.',
        'Months 3-6: 20-40% of turnover. Full payback within 1-3 months.',
        'Roughly half of marketplace customers come back directly to your own site after the first purchase — a further long-term gain.',
      ],
    },
    {
      heading: 'Automating updates',
      paragraphs: [
        'YML feed: regenerate via cron every 30-60 minutes. The marketplace pulls on its own schedule (5-60 minutes).',
        'Stock on critical products: push through the API in real time on every change. Otherwise a customer orders something you do not have, and your seller rating drops.',
        'Marketplace orders: a webhook into OpenCart creates the order instantly and pushes it to CRM.',
        'Statuses: when a manager changes status in OpenCart, a script sends the new value to the marketplace API.',
      ],
    },
  ],
  faq: [
    {
      question: 'Can we sell on a marketplace without our own website?',
      answer:
        'You can, but it limits you. You depend on their rules, you do not own the customer base, and you cannot run email campaigns or retargeting. Your own site plus a marketplace is synergy; marketplace-only is a fragile strategy.',
    },
    {
      question: 'What commission do Rozetka and Prom charge?',
      answer:
        'Rozetka: 5-15% per sale plus fixed promotion spend ($30-100/mo). Prom.ua: a free basic tier with limits, and paid plans at $50-300/mo with lower commission.',
    },
    {
      question: 'Our store is on Horoshop — does this work too?',
      answer:
        'Yes, Horoshop ships ready integrations with Rozetka and Prom, configurable in a few clicks. Non-standard logic goes through the API and costs more, same as OpenCart.',
    },
    {
      question: 'Can we sync only part of the catalog?',
      answer:
        'Yes. The YML module can export selected categories only, in-stock items only, or products above a price threshold. It is flexible.',
    },
    {
      question: 'What about returns and complaints?',
      answer:
        'The marketplace mediates disputes. If a customer complains through Rozetka, their support coordinates the process. That is both an upside (you do not handle it) and a downside (feedback reaches you slower).',
    },
  ],
  related: [
    'opencart-1c-integration',
    'opencart-store-development',
    'keycrm-integration',
  ],
}
