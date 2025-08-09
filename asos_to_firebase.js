require("dotenv").config({ path: ".env.local" });
const axios = require("axios");
const admin = require("firebase-admin");
const fs = require("fs");

// Load Firebase service account
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Fetch products from ASOS API
async function fetchASOSProducts(categoryId = "4209", limit = 50) {
  try {
    const response = await axios.get("https://asos2.p.rapidapi.com/products/v2/list", {
      params: {
        store: "US",
        offset: "0",
        categoryId: categoryId, // 4209 = Women's Dresses
        limit: limit,
        country: "US",
        sort: "freshness",
        currency: "USD",
        sizeSchema: "US",
        lang: "en-US"
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "asos2.p.rapidapi.com"
      }
    });

    return response.data.products || [];
  } catch (error) {
    console.error("Error fetching ASOS products:", error.message);
    return [];
  }
}

// Save products to Firebase
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
      style_dna: ["Chic & Minimal", "Bold & Trendy"], // Placeholder, can be AI-tagged later
      size_options: ["S", "M", "L"], // Placeholder
      color: p.colour,
      description: p.name,
      popularity: Math.floor(Math.random() * 50) + 50,
      affiliate_url: `https://asos.com/${p.url}`,
      in_stock: true
    });
  });

  await batch.commit();
  console.log(`✅ Imported ${products.length} products to Firebase`);
}

// Main function
(async () => {
  const products = await fetchASOSProducts("4209", 50); // Women's dresses
  if (products.length) {
    await saveToFirebase(products);
  }
})();
