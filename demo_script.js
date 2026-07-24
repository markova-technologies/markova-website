const fs = require("fs");

// 1. Patch HTML
let html = fs.readFileSync("public/index.html", "utf8");

const demoHtml = `            <div class="interactive-demo-container" style="background: rgba(20,20,25,0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; position: relative; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <div class="demo-badge" style="position: absolute; top: -12px; right: 20px; background: var(--primary-color); color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">Try it live</div>
                
                <h3 style="font-size: 1.2rem; margin-bottom: 0; font-weight: 600;">Experience the difference</h3>
                
                <div class="demo-chips" style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <button class="demo-chip" onclick="runDemo('order')" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 6px 12px; border-radius: 50px; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;">Order Status</button>
                    <button class="demo-chip" onclick="runDemo('booking')" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 6px 12px; border-radius: 50px; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;">Book Appointment</button>
                    <button class="demo-chip" onclick="runDemo('refund')" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 6px 12px; border-radius: 50px; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;">Refund Policy</button>
                </div>

                <div class="demo-input-group" style="display: flex; gap: 10px;">
                    <input type="text" id="demoInput" placeholder="e.g. Is my order ready?" style="flex: 1; padding: 12px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.5); color: #fff; outline: none; font-family: inherit;">
                    <button onclick="submitDemo()" style="padding: 12px 24px; border-radius: 8px; background: linear-gradient(135deg, #4facfe, #00f2fe); color: #000; font-weight: 600; border: none; cursor: pointer; transition: opacity 0.2s;">Ask AI</button>
                </div>

                <div id="demoResults" style="display: none; flex-direction: column; gap: 1rem; margin-top: 0.5rem; animation: fadeIn 0.3s ease;">
                    <!-- Chatbot Response -->
                    <div class="demo-result chatbot-result" style="padding: 1.2rem; border-radius: 12px; background: rgba(255,255,255,0.05); border-left: 4px solid #e74c3c;">
                        <div style="font-size: 0.85rem; color: #a0aec0; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                            <i class="fas fa-robot" style="color: #e74c3c;"></i> A standard chatbot would say:
                        </div>
                        <div id="demoChatbotText" style="color: #fff; font-size: 0.95rem; line-height: 1.5;">Please check your account portal.</div>
                    </div>

                    <!-- Workforce Response -->
                    <div class="demo-result workforce-result" style="padding: 1.2rem; border-radius: 12px; background: rgba(79,172,254,0.1); border-left: 4px solid #4facfe;">
                        <div style="font-size: 0.85rem; color: #4facfe; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                            <i class="fas fa-network-wired"></i> Markova's workforce does:
                        </div>
                        <div id="demoWorkforceText" style="color: #fff; font-weight: 500; font-size: 0.95rem; line-height: 1.5;">Checks CRM, verifies fulfillment status, and replies.</div>
                    </div>
                </div>
            </div>`;

// Replace the services image with the demo HTML
const targetHtml = `<div class="services-image" id="servicesImageDisplay" style="aspect-ratio: 4/3; width: 100%; border-radius: 20px; overflow: hidden; background: rgba(0,0,0,0.5);">
                <img id="mainServiceImage" src="agentic-ai.jpg" alt="AI Operations Pipeline" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>`;

if (html.includes('id="servicesImageDisplay"')) {
    // Basic regex replacement for the services-image block
    html = html.replace(/<div class="services-image" id="servicesImageDisplay"[\s\S]*?<\/div>/, demoHtml);
}

// Add animation keyframe to CSS if not present
if (!html.includes('@keyframes fadeIn')) {
    html = html.replace('</head>', `  <style>
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .demo-chip:hover { background: rgba(255,255,255,0.1) !important; border-color: rgba(255,255,255,0.3) !important; }
    .demo-input-group button:hover { opacity: 0.9; }
  </style>
</head>`);
}

fs.writeFileSync("public/index.html", html, "utf8");

// 2. Patch JS
let js = fs.readFileSync("public/work.js", "utf8");
const jsCode = `
// Interactive Ask AI Demo Logic
const demoQueries = {
    'order': {
        chat: "Please log in to your customer portal to view your order status.",
        work: "Looks up the order in Shopify, checks fulfillment status in logistics software, and replies: 'Your order #1234 ships tomorrow — I've also flagged the 1-day delay to Operations.'"
    },
    'booking': {
        chat: "You can book an appointment by visiting our booking page on the website.",
        work: "Checks the team's Google Calendar, cross-references your CRM record, and replies: 'I see you're an enterprise client. I've booked you with our senior rep for Tuesday at 2 PM. Invite sent.'"
    },
    'refund': {
        chat: "Our refund policy allows returns within 30 days. Please contact support for more details.",
        work: "Verifies the purchase date in Stripe, confirms it's within the 30-day window, initiates the refund API call, and replies: 'I've processed your refund. It will appear in 3-5 days.'"
    }
};

const defaultDemo = {
    chat: "I am a virtual assistant. Please contact human support for help with this.",
    work: "Analyzes the request intent, queries the internal knowledge base, routes a ticket to the appropriate human department with full context, and confirms receipt."
};

window.runDemo = function(type) {
    const input = document.getElementById('demoInput');
    if (type === 'order') input.value = "Is my order ready?";
    else if (type === 'booking') input.value = "I need to book an appointment.";
    else if (type === 'refund') input.value = "Can I get a refund on my last purchase?";
    submitDemo(type);
};

window.submitDemo = function(typeOverride) {
    const inputEl = document.getElementById('demoInput');
    const input = inputEl ? inputEl.value.toLowerCase() : '';
    let data = defaultDemo;
    
    if (typeof typeOverride === 'string' && demoQueries[typeOverride]) {
        data = demoQueries[typeOverride];
    } else {
        if (input.includes('order')) data = demoQueries['order'];
        else if (input.includes('book') || input.includes('appointment')) data = demoQueries['booking'];
        else if (input.includes('refund') || input.includes('return')) data = demoQueries['refund'];
    }

    const resultsEl = document.getElementById('demoResults');
    if (resultsEl) {
        resultsEl.style.display = 'flex';
        // Reset animation
        resultsEl.style.animation = 'none';
        resultsEl.offsetHeight; /* trigger reflow */
        resultsEl.style.animation = null; 
        
        document.getElementById('demoChatbotText').innerText = data.chat;
        document.getElementById('demoWorkforceText').innerText = data.work;
    }
};

// Add Enter key listener to input
document.addEventListener('DOMContentLoaded', () => {
    const demoInput = document.getElementById('demoInput');
    if (demoInput) {
        demoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submitDemo();
        });
    }
});
`;

if (!js.includes('window.runDemo')) {
    fs.appendFileSync("public/work.js", jsCode, "utf8");
}

console.log("Interactive demo implemented.");
