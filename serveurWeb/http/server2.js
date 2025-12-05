import http from "node:http";
import { parse, fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import ejs from "ejs";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(async (req, res) => {
  const { pathname } = parse(req.url);

  const renderPage = async (file, title) => {
    try {
      const pageContent = await readFile(
        path.join(__dirname, "../views/pages", file),
        "utf-8"
      );

      const html = await ejs.renderFile(
        path.join(__dirname, "../views/partials/layout.ejs"),
        { title, content: pageContent }
      );

      res.writeHead(200, {
        "Content-Type": 'text/html; charset=utf-8; lang="fr"',
      });
      res.end(html);
    } catch (err) {
      res.writeHead(500, {
        "Content-Type": 'text/html; charset=utf-8; lang="fr"',
      });
      res.end("<h1>Erreur serveur</h1>");
    }
  };

  if (pathname === "/") {
    await renderPage("index.ejs", "TP API - Accueil");
  } else if (pathname === "/contact") {
    await renderPage("contact.ejs", "TP API - Contact");
  } else if (pathname === "/about") {
    await renderPage("about.ejs", "TP API - À propos");
  } else {
    await renderPage("404.ejs", "TP API - 404");
  }
});

server.listen(4000, "localhost", () => {
  console.log("Serveur démarré sur http://localhost:4000");
});

process.on("SIGINT", () => {
  console.log("\nArrêt du serveur...");
  server.close(() => {
    console.log("Serveur arrêté !");
    process.exit(0);
  });
});
