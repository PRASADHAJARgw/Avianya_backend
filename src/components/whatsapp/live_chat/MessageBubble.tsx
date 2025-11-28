import { Message } from '@/type/chat';
import { Check, CheckCheck, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isSent = message.sender === 'user';

  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="rounded-lg overflow-hidden max-w-[280px] sm:max-w-sm">
            <img
              src={message.mediaUrl}
              alt="Shared image"
              className="w-full h-auto"
            />
            {message.content && (
              <p className="mt-2 text-xs sm:text-sm">{message.content}</p>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="rounded-lg overflow-hidden max-w-[280px] sm:max-w-sm">
            <video
              src={message.mediaUrl}
              controls
              className="w-full h-auto"
            />
            {message.content && (
              <p className="mt-2 text-xs sm:text-sm">{message.content}</p>
            )}
          </div>
        );

      case 'location':
        return (
          <div className="rounded-lg overflow-hidden max-w-[280px] sm:max-w-sm">
            <div className="bg-muted p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-xs sm:text-sm mb-1">Location</p>
                <p className="text-xs text-muted-foreground">
                  {message.location?.address || 'Shared location'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'carousel':
        return (
          <div className="flex gap-2 overflow-x-auto pb-2 max-w-[280px] sm:max-w-md">
            {message.carouselItems?.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-40 sm:w-48 bg-card rounded-lg overflow-hidden border border-border"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-24 sm:h-32 object-cover"
                />
                <div className="p-2 sm:p-3">
                  <h4 className="font-semibold text-xs sm:text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{message.content}</p>;
    }
  };

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2 sm:mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] lg:max-w-[65%] rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 ${
          isSent
            ? 'bg-message-sent text-message-sent-foreground rounded-br-none shadow-sm'
            : 'bg-message-received text-message-received-foreground rounded-bl-none shadow-sm'
        }`}
      >
        {renderContent()}
        <div className={`flex items-center justify-end gap-1 mt-1 ${
          isSent ? 'text-message-sent-foreground/70' : 'text-muted-foreground'
        }`}>
          <span className="text-xs">
            {format(message.timestamp, 'HH:mm')}
          </span>
          {isSent && (
            <span className="flex-shrink-0">
              {message.status === 'read' ? (
                <CheckCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
              ) : message.status === 'delivered' ? (
                <CheckCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
