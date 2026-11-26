# Whizam

[English version](README.en.md)

**Concevez, développez et faites évoluer vos applications web avec l’assistance d’agents IA.**

Whizam est un kit open source destiné aux designers numériques, UX/UI et Product Designers qui souhaitent transformer une idée en prototype fonctionnel ou en première version de produit.

Il associe un socle technique, des instructions pour les assistants IA, un design system et des outils de vérification et de documentation. Vous pouvez travailler avec **Claude Code ou Codex**, sans connaissances préalables en programmation, en décrivant votre intention et vos demandes en langage naturel.

**Vous gardez la maîtrise de votre produit : ses objectifs, ses contenus, ses choix de conception et la validation du résultat.** L’assistant vous accompagne pour cadrer, construire, vérifier et documenter votre projet.

📖 **[Consulter la documentation](https://yannbellot.github.io/Whizam/fr/)**

## De l’idée à la transmission

### Démarrer votre projet

Apportez un brief, décrivez une idée à préciser ou demandez un projet de démonstration fictif pour découvrir le kit.

L’assistant vous aide à définir une première version : utilisateurs, pages, fonctionnalités, contenus, références visuelles et critères de réussite. Il vous présente le périmètre et les étapes proposées avant de commencer la réalisation.

### Créer et itérer

Décrivez les pages, les interactions et les ajustements souhaités. L’assistant examine les sources, prépare les changements et réalise le travail dans le périmètre convenu.

Vous pouvez suivre le résultat dans trois espaces :

- **L’application**, pour parcourir les pages et tester les interactions.
- **Storybook**, pour consulter les composants, leurs variantes et leurs états.
- **La documentation**, pour retrouver les décisions, les références et l’avancement du projet.

Les vérifications techniques accompagnent le développement. Votre examen permet de juger si le résultat répond à votre intention.

### Transmettre et partager

Les sources et la documentation restent dans votre dossier de projet. Elles permettent de reprendre le travail plus tard ou de préparer sa transmission à une équipe technique.

Vous pouvez également utiliser GitHub pour conserver l’historique et partager les sources. Le déploiement de votre application constitue une étape distincte, à préparer selon ses besoins.

## Ce que contient le kit

| Élément | Usage |
| --- | --- |
| **Application web** | Socle React, React Router et TypeScript, avec PostgreSQL et Docker Compose pour la persistance. |
| **Design system automatisé** | Composants réutilisables, variantes et tokens maintenus avec l’assistant. |
| **Storybook** | Consultation des composants du projet et de leurs états. |
| **Documentation Zensical** | Guides français/anglais, suivi du projet et références techniques. |
| **Instructions, rôles et skills** | Procédures pour cadrer, concevoir, développer, vérifier et transmettre le travail. |
| **Contrôles techniques** | Outils pour vérifier les sources et les parcours concernés. |

Le kit démarre **sans projet métier initialisé** : l’application est vide, aucune donnée n’est insérée par le seed et Storybook ne contient pas de composant de projet sélectionné. Les guides sont disponibles dès le premier démarrage du portail documentaire.

## 1. Récupérer le kit

La méthode recommandée est de cloner le dépôt avec Git : elle préserve les fichiers cachés et les liens symboliques des skills.

```bash
git clone https://github.com/yannbellot/Whizam.git
cd Whizam/whizam-kit
```

Si Git n’est pas installé, demandez à votre assistant de vous aider à le préparer.

Le kit autonome se trouve dans **`whizam-kit/`**. Vous pouvez travailler dans ce dossier ou le copier ailleurs et le renommer pour votre projet.

Conservez le dossier entier, notamment `.agents/`, `.claude/`, `.storybook/`, `.env.example` et les liens symboliques internes. Gardez une copie intacte du kit pour vos prochains projets.

## 2. Ouvrir le bon dossier

Ouvrez **`whizam-kit/` comme racine de travail** dans votre assistant de développement. Si vous avez déplacé ou renommé votre copie, ouvrez ce nouveau dossier.

Les instructions, les dépendances et les commandes se trouvent dans ce dossier. La racine du dépôt GitHub ne contient pas de projet npm à installer.

Les parcours principaux concernent Claude Code et Codex. Le kit fournit également des adaptations pour d’autres assistants ; leur prise en charge et les limites de découverte des skills sont décrites dans la [compatibilité](https://yannbellot.github.io/Whizam/fr/docs/compatibility/).

## 3. Commencer la conversation

Choisissez le point de départ qui vous convient.

**Vous avez un brief :**

> Je souhaite créer un projet avec Whizam. Voici mon brief : […]

**Vous avez une idée à préciser :**

> Je souhaite créer un portfolio de designer numérique. Guide-moi pour définir une première version.

**Vous souhaitez découvrir le kit :**

> Propose-moi un projet de démonstration fictif pour découvrir Whizam.

Vous pouvez joindre vos contenus, vos références visuelles et les documents utiles à votre projet.

L’assistant examine les fichiers et vérifie les prérequis. Il précise avec vous le périmètre et les actions à valider avant la réalisation. Récupérer le kit ne crée pas automatiquement une application métier.

## 4. Préparer et lancer l’environnement

Vous aurez besoin de **Node.js**, de **npm**, de **Docker démarré** et de **Docker Compose**. Les versions compatibles sont indiquées dans [package.json](whizam-kit/package.json).

Vous pouvez demander à l’assistant de vérifier ces prérequis et de préparer l’environnement.

Pour un démarrage manuel, exécutez toutes les commandes suivantes **depuis `whizam-kit/`**, ou depuis la racine de votre copie renommée.

### Application

```bash
node scripts/setup-local.mjs
docker compose --env-file .env.local up --build --detach --wait
```

La préparation conserve une configuration privée existante et affiche l’adresse de l’application. Le kit neuf montre une page vide tant que votre projet n’a pas été réalisé.

Pour arrêter l’application en conservant ses données :

```bash
docker compose --env-file .env.local down
```

### Storybook et documentation

Installez une fois les dépendances :

```bash
npm ci
```

Puis lancez chaque outil dans son propre terminal :

| Espace | Commande | Adresse locale par défaut |
| --- | --- | --- |
| Storybook | `npm run storybook` | [localhost:6006](http://127.0.0.1:6006/) |
| Documentation | `npm run docs:dev` | [localhost:8000](http://127.0.0.1:8000/) |

Docker doit être démarré pour la documentation. Ces adresses sont disponibles lorsque les services correspondants fonctionnent ; consultez l’adresse affichée si le port change.

L’application, Storybook et la documentation fonctionnent sans clé de modèle IA. Votre assistant de développement utilise son propre accès. Figma est facultatif.

**Ne transmettez pas de mot de passe ou de clé dans la conversation.** Si un accès confidentiel est nécessaire, suivez le parcours de saisie privée proposé par l’assistant.

## Reprendre et faire évoluer votre projet

Votre dossier conserve les sources, les décisions et le suivi nécessaires à la reprise.

Dans une nouvelle conversation, vous pouvez demander :

> Lis l’état courant et la feuille de route de mon projet, puis indique-moi où nous en sommes et la prochaine étape.

Vous n’avez pas à réinitialiser le projet. L’assistant s’appuie sur les informations enregistrées pour poursuivre le travail.

Utilisez une copie distincte du kit pour chaque nouveau projet. Les configurations privées, dépendances installées, caches, builds et données locales ne font pas partie d’un kit neuf à transmettre.

## Pour aller plus loin

- **Documentation en ligne** : [Français](https://yannbellot.github.io/Whizam/fr/) · [English](https://yannbellot.github.io/Whizam/en/)
- [Guide d’utilisation](https://yannbellot.github.io/Whizam/fr/docs/guide-whizam/)
- [Documentation technique](https://yannbellot.github.io/Whizam/fr/TECHNICAL-GUIDE/)
- [README détaillé du kit](whizam-kit/README.md)
- [Préparation de l’environnement](whizam-kit/skills/initialize-project/references/environment-setup.md)
- [Partager votre projet](https://yannbellot.github.io/Whizam/fr/docs/guide-whizam/partager-projet/)
- [Compatibilité et limites](https://yannbellot.github.io/Whizam/fr/docs/compatibility/)
- [Licence et réutilisation](https://yannbellot.github.io/Whizam/fr/docs/licence-reutilisation/)

## Licence

Whizam est distribué sous **licence MIT**. Les mentions et licences des ressources tierces restent applicables.

Le kit est un point de départ à adapter et à vérifier pour votre application. Il ne constitue pas, à lui seul, une qualification pour la production.

