import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { cn } from '@/utilities/ui'
import type { Metadata } from 'next'
import { Teko } from 'next/font/google'
import React from 'react'
import './globals.css'

const TekoFont = Teko({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={cn(TekoFont.className)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@lane7',
  },
}
