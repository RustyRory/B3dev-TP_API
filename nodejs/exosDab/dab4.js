const DEVISES_AUTORISEES = ["$", "€"];
let montant = parseFloat(process.argv[2]); //avec parseFloat 😁
let deviseChoisie = process.argv[3];

if (!DEVISES_AUTORISEES.includes(deviseChoisie)) {
  throw new Error(`La devise ${deviseChoisie} n'est pas gérée`);
}

//function determineCoupureGeneric(montant, typeDevise){	//ancienne signature
function determineCoupureGeneric(params) {
  let result = {
    montant: params.montant,
    typeDevise: params.typeDevise,
    distribution: [],
  };
  // determine le tableau de coupure
  let coupure = params.coupure;
  if (!params.typeDevise || params.typeDevise == "€")
    coupure = [
      500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01,
    ];
  else if (params.typeDevise == "$")
    coupure = [100, 50, 20, 10, 5, 2, 1, 0.5, 0.25, 0.1, 0.05, 0.01];
  else if (params.typeDevise == "£")
    coupure = [50, 25, 10, 5, 2, 1, 0.5, 0.25, 0.1, 0.05, 0.01];
  else if (params.typeDevise == "¥")
    coupure = [1000, 500, 200, 100, 50, 25, 10, 5, 2, 1];

  // commentaire
  if (params.typeDevise && coupure) {
    for (let i = 0; i < coupure.length; i++) {
      let nbrBillet = Math.floor(params.montant / coupure[i]);
      if (nbrBillet > 0) {
        params.montant = (params.montant - nbrBillet * coupure[i]).toFixed(2);
        result.distribution[coupure[i] + params.typeDevise] = nbrBillet;
      }
    }
  }
  return result;
}

// avant
const result = determineCoupureGeneric(montant, deviseChoisie);
console.table(result.distribution);

// après
//v1
console.table(
  determineCoupureGeneric({
    montant: montant,
    typeDevise: deviseChoisie,
  }).distribution
); // nouvel appel

//v2 optimisation de l'objet

console.log(
  determineCoupureGeneric({
    //'montant': montant,
    typeDevise: deviseChoisie,
    montant, // on peut ne pas présicé le nom de la propriété
  })
);

//v3 optimisation : une variable de moins
console.log(
  determineCoupureGeneric({
    montant,
    typeDevise: deviseChoisie,
  })
);

// avantage : compréhension des paramètres
// A quoi sert le 3ieme true ?
determineCoupureGeneric(88, "€", false, true, true, false, true, true);

// A quoi sert le 3ieme true ?
determineCoupureGeneric({
  nom: "clement", // on peut en avoir en trop ... c'est pas grave
  montant: 88,
  typeDevise: "€",
  isAdmin: true,
  reload: true,
  fullscreen: true,
  txtInFrench: true, // on peut en avoir des ancien plus géré, ca marche encore !
});
// On est rétro compatible !

// appel v1 : le false est pour l'option fullscreen
determineCoupureGeneric(88, "€", true, true, false, true, true);
// appel v2 : le false N'est PLUS pour l'option fullscreen
determineCoupureGeneric(88, "€", true, true, false, true, true);
