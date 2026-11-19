# UI-ARCH-04 — Chargement de l'UI Lab dans macOS

**Cible :** application, version macOS de recette et projet fictif.  
**Statut :** En revue — fonctionnement de la nouvelle recette qualifié ; réserve causale et acceptation humaine différée.  
**Base :** `6e065a8`, branche `codex/ui-arch-04-macos-loading`, 75 entrées non suivies préexistantes exclues. Racine Git vérifiée.

## Mandat

Diagnostiquer puis corriger le chargement de l'UI Lab dans la version de test macOS, sans remplacer les fenêtres existantes ni lancer Electron. Conserver les tokens et le rendu officiel du projet fictif. Les bundles ouverts, leurs sources/outillage et états privés ne sont pas remplacés. Une nouvelle copie de diagnostic puis une version normale distincte peuvent être construites dans `.local/ui-arch-04/` ; seules leurs ressources identifiées sont pilotées.

## Inspection et hypothèse avant code

La précédente campagne a constaté un UI Lab bloqué avant hydratation dans la fenêtre native, alors que Chromium/WebKit automatisés fonctionnent. Dans le navigateur réel, la présentation explicite du panneau a libéré le chargement. Les scripts de démarrage étaient alors absents du document actif et les scripts de transfert React utilisaient requestAnimationFrame. **Hypothèse à vérifier** : une réponse SSR en streaming suspend le bootstrap jusqu'à une première animation, différée en arrière-plan par WKWebView. Ce constat ne prouve pas encore la cause et ne justifie ni de remplacer WebKit ni de changer les protections.

Procédures applicatives implement-feature, test-user-flow et revues du catalogue réutilisées à cette base. Même agent, rôles séquentiels non indépendants ; aucune délégation. GPT-6.1 Sol · Très élevée maintenu selon le choix déclaré par le porteur ; réglage client non prétendu vérifié.

## Tranche et contrôles prévus

1. Capturer sans secrets les diagnostics d'un WKWebView distinct : état du document, présence des scripts de bootstrap, compteur de première animation, erreurs et état éditable. Comparer la réponse serveur avec le même User-Agent. Aucun pilotage ou fermeture des fenêtres existantes.
2. Définir le correctif minimal après preuve ; priorité à l'initialisation du document de l'atelier, sans changement des tokens, du design, de l'authentification ou du protocole d'enregistrement. Si un code réutilisable du starter est concerné, borner et documenter le changement et sa complétude de livraison avant intégration.
3. Qualifier le démarrage réel en arrière-plan puis visible, l'UI Lab et sa scène officielle, une interaction de réglage et les refus pertinents ; types/lint/build/tests ciblés. Vérifier le rendu app/Storybook et la conservation des valeurs. Ne pas transformer un test WebKit automatisé en preuve WKWebView.
4. Construire/ouvrir une nouvelle version normale identifiée, conserver les fenêtres précédentes et fournir son accès. Revues design, technique/QA et sécurité avec réserves explicites ; bilan et suivi racine, acceptation humaine différée, aucune publication.

Les captures et diagnostics publics excluent capacités de session, métadonnées privées et journaux du porteur. Les traces privées éventuelles restent dans la recette ignorée. Toute instrumentation de diagnostic est distincte du bundle normal destiné à la vérification humaine.

## Décision technique bornée après diagnostic

Le blocage de la fenêtre antérieure est reproduit ; son rechargement ordinaire ne libère pas le document. Une copie indépendante fonctionne. Les sondes WKWebView sans fenêtre, sans animation et sans interrogation intermédiaire fonctionnent aussi sur le serveur antérieur : l'hypothèse d'une dépendance systématique au premier requestAnimationFrame n'est pas confirmée et ne motive aucun changement SSR. L'origine exacte de l'état périmé de l'ancienne instance reste indéterminée ; le cache est une hypothèse, pas un fait démontré.

Cible applicative : `macos/Loomata.swift` uniquement pour le comportement réutilisable. L'UI Lab utilise un magasin web éphémère propre à sa vue et les demandes initiale/accueil ignorent le cache local ; sa commande Actualiser utilise reloadFromOrigin. Les autres vues conservent leur fonctionnement. Il ne s'agit ni d'effacer les caches existants ni de migrer les données : tokens, journaux, reçus, compte Codex et fichiers sont gérés par le serveur local, inchangé. La recherche Figma mémorisée dans sessionStorage reste limitée à la session de fenêtre comme auparavant. Correction réversible, sans nouvelle dépendance ni changement d'autorité.

Une nouvelle copie normale compilée avec cette source doit démontrer le chargement et une interaction. L'amélioration d'isolation ne sera pas présentée comme une reproduction causale du cache défectueux. Les preuves détaillent cette limite.

## Réalisation et point de reprise

[Bilan, capture, contrôles et revues](../reviews/ui-arch-04-macos-loading/README.md). Code natif limité à l'isolation web de la vue UI Lab et à ses rechargements. Le test normal compile, ouvre l'atelier, permet une modification en brouillon puis retrouve les réglages initiaux après annulation/rechargement. Neuf tests de supervision réussis ; 312 fichiers web fictifs identiques. Les attentes transitoires de la nouvelle fenêtre observées immédiatement après chargement ne sont pas des échecs persistants. Le cache périmé reste hypothétique ; aucune correction SSR fondée sur les seuls transferts React.

Version privée : `.local/ui-arch-04/macos-loading/run-Ag62zM/normal/Loomata UI Lab Loading Test.app`, SDK 26.5, identifiant `org.loomata.local.ui-lab-loading.run-Ag62zM`. Projet et outillage distincts dans le même dossier ; adresses UI Lab 59550 et Storybook 59551. Descriptor ignoré `macos-loading/final.json`. Copie normale ouverte, diagnostic fermé, ancienne fenêtre rendue à son Aperçu. Anciennes sources, services, huit reçus et 75 préexistants conservés. Échecs EPERM/signature intermédiaires et correction du ciblage CUA documentés dans le bilan.

Prochaine action : recette humaine sur cette nouvelle fenêtre ; relance complète supplémentaire et cause exacte de l'ancien blocage restent non vérifiées. Aucun changement au socle web, Electron exclu, aucune publication. **Doc updated.**

### Correctif de préparation Codex — 14 novembre 2026

Le signalement du CSS manquant dans la copie tool a sa [cause confirmée et sa réparation](ui-arch-04-chat-preparation.md). Les dérivés propres à l'outillage avaient été omis lors de la préparation de recette ; ils sont maintenant générés, le helper privé est corrigé et Codex charge dans la fenêtre existante. Le projet fictif et le binaire ne changent pas. Ce correctif distinct ne clôt pas la réserve causale du document UI Lab historique.
