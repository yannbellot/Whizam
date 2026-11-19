---
name: backup-and-rollback
description: "Préparer et vérifier sauvegarde, restauration isolée et retour de version en contrôlant la compatibilité du code et du schéma ; sans remise à zéro implicite."
---

# backup-and-rollback

Entrées : données/cible autorisées, version du code/schéma, objectif de récupération et procédure d’opération. Lire docs/agents/skill-contract.md et docs/operations.md ; une procédure non éprouvée reste à qualifier.

## Travail et sortie

Distinguer copie de sauvegarde, restauration de données, migration et retour du code. Identifier source/destination, droits, format, confidentialité, stockage et empreinte ; ne jamais journaliser un dump ou secret réel. Tester d’abord la restauration sur une base synthétique/destination neuve identifiée, comparer contenu/contraintes et relancer le code/migrateur compatible. Un fichier de dump créé n’est pas une restauration vérifiée.

Livrer preuve de sauvegarde/restauration, versions compatibles, limites et marche arrière précise. Ne pas modifier une migration appliquée ni promettre un downgrade destructif. Une suppression/écriture sur ressource préexistante ou partagée exige la décision AGENTS ; sans cible sûre, préparer le dossier et s’arrêter avant mutation. Nettoyage limité aux ressources jetables de l’essai ; conserver les preuves expurgées, pas les données privées dans Git.
