let conversation = []; // untuk simpan percakapan supaya AI dapat memahami konteks sebelumnya
const chatbox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const inputbox = document.getElementById("inputBox");
const welcomeMessage = document.createElement("p");

// untuk mengatur chatbox
if (chatbox.innerHTML.trim() === "") {
    typeText(welcomeMessage, "Welcome to the AI Chatbot! How can I assist you today?", 70);
    // welcomeMessage.textContent = "Welcome to the AI Chatbot! How can I assist you today?";
    chatbox.appendChild(welcomeMessage);
    chatbox.style.alignContent = "center"
    chatbox.style.justifyItems = "center"
    welcomeMessage.classList.add("welcomeMessage")
    welcomeMessage.style.whiteSpace = "pre-wrap"
    inputbox.classList.add('active');
}

// untuk isi dari chatbox dan bagaimana user dan AI berinteraksi
function chat(){
    const user = document.createElement("p");
    user.classList.add("userbox");
    const AI_response = document.createElement("span");
    AI_response.classList.add("AIbox");
    const text = document.getElementById("userInput").value.trim();
    
    user.textContent = text;
    chatbox.appendChild(user);
    conversation.push({
        role: "user",
        parts: [{
            text: text
        }]
    })

    AI_response.textContent = "Typing..."
    chatbox.appendChild(AI_response);
    AI(conversation).then((response) => {
        AI_response.innerHTML = marked.parse(response);
        conversation.push({
            role: "model",
            parts: [{ text: response }]
        });
    })

    document.getElementById("userInput").value = "";
}

// untuk mengirim pesan ke AI melalui API gemini
function AI(conversation) {
    const APIkey ="API_key"; // API key
    return fetch(
        // endpoint di dapat dari gemini studio
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${APIkey}`,
        {
            // method POST untuk mengirim data ke API
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // body berisi percakapan yang akan dikirim ke AI
            body: JSON.stringify({
                contents: conversation
            })
        }
    )
    // mengirim request ke API dan mengembalikan response dalam format JSON
    .then((res) => res.json())
    // mengambil teks dari response yang dikembalikan oleh AI
    .then((data) => {
        if(data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        }
        else {
            console.error("API response does not contain candidates.", data);
            return "Something went wrong, please try again.";
        }
    })
    .catch((error) => {
        console.error(error);
    });
}
// untuk input boxnya responsive
userInput.addEventListener("input", function () {
    this.style.height = this.scrollHeight + "px";
});


var flag = false;
sendButton.addEventListener("click", function () {
    if (userInput === "") {
        alert("no prompt is input");
    }
    userInput.style.height = "auto";
    if (!flag) {
        inputbox.classList.remove('active');
        chatbox.style.alignContent = "start"
        chatbox.style.justifyItems = "end"
        welcomeMessage.style.transition = "all 0.3s ease-in-out"
        welcomeMessage.style.display = "none"
        flag = true
    }
});

function typeText(element, text, speed = 50) {
  let index = 0;
  element.textContent = "";

  let typingInterval = setInterval(() => {
    element.textContent += text[index];
    index++;
    if (index === text.length) {
      clearInterval(typingInterval);
    }
  }, speed);
}