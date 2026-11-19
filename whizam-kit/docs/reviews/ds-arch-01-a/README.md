# DS-ARCH-01 A — Inventaire et dossier d’arbitrage

**Historique A du 5 novembre 2026 — Inspection réalisée ; arbitrage obtenu ensuite dans [027](../../decisions/027-dtcg-authority-and-css-recipes.md).** Les constats ci-dessous restent datés ; la réalisation et sa qualification suivent la fiche DS-ARCH-01. Doc updated.

## Version, périmètre et mode

Sources du kit au commit `fce1a9e3f0c36b0908ee8f7b110ed9d08bfbf578`. Branche `codex/ds-arch-01-authority-decision`. Cible application, suivi de fabrication au lab ; modèles de suivi applicatifs non initialisés. Préexistants non suivis exclus et préservés. Aucun serveur ou état privé de recette lu, arrêté ou actualisé.

Rôle de réalisation : Lab Maintainer. Procédures applicatives explicitement sélectionnées et lues dans le catalogue, versions au commit ci-dessus : `propose-architecture` et `normalize-design-system`, avec contrat autonome et autorité du kit. Leur qualification historique est celle des sources livrées, pas un nouvel essai natif. La lecture de la bibliothèque active n’ajoute pas de skill à l’exposition du lab.

## Inventaire réellement observé

L’[inventaire JSON](inventory.json) contient **490 identités uniques**, avec source, contexte/consommateur quand disponible, référence effective, terminal et valeur résolue. Le champ `dtcgCandidate` est une proposition de représentation, pas un résultat de validation DTCG ni un fichier de migration appliquée.

| Ensemble | Nombre |
| --- | ---: |
| Primitives du modèle éditable | 25 |
| Styles sémantiques actuels | 17 |
| Tokens de composants préparés | 188 |
| Alias historiques | 24 |
| Primitives de composition CSS | 79 |
| Tokens de composition CSS | 148 |
| Alias de nuanciers générés par règle | 9 |

Parmi les 188 réglages : 51 attributions sémantiques et 137 autonomes. Les 79 valeurs de composition se répartissent en **42 candidates scalaires, neuf composites à qualifier et 28 nécessitant une décomposition/recette**. Cette répartition prudente n’est pas une classification de nouvelles décisions partagées. Les 24 alias historiques n’ont pas été réactivés dans le catalogue des décisions.

Deux collisions entre nom terminal et groupe descendant ont été relevées : `semantic.color.feedback.error` et `semantic.color.feedback.success`. La proposition de chemin utilise `$root` dans ces cas ; les références doivent viser ce token explicitement. Aucun identifiant, fichier ou lien opérationnel n’est renommé par l’inventaire.

Les 15 fichiers sources de valeurs, fiches, registre et domaines CSS utilisés sont identifiés par leurs empreintes dans l’inventaire ; leurs octets sont identiques avant/après le relevé. SHA-256 du fichier d’inventaire : `dc6781a8a63b0dc922f2ab2b3d5168a25b82a273861c5284d601a4946704261c`.

## Commandes et résultats

Environnement observé : macOS local, Node `v24.13.1`. Cette version est celle du relevé ; elle n’est pas la version de référence `24.22.0` du kit et ne qualifie pas son installation reproductible. Aucun runtime n’a été installé ou modifié pour cette inspection.

- `git rev-parse --show-toplevel`, `git status --short`, `git branch --show-current`, `git rev-parse HEAD` : racine attendue, `main` initialement, aucun changement suivi ; préexistants non suivis conservés.
- `node --version` : `v24.13.1`.
- Depuis `application/`, `node --input-type=module` avec imports de `loadCanonicalEditorModel` et `compositionArtifacts` : chargement/validation du modèle v4 et des compositions réussis, sortie `status: valid`, 25 primitives, 17 styles, 188 bindings, 148 tokens de composition et neuf échantillons. Code de sortie 0. Ces fonctions lisent/valident ; aucun générateur ou writer n’est exécuté.
- Relevé Node ponctuel via `node --input-type=module` : lecture de `sourcePaths`, des six fiches et des domaines CSS ; assemblage des identités, résolution des références avec détection des cycles et doublons, classification prudente des candidats, écriture du seul inventaire documentaire, relecture JSON et comparaison des empreintes des sources. Code de sortie 0 ; 490 identités uniques et sources inchangées. Les regroupements sont reproductibles depuis les sources et fonctions nommées ; aucun nouvel outil de génération runtime n’est ajouté.
- Consultation en lecture seule de [DTCG 2025.10](https://www.designtokens.org/tr/2025.10/format/), notamment types, extensions, dimensions et `$root`. Les conclusions techniques sont reliées à cette source dans la proposition de décision.

Aucune suite de tests, génération des dérivés, installation, compilation, opération Compose/base, connexion ou inférence IA, modification de recette ou publication. Les campagnes B–F et la compatibilité inter-outils DTCG restent non exécutées.

## Relecture et limites

Relecture du dossier sous l’angle technique : **séquentiel, même agent, non indépendant**, limitée au constat des dépendances (`validate-editor-contract.mjs`, `editor-artifacts.mjs`, `editor-snapshot.mjs`, `ui-composition.mjs`, `design-editor/{manifest,parsing,files,store}.mjs`, contrat client et navigation commune). Conclusion : **avec réserves**, dossier exploitable pour arbitrage ; aucune qualification du contrat futur.

La réserve bloquant la migration est la décision matérielle d’autorité et de représentation des expressions contextuelles. La décision 024 impose les tokens pour les valeurs visuelles ; la proposition doit expliciter le rôle des recettes, sans rendre libres les valeurs UI ni présenter un type propriétaire comme standard. Les noms de types proposés et les conversions numériques/couleur/police n’ont pas encore été retestés en rendu.

Revues design/sécurité/instructions/distribution de la réalisation : planifiées dans la fiche, non exécutées ici. Aucun parcours, instruction active, traitement d’entrée ou livrable d’exécution n’a changé dans cette tranche documentaire ; il n’y a donc pas de nouvelle qualification produit à revendiquer. Les contrôles documentaires finaux sont consignés dans la fiche après exécution.

## Reprise

Examiner la [proposition 027](../../decisions/027-dtcg-authority-and-css-recipes.md). Après réponse du porteur, consigner l’option adoptée, réinspecter l’état Git et poursuivre le mandat déjà autorisé. Ne pas rouvrir une demande d’exécution générale ; ne pas commencer B avant de franchir la porte A. Risques restants : couverture des expressions, conversions, ownership des compositions, sémantique du rétablissement et compatibilité des journaux. Aucun travail non suivi ambigu n’a été absorbé.
