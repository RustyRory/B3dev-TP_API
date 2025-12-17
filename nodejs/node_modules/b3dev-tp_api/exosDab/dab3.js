const montant = parseFloat(process.argv[2]);
const devise = process.argv[3];

if (isNaN(montant) || montant <= 0 || montant >= 1000) {
  console.log("Veuillez entrer une somme valide inférieure à 1000.");
  process.exit(1);
}

if (devise !== "€" && devise !== "$" && devise == undefined && devise == null) {
  console.log("Veuillez entrer une devise valide : € ou $.");
  process.exit(1);
}

function determineCoupureEuro(montant) {
  const coupuresEuros = [
    500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01,
  ];

  let reste = montant;
  const billetsEtPieces = {};

  for (const coupure of coupuresEuros) {
    billetsEtPieces[coupure] = Math.floor(reste / coupure);
    reste = +(reste % coupure).toFixed(2);
  }

  let resultat = `${montant}€ représente :\n`;
  const total = [];

  Object.entries(billetsEtPieces).forEach(([valeur, quantite]) => {
    if (quantite > 0) {
      if (Number(valeur) >= 5) {
        total.push(`${quantite} billet(s) de ${valeur}€`);
      } else {
        total.push(`${quantite} pièce(s) de ${valeur}€`);
      }
    }
  });

  return resultat + total.join("\n");
}

function determineCoupureDollars(montant) {
  const coupuresDollars = [
    100, 50, 20, 10, 5, 2, 1, 0.5, 0.25, 0.1, 0.05, 0.01,
  ];

  let reste = montant;
  const billetsEtPieces = {};

  for (const coupure of coupuresDollars) {
    billetsEtPieces[coupure] = Math.floor(reste / coupure);
    reste = +(reste % coupure).toFixed(2);
  }

  let resultat = `${montant}$ représente :\n`;
  const total = [];

  Object.entries(billetsEtPieces).forEach(([valeur, quantite]) => {
    if (quantite > 0) {
      if (Number(valeur) >= 5) {
        total.push(`${quantite} billet(s) de ${valeur}$`);
      } else {
        total.push(`${quantite} pièce(s) de ${valeur}$`);
      }
    }
  });

  return resultat + total.join("\n");
}

let resultat;

if (devise === "€") {
  resultat = determineCoupureEuro(montant);
} else {
  resultat = determineCoupureDollars(montant);
}

console.log(resultat);
