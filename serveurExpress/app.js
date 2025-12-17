import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cookieParser from "cookie-parser";
import session from "express-session";
import ejs from "ejs";

import { determineCoupureGeneric } from "./utils/dab.js";

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

app.get("/download", (req, res) => {
  const now = new Date();

  // Format YYYYMMDD_HHmmss
  const pad = (n) => String(n).padStart(2, "0");
  const filename =
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_` +
    `${pad(now.getHours())}${pad(now.getMinutes())}${pad(
      now.getSeconds()
    )}.txt`;

  const filepath = path.join(__dirname, "downloads", filename);

  // Contenu du fichier
  const content = `Fichier généré le ${now.toLocaleString("fr-FR")}`;

  // Assure que le dossier existe
  fs.mkdirSync(path.join(__dirname, "downloads"), { recursive: true });

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
  const content = ejs.render(`
<h2>DAB - Distribution des coupures</h2>

<form method="post" action="/dab">
  <label>
    Montant :
    <input type="text" name="montant" required />
  </label>

  <label>
    Devise :
    <select name="typeDevise" id="devise" required>
      <option value="€" selected>€</option>
      <option value="$">$</option>
      <option value="£">£</option>
      <option value="¥">¥</option>
    </select>
  </label>

  <button type="submit">Calculer</button>
</form>
  `);

  res.render("pages/dab", { content });
});

// ---- TRAITEMENT DAB ----
app.post("/dab", (req, res) => {
  const { montant, typeDevise } = req.body;
  let error = null;
  let result = null;

  if (!montant || isNaN(montant)) {
    error = "Montant invalide";
  } else {
    result = determineCoupureGeneric({
      montant: parseFloat(montant),
      typeDevise,
    });
  }

  const content = ejs.render(`
<h2>DAB - Distribution des coupures</h2>

${error ? `<p class="error">${error}</p>` : ""}

<form method="post" action="/dab">
  <label>
    Montant :
    <input type="text" name="montant" value="${montant}" required />
  </label>

  <label>
    Devise :
    <select name="typeDevise" id="devise" required>
      <option value="€" ${typeDevise === "€" ? "selected" : ""}>€</option>
      <option value="$" ${typeDevise === "$" ? "selected" : ""}>$</option>
      <option value="£" ${typeDevise === "£" ? "selected" : ""}>£</option>
      <option value="¥" ${typeDevise === "¥" ? "selected" : ""}>¥</option>
    </select>
  </label>

  <button type="submit">Calculer</button>
</form>

${
  result
    ? `
<h3>Distribution des coupures pour ${result.montant} ${result.typeDevise} :</h3>
<ul>
  ${Object.entries(result.distribution)
    .map(([key, value]) => `<li>${key} : ${value}</li>`)
    .join("")}
</ul>
`
    : ""
}
  `);

  res.render("pages/dab", { content });
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

// ---- START SERVER ----
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
