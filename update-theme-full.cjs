const fs = require('fs');

// Update index.html
let html = fs.readFileSync('index.html', 'utf-8');
html = html.replace(/<meta name="theme-color" content="#0a0e1a" \/>/g, 
  '<meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />\n    <meta name="theme-color" content="#0a0e1a" media="(prefers-color-scheme: dark)" />\n    <meta name="apple-mobile-web-app-capable" content="yes" />\n    <meta name="apple-mobile-web-app-status-bar-style" content="default" />');
fs.writeFileSync('index.html', html);

// Update App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf-8');

const newUpdateThemeColor = `  const updateThemeColor = (isDark: boolean) => {
    const color = isDark ? '#0a0e1a' : '#f8fafc';
    
    // Remover todos los meta theme-color para evitar conflictos con media queries de iOS/Android
    document.querySelectorAll('meta[name="theme-color"]').forEach(el => el.remove());
    
    // Crear uno nuevo con el color actual sin media query para forzar el color
    const metaThemeColor = document.createElement('meta');
    metaThemeColor.setAttribute('name', 'theme-color');
    metaThemeColor.setAttribute('content', color);
    document.head.appendChild(metaThemeColor);

    // Actualizar barra de estado en iOS Safari
    let appleMobile = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!appleMobile) {
      appleMobile = document.createElement('meta');
      appleMobile.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
      document.head.appendChild(appleMobile);
    }
    appleMobile.setAttribute('content', isDark ? 'black-translucent' : 'default');
  };`;

app = app.replace(/const updateThemeColor = \(isDark: boolean\) => \{[\s\S]*?metaThemeColor\.setAttribute\('content', isDark \? '#0a0e1a' : '#ffffff'\);\n  \};/, newUpdateThemeColor);

fs.writeFileSync('src/App.tsx', app);
