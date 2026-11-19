# DS-EDIT-15 — Revue des règles de nommage

30 octobre 2026 — cible application, tranche documentaire. Candidat : commit contenant ce rapport sur `codex/token-naming-rules`, base `cf761933faba01feeacf266156f7a30eb114ae15`. **En revue : qualification documentaire acquise, acceptation humaine différée.** La migration A–D reste À faire. [Fiche](../work-items/ds-edit-15-component-tokens.md), [règles](../design-system/token-naming.md), [décision 019](../decisions/019-token-naming-by-family-and-usage.md).

## Périmètre et méthode

Lab Maintainer via lab-maintain-agent-kit, puis Instruction Reviewer via lab-evaluate-instructions ; séquentiel, même agent, non indépendant. Critères et scénarios définis dans la fiche avant rédaction. Les textes fournis restent une référence illustrative, sans autorité d’installation, de migration ou de publication. Relecture des règles, renvois, contrats courants et diff ; aucun essai natif d’assistant ni nouvelle inférence fournisseur.

Fichiers : ajout de `docs/design-system/token-naming.md`, de 019 et de ce rapport ; actualisation de 018, des principes, de la spécification de l’éditeur, du README d’autorité et de la fiche DS-EDIT-15. Suivi consolidé dans la roadmap et l’état courant du parent ; modèles applicatifs non initialisés. Aucun YAML, schéma, code, dérivé ou catalogue de skills modifié.

## Scénarios relus

| Cas                                               | Attendu et constat dans les règles                                                                                       |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Couleur isolée `#b51a00`                          | Nom par valeur exacte, sans teinte ni intention inventée ; palette illustrée non importée.                               |
| `1rem` et `16px`, coefficient et dimension        | Unités/natures distinctes ; pas de conversion implicite ni réutilisation par simple ressemblance.                        |
| Même valeur pour deux intentions                  | Tokens distincts ; métadonnées et table de migration préservent leurs sens. Collision de clé à résoudre avant bascule.   |
| Espacement et corps de texte de même valeur       | Familles pertinentes distinctes, même si le type est `dimension` ; future allocation à raccorder explicitement.          |
| Thème et format d’écran                           | Contextes séparés de l’identité ; état interactif explicite ; aucune capacité de mode ajoutée par le document.           |
| Clés de contenu                                   | Famille conditionnelle, distincte du graphe visuel ; aucune extraction de textes ni traduction engagée.                  |
| Demande trompeuse de tout appliquer immédiatement | Noms cibles distingués du modèle courant ; pas de renommage partiel des seules données, pas de rejeu d’anciens journaux. |
| Valeur complexe ou collision après génération CSS | Encodage déterministe et contrôle de collision préalables ; aucune clé arbitraire ni écrasement autorisé.                |

Résultats de relecture, sans simulation d’un assistant ni preuve de leur efficacité en session native. Aucun défaut bloquant documentaire restant.

## Contrôles exécutés

- `node scripts/validate-lab-kit.mjs` depuis le parent : conforme, quatre skills et trois rôles, séparation conservée.
- `node --test tests/lab-kit.test.mjs` depuis le parent : six tests réussis.
- `node scripts/validate-agent-kit.mjs` depuis la racine du kit : conforme, 21 skills et quatre rôles ; aucune découverte native déduite.
- `python3` en lecture seule, contrôle ciblé des sept documents applicatifs de règles/renvois : 66 liens locaux résolus dans le kit, ancres présentes lorsqu’utilisées ; 38 identifiants littéraux conformes à la syntaxe à points. Les formes génériques avec variables sont exclues de ce contrôle lexical.
- Contrôle final étendu aux dix documents du changement, suivi et rapport inclus : 285 liens locaux et ancres conformes ; aucun lien nécessaire sortant du kit dans ses documents applicatifs.
- Empreintes SHA-256 des 61 fichiers non suivis préexistants, relevées avant écriture et comparées après : identiques. Les 50 entrées du statut Git initial regroupaient notamment `frontend/`. Relevé privé sous `.local/token-naming-rules/`, hors livraison.
- Prettier local, avec la configuration de l’app, sur les trois nouveaux documents : formatage contrôlé. Les documents existants gardent leurs conventions sans reformatage global.
- `git diff --check`, revue du diff et sélection exacte : modifications documentaires seulement ; aucun secret, compte, donnée personnelle, configuration privée ou dérivé ajouté.

## Conclusions et limites

Instruction Reviewer : **satisfaisant** pour les critères documentaires ; déclenchement, limites du mandat et renvois explicites. Relecture design : familles, usages et réglages distingués, sans nouvelle direction visuelle. Relecture technique : différences avec les identifiants exécutés signalées ; encodage complexe, collisions et migration restent à qualifier. Relecture sécurité : aucun accès, secret, service, compte ni permission ajouté. Ces lectures ciblées sont séquentielles, même agent, non indépendantes.

Une nouvelle revue de distribution n’est pas requise : aucun packaging, adaptation, exposition ou dépendance modifié ; les nouveaux renvois nécessaires restent internes au kit. Pas de build, test de propagation, parcours navigateur, migration, extraction d’installation ou essai de sauvegarde : aucun comportement exécuté n’a changé. Leur absence interdit toute qualification runtime des nouvelles règles ; les contrôles et revues A–D restent nécessaires.

**Doc updated.** Risque résiduel : application partielle des noms cibles avant raccordement du moteur ; les avertissements dans principes, autorité et spécification l’explicitent. Aucune publication ni mise à jour des instances ouvertes. Reprise : sur mandat de réalisation, DS-EDIT-15 A puis migration isolée avec table de correspondance et comparaison des rendus ; recette humaine distincte. Aucun travail supplémentaire ouvert par ce bilan.
