// =========================================
// ELEMENTS
// =========================================

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const typing = document.getElementById("typing");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");
const fileInput = document.getElementById("fileInput");

// =========================================
// CURRENT TIME
// =========================================

function getTime() {

    const now = new Date();

    return now.toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit"

    });

}

// =========================================
// USER MESSAGE
// =========================================

function addUserMessage(message) {

    const div = document.createElement("div");

    div.className = "user-message";

    div.innerHTML = `

        <div class="message">

            <p>${message}</p>

            <span class="time">${getTime()}</span>

        </div>

        <div class="user-avatar">

            👤

        </div>

    `;

    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;

}

// =========================================
// BOT MESSAGE
// =========================================

function addBotMessage(message) {

    const div = document.createElement("div");

    div.className = "bot-message";

    div.innerHTML = `

        <div class="avatar-circle">

            🤖

        </div>

        <div class="message">

            <p>${message}</p>

            <span class="time">${getTime()}</span>

        </div>

    `;

    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;

}

// =========================================
// SHOW TYPING
// =========================================

function showTyping(){

    typing.style.display="block";

    chatBox.scrollTop=chatBox.scrollHeight;

}

function hideTyping(){

    typing.style.display="none";

}
// =========================================
// SEND MESSAGE
// =========================================

async function sendMessage(){

    const message=input.value.trim();

    if(message==="") return;

    addUserMessage(message);

    input.value="";

    showTyping();

    try{

        const response=await fetch("/chat",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                message:message

            })

        });

        const data=await response.json();

        hideTyping();

        addBotMessage(data.reply);

        saveChat();

    }

    catch(error){

        hideTyping();

        addBotMessage("Unable to connect to server.");

    }

}
// =========================================
// ENTER KEY SUPPORT
// =========================================

input.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        sendMessage();

    }

});

// =========================================
// SAVE CHAT
// =========================================

function saveChat(){

    localStorage.setItem("chatHistory", chatBox.innerHTML);

}

// =========================================
// LOAD CHAT
// =========================================

function loadChat(){

    const history = localStorage.getItem("chatHistory");

    if(history){

        chatBox.innerHTML = history;

        chatBox.scrollTop = chatBox.scrollHeight;

    }

}

window.onload = loadChat;

// =========================================
// CLEAR CHAT
// =========================================

function clearChat(){

    localStorage.removeItem("chatHistory");

    chatBox.innerHTML = `

    <div class="bot-message">

        <div class="avatar-circle">

            🤖

        </div>

        <div class="message">

            <p>Hello 👋</p>

            <p>I'm your AI Student Support Assistant.</p>

            <span class="time">${getTime()}</span>

        </div>

    </div>

    `;

}

// =========================================
// DARK MODE
// =========================================

const darkButton = document.querySelector(".menu-btn:last-of-type");

darkButton.addEventListener("click", ()=>{

    document.body.classList.toggle("dark");

});

// =========================================
// FILE UPLOAD
// =========================================

fileInput.addEventListener("change", function(){

    if(this.files.length > 0){

        addUserMessage("📎 " + this.files[0].name);

        addBotMessage("File uploaded successfully.");

        saveChat();

    }

});

// =========================================
// VOICE RECOGNITION
// =========================================

if('webkitSpeechRecognition' in window || 'SpeechRecognition' in window){

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.interimResults = false;

    recognition.maxAlternatives = 1;

    micBtn.onclick = function(){

        recognition.start();

    }

    recognition.onresult = function(event){

        input.value = event.results[0][0].transcript;

    }

    recognition.onerror = function(){

        addBotMessage("Voice recognition failed.");

    }

}
else{

    micBtn.style.display = "none";

}
// =========================================
// AUTO FOCUS
// =========================================

window.addEventListener("load", () => {

    input.focus();

});

// =========================================
// LOADING ANIMATION
// =========================================

function showTyping(){

    typing.style.display = "block";

    typing.innerHTML = `
        🤖 AI is typing
        <span class="dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
        </span>
    `;

}

function hideTyping(){

    typing.style.display = "none";

}

// =========================================
// COPY BOT MESSAGE
// =========================================

chatBox.addEventListener("click", function(e){

    if(e.target.classList.contains("copy-btn")){

        const text = e.target.parentElement.querySelector("p").innerText;

        navigator.clipboard.writeText(text);

        e.target.innerHTML="✅";

        setTimeout(()=>{

            e.target.innerHTML="📋";

        },1500);

    }

});

// =========================================
// TEXT TO SPEECH
// =========================================

function speak(text){

    if(!window.speechSynthesis) return;

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang="en-US";

    speech.rate=1;

    speech.pitch=1;

    window.speechSynthesis.speak(speech);

}

// =========================================
// REPLACE BOT MESSAGE FUNCTION
// =========================================

function addBotMessage(message){

    const div=document.createElement("div");

    div.className="bot-message";

    div.innerHTML=`

        <div class="avatar-circle">

            🤖

        </div>

        <div class="message">

            <p>${message}</p>

            <span class="time">${getTime()}</span>

            <div style="margin-top:10px;display:flex;gap:12px;">

                <span class="copy-btn" style="cursor:pointer;">📋</span>

                <span onclick="speak(\`${message}\`)" style="cursor:pointer;">🔊</span>

                <span style="cursor:pointer;">👍</span>

                <span style="cursor:pointer;">👎</span>

            </div>

        </div>

    `;

    chatBox.appendChild(div);

    chatBox.scrollTop=chatBox.scrollHeight;

}

// =========================================
// CONNECTION STATUS
// =========================================

window.addEventListener("online",()=>{

    console.log("Internet Connected");

});

window.addEventListener("offline",()=>{

    addBotMessage("⚠ Internet connection lost.");

});

// =========================================
// EMOJI SHORTCUTS
// =========================================

input.addEventListener("input",()=>{

    input.value=input.value

    .replace(":)","😊")

    .replace(":(","😔")

    .replace("<3","❤️")

    .replace(":D","😄");

});

// =========================================
// BUTTON RIPPLE EFFECT
// =========================================

document.querySelectorAll("button").forEach(button=>{

    button.addEventListener("click",function(){

        this.style.transform="scale(.92)";

        setTimeout(()=>{

            this.style.transform="scale(1)";

        },120);

    });

});

// =========================================
// AUTO SCROLL
// =========================================

const observer=new MutationObserver(()=>{

    chatBox.scrollTop=chatBox.scrollHeight;

});

observer.observe(chatBox,{

    childList:true

});

// =========================================
// WELCOME MESSAGE
// =========================================

console.log("🤖 AI Student Support Chatbot Loaded Successfully");