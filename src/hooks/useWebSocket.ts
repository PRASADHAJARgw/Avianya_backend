import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';

export interface WSMessage {
  type: 'new_message' | 'status_update' | 'conversation_update';
  conversation_id?: number;
  message?: {
    id: number;
    conversation_id: number;
    message_id: string;
    wa_message_id?: string;
    content: string;
    message_type: string;
    media_url?: string;
    media_caption?: string;
    sender: string;
    status: string;
    timestamp: string;
    created_at: string;
  };
  wa_message_id?: string;
  message_id?: string; // Add this for status_update messages
  status?: string;
  user_id?: string;
}

interface UseWebSocketOptions {
  onNewMessage?: (message: WSMessage) => void;
  onStatusUpdate?: (update: WSMessage) => void;
  onConversationUpdate?: (update: WSMessage) => void;
  onError?: (error: Event) => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000; // 1 second

  const connect = useCallback(async () => {
    // Don't reconnect if already connected or connecting
    if (wsRef.current?.readyState === WebSocket.OPEN || 
        wsRef.current?.readyState === WebSocket.CONNECTING || 
        isConnecting) {
      console.log('⏭️ WebSocket already connecting or connected, skipping...');
      return;
    }

    try {
      setIsConnecting(true);

      // Get current user from auth store
      const { token, user } = useAuthStore.getState();
      
      if (!token || !user?.id) {
        console.error('❌ No access token available for WebSocket connection');
        setIsConnecting(false);
        return;
      }

      // Extract user_id from auth store
      const userId = user.id;
      
      // Connect to WebSocket with user_id as query parameter
      const wsUrl = `ws://localhost:8080/ws?user_id=${userId}`;
      console.log('🔌 Connecting to WebSocket:', wsUrl);

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful connection
      };

      ws.onmessage = (event) => {
        try {
          const data: WSMessage = JSON.parse(event.data);
          console.log('📨 WebSocket message received:', data);

          switch (data.type) {
            case 'new_message':
              options.onNewMessage?.(data);
              break;
            case 'status_update':
              options.onStatusUpdate?.(data);
              break;
            case 'conversation_update':
              options.onConversationUpdate?.(data);
              break;
            default:
              console.warn('Unknown WebSocket message type:', data.type);
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        options.onError?.(error);
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        setIsConnected(false);
        setIsConnecting(false);
        wsRef.current = null;

        // Attempt to reconnect with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current);
          console.log(`🔄 Reconnecting in ${delay}ms... (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, delay);
        } else {
          console.error('❌ Max reconnection attempts reached');
        }
      };
    } catch (error) {
      console.error('❌ Error creating WebSocket connection:', error);
      setIsConnecting(false);
    }
  }, [isConnecting, options]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setIsConnecting(false);
    reconnectAttemptsRef.current = 0;
  }, []);

  // Connect on mount
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - connect and disconnect are stable

  return {
    isConnected,
    isConnecting,
    connect,
    disconnect,
  };
};
