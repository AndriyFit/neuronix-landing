export interface BlogSection {
  heading: string
  paragraphs: string[]
  list?: string[]
  code?: string
}

export interface BlogFAQ {
  question: string
  answer: string
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  category: string
  publishedAt: string
  updatedAt: string
  readingTimeMin: number
  tldr: string
  sections: BlogSection[]
  faq?: BlogFAQ[]
  related?: string[]
}
