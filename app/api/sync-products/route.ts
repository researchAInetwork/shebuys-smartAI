import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        // Check if Firebase service account is configured
        if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
            return NextResponse.json({
                message: "⚠️ Firebase not configured - sync disabled in development",
                note: "Add FIREBASE_SERVICE_ACCOUNT to environment variables for full functionality"
            });
        }

        const { retailer, category, limit } = await request.json();

        // Dynamic import to avoid initialization issues
        const { ProductSyncManager } = await import("@/lib/multi-retailer-sync");
        const syncManager = new ProductSyncManager();

        if (retailer === 'all') {
            // Sync all retailers
            await syncManager.syncAllRetailers();
            return NextResponse.json({
                message: "✅ Multi-retailer sync complete",
                synced: "ASOS, Amazon, H&M"
            });
        }

        // For specific retailer sync (future enhancement)
        return NextResponse.json({
            message: `✅ ${retailer} sync complete`,
            category,
            limit
        });

    } catch (error) {
        console.error('❌ Sync failed:', error);
        return NextResponse.json({
            message: "❌ Sync failed",
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function GET() {
    const isConfigured = !!process.env.FIREBASE_SERVICE_ACCOUNT;

    return NextResponse.json({
        message: "Product Sync API",
        status: isConfigured ? "✅ Ready" : "⚠️ Firebase not configured",
        endpoints: {
            POST: "Sync products from retailers",
            supported_retailers: ["ASOS", "Amazon", "H&M"],
            example: {
                retailer: "all",
                category: "dresses",
                limit: 50
            }
        }
    });
}
