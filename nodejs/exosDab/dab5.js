const DEVISES_AUTORISEES = ["$", "€"];

// dab5.js
const monModule = require("./dab5_functions.js");

let montant = parseFloat(process.argv[2]); // avec parseFloat 😁
let deviseChoisie = process.argv[3];

if (!DEVISES_AUTORISEES.includes(deviseChoisie)) {
  throw new Error(`La devise ${deviseChoisie} n'est pas gérée`);
}

// Appel principal
const result = monModule.dabFunction({
  montant,
  typeDevise: deviseChoisie,
});
console.table(result.distribution);
