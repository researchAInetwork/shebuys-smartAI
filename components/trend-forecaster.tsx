"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Eye, Heart, Share2, Calendar, Zap } from "lucide-react"
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
  },
]

const categories = ["All", "Fashion", "Tech", "Beauty", "Home", "Accessories", "Career Tools"]
const platforms = ["All", "TikTok", "Instagram", "X (Twitter)", "Pinterest"]

export default function TrendForecaster() {
  const [trends, setTrends] = useState(mockTrends)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPlatform, setSelectedPlatform] = useState("All")
  const [timeframe, setTimeframe] = useState("today")

  const filteredTrends = trends.filter((trend) => {
    const categoryMatch = selectedCategory === "All" || trend.category === selectedCategory
    const platformMatch = selectedPlatform === "All" || trend.platform === selectedPlatform
    return categoryMatch && platformMatch
  })

  const getTrendIcon = (forecast: string) => {
    switch (forecast) {
      case "rising":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "declining":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <div className="w-4 h-4 bg-yellow-500 rounded-full" />
    }
  }

  const getTrendColor = (forecast: string) => {
    switch (forecast) {
      case "rising":
        return "text-green-600 bg-green-50"
      case "declining":
        return "text-red-600 bg-red-50"
      default:
        return "text-yellow-600 bg-yellow-50"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <TrendingUp className="w-6 h-6 text-indigo-600 animate-pulse" />
            Smart Trend Forecaster
          </CardTitle>
          <p className="text-gray-600">AI-powered insights from social media trends - stay ahead of the curve! 📈</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Trend Summary */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-gray-600">Rising Trends</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-4 text-center">
                <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">2.4M</div>
                <div className="text-sm text-gray-600">Total Views</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-pink-50">
              <CardContent className="p-4 text-center">
                <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">89%</div>
                <div className="text-sm text-gray-600">Accuracy Rate</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardContent className="p-4 text-center">
                <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">24h</div>
                <div className="text-sm text-gray-600">Real-time</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        size="sm"
                        variant={selectedCategory === category ? "default" : "outline"}
                        className={selectedCategory === category ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Platform</label>
                  <div className="flex flex-wrap gap-2">
                    {platforms.map((platform) => (
                      <Button
                        key={platform}
                        onClick={() => setSelectedPlatform(platform)}
                        size="sm"
                        variant={selectedPlatform === platform ? "default" : "outline"}
                        className={selectedPlatform === platform ? "bg-purple-600 hover:bg-purple-700" : ""}
                      >
                        {platform}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trending Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Trending Now</h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => setTimeframe("today")}
                  size="sm"
                  variant={timeframe === "today" ? "default" : "outline"}
                  className={timeframe === "today" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                >
                  Today
                </Button>
                <Button
                  onClick={() => setTimeframe("week")}
                  size="sm"
                  variant={timeframe === "week" ? "default" : "outline"}
                  className={timeframe === "week" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                >
                  This Week
                </Button>
                <Button
                  onClick={() => setTimeframe("month")}
                  size="sm"
                  variant={timeframe === "month" ? "default" : "outline"}
                  className={timeframe === "month" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                >
                  This Month
                </Button>
              </div>
            </div>

            {filteredTrends.map((trend, index) => (
              <Card key={trend.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-xl overflow-hidden">
                        <Image
                          src={trend.image || "/placeholder.svg"}
                          alt={trend.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute -top-2 -left-2 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
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
                              {getTrendIcon(trend.forecast)}
                              <span className="ml-1 capitalize">{trend.forecast}</span>
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-gray-900 text-lg">{trend.name}</h4>
                          <p className="text-sm text-gray-600">Trending on {trend.platform}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-indigo-600">{trend.trendScore}</div>
                          <div className="text-xs text-gray-500">Trend Score</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className={`text-lg font-bold ${trend.change > 0 ? "text-green-600" : "text-red-600"}`}>
                            {trend.change > 0 ? "+" : ""}
                            {trend.change}%
                          </div>
                          <div className="text-xs text-gray-500">24h Change</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">${trend.price}</div>
                          <div className="text-xs text-gray-500">Avg Price</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{trend.engagement}M</div>
                          <div className="text-xs text-gray-500">Engagement</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Forecast: {trend.timeframe}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-2 border-indigo-300 bg-transparent">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                            <Share2 className="w-4 h-4 mr-1" />
                            Shop Trend
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI Insights */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-100 to-indigo-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-purple-600 animate-pulse" />
                <h3 className="text-lg font-bold text-gray-900">AI Trend Insights</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">🔥 Hot Prediction</p>
                    <p className="text-sm text-gray-600">
                      Oversized blazers are expected to surge 40% in the next 2 weeks based on TikTok engagement
                      patterns.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">💡 Smart Tip</p>
                    <p className="text-sm text-gray-600">
                      Sustainable beauty products are gaining momentum across all platforms - perfect time to invest!
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">⚡ Opportunity Alert</p>
                    <p className="text-sm text-gray-600">
                      Smart home gadgets show consistent growth - consider adding to your wishlist before prices rise.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
