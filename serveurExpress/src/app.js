import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cookieParser from "cookie-parser";
import session from "express-session";
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
app.get("/", (req, res) => res.render("pages/index", { title: "Accueil" }));
app.get("/contact", (req, res) =>
  res.render("pages/contact", { title: "Contact" })
);
app.get("/about", (req, res) =>
  res.render("pages/about", { title: "À propos" })
);
app.get("/error", (req, res) => res.render("pages/404", { title: "404" }));

// ---- DOWNLOAD ----
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

httpServer.listen(PORT, "0.0.0.0", () =>
  console.log(`Serveur démarré sur http://0.0.0.0:${PORT}`)
);
