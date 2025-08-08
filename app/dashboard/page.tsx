"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Heart, ShoppingBag, Calendar, Star, DollarSign, Camera, Sparkles, Target } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const recentOutfits = [
  {
    id: 1,
    date: "Today",
    image: "/placeholder.svg?height=200&width=150",
    rating: 4.8,
    confidence: 92,
    occasion: "Work Meeting",
  },
  {
    id: 2,
    date: "Yesterday",
    image: "/placeholder.svg?height=200&width=150",
    rating: 4.5,
    confidence: 88,
    occasion: "Casual Day",
  },
  {
    id: 3,
    date: "2 days ago",
    image: "/placeholder.svg?height=200&width=150",
    rating: 4.9,
    confidence: 95,
    occasion: "Date Night",
  },
]

const upcomingEvents = [
  {
    id: 1,
    title: "Team Presentation",
    date: "Tomorrow, 2:00 PM",
    suggestion: "Professional blazer + tailored pants",
    confidence: "High impact outfit recommended",
  },
  {
    id: 2,
    title: "Weekend Brunch",
    date: "Saturday, 11:00 AM",
    suggestion: "Boho maxi dress + layered jewelry",
    confidence: "Perfect for your style DNA",
  },
]

const styleGoals = [
  { goal: "Build capsule wardrobe", progress: 75, target: "20 pieces" },
  { goal: "Stay within budget", progress: 60, target: "$200/month" },
  { goal: "Confidence boost", progress: 88, target: "90% daily" },
]

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Stylista! ✨</h1>
            <p className="text-gray-600">Your personal style journey continues</p>
          </div>
          <div className="flex gap-3">
            <Link href="/shop">
              <Button className="bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Shop Now
              </Button>
            </Link>
            <Button variant="outline">
              <Camera className="w-4 h-4 mr-2" />
              Try On
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Style Score</p>
                  <p className="text-2xl font-bold text-gray-900">4.7</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+0.3 this week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Confidence</p>
                  <p className="text-2xl font-bold text-gray-900">92%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+5% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Budget Used</p>
                  <p className="text-2xl font-bold text-gray-900">$120</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-600">of $200 monthly</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Wishlist</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-600">3 on sale now</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Outfits */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-600" />
                  Recent Outfits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {recentOutfits.map((outfit) => (
                    <div key={outfit.id} className="group cursor-pointer">
                      <div className="relative mb-3 overflow-hidden rounded-lg">
                        <Image
                          src={outfit.image || "/placeholder.svg"}
                          alt={`Outfit from ${outfit.date}`}
                          width={150}
                          height={200}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 text-xs font-medium">
                          {outfit.rating}★
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">{outfit.date}</p>
                        <p className="text-sm text-gray-600">{outfit.occasion}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-rose-500 h-2 rounded-full"
                              style={{ width: `${outfit.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{outfit.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  <Camera className="w-4 h-4 mr-2" />
                  Log Today's Outfit
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{event.date}</p>
                    <p className="text-sm font-medium text-purple-700 mb-1">{event.suggestion}</p>
                    <p className="text-xs text-gray-500">{event.confidence}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent">
                  <Calendar className="w-4 h-4 mr-2" />
                  Plan Outfits
                </Button>
              </CardContent>
            </Card>

            {/* Style Goals */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Style Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {styleGoals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">{goal.goal}</span>
                      <span className="text-xs text-gray-500">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <p className="text-xs text-gray-500">Target: {goal.target}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
