import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Comment App - Scalable Comment System',
  description: 'A highly scalable comment application with nested comments, real-time notifications, and user authentication.',
  keywords: 'comments, nested comments, real-time, notifications, authentication',
  authors: [{ name: 'Comment App Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <header className="border-b bg-white">
              <div className="container mx-auto px-4 py-4">
                <h1 className="text-2xl font-bold text-primary">
                  💬 Comment App
                </h1>
                <p className="text-sm text-muted-foreground">
                  Highly scalable comment system with real-time notifications
                </p>
              </div>
            </header>
            
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            
            <footer className="border-t bg-muted/30 mt-16">
              <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
                <p>
                  Built with ❤️ focusing on backend performance, scalability, and clean architecture.
                </p>
                <p className="mt-2">
                  Features: Nested Comments • 15min Edit Window • Real-time Notifications • JWT Auth
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}