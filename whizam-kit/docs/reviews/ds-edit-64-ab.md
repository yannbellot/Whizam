# DS-EDIT-64 A/B — Contrat cible et extraction du socle

4 novembre 2026 — application, base `f781288`, branche `codex/ds-edit-64-ab`. Mandat limité à A/B. Voir la [fiche](../work-items/ds-edit-64-ui-lab-migration.md) et la [décision 025](../decisions/025-independent-design-editor.md). Version finale : commit local portant ce bilan ; le diff est rattaché à la base ci-dessus.

## Résultat

A définit le parcours, les routes futures, les états dégradés, l’isolation de rendu, la source des exemples et les frontières d’activation. B extrait les contrôleurs session/rebase/assistance, la projection avec canal fourni par hôte, le service HTTP/store/observer/assistance et le bootstrap local. Les exemples React préparés et leurs paramètres sont partagés avec les stories, sans importer leurs fichiers. Snapshot JSON généré déplacé sous public ; lecteurs, récupération, manifeste et tests sont raccordés. Port de transport client injectable ; import de session sans allocation SSR. Storybook conserve son adaptateur provisoire et reste l’unique hôte d’écriture. Aucun parcours UI Lab autonome ajouté.

Les dix autorités éditables sont identiques à HEAD de départ ; le CSS généré sur copie est identique à celui du clone. Les fichiers privés du clone et les services de recette ne sont pas modifiés. Manifeste fermé v13, modèle/protocole d’écriture inchangés. Les reçus restent liés à leur ancienne racine/version : aucune migration ou purge.

## Contrôles et preuves

Exécutés avec le runtime Node 24.22.0 déjà disponible localement, dans `.local/ds-edit-64/check` puis `.local/ds-edit-64/browser-check`, sans données privées ni journaux du clone. Dépendances et Chromium existants réutilisés ; aucune installation globale. Journaux ignorés sous `.local/ds-edit-64/`.

| Contrôle | Résultat et preuve locale |
| --- | --- |
| Types et lint | Conformes ; `quality-final.log`. |
| Unitaires, dont transport fourni par hôte et import SSR sans session | 148 réussis ; `unit-final.log`. |
| Design system et cas négatifs | 82 tests réussis et validation conforme ; `quality-final.log`. |
| Documentation dérivée | `docs:design-system:check` conforme ; `quality-final.log`. |
| Store, idempotence, concurrence, fichiers malveillants, pannes/reprise/annulation | 77 réussis sans processus Storybook ; `server.log`. |
| HTTP réel : origine, hôte, capacité, budgets et refus | 8 réussis après relance loopback autorisée ; `http-agent.log`. |
| Assistance simulée | 13 réussis, aucun compte/inférence réels ; `http-agent.log`. |
| Frontières serveur/client | Build isolé accepté et import client `.server` rejeté ; `boundaries.log`. |
| Builds application et Storybook | Réussis ; `quality-final.log`. Avertissement de taille des chunks Storybook, sans erreur. |
| Navigation, sélection Field, états Button, conflits et brouillon ; desktop/mobile | 12 réussis ; `browser-final.log`. |
| Conservation | Dix autorités inchangées et CSS généré identique ; `conservation.json`. |

Persistance : **8 parcours desktop réussis**, puis enregistrement réel dans la fixture et relecture du runtime compilé après rechargement aux formats 1280×800 et 390×844 ; `persistence-final.log` et `browser-check/test-results/editor-persistence/application-reload.json`. La campagne mobile persistante complète n’est pas revendiquée ; les 12 parcours d’interaction couvrent les deux formats. La récupération de fichiers est couverte par les 77 tests serveur ; le script complet de récupération navigateur n’a pas été exécuté de nouveau.

## Diagnostics conservés

- Premier test de types : imports de la projection et type de rendu des fixtures corrigés ; types et builds rejoués conformes.
- Premier build Storybook : l’indexeur CSF refuse une définition importée comme meta. Les adaptateurs gardent les métadonnées littérales nécessaires à l’index ; exemples/args/renders restent communs. Build rejoué conforme.
- Première copie unitaire : liens natifs de skills omis ; exposition interne rétablie dans la copie et 148 tests réussis. Refus loopback de configuration/HTTP dans le sandbox corrigés par relance autorisée ; huit refus HTTP initiaux ne sont pas présentés comme réussis.
- Première campagne navigateur : cache Chromium absent dans la copie, puis dépassement du délai global ; cache local raccordé et 12 parcours pertinents rejoués avec succès. La campagne historique intégrale contient aussi des scénarios supprimés avant ce mandat ; elle n’est pas revendiquée comme conforme. Aucun test applicatif supprimé.
- Première campagne persistante : sélecteur d’intention obsolète et ancien texte de conflit ; assertions alignées sur « Nouveau style sémantique » et le conflit explicite, valeur externe visible et sauvegarde désactivée. Relance ciblée ci-dessous. Les échecs et le timeout de cette première campagne restent dans `persistence.log`.

## Revues

Revues séquentielles, même agent, non indépendantes, selon les procédures applicatives review-design, technical-review et security-review.

- **Design : satisfaisant pour A/B, réserve humaine.** Pas de changement de valeur/CSS ; fixtures et contrôles actuels conservés, interactions desktop/mobile vérifiées. Le futur atelier, sa disposition et son thème ne sont pas livrés ni acceptés. Pas de référence Figma ou de recette humaine inventée.
- **Technique :** modules communs sans import Storybook, dépendances relatives de tous les modules serveur et du schéma relues, manifestes/consommateurs/lecteurs raccordés. `storyId` reste provisoirement une identité opaque ; navigation et panneaux demeurent dans l’adaptateur. L’import SSR ne crée pas de session, mais l’interface future devra initialiser les contrôleurs après montage. Persistance et relecture compilée qualifiées sur les scénarios ci-dessus.
- **Sécurité : satisfaisant pour l’extraction, dans la couverture annoncée.** Les algorithmes de validation, chemins et durabilité du serveur sont conservés ; les tests négatifs et de reprise couvrent leurs nouveaux emplacements. Bootstrap et writer restent exclusivement dans l’outillage Storybook ; aucune route d’écriture applicative ni nouvelle exposition réseau. Le build produit ne charge pas ce service. L’aperçu de même origine n’est pas une frontière contre du code hostile ; seules des scènes préparées seront admises. En C/D, fournir explicitement les capacités/transports par contexte, ne pas propager automatiquement le fallback parent du raccordement historique.

Aucune modification de skill/instruction livrée : pas de nouvelle Instruction Review. L’extraction/distribution complète reste en E ; aucune compatibilité native ou plateforme supplémentaire revendiquée. Modèles app non initialisés, J4/J5 et acceptations humaines inchangés. **Doc updated.** Pas de publication ni d’actualisation de recette. Prochaine tranche après qualification A/B : C, à autoriser séparément.

**A et B : En revue — qualification technique acquise, acceptation humaine différée.** Aucun blocage technique restant sur ces deux tranches. C–F non engagées.
