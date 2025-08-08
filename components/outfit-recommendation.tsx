"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Heart, Share2, Star, Sparkles, TrendingUp } from 'lucide-react'
import Image from "next/image"
import { OutfitRecommendation } from "@/lib/product-types"
import { affiliatePartners, generateAffiliateLink } from "@/lib/affiliate-config"
import { FirebaseProductService } from "@/lib/firebase-product-service"
import ProductCard from "./product-card"
import ProductQuickView from "./product-quick-view"

interface OutfitRecommendationProps {
  outfit: OutfitRecommendation
  onAddAllToCart?: (outfit: OutfitRecommendation) => void
  showIndividualProducts?: boolean
}

export default function OutfitRecommendationCard({
  outfit,
  onAddAllToCart,
  showIndividualProducts = true
}: OutfitRecommendationProps) {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const essentialItems = outfit.items.filter(item => item.essential)
  const optionalItems = outfit.items.filter(item => !item.essential)
  const confidenceColor = outfit.confidence >= 0.8 ? 'text-green-600' : outfit.confidence >= 0.6 ? 'text-yellow-600' : 'text-orange-600'

  const handleAddAllToCart = async () => {
    // Track all affiliate clicks
    for (const item of outfit.items) {
      await FirebaseProductService.trackAffiliateClick(item.product.id, item.product.partnerId)
    }

    // Open all affiliate links
    outfit.items.forEach(item => {
      const partner = affiliatePartners.find(p => p.id === item.product.partnerId)
      if (partner) {
        const affiliateUrl = generateAffiliateLink(partner, item.product.productUrl, {
          medium: 'outfit_recommendation',
          campaign: 'add_all_to_cart',
          content: outfit.id
        })
        window.open(affiliateUrl, '_blank')
      }
    })

    if (onAddAllToCart) {
      onAddAllToCart(outfit)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: outfit.name,
        text: `Check out this amazing outfit: ${outfit.name}! Perfect for ${outfit.occasion}.`,
        url: window.location.href
      })
    }
  }

  const handleProductQuickView = (product: any) => {
    setSelectedProduct(product)
    setIsQuickViewOpen(true)
  }

  return (
    <>
      <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-gradient-to-r from-purple-500 to-rose-500 text-white">
                  {outfit.occasion.toUpperCase()}
                </Badge>
                {outfit.lifeScenario && (
                  <Badge variant="outline" className="border-purple-300 text-purple-700 dark:text-purple-300">
                    {outfit.lifeScenario}
                  </Badge>
                )}
              </div>
              
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {outfit.name}
              </CardTitle>
              
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {outfit.description}
              </p>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Sparkles className={`w-5 h-5 ${confidenceColor}`} />
                  <span className={`font-semibold ${confidenceColor}`}>
                    {Math.round(outfit.confidence * 100)}% Match
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {outfit.currency === 'USD' ? '$' : outfit.currency === 'EUR' ? '€' : outfit.currency === 'GBP' ? '£' : ''}{outfit.totalPrice}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">total</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`rounded-full ${isWishlisted ? 'text-red-500' : 'text-gray-500'}`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="rounded-full text-gray-500"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Outfit Preview Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {outfit.items.slice(0, 4).map((item, index) => (
              <div key={index} className="relative group cursor-pointer" onClick={() => handleProductQuickView(item.product)}>
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-transparent group-hover:border-purple-300 transition-colors">
                  <Image
                    src={item.product.images[0] || "/placeholder.svg?height=150&width=150&text=Product"}
                    alt={item.product.name}
                    width={150}
                    height={150}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                <div className="absolute top-2 left-2">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${item.essential ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {item.category}
                  </Badge>
                </div>

                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.product.currency === 'USD' ? '$' : item.product.currency === 'EUR' ? '€' : item.product.currency === 'GBP' ? '£' : ''}{item.product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Essential vs Optional Items */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                Essential Items ({essentialItems.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {essentialItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white/60 dark:bg-gray-700/60 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">{item.product.name}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.product.currency === 'USD' ? '$' : item.product.currency === 'EUR' ? '€' : item.product.currency === 'GBP' ? '£' : ''}{item.product.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {optionalItems.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  Optional Upgrades ({optionalItems.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {optionalItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">{item.product.name}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {item.product.currency === 'USD' ? '$' : item.product.currency === 'EUR' ? '€' : item.product.currency === 'GBP' ? '£' : ''}{item.product.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleAddAllToCart}
              className="flex-1 bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-semibold py-3 text-lg"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Shop Complete Look
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowIndividualProducts(!showIndividualProducts)}
              className="px-6"
            >
              {showIndividualProducts ? 'Hide' : 'Show'} Items
            </Button>
          </div>

          {/* Individual Product Cards */}
          {showIndividualProducts && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Individual Items</h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {outfit.items.map((item, index) => (
                  <ProductCard
                    key={index}
                    product={item.product}
                    onQuickView={handleProductQuickView}
                    trackingData={{
                      medium: 'outfit_recommendation',
                      campaign: 'individual_item',
                      content: outfit.id
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Commission Disclosure */}
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              💡 This outfit includes items from multiple partner stores. We earn small commissions that help keep SheBuys Smart free while you discover amazing fashion!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Product Quick View Modal */}
      <ProductQuickView
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false)
          setSelectedProduct(null)
        }}
      />
    </>
  )
}
