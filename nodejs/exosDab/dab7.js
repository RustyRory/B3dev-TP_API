const DEVISES_AUTORISEES = ["$", "€"];
import { determineCoupureGeneric } from "./dab7_functions.js";
import { createInterface } from "node:readline/promises";

const READLINE = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const MONTANTINPUT = parseFloat(
  await READLINE.question("Entrez le montant : ")
);

if (isNaN(MONTANTINPUT)) {
  console.log("Le montant doit être un nombre.");
  READLINE.close();
  process.exit();
}

const DEVISEINPUT = await READLINE.question("Entrez la devise ($ ou €) : ");

if (!DEVISES_AUTORISEES.includes(DEVISEINPUT)) {
  console.log(`La devise '${DEVISEINPUT}' n'est pas gérée.`);
  READLINE.close();
  process.exit();
}

const RESULT = determineCoupureGeneric({
  montant: MONTANTINPUT,
  typeDevise: DEVISEINPUT,
});

console.table(RESULT.distribution);

READLINE.close();
