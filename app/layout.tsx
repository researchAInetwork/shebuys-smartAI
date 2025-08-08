import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import Navigation from "@/components/navigation"
import { CartProvider } from "@/components/cart-provider"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SheBuys Smart - AI-Powered Shopping for the Modern Woman",
  description: "Discover your perfect style with AI-powered recommendations, smart shopping tools, and personalized fashion insights designed for the modern woman.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <CartProvider>
            <Navigation />
            <main className="transition-colors duration-300">
              {children}
            </main>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
