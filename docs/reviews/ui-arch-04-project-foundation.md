# UI-ARCH-04 — Socle des projets créés

**14 novembre 2026 — En revue : qualification technique acquise, acceptation humaine différée.** Candidat d’implémentation `e6ab674beb8d3bbc202b24f70741fec590adc4db`. [Fiche](../work-items/ui-arch-04-project-foundation.md), [adoption 037](../decisions/037-project-ui-foundation-adoption.md), [guide autonome](../architecture/project-ui-foundation.md). Base `0b8b4ab`, autorités alignées et commitées dans `a78a125` avant code. Cible application, suivi de fabrication dans le lab. Pas de chantier Electron ni de mise à jour des projets existants.

## Résultat observable

Le projet dispose de son thème Tailwind `project:` issu de ses tokens DTCG et de ses propriétés CSS validées. Les utilitaires fermés conservent les alias contextuels `--adl-local-*` : variantes, attributions et substitutions par occurrence gardent leur chaîne de références. Aucune valeur de chrome recopiée, palette métier nouvelle ou Preflight global ajouté. Le thème participe aux dérivés du writer, à son empreinte et à sa récupération ; manifeste v38, aucune opération éditable nouvelle, aucun ancien journal converti.

Button garde le bouton HTML et ses props, avec `useButton` et `mergeProps` React Aria ; Field compose TextField/Label/Input/TextArea/Text/FieldError. API HTML, labels/aides/erreurs, required, multiline, reset, loading et marqueurs d’inspection sont conservés. La sélection native et les composants non convertis restent en CSS Modules. La story de contrat HTML expose valeur numérique, onClick, focus, soumission et reset ; elle est documentaire, hors navigation de scènes livrée au designer.

Dépendances : Tailwind/plugin 4.3.5, React Aria Components 1.22.1 et React Aria 3.53.1, déjà transitive et désormais déclarée directement. Le lockfile n’ajoute aucune nouvelle version de paquet. Imports du hook explicitement préoptimisés pour le démarrage Vite. Liste fermée de sources complétée ; ni profil ni format d’export nouveau.

## Contrôles exécutés

Copies neuves sous `.local/ui-arch-04/qualification-wVCMbU/`, aucun test sur fenêtre ou projet du porteur. Commandes détaillées et traces volumineuses ignorées conservées localement ; synthèse sélectionnée dans [qualification.json](ui-arch-04/qualification.json).

| Contrôle | Résultat |
| --- | --- |
| Design system : 12 suites Node, valeurs/domaines, décisions, snapshots et composition | 114 tests conformes |
| Writer/store et HTTP | 69 tests conformes, incluant remplacement de chaque fichier, refus de garde/identité/liens, pertes de réponse, interruption réelle SIGKILL et récupération idempotente |
| Création et exports Node | 14 tests conformes, destinations existantes/liens/état privé et interruptions conservés |
| Thème projet et génération outil | Trois tests conformes : deux pour le thème projet et un pour la génération outil, inclus dans la campagne finale 117/117 |
| Storybook compilé, Chromium/Firefox/WebKit, 1280×800 et 390×844, préférences claire/sombre | 12 parcours conformes : validation, erreur reliée, saisie, succès, valeur numérique, focus, onClick unique au clic/espace, reset |
| Référence visuelle préexistante | 14 PNG identiques octet par octet, sept états × deux formats : défaut, survol/focus, désactivation/chargement, erreur input/textarea ; comparaison sur Chromium |
| React Router compilé, trois moteurs × deux formats | Six parcours SSR/hydratation/action invalide conformes, plus consultation sans JavaScript sur les trois moteurs ; aucune erreur d’hydratation, saisie Description conservée, aucun accès base |
| UI-ARCH-03, copie dédiée | Parcours complet 1280 clair/1440 sombre conforme après correction du démarrage à froid : icônes, clavier, erreur, abandon, sauvegarde/relecture/rétablissement |
| Frontières serveur/client | Build isolé positif puis refus effectif d’un import `.server` dans le client |
| Kit d’agents, UI outil et documentation dérivée | Contrôles conformes ; aucune nouvelle campagne fournisseur ou découverte native revendiquée |

L’instantané final de la liste fermée comprend 1137 entrées, hors 75 préexistants ; génération, 117 tests Node (114 DS + trois thème/outil), types, lint, builds application/Storybook et contrôle de bibliothèque conformes. Le rendu, les six parcours SSR et les 12 parcours Storybook ont été rejoués après correction des consommateurs. La campagne finale 69/69 confirme transactions et reprises sur ces mêmes consommateurs. Les médias clairs/sombres n’ajoutent pas un thème sombre au produit : ils vérifient les préférences, avec les valeurs projet inchangées.

## Création, exports et indépendance

Deux projets fictifs A/B ont été créés et préparés par les fonctions réelles, avec identités distinctes. Une couleur enregistrée dans A par le vrai writer a été relue dans le modèle DTCG résolu ; B et les tokens du chrome sont restés identiques. Aucun état privé ou dépendance étrangère inconnue transféré.

`project.export` et `tool.export` exécutés séparément vers des ZIP neufs. Le premier conserve les sources sauvegardées, dont la couleur, et exclut un marqueur privé fictif. Le second, extrait, a pu créer et préparer C. Aucun brouillon non enregistré n’est présenté comme exporté ; les tests négatifs conservent les filtres et refus existants.

A, B et le projet exporté/extrait ont chacun passé types, build application, build Storybook puis démarrage direct du runtime et du serveur Storybook, sans service/contenant/compte Loomata externe. Dépendances installées par copie locale de la version verrouillée, suivant la préparation existante ; runtime Node copié dans leurs espaces privés de qualification. Pas de registre ou de configuration npm privée transféré. Le lockfile est aussi accepté par `npm ci --dry-run --ignore-scripts --offline` dans la copie extraite ; cette simulation ne qualifie pas une nouvelle installation réseau.

Les builds et démarrages utilisent un sandbox supplémentaire qui refuse la lecture du contenu du dépôt parent. Seules ses métadonnées de traversée sont permises pour rejoindre le dossier testé ; les lectures effectives du package parent sont explicitement refusées avant les commandes. Ni simple changement de répertoire ni résolution cachée des dépendances parentes : chaque projet conserve son propre node_modules. Les outils de conception peuvent accompagner les sources, mais les pages produit n’importent pas Loomata UI.

## Échecs initiaux et corrections

- RAC Button ne satisfait pas intégralement ButtonHTMLAttributes (value puis événements focus) : maintien du bouton HTML avec le hook de la même bibliothèque, sans casts généralisés ni conversion de onClick en onPress. Types et story de contrat vérifiés ensuite.
- Première campagne HTTP refusée par les restrictions localhost et délai du runner insuffisant ; aucune preuve positive retenue. Reprise autorisée sur copie avec délai adapté, 69/69 conformes.
- Nouvel index de dérivé non atteint par une modification de couleur : thème composé de références, donc contenu stable. Fixture rendue explicitement périmée pour exercer son remplacement et sa récupération ; tous les indices conformes.
- Une assertion cherchait un hexadécimal brut dans le JSON DTCG structuré : assertion corrigée pour lire la valeur résolue après le vrai enregistrement ; B/chrome inchangés.
- Profil d’isolation initial refusant aussi le lstat des ancêtres : traversée par métadonnées autorisée, contenus toujours refusés ; types/builds/démarrages conformes dans cette isolation.
- Premier parcours UI-ARCH-03 : réponse Vite 504 Outdated Optimize Dep pendant le chargement. Imports du hook ajoutés à optimizeDeps, seul cache généré de la copie retiré, parcours à froid conforme. Les contrôles préparant des dérivés sont ensuite séparés des parcours sur instance active.
- Revue des consommateurs : Field ne consomme plus son ancien CSS. Référence de présentation et règles orphelines retirées ; le contrôle de snapshot a aussi signalé deux anciennes déclarations de hauteur de ligne sans binding SelectField, retirées sans modification du rendu. 117/117 et 14 PNG identiques ensuite.
- Invocations d’outillage depuis une mauvaise racine ou avec un mauvais import de pilote échouées avant lancement, corrigées vers la copie exacte ; aucun succès attribué à ces essais.

## Revues et limites

Revues design, technique/QA et sécurité exercées séquentiellement par le même agent, non indépendantes ; aucun sous-agent ni scan externe. Design : [formulaire 1280](ui-arch-04/form-1280.png), [390](ui-arch-04/form-390.png), [erreur SSR 1280](ui-arch-04/ssr-1280.png) et [390](ui-arch-04/ssr-390.png) relus ; rendu des anciens états conservé et erreur associée au champ, saisie conservée, interactions clavier démontrées. Pas d’acceptation visuelle faite à la place du designer.

Technique : chaîne DTCG → alias contextuels → utilitaires → consommateurs identifiés vérifiée ; génération unique, nouveau dérivé fermé, reprise et SSR/formulaires couverts. Aucun remplacement exhaustif de composants ; CSS Modules non convertis conservés. Sources de création et d’export qualifiées séparément. Sécurité : aucune nouvelle entrée privilégiée ou opération du writer ; refus HTTP et de liens maintenus, nouvelles sorties dans les mêmes écritures bornées, inventaires publics et exclusion de l’état privé contrôlés. Aucun nouveau paquet/version ni accès externe ajouté par les choix de dépendances ; ce constat ne constitue pas un audit global.

Réserves : moteurs testés sur macOS arm64, pas de qualification Windows/Linux du contenant, pas de recette physique/VoiceOver, pas de nouvelle méthode d’authentification ni d’essai fournisseur/Figma réel. Les avertissements hérités de build (polices, annotations Rollup, chunks) restent consignés dans les logs. Pas de base métier manipulée ; les vérifications SSR invalident la requête avant son accès au repository. L’ancienne démonstration reste une référence du kit, pas une application métier livrée par ce mandat.

## Recette humaine et reprise

Sur une nouvelle copie de test à ouvrir sur demande, examiner Button/Field et leurs états dans Storybook, le formulaire et son erreur ; comparer les captures de référence, vérifier le clavier, puis enregistrer une valeur et contrôler que le chrome ne change pas. Reprendre l’extraction du projet exporté sans Loomata pour la revue conjointe des composants et de son runtime. Les scripts et preuves sélectionnées permettent une reprise technique sans ce chat.

Aucune direction visuelle nouvelle approuvée : hypothèse de conservation du rendu, sans nouveau reset ni thème automatique. Les projets existants, anciennes versions/journaux et fenêtres sont préservés ; pas de migration automatique. Sources/copies fictives et traces locales conservées ; processus propriétaires arrêtés par leurs runners. Aucun push, Actions, hébergement ou publication. UI-ARCH-04 ne lance pas Electron. **Doc updated.**


## Clôture technique

SP-01 à SP-08 démontrés dans leur périmètre technique : adoption préalable, mapping validé, nouveau dérivé transactionnel et reprises, API de formulaire et rendu conservés, copies indépendantes, trois chemins de création/export, contrôles sur l’instantané final et dossier humain. Empreinte des 24 sources d’implémentation/test retenues concordante entre dépôt et instantané, ainsi que les 14 couples de PNG ; sources canoniques du projet et modèles de suivi app inchangés. Revues design, technique et sécurité satisfaisantes sur le périmètre exécuté, avec limites humaines/plateformes ci-dessus ; modes et résultats conservés, aucune indépendance revendiquée.

Qualification technique acquise ; UI-ARCH-04 reste En revue jusqu’à acceptation humaine. Les anciennes campagnes détaillées d’installation, base métier et distribution native ne sont pas répétées sans changement de leurs chemins ; le writer/reprise, la persistance UI et les exports ont leurs preuves ciblées nouvelles. Les dépendances techniques autorisent une future tranche distinctement mandatée, pas le lancement implicite d’Electron. Prochaine action : recette humaine du socle sur une copie dédiée, avec choix du candidat et accès vérifiés au runtime et à Storybook.
