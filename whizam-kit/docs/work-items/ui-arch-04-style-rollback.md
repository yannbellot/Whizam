# UI-ARCH-04 — Retour au design antérieur

**Cible :** application, copies fictives user-test-1qr84x et run-Ag62zM ; suivi racine du lab.  
**Mandat du 15 novembre 2026 :** annuler les changements visuels à partir du message « applique le design de React Aria par defaut sans aucune personalisation », conserver les correctifs de chargement. Réponse explicite du porteur : « Annuler les changements visuels, conserver les correctifs de chargement ».  
**Statut :** En revue — annulation visuelle réalisée, qualification technique acquise, recette visuelle différée. Base ba1d2d4, branche codex/ui-arch-04-style-rollback ; racine vérifiée, arbre suivi propre et 75 entrées non suivies préexistantes exclues.

## Décision et périmètre avant écriture

Référence visuelle : ec4ab75, après UI-ARCH-04, avec le formulaire fictif FormFeedback et les styles historiques raccordés aux tokens. Les choix Tailwind/React Aria de UI-ARCH-03/04 restent acquis ; seul l’habillage officiel ultérieur est retiré. Aucun reset Git, suppression d’historique, rollback de base métier ou changement d’Electron.

Restaurer les sources sélectionnées à partir des sauvegardes antérieures et du commit de référence ; archiver les sources remplacées et les ajouts dans un dossier local ignoré. Retirer les branchements visuels du thème après comparaison des autorités ; préserver les tokens et reçus. Le test de compatibilité décrit ci-dessous décide des fichiers historiques à conserver. Aucune modification privée ou récente ambiguë ne sera écrasée. Garder le binaire macOS corrigé, son magasin web temporaire/rechargement et la génération des dérivés propres à tool. Conserver les fenêtres existantes ; une actualisation ne vaut pas remplacement du bundle.

Les deux projets correspondent aux empreintes des dernières recettes qualifiées ; aucun écart détecté sur les sources contrôlées. user-test-1qr84x contient huit reçus, run-Ag62zM aucun. Le starter canonique n’a pas reçu la normalisation visuelle ; ses sources fonctionnelles restent intactes.

## Procédure et qualification prévue

Catalogue applicatif consulté à ba1d2d4 : backup-and-rollback, test-user-flow, technical-review ; procédures du kit utilisées explicitement pour cette réalisation app. Rôle Builder puis revues successives, même agent non indépendant ; pas de sous-agent. Réflexion recommandée Élevée selon la réponse précédente, sans prétendre vérifier le réglage client.

Construire un plan fermé des chemins, vérifier les empreintes, sauvegarder, qualifier d’abord une restauration sur copie isolée. Régénérer les dérivés sans les éditer, vérifier types et compilations app/Storybook, reprise des journaux et conservation des tokens préexistants. Arrêter uniquement les services concernés avant restauration des copies actives, relancer aux mêmes ports, reconstruire les seuls assets du chat. Vérifier l’apparence et le formulaire, puis qualifier le diff documentaire et intégrer localement. Aucune publication.

La source visuelle est le commit ec4ab75 complété par les six fichiers fictifs sauvegardés avant les styles officiels ; les correctifs techniques ultérieurs sont conservés explicitement. Anciennes preuves visuelles archivées et signalées comme remplacées, sans les supprimer. Résultats, commandes et réserves à consigner avant clôture.


## Ajustement sur preuve et résultat

Le retour intégral du lecteur a été refusé par les reçus existants : ils référencent les fichiers du thème ajoutés durant les essais. Un journal copié conserve aussi son identité de racine et ne peut pas être repris ailleurs. Aucun de ces contrôles n’est contourné. Le retour visuel compatible conserve donc les lecteurs/manifeste et les données historiques, retire leurs consommateurs visuels et relit les huit reçus dans leur racine d’origine. Les deux autorités DTCG restent identiques, avec 675 nœuds chacune ; les 34 ajouts du thème ne sont pas supprimés. Aucun reçu réécrit.

[Bilan, captures et limites](../reviews/ui-arch-04-style-rollback/README.md), [qualification](../reviews/ui-arch-04-style-rollback/qualification.json). Candidat compatible : types et deux builds conformes, 18 tests réussis. Reprise réelle des writers et types de la seconde copie conformes ; chat recompilé. UI Lab, Codex et retour UI Lab chargés dans le bundle existant ; formulaire app et Storybook validés puis remis à leur état initial. Fenêtre laissée sur UI Lab, serveurs conservés aux mêmes ports. 42 sources restaurées, 112 fichiers de normalisation archivés ; sauvegardes et empreintes disponibles. Sources fonctionnelles canoniques et correctifs de chargement conservés.

Doc updated. Prochaine action : vérification visuelle humaine sur la recette restaurée ; aucun chantier supplémentaire, publication ou Electron.
