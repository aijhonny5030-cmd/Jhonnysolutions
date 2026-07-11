import { collection, doc, getDocs, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Product, Testimonial, Message, StoreSettings } from './types';
import { INITIAL_PRODUCTS, INITIAL_TESTIMONIALS, DEFAULT_SETTINGS } from './data';

const CACHE_EXPIRATION = 1000 * 60 * 30; // 30 minutes

export async function fetchCollection<T>(
  colName: string,
  fallbackData: T[] = []
): Promise<T[]> {
  const cacheKey = `jstore_cache_${colName}`;
  const cachedData = localStorage.getItem(cacheKey);
  const cacheTime = localStorage.getItem(`${cacheKey}_time`);
  
  if (cachedData && cacheTime && (Date.now() - parseInt(cacheTime) < CACHE_EXPIRATION)) {
    try {
      return JSON.parse(cachedData);
    } catch (e) {
      console.error("Cache parsing error", e);
    }
  }

  const colRef = collection(db, colName);
  try {
    const snapshot = await getDocs(colRef);
    if (snapshot.empty && fallbackData.length > 0) {
      for (const item of fallbackData) {
        const docRef = doc(db, colName, (item as any).id);
        await setDoc(docRef, item);
      }
      localStorage.setItem(cacheKey, JSON.stringify(fallbackData));
      localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
      return fallbackData;
    }
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    localStorage.setItem(cacheKey, JSON.stringify(data));
    localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
    return data;
  } catch (err) {
    if (!(err instanceof Error) || !err.message.includes("Quota limit exceeded")) console.error(`Error getting collection ${colName}`, err);
    if (cachedData) {
        return JSON.parse(cachedData);
    }
    return fallbackData;
  }
}

export function fetchProducts() {
  return fetchCollection<Product>('products', INITIAL_PRODUCTS);
}

export function fetchTestimonials() {
  return fetchCollection<Testimonial>('testimonials', INITIAL_TESTIMONIALS);
}

export function fetchMessages() {
  return fetchCollection<Message>('messages', []);
}

export async function fetchSettings(): Promise<StoreSettings> {
  const cacheKey = 'jstore_cache_settings';
  const cachedData = localStorage.getItem(cacheKey);
  const cacheTime = localStorage.getItem(`${cacheKey}_time`);
  
  if (cachedData && cacheTime && (Date.now() - parseInt(cacheTime) < CACHE_EXPIRATION)) {
    try {
      return JSON.parse(cachedData);
    } catch (e) {}
  }

  const docRef = doc(db, 'config', 'settings');
  try {
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      await setDoc(docRef, DEFAULT_SETTINGS);
      localStorage.setItem(cacheKey, JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
      return DEFAULT_SETTINGS;
    }
    const data = snapshot.data() as StoreSettings;
    localStorage.setItem(cacheKey, JSON.stringify(data));
    localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
    return data;
  } catch (err) {
    if (!(err instanceof Error) || !err.message.includes("Quota limit exceeded")) console.error("Error getting settings", err);
    if (cachedData) return JSON.parse(cachedData);
    return DEFAULT_SETTINGS;
  }
}

function updateCacheItem<T extends { id: string }>(colName: string, item: T, isDelete = false) {
  const cacheKey = `jstore_cache_${colName}`;
  const cachedData = localStorage.getItem(cacheKey);
  
  try {
    let data: T[] = cachedData ? JSON.parse(cachedData) : [];
    if (isDelete) {
      data = data.filter(d => d.id !== item.id);
    } else {
      const index = data.findIndex(d => d.id === item.id);
      if (index >= 0) {
        data[index] = item;
      } else {
        data.unshift(item);
      }
    }
    localStorage.setItem(cacheKey, JSON.stringify(data));
    localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
  } catch (e) {
    console.error("Error updating cache", e);
  }
}

// Write functions
export async function saveProduct(product: Product) {
  const cleanProduct = Object.fromEntries(
    Object.entries(product).filter(([_, v]) => v !== undefined)
  ) as Product;
  
  // Try to write to Firestore, but don't crash if it fails (e.g. write quota exceeded)
  try {
    await setDoc(doc(db, 'products', cleanProduct.id), cleanProduct);
  } catch (err) {
    if (!(err instanceof Error) || !err.message.includes("Quota limit exceeded")) console.error("Firebase write error:", err);
  }
  
  // Always update the cache so the app keeps working offline/over-quota
  updateCacheItem('products', cleanProduct);
}

export async function deleteProduct(id: string) {
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (err) {
    if (!(err instanceof Error) || !err.message.includes("Quota limit exceeded")) console.error("Firebase write error:", err);
  }
  updateCacheItem('products', { id } as any, true);
}

export async function saveTestimonial(testimonial: Testimonial) {
  const cleanTestimonial = Object.fromEntries(
    Object.entries(testimonial).filter(([_, v]) => v !== undefined)
  ) as Testimonial;
  
  try {
    await setDoc(doc(db, 'testimonials', cleanTestimonial.id), cleanTestimonial);
  } catch (err) {
    if (!(err instanceof Error) || !err.message.includes("Quota limit exceeded")) console.error("Firebase write error:", err);
  }
  
  updateCacheItem('testimonials', cleanTestimonial);
}

export async function deleteTestimonial(id: string) {
  try {
    await deleteDoc(doc(db, 'testimonials', id));
  } catch (err) {
    if (!(err instanceof Error) || !err.message.includes("Quota limit exceeded")) console.error("Firebase write error:", err);
  }
  updateCacheItem('testimonials', { id } as any, true);
}

export async function saveMessage(message: Message) {
  const cleanMessage = Object.fromEntries(
    Object.entries(message).filter(([_, v]) => v !== undefined)
  ) as Message;
  
  try {
    await setDoc(doc(db, 'messages', cleanMessage.id), cleanMessage);
  } catch (err) {
    if (!(err instanceof Error) || !err.message.includes("Quota limit exceeded")) console.error("Firebase write error:", err);
  }
  
  updateCacheItem('messages', cleanMessage);
}

export async function deleteMessage(id: string) {
  try {
    await deleteDoc(doc(db, 'messages', id));
  } catch (err) {
    if (!(err instanceof Error) || !err.message.includes("Quota limit exceeded")) console.error("Firebase write error:", err);
  }
  updateCacheItem('messages', { id } as any, true);
}

export async function saveSettings(settings: StoreSettings) {
  const cleanSettings = Object.fromEntries(
    Object.entries(settings).filter(([_, v]) => v !== undefined)
  ) as StoreSettings;
  
  try {
    await setDoc(doc(db, 'config', 'settings'), cleanSettings);
  } catch (err) {
    if (!(err instanceof Error) || !err.message.includes("Quota limit exceeded")) console.error("Firebase write error:", err);
  }
  
  const cacheKey = 'jstore_cache_settings';
  localStorage.setItem(cacheKey, JSON.stringify(cleanSettings));
  localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
}
