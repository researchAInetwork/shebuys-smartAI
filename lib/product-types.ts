export interface Product {
  id: string
  name: string
  brand: string
  description: string
  price: number
  originalPrice?: number
  currency: string
  images: string[]
  colors: string[]
  sizes: string[]
  category: string
  subcategory: string
  tags: string[]
  partnerId: string
  partnerProductId: string
  productUrl: string
  affiliateUrl: string
  inStock: boolean
  stockCount?: number
  rating: number
  reviewCount: number
  styleDNA: string[]
  bodyTypes: string[]
  occasions: string[]
  seasons: string[]
  region: string
  shippingInfo: string
  returnPolicy: string
  lastUpdated: Date
  isSponsored?: boolean
  sponsorshipTier?: 'premium' | 'featured' | 'standard'
}

export interface ProductMatch {
  product: Product
  matchScore: number
  matchReasons: string[]
  alternatives: Product[]
}

export interface OutfitRecommendation {
  id: string
  name: string
  description: string
  occasion: string
  totalPrice: number
  currency: string
  items: {
    product: Product
    category: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessories'
    essential: boolean
  }[]
  styleDNA: string[]
  confidence: number
  lifeScenario?: string
}

export interface UserPreferences {
  styleDNA: string
  bodyType: string
  skinTone: string
  culturalStyle: string
  budget: {
    min: number
    max: number
    currency: string
  }
  sizes: {
    tops: string
    bottoms: string
    dresses: string
    shoes: string
  }
  preferredBrands: string[]
  avoidedBrands: string[]
  region: string
  occasions: string[]
  colorPreferences: string[]
  sustainabilityPreference: 'high' | 'medium' | 'low'
}

export interface WishlistItem {
  id: string
  userId: string
  product: Product
  addedAt: Date
  priceAlertEnabled: boolean
  targetPrice?: number
  notes?: string
}

export interface PriceAlert {
  id: string
  userId: string
  productId: string
  targetPrice: number
  currentPrice: number
  isActive: boolean
  createdAt: Date
  triggeredAt?: Date
}
