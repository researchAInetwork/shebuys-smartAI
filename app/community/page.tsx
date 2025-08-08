"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle, Share2, TrendingUp, Users, Crown, Star, Plus, Filter, Search, Camera, Zap, Award, FlameIcon as Fire } from 'lucide-react'
import Image from "next/image"

interface Post {
  id: number
  author: {
    name: string
    avatar: string
    badge: string
    verified: boolean
  }
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
  timestamp: string
  tags: string[]
  liked: boolean
}

interface TrendingTopic {
  id: number
  title: string
  posts: number
  growth: string
  color: string
}

interface TopContributor {
  id: number
  name: string
  avatar: string
  points: number
  badge: string
  posts: number
}

const mockPosts: Post[] = [
  {
    id: 1,
    author: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40&text=SC",
      badge: "Style Maven",
      verified: true
    },
    content: "Just used LifeMirror AI to see myself as a CEO and I'm OBSESSED! 😍 The evolution plan is so detailed and actually affordable. Who else is manifesting their boss babe era? #LifeMirrorAI #BossBabe",
    image: "/placeholder.svg?height=300&width=400&text=CEO+Transformation",
    likes: 247,
    comments: 32,
    shares: 18,
    timestamp: "2 hours ago",
    tags: ["LifeMirrorAI", "BossBabe", "Transformation"],
    liked: false
  },
  {
    id: 2,
    author: {
      name: "Amara Johnson",
      avatar: "/placeholder.svg?height=40&width=40&text=AJ",
      badge: "Trend Spotter",
      verified: true
    },
    content: "Y'all... the Budget Whisperer just saved me from buying a $200 dress I didn't need! 🙌 It suggested 3 alternatives under $50 that look even better. This AI is my financial bestie! #BudgetWhisperer #SmartShopping",
    likes: 189,
    comments: 24,
    shares: 12,
    timestamp: "4 hours ago",
    tags: ["BudgetWhisperer", "SmartShopping", "MoneyTips"],
    liked: true
  },
  {
    id: 3,
    author: {
      name: "Zara Okafor",
      avatar: "/placeholder.svg?height=40&width=40&text=ZO",
      badge: "Community Star",
      verified: false
    },
    content: "Found the PERFECT wedding dress through Social Buying Circles! 💍 We got 40% off because 8 of us bought together. The power of sisterhood is real! Who wants to start a circle for bridesmaid dresses?",
    image: "/placeholder.svg?height=300&width=400&text=Wedding+Dress",
    likes: 156,
    comments: 28,
    shares: 15,
    timestamp: "6 hours ago",
    tags: ["SocialBuying", "Wedding", "Sisterhood"],
    liked: false
  }
]

const trendingTopics: TrendingTopic[] = [
  { id: 1, title: "#LifeMirrorAI", posts: 1247, growth: "+340%", color: "from-purple-500 to-rose-500" },
  { id: 2, title: "#BudgetWhisperer", posts: 892, growth: "+180%", color: "from-blue-500 to-indigo-500" },
  { id: 3, title: "#SocialBuying", posts: 634, growth: "+120%", color: "from-green-500 to-emerald-500" },
  { id: 4, title: "#StyleDNA", posts: 567, growth: "+95%", color: "from-yellow-500 to-orange-500" },
  { id: 5, title: "#TrendForecaster", posts: 423, growth: "+75%", color: "from-pink-500 to-purple-500" }
]

const topContributors: TopContributor[] = [
  { id: 1, name: "Sarah Chen", avatar: "/placeholder.svg?height=40&width=40&text=SC", points: 2847, badge: "Style Maven", posts: 156 },
  { id: 2, name: "Amara Johnson", avatar: "/placeholder.svg?height=40&width=40&text=AJ", points: 2156, badge: "Trend Spotter", posts: 134 },
  { id: 3, name: "Zara Okafor", avatar: "/placeholder.svg?height=40&width=40&text=ZO", points: 1923, badge: "Community Star", posts: 98 },
  { id: 4, name: "Maya Patel", avatar: "/placeholder.svg?height=40&width=40&text=MP", points: 1678, badge: "Budget Guru", posts: 87 },
  { id: 5, name: "Kemi Adebayo", avatar: "/placeholder.svg?height=40&width=40&text=KA", points: 1445, badge: "Fashion Forward", posts: 76 }
]

export default function CommunityPage() {
  const [posts, setPosts] = useState(mockPosts)
  const [newPost, setNewPost] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ))
  }

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const post: Post = {
        id: Date.now(),
        author: {
          name: "You",
          avatar: "/placeholder.svg?height=40&width=40&text=You",
          badge: "Style Explorer",
          verified: false
        },
        content: newPost,
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: "Just now",
        tags: [],
        liked: false
      }
      setPosts([post, ...posts])
      setNewPost("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Style Community
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Connect, share, and inspire with fellow style enthusiasts</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <Card className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Share Your Style Journey
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="What's your latest style discovery? Share your AI feature experience, outfit wins, or ask for advice!"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Photo
                    </Button>
                    <Button variant="outline" size="sm">
                      <Zap className="w-4 h-4 mr-2" />
                      AI Feature
                    </Button>
                  </div>
                  <Button onClick={handleCreatePost} disabled={!newPost.trim()}>
                    Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Filter Tabs */}
            <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
                <TabsTrigger value="ai">AI Features</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6 mt-6">
                {posts.map((post) => (
                  <Card key={post.id} className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
                    <CardContent className="p-6">
                      {/* Post Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{post.author.name}</h3>
                            {post.author.verified && <Star className="w-4 h-4 text-yellow-500" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">{post.author.badge}</Badge>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{post.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>

                      {/* Post Image */}
                      {post.image && (
                        <div className="mb-4 rounded-lg overflow-hidden">
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt="Post image"
                            width={400}
                            height={300}
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      )}

                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center gap-2 ${post.liked ? 'text-red-500' : 'text-gray-500'}`}
                          >
                            <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-500">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-500">
                            <Share2 className="w-4 h-4" />
                            {post.shares}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="trending" className="mt-6">
                <Card className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
                  <CardContent className="p-6 text-center">
                    <Fire className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Trending Posts</h3>
                    <p className="text-gray-600 dark:text-gray-400">The hottest style conversations right now</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="following" className="mt-6">
                <Card className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
                  <CardContent className="p-6 text-center">
                    <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Following</h3>
                    <p className="text-gray-600 dark:text-gray-400">Posts from people you follow</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai" className="mt-6">
                <Card className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
                  <CardContent className="p-6 text-center">
                    <Zap className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI Features</h3>
                    <p className="text-gray-600 dark:text-gray-400">Posts about AI-powered style discoveries</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trending Topics */}
            <Card className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Trending Topics
                </CardTitle>
                <CardDescription>What's hot in the style community</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={topic.id} className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-bold text-gray-500 dark:text-gray-400">#{index + 1}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{topic.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{topic.posts} posts</p>
                      </div>
                    </div>
                    <Badge className={`bg-gradient-to-r ${topic.color} text-white`}>
                      {topic.growth}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Contributors */}
            <Card className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Top Contributors
                </CardTitle>
                <CardDescription>This week's style leaders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topContributors.map((contributor, index) => (
                  <div key={contributor.id} className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-700/30 rounded-lg">
                    <div className="text-lg font-bold text-gray-500 dark:text-gray-400">#{index + 1}</div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={contributor.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{contributor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{contributor.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{contributor.badge}</Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{contributor.posts} posts</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-purple-600 dark:text-purple-400">{contributor.points}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">points</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">12.5K</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Members</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">3.2K</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Posts Today</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">$2.1M</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Saved Together</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">89%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
