import { httpsCallable } from 'firebase/functions'
import { functions } from './firebase-config'

export class GenkitAIService {
  // Daily Budget Whisperer AI
  static async getBudgetAdvice(userProfile: any, spendingHistory: any[]) {
    const budgetWhisperer = httpsCallable(functions, 'budgetWhispererAI')
    
    try {
      const result = await budgetWhisperer({
        userProfile,
        spendingHistory,
        currentDate: new Date().toISOString()
      })

      return result.data
    } catch (error) {
      console.error('Error getting budget advice:', error)
      throw error
    }
  }

  // SisterSaver AI Bot
  static async chatWithSisterSaver(message: string, conversationHistory: any[], userContext: any) {
    const sisterSaverBot = httpsCallable(functions, 'sisterSaverAI')
    
    try {
      const result = await sisterSaverBot({
        message,
        conversationHistory,
        userContext,
        timestamp: new Date().toISOString()
      })

      return result.data
    } catch (error) {
      console.error('Error chatting with SisterSaver:', error)
      throw error
    }
  }

  // Visual AI Personal Stylist
  static async analyzeOutfitImage(imageUrl: string, userPreferences: any) {
    const visualStylist = httpsCallable(functions, 'visualStylistAI')
    
    try {
      const result = await visualStylist({
        imageUrl,
        userPreferences,
        analysisType: 'outfit_analysis'
      })

      return result.data
    } catch (error) {
      console.error('Error analyzing outfit image:', error)
      throw error
    }
  }

  // Smart Trend Forecaster
  static async getTrendForecast(region: string, season: string, styleDNA: string) {
    const trendForecaster = httpsCallable(functions, 'trendForecasterAI')
    
    try {
      const result = await trendForecaster({
        region,
        season,
        styleDNA,
        forecastPeriod: '3_months'
      })

      return result.data
    } catch (error) {
      console.error('Error getting trend forecast:', error)
      throw error
    }
  }

  // GeoSmart Deal Radar
  static async findLocalDeals(location: any, userPreferences: any) {
    const dealRadar = httpsCallable(functions, 'geoSmartDealRadar')
    
    try {
      const result = await dealRadar({
        location,
        userPreferences,
        radius: 25, // miles
        dealTypes: ['sales', 'clearance', 'new_arrivals']
      })

      return result.data
    } catch (error) {
      console.error('Error finding local deals:', error)
      throw error
    }
  }

  // Social Buying Circles AI
  static async getSocialRecommendations(userId: string, friendsData: any[]) {
    const socialBuying = httpsCallable(functions, 'socialBuyingCirclesAI')
    
    try {
      const result = await socialBuying({
        userId,
        friendsData,
        analysisType: 'group_recommendations'
      })

      return result.data
    } catch (error) {
      console.error('Error getting social recommendations:', error)
      throw error
    }
  }

  // LifeMirror AI Enhancement
  static async enhanceLifeMirrorProjection(baseProjection: any, emotionalContext: any) {
    const lifeMirrorEnhancer = httpsCallable(functions, 'lifeMirrorEnhancerAI')
    
    try {
      const result = await lifeMirrorEnhancer({
        baseProjection,
        emotionalContext,
        enhancementLevel: 'cinematic'
      })

      return result.data
    } catch (error) {
      console.error('Error enhancing LifeMirror projection:', error)
      throw error
    }
  }
}
