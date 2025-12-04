const DEVISES_AUTORISEES = ["$", "€"];
const MONMODULE = require("./dab5_functions.js");
const { createInterface } = require("node:readline");

const READLINE = createInterface({
  input: process.stdin,
  output: process.stdout,
});

READLINE.question("Entrez le montant : ", (montantInput) => {
  const NOMTANTVALUE = parseFloat(montantInput);

  if (isNaN(NOMTANTVALUE)) {
    console.log("Le montant doit être un nombre.");
    READLINE.close();
    return;
  }

  READLINE.question("Entrez la devise ($ ou €) : ", (deviseInput) => {
    const DEVISEVALUE = deviseInput;

    if (!DEVISES_AUTORISEES.includes(DEVISEVALUE)) {
      console.log(`La devise '${DEVISEVALUE}' n'est pas gérée.`);
      READLINE.close();
      return;
    }

    // Appel principal
    const RESULT = MONMODULE.determineCoupureGeneric({
      montant: NOMTANTVALUE,
      typeDevise: DEVISEVALUE,
    });

    console.table(RESULT.distribution);

    READLINE.close();
  });
});
