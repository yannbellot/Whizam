# DS-EDIT-16 — Catégories et règles communes des tokens

31 octobre 2026 — cible application, réalisation autorisée. **En revue — qualification technique acquise, acceptation humaine différée.** Base `b32f5dba8000058ab385c252e6535d8158cc906f`, branche `codex/ds-edit-16-token-categories`, racine Git canonique vérifiée. Aucun diff suivi initial ; 61 fichiers non suivis préexistants préservés et empreintes privées relevées. Recette DS-EDIT-15 conservée avec ses huit sources, dont `#b51a00` ; aucun journal/compte transporté.

## Mandat et critères

Appliquer les catégories anglaises validées aux primitives, sémantiques et composants ; vocabulaire contrôlé, intention/variante/état distincts, hiérarchies définies, associations documentées, modes séparés et activation sur usages réels. Préserver toutes les identités, références, valeurs, attributions, provenances, alias et rendus. Les catalogues changent leur organisation, pas les composants qu’ils décrivent.

Périmètre : catalogue d’autorité et son schéma, terminologie, classement pur, validation/génération/documentation, catalogues Storybook et fiches, manifeste du writer, tests et procédures directement affectées. Suivi de fabrication dans le parent ; modèles ROADMAP/état de l’app non initialisés. Aucun thème, nouveau type éditable, traduction, valeur, palette, composant, backend, compte, inférence fournisseur ou publication ajouté implicitement. Les familles futures sont documentées sans faux tokens ni groupes vides affichés.

Choix délégué : le catalogue conserve les intentions historiques et ajoute une taxonomie de présentation contrôlée. Elle distingue type technique, domaine, usage et intention ; ne déduit jamais un sens d’une valeur ou d’une couleur. Un usage partagé non spécifié reste dans son parent. Les composants sont classés par `contract.targets[].component`, y compris le propriétaire Foundations des réglages de fondation, sans renommer leurs bindings. Ancien état de composant `error` documenté comme validation, distinct de l’intention `information-result.error`. Les modes restent des axes déclarés non activés, sans produit cartésien ni nouveau comportement.

## Méthodes et configuration

Lab Maintainer via lab-maintain-agent-kit ; méthodes app normalize-design-system/implement-feature et revues design/technique/sécurité sélectionnées explicitement depuis `b32f5db`, après lecture du catalogue app. Instruction Reviewer via lab-evaluate-instructions si procédures synchronisées ; distribution ciblée via lab-qualify-distribution. Rôles séquentiels, même agent, non indépendants ; aucune délégation. Recommandation réutilisée : GPT-6.1 Sol, très élevée autorisée dans ce fil pour les contrats de tokens/persistance ; réglage client non vérifié, aucun changement de configuration.

Dimensions inspectées : résultat taxonomique global ; chemins YAML → contexte → snapshot → catalogues/docs ; frontières du snapshot fermé et manifeste writer ; conservation des modèles/opérations v3/protocole 2 ; inconnue de classement des usages partagés résolue par maintien au parent. Préférer les métadonnées à une migration supplémentaire des identifiants.

## Contrôles prévus

- Taxonomie fermée : anglais, chemins uniques, dictionnaire, portée/type/rôle, références absentes, classement ambigu, modes non activés et groupes vides.
- Comparaison exacte des modèles/valeurs et CSS générée ; quatorze captures des composants avant/après ; 188 raccordements.
- Types, lint, formatage, contrats/unitaires/docs, writer/HTTP et récupération adaptés au nouveau manifeste ; parcours desktop/mobile des catalogues, sélection et édition/persistance.
- Extraction autonome ciblée et liens internes ; préexistants et sources de recette identiques ; diff/secrets avant commits et intégration locale. Revues et limites dans une preuve dédiée, acceptation humaine différée.

Point de reprise : établir le témoin immuable et les empreintes ; implémenter le classement et ses contrôles, puis les vues et preuves. **Doc updated.**

## Point technique avant extraction

Structure et règles raccordées ; modèle, alias, contrat, présentations et CSS identiques au témoin. 14 captures strictes et 188 raccordements conservés. Contrats 62, unitaires 123, documentation 5, assistance simulée 10 ; dev 23+1 saut et statique 21+3 sauts par format. Persistance desktop 14, cycle mobile 1, builds/relecture compiled deux formats ; quatre récupérations réelles réussies en série. Les retests desktop finaux attendent le tableau prêt et passent sans autre Storybook de test concurrent.

La campagne de writer a révélé un socket HTTP coupé lors d’une publication lente : le délai de lecture continuait après réception du corps. Reproduction isolée en échec, correction limitée à request.setTimeout(0) à la fin du corps ; sept tests HTTP réussis après correction, dont refus d’envoi incomplet. Les 72 cas store de la dernière campagne passent ; son seul échec HTTP est corrigé et retesté dans le périmètre. Aucun budget de lecture ni protection d’accès assoupli.

Le premier cache Chromium et la concurrence de Storybook ont été diagnostiqués ; logs/fixtures d’échec conservés, serveur de test orphelin arrêté après preuve PID/port/racine. Sources de recette et 61 préexistants identiques. Instruction Reviewer a fait préciser la génération sur copie isolée pour les deux reviewers ; aucune correction implicite de source. Extraction du candidat immuable et recette neuve sans compte restent à vérifier avant intégration locale. **Doc updated.**


## Clôture technique

Candidat runtime 8533ef3 ; test d’extraction portable a13d301a62b219757564393996806553895f6032, arbre app a7955353d4d7eb2bddb32e1ba3023fd051bc1fd7. Extraction avec installation autonome hors ligne, 62 contrats, types et deux builds ; renommage/déplacement et comparaison des 384 sources conformes. Les 14 captures et 188 raccordements repassent dans le kit déplacé. Quatre récupérations réelles réussies sur le candidat final ; douze parcours applicatifs réussis. Défauts de test d’URL et de sorties partagées corrigés/isolés sans réduction des assertions ; le défaut HTTP est reproduit avant correction puis couvert par sept tests.

La nouvelle recette locale 54118 conserve les 188 réglages, 41 styles et 24 alias enregistrés de DS-EDIT-15, dont #b51a00. Modèles/artefacts identiques et capture du bouton identique à l’ancienne recette ; sélection/catégories et Rules vérifiés aux deux formats, zéro erreur de page. Anciennes racines, reçus, comptes et 61 préexistants préservés ; aucun transfert de connexion ni publication.

[Preuves finales et revues](../reviews/ds-edit-16-token-categories.md), [qualification structurée](../reviews/ds-edit-16/qualification.json). Revues design/technique/sécurité/instructions/distribution séquentielles non indépendantes, limites consignées. **Doc updated.** Intégration locale dans main puis restitution ; prochaine action : recette humaine des catégories et fiches, sans nouveau chantier ouvert. G/J5 et modèles applicatifs de suivi préservés.
