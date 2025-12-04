const DEVISES_AUTORISEES = ["$", "€"];
const monModule = require("./dab5_functions.js");
const { createInterface } = require("node:readline");

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Entrez le montant : ", (montantInput) => {
  const montantValue = parseFloat(montantInput);

  if (isNaN(montantValue)) {
    console.log("❌ Le montant doit être un nombre.");
    rl.close();
    return;
  }

  rl.question("Entrez la devise ($ ou €) : ", (deviseInput) => {
    const deviseValue = deviseInput;

    if (!DEVISES_AUTORISEES.includes(deviseValue)) {
      console.log(`❌ La devise '${deviseValue}' n'est pas gérée.`);
      rl.close();
      return;
    }

    // Appel principal
    const result = monModule.determineCoupureGeneric({
      montant: montantValue,
      typeDevise: deviseValue,
    });

    console.log("\n");
    console.table(result.distribution);

    rl.close();
  });
});
