const fs = require('fs');

let content = fs.readFileSync('src/db.ts', 'utf-8');

content = content.replace(
    'console.error(`Error getting collection ${colName}`, err);',
    'if (!(err instanceof Error) || !err.message.includes("Quota limit exceeded")) console.error(`Error getting collection ${colName}`, err);'
);

content = content.replace(
    'console.error("Error getting settings", err);',
    'if (!(err instanceof Error) || !err.message.includes("Quota limit exceeded")) console.error("Error getting settings", err);'
);

content = content.replace(
    /console\.error\("Firebase write error:", err\);/g,
    'if (!(err instanceof Error) || !err.message.includes("Quota limit exceeded")) console.error("Firebase write error:", err);'
);

fs.writeFileSync('src/db.ts', content);

let server = fs.readFileSync('server.ts', 'utf-8');
server = server.replace(
    'console.error("Error fetching settings for OG tags:", err);',
    'if (!(err instanceof Error) || !err.message.includes("Quota limit exceeded")) console.error("Error fetching settings for OG tags:", err);'
);

fs.writeFileSync('server.ts', server);

console.log('patched logs');
