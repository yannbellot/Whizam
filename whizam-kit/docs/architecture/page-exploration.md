# Exploration des pages enregistrées

MVP-01-T1, première étape. Le [modèle commun](workspace-contract.md) conserve les identités ; le DOM n’est qu’une observation du rendu. Cette capacité ne constitue pas encore l’édition de variantes, le micro-chat ou la réconciliation Figma.

## Convention prise en charge

Une entité `page` peut porter un `path` concret local (`/`, `/projects/new`, par exemple). Les paramètres de route, requêtes, fragments, chemins privés, chemins de fichiers et routes de l’atelier ne sont pas des destinations prises en charge. Les pages historiques sans chemin restent conservées et non explorables par cette vue.

Une occurrence enregistrée peut porter un `marker` UUID. Sa racine DOM porte `data-loomata-node="<marker>"`. Le couple page/marker désigne l’identité d’occurrence ; un même formulaire partagé peut donc porter le même marqueur dans deux pages, avec deux identités d’occurrence distinctes. Le marqueur et l’identité restent stables lors d’un renommage ou d’un déplacement dans le DOM. Les occurrences imbriquées peuvent porter un `parentId` dans la même page ; cycles et relations entre pages sont refusés.

Le registre appartient aux entités du workspace, mises à jour par le moteur commun avec leurs sources. Il n’existe pas de seconde liste d’identités dans le navigateur. L’enregistrement est pour l’instant une opération de l’appelant local de confiance ; sa création depuis Codex reste à raccorder dans T1. Une page non enregistrée ou un JSX non instrumenté ne deviennent pas automatiquement explorables. Aucun parseur universel ou instrumenteur de React n’est revendiqué.

## Correspondance et couverture

Une occurrence est présente si son marqueur apparaît exactement une fois dans le rendu de sa page. Zéro correspondance : absente ; plusieurs : ambiguë ; absence de marqueur dans le modèle : non reliée. Les occurrences indisponibles ne sont pas sélectionnables. Un marqueur inconnu est compté comme lacune, jamais converti en identité ou utilisé comme sélecteur fourni au serveur.

La révision d’un rapport doit être celle du modèle. Une liste de marqueurs et un identifiant de définition ne constituent pas une autorisation d’écriture. La couverture « éléments enregistrés retrouvés » ne garantit pas l’exhaustivité des éléments de la page, des données dynamiques ni des comportements métier. Les constructions répétées demandent des marqueurs explicitement distincts ; aucun index DOM ne remplace cette identité.

## Frontières

`project/exploration` est un POST de lecture à corps vide sous la frontière HTTP existante de l’éditeur : origine, hôte, capacité et limites conservés. Il ne reçoit aucun chemin, commande Git ou attestation. Le service retrouve la racine de coordination depuis sa propre racine physique validée et retourne uniquement le modèle public et des indicateurs de contexte, jamais ses chemins privés. La racine principale reste consultative. Le port de confiance n’est pas exposé au navigateur.

La vue Pages charge le vrai chemin de page sur le service courant, sans bootstrap de writer dans l’iframe. Elle ne transmet aucune capacité à cette page. Elle lit les marqueurs, associe les clics à une occurrence enregistrée et intercepte les clics/soumissions pendant cette sélection. Elle n’est pas un confinement de code hostile : comme le reste de Loomata, ouvrir un projet implique faire confiance à son code de développement. Une navigation vers une autre page ou une autre origine ne valide pas la sélection courante ; les erreurs restent explicites.

## Vérifications

`npm run test:exploration` contrôle la projection physique et les refus HTTP. `npm run test:exploration:ui` crée deux vraies pages React Router avec Button partagé dans un projet jetable ; teste sélection visuelle/arbre, action suspendue, ambiguïté et desktop. Les tests unitaires vérifient identités, révisions, chemins et parents. Ces preuves initiales ne qualifient pas à elles seules T1-01 à T1-12.


## Variantes et sources déclarées — T1

`authority/variants.yaml` porte des recettes UUID propres à un composant, avec des liaisons vers les styles sémantiques du DTCG. Le writer spécialisé contrôle compatibilité et propriétaire, puis publie YAML et CSS dérivé dans son journal existant. Le modèle commun relie l'identité de variante à la définition et l'affecte à une seule occurrence. Les attributs `data-loomata-variant` sont appliqués à partir du modèle public, uniquement si le marqueur est unique dans la page. La révision publique du document permet à l'atelier de refuser un rendu périmé ; elle ne fournit aucune capacité d'écriture.

Le réglage global conserve l'opération sur le token de composant. Une recette peut conserver une attribution particulière. La création locale et son affectation partagent une action récupérable, avec inverse ; réutilisation et retrait d'une affectation sont des changements de métadonnées annulables. Une recette nouvelle annulée peut rester définie mais inutilisée. Les changements inconnus de sources ou une révision concurrente du writer empêchent leur absorption par l'annulation.

Codex peut proposer `app/loomata-interface.json` après la création d'une route/composition. Format : `{schemaVersion:1, entities:[...]}` avec seulement les formes page/component/occurrence du contrat commun. L'écriture et l'enregistrement sont soumis au même accord et à la même révision que les autres propositions. Le modèle commun conserve les identités et le suivi ; le fichier est une déclaration de sources contrôlée, jamais un état d'intégration ou une preuve. Les identités existantes doivent rester stables. Aucun mécanisme universel d'analyse de React n'est revendiqué.

## Conversations et demandes

Le micro-chat et Agents IA utilisent le gestionnaire Codex privé existant. La passerelle de l'atelier accepte une liste fermée de commandes ; la racine et l'arbre sont dérivés du serveur et vérifiés par le daemon. La capacité atelier ne donne accès à aucune commande Git ni attestation. Le contexte général reste distinct de la clé projet/élément ; renommages et réouvertures ne changent pas cette clé.

Les demandes conservées, tâches et chantiers sont les entités du modèle commun. Conserver et qualifier ne lancent aucune inférence. Le bouton de démarrage promeut explicitement l'arbre isolé affiché en chantier ; aucune copie divergente de suivi n'est créée. La version principale reste conservée. Cette interface transitoire dans Agents IA précède la Planification de T3.

## Figma direct et limites

Le formulaire utilise un jeton personnel `file_content:read`, conservé exclusivement sous `.runtime.local/figma/` dans le projet commun ; il n'est jamais inclus dans le modèle partageable. Une connexion ne copie ni le compte du connecteur de fabrication ni celui d'un autre projet. L'API est un GET HTTPS à hôte fixe, sans redirection, limité à une sélection, une profondeur et un budget. Toute erreur ou interruption avant validation conserve l'import précédent.

Les entités `figmaReference`, `figmaMapping` et `decision` conservent provenance, version, nœuds observés, correspondances multiples, décision et raison. Le snapshot Figma sert de référence, sans devenir l'autorité des valeurs produit. L'effet déterministe initial est une couleur unie vers un token de composant choisi. Adopter et combiner utilisent le writer et le journal commun avec leurs traces ; conserver et reporter ne changent pas les valeurs. Les besoins structurels restent des demandes explicites à Codex. Un réimport identique n'écrit rien ; un renommage conserve l'identité source ; une sélection incomplète n'efface jamais une correspondance.

Couverture : structure bornée, composants/propriétés, dimensions et mode de layout, alias de variables, références d'images, réactions observées. Les définitions complètes de variables, images binaires et comportements de prototype ne sont pas importés. Ces limites restent visibles dans le produit et ne qualifient pas une prise en charge universelle. L'essai réel du pilote depuis le produit reste distinct des fixtures et de l'accès du connecteur.


## Occurrences et imports Figma — FIGMA-IMPORT-02

La projection publique de chaque page connue contient aussi l'identité d'occurrence. `bindInterface` applique `data-loomata-occurrence` et la variante uniquement à une racine rendue unique pour son marqueur, puis restaure ses attributs possédés à la sortie. Deux pages partageant un marqueur gardent des identités d'occurrence distinctes. Les substitutions locales de composants importés utilisent cette identité et le marqueur ; elles ne s'appliquent pas à une racine ambiguë ou non reliée.

Les composants et ensembles importés sont enregistrés comme définitions et variantes distinctes. Un écran préparé avec une destination explicite devient une page `/imported/<identity>` dans la route générique installée avec le kit ; aucune règle métier n'est déduite. L'absence de cette route demande une adaptation planifiée. Les composants réels sont inspectables dans l'atelier, et les limites de représentation restent explicites. Voir le [contrat commun](workspace-contract.md#writer-ds) et la [couverture qualifiée](../reviews/figma-import-02/README.md).
