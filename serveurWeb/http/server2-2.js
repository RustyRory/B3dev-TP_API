import http from "node:http";
import { parse } from "node:url";
import fs from "node:fs";

const server = http.createServer(async (request, response) => {
  const { pathname } = parse(request.url);

  const sendHTML = (status, content) => {
    response.writeHead(status, {
      "Content-Type": 'text/html; charset=utf-8; lang="fr"',
    });
    response.end(content);
  };

  // Fonction utilitaire pour lire un fichier HTML
  const renderFile = async (filePath, res, status = 200) => {
    try {
      fs.readFile(filePath, (err, content) => {
        sendHTML(status, content);
      });
    } catch (err) {
      sendHTML(
        500,
        "<h1>Erreur serveur</h1><p>Impossible de lire le fichier html.</p>"
      );
    }
  };

  if (pathname === "/") {
    await renderFile("views/html/index.html", response);
  } else if (pathname === "/contact") {
    await renderFile("views/html/contact.html", response);
  } else if (pathname === "/about") {
    await renderFile("views/html/about.html", response);
  } else {
    await renderFile("views/html/404.html", response, 404);
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
