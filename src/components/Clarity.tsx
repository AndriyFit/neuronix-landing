import Script from 'next/script'

/**
 * Microsoft Clarity — heatmaps, scroll maps, rage clicks, session recordings.
 * Renders nothing unless NEXT_PUBLIC_CLARITY_ID is set, so local and preview
 * builds stay untracked until the ID is configured in Vercel.
 */
export default function Clarity() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_ID
  if (!projectId) return null

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${projectId}");`}
    </Script>
  )
}
