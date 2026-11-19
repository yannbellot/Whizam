# DS-EDIT-62 — Actions et badges de composants

2 novembre 2026 — application, base `9777e7c`. Mandat : renommer Rétablir la référence de base en Annuler, supprimer le contrôle Voir le style d’origine, présenter les liens de composants en badges. Le comportement de rétablissement existant est conservé : Annuler concerne le réglage sélectionné et rejoint sa référence de base/sémantique courante ; ce n’est pas un abandon global. Liens, compte, annotations et navigation restent inchangés.

Procédure applicative implement-feature et revues design/technique, version qualifiée 9777e7c, catalogue déjà consulté. Même agent séquentiel, non indépendant ; lecture sécurité proportionnée, pas de nouvelle entrée ni permission. Contrôles ciblés : rendu et parcours Attribution/action, lint/formatage. Préexistants et modèles app préservés. Recette à actualiser sans perte de brouillon. En revue — qualification technique acquise, acceptation humaine différée ; Doc updated. Aucun déploiement distant.


Qualification : quatre tests de rendu réussis ; six parcours compilés desktop/mobile réussis (clavier/Annuler, absence de comparaison, badges liens et retour au brouillon). Types/lint sur copie isolée de fichiers suivis conformes, formatage ciblé et diff conformes. Les scénarios historiques de comparaison ont été retirés des parcours affectés ; les assertions de rétablissement et de préservation restent actives. Premier essai du parcours de disposition : ordre des assertions à adapter après retrait de la comparaison, corrigé puis six parcours réussis.

Revues design/technique satisfaisantes, séquentielles non indépendantes : badges à contour discret, href et focus natifs conservés ; compteur et annotations inchangés. Aucun changement de moteur de rétablissement. Lecture sécurité : pas de nouvelle destination ni permission. Limites : rendu compilé Chromium, pas de lecteur d’écran ou appareil tactile réel. Logs dans `.local/ds-edit-62/`.

Recette : un brouillon #8a3b11 est encore présent dans Field Disabled ; aucun rechargement ou abandon effectué. Réalisation concrète et testée ; seule l’actualisation de cet onglet attend un choix explicite pour préserver le travail existant. Reprise : choix sur le brouillon puis recette humaine. Valeurs enregistrées et modèles app intacts, publication désactivée.


Actualisation autorisée : abandon du brouillon expressément demandé. Recette 54138 sur `97421bc`, arrêt propre et récupération officielle, trois fichiers de programme installés, génération conforme puis relance détachée. Dix hashes de valeurs inchangés, aucun reçu ni transaction ajouté. Safari : alerte de navigation confirmée, Génération chargée et Données à jour, bouton Annuler visible et comparaison retirée. Badges liens vérifiés par les parcours compilés. Les 18 styles et 188 tokens de recette sont conservés. Doc updated ; reprise : recette humaine. Préserver tout brouillon ultérieur avant un futur rechargement. Aucune publication.
