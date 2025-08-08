import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const styleProfiles = [
  {
    name: "Boho Chic",
    description: "Free-spirited, earthy, and effortlessly elegant",
    colors: ["Terracotta", "Sage", "Cream"],
    vibe: "Artistic & Relaxed",
    image: "/placeholder.svg?height=300&width=200",
  },
  {
    name: "Minimal Boss",
    description: "Clean lines, power pieces, sophisticated simplicity",
    colors: ["Black", "White", "Camel"],
    vibe: "Professional & Sleek",
    image: "/placeholder.svg?height=300&width=200",
  },
  {
    name: "Afro-Glam",
    description: "Bold patterns, vibrant colors, cultural pride",
    colors: ["Gold", "Royal Blue", "Ankara"],
    vibe: "Confident & Radiant",
    image: "/placeholder.svg?height=300&width=200",
  },
]

export default function StyleDNAPreview() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-rose-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-purple-600 mb-4">
            <Sparkles className="w-6 h-6" />
            <span className="font-semibold">Style DNA Profiles</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Discover Your Unique Style Identity</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI analyzes your preferences, lifestyle, and body type to create your personalized Style DNA
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {styleProfiles.map((profile, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={profile.image || "/placeholder.svg"}
                  alt={profile.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{profile.name}</h3>
                  <p className="text-sm opacity-90">{profile.vibe}</p>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">{profile.description}</p>
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-700">Signature Colors:</div>
                  <div className="flex gap-2">
                    {profile.colors.map((color, colorIndex) => (
                      <Badge key={colorIndex} variant="secondary" className="text-xs">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/quiz">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 px-8 py-4 text-lg font-semibold"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Take the Style DNA Quiz
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
