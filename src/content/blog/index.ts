import type { BlogPost } from './types'
import { allPostsEn } from './en'
import { post as opencartVsHoroshop } from './opencart-vs-horoshop'
import { post as opencartStoreDevelopment } from './opencart-store-development'
import { post as opencart1cIntegration } from './opencart-1c-integration'
import { post as horoshopSetup } from './horoshop-setup'
import { post as opencartMarketplaceSync } from './opencart-marketplace-sync'
import { post as vapiVoiceAgent } from './vapi-voice-agent'
import { post as n8nAutomation } from './n8n-automation'
import { post as keycrmIntegration } from './keycrm-integration'
import { post as landingPriceLviv } from './landing-price-lviv'
import { post as calculatorLanding } from './calculator-landing'
import { post as opencartModules } from './opencart-modules'
import { post as horoshopVsShopify } from './horoshop-vs-shopify'
import { post as websiteLaunchChecklist } from './website-launch-checklist'
import { post as websiteSpeedOptimization } from './website-speed-optimization'
import { post as aiBusinessAdvantage } from './ai-business-advantage'

export const allPosts: BlogPost[] = [
  opencartVsHoroshop,
  opencartStoreDevelopment,
  opencart1cIntegration,
  horoshopSetup,
  opencartMarketplaceSync,
  vapiVoiceAgent,
  n8nAutomation,
  keycrmIntegration,
  landingPriceLviv,
  calculatorLanding,
  opencartModules,
  horoshopVsShopify,
  websiteLaunchChecklist,
  websiteSpeedOptimization,
  aiBusinessAdvantage,
]

// Статті дзеркальні: однакові slug у обох мовах, тому hreflang uk↔en завжди валідний.
// Додаючи статтю — заводь її в ОБИДВІ мови, інакше одна локаль отримає 404 на URL,
// який інша віддає в sitemap як alternate.
const byLocale: Record<string, BlogPost[]> = { uk: allPosts, en: allPostsEn }

function postsFor(locale: string): BlogPost[] {
  return byLocale[locale] ?? allPosts
}

export function getAllPosts(locale = 'uk'): BlogPost[] {
  return [...postsFor(locale)].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

export function getPostBySlug(slug: string, locale = 'uk'): BlogPost | undefined {
  return postsFor(locale).find((p) => p.slug === slug)
}

export function getPostsByCategory(category: string, locale = 'uk'): BlogPost[] {
  return postsFor(locale).filter((p) => p.category === category)
}

export function getAllCategories(locale = 'uk'): string[] {
  return Array.from(new Set(postsFor(locale).map((p) => p.category)))
}
