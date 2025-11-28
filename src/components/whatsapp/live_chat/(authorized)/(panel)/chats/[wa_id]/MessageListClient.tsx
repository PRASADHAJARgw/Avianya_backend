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
    id: string;
    conversation_id: string;
    message_id: string;
    wa_message_id: string;
    content: string;
    message_type: string;
    media_url?: string;
    media_caption?: string;
    sender: string;
    status: string;
    created_at: string;
}

interface UIMessage {
    id: string;
    conversation_id: string;
    message_id: string;
    wa_message_id: string;
    content: string;
    message_type: string;
    media_url?: string;
    media_caption?: string;
    sender: string;
    status: string;
    created_at: string;
    msgDate: string;
    messageBody: MessageJson;
}

function addDateToMessages(messages: BackendMessage[]): UIMessage[] {
    return messages.map((msg) => {
        const messageBody: MessageJson = {
            type: msg.message_type,
            content: msg.content,
            body: msg.content, // Add body field for text messages
            to: msg.sender === 'user' ? msg.conversation_id : null,
            from: msg.sender,
            ...(msg.media_url && { media_url: msg.media_url }),
            ...(msg.media_caption && { caption: msg.media_caption }),
        };

        return {
            ...msg,
            msgDate: new Date(msg.created_at).toLocaleDateString(),
            messageBody,
        };
    });
}

export default function MessageListClient({ from }: { from: string }) {
    console.log('🎬 MessageListClient RENDERING - from:', from);
    
    const { supabase } = useSupabase()
    const [stateMessages, setMessages] = useState<UIMessage[]>([])
    const [additionalMessagesLoading, setAdditionalMessagesLoading] = useState(false)
    const [noMoreMessages, setNoMoreMessages] = useState(false)
    const [conversationId, setConversationId] = useState<string | null>(null)
    const conversationIdRef = useRef<string | null>(null); // Add ref to avoid closure issues
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pendingMessagesRef = useRef<WSMessage[]>([]); // Buffer for messages received before conversationId loads
    
    console.log('🔍 Current conversationId state:', conversationId);

    // Update ref whenever state changes
    useEffect(() => {
        conversationIdRef.current = conversationId;
        console.log('🔄 conversationIdRef updated to:', conversationId);
    }, [conversationId]);
    
    const scrollToBottom = (bottom: number = 0) => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight - bottom;
        }
    }

    // First, fetch the conversation ID from backend
    useEffect(() => {
        async function fetchConversationId() {
            console.log('🔄 Attempting to fetch conversation ID for:', from);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token;
                
                if (!token) {
                    console.error('❌ No auth token found');
                    return;
                }

                const response = await fetch(`http://localhost:8080/api/live-chat/conversation/${from}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('📡 Conversation fetch response status:', response.status);

                if (response.ok) {
                    const result = await response.json();
                    console.log('📊 Conversation fetch result:', result);
                    if (result.success && result.conversation) {
                        const convId = result.conversation.id.toString(); // Ensure it's a string
                        console.log('✅ Successfully fetched conversation ID:', convId, '(type:', typeof convId, ')');
                        setConversationId(convId);
                        
                        // Process any pending messages that arrived before conversationId was loaded
                        if (pendingMessagesRef.current.length > 0) {
                            console.log(`📦 Processing ${pendingMessagesRef.current.length} pending messages`);
                            pendingMessagesRef.current.forEach(msgData => {
                                if (msgData.conversation_id && msgData.conversation_id.toString() === convId && msgData.message) {
                                    const backendMessage: BackendMessage = {
                                        id: msgData.message.id.toString(),
                                        conversation_id: msgData.message.conversation_id.toString(),
                                        message_id: msgData.message.message_id,
                                        wa_message_id: msgData.message.wa_message_id || '',
                                        content: msgData.message.content,
                                        message_type: msgData.message.message_type,
                                        media_url: msgData.message.media_url,
                                        media_caption: msgData.message.media_caption,
                                        sender: msgData.message.sender,
                                        status: msgData.message.status,
                                        created_at: msgData.message.created_at,
                                    };
                                    const uiMessage = addDateToMessages([backendMessage])[0];
                                    setMessages(prev => {
                                        const exists = prev.some(msg => 
                                            msg.id === uiMessage.id || 
                                            msg.wa_message_id === uiMessage.wa_message_id ||
                                            (msg.content === uiMessage.content && 
                                             msg.sender === uiMessage.sender && 
                                             Math.abs(new Date(msg.created_at).getTime() - new Date(uiMessage.created_at).getTime()) < 1000)
                                        );
                                        if (!exists) {
                                            console.log('✅ Adding pending message to UI:', uiMessage.id);
                                            return [...prev, uiMessage];
                                        }
                                        return prev;
                                    });
                                }
                            });
                            pendingMessagesRef.current = []; // Clear buffer
                        }
                    } else {
                        console.error('❌ Conversation not found in response:', result);
                    }
                } else {
                    const errorText = await response.text();
                    console.error('❌ Failed to fetch conversation. Status:', response.status, 'Response:', errorText);
                }
            } catch (error) {
                console.error('❌ Error fetching conversation ID:', error);
            }
        }

        console.log('🚀 Component mounted, fetching conversation ID...');
        fetchConversationId();
    }, [from, supabase]);

    // Monitor conversationId state changes
    useEffect(() => {
        console.log('🆔 conversationId state changed:', conversationId);
    }, [conversationId]);

    // Fetch messages from backend API
    const fetchMessages = useCallback(async (limit: number = 100, offset: number = 0): Promise<BackendMessage[]> => {
        if (!conversationId) {
            console.log('⏳ Waiting for conversation ID...');
            return [];
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (!token) {
                console.error('❌ No auth token found');
                return [];
            }

            const response = await fetch(
                `http://localhost:8080/api/live-chat/messages?conversation_id=${conversationId}&limit=${limit}&offset=${offset}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                console.error(`❌ API error: ${response.status}`);
                return [];
            }

            const result = await response.json();
            console.log('📨 Fetched messages:', result);

            if (result.success && Array.isArray(result.messages)) {
                return result.messages;
            }
            return [];
        } catch (error) {
            console.error('❌ Error fetching messages:', error);
            return [];
        }
    }, [conversationId, supabase]);

    // Load initial messages when conversation ID is available
    useEffect(() => {
        if (!conversationId) return;

        const loadMessages = async () => {
            try {
                console.log('📥 Loading initial messages...');
                const messages = await fetchMessages(100, 0);
                if (messages.length === 0) {
                    setNoMoreMessages(true);
                }
                const uiMessages = addDateToMessages(messages);
                setMessages(uiMessages);
                setTimeout(() => {
                    scrollToBottom();
                }, 100);
            } catch (error) {
                console.error('❌ Error loading messages:', error);
            }
        };

        loadMessages();
    }, [conversationId, fetchMessages]);

    // Process buffered messages whenever conversationId becomes available
    useEffect(() => {
        if (!conversationId || pendingMessagesRef.current.length === 0) return;

        console.log(`🔄 conversationId now available (${conversationId}), processing ${pendingMessagesRef.current.length} buffered messages`);
        
        const convId = conversationId.toString();
        const messagesToProcess = [...pendingMessagesRef.current];
        pendingMessagesRef.current = []; // Clear buffer immediately to prevent reprocessing
        
        messagesToProcess.forEach(msgData => {
            if (msgData.conversation_id && msgData.conversation_id.toString() === convId && msgData.message) {
                console.log('✅ Processing buffered message:', msgData.message.wa_message_id);
                
                // Use the same structure as real-time WebSocket handler
                const backendMessage: BackendMessage = {
                    id: msgData.message.id.toString(),
                    conversation_id: msgData.message.conversation_id.toString(),
                    message_id: msgData.message.message_id,
                    wa_message_id: msgData.message.wa_message_id,
                    content: msgData.message.content,
                    message_type: msgData.message.message_type,
                    media_url: msgData.message.media_url,
                    media_caption: msgData.message.media_caption,
                    sender: msgData.message.sender,
                    status: msgData.message.status,
                    created_at: msgData.message.created_at,
                };

                const uiMessage = addDateToMessages([backendMessage])[0];

                setMessages(prev => {
                    // Check if message already exists (same logic as real-time handler)
                    const exists = prev.some(msg =>
                        msg.id === uiMessage.id ||
                        msg.wa_message_id === uiMessage.wa_message_id ||
                        (msg.content === uiMessage.content &&
                            msg.sender === uiMessage.sender &&
                            Math.abs(new Date(msg.created_at).getTime() - new Date(uiMessage.created_at).getTime()) < 1000)
                    );

                    if (!exists) {
                        console.log('✅ Added buffered message to UI:', uiMessage.id);
                        return [...prev, uiMessage];
                    } else {
                        console.log('⚠️ Buffered message already exists, skipping:', uiMessage.id);
                        return prev;
                    }
                });
            }
        });
        
        setTimeout(() => scrollToBottom(), 100);
    }, [conversationId]);

    // Real-time WebSocket for instant message and status updates
    const { isConnected } = useWebSocket({
        onNewMessage: (data) => {
            const currentConvId = conversationIdRef.current; // Use ref instead of state
            const receivedConvId = data.conversation_id?.toString();
            const isMatch = receivedConvId === currentConvId;
            
            console.log('🔔 WebSocket: onNewMessage triggered', {
                received_conversation_id: data.conversation_id,
                received_as_string: receivedConvId,
                current_conversation_id: currentConvId,
                match: isMatch,
                has_message: !!data.message
            });
            
            // Only process messages for this conversation (ensure conversationId is loaded)
            if (data.conversation_id && currentConvId && receivedConvId === currentConvId && data.message) {
                console.log('📨 WebSocket: New message received:', data.message);
                // Convert message IDs to strings to match BackendMessage type
                const backendMessage: BackendMessage = {
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
                const uiMessage = addDateToMessages([backendMessage])[0];
                setMessages(prev => {
                    // Check if message already exists by multiple criteria
                    const exists = prev.some(msg => 
                        msg.id === uiMessage.id || 
                        msg.wa_message_id === uiMessage.wa_message_id ||
                        (msg.content === uiMessage.content && 
                         msg.sender === uiMessage.sender && 
                         Math.abs(new Date(msg.created_at).getTime() - new Date(uiMessage.created_at).getTime()) < 1000)
                    );
                    if (exists) {
                        console.log('⏭️ Message already exists, skipping duplicate');
                        return prev;
                    }
                    
                    console.log('✅ Adding new message to UI');
                    setTimeout(() => scrollToBottom(), 100);
                    return [...prev, uiMessage];
                });
            } else if (data.conversation_id && !currentConvId && data.message) {
                // Buffer message if conversationId not yet loaded
                console.log('📦 Buffering message (conversationId not yet loaded)');
                pendingMessagesRef.current.push(data);
            }
        },
        onStatusUpdate: (data) => {
            // Update message status instantly
            if (data.wa_message_id && data.status) {
                console.log('� WebSocket: Status update:', data.wa_message_id, '→', data.status);
                setMessages(prev => 
                    prev.map(msg => 
                        msg.wa_message_id === data.wa_message_id 
                            ? { ...msg, status: data.status! }
                            : msg
                    )
                );
            }
        }
    });

    // Show WebSocket connection status
    useEffect(() => {
        if (isConnected) {
            console.log('✅ WebSocket connected for real-time updates');
        } else {
            console.log('🔌 WebSocket disconnected');
        }
    }, [isConnected]);

    // Load additional older messages
    const loadAdditionalMessages = useCallback(async () => {
        if (stateMessages.length === 0 || noMoreMessages) return;

        try {
            setAdditionalMessagesLoading(true);
            const offset = stateMessages.length;
            const additionalMessages = await fetchMessages(100, offset);

            if (additionalMessages.length === 0) {
                setNoMoreMessages(true);
            } else {
                const addedDates = addDateToMessages(additionalMessages);
                const scrollBottom = messagesEndRef.current?.scrollHeight ? 
                    messagesEndRef.current.scrollHeight - (messagesEndRef.current.scrollTop || 0) : 0;
                
                setMessages([...addedDates, ...stateMessages]);
                
                setTimeout(() => {
                    scrollToBottom(scrollBottom);
                }, 100);
            }
        } catch (error) {
            console.error('❌ Error loading additional messages:', error);
        } finally {
            setAdditionalMessagesLoading(false);
        }
    }, [stateMessages, noMoreMessages, fetchMessages]);

    const onDivScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
        const div = event.currentTarget;
        if (!additionalMessagesLoading && !noMoreMessages && div.scrollTop < 100) {
            loadAdditionalMessages();
        }
    }, [additionalMessagesLoading, noMoreMessages, loadAdditionalMessages]);

    return (
        <div className="px-16 py-2 overflow-y-auto h-full" ref={messagesEndRef} onScroll={onDivScroll}>
            {stateMessages.map((message, index) => {
                const messageBody = message.messageBody;
                const messageDateTime = new Date(message.created_at);
                const showDateHeader = index === 0 || message.msgDate !== stateMessages[index - 1].msgDate;
                const senderChanged = index === 0 || message.sender !== stateMessages[index - 1].sender;

                return (
                    <div key={message.id}>
                        {showDateHeader && (
                            <div className="flex justify-center my-2">
                                <span className="p-2 rounded-md bg-system-message-background text-system-message-text text-sm">
                                    {message.msgDate}
                                </span>
                            </div>
                        )}
                        <div className="my-1">
                            <TailWrapper showTail={senderChanged} isSent={message.sender === 'user'}>
                                <div className="px-2 pt-2 flex flex-col items-end gap-1 relative">
                                    <div className="pb-2 inline-block">
                                        {(() => {
                                            switch (messageBody.type) {
                                                case "text":
                                                    return <ReceivedTextMessageUI textMessage={messageBody as TextMessage} />
                                                case "image":
                                                    return <ReceivedImageMessageUI message={message as unknown as Parameters<typeof ReceivedImageMessageUI>[0]['message']} />
                                                case "video":
                                                    return <ReceivedVideoMessageUI message={message as unknown as Parameters<typeof ReceivedVideoMessageUI>[0]['message']} />
                                                case "template":
                                                    return <ReceivedTemplateMessageUI message={messageBody as TemplateMessage} />
                                                case "document":
                                                    return <ReceivedDocumentMessageUI message={message as unknown as Parameters<typeof ReceivedDocumentMessageUI>[0]['message']} />
                                                case "audio":
                                                case "voice":
                                                    return (
                                                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                                                            <span className="text-2xl">🎵</span>
                                                            <span className="text-green-700 font-medium">Audio Message</span>
                                                        </div>
                                                    )
                                                case "sticker":
                                                    return (
                                                        <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                                                            <span className="text-2xl">😊</span>
                                                            <span className="text-yellow-700 font-medium">Sticker</span>
                                                        </div>
                                                    )
                                                case "location":
                                                    return (
                                                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                                                            <span className="text-2xl">📍</span>
                                                            <span className="text-blue-700 font-medium">Location</span>
                                                        </div>
                                                    )
                                                case "contact":
                                                case "contacts":
                                                    return (
                                                        <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                                                            <span className="text-2xl">👤</span>
                                                            <span className="text-purple-700 font-medium">Contact</span>
                                                        </div>
                                                    )
                                                default:
                                                    console.warn('Unsupported message type:', messageBody.type);
                                                    return (
                                                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                            <span className="text-2xl">❓</span>
                                                            <div className="flex flex-col">
                                                                <span className="text-gray-700 font-medium">Unsupported message type</span>
                                                                <span className="text-xs text-gray-500">Type: {messageBody.type}</span>
                                                            </div>
                                                        </div>
                                                    )
                                            }
                                        })()}
                                        <span className="invisible">ww:ww wm</span>
                                    </div>
                                    <span className="text-xs pb-2 pe-2 text-bubble-meta absolute bottom-0 end-0 flex items-center gap-1">
                                        {messageDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()}
                                        {/* Status indicator for sent messages */}
                                        {message.sender === 'user' && (
                                            <>
                                                {message.status === 'pending' && <span className="text-gray-400 text-[10px]">🕐</span>}
                                                {message.status === 'sent' && <span className="text-gray-400 text-[10px]">✓</span>}
                                                {message.status === 'delivered' && <span className="text-blue-400 text-[10px]">✓✓</span>}
                                                {message.status === 'read' && <span className="text-blue-500 text-[10px]">✓✓</span>}
                                                {message.status === 'failed' && <span className="text-red-500 text-[10px]">⚠️</span>}
                                            </>
                                        )}
                                    </span>
                                </div>
                            </TailWrapper>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
