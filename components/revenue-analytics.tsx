"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingUp, Users, ShoppingBag, Star, Target, Award, Zap } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface RevenueData {
  totalRevenue: number
  affiliateCommissions: number
  sponsoredPlacements: number
  premiumSubscriptions: number
  conversionRate: number
  topPerformingProducts: any[]
  partnerPerformance: any[]
  monthlyTrends: any[]
}

export default function RevenueAnalytics() {
  const [revenueData, setRevenueData] = useState<RevenueData>({
    totalRevenue: 0,
    affiliateCommissions: 0,
    sponsoredPlacements: 0,
    premiumSubscriptions: 0,
    conversionRate: 0,
    topPerformingProducts: [],
    partnerPerformance: [],
    monthlyTrends: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRevenueData()
  }, [])

  const loadRevenueData = async () => {
    // Mock data - in real app, this would come from your analytics service
    const mockData: RevenueData = {
      totalRevenue: 45780,
      affiliateCommissions: 32450,
      sponsoredPlacements: 8900,
      premiumSubscriptions: 4430,
      conversionRate: 3.2,
      topPerformingProducts: [
        { name: "Boho Maxi Dress", revenue: 2340, clicks: 1250, conversion: 4.2, partner: "ASOS" },
        { name: "Power Blazer", revenue: 1890, clicks: 980, conversion: 3.8, partner: "Zara" },
        { name: "Statement Earrings", revenue: 1560, clicks: 2100, conversion: 2.1, partner: "Amazon" },
        { name: "Silk Blouse", revenue: 1340, clicks: 890, conversion: 4.5, partner: "Nordstrom" },
        { name: "Ankle Boots", revenue: 1120, clicks: 750, conversion: 3.9, partner: "Zalando" }
      ],
      partnerPerformance: [
        { name: "Amazon", revenue: 12450, commission: 4.5, orders: 234, color: "#FF9500" },
        { name: "Zara", revenue: 8900, commission: 3.5, orders: 189, color: "#000000" },
        { name: "ASOS", revenue: 7650, commission: 5.0, orders: 156, color: "#0770CF" },
        { name: "SHEIN", revenue: 4320, commission: 7.0, orders: 298, color: "#FF6B9D" },
        { name: "H&M", revenue: 3890, commission: 4.0, orders: 145, color: "#E50000" },
        { name: "Nordstrom", revenue: 3210, commission: 3.0, orders: 89, color: "#4A4A4A" }
      ],
      monthlyTrends: [
        { month: "Jan", revenue: 28500, clicks: 12400, conversions: 398 },
        { month: "Feb", revenue: 32100, clicks: 14200, conversions: 455 },
        { month: "Mar", revenue: 35600, clicks: 15800, conversions: 507 },
        { month: "Apr", revenue: 39200, clicks: 17100, conversions: 548 },
        { month: "May", revenue: 42800, clicks: 18900, conversions: 605 },
        { month: "Jun", revenue: 45780, clicks: 20300, conversions: 650 }
      ]
    }

    setRevenueData(mockData)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold">${revenueData.totalRevenue.toLocaleString()}</p>
                <p className="text-green-100 text-sm">+12.5% from last month</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Affiliate Commissions</p>
                <p className="text-3xl font-bold">${revenueData.affiliateCommissions.toLocaleString()}</p>
                <p className="text-blue-100 text-sm">71% of total revenue</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Sponsored Placements</p>
                <p className="text-3xl font-bold">${revenueData.sponsoredPlacements.toLocaleString()}</p>
                <p className="text-purple-100 text-sm">19% of total revenue</p>
              </div>
              <Star className="w-12 h-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Conversion Rate</p>
                <p className="text-3xl font-bold">{revenueData.conversionRate}%</p>
                <p className="text-orange-100 text-sm">+0.3% from last month</p>
              </div>
              <Target className="w-12 h-12 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Revenue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Revenue Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Affiliate Commissions</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ${revenueData.affiliateCommissions.toLocaleString()} (71%)
                    </span>
                  </div>
                  <Progress value={71} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Sponsored Placements</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ${revenueData.sponsoredPlacements.toLocaleString()} (19%)
                    </span>
                  </div>
                  <Progress value={19} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Premium Subscriptions</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ${revenueData.premiumSubscriptions.toLocaleString()} (10%)
                    </span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Top Performing Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueData.topPerformingProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-rose-500 text-white rounded-full font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {product.clicks} clicks • {product.conversion}% conversion
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 dark:text-green-400">
                        ${product.revenue.toLocaleString()}
                      </p>
                      <Badge variant="outline">{product.partner}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partners" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Partner Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Partner Revenue Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueData.partnerPerformance}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="revenue"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {revenueData.partnerPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Partner Details */}
            <Card>
              <CardHeader>
                <CardTitle>Partner Performance Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueData.partnerPerformance.map((partner, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: partner.color }}
                        ></div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{partner.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {partner.orders} orders • {partner.commission}% commission
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">
                          ${partner.revenue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Clicks vs Conversions */}
          <Card>
            <CardHeader>
              <CardTitle>Clicks vs Conversions Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="#8b5cf6" name="Clicks" />
                  <Bar dataKey="conversions" fill="#ec4899" name="Conversions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <Zap className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {revenueData.monthlyTrends[revenueData.monthlyTrends.length - 1]?.clicks.toLocaleString()}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Total Clicks This Month</p>
                <Badge className="mt-2 bg-green-100 text-green-700">+15.2% vs last month</Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <ShoppingBag className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {revenueData.monthlyTrends[revenueData.monthlyTrends.length - 1]?.conversions.toLocaleString()}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Conversions This Month</p>
                <Badge className="mt-2 bg-green-100 text-green-700">+8.7% vs last month</Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="w-12 h-12 mx-auto text-purple-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  ${Math.round(revenueData.totalRevenue / revenueData.monthlyTrends[revenueData.monthlyTrends.length - 1]?.conversions)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Average Order Value</p>
                <Badge className="mt-2 bg-green-100 text-green-700">+3.4% vs last month</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
