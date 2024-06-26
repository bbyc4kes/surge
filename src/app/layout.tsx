import type { Metadata } from 'next'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { extractRouterConfig } from 'uploadthing/server'
import { DM_Sans as FontSans } from 'next/font/google'
import { cn } from '@/lib/utils'
import './globals.css'
import { ThemeProvider } from '@/providers/theme-provider'
import { ourFileRouter } from './api/uploadthing/core'
import ModalProvider from '@/providers/modal-provider'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnarToaster } from '@/components/ui/sonner'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})
export const metadata: Metadata = {
  title:
    'Surge | Agency for your next project. Create and deploy your SaaS on #1 platform.',
  description:
    'At Surge, we specialize in transforming your ideas into cutting-edge software-as-a-service products that drive innovation and success. Our comprehensive services cover every aspect of SaaS development, from concept and design to deployment and maintenance, ensuring a seamless and efficient process tailored to your specific needs.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <ModalProvider>
            {children}
            <Toaster />
            <SonnarToaster position="bottom-left" />
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
