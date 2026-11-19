---
name: data-permissions-migrations
description: "Définir ou faire évoluer schéma, validations, propriété et permissions des données, avec migrations PostgreSQL/Drizzle rejouables et tests isolés."
---

# data-permissions-migrations

Entrées : règles métier/données, exposition/comptes, schéma courant et versions à migrer. Lire docs/agents/skill-contract.md, contrat de données et procédures d’opération.

## Travail et sortie

Définir contraintes et droits avant code/migration ; distinguer validation TypeScript et entrées runtime, authentification et autorisation serveur. Sans comptes, annoncer le périmètre local sans inventer d’isolation multi-utilisateur. Avec comptes, choisir la méthode autorisée puis tester refus et accès croisés.

Générer/relire/versionner SQL et métadonnées, appliquer sur base vide et jeu de l’état précédent si évolution. Seed synthétique répétable sans écrasement ; aucune synchronisation directe de schéma comme livraison. Évaluer compatibilité du code, sauvegarde et reprise avant transformation réelle. Livrer contrats/tests/documents synchronisés et preuves expurgées. Toute cible non isolée, donnée réelle ou opération difficilement réversible suit les décisions matérielles AGENTS ; ne pas promettre une annulation automatique des migrations.
