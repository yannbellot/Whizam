# 023 — Portée explicite et intention décrite dans Apparence

31 octobre 2026 — mandat DS-EDIT-23, contrat implémenté, qualification technique acquise et acceptation humaine différée selon le [bilan](../reviews/ds-edit-23-explicit-style-intent.md). Remplace le choix automatique de portée de 017 et les entrées d’édition Styles des décisions 012–014, en conservant le modèle v4 de 022 et le nommage déclaratif de DS-EDIT-22.

Une modification valide d’une référence effectivement sémantique pose systématiquement la question dans Apparence, sans inférence : modifier le token partagé, définir une intention, ou personnaliser le réglage. Une référence primitive s’édite directement ; son attribution de rétablissement n’est pas sa portée effective. Un token de composant conserve son identité ; aucun suffixe ni doublon n’est créé.

Le designer précise la portée. Codex intervient seulement sur une description d’intention pour proposer une réutilisation, une nouvelle intention documentée ou une clarification. Le moteur valide la proposition, calcule le nom canonique et contrôle la compatibilité avant projection. Les objets techniques et primitives restent construits de manière déterministe. Aucune écriture libre ni permission nouvelle n’est attribuée au modèle.

Styles et ses formulaires disparaissent ; les catalogues restent consultables et les usages prévisualisables depuis Apparence, avec retour au geste conservé. Appliquer prépare le brouillon ; Enregistrer reste l’unique écriture durable. L’édition locale et partagée déterministe reste utilisable sans compte IA ; l’interprétation libre d’une intention exige le raccordement Codex existant.

Le catalogue sémantique doit participer à la même transaction que le nouveau token et son attribution. La conception doit distinguer les ajouts de données d’intention des domaines exécutables immuables : types, sélecteurs, propriétés, états, catégories, règles de nommage et taxonomie ne deviennent pas modifiables par le modèle. Les plans périmés ou non corrélés sont refusés. Les versions de protocole et leurs refus seront consignés après implémentation ; aucune compatibilité d’anciens reçus n’est déduite.

Les critères, dépendances, exclusions et contrôles restent dans la [fiche DS-EDIT-23](../work-items/ds-edit-23-explicit-style-intent.md). Une décision de contrat ne constitue pas une preuve de fonctionnement.

## Contrat technique retenu

`projectTransaction` projette un résultat modèle + catalogue, partagé par tous les consommateurs. L’opération fermée `define-and-assign` porte une intention documentée et un binding existant ; elle ajoute l’intention dans une catégorie compatible existante et une éligibilité pour son rôle, puis crée et attribue le token sémantique calculé. Les définitions existantes, catégories, compatibilités structurelles et taxonomie restent immuables. Une extension additive est vérifiée à la relecture contre l’autorité compilée ; un doublon lexical ou un synonyme exact est refusé, l’équivalence de sens restant une responsabilité de l’interprétation et de la revue humaine.

Écriture v4 et interprétation d’intention v1 ; modèle v4 et enveloppe snapshot v3 inchangés. Le manifeste v9 inclut le catalogue comme neuvième source mutable. Les anciennes racines et leurs reçus restent conservés avec leur version ; ils ne sont ni convertis ni importés dans une nouvelle racine de recette. La recette ne peut être actualisée avec un journal actif ou un brouillon humain non résolu.
