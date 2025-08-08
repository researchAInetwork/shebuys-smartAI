"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Upload, Sparkles, Zap, ShoppingBag, Heart, Star } from "lucide-react"
import Image from "next/image"

interface StyleMatch {
  id: number
  name: string
  brand: string
  price: number
  confidence: number
  category: string
  image: string
  buyLink: string
}

const mockStyleMatches: StyleMatch[] = [
  {
    id: 1,
    name: "Gold Chain Necklace",
    brand: "Pandora",
    price: 45,
    confidence: 95,
    category: "Accessories",
    image: "/placeholder.svg?height=200&width=200&text=Gold+Necklace",
    buyLink: "#",
  },
  {
    id: 2,
    name: "Matching Earrings",
    brand: "Tiffany & Co",
    price: 89,
    confidence: 92,
    category: "Jewelry",
    image: "/placeholder.svg?height=200&width=200&text=Gold+Earrings",
    buyLink: "#",
  },
  {
    id: 3,
    name: "Designer Handbag",
    brand: "Coach",
    price: 120,
    confidence: 88,
    category: "Bags",
    image: "/placeholder.svg?height=200&width=200&text=Designer+Bag",
    buyLink: "#",
  },
]

export default function VisualAIStylist() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [styleMatches, setStyleMatches] = useState<StyleMatch[]>([])
  const [showResults, setShowResults] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        analyzeOutfit()
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
      }
    } catch (error) {
      console.error("Camera access denied:", error)
      alert("Camera access is required for this feature. Please enable camera permissions.")
    }
  }

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      context?.drawImage(videoRef.current, 0, 0)
      const imageData = canvas.toDataURL("image/jpeg")
      setUploadedImage(imageData)
      stopCamera()
      analyzeOutfit()
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setIsCameraActive(false)
    }
  }

  const analyzeOutfit = () => {
    setIsAnalyzing(true)
    setShowResults(false)

    // Simulate AI analysis
    setTimeout(() => {
      setStyleMatches(mockStyleMatches)
      setIsAnalyzing(false)
      setShowResults(true)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-purple-50 to-rose-50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-purple-600 animate-spin" />
            Visual AI Personal Stylist
          </CardTitle>
          <p className="text-gray-600">Upload your outfit and get instant AI-powered style recommendations!</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload/Camera Section */}
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="h-32 bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 flex flex-col items-center justify-center gap-2 text-lg font-semibold"
            >
              <Upload className="w-8 h-8" />
              Upload Photo
            </Button>

            <Button
              onClick={isCameraActive ? capturePhoto : startCamera}
              className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex flex-col items-center justify-center gap-2 text-lg font-semibold"
            >
              <Camera className="w-8 h-8" />
              {isCameraActive ? "Capture Photo" : "Use Camera"}
            </Button>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

          {/* Camera View */}
          {isCameraActive && (
            <div className="relative">
              <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover rounded-xl" />
              <div className="absolute inset-0 border-4 border-purple-400 rounded-xl animate-pulse"></div>
              <Button onClick={stopCamera} variant="outline" className="absolute top-2 right-2 bg-white/90">
                Cancel
              </Button>
            </div>
          )}

          {/* Uploaded Image */}
          {uploadedImage && (
            <div className="relative">
              <Image
                src={uploadedImage || "/placeholder.svg"}
                alt="Uploaded outfit"
                width={400}
                height={300}
                className="w-full h-64 object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-bold">Analyzing your style...</h3>
              </div>
            </div>
          )}

          {/* Analysis Loading */}
          {isAnalyzing && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg">
                <div className="loading-spinner w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                <span className="font-medium text-purple-600">AI is analyzing your style...</span>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600 animate-pulse">🔍 Detecting colors and patterns...</p>
                <p className="text-sm text-gray-600 animate-pulse">👗 Analyzing style elements...</p>
                <p className="text-sm text-gray-600 animate-pulse">💎 Finding perfect matches...</p>
              </div>
            </div>
          )}

          {/* Style Matches Results */}
          {showResults && styleMatches.length > 0 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">✨ Perfect Matches Found!</h3>
                <p className="text-gray-600">AI-curated recommendations just for your style</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {styleMatches.map((match) => (
                  <Card key={match.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-4">
                      <div className="relative mb-3">
                        <Image
                          src={match.image || "/placeholder.svg"}
                          alt={match.name}
                          width={200}
                          height={200}
                          className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                          {match.confidence}% Match
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <Badge variant="secondary" className="text-xs">
                          {match.category}
                        </Badge>
                        <h4 className="font-semibold text-gray-900">{match.name}</h4>
                        <p className="text-sm text-gray-600">{match.brand}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-purple-600">${match.price}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">4.8</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700"
                          >
                            <ShoppingBag className="w-4 h-4 mr-1" />
                            Buy Now
                          </Button>
                          <Button size="sm" variant="outline" className="border-2 border-purple-300 bg-transparent">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center pt-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-3"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Shop All Recommendations
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
