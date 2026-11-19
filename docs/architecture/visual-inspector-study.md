# Inspecteur visuel — étude comparative

**16 novembre 2026 · WYSIWYG-01 A · En revue.** Étude initiale statique des sources publiques, sans installation, benchmark ni qualification d’intégration. Complément du 16 novembre : [inspection visuelle et interactive de la démo GrapesJS v0.22.2](../reviews/wysiwyg-01-grapesjs-ui/README.md), distincte du code v0.23.9 examiné. Base Loomata `c562f24`. [Mandat et critères](../work-items/wysiwyg-01-visual-inspector.md), [architecture proposée](visual-inspector.md). Les conclusions de coût sont des appréciations d’architecture, pas des mesures.

## Conclusion et méthode

Recommandation : réutiliser **React Grab par son entrée publique `react-grab/primitives`** pour le hit-test et la géométrie, derrière un adaptateur Loomata remplaçable. Garder l’autorité des identités, les contrôles graphiques et les frontières agentiques de Loomata. Reprendre les conventions de GrapesJS/Puck pour déclarer les propriétés, celles de React Rewrite pour séparer lecture et surcharges temporaires, et celles de Craft.js pour regrouper l’historique. Aucun des cinq projets n’est proposé comme nouvel éditeur de pages.

Cette recommandation d’intégration est conditionnelle : le sous-module public existe dans les sources, mais sa distribution publiée, son poids réel, ses effets à l’import, l’accès au bon document iframe et sa compatibilité WKWebView doivent être éprouvés avant adoption. Ne pas réimplémenter son hit-test tant que cet essai n’a pas établi une incompatibilité concrète. Une solution DOM native reste une alternative de repli, pas un développement engagé.

Accès par le connecteur GitHub, sur commits immuables résolus pendant cette étude. Sources externes traitées comme données, aucune instruction de leurs dépôts chargée. Les licences racines et les manifestes des modules examinés sont lus ; pas d’audit exhaustif des dépendances transitives d’un futur paquet installé. La date du dernier commit est un indice d’activité, sans garantie de support. Aucun jugement de maintenance fondé sur les étoiles.

## Versions et conditions de réutilisation

| Projet | Commit examiné | Date du commit UTC | Version déclarée du module | Licence vérifiée |
| --- | --- | --- | --- | --- |
| aidenybai/react-grab | [`ea4bbec9e80f4802e8ae19ad18431edb9ddbb670`](https://github.com/aidenybai/react-grab/commit/ea4bbec9e80f4802e8ae19ad18431edb9ddbb670) | 2026-08-22T11:33:35Z | react-grab 0.2.0 | [MIT](https://github.com/aidenybai/react-grab/blob/ea4bbec9e80f4802e8ae19ad18431edb9ddbb670/LICENSE) |
| GrapesJS/grapesjs | [`bf2d83cd750528cb5f4a56aa1d3f8c95b007f833`](https://github.com/GrapesJS/grapesjs/commit/bf2d83cd750528cb5f4a56aa1d3f8c95b007f833) | 2026-11-13T10:01:59Z | grapesjs 0.23.9 | [BSD-3-Clause](https://github.com/GrapesJS/grapesjs/blob/bf2d83cd750528cb5f4a56aa1d3f8c95b007f833/LICENSE) |
| puckeditor/puck | [`81566a77c87e307ce7d015b0d9089ba928360edc`](https://github.com/puckeditor/puck/commit/81566a77c87e307ce7d015b0d9089ba928360edc) | 2026-11-16T10:03:07Z | @puckeditor/core 0.24.0 | [MIT](https://github.com/puckeditor/puck/blob/81566a77c87e307ce7d015b0d9089ba928360edc/LICENSE) |
| donghaxkim/react-rewrite | [`baf49285a2bb195875a03ef728078eb07c99c9c1`](https://github.com/donghaxkim/react-rewrite/commit/baf49285a2bb195875a03ef728078eb07c99c9c1) | 2026-04-10T02:06:32Z | overlay 0.1.0 privé ; CLI 0.1.1 | [MIT](https://github.com/donghaxkim/react-rewrite/blob/baf49285a2bb195875a03ef728078eb07c99c9c1/LICENSE) |
| prevwong/craft.js | [`23f44f3208ebf78d1632ec4aa7094001f513eb41`](https://github.com/prevwong/craft.js/commit/23f44f3208ebf78d1632ec4aa7094001f513eb41) | 2025-02-14T09:22:26Z | @craftjs/core 0.2.12 ; utils 0.2.5 | [MIT](https://github.com/prevwong/craft.js/blob/23f44f3208ebf78d1632ec4aa7094001f513eb41/LICENSE) |

Les quatre licences MIT permettent la réutilisation sous conservation du copyright et de la permission. BSD-3-Clause demande également de conserver conditions et avertissement dans les distributions binaires et interdit l’usage des noms pour promotion sans permission. Cela ne décide pas la licence de Loomata et ne vaut pas autorisation de publication. Toute copie future de portion substantielle inclura ses avis ; cette étude n’intègre aucun code externe.

## 1. React Grab : meilleur candidat pour les primitives de sélection

Sources lues : [packages/react-grab/package.json](https://github.com/aidenybai/react-grab/blob/ea4bbec9e80f4802e8ae19ad18431edb9ddbb670/packages/react-grab/package.json), [packages/react-grab/src/primitives.ts](https://github.com/aidenybai/react-grab/blob/ea4bbec9e80f4802e8ae19ad18431edb9ddbb670/packages/react-grab/src/primitives.ts), [packages/react-grab/src/core/context.ts](https://github.com/aidenybai/react-grab/blob/ea4bbec9e80f4802e8ae19ad18431edb9ddbb670/packages/react-grab/src/core/context.ts), [packages/react-grab/src/core/element-adapter.ts](https://github.com/aidenybai/react-grab/blob/ea4bbec9e80f4802e8ae19ad18431edb9ddbb670/packages/react-grab/src/core/element-adapter.ts), [packages/react-grab/src/utils/get-unfiltered-elements-at-point.ts](https://github.com/aidenybai/react-grab/blob/ea4bbec9e80f4802e8ae19ad18431edb9ddbb670/packages/react-grab/src/utils/get-unfiltered-elements-at-point.ts), [packages/react-grab/vite.config.ts](https://github.com/aidenybai/react-grab/blob/ea4bbec9e80f4802e8ae19ad18431edb9ddbb670/packages/react-grab/vite.config.ts).

Le manifeste expose explicitement `./primitives`, distinct de l’entrée complète et de `./core`. `getElementAtPoint` / `getElementsAtPoint` offrent filtres et conteneur ; `getElementBounds` fournit la géométrie. Le hit-test traverse les frontières accessibles et suspend/restaure son gel d’interaction dans un `finally`. L’overlay Loomata doit exclure ses propres éléments et borner le document inspecté. Les sélecteurs produits servent de contexte ; leur qualification « stable » dans le code amont ne remplace pas les identités d’occurrence Loomata.

`getElementContext` rassemble composant, stack, chemin, aperçu HTML et styles ; `context.ts` dépend de l’instrumentation bippy et de métadonnées React. Ce résultat est une observation facultative, pas une preuve de correspondance de définition. Les listes peuvent partager une localisation JSX. Production, source maps absentes ou instrumentation tardive peuvent réduire la couverture ; à tester, jamais compenser par une identité inventée.

**Réemploi recommandé :** imports nommés des fonctions de hit-test/géométrie. Éviter l’entrée qui initialise l’interface globale. Ne pas appeler `freeze`, qui suspend les mises à jour React et animations : le produit doit continuer à vivre. Ne pas appeler `openFile`, les fonctions de copie ni collecter HTML/texte de formulaire pour la transmission. L’identification React s’appuie d’abord sur le registre Loomata ; un enrichissement bippy sera facultatif, contrôlé et sans chemin absolu exporté.

Dépendances déclarées : bippy `^0.7.2`, CLI workspace ; React `>=17` facultatif. Le build regroupe bippy et Solid, même si Solid est déclaré comme dépendance de développement : le nombre de dépendances npm ne mesure donc pas le coût navigateur. Taille gzip et élimination du code inutilisé **non mesurées**. Coût d’intégration estimé moyen ; risque principal : contexte de fenêtre et instrumentation, plutôt que composition de pages. Commit d’août 2026 et tests présents dans le dépôt : activité observée, tests non exécutés ici.

## 2. GrapesJS : conventions de Style Manager, extraction coûteuse

Sources lues : [packages/core/package.json](https://github.com/GrapesJS/grapesjs/blob/bf2d83cd750528cb5f4a56aa1d3f8c95b007f833/packages/core/package.json), [packages/core/src/style_manager/index.ts](https://github.com/GrapesJS/grapesjs/blob/bf2d83cd750528cb5f4a56aa1d3f8c95b007f833/packages/core/src/style_manager/index.ts), [packages/core/src/style_manager/model/PropertyNumber.ts](https://github.com/GrapesJS/grapesjs/blob/bf2d83cd750528cb5f4a56aa1d3f8c95b007f833/packages/core/src/style_manager/model/PropertyNumber.ts), [packages/core/src/style_manager/model/PropertyComposite.ts](https://github.com/GrapesJS/grapesjs/blob/bf2d83cd750528cb5f4a56aa1d3f8c95b007f833/packages/core/src/style_manager/model/PropertyComposite.ts).

Le Style Manager organise des secteurs et propriétés, fournit types extensibles, cibles multiples et événements. `PropertyNumber` distingue valeur/unité, bornes et pas. `PropertyComposite` distingue propriétés liées ou détachées et transformations `fromStyle/toStyle` : utile pour marges, bordures et autres shorthands.

L’API publique est obtenue depuis `editor.StyleManager`. Le constructeur prend `EditorModel`, écoute sélection, devices, états, undo/redo et cible des modèles Component/CssRule. Les propriétés numériques créent aussi un InputNumber du framework. Ce n’est donc pas un inspecteur CSS autonome branchable sur un DOM React existant par simple import.

**Choix proposé :** reprendre les conventions secteur/type/unité/composite et les événements début/aperçu/fin ; conserver les contrôles React Aria et le modèle de données Loomata. Ne pas importer le moteur GrapesJS ni extraire sa hiérarchie Backbone pour quelques champs. Adaptation directe du Style Manager : coût élevé et maintenance d’un couplage interne. Dépendances déclarées du paquet : Backbone 1.4.1, Underscore 1.13.8, CodeMirror 5.63.0 et formatting. Pas de dépendance React à la racine de ce module ; ce n’est pas une preuve de légèreté. Commit du 13 novembre 2026 : activité récente observée. Poids bundlé et isolation de module non mesurés.

## 3. Puck : bon contrat de champs, éditeur déclaratif différent

Sources lues : [packages/core/package.json](https://github.com/puckeditor/puck/blob/81566a77c87e307ce7d015b0d9089ba928360edc/packages/core/package.json), [packages/core/types/Fields.ts](https://github.com/puckeditor/puck/blob/81566a77c87e307ce7d015b0d9089ba928360edc/packages/core/types/Fields.ts), [packages/core/types/Config.tsx](https://github.com/puckeditor/puck/blob/81566a77c87e307ce7d015b0d9089ba928360edc/packages/core/types/Config.tsx), [packages/core/components/AutoField/index.tsx](https://github.com/puckeditor/puck/blob/81566a77c87e307ce7d015b0d9089ba928360edc/packages/core/components/AutoField/index.tsx), [packages/core/index.ts](https://github.com/puckeditor/puck/blob/81566a77c87e307ce7d015b0d9089ba928360edc/packages/core/index.ts).

`Fields` décrit les champs par type ; `CustomFieldRender` reçoit value, onChange, readOnly et identité. Config lie champs, rendu et données de composant. AutoField fournit des champs et substitutions, mais lit le store applicatif, overrides et état de sélection ; son simple réemploi n’est pas neutre. La version étudiée propose aussi l’extension des types de champ par augmentation de module.

**Choix proposé :** réutiliser le principe d’un registre typé de descripteurs et de contrôles contrôlés par value/onChange, sans adopter Config/Data pour représenter les pages. Importer Puck pour cette seule interface imposerait des contextes et conventions étrangers au registre Loomata. Coût élevé pour l’éditeur complet, moyen pour extraire des contrôles, faible pour adapter la convention en utilisant les composants déjà présents.

Manifeste : React 18/19, Node >=20 ; Zustand, dnd-kit et nombreuses dépendances Tiptap parmi les dépendances déclarées. Cela n’affirme pas que chaque import charge tout ; il faut mesurer un bundle pour le savoir. Commit du jour, activité récente observée. Aucun test ni mesure de compatibilité Puck exécuté.

## 4. React Rewrite : référence la plus proche du parcours, mauvais circuit d’application pour Loomata

Sources lues : [packages/overlay/package.json](https://github.com/donghaxkim/react-rewrite/blob/baf49285a2bb195875a03ef728078eb07c99c9c1/packages/overlay/package.json), [packages/cli/package.json](https://github.com/donghaxkim/react-rewrite/blob/baf49285a2bb195875a03ef728078eb07c99c9c1/packages/cli/package.json), [packages/overlay/src/selection.ts](https://github.com/donghaxkim/react-rewrite/blob/baf49285a2bb195875a03ef728078eb07c99c9c1/packages/overlay/src/selection.ts), [packages/overlay/src/properties/property-descriptors.ts](https://github.com/donghaxkim/react-rewrite/blob/baf49285a2bb195875a03ef728078eb07c99c9c1/packages/overlay/src/properties/property-descriptors.ts), [packages/overlay/src/properties/property-controller.ts](https://github.com/donghaxkim/react-rewrite/blob/baf49285a2bb195875a03ef728078eb07c99c9c1/packages/overlay/src/properties/property-controller.ts), [packages/overlay/src/changelog.ts](https://github.com/donghaxkim/react-rewrite/blob/baf49285a2bb195875a03ef728078eb07c99c9c1/packages/overlay/src/changelog.ts).

Sélection par événements capturés, géométrie viewport, instrumentation bippy, résolution des composants et reconnexion à la cible. Le contrôleur lit les valeurs calculées, diffère certaines lectures jusqu’au dépliage, maintient les surcharges et expose preview/cancel/commit. Les descripteurs lient propriété CSS, groupe, contrôle et conventions Tailwind. Le journal gère plusieurs formes d’annulation dont une demande au CLI ; il ne constitue pas un historique pur universel.

**Point décisif :** `scheduledCommit` utilise un délai de 300 ms pour appeler commit, et le contrôleur comporte un délai de résultat de 5 s avec succès présumé si aucune réponse n’arrive. La sélection importe ce contrôleur ; reprendre l’overlay entier transporterait ces comportements. Le manifeste overlay est privé ; le produit distribué passe par un CLI/proxy et des outils de réécriture (`http-proxy`, WebSocket, jscodeshift). Ce circuit contredit le rôle borné de l’inspecteur demandé.

**Choix proposé :** adapter les principes des descripteurs, de la lecture paresseuse et de la séparation original/surcharge ; ne copier un contrôle isolé qu’après démonstration d’un gain par rapport à React Aria existant. Aucun import du contrôleur, du proxy, du mapping Tailwind ou du moteur de code. Coût de découplage élevé, contrairement à la proximité apparente de l’interface. bippy `^0.5.32` dans overlay, pas de peer React déclaré là : compatibilité non démontrée. Dernier commit examiné en avril 2026 ; cadence/support à confirmer, sans conclure à un abandon.

## 5. Craft.js : historique instructif, sélection liée au graphe d’éditeur

Sources lues : [packages/core/package.json](https://github.com/prevwong/craft.js/blob/23f44f3208ebf78d1632ec4aa7094001f513eb41/packages/core/package.json), [packages/utils/package.json](https://github.com/prevwong/craft.js/blob/23f44f3208ebf78d1632ec4aa7094001f513eb41/packages/utils/package.json), [packages/core/src/events/DefaultEventHandlers.ts](https://github.com/prevwong/craft.js/blob/23f44f3208ebf78d1632ec4aa7094001f513eb41/packages/core/src/events/DefaultEventHandlers.ts), [packages/core/src/editor/store.tsx](https://github.com/prevwong/craft.js/blob/23f44f3208ebf78d1632ec4aa7094001f513eb41/packages/core/src/editor/store.tsx), [packages/utils/src/History.ts](https://github.com/prevwong/craft.js/blob/23f44f3208ebf78d1632ec4aa7094001f513eb41/packages/utils/src/History.ts).

Les connecteurs attachent un DOM à un NodeId du store et gèrent sélection, survol et glisser-déposer. Le store conserve nodes et événements ; les actions de sélection sont exclues de l’historique. `History` conserve patches et inversePatches Immer, coupe la branche redo lors d’un ajout, propose merge/throttle et déplace un pointeur pour undo/redo.

**Choix proposé :** conserver la distinction événements UI / changements et le regroupement par geste. Ne pas intégrer les connecteurs ou le graphe Craft.js pour réenregistrer les pages. `@craftjs/utils` est publié mais décrit comme interne, et ajoute Immer, Lodash, nanoid, shallowequal, tiny-invariant avec peer React ; importer ce paquet seulement pour une pile de gestes n’est pas justifié. Une pile locale d’avant/après, bornée au tampon visuel et sans graphe de pages, est plus adaptée ; aucune copie de History effectuée ici.

Core déclare React 16.8 à 19 et dépend de utils, debounce, Lodash, tiny-invariant. Dernier commit examiné du 14 février 2025 : risque de cadence plus ancienne à considérer, pas une preuve d’incompatibilité React 19 puisque ce peer est déclaré. Maintenance et compatibilité runtime restent distinctes.

## Comparaison et décision proposée

| Projet | Intégration directe retenue | Adaptation utile | Coût / principale réserve |
| --- | --- | --- | --- |
| React Grab | Primitives publiques, sous réserve de qualification | Adaptateur hit-test/géométrie ; contexte React facultatif | Moyen ; bundle, iframe et instrumentation |
| GrapesJS | Aucune | Secteurs, unités, composites, événements | Élevé si extraction ; EditorModel/Backbone |
| Puck | Aucune | Registre de champs contrôlés, extensions | Élevé si adoption ; modèle Config/Data et contextes |
| React Rewrite | Aucune | Lecture CSS, descripteurs, projection temporaire | Élevé ; proxy/code writer et succès présumé |
| Craft.js | Aucune | Historique par gestes et inverse, sélection hors historique | Élevé pour core ; nodes/connecteurs ; utils interne |

Aucun paquet étudié ne fournit à lui seul une provenance CSS complète, des identités Loomata et des portées autorisées. Les reconstruire depuis une égalité de couleur, une classe ou un nom React serait incorrect. Les contrôles, la lecture CSS bornée, le tampon et l’admission doivent donc rester spécifiques au contrat Loomata. Cela justifie ces modules locaux ; cela ne justifie pas de refaire le hit-test réutilisable.

### Dépendances et seuil avant adoption

bippy est une dépendance importante des deux outils d’inspection. Vérification complémentaire au commit [`fbafc407ca31ad82f391404c6c6539008f9e0d79`](https://github.com/aidenybai/bippy/commit/fbafc407ca31ad82f391404c6c6539008f9e0d79) : [licence MIT](https://github.com/aidenybai/bippy/blob/fbafc407ca31ad82f391404c6c6539008f9e0d79/LICENSE), [manifeste 0.7.3](https://github.com/aidenybai/bippy/blob/fbafc407ca31ad82f391404c6c6539008f9e0d79/packages/bippy/package.json). Cela ne verrouille pas la version transitive qui sera réellement installée sous la plage React Grab. Avant adoption : figer le paquet disponible et son intégrité, vérifier avis de tout code regroupé, scripts d’installation et licences transitives, mesurer l’import ciblé, constater absence de proxy/écriture/réseau inattendu et tester React réel/WKWebView. Ne pas extrapoler la licence de cinq racines à tout npm.

**Bilan A :** cinq sources examinées et choix motivés ; étude documentaire livrée, qualification runtime non acquise. [Architecture et portes de qualification](visual-inspector.md), [revue et limites](../reviews/wysiwyg-01-study-architecture.md).

## Complément UI — GrapesJS observé dans le navigateur

[Parcours en sept étapes, treize captures et recommandations](../reviews/wysiwyg-01-grapesjs-ui/README.md). Sélection/parent, largeur et unités, typographie/rétablissement, palette/saisie de couleur, annulation, contexte Hover et Flex/preview étroite ont été manipulés dans la démo officielle v0.22.2. La réserve sur le retour exact de couleur après redo est explicite ; ni cadence des gestes ni comportement de la v0.23.9 n’en sont déduits.

Reprendre la proximité valeur/unité, les groupes d’espacements et contrôles graphiques contextualisés. Pour Loomata, conserver les sections fixes demandées dans DS-UI-06, ajouter provenance textuelle et actions nommées, garder le contexte état/breakpoint visible et séparer validation de contrôle, transmission du lot et application par les agents. L’audit ne recommande pas d’importer le Style Manager complet ; les dépendances et frontières relevées dans l’étude restent les mêmes. Aucune implémentation ni adoption UI acquise.
