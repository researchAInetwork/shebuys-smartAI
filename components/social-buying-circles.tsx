"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Users, Crown, ShoppingBag, Plus, Star, Gift } from "lucide-react"
import Image from "next/image"

interface BuyingCircle {
  id: number
  name: string
  members: number
  category: string
  savings: number
  image: string
  isJoined: boolean
  topSaver: string
  currentDeal: string
  dealPrice: number
  originalPrice: number
}

interface Member {
  id: number
  name: string
  avatar: string
  savings: number
  rank: number
  badge: string
}

const mockCircles: BuyingCircle[] = [
  {
    id: 1,
    name: "Boss Babes Workwear",
    members: 156,
    category: "Professional",
    savings: 2340,
    image: "/placeholder.svg?height=150&width=200&text=Workwear+Circle",
    isJoined: true,
    topSaver: "Sarah M.",
    currentDeal: "Designer Blazer Bundle",
    dealPrice: 89,
    originalPrice: 150,
  },
  {
    id: 2,
    name: "Mama's Fashion Hub",
    members: 89,
    category: "Family",
    savings: 1890,
    image: "/placeholder.svg?height=150&width=200&text=Family+Fashion",
    isJoined: false,
    topSaver: "Jennifer K.",
    currentDeal: "Kids + Mom Matching Sets",
    dealPrice: 65,
    originalPrice: 120,
  },
  {
    id: 3,
    name: "Tech Queens",
    members: 234,
    category: "Technology",
    savings: 4560,
    image: "/placeholder.svg?height=150&width=200&text=Tech+Circle",
    isJoined: true,
    topSaver: "Aisha O.",
    currentDeal: "Smart Home Bundle",
    dealPrice: 199,
    originalPrice: 350,
  },
]

const topMembers: Member[] = [
  {
    id: 1,
    name: "Sarah M.",
    avatar: "/placeholder.svg?height=40&width=40&text=SM",
    savings: 1250,
    rank: 1,
    badge: "👑 Savings Queen",
  },
  {
    id: 2,
    name: "Aisha O.",
    avatar: "/placeholder.svg?height=40&width=40&text=AO",
    savings: 980,
    rank: 2,
    badge: "💎 Smart Shopper",
  },
  {
    id: 3,
    name: "Jennifer K.",
    avatar: "/placeholder.svg?height=40&width=40&text=JK",
    savings: 875,
    rank: 3,
    badge: "⭐ Deal Hunter",
  },
]

export default function SocialBuyingCircles() {
  const [circles, setCircles] = useState(mockCircles)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCircleName, setNewCircleName] = useState("")

  const joinCircle = (circleId: number) => {
    setCircles(
      circles.map((circle) =>
        circle.id === circleId ? { ...circle, isJoined: true, members: circle.members + 1 } : circle,
      ),
    )
  }

  const leaveCircle = (circleId: number) => {
    setCircles(
      circles.map((circle) =>
        circle.id === circleId ? { ...circle, isJoined: false, members: circle.members - 1 } : circle,
      ),
    )
  }

  const createCircle = () => {
    if (newCircleName.trim()) {
      const newCircle: BuyingCircle = {
        id: Date.now(),
        name: newCircleName,
        members: 1,
        category: "Custom",
        savings: 0,
        image: "/placeholder.svg?height=150&width=200&text=New+Circle",
        isJoined: true,
        topSaver: "You",
        currentDeal: "Setting up first deal...",
        dealPrice: 0,
        originalPrice: 0,
      }
      setCircles([...circles, newCircle])
      setNewCircleName("")
      setShowCreateForm(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-pink-50 to-rose-50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Users className="w-6 h-6 text-pink-600 animate-pulse" />
            Social Buying Circles
          </CardTitle>
          <p className="text-gray-600">Join communities, save together, and unlock exclusive group deals! 👭</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Weekly Leaderboard */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Crown className="w-5 h-5 text-yellow-600" />
                This Week's Savings Champions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {member.rank === 1 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Crown className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.badge}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${member.savings}</p>
                      <p className="text-xs text-gray-500">saved this week</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Create New Circle */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              {!showCreateForm ? (
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center justify-center gap-2 text-lg font-semibold"
                >
                  <Plus className="w-6 h-6" />
                  Create Your Own Buying Circle
                </Button>
              ) : (
                <div className="space-y-4">
                  <Input
                    placeholder="Enter circle name (e.g., 'Lagos Fashionistas')"
                    value={newCircleName}
                    onChange={(e) => setNewCircleName(e.target.value)}
                    className="border-2 focus:border-purple-300"
                  />
                  <div className="flex gap-2">
                    <Button onClick={createCircle} className="flex-1 bg-purple-600 hover:bg-purple-700">
                      Create Circle
                    </Button>
                    <Button
                      onClick={() => setShowCreateForm(false)}
                      variant="outline"
                      className="border-2 border-gray-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Buying Circles Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Available Circles</h3>

            {circles.map((circle) => (
              <Card key={circle.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                      <Image
                        src={circle.image || "/placeholder.svg"}
                        alt={circle.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Badge variant="secondary" className="text-xs mb-1">
                            {circle.category}
                          </Badge>
                          <h4 className="font-semibold text-gray-900 text-lg">{circle.name}</h4>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {circle.members} members • Top saver: {circle.topSaver}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total Saved</p>
                          <p className="text-xl font-bold text-green-600">${circle.savings}</p>
                        </div>
                      </div>

                      {/* Current Deal */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Gift className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">Current Group Deal</span>
                        </div>
                        <p className="font-semibold text-gray-900">{circle.currentDeal}</p>
                        {circle.dealPrice > 0 && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-lg font-bold text-green-600">${circle.dealPrice}</span>
                            <span className="text-sm text-gray-500 line-through">${circle.originalPrice}</span>
                            <Badge className="bg-red-500 text-white text-xs">
                              {Math.round((1 - circle.dealPrice / circle.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {circle.isJoined ? (
                          <>
                            <Button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              Join Group Deal
                            </Button>
                            <Button
                              onClick={() => leaveCircle(circle.id)}
                              variant="outline"
                              className="border-2 border-gray-300"
                            >
                              Leave
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={() => joinCircle(circle.id)}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Join Circle
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Rewards System */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-100 to-pink-100">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Star className="w-6 h-6 text-purple-600 animate-pulse" />
                  <h3 className="text-lg font-bold text-gray-900">Rewards Program</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Earn points for every group purchase and unlock exclusive benefits!
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">1,250</div>
                    <div className="text-sm text-gray-600">Points Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">Gold</div>
                    <div className="text-sm text-gray-600">Current Tier</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">15%</div>
                    <div className="text-sm text-gray-600">Extra Savings</div>
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
