# UI-ARCH-04 — Préparation des styles de la vue Codex

**Cible :** application, recette macOS isolée `run-Ag62zM`.  
**Statut :** En revue — qualification technique acquise, acceptation humaine différée.  
**Base :** `13d844c`, branche `codex/ui-arch-04-chat-preparation` ; 75 entrées non suivies préexistantes exclues, racine Git vérifiée.

## Mandat et cause

Corriger l'erreur `Could not resolve ../styles/tokens.generated.css` depuis `tool/src/assistant/main.tsx`. La copie `tool` issue du profil fermé contient les sources, pas les dérivés. La précédente préparation a généré les dérivés du projet fictif via prepareProject, mais pas ceux de l'outillage servant la vue Codex. Le build de cette vue importe légitimement son propre CSS généré. Le packaging normal possède déjà cette génération ; il s'agit d'un défaut de préparation de recette, pas d'une preuve de défaut du moteur de build.

## Tranche et critères

Réutiliser diagnose-incident, implement-feature et test-user-flow du catalogue applicatif à `13d844c`. Revues séquentielles, même agent, non indépendantes. Configuration précédemment choisie conservée ; aucune nouvelle hausse ni sélection prétendue vérifiée.

1. Reproduire le build dans la copie d'outillage et relever uniquement l'erreur utile. Vérifier son absence de writer/récupération avant génération ; ne pas toucher au projet fictif actif.
2. Générer par scripts/generate-tokens.mjs dans tool ; ne jamais écrire le CSS à la main ni copier les valeurs du projet fictif. Corriger le helper privé de préparation pour les prochaines copies, sans le relancer sur la recette active. Aucun changement fonctionnel du starter nécessaire si la préparation suffit.
3. Recompiler la vue Codex, l'ouvrir dans le bundle déjà présent, contrôler son chargement puis le retour à UI Lab. Ne pas envoyer de message, connecter de compte, fermer/remplacer une fenêtre ou lancer Electron. Comparer les sources du projet avant/après et vérifier ses services inchangés.
4. Conserver preuve et recette de reprise, compléter le suivi racine et intégrer localement. Les tests métier du chat ne sont pas requis si ses sources restent inchangées ; ne pas les annoncer rejoués.

Le helper privé et les dérivés restent ignorés. Le suivi documente ce défaut de fixture et les contrôles effectués, sans capacité de session, compte ni URL secrète.

## Résultat et reprise

[Cause confirmée, correction et preuve native](../reviews/ui-arch-04-chat-preparation/README.md). Génération de tool réalisée, helper privé corrigé pour ses prochaines copies, build du chat réussi et écran Codex chargé dans le même bundle. Retour UI Lab puis seconde ouverture Codex vérifiés. Aucun compte connecté, message envoyé, source fonctionnelle canonique modifiée ou bundle reconstruit. Les 312 fichiers contrôlés du projet, son journal et ses services sont conservés.

La demande suivante de styles officiels pour Codex, élargie explicitement à toute l’interface Loomata, est réalisée dans la [recette de normalisation distincte](ui-arch-04-official-chat-styles.md). Le présent document conserve la preuve historique de réparation du chargement ; le nouvel habillage et ses fichiers relèvent de cette suite.

Version de sources `13d844c` ; empreinte du dérivé réparé et résultats dans qualification.json. Prochaine action : reprendre la recette humaine dans la fenêtre existante, laissée sur Codex. Pas de publication, Electron non lancé ; **Doc updated.**
