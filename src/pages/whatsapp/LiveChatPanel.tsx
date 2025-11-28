import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ChatContactsClient from '@/components/whatsapp/live_chat/(authorized)/(panel)/chats/ChatContactsClient';
import { ContactContextProvider, useCurrentContact } from '@/components/whatsapp/live_chat/(authorized)/(panel)/chats/CurrentContactContext';
import ContactChat from '@/components/whatsapp/live_chat/(authorized)/(panel)/chats/[wa_id]/page';
import { MessageSquare } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import WhatsAppNavigation from '@/components/whatsapp/WhatsAppNavigation';
import { useParams } from 'react-router-dom';

const LiveChatPanel = () => {
  const { user } = useAuth();

  return (
    <ContactContextProvider>
      <LiveChatContent user={user} />
    </ContactContextProvider>
  );
};

const LiveChatContent = ({ user }: { user: User | null }) => {
  const currentContactState = useCurrentContact();
  const selectedContact = currentContactState?.current;
  const { waId: rawWaId } = useParams<{ waId?: string }>();

  const activeWaId = useMemo(() => {
    if (selectedContact?.wa_id) {
      return selectedContact.wa_id;
    }
    if (rawWaId) {
      return rawWaId.startsWith('+') ? rawWaId.slice(1) : rawWaId;
    }
    return null;
  }, [rawWaId, selectedContact?.wa_id]);

  return (
    <div
      className="flex flex-col h-full w-full overflow-hidden"
      style={{
        backgroundImage: 'url(/src/assets/images/IMG_3298.jpg)',
        backgroundRepeat: 'repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* WhatsApp Navigation */}
      <WhatsAppNavigation />

      {/* Chat Area - Responsive layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Contact List Sidebar - Responsive width */}
        <div className="w-full sm:w-64 md:w-72 lg:w-80 xl:w-80 border-r bg-white flex-shrink-0 max-w-full max-h-[calc(100vh-100px)]">
          <div className="h-full overflow-hidden flex flex-col">
            <div className="p-2 border-b bg-gray-50 flex-shrink-0">
              <h3 className="font-medium text-gray-900 text-xs">Active Conversations</h3>
              <p className="text-xs text-gray-500 mt-0.5">Click on a contact to start chatting</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ChatContactsClient />
            </div>
          </div>
        </div>

        {/* Chat Window Area - Takes remaining space */}
        <div className="flex-1 min-w-0 bg-gray-50 flex flex-col">
          {activeWaId ? (
            <ContactChat key={activeWaId} params={{ wa_id: activeWaId }} />
          ) : (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center max-w-md mx-auto">
                <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 opacity-10">
                  <MessageSquare className="w-full h-full text-gray-400" />
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
                  Welcome to WhatsApp Live Chat
                </h2>
                <p className="text-gray-500 mb-4 text-sm md:text-base leading-relaxed">
                  Select a contact from the sidebar to view their conversation history and start messaging.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-400 max-w-lg mx-auto">
                  <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                    <span className="text-lg mb-1">🔄</span>
                    <span className="font-medium text-xs">Real-time sync</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                    <span className="text-lg mb-1">💬</span>
                    <span className="font-medium text-xs">Chat management</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                    <span className="text-lg mb-1">📝</span>
                    <span className="font-medium text-xs">Message history</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveChatPanel;
