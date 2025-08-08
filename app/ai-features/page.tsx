"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, MapPin, DollarSign, Users, TrendingUp, MessageCircle, QrCode, Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"
import VisualAIStylist from "@/components/visual-ai-stylist"
import GeoSmartDealRadar from "@/components/geosmart-deal-radar"
import BudgetWhisperer from "@/components/budget-whisperer"
import SocialBuyingCircles from "@/components/social-buying-circles"
import TrendForecaster from "@/components/trend-forecaster"
import SisterSaverAIBot from "@/components/sistersaver-ai-bot"
import QRShoppingSplitPay from "@/components/qr-shopping-splitpay"

const aiFeatures = [
  {
    id: "visual-stylist",
    name: "Visual AI Personal Stylist",
    description: "Upload your wardrobe and get instant AI-powered style recommendations",
    icon: Camera,
    color: "from-purple-500 to-rose-500",
    badge: "🧠 Vision AI",
  },
  {
    id: "deal-radar",
    name: "GeoSmart Deal Radar",
    description: "Real-time location-based deals and flash sales near you",
    icon: MapPin,
    color: "from-green-500 to-emerald-500",
    badge: "📍 Location AI",
  },
  {
    id: "budget-whisperer",
    name: "Daily Budget Whisperer",
    description: "Your AI financial coach with voice guidance and smart spending alerts",
    icon: DollarSign,
    color: "from-blue-500 to-indigo-500",
    badge: "🪙 Financial AI",
  },
  {
    id: "buying-circles",
    name: "Social Buying Circles",
    description: "Join communities for group deals and shared bulk-buying power",
    icon: Users,
    color: "from-pink-500 to-purple-500",
    badge: "📈 Social AI",
  },
  {
    id: "trend-forecaster",
    name: "Smart Trend Forecaster",
    description: "AI-powered trend analysis from TikTok, Instagram, and X",
    icon: TrendingUp,
    color: "from-indigo-500 to-purple-500",
    badge: "💡 Trend AI",
  },
  {
    id: "ai-bot",
    name: "SisterSaver AI Bot",
    description: "24/7 chatbot that's your financial bestie with personality options",
    icon: MessageCircle,
    color: "from-rose-500 to-pink-500",
    badge: "🎁 Chat AI",
  },
  {
    id: "qr-shopping",
    name: "Smart QR Shopping & SplitPay",
    description: "Scan products in-store, compare prices, and split payments smartly",
    icon: QrCode,
    color: "from-emerald-500 to-teal-500",
    badge: "🧩 Payment AI",
  },
]

export default function AIFeatures() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null)

  const renderFeatureComponent = (featureId: string) => {
    switch (featureId) {
      case "visual-stylist":
        return <VisualAIStylist />
      case "deal-radar":
        return <GeoSmartDealRadar />
      case "budget-whisperer":
        return <BudgetWhisperer />
      case "buying-circles":
        return <SocialBuyingCircles />
      case "trend-forecaster":
        return <TrendForecaster />
      case "ai-bot":
        return <SisterSaverAIBot />
      case "qr-shopping":
        return <QRShoppingSplitPay />
      default:
        return null
    }
  }

  if (activeFeature) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Button
              onClick={() => setActiveFeature(null)}
              variant="outline"
              className="mb-4 border-2 border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to AI Features
            </Button>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-rose-100 rounded-full px-6 py-3 mb-4 shadow-lg">
                <Sparkles className="w-5 h-5 text-purple-600 animate-spin" />
                <span className="font-semibold text-purple-600">
                  {aiFeatures.find((f) => f.id === activeFeature)?.name}
                </span>
              </div>
            </div>
          </div>
          {renderFeatureComponent(activeFeature)}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-rose-100 rounded-full px-8 py-4 mb-6 shadow-lg">
            <Sparkles className="w-6 h-6 text-purple-600 animate-spin" />
            <span className="font-bold text-purple-600 text-lg">AI-Powered Features</span>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            The Future of
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
              {" "}
              Smart Shopping
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Experience revolutionary AI features designed specifically for modern women who want to shop smarter, save
            more, and look absolutely fabulous! 🌟
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {aiFeatures.map((feature, index) => (
            <Card
              key={feature.id}
              className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer transform hover:scale-105"
              onClick={() => setActiveFeature(feature.id)}
            >
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <div
                    className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>

                  <div>
                    <Badge className="mb-3 bg-white/90 text-purple-700 border border-purple-200">{feature.badge}</Badge>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                      {feature.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>

                  <Button
                    className={`w-full bg-gradient-to-r ${feature.color} hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold`}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Try Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Global Features Banner */}
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-purple-600 via-rose-500 to-indigo-600 text-white overflow-hidden">
          <CardContent className="p-8 relative">
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
            <div
              className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full animate-float"
              style={{ animationDelay: "2s" }}
            ></div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold mb-4">🌍 Multi-Language & Cultural Flex Mode</h2>
              <p className="text-xl mb-6 opacity-90">
                Supporting Yoruba, Hausa, Igbo, Swahili, Arabic, French with localized deals and culturally-appropriate
                tips
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">7+</div>
                  <div className="text-sm opacity-80">Languages Supported</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">50+</div>
                  <div className="text-sm opacity-80">Countries Covered</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">100%</div>
                  <div className="text-sm opacity-80">AI-Native Experience</div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">💅 Feminine Modern UI</Badge>
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">🎨 3D Animations</Badge>
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">🪞 Budget Reflection</Badge>
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">🤖 Fully AI-Native</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
