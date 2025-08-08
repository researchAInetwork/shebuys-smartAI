"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Bell, TrendingDown, ShoppingBag, Trash2, Edit3 } from 'lucide-react'
import { WishlistItem, PriceAlert } from "@/lib/product-types"
import ProductCard from "./product-card"
import { FirebaseProductService } from "@/lib/firebase-product-service"
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/lib/firebase-config'

export default function WishlistManager() {
  const [user] = useAuthState(auth)
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAlert, setEditingAlert] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadWishlistData()
    }
  }, [user])

  const loadWishlistData = async () => {
    if (!user) return

    try {
      const wishlistData = await FirebaseProductService.getWishlist(user.uid)
      setWishlistItems(wishlistData || [])
    } catch (error) {
      console.error('Error loading wishlist data:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (itemId: string) => {
    try {
      await FirebaseProductService.removeFromWishlist(itemId)
      setWishlistItems(prev => prev.filter(item => item.id !== itemId))
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    }
  }

  const togglePriceAlert = async (itemId: string, enabled: boolean, targetPrice?: number) => {
    if (!user) return

    try {
      const item = wishlistItems.find(i => i.id === itemId)
      if (!item) return

      if (enabled && targetPrice) {
        await FirebaseProductService.createPriceAlert(user.uid, item.product.id, targetPrice)
      }

      // Update local state
      setWishlistItems(prev =>
        prev.map(i =>
          i.id === itemId
            ? { ...i, priceAlertEnabled: enabled, targetPrice }
            : i
        )
      )

      await loadWishlistData()
    } catch (error) {
      console.error('Error updating price alert:', error)
    }
  }

  const updateTargetPrice = async (itemId: string, targetPrice: number) => {
    await togglePriceAlert(itemId, true, targetPrice)
    setEditingAlert(null)
  }

  if (!user) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Sign in to view your wishlist
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create an account to save your favorite items and get price alerts!
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start adding items you love to keep track of them and get price alerts!
          </p>
          <Button className="bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Start Shopping
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Wishlist Header */}
      <Card className="bg-gradient-to-r from-purple-100 to-rose-100 dark:from-purple-900/20 dark:to-rose-900/20 border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Heart className="w-6 h-6 text-red-500" />
            Your Wishlist
            <Badge className="bg-purple-500 text-white ml-2">
              {wishlistItems.length} items
            </Badge>
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Track your favorite items and get notified when prices drop!
          </p>
        </CardHeader>
      </Card>

      {/* Active Price Alerts */}
      {priceAlerts.length > 0 && (
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <Bell className="w-5 h-5" />
              Active Price Alerts ({priceAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {priceAlerts.map((alert) => {
                const item = wishlistItems.find(i => i.product.id === alert.productId)
                if (!item) return null

                const savings = alert.currentPrice - alert.targetPrice
                const savingsPercentage = Math.round((savings / alert.currentPrice) * 100)

                return (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <TrendingDown className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.product.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Alert when price drops to ${alert.targetPrice} 
                          {savings > 0 && (
                            <span className="text-green-600 ml-2">
                              (Save ${savings.toFixed(2)} / {savingsPercentage}%)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Active
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wishlist Items */}
      <div className="space-y-4">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={item.product.images[0] || "/placeholder.svg?height=96&width=96&text=Product"}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{item.product.brand}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ${item.product.price}
                    </span>
                    {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                      <span className="text-gray-500 dark:text-gray-400 line-through">
                        ${item.product.originalPrice}
                      </span>
                    )}
                    {!item.product.inStock && (
                      <Badge variant="secondary" className="bg-red-100 text-red-700">
                        Out of Stock
                      </Badge>
                    )}
                  </div>

                  {/* Price Alert Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.priceAlertEnabled}
                        onCheckedChange={(enabled) => {
                          if (enabled) {
                            setEditingAlert(item.id)
                          } else {
                            togglePriceAlert(item.id, false)
                          }
                        }}
                      />
                      <Label className="text-sm">Price Alert</Label>
                    </div>

                    {(item.priceAlertEnabled || editingAlert === item.id) && (
                      <div className="flex items-center gap-2">
                        {editingAlert === item.id ? (
                          <div className="flex items-center gap-2">
                            <Label className="text-sm">Alert when price drops to:</Label>
                            <Input
                              type="number"
                              placeholder="Target price"
                              className="w-24 h-8"
                              defaultValue={item.targetPrice}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const target = parseFloat((e.target as HTMLInputElement).value)
                                  if (target > 0) {
                                    updateTargetPrice(item.id, target)
                                  }
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={() => {
                                const input = document.querySelector(`input[placeholder="Target price"]`) as HTMLInputElement
                                const target = parseFloat(input.value)
                                if (target > 0) {
                                  updateTargetPrice(item.id, target)
                                }
                              }}
                            >
                              Set
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Target: ${item.targetPrice}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingAlert(item.id)}
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {item.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      "{item.notes}"
                    </p>
                  )}

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Added {new Date(item.addedAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700"
                    disabled={!item.product.inStock}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {item.product.inStock ? 'Buy Now' : 'Out of Stock'}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
