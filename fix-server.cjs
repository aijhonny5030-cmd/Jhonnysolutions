const fs = require('fs');

let serverContent = fs.readFileSync('server.ts', 'utf-8');

const newGetSettings = `  let cachedSettings = null;
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
      console.error("Error fetching settings for OG tags:", err);
      if (cachedSettings) return cachedSettings;
    }
    return null;
  }`;

serverContent = serverContent.replace(/async function getSettings\(\) \{[\s\S]*?return null;\n  \}/, newGetSettings);

fs.writeFileSync('server.ts', serverContent);
console.log('server.ts updated');
