import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const startServer = async () => {
  const app = express();
  const PORT = 3000;

  let config;
  try {
    config = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'firebase-applet-config.json'), 'utf-8'));
  } catch (err) {
    console.error('Could not load firebase-applet-config.json:', err);
  }

  let db: any = null;
  if (config) {
    const firebaseConfig = {
      projectId: config.projectId,
      appId: config.appId,
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
    };
    const appFirebase = initializeApp(firebaseConfig);
    db = getFirestore(appFirebase, config.firestoreDatabaseId);
  }

    let cachedSettings = null;
  let lastSettingsFetch = 0;
  const SETTINGS_CACHE_TTL = 1000 * 60 * 60; // 1 hour

  async function getSettings() {
    if (!db) return null;
    if (cachedSettings && (Date.now() - lastSettingsFetch < SETTINGS_CACHE_TTL)) {
      return cachedSettings;
    }
    try {
      const docRef = doc(db, 'config', 'settings');
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        cachedSettings = snapshot.data();
        lastSettingsFetch = Date.now();
        return cachedSettings;
      }
    } catch (err) {
      if (!(err instanceof Error) || !err.message.includes("Quota limit exceeded")) console.error("Error fetching settings for OG tags:", err);
      if (cachedSettings) return cachedSettings;
    }
    return null;
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
    
    app.get('*', async (req, res, next) => {
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        
        const settings = await getSettings();
        const title = settings?.storeName || 'Jhonny Solutions';
        const description = settings?.heroDescription || 'Descubre los mejores productos y servicios tecnológicos.';
        const image = settings?.heroImage || 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80';
        
        const currentUrl = 'https://' + req.get('host') + req.originalUrl;
        const ogTags = `
          <meta property="og:title" content="${title}" />
          <meta property="og:description" content="${description}" />
          <meta property="og:image" itemprop="image" content="${image}" />
          <meta property="og:image:secure_url" itemprop="image" content="${image}" />
          <meta property="og:url" content="${currentUrl}" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="${title}" />
          <meta name="image" content="${image}" />
          <link rel="image_src" href="${image}" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${title}" />
          <meta name="twitter:description" content="${description}" />
          <meta name="twitter:image" content="${image}" />
        `;
        
        template = template.replace('</head>', `${ogTags}</head>`);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
    
    app.get('*', async (req, res) => {
      try {
        let template = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
        const settings = await getSettings();
        const title = settings?.storeName || 'Jhonny Solutions';
        const description = settings?.heroDescription || 'Descubre los mejores productos y servicios tecnológicos.';
        const image = settings?.heroImage || 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80';
        
        const currentUrl = 'https://' + req.get('host') + req.originalUrl;
        const ogTags = `
          <meta property="og:title" content="${title}" />
          <meta property="og:description" content="${description}" />
          <meta property="og:image" itemprop="image" content="${image}" />
          <meta property="og:image:secure_url" itemprop="image" content="${image}" />
          <meta property="og:url" content="${currentUrl}" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="${title}" />
          <meta name="image" content="${image}" />
          <link rel="image_src" href="${image}" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${title}" />
          <meta name="twitter:description" content="${description}" />
          <meta name="twitter:image" content="${image}" />
        `;
        
        template = template.replace('</head>', `${ogTags}</head>`);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        res.status(500).end(e.message);
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
