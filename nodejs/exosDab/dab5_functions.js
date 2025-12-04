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

module.exports.dabFunction = determineCoupureGeneric;
