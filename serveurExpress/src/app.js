// path: serveurExpress/src/app.js
// title: Serveur Express principal avec routes DAB et Tchat
//
// Configure un serveur Express avec des routes pour un DAB et un tchat en temps réel via Socket.io.
// Gère les sessions, les cookies, et le rendu des vues avec EJS.

// ---- IMPORTS ----
// serveurExpress/src/app.js
import express from "express";
// Modules natifs Node.js
import fs from "node:fs";
// Pour gérer les chemins de fichiers
import path from "node:path";
// Pour obtenir le nom de fichier courant
import { fileURLToPath } from "node:url";
// Middleware pour gérer les cookies
import cookieParser from "cookie-parser";
// Middleware pour gérer les sessions
import session from "express-session";
// Pour créer le serveur HTTP
import { createServer } from "http";
// Pour Socket.io
import { Server as SocketIO } from "socket.io";
// Import de la fonction de distribution des coupures du DAB
import { determineCoupureGeneric } from "./public/js/dab.js";

// ---- INITIALISATION ----
// Obtenir le __dirname dans un module ESM
const __filename = fileURLToPath(import.meta.url);
// Chemin du répertoire courant
const __dirname = path.dirname(__filename);
// Initialisation de l'application Express
const app = express();
// Définition du port
const PORT = 8080;

// ---- CONFIG ----
// Définition du moteur de vues et des répertoires
app.set("view engine", "ejs");
// Répertoire des vues
app.set("views", path.join(__dirname, "views"));
// Middleware pour parser le corps des requêtes
app.use(express.urlencoded({ extended: true }));
// Middleware pour parser les cookies
app.use(cookieParser());
// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, "public")));

// ---- SESSIONS ----
// Configuration du middleware de session
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// ---- MIDDLEWARE ----
// Middleware pour gérer isAdmin et username dans les vues
app.use((req, res, next) => {
  // Récupère isAdmin depuis query ou cookie
  if (req.query.isAdmin !== undefined) {
    const adminValue = req.query.isAdmin === "true";
    res.cookie("isAdmin", adminValue);
    res.locals.isAdmin = adminValue;
  } else {
    res.locals.isAdmin = req.cookies.isAdmin === "true";
  }
  // username dans toutes les pages
  res.locals.username = req.session.username || null;
  next();
});

// ---- ROUTES ----
// ---- PAGES STANDARDS ----
// Page d'accueil
app.get("/", (req, res) => res.render("pages/index", { title: "Accueil" }));
// Page Contact
app.get("/contact", (req, res) =>
  res.render("pages/contact", { title: "Contact" })
);
// Page À propos
app.get("/about", (req, res) =>
  res.render("pages/about", { title: "À propos" })
);
// Page d'erreur 404 personnalisée
app.get("/error", (req, res) => res.render("pages/404", { title: "404" }));

// ---- DOWNLOAD ----
// Route pour télécharger le fichier de distribution des coupures
app.get("/download", (req, res) => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const filename =
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_` +
    `${pad(now.getHours())}${pad(now.getMinutes())}${pad(
      now.getSeconds()
    )}.txt`;
  const filepath = path.join(__dirname, "/tmp/downloads", filename);

  const result = req.session.dabResult;
  if (!result) return res.status(400).send("Aucun résultat DAB disponible.");

  let content = `Fichier généré le ${now.toLocaleString("fr-FR")}\n\n`;
  content += `Distribution des coupures\n`;
  content += `Montant : ${result.montant} ${result.typeDevise}\n`;
  content += `--------------------------------\nBillet/Monnaie | Quantité\n--------------------------------\n`;

  for (const [coupure, quantite] of Object.entries(result.distribution)) {
    content += `${coupure.padEnd(15)} | ${quantite}\n`;
  }

  fs.mkdirSync(path.join(__dirname, "/tmp/downloads"), { recursive: true });
  fs.writeFile(filepath, content, (err) => {
    if (err)
      return res.status(500).send("Erreur lors de la génération du fichier.");
    res.download(filepath, filename);
  });
});

// ---- PAGE DAB ----
app.get("/dab", (req, res) =>
  res.render("pages/dab", {
    title: "DAB",
    montant: "",
    typeDevise: "€",
    error: null,
    result: null,
  })
);

app.post("/dab", (req, res) => {
  const { montant, typeDevise } = req.body;
  let error = null,
    result = null;

  if (!montant || isNaN(montant) || parseFloat(montant) <= 0) {
    error = "Montant invalide";
  } else {
    result = determineCoupureGeneric({
      montant: parseFloat(montant),
      typeDevise,
    });
  }

  req.session.dabResult = result;
  res.render("pages/dab", { title: "DAB", montant, typeDevise, error, result });
});

// ---- PAGE TCHAT ----
app.get("/tchat", (req, res) => res.render("pages/tchat", { title: "Tchat" }));

// ---- PAGE LOGIN ----
app.get("/login", (req, res) =>
  res.render("pages/login", { title: "Connexion", error: null })
);

app.post("/login", (req, res) => {
  const { login, password } = req.body;
  if (login === "admin" && password === "admin") {
    req.session.username = "admin";
    res.cookie("isAdmin", true, { httpOnly: false }); // accessible côté JS
    return res.redirect("/tchat");
  }
  res.render("pages/login", {
    title: "Connexion",
    error: "Identifiants invalides",
  });
});

// ---- LOGOUT ----
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("isAdmin");
    res.redirect("/login");
  });
});

// ---- PAGE 404 ----
app.use((req, res) => res.status(404).render("pages/404", { title: "404" }));

// ---- SERVER + SOCKET.IO ----
const httpServer = createServer(app);
const io = new SocketIO(httpServer);

// Historique des messages par room
let messagesParRoom = {
  general: [],
  channel: [],
  admin: [],
};

io.on("connection", (socket) => {
  console.log("Utilisateur connecté :", socket.id);

  // Room par défaut
  let currentRoom = "general";
  socket.join(currentRoom);
  socket.emit("historique", messagesParRoom[currentRoom]);

  // Changement de room
  socket.on("joinRoom", (room) => {
    if (!messagesParRoom[room]) messagesParRoom[room] = [];
    socket.leave(currentRoom);
    currentRoom = room;
    socket.join(currentRoom);
    socket.emit("historique", messagesParRoom[currentRoom]);
    socket.to(currentRoom).emit("message", {
      pseudo: "System",
      message: `${socket.id} a rejoint la room ${currentRoom}`,
      date: new Date().toLocaleTimeString(),
      id: socket.id,
    });
  });

  // Nouveau message
  socket.on("nouveauMessage", ({ pseudo, message }) => {
    const msg = {
      pseudo,
      message,
      date: new Date().toLocaleTimeString(),
      id: socket.id,
    };
    messagesParRoom[currentRoom].push(msg);
    io.to(currentRoom).emit("message", msg);
  });

  socket.on("disconnect", () =>
    console.log("Utilisateur déconnecté :", socket.id)
  );
});

httpServer.listen(PORT, "78.138.58.95", () =>
  console.log(`Serveur démarré sur http://78.138.58.95:${PORT}`)
);
