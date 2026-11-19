> Historique : le parcours UI Lab décrit ici est retiré par DS-AUTO-01. Suivre le [README du kit](../../README.md) et la politique courante du design system ; aucune commande de writer de ce document n’est active.

# UI Lab comme app locale macOS

Le lanceur **UI Lab** démarre l’atelier et Storybook à deux adresses locales fixes, attend leurs serveurs puis ouvre **UI Lab Workspace**, une fenêtre Safari sans onglets ni barre d’adresse. Aucun serveur distant, compte IA ou accès GitHub n’est nécessaire.

## Utilisation quotidienne

Cliquer sur **UI Lab** dans le Dock pour démarrer les services. **UI Lab Workspace** seul ouvre la fenêtre sans démarrer son serveur : le lanceur et la fenêtre sont deux applications, donc deux icônes peuvent apparaître. Storybook démarre sans ouvrir automatiquement une seconde fenêtre ; son raccourci permet de consulter les composants et leur documentation.

Le premier chargement peut demander plusieurs dizaines de secondes, au-delà de la disponibilité des serveurs. La qualification macOS a rencontré un chargement initial prolongé des références, suivi d’un atelier complet ; sa cause précise n’est pas établie. Une page d’erreur déjà ouverte avant le lancement peut nécessiter son action de rechargement. Ne pas recharger un atelier contenant un brouillon sans décider de son sort.

Un second lancement réutilise les mêmes services. **Enregistrer** conserve explicitement les modifications dans les sources. Fermer la fenêtre laisse les services disponibles ; pour les terminer, enregistrer d’abord le travail puis ouvrir **Stop UI Lab** dans Applications ou Spotlight. Une demande à l’assistant reste possible.

Le brouillon en mémoire n’est pas une sauvegarde. Fermer, recharger ou redémarrer le Mac peut perdre un travail non enregistré. L’arrêt des services ne sauvegarde pas implicitement le brouillon. Un arrêt incomplet ou un port occupé reste signalé : aucun port de remplacement, arrêt de tiers, purge de verrou ou redémarrage en boucle n’est effectué.

## Préparation initiale

Opérations techniques depuis la racine réelle du kit, distinctes de chaque ouverture :

1. Disposer de macOS Sonoma 14 ou ultérieur et des outils Apple `osacompile`, `plutil`, `codesign`. La version effectivement qualifiée est consignée dans le bilan ; elle ne prouve pas toutes les versions de macOS.
2. Préparer les dépendances et un runtime Node/npm compatible selon le README. Le lanceur ne télécharge rien. Le bundle mémorise le chemin du Node utilisé à sa création : choisir celui du projet ou un runtime système stable, pas un outil jetable d’une autre copie.
3. Préparer les dérivés sur une instance inactive seulement. **Ne jamais générer avant la récupération d’un enregistrement interrompu** ; conserver l’outillage compatible selon le [contrat de persistance](../design-system/editor-persistence.md).
4. Choisir deux ports loopback distincts et disponibles, conservés pour cette instance. Valeurs par défaut : atelier 5173, Storybook 6006. Une collision n’est pas résolue silencieusement.
5. Créer une app web Safari à l’URL exacte `http://127.0.0.1:<port>/ui-lab` via « Ajouter au Dock », puis masquer ses commandes de navigation dans ses réglages. Cette opération écrit dans Applications du compte : annoncer cet effet et obtenir l’autorisation requise par l’environnement.

Exemple, en remplaçant ports et chemin par les valeurs réellement retenues :

```sh
sh scripts/with-runtime.sh npm run local:app -- configure --ui-port 5173 --storybook-port 6006 --web-app '/absolute/path/UI Lab Workspace.app'
sh scripts/with-runtime.sh npm run local:app:prepare
```

La seconde commande affiche un dossier `.runtime.local/local-app/launcher-*` contenant **UI Lab.app**, **Storybook.app** et **Stop UI Lab.app**. Elle ne modifie ni Applications ni le Dock. Après vérification et autorisation, copier ces bundles dans Applications du compte puis épingler UI Lab depuis Finder. Ne pas écraser un logiciel tiers de même nom. Les artefacts privés portent les chemins nécessaires ; ils ne sont pas distribués ni versionnés. Les descriptions génériques de permissions inutilisées du compilateur sont retirées, et les bundles reçoivent une identité par instance et une signature locale ad hoc, sans notarisation publique.

Apple décrit [les apps web Safari](https://support.apple.com/fr-fr/104996) et [l’ajout d’un élément Finder au Dock](https://support.apple.com/en-za/102650) avec Contrôle–Maj–Commande–T.

## Diagnostic, déplacement et retrait

`local:app -- start`, `status` et `stop` contrôlent les services sans ouvrir de fenêtre. `open` démarre puis ouvre l’app web associée, après contrôle de son identité Safari et de son URL. `storybook` démarre puis ouvre sa documentation. Le contrôle passe par un socket Unix privé, sans port réseau supplémentaire.

Le service UI Lab est prêt seulement s’il expose l’édition et la bonne identité de racine ; un HTTP 200 seul ne suffit pas. Cela ne mesure pas la fin d’hydratation de Safari. Storybook reste sans writer. Les hooks npm de génération ne sont pas exécutés au lancement ; les validations, gardes loopback et récupération du writer restent inchangées.

Demander à l’assistant de diagnostiquer `.runtime.local/local-app/services.log`, un journal privé à ne pas publier intégralement. Un arrêt inattendu d’un enfant termine son frère possédé, sans relance automatique. Si le superviseur lui-même est tué brutalement, un socket, propriétaire ou verrou peut subsister : la relance exige un diagnostic, sans purge ni signal envoyé sur la seule foi d’un ancien PID. `repair` n’est pas une récupération transactionnelle.

Pour déplacer la même instance : enregistrer, arrêter avec l’outillage d’origine, conserver configuration et reçus, déplacer le dossier puis lancer depuis la nouvelle racine `local:app -- repair` et régénérer les bundles. Réinstaller explicitement les raccourcis concernés et vérifier l’URL Safari. Une autre copie exige sa propre identité et ses ports, sans transfert de comptes ou journaux. Voir aussi [déplacement et sauvegarde](../../README.md#renommer-déplacer-ou-transmettre).

Arrêter la version active avant de remplacer son outillage. Aucun service d’ouverture de session n’est installé. Retirer les icônes et bundles ne supprime pas les sources ou données ; arrêter les services séparément avant désinstallation.

Contrôles développeur : `npm run test:local-app` pour les scénarios de cycle de vie et de refus avec services simulés ; `npm run test:local-app:live` pour une copie synthétique avec vrais UI Lab/Storybook, sauvegarde, propagation, interruption du writer et déplacement. Ne pas les pointer sur une instance humaine.
