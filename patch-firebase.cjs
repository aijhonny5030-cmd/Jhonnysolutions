const fs = require('fs');

let content = fs.readFileSync('src/firebase.ts', 'utf-8');

if (!content.includes('setLogLevel')) {
  content = content.replace(
    "import { getFirestore } from 'firebase/firestore';",
    "import { getFirestore, setLogLevel } from 'firebase/firestore';"
  );
  content += "\n// Suppress internal Firestore logs about idleness/quota in production\nsetLogLevel('error');\n";
  fs.writeFileSync('src/firebase.ts', content);
}
console.log('patched firebase');
