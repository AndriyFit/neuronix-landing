import type { BlogPost } from './types'
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
]

export function getAllPosts(): BlogPost[] {
  return [...allPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug)
}

export function getPostsByCategory(category: string): BlogPost[] {
  return allPosts.filter((p) => p.category === category)
}

export function getAllCategories(): string[] {
  return Array.from(new Set(allPosts.map((p) => p.category)))
}
