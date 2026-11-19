# Politique du design system automatisé

DS-AUTO-01 — politique validée le 18 novembre 2026. Elle remplace pour ce kit les anciennes règles d’édition visuelle et de décisions sémantiques partagées. Les comptes rendus datés restent historiques.

## Trois catégories de tokens

| Catégorie | Contenu | Portée |
| --- | --- | --- |
| Primitives | Valeurs brutes typées, littérales | Réutilisation par type, unité et valeur canonique exacte. Une primitive consommée reste stable. |
| Tokens de composant | Référence directe à une primitive | Composant, variante, partie et état explicites. Pas de référence entre composants. |
| Tokens locaux | Référence directe à une primitive | Composition d’une page identifiée ; aucune exception libre sur une instance d’un composant partagé. |

Les valeurs et références sont dans `src/design-system/authority/tokens.tokens.json`, profil fermé JSON DTCG 2025.10, métadonnées `org.agentic-design` version 2. Le sens est décrit par les noms, propriétaires et descriptions ; aucune couche de tokens sémantiques intermédiaire. Les noms techniques existants conservés sont tracés dans la table de migration.

Changer la valeur d’un usage crée ou réutilise une primitive compatible, puis réaffecte uniquement les tokens ciblés. Deux usages identiques ne deviennent pas une intention commune. Une modification globale énumère les usages à réaffecter. Les fonctions `ensurePrimitive` et `retargetToken` dans `scripts/design-system.mjs` effectuent ces opérations en mémoire ; l’assistant relit et sauvegarde l’autorité dans son mandat. Elles ne modifient jamais une primitive déjà consommée.

Une apparence différente d’un composant est une variante explicite, documentée et testée. Les alias CSS `--adl-slot-*` sont des sorties contextuelles de génération des tokens de composant, pas des tokens locaux ni une catégorie supplémentaire.

## Sources et génération

Le registre `components.yaml` déclare les implémentations, exemples rédigés, identifiants Storybook et états requis. Toute création ou modification de composant comprend ses tokens et exemples. Le contrôle refuse un composant partagé exporté sans contrat et un exemple requis manquant. Les exemples décrivent le comportement ; ils ne sont pas inventés depuis le JSX.

Les recettes contextuelles sont dans `recipes.yaml` : grammaire fermée, références primitives typées, unités contrôlées. Ce sont des règles CSS, pas des valeurs brutes opaques ni une quatrième catégorie de tokens. Les resets et mots-clés structurels restent du CSS. Le catalogue de fontes conserve les ressources et leurs empreintes ; il ne déclenche aucun téléchargement.

`npm run design-system:sync` valide les sources et leurs consommateurs, puis génère CSS, utilitaires, inventaires et fichiers `*.generated.stories.tsx`. Les fichiers `*.examples.tsx` restent rédigés et protégés. Un changement d’exemple exporté actualise automatiquement la story correspondante. Un retrait ne supprime que les dérivés suivis et reconnus comme générés. Les lancements et builds app/Storybook synchronisent d’abord les sorties ; en développement, les changements d’autorité et d’exemples déclenchent une synchronisation sans appel IA.

`npm run design-system:check` vérifie la péremption sans réécrire les sorties. Les scripts fonctionnent sans compte IA. L’assistant adapte les sources à la demande ; le designer examine les effets, sans autorisation supplémentaire à chaque écriture dans le mandat.

## Consultation et publication locale

Storybook présente les fondations, composants, états et patterns à partir du même code que l’application. Les interactions d’exemple restent fictives et temporaires. Aucun panneau d’apparence, UI Lab, connexion IA, import ou enregistrement dans le navigateur ; aucune API de writer montée dans ses serveurs. Le build statique est consultable sans backend d’édition.

La génération prépare et valide toutes les sorties avant publication. Un seul générateur publie ; `.design-sync.local/` identifie une génération en cours. Les serveurs de développement refusent les lectures durant cette publication. En cas d’interruption, ne pas retirer le verrou à l’aveugle : arrêter ses propres serveurs, vérifier le propriétaire, conserver la génération et lancer `npm run design-system:sync -- --recover`. Cette reprise refuse un propriétaire vivant, conserve les candidats dans un dossier privé de récupération, puis régénère et republie toutes les sorties depuis les sources validées. Si la reprise échoue, le blocage de lecture est conservé. Un propriétaire illisible ou un processus encore vivant demande un diagnostic, sans suppression forcée. La publication de plusieurs fichiers n’est pas une transaction du système de fichiers.

## Migration et reprise

La table [simple-token-migration.json](simple-token-migration.json) conserve anciens identifiants, nouveaux tokens, primitives, valeurs et recettes. La migration explicite `scripts/migrate-simple-tokens.mjs SOURCE DESTINATION` écrit dans une destination neuve extérieure à la source ; elle refuse un état privé d’édition présent. Elle ne met pas à jour les projets déjà distribués, ne convertit aucun reçu et n’efface aucun verrou.

Pour revenir à la version précédente, restaurer la copie complète des sources avec son code et son modèle de tokens compatibles. Ne pas combiner l’ancien éditeur et la nouvelle autorité. Les anciens schémas et utilitaires conservés servent à la lecture/migration historique, pas à une édition courante du nouveau modèle.
