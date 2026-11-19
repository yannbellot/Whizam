# 019 — Noms par famille technique et usage

**Raccordement DS-EDIT-15 :** la [décision 020](020-component-token-reference-model.md) et le [guide de migration](../design-system/token-migration.md) décrivent le modèle courant. Les mentions de migration non réalisée ci-dessous conservent l’état à la date de cette décision initiale.

30 octobre 2026 — évolution documentaire demandée par le porteur à partir d’une référence illustrative. **Règles cibles documentées ; migration non réalisée.** La [convention de nommage](../design-system/token-naming.md) est la source détaillée ; [DS-EDIT-15](../work-items/ds-edit-15-component-tokens.md) porte les travaux restant à réaliser.

## Choix et motifs

Organiser les primitives par famille technique et valeur ou repère d’échelle défini, sans usage métier. Nommer les tokens sémantiques par domaine et usage ; garder les intentions et compatibilités en métadonnées sans imposer toute leur taxonomie au nom. Les tokens de composants gardent le tuple composant/variante/partie/propriété/état. Les modes sont des contextes séparés des identités.

Conserver les identifiants à points et les préfixes du kit adapte la référence sans introduire un second système de noms à barres obliques. Conserver les unités évite de confondre `1rem` et `16px`. Une échelle ne se déduit pas d’une couleur isolée : le nom par valeur reste disponible. Aucun catalogue exhaustif ni palette n’est créé. Les clés de contenu et les modes supplémentaires restent conditionnels, sans nouveau comportement.

## Portée et transition

Remplace la seule proposition de nommage de la décision [018](018-complete-token-coverage.md), ainsi que les modèles de noms antérieurs de [005](005-design-system-editor-authority.md) et [006](006-component-token-migration.md) pour la future migration. Leurs preuves et les identités exécutées restent historiques/courantes selon leur version. Les règles de couverture par tokens, de portée et de rétablissement de 018 sont conservées.

Le passage d’une clé sémantique fondée sur type/catégorie/intention à domaine/usage exige une table complète ; aucune intention distincte ne disparaît sur simple égalité de valeur ou collision de nom. La déduplication de primitives tient aussi compte de la famille pertinente. Schémas, catalogue et moteur ne sont pas modifiés ici ; les cas complexes et collisions doivent être qualifiés avant activation. Cette demande autorise l’évolution des règles, sans réaliser DS-EDIT-15 A–D ni accepter une nouvelle direction visuelle.
