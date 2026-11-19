# 034 — Import Figma par composants et remplacement compatible

**14 novembre 2026 — choix fonctionnels/UI approuvés par le porteur ; réalisation techniquement qualifiée sur la couverture décrite, acceptation humaine différée.** Le mandat « Exécute ce chantier » confirme la [synthèse FIGMA-IMPORT-02](../work-items/figma-import-02-component-workflow.md), dont l'import d'écrans comme pages avec destinations explicites. Aucune acceptation de l'implémentation n'est déduite.

## Décision

Le fichier Figma connecté est exploré dans un overlay desktop presque plein écran, marge approximative de 24 px. Pages/écrans, composants, variantes et dépendances sont consultables ; actualisation explicite et lecture seule côté Figma.

L'import prépare une proposition de page/composant réelle et inspectable dans UI Lab, avec ajout ou annulation ciblée dans le seul brouillon actif. Les variantes et dépendances accessibles sont récupérées sans duplication des définitions, avec provenance durable et comparaison séparée des changements Figma et Loomata.

Les valeurs visuelles effectives sont des références. La logique des variables Figma (collections, alias, modes et noms) ne pilote ni l'import ni l'organisation du design system. Loomata conserve l'autorité sur primitives/tokens, propriétaires et nommage selon ses règles existantes ; aucune API Variables requise. Les valeurs/modes non accessibles ne sont pas inventés.

Le remplacement expose sa portée et compare les contrats fonctionnels. Une incompatibilité démontrée est refusée côté service, sans forçage ; **Bouton avec action → Champ de formulaire est interdit par Remplacer**. L'incertitude empêche l'application tant que les vérifications nécessaires manquent. Une transformation fonctionnelle relève d'un chantier distinct explicitement demandé.

## Portée et conséquences

Cette décision complète la décision 033 et remplace le périmètre d'import limité à une sélection et l'exploitation d'alias de variables comme cible courante. Les anciennes références, décisions et preuves restent historiques et lisibles ; aucune migration destructive ni réécriture de preuve.

Le contrat détaillé, les états UI, portées, limites, critères et exclusions restent dans la fiche du chantier jusqu'à consolidation de la spécification de livraison. Pas de T2/T3, de publication, de changement de stack ou d'assouplissement des protections de fichiers. La création des nouveaux composants et de leurs propriétés DS doit préserver les writers et la récupération ; la reprise coordonnée et ses preuves sont consignées dans la fiche.

## Choix techniques délégués — réalisation locale

Le périmètre ne demande pas une reproduction du système de variables Figma. Le chemin déterministe utilise donc un compilateur déclaratif validé, des contrôles React réels et des propriétés DTCG propres à leur propriétaire. Les changements nécessitant du code libre rejoignent une demande d'adaptation, sans élargir le writer générique ni déduire une compatibilité fonctionnelle.

Le cache de source/rendus et la proposition sont privés. Le registre intégré contient la provenance et les versions nécessaires au rendu, sans secret. La normalisation retire les liaisons/collections/modes de variables. Les styles d'une version importée inchangée conservent leurs valeurs Loomata courantes. Une version modifiée reste comparée avant intégration, avec conservation des versions antérieures et confirmation des adaptations locales.

L'extension interne du journal DS coordonne uniquement DTCG, registre et CSS consommateurs. Les identités d'occurrences sont projetées par la page connue ; un repère DOM réutilisé sur une autre page ne suffit pas à recevoir un remplacement local. Les limites du compilateur, les preuves exécutées et la recette humaine sont dans le [bilan FIGMA-IMPORT-02](../reviews/figma-import-02/README.md). Ces choix restent dans la stack existante et ne changent pas la décision fonctionnelle.
