/**
 * LWD Chatbot Loader
 * Injects the Chatbot HTML automatically.
 */

const chatbotUI = `
    <div id="chat-bubble" onclick="toggleChat()" title="Chat with LWD Assistant">
        <div class="bubble-icon-bg">
            <i class="fa-solid fa-comment-dots"></i>
        </div>
        <div class="pulse-ring"></div>
    </div>

    <div id="chat-window">
        <div class="chat-header">
            <div class="header-content">
                <div class="bot-avatar">
                    <img src="LWDLOGO.png" alt="LWD Assistant">
                    <span class="online-indicator"></span>
                </div>
                <div class="bot-info">
                    <p class="bot-name">LWD Assistant</p>
                    <p class="bot-status">Online • Ready to help</p>
                </div>
            </div>
            
            <div class="header-actions">
                <button class="clear-btn" onclick="clearChat()" title="Clear History">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
                <button class="close-chat" onclick="toggleChat()" title="Close Chat">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
        
        <div id="chat-body" class="chat-body">
            <!-- FIRST BOT MESSAGE -->
            <div class="msg bot">
                Hello! 🌊 I'm your LWD Assistant. How can I assist you with our services today?
            </div>

            <!-- ✅ ADDED id="suggestion-box" so the JS can hide it -->
            <div class="suggestions" id="suggestion-box">
                <button onclick="sendSuggestion('Office hours')">Office Hours</button>
                <button onclick="sendSuggestion('New Connection')">New Connection</button>
                <button onclick="sendSuggestion('Job vacancies')">Job Vacancies</button>
                <button onclick="sendSuggestion('Contact info')">Contact Us</button>
                <button onclick="sendSuggestion('Partnership')">Partnership</button>
            </div>

            <div id="typing-indicator" class="typing" style="display:none;">
                Assistant is typing...
            </div>
        </div>

        <div class="chat-footer">
            <div class="input-container">
                <!-- Changed to textarea for auto-resize support -->
                <textarea id="chat-input" placeholder="Ask a question..." onkeypress="handleKey(event)" rows="1"></textarea>
                <button class="send-btn" onclick="sendMessage()">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>
    </div>
`;

// Inject into the page
document.body.insertAdjacentHTML('beforeend', chatbotUI);

// ✅ Auto-resize logic for the textarea
const chatInput = document.getElementById('chat-input');
if (chatInput) {
    chatInput.addEventListener('input', function () {
        this.style.height = 'auto';
        // Max height of 100px before scrolling internally
        this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });
}