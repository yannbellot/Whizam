# Modifier l’architecture technique

**L’architecture technique définit les technologies utilisées et la manière dont les différentes parties de votre projet fonctionnent ensemble.** Elle concerne notamment l’interface, le serveur, les données et les services externes.

Vous pouvez la faire évoluer pour répondre à une contrainte d’hébergement, intégrer un service ou faciliter la reprise par une équipe technique.

**Ces changements peuvent affecter l’ensemble du projet.** Avant de commencer, demandez à l’assistant d’examiner leurs conséquences et de préparer un retour arrière.

## Partir du besoin

Décrivez l’objectif ou la contrainte à résoudre. Vous pouvez le faire sans connaître la solution technique.

> Notre équipe utilise Vue.js avec Nuxt et TypeScript pour l’interface, et Python avec Django et PostgreSQL pour le back-end. Examine les adaptations nécessaires pour migrer ce projet vers cette architecture, en préservant ses fonctionnalités et ses données.

> Nous devons héberger l’application et sa base PostgreSQL sur un VPS OVHcloud avec Docker Compose. Examine les adaptations nécessaires et propose une configuration avec HTTPS, sauvegardes et procédure de restauration.

> Nous utilisons Brevo pour les e-mails transactionnels. Propose une intégration de son API pour envoyer les confirmations d’inscription et les demandes de réinitialisation de mot de passe, avec gestion des erreurs et tests sans envoi réel.

Si vous avez déjà une exigence technique, fournissez-la avec les documents utiles.

**L’assistant examine l’architecture existante avant de proposer une solution.** Il doit distinguer les changements nécessaires des adaptations facultatives.

## Comprendre la proposition

Demandez une explication centrée sur les conséquences pour votre produit :

- Ce qui changera pour les utilisateurs.
- Les parties du projet à modifier.
- Les données concernées.
- Les services ou les comptes nécessaires.
- Les coûts éventuels et les contraintes d’exploitation.
- Les limites et les risques identifiés.

> Présente les options possibles et leurs conséquences dans un langage accessible. Indique ta recommandation et les décisions que je dois prendre.

**Une nouvelle technologie n’est utile que si elle répond à un besoin identifié.** L’assistant doit expliquer le bénéfice attendu et le travail nécessaire pour l’obtenir.

## Définir le périmètre

Une évolution peut être limitée à l’ajout d’un service ou nécessiter une transformation plus importante.

L’assistant prépare un plan indiquant :

- Les étapes de réalisation.
- Les fonctionnalités à préserver.
- Les éventuelles interruptions de service.
- Les vérifications à effectuer.
- Les documents et les procédures à actualiser.
- Les conditions de retour arrière.

**Vous validez les choix structurants et le périmètre avant leur réalisation.** Les installations, les accès externes et les opérations de publication restent soumis aux autorisations applicables.

## Préserver le projet et ses données

Avant l’intervention, l’assistant vérifie l’état des fichiers et préserve les travaux en cours. Il prépare un point de retour identifié.

**Une version enregistrée avec Git protège les fichiers suivis ; elle ne sauvegarde pas automatiquement la base de données, les fichiers privés ou les services externes.**

Si l’évolution concerne des données, prévoyez :

- Une sauvegarde adaptée.
- Une méthode de transfert ou de migration.
- Une vérification des données après l’opération.
- Une procédure de restauration et ses limites.

> Avant toute migration, explique comment les données seront préservées et comment nous vérifierons qu’elles sont complètes et utilisables.

Les essais doivent utiliser des données fictives ou une copie adaptée lorsque cela est possible. Les suppressions et les opérations difficiles à annuler doivent être identifiées avant leur exécution.

## Préparer les accès aux services

Certains changements nécessitent un compte, une clé d’accès ou une configuration auprès d’un fournisseur.

L’assistant vous explique les éléments nécessaires et leur utilisation.

**Ne transmettez pas les mots de passe ou les clés dans la conversation.** Demandez le parcours de configuration privée du kit pour les renseigner à l’emplacement approprié.

La préparation d’une intégration ne vaut pas autorisation d’engager des frais, d’envoyer des messages réels ou de modifier un service en production. Ces opérations doivent être précisées dans le mandat.

## Réaliser et vérifier l’évolution

L’assistant réalise les étapes autorisées, adapte les tests et actualise les procédures concernées.

Les vérifications doivent couvrir le nouveau fonctionnement et les fonctionnalités existantes affectées :

- Les pages et les parcours utilisateurs.
- La lecture et l’enregistrement des données.
- Les droits d’accès.
- Les erreurs et les situations d’indisponibilité.
- L’installation, le lancement et l’exploitation du projet.

Selon le changement, des revues techniques et de sécurité complètent ces contrôles.

**Un démarrage réussi ne suffit pas à prouver que la migration est terminée.** L’assistant doit indiquer ce qui a été vérifié, ce qui reste à examiner et les limites connues.

## Actualiser la documentation

L’architecture, les prérequis, la configuration et les procédures de lancement doivent correspondre à la nouvelle version.

L’assistant actualise également les instructions pour les agents et les skills lorsque leurs procédures dépendent de l’ancienne architecture.

> Vérifie qu’une autre personne peut installer, lancer et comprendre cette version à partir des fichiers du projet.

**La documentation doit permettre la reprise sans dépendre de votre conversation.** Un essai par une personne extérieure aide à repérer les informations manquantes.

## Revenir au fonctionnement précédent

Le retour arrière peut nécessiter de restaurer ensemble le code, les dépendances, la configuration et les données.

**Sa faisabilité doit être étudiée avant la modification.** Certaines migrations ne sont pas directement réversibles ; la restauration d’une sauvegarde peut aussi faire perdre les données créées depuis sa réalisation.

En cas de problème, demandez :

> Suspends les opérations liées à cette évolution. Identifie l’état des fichiers, des données et des services, puis propose un retour arrière qui préserve les autres travaux.

L’assistant doit expliquer les conséquences de la restauration avant de l’exécuter. **Revenir à une ancienne version du code ne suffit pas toujours à retrouver le fonctionnement précédent.**
