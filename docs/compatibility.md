# Compatibilité du kit livré

**24 octobre 2026 — PORT-03 techniquement qualifié, acceptation humaine différée.** Cette matrice livre les versions, résultats et limites utiles à la reprise du kit. Distinguer structure, découverte native, comportement des modèles et acceptation humaine. Voir [adaptations](agents/adapters.md), [héritage sélectionné](agents/practice-history.md) et [état courant](project-state.md).

## Héritage web identifié

Source `94895a6dbf306a722c692a6c0a8b534403332606`, campagne PORT-02 : macOS arm64, Node 24.22.0/npm 11.8.0, Docker 29.8.2/Compose 5.5.1, Linux arm64 en conteneurs, Chromium 156.0.8078.4. Installation, 78 tests, builds, développement hydraté, extraction web et conservation exacte des données après renommage/déplacement réussis sur cette source. Cette preuve historique ne qualifie pas à elle seule le kit complet intégré dans PORT-03.

Les autres OS, architectures, navigateurs et le déplacement vers un autre moteur Docker restent non vérifiés. Les volumes sont externes aux sources ; suivre la sauvegarde/restauration pour changer de moteur/hôte.

## Assistants — preuves historiques et limites conservées

| Cible | Preuve historique J4, 21 octobre 2026 | État natif et limite |
|---|---|---|
| Codex | CLI 0.163.0-alpha.10.2 ; quatre rôles et cinq scénarios exercés explicitement dans un même fil, sans indépendance | Découverte native non vérifiée : essai app-server arrêté avant initialize par refus d’écriture SQLite utilisateur. Aucun contournement ; ne pas répéter en retirant une protection. |
| Claude Code | Conventions et liens contrôlés ; CLI absente lors de la campagne | Découverte, activation et scénario de modèle non exécutés. |
| Gemini CLI | Conventions et liens contrôlés ; CLI absente lors de la campagne | Découverte, consentement et scénario non exécutés. |
| Mistral Vibe Code CLI | Version 2.9.3 obtenue avec VIBE_HOME local ignoré, sans modèle | Aucun projet trusted, découverte, inférence ou scénario de modèle vérifié. |

La présence d’AGENTS/CLAUDE/GEMINI et de quarante liens locaux ne transforme pas ces limites en compatibilité complète. Aucun modèle universel ni compte obligatoire pour exécuter le site. REC-10 et la reprise réelle par un tiers restent ouverts jusqu’à leurs preuves ; une migration de fichiers ne les clôt pas.

## Initialisation d’un nouveau projet — INIT-02

Le skill dédié [initialize-project](../skills/initialize-project/SKILL.md) est sélectionné par « Initialise un nouveau projet [nom] » selon [AGENTS.md](../AGENTS.md#démarrer-un-nouveau-projet). La [fiche INIT-02](work-items/init-02-dedicated-initialization-skill.md) définit les critères et le périmètre de vérification ; elle remplace le rattachement à plan-feature retenu dans INIT-01. Les contrôles de fichiers et la relecture de scénarios ne prouvent pas le déclenchement natif, le comportement d’un modèle ni une installation réelle sur machine vierge. Lors de la campagne INIT-02, ces essais restaient **non vérifiés** sur tous les assistants et systèmes ; le complément INIT-05 ci-dessous apporte désormais un scénario nominal Codex/Ubuntu validé humainement. Les installations système ne sont pas rendues automatiques par cette procédure. Les [preuves INIT-02](reviews/init-02-dedicated-initialization-skill.md) identifient le candidat, les contrôles de structure/tests et l’extraction réellement exécutés, sans extension de compatibilité native.

## Campagne PORT-03

Source `3e6ba795f862c84597c6f78a351987aa024b23a1` : [bilan et preuves](reviews/port-03/README.md), quinze commandes réussies, 82 tests, builds, développement hydraté et extraction du kit complet sans Git. Quarante liens internes, même configuration/volume/contenu après renommage/déplacement avec espaces ; installation indépendante isolée. Plateformes et versions identiques à celles décrites pour le web ci-dessus ; aucune extension à Windows/x64 ni aux autres navigateurs.

Les rapports des quatre rôles sont séquentiels, même agent, non indépendants. Les essais natifs des assistants ne sont pas nouvellement vérifiés : les succès de fichiers, tests et Docker ne prouvent pas la découverte ou le comportement d’un modèle. Recette humaine, reprise par un tiers et REC-10 restent ouverts. Aucune publication ni préparation à la production déduite de cette matrice.

## Installation accompagnée — INIT-05

Parcours documenté selon la [décision 005](decisions/005-assisted-environment-installation.md) : assistant opérationnel, kit récupéré, terminal/navigateur/réseau, avec Node/npm et Docker éventuellement absents. Mac à puce M signifie Apple Silicon ; la génération de puce du laboratoire ne définit pas une exigence M3/M5 pour le kit.

| Cible | Accompagnement livré | Qualification sur machine vierge |
|---|---|---|
| macOS 26 / Mac à puce M | Diagnostic, runtime local ou machine, Docker Desktop, interruptions et reprise | **Non vérifiée** ; ne se déduit pas de l'hôte déjà équipé. |
| Ubuntu 24.04 LTS arm64 | Diagnostic, runtime local, Docker Engine/plugin Compose et permissions | **Périmètre technique exécuté qualifié** : installation sur Ubuntu Server 24.04.5 arm64 depuis Node/npm/Docker absents ; 96 tests, builds, Compose et reprises avec données réussis. **Scénario nominal Codex validé humainement le 28 octobre** : initialisation, puis accueil Hello world et accès Application/Storybook contrôlés dans l’interface. Reprise UI après interruption non vérifiée. |
| Windows 11 x64 et autres OS/architectures | Extension ultérieure | **Non vérifiée**, hors campagne actuelle. |

Les tests du lanceur et l'extraction démontrent leurs seuls comportements observés, sans constituer une installation de machine vierge. L'essai natif de Codex et l'observation d'un designer restent distincts. La VM est réservée aux tests du fabricant et ne fait pas partie des prérequis utilisateur. Les cibles d'assistants et les limites REC-10/REC-12 précédentes sont conservées.

Campagne technique Ubuntu du 26 octobre 2026 : Node 24.22.0/npm 11.8.0, Docker 29.9.2/Compose 5.6.1, Chromium 156.0.8078.4 installés dans l'invité sans runtime, cache ou moteur Docker emprunté au Mac. 52 unitaires, 14 tests PostgreSQL, 12 parcours UI Lab, dix parcours projets et huit Storybook réussis, ainsi que types/lint/formatage, builds, autorités et frontières serveur/client. Un défaut du lanceur sous /bin/sh Linux (PATH relatif après changement de dossier) a été corrigé et retesté, enfants compris. Les archives corrompues et runtimes incomplets sont refusés ; configuration préservée, installation npm interrompue/reprise et nouvelle session après renommage vérifiées.

Après accord explicite du porteur, le seul compte fictif de la VM rejoint le groupe docker ; accès confirmé dans une nouvelle session puis après redémarrage complet. Démarrage Compose, écriture/lecture par le navigateur invité, arrêt sans suppression de volume et déplacement réel du dossier réussissent avec la même configuration, le même volume et le même témoin fictif. Un couple Node/npm compatible et des ressources Docker témoins sont préservés. Refus de permissions initial, moteur arrêté, mauvais contexte et téléchargement d'image interrompu restent des résultats distincts.

Pendant la campagne technique du 26 octobre, l'image serveur est pilotée à distance : aucun assistant natif ou designer observé dans l'invité à ce stade, aucune compatibilité de bureau Linux déduite. La campagne ne reproduit pas une saisie humaine de mot de passe ou une annulation d'installateur graphique. La qualification technique du périmètre exécuté ne remplace ni la qualification complète du parcours accompagné, ni les essais macOS ou humains. Les outils et le moteur Docker du Mac de fabrication restent inchangés ; une connexion SSH de laboratoire est ajoutée ensuite avec autorisation explicite.

Complément humain du **28 octobre 2026** : depuis un nouveau clone Ubuntu arm64 sans Node/npm/Docker, le kit v6 (SHA-256 `a04bc18979b8d81c062533c2fa8a3ebae5aee0aaccca2c7e085b73536cd7617c`) est ouvert avec Codex distant **0.165.0-alpha.1.2**, piloté depuis l’application de bureau sur Mac. Les 21 skills sont découverts nativement avant l’essai. Le porteur valide l’initialisation accompagnée, puis une demande explicite d’accueil « Hello world » avec liens Application et Storybook ; il confirme le résultat vérifié dans l’interface. Projet dérivé sans Git, verrou conservé, quatre fichiers de réalisation repérés par empreintes ; aucune modification de ces fichiers n’est importée dans le starter.

Cette observation humaine valide ce scénario nominal ; elle ne constitue pas une campagne complète des rôles/skills ou des quatre assistants. Les deux liens ont été demandés explicitement ; une présentation spontanée dans un autre contexte n’est pas démontrée. Le navigateur/format humain et le modèle/effort effectifs ne sont pas relevés. macOS vierge et reprise de conversation après interruption restent non vérifiés ; la reprise par un tiers garde son statut distinct. Les réserves de dépendances consignées pendant le test sont conservées, sans nouvel audit ou correction déduit de l’acceptation UI.

**Clôture de campagne — 28 octobre 2026.** Le porteur demande l’arrêt des tests et juge suffisantes les preuves acquises : campagne technique Ubuntu et essai nominal Codex validé dans l’interface. Le chantier d’installation accompagnée est accepté avec les limites annoncées ; aucune qualification macOS vierge ou des scénarios non exécutés n’est revendiquée. Ces limites ne déclenchent pas une nouvelle campagne dans ce chantier clos. La VM de test est arrêtée, avec sources, données et preuves conservées. Cette acceptation ne vaut ni qualification universelle, ni reprise par un tiers, ni autorisation de publication.

## Atelier autonome et passation — DS-EDIT-64 E

[Qualification du 4 novembre 2026](reviews/ds-edit-64-e.md) sur le candidat exécutable `055fbbc` : macOS arm64 / Chromium 156.0.8078.4, Node 24.22.0/npm 11.8.0, Docker 29.8.2/Compose 5.5.1 ; builds et contrôles structurels Linux arm64 en conteneurs. Parcours UI Lab et Storybook, interruption/reprise et extraction/renommage/déplacement avec données fictives conservées qualifiés. Aucun nouveau navigateur Linux, OS, assistant natif ou essai humain déduit de ces contrôles ; table Docs mobile avec défilement horizontal et autres limites consignées. [Passation et recette](handoff.md) préparées, acceptation humaine différée.

## Retrait de l’éditeur Storybook — DS-EDIT-64 F

[Qualification du 4 novembre 2026](reviews/ds-edit-64-f.md) : UI Lab autonome et Storybook documentaire sans addon/writer, sur macOS arm64, Node 24.22.0/npm 11.8.0 et Chromium 156.0.8078.4. Parcours, sauvegarde/reprise réelle, lecteurs et builds requalifiés ; manifeste v16, valeurs et dérivés conservés. Aucun nouvel essai Linux, SQL, transfert interhôtes ou assistant natif ; preuves E et leurs limites conservées. Recette humaine/reprise par un tiers restent distinctes, sans acceptation ou publication déduite de la fin de migration technique.
