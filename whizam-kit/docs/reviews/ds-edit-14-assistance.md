# DS-EDIT-14 — Assistance d’Apparence : preuves et revues

30 octobre 2026 — cible application. **En revue : qualification technique acquise, acceptation humaine différée.** [Fiche et mandat](../work-items/ds-edit-14-assisted-appearance.md), [décision 017](../decisions/017-assisted-style-decisions.md), [guide autonome](../design-system/editor-assistance.md).

Base `561fb9d`, branche de réalisation `codex/assisted-appearance`. Candidat fonctionnel : SHA256 `a6a4985f986339a87e188662ca3cf2f71c51d07276d00593f9300faeeb99c2bd` du [manifeste de 24 fichiers code/tests/catalogue](ds-edit-14/candidate-source.sha256). Le manifeste ne comprend pas les documents et captures, dont les mises à jour finales n’affectent pas ce candidat. L’historique Git porte les versions intégrées. Node embarqué 24.22.1, npm 11.8.0, dépendances existantes ; aucune installation globale ou nouvelle dépendance.

## Résultat et limites de la politique

Le composant n’expose plus les quatre opérations techniques : le designer saisit directement sa valeur. La politique prépare les seuls plans valides, réutilise selon le sens sémantique, crée selon une intention explicitement préparée ou conserve un réglage particulier. Même couleur et même intention restent deux conditions distinctes. Le modèle choisit un identifiant de plan ou demande une précision ; il ne produit ni code ni opération libre. Les cas mécaniques à choix unique sont locaux même connecté.

Les données actuelles ne délèguent aucune portée commune préétablie : toute propagation partagée demande donc une réponse explicite pour le geste. Un inventaire incomplet interdit cette proposition. Les usages hérités et les exceptions restent explicités ; le système ne garantit pas les usages inconnus. Les fondations et l’édition experte Tokens/Styles conservent leur parcours.

L’aperçu précède la décision. Questions, réponses et plans sont liés à la cible, racine, révision, génération et empreinte du brouillon. Les réponses tardives sont refusées ; les autres gestes sont conservés, y compris si une création réutilisée est modifiée ou annulée. Enregistrer reste la seule écriture durable et attend la fin des analyses/questions. Indisponibilité IA et ambiguïté de conception ont des messages distincts. Sans connexion, une règle déterministe conserve l’édition sans se présenter comme une analyse IA.

## Contrôles réellement exécutés

Copies isolées sous `.local/ds-edit-14/`, journaux privés ignorés. Les tests ne modifient pas les autorités du kit ni la recette humaine précédente.

| Contrôle | Résultat et portée |
| --- | --- |
| `npm test` | **121 réussis**, 16 fichiers : politique, péremption, plans bornés, session/annulation, interdiction de sauvegarde indéterminée, conservation des autres gestes et retour mécanique au style attribué. |
| `npm run test:design-system` | **47 réussis** : contrats, opérations, migration et snapshot. |
| `npm run test:design-editor:server` | **74 réussis** : store, récupération/interruption et gardes HTTP existantes, sur copies isolées. |
| `npm run test:design-agent` | **10 réussis**, avec faux transport explicitement identifié : confinement/configuration, deux comptes synthétiques distincts, outils refusés, budgets, symlinks, HTTP, racine/révision/empreinte falsifiées, réponse explicite, péremption et réponse à usage unique. |
| `npm run test:design-system:docs` | **5 réussis** : dérivés documentaires, données adversariales, sauvegarde et péremption. |
| `npm run test:design-editor:dev` | **42 réussis, 2 sauts conditionnels** : campagnes desktop/mobile complètes, clavier, comparaison, navigation, annulation, tiroir mobile, documents et question simulée. Les deux sauts concernent le mode statique. Retest de capture de question : 2 réussis. |
| `npm run test:design-editor -- --project desktop` | **19 cas conformes par campagne et retest**, 3 sauts conditionnels : 18 réussites initiales puis correction/retest du cas Field partagé. Les sauts portent sur l’assistance simulée et les deux cas nécessitant le développement. Aucun appel IA ni sauvegarde statique. |
| Statique mobile ciblé | **2 réussis, 1 saut conditionnel** : saisie/annulation et sauvegarde indisponible ; question IA absente en statique. Pas de campagne statique mobile complète revendiquée. |
| Persistance navigateur ciblée | **4 scénarios desktop réussis** entre campagne et retests : valeur locale/enregistrement/rétablissement/partage, conservation de l’exception Field sous mise à jour SelectField, création experte sans attribution et réutilisation sans doublon. Relecture de l’application compilée aux deux largeurs réussie. Pas de suite persistante exhaustive revendiquée. |
| Types, lint, formatage | `npm run typecheck`, `npm run lint`, `npm run format:check` conformes. |
| Documentation et kit | `npm run docs:design-system:check` conforme ; `npm run validate:agent-kit` conforme : 21 skills, 4 rôles. |
| Builds | Application et Storybook conformes. Avertissements habituels React Router/chunks Storybook conservés, aucun défaut bloquant associé observé. |

Échecs conservés comme diagnostic : anciens tests dépendaient du menu supprimé ; contexte Field à resélectionner après retour du catalogue ; variante masquée quand unique ; attente SelectField effectuée après navigation vers Field. Les assertions ont été raccordées au parcours réel, sans supprimer les contrôles de valeur. Un premier écart de preview mobile isolé a été rejoué avec succès. La fermeture du tiroir mobile a révélé un défaut réel de nettoyage : suspendre l’aperçu lors du démontage du même espace, puis le réappliquer à l’ouverture ; retests et campagne complète conformes. Générations et campagnes navigateur ont ensuite été sérialisées. Les refus de port sous sandbox ont nécessité l’autorisation de seuls contrôles locaux ; aucune protection applicative n’a été retirée.

## Preuve réelle et compte propre à chaque installation

L’utilisateur a terminé lui-même l’authentification officielle. État observé dans Safari : **Codex connecté**. Un appel réel via la route protégée a retourné un plan d’exception pour Button `#123456` ; la révision des sources est restée identique après analyse seule.

Un scénario navigateur réel a ensuite réussi dans `.local/ds-edit-14/real-proof` : saisie → vrai Codex → plan validé → Enregistrer → reçu durable → rechargement → CSS `rgb(18, 52, 86)`. Cette copie possède ses propres sources/store/journaux. Son bootstrap de test injecte uniquement le répertoire d’agent de l’aperçu déjà authentifié, sans copier d’identifiants. Cette adaptation locale n’est pas livrée ; l’implémentation normale calcule l’état privé depuis sa propre racine. [Capture après sauvegarde réelle](ds-edit-14/real-account-saved.png). La question ci-dessous est, elle, synthétique : ne pas la confondre avec une preuve d’arbitrage spontané du modèle.

Le processus réel a été vérifié : configuration read-only, approbations never, zéro MCP et outils/plugins/hooks/apps/délégation désactivés ; écriture synthétique dans son répertoire privé autorisée, écriture extérieure refusée sans fichier créé. Le démarrage vérifie la configuration et refuse un mode non protégé. Les routes réelles de fichiers privés ont refusé les chemins directs, encodés et `@fs`, sans fuite d’une sentinelle synthétique. Les erreurs et journaux du rapport n’incluent ni compte, ni jeton, ni URL OAuth.

Une extraction source renommée avec espaces a passé le validateur et un véritable `account/read` confiné : **connected=false**, sans inférence ni connexion, alors que l’aperçu original reste connecté. Les dépendances locales existantes ont été raccordées explicitement pour ce contrôle ; un premier essai sans elles a échoué sur la résolution YAML, puis a été corrigé. Les deux installations/comptes simulés testent aussi l’isolation. Cela ne prouve pas un essai par deux personnes ou deux comptes réels. Le guide explique la connexion propre au destinataire et l’exclusion des états privés ; aucun paquet de distribution public ni nouveau parcours d’installation sur machine vierge n’a été qualifié ici.

## Revues

Mode de toutes les revues : **séquentiel, même agent, non indépendant**. Critères et scénarios préalables conservés dans la fiche ; pas de sous-agent ni de scan externe supplémentaire.

- **Design Reviewer — satisfaisant avec réserve de recette humaine.** Référence : demande de saisie seule et question dans Apparence, sans nouvelle maquette Figma. Valeur et question sont liées dans le même réglage ; clavier, portée connue, comparaison et annulation vérifiés. Captures inspectées : [desktop, question simulée](ds-edit-14/question-simulated-desktop.png), [mobile, question simulée](ds-edit-14/question-simulated-mobile.png). Le tiroir natif mobile reste défilable. Ces preuves ne constituent ni recherche utilisateur ni acceptation visuelle.
- **Technical Reviewer / QA — satisfaisant sur le périmètre.** Entrée → normalisation → choix calculés → sortie bornée → corrélation → opérations validées → brouillon → service transactionnel/reçu relus. Réponses périmées, collision de plans et dépendance entre créations testées ; protections de sauvegarde conservées. Réserve de compatibilité : macOS/CLI `0.165.0-alpha.1.2` vérifiés, autres versions et systèmes non qualifiés. Le refus fermé permet de garder le socle local.
- **Security Reviewer — satisfaisant sur cette exposition locale.** Frontières Host/Origin/capacité, allowlist de routes, schémas fermés, budgets, état privé non servi et environnement enfant sans clé API/capacité contrôlés. Les outils refusés et la sandbox empêchent les écritures directes de l’agent dans le DS. L’état de compte n’est pas hérité ou distribué ; aucun mot de passe traité par DS-EDIT. Pas de certification, de scan global ni de service multi-utilisateur déduit.
- **Instruction Reviewer du lab — satisfaisant avec réserve comportementale.** `lab-evaluate-instructions`, candidat limité aux six pieds de procédures et ressources du catalogue ; `lab-maintain-agent-kit` pour leur maintenance. Scénarios relus : sans IA, connexion avec compte propre, catalogue demandant de retirer les protections, kit extrait sans parent. Le texte conserve socle sans IA, activation explicite, permissions/mandat inchangés et renvoi interne autonome. Les reviewers n’obtiennent pas de droit de correction. Validation structurelle réussie ; rechargement natif et efficacité de ces instructions sur une nouvelle session non testés.

## Livraison locale et reprise

L’aperçu indépendant **54114** a été actualisé après double constat sans brouillon, sans journal actif et sans reçu. Arrêt propre du serveur, sources mises à jour sans toucher à `.runtime.local/`, autorités comparées avant/après identiques. Relance puis rechargement Safari : compte de la même installation retrouvé sans nouvelle authentification, **Codex connecté**, brouillon vide. Ancienne recette 54086/54085, sources et reçus conservés. Aucun transfert de connexion à une autre personne.

Périmètre documentaire : spécification, décision, guides, architecture/sécurité, README, six procédures/catalogue, fiche et suivi de fabrication racine. Modèles applicatifs non initialisés. Diff, liens, données privées et préexistants vérifiés avant intégration ; les 50 entrées non suivies initiales restent hors commit. **Doc updated.** Aucun push, Actions, déploiement ou publication.

Reprise : essai humain du parcours et connexion d’une autre personne sur ses propres prérequis macOS/Codex. Sans cela, ne déclarer ni acceptation finale, ni compatibilité universelle, ni recette multi-utilisateur. Les acceptations G/J5 demeurent distinctes. Aucun autre chantier ouvert implicitement.
