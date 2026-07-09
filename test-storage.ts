import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString } from 'firebase/storage';
import config from './firebase-applet-config.json';

const app = initializeApp({
  ...config
});
const storage = getStorage(app);
const testRef = ref(storage, 'test.txt');
uploadString(testRef, 'hello world').then(() => {
  console.log("Storage upload success");
}).catch(e => {
  console.error("Storage upload failed", e.message);
});
