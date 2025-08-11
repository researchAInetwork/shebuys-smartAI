// lib/asosSync.js
require("dotenv").config({ path: ".env.local" });
const axios = require("axios");
const admin = require("firebase-admin");

// Firebase init using ENV variable (works on Vercel)
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// Fetch products from ASOS
async function fetchASOSProducts(categoryId = "4209", limit = 50) {
  try {
    const res = await axios.get("https://asos2.p.rapidapi.com/products/v2/list", {
      params: {
        store: "US",
        offset: "0",
        categoryId: categoryId,
        limit: limit,
        country: "US",
        sort: "freshness",
        currency: "USD",
        sizeSchema: "US",
        lang: "en-US",
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "asos2.p.rapidapi.com",
      },
    });
    return res.data.products || [];
  } catch (err) {
    console.error("❌ ASOS fetch failed:", err.message);
    return [];
  }
}

// Save to Firebase
async function saveToFirebase(products) {
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
      style_dna: ["Chic & Minimal", "Bold & Trendy"], // Placeholder tags
      size_options: ["S", "M", "L"], // Placeholder sizes
      color: p.colour,
      description: p.name,
      popularity: Math.floor(Math.random() * 50) + 50,
      affiliate_url: `https://asos.com/${p.url}`,
      in_stock: true,
    });
  });
  await batch.commit();
  console.log(`✅ Imported ${products.length} products to Firebase`);
}

// Main sync function
async function syncASOSCategories(categoryIds = []) {
  for (let catId of categoryIds) {
    console.log(`📦 Fetching category ${catId}...`);
    const products = await fetchASOSProducts(catId, 50);
    if (products.length) {
      await saveToFirebase(products);
    }
  }
}

module.exports = { syncASOSCategories };
