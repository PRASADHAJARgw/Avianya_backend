import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus, Image, Video, Grid, List } from 'lucide-react';

export default function InstagramPosts() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Posts & Content</h1>
          <p className="text-muted-foreground mt-1">Manage your Instagram posts, stories, and reels</p>
        </div>
        <Button className="bg-[#E1306C] hover:bg-[#C13584]">
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Grid className="mr-2 h-4 w-4" />
          Grid View
        </Button>
        <Button variant="outline" size="sm">
          <List className="mr-2 h-4 w-4" />
          List View
        </Button>
      </div>

      {/* Content Grid */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
            <div className="relative aspect-square bg-gradient-to-br from-purple-500 to-pink-500">
              {i % 3 === 0 ? (
                <Video className="absolute top-2 right-2 h-5 w-5 text-white" />
              ) : (
                <Image className="absolute top-2 right-2 h-5 w-5 text-white" />
              )}
            </div>
            <CardContent className="p-3">
              <p className="text-sm font-medium truncate">Post Title {i + 1}</p>
              <p className="text-xs text-muted-foreground">
                {Math.floor(Math.random() * 5000)} likes • {Math.floor(Math.random() * 500)} comments
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
