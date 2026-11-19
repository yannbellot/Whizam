# MVP-01 — Revue du périmètre et de la séquence documentaire

**12 novembre 2026.** Base `f9825de`, branche `codex/loomata-mvp-scope`. [Préparation](../work-items/mvp-01-three-stage-development.md), [décision 033](../decisions/033-loomata-mvp-scope-and-sequence.md), [référence fonctionnelle](../product/loomata-workspace.md). Revue documentaire/technique séquentielle, même agent, non indépendante ; aucune réalisation applicative qualifiée.

## Critères relus

| Critère | Conclusion documentaire |
| --- | --- |
| Arbitrages du porteur | Quatre espaces, projets Loomata, Codex seul, Figma direct manuel, conversations privées, brouillon unique, aperçu sélectionné, annulation et arbitrages critiques repris. |
| Trois tranches dans l’ordre demandé | T1 Interface & Design System / Agents IA ; T2 User Flow ; T3 Planification / Agents IA. Le socle est inclus au début de T1. |
| Socle utilisable dès le départ | Identités, modèle des cinq objets, versions, persistance, conversations et moteur commun ont des critères d’exécution avant les fonctions T1 ; pas de modèle jetable en attendant Planification. |
| Figma adapté | Connexion directe remplace package/plugin proposé ; import réel, nouveautés, arbitrages et réimport fiable requis en T1, parcours T2 et pilotage T3. Accès/couverture/pilote restent à qualifier. |
| Autorités et états | Valeurs DTCG et règles YAML conservées ; spécification canonique unique, renvois depuis contrats existants. Historique non transformé en preuve du nouveau MVP. |
| Produit et fabrication | Règles d’intégration du produit distinctes de l’acceptation du lab ; J4/J5, distribution et publication restent explicites. Aucun code Claude reporté absorbé. |
| Autonomie | Références de l’app internes ; roadmap/état app restent des modèles. Statuts de fabrication consolidés à la racine. |

## Contrôles et limites

Contrôles exécutés : 16 documents, 688 liens locaux et 12 ancres contrôlés, aucune cible absente au retest ; deux ancres desktop cassées lors de la réécriture ont été rétablies en conservant leur titre. `git diff --check` conforme, diff relu et sélection exacte des seuls fichiers du chantier.

Les quatre nouveaux documents sont ajoutés à `scripts/project-files.json` pour accompagner les copies de projet. Lecture par le vrai `sourceFiles` réussie : 1001 entrées ; aucun doublon ajouté. Prettier du manifeste conforme. Suite existante `node --test application/tests/project-lifecycle.test.mjs` : huit tests réussis sur ressources synthétiques. Premier passage dans le sandbox : six réussites et deux refus `listen EPERM 127.0.0.1` ; retest autorisé hors sandbox : huit réussites. Aucun changement de protection ni correctif de code pour faire passer ces tests.

Aucun build, serveur produit, accès Figma ou inférence exécuté pour cette mise à jour documentaire ; seuls les tests ciblés existants de copie/préparation de fixtures ont été exécutés. Les critères SOCLE/T1/T2/T3 restent à exécuter dans un mandat de réalisation. Aucun changement de skill, rôle, permission ou distribution : revues de procédure de fabrication et de distribution non applicables ; relecture documentaire suffisante pour ce mandat. Revue design/sécurité d’implémentation prévue à chaque tranche, non simulée ici.

Hypothèse réversible de préparation : accès transitoire aux demandes planifiées depuis Agents IA avant la surface complète de T3, avec les mêmes contrats. À préciser dans le cadrage UI T1 ; aucune nouvelle fonction ou technologie approuvée implicitement.

Doc updated. Conclusion : préparation documentaire satisfaisante, contrôles de liens/diff/sélection réussis ; réalisation fonctionnelle À faire. Reprise : mandat distinct de réalisation du préalable commun puis T1.
