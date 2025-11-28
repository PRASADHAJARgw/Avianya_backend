import { Contact } from "@/types/contact";
import { SupabaseClient } from "@supabase/supabase-js";
import { DBTables } from "@/lib/enums/Tables";
import { 
  ContactRepository, 
  ContactFilterArray, 
  ContactSortOption, 
  ContactPaginationOption, 
  ContactQueryResult 
} from "./ContactRepository";

export class ContactBrowserRepository implements ContactRepository {
  constructor(private supabase: SupabaseClient) {
    console.log('🔧 ContactBrowserRepository initialized with Supabase client');
  }

  async getContactById(wa_id: string): Promise<Contact | null> {
    console.log(`🔍 getContactById called with wa_id: ${wa_id}`);
    console.log(`🌐 Fetching from backend API instead of Supabase`);
    
    try {
      // Get auth token
      const { data: { session } } = await this.supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        console.error('❌ No auth token found');
        return null;
      }

      // Call backend API
      const API_BASE_URL = 'http://localhost:8080';
      const response = await fetch(`${API_BASE_URL}/api/live-chat/conversation/${wa_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`❌ API error: ${response.status} ${response.statusText}`);
        return null;
      }

      const result = await response.json();
      console.log('✅ API response:', result);

      if (!result.success || !result.conversation) {
        console.error('❌ Conversation not found');
        return null;
      }

      // Transform backend conversation to Contact type
      const conv = result.conversation;
      // Use customer_name if available and not empty, otherwise use phone number
      const contactName = (conv.customer_name && conv.customer_name.trim()) 
        ? conv.customer_name 
        : conv.customer_phone;
      
      const contact: Contact = {
        wa_id: conv.customer_phone,
        name: contactName,
        phone_number: conv.customer_phone,
        last_message_text: conv.last_message,
        last_message_at: conv.last_message_time,
        last_message_received_at: conv.last_message_time,
        unread_count: conv.unread_count,
        profile_pic_url: conv.customer_profile_pic || undefined,
        in_chat: true, // Always true for conversations from backend
        created_at: conv.created_at,
        updated_at: conv.updated_at,
      };

      console.log('✅ Contact transformed successfully:', contact);
      return contact;
    } catch (error) {
      console.error('❌ Error fetching contact from API:', error);
      return null;
    }
  }

  async getAllContacts(): Promise<Contact[]> {
    console.log('📋 getAllContacts called');
    console.log(`📋 Querying table: ${DBTables.Contacts} (value: "${DBTables.Contacts}")`);
    console.log('📋 Query: SELECT * FROM contacts ORDER BY last_message_at DESC');
    
    const { data, error } = await this.supabase
      .from(DBTables.Contacts)
      .select('*')
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching contacts:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      return [];
    }

    console.log(`✅ Contacts fetched successfully. Count: ${data?.length || 0}`);
    console.log('✅ First few contacts:', data?.slice(0, 3));
    return data as Contact[];
  }

  async updateContact(wa_id: string, updates: Partial<Contact>): Promise<Contact | null> {
    console.log(`📝 updateContact called with wa_id: ${wa_id}`, updates);
    console.log(`📋 Querying table: ${DBTables.Contacts}`);
    
    const { data, error } = await this.supabase
      .from(DBTables.Contacts)
      .update(updates)
      .eq('wa_id', wa_id)
      .single();

    if (error) {
      console.error('❌ Error updating contact:', error);
      return null;
    }

    console.log('✅ Contact updated successfully:', data);
    return data as Contact;
  }

  async createContact(contact: Omit<Contact, 'created_at' | 'updated_at'>): Promise<Contact | null> {
    console.log('➕ createContact called with:', contact);
    console.log(`📋 Inserting into table: ${DBTables.Contacts}`);
    
    const { data, error } = await this.supabase
      .from(DBTables.Contacts)
      .insert(contact)
      .single();

    if (error) {
      console.error('❌ Error creating contact:', error);
      return null;
    }

    console.log('✅ Contact created successfully:', data);
    return data as Contact;
  }

  async getContacts(
    filter?: ContactFilterArray,
    sort?: ContactSortOption,
    pagination?: ContactPaginationOption,
    includeCount?: boolean
  ): Promise<ContactQueryResult> {
    console.log('📋 getContacts called with parameters:');
    console.log('🔍 Filter:', filter);
    console.log('🔀 Sort:', sort);
    console.log('📄 Pagination:', pagination);
    console.log(`📋 Querying table: ${DBTables.Contacts} (value: "${DBTables.Contacts}")`);

    let query = this.supabase
      .from(DBTables.Contacts)
      .select('*', { count: includeCount ? 'exact' : undefined });

    // Apply filters
    if (filter && filter.length > 0) {
      filter.forEach(f => {
        console.log(`🔍 Applying filter: ${f.column} ${f.operator} ${f.value}`);
        query = query.filter(f.column, f.operator, f.value);
      });
    }

    // Apply sorting
    if (sort) {
      console.log(`🔀 Applying sort: ${sort.column} ${sort.options.ascending ? 'ASC' : 'DESC'}`);
      query = query.order(sort.column, sort.options);
    }

    // Apply pagination
    if (pagination) {
      console.log(`📄 Applying pagination: limit ${pagination.limit}, offset ${pagination.offset}`);
      query = query.range(pagination.offset, pagination.offset + pagination.limit - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('❌ Error in getContacts:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      return { rows: [], itemsCount: 0 };
    }

    console.log(`✅ getContacts completed. Returned ${data?.length || 0} contacts`);
    console.log(`📊 Total count: ${count ?? 'not requested'}`);
    if (data && data.length > 0) {
      console.log('✅ Sample contact data structure:', data[0]);
      console.log('✅ Available fields in first contact:', Object.keys(data[0]));
    }

    return {
      rows: data as Contact[] || [],
      itemsCount: count || undefined
    };
  }
}