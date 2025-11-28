import { useState, useRef } from 'react';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Smile, Paperclip, Send, Image, Video, MapPin } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface MessageInputProps {
  onSendMessage: (content: string, type: 'text') => void;
  onSendMedia: (file: File, type: 'image' | 'video') => void;
}

const MessageInput = ({ onSendMessage, onSendMedia }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message, 'text');
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      onSendMedia(file, type);
    }
  };

  return (
    <div className="border-t border-border bg-sidebar-bg p-2 sm:p-3 md:p-4">
      <div className="flex items-end gap-1.5 sm:gap-2">
        {/* Emoji Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground hover:bg-hover-bg flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10"
            >
              <Smile className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 border-none" align="start" side="top">
            <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" />
          </PopoverContent>
        </Popover>

        {/* Attachment Menu */}
        <Popover open={showAttachMenu} onOpenChange={setShowAttachMenu}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground hover:bg-hover-bg flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10"
            >
              <Paperclip className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 sm:w-48 p-2" align="start" side="top">
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                className="justify-start gap-2 sm:gap-3 text-sm"
                onClick={() => {
                  fileInputRef.current?.click();
                  setShowAttachMenu(false);
                }}
              >
                <Image className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span>Image</span>
              </Button>
              <Button
                variant="ghost"
                className="justify-start gap-2 sm:gap-3 text-sm"
                onClick={() => {
                  videoInputRef.current?.click();
                  setShowAttachMenu(false);
                }}
              >
                <Video className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
                <span>Video</span>
              </Button>
              <Button variant="ghost" className="justify-start gap-2 sm:gap-3 text-sm">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                <span>Location</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e, 'image')}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e, 'video')}
        />

        {/* Message Input */}
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message njnjj"
          className="min-h-[38px] sm:min-h-[44px] max-h-24 sm:max-h-32 resize-none bg-secondary border-none focus-visible:ring-1 focus-visible:ring-primary text-sm sm:text-base"
          rows={1}
        />

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim()}
          className="bg-primary hover:bg-primary-dark text-primary-foreground flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10"
          size="icon"
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
