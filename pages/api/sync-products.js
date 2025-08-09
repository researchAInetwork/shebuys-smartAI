import { syncASOSCategories } from "../../lib/asosSync";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await syncASOSCategories([
      "4209", // Women's Dresses
      "4172", // Women's Tops
      "4174", // Women's Shoes
      "6458", // Women's Accessories
    ]);
    res.status(200).json({ message: "✅ ASOS sync complete" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "❌ Sync failed" });
  }
}
