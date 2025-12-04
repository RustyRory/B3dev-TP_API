// monScript.js
let prenom = "Damien";
let nom = "Paszkiewicz";

// Récupère le prénom depuis le 3ᵉ élément du tableau argv (index 2)
prenom = process.argv[2] || prenom; // si aucun arg, conserve "Damien"

console.log(`\nJe m'appelle ${prenom} ${nom} !`);
