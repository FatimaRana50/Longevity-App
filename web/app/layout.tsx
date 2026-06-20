import type { Metadata } from 'next'
import { Lora, Inter } from 'next/font/google'
import './globals.css'

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
  preload: false,
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  title: 'The Longevity Game',
  description: 'Discover your longevity philosophy.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lora.variable} ${inter.variable}`}>
      <body className="bg-background text-text-primary antialiased">
        {children}
      </body>
    </html>
  )
}
