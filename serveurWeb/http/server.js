import http from "node:http";
import { parse } from "node:url";

const server = http.createServer((request, response) => {
  const { pathname } = parse(request.url);

  const sendHTML = (status, content) => {
    response.writeHead(status, {
      "Content-Type": 'text/html; charset=utf-8; lang="fr"',
    });
    response.end(`<html><body>${content}</body></html>`);
  };

  if (pathname === "/") {
    sendHTML(200, `<h1>Accueil</h1><p>Bienvenue sur la page d'accueil.</p>`);
  } else if (pathname === "/contact") {
    sendHTML(200, `<h1>Contact</h1><p>Page de contact.</p>`);
  } else if (pathname === "/about") {
    sendHTML(200, `<h1>À propos</h1><p>Page de présentation.</p>`);
  } else {
    sendHTML(404, `<h1>404</h1><p>Page non trouvée.</p>`);
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
