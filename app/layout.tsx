import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, Sora, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _bebasNeue = Bebas_Neue({ 
  subsets: ["latin"],
  variable: '--font-bebas',
  weight: '400',
})

const _sora = Sora({ 
  subsets: ["latin"],
  variable: '--font-sora',
  weight: ['300', '400', '500', '600', '700'],
})

const _inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Adventure Awaits | The Real Journey',
  description: 'Experience adventure travel like never before. No hotels. No comfort. No escape. Just the raw, unfiltered wilderness.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
      lang="en" 
      data-scroll-behavior="smooth"
      className={`${_bebasNeue.variable} ${_sora.variable} ${_inter.variable} scroll-smooth`}
      style={{
        backgroundColor: 'hsl(150 60% 8%)',
        color: 'hsl(150 20% 95%)',
      }}
    >
      <body className="font-sans antialiased text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
