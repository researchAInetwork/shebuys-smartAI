"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ShoppingBag, Camera, TrendingUp, Heart, Star, DollarSign, CheckCircle, User, Palette, Shirt, Tag } from "lucide-react"
import Image from "next/image"

const demoSteps = [
  {
    id: 1,
    title: "Take Style Quiz",
    description: "60-second interactive quiz",
    icon: Sparkles,
    color: "from-rose-500 to-pink-500",
    image: "/placeholder.svg?height=200&width=300&text=Style+Quiz",
  },
  {
    id: 2,
    title: "Get AI Recommendations",
    description: "Personalized outfit suggestions",
    icon: TrendingUp,
    color: "from-purple-500 to-indigo-500",
    image: "/placeholder.svg?height=200&width=300&text=AI+Recommendations",
  },
  {
    id: 3,
    title: "Try On Virtually",
    description: "AR-powered fitting room",
    icon: Camera,
    color: "from-indigo-500 to-blue-500",
    image: "/placeholder.svg?height=200&width=300&text=Virtual+Try+On",
  },
  {
    id: 4,
    title: "Shop Smart",
    description: "Budget-friendly purchases",
    icon: ShoppingBag,
    color: "from-green-500 to-emerald-500",
    image: "/placeholder.svg?height=200&width=300&text=Smart+Shopping",
  },
]

export default function InteractiveDemo() {
  const [activeStep, setActiveStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % demoSteps.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isPlaying])

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-rose-50 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 bg-purple-300 rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-32 h-32 bg-rose-300 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg">
            <Sparkles className="w-5 h-5 text-purple-600 animate-spin" />
            <span className="font-semibold text-purple-600">Interactive Demo</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">See SheBuys Smart in Action</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the magic of AI-powered styling in just 4 simple steps
          </p>
        </div>

        {/* Interactive Steps */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Step Navigation */}
          <div className="space-y-6">
            {demoSteps.map((step, index) => (
              <Card
                key={step.id}
                className={`cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                  activeStep === index
                    ? "shadow-2xl border-2 border-purple-300 bg-gradient-to-r from-white to-purple-50"
                    : "shadow-lg hover:shadow-xl bg-white"
                }`}
                onClick={() => setActiveStep(index)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center transition-all duration-300 ${
                        activeStep === index ? "scale-110 animate-pulse" : ""
                      }`}
                    >
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        activeStep === index ? "bg-purple-500 scale-125" : "bg-gray-300"
                      }`}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Demo Visualization */}
          <div className="relative space-y-6">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-purple-100 to-rose-100 p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-rose-500/10"></div>
              <div className="relative z-10">
                {/* Dynamic Content Based on Active Step */}
                <div className="w-full h-64 rounded-2xl mb-6 transition-all duration-500 overflow-hidden bg-white/50 backdrop-blur-sm">
                  {activeStep === 0 && (
                    // Style Quiz Visualization
                    <div className="h-full flex flex-col items-center justify-center p-6 space-y-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center animate-pulse">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                          <h5 className="font-semibold text-gray-900">What's your style preference?</h5>
                          <p className="text-sm text-gray-600">Question 3 of 8</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 w-full">
                        <div className="bg-gradient-to-r from-rose-400 to-pink-400 p-3 rounded-lg text-white text-center font-medium animate-bounce">
                          Chic & Minimal
                        </div>
                        <div className="bg-white/80 p-3 rounded-lg text-gray-700 text-center font-medium border-2 border-gray-200">
                          Bold & Trendy
                        </div>
                        <div className="bg-white/80 p-3 rounded-lg text-gray-700 text-center font-medium border-2 border-gray-200">
                          Classic & Elegant
                        </div>
                        <div className="bg-white/80 p-3 rounded-lg text-gray-700 text-center font-medium border-2 border-gray-200">
                          Casual & Comfy
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full w-3/8 animate-pulse"></div>
                      </div>
                    </div>
                  )}

                  {activeStep === 1 && (
                    // AI Recommendations Visualization
                    <div className="h-full flex flex-col items-center justify-center p-6 space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-6 h-6 text-purple-600 animate-bounce" />
                        <span className="font-semibold text-purple-600">AI Analyzing Your Style...</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 w-full">
                        <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-lg text-center animate-pulse">
                          <Shirt className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                          <p className="text-xs font-medium">Blazer</p>
                          <p className="text-xs text-gray-600">98% match</p>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-3 rounded-lg text-center animate-pulse" style={{ animationDelay: "0.2s" }}>
                          <Palette className="w-6 h-6 mx-auto mb-1 text-indigo-600" />
                          <p className="text-xs font-medium">Dress</p>
                          <p className="text-xs text-gray-600">95% match</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-lg text-center animate-pulse" style={{ animationDelay: "0.4s" }}>
                          <Tag className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                          <p className="text-xs font-medium">Shoes</p>
                          <p className="text-xs text-gray-600">92% match</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>3 perfect matches found for your style DNA</span>
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    // Virtual Try-On Visualization
                    <div className="h-full flex flex-col items-center justify-center p-6 space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Camera className="w-6 h-6 text-indigo-600 animate-pulse" />
                        <span className="font-semibold text-indigo-600">AR Fitting Room Active</span>
                      </div>
                      <div className="relative w-32 h-40 bg-gradient-to-b from-indigo-100 to-blue-100 rounded-lg overflow-hidden">
                        {/* Virtual Person */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-32 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full relative">
                            {/* Virtual Outfit Overlay */}
                            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-16 h-20 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-t-full opacity-80 animate-pulse"></div>
                          </div>
                        </div>
                        {/* AR Scan Lines */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-400/20 to-transparent animate-pulse"></div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          Love it!
                        </button>
                        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                          Try Another
                        </button>
                      </div>
                    </div>
                  )}

                  {activeStep === 3 && (
                    // Smart Shopping Visualization
                    <div className="h-full flex flex-col items-center justify-center p-6 space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <ShoppingBag className="w-6 h-6 text-green-600 animate-bounce" />
                        <span className="font-semibold text-green-600">Smart Budget Analysis</span>
                      </div>
                      <div className="w-full space-y-3">
                        <div className="flex items-center justify-between bg-white/80 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <Shirt className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Designer Blazer</p>
                              <p className="text-xs text-gray-600">Similar style, 60% less</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-green-600">$89</p>
                            <p className="text-xs text-gray-500 line-through">$220</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            Total Savings: $131
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            4.8 Rating
                          </span>
                        </div>
                      </div>
                      <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full font-medium text-sm animate-pulse">
                        Add to Cart
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">{demoSteps[activeStep].title}</h4>
                  <p className="text-gray-600 text-lg">{demoSteps[activeStep].description}</p>
                </div>
              </div>
            </div>

            {/* Play Demo Button - Positioned under the demo visualization */}
            <div className="flex justify-center">
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl ${
                  isPlaying
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700"
                }`}
              >
                {isPlaying ? "Pause Demo" : "Play Demo"}
              </Button>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-rose-400 to-purple-400 rounded-full opacity-20 animate-float"></div>
            <div
              className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full opacity-20 animate-float"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  )
}
