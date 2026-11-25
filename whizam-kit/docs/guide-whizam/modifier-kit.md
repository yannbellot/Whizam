# Modifier le fonctionnement du kit

**Vous pouvez adapter Whizam à votre manière de travailler et aux besoins de votre projet.** Ses instructions, ses rôles, ses skills et ses règles sont conservés dans les fichiers du kit.

Vous pouvez demander à l’assistant de les examiner et de proposer des modifications. Ces adaptations concernent la copie du kit sur laquelle vous travaillez.

## Avant de commencer

**Ces adaptations peuvent affecter la manière dont l’assistant conçoit, développe et vérifie votre projet.** Une règle contradictoire ou une procédure incomplète peut entraîner des erreurs lors des demandes suivantes.

Modifier l’architecture ou les règles de génération peut également avoir des conséquences sur l’application existante.

Avant toute modification, demandez à l’assistant de :

- Vérifier l’état du projet et préserver les modifications en cours.
- Préparer un point de retour identifié : une version enregistrée avec Git ou une copie de sauvegarde.
- Expliquer les conséquences possibles et la procédure de retour arrière.
- Tester la modification sur un cas limité avant de généraliser son utilisation.

> Avant de modifier le fonctionnement du kit, prépare un point de retour et explique comment restaurer le fonctionnement précédent si l’essai échoue.


## Définir ce que vous souhaitez changer

Décrivez le résultat attendu et, si possible, une situation concrète :

> Je souhaite que chaque revue de design comprenne une vérification des contenus et des messages d’erreur.


> Je souhaite ajouter une règle de documentation pour les décisions prises pendant le projet.


**L’assistant examine les règles existantes avant de proposer une modification.** Il identifie les fichiers concernés, les conséquences sur le travail et les vérifications nécessaires.

Une instruction donnée dans la conversation peut répondre à un besoin ponctuel. Pour qu’une règle soit réutilisée lors des prochaines séances, demandez à l’assistant de l’inscrire dans les fichiers appropriés.

## Modifier les rôles des agents et les skills

**Les rôles définissent les responsabilités ; les skills décrivent les procédures à suivre.**

Vous pouvez préciser les missions d’un rôle, enrichir une procédure ou ajouter un skill pour un besoin récurrent.

Par exemple :

> Ajoute à la revue de design une vérification de la cohérence des libellés entre l’application, Storybook et la documentation.


L’assistant doit conserver une répartition claire entre la réalisation et la revue du travail, puis actualiser les références nécessaires à l’utilisation de la procédure.

## Modifier les règles de gestion du design system

**Les règles du design system encadrent la création et l’évolution des primitives, des tokens, des composants et de leurs variantes.**

Vous pouvez adapter ces règles pour répondre à de nouveaux besoins de conception ou de contribution.

Distinguez une modification d’interface d’une modification de méthode :

- « Crée une variante compacte de ce composant » fait évoluer le design system du projet.
- « Exige un exemple d’utilisation pour toute nouvelle variante » fait évoluer ses règles de gestion.

L’assistant examine les conséquences sur les sources, la génération, les contrôles et Storybook avant de modifier une règle partagée.

## Modifier la documentation

**Vous pouvez faire évoluer le contenu et l’organisation de la documentation**, ainsi que les consignes qui encadrent sa mise à jour.

Par exemple :

> Ajoute une rubrique consacrée aux principes éditoriaux de notre produit.


> Pour chaque fonctionnalité, documente les règles de gestion et les états d’erreur.


L’assistant modifie les sources concernées et adapte leur classement dans le portail. Il conserve une source de référence pour chaque information afin d’éviter les versions contradictoires.

## Modifier l’architecture technique

**L’architecture définit les technologies utilisées et la manière dont les différentes parties du projet fonctionnent ensemble.**

Vous pouvez demander une évolution pour intégrer un service, répondre à une contrainte d’hébergement ou accompagner le développement du produit.

> Notre équipe utilise un autre service de stockage. Examine les adaptations nécessaires et propose un plan de migration.


L’assistant présente les conséquences sur le code, les données, la configuration, les tests et l’exploitation. Les changements qui affectent des données existantes doivent prévoir leur préservation et les possibilités de retour arrière.

**Vous validez le périmètre et les choix structurants avant leur réalisation.**

## Vérifier et conserver les adaptations

Après une modification du fonctionnement du kit, l’assistant actualise les documents concernés et exécute les contrôles adaptés.

**La présence d’une nouvelle instruction ne suffit pas à prouver son application par un agent.** Un essai sur une demande représentative permet de vérifier le comportement obtenu.

Vous pouvez demander :

> Testons cette nouvelle règle sur un cas concret, puis vérifions qu’elle fonctionne aussi dans une nouvelle conversation.


Les adaptations restent dans votre copie du projet. Leur report vers d’autres projets ou vers une nouvelle copie du kit doit être demandé et vérifié séparément.

## Revenir au fonctionnement précédent

**La réversibilité dépend des éléments modifiés et du point de retour préparé avant l’intervention.**

| Modification | Retour arrière à prévoir |
| --- | --- |
| Instructions, rôles, skills ou documentation | Restaurer les fichiers précédents, puis vérifier les références et les liens concernés. |
| Règles du design system ou de génération | Restaurer les sources compatibles et régénérer les sorties de l’application et de Storybook. |
| Code, dépendances ou configuration technique | Restaurer un ensemble cohérent, réinstaller les dépendances si nécessaire et vérifier le fonctionnement. |
| Données ou services externes | Prévoir une sauvegarde et une procédure de restauration spécifiques avant l’intervention. |

**Restaurer les instructions n’annule pas les actions déjà réalisées sous leur influence.** Si l’assistant a modifié le code ou les données après le changement de règle, ces modifications doivent également être examinées.

Git permet de retrouver les fichiers enregistrés dans une version. Il ne sauvegarde pas automatiquement votre base de données, vos fichiers privés ou l’état des services externes.

En cas d’erreur, demandez :

> Suspends les modifications liées à cette adaptation. Compare l’état actuel au point de retour et propose une restauration qui préserve les autres travaux.


L’assistant doit identifier les changements concernés avant toute restauration. **Un retour arrière ne doit pas effacer les évolutions réalisées entre-temps sans votre accord.**
