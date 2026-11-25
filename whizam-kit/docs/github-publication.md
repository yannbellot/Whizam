# Publication des sources sur GitHub

Cette procédure permet de conserver et synchroniser les sources du projet sur GitHub, après un commit ou à la demande. Elle décrit le choix du dépôt, la connexion et l’autorisation des envois. Publier les sources et déployer l’application sont deux opérations distinctes.

## Choix et autorisation

Le cadrage recueille `github.repository` (`new`, `existing`, `none`), puis `github.sync` (`after-commit`, `on-demand`) si GitHub est retenu. Ce sont des préférences non secrètes, pas une autorisation de mutation distante. Non/report reste acquis jusqu'à une demande de changement. Un projet déjà engagé ne reçoit pas de questionnaire rétrospectif obligatoire.

Charger le skill [publish-github-project](../skills/publish-github-project/SKILL.md). Compléter seulement les informations inconnues : propriétaire personnel/organisation, nom ou lien du dépôt, visibilité d'un nouveau dépôt (privé proposé), branche publiée (`main` proposée). Ne pas modifier la visibilité d'un dépôt existant. Cette édition accompagne `github.com`, avec Git et GitHub CLI (`gh`) disponibles, en HTTPS ; les remotes SSH, GitHub Enterprise ou multiples destinations demandent une adaptation explicite, jamais une conversion silencieuse.

Préparer l'historique et les fichiers concrets avant l'accord : sources utiles, liens internes, configuration d'exemple ; exclure secrets, données privées, caches et `.git/` du mainteneur. Un fichier supprimé peut subsister dans un ancien commit. Dans une copie sans Git, obtenir le mandat d'initialisation et du premier commit sur la sélection préparée selon les conventions. Ne pas publier l'historique du kit de maintenance ; travailler dans la copie dérivée.

Présenter le dépôt exact, sa visibilité, la branche, la portée de l'historique, les effets distants connus (workflows existants compris) et le mode. L'autorisation explicite de ce récapitulatif peut couvrir les futurs envois vers cette destination. Ne pas redemander à chaque commit. Compte utilisé, destination, visibilité ou branche différente : renouveler l'accord utile. Suspendre immédiatement sur demande. L'envoi des sources ne déploie pas l'application.

## Connexion et saisie privée

Réutiliser l'accès disponible sans lire sa valeur. Un connecteur suffisant peut réaliser la publication selon ce contrat ; l'aide locale utilise `gh`. Sans connexion utilisable, proposer `gh auth login --hostname github.com --git-protocol https --web` dans un terminal sous contrôle du designer. Cette connexion modifie l'état de l'outil : obtenir le mandat utile et expliquer le stockage de credentials ; ne pas changer silencieusement de compte ou la configuration globale Git. Ne pas afficher `gh auth token`, les secrets ou des journaux de débogage.

Si la connexion navigateur est indisponible et qu'un jeton est nécessaire, expliquer son périmètre minimal pour la cible et les opérations demandées ; ne pas imposer des permissions générales. Lancer `node scripts/configure-secrets.mjs --github GH_TOKEN:password` depuis le projet, puis ouvrir l'URL locale selon [Configuration privée](agents/private-configuration.md). L'utilisateur saisit seul, sans inspection ni capture après saisie réelle. Annulation/expiration ne modifient rien.

Ce repli enregistre uniquement `GH_TOKEN` dans `.github-token.local` (0600), séparé de `.env.local`. Il n'est ni un coffre-fort ni un test de connexion. L'aide charge ce fichier uniquement avec `credential: "form"`, puis transmet le jeton aux processus `gh`/Git sans le mettre en argument ou URL. Avec `credential: "existing"`, elle n'ouvre pas ce fichier. Ne pas enregistrer le jeton dans le brief, la conversation ou le portail. Le repli fichier consiste à ouvrir ce seul fichier privé sans lecture de l'assistant, en annonçant la saisie visible ; pas de repli vers l'environnement applicatif. Ne pas contourner une permission refusée.

L'ouverture dans un onglet Codex dépend de l'outil disponible ; sinon fournir le lien local. Dans Claude, utiliser les capacités présentes ou le navigateur local. Aucune intégration graphique universelle ni qualification native des clients n'est déduite des tests de scripts.

Références officielles vérifiées le 24 novembre 2026 : [connexion et stockage GitHub CLI](https://cli.github.com/manual/gh_auth_login), [création d'un dépôt](https://cli.github.com/manual/gh_repo_create), [credential helper](https://cli.github.com/manual/gh_auth_setup-git). L'aide applique le helper uniquement à ses commandes Git, sans appeler `gh auth setup-git` ni changer la configuration globale.

## Commandes et persistance

Depuis la racine du projet, `node scripts/github-project.mjs status` est local, sans réseau ni affichage de secret. `plan` lit sur l'entrée standard `{ "branch": "main" }` et retourne commit, liste des fichiers et `selectionHash`. Il refuse notamment les chemins privés dans l'historique ; ce contrôle ne détecte pas un secret caché dans un fichier au nom ordinaire. La revue humaine/agent de l'historique et de sa confidentialité reste nécessaire.

Le champ `account` désigne le compte connecté qui agit, distinct du propriétaire du dépôt. Le déterminer avec `gh api user --jq .login` dans le mandat de connexion (identifiant public uniquement), puis le faire figurer dans le récapitulatif. L’aide le revérifie avant création ou envoi ; un changement de compte bloque l’opération.

Après validation du récapitulatif, `authorize` reçoit sur l'entrée standard un objet non secret :

```json
{
  "repository": "proprietaire/projet",
  "account": "compte-connecte",
  "branch": "main",
  "visibility": "private",
  "mode": "after-commit",
  "credential": "existing",
  "reviewedHead": "COMMIT_RETOURNE_PAR_PLAN",
  "selectionHash": "EMPREINTE_RETOURNEE_PAR_PLAN",
  "historyReviewed": true,
  "authorized": true,
  "approval": "Référence de l’accord explicite au récapitulatif"
}
```

L'assistant prépare ce JSON avec un outil de fichier, sans interpolation shell du texte utilisateur ; le passe sur stdin et ne met aucun secret dans ses arguments. L'autorisation n'effectue ni création ni envoi. L'état opérationnel `.github-publication.local/state.json`, privé et ignoré, conserve destination, mode, accord, version revue et reçu d'envoi. Les réponses initiales non secrètes restent dans le brief. Une copie distribuée exclut ces états ; une reprise dans le même dossier les relit. Après déplacement d'un projet déjà configuré, refaire le récapitulatif et `authorize`, sans réutiliser une autorisation liée à une autre racine.

`inspect` vérifie le dépôt distant, la visibilité et le droit d'écriture ; c'est un accès réseau à utiliser dans le mandat. Pour un nouveau dépôt seulement, après l'accord de création, `create` reçoit `{ "createAuthorized": true }` : création sans README, clone, remote ou push implicite. Reprendre par `inspect` si le dépôt a été créé mais qu'une vérification a échoué ; ne pas recréer ni supprimer automatiquement.

Après contrôles de la version, `sync` reçoit `{ "verifiedHead": "COMMIT_VERIFIE", "checksPassed": true, "requested": true }`. `after-commit` reçoit le même objet sans `requested` et ne transmet rien si le mode est à la demande. `suspend` désactive les envois sans supprimer le dépôt ni le secret. Pour modifier mode/destination, présenter le nouveau récapitulatif puis refaire `authorize` avec un plan actuel ; pas d'édition manuelle de l'état pour éviter ses refus.

## Lots, envoi et reprise

Le Builder appelle `status` à la reprise. Sans configuration, aucune action GitHub. Après chaque clôture/intégration locale d'un lot autorisé, il appelle `after-commit` si le mode est automatique, avec le commit publié vérifié et les contrôles réussis. Le seuil des lots reste inchangé : pas de commit par retouche. Par défaut, publication de `main` après intégration locale ; les commits restant uniquement sur `codex/...` ne sont pas envoyés. Une autre branche peut être explicitement désignée et revue ; cette aide couvre une branche/destination à la fois.

En mode à la demande, conserver l'indication des commits locaux à envoyer et attendre la demande ; ne pas appeler de mutation distante après commit. Aucun hook ni service permanent ne surveille les commits manuels hors session. Le designer peut demander « Envoie les derniers commits sur GitHub », « Passe à l'envoi à ma demande » ou « Suspends les envois GitHub ».

L'aide vérifie dépôt racine exact, sélection sans chemins privés dans l'historique, descendance du commit revu, arbre propre, destination HTTPS sans réécriture, visibilité et droits distants. Un `origin` préexistant différent est refusé, jamais remplacé. Le push vise uniquement le commit et la référence de branche convenus, sans force ni tags automatiques, et relit la référence distante avant de confirmer le succès. Aucune identité Git globale n'est changée.

Accès expiré, réseau indisponible, branche protégée ou divergence : conserver le commit local et l'état « à envoyer », signaler la cause et la prochaine action. Aucun force push, rebase destructif ou boucle de tentatives. Si le commit distant n'est pas connu localement, diagnostiquer et préparer un rapprochement autorisé avant de réessayer. Un envoi déjà présent est reconnu sans nouveau push. Le statut local n'est qu'un reçu ; seule la vérification réseau établit l'état distant courant. Ne pas créer de commit de suivi après chaque reçu, ce qui provoquerait une boucle d'envois.

## Contrôles et limites

Essais ciblés : `node --test tests/github-project.test.mjs tests/project-intake.test.mjs tests/private-configuration.test.mjs`. Les tests Git utilisent des dépôts temporaires et des remotes locaux nus ; connexion, création et réponses GitHub sont simulées. Ils ne prouvent pas les droits d'un compte réel, le déclenchement natif du skill, ni l'affichage dans Codex/Claude. Une recette réelle nécessite un dépôt de test et un mandat propres. Toute suppression de dépôt reste une opération distincte.

Après ajout ou évolution du skill : validation du catalogue et de ses liens, traductions FR/EN, construction/fraîcheur documentaire et copie autonome. Distinguer contrôles techniques, recette des clients et acceptation humaine. Ne pas annoncer une publication réelle à partir d'un test simulé.
