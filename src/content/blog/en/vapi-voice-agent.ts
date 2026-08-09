import type { BlogPost } from '../types'

export const post: BlogPost = {
  slug: 'vapi-voice-agent',
  title: 'Vapi voice AI agents for business: implementation',
  description:
    'How to deploy a Vapi-based voice AI agent in your business: inbound call handling, sales, support. Real cases and pricing.',
  metaTitle: 'Vapi voice agent: AI handles calls 24/7 | Neuronix',
  metaDescription:
    'A Vapi AI agent answers customer calls, qualifies leads and books appointments. CRM integration. Launch $500-2,000, then roughly half a cent per call.',
  keywords: [
    'vapi voice agent',
    'ai voice bot',
    'ai call handling',
    'voice bot for business',
    'vapi integration',
    'ai phone assistant',
  ],
  category: 'AI / Automation',
  publishedAt: '2026-03-04',
  updatedAt: '2026-05-12',
  readingTimeMin: 10,
  tldr:
    'Vapi is a platform for building voice AI agents. They handle inbound and outbound calls in Ukrainian or English, integrate with your CRM and can book appointments. Launch costs $500-2,000, then around half a cent per call plus a fixed line fee.',
  sections: [
    {
      heading: 'What Vapi is and why it matters',
      paragraphs: [
        'Vapi is a SaaS platform for building voice AI agents — an AI that speaks on the phone like a person, understands the caller, follows a script and takes action: writing to the CRM, booking a calendar slot, sending an SMS.',
        'It runs on GPT-4/Claude for reasoning, ElevenLabs or Cartesia for voice, and Twilio or Telnyx for telephony. Vapi glues these into one product with an API.',
        'Who it suits: businesses with 50+ inbound calls a day where a share of them are routine — bookings, information, order status. AI closes 70-80% of those and humans take only the hard ones.',
      ],
    },
    {
      heading: 'Real cases',
      paragraphs: [
        'A sports club: AI answers evenings and weekends when no staff are in. It books training sessions, adds the customer to the CRM and sends an SMS confirmation. That is 60-80 calls a week that used to go unanswered.',
        'An online store: AI fields order-status calls. "Where is my order?" — the agent looks it up and reads back the status and tracking number. Saves a manager 2-4 hours a day.',
        'A dental clinic: AI books appointments into free calendar slots, reminds patients a day ahead and reschedules on request. Runs 24/7, and patients like the instant response.',
        'B2B sales: AI runs outbound calls on a cold list, qualifies on budget, need and timeline, and hands qualified prospects to a human. Up to 200 calls a day costs about a dollar in call charges — the same work fills a manager\'s entire day.',
      ],
    },
    {
      heading: 'What Vapi can actually do',
      paragraphs: ['Core capabilities you configure:'],
      list: [
        'Speech recognition in Ukrainian, English and Russian at 95%+ accuracy',
        'Natural voice — 30+ voices from ElevenLabs and Cartesia, or clone your own from five minutes of recording',
        'Dynamic dialogue — the agent follows a script but adapts to context',
        'External system access — REST API calls mid-conversation to CRM, product database or calendar',
        'Warm transfer to a human when the agent is out of depth or the caller asks',
        'Recording and transcript — every call stored with full text for analysis',
        'Pacing and tone — the agent re-asks when uncertain and speeds up on calm calls',
      ],
    },
    {
      heading: 'Implementation architecture',
      paragraphs: [
        'Layer 1: the Vapi platform. This is where you create the assistant, write the prompt, pick voice and LLM, and configure tool calls.',
        'Layer 2: a backend with your custom logic. Our Worker or an n8n flow handles requests from Vapi — looking up an order, creating a CRM lead, booking a slot. Vapi calls your endpoint mid-conversation.',
        'Layer 3: integrations. CRM (KeyCRM, SalesDrive, Bitrix), calendar (Google Calendar, Calendly), product database from OpenCart or Horoshop, accounting for live stock.',
        'Layer 4: monitoring. Logs, Telegram alerts on errors, and a dashboard covering call duration, success rate and call topics.',
      ],
    },
    {
      heading: 'What it costs',
      paragraphs: [
        'Launch through us or another studio: $500-2,000 depending on integration complexity. A basic agent with 2-3 functions is $500-800; five or more integrations with complex logic runs $1,500-2,500.',
        'Then the calls themselves. On our projects a call lands around half a cent: the agent speaks for 45 seconds to a minute and a half. It does not hold long conversations — it closes the question fast or transfers to a human. That brevity is exactly what keeps the cost this low.',
        'Telephony is a fixed monthly line fee regardless of call volume.',
        'For a business doing 1,000 calls a month that totals roughly $5 in call charges plus the line — under $20 a month all in. A person covering the same ground costs $700-1,500 a month.',
        'These figures come from our live projects, not the Vapi price list. Actual cost depends on the LLM, the voice, and how tightly the script is written — a verbose agent talks longer and costs more.',
      ],
    },
    {
      heading: 'What not to expect from AI',
      paragraphs: [
        'AI will not handle emotionally complex calls. Conflict, complaints, loss — those need a person.',
        'AI will not close a high-ticket sale on its own. Qualify, yes. Carry a $5,000+ deal to signature, rarely. That is experienced sales work.',
        'AI does not imitate regional dialect well. Standard Ukrainian is solid; heavy regional speech is weaker.',
        'AI drifts on long calls (10+ minutes) and loses context. Short, targeted dialogues under five minutes are the sweet spot.',
      ],
    },
    {
      heading: 'Rollout stages',
      paragraphs: ['A 2-4 week deployment plan:'],
      list: [
        'Week 1: brief, analysis of current calls (7-14 days of recordings), script design',
        'Week 2: Vapi configuration, prompt writing, CRM integration, test calls',
        'Week 3: testing on real customers (10-30 calls), prompt fixes, escalation rules',
        'Week 4: full launch, 1-2 weeks of monitoring, iteration on results',
      ],
    },
  ],
  faq: [
    {
      question: 'Does the AI recognise Ukrainian properly?',
      answer:
        'Yes — 92-97% accuracy on standard Ukrainian. Strong regional accents drop it to 80-90%. Recognition improves every quarter as models are retrained.',
    },
    {
      question: 'What about GDPR and call recording?',
      answer:
        'Vapi stores recordings in the US or Europe. The agent must disclose recording at the start of the call, which we build into the script. Data can be deleted through the API on request. Fully GDPR-compliant when configured correctly.',
    },
    {
      question: 'Can we use our own SIP number?',
      answer:
        'Yes, via SIP trunk in Vapi. We connect your existing number from Binotel, Stream Telecom or another provider. Customers keep calling the familiar number — the AI answers.',
    },
    {
      question: 'How does quality compare to a human?',
      answer:
        'On routine questions AI is often better: faster, never tired, no mistakes. On complex ones a human is more flexible. In live deployments AI closes 70-80% of calls and passes 20-30% to a person.',
    },
    {
      question: 'How long will my integration take?',
      answer:
        'A simple agent (answers routine questions, writes to CRM): 5-7 days. A complex one (calendar booking, stock checks, escalation): 2-3 weeks.',
    },
  ],
  related: ['n8n-automation', 'keycrm-integration', 'opencart-store-development'],
}
