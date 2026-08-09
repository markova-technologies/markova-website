const fs = require('fs');

let oldHtml = fs.readFileSync('old_index.html', 'utf8');
let currHtml = fs.readFileSync('public/index.html', 'utf8');

const startTag = '<section id="ecosystem"';
const endTag = '</section>';

const oldStart = oldHtml.indexOf(startTag);
const oldEnd = oldHtml.indexOf(endTag, oldStart) + endTag.length;
const oldEco = oldHtml.substring(oldStart, oldEnd);

const currStart = currHtml.indexOf('<!-- Markova Ecosystem Section -->');
const currEnd = currHtml.indexOf('<!-- Footer -->');

if (oldStart !== -1 && currStart !== -1 && currEnd !== -1) {
    currHtml = currHtml.substring(0, currStart) + '<!-- Markova Ecosystem Section -->\n    \n    <!-- Staggered Grid Ecosystem -->\n    ' + oldEco + '\n\n\n    ' + currHtml.substring(currEnd);
    fs.writeFileSync('public/index.html', currHtml);
    console.log('Successfully injected ecosystem section into index.html');
} else {
    console.log('Failed to find markers.');
}
