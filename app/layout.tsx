import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'

// Schibsted Grotesk n'est pas encore exposée dans next/font/google (Next 15) :
// fichier variable wght 400→900, même contrat --font-schibsted.
const schibstedGrotesk = localFont({
  src: './fonts/SchibstedGrotesk-Variable.ttf',
  variable: '--font-schibsted',
  display: 'swap',
  weight: '400 900',
})

export const metadata: Metadata = {
  title: {
    default: 'Cartes Sport FR',
    template: '%s — Cartes Sport FR',
  },
  description: 'Coffret numérique de collection — albums, vestiaires et progression de sets',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
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
  themeColor: '#F7F5F2',
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
    <html lang="fr" className={schibstedGrotesk.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${schibstedGrotesk.className} ${schibstedGrotesk.variable} bg-museum text-ink font-sans font-medium antialiased text-[15px] md:text-base`}>
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
