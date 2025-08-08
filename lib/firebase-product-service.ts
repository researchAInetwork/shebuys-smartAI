import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  Timestamp 
} from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { db, functions } from './firebase-config'
import { Product, ProductMatch, OutfitRecommendation, UserPreferences } from './product-types'
import { affiliatePartners, generateAffiliateLink } from './affiliate-config'

export class FirebaseProductService {
  // Fetch products with filters
  static async getProducts(filters: {
    category?: string
    styleDNA?: string[]
    priceRange?: { min: number; max: number }
    region?: string
    inStock?: boolean
    limit?: number
    lastDoc?: any
  }) {
    let q = query(collection(db, 'products'))

    // Apply filters
    if (filters.inStock !== undefined) {
      q = query(q, where('inStock', '==', filters.inStock))
    }

    if (filters.category) {
      q = query(q, where('category', '==', filters.category))
    }

    if (filters.styleDNA && filters.styleDNA.length > 0) {
      q = query(q, where('styleDNA', 'array-contains-any', filters.styleDNA))
    }

    if (filters.priceRange) {
      q = query(q, where('price', '>=', filters.priceRange.min))
      q = query(q, where('price', '<=', filters.priceRange.max))
    }

    if (filters.region) {
      q = query(q, where('region', '==', filters.region))
    }

    // Add ordering and pagination
    q = query(q, orderBy('rating', 'desc'))

    if (filters.limit) {
      q = query(q, limit(filters.limit))
    }

    if (filters.lastDoc) {
      q = query(q, startAfter(filters.lastDoc))
    }

    const querySnapshot = await getDocs(q)
    const products: Product[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      products.push({
        id: doc.id,
        ...data,
        lastUpdated: data.lastUpdated.toDate()
      } as Product)
    })

    return products
  }

  // AI-powered product matching using GenkitAI
  static async getProductMatches(
    userPreferences: UserPreferences,
    occasion?: string,
    lifeScenario?: string
  ): Promise<ProductMatch[]> {
    const aiProductMatcher = httpsCallable(functions, 'aiProductMatcher')
    
    try {
      const result = await aiProductMatcher({
        userPreferences,
        occasion,
        lifeScenario
      })

      return result.data as ProductMatch[]
    } catch (error) {
      console.error('Error getting AI product matches:', error)
      
      // Fallback to basic matching
      const products = await this.getProducts({
        styleDNA: [userPreferences.styleDNA],
        priceRange: userPreferences.budget,
        region: userPreferences.region,
        limit: 20
      })

      return products.map(product => ({
        product,
        matchScore: this.calculateBasicMatchScore(product, userPreferences),
        matchReasons: this.getBasicMatchReasons(product, userPreferences),
        alternatives: []
      })).sort((a, b) => b.matchScore - a.matchScore)
    }
  }

  // Generate outfit recommendations using GenkitAI
  static async generateOutfitRecommendation(
    userPreferences: UserPreferences,
    occasion: string,
    lifeScenario?: string
  ): Promise<OutfitRecommendation[]> {
    const aiOutfitGenerator = httpsCallable(functions, 'aiOutfitGenerator')
    
    try {
      const result = await aiOutfitGenerator({
        userPreferences,
        occasion,
        lifeScenario
      })

      return result.data as OutfitRecommendation[]
    } catch (error) {
      console.error('Error generating AI outfit recommendations:', error)
      
      // Fallback to basic outfit generation
      return this.generateBasicOutfits(userPreferences, occasion, lifeScenario)
    }
  }

  // LifeMirror AI integration
  static async generateLifeMirrorProjection(
    userPreferences: UserPreferences,
    scenario: string,
    personalizationData: any
  ) {
    const lifeMirrorAI = httpsCallable(functions, 'lifeMirrorAI')
    
    try {
      const result = await lifeMirrorAI({
        userPreferences,
        scenario,
        personalizationData
      })

      return result.data
    } catch (error) {
      console.error('Error generating LifeMirror projection:', error)
      throw error
    }
  }

  // Track affiliate clicks
  static async trackAffiliateClick(productId: string, partnerId: string, userId?: string) {
    try {
      await addDoc(collection(db, 'affiliate_clicks'), {
        productId,
        partnerId,
        userId: userId || null,
        clickedAt: Timestamp.now(),
        source: 'app'
      })
    } catch (error) {
      console.error('Error tracking affiliate click:', error)
    }
  }

  // Wishlist management
  static async addToWishlist(userId: string, product: Product, notes?: string) {
    try {
      await addDoc(collection(db, 'wishlist_items'), {
        userId,
        productId: product.id,
        product,
        addedAt: Timestamp.now(),
        priceAlertEnabled: false,
        notes: notes || null
      })
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      throw error
    }
  }

  static async removeFromWishlist(wishlistItemId: string) {
    try {
      await deleteDoc(doc(db, 'wishlist_items', wishlistItemId))
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      throw error
    }
  }

  static async getWishlist(userId: string) {
    try {
      const q = query(
        collection(db, 'wishlist_items'),
        where('userId', '==', userId),
        orderBy('addedAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const wishlistItems: any[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        wishlistItems.push({
          id: doc.id,
          ...data,
          addedAt: data.addedAt.toDate()
        })
      })

      return wishlistItems
    } catch (error) {
      console.error('Error getting wishlist:', error)
      throw error
    }
  }

  // Price alerts
  static async createPriceAlert(userId: string, productId: string, targetPrice: number) {
    try {
      await addDoc(collection(db, 'price_alerts'), {
        userId,
        productId,
        targetPrice,
        currentPrice: 0, // Will be updated by cloud function
        isActive: true,
        createdAt: Timestamp.now()
      })
    } catch (error) {
      console.error('Error creating price alert:', error)
      throw error
    }
  }

  // Sync product data (called by Cloud Functions)
  static async syncProductData() {
    const syncProducts = httpsCallable(functions, 'syncProductData')
    
    try {
      await syncProducts()
    } catch (error) {
      console.error('Error syncing product data:', error)
      throw error
    }
  }

  // Basic fallback methods
  private static calculateBasicMatchScore(product: Product, preferences: UserPreferences): number {
    let score = 0

    // Style DNA match (40% weight)
    if (product.styleDNA.includes(preferences.styleDNA)) {
      score += 0.4
    }

    // Price match (25% weight)
    if (product.price >= preferences.budget.min && product.price <= preferences.budget.max) {
      score += 0.25
    } else if (product.price < preferences.budget.min) {
      score += 0.15
    }

    // Brand preference (15% weight)
    if (preferences.preferredBrands.includes(product.brand)) {
      score += 0.15
    } else if (preferences.avoidedBrands.includes(product.brand)) {
      score -= 0.1
    }

    // Body type match (10% weight)
    if (product.bodyTypes.includes(preferences.bodyType)) {
      score += 0.1
    }

    // Rating bonus (10% weight)
    score += (product.rating / 5) * 0.1

    return Math.min(score, 1)
  }

  private static getBasicMatchReasons(product: Product, preferences: UserPreferences): string[] {
    const reasons: string[] = []

    if (product.styleDNA.includes(preferences.styleDNA)) {
      reasons.push(`Perfect for your ${preferences.styleDNA} style`)
    }

    if (product.price <= preferences.budget.max) {
      reasons.push('Within your budget')
    }

    if (preferences.preferredBrands.includes(product.brand)) {
      reasons.push('From your favorite brand')
    }

    if (product.rating >= 4.5) {
      reasons.push('Highly rated by customers')
    }

    if (product.bodyTypes.includes(preferences.bodyType)) {
      reasons.push('Flattering for your body type')
    }

    return reasons
  }

  private static async generateBasicOutfits(
    userPreferences: UserPreferences,
    occasion: string,
    lifeScenario?: string
  ): Promise<OutfitRecommendation[]> {
    // Basic outfit generation logic as fallback
    const products = await this.getProducts({
      styleDNA: [userPreferences.styleDNA],
      priceRange: userPreferences.budget,
      region: userPreferences.region,
      limit: 20
    })

    // Simple outfit creation (this would be much more sophisticated in the AI version)
    const outfits: OutfitRecommendation[] = []
    
    if (products.length >= 3) {
      const outfit: OutfitRecommendation = {
        id: `basic_outfit_${Date.now()}`,
        name: `${occasion} Look`,
        description: `Perfect for ${occasion}`,
        occasion,
        totalPrice: products.slice(0, 3).reduce((sum, p) => sum + p.price, 0),
        currency: userPreferences.budget.currency,
        items: products.slice(0, 3).map((product, index) => ({
          product,
          category: ['top', 'bottom', 'shoes'][index] as any,
          essential: true
        })),
        styleDNA: [userPreferences.styleDNA],
        confidence: 0.7,
        lifeScenario
      }
      
      outfits.push(outfit)
    }

    return outfits
  }
}
