# TP Node.js

My digital school - TP API

## Description

Ce TP a pour objectif de se familiariser avec Node.js et ses fonctionnalités principales :

Le projet consiste à développer un Serveur Web en Express.

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

### ServeurWeb Express

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
