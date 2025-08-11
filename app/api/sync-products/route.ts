import { NextResponse } from "next/server";
import axios from "axios";
import admin from "firebase-admin";

// Initialize Firebase once
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function fetchASOSProducts(categoryId: string, limit = 50) {
  try {
    const res = await axios.get("https://asos2.p.rapidapi.com/products/v2/list", {
      params: {
        store: "US",
        offset: "0",
        categoryId,
        limit,
        country: "US",
        sort: "freshness",
        currency: "USD",
        sizeSchema: "US",
        lang: "en-US",
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY as string,
        "X-RapidAPI-Host": "asos2.p.rapidapi.com",
      },
    });

    return res.data.products || [];
  } catch (err: any) {
    console.error(`❌ ASOS fetch failed for category ${categoryId}:`, err.message);
    return [];
  }
}

async function saveToFirebase(products: any[]) {
  const batch = db.batch();

  products.forEach((p) => {
    const docRef = db.collection("products").doc(p.id.toString());
    batch.set(docRef, {
      id: p.id,
      name: p.name,
      brand: p.brandName,
      price: p.price.current.value,
      currency: p.price.currency,
      image_url: p.imageUrl.startsWith("http") ? p.imageUrl : `https://${p.imageUrl}`,
      category: p.productType?.name || "Uncategorized",
      style_dna: ["Chic & Minimal", "Bold & Trendy"], // Placeholder
      size_options: ["S", "M", "L"], // Placeholder
      color: p.colour,
      description: p.name,
      popularity: Math.floor(Math.random() * 50) + 50,
      affiliate_url: `https://asos.com/${p.url}`,
      in_stock: true,
    });
  });

  await batch.commit();
}

export async function POST() {
  try {
    const categoryIds = [
      "4209", // Women's Dresses
      "4172", // Women's Tops
      "4174", // Women's Shoes
      "6458", // Women's Accessories
    ];

    for (const catId of categoryIds) {
      console.log(`📦 Fetching category ${catId}...`);
      const products = await fetchASOSProducts(catId);
      if (products.length) {
        await saveToFirebase(products);
      }
    }

    return NextResponse.json({ message: "✅ ASOS sync complete" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "❌ Sync failed" }, { status: 500 });
  }
}
