import http from "node:http";
import { parse } from "node:url";

const server = http.createServer((req, res) => {
  const { pathname } = parse(req.url);

  const sendHTML = (status, content) => {
    res.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Mon site Node.js</title>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `);
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
