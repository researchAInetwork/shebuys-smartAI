import { onRequest } from 'firebase-functions/v2/https'
import { onSchedule } from 'firebase-functions/v2/scheduler'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { configureGenkit } from '@genkit-ai/core'
import { firebase } from '@genkit-ai/firebase'
import { googleAI } from '@genkit-ai/googleai'

// Initialize Firebase Admin
initializeApp()
const db = getFirestore()

// Configure Genkit
configureGenkit({
  plugins: [
    firebase(),
    googleAI({
      apiKey: process.env.GOOGLE_AI_API_KEY
    })
  ]
})

// AI Product Matcher using GenkitAI
export const aiProductMatcher = onRequest(async (req, res) => {
  try {
    const { userPreferences, occasion, lifeScenario } = req.body

    // Query products from Firestore
    const productsRef = db.collection('products')
    let query = productsRef.where('inStock', '==', true)

    if (userPreferences.styleDNA) {
      query = query.where('styleDNA', 'array-contains', userPreferences.styleDNA)
    }

    if (userPreferences.budget) {
      query = query
        .where('price', '>=', userPreferences.budget.min)
        .where('price', '<=', userPreferences.budget.max)
    }

    const snapshot = await query.limit(50).get()
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    // Use GenkitAI to score and match products
    const { generate } = await import('@genkit-ai/ai')
    const { googleAI } = await import('@genkit-ai/googleai')

    const matchingPrompt = `
      You are a fashion AI stylist. Score these products for a user with the following preferences:
      - Style DNA: ${userPreferences.styleDNA}
      - Body Type: ${userPreferences.bodyType}
      - Skin Tone: ${userPreferences.skinTone}
      - Cultural Style: ${userPreferences.culturalStyle}
      - Occasion: ${occasion || 'general'}
      - Life Scenario: ${lifeScenario || 'everyday'}
      
      Products: ${JSON.stringify(products)}
      
      Return a JSON array of products with matchScore (0-1) and matchReasons array.
    `

    const result = await generate({
      model: googleAI('gemini-1.5-flash'),
      prompt: matchingPrompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 2048
      }
    })

    const matches = JSON.parse(result.text())
    res.json(matches)
  } catch (error) {
    console.error('Error in AI product matcher:', error)
    res.status(500).json({ error: 'Failed to match products' })
  }
})

// AI Outfit Generator using GenkitAI
export const aiOutfitGenerator = onRequest(async (req, res) => {
  try {
    const { userPreferences, occasion, lifeScenario } = req.body

    // Get matched products first
    const matchedProducts = await getMatchedProducts(userPreferences, occasion, lifeScenario)

    // Use GenkitAI to create outfit combinations
    const { generate } = await import('@genkit-ai/ai')
    const { googleAI } = await import('@genkit-ai/googleai')

    const outfitPrompt = `
      You are a professional fashion stylist. Create 3-5 complete outfit recommendations using these products:
      ${JSON.stringify(matchedProducts)}
      
      User preferences:
      - Style DNA: ${userPreferences.styleDNA}
      - Occasion: ${occasion}
      - Budget: $${userPreferences.budget.max}
      - Life Scenario: ${lifeScenario}
      
      Create outfits that:
      1. Stay within budget
      2. Match the style DNA and occasion
      3. Include essential items (top, bottom, shoes) and optional accessories
      4. Have high confidence scores based on style matching
      
      Return JSON array of outfit objects with: id, name, description, occasion, totalPrice, currency, items[], styleDNA[], confidence.
    `

    const result = await generate({
      model: googleAI('gemini-1.5-flash'),
      prompt: outfitPrompt,
      config: {
        temperature: 0.4,
        maxOutputTokens: 3000
      }
    })

    const outfits = JSON.parse(result.text())
    res.json(outfits)
  } catch (error) {
    console.error('Error in AI outfit generator:', error)
    res.status(500).json({ error: 'Failed to generate outfits' })
  }
})

// LifeMirror AI using GenkitAI
export const lifeMirrorAI = onRequest(async (req, res) => {
  try {
    const { userPreferences, scenario, personalizationData } = req.body

    const { generate } = await import('@genkit-ai/ai')
    const { googleAI } = await import('@genkit-ai/googleai')

    const lifeMirrorPrompt = `
      You are LifeMirror AI, creating a transformative vision for a user's future self.
      
      Scenario: ${scenario}
      User Style DNA: ${userPreferences.styleDNA}
      Personalization: ${JSON.stringify(personalizationData)}
      
      Create a detailed projection that includes:
      1. Visual description of their future self
      2. Confidence affirmations specific to the scenario
      3. Style evolution timeline
      4. Emotional transformation journey
      5. Product recommendations that match the vision
      
      Make it inspiring, realistic, and emotionally powerful.
      Return JSON with: visualDescription, affirmations[], styleEvolution[], emotionalJourney, productRecommendations[].
    `

    const result = await generate({
      model: googleAI('gemini-1.5-flash'),
      prompt: lifeMirrorPrompt,
      config: {
        temperature: 0.6,
        maxOutputTokens: 2500
      }
    })

    const projection = JSON.parse(result.text())
    res.json(projection)
  } catch (error) {
    console.error('Error in LifeMirror AI:', error)
    res.status(500).json({ error: 'Failed to generate projection' })
  }
})

// Budget Whisperer AI
export const budgetWhispererAI = onRequest(async (req, res) => {
  try {
    const { userProfile, spendingHistory, currentDate } = req.body

    const { generate } = await import('@genkit-ai/ai')
    const { googleAI } = await import('@genkit-ai/googleai')

    const budgetPrompt = `
      You are the Daily Budget Whisperer, a wise and supportive AI financial advisor for fashion spending.
      
      User Profile: ${JSON.stringify(userProfile)}
      Spending History: ${JSON.stringify(spendingHistory)}
      Current Date: ${currentDate}
      
      Provide personalized budget advice that:
      1. Analyzes spending patterns
      2. Suggests budget optimizations
      3. Recommends when to splurge vs save
      4. Gives motivational financial wisdom
      5. Suggests specific actions for today
      
      Be encouraging, practical, and fashion-focused.
      Return JSON with: dailyAdvice, spendingAnalysis, recommendations[], motivationalMessage.
    `

    const result = await generate({
      model: googleAI('gemini-1.5-flash'),
      prompt: budgetPrompt,
      config: {
        temperature: 0.5,
        maxOutputTokens: 1500
      }
    })

    const advice = JSON.parse(result.text())
    res.json(advice)
  } catch (error) {
    console.error('Error in Budget Whisperer AI:', error)
    res.status(500).json({ error: 'Failed to get budget advice' })
  }
})

// SisterSaver AI Bot
export const sisterSaverAI = onRequest(async (req, res) => {
  try {
    const { message, conversationHistory, userContext, timestamp } = req.body

    const { generate } = await import('@genkit-ai/ai')
    const { googleAI } = await import('@genkit-ai/googleai')

    const chatPrompt = `
      You are SisterSaver AI, a supportive and knowledgeable fashion assistant who talks like a caring older sister.
      
      User Message: ${message}
      Conversation History: ${JSON.stringify(conversationHistory)}
      User Context: ${JSON.stringify(userContext)}
      
      Respond as a fashion-savvy sister who:
      1. Gives honest, practical advice
      2. Helps save money while looking great
      3. Understands fashion trends and deals
      4. Is encouraging and supportive
      5. Shares insider tips and tricks
      
      Keep responses conversational, helpful, and sisterly.
      Return JSON with: response, suggestions[], dealAlerts[], styleAdvice.
    `

    const result = await generate({
      model: googleAI('gemini-1.5-flash'),
      prompt: chatPrompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 1200
      }
    })

    const chatResponse = JSON.parse(result.text())
    res.json(chatResponse)
  } catch (error) {
    console.error('Error in SisterSaver AI:', error)
    res.status(500).json({ error: 'Failed to get chat response' })
  }
})

// Visual Stylist AI
export const visualStylistAI = onRequest(async (req, res) => {
  try {
    const { imageUrl, userPreferences, analysisType } = req.body

    const { generate } = await import('@genkit-ai/ai')
    const { googleAI } = await import('@genkit-ai/googleai')

    const visualPrompt = `
      You are a Visual AI Personal Stylist analyzing fashion images.
      
      Image URL: ${imageUrl}
      User Preferences: ${JSON.stringify(userPreferences)}
      Analysis Type: ${analysisType}
      
      Analyze the image and provide:
      1. Style assessment and feedback
      2. Improvement suggestions
      3. Color and fit analysis
      4. Occasion appropriateness
      5. Product recommendations to enhance the look
      
      Be constructive, specific, and fashion-forward.
      Return JSON with: styleAnalysis, improvements[], colorAnalysis, fitAnalysis, recommendations[].
    `

    const result = await generate({
      model: googleAI('gemini-1.5-flash'),
      prompt: visualPrompt,
      config: {
        temperature: 0.4,
        maxOutputTokens: 2000
      }
    })

    const analysis = JSON.parse(result.text())
    res.json(analysis)
  } catch (error) {
    console.error('Error in Visual Stylist AI:', error)
    res.status(500).json({ error: 'Failed to analyze image' })
  }
})

// Trend Forecaster AI
export const trendForecasterAI = onRequest(async (req, res) => {
  try {
    const { region, season, styleDNA, forecastPeriod } = req.body

    const { generate } = await import('@genkit-ai/ai')
    const { googleAI } = await import('@genkit-ai/googleai')

    const trendPrompt = `
      You are a Smart Trend Forecaster AI with deep knowledge of global fashion trends.
      
      Region: ${region}
      Season: ${season}
      Style DNA: ${styleDNA}
      Forecast Period: ${forecastPeriod}
      
      Provide trend forecasts including:
      1. Emerging trends for the region and season
      2. Color palettes and patterns
      3. Key pieces to invest in
      4. Trends to avoid or that are declining
      5. Price predictions and shopping timing
      
      Be specific, actionable, and trend-aware.
      Return JSON with: emergingTrends[], colorPalettes[], keyPieces[], decliningTrends[], shoppingTiming.
    `

    const result = await generate({
      model: googleAI('gemini-1.5-flash'),
      prompt: trendPrompt,
      config: {
        temperature: 0.5,
        maxOutputTokens: 2200
      }
    })

    const forecast = JSON.parse(result.text())
    res.json(forecast)
  } catch (error) {
    console.error('Error in Trend Forecaster AI:', error)
    res.status(500).json({ error: 'Failed to generate trend forecast' })
  }
})

// GeoSmart Deal Radar
export const geoSmartDealRadar = onRequest(async (req, res) => {
  try {
    const { location, userPreferences, radius, dealTypes } = req.body

    const { generate } = await import('@genkit-ai/ai')
    const { googleAI } = await import('@genkit-ai/googleai')

    const dealPrompt = `
      You are GeoSmart Deal Radar, finding the best fashion deals based on location and preferences.
      
      Location: ${JSON.stringify(location)}
      User Preferences: ${JSON.stringify(userPreferences)}
      Search Radius: ${radius} miles
      Deal Types: ${JSON.stringify(dealTypes)}
      
      Find and recommend:
      1. Local store sales and promotions
      2. Seasonal clearance events
      3. New arrival notifications
      4. Exclusive regional deals
      5. Timing recommendations for best prices
      
      Focus on deals that match user style and budget.
      Return JSON with: localDeals[], onlineDeals[], upcomingEvents[], priceAlerts[], shoppingStrategy.
    `

    const result = await generate({
      model: googleAI('gemini-1.5-flash'),
      prompt: dealPrompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 1800
      }
    })

    const deals = JSON.parse(result.text())
    res.json(deals)
  } catch (error) {
    console.error('Error in GeoSmart Deal Radar:', error)
    res.status(500).json({ error: 'Failed to find deals' })
  }
})

// Social Buying Circles AI
export const socialBuyingCirclesAI = onRequest(async (req, res) => {
  try {
    const { userId, friendsData, analysisType } = req.body

    const { generate } = await import('@genkit-ai/ai')
    const { googleAI } = await import('@genkit-ai/googleai')

    const socialPrompt = `
      You are Social Buying Circles AI, analyzing friend groups for collaborative fashion decisions.
      
      User ID: ${userId}
      Friends Data: ${JSON.stringify(friendsData)}
      Analysis Type: ${analysisType}
      
      Provide social shopping insights:
      1. Group style compatibility analysis
      2. Shared purchase opportunities
      3. Complementary outfit suggestions
      4. Group discount possibilities
      5. Social influence recommendations
      
      Focus on building positive group dynamics around fashion.
      Return JSON with: groupAnalysis, sharedOpportunities[], complementaryItems[], groupDiscounts[], socialRecommendations[].
    `

    const result = await generate({
      model: googleAI('gemini-1.5-flash'),
      prompt: socialPrompt,
      config: {
        temperature: 0.6,
        maxOutputTokens: 1600
      }
    })

    const socialInsights = JSON.parse(result.text())
    res.json(socialInsights)
  } catch (error) {
    console.error('Error in Social Buying Circles AI:', error)
    res.status(500).json({ error: 'Failed to analyze social data' })
  }
})

// LifeMirror Enhancer AI
export const lifeMirrorEnhancerAI = onRequest(async (req, res) => {
  try {
    const { baseProjection, emotionalContext, enhancementLevel } = req.body

    const { generate } = await import('@genkit-ai/ai')
    const { googleAI } = await import('@genkit-ai/googleai')

    const enhancementPrompt = `
      You are LifeMirror Enhancer AI, taking basic projections to cinematic, emotional experiences.
      
      Base Projection: ${JSON.stringify(baseProjection)}
      Emotional Context: ${JSON.stringify(emotionalContext)}
      Enhancement Level: ${enhancementLevel}
      
      Enhance the projection with:
      1. Cinematic visual details and atmosphere
      2. Emotional soundtrack recommendations
      3. Confidence-building affirmations
      4. Sensory experience descriptions
      5. Motivational transformation narrative
      
      Make it feel like a movie trailer for their future self.
      Return JSON with: cinematicVisuals, soundtrackSuggestions[], enhancedAffirmations[], sensoryExperience, transformationNarrative.
    `

    const result = await generate({
      model: googleAI('gemini-1.5-flash'),
      prompt: enhancementPrompt,
      config: {
        temperature: 0.8,
        maxOutputTokens: 2000
      }
    })

    const enhancement = JSON.parse(result.text())
    res.json(enhancement)
  } catch (error) {
    console.error('Error in LifeMirror Enhancer AI:', error)
    res.status(500).json({ error: 'Failed to enhance projection' })
  }
})

// Sync Product Data from Partner APIs
export const syncProductData = onSchedule('every 24 hours', async (event) => {
  try {
    console.log('Starting daily product sync...')

    // Sync from each affiliate partner
    const partners = [
      { id: 'amazon', apiUrl: process.env.AMAZON_API_URL },
      { id: 'zara', apiUrl: process.env.ZARA_API_URL },
      { id: 'asos', apiUrl: process.env.ASOS_API_URL },
      { id: 'jumia', apiUrl: process.env.JUMIA_API_URL },
      { id: 'shein', apiUrl: process.env.SHEIN_API_URL },
      { id: 'hm', apiUrl: process.env.HM_API_URL },
      { id: 'myntra', apiUrl: process.env.MYNTRA_API_URL },
      { id: 'konga', apiUrl: process.env.KONGA_API_URL },
      { id: 'zalando', apiUrl: process.env.ZALANDO_API_URL },
      { id: 'nordstrom', apiUrl: process.env.NORDSTROM_API_URL }
    ]

    for (const partner of partners) {
      try {
        console.log(`Syncing products from ${partner.id}...`)
        
        // Fetch products from partner API (implementation varies by partner)
        const products = await fetchPartnerProducts(partner)
        
        // Normalize and store in Firestore
        await storeProductsInFirestore(products, partner.id)
        
        console.log(`Successfully synced ${products.length} products from ${partner.id}`)
      } catch (error) {
        console.error(`Error syncing from ${partner.id}:`, error)
      }
    }

    console.log('Daily product sync completed')
  } catch (error) {
    console.error('Error in daily product sync:', error)
  }
})

// Helper function to fetch products from partner APIs
async function fetchPartnerProducts(partner: any) {
  // This would be implemented based on each partner's API specification
  // For now, return mock data
  return [
    {
      name: `Sample Product from ${partner.id}`,
      brand: 'Sample Brand',
      price: 99.99,
      currency: 'USD',
      images: ['/placeholder.svg?height=300&width=300&text=Product'],
      colors: ['Black', 'White'],
      sizes: ['S', 'M', 'L'],
      category: 'tops',
      styleDNA: ['modern-chic'],
      inStock: true,
      rating: 4.5,
      reviewCount: 100,
      partnerId: partner.id,
      partnerProductId: `${partner.id}_sample_123`,
      productUrl: `https://${partner.id}.com/product/sample`,
      region: 'US',
      lastUpdated: new Date()
    }
  ]
}

// Helper function to store products in Firestore
async function storeProductsInFirestore(products: any[], partnerId: string) {
  const batch = db.batch()
  
  for (const product of products) {
    const productRef = db.collection('products').doc(`${partnerId}_${product.partnerProductId}`)
    batch.set(productRef, {
      ...product,
      lastUpdated: new Date(),
      partnerId
    }, { merge: true })
  }
  
  await batch.commit()
}

// Helper function to get matched products
async function getMatchedProducts(userPreferences: any, occasion: string, lifeScenario: string) {
  const productsRef = db.collection('products')
  let query = productsRef.where('inStock', '==', true)

  if (userPreferences.styleDNA) {
    query = query.where('styleDNA', 'array-contains', userPreferences.styleDNA)
  }

  if (userPreferences.budget) {
    query = query
      .where('price', '>=', userPreferences.budget.min)
      .where('price', '<=', userPreferences.budget.max)
  }

  const snapshot = await query.limit(30).get()
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
