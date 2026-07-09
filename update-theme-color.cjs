const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const helperCode = `
  const updateThemeColor = (isDark) => {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', isDark ? '#0a0e1a' : '#ffffff');
  };
`;

// Insert the helper function right before `const toggleDarkMode`
content = content.replace(/(\/\/ 3\. Dark Mode Toggle)/, helperCode + '\n  $1');

content = content.replace(
  /document\.documentElement\.classList\.add\('dark'\);/g, 
  "document.documentElement.classList.add('dark');\n      updateThemeColor(true);"
);

content = content.replace(
  /document\.documentElement\.classList\.remove\('dark'\);/g, 
  "document.documentElement.classList.remove('dark');\n      updateThemeColor(false);"
);

fs.writeFileSync('src/App.tsx', content);
