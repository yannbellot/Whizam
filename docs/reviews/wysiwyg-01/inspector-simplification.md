# WYSIWYG-01 — Panneau droit simplifié

16 novembre 2026. Cible application ; base `db4609e`, branche codex/wysiwyg-01-simplify-inspector. [Mandat et préparation](../../work-items/wysiwyg-01-inspector-simplification.md). **En revue : qualification technique acquise, acceptation humaine différée.** Sources réalisées : [empreintes](inspector-simplification-sources.json).

## Résultat

Mode édition est placé avant la carte, conserve un seul switch accessible et reste disponible en mode interactif. Cette présentation couvre Components, Foundations et Pages. Le bouton conserve les confirmations existantes avant l’abandon d’une projection et le refus de quitter lorsqu’un conflit exige une recharge.

Les commentaires permanents CSS/provenance/token/déclarations, état/largeur, portée résumée et aides techniques sont retirés. Les champs visuels utilisent Fond, Contour, Épaisseur, Style, Arrondi, Texte et Police ; les champs de tokens affichent également Fond et Contour. Les identifiants, valeurs, provenance interne, validations et portées ne changent pas. Erreurs, brouillon, reçus et actions restent disponibles.

Le contexte des tokens enregistrés est limité au composant, à la variante et à la partie sélectionnés. La liste de parties disparaît ; les enfants demandent une sélection explicite dans l’aperçu. Les propriétés CSS restent celles de l’élément exact et peuvent naturellement se transmettre par héritage ; aucune sélection d’un enfant n’est promue vers la racine.

## Contrôles et incidents

- Génération et contrôle documentaire DS : réussis.
- 16 tests de contrats/composition : réussis, dont reçu durable, validation des parties et portées ; aucun fournisseur réel.
- Types et builds Application/Storybook : réussis sur `test-results/inspector-simple-checks`, copie des sources suivies avec les changements de la tranche. Les copies « 2 » et autres fichiers préexistants restent hors de cette qualification.
- ESLint ciblé : aucune erreur ; avertissement préexistant de dépendance useEffect dans VisualInspector conservé, sans changement du cycle de projection.
- Parcours [Chromium](inspector-simplification-chromium.json) et [WebKit](inspector-simplification-webkit.json), 1280×900 et 1440×1000 : réussis. Switch au-dessus de la carte, noms accessibles courts, absence des commentaires, tokens limités à la partie sélectionnée, modes/sélection/parent/enfant, historique/reset, responsive, conflits, navigation/recharge et Pages jusqu’à l’approbation, écriture isolée et relecture du rendu. Fournisseur explicitement simulé. Les empreintes des sources servies correspondent aux sources finales.

Incidents conservés : premier lancement navigateur et premiers contrats bloqués par listen EPERM du sandbox, puis relancés avec autorisation. Première exécution ESLint : réaffectation d’une prop, corrigée en variable locale. Première assertion ajoutée supposait une sélection root sur Field, alors que le clic touchait son label ; elle compare désormais la partie réellement sélectionnée. Les assertions d’état textuel supprimé ont été remplacées par disabled/aria-busy sur le composant réel ; leur échec initial ne correspondait pas à un défaut d’état du composant. Le parcours responsive a ensuite détecté une régression réelle : retirer l’état React de largeur supprimait aussi le rafraîchissement des champs lors du resize. Le signal interne de redimensionnement est rétabli sans texte affiché ; retest complet requis et consigné ci-dessous. Aucun contrôle échoué n’est présenté comme réussi.

## Revues

Design et technique/QA : **séquentielles, même agent, non indépendantes**. Référence de fidélité : les quatre demandes du porteur, sans nouvelle référence Figma. Revue du rendu : carte distincte sous le switch, typographie/contrôles hérités conservés, commentaires absents ; validation des interactions et des formats par les parcours liés. Technique : déplacement du switch sans changement de ses gardes, filtre du contexte avant TokenInspector, provenance retirée de l’affichage seulement. Les tests utilisent des projets synthétiques isolés.

Sécurité : revue ciblée du diff, aucune frontière d’accès, entrée externe, permission, fournisseur, donnée ou dépendance modifiée. Erreurs et confirmations conservées. Pas de nouvelle campagne de sécurité complète justifiée par ce changement de présentation.

Documentation : guide du panneau et fiche actualisés ; suivi consolidé dans la roadmap et l’état racine. Modèles applicatifs non initialisés, préexistants exclus. Doc updated. Aucun push, publication ni déploiement. Limites : acceptation visuelle humaine et parcours natif macOS complet non exécutés dans cette tranche. Reprise : recette visuelle humaine sur le [nouvel aperçu local](http://127.0.0.1:58383/ui-lab?scene=button%2FDefault), servi depuis la copie isolée de qualification ; anciennes recettes conservées. Essai direct CUA : sélection du texte puis du parent, libellés Fond/Contour, mode Foundations désactivé/réactivé et retour au composant observés, sans retouche persistante. [Capture du panneau et sélection du texte seul](inspector-simplification-desktop.png).

Commandes depuis application via sh scripts/with-runtime.sh : npm run tokens:generate ; npm run docs:design-system:check ; node --test tests/ui-composition.test.mjs tests/visual-intents.test.mjs ; node scripts/test-visual-inspector-ui.mjs --application, puis --application --webkit ; npm exec eslint -- (fichiers modifiés). npm run typecheck, build et build-storybook depuis la copie sélectionnée test-results/inspector-simple-checks. Journaux ignorés inspector-simple-{contracts-2,builds-responsive,chromium-responsive,webkit-responsive}. Les essais en échec précédents restent dans leurs journaux distincts. Aucun contrôle obligatoire manquant dans le périmètre.
