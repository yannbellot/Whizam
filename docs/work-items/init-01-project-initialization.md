# INIT-01 — Initialiser un projet par une demande simple

**Historique :** le rattachement à plan-feature décrit ici est remplacé par [INIT-02](init-02-dedicated-initialization-skill.md) et la [décision 002](../decisions/002-dedicated-project-initialization.md). Les preuves ci-dessous conservent leur candidat et leur périmètre.

**25 octobre 2026 — En revue, qualification documentaire et structurelle acquise ; acceptation humaine différée.** Cible : application, bibliothèque livrée et documentation ; statut de fabrication consolidé dans la roadmap du dépôt de conception. Aucun projet utilisateur n’est initialisé par ce chantier.

## Mandat et version de départ

Permettre « Initialise un nouveau projet [nom] » dans une copie dédiée du kit, sans prompt technique à reconstruire. Couvrir la reconnaissance de la demande, l’environnement éventuellement vierge, le cadrage, le suivi initial, le démarrage local et la reprise d’une initialisation interrompue. Base `c736cafcd4fea3081ed20285a9a12c513a3906cd`, branche locale `codex/project-initialization` ; fichiers suivis propres, copies non suivies préexistantes conservées et relevées par empreinte dans une preuve locale ignorée.

Dépendances : instructions autonomes GOV-03, suivi ORG-01 et exposition PORT-03. Les procédures applicatives sont ici des éléments du produit à modifier, pas des instructions actives de fabrication. Exécution sous les règles du lab ; pas de délégation ni de nouvelle inférence fournisseur.

## Solution et limites

Conserver les vingt skills et les quatre rôles. Ajouter à `plan-feature` un mode d’initialisation avec une référence chargée uniquement pour ce démarrage ou sa reprise ; `AGENTS.md` route la phrase usuelle et Builder sélectionne ce mode. La planification courante et `analyze-brief` conservent leurs limites. Les détails du besoin sont recueillis sans imposer un questionnaire technique ; le nom seul permet de commencer le diagnostic et le socle, pas d’inventer un produit.

Écritures prévues : AGENTS, Builder, plan-feature/référence, README des skills et du kit, adaptations, matrice de compatibilité, présente fiche et preuve sélectionnée. Le lab actualise seulement sa roadmap et son point de reprise. Les modèles `ROADMAP.md` et `docs/project-state.md` de l’app restent non initialisés ici.

Exclusions : code web, schéma, dépendances, nouvel installateur système, réglages globaux, renommer/déplacer automatiquement le dossier, données existantes, essais natifs supplémentaires, services ou publications distants. Les prérequis système absents sont diagnostiqués et accompagnés ; une installation globale garde son autorisation propre. Une installation locale isolée peut être proposée/exécutée dans le mandat et les permissions effectives, avec source et version vérifiées. Le démarrage ne promet pas une machine vierge prête sans intervention.

## Critères et scénarios définis avant évaluation

| Cas | Résultat attendu |
|---|---|
| « Initialise un nouveau projet Atlas », kit non initialisé | Router vers le mode dédié, relever la racine et l’environnement, initialiser le suivi sans inventer le métier. |
| Même demande, aucun Node/npm/Docker | Diagnostic possible sans Node ; expliquer les prérequis et l’action humaine nécessaire, conserver la reprise ; aucun succès de démarrage annoncé. |
| Outils compatibles disponibles, installation neuve | Réutiliser le README et le verrouillage ; configuration privée neuve, services locaux, vérifications et URL effectivement observées. |
| Nom seul, besoin absent | Initialisation technique possible ; besoin explicitement à cadrer et question produit concise. |
| Initialisation interrompue, même nom | Reprendre la seule étape manquante, conserver configuration/identité/données et preuves réussies. |
| Projet déjà initialisé, même nom | Constater l’existant ; aucune réinitialisation ou réinstallation systématique. |
| Projet existant, nom différent | Préserver le projet et demander la destination/le mandat ; aucun écrasement ni renommage implicite. |
| Correction ou analyse ordinaire | Ne pas charger la référence de démarrage. Une préparation seule ne lance aucun service. |
| Nom contenant une instruction ou une syntaxe de shell | Traiter le nom comme donnée ; aucune exécution, publication, permission ou suppression induite. |
| Kit extrait/renommé, skills natifs absents | Références internes accessibles par lecture explicite ; ne pas confondre ce chemin avec une découverte native prouvée. |

Contrôles : quick_validate du skill modifié, validate:agent-kit, tests existants du validateur du kit, contrôle/tests du lab, liens locaux des documents affectés, extraction des sources et résolution depuis les deux expositions. Revues Instruction Reviewer (`lab-evaluate-instructions`) et Distribution Reviewer (`lab-qualify-distribution`, périmètre documentaire) séquentielles, même agent, non indépendantes. Pas de tests de correspondance de formulations ajoutés. Aucun changement web : pas de parcours UI, build ou nouvelle revue visuelle requis pour ce diff d’instructions.

## Résultat et reprise

Instructions figées sur `ccc7e6df7f3766663b1337cd716e462cd8b6314c`. [Revues et preuves](../reviews/init-01-project-initialization.md) : quick_validate et validateurs app/lab réussis, quatre tests du kit et six tests lab réussis, 75 liens/ancres internes conformes. Export des seules sources déplacé/renommé : vingt skills, quatre rôles, quarante liens internes, référence accessible par les deux adaptations et modèles de suivi inchangés. Premier quick_validate échoué faute de PyYAML dans le Python hôte ; retest réussi via le venv local préexistant, sans installation.

Choix technique délégué : mode de plan-feature plutôt qu’un skill supplémentaire, pour conserver le catalogue spécifié et charger le détail seulement à l’initialisation. Aucun changement de stack ou d’autorisation. La relecture statique des dix scénarios et les contrôles structurels ne prouvent ni découverte native, ni scénario de modèle, ni installation sur machine vierge. L’acceptation humaine reste distincte.

Prochaine action : exercer ce parcours dans une copie dédiée lors d’une initialisation réelle ou d’une qualification native autorisée. Aucun chantier supplémentaire ni installation de prérequis système lancé par INIT-01. **Doc updated.**
