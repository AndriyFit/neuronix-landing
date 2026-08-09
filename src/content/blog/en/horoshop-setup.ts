import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'horoshop-setup',
  title: 'Turnkey Horoshop setup: the 2026 checklist',
  description:
    'A step-by-step checklist for launching an online store on Horoshop: plan, template, payments, delivery, integrations. What to do yourself and what to delegate.',
  metaTitle: 'Turnkey Horoshop setup: a 40-step checklist | Neuronix',
  metaDescription:
    'Launch a Horoshop store in 7 days: choosing a plan, template setup, payment gateways, carriers, accounting sync, SEO. Real agency experience.',
  keywords: [
    'horoshop setup',
    'horoshop turnkey',
    'horoshop launch',
    'horoshop guide',
    'ukrainian ecommerce platform',
    'horoshop agency',
  ],
  category: 'Horoshop',
  publishedAt: '2026-02-12',
  updatedAt: '2026-05-12',
  readingTimeMin: 10,
  tldr:
    'Horoshop is a Ukrainian hosted e-commerce platform, comparable to Shopify but built for this market. A turnkey launch takes 5-10 days. Basic configuration you can do yourself; a developer is needed for non-standard integrations, custom design and SEO. Budget $500-1,500.',
  sections: [
    {
      heading: 'Step 1: Choosing a plan',
      paragraphs: [
        'Horoshop offers four base plans: Old School ($30/mo), Express ($60), Premium ($120) and Enterprise (from $250). They differ in product limits, available modules, integrations and support priority.',
        'Express or Premium fits most startups and small businesses — Express for catalogs under 1,500 products, Premium for larger volumes and the full marketing toolkit.',
        'Do not start on Enterprise; it is overspend for a new venture. You can upgrade in a few clicks at any point. Annual billing cuts up to 20%.',
      ],
    },
    {
      heading: 'Step 2: Design and template',
      paragraphs: [
        'Horoshop ships around 20 ready templates. Pick the one closest to your niche: cosmetics, apparel, appliances, automotive, kids.',
        'Configure from the admin panel: logo, favicon, colour palette (2-3 primaries), fonts from the Google Fonts selection, button and product-card styling.',
        'If no template works, commission a custom one from the Horoshop studio or an outside developer. Custom design runs $500-2,000 over 2-4 weeks.',
        'Practical advice: do not over-customise at launch. Ship with minimal changes, watch how customers actually behave, then optimise.',
      ],
    },
    {
      heading: 'Step 3: Catalog structure',
      paragraphs: [
        'Keep categories and subcategories to three levels maximum. More and customers get lost; fewer and search becomes too broad.',
        'Product import runs through Excel (XLSX) or YML. Horoshop publishes a ready Excel template. Import takes 5-30 minutes depending on volume.',
        'Prepare per product: name (60-80 characters), SKU, price, description (200-500 words), 3-7 photos (square, minimum 1000x1000px), attributes, brand, availability.',
        'Structure attributes carefully — they are the foundation for filters. Do not write "Colour: red" on one product and "Color: red" on another.',
      ],
    },
    {
      heading: 'Step 4: Payments and delivery',
      paragraphs: [
        'Payment gateways available through Horoshop: LiqPay, Fondy, Wayforpay, Portmone. Registration takes 1-3 days; you paste the merchant ID and key into the admin panel and you are live.',
        'Delivery: integrations with Nova Poshta, Ukrposhta, Justin and Meest — the carriers that cover Ukraine. One click to enable, with a choice of branch-only or branch plus courier plus parcel lockers.',
        'Shipping cost is calculated automatically from carrier tariffs. Adding free delivery above a threshold lifts average order value by 15-30%.',
        'Add click-and-collect if you have a physical store. 10-20% of customers prefer it because it skips carrier fees.',
      ],
    },
    {
      heading: 'Step 5: Baseline SEO',
      paragraphs: [
        'Horoshop generates meta tags from a template, but the output is weak. Write title and description manually for:',
      ],
      list: [
        'The homepage (unique 50-60 character title with your primary keyword plus brand)',
        'Category pages (format: "Category name — buy in [city] at the best price")',
        'Product pages (name plus key attribute plus brand plus city)',
        'Utility pages — delivery, payment, warranty all deserve their own meta tags',
      ],
    },
    {
      heading: 'Step 6: Business-process integrations',
      paragraphs: [
        'CRM (KeyCRM, SalesDrive, Bitrix24): new website orders create a lead automatically. The manager sees it, calls, and moves it through the pipeline.',
        'Accounting (1C Trade Management): syncs products, stock and orders. Horoshop has a ready module that takes 2-3 days to configure.',
        'Marketplaces (Rozetka, Prom.ua): export the catalog as a YML feed and the marketplace pulls products automatically, discounts and nested categories included.',
        'Email marketing (eSputnik, SendPulse): export the customer base and run triggered campaigns for abandoned carts and repeat purchases.',
      ],
    },
    {
      heading: 'Step 7: Analytics and advertising',
      paragraphs: [
        'Google Analytics 4 plus Tag Manager is non-negotiable. Horoshop takes the GTM ID in a single field and all events and conversions flow into GA.',
        'Facebook Pixel installs the same way through GTM. Horoshop passes standard events (ViewContent, AddToCart, Purchase) automatically.',
        'Google Shopping feed is generated out of the box. Upload it to Merchant Center and run Performance Max or Shopping campaigns.',
        'Hotjar or Microsoft Clarity give you heatmaps and session recordings so you can see how customers actually move through the site. Free or cheap.',
      ],
    },
    {
      heading: 'What to do yourself, what to delegate',
      paragraphs: ['Splitting the work between you and a specialist:'],
      list: [
        'You: plan selection, basic design setup (logo, colours), product import via Excel, banners, static page copy',
        'A Horoshop specialist or our studio: complex template work, non-standard integrations, SEO strategy, ad campaign setup, technical optimisation',
        'A marketer: SEO copywriting, ad management, email campaigns, blog content plan',
        'A photographer: professional product shots. This one is critical — bad photos mean bad conversion, do not economise here',
      ],
    },
  ],
  faq: [
    {
      question: 'What does a turnkey Horoshop launch cost at an agency?',
      answer:
        'Basic launch (stock template, up to 200 products, standard integrations): $500-700 over 5-7 days. Extended (adapted design, deeper structure, 3-5 integrations): $1,000-1,500 over two weeks.',
    },
    {
      question: 'Can the plan be changed later?',
      answer:
        'Yes, any time from the admin panel. Upgrading charges the difference for the current month; downgrading applies from the next billing period.',
    },
    {
      question: 'What about a custom domain?',
      answer:
        'Buy it separately from any registrar and point it at Horoshop with a CNAME record. Free Let\'s Encrypt SSL is provisioned automatically.',
    },
    {
      question: 'Can a store be migrated from OpenCart to Horoshop?',
      answer:
        'Yes. Export products to Excel and import into Horoshop. The harder part is SEO: you need 301 redirects from old URLs to new ones or you lose traffic. Budget 1-2 weeks.',
    },
    {
      question: 'Is there a mobile app?',
      answer:
        'Horoshop has no native app, but stores on it are well adapted for mobile as a PWA. 70-80% of traffic comes from phones and it works without an app.',
    },
  ],
  related: ['opencart-vs-horoshop', 'keycrm-integration', 'opencart-marketplace-sync'],
}
