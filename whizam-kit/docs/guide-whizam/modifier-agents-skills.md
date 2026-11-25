# Modifier les rôles des agents et les skills

**Les rôles et les skills définissent la manière dont l’assistant travaille sur votre projet.** Vous pouvez les adapter pour préciser une responsabilité, enrichir une procédure ou répondre à un besoin récurrent.

Ces modifications s’appliquent à votre copie du kit. Avant de commencer, préparez avec l’assistant un point de retour permettant de restaurer les fichiers précédents.

## Comprendre les rôles et les skills

**Un rôle définit une responsabilité et ses limites.** Whizam en propose quatre :

- **Builder** : analyse les demandes, propose les solutions, réalise les modifications, teste et documente.
- **Design Reviewer** : examine la fidélité aux références, la cohérence visuelle et l’expérience utilisateur.
- **Technical Reviewer / QA** : examine le code, les contrats techniques, les tests et les risques de régression.
- **Security Reviewer** : examine les accès, les données, les secrets et les risques de sécurité.

**Un skill décrit une procédure pour accomplir une tâche.** Il précise les informations nécessaires, le travail à effectuer et le résultat attendu.

Un même rôle peut utiliser plusieurs skills selon la demande. La présence de quatre rôles ne signifie pas que quatre agents travaillent simultanément : un assistant peut les exercer successivement. Dans ce cas, les revues ne sont pas indépendantes.

## Choisir le bon niveau de modification

Avant de modifier les fichiers, précisez si votre demande concerne une intervention ponctuelle ou une règle durable.

**Pour une demande ponctuelle**, une instruction dans la conversation peut suffire :

> Pour cette revue, examine aussi la compréhension des messages d’erreur.


**Pour une règle réutilisable**, demandez une adaptation du skill concerné :

> Pour les prochaines revues de design, ajoute une vérification systématique de la compréhension des messages d’erreur. Inscris cette règle dans la procédure appropriée.


L’assistant recherche d’abord une procédure existante afin d’éviter de multiplier les skills qui couvrent le même besoin.

## Modifier un rôle

Une modification de rôle concerne sa mission, son périmètre ou ses limites.

Par exemple :

> Précise que le Design Reviewer doit signaler les contenus provisoires qui empêchent de juger la hiérarchie d’une page.


L’assistant examine les conséquences sur les autres rôles et propose une répartition cohérente.

**Conservez une distinction claire entre réalisation et revue.** Les reviewers examinent, testent et rendent leurs conclusions. Les corrections reviennent au Builder, sauf délégation explicite.

Modifier un rôle ne donne pas de permissions supplémentaires à l’assistant. Les autorisations de votre outil et les décisions nécessaires restent applicables.

## Modifier un skill existant

Décrivez le comportement attendu et ce qui permettra de le vérifier :

> Complète la procédure de passation pour inclure la liste des contenus provisoires et des décisions encore ouvertes.


L’assistant identifie le skill concerné, examine ses références et propose les changements nécessaires.

Une procédure doit rester suffisamment précise pour indiquer :

- Quand l’utiliser.
- Quelles informations consulter.
- Quelles actions effectuer.
- Quel résultat produire.
- Comment vérifier ce résultat.

**La modification doit rester cohérente avec les instructions communes du kit.** Si elle entre en contradiction avec une autre règle, l’assistant doit vous expliquer le conflit avant de poursuivre.

## Ajouter un nouveau skill

Un nouveau skill est utile lorsqu’une tâche récurrente nécessite une procédure distincte.

> Propose un skill pour vérifier les contenus éditoriaux avant chaque livraison : terminologie, cohérence des libellés et identification des textes provisoires.


Avant sa création, l’assistant précise son objectif, son rôle responsable et ses limites. Il vérifie qu’aucun skill existant ne couvre déjà ce besoin.

Les sources canoniques se trouvent dans les dossiers `agents/` et `skills/`. Le catalogue des skills et les points d’entrée concernés doivent également être actualisés pour conserver un ensemble cohérent.

**Ajouter un fichier ne garantit pas sa découverte automatique par tous les assistants.** L’assistant doit préciser comment la procédure est accessible dans votre environnement et distinguer sa présence de son utilisation réellement vérifiée.

## Vérifier le nouveau fonctionnement

Après la modification, demandez un essai sur une tâche représentative :

> Applique cette procédure à un exemple limité, puis indique quelles consignes ont été suivies et quels résultats permettent de le vérifier.


L’assistant contrôle la structure des fichiers, leurs références et le comportement observé. Si la règle doit être réutilisée entre les séances, un essai dans une nouvelle conversation permet de vérifier sa reprise.

**Une validation de structure ne prouve pas à elle seule que l’agent applique correctement la procédure.** Examinez également la qualité du résultat obtenu.

## Revenir à la version précédente

Si l’adaptation ne produit pas le comportement attendu, demandez :

> Compare cette adaptation au point de retour et propose de restaurer les rôles, les skills et les références concernés, en préservant les autres modifications.


**Restaurer la procédure n’annule pas les changements déjà réalisés avec elle.** Le code, les contenus ou les données modifiés pendant l’essai doivent être examinés séparément.
