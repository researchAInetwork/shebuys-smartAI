"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Heart, ShoppingBag, Filter, Search, TrendingUp } from 'lucide-react'
import Link from "next/link"
import { useCart } from "@/components/cart-provider"
import { FirebaseProductService } from "@/lib/firebase-product-service"
import { Product } from "@/lib/product-types"
import ProductCard from "@/components/product-card"
import ProductQuickView from "@/components/product-quick-view"

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [budget, setBudget] = useState([200])
  const [selectedStyle, setSelectedStyle] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [wishlist, setWishlist] = useState<number[]>([])
  const [sortBy, setSortBy] = useState("recommended")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<string>("")

  const { addToCart } = useCart()

  useEffect(() => {
    loadProducts()
  }, [selectedStyle, selectedCategory, budget, searchQuery, sortBy])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const filters = {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        styleDNA: selectedStyle !== 'all' ? [selectedStyle] : undefined,
        priceRange: { min: 0, max: budget[0] },
        region: 'US',
        inStock: true,
        limit: 20
      }

      const fetchedProducts = await FirebaseProductService.getProducts(filters)
      setProducts(fetchedProducts)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSyncProducts = async () => {
    setIsSyncing(true)
    setSyncStatus("Initializing sync...")
    
    try {
      // Step 1: Call sync-products API
      setSyncStatus("Syncing products from retailers...")
      const syncResponse = await fetch('/api/sync-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          retailer: 'all',
          category: 'all',
          limit: 100
        })
      })

      const syncResult = await syncResponse.json()
      
      if (!syncResponse.ok) {
        throw new Error(syncResult.error || 'Sync failed')
      }

      setSyncStatus("Sync completed! Refreshing products...")
      
      // Step 2: Wait a moment for Firebase to process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Step 3: Reload products from get-products API
      setSyncStatus("Loading fresh products...")
      await loadProducts()
      
      setSyncStatus("✅ Products updated successfully!")
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setSyncStatus("")
      }, 3000)
      
    } catch (error) {
      console.error('Sync error:', error)
      setSyncStatus(`❌ Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      
      // Clear error after 5 seconds
      setTimeout(() => {
        setSyncStatus("")
      }, 5000)
    } finally {
      setIsSyncing(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      default:
        return b.isSponsored ? 1 : -1 // Sponsored products first for "recommended"
    }
  })

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }



  const handleProductQuickView = (product: Product) => {
    setSelectedProduct(product)
    setIsQuickViewOpen(true)
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 py-8 px-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4 group">
              ← <span className="group-hover:-translate-x-1 transition-transform">Back to Home</span>
            </Link>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-rose-100 dark:from-purple-900/50 dark:to-rose-900/50 rounded-full px-6 py-3 mb-4 shadow-lg backdrop-blur-sm border border-white/20">
              <ShoppingBag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="font-semibold text-purple-600 dark:text-purple-400">Firebase + GenkitAI Shopping</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">AI-Curated Fashion Just for You ✨</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">Real products from Firebase, powered by GenkitAI recommendations</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Enhanced Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-xl sticky top-24 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Filter className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-lg font-semibold">Smart Filters</h3>
                  </div>

                  {/* Search */}
                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Search</label>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-2 focus:border-purple-300 bg-white/80 dark:bg-gray-700/80"
                      />
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Budget: <span className="text-purple-600 dark:text-purple-400 font-bold">${budget[0]}</span>
                    </label>
                    <Slider value={budget} onValueChange={setBudget} max={500} min={20} step={10} className="w-full" />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>$20</span>
                      <span>$500</span>
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="border-2 focus:border-purple-300 bg-white/80 dark:bg-gray-700/80">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="tops">👕 Tops</SelectItem>
                        <SelectItem value="bottoms">👖 Bottoms</SelectItem>
                        <SelectItem value="dresses">👗 Dresses</SelectItem>
                        <SelectItem value="outerwear">🧥 Outerwear</SelectItem>
                        <SelectItem value="shoes">👠 Shoes</SelectItem>
                        <SelectItem value="accessories">💍 Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Style Filter */}
                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Style DNA</label>
                    <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                      <SelectTrigger className="border-2 focus:border-purple-300 bg-white/80 dark:bg-gray-700/80">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Styles</SelectItem>
                        <SelectItem value="classic-elegant">🌸 Classic Elegant</SelectItem>
                        <SelectItem value="modern-chic">💼 Modern Chic</SelectItem>
                        <SelectItem value="bohemian-free">🌻 Bohemian Free</SelectItem>
                        <SelectItem value="edgy-bold">⚡ Edgy & Bold</SelectItem>
                        <SelectItem value="romantic-feminine">💕 Romantic Feminine</SelectItem>
                        <SelectItem value="minimalist-clean">✨ Minimalist Clean</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Enhanced Wishlist Summary */}
                  <div className="p-4 bg-gradient-to-r from-purple-100 to-rose-100 dark:from-purple-900/20 dark:to-rose-900/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-medium">Wishlist</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{wishlist.length} items saved</p>
                    {wishlist.length > 0 && (
                      <Link href="/wishlist">
                        <Button variant="outline" size="sm" className="w-full bg-white/80 hover:bg-white dark:bg-gray-700/80 dark:hover:bg-gray-700">
                          View Wishlist
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Products Grid */}
            <div className="lg:col-span-3">
              {/* Sync Products Section */}
              <div className="mb-6">
                <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm border border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">Product Database</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {syncStatus || "Sync latest products from ASOS, Amazon & H&M"}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={handleSyncProducts}
                        disabled={isSyncing}
                        className={`px-6 py-2 font-semibold transition-all duration-300 ${
                          isSyncing
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105"
                        }`}
                      >
                        {isSyncing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Syncing...
                          </>
                        ) : (
                          <>
                            🔄 Sync Products
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Showing <span className="font-bold text-purple-600 dark:text-purple-400">{sortedProducts.length}</span> perfect matches
                </p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 border-2 focus:border-purple-300 bg-white/80 dark:bg-gray-700/80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">🤖 GenkitAI Recommended</SelectItem>
                    <SelectItem value="price-low">💰 Price: Low to High</SelectItem>
                    <SelectItem value="price-high">💎 Price: High to Low</SelectItem>
                    <SelectItem value="rating">⭐ Highest Rated</SelectItem>
                    <SelectItem value="newest">🆕 Newest Arrivals</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse border-0 shadow-lg">
                      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                      <CardContent className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={handleProductQuickView}
                      onAddToWishlist={() => toggleWishlist(parseInt(product.id))}
                      trackingData={{
                        medium: 'shop_page',
                        campaign: 'product_browse',
                        content: 'product_grid'
                      }}
                    />
                  ))}
                </div>
              )}

              {!loading && sortedProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <ShoppingBag className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your filters or search terms</p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedStyle("all")
                      setSelectedCategory("all")
                      setBudget([500])
                    }}
                    variant="outline"
                    className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/20"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
