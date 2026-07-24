const fs = require("fs");

let html = fs.readFileSync("public/index.html", "utf8");

function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

// Regex to find option lines with the broken mojibake
// Example: <option value="+93">=ƒçª=ƒç½ +93 (AF)</option>
const regex = /<option value="([^"]+)">[^<]+\+([0-9]+)\s+\(([A-Z]{2})\)<\/option>/g;

html = html.replace(regex, (match, val, code, country) => {
    const flag = getFlagEmoji(country);
    return `<option value="${val}">${flag} +${code} (${country})</option>`;
});

fs.writeFileSync("public/index.html", html, "utf8");
console.log("Flags fixed.");
