document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  const chat = document.getElementById("tchat");
  const form = document.getElementById("tchat-form");
  const input = document.getElementById("input");
  const currentRoomLabel = document.getElementById("current-room");

  // --- Gestion du pseudo ---
  let pseudo = "";
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

  // --- Gestion des rooms ---
  let currentRoom = "general";

  // Récupérer le cookie de manière sûre
  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    if (match) return match[2];
    return null;
  }

  const isAdmin = getCookie("isAdmin") === "true";

  // Masquer uniquement la room Admin si l'utilisateur n'est pas admin
  const adminTab = document.getElementById("admin-tab");
  if (!isAdmin && adminTab) adminTab.parentElement.style.display = "none";

  // Changement de room via pills
  document.querySelectorAll("#roomPills .nav-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll("#roomPills .nav-link")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      currentRoom = btn.dataset.room;
      currentRoomLabel.textContent = btn.textContent;

      chat.innerHTML = ""; // vider l'ancienne room
      socket.emit("joinRoom", currentRoom);
    });
  });

  // --- Envoi des messages ---
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!pseudo) {
      pseudoModal.show();
      return;
    }
    if (input.value.trim()) {
      socket.emit("nouveauMessage", { pseudo, message: input.value });
      input.value = "";
    }
  });

  // --- Affichage messages ---
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

  // --- Réception historique et messages ---
  socket.on("historique", (messages) => messages.forEach(afficherMessage));
  socket.on("message", (msg) => afficherMessage(msg));

  // Rejoindre la room par défaut
  socket.emit("joinRoom", currentRoom);
});
