export type MessageType = 'text' | 'image' | 'video' | 'location' | 'carousel';

export interface Message {
  id: string;
  chatId: string;
  content: string;
  type: MessageType;
  sender: 'user' | 'contact';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
  mediaUrl?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  carouselItems?: {
    id: string;
    imageUrl: string;
    title: string;
    description: string;
  }[];
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  isPinned: boolean;
}
