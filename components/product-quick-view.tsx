"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, ShoppingBag, Star, ExternalLink, Share2, Truck, RotateCcw, Shield } from 'lucide-react'
import Image from "next/image"
import { Product } from "@/lib/product-types"
import { affiliatePartners, generateAffiliateLink } from "@/lib/affiliate-config"
import { FirebaseProductService } from "@/lib/firebase-product-service"

interface ProductQuickViewProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export default function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [isWishlisted, setIsWishlisted] = useState(false)

  if (!product) return null

  const partner = affiliatePartners.find(p => p.id === product.partnerId)
  const discountPercentage = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  const handleAffiliateClick = async () => {
    if (partner) {
      await FirebaseProductService.trackAffiliateClick(product.id, product.partnerId)
      
      const affiliateUrl = generateAffiliateLink(partner, product.productUrl, {
        medium: 'quick_view',
        campaign: 'product_detail',
        content: 'buy_now'
      })
      
      window.open(affiliateUrl, '_blank')
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg?height=400&width=400&text=Product"}
                alt={product.name}
                fill
                className="object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discountPercentage > 0 && (
                  <Badge className="bg-red-500 text-white font-bold">
                    {discountPercentage}% OFF
                  </Badge>
                )}
                {product.isSponsored && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-rose-500 text-white font-bold">
                    FEATURED
                  </Badge>
                )}
              </div>
            </div>

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index 
                        ? 'border-purple-500' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg?height=64&width=64&text=Thumb"}
                      alt={`${product.name} ${index + 1}`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Brand and Rating */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">{product.brand}</p>
                {partner && (
                  <div className="flex items-center gap-2">
                    <Image
                      src={partner.logo || "/placeholder.svg?height=24&width=24&text=Logo"}
                      alt={partner.name}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{partner.name}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                </div>
                <span className="text-gray-500 dark:text-gray-400">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {product.currency === 'USD' ? '$' : product.currency === 'EUR' ? '€' : product.currency === 'GBP' ? '£' : ''}{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                  {product.currency === 'USD' ? '$' : product.currency === 'EUR' ? '€' : product.currency === 'GBP' ? '£' : ''}{product.originalPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Colors</h4>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedColor(color)}
                      className="text-sm"
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Sizes</h4>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className="text-sm min-w-[3rem]"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Shipping and Returns */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="w-5 h-5 text-green-600" />
                <span>{partner?.shippingInfo || 'Shipping information available at checkout'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="w-5 h-5 text-blue-600" />
                <span>{product.returnPolicy || 'Return policy varies by retailer'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-5 h-5 text-purple-600" />
                <span>Secure checkout with buyer protection</span>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button
                  onClick={handleAffiliateClick}
                  disabled={!product.inStock}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-semibold py-3 text-lg"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {product.inStock ? `Buy Now at ${partner?.name}` : 'Out of Stock'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`px-4 ${isWishlisted ? 'text-red-500 border-red-500' : ''}`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
                
                <Button variant="outline" onClick={handleShare} className="px-4">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={handleAffiliateClick}
                className="w-full text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View full details at {partner?.name}
              </Button>
            </div>

            {/* Commission Disclosure */}
            {partner && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                💡 We earn a small commission from {partner.name} when you make a purchase through our links. 
                This helps us keep SheBuys Smart free while supporting your style journey!
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
