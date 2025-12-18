// Fonction générique pour déterminer la distribution des coupures
//
// Pour Exporter la fonction pour qu'elle puisse être utilisée dans d'autres fichiers
// import { determineCoupureGeneric } from './dab.js';
//
// params: {montant: number, typeDevise: string, coupure: array (optionnel)}
// retourne: {montant: number, typeDevise: string, distribution: object}
//
// Usage:
// const result = determineCoupureGeneric({montant: 137.36, typeDevise: '€'});
// Exemple de résultat:
// {
//   montant: 137.36,
//   typeDevise: '€',
//   distribution: {
//     '100€': 1,
//     '20€': 1,
//     '10€': 1,
//     '5€': 1,
//     '2€': 1,
//     '0.2€': 1,
//     '0.1€': 1,
//     '0.05€': 1,
//     '0.01€': 1
//   }
// }

export function determineCoupureGeneric(params) {
  // initialisation du résultat
  let result = {
    montant: params.montant, // valeur du montant
    typeDevise: params.typeDevise, // type de devise
    distribution: {}, // objet de coupures
  };

  // determine l'objet de coupures selon la devise
  let coupure = params.coupure; // si coupure est fournie dans les paramètres on l'utilise
  // sinon on utilise les coupures par défaut selon la devise
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

  // calcul de la distribution des coupures
  // si le type de devise est reconnu et que les coupures sont définies
  if (params.typeDevise && coupure) {
    // boucle sur chaque coupure pour déterminer le nombre de billets/monnaies
    for (let i = 0; i < coupure.length; i++) {
      // calcul du nombre de billets/monnaies pour la coupure courante (position i)
      let nbrBillet = Math.floor(params.montant / coupure[i]);
      // si au moins un billet/monnaie est nécessaire pour cette coupure
      if (nbrBillet > 0) {
        // mise à jour du montant restant à distribuer
        params.montant = (params.montant - nbrBillet * coupure[i]).toFixed(2); // on fixe à 2 décimales pour éviter les erreurs de flottants
        result.distribution[`${coupure[i]}${params.typeDevise}`] = nbrBillet; // ajout de la coupure et du nombre de billets/monnaies dans le résultat
      }
    }
  }
  return result;
}
