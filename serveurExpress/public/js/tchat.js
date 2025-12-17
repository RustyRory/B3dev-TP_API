const socket = io();

const form = document.getElementById("tchat-form");
const input = document.getElementById("input");
const chat = document.getElementById("tchat");
let pseudo = "";

while (!pseudo) {
  pseudo = prompt("Entrez votre pseudo :");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("nouveauMessage", { pseudo, message: input.value });
    input.value = "";
  }
});

// Afficher les messages
function afficherMessage(msg) {
  const div = document.createElement("div");

  div.innerHTML = `<strong style="color:${
    msg.id === socket.id ? "red" : "black"
  }">${msg.pseudo}</strong>: ${msg.message} <span style="float:right">${
    msg.date
  }</span>`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

// Historique
socket.on("historique", (messages) => {
  messages.forEach(afficherMessage);
});

// Nouveau message
socket.on("message", (msg) => {
  afficherMessage(msg);
});
