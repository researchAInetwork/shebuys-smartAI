"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Eye, Heart, Share2, Calendar, Zap, Filter, Star, ArrowUp, ArrowDown, Minus, Globe, Users, ShoppingBag } from 'lucide-react'
import Image from "next/image"

interface TrendItem {
  id: number
  name: string
  category: string
  trendScore: number
  change: number
  platform: string
  image: string
  price: number
  engagement: number
  forecast: "rising" | "stable" | "declining"
  timeframe: string
  description: string
  styleDNAMatch: number
}

interface PlatformData {
  platform: string
  icon: string
  color: string
  trends: number
  engagement: string
}

const mockTrends: TrendItem[] = [
  {
    id: 1,
    name: "Oversized Blazers",
    category: "Fashion",
    trendScore: 95,
    change: 23,
    platform: "TikTok",
    image: "/placeholder.svg?height=200&width=200&text=Oversized+Blazers",
    price: 89,
    engagement: 2.4,
    forecast: "rising",
    timeframe: "Next 30 days",
    description: "Power dressing meets comfort - perfect for the modern boss babe",
    styleDNAMatch: 92
  },
  {
    id: 2,
    name: "Smart Home Gadgets",
    category: "Tech",
    trendScore: 88,
    change: 15,
    platform: "Instagram",
    image: "/placeholder.svg?height=200&width=200&text=Smart+Home",
    price: 156,
    engagement: 1.8,
    forecast: "rising",
    timeframe: "Next 60 days",
    description: "Tech-savvy lifestyle upgrades that make life easier and more stylish",
    styleDNAMatch: 78
  },
  {
    id: 3,
    name: "Sustainable Beauty",
    category: "Beauty",
    trendScore: 92,
    change: 31,
    platform: "X (Twitter)",
    image: "/placeholder.svg?height=200&width=200&text=Sustainable+Beauty",
    price: 45,
    engagement: 3.2,
    forecast: "rising",
    timeframe: "Next 90 days",
    description: "Eco-conscious beauty products that don't compromise on quality",
    styleDNAMatch: 85
  },
  {
    id: 4,
    name: "Minimalist Jewelry",
    category: "Accessories",
    trendScore: 76,
    change: -8,
    platform: "Pinterest",
    image: "/placeholder.svg?height=200&width=200&text=Minimalist+Jewelry",
    price: 67,
    engagement: 1.2,
    forecast: "stable",
    timeframe: "Next 30 days",
    description: "Less is more - delicate pieces that make a subtle statement",
    styleDNAMatch: 88
  },
  {
    id: 5,
    name: "Athleisure Sets",
    category: "Fashion",
    trendScore: 84,
    change: 18,
    platform: "TikTok",
    image: "/placeholder.svg?height=200&width=200&text=Athleisure+Sets",
    price: 72,
    engagement: 2.1,
    forecast: "rising",
    timeframe: "Next 45 days",
    description: "Comfort meets style - perfect for the active lifestyle",
    styleDNAMatch: 79
  }
]

const platformData: PlatformData[] = [
  { platform: "TikTok", icon: "🎵", color: "from-pink-500 to-red-500", trends: 1247, engagement: "2.4M" },
  { platform: "Instagram", icon: "📸", color: "from-purple-500 to-pink-500", trends: 892, engagement: "1.8M" },
  { platform: "Pinterest", icon: "📌", color: "from-red-500 to-orange-500", trends: 634, engagement: "1.2M" },
  { platform: "X (Twitter)", icon: "🐦", color: "from-blue-500 to-indigo-500", trends: 423, engagement: "890K" }
]

export default function TrendsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPlatform, setSelectedPlatform] = useState("All")
  const [timeframe, setTimeframe] = useState("today")
  const [sortBy, setSortBy] = useState("trendScore")

  const categories = ["All", "Fashion", "Beauty", "Tech", "Accessories", "Home", "Lifestyle"]
  const platforms = ["All", "TikTok", "Instagram", "Pinterest", "X (Twitter)"]

  const filteredTrends = mockTrends
    .filter(trend => {
      const categoryMatch = selectedCategory === "All" || trend.category === selectedCategory
      const platformMatch = selectedPlatform === "All" || trend.platform === selectedPlatform
      return categoryMatch && platformMatch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "trendScore":
          return b.trendScore - a.trendScore
        case "change":
          return b.change - a.change
        case "styleDNAMatch":
          return b.styleDNAMatch - a.styleDNAMatch
        default:
          return 0
      }
    })

  const getTrendIcon = (forecast: string, change: number) => {
    if (forecast === "rising" || change > 0) {
      return <ArrowUp className="w-4 h-4 text-green-600 dark:text-green-400" />
    } else if (forecast === "declining" || change < 0) {
      return <ArrowDown className="w-4 h-4 text-red-600 dark:text-red-400" />
    }
    return <Minus className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
  }

  const getTrendColor = (forecast: string) => {
    switch (forecast) {
      case "rising":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
      case "declining":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
      default:
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Smart Trend Intelligence
          </h1>
          <p className="text-gray-600 dark:text-gray-400">AI-powered insights from social media trends - stay ahead of the curve</p>
        </div>

        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px] mx-auto">
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="personal">For You</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            {/* Trend Summary */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">12</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Rising Trends</div>
                </CardContent>
              </Card>

              <Card className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
                <CardContent className="p-4 text-center">
                  <Eye className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2.4M</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Views</div>
                </CardContent>
              </Card>

              <Card className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
                <CardContent className="p-4 text-center">
                  <Heart className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">89%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy Rate</div>
                </CardContent>
              </Card>

              <Card className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
                <CardContent className="p-4 text-center">
                  <Zap className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">24h</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Real-time</div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          size="sm"
                          variant={selectedCategory === category ? "default" : "outline"}
                          className={selectedCategory === category ? "bg-purple-600 hover:bg-purple-700" : ""}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Platform</label>
                    <div className="flex flex-wrap gap-2">
                      {platforms.map((platform) => (
                        <Button
                          key={platform}
                          onClick={() => setSelectedPlatform(platform)}
                          size="sm"
                          variant={selectedPlatform === platform ? "default" : "outline"}
                          className={selectedPlatform === platform ? "bg-rose-600 hover:bg-rose-700" : ""}
                        >
                          {platform}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Sort By</label>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSortBy("trendScore")}
                        size="sm"
                        variant={sortBy === "trendScore" ? "default" : "outline"}
                      >
                        Trend Score
                      </Button>
                      <Button
                        onClick={() => setSortBy("styleDNAMatch")}
                        size="sm"
                        variant={sortBy === "styleDNAMatch" ? "default" : "outline"}
                      >
                        DNA Match
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trending Items */}
            <div className="space-y-4">
              {filteredTrends.map((trend, index) => (
                <Card key={trend.id} className="glass-effect dark:bg-gray-800/50 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="relative flex-shrink-0">
                        <div className="w-24 h-24 rounded-xl overflow-hidden">
                          <Image
                            src={trend.image || "/placeholder.svg"}
                            alt={trend.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -top-2 -left-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-xs">
                                {trend.category}
                              </Badge>
                              <Badge className={`text-xs ${getTrendColor(trend.forecast)}`}>
                                {getTrendIcon(trend.forecast, trend.change)}
                                <span className="ml-1 capitalize">{trend.forecast}</span>
                              </Badge>
                              <Badge className="bg-gradient-to-r from-purple-500 to-rose-500 text-white text-xs">
                                {trend.styleDNAMatch}% DNA Match
                              </Badge>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{trend.name}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">{trend.description}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Trending on {trend.platform}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{trend.trendScore}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Trend Score</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className={`text-lg font-bold ${trend.change > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                              {trend.change > 0 ? "+" : ""}{trend.change}%
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">24h Change</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">${trend.price}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Avg Price</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{trend.engagement}M</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Engagement</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{trend.styleDNAMatch}%</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Your Match</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>Forecast: {trend.timeframe}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              Details
                            </Button>
                            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700">
                              <ShoppingBag className="w-4 h-4 mr-1" />
                              Shop Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {platformData.map((platform) => (
                <Card key={platform.platform} className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${platform.color} flex items-center justify-center text-2xl`}>
                        {platform.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{platform.platform}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Platform Analytics</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{platform.trends}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Active Trends</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{platform.engagement}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Engagement</div>
                      </div>
                    </div>
                    <Button className={`w-full bg-gradient-to-r ${platform.color} text-white`}>
                      <Globe className="w-4 h-4 mr-2" />
                      View {platform.platform} Trends
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <Card className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  AI Trend Predictions
                </CardTitle>
                <CardDescription>What our AI expects to trend in the coming weeks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="font-bold text-green-700 dark:text-green-300">High Confidence Prediction</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Sustainable Fashion Surge</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Eco-friendly fashion items are predicted to increase by 45% in engagement over the next 2 weeks
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="font-bold text-blue-700 dark:text-blue-300">Medium Confidence</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Tech Accessories Boom</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Smart jewelry and tech accessories showing early momentum signals
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-rose-50 dark:from-purple-900/20 dark:to-rose-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <span className="font-bold text-purple-700 dark:text-purple-300">Emerging Trend</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Vintage Revival</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Y2K and early 2000s fashion showing increased search patterns
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personal" className="space-y-6">
            <Card className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Personalized for Your Style DNA
                </CardTitle>
                <CardDescription>Trends curated specifically for your Chic Minimalist style</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your Personal Trend Feed</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Based on your Style DNA, shopping history, and preferences
                  </p>
                  <Button className="bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700">
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Personal Trends
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
