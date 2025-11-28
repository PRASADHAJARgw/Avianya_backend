import { Chat } from '@/type/chat';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/whatsapp/ui/avatar';
// import { Badge } from '../components/ui/badge';
// import { Input } from '@/components/whatsapp/ui/input';
import { Search, MessageSquarePlus, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState, useMemo } from 'react';

interface ChatListProps {
  chats: Chat[];
  activeChat: string | null;
  onSelectChat: (chatId: string) => void;
}

const ChatList = ({ chats, activeChat, onSelectChat }: ChatListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter chats based on search query
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) {
      return chats;
    }

    const query = searchQuery.toLowerCase();
    return chats.filter((chat) =>
      chat.name.toLowerCase().includes(query) ||
      chat.lastMessage.toLowerCase().includes(query)
    );
  }, [chats, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-sidebar-bg border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 bg-secondary border-b border-border">
        <h1 className="text-lg sm:text-xl font-semibold text-foreground">Chats</h1>
        <div className="flex items-center gap-1 sm:gap-2">
          <button className="p-1.5 sm:p-2 hover:bg-hover-bg rounded-full transition-colors">
            <MessageSquarePlus className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-1.5 sm:p-2 hover:bg-hover-bg rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-2.5 sm:p-3 bg-sidebar-bg border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search or start new chat"
            className="pl-10 bg-secondary border-none focus-visible:ring-1 focus-visible:ring-primary text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 px-4">
            <p className="text-sm text-muted-foreground text-center">
              No chats found
            </p>
            <p className="text-xs text-muted-foreground text-center mt-1">
              Try searching with a different keyword
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 cursor-pointer transition-colors hover:bg-hover-bg ${
              activeChat === chat.id ? 'bg-hover-bg' : ''
            }`}
          >
            <div className="relative flex-shrink-0">
              <Avatar className="h-11 w-11 sm:h-12 sm:w-12">
                <AvatarImage src={chat.avatar} alt={chat.name} />
                <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {chat.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-sidebar-bg" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1 gap-2">
                <h3 className="font-semibold text-foreground truncate text-sm sm:text-base">{chat.name}</h3>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {formatDistanceToNow(chat.lastMessageTime, { addSuffix: false })}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                {chat.unreadCount > 0 && (
                  <Badge className="bg-primary text-primary-foreground h-5 min-w-5 px-1.5 rounded-full text-xs flex-shrink-0">
                    {chat.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
