# Socle commun — contrats et coordination locale

Le [périmètre Loomata](../product/loomata-workspace.md) définit les comportements. Ce document décrit leur noyau local ; les interfaces complètes Pages, User Flow et Planification sont raccordées dans leurs tranches respectives. Le même port `scripts/core/local-service.mjs` est utilisé par le dossier autonome et le contenant macOS. Il reste réservé aux appelants locaux de confiance, sans shell exposé aux pages ou aux réponses de Codex.

## Identités et inventaire

`src/core/workspace-contract.ts` valide les documents v1 et leurs références typées. UUID minuscules, indépendants des libellés et des chemins. Définitions, variantes et occurrences sont distinctes ; une occurrence rattache une page à une définition et à une variante compatible. Demande, tâche, modification, commit et chantier ont des identités distinctes et des relations multiples. Les descriptions de parcours conservent conditions et retours ; une preuve dépend de sa révision.

`workspace-inventory.ts` rapproche exactement les identifiants canoniques DTCG et les définitions de composants reconnues, dans l’espace d’identité du projet. Il ne copie aucune valeur de token. Un propriétaire de recette CSS n’est pas automatiquement une définition de composant. Les pages/occurrences et leurs fichiers sont déclarés explicitement ; l’exploration de leur composition réelle relève de T1. Le modèle ne prétend pas déduire toutes les règles métier depuis du code libre.

`files` décrit les sources connues d’un élément. Un changement hors de cette couverture est signalé partiel et ne permet pas une intégration automatique. Une modification invalide conservativement les preuves des parcours et modifications affectables. Le renommage conserve les identités et clés de conversation. Les schémas n’autorisent pas une opération par leur seule validité structurelle.

## Conservation et Git

Git est nécessaire à la coordination Loomata, pas au fonctionnement du starter web extrait sans agent. `workspace.bootstrap` initialise exclusivement un projet créé par Loomata, sans dépôt préexistant, depuis la sélection publique du kit. Il refuse une configuration ne protégeant pas l’état privé. Un projet ayant déjà Git passe par `workspace.initialize`, sans absorber ses modifications ni son index existants.

- `loomata/workspace.json` : inventaire, intention adoptée, relations et décisions partageables ; validé avant écriture.
- `loomata/checkpoints/<id>.json` : modifications regroupées au commit, liens de tâches/chantiers et révision contrôlée. Le SHA réel est retrouvé dans l’historique Git du fichier ; aucune auto-référence de commit.
- `loomata/integrations/<treeId>.json` : décision d’intégration et mode choisi, enregistrés par un commit de traçabilité distinct.
- `.runtime.local/workspace/` : états opérationnels, reçus, préimages, journaux et worktrees privés. Ces données ne sont pas des sources exportables.
- `.runtime.local/agent-chat/` de l’installation : authentification et conversations complètes privées. Elles ne sont pas recopiées dans les projets ou preuves.

`workspace.reconstruct` retrouve modèle et liens de commits depuis un clone, sans base ni index antérieurs ; il ne restaure pas un brouillon non commité ni des conversations privées. Les textes de décisions doivent être sélectionnés comme partageables : aucun expurgateur automatique ne garantit qu’un texte libre est public. Les anciens projets ne sont jamais migrés ni remis à zéro implicitement.

## Brouillon, préconditions et récupération

Un brouillon instantané non commité par projet ; des chantiers isolés peuvent coexister. Chaque arbre possède branche, racine physique et version identifiées. Après commit, ce brouillon est fermé aux nouvelles écritures ; un nouveau brouillon peut être ouvert. Une intégration n’est pas déduite d’un commit.

L’opération commune contient identité, origine, portée, révision attendue, préimages et proposition. Le moteur valide chemins, références et contenu avant publication. Le même identifiant rend le reçu existant ; son réemploi avec un autre contenu est refusé. La révision commune est calculée par le moteur. Appliqué, en vérification et contrôles réussis sont distincts ; un contrôle périmé ou des octets modifiés ne permettent pas un commit/intégration sous l’ancienne preuve. Une projection devenue incertaine ne conserve pas un statut vérifié.

Le journal est synchronisé avant toute publication. Après interruption, seules des préimages/postimages reconnues peuvent être rapprochées ; un contenu concurrent inconnu reste conservé avec le journal. L’annulation d’un changement non commité est une nouvelle opération sur sa dernière révision ; elle ne peut écraser une évolution ultérieure. Un propriétaire vivant ou un verrou ambigu n’est pas supprimé. La récupération d’un propriétaire mort vérifie son identité et celle de la racine.

Le dernier changement design conserve les préimages nécessaires à son annulation. Pour ses prédécesseurs, le journal conserve les chemins et les empreintes SHA-256 des postimages. Les contrôles et la reprise Git relisent toujours les fichiers concernés et vérifient ces empreintes. Les anciens reçus complets sont lus et normalisés par le même schéma ; le changement courant conserve son format d’origine.

Le journal Git conserve l’intention avant staging, commit ou intégration. La reprise vérifie parents, marqueur d’opération, portée et octets ; elle ne remet pas l’index ou les fichiers à zéro. Les hooks du dépôt ne sont pas désactivés. La fusion est conservatrice : une base ayant évolué demande un rapprochement explicite. Les impacts fonctionnels reconnus sont signalés même lorsque les changements de code sont distincts ; une fusion textuelle n’est pas une preuve de compatibilité.

## Writer DS

L’ordre de verrouillage est coordination commune puis writer spécialisé. Ce dernier conserve manifeste fermé, vérifications, publication des dérivés, reçus et récupération propres. Le noyau n’écrit pas directement des tokens pour imiter ce writer. Le manifeste courant v36 inclut la coordination, les pages et le chemin d’import Figma par composants ; les anciens reçus ne sont pas convertis.

L’inspecteur d’un worktree Loomata emprunte le writer déjà propriétaire du service et utilise une révision combinant DS et projet. Une proposition ancienne est donc refusée même si seul un autre fichier du projet a changé. La version principale d’un projet coordonné reste consultative. Les installations sans état Loomata conservent le writer existant.

L’adaptateur de tokens v4 couvre les réglages déterministes `set-component-token`, `update-shared` et `restore`. Leur annulation rétablit les références/réglages et conserve les primitives devenues inutilisées. Le protocole interne v5 coordonne les recettes de variantes et leur affectation. Les opérations non préparées restent explicitement refusées et rejoignent une réalisation planifiée ; l’import de police reste planifié dans un projet coordonné.

FIGMA-IMPORT-02 ajoute le protocole interne v6 et `saveImport`, sans exposer de sauvegarde générique de code. Il compile une famille React déclarative validée et ne publie que `tokens.tokens.json`, `app/loomata-imports.json` et `app/loomata-imports.css`, puis les dérivés normaux. Le journal commun relie cette sauvegarde à l’enregistrement des composants/variantes/pages/occurrences ; après interruption, le reçu est retrouvé avant tout rejeu. L’inverse d’import rétablit le registre et les entités antérieurs, avec révision exacte ; aucun état ultérieur n’est effacé. Une proposition privée non acceptée ne modifie pas les usages.

Les sources Figma et rendus sont conservés dans un cache privé borné, distinct des 8 Mio du workspace. Le registre intégré public conserve identités fichier/nœud/version, empreintes, valeurs de référence et dépendances nécessaires au rendu. Les valeurs effectives utilisées par les consommateurs restent d’autorité DTCG. Les versions identiques sont réutilisées ; les versions différentes nécessaires aux anciens usages sont conservées. Les redirections de définition et substitutions par variante/occurrence sont validées contre le contrat fonctionnel fermé. Le fichier et l’empreinte de source sont revérifiés avant acceptation.

L’API `project/figma` garde l’origine/capacité de l’éditeur et des commandes fermées de consultation, proposition, ajustement borné, annulation, acceptation, affectation de variante et planification d’une adaptation. Cette dernière conserve une demande et son contexte source partageable, sans lancer le fournisseur. Les sources externes restent des données sans autorité sur les permissions. Couverture, budgets, gardes et réserves sont dans le [bilan](../reviews/figma-import-02/README.md), selon la [décision 034](../decisions/034-figma-component-import.md).

## Conversations, aperçus et intégration

Une clé projet/élément retrouve une conversation contextualisée après renommage et réouverture. Les conversations générales sont librement créées. Chaque envoi transporte l’identité, la portée et la version actuelle comme données sans autorité sur les permissions. Le fournisseur officiel conserve son confinement ; les accords restent bornés, expirables et non rejouables. Une écriture autorisée passe par le moteur commun, sur le seul arbre sélectionné. La version principale permet l’explication, pas une écriture instantanée.

`workspace.preview` résout une seule racine/révision. Le port de démarrage utilise cette racine et prépare ses dépendances privées si nécessaire. Le contenant macOS réinterroge ce port au retour du chat vers les outils. Les autres arbres ne sont pas assemblés dans l’aperçu ; leurs services éventuels restent conservés pour éviter une perte de brouillon. La rubrique de qualification du chat montre sélection, couverture et état des contrôles ; elle ne constitue pas les interfaces métier T1–T3.

Les serveurs Vite de l’application et de Storybook limitent la lecture à la racine physique sélectionnée. Les règles privées et les exclusions de surveillance sont calculées sous cette racine : un ancêtre privé ne masque pas les sources du brouillon, mais ses propres fichiers privés, `.git`, `.env` et certificats restent refusés. Aucun dossier frère ni état privé de la racine principale n’est ajouté à la liste autorisée.

Les attestations de contrôle et d’accord du port sont réservées à un appelant local de confiance. Elles ne sont jamais acceptées depuis une réponse du modèle. L’intégration exige une preuve courante : automatique pour non critique sans effet visible, humaine pour le visible, ou E2E explicitement choisi et réussi. Le critique reste humain. Une couverture partielle exige un examen humain. Une décision est versionnée ; aucun de ces mécanismes n’autorise une publication.

## Surcharges de l’inspecteur par contexte

Une définition peut déclarer des placements dans `component.placements`. Chaque entrée associe un UUID stable à une définition du même projet. La racine rendue du placement porte cet UUID dans `data-loomata-placement`. Une racine de définition se rattache à son `sourceKey` avec `data-loomata-definition` ou les marqueurs du design system. Les pages conservent leurs occurrences et leur parenté `data-loomata-node`. Deux placements du même composant reçoivent deux UUID distincts dans la définition qui les contient. Sur une page, le chemin part de l’occurrence propre à cette page et suit les placements successifs. Un placement peut cibler la même définition que sa parente. La vérification suit le chemin explicite et borné, avec contrôle de l’ascendance et de l’unicité du rendu.

La sauvegarde locale valide le projet, le brouillon courant, sa révision et la destination dans l’inventaire. Une valeur de définition est écrite par le writer DTCG. Un token préparé conserve son identité. Un réglage supplémentaire crée un token de composant et sa référence à une primitive typée. Pour les composés, la liaison de rendu assemble les références, unités et séparateurs prévus par le registre. Le journal coordonne la publication DTCG et le retrait des anciennes déclarations de définition du fichier des styles contextuels. La reprise revalide ses préimages, et l’annulation restaure la version antérieure.

Les placements et instances persistent dans `app/loomata-context-styles.json` via le writer journalisé de l’espace commun. Pour une même propriété et un même état, le rendu applique successivement la définition, les placements de composition et l’instance de page. Les valeurs, états, conditions et propriétés admis sont bornés. Les sélecteurs sont construits à partir des marqueurs vérifiés. Un rattachement absent ou ambigu permet une projection temporaire. Seuls les rattachements valides admettent une sauvegarde.

Les projets sans surcharges et les anciens reçus restent lisibles. La création de variantes explicites conserve son writer. Les marqueurs de placement désignent une position durable dans une définition et restent réutilisables dans les rendus de cette définition. La modification d’une source d’un projet doit conserver ces marqueurs ou rétablir la correspondance avant toute nouvelle retouche.

## Contrôles

`npm run test:workspace` couvre journaux, reprise après SIGKILL, isolation, révisions, annulation, décisions, reconstruction, writer DS et conversations sur données synthétiques. `npm run test:workspace:ui` contrôle le HTTP réel et le parcours desktop avec fournisseur simulé. `npm run test:workspace:live` utilise explicitement le compte dédié réel de Loomata, avec historique de test isolé et projet jetable ; il ne copie aucun identifiant. Les résultats de fabrication restent dans le suivi du projet qui réalise la qualification, pas dans les modèles de roadmap livrés.

L’[exploration des pages enregistrées](page-exploration.md) ajoute chemins concrets, marqueurs d’occurrence et hiérarchie locale au modèle version 1, sans convertir les anciens modèles ni leurs reçus.


Le rendu de référence Figma utilise SVG avec texte converti en tracés, affiché exclusivement comme image isolée ; scripts, entités, foreignObject et références externes sont refusés. Les requêtes de sélection sont regroupées brièvement et les réponses périmées ignorées. Le cache SVG est séparé des anciens rendus PNG. Cette référence reste distincte du code du composant importé ; les images matricielles intégrées au SVG ne gagnent pas de résolution.
