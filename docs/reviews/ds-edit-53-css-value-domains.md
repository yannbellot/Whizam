# DS-EDIT-53 — Domaines CSS : preuves et revues

2 novembre 2026 — application. Base `869d5f9`, branche `codex/ds-edit-value-domains` ; candidat identifié par le commit local contenant ce rapport. Qualification du raccordement actuel, acceptation humaine différée. Voir la [fiche](../work-items/ds-edit-53-css-value-domains.md), le [guide de couverture](../design-system/css-value-domains.md) et la [décision 025](../decisions/025-css-value-domains.md).

## Résultat et périmètre

Trois autorités avec schémas fermés décrivent profil daté, 21 familles de valeurs et propriétés repérées. Les 18 propriétés du contrat d’édition référencent les domaines CSS ; le chargeur commun dérive leurs bornes et vérifie références/types/capacités avant génération et écriture. Les sources et schémas nouveaux participent au manifeste de révision, sans ajout de chemin d’écriture HTTP.

Rayon, texte, largeur, espacements et interligne sans maximum esthétique ; minima CSS zéro, graisse décimale 1–1000, décalage de contour signé. Champs numériques avec les bornes réellement définies. Nommage des nouvelles primitives signées conservant les identités positives existantes ; valeurs initiales, attributions et provenance inchangées. Les tests de migration utilisent désormais un contrat V1 figé, sans changer les anciens reçus ou le validateur v3.

Les entrées futures sont `catalogued`, de disponibilité non vérifiée et de grammaire différée, jamais activées par leur seule inscription. Ce livrable prépare les familles ; ce n’est pas une implémentation exhaustive des grammaires CSS. Les formats courants restent ceux du guide ; aucune nouvelle dépendance, ressource distante ou inférence IA.

## Vérifications exécutées

Runtime Node 24.22.0 réutilisé dans le cache local du dépôt, npm 11.8.0 ; aucune installation globale. Journaux conservés localement dans `.local/ds-edit-53/` du lab, non nécessaires au fonctionnement du kit. Les commandes ci-dessous partent de la racine applicative ; les contrôles isolés utilisent une copie des seuls fichiers suivis et des nouveaux fichiers du chantier, avec dépendances locales existantes.

| Contrôle | Résultat et preuve |
| --- | --- |
| `npm run test:design-system` | 80 tests réussis, y compris quatre nouveaux cas domaines/graphe/catalogue et sauvegarde/relecture ; génération et validation des schémas/relations conformes |
| `npm test` | 140 tests réussis, 19 fichiers ; ports locaux autorisés |
| `npm run test:design-editor:server` puis retest HTTP isolé | 77 tests de store/récupération réussis ; huit HTTP initialement échoués pour EPERM listen, huit HTTP relancés avec loopback autorisé et réussis : 85 cas qualifiés au total |
| `npm run test:design-system:docs` | Cinq tests réussis |
| `npm run docs:design-system:check` | Documentation générée à jour |
| `npm run typecheck` | Conforme dans la copie isolée ; dans le checkout, échec sur `SemanticStyles.tsx` non suivi préexistant, conservé sans modification |
| `npm run lint` et `npm run build` | Conformes dans la copie isolée des sources livrables |
| `npm run format:check` | Contrôle global isolé : avertissement de formatage hérité dans `tests/design-editor/panel-visibility.spec.ts`, fichier inchangé ; contrôle ciblé des fichiers de code du chantier conforme. Aucun formatage hors périmètre appliqué |
| `npm run test:design-editor -- --grep 'edits prepared dimensions'` | Deux parcours statiques desktop/mobile réussis, build Storybook inclus |
| `npm run test:design-editor:dev -- --grep 'edits prepared dimensions'` | Deux parcours dev desktop/mobile réussis |
| `npm run test:design-editor:persistence -- --grep 'autonomous padding\|DS-EDIT-53 large radius'` | Quatre parcours desktop/mobile réussis en copie isolée, puis relecture des sources sauvegardées et build de l’application compilée réussis |
| `git diff --check`, relecture du diff | Conformes au périmètre ; préexistants hors chantier exclus de la sélection |

Les parcours contrôlent rayon 9999px puis négatif refusé avec aperçu inchangé, retour à zéro, texte 160px et changements de police/interligne. La sauvegarde réelle teste les rayons 9999px/9998px selon le format, suivis d’un rechargement et d’une mesure CSS dans l’iframe. Le test moteur/store vérifie aussi graisse 650.5, décalage -2px, redémarrage et refus du rayon négatif sans changement de révision. Les deux valeurs de rayon distinctes évitent de tenter un enregistrement sans modification après le premier parcours.

## Échecs diagnostiqués et retests

- Attentes anciennes sur taille zéro, graisse entière, interligne minimum et décalage maximum mises à jour ; refus impossibles conservés. Le test de bornes inversées définit maintenant aussi une borne maximale explicite.
- Test de graphe complété avec identité primitive canonique et provenance requise ; ce n’était pas un défaut produit.
- Test de texte initialement resté en rem : attente 160px incorrecte, test corrigé pour choisir px, retests dev/statique réussis.
- Le test unitaire de panneaux échouait sur `document` et les outils de barre d’en-tête. Même échec reproduit sur HEAD avant DS-EDIT-53. Test isolé de `HeaderTools` et enregistrement filtré aux panneaux, sans modifier le produit ; suite complète retestée.
- L’ancien parcours de padding attendait l’absence du groupe de portée. Même échec reproduit sur HEAD desktop/mobile ; test ajusté pour choisir la portée composant lorsqu’elle est proposée. Les quatre parcours finaux réussissent.
- Les échecs initiaux restent dans les journaux ; aucun contrôle réseau n’a été retiré. Les retests loopback n’accèdent à aucun service distant.

## Revues séquentielles, même agent, non indépendantes

**Design Reviewer — satisfaisant sur le raccordement actuel.** Fidélité : aucun changement des valeurs initiales ni composition visuelle demandé ; pas de Figma fourni. Expérience : limites numériques cohérentes, valeurs extrêmes permises, refus négatif et dernier aperçu valide démontrés dans le navigateur ; focus de saisie et formats desktop/mobile couverts. L’acceptation esthétique et les futurs contrôles composites ne sont pas acquis.

**Technical Reviewer / QA — satisfaisant avec limites de couverture explicites.** Sources → chargeur validé → contrat résolu → snapshot compilé de confiance → moteur/serveur tracés. Bornes absentes acceptées, bornes incohérentes refusées, propriétés/familles contrôlées ; manifeste inclut les dépendances nouvelles. Tests de migration historiques préservés par fixture, graphe et sauvegarde/reprise éprouvés. La copie isolée retire seulement les préexistants non suivis de la qualification livrable ; elle ne masque pas l’échec de types du checkout. Grammaires futures et compatibilité générale restent non qualifiées.

**Security Reviewer — satisfaisant dans le périmètre local.** Aucun élargissement des chemins modifiables, du service HTTP, des origines, capacités ou accès réseau. Sources locales bornées à 2 Mio, schémas fermés, alias YAML désactivés ; données CSS non évaluées par le chargeur. La structure du snapshot reste comparée au contrat de confiance et les nombres non finis restent refusés. Les tests HTTP négatifs et la récupération de store sont conservés. Aucune certification, audit global ou ouverture aux URL/fonctions futures.

## Limites et reprise

Couverture de navigateur qualifiée : Chromium macOS desktop/mobile. Autres navigateurs/OS, profil CSS exhaustif, pourcentages/couleurs avancées/fonctions/variables éditables et parseur général non qualifiés. Six décimales, nombres finis et tailles d’identifiants restent des limites techniques documentées, pas des règles de design.

Aucune mise à jour automatique des anciennes instances de recette : reconstruire Storybook à la reprise pour charger le nouveau contrat de confiance, après vérification de l’absence de transaction/brouillon à préserver. Aucun aperçu supplémentaire laissé actif, aucune publication ni donnée métier modifiée. Modèles applicatifs de suivi et J4/J5 inchangés. **Doc updated.** Reprise : recette humaine du raccordement qualifié, extensions CSS futures uniquement dans un mandat explicite.

## Actualisation de la recette — 2 novembre 2026

Sur demande explicite après intégration, programme `4078ad5` installé dans la recette existante [54138](http://127.0.0.1:54138/?path=/story/components-button--default), racine locale du lab `.local/ds-edit-52/preview`. Safari contrôlé avant intervention : génération chargée, Enregistrer désactivé, aucun brouillon. Aucun journal/transaction en attente. Sauvegarde privée ignorée des dix sources de valeurs et de l’état de l’éditeur avant arrêt du seul processus identifié sur ce port.

L’arrêt SIGTERM a conservé un marqueur de propriétaire arrêté ; la première copie a été interrompue par son contrôle préalable. La commande livrée `recover-design-editor.mjs`, exécutée avec la version ancienne et après confirmation de l’arrêt, a terminé normalement. Aucun verrou, journal ou reçu supprimé manuellement. Les 31 fichiers du programme changés depuis DS-EDIT-52 ont ensuite été copiés ; les sources de valeurs ont été exclues. Génération puis validation de la recette réussies : 188 tokens de composants et 18 styles préparés (dont le style personnalisé de recette).

Service redémarré sur le même port et la même racine. Un rechargement normal de Safari conservait un ancien contrat compilé en cache ; un rechargement depuis l’origine a rétabli « Données à jour ». Panneau vérifié sur Arrondi : valeur d’origine 0.5rem, Enregistrer désactivé. Aucun test de valeur enregistré sur cette instance humaine. Les dix hashes de valeurs ont été comparés avant/après, identiques ; rayon sans maximum et décalage signé vérifiés dans le snapshot généré. Preuves locales ignorées `recipe-before.json`, `recipe-after.json`, `recipe-generate.log`, `recipe-validate.log`, `recipe-server.log` dans `.local/ds-edit-53/` du lab.

Ancienne instance 54137 et données métier non touchées. Recette 54138 laissée active pour le test humain, sans nouvelle connexion Codex ni publication. Ce contrôle confirme la disponibilité de DS-EDIT-53, pas l’acceptation humaine. Doc updated.

## Blocage signalé après actualisation — disponibilité rétablie

2 novembre 2026, base documentaire `25a479b`. Le designer signale que l’absence de token partagé bloque toute action. Inspection Safari réelle : « Connection lost », « Actualisation impossible », « Load failed » et enregistrement bloqué dans l’attente des références. Le port 54138 n’écoute plus ; l’ancien processus de lancement attaché a disparu. Aucun nouveau brouillon utilisateur présent.

Reprise par la commande officielle de récupération, sans suppression de protection, puis lancement `nohup` détaché avec session distincte et journal local, sur la même racine/port. Contrôle système : nouveau processus adopté par PID 1 et écoute loopback active. Le lancement précédent attaché à l’exécution de l’agent était insuffisant pour maintenir la recette disponible entre les échanges. L’état du nouveau lancement est consigné dans `.local/ds-edit-53/recipe-process.json` du lab, sans jeton.

Après rechargement Safari : « Données à jour ». Cas Arrondi sans attribution sémantique : modification temporaire de 0.5rem vers 0.51rem, « Nouveau style de composant » sélectionné et « Enregistrer » actif malgré le message d’absence de token partagé. Un dialogue de rechargement survenu pendant le geste a été refusé pour conserver ce brouillon de contrôle. Le bouton de rétablissement a ensuite retiré uniquement ce geste non enregistré : génération chargée, valeur 0.5rem et Enregistrer désactivé car aucune modification restante. Dix hashes de sources de valeurs identiques, zéro reçu ajouté.

Conclusion : panne de disponibilité corrigée ; aucun verrou fonctionnel lié à l’absence de token partagé reproduit dans ce cas. Le partage reste indisponible par définition sans attribution ; l’édition propre et l’enregistrement d’une nouvelle valeur sont accessibles. Aucun code d’actions ni libellé changé sur la base de cette panne. Réserve UX : libellé ambigu déjà signalé, distinct du contrôle serveur. Tests proportionnés : observation et geste réels Safari, contrôle du processus/port et intégrité des dix sources ; aucune nouvelle campagne applicative, aucun enregistrement de test dans la recette humaine. Doc updated. Reprise : test humain sur 54138 ; recette laissée active en processus détaché.
