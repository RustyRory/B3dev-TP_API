#!/bin/bash
echo "Déploiement automatique démarré..."
cd /B3dev/B3dev-TP_API || exit
git fetch origin main
git reset --hard origin/main
npm install
npm start
echo "Déploiement terminé."
