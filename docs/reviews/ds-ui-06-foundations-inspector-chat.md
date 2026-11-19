# DS-UI-06 — Qualification de Foundations, de l’inspecteur et du chat

15 novembre 2026 — cible application. Mandat de réalisation repris explicitement en réflexion Très élevée sur la base `7cd5caf`, branche `codex/ds-ui-06-foundations-inspector`, candidat fonctionnel `543fe16`. [Fiche](../work-items/ds-ui-06-foundations-inspector-chat.md), [décision 038](../decisions/038-foundations-inspector-chat.md). Les preuves ci-dessous qualifient le domaine fermé livré ; elles ne constituent pas une acceptation humaine ni une conversion universelle de composants.

## Résultat et limites

Foundations présente les décisions partagées en grilles par type, avec filtre et badges Intention/Convention. Les décisions de composition sans domaine d’édition qualifié restent visibles en consultation. Les cartes montrent des valeurs résolues et des aperçus de couleur, rayon, dimension ou typographie. Les décisions de même valeur restent distinctes ; leur nom inclut rôle et état. L’inspecteur modifie une décision existante avec ses usages liés et préserve les réglages propres.

Components affiche simultanément les champs préparés de la variante, partie et état sélectionnés ; plus de menu Propriété ni de choix technique de portée. Un réglage conserve son identité de token de composant. Erreurs par champ, famille de police, conversion d’unité mesurée, contraste, rétablissement, annulation, conflits et reçu durable restent raccordés. Les mesures sont utilisées seulement pour leur binding, génération, séquence et clé d’aperçu ; une mesure d’un champ ne sert pas à un autre. Une saisie invalide garde le dernier aperçu valide.

Le chat propose une action structurée `design` : opérations de tokens, variante préparée, acceptation d’un import préparé, ou demande planifiée pour un besoin hors matrice. Il n’écrit pas directement dans DTCG. La création d’une convention porte classification et justification, sans ajouter d’éligibilité sémantique. La coordination contrôle les révisions et une autorité interne non sérialisable ; le journal assure le rejeu et les nouveaux reçus gardent conversation et tour. Les anciennes entrées HTTP ne créent plus de token. Une proposition d’import est liée à son empreinte exacte : une modification de l’aperçu après proposition au chat invalide son acceptation, même sans changement de révision DS ; le contrôle se fait dans la file de l’import. Les primitives sont créées ou réutilisées automatiquement, indépendamment du compte IA, sans modifier une primitive déjà consommée.

Une annulation coordonnée restaure aussi l’attribution et la provenance antérieures du binding, via une opération interne refusée au chat et aux formulaires. Les décisions/primitives devenues inutilisées restent disponibles : aucun nettoyage destructif n’est ajouté. L’exploration Figma et les assignations de variantes existantes restent utilisables ; l’ajout de tokens passe par le chat. Un nouveau composant React hors domaine pris en charge devient une demande planifiée, sans lancement de chantier implicite.

Les essais utilisent des fixtures synthétiques sous `.local/ds-ui-06/` et les fixtures propres aux tests ; aucune valeur canonique du projet ni donnée de la recette humaine n’a été modifiée. Le brouillon de la fenêtre personnelle signalé par DS-UI-05 n’a pas été rechargé. Aucun compte, secret ou journal n’a été recopié.

## Contrôles et portée des preuves

Commandes depuis la racine applicative, avec le runtime local existant `scripts/with-runtime.sh`. Les contrôles réseau sont exclusivement loopback ; aucune inférence ni requête Figma réelle supplémentaire.

| Contrôle | Résultat démontré |
| --- | --- |
| `npm test` | 182 tests, 29 fichiers conformes, y compris cohérence JSON Schema/Zod, sessions, erreurs et actualisation |
| `npm run test:design-system` | 115 tests et validation des autorités ; valeurs, graphes, références et consommateurs |
| `npm run test:ds-ui-06` | 6 scénarios : primitives, conventions, provenance forgée refusée, annulation d’attribution, récupération, véritable chemin d’approbation avec fournisseur simulé, mise en attente hors domaine |
| `node --test tests/workspace-variants.test.mjs tests/figma-import.test.mjs tests/agent-chat.test.mjs` | 27 tests de référence conformes ; admission variantes/imports vérifiée en complément avec refus sans autorité chat |
| `node --test tests/design-editor-http.test.mjs` | 9 tests conformes : origine/session, création hors chat refusée, réponse perdue, lenteur et propriétaire du writer |
| UI compilée sans writer | 16 scénarios desktop conformes : champs, navigation/clavier, filtres, unités, contrastes, brouillon et absence de capacité d’écriture |
| UI de persistance | 9 scénarios desktop conformes : sauvegarde/relecture, décision partagée et réglage propre, rétablissement courant, conflit avec saisie conservée, réponse perdue, création hors chat et popup refusées |
| AppKit/WKWebView | Fenêtre de test instrumentée distincte, inspecteur et Foundations rendus ; aucune interaction physique ou acceptation visuelle humaine déduite |
| Types | `typegen` puis `tsc -b` conformes dans une copie des sources suivies et des nouveaux fichiers, sans les copies locales suffixées préexistantes |
| Lint / builds | Lint ciblé, builds React Router et Storybook, frontières serveur/client et documentation générée contrôlés |
| Création et export du projet | Huit tests de cycle de vie et six tests d’export conformes ; liste de livraison complète, aucune sortie privée incluse |
| Kit d’agents | 21 skills/quatre rôles et références conformes ; pas de preuve de rechargement natif ou d’efficacité fournisseur |

Le scénario reproductible `scripts/test-ds-ui-06.mjs <fixture> <origin-loopback>` exige le marqueur `.runtime.local/ds-ui-06-fixture` et vérifie l’identité de racine avant toute saisie. Il enregistre trois champs, recharge, filtre les décisions, modifie une décision partagée et relit le réglage propre préservé ; formats 1280×800 et 1440×900. Ne pas le lancer sur une recette humaine. Les suites adaptées sont dans `tests/workshop/` et `tests/workshop-persistence/` ; les assertions des anciens menus sont remplacées par les conséquences du nouveau contrat. Les protections, réponses perdues et conflits restent couverts, pas supprimés avec les boutons.

## Échecs observés et retests

- Le contrôle de types du clone incluait quatre copies non suivies suffixées ` 2` référençant l’ancien addon. Elles sont conservées ; le contrôle utile utilise une copie isolée des sources du candidat. Le tout premier contrôle de copie précédait sa génération/typegen et a été rejoué après préparation.
- Le sandbox a refusé les ports des tests HTTP et de configuration ; ils ont été rejoués avec la seule exécution locale autorisée, sans retrait de garde HTTP. Les deux anciennes attentes de création HTTP ont été remplacées par le refus attendu et une mutation existante pour le test de réponse perdue.
- L’inspection visuelle a révélé des chevrons hors présentation et la grille sous les panneaux flottants : classes de chrome et gouttière raccordées, captures revues après correction.
- La nouvelle campagne a révélé l’impossibilité de revenir au composant déjà sélectionné depuis Foundations et le mauvais affichage d’une saisie en conflit. La sélection de navigation est désormais vide dans Foundations ; la saisie conservée par le conflit est affichée dans le champ suspendu. Retests compilés et persistants conformes.
- L’inverse historique d’une création ne restaurait pas toute l’attribution. L’inverse interne restaure référence, style et provenance ; test d’annulation/relecture conforme. Son admission reste réservée à la coordination.
- Les premiers essais combinés ont rencontré une erreur de route pendant les publications et les reconstructions de fixture. Builds et writers ont ensuite été isolés ; le scénario partagé/rétablissement a été rejoué trois fois avec succès, puis la campagne de neuf scénarios est conforme. Les premiers échecs restent dans les journaux locaux ; ne pas reconstruire une instance en cours d’écriture.
- Une assertion attendait le rôle `tree`, tandis que React Aria expose `treegrid` ; elle a été alignée sur le rôle réel. L’attente d’approbation simulée, trop courte sous charge, attend maintenant la transition avec une limite bornée.
- Le SDK macOS par défaut n’était pas compatible avec le compilateur présent ; le contrôle natif a réussi avec le SDK 26.5 déjà installé. Aucun SDK ni réglage global installé/modifié.

## Revues séquentielles, même agent, non indépendantes

**Design Reviewer — satisfaisant pour les critères techniques, acceptation visuelle réservée au designer.** Grilles et champs raccordés aux valeurs réelles, navigation desktop/clavier et conservation des réglages vérifiées. Aucune conformité WCAG globale ni nouvelle identité visuelle acceptée. Les limites des décisions en consultation sont explicites.

**Technical Reviewer / QA — satisfaisant sur le domaine fermé.** La source de valeurs reste DTCG, aucun nouvel algorithme de primitive n’est nécessaire ; la correspondance de type/famille/valeur est déterministe. Les schémas sont coordonnés ; la création passe par une admission de chat avant journalisation. Les tests couvrent un rejeu sans nouvelle approbation après interruption, les révisions périmées, l’annulation et l’assignation. Les corrections de navigation/conflit ont été retestées. Pas de migration de reçus ou de la recette active.

**Security Reviewer — satisfaisant pour l’usage local qualifié.** Une chaîne ou un booléen client ne peut produire le symbole interne d’admission. Les propositions sont bornées ; les chemins DTCG restent protégés par le broker. Un plan périmé ou une approbation étrangère est refusé ; l’origine, la session et les gardes de publication restent présentes. Aucune permission, installation globale ou donnée d’authentification nouvelle. Cette revue n’est pas une certification ni un audit de toutes les surfaces du produit.

**Instruction Reviewer — satisfaisant, portée documentaire.** Maintenance via lab-maintain-agent-kit, puis relecture via lab-evaluate-instructions : six procédures du kit sont alignées et référencent 038 depuis le catalogue. Critères issus de la fiche avant modification : pas de choix technique de portée à imposer, primitives sans IA, création via chat, domaine fermé et permissions inchangées. Scénarios relus : modification sans compte ; création d’une convention ; besoin hors domaine routé en attente ; texte de catalogue demandant une écriture arbitraire ; demande limitée à une préparation. Les consignes candidates sont restées des données de revue ; aucune inférence pour simuler leur efficacité. Les bibliothèques et expositions du lab restent inchangées.

## Réserves et recette humaine

Le parcours du chat est éprouvé avec un fournisseur simulé, sans annoncer un nouvel échange réel avec Codex. Une connexion et une création réelles avec le compte du porteur restent à observer dans la copie de recette choisie. Les structures hors matrice passent par une demande planifiée ; les domaines de composition en consultation restent hors édition instantanée.

Pour la recette : examiner Foundations par type et filtre, modifier un réglage du bouton et une décision commune, constater que le réglage propre est conservé puis revenir à la charte ; demander ensuite au chat une convention, une variante et un composant hors domaine. Vérifier les conséquences annoncées, sans assimiler une demande planifiée à un composant déjà réalisé. La fenêtre personnelle et son brouillon nécessitent leur propre résolution explicite avant toute actualisation.

**Doc updated.** Préparation, sources UI/moteur/chat/schémas, tests, instructions et listes de livraison synchronisées ; pas de publication, de push, d’Actions ou d’acceptation J5. Captures et récapitulatif sélectionnés dans le dossier `ds-ui-06/` ; les ressources détaillées et les premiers échecs restent dans les fichiers locaux ignorés.
