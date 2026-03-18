import type { ReactNode } from 'react'

// Root layout just passes through to locale layout
// html and body tags are rendered in [locale]/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
