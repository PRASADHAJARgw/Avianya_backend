export interface Contact {
  wa_id: string;
  name?: string;
  profile_name?: string; // Alternative name field that might exist in database
  phone_number?: string;
  profile_pic_url?: string;
  last_message_at: string | null;
  last_message_received_at: string | null;
  last_message_text?: string;
  in_chat: boolean;
  unread_count?: number;
  created_at?: string;
  updated_at?: string;
  assigned_to?: string | null;
}

export interface ContactFE extends Contact {
  timeSince: string | null;
}
