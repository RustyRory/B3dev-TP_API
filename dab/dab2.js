const montant = parseFloat(process.argv[2]);

if (isNaN(montant) || montant <= 0 || montant >= 1000) {
  console.log("Veuillez entrer une somme valide inférieure à 1000€.");
  process.exit(1);
}

let reste = montant;

// Coupures uniques
const coupures = [
  500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01,
];

const billetsEtPieces = {};

for (const coupure of coupures) {
  billetsEtPieces[coupure] = Math.floor(reste / coupure);
  reste = +(reste % coupure).toFixed(2);
}

let resultat = `${montant}€ représente :\n`;

const parts = [];

Object.entries(billetsEtPieces).forEach(([valeur, quantite]) => {
  if (quantite > 0) {
    // Condition : billet ou pièce ?
    if (Number(valeur) >= 5) {
      parts.push(`${quantite} billet(s) de ${valeur}€`);
    } else {
      parts.push(`${quantite} pièce(s) de ${valeur}€`);
    }
  }
});

resultat += parts.join("\n");

console.log(resultat);
