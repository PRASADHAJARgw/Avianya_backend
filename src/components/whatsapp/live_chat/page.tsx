import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import constants from '@/lib/constants'

export default async function Home() {
  // Using shared supabase client
  const session = await supabase.auth.getUser()
  if (session.data.user) {
    redirect(constants.DEFAULT_ROUTE)
  } else {
    redirect('/login')
  }
}
