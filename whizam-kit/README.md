<a id="kit-de-conception-et-de-développement-dapplications-web"></a>

# Kit Whizam — conception et développement d’applications web

**Whizam est un kit open source pour concevoir, développer et transmettre des applications web avec l’assistance d’agents IA.**

Destiné en premier lieu aux designers, il fournit un socle applicatif, un design system, des outils de vérification et une documentation pour accompagner le projet, de son cadrage à sa transmission.

Vous apportez l’intention, les contenus et les décisions de conception. L’assistant vous accompagne pour préparer, réaliser et vérifier le travail.

Pour avancer pas à pas, consultez [Démarrer avec Whizam](docs/guide-whizam/index.md).

## Ce que contient le kit

| Élément | Usage |
| --- | --- |
| **Application web** | Socle React, React Router et TypeScript, avec PostgreSQL, Drizzle et Docker Compose pour la persistance. |
| **Design system automatisé** | Primitives, tokens de composant et tokens locaux de page ; styles et inventaires générés depuis les sources du projet. |
| **Storybook** | Consultation des composants React, de leurs variantes, états et exemples. |
| **Documentation Zensical** | Guides français/anglais, suivi du projet et références techniques, avec navigation et recherche. |
| **Instructions et skills** | Quatre rôles et 22 skills pour cadrer, concevoir, développer, vérifier et transmettre le projet. |

<a id="etat-initial-vierge"></a>

Un kit neuf commence sans contenu métier dans l’application et Storybook. Les guides sont déjà disponibles ; les modèles de feuille de route et d’état courant seront renseignés pour votre projet. Les anciennes démonstrations restent des ressources internes, sans être réactivées au démarrage.

<a id="installer-le-kit-et-choisir-son-assistant"></a>
<a id="langue-documentaire"></a>

## Démarrer votre projet

1. **Téléchargez ou copiez le dossier complet**, avec ses fichiers cachés et ses liens internes. Vous pouvez le renommer.
2. **Ouvrez ce dossier dans votre assistant**, puis fournissez un brief, demandez un guidage ou une démonstration fictive.
3. **Précisez votre projet** avec l’assistant : première version, contenus, références, appareils et langues. En fin de cadrage, choisissez éventuellement d’utiliser GitHub.
4. **Validez la première version proposée**, puis examinez et faites évoluer les réalisations.

Vous pouvez commencer par :

> Lis les instructions du kit et accompagne-moi pour démarrer mon projet. Voici mon idée : […]

L’assistant réutilise les réponses déjà fournies et conserve le point de reprise. Une nouvelle conversation ne nécessite pas de réinitialiser le projet. Le [guide de démarrage](docs/guide-whizam/index.md) détaille les étapes et les choix.

| Assistant | Point d’entrée |
| --- | --- |
| Codex | `AGENTS.md` et `.agents/skills/`. |
| Claude Code | `CLAUDE.md` et `.claude/skills/`. |
| Gemini CLI | `GEMINI.md` et `.agents/skills/`. |
| Mistral Vibe Code CLI ou autre assistant | Lire `AGENTS.md`, puis `agents/builder.md` et les skills utiles. |

Chaque assistant utilise vos propres outils et accès. Leur découverte native des skills dépend du client : voir les [adaptations](docs/agents/adapters.md) et les [limites vérifiées](docs/compatibility.md). Les règles détaillées de collaboration sont dans [AGENTS.md](AGENTS.md).

<a id="lancer-lapplication-en-local"></a>

## Ouvrir les trois espaces locaux

| Espace | Utilité |
| --- | --- |
| **Application** | Parcourir et tester ce qui est réalisé. |
| **Storybook** | Consulter les composants, leurs variantes et leurs états. |
| **Documentation** | Retrouver les guides, la feuille de route, les décisions et les références techniques. |

Prérequis de référence : **Node 24.22.0**, **npm 11.8.0**, **Docker** démarré et **Docker Compose**. Les plages compatibles figurent dans [package.json](package.json). Si nécessaire, l’assistant suit la [préparation de l’environnement](skills/initialize-project/references/environment-setup.md).

Depuis la racine du kit, pour préparer et lancer l’application avec Docker :

```bash
node scripts/setup-local.mjs
docker compose --env-file .env.local up --build --detach --wait
```

La préparation conserve une configuration privée existante et indique l’adresse de l’application. Pour arrêter cette instance en conservant les données : `docker compose --env-file .env.local down`.

### Consulter Storybook

Après `npm ci`, dans un terminal distinct :

```bash
npm run storybook
```

Adresse par défaut : [Storybook local](http://127.0.0.1:6006/).

### Consulter la documentation du projet

Avec les dépendances npm installées et Docker démarré, dans un autre terminal :

```bash
npm run docs:dev
```

Adresse par défaut : [Documentation locale](http://127.0.0.1:8000/). Le portail comprend **Guide d’utilisation**, **Suivi de projet** et **Documentation technique**. Les langues de l’application et celles de la documentation/Storybook sont des choix distincts au cadrage.

Le [guide technique](TECHNICAL-GUIDE.md) et les [opérations locales](docs/operations.md) détaillent les lancements, le développement sur l’hôte et les conflits de ports. Les outils du kit fonctionnent sans clé de modèle IA ; l’assistant de développement utilise son propre accès.

<a id="sources-du-projet-sur-github"></a>

Storybook et Documentation suivent automatiquement le mode clair ou sombre transmis par votre navigateur, y compris lorsqu’il change pendant la consultation. Aucun réglage à enregistrer. Cette apparence concerne les outils de consultation ; les couleurs des composants et exemples restent celles de votre projet.

## Conserver et partager les sources sur GitHub

**Vous pouvez conserver les sources de votre projet sur GitHub.** L’assistant vous accompagne pour créer un dépôt ou utiliser un dépôt existant, puis envoyer les commits de lots intégrés ou attendre votre demande.

Par défaut, le mode après commit envoie chaque lot intégré dans la branche principale. Il fonctionne pendant le travail avec l’assistant, sans surveillance permanente des commits manuels. La connexion et le dépôt sont préparés selon les choix autorisés.

Le dépôt peut servir à transmettre le projet à une équipe technique. Sa mise à jour et la mise en ligne de l’application sont deux opérations distinctes. Voir [Partager votre projet](docs/guide-whizam/partager-projet.md) et la [procédure GitHub](docs/github-publication.md).

## Renseigner un accès confidentiel

L’assistant réutilise les connexions disponibles. Si un mot de passe ou une clé reste nécessaire, il propose une saisie privée locale, avec champ masqué, dans le navigateur intégré si disponible ou votre navigateur local. **Ne transmettez pas ces valeurs dans la conversation.**

L’enregistrement ne teste pas le fournisseur et ne déclenche aucun envoi réel. Le repli fichier et les limites du stockage local sont expliqués dans [Configuration privée](docs/agents/private-configuration.md).

<a id="choix-verifications-et-validation"></a>
<a id="verifier-et-transmettre-son-projet"></a>

## Vérifier et faire évoluer le projet

L’assistant accompagne les modifications par les contrôles et revues adaptés. Selon le parcours, vous pouvez choisir une vérification manuelle, automatisée en E2E ou combinée. **Les tests techniques et votre acceptation du résultat sont deux étapes distinctes.**

Le [guide technique](TECHNICAL-GUIDE.md#consultation-et-controles) indique les commandes à retenir selon le changement. Les [conventions](docs/conventions.md) expliquent les commits par lots et leur intégration locale ; un commit local n’est pas une sauvegarde distante.

<a id="maintenir-le-design-system-avec-lassistant"></a>

### Design system

Décrivez les composants, variantes ou ajustements souhaités. L’assistant maintient les sources et les exemples ; les scripts génèrent les styles et les inventaires. Storybook permet leur consultation. Voir le [guide du design system](docs/guide-whizam/storybook-design-system.md) et sa [politique technique](docs/design-system/policy.md).

<a id="renommer-deplacer-ou-transmettre"></a>

## Reprendre et transmettre le projet

Le dossier conserve les sources, les instructions et la documentation nécessaires à la reprise. Dans une nouvelle conversation, demandez à l’assistant de lire l’état courant et la feuille de route.

Pour transmettre une copie, préserver les fichiers cachés utiles et les liens internes ; exclure comptes, secrets, configurations privées, dépendances installées, caches et builds. Les données d’un volume Docker demandent une [sauvegarde distincte](docs/backup-and-restore.md).

Consultez [Partager votre projet](docs/guide-whizam/partager-projet.md) pour préparer une version à jour, sa documentation et l’accès éventuel au dépôt GitHub. Le kit est un socle à adapter et à vérifier ; sa présence ne qualifie pas à elle seule votre application pour la production.

## Licence et réutilisation

Le Kit Whizam est distribué sous **licence MIT**. Consultez le fichier [LICENSE](LICENSE) et la page [Licence et réutilisation](docs/licence-reutilisation.md) pour connaître les conditions applicables. Les ressources tierces conservent leurs licences respectives.

## Provenance

Whizam est le nouveau nom de Loomata. Les chemins, commandes et identifiants techniques ainsi que les preuves historiques gardent leurs noms d’origine lorsqu’ils n’ont pas été renommés. La [notice de distribution](docs/distribution/README.md) décrit la provenance et les limites de cette édition autonome.
