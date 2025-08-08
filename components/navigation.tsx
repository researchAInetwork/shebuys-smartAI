"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { ShoppingBag, Menu, X, Sparkles, User, Zap, Bell, Crown, TrendingUp, MonitorIcon as Mirror } from 'lucide-react'
import { useCart } from "@/components/cart-provider"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const { totalItems } = useCart()

  return (
    <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform"
            >
              SheBuys Smart
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/lifemirror"
              className="group flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors relative"
            >
              <Mirror className="w-4 h-4 group-hover:animate-pulse" />
              LifeMirror AI
              <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-rose-500 to-purple-500 text-white text-xs animate-pulse">
                ✨
              </Badge>
            </Link>

            <Link
              href="/quiz"
              className="group flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
            >
              <Sparkles className="w-4 h-4 group-hover:animate-spin" />
              Style Quiz
            </Link>

            <Link
              href="/ai-features"
              className="group flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors relative"
            >
              <Zap className="w-4 h-4 group-hover:animate-pulse" />
              AI Features
              <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-rose-500 to-purple-500 text-white text-xs animate-pulse">
                NEW
              </Badge>
            </Link>

            <Link
              href="/shop"
              className="group flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
            >
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Shop
            </Link>

            <Link
              href="/trends"
              className="group flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
            >
              <TrendingUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Trends
            </Link>

            <Link
              href="/community"
              className="group flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
            >
              <Crown className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Community
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <Link href="/notifications" className="relative group">
              <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
              {notifications > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-rose-500 to-purple-500 text-white text-xs animate-pulse">
                  {notifications}
                </Badge>
              )}
            </Link>

            {/* Cart Icon */}
            <Link href="/cart" className="relative group">
              <ShoppingBag className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-rose-500 to-purple-500 text-white text-xs animate-pulse">
                  {totalItems}
                </Badge>
              )}
            </Link>

            {/* Profile */}
            <Link href="/profile" className="flex items-center gap-2 group">
              <Avatar className="w-8 h-8 group-hover:scale-110 transition-transform">
                <AvatarImage src="/placeholder.svg?height=32&width=32&text=You" />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-rose-500 text-white text-xs">
                  You
                </AvatarFallback>
              </Avatar>
            </Link>

            <Link href="/lifemirror">
              <Button className="bg-gradient-to-r from-rose-500 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:from-rose-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
                <Mirror className="w-4 h-4 mr-2" />
                See Future Self
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md transition-colors duration-300">
            <div className="flex flex-col space-y-4">
              <Link
                href="/lifemirror"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
              >
                <Mirror className="w-4 h-4" />
                LifeMirror AI
                <Badge className="bg-gradient-to-r from-rose-500 to-purple-500 text-white text-xs">✨</Badge>
              </Link>
              <Link
                href="/quiz"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Style Quiz
              </Link>
              <Link
                href="/ai-features"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
              >
                <Zap className="w-4 h-4" />
                AI Features
                <Badge className="bg-gradient-to-r from-rose-500 to-purple-500 text-white text-xs">NEW</Badge>
              </Link>
              <Link
                href="/shop"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop
              </Link>
              <Link
                href="/trends"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                Trends
              </Link>
              <Link
                href="/community"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
              >
                <Crown className="w-4 h-4" />
                Community
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
              <Link href="/lifemirror">
                <Button className="w-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-medium hover:from-rose-600 hover:to-purple-700 transition-all">
                  <Mirror className="w-4 h-4 mr-2" />
                  See Future Self
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
