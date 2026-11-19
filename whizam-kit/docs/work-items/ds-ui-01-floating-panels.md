# DS-UI-01 — Panneaux flottants du design system

15 novembre 2026 — Application, réalisation autorisée. Base `dee4ed9`, branche `codex/design-system-floating-panels`. Les fichiers non suivis préexistants (copies « 2 », frontend et .storybook/editor) sont hors périmètre et préservés.

## Mandat et critères

Reprendre exactement le glyphe de dépliage de la barre latérale Storybook installée (8 px, chevron tourné vers le bas à l’ouverture), sans cadre de bouton visible. Superposer les panneaux gauche/droite à un aperçu couvrant toute la surface disponible. Padding et radius des panneaux : 16 px. Supprimer uniquement le libellé visible de recherche ; conserver champ, filtrage et nom accessible, conformément à la précision du porteur.

Hypothèse réversible : retrait extérieur des panneaux de 16 px ; conserver leur largeur de colonne et les couleurs existantes. Préserver clavier, défilement, verrouillage et brouillon. Desktop : 1280×800 et 1440×900. Pas de publication, de modification des données ou des copies de recette actives.

## Procédures et contrôles prévus

Procédures applicatives sélectionnées : implement-feature, review-design et technical-review, versions suivies à `dee4ed9`. Choix technique localisé : grille superposée, tokens existants réattribués aux valeurs demandées ; taille du chevron dans l’autorité outil. GPT-6.1 Sol · Moyenne recommandé, sans modification du réglage client.

Génération des tokens, types, lint ciblé, validation des autorités et parcours desktop isolé avec captures. Revues séquentielles, même agent, non indépendantes. Sécurité : revue de portée, sans nouvelle entrée externe ni changement d’accès. Résultats à compléter après exécution.

## Résultat et preuves — 15 novembre 2026

**En revue — qualification technique acquise dans le périmètre demandé, acceptation humaine différée.** Base `dee4ed9`, candidat local sur `codex/design-system-floating-panels`. Doc updated. Pas de publication, aucune copie de recette active ou donnée utilisateur modifiée.

Les deux panneaux ont 16 px de padding, 16 px d’arrondi et 16 px de retrait extérieur. La grille les superpose à l’iframe, qui couvre toute la largeur et la hauteur disponibles. Le contenu des exemples reste dans une zone dégagée entre les panneaux grâce à une recette CSS ; la surface d’aperçu n’est pas réduite. Une couche locale explicite des panneaux assure leur superposition à l’iframe, y compris dans WebKit natif. La disposition historique des petites fenêtres reste préservée, sans nouvelle qualification mobile.

Le chevron fermé utilise exactement le path de CollapseIcon installé dans Storybook, avec un viewBox/taille de 8 px ; son équivalent ouvert est tourné de 90 degrés. Boutons sans bordure, marge ou padding visuels ; focus clavier conservé. Le champ et son nom accessible « Rechercher un exemple » restent présents, seul le Label visible est retiré.

Fichiers concernés : SceneNavigation, NavigationIcon, Workspace et workspace.module.css ; autorités outil/projet et recette de composition ; liste fermée des resets/taille de chevron du générateur outil ; guide editor-preview ; parcours ui-arch-03 et comptes de composition des tests (143 → 144). Les dérivés ignorés sont régénérés, jamais édités.

### Contrôles exécutés

- `npm run tokens:generate`, `npm run validate:design-system`, `npm run docs:design-system:check`, `npm run validate:loomata-ui` : conformes.
- `npm run typecheck` : échec dans quatre stories locales préexistantes « 2 » référençant un module absent. Diagnostic confirmé ; aucune de ces copies modifiée. Contrôles app avec une configuration locale ignorée excluant seulement ces copies, puis `tsc -p config/typescript/tsconfig.node.json` : conformes.
- ESLint ciblé sur les TSX modifiés, le générateur et le parcours : conforme. `node --test tests/loomata-ui.test.mjs` : 1/1.
- `npm run test:design-system` : 113/114 avant synchronisation du second compte de composition attendu. Retest `node --test tests/decision-policy.test.mjs tests/ui-composition.test.mjs` : 9/9 ; le seul échec est résolu.
- `node scripts/test-design-editor-persistence.mjs ui-arch-03.spec.ts --project=desktop` : le parcours Playwright ciblé passe (1/1, deux formats 1280×800 clair et 1440×900 sombre). Padding, radius, superposition, dimensions de l’iframe, absence de texte visible, nom accessible, chevrons sans cadre, filtrage, Échap, clavier, validation, annulation, sauvegarde/relecture/rétablissement : démontrés. Premier passage : sélecteur du test supposant Foundations ouvert corrigé ; retest conforme.
- Ce même wrapper compile ensuite la copie avec succès (client/SSR), puis échoue dans son contrôle historique supplémentaire de `/ui-lab/reference` : route absente du routeur courant, bouton « Button du projet » introuvable. Diagnostic établi, sans lien avec les panneaux ; ce contrôle historique n’est pas revendiqué comme réussi et n’a pas été réécrit hors mandat. La persistance de l’atelier est démontrée par le parcours ciblé passé. Ressources isolées arrêtées par le wrapper.
- `git diff --check` : conforme. Sélection exacte, revue des nouveaux contenus et absence de secrets/configuration locale dans le diff.

### Revues séquentielles, même agent, non indépendantes

Design Reviewer : comparaison au mandat et au CollapseIcon du Storybook installé, puis inspection des captures [1280 clair](../reviews/ds-ui-01-floating-panels/desktop-1280.png) et [1440 sombre](../reviews/ds-ui-01-floating-panels/desktop-1440.png). Panneaux distincts au-dessus de la surface, contenu dégagé, défilement des réglages et filtrage conservés. Conclusion : satisfaisant dans le périmètre, acceptation visuelle humaine réservée.

Technical Reviewer / QA : flux sélection/brouillon inchangés, aucun nouveau stockage/accès ; tokens distincts pour espacement et arrondi, recette contrôlée pour le retrait central, utilitaires de reset bornés, données de test isolées. Conclusion : satisfaisant pour ces changements, avec les limites d’outillage préexistant détaillées ci-dessus. Revue de portée sécurité : aucun nouvel accès, secret, permission ou traitement d’entrée externe ; pas de scan sécurité requis pour ce changement de présentation.

Prochaine action : vérification visuelle humaine de ce rendu. Aucun nouveau chantier ouvert ; une reconstruction de la distribution macOS et la mise à jour d’une copie de recette ouverte ne sont pas réalisées par ce mandat de sources.


## Extension autorisée — reconstruction macOS, 15 novembre 2026

Demande explicite du porteur : reconstruire et ouvrir l’app pour vérifier ces modifications. Sources `124b8ba`, branche de suivi `codex/design-system-macos-preview`. Nouvelle copie autonome dans `.local/ds-ui-01/user-test-4gsOHF`, préparée depuis le manifeste fermé par les helpers existants sourceFiles/createProject/prepareProject/buildLoomata. Projet fictif neuf, sans reprise de données, compte ou brouillon des anciennes recettes. Nom : **Loomata Design System Test** ; SDK déjà installé 26.5. Aucune installation globale, publication ou activation Electron.

Critères : génération et types/build app/Storybook de la copie, concordance des huit sources natives/UI/autorités concernées, signature stricte du nouveau bundle, ouverture native et observation de l’atelier chargé avec les changements. État humain En revue conservé. Les anciennes fenêtres/services ne sont ni fermés ni remplacés ; les nouveaux services sont laissés actifs pour la vérification demandée. Résultats après ouverture ci-dessous.


### Précision du porteur pendant la reconstruction

Largeur demandée : **280 px par panneau** (bordure comprise), padding/radius conservés à 16 px. La colonne de support est donc de 312 px, dont deux marges de 16 px, et le retrait du contenu central suit la même recette. Ce choix évite de confondre largeur de colonne et largeur réelle du panneau.

La première observation WKWebView montrait le panneau gauche dans l’arbre accessible, mais pas dans l’image : sa superposition à l’iframe était insuffisante malgré l’ordre DOM. Correction bornée : position relative et z-index 1 via un Component Token de composition dédié, sans modifier l’iframe ou le protocole. Les comptes de composition passent à 145 ; tests ciblés et assertions de largeur/couche actualisés. Un candidat intermédiaire de reconstruction a été refusé par le contrôle du sélecteur du consommateur ; sélecteur canonique corrigé, sans désactivation du contrôle. Types/builds de la nouvelle copie et observation finale à consigner après exécution.


### Résultat final macOS et panneaux de 280 px

**En revue — qualification technique acquise, acceptation humaine différée.** Copie finale `.local/ds-ui-01/user-test-J5OZXc`, bundle **Loomata Design System Test.app**, identifiant `org.loomata.local.ds-ui-01.user-test-J5OZXc`. SDK 26.5, compilation Swift et signature stricte conformes. Les métadonnées Finder incompatibles ajoutées à l’ouverture ont été retirées du seul bundle neuf par le helper existant ; binaire et quarantaine conservés. Le premier affichage était transitoirement vide et les réglages brièvement indisponibles avant la fin du démarrage ; l’observation finale WKWebView montre les deux panneaux correctement superposés, la scène Button, les réglages actifs et aucun brouillon.

- Génération/validation des autorités : conformes ; tests composition/politique : 9/9 ; lint du parcours : conforme.
- Types, builds application et Storybook de la copie finale : conformes. Sources UI/CSS/natives comparées à la source courante ; les valeurs et métadonnées DTCG ont la même représentation logique avant les essais, malgré une différence de formatage JSON. Les essais n’affectent que le projet fictif neuf.
- Parcours desktop exécuté directement dans cette copie avec `scripts/test-e2e.mjs --config config/testing/playwright.workshop-persistence.config.ts ui-arch-03.spec.ts --project=desktop` : 1/1, 1280×800 clair et 1440×900 sombre. Assertions explicites : largeur 280 px, padding 16 px, radius 16 px, couche 1, iframe pleine surface ; filtrage, clavier et sauvegarde/relecture/rétablissement conservés. Le premier lancement de ce runner n’avait pas le moteur Chromium local : cache existant réutilisé par lien dans la seule copie ignorée, sans téléchargement ni installation globale ; retest réussi.
- Captures finales de navigateur : [1280](../reviews/ds-ui-01-floating-panels/desktop-280-1280.png), [1440](../reviews/ds-ui-01-floating-panels/desktop-280-1440.png). Observation native finale via CUA : panneau gauche et panneau droit visibles, petits chevrons, champ sans libellé visible, contenu central dégagé. L’absence initiale du panneau gauche est résolue par la couche explicite.
- HTTP atelier 62428 et Storybook 62429 : 200. Fenêtre finale et services laissés ouverts pour la vérification demandée ; aucune ancienne copie ou donnée personnelle remplacée. Les ressources de la première tentative sont conservées, aucune fermeture d’instance antérieure revendiquée.

Accès : [atelier](http://127.0.0.1:62428/ui-lab), [Storybook](http://127.0.0.1:62429/). Descriptor privé `.local/ds-ui-01/user-test-latest.json`. Les revues design et technique ont été rejouées séquentiellement par le même agent, non indépendantes : satisfaisantes pour cette tranche ; pas de nouvelle surface de sécurité. La confirmation du porteur sur le padding de 16 px est appliquée et couverte par les assertions ; elle n’implique aucune acceptation globale du design. Doc updated ; prochaine action : vérification visuelle humaine dans la version ouverte. Aucune publication.
