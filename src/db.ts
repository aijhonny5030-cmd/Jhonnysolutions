import { collection, doc, getDocs, setDoc, deleteDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Product, Testimonial, Message, StoreSettings } from './types';
import { INITIAL_PRODUCTS, INITIAL_TESTIMONIALS, DEFAULT_SETTINGS } from './data';

// Generic sync function for collections
export function subscribeToCollection<T>(
  colName: string,
  callback: (data: T[]) => void,
  fallbackData: T[] = []
) {
  const colRef = collection(db, colName);
  
  // Try to load initial data if collection is empty
  getDocs(colRef).then(snapshot => {
    if (snapshot.empty && fallbackData.length > 0) {
      fallbackData.forEach(async (item: any) => {
        const docRef = doc(db, colName, item.id);
        await setDoc(docRef, item);
      });
    }
  }).catch(err => console.error(`Error getting collection ${colName}`, err));

  return onSnapshot(colRef, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    callback(data);
  }, (error) => {
    console.error(`Error subscribing to collection ${colName}`, error);
    callback(fallbackData as T[]);
  });
}

// Subscriptions
export function subscribeToProducts(callback: (products: Product[]) => void) {
  return subscribeToCollection<Product>('products', callback, []);
}

export function subscribeToTestimonials(callback: (testimonials: Testimonial[]) => void) {
  return subscribeToCollection<Testimonial>('testimonials', callback, []);
}

export function subscribeToMessages(callback: (messages: Message[]) => void) {
  return subscribeToCollection<Message>('messages', callback, []);
}

// Settings are a single document
export function subscribeToSettings(callback: (settings: StoreSettings) => void) {
  const docRef = doc(db, 'config', 'settings');
  
  getDoc(docRef).then(snapshot => {
    if (!snapshot.exists()) {
      setDoc(docRef, DEFAULT_SETTINGS).then(() => {
        // Will be triggered by onSnapshot
      }).catch(err => console.error("Error setting default config", err));
    }
  }).catch(err => {
    console.error("Error getting settings", err);
    callback(DEFAULT_SETTINGS);
  });

  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as StoreSettings);
    } else {
      callback(DEFAULT_SETTINGS);
    }
  }, (error) => {
    console.error("Error subscribing to settings", error);
    callback(DEFAULT_SETTINGS);
  });
}

// Write functions
export async function saveProduct(product: Product) {
  // Strip undefined values before saving to Firestore
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
