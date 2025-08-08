"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag, Star, ExternalLink, Eye, Share2, TrendingUp } from 'lucide-react'
import Image from "next/image"
import { Product } from "@/lib/product-types"
import { affiliatePartners, generateAffiliateLink } from "@/lib/affiliate-config"
import { FirebaseProductService } from "@/lib/firebase-product-service"

interface ProductCardProps {
  product: Product
  showQuickView?: boolean
  showWishlist?: boolean
  onQuickView?: (product: Product) => void
  onAddToWishlist?: (product: Product) => void
  trackingData?: {
    medium?: string
    campaign?: string
    content?: string
  }
}

export default function ProductCard({
  product,
  showQuickView = true,
  showWishlist = true,
  onQuickView,
  onAddToWishlist,
  trackingData
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const partner = affiliatePartners.find(p => p.id === product.partnerId)
  const discountPercentage = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  const handleAffiliateClick = async () => {
    if (partner) {
      await FirebaseProductService.trackAffiliateClick(product.id, product.partnerId)
      
      const affiliateUrl = generateAffiliateLink(partner, product.productUrl, {
        medium: trackingData?.medium || 'product_card',
        campaign: trackingData?.campaign || 'product_recommendation',
        content: trackingData?.content || 'buy_now'
      })
      
      window.open(affiliateUrl, '_blank')
    }
  }

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted)
    if (onAddToWishlist) {
      onAddToWishlist(product)
    }
  }

  const handleQuickView = () => {
    if (onQuickView) {
      onQuickView(product)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: `Check out this ${product.name} from ${product.brand}!`,
        url: window.location.href
      })
    }
  }

  return (
    <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white dark:bg-gray-800 hover:scale-105">
      <div className="relative">
        {/* Product Image */}
        <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Image
            src={product.images[0] || "/placeholder.svg?height=256&width=256&text=Product"}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 animate-pulse" />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discountPercentage > 0 && (
              <Badge className="bg-red-500 text-white font-bold animate-pulse">
                {discountPercentage}% OFF
              </Badge>
            )}
            {product.isSponsored && (
              <Badge className="bg-gradient-to-r from-purple-500 to-rose-500 text-white font-bold">
                <TrendingUp className="w-3 h-3 mr-1" />
                FEATURED
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="secondary" className="bg-gray-500 text-white">
                OUT OF STOCK
              </Badge>
            )}
          </div>

          {/* Partner Logo */}
          {partner && (
            <div className="absolute top-3 right-3">
              <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
                <Image
                  src={partner.logo || "/placeholder.svg?height=24&width=24&text=Logo"}
                  alt={partner.name}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {showWishlist && (
              <Button
                size="sm"
                variant="secondary"
                className={`rounded-full w-10 h-10 p-0 ${
                  isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600'
                }`}
                onClick={handleWishlistToggle}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
            )}
            
            {showQuickView && (
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full w-10 h-10 p-0 bg-white/90 text-gray-600"
                onClick={handleQuickView}
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full w-10 h-10 p-0 bg-white/90 text-gray-600"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Brand and Name */}
        <div className="mb-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{product.brand}</p>
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {product.currency === 'USD' ? '$' : product.currency === 'EUR' ? '€' : product.currency === 'GBP' ? '£' : ''}{product.price}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
              {product.currency === 'USD' ? '$' : product.currency === 'EUR' ? '€' : product.currency === 'GBP' ? '£' : ''}{product.originalPrice}
            </span>
          )}
        </div>

        {/* Colors */}
        {product.colors.length > 0 && (
          <div className="flex gap-1 mb-3">
            {product.colors.slice(0, 4).map((color, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                {color}
              </Badge>
            ))}
            {product.colors.length > 4 && (
              <Badge variant="outline" className="text-xs px-2 py-1">
                +{product.colors.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Shipping Info */}
        {partner && (
          <p className="text-xs text-green-600 dark:text-green-400 mb-3 flex items-center gap-1">
            <span>📦</span>
            {partner.shippingInfo}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleAffiliateClick}
            disabled={!product.inStock}
            className="flex-1 bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            {product.inStock ? 'Buy Now' : 'Out of Stock'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleAffiliateClick}
            className="px-3"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        {/* Commission Info (for transparency) */}
        {partner && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
            We earn a small commission from {partner.name} at no extra cost to you
          </p>
        )}
      </CardContent>
    </Card>
  )
}
