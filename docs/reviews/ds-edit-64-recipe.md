# DS-EDIT-64 — Actualisation de la recette

**État courant : retour demandé à l’ancienne recette Storybook 34e0aec, avec Apparence, au port 54138. UI Lab 54139 arrêté.** Les sections d’actualisation et de rétablissement ci-dessous restent historiques ; voir le retour de recette en fin de document. Le code canonique DS-EDIT-64 reste conservé.

4 novembre 2026. Mandat explicite : conserver les réglages, actualiser la recette avec la migration DS-EDIT-64 et ouvrir UI Lab/Storybook pour vérification humaine. Version servie **3083d5b**, manifeste v16 ; suivi sur `codex/ds-edit-64-recipe`. **Recette actualisée et ouverte ; acceptation humaine non acquise.** [Fiche](../work-items/ds-edit-64-ui-lab-migration.md), [qualification de la migration](ds-edit-64-f.md), [preuve sélectionnée](ds-edit-64-recipe/qualification.json).

## Conservation

L’ancienne recette `34e0aec`, sous `.local/ds-edit-52/preview` dans le dépôt concepteur, utilisait le writer Storybook au port 54138. Son onglet Safari a été inspecté puis rechargé sans alerte d’abandon : valeur chargée et précise #0050c9, sauvegarde désactivée. Le garde de fermeture de cette version couvre réglages, saisies, erreurs, conflits et requête en attente. Aucun marqueur actif ; un reçu committed/saved.

Processus identifié par port, PID, dossier courant et propriétaire, puis arrêté proprement. La commande officielle de récupération de **l’ancien outillage** a terminé sans modifier les dix sources ni les octets du reçu et de la transaction conservée. Cette racine complète, ses reçus et ses états privés restent en place ; aucun verrou retiré, journal converti ou fichier historique remplacé.

Nouvelle racine `.local/ds-edit-64-recipe/instance`, extraite des sources suivies de `3083d5b`, sans Git, ancien journal/propriétaire/compte ou configuration privée. Neuf sources éditables importées à octets constants. Pour ui-composition, les 49 primitives et 98 tokens existants restent identiques ; seuls les 19 primitives et 26 tokens d’habillage atelier livrés par DS-EDIT-64 sont ajoutés. Aucun changement de valeur, d’identité, d’attribution ou de provenance des réglages existants.

Le modèle généré puis celui réellement servi sont **strictement identiques à l’ancien modèle enregistré** : 188 bindings, 18 styles et 28 primitives ; Button conserve #0050c9. Aucune valeur saisie ni sauvegarde de réglage déclenchée par l’agent. Aucune configuration PostgreSQL dans cette recette : aucune base, volume ou donnée métier visé. Le kit canonique du dépôt garde ses propres autorités ; les valeurs de recette restent dans la copie locale ignorée.

## Préparation et vérification exécutées

Procédures applicatives backup-and-rollback/test-user-flow/update-project-docs, versions à 3083d5b ; contrôle séquentiel, même agent, non indépendant. Node 24.22.0/npm 11.8.0 ; dépendances du même verrou copiées localement depuis l’installation F qualifiée, caches Vite/Storybook de la nouvelle copie seuls écartés. Aucun réglage ou installation globale.

- Génération dans la racine neuve inactive, puis `validate:design-system`, `docs:design-system:check`, `validate:agent-kit` et `typecheck` réussis ; 188 tokens/18 styles et 21 skills/quatre rôles valides. Journal ignoré `preparation.log`.
- Lanceurs livrés démarrés en processus locaux détachés : UI Lab au port **54139**, Storybook documentaire au port **54138**, tous deux sur 127.0.0.1. Préparation des dérivés séparée ; lancement direct du wrapper Storybook sans précommande npm de génération sous writer actif.
- Relecture protégée de snapshot UI Lab : HTTP 200, modèle identique à la source ancienne. Storybook sans bootstrap/capacité ; POST à son ancienne API save retourne 404. Aucune connexion ou inférence IA.
- Safari : UI Lab ouvert, champ Valeur précise **éditable**, #0050c9, aperçu prêt et « Aucune modification en brouillon ». Storybook Docs ouvert dans l’autre onglet : composant, propriétés, états et exemple React déplié ; ancien addon/connexion absents. UI Lab laissé au premier plan. Aucun abandon demandé ou effectué.

Les campagnes automatisées modifiant les valeurs n’ont pas été lancées sur la recette humaine. Pas de nouveaux builds de consultation ou tests de restauration SQL dans cette opération ; la version applicative a déjà ses preuves F. L’ouverture et les contrôles de l’agent ne valent pas acceptation visuelle ou recette humaine.

## Accès et reprise

- [UI Lab — atelier de recette](http://127.0.0.1:54139/ui-lab).
- [Storybook — Docs React de Button](http://127.0.0.1:54138/?path=/docs/components-button--docs).

Les chemins `.local` désignent ici le dépôt concepteur ; ils ne sont pas des dépendances du kit livré. Processus, racines et journaux sont consignés sous `.local/ds-edit-64-recipe/processes.json`, `ui-lab.log`, `storybook.log`, `old-recovery.log`, `before.json`, `model-preservation.json` et `runtime-check.json`. Les empreintes privées et valeurs complètes restent ignorées.

Pour un retour : résoudre auparavant tout nouveau brouillon/enregistrement, arrêter les deux processus identifiés de la nouvelle recette, puis relancer l’ancien outillage dans sa racine conservée. Les changements futurs enregistrés dans la nouvelle recette ne sont pas automatiquement répercutés dans l’ancienne ; ne pas écraser l’une avec l’autre. Ne jamais copier les reçus/connexions d’une racine vers une autre pour forcer une compatibilité.

**Doc updated.** Nouvelle recette prête pour la vérification du designer ; aucune acceptation A–F/J4/J5 ou reprise par un tiers déduite, aucune publication, CI distante ou opération sur une autre instance. Prochaine action : vérification humaine dans les deux onglets ouverts.

## Incident d’accès et rétablissement — 4 novembre 2026

Après l’ouverture initiale, le designer signale UI Lab inaccessible. Observation confirmée : aucun serveur sur 54139 ; Storybook répond toujours sur 54138. Le journal initial montre plusieurs notifications de changement de configuration Vite, puis un arrêt non intercepté de React Router avec `ENOTEMPTY` lors du retrait de `.react-router/types`. Ces notifications précèdent l’arrêt ; leur origine et la reproductibilité du conflit restent non établies. La vérification initiale d’ouverture était donc insuffisante pour garantir la disponibilité ultérieure.

Mandat de reprise limité à cette recette ; procédure applicative `diagnose-incident` à b0eedc6, Builder, séquentiel/même agent/non indépendant. Les deux anciens PID UI Lab sont absents, aucun marqueur actif ni transaction de sauvegarde ; seul le propriétaire laissé par le processus mort est présent. Relevé avant reprise : empreintes de 35 fichiers d’autorité et d’état hors propriétaire, conservées dans `incident-before.json` ignoré. Aucun cache purgé, verrou retiré, dérivé régénéré ou code remplacé.

Relance du lanceur livré dans **la même racine, avec le même code 3083d5b et le même port 54139** ; récupération du propriétaire périmé par le mécanisme livré. Nouveau lanceur 36225, writer 36226, métadonnées `processes.json` actualisées, journal `ui-lab-restart.log` séparé du journal d’échec conservé. UI Lab et Storybook répondent HTTP 200. Le navigateur intégré affiche l’atelier, son aperçu Button puis le panneau Réglages : champ #0050c9 éditable, aucune modification en brouillon. Aucune saisie/sauvegarde de valeur. Les 35 empreintes restent identiques après reprise. Preuve opérationnelle ignorée : `incident-recovery.json`.

**Rétablissement vérifié ; cause initiale des notifications de configuration non résolue.** Observation de stabilité bornée consignée dans la preuve, sans promesse de disponibilité permanente d’un serveur de développement. Aucun correctif runtime revendiqué, aucun nouveau build requis pour cette relance à version constante. Revues design/sécurité non applicables à une modification de code ou d’accès : aucun code, rendu, permission ou secret changé ; contrôle technique opérationnel séquentiel décrit ci-dessus. Doc updated. Reprise : vérification humaine à la même adresse ; si l’arrêt se reproduit, conserver les journaux et diagnostiquer les notifications Vite avant toute purge ou changement de version. Aucune publication ni acceptation humaine déduite.

## Retour demandé à l’ancienne recette — 4 novembre 2026

Mandat explicite du designer : retrouver Storybook d’avant ; modifications UI Lab postérieures sans importance, suppression autorisée. Base de suivi 3a628e7, branche `codex/ds-edit-64-recipe-rollback`. Procédures applicatives `backup-and-rollback`/`test-user-flow` à cette base ; Builder et contrôle opérationnel séquentiel, même agent, non indépendant. La remise en service de l’ancienne instance conservée suffit : aucune suppression ou restauration destructive de fichiers, aucun retour du code canonique ni annulation de DS-EDIT-64 nécessaire.

Les processus 16083 et 36225/36226 ont été vérifiés par dossier courant, parenté et ports, puis arrêtés par SIGTERM. Les ports 54138/54139 ont été vérifiés libres avant reprise. L’ancienne racine `.local/ds-edit-52/preview`, version **34e0aec**, sans marqueur actif ni propriétaire, est relancée directement par son propre `scripts/storybook-local.mjs`, Node 24.22.0, sans génération préalable ni import de journaux d’une autre version. Processus détaché **58969**, port loopback **54138**. Métadonnées actives dans `.local/ds-edit-64-recipe/processes.json` ; anciennes métadonnées archivées sous `processes-before-rollback.json`, journal séparé `storybook-rollback.log`.

Contrôles avant/après réussis : les **dix sources éditables et 198 fichiers privés historiques** sont identiques par SHA-256 au relevé précédant la migration ; seul le nouveau propriétaire est créé normalement par le writer livré. Un propriétaire unique, aucune transaction active. HTTP 200, UI Lab 54139 sans serveur. Navigateur intégré : Button Default chargé, panneau **Apparence** sélectionné, « Génération chargée », couleur chargée/précise #0050c9, champ éditable, badges AA/AAA et contraste 7.02:1, Enregistrer désactivé en absence de modification. Aucune saisie ni sauvegarde déclenchée. Les notifications de surveillance Vite présentes dans le journal sont conservées ; aucun plantage constaté pendant la vérification. Preuves opérationnelles ignorées `rollback-start.json` et `rollback-verification.json`.

Les changements de la nouvelle recette UI Lab **ne sont pas repris** ; sa copie reste inactive comme point de retour, sans synchronisation avec l’ancienne. Aucun compte ou accès supplémentaire, base métier, installation globale, publication ou CI distante. Aucun changement de code/rendu à requalifier par build ; tests d’écriture et nouvelle qualification complète de cette ancienne version non exécutés sur données humaines. Le retour de recette ne constitue pas une coexistence des deux éditeurs sur les mêmes données et ne change pas l’acceptation différée A–F/J4/J5. **Doc updated.** Reprise : vérification humaine dans [Storybook avec Apparence](http://127.0.0.1:54138/?path=/story/components-button--default).
