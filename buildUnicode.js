const fs = require('fs');

const code = fs.readFileSync('./static/app.js', 'utf8');

const replaced = code.replace(/\\\\u\{/g, '\\u{');

fs.writeFileSync('./static/app.js', replaced);
