/**
 * Canonical origin of the site. Single source of truth.
 *
 * This used to be copy-pasted into six files and drifted to a domain that
 * does not exist (neuronix.work), which sent every canonical, og:url and
 * sitemap entry to nowhere. Import from here — do not redeclare.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://neuronics.work'
