const fs = require('fs');
let currHtml = fs.readFileSync('c:/worrk/Markova-Website/public/index.html', 'utf8');
let oldHtml = fs.readFileSync('c:/worrk/Markova-Website/old_index.html', 'utf8');

const getEcosystem = (html) => {
    const start = html.indexOf('<section id="ecosystem"');
    const end = html.indexOf('</section>', start) + '</section>'.length;
    return html.substring(start, end);
};

const oldEco = getEcosystem(oldHtml);
const currStart = currHtml.indexOf('<section id="ecosystem"');
const currEnd = currHtml.indexOf('</section>', currStart) + '</section>'.length;

currHtml = currHtml.substring(0, currStart) + oldEco + currHtml.substring(currEnd);

fs.writeFileSync('c:/worrk/Markova-Website/public/index.html', currHtml);
console.log('Restored ecosystem section.');
