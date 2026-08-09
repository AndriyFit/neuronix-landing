import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'keycrm-integration',
  title: 'KeyCRM integration with OpenCart and Horoshop',
  description:
    'How to connect KeyCRM to an OpenCart or Horoshop store. Two-way sync of orders, customers, statuses and products.',
  metaTitle: 'KeyCRM + OpenCart / Horoshop: lead automation | Neuronix',
  metaDescription:
    'We connect KeyCRM to OpenCart and Horoshop: website orders land in the CRM automatically, statuses sync back to the site, calls and chats in one window.',
  keywords: [
    'keycrm integration',
    'keycrm opencart',
    'keycrm horoshop',
    'crm for online store',
    'keycrm setup',
    'crm opencart integration',
  ],
  category: 'Integrations',
  publishedAt: '2026-03-18',
  updatedAt: '2026-05-12',
  readingTimeMin: 9,
  tldr:
    'KeyCRM is a Ukrainian CRM with ready-made integrations for OpenCart, Horoshop, Prom and Rozetka. A website lead lands in your pipeline automatically and the manager works it from a single window. Setup takes 2-5 days, $200-600.',
  sections: [
    {
      heading: 'Why KeyCRM instead of Bitrix or Salesforce',
      paragraphs: [
        'KeyCRM was built by a Ukrainian business for Ukrainian businesses. The interface is native Ukrainian rather than an awkward translation, and it ships with working integrations for Nova Poshta, Ukrposhta, LiqPay, Vapi and Binotel — the carriers and payment providers this market actually uses.',
        'Pricing starts at $15 per user per month. Bitrix24 runs $25-100 per user and Salesforce $50-300. For a team of 3-10 managers, KeyCRM saves $200-2,000 a month.',
        'Best fit: online stores handling 50+ orders a day across several channels — website, marketplaces, phone, Instagram. It pulls every lead into one pipeline.',
      ],
    },
    {
      heading: 'What gets synchronised',
      paragraphs: [
        'Site to CRM: a new order becomes a lead or a deal, depending on your configuration. Customer details (name, phone, email), the product list, payment and shipping method all come across.',
        'CRM to site: a status change pushes back so the customer sees the current state in their account or receives an email/SMS.',
        'Optional: products from CRM synced into the site catalog. This is rarely needed — the flow usually runs the other way.',
        'Calls: integration with Binotel, Stream Telecom or Phonet records every call against the customer card, so the manager sees the full conversation history.',
      ],
    },
    {
      heading: 'Setting it up for OpenCart',
      paragraphs: [
        'KeyCRM ships an OpenCart module you install on your site. Configuration happens in the admin panel:',
      ],
      list: [
        'Get an API key in KeyCRM (Administration → API)',
        'Install the module on OpenCart (FTP upload or via the admin panel)',
        'Enter the API key plus the pipeline/stage ID for new orders',
        'Map OpenCart statuses to KeyCRM ones (for example site "New" → CRM "New lead")',
        'Place a test order and verify it arrives with the correct fields',
      ],
    },
    {
      heading: 'Setting it up for Horoshop',
      paragraphs: [
        'Horoshop — a Ukrainian SaaS e-commerce platform — makes this even simpler: a single "Connect KeyCRM" toggle in the admin panel after you paste the API key.',
        'Every Horoshop order flows into the KeyCRM pipeline automatically, with statuses syncing both ways.',
        'The product catalog syncs too, so KeyCRM knows current stock, prices and descriptions from Horoshop.',
        'Setup takes 30 minutes to 2 hours depending on pipeline complexity and user count.',
      ],
    },
    {
      heading: 'Structuring the sales pipeline',
      paragraphs: [
        'A typical pipeline for an online store:',
      ],
      list: [
        '1. New lead — request received, waiting for a manager',
        '2. In progress — manager picked it up and is calling the customer',
        '3. Qualified — customer confirmed and is ready to pay',
        '4. Awaiting payment — invoice issued, waiting',
        '5. Paid — money received, preparing for shipment',
        '6. Shipped — parcel handed to the carrier',
        '7. Delivered — customer received it, waiting for feedback',
        '8. Closed — successful deal',
        '9. Cancelled — customer declined (with a reason)',
      ],
    },
    {
      heading: 'Automations worth setting up',
      paragraphs: [
        'Lead auto-assignment between managers: round-robin, or by geography or product type.',
        'Overdue lead reminders: if a lead sits in "New" for more than 30 minutes, alert the team lead.',
        'Triggered SMS to the customer: on "Shipped" send the tracking number; on "Delivered" ask for a review.',
        'Dashboards for management: total pipeline value, stage-by-stage conversion, per-manager productivity.',
      ],
    },
    {
      heading: 'Telephony and messenger integrations',
      paragraphs: [
        'Binotel/Stream Telecom: every inbound and outbound call is logged against the customer card, so managers reach conversation history in one click.',
        'Telegram, Viber and WhatsApp can be merged into a single KeyCRM panel — no more switching between apps.',
        'Instagram Direct: messages arrive straight in KeyCRM and can be answered from the same window.',
        'This multi-channel setup lets managers handle 30-50% more customers without losing quality.',
      ],
    },
    {
      heading: 'Real case: a cosmetics store',
      paragraphs: [
        'Client: a cosmetics store on Horoshop, 80-150 orders a day across 5 channels (website, Rozetka, Prom, Instagram, Telegram).',
        'Before KeyCRM: 3 managers kept losing leads while switching between Telegram, Instagram, Excel and the Horoshop admin panel. Conversion sat at 24%.',
        'After: every channel in one window, automated distribution, reminders. Conversion reached 35%. The same 3 managers now process 200 orders a day.',
        'Cost: $400 for our work plus $45/month for a 3-user KeyCRM subscription. Payback: a week and a half.',
      ],
    },
  ],
  faq: [
    {
      question: 'Can we migrate from Bitrix24 to KeyCRM?',
      answer:
        'Yes. We export customers and deals from Bitrix via the API and import them into KeyCRM. The harder part is rebuilding pipelines and automations from scratch. Expect 1-2 weeks and $300-800.',
    },
    {
      question: 'Which channels can be connected at once?',
      answer:
        'OpenCart, Horoshop, Rozetka, Prom.ua, Instagram, Telegram, Viber, WhatsApp Business, Binotel/Stream Telecom, email and your contact form — all through KeyCRM into one pipeline. Enough for most businesses.',
    },
    {
      question: 'Is there a mobile app?',
      answer:
        'KeyCRM has iOS and Android apps. Managers can work leads from a phone: reply to messengers, make calls, change statuses.',
    },
    {
      question: 'What about GDPR and customer data protection?',
      answer:
        'Data is stored on KeyCRM servers in Ukraine, encrypted in transit and at rest. Customer data can be deleted on request (GDPR right to be forgotten). Backups run daily.',
    },
    {
      question: 'Can Vapi (an AI voice agent) be connected to KeyCRM?',
      answer:
        'Yes. Vapi creates deals and leads in KeyCRM through the API during the call itself. The conversation is recorded and the transcript is attached to the card automatically. Add 2-3 days on top of the base integration.',
    },
  ],
  related: ['vapi-voice-agent', 'opencart-1c-integration', 'horoshop-setup'],
}
