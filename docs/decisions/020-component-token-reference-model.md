# 020 — Référence effective du token de composant

30 octobre 2026 — choix technique de DS-EDIT-15, dans le mandat de migration à valeurs et rendus constants. [Fiche](../work-items/ds-edit-15-component-tokens.md), [nommage](../design-system/token-naming.md), [couverture](018-complete-token-coverage.md).

Le binding est l’autorité du token de composant, avec son identité existante `component.<component>.<variant>.<part>.<property>.<state>`. `reference` désigne sa référence effective, sémantique ou primitive ; `style` conserve son attribution sémantique. Une référence propre porte sa provenance. Rétablir remplace la référence effective par cette attribution, dont la valeur partagée courante peut avoir évolué. Il n’existe plus d’exception contenant une primitive en dehors du token ni de deuxième entrée portant la même identité.

Le modèle et les sources préparées passent en version 3, le snapshot et le protocole de sauvegarde en version 2. Les noms sémantiques sont calculés par domaine/usage à partir de leurs intentions conservées ; les familles de primitives restent distinctes des types. Les homonymes de catalogue ne sont jamais fusionnés.

Une migration explicite transforme les seules sources, conserve les valeurs et les provenances et produit une correspondance complète, y compris lorsqu’une ancienne primitive doit être scindée entre familles. Les alias historiques restent pour les consommateurs existants. Une racine déjà munie de reçus n’est pas migrée en place : conserver cette racine et son outillage, importer les seules sources dans une instance neuve puis régénérer. Aucun reçu, capacité, propriétaire, brouillon ou état de compte n’est converti ou distribué.
