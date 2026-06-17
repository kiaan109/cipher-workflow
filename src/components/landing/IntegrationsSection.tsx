'use client';

import { motion } from 'framer-motion';

const ROW1 = [
  'Slack','GitHub','Notion','Linear','Jira','Figma','Stripe','Twilio',
  'Airtable','HubSpot','Salesforce','Zendesk','Asana','Monday.com','Trello','Intercom',
  'Mailchimp','Shopify','BigCommerce','Webflow','WordPress','Zapier','n8n','Make',
  'OpenAI','Anthropic','Gemini','Mistral','Groq','Cohere','Pinecone','Weaviate',
];
const ROW2 = [
  'PostgreSQL','MySQL','MongoDB','Redis','Supabase','Firebase','PlanetScale','Turso',
  'AWS','GCP','Azure','Cloudflare','Vercel','Railway','Fly.io','Render',
  'Discord','Telegram','WhatsApp','SMS','Email','Webhooks','REST','GraphQL',
  'Spotify','YouTube','Twitter','LinkedIn','Instagram','TikTok','Dribbble','Behance',
];

function IntegrationRow({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: 'hidden', mask: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)', WebkitMask: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)' }}>
      <div style={{
        display: 'flex', gap: 12, width: 'max-content',
        animation: `lp-marquee${reverse ? '-reverse' : ''} 35s linear infinite`,
      }}>
        {doubled.map((name, i) => (
          <div key={i} className="liquid-glass" style={{
            borderRadius: '0.625rem', padding: '0.5rem 1rem', flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: 6, flexShrink: 0,
              background: `hsl(${(i * 47) % 360},65%,55%)`,
              opacity: 0.8,
            }} />
            <span style={{ fontSize: 12.5, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function IntegrationsSection() {
  return (
    <section id="integrations" style={{ background: '#000', padding: '7rem 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center', marginBottom: '4rem' }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1.25rem' }}
        >// Integrations</motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading"
          style={{ fontSize: 'clamp(2.5rem,7vw,5rem)', color: '#fff', lineHeight: 0.92, letterSpacing: '-0.04em', marginBottom: '1rem' }}
        >
          <span className="accent-gradient-text">1,431+</span> integrations.<br />Works with everything.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', maxWidth: 480, margin: '0 auto 3rem' }}
        >
          Connect any tool in your stack. Your agents plug straight in with zero configuration.
        </motion.p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <IntegrationRow items={ROW1} />
        <IntegrationRow items={ROW2} reverse />
      </div>
    </section>
  );
}
