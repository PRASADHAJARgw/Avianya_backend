import { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from '../../components/whatsapp/Header';
import ChatList from '@/components/whatsapp/live_chat/ChatList';
import ChatWindow from '@/components/whatsapp/live_chat/ChatWindow';
import { Message, Chat } from '@/type/chat';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useParams } from 'react-router-dom';
import bgChatTile from '@/assets/images/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png';
import { useWebSocket } from '@/hooks/useWebSocket';

// Backend API configuration
const API_BASE_URL = 'http://localhost:8080';

// Extended Chat type with additional fields
interface ExtendedChat extends Chat {
  customerPhone: string;
  phoneNumberId: string;
}

// Backend types
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

interface BackendMessage {
  id: number;
  conversation_id: number;
  message_id: string;
  wa_message_id?: string;
  content: string;
  message_type: string;
  media_url?: string;
  media_caption?: string;
  sender: string; // 'customer' or 'agent'
  status: string;
  timestamp: string;
  created_at: string;
}

// Transform backend conversation to frontend Chat format
const transformConversationToChat = (conv: BackendConversation): ExtendedChat => ({
  id: conv.id.toString(),
  name: conv.customer_name || conv.customer_phone,
  avatar: conv.customer_profile_pic || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.customer_name || conv.customer_phone)}&background=random`,
  lastMessage: conv.last_message || '',
  lastMessageTime: new Date(conv.last_message_time || conv.updated_at),
  unreadCount: conv.unread_count || 0,
  isOnline: false,
  isPinned: false,
  customerPhone: conv.customer_phone,
  phoneNumberId: conv.phone_number_id,
});

// Transform backend message to frontend Message format
const transformBackendMessage = (msg: BackendMessage): Message => ({
  id: msg.id.toString(),
  chatId: msg.conversation_id.toString(),
  content: msg.content,
  type: (msg.message_type || 'text') as 'text' | 'image' | 'video' | 'location' | 'carousel',
  sender: msg.sender === 'customer' ? 'contact' : 'user',
  timestamp: new Date(msg.timestamp || msg.created_at),
  status: (msg.status || 'sent') as 'sent' | 'delivered' | 'read',
  mediaUrl: msg.media_url,
});

const Index = () => {
  console.log('🟢 LiveChat component mounted/rendered');
  
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chats, setChats] = useState<ExtendedChat[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { waId: routeWaId } = useParams<{ waId?: string }>();
  const normalizedRouteWaId = useMemo(() => {
    if (!routeWaId) return null;
    return routeWaId.startsWith('+') ? routeWaId.slice(1) : routeWaId;
  }, [routeWaId]);

  const activeChatData = chats.find((chat) => chat.id === activeChat);

  // Get Supabase session token
  const getAuthToken = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔵 Supabase session:', session ? 'EXISTS' : 'NULL');
      if (session) {
        console.log('🔵 Session user:', session.user?.id);
        console.log('🔵 Token exists:', !!session.access_token);
      }
      return session?.access_token;
    } catch (error) {
      console.error('🔴 Error getting auth token:', error);
      return null;
    }
  };

  // Fetch conversations from backend
  const fetchConversations = useCallback(async () => {
    try {
      console.log('🔵 fetchConversations called');
      const token = await getAuthToken();
      if (!token) {
        console.error('No auth token available');
        toast({
          title: 'Authentication required',
          description: 'Please log in to view conversations',
          variant: 'destructive',
        });
        return;
      }

      console.log('🔵 Calling API:', `${API_BASE_URL}/api/live-chat/conversations?limit=100`);
      const response = await fetch(`${API_BASE_URL}/api/live-chat/conversations?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('🔵 API Response Status:', response.status);
      if (!response.ok) {
        throw new Error(`Failed to fetch conversations: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('🔵 API Response Data:', data);
      const conversations = data.conversations || [];
      console.log('🔵 Conversations:', conversations);
      
      const transformedChats = conversations.map(transformConversationToChat);
      console.log('🔵 Transformed Chats:', transformedChats);
      setChats(transformedChats);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load conversations',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await fetch(
        `${API_BASE_URL}/api/live-chat/messages?conversation_id=${conversationId}&limit=100`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }

      const data = await response.json();
      const backendMessages = data.messages || [];
      
      const transformedMessages = backendMessages.map(transformBackendMessage);
      
      setMessages((prev) => ({
        ...prev,
        [conversationId]: transformedMessages,
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Send message via backend API
  const handleSendMessage = async (content: string, type: 'text') => {
    if (!activeChat || !activeChatData) return;

    setIsSending(true);

    try {
      const token = await getAuthToken();
      if (!token) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to send messages',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/live-chat/send-message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: parseInt(activeChat),
          phone_number_id: activeChatData.phoneNumberId,
          to: activeChatData.customerPhone,
          message: content,
          message_type: type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();
      
      // Show success toast
      toast({
        title: 'Message sent',
        description: 'Your message has been delivered',
      });

      // Refresh messages and conversations
      await fetchMessages(activeChat);
      await fetchConversations();
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMedia = (file: File, type: 'image' | 'video') => {
    toast({
      title: 'Media upload',
      description: 'Media upload feature coming soon!',
    });
  };

  const handleSelectChat = async (chatId: string) => {
    setActiveChat(chatId);
    setIsFullScreen(false);
    
    // Fetch messages for this conversation
    await fetchMessages(chatId);
    
    // Mark as read (unread count will be reset by backend)
    setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, unreadCount: 0 } : chat))
    );
  };

  const handleToggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    if (activeChat || chats.length === 0) {
      return;
    }

    const fallbackChat = normalizedRouteWaId
      ? chats.find((chat) => {
          const normalizedPhone = chat.customerPhone?.startsWith('+')
            ? chat.customerPhone.slice(1)
            : chat.customerPhone;
          return normalizedPhone === normalizedRouteWaId || chat.id === normalizedRouteWaId;
        })
      : chats[0];

    if (fallbackChat) {
      setActiveChat(fallbackChat.id);
      fetchMessages(fallbackChat.id);
    }
  }, [activeChat, chats, normalizedRouteWaId, fetchMessages]);

  // Fetch messages when activeChat changes
  useEffect(() => {
    if (activeChat) {
      console.log('🔵 Active chat changed, fetching messages for:', activeChat);
      fetchMessages(activeChat);
    }
  }, [activeChat, fetchMessages]);

  // Initial data fetch
  useEffect(() => {
    console.log('🟢 useEffect triggered - fetching initial conversations');
    fetchConversations();
  }, [fetchConversations]);

  // WebSocket for real-time conversation updates
  const { isConnected } = useWebSocket({
    onConversationUpdate: (data) => {
      console.log('🔄 WebSocket: Conversation update received', data);
      // Refresh conversation list when any conversation changes
      fetchConversations();
    },
    onNewMessage: (data) => {
      console.log('� WebSocket: New message received', data);
      // Refresh conversation list to update last message and unread count
      fetchConversations();
      
      // If the message is for the active chat, refresh messages
      if (activeChat && data.conversation_id && data.conversation_id.toString() === activeChat) {
        fetchMessages(activeChat);
      }
    }
  });

  // Show WebSocket connection status
  useEffect(() => {
    if (isConnected) {
      console.log('✅ Live chat: WebSocket connected for real-time updates');
    } else {
      console.log('🔌 Live chat: WebSocket disconnected');
    }
  }, [isConnected]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background ml-14">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen w-screen flex overflow-hidden ml-14"
      style={{
        backgroundImage: `url(${bgChatTile})`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Chat List Sidebar - Hidden in full screen mode */}
      <div className={`${
        activeChatData && isFullScreen
          ? 'hidden'
          : activeChatData
          ? 'hidden sm:flex'
          : 'flex'
      } w-full sm:w-80 md:w-96 lg:w-[400px] xl:w-[450px] flex-shrink-0 `}>
        <ChatList chats={chats} activeChat={activeChat} onSelectChat={handleSelectChat} />
      </div>

      {/* Chat Window - Takes remaining space or full width in full screen */}
      <div
        className={`${
          activeChatData ? 'flex' : 'hidden sm:flex'
        } ${isFullScreen ? 'fixed inset-0 w-full h-full ' : 'flex-1 min-w-0'}`}
        style={{
          // Remove white/opaque background so tile is visible
          // borderRadius: '12px',
          // boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          // margin: '16px',
        }}
      >
        {activeChatData && (
          <ChatWindow
            chat={activeChatData}
            messages={messages[activeChat] || []}
            onSendMessage={handleSendMessage}
            onSendMedia={handleSendMedia}
            onBack={() => setActiveChat(null)}
            isFullScreen={isFullScreen}
            onToggleFullScreen={handleToggleFullScreen}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
