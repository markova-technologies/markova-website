const fs = require('fs');

let indexContent = fs.readFileSync('public/index.html', 'utf8');
const vizContent = fs.readFileSync('public/workforce-viz.html', 'utf8');

const match = vizContent.match(/(<div class="workforce-viz-full">[\s\S]*?<!-- Tooltip Portal -->\s*<div id="vizTooltip" class="viz-tooltip">Tooltip text<\/div>\s*<\/div>)/);

if (match) {
    const diagramHtml = match[1];
    
    const targetStr = `Explore the Full Operating Model <i class="fas fa-arrow-right"></i>
                </a>
            </div>

        </div>
    </section>`;
    
    const newSection = `
    <!-- Visual Operation Section -->
    <section id="visual-operation" class="viz-hero" style="padding-top: 5rem; padding-bottom: 5rem;">
        <div class="container">
            <div class="section-badge" style="background: rgba(161,140,209,.1); border-color: rgba(161,140,209,.2);">
                <i class="fas fa-network-wired" style="color: #a18cd1;"></i>
                <span style="color: #a18cd1;">Live Visualization</span>
            </div>
            <h2 class="section-title">One business.<br><span style="color: var(--primary-color);">A workforce of AI specialists.</span></h2>
            <p class="section-subtitle">Watch in real time as the Commander AI receives a business objective and coordinates specialized agents to complete the work &mdash; no human intervention required.</p>
            
            <div class="viz-page-wrapper" style="margin-top: 3rem;">
                ${diagramHtml}
            </div>
        </div>
    </section>`;
    
    indexContent = indexContent.replace(targetStr, targetStr + '\n' + newSection);
    
    indexContent = indexContent.replace('<a href="workforce-viz.html" class="nav-link" data-text="Visual Operation">Visual Operation</a>', '<a href="#visual-operation" class="nav-link" data-text="Visual Operation">Visual Operation</a>');
    
    indexContent = indexContent.replace('<a href="workforce-viz.html" class="wf-teaser-stage wf-stage-highlight">', '<a href="#visual-operation" class="wf-teaser-stage wf-stage-highlight">');
    
    fs.writeFileSync('public/index.html', indexContent, 'utf8');
    console.log('index.html updated successfully.');
} else {
    console.log('Diagram block not found');
}
