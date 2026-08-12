import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { getAllPosts, getPostBySlug } from '@/content/blog'
import { getBlogPostingSchema, getBreadcrumbSchema } from '@/lib/structured-data'
import Footer from '@/components/Footer'
import '../blog.css'
import { SITE_URL } from '@/lib/site'


type Props = { params: Promise<{ locale: string; slug: string }> }

// Статті дзеркальні в обох мовах (див. src/content/blog/index.ts).
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllPosts(locale).map((post) => ({ locale, slug: post.slug })),
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getPostBySlug(slug, locale)
  if (!post) return {}
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog/${slug}`,
      languages: {
        uk: `${SITE_URL}/uk/blog/${slug}`,
        en: `${SITE_URL}/en/blog/${slug}`,
        'x-default': `${SITE_URL}/uk/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `${SITE_URL}/${locale}/blog/${slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.keywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.metaDescription,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const messages = (await getMessages()) as Record<string, any>
  const t = messages.blog
  const post = getPostBySlug(slug, locale)
  if (!post) notFound()

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: t.home, url: `${SITE_URL}/${locale}` },
    { name: t.blog, url: `${SITE_URL}/${locale}/blog` },
    { name: post.title, url: `${SITE_URL}/${locale}/blog/${slug}` },
  ])

  const articleSchema = getBlogPostingSchema({
    title: post.metaTitle,
    description: post.metaDescription,
    slug: post.slug,
    locale,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    keywords: post.keywords,
  })

  const faqSchema =
    post.faq && post.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        }
      : null

  const related = (post.related || [])
    .map((relSlug) => getPostBySlug(relSlug, locale))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <article className="blog-post">
        <nav className="blog-breadcrumbs" aria-label="breadcrumbs">
          <Link href={`/${locale}`}>{t.home}</Link>
          <span>/</span>
          <Link href={`/${locale}/blog`}>{t.blog}</Link>
          <span>/</span>
          <span aria-current="page">{post.category}</span>
        </nav>

        <header className="blog-post-header">
          <span className="blog-post-category">{post.category}</span>
          <h1 className="blog-post-title">{post.title}</h1>
          <p className="blog-post-description">{post.description}</p>
          <div className="blog-post-meta">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString(t.dateLocale, {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </time>
            <span>·</span>
            <span>{post.readingTimeMin} {t.readingTime}</span>
          </div>
        </header>

        <aside className="blog-tldr">
          <strong>{t.tldr}</strong>
          <p>{post.tldr}</p>
        </aside>

        <div className="blog-content">
          {post.sections.map((section, idx) => (
            <section key={idx} className="blog-section">
              <h2>{section.heading}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {section.list && (
                <ul>
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
              {section.code && (
                <pre className="blog-code">
                  <code>{section.code}</code>
                </pre>
              )}
            </section>
          ))}
        </div>

        {post.faq && post.faq.length > 0 && (
          <section className="blog-faq">
            <h2>{t.faqTitle}</h2>
            <dl>
              {post.faq.map((item, i) => (
                <div key={i} className="blog-faq-item">
                  <dt>{item.question}</dt>
                  <dd>{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section className="blog-cta">
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaText}</p>
          <a
            href="https://t.me/neuronixjhbot"
            target="_blank"
            rel="noopener noreferrer"
            className="blog-cta-btn"
          >
            {t.ctaButton}
          </a>
        </section>

        {related.length > 0 && (
          <section className="blog-related">
            <h2>{t.relatedTitle}</h2>
            <ul>
              {related.map((rel) => (
                <li key={rel.slug}>
                  <Link href={`/${locale}/blog/${rel.slug}`}>
                    <span className="blog-related-category">{rel.category}</span>
                    <span className="blog-related-title">{rel.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
      <Footer />
    </>
  )
}
