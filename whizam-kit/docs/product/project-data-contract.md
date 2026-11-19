# Contrat de données initial — Projets de démonstration

Hypothèse minimale et réversible de P1-03, cohérente avec REF-01 : préparer la persistance avant les parcours J3. Ce document ne spécifie pas encore les interactions complètes et ne vaut pas acceptation humaine.

| Champ | Contrat |
|---|---|
| `id` | UUID, généré par PostgreSQL par défaut ; identifiants stables réservés au seed synthétique. |
| `name` | Texte requis ; 1 à 100 caractères après trim applicatif ; contrainte DB empêchant un nom vide ou trop long. Aucun nom unique imposé. |
| `description` | Texte facultatif ramené à chaîne vide ; maximum 2000 caractères. |
| `createdAt` | Date avec fuseau, défaut serveur PostgreSQL. |
| `updatedAt` | Date avec fuseau, défaut serveur PostgreSQL ; actualisation par le repository serveur lors d’une modification. |

Le seed ajoute seulement deux projets fictifs par identifiants réservés ; un conflit d’identifiant ne modifie jamais une donnée existante. Les tests utilisent une base éphémère indépendante. Aucun compte, propriétaire, partage ou garantie multi-utilisateur ne découle de ce modèle. La [spécification P3-01](features/projects.md) décrit validation utilisateur, erreurs, états et opérations ; le repository P3-02 implémente les traitements côté serveur.
