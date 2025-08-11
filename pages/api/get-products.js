import admin from "firebase-admin";

if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const snapshot = await db.collection("products").limit(50).get();
        const products = snapshot.docs.map(doc => doc.data());
        res.status(200).json(products);
    } catch (err) {
        console.error("❌ Error fetching products:", err);
        res.status(500).json({ error: "Failed to fetch products" });
    }
}
