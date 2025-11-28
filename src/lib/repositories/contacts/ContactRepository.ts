import { Contact } from "@/types/contact";

export interface ContactFilter {
  column: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in';
  value: string | number | boolean | string[] | number[];
}

export type ContactFilterArray = ContactFilter[];

export interface ContactSortOption {
  column: string;
  options: { ascending: boolean };
}

export interface ContactPaginationOption {
  limit: number;
  offset: number;
}

export interface ContactQueryResult {
  rows: Contact[];
  itemsCount?: number;
}

// This is the interface that ContactBrowserRepository should implement
export interface ContactRepository {
  getContacts(
    filter?: ContactFilterArray,
    sort?: ContactSortOption,
    pagination?: ContactPaginationOption,
    includeCount?: boolean
  ): Promise<ContactQueryResult>;

  getContactById(wa_id: string): Promise<Contact | null>;
}