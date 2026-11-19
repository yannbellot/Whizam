# LOCAL-APP-01 — Lanceur local macOS

**6 novembre 2026 — En revue : qualification technique du lanceur acquise sur le périmètre exécuté, acceptation humaine différée.** Base `bc885ba`, branche `codex/local-app-01-dock-launch`. [Fiche](../work-items/local-app-01-dock-launch.md), [décision 029](../decisions/029-local-dock-launcher.md), [guide](../operations/local-app.md), [preuve automatisée sélectionnée](local-app-01/qualification.json).

Intégration sélective sur une branche issue de `main` : préparation `a5db9c4`, réalisation `b8db86b`. Les conflits de suivi ont été résolus en conservant les entrées préexistantes de main ; aucun fichier/commit DS-ARCH-02 n’a été intégré. Son point de reprise `c166528` reste sur `codex/ds-arch-02-decision-system` ; le statut de proposition présent sur main précède ce checkpoint de branche. Le code applicatif hors LOCAL-APP-01 est identique entre les bases, donc pas de nouvelle campagne runtime pour cette résolution documentaire.

## Réalisation

Prototype AppleScript compilé dans le dépôt : service HTTP synthétique lancé depuis Finder sans terminal. Safari propose Ajouter au Dock pour l’origine loopback. Compilation initiale refusée dans le sandbox faute d’accès aux dictionnaires macOS, puis réussie avec accès autorisé. Le prototype jetable n’est pas livré dans les scripts actifs ; sa source/artefacts restent dans le suivi privé.

Le porteur a autorisé explicitement l’exception aux écritures limitées au dépôt : app web Safari dans Applications de son compte, ajout au Dock, navigation masquée, installation des raccourcis finaux. Aucun service de session, changement de sécurité ou accès supplémentaire.

Superviseur Node, commandes CLI sérialisées, socket Unix privé relatif pour respecter la limite de chemin macOS. Racine/inode et empreinte identifient l’instance ; aucun signal à un ancien PID depuis un fichier seul. Ports précontrôlés et stricts ; writer récupéré avant le lecteur Storybook, sans hook npm de génération. Gardes, modèle, sources DTCG/YAML et manifeste inchangés. Bundles avec identité par instance/action et signature locale ad hoc, sans descriptions de permissions inutilisées. Node sélectionné à la préparation ; aucun téléchargement.

## Contrôles exécutés

macOS 26.6 arm64, Safari 27.0, Node 24.22.0 ; dépendances préexistantes, aucune connexion fournisseur.

| Contrôle | Résultat |
| --- | --- |
| `node --test tests/local-app.test.mjs` | 9 réussis : ports/tiers, échappement shell, concurrence, arrêt/reprise stable, échec partiel, panne d’enfant, mauvaise racine/état interrompu, version différente, permissions/liens privés. |
| `node scripts/test-local-app.mjs` | 6 scénarios réussis sur copie synthétique et Chromium : démarrage/réutilisation, sauvegarde/propagation, lecteur sans writer, arrêt/reprise, SIGKILL après remplacement durable puis récupération, déplacement/réparation conservant les valeurs. |
| Types, lint, frontières serveur | Réussis sur copie inactive ; syntaxe Node et formatage ciblé des nouveaux modules contrôlés. ESLint impose principalement ses règles aux TS/TSX ; les tests Node constituent la preuve des modules `.mjs`. |
| Builds app et Storybook | Réussis sur copie inactive ; journaux dans le suivi privé. |
| Compilation/signature des bundles | Réussies ; seuls les bundles du chantier installés dans Applications du compte. |
| Fenêtre Safari dédiée | Origine locale, navigation masquée, arbre/aperçu/réglages/champ activé observés via accessibilité ; aucun brouillon. |
| Dock | Ajout Finder exécuté ; entrée persistante du lanceur vérifiée par lecture ciblée. L’outil CUA ne peut pas cibler le Dock. |
| Clic Dock humain | Après arrêt des services, le porteur a cliqué : chargement des références signalé. L’atelier complet a ensuite été observé dans la fenêtre dédiée sans commande de rechargement dans cette fenêtre entre ce retour et le constat final. Pas d’acceptation finale déduite. |

Échecs conservés : premier lint appelé depuis une mauvaise racine, rejoué correctement ; patches documentaires rejetés pour contexte absent, réappliqués avec contexte correct. Les commandes sandbox ont cessé de rendre leur sortie pendant le diagnostic ; lectures nécessaires avec accès autorisé. Aucun refus d’approbation contourné ; pas d’attribution de cette panne d’outil au produit.

## Revues

**Séquentielles, même agent, non indépendantes**, procédures et rôles du catalogue app lus à la base du chantier. Aucune bibliothèque d’agents ou procédure de fabrication/distribution lab modifiée.

- Design : intention d’ouverture locale satisfaite ; fenêtre dédiée et réglages accessibles. Réserves : deux icônes, premier chargement prolongé et icônes génériques. Aucune direction visuelle acceptée au nom du designer.
- Technique / QA : propriété des processus, erreurs partielles, publication/récupération et déplacement éprouvés. Pas de purge ; perte du superviseur lui-même à diagnostiquer. Aucun serveur de développement exposé sur Internet.
- Sécurité ciblée : arguments shell échappés et définis à la préparation, aucune entrée navigateur vers le shell ; état/socket privés, liens refusés, aucun port de contrôle public. App Safari/URL vérifiées ; Storybook sans capacité. Tests négatifs exécutés, aucun scan global ni nouvelle dépendance.

Conclusion satisfaisante avec réserves sur le périmètre exécuté. Signature locale distincte d’une qualification de distribution publique.

## Instance et réserves

Recette neuve `.local/local-app-01/recipe` du lab, runtime propre, sans compte, journal ou brouillon d’une ancienne recette. Sources du kit inspecté, pas reprise des réglages d’une autre instance. UI Lab `http://127.0.0.1:60731/ui-lab`, Storybook `http://127.0.0.1:60732/`. Anciennes recettes préservées ; les écritures de test ont utilisé une autre copie synthétique. Aucun réglage utilisateur enregistré par l’agent dans la recette.

Chargement initial prolongé des références : serveur et snapshot répondant 200, puis Safari ordinaire et app dédiée affichant les contrôles complets. Durée/cause non établies ; disponibilité HTTP distincte de l’hydratation. Une page d’erreur préexistante peut demander un rechargement explicite. Si cette lenteur récidive, diagnostic ciblé, sans supprimer le garde de brouillon.

Non exécutés : redémarrage complet du Mac, autres versions macOS/Safari, parcours humain prolongé/fermeture avec vrai brouillon, reprise tierce, installation sur un autre poste et notarisation publique. Le redémarrage des services et le déplacement ne sont pas assimilés au redémarrage du Mac. Recette complète du poste humaine et différée ; J4/J5 non clos.

Fichiers : supervision, préparation/campagne, tests, commandes package, guide/décision/fiche/bilan, liens README/opérations/passation ; statut consolidé dans le lab. Doc updated. Risques résiduels : premier chargement, fermeture de brouillon, état de superviseur ambigu et chemins privés d’instance. Aucun push, CI distante, compte GitHub ou hébergement. Reprise : recette humaine avec réserves ; aucune tranche supplémentaire implicite.
