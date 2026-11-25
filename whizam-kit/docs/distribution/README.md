# Distribution autonome du kit

Le Kit Whizam s’utilise depuis la racine du dossier reçu, après copie, renommage ou déplacement. Cette page explique ce qui est transmis, les vérifications à effectuer et les limites de l’édition. Les chemins et identifiants techniques restent stables ; aucun parent de maintenance, service Whizam externe ou lanceur macOS n’est nécessaire.

## Édition et provenance

L'édition courante fournit le design system automatisé à trois catégories de tokens, Storybook de consultation et Zensical avec guides actifs FR/EN. L'application et les sélections de contenu Storybook sont initialement vides ; `/projects` et UI Lab ne sont pas montés. Le [périmètre](../product/starter-kit.md) et le [guide technique](../../TECHNICAL-GUIDE.md) décrivent l'usage courant.

La provenance `e81cabc78cd6c9d4263961dc03511dbec0e14ac1` et les campagnes DS-AUTO-01/DIST-01 identifient un héritage daté. Elles ne représentent pas toutes les évolutions suivantes. `sources.json` décrit le contenu livré par empreintes, modes et cibles de liens ; il ne certifie ni fonctionnement ni acceptation. Si cette copie possède son propre dépôt Git, sa version complète peut être identifiée localement ; une distribution neuve ne transfère pas le `.git/` du mainteneur et le simple démarrage web n'exige pas Git.

## Contenu transmis

Préserver fichiers cachés utiles et liens relatifs des skills. Exclure installations, caches, builds, données, configurations privées, comptes et journaux selon la [passation](../handoff.md). Les dépendances sont installées depuis le verrou npm ; aucun volume Docker ou réglage système n'est transféré avec les sources. Le portail utilise Docker sans Python hôte ; voir le [guide documentaire](../documentation.md).

Les modèles ROADMAP et project-state restent à initialiser pour un vrai projet dérivé. Les documents historiques conservés, dont les versions antérieures des références techniques, sont classés hors du portail et de sa recherche. Ils ne sont pas des consignes actives.

## Vérifications et limites

La [compatibilité](../compatibility.md) distingue exigences déclarées, versions testées, essais natifs et acceptation humaine. Le [bilan DS-AUTO-01](ds-auto-01.md) et la [qualification initiale DIST-01](qualification.md) restent des preuves historiques ; aucune nouvelle édition n'est qualifiée par leur seule présence.

Le destinataire utilise ses propres outils et accès. Les adaptations ne garantissent pas la découverte native de tous les assistants. Les projets existants ne sont pas migrés automatiquement ; l'ancien éditeur et ses journaux ne doivent pas être combinés avec les nouvelles autorités.

Le kit est distribué sous [licence MIT](../licence-reutilisation.md), sous réserve des licences propres aux ressources tierces. Cette licence ne constitue ni recette humaine, ni publication, ni préparation à la production. Toute distribution annoncée bilingue demande un contrôle de couverture des traductions, distinct du build. Toute nouvelle qualification identifie ses sources, contrôles réellement exécutés et limites.

<a id="contenu-et-verifications"></a>
<a id="source-contenu-et-verifications"></a>

<a id="limites"></a>
<a id="source-limites"></a>
