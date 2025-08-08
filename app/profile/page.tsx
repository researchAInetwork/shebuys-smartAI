"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import {
  User,
  Settings,
  Trophy,
  Heart,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Bell,
  Shield,
  Palette,
  Crown,
  Star,
  Camera,
  Edit3,
  Save,
} from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Sarah Johnson",
    email: "sarah@example.com",
    bio: "Fashion enthusiast who loves sustainable shopping and discovering unique styles!",
    location: "New York, NY",
    styleDNA: "Chic Minimalist",
    joinDate: "March 2024",
  })

  const achievements = [
    { id: 1, name: "Style Pioneer", description: "Completed Style DNA Quiz", icon: Palette, earned: true },
    {
      id: 2,
      name: "Smart Shopper",
      description: "Saved $500+ with AI recommendations",
      icon: DollarSign,
      earned: true,
    },
    { id: 3, name: "Trendsetter", description: "First to try 5 trending items", icon: TrendingUp, earned: true },
    { id: 4, name: "Community Star", description: "Received 100+ likes on posts", icon: Star, earned: false },
    { id: 5, name: "Eco Warrior", description: "Chose sustainable options 20 times", icon: Heart, earned: false },
    { id: 6, name: "Fashion Queen", description: "Complete 50 outfit challenges", icon: Crown, earned: false },
  ]

  const stats = [
    { label: "Total Savings", value: "$1,247", icon: DollarSign, color: "text-green-600 dark:text-green-400" },
    { label: "Items Purchased", value: "23", icon: ShoppingBag, color: "text-blue-600 dark:text-blue-400" },
    { label: "Outfits Created", value: "47", icon: Palette, color: "text-purple-600 dark:text-purple-400" },
    { label: "Community Points", value: "892", icon: Trophy, color: "text-yellow-600 dark:text-yellow-400" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 py-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Your Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account, preferences, and achievements</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Profile Card */}
            <Card className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src="/placeholder.svg?height=80&width=80&text=Sarah" />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-rose-500 text-white text-xl">
                          SJ
                        </AvatarFallback>
                      </Avatar>
                      <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
                      <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
                      <Badge className="mt-2 bg-gradient-to-r from-purple-500 to-rose-500 text-white">
                        {profile.styleDNA}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2"
                  >
                    {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                    {isEditing ? "Save" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">{profile.bio}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">📍 {profile.location}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">🗓️ Joined {profile.joinDate}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
                  <CardContent className="p-6 text-center">
                    <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Style Progress */}
            <Card className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Style Journey Progress
                </CardTitle>
                <CardDescription>Your fashion evolution this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Style Confidence</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Budget Optimization</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Trend Awareness</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Your Achievements
                </CardTitle>
                <CardDescription>Unlock badges by completing style challenges and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        achievement.earned
                          ? "border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <achievement.icon
                          className={`w-8 h-8 ${
                            achievement.earned
                              ? "text-purple-600 dark:text-purple-400"
                              : "text-gray-400 dark:text-gray-600"
                          }`}
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{achievement.name}</h3>
                          {achievement.earned && (
                            <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs">
                              Earned
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose what notifications you'd like to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="deal-alerts">Deal Alerts</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about personalized deals</p>
                  </div>
                  <Switch id="deal-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="trend-updates">Trend Updates</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Weekly fashion trend reports</p>
                  </div>
                  <Switch id="trend-updates" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="budget-reminders">Budget Reminders</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Monthly spending summaries</p>
                  </div>
                  <Switch id="budget-reminders" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="social-updates">Social Updates</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Community likes and comments</p>
                  </div>
                  <Switch id="social-updates" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Shopping Preferences
                </CardTitle>
                <CardDescription>Customize your shopping experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="budget-range">Monthly Budget Range</Label>
                  <Input id="budget-range" placeholder="$500" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="preferred-brands">Preferred Brands</Label>
                  <Input id="preferred-brands" placeholder="Zara, H&M, Uniqlo..." className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="size-preferences">Size Preferences</Label>
                  <Input id="size-preferences" placeholder="S, M (US 6-8)" className="mt-1" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="glass-effect dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>Manage your privacy settings and data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profile-visibility">Public Profile</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Make your profile visible to other users</p>
                  </div>
                  <Switch id="profile-visibility" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-sharing">Data Sharing</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Share anonymized data to improve AI recommendations
                    </p>
                  </div>
                  <Switch id="data-sharing" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="location-tracking">Location Services</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Enable location-based deals and recommendations
                    </p>
                  </div>
                  <Switch id="location-tracking" />
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="outline" className="w-full mb-2 bg-transparent">
                    Download My Data
                  </Button>
                  <Button variant="destructive" className="w-full">
                    Delete Account
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
