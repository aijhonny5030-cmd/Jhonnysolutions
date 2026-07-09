import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc, getDocs, collection } from "firebase/firestore";
import { readFileSync } from "fs";

const config = JSON.parse(readFileSync("./firebase-applet-config.json", "utf8"));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function test() {
  try {
    const pImageUrl = "data:image/jpeg;base64," + "A".repeat(100000); // 100kb data URL
    const product = {
      id: `prod-${Date.now()}`,
      name: "Test Data URL",
      description: "Desc",
      price: 10,
      imageUrl: pImageUrl,
      category: "Test",
      stock: 10,
      isNew: true,
      onSale: false,
      featured: false,
      rating: 5,
      reviews: 0,
      features: []
    };
    console.log("Saving product...");
    await setDoc(doc(db, 'products', product.id), product);
    console.log("Saved.");
    
    console.log("Fetching...");
    const snap = await getDocs(collection(db, "products"));
    console.log("Products in DB:", snap.size);
    process.exit(0);
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  }
}
test();
