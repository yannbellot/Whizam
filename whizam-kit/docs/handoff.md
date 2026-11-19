# Reprendre le kit

Installer et lancer depuis le [README](../README.md), avec les prérequis compatibles et les seuls fichiers du kit. Le design system est automatisé selon sa [politique](design-system/policy.md). Les valeurs/références DTCG sont canoniques ; le registre et les exemples pilotent les stories générées.

Modifier un composant comprend ses tokens, variantes, états et exemples ; synchroniser, contrôler, tester puis examiner application et Storybook. Ce dernier est exclusivement documentaire. UI Lab et ses accès d’édition sont retirés ; aucune clé IA nécessaire aux scripts ou à la consultation. Les modèles ROADMAP et project-state restent ceux du futur projet.

Pour transmettre un kit neuf, exclure installations, caches, builds, comptes, configurations et journaux privés, préserver les liens internes et `.env.example`. Les volumes Docker nécessitent une sauvegarde distincte. Pour déplacer la même instance, conserver identité Compose et données selon les [opérations](operations.md).

Les anciens projets ne sont pas migrés implicitement. La [table de migration](design-system/simple-token-migration.json) et le [guide](design-system/token-migration.md) décrivent les sources concernées. Revenir à une ancienne version exige son code et ses sources compatibles ; ne jamais convertir un reçu ou supprimer un verrou.

Les essais natifs des assistants et la reprise humaine restent distincts des builds et tests automatisés. Voir la [compatibilité](compatibility.md) et les [limites de distribution](distribution/README.md).

Le [guide Reprendre et transmettre](guide-whizam/reprendre-transmettre.md) présente les gestes utiles au designer et renvoie aux procédures de cette passation.

## Documentation du projet

La revue présente Application, Storybook et Documentation après vérification de leurs contenus. Le portail Zensical est livré dans le kit ; voir le [guide documentaire](documentation.md). Il lit les Markdown courants et ne requiert ni parent de maintenance ni Python hôte.
