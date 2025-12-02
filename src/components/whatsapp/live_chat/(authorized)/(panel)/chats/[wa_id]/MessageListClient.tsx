'use client'

import { useEffect, useRef, useState, useCallback } from "react"
import ReceivedImageMessageUI from "./ReceivedImageMessageUI"
import ReceivedTextMessageUI from "./ReceivedTextMessageUI"
import TailWrapper from "./TailWrapper"
import ReceivedTemplateMessageUI from "./ReceivedTemplateMessageUI"
import ReceivedVideoMessageUI from "./ReceivedVideoMessageUI"
import ReceivedDocumentMessageUI from "./ReceivedDocumentMessageUI"
import { useSupabase } from "@/contexts/AuthContext"
import { useWebSocket, WSMessage } from "@/hooks/useWebSocket"

// ✅ FIX 1: SIMPLIFIED TIME FORMATTING
// using standard Intl.DateTimeFormat is more reliable than manual parsing
function formatTimeIST(date: Date): string {
    const formatted = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
    }).format(date).toLowerCase(); // matches "11:08 pm" format
    
    console.log('⏰ formatTimeIST input:', date.toISOString(), '→ output:', formatted);
    return formatted;
}

function formatDateIST(date: Date): string {
    const formatted = new Intl.DateTimeFormat('en-GB', { // en-GB gives DD/MM/YYYY
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'
    }).format(date);
    
    console.log('📅 formatDateIST input:', date.toISOString(), '→ output:', formatted);
    return formatted;
}

interface ConversationData {
    id: string;
    customer_name?: string;
    customer_phone?: string;
    source?: string;
    status?: string;
    last_active?: string;
    created_at?: string;
    template_messages?: number;
    session_messages?: number;
    unresolved_queries?: number;
}

interface JourneyEvent {
    action: string;
    actor?: string;
    timestamp: string;
}


// Type definitions for messages
interface MessageJson {
    type: string;
    content: string;
    body?: string;
    to?: string | null;
    from?: string;
    media_url?: string;
    caption?: string;
}

interface TextMessage extends MessageJson {
    type: 'text';
    body?: string;
}

interface TemplateMessage extends MessageJson {
    type: 'template';
}

interface BackendMessage {
    id: string; // Database Primary Key
    conversation_id: string;
    message_id: string; // Internal Message ID
    wa_message_id: string; // WhatsApp ID (Can be empty!)
    content: string;
    message_type: string;
    media_url?: string;
    media_caption?: string;
    sender: string;
    status: string;
    created_at: string;
}

interface UIMessage extends BackendMessage {
    msgDate: string;
    messageBody: MessageJson;
    uniqueKey: string; // New field for reliable rendering
}

function addDateToMessages(messages: BackendMessage[]): UIMessage[] {
    return messages.map((msg) => {
        const messageBody: MessageJson = {
            type: msg.message_type,
            content: msg.content,
            body: msg.content,
            to: msg.sender === 'user' ? msg.conversation_id : null,
            from: msg.sender,
            ...(msg.media_url && { media_url: msg.media_url }),
            ...(msg.media_caption && { caption: msg.media_caption }),
        };

        console.log('📨 Message from backend:', {
            id: msg.id,
            created_at_raw: msg.created_at,
            created_at_type: typeof msg.created_at
        });

        const rawDate = new Date(msg.created_at);
        console.log('🕐 Parsed date:', {
            iso: rawDate.toISOString(),
            local: rawDate.toString(),
            valid: !isNaN(rawDate.getTime())
        });
        
        // ✅ FIX 2: ROBUST UNIQUE KEY GENERATION
        // ALWAYS use the database ID as the primary key to ensure uniqueness
        // This prevents duplicate key errors even if wa_message_id is duplicated in DB
        const uniqueKey = `db_${msg.id}`;

        return {
            ...msg,
            msgDate: formatDateIST(rawDate),
            messageBody,
            uniqueKey: uniqueKey 
        };
    });
}

export default function MessageListClient({ from }: { from: string }) {
    const { supabase } = useSupabase()
    const [stateMessages, setMessages] = useState<UIMessage[]>([])
    const [additionalMessagesLoading, setAdditionalMessagesLoading] = useState(false)
    const [noMoreMessages, setNoMoreMessages] = useState(false)
    const [conversationId, setConversationId] = useState<string | null>(null)
    const [conversationData, setConversationData] = useState<ConversationData | null>(null)
    const [customerJourney, setCustomerJourney] = useState<JourneyEvent[]>([])
    
    const conversationIdRef = useRef<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        conversationIdRef.current = conversationId;
    }, [conversationId]);

    // Helper to keep scroll at bottom
    const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTo({
                top: messagesEndRef.current.scrollHeight,
                behavior: behavior
            });
        }
    }

    // 1. Fetch Conversation ID
    useEffect(() => {
        async function fetchConversationId() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token;
                if (!token) return;

                const response = await fetch(`http://localhost:8080/api/live-chat/conversation/${from}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.conversation) {
                        setConversationId(result.conversation.id.toString());
                    }
                }
            } catch (error) {
                console.error('Error fetching conversation ID:', error);
            }
        }
        fetchConversationId();
    }, [from, supabase]);

    // 2. Fetch Messages Function
    const fetchMessages = useCallback(async (limit: number = 50, offset: number = 0): Promise<BackendMessage[]> => {
        if (!conversationId) return [];

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token) return [];

            const response = await fetch(
                `http://localhost:8080/api/live-chat/messages?conversation_id=${conversationId}&limit=${limit}&offset=${offset}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (!response.ok) return [];
            const result = await response.json();
            return result.success && Array.isArray(result.messages) ? result.messages : [];
        } catch (error) {
            console.error('Error fetching messages:', error);
            return [];
        }
    }, [conversationId, supabase]);

    // 3. Initial Load
    useEffect(() => {
        if (!conversationId) return;

        const loadMessages = async () => {
            const messages = await fetchMessages(50, 0);
            if (messages.length === 0) setNoMoreMessages(true);

            const uiMessages = addDateToMessages(messages);
            console.log('📥 Initial load - all uniqueKeys:', uiMessages.map(m => m.uniqueKey));
            
            // Remove duplicates based on database ID (most reliable)
            const seen = new Map<string, UIMessage>();
            const uniqueMessages: UIMessage[] = [];
            
            for (const msg of uiMessages) {
                const key = msg.id?.toString() || msg.uniqueKey;
                if (!seen.has(key)) {
                    seen.set(key, msg);
                    uniqueMessages.push(msg);
                } else {
                    console.warn('⚠️ DUPLICATE REMOVED from initial load:', {
                        uniqueKey: msg.uniqueKey,
                        id: msg.id,
                        content: msg.content?.substring(0, 20)
                    });
                }
            }
            
            if (uniqueMessages.length < uiMessages.length) {
                console.log('✅ Removed', uiMessages.length - uniqueMessages.length, 'duplicates from initial load');
            }
            
            setMessages(uniqueMessages); // Set only unique messages
            
            // Scroll to bottom after a slight delay to ensure rendering
            setTimeout(() => scrollToBottom('auto'), 100);
        };

        loadMessages();
    }, [conversationId, fetchMessages]);

    // 4. WebSocket Handler
    const { isConnected } = useWebSocket({
        onNewMessage: (data) => {
            const currentConvId = conversationIdRef.current;
            const receivedConvId = data.conversation_id?.toString();

            if (data.conversation_id && currentConvId && receivedConvId === currentConvId && data.message) {
                // Convert WS message to Backend format
                const backendMsg: BackendMessage = {
                    id: data.message.id.toString(),
                    conversation_id: data.message.conversation_id.toString(),
                    message_id: data.message.message_id,
                    wa_message_id: data.message.wa_message_id || '',
                    content: data.message.content,
                    message_type: data.message.message_type,
                    media_url: data.message.media_url,
                    media_caption: data.message.media_caption,
                    sender: data.message.sender,
                    status: data.message.status,
                    created_at: data.message.created_at,
                };
                
                const uiMessage = addDateToMessages([backendMsg])[0];

                setMessages(prev => {
                    // Check for duplicate by uniqueKey, database ID, or wa_message_id
                    const exists = prev.some(msg => 
                        msg.uniqueKey === uiMessage.uniqueKey || 
                        msg.id === uiMessage.id ||
                        (msg.wa_message_id && uiMessage.wa_message_id && msg.wa_message_id === uiMessage.wa_message_id)
                    );
                    
                    if (exists) {
                        console.log('🔄 Duplicate message blocked:', {
                            uniqueKey: uiMessage.uniqueKey,
                            id: uiMessage.id,
                            wa_message_id: uiMessage.wa_message_id
                        });
                        return prev;
                    }
                    
                    console.log('✅ New message added:', uiMessage.uniqueKey);
                    setTimeout(() => scrollToBottom('smooth'), 100);
                    return [...prev, uiMessage];
                });
            }
        },
        onStatusUpdate: (data) => {
            // Update message status instantly
            if ((data.message_id || data.wa_message_id) && data.status) {
                const messageId = data.message_id || data.wa_message_id;
                console.log('📱 Status update for message_id:', messageId, '→', data.status);
                setMessages(prev => {
                    // Find by wa_message_id OR message_id
                    const targetMsg = prev.find(msg => 
                        msg.wa_message_id === messageId || msg.message_id === messageId
                    );
                    if (!targetMsg || targetMsg.status === data.status) {
                        return prev;
                    }
                    return prev.map(msg => 
                        (msg.wa_message_id === messageId || msg.message_id === messageId)
                            ? { ...msg, status: data.status! }
                            : msg
                    );
                });
            }
        }
    });

    // 5. Load Additional Messages (Infinite Scroll Up)
    const loadAdditionalMessages = useCallback(async () => {
        if (additionalMessagesLoading || noMoreMessages) return;

        setAdditionalMessagesLoading(true);
        // Capture current scroll height before adding new items
        const container = messagesEndRef.current;
        const previousScrollHeight = container ? container.scrollHeight : 0;
        const previousScrollTop = container ? container.scrollTop : 0;

        try {
            const offset = stateMessages.length;
            const additionalMessages = await fetchMessages(50, offset);

            if (additionalMessages.length === 0) {
                setNoMoreMessages(true);
            } else {
                const newUiMessages = addDateToMessages(additionalMessages);

                setMessages(prev => {
                    const existingKeys = new Set(prev.map(m => m.uniqueKey));
                    // ✅ FIX 3: DEDUPLICATION LOGIC
                    // Filter items that are NOT in the existing list
                    const uniqueNewMessages = newUiMessages.filter(m => !existingKeys.has(m.uniqueKey));
                    
                    if (uniqueNewMessages.length === 0) {
                        // If we fetched messages but they are all duplicates, 
                        // we must mark noMoreMessages to stop the loop
                        setNoMoreMessages(true); 
                        return prev;
                    }

                    return [...uniqueNewMessages, ...prev]; // Prepend new messages
                });

                // ✅ FIX 4: RESTORE SCROLL POSITION
                // Adjust scroll position so the user doesn't lose their place
                setTimeout(() => {
                    if (container) {
                        const newScrollHeight = container.scrollHeight;
                        container.scrollTop = newScrollHeight - previousScrollHeight + previousScrollTop;
                    }
                }, 0);
            }
        } catch (error) {
            console.error('Error loading additional messages:', error);
        } finally {
            setAdditionalMessagesLoading(false);
        }
    }, [stateMessages, noMoreMessages, additionalMessagesLoading, fetchMessages]);

    // Scroll Handler
    const onDivScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
        const div = event.currentTarget;
        // Only load if near top AND not already loading AND has more messages
        if (div.scrollTop < 100 && !additionalMessagesLoading && !noMoreMessages) {
            loadAdditionalMessages();
        }
    }, [additionalMessagesLoading, noMoreMessages, loadAdditionalMessages]);

    return (
        <div className="flex overflow-y-auto overflow-x-auto">
            {/* Chat Container */}
            <div 
                className="flex-1 overflow-y-auto overflow-x-hidden bg-[url('/wa_bg.png')]"
                ref={messagesEndRef}
                onScroll={onDivScroll}
                style={{
                    backgroundImage: 'url(/wa_bg.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: '#e5ddd5',
                }}
            >
            {stateMessages.map((message, index) => {
                const messageDateTime = new Date(message.created_at);
                const showDateHeader = index === 0 || message.msgDate !== stateMessages[index - 1]?.msgDate;
                const senderChanged = index === 0 || message.sender !== stateMessages[index - 1]?.sender;

                return (
                    <div key={message.uniqueKey}> {/* Use uniqueKey here */}
                        {showDateHeader && (
                            <div className="flex justify-center my-4 sticky top-2 z-10">
                                <span className="px-3 py-1 rounded-lg bg-white/80 shadow-sm text-gray-600 text-xs font-medium backdrop-blur-sm">
                                    {message.msgDate}
                                </span>
                            </div>
                        )}
                        <div className="my-1">
                            <TailWrapper showTail={senderChanged} isSent={message.sender === 'user'}>
                                <div className="px-2 pt-2 flex flex-col relative min-w-[120px]">
                                    {/* Render Message Components based on type */}
                                    <div className="pb-4">
                                         {(() => {
                                            const body = message.messageBody;
                                            switch (body.type) {
                                                case "text": return <ReceivedTextMessageUI textMessage={body as TextMessage} />;
                                                case "image": return <ReceivedImageMessageUI message={message as unknown as Parameters<typeof ReceivedImageMessageUI>[0]['message']} />;
                                                case "video": return <ReceivedVideoMessageUI message={message as unknown as Parameters<typeof ReceivedVideoMessageUI>[0]['message']} />;
                                                case "template": return <ReceivedTemplateMessageUI message={body as TemplateMessage} />;
                                                case "document": return <ReceivedDocumentMessageUI message={message as unknown as Parameters<typeof ReceivedDocumentMessageUI>[0]['message']} />;
                                                default: return <div>Unsupported message type</div>
                                            }
                                        })()}
                                    </div>
                                    
                                    {/* Timestamp & Status */}
                                    <span className="text-[11px] text-gray-500 absolute bottom-1 right-2 flex items-center gap-1">
                                        {formatTimeIST(messageDateTime)}
                                        {message.sender === 'user' && (
                                            <span className="ml-1">
                                                {message.status === 'read' ? (
                                                    <span className="text-blue-500 font-bold">✓✓</span>
                                                ) : message.status === 'delivered' ? (
                                                    <span className="text-gray-400">✓✓</span>
                                                ) : message.status === 'sent' ? (
                                                    <span className="text-gray-400">✓</span>
                                                ) : (
                                                    <span className="text-gray-400">🕒</span>
                                                )}
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </TailWrapper>
                        </div>
                    </div>
                )
            })}
            {additionalMessagesLoading && (
                <div className="absolute top-2 left-0 right-0 flex justify-center">
                    <div className="bg-white rounded-full p-2 shadow-md">Loading...</div>
                </div>
            )}
            </div>

            {/* Chat Profile Panel - Right Sidebar */}
            <div className="hidden md:flex w-80 bg-white border-l border-gray-200 flex-col overflow-y-auto">
                {/* Profile Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-lg">
                            {(conversationData?.customer_name || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-800">{conversationData?.customer_name || 'User'}</h2>
                            <p className="text-sm text-gray-600">{conversationData?.customer_phone || from}</p>
                        </div>
                    </div>
                </div>

                {/* Status Section */}
                <div className="p-4 border-b border-gray-200">
                    <div className="text-sm font-semibold text-gray-800 mb-2">Status</div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                        <div><span className="font-medium">Status:</span> <span className="text-teal-600">{conversationData?.status || 'Active'}</span></div>
                        <div><span className="font-medium">Last Active:</span> <span>{stateMessages.length > 0 ? new Date(stateMessages[stateMessages.length - 1].created_at).toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'UTC' }) : 'N/A'}</span></div>
                        <div><span className="font-medium">First Conversion:</span> <span>{stateMessages.length > 0 ? new Date(stateMessages[0].created_at).toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'UTC' }) : 'N/A'}</span></div>
                        <div><span className="font-medium">Template Messages:</span> <span>{stateMessages.filter(m => m.message_type === 'template').length}</span></div>
                        <div><span className="font-medium">Session Messages:</span> <span>{stateMessages.filter(m => m.message_type !== 'template').length}</span></div>
                        <div><span className="font-medium">Unresolved Queries:</span> <span>{conversationData?.unresolved_queries || 0}</span></div>
                        <div><span className="font-medium">Source:</span> <span>{conversationData?.source || 'ORGANIC'}</span></div>
                        <div className="col-span-2"><span className="font-medium">Incoming:</span> <span>Allowed</span></div>
                        <div className="col-span-2"><span className="font-medium">Opted In:</span> <span className="inline-block w-3 h-3 bg-teal-600 rounded-full"></span></div>
                    </div>
                </div>

                {/* Payments Section */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-semibold text-gray-800">Payments</div>
                        <button className="text-xs bg-teal-600 text-white px-2 py-1 rounded hover:bg-teal-700">+ Create Payment</button>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-xs text-gray-700 mt-2">
                        <div className="font-medium">Order Id</div>
                        <div className="font-medium">Amount</div>
                        <div className="font-medium">Status</div>
                    </div>
                </div>

                {/* Campaigns Section */}
                <div className="p-4 border-b border-gray-200">
                    <div className="text-sm font-semibold text-gray-800">Campaigns</div>
                    <div className="text-xs text-gray-500 mt-2">No active campaigns</div>
                </div>

                {/* Attributes Section */}
                <div className="p-4 border-b border-gray-200">
                    <div className="text-sm font-semibold text-gray-800">Attributes</div>
                    <div className="text-xs text-gray-500 mt-2">No attributes</div>
                </div>

                {/* Tags Section */}
                <div className="p-4 border-b border-gray-200">
                    <div className="text-sm font-semibold text-gray-800 mb-2">Tags</div>
                    <select className="w-full text-xs p-1 border border-gray-300 rounded">
                        <option>Select & add tag</option>
                    </select>
                    <div className="text-xs text-teal-600 mt-2 cursor-pointer font-medium">+ Create & Add Tag</div>
                </div>

                {/* Customer Journey Section */}
                <div className="p-4 border-b border-gray-200">
                    <div className="text-sm font-semibold text-gray-800 mb-2">Customer Journey</div>
                    <ol className="border-l-2 border-teal-400 pl-3 space-y-2 text-xs text-gray-700">
                        {customerJourney && customerJourney.length > 0 ? (
                            customerJourney.map((event, idx) => (
                                <li key={idx} className="relative">
                                    <span className={`absolute -left-2 top-1 w-2.5 h-2.5 ${idx === 0 ? 'bg-teal-600' : 'border-2 border-teal-400'} rounded-full`}></span>
                                    <span className="font-medium">{event.action}</span>
                                    {event.actor && <span className="text-gray-500"> by {event.actor}</span>}
                                    <br/>
                                    <span className="text-gray-500 text-xs">{event.timestamp ? new Date(event.timestamp).toLocaleString() : 'N/A'}</span>
                                </li>
                            ))
                        ) : (
                            <li className="relative">
                                <span className="absolute -left-2 top-1 w-2.5 h-2.5 bg-teal-600 rounded-full"></span>
                                <span className="font-medium">User created</span>
                                <br/>
                                <span className="text-gray-500 text-xs">Loading journey...</span>
                            </li>
                        )}
                    </ol>
                </div>

                {/* Block Button */}
                <div className="p-4">
                    <button className="w-full text-red-600 font-semibold py-2 border border-red-300 rounded hover:bg-red-50">⛔ Block Incoming Messages</button>
                </div>
            </div>
        </div>
    )
}
