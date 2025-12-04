// objectif du DAB (distributeur Automatique de Billet) : Passez en paramètre une somme entière inférieur à 200€.
// Le programme doit ensuite vous afficher "XX€ represente Y billet(s) de 50€ et Z billets de 20€ ..." soit la plus petite coupure pour représenter cette sommme en billet (50€, 20€, 10€ et 5€) et en pièce (2€ et 1€).
// Vous devrez utilier Math.floor() certainement.

const montant = parseInt(process.argv[2]);

if (isNaN(montant) || montant <= 0 || montant >= 200) {
  console.log("Veuillez entrer une somme entière valide inférieure à 200€.");
  process.exit(1);
}

let reste = montant;
const billetsEtPieces = {
  "50€": 0,
  "20€": 0,
  "10€": 0,
  "5€": 0,
  "2€": 0,
  "1€": 0,
};

const coupures = [50, 20, 10, 5, 2, 1];

for (const coupure of coupures) {
  billetsEtPieces[`${coupure}€`] = Math.floor(reste / coupure);
  reste = reste % coupure;
}

let resultat = `${montant}€ represente `;
const parts = [];
for (const [coupure, quantite] of Object.entries(billetsEtPieces)) {
  if (quantite > 0) {
    parts.push(`${quantite} billet(s) de ${coupure}`);
  }
}
resultat += parts.join(" et ") + ".";

console.log(resultat);
