# INIT-01 — Revue du parcours d’initialisation

**25 octobre 2026.** Candidat des instructions : `ccc7e6df7f3766663b1337cd716e462cd8b6314c`, après base `c736cafcd4fea3081ed20285a9a12c513a3906cd`. [Mandat, critères préalables et scénarios](../work-items/init-01-project-initialization.md). Les changements ultérieurs de suivi et du présent rapport ne modifient pas la procédure examinée.

## Périmètre et mode

Instruction Reviewer puis Distribution Reviewer du lab, **séquentiel, même agent, non indépendant**, avec `lab-evaluate-instructions` et `lab-qualify-distribution` dans leurs périmètres documentaires. Le candidat est évalué comme un produit, sans lui attribuer de permissions de fabrication. Pas de délégation, installation système, appel de modèle ou lancement de services dans cette campagne.

Le changement porte sur AGENTS, Builder, le mode dédié de plan-feature et sa référence, les renvois d’usage et la compatibilité. Aucun code web, dépendance, schéma ou script d’exécution modifié : pas de nouvelle revue visuelle ni de campagne runtime nécessaire pour qualifier ce diff documentaire. Les contrôles du démarrage décrits dans la procédure sont les obligations d’un futur usage, pas des contrôles prétendus exécutés dans cette revue.

## Instruction Reviewer — relecture des scénarios

Les constats ci-dessous sont des **relectures statiques**, pas des réponses obtenues d’un assistant lancé sur ces demandes.

| Scénario préalablement défini | Constat dans le candidat |
|---|---|
| Initialiser Atlas dans une copie neuve | AGENTS route la demande vers Builder/plan-feature et la référence dédiée ; le mandat couvre diagnostic, documents et socle. |
| Machine sans Node/npm/Docker | Le diagnostic commence avec le terminal sans Node. La table distingue runtime absent, moteur absent/arrêté et refus d’accès ; intervention système accompagnée, pas de faux succès. |
| Prérequis disponibles | README et verrouillage restent les sources des commandes ; contrôles du socle et URL sont à constater réellement. |
| Nom sans besoin métier | Le socle peut démarrer ; le besoin reste à cadrer, question produit concise et aucune fonctionnalité inventée. |
| Initialisation interrompue, même projet | Les documents portent les étapes et blocages ; reprise ciblée sans refaire systématiquement les étapes réussies. |
| Projet déjà initialisé, même nom | Restituer l’état, sans réinitialisation. Nouvelle conversation ou correction sans activation du mode. |
| Projet existant avec un autre nom | Arbitrage sur la destination avant les écritures concernées ; brief, configuration et données préservés. |
| Demande ordinaire ou préparation seule | Référence exclue de la planification courante ; préparation limitée à inspection/documentation, sans installation ni services. |
| Nom trompeur ou contenant une syntaxe shell | Nom traité comme donnée, sans interpolation shell ni autorisation induite. |
| Extraction et absence de découverte native | Renvois internes et lecture explicite possibles ; découverte native et comportement non déduits de la présence des fichiers. |

**Conclusion : satisfaisant sur le périmètre d’instructions relu.** Aucune anomalie bloquante documentaire relevée. Le choix d’un mode de plan-feature conserve le catalogue de vingt skills ; la référence détaillée n’alourdit pas les autres tâches. Aucune installation globale, migration de base existante ou publication n’est autorisée par la seule présence du fichier. L’efficacité du routage en langage naturel et la reprise réelle restent à observer en session native.

## Contrôles exécutés

Environnement de cette campagne : macOS arm64 ; Node `v24.13.1` du PATH pour les validateurs et les quatre tests de structure du kit. Cette version diffère de celle prescrite pour l’exécution web ; aucune qualification runtime de cette version n’en est déduite.

| Commande / contrôle | Résultat |
|---|---|
| `node scripts/validate-lab-kit.mjs`, depuis le dépôt de conception | Réussi : quatre skills et trois rôles lab, exposition séparée. |
| `node --test tests/lab-kit.test.mjs`, même racine | Réussi : six tests. |
| `npm run validate:agent-kit`, depuis le kit | Réussi : vingt skills, quatre rôles, catalogue/frontmatters et expositions conformes. |
| `npm test -- tests/unit/agent-kit.test.ts`, depuis le kit | Réussi : quatre tests existants, dont déplacement et refus de liens/références externes. |
| quick_validate du skill-creator sur `skills/plan-feature` | Première tentative avec Python hôte échouée : PyYAML absent. Reprise réussie avec le venv local préexistant de validation ; aucun paquet installé. |
| Liens Markdown des neuf fichiers du candidat | Réussi : 75 liens/ancres locaux résolus, tous internes au kit. |
| Liens Markdown après ajout des preuves et du suivi | Réussi : 181 liens/ancres dans les treize documents modifiés ; les liens du kit restent internes à sa racine. |
| Diff et sélection des fichiers | `git diff --check` et contrôle du diff indexé réussis ; aucune configuration privée ni copie préexistante incluse. Recherche ciblée de secrets/chemins de poste dans les ajouts sans correspondance ; ce contrôle n’est pas un audit exhaustif. |

## Distribution Reviewer — extraction documentaire

Extraction des seules sources avec `git archive --format=tar ccc7e6df7f3766663b1337cd716e462cd8b6314c:application`, dans une zone locale ignorée du dépôt de conception. Dossier ensuite renommé et déplacé dans un chemin avec espaces. Contrôle par Python standard des fichiers, cibles réelles, catalogue et liens Markdown. Aucun node_modules, build, fichier privé ou Git copié.

- Vingt skills et quatre rôles présents, quarante liens symboliques internes résolus.
- Même référence de démarrage accessible via `.agents/skills/plan-feature/references/initialize-project.md` et `.claude/skills/plan-feature/references/initialize-project.md` ; octets identiques à la source canonique.
- Les 75 liens/ancres du candidat se résolvent dans le dossier extrait, sans fichier parent requis.
- ROADMAP et état courant livrés restent les modèles non initialisés ; aucun projet Atlas créé dans les sources du kit.

**Conclusion : satisfaisant sur l’autonomie documentaire et l’exposition par fichiers de ce candidat.** Aucune nouvelle installation npm ni campagne de builds, données ou restauration dans l’extraction : ces surfaces sont inchangées. Les preuves historiques gardent leurs versions ; elles ne deviennent pas une nouvelle qualification globale.

## Limites et suite

Découverte native/rechargement, déclenchement par la phrase simple, déroulement d’un assistant sur machine vierge et interventions système : **non vérifiés**. Aucun essai humain tiers ni nouvelle compatibilité OS/assistant. L’initialisation ne fournit pas d’installateur système ; les permissions restent effectives. Essayer le parcours dans une copie dédiée lors d’un mandat d’initialisation réel ou d’une qualification native autorisée, sans réutiliser les données existantes. Acceptation humaine différée et publication désactivée. **Doc updated.**
