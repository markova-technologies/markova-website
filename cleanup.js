const fs = require("fs");
let html = fs.readFileSync("public/index.html", "utf8");

// Remove commented out sections
html = html.replace(/<!--\s*Cursor Effect Removed\s*-->/gi, '');
html = html.replace(/<!--\s*Back to Top Button Removed[\s\S]*?-->/gi, '');

// Save it back
fs.writeFileSync("public/index.html", html, "utf8");
console.log("Cleanup done.");
