import { createClient } from '@supabase/supabase-js'
import { Product, ProductMatch, OutfitRecommendation, UserPreferences } from './product-types'
import { affiliatePartners, generateAffiliateLink } from './affiliate-config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export class ProductService {
  // Fetch products with filters
  static async getProducts(filters: {
    category?: string
    styleDNA?: string[]
    priceRange?: { min: number; max: number }
    region?: string
    inStock?: boolean
    limit?: number
    offset?: number
  }) {
    let query = supabase
      .from('products')
      .select('*')
      .eq('inStock', filters.inStock ?? true)

    if (filters.category) {
      query = query.eq('category', filters.category)
    }

    if (filters.styleDNA && filters.styleDNA.length > 0) {
      query = query.overlaps('styleDNA', filters.styleDNA)
    }

    if (filters.priceRange) {
      query = query
        .gte('price', filters.priceRange.min)
        .lte('price', filters.priceRange.max)
    }

    if (filters.region) {
      query = query.eq('region', filters.region)
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1)
    }

    const { data, error } = await query.order('rating', { ascending: false })

    if (error) throw error
    return data as Product[]
  }

  // AI-powered product matching
  static async getProductMatches(
    userPreferences: UserPreferences,
    occasion?: string,
    lifeScenario?: string
  ): Promise<ProductMatch[]> {
    const products = await this.getProducts({
      styleDNA: [userPreferences.styleDNA],
      priceRange: userPreferences.budget,
      region: userPreferences.region,
      limit: 50
    })

    return products.map(product => {
      const matchScore = this.calculateMatchScore(product, userPreferences, occasion, lifeScenario)
      const matchReasons = this.getMatchReasons(product, userPreferences, occasion)
      
      return {
        product,
        matchScore,
        matchReasons,
        alternatives: [] // Would be populated with similar products
      }
    }).sort((a, b) => b.matchScore - a.matchScore)
  }

  // Generate outfit recommendations
  static async generateOutfitRecommendation(
    userPreferences: UserPreferences,
    occasion: string,
    lifeScenario?: string
  ): Promise<OutfitRecommendation[]> {
    const productMatches = await this.getProductMatches(userPreferences, occasion, lifeScenario)
    
    // Group products by category
    const productsByCategory = productMatches.reduce((acc, match) => {
      const category = match.product.category
      if (!acc[category]) acc[category] = []
      acc[category].push(match)
      return acc
    }, {} as Record<string, ProductMatch[]>)

    // Generate outfit combinations
    const outfits: OutfitRecommendation[] = []
    
    // Example outfit generation logic (simplified)
    if (occasion === 'professional') {
      const blazers = productsByCategory['outerwear']?.slice(0, 2) || []
      const blouses = productsByCategory['tops']?.slice(0, 3) || []
      const pants = productsByCategory['bottoms']?.slice(0, 2) || []
      const shoes = productsByCategory['shoes']?.slice(0, 2) || []

      blazers.forEach((blazer, i) => {
        blouses.forEach((blouse, j) => {
          pants.forEach((pant, k) => {
            shoes.forEach((shoe, l) => {
              const items = [
                { product: blazer.product, category: 'outerwear' as const, essential: true },
                { product: blouse.product, category: 'top' as const, essential: true },
                { product: pant.product, category: 'bottom' as const, essential: true },
                { product: shoe.product, category: 'shoes' as const, essential: true }
              ]

              const totalPrice = items.reduce((sum, item) => sum + item.product.price, 0)
              const avgMatchScore = items.reduce((sum, item) => {
                const match = productMatches.find(m => m.product.id === item.product.id)
                return sum + (match?.matchScore || 0)
              }, 0) / items.length

              if (totalPrice <= userPreferences.budget.max && avgMatchScore > 0.7) {
                outfits.push({
                  id: `outfit_${i}_${j}_${k}_${l}`,
                  name: `Professional Power Look ${outfits.length + 1}`,
                  description: 'Commanding presence for the boardroom',
                  occasion,
                  totalPrice,
                  currency: userPreferences.budget.currency,
                  items,
                  styleDNA: [userPreferences.styleDNA],
                  confidence: avgMatchScore,
                  lifeScenario
                })
              }
            })
          })
        })
      })
    }

    return outfits.slice(0, 5) // Return top 5 outfits
  }

  // Calculate match score for AI recommendations
  private static calculateMatchScore(
    product: Product,
    preferences: UserPreferences,
    occasion?: string,
    lifeScenario?: string
  ): number {
    let score = 0

    // Style DNA match (40% weight)
    if (product.styleDNA.includes(preferences.styleDNA)) {
      score += 0.4
    }

    // Price match (25% weight)
    if (product.price >= preferences.budget.min && product.price <= preferences.budget.max) {
      score += 0.25
    } else if (product.price < preferences.budget.min) {
      score += 0.15 // Still good if under budget
    }

    // Brand preference (15% weight)
    if (preferences.preferredBrands.includes(product.brand)) {
      score += 0.15
    } else if (preferences.avoidedBrands.includes(product.brand)) {
      score -= 0.1
    }

    // Occasion match (10% weight)
    if (occasion && product.occasions.includes(occasion)) {
      score += 0.1
    }

    // Body type match (5% weight)
    if (product.bodyTypes.includes(preferences.bodyType)) {
      score += 0.05
    }

    // Rating bonus (5% weight)
    score += (product.rating / 5) * 0.05

    return Math.min(score, 1) // Cap at 1.0
  }

  private static getMatchReasons(
    product: Product,
    preferences: UserPreferences,
    occasion?: string
  ): string[] {
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

    if (occasion && product.occasions.includes(occasion)) {
      reasons.push(`Ideal for ${occasion} occasions`)
    }

    if (product.rating >= 4.5) {
      reasons.push('Highly rated by customers')
    }

    if (product.bodyTypes.includes(preferences.bodyType)) {
      reasons.push('Flattering for your body type')
    }

    return reasons
  }

  // Track affiliate clicks and conversions
  static async trackAffiliateClick(productId: string, partnerId: string, userId?: string) {
    const { error } = await supabase
      .from('affiliate_clicks')
      .insert({
        product_id: productId,
        partner_id: partnerId,
        user_id: userId,
        clicked_at: new Date().toISOString(),
        source: 'app'
      })

    if (error) console.error('Error tracking affiliate click:', error)
  }

  // Update product data from partner APIs
  static async syncProductData() {
    // This would be called by a scheduled function
    for (const partner of affiliatePartners) {
      try {
        // Fetch products from partner API
        const products = await this.fetchPartnerProducts(partner)
        
        // Normalize and update database
        await this.updateProductsInDatabase(products, partner.id)
      } catch (error) {
        console.error(`Error syncing products from ${partner.name}:`, error)
      }
    }
  }

  private static async fetchPartnerProducts(partner: any) {
    // Implementation would vary by partner API
    // This is a placeholder for the actual API integration
    return []
  }

  private static async updateProductsInDatabase(products: any[], partnerId: string) {
    // Batch update products in Supabase
    const { error } = await supabase
      .from('products')
      .upsert(products, { onConflict: 'partner_product_id,partner_id' })

    if (error) throw error
  }
}
