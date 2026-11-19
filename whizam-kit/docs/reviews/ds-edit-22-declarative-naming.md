# DS-EDIT-22 — Bilan de centralisation

31 octobre 2026 ; cible application ; base `9e57540`, branche `codex/ds-edit-22-declarative-naming`. Le diff de ce chantier et sa fiche identifient le candidat ; aucun changement préexistant suivi, copies non suivies préexistantes préservées.

## Résultat

`naming.yaml/tokenNaming` possède les structures des trois niveaux, familles exécutées par type/rôle, correspondances lexicales, préfixes de valeurs, limite de longueur et contextes exclus de l’identité. Les conventions générales et la langue restent dans ce même YAML. Le schéma fermé réexprime le contrat exécutable. `naming.ts` consomme la projection JSON versionnée ; il conserve les algorithmes de canonicalisation/encodage et de casse. Le contrat courant utilise aussi ce raccordement pour les tokens de composants ; le contrat historique conserve son implémentation datée.

La génération existante prépare la projection avant le chargement des contrats. La validation refuse sa péremption, y compris dans le service local. Le manifeste ajoute les deux nouvelles dépendances en lecture seule ; aucune source éditable supplémentaire, opération, permission, identité ou version de protocole modifiée. Le guide de sauvegarde conserve la séparation des anciennes racines et de leurs journaux. Aucun service humain actualisé ni donnée migrée.

## Preuves

Runtime existant réutilisé : Node 24.22.0 sous `.local/init-05/tools/`, npm compatible via with-runtime.sh ; aucune installation. Premier essai du wrapper avec Node système 24.13.1 refusé conformément au prérequis, puis runtime local compatible sélectionné par PATH du processus seulement.

- `npm run tokens:generate` : 24 alias, 17 styles sémantiques, 188 tokens de composants ; dérivés CSS/TS et documents générés sans diff suivi.
- `npm run test:design-system` : 74 tests réussis et quatre exemples invalides refusés. Dont quatre tests dédiés : schéma fermé/templates, doublons YAML, dérivé manquant/périmé sans écrasement lors du contrôle, consommation réelle de correspondances modifiées dans une copie isolée.
- Comparaison des fonctions de nommage à la base Git : 25 primitives, 17 styles et 188 tokens de composants identiques. Aucune autorité de valeurs, fiche ou référence modifiée.
- `npm run typecheck`, `npm run build`, `npm run docs:design-system:check` : réussis. Avertissements d’outillage hérités conservés dans les sorties locales ; aucune nouvelle dépendance.
- ESLint et Prettier ciblés : réussis. Projection JSON exclue du formatage général, vérifiée octet par octet contre la sérialisation YAML.
- `node --test tests/design-editor-http.test.mjs` : sept tests réussis, avec ports loopback autorisés après échec de la campagne sandboxée.
- Campagne disque/récupération : 72 tests réussis (sauvegarde, interruption à chaque remplacement, SIGKILL, refus de dépendances altérées et reprise). La campagne combinée conserve ses sept échecs HTTP `listen EPERM` du sandbox ; ces sept cas ont ensuite tous réussi avec loopback autorisé. Total distinct : 74 tests design system + 72 disque + 7 HTTP = 153.

Les sorties détaillées sont conservées dans `.local/ds-edit-22-{tests,types,build,server,http}.log`, fichiers ignorés de fabrication. Le premier passage serveur a refusé les fixtures dépourvues de projection ; le manifeste a été complété, puis la campagne relancée. Le refus réel de péremption après modification de la description YAML a été corrigé par régénération, sans assouplir le contrôle.

## Revues

Mode **séquentiel, même agent, non indépendant**.

- Technique : chemin YAML → schéma → projection → fonctions → contrats → génération examiné. Chargement documentaire rendu différé pour éviter de charger les anciennes règles avant la régénération. Critères d’identité, refus, sauvegarde et récupération démontrés ; conclusion satisfaisante.
- Sécurité (procédure applicative security-review à la base du chantier) : chemins constants, pas d’exécution des données YAML, schéma fermé, clés propres lors des recherches lexicales. Les deux nouveaux fichiers sont des dépendances protégées du manifeste, hors liste des huit sources écrites ; Host/Origin/capacité et refus HTTP couverts. Pas de nouvelle surface distante, secret ou accès. Conclusion satisfaisante sur ce périmètre, sans audit exhaustif.
- Design : revue visuelle supplémentaire non applicable, aucun composant, CSS, libellé d’interface, story ou valeur modifié ; les identités effectives sont conservées. Aucun nouveau parcours navigateur ni acceptation visuelle revendiqué.

Doc updated : autorité, guide de nommage, sauvegarde et suivi de fabrication. Risque résiduel : une future évolution des conventions peut imposer une migration d’identités, jamais autorisée par la seule régénération. Les familles conditionnelles du guide ne sont pas activées. Pas de push, publication ou déploiement. Prochaine action : clôturer les contrôles puis recette humaine différée, sans autre chantier.
