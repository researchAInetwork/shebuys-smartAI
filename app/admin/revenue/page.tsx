import RevenueAnalytics from "@/components/revenue-analytics"

export default function RevenueAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 py-8 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Revenue Analytics</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Track affiliate commissions, sponsored content, and conversion metrics</p>
        </div>
        
        <RevenueAnalytics />
      </div>
    </div>
  )
}
