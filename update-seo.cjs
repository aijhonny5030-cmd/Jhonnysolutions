const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');

const headContentStart = indexHtml.indexOf('<meta charset="UTF-8" />');
const headContentEnd = indexHtml.indexOf('</head>');

if (headContentStart !== -1 && headContentEnd !== -1) {
  const originalHeadPrefix = indexHtml.substring(0, headContentStart);
  
  const newHeadContent = `<meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#0a0e1a" media="(prefers-color-scheme: dark)" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    
    <!-- Primary Meta Tags -->
    <title>Jhonny Solutions Store</title>
    <meta name="title" content="Jhonny Solutions Store" />
    <meta name="description" content="Descubre los mejores productos y servicios tecnológicos con la calidad, garantía y asesoría experta que mereces. Explora nuestro catálogo premium hoy mismo." />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://jhonny-solutions.vercel.app/" />
    
    <!-- Icons -->
    <link rel="icon" type="image/png" href="https://imglink.cc/cdn/TcN4HtqbUG.png" />
    <link rel="shortcut icon" href="https://imglink.cc/cdn/TcN4HtqbUG.png" />
    <link rel="apple-touch-icon" href="https://imglink.cc/cdn/TcN4HtqbUG.png" />

    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://jhonny-solutions.vercel.app/" />
    <meta property="og:site_name" content="Jhonny Solutions" />
    <meta property="og:title" content="Jhonny Solutions" />
    <meta property="og:description" content="Descubre los mejores productos y servicios tecnológicos con la calidad, garantía y asesoría experta que mereces. Explora nuestro catálogo premium hoy mismo." />
    <meta property="og:locale" content="es_ES" />
    <meta property="og:image" itemprop="image" content="https://imglink.cc/cdn/TcN4HtqbUG.png" />
    <meta property="og:image:secure_url" itemprop="image" content="https://imglink.cc/cdn/TcN4HtqbUG.png" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://jhonny-solutions.vercel.app/" />
    <meta name="twitter:title" content="Jhonny Solutions" />
    <meta name="twitter:description" content="Descubre los mejores productos y servicios tecnológicos con la calidad, garantía y asesoría experta que mereces. Explora nuestro catálogo premium hoy mismo." />
    <meta name="twitter:image" content="https://imglink.cc/cdn/TcN4HtqbUG.png" />
    
    <!-- WhatsApp Specific -->
    <meta name="image" content="https://imglink.cc/cdn/TcN4HtqbUG.png" />
    <link rel="image_src" href="https://imglink.cc/cdn/TcN4HtqbUG.png" />
  `;

  const newHtml = originalHeadPrefix + newHeadContent + indexHtml.substring(headContentEnd);
  fs.writeFileSync('index.html', newHtml);
  console.log('index.html updated successfully.');
} else {
  console.log('Could not find proper insertion points in index.html');
}
