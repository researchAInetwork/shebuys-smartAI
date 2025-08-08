"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Camera, Play, Pause, Share2, Download, Heart, Crown, Calendar, MapPin, Zap, Volume2, VolumeX, ArrowRight, Star, Gift, User, Palette, Clock, ArrowLeft, Eye, Wand2, ShoppingBag } from 'lucide-react'
import Image from "next/image"
import { FirebaseProductService } from "@/lib/firebase-product-service"
import { GenkitAIService } from "@/lib/genkit-ai-service"
import { UserPreferences, OutfitRecommendation } from "@/lib/product-types"
import OutfitRecommendationCard from "./outfit-recommendation"
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/lib/firebase-config'

interface LifeScenario {
  id: string
  title: string
  description: string
  icon: string
  color: string
  timeline: string
  budget: number
  setting: string
  music: string
  affirmations: string[]
}

interface PersonalizationData {
  styleDNA: string
  mood: string
  eventDate: string
  bodyType: string
  skinTone: string
  culturalStyle: string
}

const lifeScenarios: LifeScenario[] = [
  {
    id: "wedding",
    title: "Dream Wedding",
    description: "Your perfect wedding day - radiant, confident, unforgettable",
    icon: "💍",
    color: "from-rose-400 via-pink-400 to-rose-500",
    timeline: "6-12 months",
    budget: 2500,
    setting: "romantic-garden",
    music: "romantic-orchestral",
    affirmations: ["This is your moment to shine", "You are absolutely radiant", "Love looks beautiful on you", "Today, you are the queen"]
  },
  {
    id: "ceo",
    title: "CEO Boardroom",
    description: "Executive presence that commands respect and inspires confidence",
    icon: "👑",
    color: "from-purple-500 via-indigo-500 to-purple-600",
    timeline: "3-6 months",
    budget: 1800,
    setting: "executive-boardroom",
    music: "powerful-cinematic",
    affirmations: ["You are unstoppable", "Leadership flows through you", "Own your power", "The boardroom is yours"]
  },
  {
    id: "milestone",
    title: "Milestone Birthday",
    description: "Celebrate your special day in unforgettable, show-stopping style",
    icon: "🎉",
    color: "from-yellow-400 via-orange-400 to-pink-500",
    timeline: "2-4 months",
    budget: 1200,
    setting: "glamorous-party",
    music: "celebratory-upbeat",
    affirmations: ["This is your year", "You deserve to celebrate", "Shine bright like the star you are", "Age is just a number, beauty is eternal"]
  },
  {
    id: "vacation",
    title: "Dream Vacation",
    description: "Travel in style to your bucket-list destination",
    icon: "✈️",
    color: "from-blue-400 via-cyan-400 to-teal-500",
    timeline: "1-3 months",
    budget: 800,
    setting: "tropical-paradise",
    music: "wanderlust-ambient",
    affirmations: ["Adventure awaits you", "The world is your runway", "You belong in beautiful places", "Travel with confidence and style"]
  },
  {
    id: "graduation",
    title: "Graduation Day",
    description: "Mark your academic achievement with pride and elegance",
    icon: "🎓",
    color: "from-green-400 via-emerald-400 to-green-500",
    timeline: "2-3 months",
    budget: 600,
    setting: "academic-ceremony",
    music: "inspirational-orchestral",
    affirmations: ["Your hard work paid off", "Intelligence is your best accessory", "You've earned this moment", "The future is bright ahead"]
  },
  {
    id: "date",
    title: "Perfect Date Night",
    description: "Romantic evening that leaves a lasting, enchanting impression",
    icon: "💕",
    color: "from-pink-400 via-rose-400 to-red-500",
    timeline: "2-4 weeks",
    budget: 400,
    setting: "romantic-dinner",
    music: "intimate-jazz",
    affirmations: ["You are irresistible", "Love finds you beautiful", "Tonight is magical", "You deserve to be adored"]
  }
]

// Custom template for user-created scenarios
const customTemplate: LifeScenario = {
  id: "custom",
  title: "Create Your Own",
  description: "Design your unique future moment with personalized details",
  icon: "✨",
  color: "from-gradient-to-r from-orange-400 via-amber-400 to-yellow-500",
  timeline: "Custom",
  budget: 0,
  setting: "custom-setting",
  music: "custom-music",
  affirmations: ["Your vision becomes reality", "You create your own destiny", "This is your unique moment", "Your dreams are valid and achievable"]
}

export default function LifeMirrorAI() {
  const [user] = useAuthState(auth)
  const [currentStep, setCurrentStep] = useState<'welcome' | 'selection' | 'personalization' | 'projection' | 'evolution' | 'shopping' | 'custom-creation'>('welcome')
  const [selectedScenario, setSelectedScenario] = useState<LifeScenario | null>(null)
  const [isCustomScenario, setIsCustomScenario] = useState(false)
  const [customScenarioData, setCustomScenarioData] = useState({
    title: '',
    description: '',
    timeline: '',
    budget: 500,
    setting: '',
    occasion: '',
    vibe: ''
  })
  const [personalization, setPersonalization] = useState<PersonalizationData>({
    styleDNA: '',
    mood: '',
    eventDate: '',
    bodyType: '',
    skinTone: '',
    culturalStyle: ''
  })
  const [outfitRecommendations, setOutfitRecommendations] = useState<OutfitRecommendation[]>([])
  const [isProjecting, setIsProjecting] = useState(false)
  const [projectionComplete, setProjectionComplete] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [projectionProgress, setProjectionProgress] = useState(0)
  const [currentAffirmation, setCurrentAffirmation] = useState(0)
  const [aiProjectionData, setAiProjectionData] = useState<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (isProjecting) {
      const interval = setInterval(() => {
        setProjectionProgress(prev => {
          if (prev >= 100) {
            setIsProjecting(false)
            setProjectionComplete(true)
            return 100
          }
          return prev + 1.5
        })
      }, 150)
      
      // Cycle through affirmations during projection
      const affirmationInterval = setInterval(() => {
        setCurrentAffirmation(prev => (prev + 1) % (selectedScenario?.affirmations.length || 4))
      }, 3000)
      
      return () => {
        clearInterval(interval)
        clearInterval(affirmationInterval)
      }
    }
  }, [isProjecting, selectedScenario])

  const startProjection = async () => {
    if (!selectedScenario || !user) return
    
    setIsProjecting(true)
    setProjectionProgress(0)
    setProjectionComplete(false)
    setCurrentAffirmation(0)
    
    // Start empowerment soundtrack
    if (audioEnabled && audioRef.current) {
      audioRef.current.play()
    }
    
    // Start camera for AR projection
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Camera access denied:", error)
    }

    // Generate AI projection using GenkitAI
    try {
      const userPreferences: UserPreferences = {
        styleDNA: personalization.styleDNA,
        bodyType: personalization.bodyType,
        skinTone: personalization.skinTone,
        culturalStyle: personalization.culturalStyle,
        budget: {
          min: 0,
          max: selectedScenario.budget,
          currency: 'USD'
        },
        sizes: {
          tops: 'M',
          bottoms: 'M',
          dresses: 'M',
          shoes: '8'
        },
        preferredBrands: [],
        avoidedBrands: [],
        region: 'US',
        occasions: [selectedScenario.id],
        colorPreferences: [],
        sustainabilityPreference: 'medium'
      }

      const projectionData = await FirebaseProductService.generateLifeMirrorProjection(
        userPreferences,
        selectedScenario.id,
        personalization
      )

      setAiProjectionData(projectionData)
    } catch (error) {
      console.error('Error generating AI projection:', error)
    }
  }

  const stopProjection = () => {
    setIsProjecting(false)
    setProjectionComplete(false)
    setProjectionProgress(0)
    
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
    }
    
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const generateOutfitRecommendations = async () => {
    if (!selectedScenario || !personalization.styleDNA || !user) return

    const userPreferences: UserPreferences = {
      styleDNA: personalization.styleDNA,
      bodyType: personalization.bodyType,
      skinTone: personalization.skinTone,
      culturalStyle: personalization.culturalStyle,
      budget: {
        min: 0,
        max: selectedScenario.budget,
        currency: 'USD'
      },
      sizes: {
        tops: 'M',
        bottoms: 'M',
        dresses: 'M',
        shoes: '8'
      },
      preferredBrands: [],
      avoidedBrands: [],
      region: 'US',
      occasions: [selectedScenario.id],
      colorPreferences: [],
      sustainabilityPreference: 'medium'
    }

    try {
      const recommendations = await FirebaseProductService.generateOutfitRecommendation(
        userPreferences,
        selectedScenario.id,
        selectedScenario.id
      )
      setOutfitRecommendations(recommendations)
      setCurrentStep('shopping')
    } catch (error) {
      console.error('Error generating outfit recommendations:', error)
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    setTimeout(() => {
      setIsRecording(false)
      alert("🎬 Your cinematic LifeMirror clip is ready! Perfect for inspiring your followers with your future self transformation! ✨")
    }, 12000) // 12 second cinematic recording
  }

  const shareProjection = () => {
    const shareText = `Just saw my future self and I'm OBSESSED! 😍✨ Using @SheBuysSmart LifeMirror AI to plan my ${selectedScenario?.title} transformation! The AR projection was so realistic I got chills! 🪞💫 #LifeMirrorAI #FutureSelf #StyleEvolution #SheBuysSmart`
    
    if (navigator.share) {
      navigator.share({
        title: `My Future Self: ${selectedScenario?.title}`,
        text: shareText,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(shareText)
      alert("✨ Share text copied to clipboard! Your followers will love seeing your future self transformation!")
    }
  }

  // Welcome Screen
  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 py-8 transition-all duration-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Animated Logo */}
            <div className="relative">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-rose-100 dark:from-purple-900/50 dark:to-rose-900/50 rounded-full px-12 py-6 mb-8 shadow-2xl backdrop-blur-sm border border-white/20">
                <div className="relative">
                  <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin" />
                  <div className="absolute inset-0 w-8 h-8 bg-purple-400 rounded-full animate-ping opacity-20"></div>
                </div>
                <span className="font-bold text-purple-600 dark:text-purple-400 text-2xl">LifeMirror AI</span>
                <div className="w-2 h-2 bg-gradient-to-r from-rose-400 to-purple-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Hero Content */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                See Your
                <br />
                <span className="relative">
                  Future Self
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 to-purple-500 rounded-full animate-pulse"></div>
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
                Step into tomorrow with our revolutionary AR technology powered by GenkitAI. 
                <br />
                <span className="text-transparent bg-gradient-to-r from-purple-600 to-rose-600 bg-clip-text font-medium">
                  Experience your future self with real products from Firebase.
                </span>
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid md:grid-cols-3 gap-6 my-12">
              {[
                { icon: "🪞", title: "AR Projection", desc: "See yourself in stunning 3D reality" },
                { icon: "🤖", title: "GenkitAI Powered", desc: "Advanced AI styling and recommendations" },
                { icon: "🛍️", title: "Instant Shopping", desc: "Buy real products from Firebase database" }
              ].map((feature, index) => (
                <div key={index} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="space-y-4">
              <Button 
                onClick={() => setCurrentStep('selection')}
                className="bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:via-purple-700 hover:to-indigo-700 text-white px-12 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-110 border-2 border-white/20"
              >
                <Eye className="w-6 h-6 mr-3" />
                See Your Future Self
                <Sparkles className="w-6 h-6 ml-3 animate-pulse" />
              </Button>
              
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ✨ Free AR projection • 🤖 GenkitAI powered • 🛍️ Real products from Firebase
              </p>
            </div>

            {/* Testimonial Preview */}
            <div className="bg-gradient-to-r from-purple-100/50 to-rose-100/50 dark:from-purple-900/20 dark:to-rose-900/20 rounded-2xl p-8 backdrop-blur-sm border border-white/20 max-w-2xl mx-auto">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="/placeholder.svg?height=48&width=48&text=Sarah" />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-rose-500 text-white">S</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Sarah M.</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">CEO Transformation</div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic">
                "The GenkitAI projection was incredible! I saw my future CEO self and bought the exact outfit from Firebase. The transformation was real!" ⭐⭐⭐⭐⭐
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Scenario Selection Screen
  if (currentStep === 'selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 py-8 transition-all duration-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentStep('welcome')}
              className="mb-6 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Welcome
            </Button>
            
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-rose-100 dark:from-purple-900/50 dark:to-rose-900/50 rounded-full px-8 py-4 mb-6 shadow-lg backdrop-blur-sm border border-white/20">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <span className="font-bold text-purple-600 dark:text-purple-400 text-lg">Choose Your Moment</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-4">
              What Future Do You Want to See?
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Select the life moment you want to experience. Each scenario creates a unique, personalized projection with real products you can buy instantly.
            </p>
          </div>

          {/* Scenario Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lifeScenarios.map((scenario) => (
              <Card 
                key={scenario.id}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer group transform hover:scale-105 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 overflow-hidden"
                onClick={() => {
                  setSelectedScenario(scenario)
                  setIsCustomScenario(false)
                  setCurrentStep('personalization')
                }}
              >
                <div className={`h-2 bg-gradient-to-r ${scenario.color}`}></div>
                <CardContent className="p-8 text-center">
                  <div className={`w-24 h-24 rounded-3xl bg-gradient-to-r ${scenario.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <span className="text-4xl">{scenario.icon}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {scenario.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {scenario.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm bg-white/40 dark:bg-gray-700/40 rounded-lg p-3">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Timeline:
                      </span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{scenario.timeline}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm bg-white/40 dark:bg-gray-700/40 rounded-lg p-3">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Gift className="w-4 h-4" />
                        Budget:
                      </span>
                      <span className="font-bold text-green-600 dark:text-green-400">${scenario.budget}</span>
                    </div>
                  </div>
                  
                  <Button className={`w-full bg-gradient-to-r ${scenario.color} hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold text-white border-0`}>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Experience This Future
                  </Button>
                </CardContent>
              </Card>
            ))}
            
            {/* Custom Template Card - 7th Option */}
            <Card 
              className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer group transform hover:scale-105 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 backdrop-blur-sm border-2 border-dashed border-orange-300 dark:border-orange-600 overflow-hidden"
              onClick={() => {
                setIsCustomScenario(true)
                setCurrentStep('custom-creation')
              }}
            >
              <div className="h-2 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-500"></div>
              <CardContent className="p-8 text-center">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-500 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-4xl">✨</span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  Create Your Own
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Design your unique future moment with personalized details and custom styling
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm bg-orange-50/60 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Timeline:
                    </span>
                    <span className="font-medium text-orange-600 dark:text-orange-400">Your Choice</span>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-orange-50/60 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Gift className="w-4 h-4" />
                      Budget:
                    </span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">Custom</span>
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold text-white border-0">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Design My Future
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Custom Creation Screen
  if (currentStep === 'custom-creation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-yellow-900/20 py-8 transition-all duration-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentStep('selection')}
              className="mb-6 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Scenarios
            </Button>
            
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/50 dark:to-yellow-900/50 rounded-full px-8 py-4 mb-6 shadow-lg backdrop-blur-sm border border-white/20">
              <Sparkles className="w-6 h-6 text-orange-600 dark:text-orange-400 animate-pulse" />
              <span className="font-bold text-orange-600 dark:text-orange-400 text-lg">Create Your Vision</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4">
              Design Your Unique Future
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Create a completely personalized scenario that reflects your unique dreams and aspirations. Our AI will bring your vision to life.
            </p>
          </div>

          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardContent className="p-8 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="customTitle" className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                      What's Your Dream Moment?
                    </Label>
                    <Input
                      id="customTitle"
                      placeholder="e.g., Art Gallery Opening, Book Launch, First Day as Boss..."
                      value={customScenarioData.title}
                      onChange={(e) => setCustomScenarioData(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-white/80 dark:bg-gray-700/80 border-orange-200 dark:border-orange-700"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customDescription" className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                      Describe Your Vision
                    </Label>
                    <textarea
                      id="customDescription"
                      placeholder="Paint the picture... How do you want to feel? What's the atmosphere? Who's there?"
                      value={customScenarioData.description}
                      onChange={(e) => setCustomScenarioData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full h-24 bg-white/80 dark:bg-gray-700/80 border border-orange-200 dark:border-orange-700 rounded-md px-3 py-2 text-sm resize-none"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customOccasion" className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                      Type of Occasion
                    </Label>
                    <Select onValueChange={(value) => setCustomScenarioData(prev => ({ ...prev, occasion: value }))}>
                      <SelectTrigger className="bg-white/80 dark:bg-gray-700/80 border-orange-200 dark:border-orange-700">
                        <SelectValue placeholder="Select the closest match" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional/Career</SelectItem>
                        <SelectItem value="celebration">Celebration/Party</SelectItem>
                        <SelectItem value="romantic">Romantic/Date</SelectItem>
                        <SelectItem value="creative">Creative/Artistic</SelectItem>
                        <SelectItem value="travel">Travel/Adventure</SelectItem>
                        <SelectItem value="family">Family/Personal</SelectItem>
                        <SelectItem value="achievement">Achievement/Milestone</SelectItem>
                        <SelectItem value="other">Something Completely Unique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="customTimeline" className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                      When Do You Want This?
                    </Label>
                    <Select onValueChange={(value) => setCustomScenarioData(prev => ({ ...prev, timeline: value }))}>
                      <SelectTrigger className="bg-white/80 dark:bg-gray-700/80 border-orange-200 dark:border-orange-700">
                        <SelectValue placeholder="Select your timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2 weeks">1-2 weeks (Quick transformation)</SelectItem>
                        <SelectItem value="1 month">1 month (Focused preparation)</SelectItem>
                        <SelectItem value="2-3 months">2-3 months (Thoughtful planning)</SelectItem>
                        <SelectItem value="6 months">6 months (Major transformation)</SelectItem>
                        <SelectItem value="1 year">1 year (Life-changing journey)</SelectItem>
                        <SelectItem value="someday">Someday (Dream for the future)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="customBudget" className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                      Investment Budget: ${customScenarioData.budget}
                    </Label>
                    <input
                      type="range"
                      min="100"
                      max="5000"
                      step="100"
                      value={customScenarioData.budget}
                      onChange={(e) => setCustomScenarioData(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gradient-to-r from-orange-200 to-yellow-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>$100</span>
                      <span>$5000</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customVibe" className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                      What's the Vibe?
                    </Label>
                    <Select onValueChange={(value) => setCustomScenarioData(prev => ({ ...prev, vibe: value }))}>
                      <SelectTrigger className="bg-white/80 dark:bg-gray-700/80 border-orange-200 dark:border-orange-700">
                        <SelectValue placeholder="Choose the energy you want" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="powerful-confident">Powerful & Confident</SelectItem>
                        <SelectItem value="elegant-sophisticated">Elegant & Sophisticated</SelectItem>
                        <SelectItem value="fun-playful">Fun & Playful</SelectItem>
                        <SelectItem value="mysterious-alluring">Mysterious & Alluring</SelectItem>
                        <SelectItem value="warm-approachable">Warm & Approachable</SelectItem>
                        <SelectItem value="creative-artistic">Creative & Artistic</SelectItem>
                        <SelectItem value="bold-statement">Bold & Statement-Making</SelectItem>
                        <SelectItem value="serene-peaceful">Serene & Peaceful</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="customSetting" className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                      Where Will This Happen?
                    </Label>
                    <Input
                      id="customSetting"
                      placeholder="e.g., Rooftop bar, Conference room, Art studio, Beach resort..."
                      value={customScenarioData.setting}
                      onChange={(e) => setCustomScenarioData(prev => ({ ...prev, setting: e.target.value }))}
                      className="bg-white/80 dark:bg-gray-700/80 border-orange-200 dark:border-orange-700"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  onClick={() => {
                    // Create custom scenario object
                    const customScenario: LifeScenario = {
                      id: "custom",
                      title: customScenarioData.title || "My Custom Vision",
                      description: customScenarioData.description || "A unique moment designed just for me",
                      icon: "✨",
                      color: "from-orange-400 via-amber-400 to-yellow-500",
                      timeline: customScenarioData.timeline || "Custom",
                      budget: customScenarioData.budget,
                      setting: customScenarioData.setting || "custom-setting",
                      music: "custom-inspirational",
                      affirmations: [
                        "Your vision becomes reality",
                        "You create your own destiny", 
                        "This is your unique moment",
                        "Your dreams are valid and achievable"
                      ]
                    }
                    setSelectedScenario(customScenario)
                    setCurrentStep('personalization')
                  }}
                  disabled={!customScenarioData.title || !customScenarioData.description || !customScenarioData.occasion}
                  className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Wand2 className="w-5 h-5 mr-2" />
                  Create My Vision
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  ✨ Your custom scenario will be powered by GenkitAI with real products from Firebase
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Personalization Screen
  if (currentStep === 'personalization') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 py-8 transition-all duration-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentStep('selection')}
              className="mb-6 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Scenarios
            </Button>
            
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-rose-100 dark:from-purple-900/50 dark:to-rose-900/50 rounded-full px-8 py-4 mb-6 shadow-lg backdrop-blur-sm border border-white/20">
              <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <span className="font-bold text-purple-600 dark:text-purple-400 text-lg">Personalization</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Let's Perfect Your Vision
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              A few quick details to create the most accurate projection and find real products for your <span className="font-semibold text-purple-600 dark:text-purple-400">{selectedScenario?.title}</span>.
            </p>
          </div>

          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardContent className="p-8 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="styleDNA" className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                      Your Style DNA
                    </Label>
                    <Select onValueChange={(value) => setPersonalization(prev => ({ ...prev, styleDNA: value }))}>
                      <SelectTrigger className="bg-white/80 dark:bg-gray-700/80 border-purple-200 dark:border-purple-700">
                        <SelectValue placeholder="Select your style personality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="classic-elegant">Classic Elegant</SelectItem>
                        <SelectItem value="modern-chic">Modern Chic</SelectItem>
                        <SelectItem value="bohemian-free">Bohemian Free Spirit</SelectItem>
                        <SelectItem value="edgy-bold">Edgy & Bold</SelectItem>
                        <SelectItem value="romantic-feminine">Romantic Feminine</SelectItem>
                        <SelectItem value="minimalist-clean">Minimalist Clean</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="mood" className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                      Current Mood & Energy
                    </Label>
                    <Select onValueChange={(value) => setPersonalization(prev => ({ ...prev, mood: value }))}>
                      <SelectTrigger className="bg-white/80 dark:bg-gray-700/80 border-purple-200 dark:border-purple-700">
                        <SelectValue placeholder="How are you feeling today?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confident-powerful">Confident & Powerful</SelectItem>
                        <SelectItem value="dreamy-romantic">Dreamy & Romantic</SelectItem>
                        <SelectItem value="adventurous-bold">Adventurous & Bold</SelectItem>
                        <SelectItem value="calm-serene">Calm & Serene</SelectItem>
                        <SelectItem value="excited-energetic">Excited & Energetic</SelectItem>
                        <SelectItem value="sophisticated-refined">Sophisticated & Refined</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="eventDate" className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                      When is your special moment?
                    </Label>
                    <Input
                      type="date"
                      value={personalization.eventDate}
                      onChange={(e) => setPersonalization(prev => ({ ...prev, eventDate: e.target.value }))}
                      className="bg-white/80 dark:bg-gray-700/80 border-purple-200 dark:border-purple-700"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="bodyType" className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                      Body Shape (for perfect fit)
                    </Label>
                    <Select onValueChange={(value) => setPersonalization(prev => ({ ...prev, bodyType: value }))}>
                      <SelectTrigger className="bg-white/80 dark:bg-gray-700/80 border-purple-200 dark:border-purple-700">
                        <SelectValue placeholder="Select your body shape" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pear">Pear Shape</SelectItem>
                        <SelectItem value="apple">Apple Shape</SelectItem>
                        <SelectItem value="hourglass">Hourglass</SelectItem>
                        <SelectItem value="rectangle">Rectangle</SelectItem>
                        <SelectItem value="inverted-triangle">Inverted Triangle</SelectItem>
                        <SelectItem value="plus-size-curvy">Plus Size Curvy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="skinTone" className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                      Skin Tone
                    </Label>
                    <Select onValueChange={(value) => setPersonalization(prev => ({ ...prev, skinTone: value }))}>
                      <SelectTrigger className="bg-white/80 dark:bg-gray-700/80 border-purple-200 dark:border-purple-700">
                        <SelectValue placeholder="Select your skin tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fair-cool">Fair Cool</SelectItem>
                        <SelectItem value="fair-warm">Fair Warm</SelectItem>
                        <SelectItem value="light-cool">Light Cool</SelectItem>
                        <SelectItem value="light-warm">Light Warm</SelectItem>
                        <SelectItem value="medium-cool">Medium Cool</SelectItem>
                        <SelectItem value="medium-warm">Medium Warm</SelectItem>
                        <SelectItem value="deep-cool">Deep Cool</SelectItem>
                        <SelectItem value="deep-warm">Deep Warm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="culturalStyle" className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                      Cultural Style Influence
                    </Label>
                    <Select onValueChange={(value) => setPersonalization(prev => ({ ...prev, culturalStyle: value }))}>
                      <SelectTrigger className="bg-white/80 dark:bg-gray-700/80 border-purple-200 dark:border-purple-700">
                        <SelectValue placeholder="Any cultural style preferences?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="western-contemporary">Western Contemporary</SelectItem>
                        <SelectItem value="african-inspired">African Inspired</SelectItem>
                        <SelectItem value="asian-fusion">Asian Fusion</SelectItem>
                        <SelectItem value="latin-vibrant">Latin Vibrant</SelectItem>
                        <SelectItem value="middle-eastern-elegant">Middle Eastern Elegant</SelectItem>
                        <SelectItem value="mixed-global">Mixed Global</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  onClick={() => setCurrentStep('projection')}
                  disabled={!personalization.styleDNA || !personalization.mood}
                  className="bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Camera className="w-5 h-5 mr-3" />
                  Create My Future Self
                  <Sparkles className="w-5 h-5 ml-3 animate-pulse" />
                </Button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                  ✨ Your personalized AR projection with real products will be generated
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // AR Projection Screen (same as before but with shopping integration)
  if (currentStep === 'projection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 py-8 transition-all duration-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="ghost" 
              onClick={() => {
                setCurrentStep('personalization')
                stopProjection()
              }}
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Personalization
            </Button>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
              >
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                {audioEnabled ? "Audio On" : "Audio Off"}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComparison(!showComparison)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
              >
                <Eye className="w-4 h-4" />
                {showComparison ? "Hide Comparison" : "Show Comparison"}
              </Button>
            </div>
          </div>

          {/* Current Scenario Info */}
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 shadow-lg mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${selectedScenario?.color} flex items-center justify-center shadow-lg`}>
                  <span className="text-2xl">{selectedScenario?.icon}</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedScenario?.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{selectedScenario?.description}</p>
                </div>
                <div className="text-right">
                  <Badge className={`bg-gradient-to-r ${selectedScenario?.color} text-white px-4 py-2 mb-2`}>
                    {selectedScenario?.timeline}
                  </Badge>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Real products available
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AR Projection Area */}
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Camera className="w-6 h-6" />
                LifeMirror AR Projection
                <div className="ml-auto flex items-center gap-2">
                  {isProjecting && (
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">LIVE</span>
                    </div>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                {!isProjecting && !projectionComplete ? (
                  <div className="aspect-video bg-gradient-to-br from-purple-100 via-rose-100 to-indigo-100 dark:from-purple-900/20 dark:via-rose-900/20 dark:to-indigo-900/20 rounded-xl flex items-center justify-center border-4 border-dashed border-purple-300 dark:border-purple-700">
                    <div className="text-center space-y-6">
                      <div className="relative">
                        <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-rose-500 rounded-full flex items-center justify-center mx-auto animate-pulse shadow-2xl">
                          <Camera className="w-16 h-16 text-white" />
                        </div>
                        <div className="absolute inset-0 w-32 h-32 bg-purple-400 rounded-full animate-ping opacity-20 mx-auto"></div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Ready for Your Transformation?</h3>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                          Experience your future self in stunning AR with real products you can buy instantly
                        </p>
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-4 h-4" />
                            AR Technology
                          </span>
                          <span className="flex items-center gap-1">
                            <Volume2 className="w-4 h-4" />
                            Emotional Soundtrack
                          </span>
                          <span className="flex items-center gap-1">
                            <ShoppingBag className="w-4 h-4" />
                            Instant Shopping
                          </span>
                        </div>
                      </div>
                      <Button 
                        onClick={startProjection}
                        className="bg-gradient-to-r from-purple-600 via-rose-600 to-indigo-600 hover:from-purple-700 hover:via-rose-700 hover:to-indigo-700 px-12 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-110 border-2 border-white/20"
                      >
                        <Wand2 className="w-6 h-6 mr-3" />
                        Begin Projection
                        <Sparkles className="w-6 h-6 ml-3 animate-pulse" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
                    {showComparison ? (
                      <div className="grid grid-cols-2 h-full">
                        <div className="relative">
                          <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                            <span className="text-white text-sm font-medium">Present You</span>
                          </div>
                        </div>
                        <div className="relative bg-gradient-to-br from-purple-200 to-rose-200 dark:from-purple-800 to-rose-800">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-white">
                              <div className="text-6xl mb-4">{selectedScenario?.icon}</div>
                              <div className="text-2xl font-bold">Future You</div>
                              <div className="text-lg opacity-80">Transformed & Confident</div>
                            </div>
                          </div>
                          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                            <span className="text-white text-sm font-medium">Future You</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {/* AR Overlay Effects */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${selectedScenario?.color.replace('from-', 'from-').replace('to-', 'to-')}/20 to-transparent`}></div>
                    <div className="absolute inset-0 border-4 border-purple-400 rounded-xl animate-pulse shadow-lg"></div>
                    
                    {/* Floating particles effect */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-white/60 rounded-full animate-bounce"
                          style={{
                            left: `${20 + i * 15}%`,
                            top: `${30 + (i % 2) * 40}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: '3s'
                          }}
                        ></div>
                      ))}
                    </div>
                    
                    {/* Projection Progress */}
                    {isProjecting && (
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="relative">
                              <Sparkles className="w-6 h-6 text-purple-400 animate-spin" />
                              <div className="absolute inset-0 w-6 h-6 bg-purple-400 rounded-full animate-ping opacity-30"></div>
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-bold text-lg mb-1">
                                {selectedScenario?.affirmations[currentAffirmation]}
                              </div>
                              <div className="text-purple-200 text-sm">
                                Projecting your future self with real products...
                              </div>
                            </div>
                          </div>
                          <Progress value={projectionProgress} className="h-3 mb-3" />
                          <div className="text-xs text-purple-200">
                            {projectionProgress < 25 && "🧬 Analyzing your Style DNA and preferences..."}
                            {projectionProgress >= 25 && projectionProgress < 50 && "🛍️ Finding perfect products from our partner stores..."}
                            {projectionProgress >= 50 && projectionProgress < 75 && "✨ Creating your AR projection with real outfits..."}
                            {projectionProgress >= 75 && projectionProgress < 95 && "🎬 Adding cinematic effects and affiliate links..."}
                            {projectionProgress >= 95 && "🎉 Your future self and shopping list are ready!"}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Projection Complete Overlay */}
                    {projectionComplete && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                        <div className="p-8 text-white w-full">
                          <div className="text-center mb-6">
                            <h3 className="text-4xl font-bold mb-3 bg-gradient-to-r from-yellow-400 to-rose-400 bg-clip-text text-transparent">
                              ✨ Your Future Self Revealed! ✨
                            </h3>
                            <p className="text-xl text-purple-200 mb-2">You look absolutely STUNNING and powerful!</p>
                            <p className="text-lg text-gray-300">Ready to shop the exact items from your projection?</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 justify-center">
                            <Button 
                              onClick={generateOutfitRecommendations}
                              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-8 py-3 font-semibold"
                            >
                              <ShoppingBag className="w-5 h-5 mr-2" />
                              Shop This Look
                            </Button>
                            
                            <Button 
                              onClick={startRecording}
                              disabled={isRecording}
                              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 px-8 py-3 font-semibold"
                            >
                              {isRecording ? (
                                <>
                                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse mr-2"></div>
                                  Recording Clip...
                                </>
                              ) : (
                                <>
                                  <Camera className="w-5 h-5 mr-2" />
                                  Record Cinematic Clip
                                </>
                              )}
                            </Button>
                            
                            <Button 
                              onClick={shareProjection}
                              variant="outline"
                              className="border-white text-white hover:bg-white/20 px-8 py-3 font-semibold"
                            >
                              <Share2 className="w-5 h-5 mr-2" />
                              Share Transformation
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Audio Element */}
              <audio ref={audioRef} loop>
                <source src={`/soundtracks/${selectedScenario?.music}.mp3`} type="audio/mpeg" />
              </audio>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Shopping Screen - NEW!
  if (currentStep === 'shopping') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 py-8 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentStep('projection')}
              className="mb-6 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projection
            </Button>
            
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-rose-100 dark:from-purple-900/50 dark:to-rose-900/50 rounded-full px-8 py-4 mb-6 shadow-lg backdrop-blur-sm border border-white/20">
              <ShoppingBag className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <span className="font-bold text-purple-600 dark:text-purple-400 text-lg">Shop Your Future Self</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Your Perfect {selectedScenario?.title} Outfits
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              These are the exact outfits from your AR projection! Each item is carefully selected from our partner stores with affiliate links for instant purchase.
            </p>
          </div>

          {/* Outfit Recommendations */}
          <div className="space-y-8">
            {outfitRecommendations.length > 0 ? (
              outfitRecommendations.map((outfit, index) => (
                <OutfitRecommendationCard
                  key={outfit.id}
                  outfit={outfit}
                  onAddAllToCart={(outfit) => {
                    // Handle adding all items to cart across multiple stores
                    console.log('Adding outfit to cart:', outfit)
                  }}
                />
              ))
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Curating Your Perfect Outfits...
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Our AI is finding the best products from our partner stores that match your projection
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      AI Matching
                    </span>
                    <span className="flex items-center gap-1">
                      <ShoppingBag className="w-4 h-4" />
                      Real Products
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Best Prices
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-purple-100 to-rose-100 dark:from-purple-900/20 dark:to-rose-900/20 rounded-2xl p-8 backdrop-blur-sm border border-white/20 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Love Your Future Self? ✨
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try another life scenario or share your transformation with friends!
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => {
                    setCurrentStep('welcome')
                    setSelectedScenario(null)
                    setPersonalization({
                      styleDNA: '',
                      mood: '',
                      eventDate: '',
                      bodyType: '',
                      skinTone: '',
                      culturalStyle: ''
                    })
                    setOutfitRecommendations([])
                  }}
                  variant="outline"
                  className="px-8 py-3"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Try Another Scenario
                </Button>
                <Button 
                  onClick={shareProjection}
                  className="bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 px-8 py-3"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share My Transformation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
