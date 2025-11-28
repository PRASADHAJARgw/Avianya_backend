import { supabase } from "@/lib/supabase/client";
import { DBTables } from "@/lib/enums/Tables";

async function markAsRead({messageIds, chatId}: { messageIds: number[], chatId: string}) {
    const chunkSize = 100;
    for (let i = 0; i < messageIds.length; i += chunkSize) {
        const chunk = messageIds.slice(i, i + chunkSize);
        const { error } = await supabase.from(DBTables.Messages).update({ read_by_user_at: new Date().toISOString() }).in('id', chunk);
        if (error) {
            console.error('Error marking messages as read:', error);
        }
    }
    
    // Update unread count for the contact
    try {
        const { error: updateError } = await supabase
            .from(DBTables.Contacts)
            .update({ unread_count: 0 })
            .eq('wa_id', chatId);
            
        if (updateError) {
            console.error('Error updating unread count:', updateError);
        }
    } catch (err) {
        console.error('Error in markAsRead:', err);
    }
}

export { markAsRead }
