const DEVISES_AUTORISEES = ["$", "€"];
import { determineCoupureGeneric } from "./dab7_functions.js";
import { createInterface } from "node:readline/promises";

const READLINE = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const MONTANTINPUT = await READLINE.question("Entrez le montant : ");
const NOMTANTVALUE = parseFloat(MONTANTINPUT);

if (isNaN(NOMTANTVALUE)) {
  console.log("Le montant doit être un nombre.");
  READLINE.close();
  process.exit();
}

const DEVISEINPUT = await READLINE.question("Entrez la devise ($ ou €) : ");
const DEVISEVALUE = DEVISEINPUT;

if (!DEVISES_AUTORISEES.includes(DEVISEVALUE)) {
  console.log(`La devise '${DEVISEVALUE}' n'est pas gérée.`);
  READLINE.close();
  process.exit();
}

const RESULT = determineCoupureGeneric({
  montant: NOMTANTVALUE,
  typeDevise: DEVISEVALUE,
});

console.table(RESULT.distribution);

READLINE.close();
