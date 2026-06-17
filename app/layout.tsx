import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Cartes Sport FR',
    template: '%s — Cartes Sport FR',
  },
  description: 'Catalogue, collection et cote de marché des cartes Panini Adrenalyn XL et Topps Chrome UEFA',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CartesSport',
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Cartes Sport FR',
  },
}

export const viewport: Viewport = {
  themeColor: '#08080E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-canvas text-white antialiased">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && !location.hostname.includes('localhost')) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              } else if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then((regs) => {
                  regs.forEach((r) => r.unregister());
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
