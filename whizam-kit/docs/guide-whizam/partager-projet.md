# Partager votre projet

**Votre projet peut être transmis à une autre personne pour être examiné, poursuivi ou préparé à la mise en ligne.** Son dossier contient les sources de l’application, les composants, les instructions pour les agents et la documentation.

L’assistant vous aide à préparer cette transmission pour que le destinataire puisse comprendre et reprendre le travail sans disposer de votre conversation.

## Choisir ce que vous souhaitez partager

Précisez à l’assistant l’objectif du partage et son destinataire :

> Je souhaite transmettre cette version à une équipe technique pour qu’elle poursuive le développement. Prépare les éléments nécessaires à sa reprise.

> Je souhaite faire tester les parcours à mon équipe. Propose un moyen de partager cette version.

**Transmettre les fichiers du projet et donner accès à une application en ligne sont deux opérations différentes.** L’assistant vous propose une préparation adaptée à votre objectif.

Une adresse locale comme `127.0.0.1` fonctionne sur votre ordinateur. Elle ne permet pas à une autre personne de consulter votre application depuis le sien.

## Préparer la version à transmettre

Avant le partage, l’assistant fait le point sur la version concernée :

- Les fonctionnalités et les parcours réalisés.
- Les contenus provisoires et les éventuelles simulations.
- Les vérifications effectuées et leurs résultats.
- Les problèmes connus et les points restant à examiner.
- Les décisions en attente et les prochaines étapes.

**Vous savez ainsi ce que le destinataire pourra utiliser et ce qui reste à faire.** Une version peut être transmise pour poursuivre son développement, même si elle n’est pas encore prête à être mise en ligne.

<a id="conserver-les-sources-sur-github"></a>

## Partager le projet depuis GitHub

**Si vous avez choisi de conserver les sources sur GitHub, le dépôt peut servir de support à la transmission du projet.** Vous pouvez donner accès à l’équipe technique qui poursuivra son développement, puis lui communiquer le lien du dépôt et la version à reprendre.

Avant cette transmission, demandez à l’assistant de vérifier que les modifications prévues ont bien été envoyées et que la documentation permet d’installer, de lancer et de comprendre le projet.

Vous pouvez demander :

> Prépare la transmission de mon projet depuis son dépôt GitHub. Vérifie la version disponible et complète les instructions nécessaires à sa reprise par l’équipe.

Pour un dépôt privé, les destinataires doivent disposer des accès nécessaires. **Chaque personne utilise ses propres identifiants et sa propre configuration confidentielle.** Les mots de passe et les clés d’accès restent hors du dépôt.

Si le projet utilise une base de données, ses données nécessitent une préparation distincte. Le dépôt contient les sources et les instructions ; une sauvegarde peut être nécessaire pour transmettre les données.

Les mises à jour du dépôt suivent le mode choisi : après chaque commit de lot intégré dans la branche principale, ou uniquement à votre demande. L’envoi automatique intervient pendant le travail avec l’assistant ; aucun service permanent ne surveille vos commits manuels.

**Pour faire tester l’application directement dans un navigateur, préparez également sa mise en ligne**, décrite dans [Préparer la mise en ligne](#preparer-la-mise-en-ligne).

## Préparer le dossier du projet

L’assistant identifie les fichiers nécessaires à la reprise : sources, configuration d’exemple, dépendances déclarées, instructions de lancement et documentation.

Il prépare une copie ou une sélection adaptée au mode de transmission convenu, en conservant les fichiers cachés et les liens internes nécessaires.

**Les mots de passe, les clés d’accès, les connexions personnelles et les configurations privées doivent rester hors des fichiers partagés.** Le destinataire renseignera sa propre configuration.

Si votre projet utilise une base de données, précisez si ses données doivent être transférées. **La copie du dossier ne suffit pas à transmettre une base stockée dans un volume Docker.** Une sauvegarde et une procédure de restauration distinctes peuvent être nécessaires.

Conservez la licence et les mentions applicables dans la version transmise. La page [Licence et réutilisation](../licence-reutilisation.md) explique la licence MIT du kit et les ressources tierces.

## Accompagner la reprise

La documentation de passation permet au destinataire de retrouver :

- L’objectif et le périmètre du projet.
- Les choix de conception et les décisions techniques.
- Les prérequis et les étapes d’installation.
- Les moyens de lancer l’application, Storybook et la documentation.
- Les procédures de vérification.
- Les limites connues et la suite du travail.

Vous pouvez demander :

> Prépare une passation permettant à un développeur d’installer le projet, de le lancer et de réaliser une première modification sans consulter notre conversation.

**Un essai de reprise par le destinataire permet de repérer les informations manquantes.** Ses retours servent à compléter les instructions et à résoudre les obstacles rencontrés.

## Préparer la mise en ligne

Pour rendre votre application accessible à distance, demandez une préparation spécifique :

> Je souhaite mettre cette version en ligne. Présente les étapes nécessaires, les choix d’hébergement, les coûts éventuels et les vérifications à effectuer.

L’assistant examine les besoins du projet : hébergement, configuration, données, accès, sauvegardes et conditions d’exploitation.

**Vous validez les choix et les opérations de publication avant leur exécution.** La préparation d’une livraison ou la réussite des tests ne déclenche pas automatiquement un déploiement.

Storybook et la documentation peuvent également être partagés sous forme de sites consultables. Leur contenu et leurs accès doivent être examinés avant publication, selon les informations que vous souhaitez rendre disponibles.

Les détails de connexion, de saisie privée et de dépannage sont disponibles dans [Publication GitHub](../github-publication.md).
