import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, Fraunces, Plus_Jakarta_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import ScrollProgressBar from '@/components/ScrollProgressBar'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

// Vercel injects VERCEL_PROJECT_PRODUCTION_URL with the project's production domain,
// so the icon and Open Graph URLs resolve absolutely without hardcoding a host here.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ony's Boutique Custom Cakes | Calgary Custom Cakes",
  description:
    "Luxury custom cakes in Calgary, made with elevated design and exceptional taste. Wedding cakes, birthday cakes, and celebration cakes crafted to make every moment unforgettable.",
  keywords: ["custom cakes Calgary", "wedding cakes Calgary", "birthday cakes Calgary", "luxury cakes Calgary"],
  openGraph: {
    title: "Ony's Boutique Custom Cakes",
    description: "Luxury custom cakes in Calgary. Elevated design, exceptional taste.",
    siteName: "Ony's Boutique Custom Cakes",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${fraunces.variable} ${jakarta.variable}`}>
      <body>
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "x5m78bkkkd");
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18161715420"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18161715420');
          `}
        </Script>
        <ScrollProgressBar />
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
