import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'horoshop-vs-shopify',
  title: 'Horoshop vs Shopify: choosing a platform for the Ukrainian market',
  description:
    'Comparing Horoshop and Shopify for Ukraine: pricing, localisation, payments, delivery, marketplaces. Who each one suits.',
  metaTitle: 'Horoshop vs Shopify: a Ukraine comparison 2026 | Neuronix',
  metaDescription:
    'Horoshop versus Shopify for a Ukrainian store. Price, localisation, LiqPay, Nova Poshta, Rozetka. A detailed comparison.',
  keywords: [
    'horoshop vs shopify',
    'shopify in ukraine',
    'shopify nova poshta',
    'shopify ukraine payments',
    'ecommerce platform eastern europe',
    'shopify localisation',
  ],
  category: 'Platforms',
  publishedAt: '2026-04-15',
  updatedAt: '2026-05-12',
  readingTimeMin: 8,
  tldr:
    'Selling into Ukraine, Horoshop usually wins: cheaper, with native integrations for local carriers, payment gateways and marketplaces. Shopify makes sense when you sell across borders or already live in its ecosystem.',
  sections: [
    {
      heading: 'The short answer for a Ukrainian business',
      paragraphs: [
        'Selling only inside Ukraine with no near-term export plans — choose Horoshop. The platform is designed for this market: LiqPay, Nova Poshta, Rozetka and 1C accounting all work out of the box, and the interface is Ukrainian.',
        'Planning to sell across 2-5 markets (Ukraine plus Poland plus the US), with multi-currency and multi-jurisdiction tax — choose Shopify. Global reach is exactly its strength.',
        'A hybrid path works too: start on Horoshop and move to Shopify in a year or two once international sales justify it. Plenty of Ukrainian brands have done exactly that.',
      ],
    },
    {
      heading: 'Subscription cost',
      paragraphs: [
        'Horoshop: $30-200/mo by plan, with no additional commission on sales.',
        'Shopify Basic: $29/mo plus a 2% fee on payments through third-party gateways. Shopify Payments waives that, but it is not available in Ukraine.',
        'So the real Shopify cost is $29 plus 2% of turnover. On $10k monthly revenue that adds $200, landing at $229/mo — the level of a Horoshop Premium plan.',
        'Long term Horoshop is cheaper precisely because there is no percentage of sales.',
      ],
    },
    {
      heading: 'Localisation and language',
      paragraphs: [
        'Horoshop: admin and storefront fully in Ukrainian, with support in Ukrainian over Telegram and email. When something breaks you get an answer in a language your team reads fluently.',
        'Shopify: the interface is English (Ukrainian is unofficial), support is English, and all official documentation is English.',
        'For a team that is not strong in English, Horoshop saves a great deal of time.',
      ],
    },
    {
      heading: 'Payment gateways',
      paragraphs: [
        'Horoshop: ready integrations with LiqPay, Fondy, Wayforpay, Portmone, Privat24 and Monobank — the wallets Ukrainian shoppers actually use. Five minutes to configure.',
        'Shopify: officially supports a handful of gateways such as Stripe (unavailable in Ukraine), PayPal (workable but awkward locally) and 2Checkout. Local gateways only come through third-party modules with the 2% fee attached.',
        'Ukrainian customers convert better when they see a familiar checkout and pay with a card they know works.',
      ],
    },
    {
      heading: 'Delivery inside Ukraine',
      paragraphs: [
        'Horoshop: Nova Poshta, Ukrposhta, Justin and Meest in one click. Shipping cost calculates automatically and waybills are generated from the admin panel.',
        'Shopify: no official Nova Poshta integration. You buy a third-party module at $5-30/mo, often with reduced functionality.',
        'This is the single biggest Shopify pain point for Ukrainian stores: carrier integration is either unavailable or held together with workarounds and extra fees.',
      ],
    },
    {
      heading: 'Marketplaces',
      paragraphs: [
        'Horoshop: Rozetka, Prom.ua and OLX integrate out of the box via YML feed or API.',
        'Shopify: no official integrations with Ukrainian marketplaces. You either write custom code or pay an intermediary service $30-100/mo.',
        'If Rozetka and Prom are channels you need, Horoshop wins by a wide margin.',
      ],
    },
    {
      heading: 'Customisation and design',
      paragraphs: [
        'Shopify wins here. Its Theme Store carries 100+ premium templates ($150-350 one-time), most of them better than anything in the Horoshop library.',
        'Shopify Liquid is a more powerful and flexible templating language than the Horoshop API, giving developers more room.',
        'If your brand depends on a distinctive storefront — designer furniture, an own-label fashion line — Shopify can justify itself on design alone.',
      ],
    },
    {
      heading: 'Ecosystem and technical support',
      paragraphs: [
        'Shopify is the most mature e-commerce platform in the world: thousands of apps, millions of developers, endless guides and courses.',
        'Horoshop is a Ukrainian product built by a small team. Fewer apps, less documentation, fewer developers who know it.',
        'For anything non-standard, finding a specialist or an app is easier on Shopify. On Horoshop you may be waiting for your agency to build it from scratch.',
      ],
    },
    {
      heading: 'When Shopify beats Horoshop',
      paragraphs: ['Situations worth the local inconvenience:'],
      list: [
        'Selling into 2-3 markets simultaneously',
        'Budget available for third-party modules and extra commission',
        'Design matters enough to pay $200-1,000 for a premium theme',
        'The team is comfortable working in English',
        'You want to test new markets quickly without rebuilding the site',
        'Complex marketing mechanics are planned (Shopify Plus offers more)',
      ],
    },
  ],
  faq: [
    {
      question: 'Can Shopify accept payment in Ukrainian hryvnia?',
      answer:
        'Yes, through third-party gateway modules with Shopify\'s 2% fee on top. The alternative is selling in USD or EUR and converting, but local shoppers expect prices in hryvnia.',
    },
    {
      question: 'What about fiscal receipts and sole-trader compliance?',
      answer:
        'Horoshop has ready integrations with Ukrainian fiscal services (Checkbox, Vchasno.Kasa) so receipts are issued automatically. On Shopify you integrate a fiscal provider yourself — $200-500 of development.',
    },
    {
      question: 'Can we migrate from Horoshop to Shopify?',
      answer:
        'Yes: export products, customers and orders from Horoshop and import into Shopify. The hard parts are rebuilding the design on a different platform and carrying SEO across with 301 redirects. Budget 2-4 weeks and $1,000-3,000.',
    },
    {
      question: 'How much traffic can each platform handle?',
      answer:
        'Both scale. Horoshop adds resources as traffic grows, subject to plan. Shopify scales up to Shopify Plus ($2,000+/mo) for very large volume.',
    },
    {
      question: 'How do they compare on SEO?',
      answer:
        'Both cover the basics — sitemap, canonical, schema. Shopify is slightly more mature technically. But content and links account for 90% of SEO, so the platform alone does not decide the outcome.',
    },
  ],
  related: ['opencart-vs-horoshop', 'horoshop-setup', 'opencart-store-development'],
}
