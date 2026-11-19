# Projets Loomata — création et orchestration locale

**UI-ARCH-04 — adoption du socle des nouveaux projets :** [décision 037](../decisions/037-project-ui-foundation-adoption.md). Tailwind `project:` sans nouveau Preflight, thème dérivé du DTCG projet dans le writer transactionnel ; Button/Field sur React Aria, API et alias locaux conservés. Consommation contrôlée par utilitaires statiques liés aux bindings ; pas de référence aux valeurs outil. Création/export à qualifier séparément, projets existants et anciens journaux préservés ; Electron hors mandat. Cette adoption ne constate pas la qualification, suivie dans la fiche UI-ARCH-04.

**Périmètre MVP du 12 novembre 2026 :** la création, la réouverture et l’évolution concernent les projets créés avec Loomata. L’ouverture technique existante ne vaut pas adoption de projets hétérogènes ; [périmètre canonique](loomata-workspace.md), [décision 033](../decisions/033-loomata-mvp-scope-and-sequence.md). Les opérations existantes ci-dessous restent distinctes du futur socle Git/versions/brouillon partagé.

UI-FINAL-01 C. Le projet est un dossier de sources distinct de l’installation de Loomata. Il ne correspond pas à une ligne de la démonstration `/projects` du starter.

## Depuis l’application macOS

**Nouveau projet** ouvre le sélecteur macOS. Le nom du dossier devient le nom affiché du projet. Choisir une destination nouvelle, hors de l’installation : un dossier existant, même vide, est refusé sans écrasement. Annuler conserve l’atelier courant. Confirmer le remplacement traite les brouillons, puis arrête les seuls services du projet précédent. Le dossier neuf est préparé et ses trois vues sont ouvertes automatiquement.

**Ouvrir un projet** sélectionne un dossier de confiance contenant le contrat du kit. Son code local sera exécuté lors du démarrage. La compatibilité est vérifiée avant de fermer l’atelier actuel ; un refus conserve son contexte et son brouillon. Un changement valide demande confirmation, arrête l’ancien superviseur propriétaire puis ouvre le nouveau. Les paramètres existants, ports et identités ne sont ni réparés ni écrasés implicitement.

**Préparer / Réessayer** concerne les projets créés par Loomata. Il arrête d’abord leurs services après confirmation, prépare les seules dépendances reconnues et régénère sur l’instance inactive. Une erreur laisse le dossier et les sources sauvegardées disponibles ; le message et le journal privé indiquent l’étape à reprendre. La reprise ne recrée pas le projet. Une interruption brutale ou un verrou inconnu exige un diagnostic, jamais une purge automatique.

**Démarrer** réutilise le superviseur existant ; **Arrêter les services** ne vise que le projet sélectionné. Fermer Loomata ne sauvegarde pas les brouillons et laisse ses services actifs, selon la confirmation de B. La prochaine ouverture retrouve le dernier dossier sélectionné ; un dossier déplacé ou devenu incompatible produit une erreur visible, pas un retour silencieux sur la démonstration. Ouvrir explicitement son nouvel emplacement ; une instance déplacée conserve ses règles de réparation documentées.

## Contenu et préparation

La liste fermée `scripts/project-files.json` sélectionne les sources livrables du socle : code, DS, catalogue, instructions, rôles, skills, liens internes et documentation. Elle fonctionne sans Git et doit être actualisée lors d’un changement du kit. Aucun fichier inconnu ajouté au dossier source n’entre automatiquement dans le projet. Les chemins privés, `.env.local`, dépôts Git, dépendances, builds, journaux, reçus et connexions IA ne font pas partie de cette copie. `.env.example` reste un modèle public.

La copie utilise une réservation de lecture du DS existante. Une récupération interrompue refuse la création. Les liens d’exposition des skills sont conservés uniquement s’ils visent l’intérieur du kit ; les autres liens et chemins traversants sont refusés. Une création interrompue conserve son dossier partiel identifié ; elle n’efface jamais un dossier pour réessayer.

`loomata.project.json` porte l’identité et le nom du projet. La roadmap et son état sont initialisés pour la préparation technique et le cadrage restant, sans inventer de métier. L’accueil montre le nom du projet et précise que la première version reste à concevoir. L’exemple `/projects` n’est plus lié depuis cet accueil ; ses sources/migrations restent une référence du kit, sans données créées ou supprimées.

La préparation réutilise par copie les dépendances installées du kit lorsque le lockfile est identique, sans transférer Node, secrets ou configuration npm. Sinon elle invoque le npm associé au Node sélectionné, avec `ci --ignore-scripts`, cache propre et délai borné. Les dépendances sont préparées dans une tentative privée avant publication dans le dossier. Un `node_modules` inconnu ou modifié est conservé et signalé. L’installation réseau de secours reste distincte de la voie de copie effectivement qualifiée sur ce Mac.

L’état, le journal de préparation et l’empreinte du lockfile restent dans `.runtime.local/project/`. Le dernier contexte choisi est privé à l’installation dans `.runtime.local/loomata-context/`. Les services conservent leur propre identité et socket, sans arrêt par PID d’un fichier ancien. Le writer DS reste celui du projet ; aucune nouvelle route privilégiée ou commande de page web n’est ajoutée.

## Même cœur dans le dossier source

Le dossier source consomme les mêmes opérations par `scripts/local-service.mjs` : `project.create`, `project.inspect`, `project.open`, `project.prepare`, `runtime.start/status/stop`. Le JSON de création contient seulement `destination` absolue et `name`. L’argument de projet sélectionne le contexte ; la ressource de création provient du kit qui héberge le service. Aucun shell, GitHub ou compte IA requis. La CLI est réservée à un appelant local de confiance ; ce n’est pas une API navigateur.

Cette parité porte sur les opérations et les résultats. L’interface macOS utilise AppKit ; le dossier source n’annonce pas une nouvelle interface web de gestion de fichiers. Node/npm, dépendances et outils Apple restent des prérequis du mode source, l’embarquement relevant de E.

## Données et limites

L’accueil neuf, UI Lab et Storybook ne nécessitent pas de base. Aucune ancienne base, identité Compose ou configuration n’est copiée ; Docker, migrations et seeds ne sont jamais lancés implicitement. Les pages métier qui nécessitent PostgreSQL demandent leur préparation documentée et un mandat de projet. Leurs fonctions ne sont pas livrées par la seule création du dossier. C ne promet pas un orchestrateur universel de bases métier, ni une application dérivée déjà conçue.

Le chat intégré, les exports ZIP, GitHub, Node/npm embarqués et les distributions finales restent dans leurs étapes. [Fiche UI-FINAL-01](../work-items/ui-final-01-complete-assisted-cycle.md), [architecture commune](../architecture/shared-core.md).
