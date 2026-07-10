const fs = require('fs');
let dbContent = `import { collection, doc, getDocs, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Product, Testimonial, Message, StoreSettings } from './types';
import { INITIAL_PRODUCTS, INITIAL_TESTIMONIALS, DEFAULT_SETTINGS } from './data';

// Generic fetch function for collections
export async function fetchCollection<T>(
  colName: string,
  fallbackData: T[] = []
): Promise<T[]> {
  const colRef = collection(db, colName);
  try {
    const snapshot = await getDocs(colRef);
    if (snapshot.empty && fallbackData.length > 0) {
      for (const item of fallbackData) {
        const docRef = doc(db, colName, (item as any).id);
        await setDoc(docRef, item);
      }
      return fallbackData;
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  } catch (err) {
    console.error(\`Error getting collection \${colName}\`, err);
    return fallbackData;
  }
}

// Fetch functions
export function fetchProducts() {
  return fetchCollection<Product>('products', INITIAL_PRODUCTS);
}

export function fetchTestimonials() {
  return fetchCollection<Testimonial>('testimonials', INITIAL_TESTIMONIALS);
}

export function fetchMessages() {
  return fetchCollection<Message>('messages', []);
}

// Settings are a single document
export async function fetchSettings(): Promise<StoreSettings> {
  const docRef = doc(db, 'config', 'settings');
  try {
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      await setDoc(docRef, DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    return snapshot.data() as StoreSettings;
  } catch (err) {
    console.error("Error getting settings", err);
    return DEFAULT_SETTINGS;
  }
}

// Write functions
export async function saveProduct(product: Product) {
  const cleanProduct = Object.fromEntries(
    Object.entries(product).filter(([_, v]) => v !== undefined)
  ) as Product;
  await setDoc(doc(db, 'products', cleanProduct.id), cleanProduct);
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, 'products', id));
}

export async function saveTestimonial(testimonial: Testimonial) {
  const cleanTestimonial = Object.fromEntries(
    Object.entries(testimonial).filter(([_, v]) => v !== undefined)
  ) as Testimonial;
  await setDoc(doc(db, 'testimonials', cleanTestimonial.id), cleanTestimonial);
}

export async function deleteTestimonial(id: string) {
  await deleteDoc(doc(db, 'testimonials', id));
}

export async function saveMessage(message: Message) {
  const cleanMessage = Object.fromEntries(
    Object.entries(message).filter(([_, v]) => v !== undefined)
  ) as Message;
  await setDoc(doc(db, 'messages', cleanMessage.id), cleanMessage);
}

export async function deleteMessage(id: string) {
  await deleteDoc(doc(db, 'messages', id));
}

export async function saveSettings(settings: StoreSettings) {
  const cleanSettings = Object.fromEntries(
    Object.entries(settings).filter(([_, v]) => v !== undefined)
  ) as StoreSettings;
  await setDoc(doc(db, 'config', 'settings'), cleanSettings);
}
`;
fs.writeFileSync('src/db.ts', dbContent);
