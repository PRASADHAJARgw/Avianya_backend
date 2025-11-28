import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Search, Send } from 'lucide-react';

export default function InstagramDirectMessages() {
  return (
    <div className="p-6 h-full">
      <div className="grid grid-cols-12 gap-4 h-full">
        {/* Conversations List */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Direct Messages</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-8" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">User {i + 1}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      Last message preview...
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">{i + 1}m</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="col-span-8 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
              <div>
                <CardTitle className="text-lg">User 1</CardTitle>
                <p className="text-sm text-muted-foreground">Active now</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {/* Sample messages */}
              <div className="flex justify-end">
                <div className="bg-[#E1306C] text-white rounded-lg p-3 max-w-xs">
                  <p className="text-sm">Hello! How can I help you today?</p>
                  <p className="text-xs opacity-75 mt-1">10:30 AM</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-accent rounded-lg p-3 max-w-xs">
                  <p className="text-sm">Hi! I have a question about your products.</p>
                  <p className="text-xs text-muted-foreground mt-1">10:32 AM</p>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input placeholder="Type a message..." className="flex-1" />
              <Button size="icon" className="bg-[#E1306C] hover:bg-[#C13584]">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
