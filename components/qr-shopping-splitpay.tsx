"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QrCode, Camera, CreditCard, Zap, CheckCircle, AlertCircle } from "lucide-react"
import Image from "next/image"

interface ScannedProduct {
  id: number
  name: string
  brand: string
  storePrice: number
  onlinePrice: number
  bestPrice: number
  bestStore: string
  savings: number
  image: string
  availability: "in-stock" | "limited" | "out-of-stock"
}

interface PaymentPlan {
  id: number
  name: string
  installments: number
  firstPayment: number
  monthlyPayment: number
  totalAmount: number
  interestRate: number
  approved: boolean
}

const mockScannedProduct: ScannedProduct = {
  id: 1,
  name: "Designer Handbag",
  brand: "Coach",
  storePrice: 299,
  onlinePrice: 249,
  bestPrice: 199,
  bestStore: "Jumia Flash Sale",
  savings: 100,
  image: "/placeholder.svg?height=200&width=200&text=Designer+Handbag",
  availability: "in-stock",
}

const paymentPlans: PaymentPlan[] = [
  {
    id: 1,
    name: "Quick Split",
    installments: 2,
    firstPayment: 100,
    monthlyPayment: 99,
    totalAmount: 199,
    interestRate: 0,
    approved: true,
  },
  {
    id: 2,
    name: "Flexible Plan",
    installments: 4,
    firstPayment: 60,
    monthlyPayment: 48,
    totalAmount: 204,
    interestRate: 2.5,
    approved: true,
  },
  {
    id: 3,
    name: "Extended Plan",
    installments: 6,
    firstPayment: 40,
    monthlyPayment: 28,
    totalAmount: 208,
    interestRate: 4.5,
    approved: false,
  },
]

export default function QRShoppingSplitPay() {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startQRScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsScanning(true)
      }
    } catch (error) {
      console.error("Camera access denied:", error)
      alert("Camera access is required for QR scanning. Please enable camera permissions.")
    }
  }

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setIsScanning(false)
    }
  }

  const simulateQRScan = () => {
    // Simulate QR code detection and product lookup
    setTimeout(() => {
      setScannedProduct(mockScannedProduct)
      stopScanning()
    }, 2000)
  }

  const selectPaymentPlan = (planId: number) => {
    setSelectedPlan(planId)
    setShowPaymentOptions(true)
  }

  const processPayment = () => {
    const plan = paymentPlans.find((p) => p.id === selectedPlan)
    if (plan) {
      alert(
        `🎉 Payment plan approved! First payment of $${plan.firstPayment} will be charged now. Remaining ${plan.installments - 1} payments of $${plan.monthlyPayment} will be auto-charged monthly.`,
      )
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-emerald-50 to-teal-50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <QrCode className="w-6 h-6 text-emerald-600 animate-pulse" />
            Smart QR Shopping & SplitPay AI
          </CardTitle>
          <p className="text-gray-600">
            Scan products in-store, compare prices instantly, and split payments smartly! 📱
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* QR Scanner */}
          {!scannedProduct && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                {!isScanning ? (
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Ready to Scan!</h3>
                    <p className="text-gray-600">
                      Point your camera at any product QR code or barcode to get instant price comparisons
                    </p>
                    <Button
                      onClick={startQRScanning}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-8 py-4 text-lg font-semibold"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Start Scanning
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover rounded-xl" />
                      <div className="absolute inset-0 border-4 border-emerald-400 rounded-xl">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-emerald-400 rounded-lg animate-pulse"></div>
                      </div>
                      <canvas ref={canvasRef} className="hidden" />
                    </div>

                    <div className="text-center space-y-2">
                      <p className="font-medium text-emerald-700">Scanning for products...</p>
                      <p className="text-sm text-gray-600">Position the QR code or barcode within the frame</p>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={simulateQRScan} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                        Simulate Scan (Demo)
                      </Button>
                      <Button
                        onClick={stopScanning}
                        variant="outline"
                        className="border-2 border-gray-300 bg-transparent"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Scanned Product Results */}
          {scannedProduct && !showPaymentOptions && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-900">Product Found!</h3>
                </div>

                <div className="flex gap-4 mb-6">
                  <div className="w-24 h-24 rounded-xl overflow-hidden">
                    <Image
                      src={scannedProduct.image || "/placeholder.svg"}
                      alt={scannedProduct.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg">{scannedProduct.name}</h4>
                    <p className="text-gray-600">{scannedProduct.brand}</p>
                    <Badge
                      className={`mt-1 ${
                        scannedProduct.availability === "in-stock"
                          ? "bg-green-500"
                          : scannedProduct.availability === "limited"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    >
                      {scannedProduct.availability.replace("-", " ").toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Price Comparison */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold text-gray-900">💰 Price Comparison</h4>

                  <div className="grid gap-3">
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="text-gray-700">This Store</span>
                      <span className="font-bold text-red-600">${scannedProduct.storePrice}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="text-gray-700">Online Average</span>
                      <span className="font-bold text-yellow-600">${scannedProduct.onlinePrice}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border-2 border-green-200">
                      <div>
                        <span className="text-gray-700">Best Price</span>
                        <p className="text-sm text-green-600">{scannedProduct.bestStore}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-green-600 text-lg">${scannedProduct.bestPrice}</span>
                        <p className="text-sm text-green-600">Save ${scannedProduct.savings}!</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => setShowPaymentOptions(true)}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Buy with SplitPay
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Buy at Best Price
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* SplitPay Options */}
          {showPaymentOptions && scannedProduct && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  SplitPay Options
                </CardTitle>
                <p className="text-gray-600">Choose a payment plan that works for your budget</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`border-2 cursor-pointer transition-all duration-300 ${
                      selectedPlan === plan.id
                        ? "border-emerald-500 bg-emerald-50 shadow-lg"
                        : plan.approved
                          ? "border-gray-200 hover:border-emerald-300 hover:shadow-md"
                          : "border-gray-200 opacity-60"
                    }`}
                    onClick={() => plan.approved && selectPaymentPlan(plan.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                            {plan.approved ? (
                              <Badge className="bg-green-500 text-white text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approved
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Pending Review
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{plan.installments} payments</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">${plan.totalAmount}</div>
                          {plan.interestRate > 0 && (
                            <div className="text-xs text-gray-500">{plan.interestRate}% interest</div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">First Payment</span>
                          <div className="font-semibold text-emerald-600">${plan.firstPayment}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Monthly</span>
                          <div className="font-semibold text-gray-900">${plan.monthlyPayment}</div>
                        </div>
                      </div>

                      {plan.interestRate === 0 && (
                        <div className="mt-2 text-xs text-green-600 font-medium">🎉 No interest • No hidden fees</div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {selectedPlan && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="bg-gradient-to-r from-emerald-100 to-teal-100 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Payment Schedule</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Today</span>
                          <span className="font-semibold">
                            ${paymentPlans.find((p) => p.id === selectedPlan)?.firstPayment}
                          </span>
                        </div>
                        {Array.from(
                          { length: (paymentPlans.find((p) => p.id === selectedPlan)?.installments || 1) - 1 },
                          (_, i) => (
                            <div key={i} className="flex justify-between">
                              <span>
                                {new Date(Date.now() + (i + 1) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                              </span>
                              <span className="font-semibold">
                                ${paymentPlans.find((p) => p.id === selectedPlan)?.monthlyPayment}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={processPayment}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 py-3 text-lg font-semibold"
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        Confirm Payment Plan
                      </Button>
                      <Button
                        onClick={() => setShowPaymentOptions(false)}
                        variant="outline"
                        className="border-2 border-gray-300"
                      >
                        Back
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Features Overview */}
          {!scannedProduct && !isScanning && (
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-6 text-center">
                  <QrCode className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Instant Price Compare</h3>
                  <p className="text-sm text-gray-600">
                    Scan any product and see prices across all major retailers instantly
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-6 text-center">
                  <CreditCard className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Flexible Payments</h3>
                  <p className="text-sm text-gray-600">
                    Split any purchase into manageable payments with our AI-approved plans
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
