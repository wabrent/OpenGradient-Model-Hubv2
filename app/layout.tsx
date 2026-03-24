import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OpenGradient Model Hub - Verifiable AI Models',
  description: 'Explore 1500+ verifiable AI models with zkML proofs and TEE attestations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
