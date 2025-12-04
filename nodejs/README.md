# TP Node.js

My digital school - TP API

## Description

Ce TP a pour objectif de se familiariser avec Node.js et ses fonctionnalités principales :

- Création de scripts Node.js
- Utilisation de variables et arguments (process.argv)
- Création de fonctions modulaires
- Gestion de modules externes
- Interaction utilisateur avec le module readline

Le projet consiste à développer un Distributeur Automatique de Billets (DAB) capable de calculer la répartition d’un montant donné en différentes coupures (billets et pièces) selon la devise choisie.

### 🗂 Structure du projet

```
.
├── app.js # Script principal
├── dab.js # Module de calcul des coupures
└── .vscode/
└── launch.json # Config VSCode pour le débogage
```

## 🚀 Installation et exécution

1. Cloner le projet :

```
git clone <url-du-projet>
cd <nom-du-dossier>
```

2. Vérifier que Node.js est installé :

```
node -v
```

3. Exécuter le script :

```
node app.js
```

## Fonctionnalités

### Premier script

Affiche un prénom :

```
node app.js
```

### Variables d’environnement

Permet de passer un prénom en paramètre :

```
node app.js Gabriel
```

### DAB – Calcul des billets et pièces

```
Montant ≤ 200€

Billets : 50€, 20€, 10€, 5€

Pièces : 2€, 1€
```

### DAB2 – Gestion via un tableau de coupures

Utilise une boucle pour toutes les coupures

Code plus court et modulable

### DAB3/DAB4 – Fonctions génériques

```
determineCoupureGeneric({ montant: 137, typeDevise: "€" })
```

Gère différentes devises (Euro, Dollar)

Paramètre sous forme d’objet → facile à étendre

### DAB5 – Module externe

determineCoupureGeneric dans dab.js

Import dans app.js :

```
const { determineCoupureGeneric } = require('./dab');
```

### DAB6 – Interaction utilisateur

Utilise readline pour demander le montant et la devise
Exemple d’exécution :

```
Montant : 137
Devise (€/$) : €
Résultat : { '50 euro': 2, '20 euro': 1, '10 euro': 1, '5 euro': 1, '2 euro': 1, '1 euro': 0 }
```

### DAB7 – ESModule

Convertissez le projet en ESModules (import / export) en ajoutant "type": "module" dans le package.json.
Utilisez maintenant top-level await pour rendre les questions plus lisibles avec le module :

```
import readline from 'node:readline/promises';
```

Exemple minimal :

```
const montant = await rl.question('Montant : ');
const devise = await rl.question('Devise : ');

```

### DAB8 - Publier le package

Reprendre le DAB puis :

- Placer votre bibliotèque dab.js dans un répertoire "DAB" puis convertisez-le en module NPM 🤩 via les commandes ci-dessus.
- Dans votre programme (index.js), ne faite plus appel à votre biblioteque local, mais installer plutot votre nouveau package. Installez-le via la commande "npm install xxxx --save" et utilisez-le.
