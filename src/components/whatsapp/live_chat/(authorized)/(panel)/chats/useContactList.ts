import { useSupabase } from "@/contexts/AuthContext";
import { DBTables } from "@/lib/enums/Tables";
import { getTimeSince, isLessThanADay } from "@/lib/time-utils";
import { Contact, ContactFE } from "@/types/contact";
import { useCallback, useEffect, useRef, useState } from "react";

const API_BASE_URL = 'http://localhost:8080';

// Backend conversation type from our Go API
interface BackendConversation {
    id: number;
    user_id: string;
    waba_id: string;
    phone_number_id: string;
    customer_phone: string;
    customer_name: string;
    customer_profile_pic?: string;
    last_message: string;
    last_message_time: string;
    unread_count: number;
    status: string;
    created_at: string;
    updated_at: string;
}

// Transform backend conversation to Contact format
function transformToContact(conv: BackendConversation): Contact {
    return {
        wa_id: conv.customer_phone,
        phone_number: conv.customer_phone,
        name: conv.customer_name || conv.customer_phone,
        profile_pic_url: conv.customer_profile_pic || undefined,
        last_message_text: conv.last_message,
        last_message_at: conv.last_message_time,
        last_message_received_at: conv.updated_at,
        unread_count: conv.unread_count,
        in_chat: true,
        created_at: conv.created_at,
        updated_at: conv.updated_at,
    };
}

function sortContacts(contacts: Contact[]) {
    contacts.sort((a: Contact, b: Contact) => {
        if (!a.last_message_at || !b.last_message_at) {
            return 0;
        }
        const aDate = new Date(a.last_message_at)
        const bDate = new Date(b.last_message_at)
        if (aDate > bDate) {
            return -1;
        } else if (bDate > aDate) {
            return 1;
        }
        return 0;
    })
}

function addTimeSince(data: Contact[]): ContactFE[] {
    return data.map((contact: Contact) => {
        return {
            ...contact,
            timeSince: contact.last_message_at ? getTimeSince(new Date(contact.last_message_at)) : null,
        }
    })
}

export function useContactList(search: string, active: boolean) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [contacts, setContacts] = useState<ContactFE[]>([]);
    const { supabase } = useSupabase()
    const fetchedUntil = useRef<string | null>(null);
    const noMore = useRef<boolean>(false);
    const pageSize = 100
    
    // Fetch conversations from our Go backend API
    const getContacts = useCallback(async (active: boolean, before: string | undefined = undefined) => {
        console.log('🔵 useContactList: Fetching conversations from backend API');
        
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            
            if (!token) {
                console.error('🔴 No auth token available');
                return [];
            }

            const response = await fetch(`${API_BASE_URL}/api/live-chat/conversations?limit=${pageSize}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('🔵 useContactList: Received conversations:', data);
            
            const conversations: BackendConversation[] = data.conversations || [];
            
            // Transform backend conversations to Contact format
            const transformedContacts = conversations.map(transformToContact);
            
            // Filter by active status if needed
            const filteredContacts = active 
                ? transformedContacts.filter(c => c.last_message_received_at && 
                    isLessThanADay(new Date(c.last_message_received_at)))
                : transformedContacts.filter(c => c.last_message_received_at && 
                    !isLessThanADay(new Date(c.last_message_received_at)));
            
            return addTimeSince(filteredContacts);
        } catch (error) {
            console.error('🔴 Error fetching conversations:', error);
            return [];
        }
    }, [supabase, pageSize])
    
    const loadMore = useCallback(async () => {
        if (fetchedUntil.current && !noMore.current && !isLoading) {
            setIsLoading(true)
            try {
                const newContacts = await getContacts(active, fetchedUntil.current)
                if (newContacts.length > 0) {
                    setContacts(prev => [...prev, ...newContacts])
                    fetchedUntil.current = newContacts[newContacts.length - 1].last_message_at
                }
                if (newContacts.length < pageSize) {
                    noMore.current = true
                }
            } finally {
                setIsLoading(false)
            }
        }
    }, [getContacts, fetchedUntil, isLoading, setIsLoading, active])

    useEffect(() => {
        noMore.current = false
        fetchedUntil.current = null
    }, [active])

    useEffect(() => {
        const interval = setInterval(() => {
            setContacts((existingContacts) => {
                existingContacts = addTimeSince(existingContacts)
                return [...existingContacts]
            })
        }, 30000)
        return () => clearInterval(interval)
    }, [setContacts])

    useEffect(() => {
        setIsLoading(true)
        getContacts(active).then((contacts) => {
            setContacts(contacts)
            if (contacts.length > 0) {
                fetchedUntil.current = contacts[contacts.length - 1].last_message_at
            }
            if (contacts.length < pageSize) {
                noMore.current = true
            }
        }).catch((error) => {
            console.error('Error in useEffect', error)
        }).finally(() => {
            setIsLoading(false)
        })
    }, [getContacts, setContacts, setIsLoading, active]);
    
    // Poll for new messages every 30 seconds instead of Supabase subscription
    // This is a fallback in case WebSocket misses updates
    useEffect(() => {
        const interval = setInterval(() => {
            console.log('🔵 useContactList: Polling for new conversations');
            getContacts(active).then((contacts) => {
                setContacts(addTimeSince(contacts));
            }).catch((error) => {
                console.error('Error polling contacts', error);
            });
        }, 30000); // Poll every 30 seconds (reduced from 10)
        
        return () => clearInterval(interval);
    }, [getContacts, active]);
    
    return [contacts, loadMore, isLoading] as const;
}