import { Button } from "@/components/ui/button"
import { Sparkles, ShoppingBag, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rose-100 via-white to-purple-100 py-8 px-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-40 h-40 bg-purple-300 rounded-full animate-float"></div>
        <div
          className="absolute bottom-20 right-20 w-32 h-32 bg-rose-300 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-10 w-24 h-24 bg-indigo-300 rounded-full animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-rose-600 animate-fade-in-up">
                <Sparkles className="w-6 h-6 animate-spin" />
                <span className="font-semibold">AI-Powered Fashion Assistant</span>
              </div>
              <h1
                className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                Shop Wise.
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
                  {" "}
                  Slay Always.
                </span>
              </h1>
              <p
                className="text-xl text-gray-600 leading-relaxed animate-fade-in-up"
                style={{ animationDelay: "0.4s" }}
              >
                Your personal AI stylist that helps you dress confidently, shop intentionally, and look fabulous on any
                budget. Discover your Style DNA and transform your wardrobe with revolutionary AI features.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              <Link href="/quiz">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
                  Discover Your Style DNA
                </Button>
              </Link>
              <Link href="/ai-features">
                <Button
                  variant="outline"
                  size="lg"
                  className="group border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-4 text-lg font-semibold bg-transparent transform hover:scale-105 transition-all duration-300"
                >
                  <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Explore AI Features
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-4 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Happy Stylistas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">$2M+</div>
                <div className="text-sm text-gray-600">Money Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4.9★</div>
                <div className="text-sm text-gray-600">App Rating</div>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in-up space-y-6" style={{ animationDelay: "1s" }}>
            <div className="relative z-10">
              {/* Beautiful Fashion Hero Image */}
              <div className="relative w-full max-w-lg mr-0 ml-auto">
                <div className="aspect-[4/3] bg-gradient-to-br from-rose-200 via-purple-100 to-indigo-200 rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-500">
                  {/* Stylish Fashion Illustration */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4 p-6">
                      {/* Fashion Icons */}
                      <div className="flex justify-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-rose-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: "0.2s" }}>
                          <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        <div className="w-10 h-10 bg-indigo-400 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: "0.4s" }}>
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      
                      {/* Stylish Woman Silhouette */}
                      <div className="relative">
                        <div className="w-24 h-32 mx-auto bg-gradient-to-b from-gray-700 to-gray-900 rounded-full relative overflow-hidden shadow-xl">
                          {/* Hair */}
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-18 h-12 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full"></div>
                          {/* Face */}
                          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-12 h-16 bg-gradient-to-b from-amber-100 to-amber-200 rounded-full"></div>
                          {/* Stylish Outfit */}
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-18 bg-gradient-to-b from-rose-500 to-purple-600 rounded-t-full"></div>
                        </div>
                        
                        {/* Fashion Accessories */}
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full shadow-lg animate-pulse"></div>
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-pink-400 rounded-full shadow-lg animate-pulse" style={{ animationDelay: "1s" }}></div>
                      </div>
                      
                      {/* Style Elements */}
                      <div className="space-y-2">
                        <div className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                          Style DNA
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          AI-Powered Fashion
                        </div>
                      </div>
                      
                      {/* Floating Style Tags */}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-rose-600 shadow-lg animate-float">
                        Chic
                      </div>
                      <div className="absolute top-16 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-purple-600 shadow-lg animate-float" style={{ animationDelay: "1s" }}>
                        Smart
                      </div>
                      <div className="absolute bottom-16 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-indigo-600 shadow-lg animate-float" style={{ animationDelay: "2s" }}>
                        Trendy
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Start Shopping Smart Button - Positioned under the image */}
            <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: "1.2s" }}>
              <Link href="/shop">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-purple-500 to-rose-500 hover:from-purple-600 hover:to-rose-600 px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-xl text-white"
                >
                  <ShoppingBag className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Start Shopping Smart
                </Button>
              </Link>
            </div>
            
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-rose-300 to-purple-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
            <div
              className="absolute -bottom-4 -left-4 w-64 h-64 bg-gradient-to-br from-purple-300 to-rose-300 rounded-full opacity-20 blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  )
}
