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
├── app.js # Script principal du serveur Express
├── utils/dab.js # Module distributeur de billets
├── views/pages # Templates EJS pour les pages
├── views/partials # Includes EJS (header, footer, head)
└── .vscode/
└── launch.json # Configuration VSCode pour le débogage
```

## 🚀 Installation et exécution

1. Cloner le projet :

```
git clone git@github.com:RustyRory/B3dev-TP_API.git
cd serveurExpress
```

2. Vérifier que Node.js est installé :

```
node -v
```

3. Exécuter le script :

```
npm run start
```

## TP Node.js - Étapes et fonctionnalités

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

### ServeurWeb

Créez un serveur http. Il devra pouvoir répondre à 2 ou 3 pages.

- La fonction res.writeHead accepte un 2ieme parametre (un objet) pour completer le head de la réponse. Préciser un Content-Type égale à "text/html".
- Améliorer la réponse en intégrant du HTML dedans.
- Après avoir lue la doc du module url, utilisez-le pour parser l'url et gérer 3 ou 4 pages dans votre appli.
- N'oubliez pas de gérer une page 404.
- Pensez à intégrer nodemon directement dans VSCode.

### ServeurWeb2

Continuez votre serveur, mais au lieu d'écrire directement le HTML dans la réponse, allez lire des fichiers directement stockés dans un répertoire prévu à cet effet.

- Dans votre serveur, remplacer les fichiers statiques HTML par des templates ejs dynamique.
  - Commencez par faire le rendu d'un fichier ejs "simple".
  - Puis ajoutez des includes dedans de la partie header et footer.
- Rendez le title de toutes les pages dynamiques.
  - Envoyez des datas à chaque page pour le titre change.
- Depuis n'importe quelle page, on doit pouvoir ajouter le parametre isAdmin. Si il passe à true, on doit alors voir une modification dans le site (changement de la couleur de fond par exemple).
- Cette modification doit rester, jusqu'à ce que la variable isAdmin repasse à false. Vous devez utiliser les cookies (via request.headers.cookie) pour stoker cette information chez le client.

### Serveur Express

Initialiser un nouveau projet, et faite une copie de votre précédent travail. Tranformer votre server web HTTP en serveur Express. Ajouter les fonctionnalités suivantes :

- Créez des nouvelles routes avec variables dedans
- Le fichier principale doit s’appeler app.js et doit tourner sur le port 8080.
- Utilisez des templates avec des includes dedans [via le module ejs].
- Ajoutez dans une page, un formulaire pour se connecter et passer en mode admin. Le login et le password devront être "admin". Conservez les informations dans une session et faire apparaître "Bienvenue login" dans toutes les pages.
- Créer un bouton de déconnexion.
- Créer un menu de navigation avec plusieurs pages. Attention, je tiendrais compte de la qualité du site web.
- Ajoutez une route pour télécharger un fichier YYYYMMDD_HHmmss.txt qui contient la date du téléchargement ... bref, vous aller devoir utiliser FS.
- Dans la navigation, mettre un lien visible vers une page d'erreur (et gérer une page 404 du coup)
- Attention, votre site web doit être "joli" et contenir des balises HTML5 entre autre
- L'installation doit se faire uniquement via la commande "npm install". Attention tout vos modules doivent être en installés en local (--save) et pas en globale (-g)
- Ajoutez dans votre package.json , dans "scripts", la ligne suivante "start": "node app.js"
- Ajoutez dans votre projet un fichier readme.md avec les instructions d’installation.

Et vous vous souvenez du DAB ?

- Inclure une page avec une route dynamique qui prends un montant en dynamique
- Cette page doit utiliser votre module DAB et afficher le plus petite coupure pour le montant passer en paramètre

- Déploiement du projet sur VPS
