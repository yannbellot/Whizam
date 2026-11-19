# 018 — Chaque réglage passe par un token

**Raccordement DS-EDIT-15 :** la [décision 020](020-component-token-reference-model.md) et le [guide de migration](../design-system/token-migration.md) décrivent le modèle courant. Les mentions de migration non réalisée ci-dessous conservent l’état à la date de cette décision initiale.

30 octobre 2026 — demande du porteur après l’essai DS-EDIT-14, couleur `#b51a00` sur Button. **Règle cible établie ; migration non réalisée.** Remplace les dispositions de 005/006/017 autorisant une exception directement reliée à une primitive. Leurs preuves restent historiques. [Migration DS-EDIT-15](../work-items/ds-edit-15-component-tokens.md).

## Règles

1. Chaque réglage de style préparé et enregistrable référence un token identifiable et visible dans Tokens. Aucun réglage local ne référence directement une primitive.
2. Un **token sémantique** exprime une intention transversale documentée. Même couleur ne signifie pas même intention ; le rouge ne signifie pas automatiquement erreur ou action destructive.
3. Un **token de composant** exprime un réglage propre à un composant, sa variante, partie, propriété et état, sans intention transversale inventée. Tokens le classe comme tel et affiche valeur résolue et usages. Son nom peut légitimement nommer le composant.
4. Chaque token se résout vers une **primitive du type attendu**. Un alias reste possible si sa chaîne termine sur une primitive, sans cycle ni référence manquante. Un token de composant peut utiliser un token sémantique quand la relation est établie ; ce passage n’est pas obligatoire pour un réglage particulier.
5. Une **primitive** porte une valeur brute. Son nom décrit son type et sa valeur ou sa position dans une échelle technique, sans intention, rôle d’usage, composant ou état. `feedback`, `error`, `success`, `button`, `surface`, `disabled` et `focus` appartiennent aux couches supérieures. La provenance reste une métadonnée.
6. Après saisie, IA ou règle locale réutilise un token compatible si la relation est établie ; sinon elle prépare un token propre au réglage. Aucune exception sans token ni propagation particulière implicite. Les saisies successives modifient la même identité au lieu de multiplier les tokens.
7. Une ambiguïté matérielle ou une propagation partagée conserve la question sous le réglage. Les quatre opérations techniques ne réapparaissent pas. Enregistrer reste la seule sauvegarde durable ; le fonctionnement sans IA suit les mêmes invariants.

## Nommage et exemple

La proposition initiale « type puis valeur » est remplacée par la [décision 019](019-token-naming-by-family-and-usage.md) et sa [convention de nommage](../design-system/token-naming.md) : famille technique pour les primitives, domaine et usage pour les sémantiques, tuple du réglage pour les composants. Cette évolution reste documentaire jusqu’à la migration ; les valeurs complexes et collisions doivent être qualifiées avant activation.

Le fond `#b51a00` du Button doit figurer dans Tokens comme token de composant, par exemple `component.button.default.root.background.default`, relié à `primitive.color.hex-b51a00`. Ce nom illustre un contrat à implémenter, pas un token déjà créé. Action principale conserve sa valeur tant qu’une modification partagée n’a pas été décidée.

`primitive.color.feedback.error`, de valeur `#b91c1c`, reçoit un nom fondé sur cette valeur ; le sens erreur reste au token sémantique. Renommer ne change aucune valeur rendue. Dédupliquer des primitives de même famille/type/valeur exige l’inventaire des références et la conservation des provenances ; cela ne fusionne pas les intentions des tokens utilisateurs.

## Migration

Convertir les exceptions existantes en tokens de composant en conservant valeurs, contextes, attribution d’origine et possibilité de rétablissement. Raccorder contrats, schémas, opérations, résolution, politiques IA/locale, génération, Tokens/Styles, documentation et persistance. Vérifier type, identité, portée et chaîne vers primitive à l’enregistrement. Le moteur DS-EDIT-14 n’implémente pas encore ce modèle.

Préserver les anciennes racines avec leur outillage et leurs reçus : ne pas réécrire leurs journaux ni les rejouer avec un nouveau manifeste. Qualifier une migration déterministe et répétable sur copie isolée, comparer valeurs et rendus, puis préparer la bascule sans perte de brouillon. Aucun état de connexion ne doit accompagner une distribution.
