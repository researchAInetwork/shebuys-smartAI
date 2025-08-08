"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bell, Zap, Clock, Navigation, Star } from "lucide-react"
import Image from "next/image"

interface Deal {
  id: number
  store: string
  discount: number
  item: string
  distance: number
  timeLeft: string
  image: string
  rating: number
  originalPrice: number
  salePrice: number
  category: string
}

const mockDeals: Deal[] = [
  {
    id: 1,
    store: "Zara Lagos",
    discount: 35,
    item: "Smart Bags Collection",
    distance: 0.8,
    timeLeft: "2h 15m",
    image: "/placeholder.svg?height=150&width=200&text=Smart+Bags",
    rating: 4.8,
    originalPrice: 89,
    salePrice: 58,
    category: "Bags",
  },
  {
    id: 2,
    store: "H&M Victoria Island",
    discount: 50,
    item: "Professional Blazers",
    distance: 1.2,
    timeLeft: "4h 30m",
    image: "/placeholder.svg?height=150&width=200&text=Blazers",
    rating: 4.6,
    originalPrice: 120,
    salePrice: 60,
    category: "Workwear",
  },
  {
    id: 3,
    store: "Jumia Flash Sale",
    discount: 40,
    item: "Ankara Dresses",
    distance: 0.5,
    timeLeft: "1h 45m",
    image: "/placeholder.svg?height=150&width=200&text=Ankara+Dresses",
    rating: 4.9,
    originalPrice: 75,
    salePrice: 45,
    category: "Dresses",
  },
]

export default function GeoSmartDealRadar() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [deals, setDeals] = useState<Deal[]>([])
  const [isLocationEnabled, setIsLocationEnabled] = useState(false)
  const [notifications, setNotifications] = useState(true)

  useEffect(() => {
    // Request location permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setIsLocationEnabled(true)
          setDeals(mockDeals)
        },
        (error) => {
          console.error("Location access denied:", error)
          // Show deals without location
          setDeals(mockDeals)
        },
      )
    }
  }, [])

  const enableNotifications = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        setNotifications(true)
        new Notification("🎉 Deal Radar Activated!", {
          body: "You'll now receive alerts for amazing deals near you!",
          icon: "/favicon.ico",
        })
      }
    }
  }

  const getDirections = (deal: Deal) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${deal.store}`
      window.open(url, "_blank")
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <MapPin className="w-6 h-6 text-green-600 animate-pulse" />
            GeoSmart Deal Radar
          </CardTitle>
          <p className="text-gray-600">Real-time deals and flash sales near you!</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Location Status */}
          <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${isLocationEnabled ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
              ></div>
              <span className="font-medium">
                {isLocationEnabled ? "Location Active" : "Enable Location for Better Deals"}
              </span>
            </div>
            {!notifications && (
              <Button onClick={enableNotifications} size="sm" className="bg-green-600 hover:bg-green-700">
                <Bell className="w-4 h-4 mr-2" />
                Enable Alerts
              </Button>
            )}
          </div>

          {/* Deal Alert */}
          {notifications && (
            <div className="bg-gradient-to-r from-rose-500 to-purple-600 text-white p-4 rounded-xl animate-pulse">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 animate-bounce" />
                <span className="font-bold">FLASH ALERT!</span>
              </div>
              <p className="text-sm opacity-90">
                Hey Beautiful! 35% off smart bags just 0.8km away - ending in 2h 15m! 💫
              </p>
            </div>
          )}

          {/* Deals Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Deals Near You</h3>
              <Badge className="bg-green-500 text-white animate-pulse">{deals.length} Active Deals</Badge>
            </div>

            {deals.map((deal) => (
              <Card key={deal.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                      <Image
                        src={deal.image || "/placeholder.svg"}
                        alt={deal.item}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{deal.discount}%
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Badge variant="secondary" className="text-xs mb-1">
                            {deal.category}
                          </Badge>
                          <h4 className="font-semibold text-gray-900">{deal.item}</h4>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {deal.store} • {deal.distance}km away
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{deal.rating}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-green-600">${deal.salePrice}</span>
                            <span className="text-sm text-gray-500 line-through">${deal.originalPrice}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-red-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">Ends in {deal.timeLeft}</span>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => getDirections(deal)}
                            size="sm"
                            variant="outline"
                            className="border-2 border-green-300 text-green-700 hover:bg-green-50"
                          >
                            <Navigation className="w-4 h-4 mr-1" />
                            Directions
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          >
                            Claim Deal
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Map Integration Placeholder */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-green-600 mx-auto mb-2 animate-bounce" />
                  <p className="text-green-700 font-medium">Interactive Map View</p>
                  <p className="text-sm text-green-600">See all deals on map</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
