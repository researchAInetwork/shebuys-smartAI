"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, AlertTriangle, Heart, Volume2, VolumeX, Sparkles } from "lucide-react"

interface BudgetData {
  dailyLimit: number
  spent: number
  remaining: number
  funMoney: number
  weeklyGoal: number
  monthlyGoal: number
}

const voicePersonalities = [
  { id: "calm", name: "Calm & Zen", emoji: "🧘‍♀️", description: "Peaceful and mindful guidance" },
  { id: "hype", name: "Hype Bestie", emoji: "🎉", description: "Energetic and motivational" },
  { id: "motherly", name: "Motherly Love", emoji: "🤱", description: "Caring and protective advice" },
  { id: "expert", name: "Financial Expert", emoji: "💼", description: "Professional and analytical" },
]

export default function BudgetWhisperer() {
  const [budgetData, setBudgetData] = useState<BudgetData>({
    dailyLimit: 50,
    spent: 32,
    remaining: 18,
    funMoney: 25,
    weeklyGoal: 200,
    monthlyGoal: 800,
  })

  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState("calm")
  const [showOverspendAlert, setShowOverspendAlert] = useState(false)
  const [dailyTip, setDailyTip] = useState("")

  const spentPercentage = (budgetData.spent / budgetData.dailyLimit) * 100
  const weeklyProgress = (budgetData.spent / budgetData.weeklyGoal) * 100 * 7 // Approximate weekly progress

  const tips = [
    "💡 Try the 24-hour rule: Wait a day before buying non-essentials!",
    "🌟 You're doing amazing! Small savings add up to big dreams.",
    "💎 Quality over quantity - invest in pieces you'll love forever.",
    "🎯 Set a 'fun fund' for guilt-free splurges within your budget.",
    "📱 Use price comparison apps before making purchases.",
  ]

  useEffect(() => {
    // Set daily tip
    const randomTip = tips[Math.floor(Math.random() * tips.length)]
    setDailyTip(randomTip)

    // Check for overspending
    if (spentPercentage > 80) {
      setShowOverspendAlert(true)
    }
  }, [spentPercentage])

  const speakMessage = (message: string) => {
    if (voiceEnabled && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.rate = 0.9
      utterance.pitch = 1.1
      speechSynthesis.speak(utterance)
    }
  }

  const handleOverspendWarning = () => {
    const messages = {
      calm: "Hey love, you're getting close to your daily limit. Let's take a mindful pause and consider if this purchase aligns with your goals. 🧘‍♀️",
      hype: "Whoa bestie! You're about to go over budget! But don't worry, we got this! Let me show you some amazing alternatives! 🎉",
      motherly:
        "Sweetheart, I'm here to help you stay on track. You're so close to your limit today. Let's find a smarter way to get what you want. 💕",
      expert:
        "Alert: You're approaching 80% of your daily budget allocation. I recommend reviewing your priorities and considering alternatives. 📊",
    }

    const message = messages[selectedVoice as keyof typeof messages]
    speakMessage(message)
    setShowOverspendAlert(false)
  }

  const getBudgetStatus = () => {
    if (spentPercentage < 50) return { color: "text-green-600", status: "Great job! 🌟", bg: "bg-green-50" }
    if (spentPercentage < 80) return { color: "text-yellow-600", status: "On track 👍", bg: "bg-yellow-50" }
    return { color: "text-red-600", status: "Careful! ⚠️", bg: "bg-red-50" }
  }

  const budgetStatus = getBudgetStatus()

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <DollarSign className="w-6 h-6 text-blue-600 animate-pulse" />
            Daily Budget Whisperer
          </CardTitle>
          <p className="text-gray-600">Your personal AI financial bestie, here to keep you on track! 💕</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Voice Settings */}
          <Card className="border-0 shadow-sm bg-white/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Voice Assistant</h3>
                <Button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  size="sm"
                  variant={voiceEnabled ? "default" : "outline"}
                  className={voiceEnabled ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
                  {voiceEnabled ? "Voice On" : "Voice Off"}
                </Button>
              </div>

              {voiceEnabled && (
                <div className="grid grid-cols-2 gap-2">
                  {voicePersonalities.map((voice) => (
                    <Button
                      key={voice.id}
                      onClick={() => setSelectedVoice(voice.id)}
                      size="sm"
                      variant={selectedVoice === voice.id ? "default" : "outline"}
                      className={`text-left justify-start ${
                        selectedVoice === voice.id ? "bg-blue-600 hover:bg-blue-700" : ""
                      }`}
                    >
                      <span className="mr-2">{voice.emoji}</span>
                      <div>
                        <div className="font-medium text-xs">{voice.name}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Overspend Alert */}
          {showOverspendAlert && (
            <Card className="border-0 shadow-lg bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-6 h-6 animate-bounce" />
                  <h3 className="font-bold text-lg">Gentle Reminder, Beautiful! 💕</h3>
                </div>
                <p className="mb-4">You're about to exceed your daily budget. Let me help you find smarter options!</p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleOverspendWarning}
                    className="bg-white text-red-600 hover:bg-gray-100 font-semibold"
                  >
                    Get Smart Alternatives
                  </Button>
                  <Button
                    onClick={() => setShowOverspendAlert(false)}
                    variant="outline"
                    className="border-white text-white hover:bg-white/20"
                  >
                    I'll Be Careful
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Daily Budget Overview */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className={`border-0 shadow-lg ${budgetStatus.bg}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Today's Budget</h3>
                  <Badge className={`${budgetStatus.color} bg-transparent border-current`}>{budgetStatus.status}</Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Spent</span>
                    <span className="font-bold text-lg">${budgetData.spent}</span>
                  </div>
                  <Progress value={spentPercentage} className="h-3" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining: ${budgetData.remaining}</span>
                    <span className="text-gray-600">Limit: ${budgetData.dailyLimit}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Fun Money</h3>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">${budgetData.funMoney}</div>
                  <p className="text-sm text-gray-600">Available for guilt-free treats! 🎉</p>
                  <Button
                    size="sm"
                    className="mt-3 bg-green-600 hover:bg-green-700"
                    onClick={() => speakMessage("You have $25 in fun money! Go treat yourself, you deserve it!")}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Treat Yourself!
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Progress */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Weekly Progress</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">This Week</span>
                  <span className="font-medium">{weeklyProgress.toFixed(1)}% of goal</span>
                </div>
                <Progress value={weeklyProgress} className="h-2" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Goal: ${budgetData.weeklyGoal}/week</span>
                  <span>Monthly: ${budgetData.monthlyGoal}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Tip */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-100 to-rose-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
                <h3 className="font-semibold text-gray-900">Today's Money Wisdom</h3>
              </div>
              <p className="text-gray-700 mb-4">{dailyTip}</p>
              <Button size="sm" onClick={() => speakMessage(dailyTip)} className="bg-purple-600 hover:bg-purple-700">
                <Volume2 className="w-4 h-4 mr-2" />
                Read Aloud
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              className="h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex flex-col items-center justify-center"
              onClick={() => speakMessage("Let's review your spending patterns and find ways to save more money!")}
            >
              <TrendingUp className="w-5 h-5 mb-1" />
              <span className="text-sm">Spending Analysis</span>
            </Button>

            <Button
              className="h-16 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex flex-col items-center justify-center"
              onClick={() => speakMessage("Great job staying within budget! You're building amazing financial habits!")}
            >
              <Heart className="w-5 h-5 mb-1" />
              <span className="text-sm">Celebrate Progress</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
