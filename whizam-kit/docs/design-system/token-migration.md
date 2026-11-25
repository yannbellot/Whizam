# Migration du design system

Cette procédure accompagne le passage d’une ancienne copie du design system au modèle à primitives, tokens de composant et tokens locaux de page. Consulter la [politique](policy.md) et la [table de correspondance et valeurs](simple-token-migration.json) pour identifier les sources et usages à migrer.

Travailler sur copie complète et inactive, sans état privé de l’éditeur. Depuis un kit équipé, `node scripts/migrate-simple-tokens.mjs SOURCE DESTINATION` prépare les sources JSON et recettes dans une destination neuve, sans modifier SOURCE. La mise à niveau d’un projet déjà distribué demande son propre mandat et ses vérifications de consommateurs.

Ne pas convertir de reçu ou journal d’une ancienne version. Pour revenir en arrière, restaurer ensemble les sources et le code compatibles ; jamais un rollback partiel de l’autorité.
