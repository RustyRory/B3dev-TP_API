document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  const form = document.getElementById("tchat-form");
  const input = document.getElementById("input");
  const chat = document.getElementById("tchat");
  let pseudo = "";

  // Afficher le modal Bootstrap pour le pseudo
  const pseudoModal = new bootstrap.Modal(document.getElementById("pseudo"));
  pseudoModal.show();

  document.getElementById("pseudo-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const pseudoInput = document.getElementById("pseudo-input").value.trim();
    if (pseudoInput) {
      pseudo = pseudoInput;
      pseudoModal.hide();
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value && pseudo) {
      socket.emit("nouveauMessage", { pseudo, message: input.value });
      input.value = "";
    }
  });

  function afficherMessage(msg) {
    const div = document.createElement("div");
    div.classList.add("d-flex", "mb-2");

    if (msg.id === socket.id) {
      div.classList.add("justify-content-end");
      div.innerHTML = `
        <div class="p-2 rounded bg-secondary text-white" style="max-width: 70%;">
          <strong>${msg.pseudo}</strong><br>
          ${msg.message}
          <div class="text-end text-light" style="font-size:0.7em;">${msg.date}</div>
        </div>
      `;
    } else {
      div.classList.add("justify-content-start");
      div.innerHTML = `
        <div class="p-2 rounded bg-light text-dark" style="max-width: 70%;">
          <strong>${msg.pseudo}</strong><br>
          ${msg.message}
          <div class="text-end text-muted" style="font-size:0.7em;">${msg.date}</div>
        </div>
      `;
    }

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  socket.on("historique", (messages) => {
    messages.forEach(afficherMessage);
  });

  socket.on("message", (msg) => {
    afficherMessage(msg);
  });
});
