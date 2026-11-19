# WYSIWYG-01 — Qualification React Grab (preuve Q historique)

**État courant :** Q a été suivie de C/D. Voir la [réalisation et ses preuves](runtime.md). Les constats « non réalisé » et « aucun paquet ajouté » ci-dessous décrivent uniquement la version Q.

**16 novembre 2026 — Q : En revue, qualification technique acquise dans la couverture ci-dessous ; acceptation humaine différée. C1–D non réalisés.** Base `ce8943612f2b48fe0246b897d4330945f6b5d383`, branche `codex/wysiwyg-01-implementation`. Cible application. [Fiche](../../work-items/wysiwyg-01-visual-inspector.md), [architecture](../../architecture/visual-inspector.md), [recommandations UI](../wysiwyg-01-grapesjs-ui/README.md).

## Mandat et surfaces modifiées

Réalisation autorisée : Q puis C/D, sans publication. Catalogue app consulté ; implement-feature, test-user-flow et update-project-docs sélectionnés aux sources de départ. Pas de sous-agent. Préflight : main sans changement suivi, 86 chemins non suivis préexistants exclus. Aucune modification du package.json/lockfile de l’application ni de ses données/recettes. Un script de qualification versionné, deux preuves JSON et le présent bilan ; fiche et suivi racine actualisés.

Le candidat est téléchargé et installé **uniquement** dans `.runtime.local/wysiwyg-qualification/`, ignoré. Scripts npm désactivés, aucun audit réseau ou CLI React Grab exécuté. La sonde utilise React 19.2.8 déjà installé dans l’app ; le React 19.3.1 résolu automatiquement comme peer dans l’installation jetable n’est ni exécuté par cette sonde ni transféré à l’application.

## Distribution réellement examinée

Paquet officiel [react-grab@0.2.0](https://registry.npmjs.org/react-grab/0.2.0). Archive de 322 062 octets, 1 037 504 octets décompressés et 34 fichiers. Intégrité SHA-512 vérifiée par le script, conservée dans [le résultat](react-grab-qualification.json). La présence de signatures dans les métadonnées npm ne signifie pas que leurs signatures ont été cryptographiquement vérifiées ici ; le contrôle réalisé porte sur l’empreinte de l’archive.

Différence avec l’étude Git : ce paquet déclare **bippy ^0.6.1 et @react-grab/cli 0.2.0**, et non les versions du HEAD étudié. Résolution jetable : bippy 0.6.1, CLI 0.2.0 ; 33 paquets avec versions/intégrités dans [l’inventaire](react-grab-dependencies.json). Aucune dépendance ajoutée au lockfile de Loomata.

Licence MIT lue dans l’archive ; les chunks utilisés comportent également les avis MIT bippy. Manifestes et présence des fichiers de licence relevés sur les 33 paquets ; mentions déclarées MIT/ISC. Le manifeste du CLI omet license, mais son fichier LICENSE est MIT et a été lu, ainsi que celui de bippy. Cela ne constitue pas un audit juridique exhaustif de chaque portion de code transitive. Lors de l’intégration, conserver les avis distribués et figer les versions effectivement adoptées ; ne pas extrapoler la résolution isolée à un futur lockfile applicatif.

## Commandes reproductibles

Depuis la racine application, avec son runtime local compatible :

```sh
mkdir -p .runtime.local/wysiwyg-qualification
sh scripts/with-runtime.sh npm pack react-grab@0.2.0 --ignore-scripts --pack-destination .runtime.local/wysiwyg-qualification --cache .runtime.local/npm-cache
tar -xzf .runtime.local/wysiwyg-qualification/react-grab-0.2.0.tgz -C .runtime.local/wysiwyg-qualification
sh scripts/with-runtime.sh npm install --prefix .runtime.local/wysiwyg-qualification/install --save-exact react-grab@0.2.0 --ignore-scripts --no-audit --no-fund --cache .runtime.local/npm-cache
LOOMATA_SDK=/Library/Developer/CommandLineTools/SDKs/MacOSX26.5.sdk sh scripts/with-runtime.sh node scripts/qualify-react-grab.mjs
```

Le SDK explicite est le choix **local de cette campagne**, pas un prérequis universel ni une modification de sélection système. Sans override, le script utilise le SDK rapporté par xcrun. Il requiert les navigateurs Playwright locaux et l’outillage Swift/macOS pour son sous-essai WKWebView. Node 24.22.0, React 19.2.8, Playwright 1.64.1, esbuild 0.28.2. Ressources serveur sur port loopback éphémère, profils navigateurs jetables ; fenêtres WKWebView de sonde seules, arrêtées à la fin. Aucun serveur produit laissé actif.

## Résultats réellement obtenus

| Moteur | React production | React développement | Résultat |
| --- | --- | --- | --- |
| Chromium complet, profil headless jetable | Réussi | Réussi | Cible et pile retrouvées dans l’iframe ; géométrie ; compteur React continue |
| WebKit Playwright | Réussi | Réussi | Même scénario ; moteur distinct de WKWebView |
| AppKit/WKWebView réel, harness dédié | Réussi | Réussi | Même import et sonde, compteur continu et cible retrouvée ; pas d’interactions physiques |

Trois imports publics testés : `getElementAtPoint`, `getElementsAtPoint`, `getElementBounds`. Depuis la fenêtre parent, la sonde retrouve le bouton React de l’iframe same-origin en (100,90), largeur 180 et hauteur 50. Un filtre par identité DOM de fixture exclut les autres éléments. React continue à incrémenter son compteur ; aucune fonction freeze/openFile/contexte/clipboard appelée.

Sur les quatre parcours Playwright : aucune erreur page ni requête externe observée ; corps parent limité à iframe/script, aucune feuille de style injectée ni élément data-react-grab. WKWebView retourne aussi ces observations DOM ; son harness n’enregistre pas toutes les requêtes sortantes comme Playwright. Ne pas transformer ce résultat borné en garantie universelle d’absence d’effets.

Bundle minifié **de la sonde avec ses trois imports** : 27 756 octets, **10 337 octets gzip**. Ce nombre inclut le code de sonde et exclut React chargé séparément ; ce n’est ni le poids de tout React Grab ni le coût mesuré dans un build Loomata. L’élimination des exports inutilisés évite l’interface complète dans cet essai. Les fonctions testées sont de bons candidats au réemploi ; aucune réimplémentation du hit-test justifiée par cette campagne.

## Échecs et diagnostics conservés

1. Lecture npm sans accès réseau : ENOTFOUND. Lecture et téléchargement réussis après exécution avec accès réseau autorisé ; aucun refus d’approbation contourné.
2. Serveur loopback refusé dans le sandbox : EPERM. Qualification relancée avec autorisation d’exécution locale ; aucune exposition réseau externe.
3. Chromium headless shell du cache existant : arrêts GPU, message ICU. Chromium **complet du même cache** utilisé ensuite par le canal chromium, sans modifier les fichiers existants ni installer un navigateur global.
4. SDK par défaut 27.0 incompatible avec swiftc 6.3.3 : compilation refusée. SDK 26.5 déjà présent fourni par variable locale à la commande ; compilation et WKWebView réussis. Aucun xcode-select ou réglage global modifié.

Les sorties brutes datées et les états intermédiaires restent sous `.runtime.local/wysiwyg-qualification/`, dont qualification-first.json et qualification-sdk-failed.json ; la preuve JSON sélectionnée ne contient que le dernier essai réussi. Les échecs précédents ne sont pas effacés du bilan.

## Limites et revues de Q

Cette sonde n’est **pas** l’inspecteur Loomata : pas de sélection utilisateur complète, survol, scroll/zoom, CSSOM arbitraire, Shadow DOM/cross-origin, historique, lot, admission ou application agentique. Aucun test T1/DS global, build produit, Storybook, lecteur d’écran, capture UI ou fournisseur réel. Ces preuves restent à produire en C/D. La qualification ne migre pas les projets existants et ne publie rien.

Relecture technique Q séquentielle, même agent, non indépendante : script, exactitude des assertions, archive et limites inspectés ; six parcours réussis. Relecture sécurité documentaire Q : téléchargement officiel sans scripts, empreinte, licences, imports fermés et absence d’écriture de sources par la sonde ; aucune certification de la dépendance. Revue design d’une UI non créée : non applicable à Q, réservée à C3/D. ESLint et Prettier ciblés conformes ; 23 liens locaux du bilan et de la fiche résolus ; preuve JSON relue (six cas passed) ; git diff --check conforme ; sept fichiers du chantier sélectionnés exclusivement, 86 chemins non suivis préexistants conservés hors sélection. Doc updated.

## Difficulté confirmée et point de reprise

L’inspection effective de `scripts/agent-chat/manager.mjs` révèle une contrainte plus forte que le simple ajout d’une commande :

- `newConversation` appelle ensure, exige un compte puis exécute thread/start avant de créer la ligne durable (lignes 386–425 à la base) ; il ne peut pas recevoir un lot hors connexion sans démarrer le fournisseur.
- Le chargeur d’historique exige nativeId et accountRef, refuse les champs inconnus de conversation (lignes 65–119). Une conversation hors fournisseur ne peut donc pas être ajoutée silencieusement dans ce format.
- `send` corrèle compte, contexte d’arbre, requestId, historique et persistance avant turn/start (lignes 432–520). Le nouveau reçu doit rester dédupliqué après réponse perdue/crash, sans reproduire un envoi ou attacher un lot périmé à une autre version.

L’architecture impose pourtant une réception durable **sans connexion ni lancement**, puis une action explicite d’application. Il faut examiner ensemble le stockage de demande privée, le rattachement différé à la conversation native, la vérification des révisions à chaque transition et les limites de reprise. Réutiliser text comme contournement ou desserrer le validateur compromettrait les critères. L’alternative « demande reçue avant conversation native » est une piste à qualifier, pas une architecture adoptée par cette note.

Ce couplage de cycle fournisseur, format durable et reprise sans double action justifie **GPT-6.1 Sol · Très élevée pour C1 et son raccordement**, sans demander Max/Astra/Ultra. Ce n’est pas une hausse provoquée par les échecs ordinaires d’outillage, résolus en Q. Conformément à AGENTS, arrêt **avant** la modification de cette partie, point de reprise conservé et sélection manuelle/reprise explicite nécessaires. Aucun réglage client modifié ou prétendu connu. C1–D restent non réalisés ; pas de qualification du parcours complet ni clôture de mandat.

Reprise précise : relire manager.open/newConversation/send, private.writeJSON, context-control et workspaceContext ; choisir le rattachement différé compatible, fermer les tests négatifs de réception/reprise, puis reprendre C2/C3/D en conservant les sections fixes sans accordéons et les règles 038. L’absence de nouvelle donnée utilisateur ne justifie aucun autre arbitrage produit à ce stade.
