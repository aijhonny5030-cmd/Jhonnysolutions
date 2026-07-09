const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const replacement = `
        const currentUrl = 'https://' + req.get('host') + req.originalUrl;
        const ogTags = \`
          <meta property="og:title" content="\${title}" />
          <meta property="og:description" content="\${description}" />
          <meta property="og:image" itemprop="image" content="\${image}" />
          <meta property="og:image:secure_url" itemprop="image" content="\${image}" />
          <meta property="og:url" content="\${currentUrl}" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="\${title}" />
          <meta name="image" content="\${image}" />
          <link rel="image_src" href="\${image}" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="\${title}" />
          <meta name="twitter:description" content="\${description}" />
          <meta name="twitter:image" content="\${image}" />
        \`;`;

content = content.replace(/const currentUrl = req\.protocol \+ ':\/\/' \+ req\.get\('host'\) \+ req\.originalUrl;\s*const ogTags = `[\s\S]*?`;/g, replacement.trim());

fs.writeFileSync('server.ts', content);
