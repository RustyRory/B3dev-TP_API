// serveurExpress/src/public/js/tchat.js
// Gestion du tchat avec Socket.io
// ----------------------------------

// Attendre que le DOM soit chargé (pour s'assurer que les éléments existent)
// Ajout de l'écouteur d'événement DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // Connexion au serveur Socket.io
  const socket = io();

  // Définition des éléments DOM
  const chat = document.getElementById("tchat"); // Conteneur des messages
  const form = document.getElementById("tchat-form"); // Formulaire d'envoi
  const input = document.getElementById("input"); // Champ de saisie
  const currentRoomLabel = document.getElementById("current-room"); // Label de la room actuelle

  // --- Gestion du pseudo ---
  let pseudo = "";
  // Affichage du modal pour le pseudo
  const pseudoModal = new bootstrap.Modal(document.getElementById("pseudo"));
  pseudoModal.show();

  // Soumission du formulaire de pseudo
  document.getElementById("pseudo-form").addEventListener("submit", (e) => {
    // Empêcher le rechargement de la page
    e.preventDefault();
    // Récupérer le pseudo entré
    const pseudoInput = document.getElementById("pseudo-input").value.trim();
    // Si le pseudo n'est pas vide, le définir et fermer le modal
    if (pseudoInput) {
      pseudo = pseudoInput;
      pseudoModal.hide();
    }
  });

  // --- Gestion des rooms ---
  let currentRoom = "general";

  // Fonction pour récupérer la valeur d'un cookie
  function getCookie(name) {
    // Expression régulière pour trouver le cookie
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    // Retourner la valeur du cookie ou null s'il n'existe pas
    if (match) return match[2];
    return null;
  }

  // Vérifier si l'utilisateur est admin via le cookie
  const isAdmin = getCookie("isAdmin") === "true";

  // Masquer uniquement la room Admin si l'utilisateur n'est pas admin
  const adminTab = document.getElementById("admin-tab");
  if (!isAdmin && adminTab) adminTab.parentElement.style.display = "none";

  // Changement de room au clic sur les boutons
  // Sélectionner tous les id des boutons
  document.querySelectorAll("#roomPills .nav-link").forEach((btn) => {
    // Ajouter un écouteur d'événement click à chaque bouton
    btn.addEventListener("click", () => {
      // Mettre à jour l'affichage des boutons actifs
      document
        .querySelectorAll("#roomPills .nav-link")
        .forEach((b) => b.classList.remove("active"));
      // Ajouter la classe active au bouton cliqué
      btn.classList.add("active");
      // Mettre à jour la room actuelle et le label
      currentRoom = btn.dataset.room;
      // Mettre à jour le label de la room actuelle
      currentRoomLabel.textContent = btn.textContent;
      // Vider le chat
      chat.innerHTML = "";
      // Rejoindre la room via Socket.io
      socket.emit("joinRoom", currentRoom);
    });
  });

  // --- Envoi des messages ---
  // Soumission du formulaire de tchat
  form.addEventListener("submit", (e) => {
    // Empêcher le rechargement de la page
    e.preventDefault();
    // Vérifier que le pseudo est défini
    if (!pseudo) {
      pseudoModal.show();
      return;
    }
    // Envoyer le message au serveur via Socket.io
    if (input.value.trim()) {
      socket.emit("nouveauMessage", { pseudo, message: input.value });
      // Vider le champ de saisie une fois le message envoyé
      input.value = "";
    }
  });

  // --- Affichage messages ---
  // Fonction pour afficher un message dans le chat
  function afficherMessage(msg) {
    // Créer un élément div pour le message
    const div = document.createElement("div");
    div.classList.add("d-flex", "mb-2");
    // Vérifier si le message vient de l'utilisateur actuel
    if (msg.id === socket.id) {
      // Aligner à droite pour les messages de l'utilisateur
      div.classList.add("justify-content-end");
      div.innerHTML = `
        <div class="p-2 rounded bg-secondary text-white" style="max-width: 70%;">
          <strong>${msg.pseudo}</strong><br>
          ${msg.message}
          <div class="text-end text-light" style="font-size:0.7em;">${msg.date}</div>
        </div>
      `;
    } else {
      // Aligner à gauche pour les messages des autres
      div.classList.add("justify-content-start");
      div.innerHTML = `
        <div class="p-2 rounded bg-light text-dark" style="max-width: 70%;">
          <strong>${msg.pseudo}</strong><br>
          ${msg.message}
          <div class="text-end text-muted" style="font-size:0.7em;">${msg.date}</div>
        </div>
      `;
    }
    // Ajouter le message au conteneur du chat
    chat.appendChild(div);
    // Faire défiler le chat vers le bas pour voir le nouveau message
    chat.scrollTop = chat.scrollHeight;
  }

  // --- Réception historique, messages et rooms ---
  // Réception de l'historique des messages
  socket.on("historique", (messages) => messages.forEach(afficherMessage));
  // Réception d'un nouveau message
  socket.on("message", (msg) => afficherMessage(msg));
  // Rejoindre la room par défaut
  socket.emit("joinRoom", currentRoom);
});
