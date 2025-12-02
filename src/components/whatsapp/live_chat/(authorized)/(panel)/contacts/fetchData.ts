import ContactBrowserFactory from "@/lib/repositories/contacts/ContactBrowserFactory"
import { ContactFilterArray } from "@/lib/repositories/contacts/ContactRepository"
import { SupabaseClient } from "@supabase/supabase-js"

export const itemsPerPage = 10

export async function fetchData(supabase: SupabaseClient, options: {
    pageIndex: number
    pageSize: number
    searchFilter: string
}) {
    console.log('🚀 fetchData function called');
    console.log('📊 Parameters:', {
        pageIndex: options.pageIndex,
        pageSize: options.pageSize,
        searchFilter: options.searchFilter,
        supabaseInstance: 'Connected',
        itemsPerPage
    });

    try {
        // Get selected WABA ID from localStorage or context (example: localStorage)
        const waba_id = localStorage.getItem('selected_waba_id') || '';
        if (!waba_id) {
            console.warn('⚠️ No WABA ID selected, cannot fetch contacts');
            return { rows: [], pageCount: 0 };
        }
        // Fetch contacts from Go backend API
        const contacts = await (await import('@/lib/repositories/contacts/ContactBrowserRepository')).ContactBrowserRepository.fetchContactsFromGoAPI(waba_id);
        const pageCount = contacts.length ? Math.ceil(contacts.length / itemsPerPage) : -1;
        console.log('✅ fetchData completed successfully (Go API)');
        return {
            rows: contacts,
            pageCount
        };
    } catch (error) {
        console.error('❌ Error in fetchData (Go API):', error);
        return {
            rows: [],
            pageCount: 0
        };
    }
}