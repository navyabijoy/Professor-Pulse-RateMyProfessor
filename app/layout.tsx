import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ProfessorPulse',
  description: 'Find the perfect professor for your studies',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
        </head>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}