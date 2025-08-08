"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Gift, ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/components/cart-provider"

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice, clearCart } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "shebuys10") {
      setDiscount(totalPrice * 0.1)
    } else if (promoCode.toLowerCase() === "welcome20") {
      setDiscount(totalPrice * 0.2)
    } else {
      setDiscount(0)
    }
  }

  const finalTotal = totalPrice - discount
  const savings =
    items.reduce((sum, item) => {
      // Assuming 20% savings on average
      return sum + item.price * item.quantity * 0.2
    }, 0) + discount

  const handleCheckout = () => {
    setIsCheckingOut(true)
    // Simulate checkout process
    setTimeout(() => {
      alert("🎉 Order placed successfully! You're going to look amazing!")
      clearCart()
      setIsCheckingOut(false)
    }, 2000)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Link href="/shop" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </Link>

          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="text-gray-400 mb-6">
              <ShoppingBag className="w-24 h-24 mx-auto animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 text-lg">Ready to find your perfect style? Let's go shopping!</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quiz">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 px-8 py-4 text-lg font-semibold"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Take Style Quiz
                </Button>
              </Link>
              <Link href="/shop">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-4 text-lg font-semibold bg-transparent"
                >
                  Browse Collections
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/shop" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </Link>

          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-rose-100 rounded-full px-6 py-3 mb-4 shadow-lg">
            <ShoppingBag className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-600">Shopping Cart</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Style Selection ✨</h1>
          <p className="text-gray-600 text-lg">{totalItems} amazing pieces ready to make you shine</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                          <p className="text-gray-600">{item.brand}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-purple-300 hover:bg-purple-50 transition-all"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-medium text-lg w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-purple-300 hover:bg-purple-50 transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-500">${item.price} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl sticky top-24 bg-gradient-to-br from-white to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Gift className="w-5 h-5 text-purple-600" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Promo Code */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Promo Code</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="border-2 focus:border-purple-300"
                    />
                    <Button
                      onClick={applyPromoCode}
                      variant="outline"
                      className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 bg-transparent"
                    >
                      Apply
                    </Button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">Try: SHEBUYS10 or WELCOME20</div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Promo Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>

                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-purple-600">${finalTotal.toFixed(2)}</span>
                  </div>

                  {savings > 0 && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-700 font-medium">🎉 You're saving ${savings.toFixed(2)}!</p>
                    </div>
                  )}
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="loading-spinner w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Secure Checkout
                    </>
                  )}
                </Button>

                {/* Security Badge */}
                <div className="text-center pt-4">
                  <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    Secure SSL Encryption
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
