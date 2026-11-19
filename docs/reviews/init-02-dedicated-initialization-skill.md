# INIT-02 — Qualification du skill d’initialisation

**25 octobre 2026.** Candidat : `4966d761f562bef515ffd11715b9bc367c2c4168`, après base `1ee2f3727a48075a35df4cb3b94460f9e4e6a62f`. [Mandat et critères préalables](../work-items/init-02-dedicated-initialization-skill.md), [décision approuvée](../decisions/002-dedicated-project-initialization.md). Les ajouts ultérieurs de preuves et suivi ne modifient pas les instructions, le validateur ou les tests examinés.

## Mode et périmètre

Instruction Reviewer puis Distribution Reviewer du lab, **séquentiel, même agent, non indépendant**, avec lab-evaluate-instructions et lab-qualify-distribution. Relecture du candidat comme produit sous les règles de fabrication, sans délégation, appel fournisseur, installation système ou activation de service. Les contrôles du lab ont également vérifié la séparation des bibliothèques.

La demande initiale courte est conservée, mais sa responsabilité appartient désormais à initialize-project. Le skill contient le parcours et ses critères ; la référence d’environnement est chargée pour une initialisation technique à réaliser/reprendre. Plan-feature ne porte plus ce mode. Le catalogue contient 21 skills et quatre rôles ; le nombre attendu n’est pas un plafond. Les vingt responsabilités initiales sont conservées.

## Instruction Reviewer

Les cas d’intention et de permissions ci-dessous sont des **relectures statiques**, pas des réponses recueillies lors d’une nouvelle session native.

| Critère défini avant réalisation | Constat |
|---|---|
| Phrase d’initialisation, nom seul | AGENTS et Builder pointent vers initialize-project ; cadrage ouvert et demande produit concise, socle démarrable sans inventer le métier. |
| Machine sans outils ou accès refusé | Référence dédiée : diagnostic terminal sans Node, distinction absence/incompatibilité/refus ; accompagnement système sans installation globale implicite. |
| Reprise d’une initialisation interrompue | Suivi existant et étapes manquantes, sans réinitialisation de configuration/données ni réinstallation systématique. |
| Projet terminé, tâche courante ou préparation seule | Restituer l’état du projet terminé ; pas de réactivation à chaque conversation ; préparation sans installation/services. |
| Nom trompeur, autre projet ou ressource ambiguë | Nom traité comme donnée, aucune interpolation shell, arbitrage ciblé avant les écritures dépendantes ; propriétaire des ressources à identifier. |
| Responsabilités séparées | Initialize-project coordonne le démarrage ; analyze-brief et plan-feature sont utilisés selon le besoin, sans duplication de leurs procédures ni implémentation métier induite. |

**Conclusion : satisfaisant sur les instructions relues.** Aucun blocage documentaire relevé. La décision technique validée est intégrée aux autorités actuelles ; l’absence de plafond n’affaiblit pas le contrôle de complétude. Découverte native, sélection réelle par un modèle et efficacité du déroulement restent non vérifiées.

## Contrôles exécutés

Hôte macOS arm64, npm 11.8.0. Premier passage avec Node v24.13.1 du PATH ; vérification finale des 43 unitaires et du validateur extrait avec le runtime local préexistant **Node v24.22.0**, sans installation globale. Les versions d’exécution web prescrites restent celles du README.

| Commande / contrôle | Résultat |
|---|---|
| `npm run validate:agent-kit`, dans le kit | Réussi : 21 skills, quatre rôles, ressources et adaptations internes. |
| `npm test` | Premier passage sous sandbox : 42 réussis, un échec du setup lors de la réservation d’un port local. Diagnostic minimal `node:net` : EPERM sur 127.0.0.1. Retest autorisé puis passage final avec Node v24.22.0 : **43/43 réussis**, dont neuf tests du kit. |
| Cas d’extension et refus de livraison | Test positif avec un 22e skill complet, sans modifier le validateur. Refus éprouvés : entrée déclarée absente, ressource d’environnement absente, source non cataloguée, exposition surnuméraire, références/liens externes et adaptation divergente. |
| `npm run typecheck`, `npm run lint`, `npm run format:check` | Réussis. Premier appel direct du formatteur depuis la racine du dépôt sans node_modules échoué ; relance depuis la racine applicative réussie, sans installation ni modification de configuration. |
| quick_validate de skill-creator | initialize-project et plan-feature conformes, via le venv local préexistant ; aucun paquet Python installé. |
| `node scripts/validate-lab-kit.mjs` et `node --test tests/lab-kit.test.mjs` | Réussis : quatre skills/trois rôles lab, six tests, exposition séparée. |
| Liens des documents actuels modifiés avant ajout du bilan | 167 liens/ancres conformes ; références applicatives internes au kit. |
| Vérification documentaire finale | 286 liens/ancres dans 22 documents modifiés conformes ; quarante fichiers non suivis initiaux conservés par empreintes. Code web, données, dépendances et modèles du projet inchangés. |
| Diff et secrets | Diff examiné, `git diff --check` conforme, sélection exacte. Le premier balayage de fichiers complets a signalé les chemins de racine déjà présents dans l’AGENTS du lab ; contrôle des seuls ajouts sans correspondance de secret/chemin de poste. Aucun fichier privé ou copie préexistante intégré. |

## Distribution Reviewer

Extraction avec `git archive --format=tar 4966d761f562bef515ffd11715b9bc367c2c4168:application`, puis renommage et déplacement dans un chemin avec espaces. Sources seules à l’extraction : aucun Git, environnement privé, node_modules ou build copié.

- Catalogue cohérent : 21 skills et quatre rôles ; les vingt noms initiaux sont conservés et initialize-project est le seul ajout.
- Quarante-deux liens d’exposition résolus vers des sources internes ; nouveau SKILL.md et référence d’environnement accessibles par `.agents/skills/initialize-project/` et `.claude/skills/initialize-project/`.
- Ancienne référence sous plan-feature retirée ; 167 liens/ancres Markdown du kit extrait conformes.
- Modèles ROADMAP et état courant encore non initialisés ; aucune création de projet Atlas dans les sources livrées.
- Installation locale des dépendances avec `npm ci --offline --ignore-scripts --no-audit --no-fund --cache <cache local préexistant>` : réussie, 456 paquets, aucune dépendance changée. Scripts d’installation non exécutés : ce contrôle vise le validateur, pas le runtime web.
- Depuis un répertoire extérieur au kit, exécution de son `scripts/validate-agent-kit.mjs` avec Node v24.22.0 : réussie, dépendances résolues dans son installation propre. Aucun fichier source du parent requis.

**Conclusion : satisfaisant sur la distribution de cette bibliothèque et de son contrôle.** Les avertissements hérités de dépréciation esbuild-kit restent visibles ; aucun audit de dépendances supplémentaire. Code web, schéma, migrations et dépendances inchangés : pas de nouvelle campagne de builds, navigateur, données ou restauration pour ce diff. Le contrôle de permissions et de contenu est ciblé, pas un audit de sécurité exhaustif.

## Suite et limites

L’essai de la phrase dans une nouvelle session native sur une copie dédiée, puis l’accompagnement d’une machine vierge, restent **non vérifiés**. Aucune compatibilité OS/assistant ou acceptation humaine déduite des fichiers et tests. Le choix de méthode a été approuvé ; la tranche reste En revue avec qualification technique acquise et acceptation humaine différée. Publication désactivée. **Doc updated.**
