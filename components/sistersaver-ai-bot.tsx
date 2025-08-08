"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Send, Volume2, VolumeX, Heart, DollarSign, AlertTriangle, Sparkles } from "lucide-react"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
  mood?: "supportive" | "warning" | "celebration" | "analytical"
}

const botPersonalities = [
  { id: "calm", name: "Zen Sister", emoji: "🧘‍♀️", color: "bg-blue-100 text-blue-700" },
  { id: "hype", name: "Hype Bestie", emoji: "🎉", color: "bg-pink-100 text-pink-700" },
  { id: "motherly", name: "Mama Bear", emoji: "🤱", color: "bg-green-100 text-green-700" },
  { id: "expert", name: "Money Guru", emoji: "💼", color: "bg-purple-100 text-purple-700" },
]

const quickActions = [
  { text: "Check my spending today", action: "spending_check" },
  { text: "Should I buy this?", action: "purchase_advice" },
  { text: "Find me alternatives", action: "find_alternatives" },
  { text: "Set a savings goal", action: "set_goal" },
]

export default function SisterSaverAIBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey beautiful! 💕 I'm your SisterSaver AI - your financial bestie who's here 24/7 to help you make smart money moves. What's on your mind today?",
      sender: "bot",
      timestamp: new Date(),
      mood: "supportive",
    },
  ])
  const [inputText, setInputText] = useState("")
  const [selectedPersonality, setSelectedPersonality] = useState("calm")
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [emotionalState, setEmotionalState] = useState<"neutral" | "impulse" | "stressed" | "excited">("neutral")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const speakMessage = (text: string) => {
    if (voiceEnabled && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.1
      speechSynthesis.speak(utterance)
    }
  }

  const detectEmotionalState = (text: string) => {
    const lowerText = text.toLowerCase()
    if (lowerText.includes("need") || lowerText.includes("want") || lowerText.includes("buy now")) {
      return "impulse"
    }
    if (lowerText.includes("stressed") || lowerText.includes("worried") || lowerText.includes("broke")) {
      return "stressed"
    }
    if (lowerText.includes("excited") || lowerText.includes("love") || lowerText.includes("amazing")) {
      return "excited"
    }
    return "neutral"
  }

  const generateBotResponse = (userMessage: string, personality: string, emotion: string) => {
    const responses = {
      calm: {
        impulse:
          "I hear you wanting that item, love. Let's take a mindful pause together. Have you considered the 24-hour rule? Sometimes our desires shift when we give them space to breathe. 🧘‍♀️",
        stressed:
          "I can sense you're feeling overwhelmed about money right now. That's completely normal, and you're not alone. Let's break this down into small, manageable steps together. 💙",
        excited:
          "Your excitement is beautiful! Let's channel that energy into making a choice that aligns with your values and goals. What matters most to you about this purchase? ✨",
        neutral:
          "I'm here to support whatever you need. Whether it's budgeting advice, spending analysis, or just someone to talk through your financial thoughts with. 🌸",
      },
      hype: {
        impulse:
          "Okay bestie, I see you eyeing that purchase! 👀 But before we go there, let's make sure it's a SMART move that future you will thank us for! What's your budget looking like today? 🎯",
        stressed:
          "Hey hey, we're going to turn this stress into SUCCESS! 💪 Money worries are temporary, but the skills we build together are forever! Let's make a plan that gets you feeling confident again! 🚀",
        excited:
          "YES QUEEN! I love your energy! 🔥 Let's make sure this excitement leads to a purchase that makes you feel amazing AND keeps your finances fabulous! Tell me more! 💖",
        neutral:
          "What's good, beautiful?! Ready to make some money moves that'll have you feeling like the financial goddess you are? I'm here for ALL of it! 🌟",
      },
      motherly: {
        impulse:
          "Oh sweetheart, I understand that feeling of wanting something right now. But mama's here to remind you that the best purchases are the ones we think through. Let's talk about what you really need, okay? 💕",
        stressed:
          "Baby girl, come here. Money stress is hard, but you're stronger than you know. We're going to figure this out together, step by step. You don't have to carry this alone. 🤗",
        excited:
          "I love seeing you happy, honey! Your joy is precious to me. Let's make sure this purchase brings you lasting happiness, not just a moment of excitement. What's your heart telling you? 💝",
        neutral:
          "Hello my dear! How are you feeling today? Remember, I'm always here to help you make choices that take care of both your present and future self. 🌺",
      },
      expert: {
        impulse:
          "I'm detecting impulse buying patterns in your request. Let's analyze this systematically: What's your current budget allocation? Have you compared alternatives? What's the opportunity cost? 📊",
        stressed:
          "Financial stress is a common experience that affects decision-making. Let's implement evidence-based strategies to regain control: budgeting, emergency fund building, and debt management. 💼",
        excited:
          "Positive emotions can lead to increased spending. While celebration is important, let's ensure this aligns with your financial goals and doesn't compromise your long-term strategy. 📈",
        neutral:
          "Ready to optimize your financial decisions? I can provide data-driven insights, spending analysis, and strategic recommendations based on your patterns and goals. 🎯",
      },
    }

    return (
      responses[personality as keyof typeof responses][emotion as keyof typeof responses.calm] ||
      responses[personality as keyof typeof responses].neutral
    )
  }

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    const emotion = detectEmotionalState(inputText)
    setEmotionalState(emotion)

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsTyping(true)

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = generateBotResponse(inputText, selectedPersonality, emotion)
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
        mood: emotion === "impulse" ? "warning" : emotion === "excited" ? "celebration" : "supportive",
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
      speakMessage(botResponse)
    }, 1500)
  }

  const handleQuickAction = (action: string) => {
    const actionResponses = {
      spending_check:
        "Let me check your spending for today... 📊 You've spent $32 out of your $50 daily budget. You're doing great! You have $18 left for the day. Want to see where your money went?",
      purchase_advice:
        "I'd love to help you decide! Tell me about the item you're considering. What is it, how much does it cost, and what's making you want it? 🤔",
      find_alternatives:
        "Smart thinking! I'm excellent at finding alternatives that give you the same satisfaction for less money. What type of item are you looking for? 🔍",
      set_goal:
        "Goal setting is my favorite! 🎯 What would you like to save for? A vacation, emergency fund, new wardrobe, or something else? Let's make it happen together!",
    }

    const response = actionResponses[action as keyof typeof actionResponses]
    const botMessage: Message = {
      id: Date.now(),
      text: response,
      sender: "bot",
      timestamp: new Date(),
      mood: "supportive",
    }

    setMessages((prev) => [...prev, botMessage])
    speakMessage(response)
  }

  const getMoodIcon = (mood?: string) => {
    switch (mood) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "celebration":
        return <Sparkles className="w-4 h-4 text-purple-600" />
      case "analytical":
        return <DollarSign className="w-4 h-4 text-blue-600" />
      default:
        return <Heart className="w-4 h-4 text-pink-600" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-pink-50 to-purple-50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <MessageCircle className="w-6 h-6 text-pink-600 animate-pulse" />
            SisterSaver AI Bot
          </CardTitle>
          <p className="text-gray-600">Your 24/7 financial bestie who keeps it real with love! 💕</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personality & Voice Settings */}
          <Card className="border-0 shadow-sm bg-white/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Bot Personality</h3>
                <Button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  size="sm"
                  variant={voiceEnabled ? "default" : "outline"}
                  className={voiceEnabled ? "bg-pink-600 hover:bg-pink-700" : ""}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
                  Voice {voiceEnabled ? "On" : "Off"}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {botPersonalities.map((personality) => (
                  <Button
                    key={personality.id}
                    onClick={() => setSelectedPersonality(personality.id)}
                    size="sm"
                    variant={selectedPersonality === personality.id ? "default" : "outline"}
                    className={`text-left justify-start ${
                      selectedPersonality === personality.id ? "bg-pink-600 hover:bg-pink-700" : ""
                    }`}
                  >
                    <span className="mr-2">{personality.emoji}</span>
                    <span className="text-xs">{personality.name}</span>
                  </Button>
                ))}
              </div>

              {/* Emotional State Indicator */}
              <div className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      emotionalState === "impulse"
                        ? "bg-red-500 animate-pulse"
                        : emotionalState === "stressed"
                          ? "bg-yellow-500"
                          : emotionalState === "excited"
                            ? "bg-green-500"
                            : "bg-blue-500"
                    }`}
                  ></div>
                  <span className="text-sm font-medium">
                    Mood:{" "}
                    {emotionalState === "impulse"
                      ? "Impulse Alert 🚨"
                      : emotionalState === "stressed"
                        ? "Needs Support 🤗"
                        : emotionalState === "excited"
                          ? "Excited Energy ⚡"
                          : "Balanced 😌"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat Messages */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender === "bot" && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32&text=AI" />
                        <AvatarFallback className="bg-pink-500 text-white text-xs">AI</AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          : "bg-white shadow-md border"
                      }`}
                    >
                      {message.sender === "bot" && message.mood && (
                        <div className="flex items-center gap-1 mb-2">
                          {getMoodIcon(message.mood)}
                          <Badge variant="secondary" className="text-xs">
                            {botPersonalities.find((p) => p.id === selectedPersonality)?.name}
                          </Badge>
                        </div>
                      )}
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-2 ${message.sender === "user" ? "text-purple-100" : "text-gray-500"}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>

                    {message.sender === "user" && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32&text=You" />
                        <AvatarFallback className="bg-purple-500 text-white text-xs">You</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32&text=AI" />
                      <AvatarFallback className="bg-pink-500 text-white text-xs">AI</AvatarFallback>
                    </Avatar>
                    <div className="bg-white shadow-md border px-4 py-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex flex-wrap gap-2 mb-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      onClick={() => handleQuickAction(action.action)}
                      size="sm"
                      variant="outline"
                      className="text-xs border-2 border-pink-200 text-pink-700 hover:bg-pink-50"
                    >
                      {action.text}
                    </Button>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask me anything about money, spending, or saving..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="border-2 focus:border-pink-300"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
