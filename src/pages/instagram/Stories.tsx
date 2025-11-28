import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus, Clock, Eye } from 'lucide-react';

export default function InstagramStories() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stories</h1>
          <p className="text-muted-foreground mt-1">Create and manage your Instagram stories</p>
        </div>
        <Button className="bg-[#E1306C] hover:bg-[#C13584]">
          <Plus className="mr-2 h-4 w-4" />
          Create Story
        </Button>
      </div>

      {/* Active Stories */}
      <Card>
        <CardHeader>
          <CardTitle>Active Stories (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="relative aspect-[9/16] bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg cursor-pointer hover:scale-105 transition-transform">
                  <div className="absolute bottom-2 left-2 right-2 text-white text-xs">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{Math.floor(Math.random() * 10000)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{i + 1}h ago</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Story Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Story Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="w-16 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg" />
                <div className="flex-1">
                  <p className="font-medium">Story {i + 1}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span>👁️ {Math.floor(Math.random() * 10000)} views</span>
                    <span>💬 {Math.floor(Math.random() * 500)} replies</span>
                    <span>🔄 {Math.floor(Math.random() * 100)} shares</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {i + 1}h ago
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
