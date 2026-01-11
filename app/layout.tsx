import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jawudi Field Agent',
  description: 'Data collection tool for field agents',
  manifest: '/manifest.json',
  themeColor: '#061834',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Field Agent',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
