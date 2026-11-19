# UI-FINAL-01 B — Espace Loomata intégré

10 novembre 2026 — **Tranche B réalisée et techniquement qualifiée, En revue pour acceptation humaine.** [Versions, contrôles et réserves](qualification.json). Le livrable testé est Loomata elle-même, construite dans `/application`, sans nouvelle application métier. C–F restent à réaliser. Les anciens exercices Prêts d’objets ne constituent pas cette preuve.

## Résultat

Une fenêtre Loomata ouvre UI Lab, Storybook et l’aperçu du dossier actif avec trois WKWebView conservées en mémoire. Changer de vue ne recharge pas l’atelier. Le contexte du dossier, les menus Édition/Présentation et les confirmations de fermeture/arrêt sont natifs. Accueil et Actualiser sont disponibles dans Présentation ; recharger l’atelier avec un brouillon valide demande confirmation, avec conservation par défaut.

Le port commun fournit les URLs validées depuis le superviseur : HTTP strict, 127.0.0.1, ports distincts et chemins initiaux attendus. L’aperçu est le vrai `/` du serveur du dossier sélectionné. Aucun nouvel endpoint privilégié ni deuxième writer n’est ajouté. Storybook et l’aperçu n’obtiennent pas le bootstrap DS. Les nouvelles capacités projet/IA/export restent indisponibles.

Le lanceur source construit un bundle local signé ad hoc avec un SDK installé compatible, prépare/réutilise la configuration privée et démarre le même superviseur. Une réouverture réutilise le bundle et l’instance ; une version native modifiée ne remplace pas silencieusement une app ouverte. Le bundle contient ses chemins de lancement locaux et s’ouvre sans arguments. Node reste fourni par le poste, hors bundle ; aucune distribution finale n’est revendiquée.

## E2E exécutés

[Douze scénarios AppKit/WKWebView](native-e2e.json), vrais services et source du socle copiée dans une fixture isolée : ouverture, démarrage idempotent, trois vues internes, identité du document conservée avec brouillon, confirmation de rechargement, annulation DS relayée par feuille native, sauvegarde effective/relecture, mise à jour du Storybook déjà ouvert, refus de navigation distante/croisée, conservation lors d’un arrêt/fermeture annulés, menu Quitter annulé, puis arrêt confirmé/redémarrage et valeur sauvegardée retrouvée. Les actions sont pilotées dans AppKit et les documents réels ; elles ne sont pas des clics physiques ni une recette humaine indépendante.

Les lecteurs sont aussi contrôlés par HTTP : pas de meta de capacité ; écriture refusée en 403 côté aperçu et 404 côté Storybook. Les tests n’ont écrit que les tokens de leur propre copie jetable, jamais le DS de fabrication. Les autorités et la liste de chemins du manifeste fermé n’ont pas changé ; aucun reçu n’a été converti/purgé.

Sur le candidat : **149 unités, 34 parcours web de l’atelier, 4 tests du service et 9 du superviseur** réussis. Format, lint et typecheck réussis. La régression web a d’abord échoué faute de binaire dans le cache vide créé par le runner ; réutilisation par copie du navigateur déjà installé, puis 34/34. Aucun téléchargement, changement de dépendance ou test retiré.

## Vérification du vrai `/application`

Le lanceur et le bundle de revue ont été ouverts directement sur le dossier source, après autorisation Documents accordée par le porteur. Le diagnostic de chargement du bundle final confirme `interactive: true`, sans erreur de chargement. Les trois boutons natifs ont été activés via Accessibilité et les trois vues capturées dans la même fenêtre ; retour à UI Lab et réouverture du même bundle vérifiés. [UI Lab](loomata-ui-lab.png), [Storybook](loomata-storybook.png), [aperçu réel du socle](loomata-preview.png).

Une sonde native supplémentaire en lecture seule a aussi parcouru les trois vues sur la source. Ses premières attentes sur le libellé du catalogue et une capture ultérieure ont échoué/expiré ; elles restent conservées dans les artefacts privés et ne sont pas comptées comme réussites. La vérification finale ci-dessus porte sur le bundle normal autorisé, pas sur une capture de chargement présentée comme prête.

Les demandes d’accès macOS étaient réelles. La signature ad hoc des builds de développement peut provoquer une nouvelle demande : aucune préférence de confidentialité n’a été modifiée par l’agent. Les essais ont désormais une identité distincte de la revue et le lanceur réutilise le bundle stable. Le SDK par défaut ne correspondait pas au compilateur : le [journal des tentatives](sdk-attempts.json) montre le repli borné sur le SDK 26.5 déjà installé, sans changement global.

## Revues et limites

Revues design, technique et sécurité ciblée **séquentielles, même agent, non indépendantes**. Captures et diff relus, flux des URLs jusqu’aux WKWebView et de la sélection locale jusqu’au service examinés. Les pages n’envoient aucune commande à l’hôte. Le seul état web lu pour protéger un rechargement est le signal de brouillon ; aucune capacité de sauvegarde n’est transférée au natif. Les diagnostics bornés restent dans les fichiers locaux ignorés. Pas d’anomalie bloquante connue dans le parcours B après retest.

L’aperçu affiche l’accueil réel du socle actuel, dont le contenu de démonstration. Les pages `/projects` exigent une base métier ; le superviseur UI Lab/Storybook conserve son isolation sans DB. Leur orchestration complète appartient à C. Il ne s’agit pas d’une liste de projets créés dans Loomata. Aucun nouveau métier n’a été développé pour cette tranche.

La création de projets, le chat général et les connexions natives de fournisseur, les ZIP, Node/npm embarqués, signature de distribution, installation Dock permanente et mises à jour restent non livrés. La navigation externe et les nouvelles fenêtres web sont refusées ; l’authentification par popup n’est pas qualifiée dans cette enveloppe. Les menus utilisent AppKit et les outils web gardent leur DS existant ; la composition native reste une hypothèse visuelle à accepter. VoixOff/VoiceOver et clavier physique exhaustifs non exécutés.

Fermer confirme les risques, ne sauvegarde rien et laisse les services actifs ; leur arrêt se demande explicitement depuis l’app ou le service commun. Cette sémantique de développement n’est pas un service d’ouverture de session. Les anciennes recettes CORE-01 et autres instances n’ont pas été arrêtées. Les propres processus des campagnes sont nettoyés, sources/logs conservés dans `.local/ui-final-01-b/` ; seul le bundle normal et les services du socle restent ouverts pour revue.

## Reprise

Depuis le socle préparé sur macOS : `npm run loomata`. Le chemin du bundle courant est dans `.runtime.local/loomata/latest.json` et peut être ouvert depuis Finder. Le déplacer seul ne constitue pas une distribution : ses chemins Node/client/dossier restent ceux de cette préparation locale. Sur un dossier déjà configuré, ne pas supprimer de reçu/verrou pour faire démarrer une autre version ; employer les procédures existantes.

Pour rejouer les E2E : `npm run test:loomata`, session graphique et outils Apple requis. Le pilote lance un bundle de test par CLI, avec identité distincte, sur sa propre copie et ferme ses seuls services. Le parcours de lancement Finder a été vérifié séparément avec le bundle normal et l’autorisation macOS du porteur. Le prototype CORE-01 reste conservé comme preuve historique.

Reprise produit : tranche C, opérations de projets et orchestration, selon la [fiche](../../work-items/ui-final-01-complete-assisted-cycle.md). Pas de clôture globale UI-FINAL-01, CORE-01 reste clos, J4/J5 inchangés. Aucune publication. **Doc updated.**
