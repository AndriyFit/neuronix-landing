import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'n8n-automation',
  title: 'n8n business automation: 5 ready-made workflows',
  description:
    'How to automate business processes with n8n: OpenCart, CRM, Telegram and email integration. Five working scenarios from real projects.',
  metaTitle: 'n8n automation: 5 working workflows | Neuronix',
  metaDescription:
    'n8n replaces expensive Zapier and automates your business: OpenCart, KeyCRM, accounting and Telegram integration. Free self-hosted. Real cases.',
  keywords: [
    'n8n automation',
    'n8n examples',
    'n8n vs zapier',
    'n8n self-hosted',
    'n8n opencart',
    'n8n business automation',
  ],
  category: 'AI / Automation',
  publishedAt: '2026-03-11',
  updatedAt: '2026-05-12',
  readingTimeMin: 11,
  tldr:
    'n8n is an open-source alternative to Zapier and Make for automating business processes. Free when self-hosted, with 600+ integrations out of the box. It pays for itself in 1-2 months purely by removing the monthly subscription.',
  sections: [
    {
      heading: 'What n8n is and who needs it',
      paragraphs: [
        'n8n is a visual tool for connecting services and automating processes. You drag blocks — trigger, action, condition, loop — draw a workflow, and it runs without a line of code.',
        'It suits businesses running three or more services (say OpenCart plus KeyCRM plus Telegram plus Google Sheets) where copying data by hand is both tedious and error-prone.',
        'Alternatives: Zapier ($30-700/mo), Make ($10-300/mo), Pipedream ($20-100/mo). Self-hosted n8n is free — you pay only for the server, $5-10/mo.',
      ],
    },
    {
      heading: 'Workflow 1: OpenCart order → KeyCRM → Telegram',
      paragraphs: [
        'What it automates: a new website order creates a CRM lead, pings the manager in Telegram and appends a row to Google Sheets for reporting.',
        'How it is wired: a webhook node listens for the POST from OpenCart. On trigger, an HTTP node calls the KeyCRM API to create the lead, a Telegram node messages the manager with a "Take it" button, and a Sheets node adds the row.',
        'Result: managers respond in 1-2 minutes instead of 15-30. Sales conversion rises 15-25% purely from faster first contact.',
      ],
    },
    {
      heading: 'Workflow 2: Import a price list from Google Sheets into OpenCart',
      paragraphs: [
        'What it automates: every morning, read the current price list from Google Sheets (maintained by accounting), update prices in OpenCart, and send a report of what changed.',
        'How it is wired: a cron node fires at 07:00. A Sheets node reads SKUs and new prices. A function node checks whether the price actually changed. An HTTP node updates products through the OpenCart API. An email node sends the summary.',
        'Result: nobody spends 1-2 hours a day on manual updates, and prices are correct from first thing in the morning.',
      ],
    },
    {
      heading: 'Workflow 3: Abandoned cart → email after two hours',
      paragraphs: [
        'What it automates: if a customer added items and left an email but did not pay within two hours, send a personalised reminder with the product photo and a 10% discount.',
        'How it is wired: a cron node runs every 30 minutes. A SQL node reads carts marked abandoned older than two hours. For each, an HTTP node generates a discount code and an email node sends through SendPulse, Mailchimp or Postmark.',
        'Result: 15-25% of abandoned carts recovered. On $100k monthly turnover that is an extra $10-20k with no ongoing effort.',
      ],
    },
    {
      heading: 'Workflow 4: Binotel call → CRM',
      paragraphs: [
        'What it automates: on every inbound call, look the customer up in KeyCRM by number. Found — open the card for the manager. Not found — create one. Log duration and outcome.',
        'How it is wired: a Binotel webhook node listens for call events. A function node extracts the number. An HTTP node queries KeyCRM. An if node branches on found/not found, then either updates the existing card or creates a new one. A Telegram node notifies the manager.',
        'Result: the manager knows who is calling before picking up. Call history lands in the CRM automatically, and call-volume analytics come free.',
      ],
    },
    {
      heading: 'Workflow 5: An AI assistant in Telegram',
      paragraphs: [
        'What it automates: a Telegram bot answering routine customer questions — delivery times, order status, product information — through the OpenAI or Anthropic API.',
        'How it is wired: a Telegram trigger node listens for messages. A function node classifies the request. For order status, an HTTP node queries OpenCart and answers with real data. For general questions, an LLM node generates a reply with your company context.',
        'Result: 70-80% of routine questions answered instantly, 24/7. Managers step in only on the hard ones.',
      ],
    },
    {
      heading: 'Infrastructure for self-hosted n8n',
      paragraphs: [
        'Server: any VPS with 2 GB RAM (DigitalOcean, Hetzner, Contabo) at $5-10/mo.',
        'Deployment: Docker Compose with n8n, PostgreSQL and Caddy for HTTPS. Thirty minutes to stand up — we keep a ready compose file.',
        'Backups: daily database dumps to S3 or Backblaze, with workflows exported to JSON in Git.',
        'Monitoring: metrics and log shipping, plus Telegram alerts when a workflow fails.',
      ],
    },
    {
      heading: 'Why not Zapier or Make',
      paragraphs: [
        'Zapier: expensive ($30/mo minimum, $700+ at serious volume), task-capped, and your data travels through their US servers.',
        'Make: cheaper than Zapier ($10-30/mo) but gets confused on complex logic, and the interface is less legible than n8n.',
        'Self-hosted n8n: one-time setup cost ($300-800 through a studio), then just $5-10/mo for the server. Unlimited tasks, data on your own machine, and custom JavaScript anywhere in the workflow.',
        'Cloud n8n starts at $20/mo — still cheaper than Zapier or Make at comparable volume.',
      ],
    },
  ],
  faq: [
    {
      question: 'Can we start with n8n without a developer?',
      answer:
        'Yes. The drag-and-drop interface is approachable and there are plenty of video tutorials. Simple automations ("new form lead → Slack message") take an hour. Complex API logic needs some technical background or a consultation.',
    },
    {
      question: 'How many workflows can run at once?',
      answer:
        'A 2 GB RAM server comfortably runs 50-100 workflows at moderate load (10-100 executions a day each). Higher volume calls for 4-8 GB and scaling through worker mode.',
    },
    {
      question: 'If n8n goes down, do my processes break?',
      answer:
        'Yes, which is why monitoring and backups matter. We ping n8n every 30 seconds and alert to Telegram on failure, with daily database backups to separate storage. Recovery takes 5-15 minutes.',
    },
    {
      question: 'What about security — passwords and tokens?',
      answer:
        'n8n encrypts credentials in its database. For critical production API keys we keep them in a separate secret store (HashiCorp Vault or a self-hosted equivalent) and let n8n fetch them on demand.',
    },
    {
      question: 'Can n8n sync data with 1C accounting?',
      answer:
        'Yes, if 1C exposes a REST API or HTTP services. n8n acts as the bridge: read from accounting, transform, write to OpenCart, CRM or a spreadsheet. For simple cases a direct bridge without n8n is less overhead.',
    },
  ],
  related: ['vapi-voice-agent', 'keycrm-integration', 'opencart-1c-integration'],
}
