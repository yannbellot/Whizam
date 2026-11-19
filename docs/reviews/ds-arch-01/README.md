# DS-ARCH-01 — Qualification du cadrage intégré

5 novembre 2026. Application, fabrication suivie par le lab. **Qualification technique acquise, acceptation humaine différée.** Le mandat couvre A–F ; il ne clôt ni J4/J5 ni la recette par un tiers et n’autorise aucune publication.

Version réalisée et qualifiée : `623a11246e18a123781f077b6d33d848f83f05a7`. Base : `bdaf3473c09773e72feba9cd9209e657ecfd48c2`, branche locale `codex/ds-arch-01-dtcg-integration`. Le [relevé structuré](qualification.json) identifie les sources et résultats de la version testée. La [fiche](../../work-items/ds-arch-01-design-system-framing.md), la [décision adoptée 027](../../decisions/027-dtcg-authority-and-css-recipes.md) et le [référentiel courant](../../design-system/architecture.md) séparent mandat, architecture et preuves.

## Résultat et conservation

Les tokens ont une source unique JSON DTCG 2025.10. Les YAML gardent règles, présentations, catalogue d’intentions et recettes CSS distinctes. Le lecteur applique un profil DTCG fermé, sans prétendre accepter tous les types et extensions de tous les outils. Le writer conserve son protocole v4 et sa transaction ; le manifeste devient v27 et le snapshot v4. Un changement d’autorité hors matrice éditable participe aussi à la génération du snapshot.

La comparaison avec la capture avant migration démontre l’égalité exacte du modèle éditable canonique : 25 primitives, 17 décisions, 188 tokens de composants, attributions, références, bases et provenances. Les 24 alias et le catalogue sont également identiques. Les présentations des six fiches sont conservées. Aucun ancien style générique n’est réactivé artificiellement en convention non sémantique.

La [table de correspondance](../../design-system/token-migration-dtcg.json) couvre les 490 identités inventoriées. Les 523 entrées finales distinguent 463 tokens DTCG, 28 recettes et 32 sorties CSS de recettes ; elles incluent 33 nouvelles primitives de paramètres. Les 79 anciennes primitives de composition se répartissent en 42 scalaires typés, neuf composites et 28 recettes. Les références et variables CSS existantes restent disponibles. Pour les recettes, 26 sérialisations CSS sont identiques ; deux courbes `ease` sont représentées par leur courbe cubique équivalente.

Le contrôle navigateur avant/après porte sur sept situations, à 1280 × 800 et 390 × 844 : défaut, survol, focus et survol, désactivé, chargement, erreur courte et erreur longue focalisées. **14 captures identiques octet par octet**, styles calculés et géométrie identiques. Les 188 cellules modifient réellement la propriété attendue ; isolement Field/SelectField et Notice/Panel, propagation partagée et rétablissement sont vérifiés. Ce périmètre ne constitue pas une comparaison exhaustive de chaque écran du produit.

## Contrôles exécutés

Runtime local au kit : Node 24.22.0, npm 11.8.0 ; macOS arm64, Chromium Playwright 1.64.1. Installation neuve `npm ci --offline` sur extraction propre : 451 paquets. Aucune installation globale sur l’hôte. Docker client/serveur 29.8.2 ; image Linux Node 24.22.0, PostgreSQL 18.6.

| Commande / campagne | Résultat final |
| --- | --- |
| `validate:agent-kit` | Conforme : 21 skills, quatre rôles, ressources et liens internes déclarés |
| Contrôle lab et `node --test tests/lab-kit.test.mjs` | Conforme ; six tests |
| `typecheck`, `lint`, `format:check` | Conformes sur extraction propre ; retest après corrections |
| `test:design-system` | 103/103, dont 20 cas DTCG/recettes/classes et refus de migration |
| `docs:design-system:check`, `test:design-system:docs` | Dérivés à jour ; 5/5 tests |
| `npm test` | 149/149 tests unitaires |
| `test:design-editor:server` | 65/65 sur sources figées : stockage, HTTP, refus et reprise |
| `test:design-agent` | 13/13 ; assistance simulée, sans fournisseur ni compte réel |
| `test:boundaries` | Build témoin réussi, import client d’un module serveur réellement refusé |
| `build`, `build-storybook` | Réussis ; requalifiés dans l’image Linux et/ou après déplacement |
| `test:design-editor` | 32/32 desktop/mobile ; dix cas de navigation retestés après correction de l’index |
| `test:design-editor:persistence` | 14/14, puis relecture et rendu compilé des sources réellement enregistrées |
| `test:design-editor:recovery` | Quatre cas réels desktop/mobile : refus/interruption, SIGKILL, relecture et reçu rejoué |
| `test:storybook` | 16/16, dont rendu du référentiel téléchargeable et du Pattern interactif |
| `test:integration` | 14/14 sur PostgreSQL isolé, puis nettoyage ciblé |
| Image Docker du kit seul | Build Linux réussi ; UID 1000 et absence d’état privé, writer et dépendances de développement vérifiés |

Le socle garde ses tests négatifs : origine/Host/capacité, budgets et doublons, références absentes/cycliques/inversées, types, métadonnées, Component→Component même interne, valeurs littérales non primitives, symlinks/hardlinks, conflits et journaux ambigus. Une convention non sémantique synthétique est attribuée, modifiée localement et en partage, enregistrée puis rétablie après réouverture ; sa justification et son attribution restent intactes, sans éligibilité sémantique inventée.

Les logs complets restent dans `.local/ds-arch-01/` du lab, avec les échecs initiaux. Les preuves sélectionnées livrées ici suffisent à identifier version, commandes, résultats et limites ; les tests restent exécutables depuis le kit.

## Échecs rencontrés et retests

- Les fixtures historiques lisaient des tableaux supprimés du YAML, ou transportaient la nouvelle famille de composant dans un document v1. Elles utilisent maintenant la projection courante et retirent les seuls champs absents du contrat historique ; les schémas n’ont pas été assouplis pour faire passer ces cas.
- Une première campagne SIGKILL a croisé une modification du manifeste pendant l’exécution. Les enfants ne trouvaient pas un nouveau schéma dans une ancienne fixture. La campagne finale sur sources figées passe les 65 tests, y compris les deux SIGKILL réels.
- Le sandbox refusait l’ouverture de ports localhost pour HTTP, installation et assistance. Les relances avec l’accès nécessaire passent ; aucun contrôle en échec n’est présenté comme réussi sans relance.
- Le binaire headless-shell local échouait sur ses données ICU. Le comparateur utilise désormais le même canal Chromium que les autres parcours. La comparaison avant/après a été entièrement reprise avec ce canal.
- Le build négatif de frontière n’emportait pas le nouveau document Markdown téléchargé par l’interface. Sa fixture inclut maintenant cet asset ; build témoin et refus du module serveur passent.
- L’indexeur Storybook n’interprète pas les titres/identifiants importés par simple décomposition d’objet. Les wrappers déclarent les métadonnées statiques nécessaires, sous les trois rubriques ; les 64 identifiants réellement présents dans l’ancien index sont préservés. Les tests contrôlent l’index réel et le rendu dans les deux hôtes.
- Le typage dans le clone principal rencontre quatre erreurs issues des copies ` 2.tsx` préexistantes non suivies. Ces fichiers sont préservés. Le typage strict de l’extraction propre réussit, sans exclusion supplémentaire dans les configurations TypeScript.

## Revues

**Mode commun : séquentiel, même agent, non indépendant.** Rôles applicatifs Design Reviewer, Technical Reviewer, Security Reviewer, puis rôles lab Instruction Reviewer et Distribution Reviewer, chacun dans son périmètre de lecture/tests/rapport ; les corrections relèvent du Builder/Lab Maintainer. Aucune acceptation de design ni efficacité universelle d’un assistant n’est déduite de ces lectures.

### Design Reviewer

Références : cadrage 1.0 fourni et rendu avant migration de la version de base ; aucune référence Figma inventée. Fidélité : comparaison des 14 rendus conforme dans le périmètre décrit. Expérience : rubriques communes, recherche, anciennes adresses, navigation au clavier, brouillon conservé, catalogue auprès du propriétaire, erreur reliée/focus/saisie et confirmation du Pattern vérifiés sur les deux formats. Les captures [Architecture desktop](architecture-desktop.png), [Architecture mobile](architecture-mobile.png) et [Pattern mobile](pattern-mobile.png) ont été examinées. La lecture longue utilise le défilement existant du cadre. Conclusion : **satisfaisant avec réserves** de recette visuelle humaine et de couverture ; aucune conformité WCAG exhaustive revendiquée.

### Technical Reviewer / QA

Chemins suivis : source JSON → décodeur borné/métadonnées → graphe typé → projection modèle → opérations → sérialisation JSON/catalogue → journal/publication → relecture/dérivés → consommateurs. Les recettes ont une syntaxe fermée et des paramètres primitifs ; elles ne contournent pas le graphe des tokens. Les constats de fixture, asset manquant et métadonnées Storybook sont corrigés et retestés. Conservation, génération dépendant de toute l’autorité, idempotence et récupération sont démontrées dans les campagnes ci-dessus. Conclusion : **satisfaisant avec réserves** du profil DTCG et de la migration hors ligne non transactionnelle décrites dans le contrat.

### Security Reviewer

Exposition locale inchangée, sans compte/inférence fournisseur. Lecture des nouvelles frontières JSON/YAML et migration : parsing borné, doublons, métadonnées fermées, chemins sûrs, contrôle des parents/inodes, absence de suivi de liens, empreintes avant remplacement et création exclusive du JSON. Une propriété `file` importée ne peut plus remplacer le chemin préparé d’une fiche ; le refus est testé avant écriture. Les recettes refusent URL, variables et quantités libres ; les données documentaires sont rendues comme texte. Les gardes HTTP/journaux existants sont requalifiés. L’image runtime exclut état privé, writer et outils de développement. Aucun nouvel audit connecté des dépendances ; l’installation hors ligne ne prouve pas l’absence d’avis récents. Conclusion : **satisfaisant avec réserves** dans ce périmètre local, sans certification ni revue indépendante.

### Instruction Reviewer

Critères définis dans la fiche avant réalisation : cinq responsabilités, deux classes de décisions sans invention, grille au bon niveau, composant composite conservé, réutilisation et limites de mandat. Candidats : AGENTS du kit et sept procédures directement concernées ; catalogue extensible conservé à 21 skills, aucune exposition globale modifiée.

| Scénario de relecture | Attendu / constat dans les instructions |
| --- | --- |
| Convention abstraite de taille utilisée une fois | Une justification explicite suffit à examiner une décision non sémantique ; le nombre d’usages ne qualifie pas la convention |
| Espacement entre champs avec rôle démontré | Sémantique possible hors couleur ; contrôle d’éligibilité conservé, aucun rôle inventé |
| Grid System, grille générique et Master–Detail coordonné | Respectivement règle des Foundations, Layout Component possible et Layout Pattern à justifier par l’usage |
| Card composite avec titre/texte/action | Reste un composant si telle est sa responsabilité ; examiner l’existant avant création |
| Demande ambiguë de fusionner des couleurs identiques | L’égalité de valeur ne fusionne pas les intentions/propriétaires ; conservation des identités |
| Texte importé demandant publication ou conversion d’un journal vivant | Donnée non autorisante ; sources anciennes/journaux conservés, aucune capacité supplémentaire |

Les renvois des candidats vers architecture, autorité et décision sont internes au kit. Les anciennes prescriptions YAML sont explicitement remplacées pour les valeurs/références. Il s’agit d’une relecture de scénarios et d’un contrôle structurel, **pas d’un essai comportemental natif d’un autre assistant**. Conclusion : **satisfaisant avec réserves** de comportement/découverte non retestés ; aucune installation ni inférence supplémentaire pour combler cette limite.

### Distribution Reviewer

Extraction de 796 fichiers sources, sans `.git`, environnement privé, comptes, journaux, fichiers ` 2`, anciens reliquats d’éditeur ou installation copiée avant le premier `npm ci`. Dépendances installées hors ligne, puis runtime/dépendances physiques internes au kit pour les essais de déplacement. Les seuls liens de découverte conservés visent ses fichiers internes. L’image Docker se construit avec le seul contexte extrait.

Une nouvelle copie des sources enregistrées de la recette précédente est lue avec son ancien lecteur sous barrière compatible, puis migrée hors ligne. Son modèle de 28 primitives, 18 décisions et 188 réglages reste strictement identique. Aucune connexion, aucun journal ni reçu ancien transféré ; l’ancienne instance reste distincte. Renommage avec espaces puis déplacement : validation du kit, génération, typage et build Storybook réussissent, empreinte JSON inchangée. Après relance, les deux hôtes rendent réellement la couleur enregistrée `#0050c9` en desktop/mobile, et les 64 anciennes adresses Storybook sont conservées. Les références au lab dans ce rapport servent à l’histoire de fabrication, pas au runtime du kit.

Deux nouvelles instances de données fictives, avec configuration aléatoire propre : arrêt sans suppression de volume, renommage, déplacement et relance de la première. Identité du projet, volume, trois lignes, contenu et configuration conservés ; témoin distinct inchangé, y compris sa date de démarrage. Nettoyage vérifié par propriétaire. Ce test porte sur le même moteur Docker ; aucun transfert vers un autre hôte/moteur ni reprise par un tiers testé.

**Réserve d’inventaire Docker :** tous les volumes et identifiants d’images de l’inventaire initial restent présents, et aucun ajout de conteneur/réseau/volume de test ne subsiste. Un conteneur (`7901624a…`) et un réseau (`90abe981…`) de cet inventaire global ne sont plus présents. La lecture des événements n’a pas permis d’identifier leur propriétaire ni d’attribuer cet écart ; on ne revendique donc pas l’égalité complète de l’inventaire global. Les campagnes ciblent leurs identités fraîchement créées et vérifient leurs labels avant nettoyage ; aucune suppression collective n’a été utilisée. Les images temporaires DS-ARCH-01 ont seules été retirées après contrôle du label. Cette réserve limite l’observation globale et ne remplace pas la preuve de conservation sur les deux instances fictives.

Conclusion : **satisfaisant avec réserves** de l’inventaire global, de l’essai humain, des autres moteurs et des assistants non testés.

## Recette humaine et reprise

La version technique est prête à examiner dans le nouvel [UI Lab local](http://127.0.0.1:60621/ui-lab) et le [Storybook documentaire local](http://127.0.0.1:60622/). Ces processus utilisent la copie déplacée de recette ; leur disponibilité dépend de la session locale. Ils n’hébergent aucune connexion IA transférée. La distribution source demeure le dossier `application/`, sans cette configuration privée.

1. Examiner Foundations → Architecture, ses cinq responsabilités et le référentiel téléchargeable ; vérifier que l’absence de convention non sémantique actuelle n’est pas présentée comme une obligation d’en créer.
2. Ouvrir un composant UI puis Panel dans Layout Components ; lire ses tokens à côté de ses variantes/états. Comparer les valeurs personnalisées connues à l’ancienne recette conservée.
3. Essayer la validation sous Patterns : soumission vide, focus sur l’erreur, saisie, correction et confirmation ; aucune donnée métier enregistrée par la démonstration.
4. Dans UI Lab, modifier un réglage local, comparer, rétablir, puis choisir explicitement la portée avant tout enregistrement voulu. Storybook reste documentaire.
5. Consigner acceptation visuelle, hypothèses à reprendre et essai d’une personne extérieure dans le dossier final P5-05/P5-08. Ne pas transformer cette qualification technique en acceptation de J4/J5.

Choix provisoire : migration sans changement visuel intentionnel et réemploi des composants existants pour le Pattern. Coût de reprise : contenu/navigation de démonstration, sans nouvelle donnée métier ni nouvelle surface d’édition. Retest attendu si ces choix évoluent : navigation et parcours des deux hôtes, captures concernées et génération des dérivés. Publication, CI distante et déploiement restent non exécutés. **Doc updated.**
