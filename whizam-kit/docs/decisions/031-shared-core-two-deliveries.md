# 031 — Cœur commun, dossier autonome et enveloppe macOS

9 novembre 2026 — Direction explicitement demandée dans la conversation, réalisation bornée CORE-01. Un seul dépôt, une seule interface web, un moteur DS et un writer. Garder les chemins actuels ; introduire un port de service borné, pas une copie de l'application dans un projet natif.

Le dossier source reste une livraison autonome après préparation de ses prérequis. L'app macOS future embarquera Node/npm et appellera le même service. Une livraison dossier préinstallée par plateforme reste à décider ; elle n'est pas assimilée au dossier source courant.

L'implémentation présente pilote uniquement les services existants et inspecte les projets compatibles. Création, ZIP, GitHub et OpenAI restent des contrats futurs explicitement indisponibles ; le contenant natif reste un prototype. Voir l'[architecture commune](../architecture/shared-core.md), la [fiche](../work-items/core-01-shared-deliveries.md) et ses preuves.

## Extension UI-FINAL-01 D — 10 novembre 2026

Le mandat d’exécution D ouvre une capacité optionnelle de chat du même cœur dans `/application`, suivant AGENT-CHAT-01. Un gestionnaire Node durable possède les processus fournisseurs, sessions, événements et autorisations ; ses adaptateurs web local et macOS ne dupliquent pas ces traitements. Le chat est servi depuis les sources de l’outil et reste séparé des pages du projet. Son état et ses comptes sont privés à l’installation, exclus des projets créés, exports et sources distribuables. Aucun backend distant ni nouveau service de comptes applicatifs. Les conditions fournisseur, le confinement et les essais réels restent des critères d’activation ; la préparation et un mock ne constituent pas leur qualification.

Le porteur a confirmé « Codex d’abord, Claude indisponible ». La première livraison D est donc bornée à Codex ; AGENT-CHAT-01 complet et sa variante Claude ne sont pas clôturés. Le binaire officiel privé est verrouillé en 0.167.0 avec intégrités npm et reçu SHA256 ; macOS arm64 est la seule plateforme qualifiée. Node/npm embarqués et distributions finales restent E–F.

La qualification réelle des outils dynamiques a échoué car leur moteur de code était désactivé. Le contrôle automatique a refusé l’activation de `code_mode_host` comme affaiblissement persistant des protections. Aucun contournement ni activation n’a été effectué. Solution retenue : conserver les moteurs/outils natifs désactivés et utiliser un schéma de sortie JSON fermé, interprété uniquement par le broker borné du cœur. Ce chemin a été qualifié avec le compte personnel connecté, lecture réelle et propositions refusées/acceptées. Il n’expose aucun évaluateur ni shell. [Contrat courant](../product/agent-chat.md), [preuves](../reviews/ui-final-01-d/README.md).

## Extension E — exports et runtime

Le mandat E autorise les deux exports de sources enregistrées et des candidats locaux avec runtime Node/npm officiel verrouillé. Même port de confiance, aucun endpoint web générique d’export. Le dossier embarque le runtime et les dépendances ; le bundle clone son payload sélectionné dans un espace privé hors Resources, sans identifiants. Une version installée différente nécessite une migration explicite, pas un remplacement silencieux. Base de données non nécessaire aux outils et à l’accueil neutre ; aucun serveur PostgreSQL embarqué ni donnée métier copiée. Qualification bornée macOS arm64 ; mise à jour, notarisation et distribution finale restent F. [Contrat](../product/local-deliveries.md).
