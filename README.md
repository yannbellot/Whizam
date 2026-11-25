# Whizam

[English version](README.en.md)

**Un kit de démarrage pour concevoir et construire une application web avec un assistant IA.**

Whizam s’adresse aux designers numériques, UX/UI et Product Designers qui souhaitent transformer une idée en prototype fonctionnel ou en première version de produit. Vous définissez l’intention, les choix de conception et les critères de réussite ; l’assistant vous accompagne dans le cadrage, la réalisation et les vérifications.

Le kit prêt à utiliser se trouve dans **[`whizam-kit/`](whizam-kit/)**. Ce dossier est autonome : vous pouvez le copier, le déplacer ou le renommer en conservant son contenu complet.

## Documentation

Consultez la [documentation de Whizam](https://yannbellot.github.io/Whizam/fr/) : guides d’utilisation, références techniques et fonctionnement du kit, en français et en anglais.

## Ce que vous trouverez dans le kit

- **Une application de départ** en React, React Router et TypeScript, avec PostgreSQL et Docker Compose pour la persistance.
- **Un design system automatisé** pour maintenir les composants, leurs variantes et les tokens.
- **Storybook** pour consulter les composants de votre projet.
- **Un portail documentaire Zensical** pour retrouver les guides et le suivi du projet.
- **Des instructions, rôles et skills pour les assistants** afin de cadrer, construire, revoir et transmettre le travail.
- **Des contrôles techniques** pour vérifier les sources et préparer une transmission.

Le kit démarre **sans projet métier initialisé** : application vide, aucune donnée insérée par le seed et aucun contenu initial de projet dans Storybook. Les guides sont disponibles dès le démarrage de la documentation. Les références historiques conservées dans les sources ne constituent pas votre projet.

## 1. Récupérer le kit

La méthode recommandée est de cloner le dépôt avec Git : elle préserve les fichiers cachés et les liens symboliques des skills.

```bash
git clone https://github.com/yannbellot/Whizam.git
cd Whizam/whizam-kit
```

Si Git n’est pas installé, demandez à votre assistant de vous aider à le préparer, puis à cloner ce dépôt.

Vous pouvez travailler directement dans `Whizam/whizam-kit/`, ou copier **le dossier entier** dans un autre emplacement pour votre projet. Conservez notamment `.agents/`, `.claude/`, `.storybook/`, `.env.example` et les liens symboliques internes. Gardez une copie intacte du kit si vous souhaitez le réutiliser pour d’autres projets.

## 2. Ouvrir le bon dossier

Ouvrez **`whizam-kit/` comme racine de travail** dans votre assistant de développement. Si vous avez déplacé ou renommé la copie, ouvrez ce nouveau dossier.

Les instructions, les dépendances et les commandes de l’application sont dans ce dossier. La racine du dépôt GitHub ne contient pas de projet npm à installer.

Le kit fournit des instructions pour Codex, Claude Code et Gemini CLI, ainsi qu’un parcours de lecture explicite pour Mistral Vibe et les autres assistants capables de travailler sur des fichiers locaux. La découverte automatique des skills dépend de l’outil utilisé ; consultez la [compatibilité](whizam-kit/docs/compatibility.md).

## 3. Commencer votre projet

Dans une nouvelle conversation ouverte sur le dossier du kit, vous pouvez écrire :

> Je souhaite créer un portfolio de designer numérique nommé « Mon Portfolio ». Aide-moi à cadrer sa première version, puis propose les étapes d’initialisation et de réalisation.

Adaptez le nom et l’idée à votre projet. Vous pouvez joindre votre brief et vos références visuelles.

L’assistant examine les sources, précise avec vous le périmètre et vous présente les actions à valider avant l’initialisation. **Récupérer le kit ne crée pas automatiquement une application métier.** Pour reprendre un projet commencé, demandez de lire son état courant et de poursuivre sans le réinitialiser.

## 4. Préparer et lancer l’environnement local

Les prérequis de référence sont **Node.js 24.22.0**, **npm 11.8.0**, **Docker démarré** et **Docker Compose**. Les plages acceptées figurent dans le [package.json](whizam-kit/package.json). Git sert à récupérer le dépôt.

Vous pouvez demander à l’assistant de vérifier ces prérequis et de préparer l’environnement. Pour un démarrage manuel, toutes les commandes suivantes s’exécutent **depuis `whizam-kit/`**, ou depuis la racine de votre copie renommée.

### Application

```bash
node scripts/setup-local.mjs
docker compose --env-file .env.local up --build --detach --wait
```

La préparation crée une configuration privée locale sans écraser une configuration existante et affiche l’adresse de l’application. Le kit vierge affiche une page vide tant que votre projet n’a pas été réalisé.

Pour arrêter l’application en conservant les données :

```bash
docker compose --env-file .env.local down
```

### Storybook et documentation

Installez une fois les dépendances des outils locaux :

```bash
npm ci
```

Puis lancez l’outil souhaité dans son propre terminal :

| Outil | Commande | Adresse locale par défaut |
| --- | --- | --- |
| Storybook | `npm run storybook` | [localhost:6006](http://127.0.0.1:6006/) |
| Documentation Zensical | `npm run docs:dev` | [localhost:8000](http://127.0.0.1:8000/) |

Docker doit être démarré pour le portail documentaire. Ces adresses sont utilisables lorsque les services correspondants sont lancés ; vérifiez l’adresse affichée en cas de changement de port.

Documentation et Design système suivent automatiquement le mode clair ou sombre de votre navigateur. Leur colonne gauche regroupe la navigation et un sélecteur de langue fixe en bas, également disponible dans le menu mobile. L’icône de lien des titres copie l’adresse de la section ; une confirmation temporaire signale la réussite.

L’application, Storybook et la documentation fonctionnent sans clé de modèle IA. Votre assistant de développement nécessite son propre accès. Figma est facultatif.

## Pour aller plus loin

- **Documentation en ligne** : [Français](https://yannbellot.github.io/Whizam/fr/) · [English](https://yannbellot.github.io/Whizam/en/)
- [Guide d’utilisation](https://yannbellot.github.io/Whizam/fr/docs/guide-whizam/)
- [Documentation technique](https://yannbellot.github.io/Whizam/fr/TECHNICAL-GUIDE/)
- [README détaillé du kit](whizam-kit/README.md)
- [Parcours de démarrage d’un projet](whizam-kit/docs/product/project-start.md)
- [Préparation de l’environnement](whizam-kit/skills/initialize-project/references/environment-setup.md)
- [Vérification et évolution](whizam-kit/README.md#vérifier-et-faire-évoluer-le-projet)
- [Partager votre projet](https://yannbellot.github.io/Whizam/fr/docs/guide-whizam/partager-projet/)
- [Licence et réutilisation](https://yannbellot.github.io/Whizam/fr/docs/licence-reutilisation/)

Le kit est distribué sous [licence MIT](whizam-kit/docs/licence-reutilisation.md), avec les mentions des ressources tierces à conserver.

Travaillez sur une copie pour chaque nouveau projet. Les configurations privées, dépendances installées, caches, builds et données locales ne font pas partie d’un kit neuf à transmettre. Le kit est un point de départ à adapter et à vérifier pour votre application.

