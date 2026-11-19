# Pratiques sélectionnées pour la reprise du kit

**24 octobre 2026 — synthèse de l’héritage, pas une nouvelle campagne de tests.** Le catalogue relie chaque skill à une référence locale utile. Cette page fournit les procédures et limites nécessaires à la reprise ; elle ne transfère pas une acceptation humaine et n’impose pas de retrouver des archives externes.

## Procédures disponibles dans le kit

- Cadrer et spécifier : [périmètre du starter](../product/starter-kit.md), [brief de l’exemple](../product/brief.md), [spécification projets](../product/features/projects.md).
- Construire et revoir : [architecture](../architecture.md), [conventions](../conventions.md), [contrat de données](../product/project-data-contract.md), [principes UI](../design-system/principles.md), [sécurité](../security.md).
- Vérifier et transmettre : [commandes](../../README.md), [opérations](../operations.md), [sauvegarde/restauration](../backup-and-restore.md), [reprise par un tiers](../product/first-handoff-exercise.md), [remplacement de l’exemple](../product/replacing-project-example.md).

## Origine et limites de l’héritage

Le kit a été construit en local en octobre 2026 : socle Node/React Router/PostgreSQL, raccordement des autorités YAML à l’application et à Storybook, mini-gestionnaire persistant puis formalisation de quatre rôles et vingt skills. Les rôles ont été exercés séquentiellement dans Codex, par le même agent ; cela ne constitue pas une revue indépendante ni un essai des trois autres assistants.

La source web `94895a6dbf306a722c692a6c0a8b534403332606` a été qualifiée dans PORT-02 : 78 tests, builds et continuité exacte de trois lignes après renommage/déplacement sur le même moteur Docker. Cette preuve historique concerne le web et les données. L’extraction du kit d’agents est une campagne PORT-03 distincte ; voir [l’état réel](../project-state.md) et la [compatibilité](../compatibility.md).

Les références d’origine ci-dessous étaient celles du catalogue avant intégration (base de fabrication `710f5bba1861e0e4e5b20eaaa86f76f5ab1d6a79`). Elles sont conservées comme identifiants de provenance, pas comme chemins à ouvrir pour utiliser le kit :

- `docs/decisions/005-technical-baseline.md`
- `docs/decisions/006-design-authority-and-storybook.md`
- `docs/decisions/007-practiced-instructions-and-state.md`
- `docs/reviews/p1-04/README.md`
- `docs/reviews/p1-07/README.md`
- `docs/reviews/p2-01/README.md`
- `docs/reviews/p2-05/README.md`
- `docs/reviews/p3-02-project-persistence.md`
- `docs/reviews/p3-03/README.md`
- `docs/reviews/p3-06/README.md`
- `docs/work-items/p3-03-project-flow.md`

Ces archives de provenance ne sont pas incluses dans le kit et ne sont pas des prérequis d’utilisation. Une application dérivée doit produire ses propres critères, versions, rapports et acceptations ; ni une ancienne commande réussie ni un simple fichier practice n’en prouvent la réussite actuelle.
