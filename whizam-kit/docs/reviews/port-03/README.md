# PORT-03 — Qualification du kit d’agents autonome

**24 octobre 2026 — En revue : qualification technique acquise, acceptation humaine différée.** Source immuable : **3e6ba795f862c84597c6f78a351987aa024b23a1**, base `710f5bba1861e0e4e5b20eaaa86f76f5ab1d6a79`. [Fiche et critères](../../work-items/port-03-autonomous-agent-kit.md), [périmètre livré](../../product/starter-kit.md), [matrice des assistants](../../compatibility.md).

## Résultat et version effectivement testée

Le kit contient AGENTS.md, quatre rôles, vingt skills, quarante liens d’exposition internes, CLAUDE.md, GEMINI.md, le mode Mistral documenté, les contrats, une matrice, des références de pratique locales et le validateur. Les sources canoniques sont dans le kit ; le lab les consomme par des liens, sans seconde bibliothèque. Les instructions de l’app n’imposent aucun chemin de poste, nom de dossier ou modèle du lab.

Le seul sous-arbre applicatif a été extrait par Git archive sous `initial/product`, sans .git, caches de code ni node_modules copiés. Les liens relatifs sont préservés ; **207 entrées source** du candidat, dont 40 liens d’adaptation, sont comparées par SHA-256 après chaque déplacement. Le plafond Git empêche la découverte du dépôt englobant. Le build Docker utilise seulement ce contexte sous `/workspace`, sans accès aux sources du lab.

Les tests ont commencé sur l’arbre Git immuable `3da0c3088aed971d9b2f48a6042ab15fc9fc184d`, puis son sous-arbre app `39ce6ea491dca463dfea954321e710493d1293b4` a été vérifié identique à celui du commit source ci-dessus avant la recette de déplacement. Les ajouts documentaires de ce dossier suivent cette campagne ; ils ne constituent pas une nouvelle exécution ni une modification du code qualifié.

## Contrôles exécutés

[Quinze commandes](gates.json) réussies depuis l’export : installation npm ci hors ligne, validation du kit, types, lint, formatage, autorités YAML, unitaires, frontières serveur, intégration PostgreSQL, installation du navigateur verrouillé, E2E UI Lab et projets, builds web/Storybook, E2E Storybook. **82 tests : 38 unitaires, 14 PostgreSQL, 12 UI Lab, 10 projets et 8 Storybook.** Les quatre nouveaux tests vérifient l’exécution du validateur après déplacement depuis un autre cwd et les refus de référence sortante, lien sortant et adaptation pointant vers un autre skill.

Le validateur charge YAML depuis le package du kit et refuse les références hors racine. Les chemins de pratique du catalogue pointent vers des documents locaux ; la synthèse conserve leur provenance et leurs limites sans imposer les archives du lab. Les liens Markdown des sources extraites ont été contrôlés : 103 cibles locales, toutes internes et existantes. Contrôle documentaire final après mise à jour : 60 fichiers Markdown, 253 liens locaux et leurs ancres, dont 123 liens dans l’app restant tous internes ; aucune cible manquante ou sortante. Les deux AGENTS gardent leurs missions distinctes et les archives restent inchangées.

La validation quick_validate a réussi pour les six skills dont les références de périmètre ont été adaptées. Les deux premiers interpréteurs Python consultés ne disposaient pas de PyYAML ; le contrôle a ensuite utilisé le venv local déjà installé, sans installation ni réglage global. Aucun échec applicatif ni modification de dépendance pour résoudre ce prérequis d’outillage.

Après déplacement avec espaces, validation du kit, types, lint, formatage, builds web/Storybook, tests Storybook et unitaires ont été rejoués avec succès. Le [serveur de développement](development.json) répond sur health et UI Lab ; Chromium actionne le switch et le dialogue, sans erreur console ni exception. Le seul groupe de processus créé pour cet essai est arrêté.

Environnement : macOS arm64, Node 24.22.0/npm 11.8.0 locaux préexistants, Docker 29.8.2/Compose 5.5.1, Linux arm64 dans les conteneurs, Chromium 156.0.8078.4. Seuls les caches de téléchargement npm et Chromium sont réutilisés ; aucune installation node_modules/build n’est copiée. Les commandes applicatives ne nécessitent ni compte IA ni clé de modèle.

## Données, renommage, déplacement et installation indépendante

[Trace des commandes et comparaisons](portability.json) :

1. Depuis l’export, setup crée une configuration privée 0600 et une identité neuve. Compose démarre le site et PostgreSQL. Le navigateur crée « Projet fictif PORT-03 », recharge son détail et vérifie la description. Avec les deux seeds, la base contient trois lignes. Migrations et seed rejoués ne changent pas le contenu.
2. Le contrôleur lit les lignes complètes, UUID et dates compris, avec `select coalesce(json_agg(row_to_json(p) order by p.id), '[]'::json) from public.projects p;`. Il conserve leur empreinte dans la preuve, pas les secrets de configuration.
3. Arrêt par `docker compose --env-file .env.local down`, sans suppression de volume. Renommage vers `initial/renamed product` : configuration privée inchangée, setup sans écrasement, relance Compose. Même identité, même volume, trois lignes exactement identiques, même URL de détail et liens du kit valides.
4. Même procédure vers `moved area/delivered product` : toutes les comparaisons réussissent encore. Les 207 entrées source restent identiques, les quarante liens restent internes et aucun Git parent n’est découvert. [Capture du détail déplacé](moved-project.png), inspectée pendant la revue.
5. Une autre extraction du commit, installée séparément, reçoit une configuration et un volume distincts. Elle contient deux seeds seulement, sans le projet de la première. Sa bibliothèque est validée ; la première base est relue et reste exactement inchangée.

Les deux installations possèdent une identité vérifiée avant chaque nettoyage. Leurs seuls conteneurs, réseaux, volumes et images locales sont retirés après contrôle des labels. Les **40 conteneurs préexistants** conservent identifiants, dates de démarrage et état actif/arrêté ; aucune configuration d’un autre projet n’est utilisée. Les ressources temporaires des tests PostgreSQL/E2E sont nettoyées par leurs runners propriétaires.

## Rapports des rôles

**Mode commun : séquentiel, même agent, non indépendant.** Aucun sous-agent, nouvel appel fournisseur ou contexte de revue indépendant activé. Les conclusions portent sur le candidat identifié et les contrôles ci-dessus.

| Rôle | Observations et conclusion |
|---|---|
| Builder | Intégration réalisée, références corrigées, contrôles locaux et parcours exécutés, état et preuves maintenus. **Satisfaisant** pour le mandat local ; ne clôt pas l’acceptation du produit. |
| Technical Reviewer / QA | CLI indépendante du cwd et de la racine du lab, refus d’évasion et d’alias divergent testés. Une source par rôle/skill, liens internes après déplacement, dépendances du validateur locales. Les suites web/DB et builds passent ; conservation exacte des données démontrée. **Satisfaisant**, avec limites natives/humaines ci-dessous. |
| Security Reviewer | Aucun secret ajouté ; fichier privé 0600 et configuration préservée, labels contrôlés avant nettoyage. Les tests négatifs refusent références et liens sortants. L’image runtime testée en lecture seule et sans réseau tourne sous UID 1000, sans fichier privé, Git, instructions/skills ni outillage de développement. Aucun élargissement de permissions ou accès fournisseur. **Satisfaisant** pour l’intégration locale, sans certification ni nouvel audit de dépendances. |
| Design Reviewer | Modules app/src, autorités et rendu métier identiques au socle ; suites mobile/desktop et Storybook réussies. Le détail après déplacement affiche correctement le projet et sa description ; interactions de développement vérifiées. **Satisfaisant sur la non-régression**, sans nouvelle direction visuelle ni validation humaine du design. |

Les [contrôles de préservation](preservation.json) prouvent aussi : lockfile, modules web, migrations, Compose et Dockerfile inchangés ; 39 fichiers non suivis initiaux et deux archives conservés par empreintes ; vingt liens du lab résolus vers la bibliothèque unique. Les scripts du kit et les tests ajoutés sont les seules évolutions exécutables de cette tranche. Les instructions sont exclues du contexte de build du site et de son image runtime, tout en restant livrées dans les sources.

## Qualification et réserves

Autonomie des fichiers et contrôles du kit, extraction, renommage/déplacement et conservation des données : **réussis techniquement** sur cette source. Le périmètre d’intégration PORT-03 est qualifié ; J4/J5 restent En revue avec leurs critères propres ouverts.

La découverte native Codex et les essais de modèle Claude/Gemini/Mistral ne sont pas nouvellement vérifiés. La lecture des skills et l’exercice des rôles dans ce fil ne prouvent pas la découverte native des quatre outils. Les conventions d’adaptation et essais antérieurs gardent leurs dates et limites dans la matrice ; REC-10 reste ouvert. Aucun contournement de la restriction SQLite historique, installation globale, nouvel achat ou compte ajouté.

La recette visuelle/fonctionnelle humaine et la reprise réelle par un tiers restent requises. Windows, x64, autres navigateurs et déplacement inter-hôtes/moteurs non éprouvés ; changer de moteur exige sauvegarde/restauration, car les volumes ne sont pas dans les sources. Réserve Drizzle/esbuild d’outillage antérieure conservée ; aucune nouvelle dépendance ou promesse de production.

**Doc updated.** Prochaine action : recette humaine du candidat et essais natifs complémentaires avec les accès autorisés. Aucune publication, Actions, hébergement ou déploiement exécuté.
