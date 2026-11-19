# DS-ARCH-02 — Qualification et recette des décisions réutilisables

6 novembre 2026 — **En revue ; qualification technique acquise, acceptation humaine différée.** Cible application ; sources `83b2978`, base `32102be`, branche locale `codex/ds-arch-02-delivery`. [Mandat, allocations et historique](../../work-items/ds-arch-02-decision-tokens.md), [décision 030](../../decisions/030-reusable-decision-policy.md), [résultats structurés](qualification.json). Aucune publication.

Le porteur a approuvé la politique avec exceptions locales, demandé sa réalisation, puis sélectionné Très élevée et demandé la reprise. Le checkpoint précédent est historique. La configuration client n’a pas été vérifiée ou changée par l’agent. Les procédures applicatives plan-feature/propose-architecture, implement-feature/test-user-flow puis review-design, technical-review et security-review sont celles du catalogue qualifié à la base `32102be`. Rôles exercés successivement, **même agent, séquentiel, non indépendant**, sans sous-agent. Les observations ci-dessous concernent le diff désormais figé par `83b2978` et ses retests ciblés finaux.

## Résultat et périmètre

Les 463 identités initiales gardent leur type, unité et valeur résolue ; les bases primitives des réglages éditables restent identiques. Le référentiel atteint 596 tokens : 110 primitives, 149 décisions, 313 composants et 24 alias. Les décisions se répartissent en 29 sémantiques et 120 non sémantiques ; 53 sont éditables (29/24), 96 appartiennent à la composition en consultation. Les 188 réglages éditables possèdent une attribution initiale. Sur les composants DTCG, 303 atteignent une décision et dix gardent une référence directe justifiée : neuf échantillons de primitives, une position accessible hors écran.

Les 137 réglages scalaires auparavant autonomes rejoignent 24 conventions et 12 décisions représentant huit politiques sémantiques avec leurs états compatibles. Contrôles, conteneurs et retours gardent des politiques d’arrondi distinctes ; les familles contrôle/contenu ne sont pas fusionnées par leur valeur égale. Les états préparés restent distincts conformément au modèle v4. Les anciennes primitives sont conservées ; un rayon 1 rem indépendant de la taille de texte est ajouté. Les conventions de composition distinguent l’habillage de l’atelier et le produit. Les 28 recettes et leurs 32 sorties conservent leurs expressions ; seuls les paramètres de design rejoignent les décisions typées. Les coefficients mécaniques ne deviennent pas artificiellement une échelle.

La classification et le domaine sont explicites dans les métadonnées. Foundations → Decision Tokens expose Semantic Tokens et Non-semantic Tokens dans les deux hôtes. Le nouveau catalogue présente définitions, valeurs, chaînes de références et nombre de composants dépendants ; les neuf domaines non sémantiques sont réellement peuplés. Les identités et liens historiques sont conservés. Apparence permet une attribution explicite d’une convention compatible, puis les gestes local/partagé et Rétablir habituels. La création arbitraire d’une convention et l’édition visuelle des décisions de composition ne sont pas ajoutées.

Le manifeste passe de v28 à v29 ; modèle, snapshot et opérations restent v4. La politique initiale `decisionPolicyVersion: 1` refuse une référence directe injustifiée tout en conservant les exceptions choisies. Le migrateur hors ligne refuse la racine qui porte son outillage, tout état privé et toute copie déjà incomplète. Il prépare et valide les sources complètes, vérifie les ressources de polices et les préimages, puis publie avec marqueur durable. Une erreur conserve le marqueur et impose de repartir d’une copie propre ; aucun journal, verrou, compte ou reçu ancien n’est transformé ou retiré.

## Preuves exécutées

Mac arm64, Node 24.22.0, Chromium 156.0.8078.4 ; copies et ressources de test dédiées sous `.local/ds-arch-02/`. Les commandes npm ci-dessous partent de la racine du kit avec son runtime local. Les contrôles longs ont utilisé des copies gelées ; les corrections ultérieures ont reçu les retests indiqués. Aucun résultat ne qualifie une autre plateforme.

| Contrôle | Résultat constaté |
| --- | --- |
| `test:design-system` / validation et cas invalides | 113 tests réussis ; conservation des 463 valeurs et bases, typage, cycles, références et exceptions |
| `test` | 149 tests, 24 fichiers réussis |
| `test:design-editor:server` | 66 tests réussis : protections HTTP, writer, préimages, reçus, interruptions sur les neuf fichiers sources/dérivés modifiables |
| `test:design-agent` | 13 tests réussis ; assistance simulée, aucun appel fournisseur |
| `test:design-system:docs`, `docs:design-system:check` | Cinq tests et contrôle de péremption réussis ; documents dérivés régénérés |
| `typecheck`, `lint`, `test:boundaries` | Réussis ; dernière modification du migrateur relue et lintée séparément |
| `build`, `build-storybook` | Réussis ; avertissement de taille de bundle Storybook conservé, aucune erreur de compilation |
| `test:design-editor` | 34 parcours desktop/mobile réussis ; deux retests finaux du nouveau catalogue réussis |
| `test:storybook` | 18 parcours desktop/mobile réussis, dont index exact de la nouvelle rubrique et consultation sans writer |
| `test:design-editor:persistence` | 18 parcours réussis : sauvegarde/relecture d’une exception puis attribution explicite d’une convention, import de famille et refus significatifs |
| `test:design-editor:recovery` | Quatre scénarios navigateur réussis : refus et SIGKILL aux deux formats, récupération réelle et reçu durable rejoué |
| `test:design-editor:live` | Propagation effective atelier/application/Storybook, brouillon isolé, fichiers privés refusés et récupération réussis |
| `validate:agent-kit` | 21 skills, quatre rôles et références internes conformes ; contrôle structurel seulement |
| Diff et format des fichiers de code concernés | Conformes ; préexistants non suivis exclus, aucun secret/configuration locale sélectionné |

Les échecs intermédiaires restent dans les journaux locaux : états incompatibles de la première allocation, recommandations manquantes, assertions historiques devenues inadaptées ; corrections retestées. Lors du contrôle final, la restriction de ports a empêché le test de configuration locale et un test HTTP d’assistance ; leurs relances autorisées ont réussi (149/13). La première déclaration CSF du nouveau catalogue produisait un titre Storybook issu du fichier : titre/id/noms explicites corrigés et index réel retesté. L’ajout des références dans les lignes rendait un sélecteur de test ambigu : il cible maintenant la cellule d’identité exacte, sans diminuer l’assertion de couleur. Les essais d’extraction ont nécessité la génération initiale et le bon chemin du navigateur ; le dossier privé vide créé par la génération est distingué d’un transfert d’état privé. Aucun échec obligatoire non résolu.

### Conservation visuelle

[Comparaison complète](render-comparison.json) : **14 captures identiques octet pour octet, styles calculés et géométrie identiques**, à 1280 × 800 et 390 × 844. Référence canonique avant chantier, sept scénarios par format : défaut, hover, focus+hover, disabled+hover, loading+hover, erreur courte avec focus, erreur longue avec focus. Cette preuve concerne le kit canonique, pas une capture inventée de la recette personnelle.

[188 cellules raccordées](wiring.json) : chaque variable modifie la propriété calculée attendue ; isolement Field/SelectField et Notice/Panel, propagation partagée, masquage des exceptions et rétablissement vérifiés dans le navigateur. Les tests de politique vérifient aussi l’arrondi de contrôle modifié sans affecter le conteneur et le rétablissement vers la décision courante, base primitive inchangée.

Captures sélectionnées : [desktop avant](desktop-before.png), [desktop après](desktop-after.png), [mobile avant](mobile-before.png), [mobile après](mobile-after.png), [nouveau catalogue desktop](catalog-desktop.png), [nouveau catalogue mobile](catalog-mobile.png). Les tableaux conservent leur défilement horizontal ; les identifiants techniques et définitions rendent la lecture dense, à apprécier en recette humaine.

### Migration, polices et extraction

[Migration réelle](migration.json) : conversion complète d’une copie inactive des sources canoniques (463 valeurs), puis des sources enregistrées de DS-EDIT-75 et de leurs ressources de polices (470 valeurs), avec nouvel outillage. Les lectures de l’ancienne recette ont utilisé son propre protocole de lecture ; elle n’a jamais été écrite. Le writer rouvre la nouvelle copie personnalisée. Bases, attributions divergentes et ressources sont conservées ; aucun état privé n’est transféré. Cette copie de qualification est fictive et n’actualise aucune recette active.

Les quatre fichiers TTF réels déjà téléchargés et leurs licences ont été réutilisés : cmap français, intégrité, installation immuable, réutilisation hors connexion, sauvegarde DTCG et redémarrage réussis ; graisse incompatible et ressource corrompue refusées. Aucun nouveau téléchargement n’a été nécessaire.

[Extraction/renommage/déplacement](portable.json) : sources séparées du dépôt, dépendances physiques, chemin avec espaces, absence de Git et de compte/journal. Une copie personnalisée utilise Montserrat et un rayon local de 2 rem. Après déplacement et compilation, l’application et Storybook chargent la police locale, rendent 32 px de rayon et exposent le catalogue non sémantique. Réseau externe bloqué : zéro requête externe. Le dossier privé vide recréé par la génération n’est pas une copie de l’ancien état privé.

## Conclusions des revues successives

**Design Reviewer — satisfaisant avec réserves humaines.** Fidélité démontrée aux références canoniques avant chantier ; aucune référence Figma supplémentaire supposée. Navigation, définition des conventions, distinction consultation/édition, choix de portée et rétablissement couverts aux deux formats. Réserve : lisibilité des identifiants et défilement des tableaux, pertinence métier des regroupements et confort d’emploi à accepter par le designer ; aucune refonte visuelle proposée implicitement.

**Technical Reviewer / QA — satisfaisant.** Chemins examinés : DTCG → projections éditable/composition → variables CSS/catalogues ; sélection de convention → brouillon validé → opérations fermées → writer → relecture ; migration → préimages → candidat complet → publication protégée. Les anciennes sources sans politique restent lisibles pour migration, sans devenir conformes par simple chargement. Les décisions de composition ne deviennent pas éditables par cette projection. Retests finaux du classement Storybook, du refus des copies incomplètes et de la migration avec polices réussis. Aucune anomalie bloquante identifiée dans ce périmètre.

**Security Reviewer — satisfaisant dans le périmètre local.** Aucun nouvel endpoint, compte, accès distant, dépendance ou permission IA. Textes/identités du catalogue rendus comme texte React ; chemins et types contrôlés. Le migrateur accepte une destination explicite mais des fichiers de sortie fermés ; budgets de lecture, validation, refus des liens, préimages et marqueur de refus limitent la publication partielle. Le writer et les lecteurs coopératifs refusent une migration incomplète. Les tests négatifs HTTP et les reprises réelles restent conformes. Pas de garantie contre une modification externe hostile de la même copie, de panne physique, ni de certification exhaustive ; la copie doit être inactive. Anciennes recettes/comptes et protections conservés.

Les revues sont séquentielles et non indépendantes. Pas de nouvel audit de dépendances, qualification Docker/base de données, autre système ou transfert interhôtes : ces surfaces n’ont pas changé et ces contrôles ne sont pas revendiqués. La recette humaine et la reprise tierce P5-05/P5-08 restent distinctes ; J4/J5 et les modèles de suivi applicatifs restent inchangés.

## Recette humaine à regrouper

Sur une nouvelle copie dédiée, sans remplacer une recette existante :

1. Retrouver Semantic Tokens et Non-semantic Tokens aux mêmes endroits dans UI Lab et Storybook ; parcourir radius, type et space, lire définition/valeur/chaîne/usages.
2. Sur un contrôle, comparer la valeur initiale à la référence, choisir une convention compatible et constater le brouillon avant Enregistrer.
3. Créer une exception locale de rayon, modifier la décision partagée et vérifier les seuls usages annoncés ; constater l’exception conservée, puis Rétablir vers la décision courante et recharger après sauvegarde.
4. Vérifier que Panel garde son intention d’arrondi distincte ; essayer une famille du catalogue Google Fonts et ses graisses avec les portées locale/partagée.
5. Examiner le confort desktop/mobile, la navigation clavier et les tableaux ; faire reprendre la copie par un tiers à partir du [dossier de passation](../../handoff.md).

Retour attendu : résultat observé, version et réserves, sans convertir l’acceptation de l’orientation en acceptation automatique du rendu. Reprise : recette humaine sur demande, sans ouvrir un chantier supplémentaire ou publier.
