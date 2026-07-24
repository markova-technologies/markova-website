const fs = require('fs');

let indexContent = fs.readFileSync('public/index.html', 'utf8');

const diagramHtml = `
            <div class="workforce-viz-full">
            <!-- The Scenario Header -->
            <div class="scenario-display">
                <div class="scenario-label">Business Objective:</div>
                <div class="scenario-text" id="scenarioObjective">Customer wants to book an appointment</div>
            </div>

            <!-- Level 1: Commander -->
            <div class="viz-level level-commander">
                <div class="viz-node node-commander" data-tooltip="Understands the objective and coordinates the workforce.">
                    <div class="node-icon"><i class="fas fa-brain"></i></div>
                    <div class="node-content">
                        <div class="node-title">Commander</div>
                        <div class="node-status" id="statusCommander">Routing request...</div>
                    </div>
                    <div class="status-indicator active"></div>
                </div>
            </div>

            <!-- Connection Lines (Commander ? Agents) -->
            <div class="viz-connections">
                <svg viewBox="0 0 600 100" preserveAspectRatio="none">
                    <path d="M 300 0 C 300 50, 100 50, 100 100" class="conn-line" />
                    <path d="M 300 0 L 300 100" class="conn-line" />
                    <path d="M 300 0 C 300 50, 500 50, 500 100" class="conn-line" />
                    <circle cx="0" cy="0" r="4" class="pulse pulse-left"><animateMotion dur="2s" repeatCount="indefinite" path="M 300 0 C 300 50, 100 50, 100 100" /></circle>
                    <circle cx="0" cy="0" r="4" class="pulse pulse-center"><animateMotion dur="2.5s" repeatCount="indefinite" path="M 300 0 L 300 100" /></circle>
                    <circle cx="0" cy="0" r="4" class="pulse pulse-right"><animateMotion dur="3s" repeatCount="indefinite" path="M 300 0 C 300 50, 500 50, 500 100" /></circle>
                </svg>
            </div>

            <!-- Level 2: Agents -->
            <div class="viz-level level-agents">
                <div class="viz-node node-agent" data-tooltip="Handles leads, qualification, and revenue opportunities.">
                    <div class="node-icon"><i class="fas fa-bullhorn"></i></div>
                    <div class="node-content">
                        <div class="node-title">Sales Agent</div>
                        <div class="node-status" id="statusSales">Checking CRM...</div>
                    </div>
                    <div class="status-indicator"></div>
                </div>
                <div class="viz-node node-agent" data-tooltip="Resolves customer questions and support requests.">
                    <div class="node-icon"><i class="fas fa-headset"></i></div>
                    <div class="node-content">
                        <div class="node-title">Support Agent</div>
                        <div class="node-status" id="statusSupport">Idle</div>
                    </div>
                    <div class="status-indicator"></div>
                </div>
                <div class="viz-node node-agent" data-tooltip="Executes internal business processes.">
                    <div class="node-icon"><i class="fas fa-cogs"></i></div>
                    <div class="node-content">
                        <div class="node-title">Operations Agent</div>
                        <div class="node-status" id="statusOps">Idle</div>
                    </div>
                    <div class="status-indicator"></div>
                </div>
            </div>

            <!-- Connection Lines (Agents ? Systems) -->
            <div class="viz-connections">
                <svg viewBox="0 0 600 100" preserveAspectRatio="none">
                    <path d="M 100 0 C 100 50, 300 50, 300 100" class="conn-line" />
                    <path d="M 300 0 L 300 100" class="conn-line" />
                    <path d="M 500 0 C 500 50, 300 50, 300 100" class="conn-line" />
                    <circle cx="0" cy="0" r="4" class="pulse pulse-left-down"><animateMotion dur="2.2s" repeatCount="indefinite" path="M 100 0 C 100 50, 300 50, 300 100" /></circle>
                    <circle cx="0" cy="0" r="4" class="pulse pulse-center-down"><animateMotion dur="2.7s" repeatCount="indefinite" path="M 300 0 L 300 100" /></circle>
                    <circle cx="0" cy="0" r="4" class="pulse pulse-right-down"><animateMotion dur="3.1s" repeatCount="indefinite" path="M 500 0 C 500 50, 300 50, 300 100" /></circle>
                </svg>
            </div>

            <!-- Level 3: Systems -->
            <div class="viz-level level-systems">
                <div class="viz-node node-systems" data-tooltip="Your company's information, tools, and connected software.">
                    <div class="node-icon"><i class="fas fa-database"></i></div>
                    <div class="node-content">
                        <div class="node-title">Knowledge &amp; Tools</div>
                        <div class="node-status" id="statusSystems">Finding available time...</div>
                    </div>
                </div>
            </div>

            <!-- Connection Lines (Systems ? Outcome) -->
            <div class="viz-connections short-conn">
                <svg viewBox="0 0 600 50" preserveAspectRatio="none">
                    <path d="M 300 0 L 300 50" class="conn-line" />
                    <circle cx="0" cy="0" r="4" class="pulse pulse-final"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 300 0 L 300 50" /></circle>
                </svg>
            </div>

            <!-- Level 4: Outcome -->
            <div class="viz-level level-outcome">
                <div class="viz-node node-outcome">
                    <div class="node-icon"><i class="fas fa-check-circle"></i></div>
                    <div class="node-content">
                        <div class="node-title">Business Outcome</div>
                        <div class="node-status success-text" id="statusOutcome">Appointment confirmed</div>
                    </div>
                </div>
            </div>

            <!-- Tooltip Portal -->
            <div id="vizTooltip" class="viz-tooltip">Tooltip text</div>
        </div>
`;

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
    </section>
`;

// Insert newSection into indexContent at line 350
const lines = indexContent.split('\n');
lines.splice(350, 0, newSection);
indexContent = lines.join('\n');

fs.writeFileSync('public/index.html', indexContent, 'utf8');
console.log('Successfully injected into index.html');
