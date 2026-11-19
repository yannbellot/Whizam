# CORE-01 — Cœur commun et deux livraisons

9 novembre 2026 — Réalisation autorisée, base db4ceee, branche codex/core-01-shared-delivery. Cible application ; suivi de fabrication dans le lab. Dépôt renommé loomata, identité confirmée par le commit LOCAL-APP-01 et son historique. Aucun changement suivi initial ; doublons non suivis, frontend et anciennes recettes hors périmètre.

Mandat immédiat A–E : inventaire, contrats communs, préservation de la livraison dossier, prototype macOS limité puis bilan. Pas de réalisation anticipée de création métier de projets, ZIP, nouvelle connexion OpenAI, publication GitHub, installateur complet ou Node/npm embarqués. Ce sont les étapes suivantes de la feuille de route.

Solution minimale : ne déplacer ni app/, ni src/, ni les autorités DS. Garder le writer et le superviseur Node comme implémentations communes. Ajouter un port de service Node explicite appelé par CLI et prototype natif ; aucune API de commande arbitraire dans le navigateur. Spécifier les opérations futures sans prétendre les implémenter. Le dossier source reste autonome après préparation des prérequis ; un dossier zéro-installation n'est pas encore livré.

A : cartographier sources, adaptateurs et contraintes. B : service commun borné et contrat des opérations. C : extraction sans Git/parent, contrôle du kit, relocalisation et parcours UI Lab/Storybook sur copie. D : prototype WKWebView, choix de dossier et client du même service ; compilation et sonde sans fenêtre. Sans contrôle UI disponible, interaction native déclarée non vérifiée, jamais qualifiée par la seule compilation. E : rapport, roadmap, point de reprise et préparation des travaux ultérieurs.

Critères : une seule logique d'édition et supervision ; opérations inconnues refusées ; aucune source privée dans l'extraction ; services déterministes sans IA ; dossiers/exports non liés au contenant macOS ; contrôle négatif et déplacement conservant les valeurs. Aucun changement de poste ou instance humaine.

Procédures choisies du catalogue applicatif : plan-feature, implement-feature, test-user-flow, technical-review et security-review ; version db4ceee. Revues séquentielles, même agent, non indépendantes. Niveau recommandé : GPT-6.1 Sol · Élevée pour les frontières de processus et deux modes de livraison ; pas de difficulté justifiant une hausse supplémentaire observée. Contrôles/proofs et réserves dans le bilan final.

## Résultat

**10 novembre 2026 — Validé, CORE-01 clôturé sur demande explicite du porteur.** Cette clôture porte sur le mandat A–E : cœur commun, préservation du dossier source et prototype macOS limité. Les preuves sont consolidées dans le [bilan](../reviews/core-01-shared-deliveries.md), la [campagne E2E](../reviews/core-01-native-e2e.md) et son contrôle du vrai sélecteur ; réserve du sélecteur levée. Réalisation/correctifs `4eb361d`, complément de qualification `27ce176` ; douze tests de contrat/supervision et douze scénarios E2E déjà réussis. Les preuves historiques et leurs limites restent conservées.

La demande de clôture vaut acceptation de ce chantier borné ; elle ne vaut pas validation globale de UI Lab, de J4/J5 ou des distributions finales. Clavier/focus prolongé, Dock/redémarrage du Mac, signature/distribution et runtime embarqué ne sont pas déduits de ces tests. Aucun nouveau test runtime, service ou publication pour cette clôture documentaire.

Prochaine étape : finalisation/stabilisation de UI Lab, puis création réelle des projets et exports communs, selon l'[ordre de réalisation](../architecture/shared-core.md#ordre-de-réalisation). Les capacités futures restent indisponibles dans le code jusqu'à leur propre réalisation. Procédure de clôture : update-project-docs, version `27ce176`, revue documentaire séquentielle, même agent, non indépendante. Doc updated.
