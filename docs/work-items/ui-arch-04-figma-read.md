# UI-ARCH-04 — Lecture Figma de la recette macOS

**15 novembre 2026 — Cible application, recette run-Ag62zM.** Base b2b040b, branche codex/ui-arch-04-figma-read ; racine vérifiée, arbre suivi propre et 75 entrées non suivies préexistantes exclues.

## Mandat et cause avant correction

Diagnostiquer et corriger le refus « Lecture non confirmée » après le retour au design antérieur, sans remplacer les fenêtres, modifier les accès ou lancer Electron. Procédure diagnose-incident du catalogue applicatif consultée, même agent ; pas de délégation. Lectures des autorités et suivi déjà effectuées à la même base.

Cause confirmée en lecture seule : file-status retourne HTTP 503 / service-unavailable. Le garde WorkspaceStore.assertRoot renvoie workspace-git-root-mismatch : la copie fictive n’a pas de dépôt Git propre et Git détecte celui du lab parent. Le chemin file-browse passe par cette même garde avant la lecture Figma. L’échec ne démontre donc pas un défaut du lien ou des droits Figma. Le message générique masque ce refus local.

## Correction minimale prévue

Initialiser uniquement le dépôt Git local de cette copie, en conservant son identité, ses fichiers, ses sources et journaux. Aucun bootstrap d’inventaire, commit de données, import ou accès fournisseur nécessaire pour rendre file-status utilisable. Ne pas désactiver le garde, changer les permissions ou réécrire les reçus. Le code canonique et l’habillage restauré restent inchangés.

Vérifier avant/après la garde et l’API authentifiée locale, sans enregistrer le HTML de session ni afficher le jeton. Si l’état confirme l’absence de connexion, tester le refus explicite sans jeton, sans appel Figma. Une lecture réelle du fichier du porteur n’est pas qualifiée sans son accès via l’interface. Aucun secret à demander dans le chat.

**Statut :** En revue — correction locale qualifiée, lecture Figma réelle à retester avec le jeton saisi dans l’interface. Doc updated.

## Résultat et preuves

Initialisation du seul dépôt Git local de run-Ag62zM/project, sans commit de ses sources ni bootstrap d’inventaire. Le garde assertRoot accepte maintenant la racine. Le même appel authentifié file-status passe de HTTP 503 / service-unavailable à HTTP 200 ; connected=false et aucun cache. Le refus file-browse sans jeton est vérifié : HTTP 422 / figma-connection-required. Ce contrôle ne contacte pas Figma. Aucun jeton ni HTML de session conservé dans les preuves.

Les empreintes d’App, de l’identité du projet et de l’autorité DTCG sont identiques. Aucun journal modifié, code applicatif/canonique changé, service redémarré ou fenêtre remplacée. Pas de nouvelle compilation nécessaire pour cette correction de préparation ; aucun résultat de lecture distante revendiqué. Les protections et l’habillage restauré sont conservés.

Revue technique/sécurité séquentielle par le même agent, non indépendante : identité Git réelle établie, garde maintenu, absence de connexion correctement refusée, aucune persistance de secret déclenchée. Preuves expurgées : docs/reviews/ui-arch-04-figma-read.json. Logs locaux ignorés sous .local/ui-arch-04/figma-read/. La préparation d’une future recette utilisant Figma doit vérifier son dépôt Git propre avant de la présenter comme prête à lire les références.

Prochaine action utilisateur : saisir de nouveau le jeton Figma dans le champ de l’app puis relancer Lire le fichier. Ne pas envoyer ce jeton dans le chat. La lecture réelle et les droits du fichier restent non vérifiés à ce stade. Aucun autre chantier ni publication.



## Test réel fourni par le porteur — 15 novembre 2026

Le porteur fournit le lien et un jeton pour reproduire l’échec. Test direct sur api.figma.com puis via l’API locale de la même recette : Figma renvoie HTTP 403 avec le motif exact « Invalid token » ; Loomata renvoie HTTP 422 / figma-access-denied. Le prérequis Git local est donc levé, mais Figma n’accepte pas le jeton fourni. Les droits et le contenu du fichier ne peuvent pas être qualifiés avec ce jeton.

Aucun jeton, contenu de fichier ou URL privée ajouté aux documents, logs de diagnostic ou fichiers du projet. Jeton transmis en entrée masquée aux processus de test, hors arguments système, et retiré de la mémoire de travail. Aucun cache ou connexion sauvegardé par la lecture refusée ; l’implémentation n’enregistre le jeton qu’après une lecture réussie. Un premier essai réseau dans le REPL a échoué ; le même appel via le runtime autorisé a obtenu la réponse HTTP explicite ci-dessus. Aucun contrôle d’accès modifié.

Statut actuel : en attente d’un jeton accepté par Figma ; test du refus réel qualifié. Prochaine action : générer un nouveau jeton personnel avec file_content:read et le saisir directement dans l’app. L’authentification requise est décrite dans la documentation officielle : https://developers.figma.com/docs/rest-api/authentication/. Aucun changement applicatif ou nouveau build justifié par ce refus de credential. Doc updated.
