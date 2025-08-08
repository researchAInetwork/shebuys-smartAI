"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ShoppingBag, Heart, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"

const styleProfiles = {
  boho: {
    name: "Boho Chic",
    description:
      "You're a free spirit who loves natural textures, flowing silhouettes, and earthy tones. Your style is effortlessly elegant with a touch of wanderlust.",
    personality: "Creative, intuitive, and authentic",
    colors: ["Terracotta", "Sage Green", "Cream", "Rust", "Dusty Rose"],
    essentials: ["Maxi dresses", "Layered jewelry", "Fringe bags", "Ankle boots", "Kimono jackets"],
    celebrities: ["Vanessa Hudgens", "Sienna Miller", "Kate Bosworth"],
    image: "/placeholder.svg?height=400&width=300",
  },
  minimal: {
    name: "Minimal Boss",
    description:
      "You embody sophistication and power through clean lines and quality pieces. Less is more, and every item in your wardrobe serves a purpose.",
    personality: "Confident, focused, and refined",
    colors: ["Black", "White", "Camel", "Navy", "Grey"],
    essentials: ["Tailored blazers", "Silk blouses", "Straight-leg trousers", "Pointed flats", "Structured bags"],
    celebrities: ["Meghan Markle", "Victoria Beckham", "Gwyneth Paltrow"],
    image: "/placeholder.svg?height=400&width=300",
  },
  "afro-glam": {
    name: "Afro-Glam",
    description:
      "You celebrate your heritage with bold patterns, vibrant colors, and statement pieces. Your style radiates confidence and cultural pride.",
    personality: "Bold, proud, and radiant",
    colors: ["Gold", "Royal Blue", "Emerald", "Ankara Prints", "Kente Colors"],
    essentials: ["Ankara dresses", "Statement earrings", "Head wraps", "Bold prints", "Metallic accessories"],
    celebrities: ["Lupita Nyong'o", "Issa Rae", "Yara Shahidi"],
    image: "/placeholder.svg?height=400&width=300",
  },
  edgy: {
    name: "Edgy Rebel",
    description:
      "You're not afraid to stand out with bold choices and unexpected combinations. Your style breaks rules and makes statements.",
    personality: "Fearless, creative, and independent",
    colors: ["Black", "Neon Pink", "Electric Blue", "Metallic Silver", "Deep Purple"],
    essentials: ["Leather jackets", "Combat boots", "Graphic tees", "Ripped jeans", "Statement accessories"],
    celebrities: ["Rihanna", "Zendaya", "Billie Eilish"],
    image: "/placeholder.svg?height=400&width=300",
  },
}

function ResultsContent() {
  const searchParams = useSearchParams()
  const styleType = searchParams.get("style") || "boho"
  const profile = styleProfiles[styleType as keyof typeof styleProfiles] || styleProfiles.boho

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-purple-600 mb-4">
            <Sparkles className="w-6 h-6" />
            <span className="font-semibold">Your Style DNA Results</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            You are a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
              {profile.name}
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{profile.description}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Profile Image */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="relative h-96">
                <Image src={profile.image || "/placeholder.svg"} alt={profile.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold">{profile.name}</h3>
                  <p className="text-lg opacity-90">{profile.personality}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Color Palette */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-500 to-purple-500 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  Your Signature Colors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {profile.colors.map((color, index) => (
                    <Badge key={index} variant="secondary" className="px-4 py-2 text-sm font-medium">
                      {color}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Wardrobe Essentials */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </div>
                  Wardrobe Essentials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {profile.essentials.map((essential, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <span className="text-gray-700">{essential}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Style Icons */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  Your Style Icons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {profile.celebrities.map((celebrity, index) => (
                    <Badge key={index} variant="outline" className="px-4 py-2 text-sm">
                      {celebrity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 px-8 py-4 text-lg font-semibold"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Shop Your Style
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-4 text-lg font-semibold bg-transparent"
              >
                Go to Dashboard
              </Button>
            </Link>
          </div>
          <p className="text-gray-600">
            Ready to build your perfect wardrobe? Let's find pieces that match your {profile.name} style!
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Results() {
  return (
    <Suspense fallback={<div>Loading your results...</div>}>
      <ResultsContent />
    </Suspense>
  )
}
