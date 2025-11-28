import 'server-only'

import SupabaseUserProvider from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import NextTopLoader from 'nextjs-toploader'
import './globals.css'
import SupabaseProvider from '@/contexts/AuthContext'

// do not cache this layout
export const revalidate = 0

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Using shared supabase client

  const {
    data: { session },
  } = await supabase.auth.getSession()
  return (
    <html lang="en">
      <head>
        <title>Receevi</title>
        <meta name="description" content="Whatsapp Cloud API Webhook" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <NextTopLoader color="#000" />
        <SupabaseProvider supabaseUrl={process.env.SUPABASE_URL} supabaseAnonKey={process.env.SUPABASE_ANON_KEY}>
          <SupabaseUserProvider user={session?.user}>
            {children}
          </SupabaseUserProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
