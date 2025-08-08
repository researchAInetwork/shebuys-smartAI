"use client"

import { useState, useEffect } from "react"
import Hero from "@/components/hero"
import Features from "@/components/features"
import StyleDNAPreview from "@/components/style-dna-preview"
import InteractiveDemo from "@/components/interactive-demo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, ArrowRight } from "lucide-react"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
    >
      <Hero />
      <InteractiveDemo />
      <Features />
      <StyleDNAPreview />

      {/* Enhanced CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-400 via-purple-500 to-indigo-600 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full animate-float"></div>
        <div
          className="absolute bottom-10 right-10 w-16 h-16 bg-white/20 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/20 rounded-full animate-float"
          style={{ animationDelay: "4s" }}
        ></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <div className="mb-8">
            <Sparkles className="w-16 h-16 mx-auto mb-4 animate-pulse" />
            <h2 className="text-5xl font-bold mb-6 animate-fade-in-up">Ready to Transform Your Style?</h2>
            <p className="text-xl mb-8 opacity-90 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Join thousands of women who shop wise and slay always
            </p>
          </div>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Link href="/quiz">
              <Button
                size="lg"
                className="group bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
                Start Your Style Journey
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/shop">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold bg-transparent transform hover:scale-105 transition-all duration-300"
              >
                Explore Collections
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
