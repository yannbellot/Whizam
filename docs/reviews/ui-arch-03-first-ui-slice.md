# UI-ARCH-03 — Première tranche UI Loomata

**14 novembre 2026 — En revue : qualification technique acquise, acceptation humaine différée.** Base `8f19e6a`, branche `codex/ui-arch-03-first-ui-slice`. [Fiche](../work-items/ui-arch-03-first-ui-slice.md), [adoption 036](../decisions/036-first-ui-slice-adoption.md), [preuve structurée et empreinte des sources](ui-arch-03/qualification.json).

## Résultat observable

La navigation des scènes utilise React Aria Tree, avec groupes dépliables, recherche accent-insensible, état sélectionné contrôlé et retraits hiérarchiques. Le champ « Valeur précise » utilise React Aria TextField ; la validation et la projection restent dans le moteur existant. L’abandon ouvre un dialogue React Aria : conserver, Échap ou fermeture du dialogue ne supprime pas le brouillon ; l’action affirmative appelle l’abandon existant. Les confirmations AppKit de fermeture/quitter ne changent pas.

Tailwind 4.3.5 et React Aria Components 1.22.1 sont figés ; compatibilités React 19/Vite 7 vérifiées auprès du registre avant installation locale. DTCG outil séparé, variables `--loomata-ui-*`, décisions classifiées et thème dérivé ; aucun Preflight global. Les seules règles de base sont bornées au scope outil. Les CSS/valeurs projet restent inchangés ; les portails portent le thème du chrome. La génération outil se fait à la configuration Vite/Storybook, pas dans le writer projet.

Le cahier des charges et les autorités ont été alignés avant le code, sur mandat explicite. Le manifeste de révision passe de v36 à v37 pour inclure les nouvelles dépendances de lecture ; aucune nouvelle source modifiable ni opération du writer. Aucun ancien journal ou reçu converti. Le profil fermé du kit reçoit dix fichiers nécessaires à la complétude, sur autorisation explicite du porteur après constat du conflit avec la fiche initiale. Le chantier du socle des projets n’est pas lancé.

## Contrôles exécutés

Les campagnes s’exécutent sur copies fictives propres au chantier, jamais sur une recette humaine. Les 75 préexistants du clone sont préservés. `sourceFiles()` valide les 1130 entrées du profil fermé après ajout minimal. Aucun nouveau backend, compte, permission ou endpoint ajouté ; Electron et le code natif de production sont inchangés.

| Critère | Preuve | Résultat |
| --- | --- | --- |
| UI-01 | Parcours Playwright : recherche avec/sans résultat, conservation de scène, déplacement clavier Default → Button ; arbre contrôlé | Conforme sur Chromium desktop |
| UI-02 | Saisie invalide : `aria-invalid`, sauvegarde indisponible et couleur de l’aperçu préservée ; saisie valide et action locale réutilisées | Conforme |
| UI-03 | Focus initial sur « Conserver », Échap et focus rendu au déclencheur ; affirmation rétablit le brouillon initial. Même scénario dans WKWebView avec focalisation/clic DOM | Conforme dans les modes indiqués ; pas de saisie physique ni VoiceOver |
| UI-04 | Générateur déterministe, refus de références/types/valeurs invalides et références projet ; chrome stable après changement de couleur projet, absence de styles outil dans la page produit ; captures des deux thèmes | Conforme au périmètre testé ; pas une preuve d’autonomie complète du futur starter |
| UI-05 | Sauvegarde réelle, rechargement, relecture de la valeur puis rétablissement sur deux formats ; récupération du writer soumise aux tests de panne | Parcours persistant conforme ; 57 tests de récupération/store conformes, y compris reprise et SIGKILL |
| UI-06 | Types/lint, 114 tests DS et 57 tests store, documentation dérivée et builds application/Storybook ; test unitaire du générateur ; revues ci-dessous | Commandes et résultats finaux dans la fiche |

Commandes principales : `npm run typecheck`, `npm run lint`, `npm run test:design-system`, `npm run docs:design-system:check`, `npm run build`, `npm run build-storybook`, `npm run validate:loomata-ui`, `node --test tests/loomata-ui.test.mjs tests/design-editor-store.test.mjs`. Parcours ciblé `tests/workshop-persistence/ui-arch-03.spec.ts` dans la copie ; campagne native via `LOOMATA_UI_ARCH_TEST=1 node scripts/test-loomata.mjs` et un bundle de test distinct. Pas d’inférence modèle, import Figma ou mise à jour de projet personnel.

## Échecs diagnostiqués et retests

- Premier accès npm : DNS refusé par le sandbox ; vérification/installation locale reprises avec l’accès autorisé. Aucun réglage global ni correctif forcé de dépendances.
- Types dans le clone : imports manquants des copies non suivies suffixées « 2 » ; qualification reprise dans une copie les excluant, sans les modifier.
- Deux assertions DS attendaient 137 compositions alors que l’autorité courante inchangée en contient 143 ; attentes alignées. Le scénario de panne du writer comptait aussi deux sources d’import Figma non remplacées ; les indices de panne sont désormais bornés aux fichiers réellement remplacés par ce scénario, sans modification du writer.
- Vite renvoyait des erreurs 504 « Outdated Optimize Dep » au premier démarrage ; React Aria ajouté au préchargement explicite. Les sélecteurs de test ont été adaptés au rôle réel `treegrid`, sans faux rôle ajouté à l’UI.
- Le dialogue était hors écran : le reset du thème retirait la base d’espacement nécessaire à `inset-0`. Base reliée à la décision d’espacement outil et placement retesté. La lecture des captures a aussi conduit à ajouter les retraits hiérarchiques.
- Un build concurrent d’une sauvegarde a été refusé par la barrière `recovery-required` ; relance après la transaction conforme. Un runner historique limité à 120 s a ensuite expiré ; reprise par la commande livrée de récupération sur la seule copie inactive, puis campagne fraîche avec délai adapté. Aucun verrou retiré manuellement.
- Le pilote natif appelait `.click()` sans focaliser le déclencheur : son attente de retour au déclencheur était invalide. Focalisation explicite dans le seul pilote DOM, puis retest ; aucun contournement du focus dans le composant.

## Revues et limites

Revues design, technique et frontières de confiance : **séquentiel, même agent, non indépendant**. Design : captures relues, hiérarchie et placement corrigés, thèmes et erreurs couverts ; esthétique toujours proposée. Technique : callbacks et contrôleurs conservés, sources/dérivés séparés, versionnement et complétude du kit relus ; dépendances figées et builds contrôlés. Frontières de confiance : aucun nouveau transport d’écriture, garde de verrouillage de `abandon()` conservée, aperçu sans nouvelles capacités, aucune donnée privée dans les preuves.

Le contrôle npm signale 15 alertes dans les dépendances d’outillage existantes (14 modérées, une élevée) ; les noms concernés n’incluent pas les trois paquets ajoutés. Aucun `audit fix` automatique et aucune certification de sécurité. Les avertissements de polices, annotations de dépendances, taille de chunks et évolutions React Router/Storybook restent visibles dans les logs locaux.

Les preuves natives sont des actions AppKit/DOM dans WKWebView ; pas de clic physique, essai VoiceOver ou conformité d’accessibilité globale. Aucun support Windows/Linux acquis, aucune livraison Electron. Storybook contient les états outil isolés ; ses autres composants conservent leurs sources. Les instances et fenêtres préexistantes ne sont pas remplacées.

Reprise : recette humaine de la tranche après qualification technique, sans ouverture automatique du socle des projets ou d’Electron. Les limites des preuves demeurent dans le dossier final.

## Captures sélectionnées

[Atelier clair, 1280](ui-arch-03/tool-1280.png) · [Atelier sombre, 1440](ui-arch-03/tool-1440.png) · [Dialogue clair](ui-arch-03/dialog-1280.png) · [Dialogue sombre](ui-arch-03/dialog-1440.png) · [WKWebView 1280](ui-arch-03/native-1280.png) · [WKWebView 1440](ui-arch-03/native-1440.png).


## Correctif des icônes — 14 novembre 2026

Retour humain : parcours fonctionnel, réserve visuelle sur les pictogrammes supprimés. Diagnostic confirmé dans le diff UI-ARCH-03 : SceneNavigation ne rendait plus NavigationIcon. Les SVG Storybook existants et leur licence sont réutilisés dans l’arbre React Aria ; dossiers, composants, exemples et documents, chevrons SVG rétablis. Taille 14 px et quatre couleurs historiques reprises comme décisions non sémantiques de l’autorité outil, sans référence aux tokens projet. Icône de l’exemple sélectionné liée à la couleur du texte, SVG décoratifs `aria-hidden` et non focalisables ; noms accessibles et logique de navigation conservés. Story Navigation ajoutée au groupe Loomata UI/First slice. Aucun changement de profils, manifeste writer ou opérations.

Contrôles sur copie isolée `.local/ui-arch-03/icons-cQxRBW/project` : génération outil et `--check`, test Node du générateur, `npm run typecheck`, `npm run lint`, `npm run build` et `npm run build-storybook` conformes. `run-ui.mjs` avec `ui-arch-03.spec.ts --project=desktop` : un parcours intégré réussi en 1280×800 clair puis 1440×900 sombre ; assertions de présence/couleur/taille, SVG décoratifs, recherche et clavier, erreur/dernière valeur valide, annulation/abandon, sauvegarde/rechargement/rétablissement et absence de CSS outil dans le produit. Aucun test mobile ajouté. Les valeurs existantes de l’autorité outil et le JSON projet restent inchangés.

Échecs conservés : premier parcours interrompu car le test cherchait une scène « Principles » absente du catalogue ; recherche corrigée vers la scène « Docs » existante, second parcours conforme. Un lancement intermédiaire refusé par le sandbox au bind localhost n’a lancé aucun serveur ; reprise du runner autorisé sur la copie. Les avertissements de build hérités (polices, annotations Rollup, taille de chunks) restent visibles ; aucun échec masqué.

Revue design : séquentielle, même agent, non indépendante. [Clair 1280](ui-arch-03/icons-1280.png) et [sombre 1440](ui-arch-03/icons-1440.png) relus : glyphes historiques et couleurs retrouvés, sélection lisible ; disposition de la tranche maintenue, pas de nouvelle direction visuelle proposée. Revue technique : séquentielle, même agent, non indépendante ; chargement Tailwind et contrôle du nouveau consommateur NavigationIcon, classes statiques, indépendance des valeurs projet et compatibilité des copies vérifiés. Frontières de confiance inchangées : pas de nouveau serveur, permission, accès privé ou entrée externe ; pas de nouvelle campagne de sécurité nécessaire pour ce correctif de présentation. Conclusion satisfaisante sur le périmètre contrôlé, recette humaine et VoiceOver non réalisés par cette campagne. Socle des projets/Electron exclus ; Doc updated, aucune publication.


Livraison humaine du correctif, source `7ffcc98` : bundle normal compilé/signé et nouvelle fenêtre **Loomata UI ARCH 03 Icons Test** ouverte sur UI Lab 62416 ; glyphes restaurés vus dans la vraie WKWebView par CUA, panneau chargé avec Valeur précise disponible. Précédente fenêtre UI ARCH 03 Test conservée. [Accès et reprise](../work-items/ui-arch-03-first-ui-slice.md#correctif--restauration-des-icônes-storybook). Services propres et Storybook 62418 laissés actifs, signature et HTTP conformes ; aucune donnée personnelle transférée, recette humaine toujours attendue.


Contrôle après ouverture : File Provider avait réintroduit `com.apple.FinderInfo` sur le bundle neuf, entraînant un refus de vérification stricte malgré le contrôle conforme avant lancement. Retrait des seules métadonnées FinderInfo/ResourceFork incompatibles via `stripSigningMetadata` existant, quarantaine et provenance conservées ; nouvelle vérification stricte conforme, sans resigner/remplacer le binaire en cours ni fermer la fenêtre. Écart de métadonnées local, aucun changement produit.
