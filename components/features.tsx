import { Brain, Camera, Heart, TrendingUp, DollarSign, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Brain,
    title: "Smart Style DNA",
    description: "60-second quiz reveals your unique style profile - from Boho Chic to Minimal Boss to Afro-Glam",
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: DollarSign,
    title: "Budget-Smart Shopping",
    description: "AI finds perfect outfits within your budget from top retailers like ASOS, Zara, and Jumia",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: Camera,
    title: "AR Try-On Mirror",
    description: "See how clothes look on your body type and skin tone before you buy",
    color: "from-rose-500 to-purple-500",
  },
  {
    icon: Heart,
    title: "Wishlist & Alerts",
    description: "Save favorites and get notified of sales, price drops, and perfect timing for events",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: TrendingUp,
    title: "Style Confidence Tracker",
    description: "Log daily outfits, get AI feedback, and watch your style confidence soar",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Users,
    title: "Inclusive Body Types",
    description: "See outfits on models that look like you - from XS to 5XL, all skin tones represented",
    color: "from-indigo-500 to-purple-500",
  },
]

export default function Features() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Personal Stylist, Powered by AI</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every feature designed to make you feel confident, save money, and look absolutely fabulous
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
