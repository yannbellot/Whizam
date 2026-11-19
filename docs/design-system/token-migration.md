# Migration du design system

DS-AUTO-01 retire la couche de décisions sémantiques et non sémantiques. Voir la [politique](policy.md) et la [table de correspondance et valeurs](simple-token-migration.json).

Travailler sur copie complète et inactive, sans état privé de l’éditeur. Depuis un kit équipé, `node scripts/migrate-simple-tokens.mjs SOURCE DESTINATION` prépare les sources JSON et recettes dans une destination neuve, sans modifier SOURCE. La mise à niveau d’un projet déjà distribué demande son propre mandat et ses vérifications de consommateurs.

Ne pas convertir de reçu ou journal d’une ancienne version. Pour revenir en arrière, restaurer ensemble les sources et le code compatibles ; jamais un rollback partiel de l’autorité.
