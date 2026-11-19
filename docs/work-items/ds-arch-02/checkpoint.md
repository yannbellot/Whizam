# DS-ARCH-02 — Point de reprise avant modification des contrats

6 novembre 2026 ; base `bef11bd`, branche `codex/ds-arch-02-decision-system`. L’orientation est **validée** et le mandat de réalisation A–D est acquis : conventions réutilisables, conservation des exceptions locales et valeurs/rendus constants. Aucune nouvelle validation de cette orientation n’est nécessaire. Préflight : racine Git attendue, aucun changement suivi préexistant ; doublons, recettes et brouillons conservés. Aucun token, contrat exécutable, rendu ou source applicative modifié à ce point.

## Constats établis pendant A

Trois contrats doivent être réconciliés avant le déplacement des références :

1. Le graphe JSON DTCG accepte Decision→Decision, avec classification explicite. Les décisions éditables sont toutefois projetées dans un modèle de style identifié par intention/rôle/état ; les chaînes du modèle exigent le même rôle et une famille primitive compatible. Ajouter des échelles transverses demande donc une allocation par rôle compatible et une définition claire de la portée, pas une insertion automatique entre chaque composant et sa primitive.
2. `scripts/token-composition.mjs`, dans `projectComposition`, ne construit que des primitives et des tokens de composants pour la composition. Son contrôle de paramètres exige `token.meta.kind === 'primitive'`. `scripts/ui-composition.mjs` réassemble ensuite un univers de références différent : styles éditables + primitives de composition. Les nouvelles conventions de composition ne peuvent pas être ajoutées uniformément sans adapter projection et validation.
3. Les tokens de composants conservent référence effective, attribution partagée et base primitive de rétablissement distinctes. Une nouvelle décision initiale ne doit ni transformer une exception en attribution partagée, ni détourner les bases historiques, ni donner une fausse déclaration d’inventaire complet au service d’édition. Les règles CSS/recettes et les conventions éditables n’ont pas les mêmes permissions.

La difficulté est la conception d’un raccordement cohérent de ces trois graphes, y compris les frontières d’édition et la reprise des sources. Ce n’est pas un simple ajout de rubrique ou une défaillance ordinaire de test. L’incertitude restante concerne le lieu de projection des décisions de composition et les limites des conventions de paramètres, pour conserver propagation, types, portée et sérialisation.

## Diagnostic effectué, sans écriture applicative

Lecture du modèle DTCG et des règles YAML via Node 24 local ; baseline `projectComposition` : **148 tokens/sorties de composition projetés**. Sur une copie entièrement en mémoire : création d’une décision non sémantique de composition référençant un paramètre primitif existant, puis remplacement de ce seul paramètre dans les recettes. `buildTokenDocument` accepte le graphe, mais `projectComposition` refuse avec **`invalid-css-recipe-reference`**. Aucun fichier candidat, dérivé ou journal écrit. Ce refus attendu documente la frontière actuelle ; il ne constitue ni un test de qualification échoué de la migration, ni une preuve d’une régression du produit actuel.

Autres inspections : validation des chaînes de styles dans `src/design-system/editor/contract.ts`, attribution/résolution/inventaire dans `editor/draft.ts`, `editor/attribution.ts`, `token-resolution.ts` et projection/metadata dans `scripts/dtcg-tokens.mjs`. Les tests existants couvrent déjà une convention non sémantique scalaire et les chaînes DTCG ; ne pas prétendre que toute cette capacité manque. Ils ne qualifient pas le raccordement nouveau à toutes les recettes/compositions.

## Reprise demandée

**Recommandation : GPT-6.1 Sol · Très élevée (`xhigh`).** Ne pas changer de modèle ni de préférence globale automatiquement. Aucun réglage effectif de l’utilisateur n’a été vérifié. Le passage se justifie par les contrats distincts effectivement inspectés et le besoin de raisonner sur leurs effets communs, au-delà de l’enrichissement local initialement envisagé à Élevée.

L’AGENTS racine demande d’arrêter la partie concernée lorsqu’une telle hausse est justifiée, après conservation des preuves et de l’incertitude. Attendre sélection manuelle et demande explicite de reprise. Conserver le mandat et la validation déjà donnés ; ne pas redemander l’autorisation des décisions approuvées.

Après reprise : terminer A avec la table d’allocation par identité et les définitions/justifications, préciser le contrat de projection partagé et ses exceptions, puis B–D sur copies isolées avec contrôles de valeurs et captures avant/après. Préserver la recette DS-EDIT-75 et ses saisies ; aucune copie de compte/journal ou modification de protection. Les mises à jour des autorités de conception ne sont pas encore faites. Doc updated ; aucune publication.

## Reprise autorisée

6 novembre 2026 : Très élevée sélectionnée et reprise explicitement demandée. La base courante est `32102be` (lanceur local intégré depuis l’arrêt), branche `codex/ds-arch-02-delivery`. Le chantier et la sélection de conventions sont repris sans écraser l’intégration du lanceur. Ce checkpoint décrit le diagnostic historique, pas une attente encore active.
