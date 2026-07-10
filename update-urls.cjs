const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/https:\/\/jhonny-solutions\.vercel\.app\//g, 'https://jhonnysolutions.vercel.app/');
html = html.replace(/Jhonny Solutions Store/g, 'Jhonny Solutions'); // Ensure it just says Jhonny Solutions

fs.writeFileSync('index.html', html);
console.log('URLs updated.');
