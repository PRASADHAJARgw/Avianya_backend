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
        console.log('🏭 Creating ContactBrowserFactory instance...');
        const contactRepository = ContactBrowserFactory.getInstance(supabase);
        console.log('✅ ContactRepository instance created');

        const limit = options.pageSize;
        const offset = options.pageSize * options.pageIndex;
        let filter: ContactFilterArray | undefined = undefined

        if (options.searchFilter) {
            console.log(`🔍 Creating search filter for: "${options.searchFilter}"`);
            filter = [];
            // Try both 'name' and 'profile_name' fields since database schema might vary
            filter.push({
                column: "name",
                operator: "ilike",
                value: `%${options.searchFilter}%`
            });
            // Add alternative search on profile_name if it exists
            console.log('🔍 Filter created:', filter);
        }

        console.log('🔄 Calling getContacts with:');
        console.log('  - Filter:', filter);
        console.log('  - Sort: created_at DESC');
        console.log('  - Pagination:', { limit, offset });
        console.log('  - Include count: true');

        const result = await contactRepository.getContacts(
            filter,
            { column: 'created_at', options: { ascending: false } },
            { limit: limit, offset: offset},
            true,
        );

        console.log('✅ getContacts result:', {
            rowsCount: result.rows?.length || 0,
            totalCount: result.itemsCount,
            firstRow: result.rows?.[0] || null
        });

        const pageCount = result.itemsCount ? Math.ceil(result.itemsCount / itemsPerPage) : -1;
        console.log(`📄 Page calculation: ${result.itemsCount} total items, ${itemsPerPage} per page = ${pageCount} pages`);

        console.log('✅ fetchData completed successfully');
        return {
            rows: result.rows,
            pageCount
        };
    } catch (error) {
        console.error('❌ Error in fetchData:', error);
        return {
            rows: [],
            pageCount: 0
        };
    }
}