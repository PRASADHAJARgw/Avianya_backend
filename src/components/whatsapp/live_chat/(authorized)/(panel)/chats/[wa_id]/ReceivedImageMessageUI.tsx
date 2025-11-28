'use client'

import { useEffect, useState } from "react";
import { useSupabase } from "@/contexts/AuthContext";

export default function ReceivedImageMessageUI({ message }: { message: DBMessage }) {
    const { supabase } = useSupabase()
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    
    useEffect(() => {
        // Check if media_url is already a full URL (from our new implementation)
        if (message.media_url) {
            if (message.media_url.startsWith('http://') || message.media_url.startsWith('https://')) {
                // It's already a full URL, use it directly
                setImageUrl(message.media_url);
                return;
            } else {
                // It's a path, get the public URL from Supabase storage
                const { data } = supabase.storage
                    .from('chat-media')
                    .getPublicUrl(message.media_url);
                setImageUrl(data.publicUrl);
                return;
            }
        }
        
        // Fallback: Check if there's a direct link in the message data (from WhatsApp webhook)
        const messageData = message.message as Record<string, unknown>;
        const storagePath = (messageData?.image as Record<string, unknown>)?.link as string;
        
        if (storagePath) {
            if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
                // External URL, use directly
                setImageUrl(storagePath);
            } else {
                // Path in storage, get public URL
                const { data } = supabase.storage
                    .from('chat-media')
                    .getPublicUrl(storagePath);
                setImageUrl(data.publicUrl);
            }
        }
    }, [supabase.storage, message.media_url, message.message, setImageUrl])
    
    if (!imageUrl) {
        return <div className="h-[144px] bg-gray-200 rounded flex items-center justify-center text-gray-500">Loading image...</div>
    }
    
    return (
        <img alt="Image received" className="h-[144px] object-cover rounded" src={imageUrl} />
    )
}
