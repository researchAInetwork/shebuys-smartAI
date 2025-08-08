"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Sparkles, Zap, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

const quizQuestions = [
  {
    id: 1,
    question: "What makes your heart skip a beat when shopping? ✨",
    subtitle: "Choose what speaks to your soul",
    options: [
      {
        text: "Flowy maxi dress with layered jewelry",
        style: "boho",
        image: "/placeholder.svg?height=200&width=200&text=Boho+Dress",
        emoji: "🌸",
        vibe: "Free Spirit",
      },
      {
        text: "Tailored blazer with sleek trousers",
        style: "minimal",
        image: "/placeholder.svg?height=200&width=200&text=Minimal+Blazer",
        emoji: "💼",
        vibe: "Boss Babe",
      },
      {
        text: "Colorful ankara print with bold accessories",
        style: "afro-glam",
        image: "/placeholder.svg?height=200&width=200&text=Ankara+Print",
        emoji: "👑",
        vibe: "Queen Energy",
      },
      {
        text: "Vintage band tee with distressed jeans",
        style: "edgy",
        image: "/placeholder.svg?height=200&width=200&text=Edgy+Style",
        emoji: "🔥",
        vibe: "Rebel Soul",
      },
    ],
  },
  {
    id: 2,
    question: "Which color palette makes you feel unstoppable? 🎨",
    subtitle: "Colors have power - choose yours",
    options: [
      {
        text: "Earth tones: terracotta, sage, cream",
        style: "boho",
        image: "/placeholder.svg?height=200&width=200&text=Earth+Tones",
        emoji: "🌿",
        vibe: "Natural Beauty",
      },
      {
        text: "Monochrome: black, white, grey",
        style: "minimal",
        image: "/placeholder.svg?height=200&width=200&text=Monochrome",
        emoji: "⚫",
        vibe: "Timeless Chic",
      },
      {
        text: "Vibrant: gold, royal blue, emerald",
        style: "afro-glam",
        image: "/placeholder.svg?height=200&width=200&text=Vibrant+Colors",
        emoji: "💎",
        vibe: "Radiant Goddess",
      },
      {
        text: "Bold: neon pink, electric blue, lime",
        style: "edgy",
        image: "/placeholder.svg?height=200&width=200&text=Bold+Colors",
        emoji: "⚡",
        vibe: "Electric Energy",
      },
    ],
  },
  {
    id: 3,
    question: "Your style inspiration comes from... 💫",
    subtitle: "Who moves your fashion soul?",
    options: [
      {
        text: "Free-spirited artists and travelers",
        style: "boho",
        image: "/placeholder.svg?height=200&width=200&text=Artist+Inspiration",
        emoji: "🎨",
        vibe: "Creative Soul",
      },
      {
        text: "Successful CEOs and entrepreneurs",
        style: "minimal",
        image: "/placeholder.svg?height=200&width=200&text=CEO+Style",
        emoji: "📈",
        vibe: "Power Player",
      },
      {
        text: "African queens and cultural icons",
        style: "afro-glam",
        image: "/placeholder.svg?height=200&width=200&text=Cultural+Icons",
        emoji: "👸🏾",
        vibe: "Cultural Pride",
      },
      {
        text: "Rock stars and rebels",
        style: "edgy",
        image: "/placeholder.svg?height=200&width=200&text=Rock+Stars",
        emoji: "🎸",
        vibe: "Rebel Heart",
      },
    ],
  },
]

export default function StyleQuiz() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  const handleNext = () => {
    if (selectedOption) {
      setIsAnimating(true)
      const newAnswers = [...answers, selectedOption]
      setAnswers(newAnswers)

      setTimeout(() => {
        if (currentQuestion < quizQuestions.length - 1) {
          setCurrentQuestion(currentQuestion + 1)
          setSelectedOption("")
          setIsAnimating(false)
        } else {
          // Quiz completed
          setShowConfetti(true)
          const styleCount = newAnswers.reduce(
            (acc, answer) => {
              acc[answer] = (acc[answer] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          )

          const dominantStyle = Object.keys(styleCount).reduce((a, b) => (styleCount[a] > styleCount[b] ? a : b))

          setTimeout(() => {
            router.push(`/results?style=${dominantStyle}`)
          }, 2000)
        }
      }, 500)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1)
        setSelectedOption(answers[currentQuestion - 1] || "")
        setAnswers(answers.slice(0, -1))
        setIsAnimating(false)
      }, 300)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 py-8 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 bg-purple-300 rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-32 h-32 bg-rose-300 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-10 w-24 h-24 bg-indigo-300 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ["#f43f5e", "#a855f7", "#3b82f6", "#10b981"][Math.floor(Math.random() * 4)],
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-rose-100 rounded-full px-6 py-3 mb-6 shadow-lg">
            <Sparkles className="w-6 h-6 text-purple-600 animate-spin" />
            <span className="font-semibold text-purple-600">Style DNA Discovery</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
            Discover Your Unique Style Identity ✨
          </h1>
          <p className="text-gray-600 text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Question {currentQuestion + 1} of {quizQuestions.length} • This is going to be fun!
          </p>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-8 relative">
          <Progress value={progress} className="h-3 bg-gray-200" />
          <div
            className="absolute top-0 left-0 h-3 bg-gradient-to-r from-purple-500 to-rose-500 rounded-full transition-all duration-500 shadow-lg"
            style={{ width: `${progress}%` }}
          ></div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>Just started</span>
            <span>Almost there!</span>
          </div>
        </div>

        {/* Interactive Question Card */}
        <Card
          className={`border-0 shadow-2xl mb-8 transition-all duration-500 ${isAnimating ? "scale-95 opacity-50" : "scale-100 opacity-100"}`}
        >
          <CardHeader className="text-center pb-4 bg-gradient-to-r from-purple-50 to-rose-50">
            <CardTitle className="text-3xl text-gray-900 mb-2">{quizQuestions[currentQuestion].question}</CardTitle>
            <p className="text-lg text-gray-600 font-medium">{quizQuestions[currentQuestion].subtitle}</p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded-3xl border-3 transition-all duration-300 transform hover:scale-105 ${
                    selectedOption === option.style
                      ? "border-purple-500 bg-gradient-to-br from-purple-50 to-rose-50 shadow-2xl scale-105"
                      : "border-gray-200 hover:border-purple-300 hover:shadow-xl bg-white"
                  }`}
                  onClick={() => setSelectedOption(option.style)}
                >
                  <div className="p-6 text-center relative overflow-hidden">
                    {/* Animated Background */}
                    {selectedOption === option.style && (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-rose-100/50 animate-pulse"></div>
                    )}

                    <div className="relative z-10">
                      <div className="mb-4 overflow-hidden rounded-2xl relative">
                        <Image
                          src={option.image || "/placeholder.svg"}
                          alt={option.text}
                          width={200}
                          height={200}
                          className="w-full h-40 object-cover transition-transform duration-300 hover:scale-110"
                        />
                        <div className="absolute top-3 right-3 text-2xl bg-white/90 rounded-full w-10 h-10 flex items-center justify-center">
                          {option.emoji}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-3 py-1 mb-2">
                          <Star className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-700">{option.vibe}</span>
                        </div>
                        <p className="font-medium text-gray-900 text-lg">{option.text}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-8 py-3 bg-white border-2 border-gray-300 hover:border-purple-300 disabled:opacity-50 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {quizQuestions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index <= currentQuestion ? "bg-purple-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={!selectedOption}
            className="group bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 px-8 py-3 text-lg font-semibold disabled:opacity-50 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            {currentQuestion === quizQuestions.length - 1 ? (
              <>
                <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Get My Results
              </>
            ) : (
              <>
                Next Question
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
