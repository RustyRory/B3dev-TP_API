# 📥 INSTALLATION

Ce guide explique comment installer Node.js et Visual Studio Code (VSCode), nécessaires pour exécuter et développer le projet DAB en Node.js.

## 🧰 Prérequis

Un ordinateur sous Windows, macOS ou Linux

Une connexion Internet

## Installer Node.js

Node.js permet d’exécuter du JavaScript côté serveur et fournit l’outil npm.

### 🌐 Télécharger Node.js

➡️ Rendez-vous sur le site officiel :
https://nodejs.org/

### ✔️ Quelle version choisir ?

LTS (Recommended) → version stable
Toujours choisir celle-ci pour un TP ou projet en cours.

### 💾 Installation

Suivez les étapes :

- Télécharger l'installateur
- Lancer le fichier téléchargé
- Cliquer sur Next plusieurs fois
- Garder toutes les options par défaut
- Terminer l’installation

### 🧪 Vérifier l'installation

Ouvrir un terminal (CMD, PowerShell ou Terminal macOS) :

```
node -v
npm -v
```

Si deux versions s’affichent, Node.js est correctement installé 🎉

## Installer Visual Studio Code (VSCode)

VSCode est l’éditeur recommandé pour développer en Node.js.

### 🌐 Télécharger VSCode

➡️ https://code.visualstudio.com/

Télécharger la version adaptée à votre système (Windows, macOS ou Linux).

### 💾 Installation

Lancer l’installateur

Choisir Add to PATH si proposé

Installer les options par défaut

## Extensions recommandées dans VSCode

Dans `VSCode → Ctrl + Shift + X` → Rechercher et installer :

- ESLint
- Node.js Extension Pack
- Code Runner (optionnel)
- Prettier – Code formatter (mise en forme)

## Configurer le Débogage Node.js

VSCode détecte automatiquement Node.js.

Pour créer une configuration de debug :

- Ouvrir VSCode
- Aller dans l’onglet Run & Debug (icône ▶)
- Cliquer sur Create a launch.json
- Choisir Node.js

Dans ton TP, tu dois ajouter :

```
"console": "integratedTerminal"
```

Cela permet d'utiliser le module readline sans bug.

## Exécuter un script Node.js

Dans un terminal ouvert dans ton projet :

```
node app.js
```

Ou avec un argument :

```
node app.js 137 euro
```
