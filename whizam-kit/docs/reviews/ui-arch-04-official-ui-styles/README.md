# UI-ARCH-04 — Normalisation officielle des surfaces Loomata

> **Habillage retiré le 15 novembre 2026 sur demande du porteur.** [Retour au design antérieur](../ui-arch-04-style-rollback/README.md), avec conservation des correctifs de chargement. Les observations ci-dessous restent les preuves historiques de la normalisation désormais annulée.

**14 novembre 2026 — En revue.** Qualification technique acquise dans la recette run-Ag62zM ; acceptation visuelle humaine différée. [Fiche et décision de portée](../../work-items/ui-arch-04-official-chat-styles.md), [inventaire complet](inventory.md), [preuves structurées](qualification.json).

## Résultat et analyse

Codex consommait les composants/styles historiques du projet, alors que la recette avait adopté les exemples officiels pour le projet fictif. UI Lab mélangeait contrôles HTML, habillage historique et premières primitives React Aria. Cette coexistence explique le manque d’unité constaté ; React Aria n’avait pas un thème intégré manquant.

Le contenant utilise les exemples Vanilla CSS Indigo de [React Aria Button](https://react-aria.adobe.com/Button) et [TextField](https://react-aria.adobe.com/TextField), avec leurs recettes Select, ListBox, Popover, Disclosure, Tree, SearchField, Form, ToggleButton, Link, Checkbox, ColorSwatch et Dialog/Modal. Dix-neuf CSS Adobe sont identiques octet pour octet à la révision 360e35170568dfc99a2baaa78e6b7bdd36458d91. Provenance et licences accompagnent les sources. Les TSX tiers changent seulement le chemin des trois icônes vers Lucide officiel 0.468.0 ; tarball npm contrôlé par SHA-512, JS et source maps conservés.

Les contrôles historiques sont adaptés lorsqu’une substitution complète aurait changé événements HTML, refs, soumission ou appels showModal/close. Les styles locaux organisent les panneaux, le défilement et les contrats natifs ; ils ne définissent pas de palette, typographie ou échelle de contrôles concurrente. Les anciennes recettes restent disponibles pour leurs autorités/historiques, mais les surfaces converties n’importent plus leur habillage. Les glyphes de scènes Storybook sont conservés, avec les couleurs du thème officiel.

Le thème Loomata reste indépendant des dix paramètres DTCG du projet fictif. Page, aperçus et exemples du design system projet ainsi que manager Storybook gardent leurs propriétaires. La matrice explique chaque classement ; les pages non réalisées ne sont pas présentées comme normalisées.

## Parcours et captures examinées

1. **Codex : corrigé et observé dans WKWebView.** [Avant](codex-before.jpg), [après](codex-native-after.png). Connexion, conversation et composition partagent la recette des modes embarqués. Aucun compte connecté ou message fournisseur envoyé.
2. **UI Lab : opérationnel dans WKWebView et dans la recette web finale.** [Avant](ui-lab-before.jpg), [après natif](ui-lab-native-after.png), [après web](ui-lab-web-after.jpg). Navigation, sélection clavier, dix paramètres, saisie invalide, réglage valide, portée, conservation et abandon du brouillon vérifiés. Valeurs initiales remises, aucun enregistrement.
3. **Pages/inspecteur : sélection observée sur page synthétique isolée.** [Capture](pages-inspector.jpg). Boutons, portée, groupes de propriétés, variantes et micro-chat examinés ; écritures désactivées dans le scénario principal en consultation. Fixture non transférée dans le projet du porteur.
4. **Figma : ouverture, champs, navigation, zoom désactivé et fermeture observés sans compte.** [Capture](figma-after.jpg). Les états chargés/importés dépendent d’une référence ; leur code est normalisé, sans import externe pour cette campagne.
5. **États d’agent/contrats HTML : isolés du fournisseur.** [19 observations](interaction-checks.json) : clic unique, Select groupé au clavier/événement HTML, fieldset désactivé, dialogue natif/focus, envoi simulé unique/remise à zéro, acceptation/refus simulés, interruption, historique, connexion absente, erreurs, agents intégrés et disclosure du micro-chat. Checkbox cochée et disclosure HTML au clavier observés également. Les états fournisseur réels ne sont pas déduits des simulations.

Les adaptateurs Button/Input ont les mêmes 16 propriétés visuelles calculées que les témoins officiels dans l’état mesuré : [détail](computed-styles.json). Ce n’est pas une preuve pixel exhaustive de tous les widgets, navigateurs et thèmes.

## Contrôles exécutés

Node privé 24.22.0 du dépôt. Traces volumineuses et copies dans .local/ui-arch-04/official-chat-styles/, ignoré.

| Contrôle | Résultat final |
| --- | --- |
| Génération projet | 24 alias, 63 styles, 198 tokens de composants |
| Types React Router/TypeScript, candidat puis recette livrée | Conforme |
| ESLint des sources modifiées hors fournisseur, puis adaptateur final | Conforme |
| npm run build et npm run build-storybook du candidat final | Conformes ; avertissements de taille de bundle Storybook conservés |
| node --test tests/ui-composition.test.mjs tests/agent-chat.test.mjs tests/workspace-adapters.test.mjs | 23 réussis, 0 échec au retest |
| Build chat via scripts/build-agent-chat.mjs | Conforme |
| Fermeture CSS : connu, altéré, inconnu, valeur brute inconnue | 4 contrôles conformes |
| Complétude copie/révision des sources | Conforme ; project-files.json reste hors révision comme auparavant |
| Application à blanc puis réelle des deux correctifs sur copies des sources avant | Conforme ; SHA-256 après application concordants |
| Recette web finale 59550 | Chargée, dix propriétés, clavier, aucun brouillon, aucune erreur console constatée |

Les tests serveur qualifient notamment les refus de fichiers privés, origines/capacités, approbations, non-rejeu et isolation projet/compte. Aucun code de transport, accès, fournisseur ou autorisation n’est modifié.

## Échecs intermédiaires et corrections

La préparation synthétique a d’abord utilisé le lecteur canonique, incompatible avec les couleurs OKLCH de cette recette antérieure. Reprise avec le lecteur déjà qualifié de la copie, sans relâcher le lecteur canonique. La page synthétique remplaçant temporairement App ne fournissait pas le pont OfficialTheme ; l’absence de réglage était propre à ce scénario. Les dix réglages ont été vérifiés sur le vrai projet fictif.

Une référence isExpanded supprimée trop tôt, détectée par TypeScript puis dans la navigation synthétique, est corrigée avec la rotation officielle du chevron. Les source maps Lucide ont été complétées. Trois tests d’adaptateur ont détecté un défaut de copie : le répertoire dist était ignoré par les instantanés Git. Le graphe tiers est désormais sous esm, sans modifier ses JS, avec mapping de provenance ; les 23 tests repassent.

Le premier contrôle de complétude supposait à tort que project-files.json appartenait au manifeste de révision ; cette frontière préexistante est maintenant distinguée. Des invocations de préparation ont échoué avant exécution par chemin relatif erroné, corrigées avec chemins absolus. La relecture des correctifs a aussi détecté une fin de ligne ajoutée aux source maps sans saut de ligne final ; le format du correctif est corrigé et les empreintes rejouées concordent. Un clic anticipé pendant la fermeture d’un popover n’avait pas d’effet ; le test attend sa fermeture effective.

Une tentative de saisie native a ouvert la confirmation de fermeture de Loomata ; elle a été annulée immédiatement par « Conserver l’espace de travail ». La saisie via le champ AX et l’édition/abandon ont ensuite réussi. Après les captures et le retour UI Lab réussis, le pilote CUA a perdu la fenêtre alors que l’app restait signalée active. Réacquisition non aboutie ; aucune cause de fermeture, correction native ou réussite native ultérieure inventée. Le contrôle final est web. Ce constat ne résout pas la réserve du diagnostic macOS historique.

## Préservation et livraison locale

Sur 312 fichiers de référence du projet fictif, 290 sont identiques ; les 22 changements appartiennent au contenant et sont recensés dans les empreintes. App, exemples officiels du projet, valeurs DTCG et autorités YAML restent identiques. Les listes de copie/révision ajoutent les seules dépendances nécessaires. Aucun contenu synthétique, état privé, historique, compte ou secret dans les correctifs.

Assets Codex copiés puis index statique remplacé atomiquement, daemon conservé ; anciens assets présents pour les vues chargées. Services de run-Ag62zM arrêtés proprement puis relancés sur 59550/59551. Raccordement natif après redémarrage accepté seulement après abandon du brouillon d’essai. Bundle et autres instances/services non remplacés par l’intervention ; seuls les services synthétiques sont arrêtés.

Sources : [correctif outillage](tool.patch), [correctif projet](project.patch), [empreintes avant/après](source-hashes.json). L’outillage repose sur les six sources de c39ea45 ; le projet repose sur la recette officielle avec raccordement DTCG antérieur. Vérifier les empreintes avant application sur une nouvelle copie ; ce n’est pas un patch générique du starter. Générer les dérivés dans chaque racine, puis compiler. Dérivés, caches, dépendances et sessions ne sont pas versionnés ici.

Les sources canoniques ne sont pas réécrites sous le writer et les fenêtres actives. La normalisation livrée concerne la version de test ; sa promotion canonique reste distincte. Dossier et correctifs évitent une dépendance exclusive aux fichiers privés ignorés.

## Revues et réserves

Design Reviewer : captures exactes sauvegardées, propriétaires, absence de CSS visuel concurrent, comparaison Button/Input, recettes intactes. Technical Reviewer/QA : types, builds, événements/refs/formulaires, brouillon, copie/instantanés. Security Reviewer : accès inchangés, aucune injection HTML brute, origines/capacités et garde d’écriture conservés, sources tierces épinglées/licenciées. Revues successives par le même agent, non indépendantes. Pas de revue de fabrication d’agents ou de distribution globale : domaines inchangés.

VoiceOver, contrastes des contenus importés, thèmes clair/sombre sur tous les moteurs et états Figma réellement chargés non vérifiés dans cette campagne. Cible desktop, aucune nouvelle recette mobile. Le CSS immuable ne certifie pas l’accessibilité de toute la composition.

Prochaine action : recette visuelle humaine dans [l’UI Lab à jour](http://127.0.0.1:59550/ui-lab?scene=official-theme%2FFixture) et le bundle existant. Aucune publication ni Electron. **Doc updated.**
