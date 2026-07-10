const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');

// Replace OG image URLs
indexHtml = indexHtml.replace(/content="https:\/\/imglink\.cc\/cdn\/TcN4HtqbUG\.png"/g, (match, offset, string) => {
  // Check if it's an og:image, twitter:image, image, or image_src tag
  const beforeContext = string.substring(offset - 40, offset);
  if (beforeContext.includes('og:image') || beforeContext.includes('twitter:image') || beforeContext.includes('name="image"')) {
    return 'content="https://jhonnysolutions.vercel.app/og-image.png"';
  }
  return match;
});

indexHtml = indexHtml.replace(/href="https:\/\/imglink\.cc\/cdn\/TcN4HtqbUG\.png"/g, (match, offset, string) => {
  const beforeContext = string.substring(offset - 30, offset);
  if (beforeContext.includes('image_src')) {
    return 'href="https://jhonnysolutions.vercel.app/og-image.png"';
  }
  return match;
});

fs.writeFileSync('index.html', indexHtml);
console.log('index.html updated successfully with local OG images.');
