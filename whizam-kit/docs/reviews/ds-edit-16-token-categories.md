# DS-EDIT-16 — Catégories et règles communes

31 octobre 2026 — cible application, base b32f5db, branche codex/ds-edit-16-token-categories. [Mandat](../work-items/ds-edit-16-token-categories.md), [décision 021](../decisions/021-token-categories-and-common-rules.md), [référence commune](../design-system/token-organization.md), [données générées](../design-system/token-taxonomy.md). **En revue — qualification technique acquise, acceptation humaine différée.** Candidat runtime 8533ef3 ; test portable corrigé dans a13d301a62b219757564393996806553895f6032, arbre app a7955353d4d7eb2bddb32e1ba3023fd051bc1fd7. Les preuves suivantes sont documentaires.

## Résultat observé

Les catégories Primitives, Semantic tokens et Component tokens sont anglaises. Groupes peuplés seulement, chaque identité une fois, propriété du composant d’après son nom officiel ; Foundations conserve ses réglages. Les usages partagés non spécialisés restent au parent. Le catalogue de confiance contient la taxonomie fermée, les définitions/exemples des rôles et termes, les six règles et quatre axes non activés. Aucune nouvelle palette, valeur, propriété éditable, thème ou traduction n’est déduite des exemples.

Les fiches séparent catégorie, intention/rôle/état ou variante/partie/propriété/état. La story Rules et le document généré exposent vocabulaire, modes inactifs et associations par contexte, avec références et valeurs exactes. Les paires de couleurs déclarées ont un ratio mesuré ; fond hérité ou icône absente reste Not measured. Les ensembles typographiques et géométriques restent documentés avec leurs tokens ; aucune correction de contraste ou de valeur dans ce mandat.

Modèle, alias, contrat et présentations strictement identiques au témoin autonome. CSS générée identique octet par octet. Les 25 primitives, 41 styles, 188 bindings et 24 alias conservent identité, référence, valeur et provenance. Quatorze captures de composants sont strictement identiques, géométries/styles calculés identiques, et 188 raccordements modifient leur propriété réelle. La réorganisation des catalogues est le seul changement de présentation attendu.

## Contrôles exécutés

Environnement : macOS arm64, Node embarqué 24.22.1, Chromium 156.0.8078.4 ; dépendances existantes, aucune installation globale. Logs privés sous .local/ds-edit-16.

- Contrats : 62 tests réussis, dont sept nouveaux cas de classification, schéma fermé, routes, famille/type/rôle, états/modes distincts et création ultérieure.
- Unitaires : 123 réussis ; tous les tokens visibles une fois, sélection et canal existants conservés.
- Writer/HTTP : première campagne 77 réussis, avec trois points supplémentaires liés au nouveau dérivé ; les 72 cas store de la campagne finale passent. Son seul échec HTTP est reproduit puis corrigé, et les sept tests HTTP finaux passent (deux régressions ajoutées).
- Documentation : cinq tests réussis, incluant les données adversariales dans le nouveau dictionnaire et les trois dérivés sauvegardés/relus.
- Assistance : dix transports simulés réussis ; aucun fournisseur réel ou compte sollicité.
- Développement : 23 réussis et un saut conditionnel par format ; retest final ciblé desktop trois réussis.
- Statique : 21 réussis et trois sauts conditionnels par format ; aucune sauvegarde ou inférence.
- Persistance desktop : 14 réussis, puis build et relecture compilée ; cycle mobile ciblé du token réussi avec build/relecture aux deux formats.
- Types, formatage, deux builds conformes ; lint zéro erreur et un avertissement sur une copie non suivie préexistante préservée.
- Validateurs lab/app conformes et six tests lab réussis. Découverte native, efficacité des assistants, recette humaine et autre plateforme non nouvellement vérifiées.

## Diagnostics et reprises

Le premier test unitaire d’installation isolée a été refusé par le sandbox de ports ; retest avec accès réseau local limité réussi. Le nouveau troisième document a nécessité un payload adversarial explicite dans son vocabulaire pour conserver la preuve d’échappement de chaque sortie. Le chargement du tableau est désormais attendu explicitement avant les assertions de catégorie, sans sommeil arbitraire.

Des retests ont été perturbés par plusieurs Storybook de test simultanés raccordés aux mêmes dépendances locales : rechargements Vite observés pendant la sélection et l’attente de réponse de sauvegarde. La campagne desktop ciblée passe seule sans assouplir ses assertions. Le serveur orphelin du scénario de récupération interrompu a été arrêté après vérification PID/port/racine ; ses données restent conservées. Le premier essai de récupération utilisait aussi le mauvais cache Chromium ; le cache existant a ensuite été sélectionné explicitement. Les échecs/logs restent conservés ; les quatre récupérations réelles passent en série.

Le délai de lecture HTTP restait actif après réception du corps et détruisait une publication dépassant cinq secondes. La régression isolée échoue avant correction ; request.setTimeout(0) à la fin du corps suffit, puis sept tests HTTP réussissent, y compris une publication volontairement lente et un envoi incomplet interrompu. Aucun délai de lecture augmenté ni garde retirée.

## Distribution, recette et conservation finale

Extraction de 8533ef3 sans compte, journal, build ni dépendance copiée ; npm ci --offline --ignore-scripts installe 451 paquets dans sa propre racine. Validateur, types et deux builds réussis. Le premier contrôle du nouveau test échoue dans un chemin avec espace : le pathname URL conservait %20. a13d301 corrige le test par fileURLToPath, puis 62 contrats passent. Après renommage/déplacement en portable/renamed Kit : validateur, documentation, types et migration sans écriture conformes ; les 384 sources sont identiques au candidat. Les builds de runtime ne changent pas avec cette correction de test.

Une tentative de récupération finale a été interrompue par le nettoyage du dossier test-results effectué par la campagne applicative simultanée. Les campagnes partageant ces sorties sont désormais exécutées séparément ; quatre récupérations réelles passent sur le candidat final, avec sources d’origine inchangées. L’application compilée passe ses douze parcours. Aucun seuil, garde ou assertion retiré pour obtenir ces résultats.

Nouvelle recette locale sur le port 54118 : les huit sources v3 enregistrées de DS-EDIT-15 ont été copiées sous réservation de lecture, sans journal ni compte. Modèles et artefacts complets comparés identiques ; Button garde #b51a00 et sa référence primitive.color.hex-b51a00. Le bouton rendu de l’ancienne et de la nouvelle recette est aussi identique octet par octet en capture, et les catégories/sélection sont vérifiées desktop/mobile, avec Rules visible et zéro erreur de page. L’ancienne recette reste intacte. Les 61 préexistants et les huit sources ont les empreintes de départ.

[Capture desktop](ds-edit-16/catalog-desktop.png), [capture mobile](ds-edit-16/catalog-mobile.png), [preuve structurée](ds-edit-16/qualification.json). Les identifiants longs peuvent occuper plusieurs lignes sur mobile ; l’acceptation de cette lecture en table reste une recette humaine. L’installation réseau, les autres plateformes, un vrai appel IA et une reprise par un tiers ne sont pas revendiqués.

## Revues

Mode réel : séquentiel, même agent, non indépendant. Design Reviewer : organisation et sélection vérifiées desktop/mobile, rendu de composants conservé ; recette humaine distincte. Technical Reviewer/QA : trajectoire autorité → graphe → snapshot/catalogues/docs → sauvegarde/relecture vérifiée, anciennes racines conservées ; quatre récupérations réelles confirmées sur le candidat final après correction HTTP, sans interception ; extraction et reprise qualifiées. Security Reviewer : données bornées/schémas fermés, pas de texte exécuté, Markdown/React échappés, domaines/opérations/permissions inchangés ; le délai de lecture HTTP est borné au corps complet, avec refus d’envoi incomplet conservé ; aucun scan externe ni certification. Instruction Reviewer : six ressources synchronisées et deux procédures de revue précisées pour limiter la génération aux copies isolées, sans correction de source implicite. Distribution Reviewer : candidat extrait, installé hors ligne avec ses propres dépendances, construit puis renommé/déplacé et relu ; 384 entrées source identiques au candidat, 62 contrats, types, documentation et migration idempotente conformes après déplacement. Qualification ciblée macOS arm64 ; aucun nouveau test SQL/volume, code métier hors changement.

**Doc updated.** Pas de push, Actions, déploiement, transfert de compte ou initialisation des modèles de suivi de l’app. G/J5 et acceptation humaine distincts.
