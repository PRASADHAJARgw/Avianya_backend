import { Chat, Message } from '@/type/chat';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Phone, Video, MoreVertical, Search, ArrowLeft, Maximize, Minimize } from 'lucide-react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { useEffect, useRef } from 'react';
import bgChatTile from '@/assets/images/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png';

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  onSendMessage: (content: string, type: 'text') => void;
  onSendMedia: (file: File, type: 'image' | 'video') => void;
  onBack?: () => void;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

const ChatWindow = ({ chat, messages, onSendMessage, onSendMedia, onBack, isFullScreen, onToggleFullScreen }: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full relative" style={{
      backgroundImage: `url(${bgChatTile})`,
      backgroundRepeat: 'repeat',
      backgroundSize: 'auto',
    }}>
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-3 sm:p-4 bg-sidebar-bg border-b border-border">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          {/* Back button for mobile */}
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-hover-bg rounded-full transition-colors sm:hidden flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
          
          <div className="relative flex-shrink-0">
            <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
              <AvatarImage src={chat.avatar} alt={chat.name} />
              <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {chat.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-sidebar-bg" />
            )}
          </div>
          
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-foreground truncate text-sm sm:text-base">{chat.name}</h2>
            <p className="text-xs text-muted-foreground">
              {chat.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button className="p-2 hover:bg-hover-bg rounded-full transition-colors hidden md:flex">
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-hover-bg rounded-full transition-colors hidden lg:flex">
            <Phone className="w-5 h-5 text-muted-foreground" />
          </button>
          {/* <button className="p-2 hover:bg-hover-bg rounded-full transition-colors hidden lg:flex">
            <Video className="w-5 h-5 text-muted-foreground" />
          </button> */}
          {onToggleFullScreen && (
            <button
              onClick={onToggleFullScreen}
              className="p-2 hover:bg-hover-bg rounded-full transition-colors bg-primary/10"
              title={isFullScreen ? "Exit full screen" : "Enter full screen"}
            >
              {isFullScreen ? (
                <Minimize className="w-5 h-5 text-primary" />
              ) : (
                <Maximize className="w-5 h-5 text-primary" />
              )}
            </button>
          )}
          <button className="p-2 hover:bg-hover-bg rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="relative flex-1 overflow-y-auto p-3 sm:p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm sm:text-base text-muted-foreground text-center px-4">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="relative z-10">
        <MessageInput onSendMessage={onSendMessage} onSendMedia={onSendMedia} />
      </div>
    </div>
  );
};

export default ChatWindow;
