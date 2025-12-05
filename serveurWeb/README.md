# TP Node.js

My digital school - TP API

## Description

Ce TP a pour objectif de se familiariser avec Node.js et ses fonctionnalités principales :

Le projet consiste à développer un Serveur Web.

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
