"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Settings, Filter, Check, X, Heart, ShoppingBag, TrendingUp, Users, Zap, DollarSign, Calendar, Star, Gift, AlertTriangle, Info, CheckCircle } from 'lucide-react'

interface Notification {
  id: number
  type: "deal" | "trend" | "social" | "ai" | "budget" | "system"
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: "high" | "medium" | "low"
  actionUrl?: string
  image?: string
}

interface NotificationSettings {
  deals: boolean
  trends: boolean
  social: boolean
  ai: boolean
  budget: boolean
  system: boolean
  email: boolean
  push: boolean
  sms: boolean
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: "ai",
    title: "LifeMirror AI Ready! ✨",
    message: "Your CEO transformation projection is complete! See your future self and get your evolution plan.",
    timestamp: "2 minutes ago",
    read: false,
    priority: "high",
    actionUrl: "/lifemirror",
    image: "/placeholder.svg?height=60&width=60&text=AI"
  },
  {
    id: 2,
    type: "deal",
    title: "Flash Sale Alert! 🔥",
    message: "40% off designer blazers at Zara - perfect for your Style DNA! Sale ends in 2 hours.",
    timestamp: "15 minutes ago",
    read: false,
    priority: "high",
    actionUrl: "/shop",
    image: "/placeholder.svg?height=60&width=60&text=Sale"
  },
  {
    id: 3,
    type: "budget",
    title: "Budget Check-in 💰",
    message: "You're 80% through your daily budget. The Budget Whisperer suggests pausing before your next purchase.",
    timestamp: "1 hour ago",
    read: false,
    priority: "medium",
    actionUrl: "/ai-features"
  },
  {
    id: 4,
    type: "social",
    title: "Sarah liked your post ❤️",
    message: "Your LifeMirror transformation post got 50+ likes! The community loves your CEO vision.",
    timestamp: "2 hours ago",
    read: true,
    priority: "low",
    actionUrl: "/community"
  },
  {
    id: 5,
    type: "trend",
    title: "New Trend Alert 📈",
    message: "Oversized blazers are trending up 23%! Perfect match for your Chic Minimalist DNA.",
    timestamp: "3 hours ago",
    read: true,
    priority: "medium",
    actionUrl: "/trends"
  },
  {
    id: 6,
    type: "ai",
    title: "Smart Recommendation 🧠",
    message: "Based on your recent activity, the Visual AI Stylist found 3 perfect outfits under $100!",
    timestamp: "5 hours ago",
    read: true,
    priority: "medium",
    actionUrl: "/ai-features"
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState("all")
  const [settings, setSettings] = useState<NotificationSettings>({
    deals: true,
    trends: true,
    social: true,
    ai: true,
    budget: true,
    system: true,
    email: true,
    push: true,
    sms: false
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "deal":
        return <ShoppingBag className="w-5 h-5 text-green-600 dark:text-green-400" />
      case "trend":
        return <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      case "social":
        return <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      case "ai":
        return <Zap className="w-5 h-5 text-rose-600 dark:text-rose-400" />
      case "budget":
        return <DollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
      case "system":
        return <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      default:
        return <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50 dark:bg-red-900/20"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
      case "low":
        return "border-l-green-500 bg-green-50 dark:bg-green-900/20"
      default:
        return "border-l-gray-500 bg-gray-50 dark:bg-gray-900/20"
    }
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id))
  }

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "all") return true
    if (filter === "unread") return !notif.read
    return notif.type === filter
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Stay updated with your style journey and community</p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[300px] mx-auto">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            {/* Quick Actions */}
            <Card className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {unreadCount} unread notifications
                    </h3>
                    {unreadCount > 0 && (
                      <Button onClick={markAllAsRead} size="sm" variant="outline">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark all as read
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm"
                    >
                      <option value="all">All</option>
                      <option value="unread">Unread</option>
                      <option value="ai">AI Features</option>
                      <option value="deal">Deals</option>
                      <option value="trend">Trends</option>
                      <option value="social">Social</option>
                      <option value="budget">Budget</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications List */}
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <Card className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
                  <CardContent className="p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No notifications</h3>
                    <p className="text-gray-600 dark:text-gray-400">You're all caught up! Check back later for updates.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`glass-effect dark:bg-gray-800/50 dark:border-gray-700 border-l-4 ${getPriorityColor(notification.priority)} ${
                      !notification.read ? 'shadow-lg' : 'opacity-75'
                    } transition-all duration-300 hover:shadow-xl`}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          {notification.image ? (
                            <div className="w-12 h-12 rounded-lg overflow-hidden">
                              <img 
                                src={notification.image || "/placeholder.svg"} 
                                alt="Notification" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-rose-100 dark:from-purple-900/20 dark:to-rose-900/20 rounded-lg flex items-center justify-center">
                              {getNotificationIcon(notification.type)}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h4 className={`font-semibold ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs capitalize">
                                {notification.type}
                              </Badge>
                              <Badge 
                                className={`text-xs ${
                                  notification.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                                  notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                                  'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                }`}
                              >
                                {notification.priority}
                              </Badge>
                            </div>
                          </div>

                          <p className="text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {notification.timestamp}
                            </span>

                            <div className="flex items-center gap-2">
                              {notification.actionUrl && (
                                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700">
                                  View
                                </Button>
                              )}
                              {!notification.read && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="w-3 h-3" />
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => deleteNotification(notification.id)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose what notifications you'd like to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Notification Types</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white">AI Features</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">LifeMirror AI, Visual Stylist, and other AI updates</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.ai} 
                        onCheckedChange={(checked) => setSettings({...settings, ai: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white">Deals & Sales</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Flash sales, discounts, and personalized deals</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.deals} 
                        onCheckedChange={(checked) => setSettings({...settings, deals: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white">Trend Updates</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Fashion trends and style forecasts</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.trends} 
                        onCheckedChange={(checked) => setSettings({...settings, trends: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white">Social Activity</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Likes, comments, and community interactions</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.social} 
                        onCheckedChange={(checked) => setSettings({...settings, social: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white">Budget Alerts</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Spending reminders and budget warnings</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.budget} 
                        onCheckedChange={(checked) => setSettings({...settings, budget: checked})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Delivery Methods</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white">Push Notifications</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Instant notifications on your device</p>
                      </div>
                      <Switch 
                        checked={settings.push} 
                        onCheckedChange={(checked) => setSettings({...settings, push: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white">Email Notifications</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Weekly summaries and important updates</p>
                      </div>
                      <Switch 
                        checked={settings.email} 
                        onCheckedChange={(checked) => setSettings({...settings, email: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white">SMS Alerts</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Critical alerts via text message</p>
                      </div>
                      <Switch 
                        checked={settings.sms} 
                        onCheckedChange={(checked) => setSettings({...settings, sms: checked})}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
