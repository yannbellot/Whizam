# Conventions du starter

## Initialiser le suivi du projet

Les chemins de ce document partent de la racine du dossier applicatif, indépendamment de son nom. Le [README](../README.md), la [roadmap](../ROADMAP.md) et l’[état courant](project-state.md) permettent sa reprise sans dépendre du cadre de fabrication.

La ROADMAP.md et le docs/project-state.md fournis sont non initialisés. Les renseigner au démarrage d’un projet dérivé réel à partir de son brief et de son mandat, sans reprendre les chantiers historiques du starter. Les évolutions du projet conservent leur intention et leurs spécifications dans `docs/product/`, leurs fiches dans `docs/work-items/`, leurs décisions dans `docs/decisions/` et leurs revues/preuves dans `docs/reviews/`. Créer ces dossiers seulement avec le premier document utile. La roadmap porte les statuts consolidés ; l’état courant reste court, avec version, résultats réellement vérifiés, limites et prochaine action. Chaque décision/règle garde une seule source.

L’app est le kit complet, dont les [instructions](../AGENTS.md), rôles, skills et adaptations font partie selon son [périmètre](product/starter-kit.md). Leurs sources canoniques et références d’usage sont internes à ce kit. Les preuves utiles à la livraison sont sélectionnées et versionnées avec lui ; une preuve historique ne constitue pas automatiquement une acceptation de la version actuelle. [PORT-03](work-items/port-03-autonomous-agent-kit.md) conserve l’historique de leur intégration et de leur qualification. Pour une nouvelle fonctionnalité, identifier cible, intention, contraintes, critères et mandat avant l’implémentation. Un statut techniquement qualifié reste En revue avec acceptation humaine différée tant que celle-ci manque. Aucun suivi documentaire n’autorise une publication, un accès externe ou une suppression de données.

## Code et responsabilités

- TypeScript strict, identifiants et commits en anglais ; textes et documentation en français.
- `app/routes/` coordonne les réponses HTTP et l’interface ; les exports loaders/actions restent serveur, les composants peuvent être chargés dans le navigateur.
- `src/design-system/components/` porte les composants partagés existants ; `src/ui-lab/` conserve leurs démonstrations. Les composants n’importent ni configuration privée ni pilote de base.
- Les traitements exclusivement serveur vivent dans des modules suffixés `.server.ts`. `app/server/env.server.ts` valide les entrées de configuration avec Zod et fournit un diagnostic par noms de champs, sans reprendre leurs valeurs.
- Les dossiers de fonctionnalités et de données ne sont ajoutés qu’avec leur première implémentation utile. Les routes ne portent pas le suffixe `.server`.
- CSS natif, propriétés personnalisées et CSS Modules ; aucune autre bibliothèque UI ou framework CSS implicite.

## Contrats et contrôles

`GET /health` est un contrôle de vie applicative : JSON `{ "status": "ok" }`, sans cache, sans secret ni information de version. Il ne vérifie pas PostgreSQL. La configuration invalide fait échouer le traitement ; le document d’erreur public masque le détail interne. Les opérations d’écriture et leurs contrats seront définis avant leur implémentation métier.

`npm run typecheck` génère les types Router et contrôle application, tests et configurations. `npm test` exécute Vitest en environnement Node ; la base de tests grandira avec les fonctions effectives. `npm run test:boundaries` vérifie le refus d’un import `.server` par un composant dans une copie isolée. Les tests de base et navigateur seront distincts, avec ressources et données synthétiques isolées.

Git conserve branches `codex/`, commits cohérents et intégrations dans main en local. Aucun push ni Actions avant la publication explicite. Les preuves identifient base/version, commande, résultats et limites ; aucun contrôle non exécuté n’est déclaré réussi.


Les scripts opérationnels TypeScript utilisent Node 24 natif et des imports `.ts` explicites ; `erasableSyntaxOnly` empêche les formes nécessitant une transformation runtime supplémentaire. Le serveur de production valide PORT, utilise la boucle locale par défaut et n’autorise HOST=0.0.0.0 qu’avec le marqueur de conteneur explicite. Un port occupé échoue sans bascule silencieuse.

## Formatage et navigateur

Prettier utilise le style déclaré dans .prettierrc.json : `npm run format` corrige et `npm run format:check` vérifie. Les exclusions sont explicites dans .prettierignore ; les copies ambiguës restent hors Git et ne sont pas modifiées. Playwright utilise Chromium moderne sur deux viewports, sans serveur réutilisé ni profil personnel. Un échec de contrôle conserve son code non nul.
