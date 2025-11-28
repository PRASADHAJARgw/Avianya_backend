import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default async function LoginWrapper({ children }: { children: React.ReactNode }) {
    // Using shared supabase client
    const { data } = await supabase.auth.getUser()
    if (data.user) {
        redirect('/post-login')
    } else {
        return (
            <>
                {children}
            </>
        )
    }
}