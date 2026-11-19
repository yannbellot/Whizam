# DS-EDIT-23 — Portée explicite, intention assistée et recette

31 octobre 2026 — cible application. **En revue : qualification technique acquise, acceptation humaine différée.** [Mandat et reprise](../work-items/ds-edit-23-explicit-style-intent.md), [décision 023](../decisions/023-explicit-style-intent.md), [parcours autonome](../design-system/editor-assistance.md).

**Correction de recette ultérieure :** [retour visible et réponse aux précisions Codex](ds-edit-23-clarification-feedback.md), recette corrigée **54124**. Les preuves et la livraison 54123 ci-dessous restent datées ; son brouillon humain est conservé dans l’ancienne instance.

## Version et résultat

Base de reprise `1aba376d8d7ef78d0d78db154a94953cd4b4121b`, branche `codex/explicit-style-intent`. Le [manifeste de 53 fichiers code/tests/schémas/procédures](ds-edit-23/candidate-source.json) identifie le candidat, y compris le retrait de SemanticStyles ; SHA256 `0dbe58c2a7453db7a269ba558d3761c32c5d73792e99db94aac0fa3ed5ffbc25`, [somme](ds-edit-23/candidate-source.sha256). Documents et captures n’altèrent pas cette identité ; l’historique Git porte les commits intégrés.

Node local existant 24.22.0, npm existant dans son environnement ; aucune installation, dépendance, préférence globale ou fournisseur supplémentaire. Les copies et journaux sont sous `.local/ds-edit-23/`, ignorés. Pas de modification des valeurs YAML du kit ; la recette reprend ses propres valeurs enregistrées.

- Question de portée déterministe, trois choix sous le réglage sémantique ; édition directe sur primitive. L’attribution conservée pour rétablir n’est pas confondue avec la référence effective.
- Usages regroupés par composant, liens de prévisualisation et retour au geste ; valeurs particulières et limites d’inventaire explicites. Pas de décompte d’exemplaires DOM promis.
- Description d’une intention, appel explicite à Codex, proposition ou clarification, application explicite puis Enregistrer. Réutilisation recherchée ; équivalent de valeur différente sans propagation silencieuse.
- Transaction commune modèle + catalogue, opération fermée `define-and-assign`, neuf sources modifiables, écriture v4 et interprétation v1. Modèle v4 / enveloppe snapshot v3 conservés ; anciens domaines, définitions, catégories et taxonomie immuables à la relecture.
- Un token de composant par réglage, identité stable ; primitives dédupliquées par famille/type/valeur. Styles, formulaires manuels, sélections de catalogue et leurs raccordements UI retirés. Les opérations pures de création nécessaires aux plans et leurs contrôles restent disponibles au moteur.

## Contrôles exécutés

[Résumé structuré](ds-edit-23/qualification.json), [qualité finale](ds-edit-23/quality.json). Commandes depuis les copies isolées, avec runtime local existant et autorisation des seuls ports loopback nécessaires. Pour récupération/Playwright, cache de navigateurs existant fourni par `PLAYWRIGHT_BROWSERS_PATH`, sans téléchargement.

| Contrôle | Résultat et portée |
| --- | --- |
| `npm test` | **116 réussis**, 17 fichiers : question avec/sans IA, absence d’inférence déterministe, gestes concurrents, annulation, invalidité, péremption, ajouts bornés et refus de modification structurelle. Les tests du formulaire manuel supprimé sont remplacés par ceux du parcours explicite ; leur retrait n’est pas un succès de fonctionnalité conservée. |
| `npm run test:design-system` | **74 réussis** : modèle, migrations, références, contrats et nommage ; aussi réussis dans l’extraction renommée. |
| `npm run test:design-editor:server` et retests ciblés Node | **84 scénarios distincts qualifiés entre campagnes** : 36 hors boucle de remplacement, 48 frontières (trois phases × seize sources/dérivés). La boucle finale crée réellement une intention, donc modifie aussi le catalogue. Deux cas SIGKILL réels rejoués avec nouvelle intention et vérification du catalogue/token/attribution ; reçus rejoués une seule fois. Quatre retests spécifiques catalogue/SIGKILL conformes. |
| `npm run test:design-agent` | **12 réussis**, transport synthétique identifié : isolation/confinement, gardes HTTP, description, sortie non fiable, catégorie inconnue, fraîcheur et absence d’écriture après analyse. |
| `npm run test:design-system:docs` | **5 réussis** : génération, données adversariales et relecture documentaire. |
| `npm run test:design-editor:dev` | **42 réussis, 2 exclusions statiques**, desktop/mobile. Six retests finaux des choix/intention conformes, puis deux captures de question avant réponse conformes. Le scénario de proposition simulée est distinct des preuves Codex réelles ci-dessous. |
| `npm run test:design-editor` | **40 scénarios conformes entre campagne et retest, 4 exclusions de développement**. Première campagne : 38 réussites et deux attentes de message statique à adapter à la nouvelle priorité de question. Retest sérialisé : six réussites, dont les deux cas corrigés, sans ajout de service IA en statique. |
| `npm run test:design-editor:persistence` | **12 réussis**, desktop/mobile : local/rétablissement/partage, catalogue + nouveau token, conflits, réponse perdue/reçu, identité stable et padding autonome. Nouvelle intention simulée seulement pour la sortie modèle ; écritures, catalogue et relectures réels. [Application compilée relue aux deux formats](ds-edit-23/compiled-reload.json). |
| `npm run test:design-editor:recovery` | **4 réussites réelles**, refus après remplacement durable et SIGKILL, aux deux largeurs. Ni route de sauvegarde ni réponse HTTP interceptée ; journaux réellement repris, reçu rejoué et seconde reprise idempotente. [Rapport](ds-edit-23/recovery.json). Ces quatre parcours utilisent le réglage local ; la nouvelle intention sous SIGKILL est contrôlée séparément côté store. |
| `npm run test:design-editor:live` | **Réussi** : brouillon isolé, sauvegarde depuis le manager, actualisation de l’application active, refus des fichiers privés, interruption bloquant la publication et reprise automatique desktop/mobile. [Rapport](ds-edit-23/live.json). |
| Types, lint, formatage, documentation, kit | `typecheck`, `lint`, `format:check`, `docs:design-system:check`, `validate:agent-kit` conformes sur la version finale. Le kit contient 21 skills / 4 rôles. Avertissement lint d’une copie suffixée préexistante distinct des sources sélectionnées. |
| Builds | Application et Storybook réussis. Avertissements Router/chunks habituels ; aucune mise à jour implicite. |
| Extraction renommée | Sources sans état privé, déplacées dans un dossier avec espaces, dépendances locales raccordées explicitement : génération, 74 contrats et validateur du kit conformes. Vrai `account/read` confiné : [connected=false](ds-edit-23/extraction-account.json), aucune inférence. Pas de preuve de machine vierge ou d’un second utilisateur. |

### Échecs et corrections conservés

Les journaux privés gardent les refus de ports du sandbox, relancés avec loopback autorisé ; deux chemins de lancement de logs et un chemin d’import de harnais ont été corrigés avant les contrôles concernés. La copie de preuve réelle nécessitait aussi la génération préalable de ses dérivés.

Le premier panneau navigateur échouait sur l’import React nécessaire au bundle manager ; correction puis retest et campagne complète conformes. Le catalogue ajouté ne changeait pas dans l’ancienne boucle d’interruption : trois indices attendaient un remplacement inexistant ; la transaction de cette boucle définit maintenant réellement une intention, et ses 48 frontières passent.

Une première réponse réelle de Codex omettait un exemple d’usage et a été refusée, sans écriture. Le schéma structuré impose désormais les bornes d’exemples/synonymes ; la validation hôte reste stricte. Une couleur courte reçue directement par le service nécessitait normalisation avant comparaison du plan : cas corrigé et suite d’assistance conforme.

Un essai de lecture de reçus avec un ancien manifeste a confirmé le refus de récupération. Cette compatibilité supplémentaire a été abandonnée : aucune garde du journal n’est assouplie. Les anciennes racines et leurs reçus restent attachés à leur version ; la recette nouvelle n’en importe aucun.

Une campagne dev et une statique partageaient le répertoire d’artefacts et ont produit deux erreurs de trace ; retest des six parcours en série conforme. Le premier lancement de récupération cherchait un navigateur en cache global absent ; relance avec le cache local existant, sans installation. Les contrôles finaux de formatage passent après mise en forme des tests affectés. Le contrôle live a aussi révélé que sa copie de test était sous `.runtime.local`, chemin volontairement interdit par Vite, et que des dépendances raccordées par lien restaient hors de sa racine. Le harnais utilise maintenant une copie physique des dépendances existantes et un répertoire synthétique ignoré sous `test-results`, sans modifier les protections Vite ; son choix local est explicite avant sauvegarde. Retest live réussi. Ces diagnostics ne sont pas masqués par les retests.

## Preuves avec le vrai Codex

Un premier appel a identifié une intention existante de fusion : création du style manquant pour ce sens, application sur copie, sauvegarde et relecture réussies. Le second cas qualifié a proposé une intention nouvelle d’oscillation de séries de mesures, indépendante du composant et distincte d’une stabilité ou incertitude. [Proposition et catalogue persisté](ds-edit-23/real-new-intention.json).

Un parcours navigateur complet a ensuite réussi sans interception : description → vrai Codex → proposition → **Appliquer cette intention** → **Enregistrer** → rechargement, couleur relue `rgb(35, 69, 103)`. [Résultat](ds-edit-23/real-browser.json), [proposition réelle](ds-edit-23/real-proposal.png), [relecture après sauvegarde](ds-edit-23/real-saved.png). Les valeurs et intentions de ces essais sont synthétiques et restent dans leurs copies isolées.

Le harnais de ces preuves utilise le transport du compte déjà connecté de la même installation de recette ; son répertoire d’agent est injecté uniquement dans le bootstrap de test. Aucun identifiant n’est copié, aucune protection retirée et cette adaptation n’est pas livrée. La nouvelle recette normale calcule son état privé depuis sa propre racine et reste déconnectée. Ces preuves ne qualifient pas une seconde personne ou toutes les interprétations possibles.

## Revues

Mode : **séquentiel, même agent, non indépendant**. Les procédures/critères applicatifs et ceux du lab ont été consultés ; les textes candidats ne constituent pas une nouvelle autorité de fabrication.

- **Design Reviewer — satisfaisant avec réserve de recette humaine.** Référence : demande et fiche, sans maquette Figma nouvelle. Question sous le réglage et trois actions vérifiées au clavier ; usages accessibles et retour au geste ; champs/erreurs/attente/conservation contrôlés. Captures finales inspectées : [question desktop](ds-edit-23/question-desktop.png), [question mobile](ds-edit-23/question-mobile.png). Espacement des actions et focus des liens/textarea raccordés aux règles du panneau. Les captures de preuve Codex documentent le fonctionnement, pas une comparaison visuelle entre versions. Aucune acceptation visuelle ou recherche utilisateur déduite.
- **Technical Reviewer / QA — satisfaisant.** Chemin suivi : valeur normalisée → portée effective → choix/description → proposition bornée → `projectTransaction` commun au manager/preview/service → writer → catalogue et dérivés → relecture. Vérifications des refus structurels, identités, annulation, fraîcheur, conflits et interruption ; nouvelle intention après SIGKILL contrôlée. Modèle initial de recette strictement identique et dépendances vérifiées. Les anciennes requêtes v3 et racines ne sont pas mélangées à la nouvelle version.
- **Security Reviewer — satisfaisant pour l’exposition locale.** Catégories, taxonomie, règles et domaines restent fixes ; identités/valeurs/rôles contrôlés côté hôte. Description et sorties rendues comme texte ; aucune capacité, authentification ou chemin d’écriture transmis au modèle. Gardes Host/Origin/capacité, limite d’entrée, quotas/délai et confinement existants conservés et testés. La liste fermée du writer est étendue au seul catalogue ; aucune compatibilité de journal permissive ajoutée. Pas d’audit exhaustif, certification ou déploiement déduit.
- **Instruction Reviewer du lab — satisfaisant avec réserve comportementale.** `lab-maintain-agent-kit`, puis `lab-evaluate-instructions`, candidat limité aux six paragraphes de guidage directement obsolètes. Critères préalables : portée explicite, modèle optionnel, références autonomes, absence de permission supplémentaire et respect du rôle de revue. Scénarios relus : édition sans IA ; intention avec compte propre ; catalogue malveillant demandant de retirer une protection ; extraction sans parent ; reviewer invité à corriger hors mandat. Le texte conserve ces limites et pointe vers le guide courant. Validateur structurel/extraction et liens conformes ; découverte native après modification et comportement d’une nouvelle session non vérifiés.

## Recette locale et reprise

[Recette DS-EDIT-23](http://127.0.0.1:54123/?path=/story/components-button--default&addonPanel=adl/design-editor/panel), ouverte dans un nouvel onglet Safari et observée chargée, **sans brouillon**, avec `#b51a00`. [Préservation des données](ds-edit-23/recipe-preservation.json) : 188 tokens et modèle enregistré strictement identiques à l’ancienne recette ; [164 dépendances contrôlées](ds-edit-23/recipe-code.json), registre de composants identique sémantiquement malgré une différence de guillemets héritée.

L’ancienne recette **54118** reste active avec ses sources, journaux, reçus et connexion ; le brouillon `#2563eb` y a été observé avant l’ouverture de la nouvelle, sans abandon ni sauvegarde imposés. La racine nouvelle reprend uniquement les sources enregistrées, sans état privé ni journal transféré. Elle demande sa propre connexion pour interpréter une intention ; les trois choix déterministes restent utilisables sans IA.

Pour voir la question sur le fond du bouton enregistré, rétablir sa référence de base **dans le brouillon**, puis changer sa couleur : le réglage `#b51a00` est initialement particulier et ne doit donc pas demander de portée sémantique à chaque retouche. Aucune sauvegarde de recette n’est effectuée pour cette démonstration.

**Doc updated.** Aucun push, Actions, déploiement ou publication. Modèles applicatifs et G/J5 inchangés ; 85 préexistants préservés. Risques résiduels : compatibilité macOS/CLI effectivement utilisé, disponibilité/quota du compte, équivalences de sens non démontrables par la seule détection lexicale, corpus borné à 32 Kio et inventaire des usages préparés. Reprise : recette humaine du nouveau parcours et connexion propre à cette nouvelle installation si nécessaire ; aucun autre chantier implicite.
