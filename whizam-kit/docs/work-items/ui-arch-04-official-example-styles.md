# UI-ARCH-04 — Styles officiels dans la recette fictive

> **Habillage retiré le 15 novembre 2026 sur demande du porteur.** [Retour au design antérieur et correctifs de chargement conservés](ui-arch-04-style-rollback.md). Les preuves ci-dessous restent historiques.

**Cible :** application, copie fictive de recette seulement.  
**Statut :** En revue, qualification technique acquise, acceptation humaine différée, 14 novembre 2026.  
**Base :** `ec4ab75`, branche locale `codex/ui-arch-04-official-example-styles`.

## Mandat et décisions avant code

Appliquer les styles des exemples officiels React Aria sans personnalisation au projet fictif et à son Storybook. Cette demande autorise les CSS officiels littéraux dans cette démonstration isolée ; elle ne remplace pas les autorités DTCG du socle livré. React Aria ne fournit pas de design intégré : la référence choisie est le starter officiel `starters/docs`, Vanilla CSS, thème Indigo par défaut, révision Adobe `360e35170568dfc99a2baaa78e6b7bdd36458d91`.

La copie visée est `.local/ui-arch-04/user-test-1qr84x/project`, reliée au bundle Loomata UI ARCH 04 Test existant. Page : <http://127.0.0.1:51147/> ; Storybook : <http://127.0.0.1:51148/?path=/story/ui-arch-04-fixture--preview>. Aucun autre projet, contenant natif ou code canonique de `application/` n'est modifié.

Les composants et CSS officiels Button, TextField, Form et leurs dépendances sont copiés sans adaptation visuelle. La page fictive conserve ses libellés et sa validation sans stockage métier ; l'ancien habillage Panel/Notice est retiré de cette démonstration. Le Storybook de recette présente uniquement la page et les composants officiels utilisés, avec leurs états ; les anciennes sources de stories restent conservées. Le manager garde le thème natif Storybook.

L'isolation de chargement des styles évite l'héritage des tokens/reset historiques sur la page et les nouvelles stories. Les autres routes conservent leurs styles existants. Les nouveaux exemples officiels ne sont pas des consommateurs des tokens éditables de l'UI Lab ; ne pas présenter cette recette visuelle comme une nouvelle preuve de propagation DTCG.

## Fichiers et préservation

Dans la copie ignorée : `src/react-aria-examples/`, `src/App.tsx`, `src/App.stories.tsx`, `app/root.tsx`, `.storybook/main.ts`, `.storybook/preview.tsx` et preuve de provenance sous `docs/`. Sauvegarde locale des fichiers remplacés avant modification. Suivi versionné : présente fiche, preuve sélectionnée, roadmap et état racine. Les modèles de suivi applicatifs restent intacts.

Racine Git vérifiée avant écriture : `/Users/yannbellot/Documents/GitHub/loomata`. Aucun changement suivi initial ; 75 entrées non suivies préexistantes exclues. Aucun push, installation globale, compte fournisseur, génération de tokens canoniques ou chantier Electron.

## Critères et contrôles

- CSS et composants vendus identiques octet pour octet à la révision officielle ; licence et provenance conservées.
- Page et story utilisent les mêmes composants ; aucun style visuel local ajouté.
- Types et builds app/Storybook ; validation vide, saisie et soumission sans stockage, focus clavier et états disabled/error vérifiés sur la copie.
- Rendu clair/sombre et formats web contrôlés ; comparaison des styles calculés page/story et captures relues.
- Vérification visible dans Loomata et Storybook, fenêtres existantes préservées ; revue finale du diff et des seules modifications documentaires suivies.

Procédures applicatives `implement-feature`, `test-user-flow`, `review-design`, `technical-review` et `security-review` consultées à la base `ec4ab75`, catalogue explicite ; rôle Builder puis revues séquentielles, même agent, non indépendantes. La demande explicite prime sur leur règle de consommation DTCG pour ces seuls exemples tiers. GPT-6.1 Sol · Élevée recommandé pour l'isolation des deux rendus ; réglage client non modifié. Retour arrière : restaurer uniquement les fichiers sauvegardés de cette copie, sans toucher au bundle ni aux autres projets.

## Résultat et reprise

La copie fictive affiche maintenant le formulaire avec les composants et styles officiels Indigo. Le Storybook présente 12 stories : page fictive, cinq états Button et six états TextField/TextArea. Les anciens composants/stories restent sur disque, sans être exposés dans ce Storybook de comparaison. Source canonique du socle et contenant natif inchangés.

| Contrôle exécuté dans la copie | Résultat |
| --- | --- |
| Provenance | 13 fichiers officiels conservés sans transformation ; 11 fichiers source comparés aux empreintes de blobs Git Adobe ; thème et licence conservés avec SHA-256 |
| Types et lint | `react-router typegen`, `tsc -b` et ESLint des fichiers locaux modifiés conformes ; fichiers officiels préservés sans reformatage |
| Builds | `react-router build` et `node scripts/storybook-local.mjs build --disable-telemetry` conformes sur la version finale ; avertissement de taille de chunks Storybook conservé |
| Parcours et fidélité | 12 couples page/story, soit 24 vues : Chromium complet, Firefox et WebKit ; 1280×800 et 390×844, clair/sombre ; dix propriétés calculées comparées pour le bouton et le champ, identiques dans chaque couple |
| Formulaire | Champ vide refusé, erreur annoncée, focus sur le champ, saisie fictive, Tab/Enter, succès sans stockage et rechargement sans succès persistant : conformes dans les 24 vues |
| États complémentaires | Disabled/Pending Button, Invalid/Disabled TextField et TextArea vérifiés sur les trois moteurs, soit 15 vérifications ; anciens tokens absents de la page et de la story |
| Autres routes | Liens CSS historiques conservés sur `/ui-lab` sur les trois moteurs ; aucune nouvelle recette de modification DTCG revendiquée |
| Affichage utilisateur | CUA : Aperçu dans la fenêtre Loomata existante et iframe Storybook actualisée observés avec le nouveau rendu ; onglet conservé, aucune fenêtre fermée |

[Résultats calculés](../reviews/ui-arch-04-official-example-styles/qualification.json), [provenance complète](../reviews/ui-arch-04-official-example-styles/provenance.json), captures [page sombre](../reviews/ui-arch-04-official-example-styles/app-dark.png), [page claire](../reviews/ui-arch-04-official-example-styles/app-light.png), [story sombre](../reviews/ui-arch-04-official-example-styles/storybook-dark.png) et [story claire](../reviews/ui-arch-04-official-example-styles/storybook-light.png). Captures relues ; valeurs CSS officielles préservées.

Runner local ignoré : `.local/ui-arch-04/check-official-styles.mjs`, lancé avec le Node local et `PLAYWRIGHT_BROWSERS_PATH` du dépôt ; journal final `.local/ui-arch-04/official-styles-browser-check.log`. Les premiers échecs sont conservés ici : index servi encore à 84 stories avant relance des seuls services de recette ; Chromium headless shell en échec ICU/GPU, remplacé dans le runner par le canal Chromium complet déjà utilisé par le dépôt ; sélecteur trop large visant un bouton interne Storybook ; assertion immédiate avant mise à jour de validation ; attente networkidle inadaptée aux connexions persistantes de l'UI Lab ; ajout accidentel de `expect` à la liste des moteurs du runner. Ces défauts de campagne ont été corrigés ; la commande finale termine avec code 0, trois moteurs, 12 couples et 24 vues PASS. Aucun contournement de protection ni changement des composants officiels pour faire passer les tests.

Revues séquentielles, même agent, non indépendantes : design satisfaisante sur le formulaire et ses états, références et valeurs officielles vérifiées ; technique satisfaisante sur l'isolation CSS, les types, builds, parcours et sélection de stories ; sécurité satisfaisante sur ce diff local sans persistance, accès distant au runtime, secret ou changement de permissions. L'acceptation visuelle humaine reste à recueillir ; VoiceOver physique, autres systèmes et affichages à haute densité ne sont pas nouvellement qualifiés. Le manager utilise les thèmes natifs Storybook, sans thème Loomata ajouté.

Les deux services de la seule copie identifiée ont été arrêtés puis relancés via leur superviseur pour recharger la sélection de stories ; sources et reçus conservés. Services laissés actifs sur les mêmes ports, bundle existant non reconstruit. Les 75 entrées Git préexistantes sont préservées et exclues de la sélection. Modèles de suivi app intacts. Diff local relu, aucun fichier canonique d'implémentation modifié ; documentation/provenance/preuves seules intégrées localement. Aucun push, Electron, installation ou publication.

Prochaine action : vérifier visuellement [le projet fictif](http://127.0.0.1:51147/) et [son Storybook](http://127.0.0.1:51148/?path=/story/ui-arch-04-fixture--preview). Cette demande n'adopte pas un nouveau design pour les futurs projets et n'étend pas UI-ARCH-04 à une migration des tokens. Retour arrière par la sauvegarde identifiée plus haut. **Doc updated.**
