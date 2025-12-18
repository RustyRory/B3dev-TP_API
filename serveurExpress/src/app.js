import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cookieParser from "cookie-parser";
import session from "express-session";
import ejs from "ejs";
import { createServer } from "http";
import { Server as SocketIO } from "socket.io";

import { determineCoupureGeneric } from "./public/js/dab.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// ---- CONFIG ----
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ---- SESSIONS ----
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// ---- MIDDLEWARE isAdmin + username ----
app.use((req, res, next) => {
  // Si l’URL contient ?isAdmin=true ou false → mise à jour cookie
  if (req.query.isAdmin !== undefined) {
    const adminValue = req.query.isAdmin === "true";
    res.cookie("isAdmin", adminValue);

    // --- CORRECTION : on met aussi res.locals tout de suite ---
    res.locals.isAdmin = adminValue;
  } else {
    // Sinon on prend la valeur du cookie existant
    res.locals.isAdmin = req.cookies.isAdmin === "true";
  }

  // username dans toutes les pages
  res.locals.username = req.session.username || null;

  next();
});

// ---- ROUTES ----
app.get("/", (req, res) => {
  res.render("pages/index", { title: "Accueil" });
});

app.get("/contact", (req, res) => {
  res.render("pages/contact", { title: "Contact" });
});

app.get("/about", (req, res) => {
  res.render("pages/about", { title: "À propos" });
});

app.get("/error", (req, res) => {
  res.render("pages/404", { title: "404" });
});

// ---- DOWNLOAD ----
app.get("/download", (req, res) => {
  const now = new Date();

  // Format YYYYMMDD_HHmmss
  const pad = (n) => String(n).padStart(2, "0");
  const filename =
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_` +
    `${pad(now.getHours())}${pad(now.getMinutes())}${pad(
      now.getSeconds()
    )}.txt`;

  const filepath = path.join(__dirname, "/tmp/downloads", filename);

  // Mise à jour de content : Affichage des resultats DAB sous forme d'un tableau si présents
  // Comme ceci :
  // Billet/Monnaie | Quantité
  // -------------------------
  // 50€            | 2
  // 20€            | 1
  // 5€             | 1

  const result = req.session.dabResult;

  let content = `Fichier généré le ${now.toLocaleString("fr-FR")}\n\n`;
  content += `Distribution des coupures\n`;
  content += `Montant : ${result.montant} ${result.typeDevise}\n`;
  content += `--------------------------------\n`;
  content += `Billet/Monnaie | Quantité\n`;
  content += `--------------------------------\n`;

  for (const [coupure, quantite] of Object.entries(result.distribution)) {
    content += `${coupure.padEnd(15)} | ${quantite}\n`;
  }

  // Assure que le dossier existe
  fs.mkdirSync(path.join(__dirname, "/tmp/downloads"), { recursive: true });

  // Écrit le fichier
  fs.writeFile(filepath, content, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur lors de la génération du fichier.");
    }

    // Téléchargement
    res.download(filepath, filename, (err) => {
      if (err) console.error("Erreur envoi fichier :", err);
    });
  });
});

// ---- PAGE DAB ----
app.get("/dab", (req, res) => {
  res.render("pages/dab", {
    title: "DAB",
    montant: "",
    typeDevise: "€",
    error: null,
    result: null,
  });
});

// ---- TRAITEMENT DAB ----
app.post("/dab", (req, res) => {
  const { montant, typeDevise } = req.body;

  let error = null;
  let result = null;

  if (!montant || isNaN(montant) || parseFloat(montant) <= 0) {
    error = "Montant invalide";
  } else {
    result = determineCoupureGeneric({
      montant: parseFloat(montant),
      typeDevise,
    });
  }

  req.session.dabResult = result;

  res.render("pages/dab", {
    title: "DAB",
    montant,
    typeDevise,
    error,
    result,
  });
});

// ---- PAGE TCHAT ----
app.get("/tchat", (req, res) => {
  res.render("pages/tchat", { title: "Tchat" });
});

// ---- PAGE LOGIN ----
app.get("/login", (req, res) => {
  res.render("pages/login", { title: "Connexion", error: null });
});

// ---- TRAITEMENT LOGIN ----
app.post("/login", (req, res) => {
  const { login, password } = req.body;

  if (login === "admin" && password === "admin") {
    req.session.username = "admin";
    return res.redirect("/?isAdmin=true");
  }

  res.render("pages/login", {
    title: "Connexion",
    error: "Identifiants invalides",
  });
});

// ---- LOGOUT ----
app.get("/logout", (req, res) => {
  // On détruit la session
  req.session.destroy(() => {
    // On remet le cookie isAdmin à false
    res.cookie("isAdmin", false);

    // Puis on redirige
    res.redirect("/?isAdmin=false");
  });
});

// ---- PAGE 404 ----
app.use((req, res) => {
  res.status(404).render("pages/404", { title: "404" });
});

// ---- SERVER + SOCKET.IO ----
const httpServer = createServer(app);
const io = new SocketIO(httpServer);

let messages = []; // Historique des messages

io.on("connection", (socket) => {
  console.log("Utilisateur connecté :", socket.id);

  // Envoyer l'historique
  socket.emit("historique", messages);

  socket.on("nouveauMessage", (data) => {
    // const filter = new Filter();
    // const msgFiltre = filter.clean(data.message);

    const msg = {
      pseudo: data.pseudo,
      message: data.message,
      date: new Date().toLocaleTimeString(),
      id: socket.id,
    };
    messages.push(msg);
    io.emit("message", msg);
  });

  socket.on("disconnect", () =>
    console.log("Utilisateur déconnecté :", socket.id)
  );
});

httpServer.listen(PORT, () =>
  console.log(`Serveur démarré sur http://localhost:${PORT}`)
);
