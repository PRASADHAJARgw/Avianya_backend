import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { TrendingUp, Users, Heart, MessageCircle, Share2, Eye } from 'lucide-react';

export default function InstagramAnalytics() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Insights</h1>
        <p className="text-muted-foreground mt-1">Track your Instagram performance metrics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follower Growth</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128.5K</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reach</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456.2K</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+24.7%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Engagement Breakdown</CardTitle>
            <CardDescription>Interactions by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Likes</span>
                </div>
                <div className="text-sm font-bold">98.5K</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Comments</span>
                </div>
                <div className="text-sm font-bold">12.3K</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Shares</span>
                </div>
                <div className="text-sm font-bold">8.7K</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Story Views</span>
                </div>
                <div className="text-sm font-bold">45.2K</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
            <CardDescription>Your best posts this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Post Title {i + 1}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.floor(Math.random() * 50000)} engagements
                    </p>
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audience Demographics */}
      <Card>
        <CardHeader>
          <CardTitle>Audience Insights</CardTitle>
          <CardDescription>Demographics and location data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h4 className="font-medium mb-2">Top Countries</h4>
              <div className="space-y-2">
                {['United States', 'United Kingdom', 'India', 'Canada', 'Australia'].map((country, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{country}</span>
                    <span className="text-muted-foreground">{Math.floor(Math.random() * 30)}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Age Groups</h4>
              <div className="space-y-2">
                {['18-24', '25-34', '35-44', '45-54', '55+'].map((age, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{age}</span>
                    <span className="text-muted-foreground">{Math.floor(Math.random() * 35)}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Gender Split</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Female</span>
                  <span className="text-muted-foreground">58%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Male</span>
                  <span className="text-muted-foreground">41%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Other</span>
                  <span className="text-muted-foreground">1%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
