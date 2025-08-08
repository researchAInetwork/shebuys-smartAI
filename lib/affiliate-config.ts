export interface AffiliatePartner {
  id: string
  name: string
  logo: string
  baseUrl: string
  apiEndpoint?: string
  affiliateId: string
  commission: number
  regions: string[]
  categories: string[]
  currency: string
  shippingInfo: string
}

export const affiliatePartners: AffiliatePartner[] = [
  {
    id: 'amazon',
    name: 'Amazon',
    logo: '/logos/amazon.png',
    baseUrl: 'https://amazon.com',
    affiliateId: 'shebuyssmart-20',
    commission: 4.5,
    regions: ['US', 'UK', 'CA', 'DE', 'FR', 'IT', 'ES', 'JP', 'AU'],
    categories: ['fashion', 'accessories', 'beauty', 'shoes'],
    currency: 'USD',
    shippingInfo: 'Free shipping on orders $35+'
  },
  {
    id: 'zara',
    name: 'Zara',
    logo: '/logos/zara.png',
    baseUrl: 'https://zara.com',
    affiliateId: 'shebuyssmart_zara',
    commission: 3.5,
    regions: ['US', 'UK', 'EU', 'CA', 'AU', 'MX'],
    categories: ['fashion', 'accessories', 'shoes'],
    currency: 'USD',
    shippingInfo: 'Free shipping on orders $50+'
  },
  {
    id: 'asos',
    name: 'ASOS',
    logo: '/logos/asos.png',
    baseUrl: 'https://asos.com',
    affiliateId: 'shebuyssmart_asos',
    commission: 5.0,
    regions: ['US', 'UK', 'EU', 'AU'],
    categories: ['fashion', 'accessories', 'beauty', 'shoes'],
    currency: 'USD',
    shippingInfo: 'Free shipping & returns'
  },
  {
    id: 'jumia',
    name: 'Jumia',
    logo: '/logos/jumia.png',
    baseUrl: 'https://jumia.com',
    affiliateId: 'shebuyssmart_jumia',
    commission: 6.0,
    regions: ['NG', 'KE', 'EG', 'MA', 'CI', 'GH', 'UG', 'TN'],
    categories: ['fashion', 'accessories', 'beauty', 'shoes'],
    currency: 'USD',
    shippingInfo: 'Free delivery available'
  },
  {
    id: 'shein',
    name: 'SHEIN',
    logo: '/logos/shein.png',
    baseUrl: 'https://shein.com',
    affiliateId: 'shebuyssmart_shein',
    commission: 7.0,
    regions: ['US', 'UK', 'EU', 'AU', 'CA', 'MX', 'BR'],
    categories: ['fashion', 'accessories', 'beauty', 'shoes'],
    currency: 'USD',
    shippingInfo: 'Free shipping on orders $29+'
  },
  {
    id: 'hm',
    name: 'H&M',
    logo: '/logos/hm.png',
    baseUrl: 'https://hm.com',
    affiliateId: 'shebuyssmart_hm',
    commission: 4.0,
    regions: ['US', 'UK', 'EU', 'CA', 'AU', 'JP'],
    categories: ['fashion', 'accessories', 'shoes'],
    currency: 'USD',
    shippingInfo: 'Free shipping on orders $40+'
  },
  {
    id: 'myntra',
    name: 'Myntra',
    logo: '/logos/myntra.png',
    baseUrl: 'https://myntra.com',
    affiliateId: 'shebuyssmart_myntra',
    commission: 5.5,
    regions: ['IN'],
    categories: ['fashion', 'accessories', 'beauty', 'shoes'],
    currency: 'INR',
    shippingInfo: 'Free delivery & easy returns'
  },
  {
    id: 'konga',
    name: 'Konga',
    logo: '/logos/konga.png',
    baseUrl: 'https://konga.com',
    affiliateId: 'shebuyssmart_konga',
    commission: 6.5,
    regions: ['NG'],
    categories: ['fashion', 'accessories', 'beauty', 'shoes'],
    currency: 'NGN',
    shippingInfo: 'Nationwide delivery'
  },
  {
    id: 'zalando',
    name: 'Zalando',
    logo: '/logos/zalando.png',
    baseUrl: 'https://zalando.com',
    affiliateId: 'shebuyssmart_zalando',
    commission: 4.5,
    regions: ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH'],
    categories: ['fashion', 'accessories', 'beauty', 'shoes'],
    currency: 'EUR',
    shippingInfo: 'Free shipping & returns'
  },
  {
    id: 'nordstrom',
    name: 'Nordstrom',
    logo: '/logos/nordstrom.png',
    baseUrl: 'https://nordstrom.com',
    affiliateId: 'shebuyssmart_nordstrom',
    commission: 3.0,
    regions: ['US', 'CA'],
    categories: ['fashion', 'accessories', 'beauty', 'shoes'],
    currency: 'USD',
    shippingInfo: 'Free shipping & returns'
  }
]

export const getPartnersByRegion = (region: string) => {
  return affiliatePartners.filter(partner => partner.regions.includes(region))
}

export const generateAffiliateLink = (partner: AffiliatePartner, productUrl: string, trackingData?: any) => {
  const url = new URL(productUrl)
  
  // Add affiliate tracking parameters based on partner
  switch (partner.id) {
    case 'amazon':
      url.searchParams.set('tag', partner.affiliateId)
      break
    case 'zara':
    case 'asos':
    case 'hm':
      url.searchParams.set('affiliate_id', partner.affiliateId)
      break
    default:
      url.searchParams.set('ref', partner.affiliateId)
  }
  
  // Add tracking parameters
  if (trackingData) {
    url.searchParams.set('utm_source', 'shebuyssmart')
    url.searchParams.set('utm_medium', trackingData.medium || 'app')
    url.searchParams.set('utm_campaign', trackingData.campaign || 'product_recommendation')
    url.searchParams.set('utm_content', trackingData.content || 'product_card')
  }
  
  return url.toString()
}
