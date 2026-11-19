# Spécification — Projets fictifs

**P3-01, avant implémentation.** Référence : brief, contrat de données P1-03, décision 006 et REF-01/02/03. Hypothèses réversibles, acceptation humaine différée.

## Règles et accès

- Routes /projects (liste), /projects/new, /projects/:projectId et /projects/:projectId/edit. Liens depuis l’accueil et vers le laboratoire. Chaque page annonce « démonstration locale sans comptes » ; aucune isolation entre utilisateurs revendiquée.
- Nom requis après trim, 1–100 caractères ; description facultative après trim, 0–2000. Les doublons de noms sont autorisés. Aucun HTML interprété ; les chaînes sont affichées comme texte. Identifiants et dates sont produits côté serveur, pas modifiables depuis un formulaire.
- Liste du plus récemment créé au plus ancien, UUID comme départage déterministe. Afficher les libellés, pas uniquement les identifiants. Dates UTC, formats français. Les listes longues restent une limite documentée ; pas de pagination inventée.
- Création : insert puis redirection 303 vers le détail avec confirmation. Modification : retrouver le projet, appliquer seulement nom/description, conserver id/createdAt et mettre updatedAt à l’heure serveur. Projet absent : 404. UUID malformé : 400 avant requête base. Aucun bouton ni endpoint de suppression.
- Lectures et écritures limitées aux hôtes de boucle locale ; les écritures exigent un Origin identique à l’URL serveur et refusent Sec-Fetch-Site cross-site. Aucun CORS ouvert. POST seulement pour les actions ; autres méthodes refusées. Formulaires URL-encodés, maximum 16 KiB lus côté serveur, sans fichiers ; champs inconnus/répétés refusés. Cette protection ne crée pas une authentification.
- Erreurs de stockage : statut 503 et message expurgé, saisie conservée en création/édition et nouvel essai possible ; aucune URL privée, requête SQL ou pile exposée. Sans stockage, aucun faux succès. Réponses de projets non mises en cache.

## Interactions et états

1. Liste : titre « Exemple de projet test », lien d’entrée explicite depuis l’accueil et navigation cohérente. Une explication indique que la page démontre les formulaires et l’enregistrement de fiches fictives, sans créer de nouvelles applications. Un lien permet de créer une fiche. Vide : message explicite et action créer. Chargement de navigation : annonce discrète ; la liste dépend réellement de PostgreSQL.
2. Formulaire : libellés visibles, aide sur limites, nom requis, description multiligne. Envoi : Button loading désactivé ; annuler revient à la liste ou au détail, sans écrire.
3. Validation invalide : code 400, résumé d’erreur annoncé/focalisé, erreurs reliées aux champs et valeurs saisies conservées. Le serveur valide même lorsque le navigateur contourne ses contraintes HTML.
4. Succès : détail et confirmation après action, lien modifier et retour liste. Un rechargement relit PostgreSQL ; les paramètres de confirmation sont de simples retours UI, pas une preuve autonome d’écriture.
5. Stockage indisponible : message d’erreur et retour/réessai ; erreur simulable en arrêtant uniquement PostgreSQL d’une campagne jetable identifiée, puis reprise après relance. Aucun mode d’erreur activé sur ressource partagée.
6. Formats 390 × 844 et 1280 × 800, navigation clavier, focus visible, libellés et texte long. Les confirmations et états sont présentés aussi en stories sans base ; une story ne vaut pas parcours persistant.

## Critères de réussite

- CA-01 : base vierge = liste vide ; seed répété = deux projets sans écrasement.
- CA-02 : créer puis recharger le détail et retrouver exactement nom/description ; HTML/script affiché comme texte.
- CA-03 : modifier puis recharger et relire la même fiche, id/createdAt conservés et updatedAt actualisé ; retrouver la modification après redémarrage applicatif.
- CA-04 : noms vides/longs, description trop longue, champs inconnus/répétés, UUID invalide, absence de ressource, mauvaise origine/méthode/type de corps et corps trop grand : refus sans écriture.
- CA-05 : états vide/invalide/en cours/succès/erreur reproductibles ; saisie conservée sur erreur ; reprise après stockage relancé.
- CA-06 : composants/tokens partagés et stories synchronisés ; parcours clavier/deux formats sans débordement ni erreur console inattendue.
- CA-07 : types, lint, format, tests unitaires/intégration/E2E et builds application/Storybook réussis ; preuves versionnées et limites réelles annoncées.
- CA-08 : procédure de remplacement de l’exemple et petit exercice de reprise sans conversation préparés. L’essai humain réel est différé à P5-05 et ne peut pas être simulé.

## Plan et preuves

P3-02 : conserver la migration initiale suffisante, ajouter validation/contrat HTTP/repository serveur et tests réels lecture/création/modification/absence, sans changement arbitraire du schéma. P3-03 : routes, formulaires/états et styles J2. P3-04 : base Docker synthétique dédiée pour les tests navigateur, identité/labels contrôlés, démarrage/arrêt/reprise de ses seuls services et nettoyage final ; tests négatifs serveur distincts. P3-05 : stories/usage/remplacement. P3-06 : reprise autonome limitée puis exercice humain à préparer.

Revues requises : Design Reviewer, Technical Reviewer / QA et Security Reviewer. Exécution séquentielle par le Builder si aucune délégation autorisée ; ne pas revendiquer d’indépendance. La sécurité vise cette démonstration locale, pas un pilote public.

## Évolution rédactionnelle P4-04

Proposition limitée et réversible : en liste et détail, une description vide affiche « Ce projet ne comporte pas encore de description. ». Cette phrase n’est jamais enregistrée comme donnée. Story et parcours réel vérifient le même rendu après rechargement ; règles, accès et schéma inchangés. Acceptation rédactionnelle différée à la recette finale.
