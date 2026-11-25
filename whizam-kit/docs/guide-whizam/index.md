# Démarrer avec Whizam

Pour commencer, vous avez besoin du **dossier du kit** et d’un assistant IA capable de travailler dans ses fichiers : **Claude Code ou Codex**.

## 1. Préparer votre dossier

**Téléchargez le kit sur votre ordinateur**, puis placez-le dans le dossier de votre choix. Vous pouvez le renommer avec le nom de votre projet.

**Ouvrez ensuite ce dossier dans Claude Code ou Codex**, en conservant l’ensemble de ses fichiers, y compris les fichiers cachés. Votre assistant pourra ainsi consulter les instructions du kit et travailler sur votre projet.

## 2. Lancer votre projet

Dans la conversation avec votre assistant, choisissez le point de départ qui vous convient.

**Vous avez un brief**

> Je souhaite créer un projet avec Whizam. Voici mon brief : […]

Vous pouvez joindre vos contenus, vos références visuelles et les documents utiles à sa compréhension.

**Vous avez une idée à préciser**

> Je souhaite créer [description de votre idée]. Guide-moi pour définir une première version.

**Vous souhaitez simplement tester le kit**

> Propose-moi un projet de démonstration fictif pour découvrir Whizam.

L’assistant examine les fichiers et vérifie les prérequis techniques. Il vous explique la préparation nécessaire et vous indique si une installation ou une intervention de votre part est requise.

## 3. Choisir si vous souhaitez utiliser GitHub

**GitHub permet de conserver les sources et l’historique de votre projet à distance**, puis de les partager avec les personnes qui participeront à son développement.

À la fin du questionnaire de cadrage, l’assistant vous demande si vous souhaitez :

- Créer un nouveau dépôt GitHub pour votre projet.
- Utiliser un dépôt existant.
- Continuer sans GitHub pour le moment.

Si vous choisissez GitHub, vous précisez également quand envoyer vos modifications : **après chaque commit**, qui enregistre un lot de modifications, ou **uniquement à votre demande**. Vous pouvez modifier ce choix plus tard.

Après validation du cadrage, l’assistant vous accompagne pour rattacher le projet au dépôt retenu. Il réutilise une connexion disponible ou vous guide pour vous connecter. Si un accès confidentiel reste nécessaire, vous le renseignez dans un formulaire privé, sans le transmettre dans la conversation.

**Avant la création du dépôt et le premier envoi, vous validez la destination et les éléments à transmettre.** Vous pouvez utiliser le kit localement sans GitHub et activer cette possibilité plus tard.

<a id="3-definir-une-premiere-version"></a>

## 4. Définir une première version

Quelque soit vos premières demandes, **l’assistant vous aide** à préciser les informations nécessaires à la réalisation de votre projet :

- L’objectif du projet et ses utilisateurs.
- Les pages, les fonctionnalités et les parcours prioritaires.
- Les contenus disponibles et ceux à préparer.
- Les références et les intentions de design.
- Les appareils visés et les langues à proposer.
- Les critères qui permettront de juger le résultat.

**Il réutilise les informations déjà fournies** et vous demande les précisions manquantes, si nécessaire.

**Avant le développement, il vous présente une synthèse :** ce qui sera réalisé, ce qui reste hors périmètre et les éventuels contenus ou comportements provisoires. **Vous validez cette proposition pour lancer la réalisation.**

<a id="4-concevoir-et-developper"></a>

## 5. Concevoir et développer

L’assistant **organise le travail en étapes** et réalise le **périmètre convenu**. Il mobilise les **rôles** et les **skills** utiles pour concevoir les interactions, développer, tester et examiner la qualité du résultat.

Vous pouvez lui transmettre vos choix et vos retours en langage naturel :

> Sur cette page, place le résumé avant le formulaire et explique-moi les conséquences de ce changement.

Lorsqu’une décision modifie sensiblement le périmètre ou le fonctionnement du projet, l’assistant vous présente les options avant de poursuivre.

<a id="5-examiner-le-resultat-et-iterer"></a>

## 6. Examiner le résultat et itérer

Lorsque la version est prête à être examinée, l’assistant vous donne les accès vérifiés vers :

- **L’application**, pour parcourir les pages et tester les interactions.
- **Storybook**, pour examiner les composants, leurs variantes et leurs états.
- **La documentation**, pour retrouver les choix, les décisions et l’avancement du projet.

**Testez les parcours et formulez vos retours.** L’assistant réalise les ajustements convenus et actualise les documents concernés.

Les tests automatisés apportent des **vérifications techniques** ; votre examen permet de juger si le résultat répond à votre intention.

Pour vous assistez dans la phase parfois laborieuse qui consistent à tester les parcours utilisateur afin de les validez, Whizam peut les réaliser de manière automatique en “End-to-end”, abrégé E2E. Pour réaliser cela, demandez simplement :

> Réalise les tests de validation des parcours utilisateurs en E2E.

## Reprendre votre travail plus tard

Votre projet reste intégralement dans son dossier. Pour continuer un travail dans une nouvelle conversation, demandez :

> Lis l’état courant et la feuille de route de mon projet, puis indique-moi où nous en sommes et la prochaine étape.

L’assistant s’appuie sur les informations conservées pour reprendre le travail. **Vous n’avez pas à réinitialiser le projet ni à reformuler tout votre brief.**
