// ==========================================================================
// CYBERPUNK TECH AI PORTAL - CHATBOT ENGINE SCRIPT
// ==========================================================================

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const typing = document.getElementById("typing");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");
const fileInput = document.getElementById("fileInput");

// Get formatted current time string
function getTime() {
    const now = new Date();
    return now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

// Add User Message bubble
function addUserMessage(message) {
    const div = document.createElement("div");
    div.className = "user-message";

    div.innerHTML = `
        <div class="user-avatar">👤</div>
        <div class="message">
            <p>${escapeHTML(message)}</p>
            <span class="time">${getTime()}</span>
        </div>
    `;

    chatBox.appendChild(div);
    scrollToBottom();
}

// Add Bot Message bubble
function addBotMessage(message) {
    const div = document.createElement("div");
    div.className = "bot-message";

    // Format markdown bold/code if present
    const formattedMsg = formatBotText(message);

    div.innerHTML = `
        <div class="avatar-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                <circle cx="12" cy="5" r="2"></circle>
                <path d="M12 7v4"></path>
                <line x1="8" y1="15" x2="8.01" y2="15"></line>
                <line x1="16" y1="15" x2="16.01" y2="15"></line>
            </svg>
        </div>
        <div class="message">
            <p>${formattedMsg}</p>
            <span class="time">${getTime()}</span>
            <div class="message-toolbar">
                <button class="action-icon copy-btn" title="Copy text">📋</button>
                <button class="action-icon speak-btn" title="Read aloud">🔊</button>
            </div>
        </div>
    `;

    chatBox.appendChild(div);
    scrollToBottom();

    // Attach listener to speak button
    const speakBtn = div.querySelector(".speak-btn");
    if (speakBtn) {
        speakBtn.addEventListener("click", function () {
            speak(message);
        });
    }
}

// Helper: Escape HTML string to prevent XSS
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Helper: Simple Markdown formatting for bot replies
function formatBotText(text) {
    if (!text) return "";
    let formatted = escapeHTML(text);
    // Bold text **text**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Newline to <br>
    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
}

// Show/Hide Typing indicator
function showTyping() {
    if (typing) {
        typing.style.display = "flex";
        scrollToBottom();
    }
}

function hideTyping() {
    if (typing) {
        typing.style.display = "none";
    }
}

// Scroll chatbox to bottom smoothly
function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Send Message handler
async function sendMessage() {
    if (!input) return;
    const message = input.value.trim();
    if (message === "") return;

    addUserMessage(message);
    input.value = "";
    showTyping();

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        hideTyping();
        addBotMessage(data.reply);
        saveChat();
    } catch (error) {
        hideTyping();
        addBotMessage("Unable to connect to AI server. Please check your internet connection.");
    }
}

// Enter Key Support
if (input) {
    input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });
}

// Save & Load Chat History in localStorage
function saveChat() {
    localStorage.setItem("cyberChatHistory", chatBox.innerHTML);
}

function loadChat() {
    const history = localStorage.getItem("cyberChatHistory");
    if (history && history.trim() !== "") {
        chatBox.innerHTML = history;
        scrollToBottom();
    }
}

// Clear Chat session
function clearChat() {
    localStorage.removeItem("cyberChatHistory");
    fetch("/new_chat").catch(() => {});

    chatBox.innerHTML = `
        <div class="bot-message">
            <div class="avatar-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                    <circle cx="12" cy="5" r="2"></circle>
                    <path d="M12 7v4"></path>
                    <line x1="8" y1="15" x2="8.01" y2="15"></line>
                    <line x1="16" y1="15" x2="16.01" y2="15"></line>
                </svg>
            </div>
            <div class="message">
                <p>Greetings! 👋</p>
                <p>I'm your **AI Student Support Assistant**. How can I assist you with your academics or campus queries today?</p>
                <span class="time">${getTime()}</span>
                <div class="message-toolbar">
                    <button class="action-icon copy-btn" title="Copy text">📋</button>
                    <button class="action-icon speak-btn" onclick="speak('Greetings! I am your AI Student Support Assistant.')" title="Read aloud">🔊</button>
                </div>
            </div>
        </div>
    `;
    scrollToBottom();
}

// File Input attachment handler
if (fileInput) {
    fileInput.addEventListener("change", function () {
        if (this.files.length > 0) {
            const fileName = this.files[0].name;
            addUserMessage(`📎 Uploaded document: ${fileName}`);
            showTyping();
            setTimeout(() => {
                hideTyping();
                addBotMessage(`Document **${fileName}** received successfully. Processing document details...`);
                saveChat();
            }, 800);
        }
    });
}

// Voice Speech Recognition
if (micBtn && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    micBtn.addEventListener("click", function () {
        micBtn.style.boxShadow = "0 0 25px #00f0ff";
        recognition.start();
    });

    recognition.onresult = function (event) {
        micBtn.style.boxShadow = "none";
        if (input && event.results[0][0]) {
            input.value = event.results[0][0].transcript;
            sendMessage();
        }
    };

    recognition.onerror = function () {
        micBtn.style.boxShadow = "none";
        addBotMessage("Voice input not recognized. Please try typing your question.");
    };
}

// Text to Speech
function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop current speech
    const cleanText = text.replace(/<[^>]*>?/gm, ''); // Strip HTML tags
    const speech = new SpeechSynthesisUtterance(cleanText);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
}

// Event Delegation for Copy Buttons
chatBox.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("copy-btn")) {
        const msgContainer = e.target.closest(".message");
        if (msgContainer) {
            const paragraph = msgContainer.querySelector("p");
            if (paragraph) {
                navigator.clipboard.writeText(paragraph.innerText);
                const original = e.target.innerHTML;
                e.target.innerHTML = "✅";
                setTimeout(() => {
                    e.target.innerHTML = original;
                }, 1500);
            }
        }
    }
});

// Auto focus on load & load saved chat
window.addEventListener("load", () => {
    loadChat();
    if (input) input.focus();
});