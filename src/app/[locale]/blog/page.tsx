import type { Metadata } from 'next'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { getAllPosts, getAllCategories } from '@/content/blog'
import Footer from '@/components/Footer'
import './blog.css'
import { SITE_URL } from '@/lib/site'


type Props = { params: Promise<{ locale: string }> }

// Лише uk: статті існують тільки українською, /en/blog редіректить (next.config.ts).
export function generateStaticParams() {
  return [{ locale: 'uk' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isUk = locale === 'uk'
  const title = isUk
    ? 'Блог про розробку сайтів, OpenCart, Horoshop та автоматизацію'
    : 'Blog about web development, OpenCart, Horoshop and automation'
  const description = isUk
    ? 'Реальний досвід студії: OpenCart, Horoshop, інтеграції з 1С, KeyCRM, маркетплейсами. AI-агенти Vapi, n8n автоматизація бізнесу.'
    : 'Real studio experience: OpenCart, Horoshop, 1C integrations, KeyCRM, marketplaces. AI agents Vapi, n8n business automation.'
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/uk/blog`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/blog`,
      type: 'website',
    },
  }
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const posts = getAllPosts()
  const categories = getAllCategories()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Neuronix', item: `${SITE_URL}/${locale}` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Блог',
        item: `${SITE_URL}/${locale}/blog`,
      },
    ],
  }

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Neuronix Blog',
    url: `${SITE_URL}/${locale}/blog`,
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      url: `${SITE_URL}/${locale}/blog/${p.slug}`,
      datePublished: p.publishedAt,
      dateModified: p.updatedAt,
      author: { '@type': 'Organization', name: 'Neuronix' },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <article className="blog-index">
        <header className="blog-index-header">
          <nav className="blog-breadcrumbs" aria-label="breadcrumbs">
            <Link href={`/${locale}`}>Головна</Link>
            <span>/</span>
            <span aria-current="page">Блог</span>
          </nav>
          <h1 className="blog-index-title">Блог Neuronix</h1>
          <p className="blog-index-subtitle">
            Реальний досвід розробки сайтів, інтернет-магазинів і автоматизації бізнесу.
            Без води, з конкретикою.
          </p>
          <div className="blog-categories">
            {categories.map((cat) => (
              <span key={cat} className="blog-category-pill">
                {cat}
              </span>
            ))}
          </div>
        </header>

        <ul className="blog-list">
          {posts.map((post) => (
            <li key={post.slug} className="blog-card">
              <Link href={`/${locale}/blog/${post.slug}`} className="blog-card-link">
                <div className="blog-card-meta">
                  <span className="blog-card-category">{post.category}</span>
                  <span className="blog-card-date">
                    {new Date(post.publishedAt).toLocaleDateString('uk-UA', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="blog-card-time">· {post.readingTimeMin} хв</span>
                </div>
                <h2 className="blog-card-title">{post.title}</h2>
                <p className="blog-card-desc">{post.description}</p>
                <span className="blog-card-cta">Читати →</span>
              </Link>
            </li>
          ))}
        </ul>
      </article>
      <Footer />
    </>
  )
}
