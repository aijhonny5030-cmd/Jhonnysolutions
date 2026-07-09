const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');
css = css.replace('.hero-section {\n  background: linear-gradient(160deg, #0a0e1a 0%, #1a1040 40%, #0f172a 70%, #0a0e1a 100%);', 
  '.hero-section {\n  background: linear-gradient(160deg, #f8fafc 0%, #e0f2fe 40%, #f1f5f9 70%, #f8fafc 100%);\n}\n:is(.dark .hero-section) {\n  background: linear-gradient(160deg, #0a0e1a 0%, #1a1040 40%, #0f172a 70%, #0a0e1a 100%);');
fs.writeFileSync('src/index.css', css);
