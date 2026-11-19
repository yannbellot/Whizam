# UI-MAC-01 — Simplification du header macOS

11 novembre 2026 — cible application, mandat de réalisation explicite. Base `9f8d10f`, branche `codex/macos-header-cleanup`. Aucun changement suivi préexistant ; copies non suivies historiques exclues.

## Préparation

Placer UI Lab / Storybook / Aperçu / Assistance dans la barre supérieure native, masquer le titre visuel Loomata et retirer la rangée de boutons de projet. Conserver le contexte actif et les commandes dans les menus natifs, dont démarrage/arrêt. Supprimer les deux textes introductifs de l’atelier et le libellé visible de recherche, en gardant son nom accessible. Supprimer le message de succès « Assistance ouverte pour… » ; conserver erreurs/progression. Le lien Laboratoire de référence est conservé : la demande est une question sur sa fonction.

Fichiers prévus : `macos/Loomata.swift`, `src/ui-lab/editor/Workspace.tsx`, `SceneNavigation.tsx`, tests directement affectés, documentation et suivi. Aucun compte, connexion IA, installation globale ou publication. Construire un bundle local dans le dépôt et vérifier avec AppKit/WebKit sur une fixture isolée. Ne pas fermer une fenêtre humaine ni remplacer ses brouillons.

Procédures sélectionnées : implement-feature, test-user-flow, review-design et technical-review du catalogue applicatif, version du HEAD initial ; revues séquentielles, même agent, non indépendantes. GPT-6.1 Sol · Moyenne recommandé pour ces changements localisés ; réglage utilisateur non modifié.

Critères : onglets dans le header natif, titre masqué, pas de rangée de boutons, menus de projet utilisables, recherche nommée sans texte visible, atelier sans introduction, erreurs visibles. Contrôles : génération, format/lint ciblés, compilation native et parcours natif existant adapté.

## Résultat

**En revue — qualification technique acquise, acceptation humaine différée. Doc updated.**

Implémentation : NSToolbar unifiée avec contrôle segmenté, titre natif masqué (identité de fenêtre conservée), rangée de boutons retirée et commandes démarrer/arrêter ajoutées au menu Projet. Le statut d’assistance réussi devient vide et se masque ; tout nouveau statut/erreur redevient visible. Introduction UI Lab retirée, main nommé et recherche nommée par aria-label. Les tests d’accueil ciblent désormais le repère main. Aucun token visuel ni dérivé modifié.

## Preuves et revues

- Génération et `npm run docs:design-system:check` : PASS.
- ESLint ciblé et Prettier TSX/tests : PASS ; `git diff --check` : PASS.
- TypeScript : `npm exec -- tsc -p .local/tsconfig.column-scroll.json` PASS, configuration diagnostique héritée de UI-LAB-01 excluant les copies non suivies ` 2`. Le contrôle global brut reste affecté par les quatre imports préexistants documentés dans UI-LAB-01 ; copies non modifiées.
- `npm run test:e2e -- --grep 'opens the laboratory|independently scrolling columns'` : **4 PASS**, Chromium desktop/mobile, build client/serveur réussi. Rapport local `test-results/report.json`. Les essais précédents échouaient sur l’hypothèse d’un aperçu toujours débordant : avec le header retiré, son iframe de 75vh tient sur desktop. Le test vérifie désormais le défilement jusqu’au maximum disponible, et un débordement effectif sur mobile. Ni resize ni délai supplémentaire ne corrigeaient cette hypothèse ; ces échecs restent explicités ici.
- `npm run test:loomata` : **13 scénarios PASS**, AppKit et vrais WKWebView sur copie synthétique isolée. Rapport `test-results/loomata/run-cvh0wa/native.json`, compilation et captures dans ce même dossier. Navigation réellement rattachée à NSToolbar, titre masqué, rangée absente, commande d’arrêt présente, textes retirés et recherche accessible vérifiés. Changement de vue, brouillon, rechargement/fermeture/arrêt annulés, sauvegarde, propagation Storybook et redémarrage testés. Aucun compte fournisseur ni inférence.
- Première tentative native interrompue par le nettoyage du dossier partagé test-results au démarrage de Playwright : échec de lien Swift (destination supprimée). Campagnes exécutées ensuite séquentiellement : PASS. Repli prévu du builder du SDK incompatible 27 vers SDK 26.5 installé ; aucune installation système.
- Bundle normal construit et signature ad hoc vérifiée strictement par buildLoomata : `.runtime.local/ui-mac-01/Loomata.app` ; manifeste `candidate.json` adjacent. Version native SHA256 `fa9f803da213b8e85f156091876c2fdce33c3eab4b5be4ddf2450d5af5347259`. Ce bundle source utilise le runtime et les sources du dépôt ; il ne remplace pas la distribution autonome UI-FINAL-01 E. L’ancien bundle et son descripteur latest ne sont pas remplacés.

Revues **séquentielles, même agent, non indépendantes** : design satisfaisant sur la structure native et les vérifications de visibilité/nommage ; inspection visuelle supplémentaire via CUA expirée, donc confort visuel humain non vérifié. Technique satisfaisante sur compilation, 13 parcours et diff ; aucune nouvelle dépendance. Sécurité ciblée satisfaisante : pas de changement des frontières d’accès, menus et gardes existants conservés ; refus de navigation et writer lecteur vérifiés par le pilote. Pas d’audit exhaustif ni d’acceptation humaine déduits.

Limites : absence de clic physique/Finder/Dock dans cette campagne, inspection visuelle CUA en échec, autres formats/macOS non nouvellement qualifiés, statut d’assistance vidé vérifié par code sans ouverture fournisseur. Aucun secret, installation globale, copie de compte, push ou publication. Fichiers préexistants préservés. Reprise : conserver les brouillons puis ouvrir le nouveau bundle local à la place de la fenêtre ancienne ; recueillir le retour visuel du designer.
