import { SupabaseClient } from "@supabase/supabase-js";
import { ContactBrowserRepository } from "./ContactBrowserRepository";

export default class ContactBrowserFactory {
  private static instance: ContactBrowserRepository | null = null;

  static getInstance(supabase: SupabaseClient): ContactBrowserRepository {
    if (!this.instance) {
      this.instance = new ContactBrowserRepository(supabase);
    }
    return this.instance;
  }

  static resetInstance(): void {
    this.instance = null;
  }
}