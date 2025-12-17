#!/bin/bash
echo "Déploiement automatique démarré..."
cd /B3dev/B3dev-TP_API || exit

# Récupérer les dernières modifications depuis GitHub
git fetch origin main
git reset --hard origin/main

# Installer les nouvelles dépendances si besoin
npm install

# Démarrer l'application
npm start

echo "Déploiement terminé."
