import re

# Read index.html
with open('public/index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

# Read workforce-viz.html
with open('public/workforce-viz.html', 'r', encoding='utf-8') as f:
    viz_content = f.read()

# Extract the diagram block from workforce-viz.html
match = re.search(r'(<div class="workforce-viz-full">.*<!-- Tooltip Portal -->\s*<div id="vizTooltip" class="viz-tooltip">Tooltip text</div>\s*</div>)', viz_content, re.DOTALL)
if match:
    diagram_html = match.group(1)
    
    # We want to put this in index.html after the workforce section
    target_str = '''Explore the Full Operating Model <i class="fas fa-arrow-right\"></i>
                </a>
            </div>

        </div>
    </section>'''
    
    new_section = f'''
    <!-- Visual Operation Section -->
    <section id="visual-operation" class="viz-hero" style="padding-top: 5rem; padding-bottom: 5rem;">
        <div class="container">
            <div class="section-badge" style="background: rgba(161,140,209,.1); border-color: rgba(161,140,209,.2);">
                <i class="fas fa-network-wired" style="color: #a18cd1;"></i>
                <span style="color: #a18cd1;">Live Visualization</span>
            </div>
            <h2 class="section-title">One business.<br><span style="color: var(--primary-color);">A workforce of AI specialists.</span></h2>
            <p class="section-subtitle">Watch in real time as the Commander AI receives a business objective and coordinates specialized agents to complete the work — no human intervention required.</p>
            
            <div class="viz-page-wrapper" style="margin-top: 3rem;">
                {diagram_html}
            </div>
        </div>
    </section>'''
    
    index_content = index_content.replace(target_str, target_str + '\n' + new_section)
    
    # Update nav links in index.html
    index_content = index_content.replace('<a href="workforce-viz.html" class="nav-link" data-text="Visual Operation">Visual Operation</a>', '<a href="#visual-operation" class="nav-link" data-text="Visual Operation">Visual Operation</a>')
    
    # Update teaser strip link in index.html
    index_content = index_content.replace('<a href="workforce-viz.html" class="wf-teaser-stage wf-stage-highlight">', '<a href="#visual-operation" class="wf-teaser-stage wf-stage-highlight">')
    
    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(index_content)
    print('index.html updated successfully.')
else:
    print('Diagram block not found in workforce-viz.html')
