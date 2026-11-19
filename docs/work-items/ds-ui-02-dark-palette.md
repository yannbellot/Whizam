# DS-UI-02 — Palette sombre de l’atelier

15 novembre 2026 — Application, mandat autorisé : fond principal #171717, panneaux #111111, champs/boutons #1F1F1F, sélection active #3B3B3B (précision du porteur). Base `0ac4a6a`, branche `codex/design-system-dark-palette`, aucun changement suivi préexistant. Fichiers non suivis historiques conservés.

Périmètre : autorités de couleur de l’outil et de son chrome historique, aperçu pleine surface, générateur outil et emballage de sa palette dans le bundle natif ; Loomata.swift pour les couleurs du contenant/sélecteur natif. Projet fictif neuf pour la version macOS à ouvrir. Préserver largeur 280 px, padding/radius 16 px, filtrage, clavier, changement de vue et brouillons. Ces couleurs visent le thème sombre de l’outil ; les valeurs des composants du projet présenté ne sont pas recolorées. Le mode clair reste conservé.

Procédures applicatives implement-feature, review-design, technical-review sélectionnées dans leur version `0ac4a6a` ; rôles séquentiels, même agent, non indépendants. Choix compatible : palette DTCG de l’outil embarquée en lecture seule dans la nouvelle app, couleurs natives issues de cette ressource ; contrôle segmenté AppKit conservé, sans réécriture des interactions. SDK Apple local pour vérifier son API selectedSegmentBezelColor. GPT-6.1 Sol · Élevée recommandé pour la frontière web/native, sans changement du réglage client.

Critères : quatre couleurs effectives côté web, couleur de sélection native configurée depuis la même palette, types/génération/lint/tests ciblés et builds de copie ; compilation/signature native, changement de vue et observation du rendu. Aucun compte, appel fournisseur, publication, changement global de préférences ou migration des données. Les anciennes versions restent intactes ; ressources de la copie neuve laissées actives pour la recette humaine.

## Réalisation et qualification — 15 novembre 2026

**En revue — qualification technique acquise dans le périmètre contrôlé, acceptation humaine différée.** Copie dédiée `.local/ds-ui-02/user-test-BIZwBn`, bundle **Loomata Dark Palette Test.app**, identifiant `org.loomata.local.ds-ui-02.user-test-BIZwBn`. Atelier 63914, Storybook 63915. SDK 26.5, application sans instrumentation ; ancienne recette et données personnelles non remplacées. Sources : base `0ac4a6a` + diff du présent chantier, contrôlé puis intégré localement. Descriptor privé `.local/ds-ui-02/user-test-latest.json`.

### Choix et sources

- L’autorité outil porte les quatre rôles de surface/sélection. Le chrome historique conserve ses identités dans l’autorité de composition existante, sans migration générale des valeurs projet. Le fond des panneaux est distinct du fond des contrôles. Le nouveau fond de canvas empêche que le fond propre au document projet masque celui de l’atelier ; min-height plein écran seulement dans le thème sombre, modèle éditable inchangé.
- La compilation embarque une copie validée de l’autorité outil dans `Contents/Resources/loomata-ui.tokens.json`. Égalité octet pour octet avec la source contrôlée. Le lecteur natif borne couleurs sRGB, trois composantes finies entre 0 et 1 et alpha 1 ; absence/incompatibilité revient aux couleurs système. Aucune lecture de palette projet ou de ressource distante.
- NSSegmentedControl reste le contrôle de sélection, avec son accessibilité et ses actions. Le fond natif et `selectedSegmentBezelColor` consomment les rôles outil selon l’apparence effective ; aucune préférence macOS globale modifiée. L’accent natif est configuré à #3B3B3B : son bezel reste rendu par AppKit, sans revendication d’une couleur uniforme sur tous les pixels du matériau natif.

Fichiers : autorités outil/composition, workspace.module.css ; generate-loomata-ui/build-loomata et Loomata.swift ; comptes de composition (145 → 146), test de provenance de la ressource native et parcours desktop ; guides de l’atelier/macOS et présent suivi. Dérivés générés, jamais édités.

### Contrôles et preuves

- Génération outil/projet, validate:design-system et docs:design-system:check : conformes. Tests outil/composition/politique : 10/10 ; campagne complète `npm run test:design-system` : 114/114, tous les refus attendus conformes. ESLint ciblé : conforme.
- Copie finale : typecheck, build application et build Storybook : conformes. Compilation Swift avec le SDK 26.5 : conforme ; signature stricte avant et après ouverture conforme. Les seules métadonnées Finder incompatibles ajoutées au nouveau bundle ont été retirées par le helper existant ; binaire et quarantaine préservés.
- Parcours `scripts/test-e2e.mjs --config config/testing/playwright.workshop-persistence.config.ts ui-arch-03.spec.ts --project=desktop` dans le projet fictif isolé : 1/1. Formats 1280×800 clair et 1440×900 sombre, recherche, clavier, validation, annulation, sauvegarde/relecture/rétablissement conservés. Assertions des couleurs réelles : canvas/surface `rgb(23,23,23)`, panneaux `rgb(17,17,17)`, champ de recherche/saisie/bouton Pages `rgb(31,31,31)`, ligne sélectionnée `rgb(59,59,59)`. Largeur 280 px, padding/radius 16 px et couche 1 conservés. Moteur Chromium local réutilisé dans la copie, sans téléchargement.
- Captures relues : [mode clair](../reviews/ds-ui-02-dark-palette/desktop-1280.png), [mode sombre](../reviews/ds-ui-02-dark-palette/desktop-1440.png). WKWebView réel observé chargé ; sélection native Aperçu puis UI Lab vérifiée, atelier et scène retrouvés, aucun brouillon. Le chargement initial a brièvement montré le placeholder blanc avant le montage ; l’observation finale est effectuée après disparition de cet état transitoire.
- Fenêtre finale et services laissés actifs pour la vérification demandée. Aucun appel fournisseur ni publication, aucun accès supplémentaire. Contrôle exhaustif VoiceOver et bascule physique du thème OS non exécutés.

### Revues et reprise

Design Reviewer : fidélité aux quatre valeurs explicites contrôlée côté web, rendu sombre natif observé et composants du projet conservés ; contrôle de sélection natif conservant les finitions AppKit. Technical Reviewer / QA : références/consommateurs, ressource embarquée et secours natif, builds et interactions vérifiés. Sécurité : ressource locale validée et immuable dans le bundle signé ; aucun élargissement d’accès ni navigation ou stockage nouveau. Rôles exercés séquentiellement par le même agent, non indépendants ; conclusions satisfaisantes dans ce périmètre, avec les limites natives indiquées ci-dessus.

**Doc updated.** Prochaine action : vérification visuelle humaine dans **Loomata Dark Palette Test**. [Atelier](http://127.0.0.1:63914/ui-lab), [Storybook](http://127.0.0.1:63915/). Aucun chantier supplémentaire ouvert.


## Correction demandée — présentation du sélecteur natif

15 novembre 2026 — Le porteur signale que le bloc UI Lab / Aperçu / Codex a changé de présentation sans demande. Base `1429cf3`, branche `codex/restore-native-view-selector`, aucun changement suivi préexistant. Correction limitée à Loomata.swift et au suivi : retirer le style `.rounded` forcé et le calque de fond rectangulaire, rétablir le style natif automatique d’origine. Seule l’attribution de couleur active #3B3B3B est conservée. Géométrie, labels, contrôle NSSegmentedControl, actions et navigation d’origine maintenus ; aucune nouvelle disposition.

Reconstruction native distincte, sans remplacement du bundle ouvert ; même projet fictif et mêmes services, sans écriture sur ses données ou son writer. Les sources web/tokens restent inchangées. Contrôles prévus : diff ciblé, compilation/signature, observation native et sélection Aperçu/UI Lab. Revues séquentielles, même agent, non indépendantes. Résultats à compléter après exécution.


### Résultat du rétablissement

Compilation Swift (SDK 26.5) et signature stricte conformes, nouveau bundle distinct `.local/ds-ui-02/navigation-restored/build-x6pwlp/Loomata Dark Palette Test.app`, identifiant `org.loomata.local.ds-ui-02.navigation-build-x6pwlp`. Les métadonnées Finder incompatibles ont été retirées uniquement sur cet artefact neuf, sans modification du binaire ou de sa quarantaine. Observation réelle WKWebView/AppKit : capsule native d’origine et textes retrouvés, aucun rectangle de fond ajouté ; sélection Aperçu puis UI Lab réussie, scène et réglages retrouvés, aucun brouillon. Une action a d’abord été refusée par le pilote après un changement d’état utilisateur ; l’état a été relu avant de rejouer les actions.

Le diff applicatif retire exactement cinq lignes : calque/fond imposé et `.segmentStyle = .rounded`. La couleur active reste attribuée par l’API native existante. Les sources Swift de la copie de recette sont mises à jour sans toucher aux données ni aux services web ; le nouveau bundle conserve les mêmes accès 63914/63915. Aucun contrôle web/DS rejoué : aucun changement web, token ou générateur dans cette correction ; la compilation et le parcours natifs couvrent la surface modifiée. Revues design/technique séquentielles non indépendantes : satisfaisantes sur ce rétablissement. Pas de nouvelle surface de sécurité.

En revue, acceptation humaine différée ; Doc updated. Nouvelle version laissée ouverte, ancienne version non remplacée. Prochaine action : vérification visuelle du sélecteur d’origine. Aucune publication.


## Complément autorisé — fond pendant le chargement

15 novembre 2026 — Le porteur constate un flash blanc au chargement d’un composant et demande #171717 également pendant cette phase. Périmètre : Layout SSR des seules routes /ui-lab et /ui-lab/preview, styles document et deux tokens de composition ; sous-page WKWebView de la seule vue UI Lab. Rétablissement du sélecteur natif conservé. Choix : fond du document posé avant hydratation, meta color-scheme pour le document outil, et underPageBackgroundColor natif issu de la palette existante. Aucune valeur des composants projet ou préférence OS modifiée ; thème clair conservé.

Critère supplémentaire : les deux routes montrent #171717 avec JavaScript désactivé, avant montage du composant ; la route projet / ne reçoit pas cette règle. Reconstruction sur copie neuve, signature et observation native avec navigation entre composants. Les anciennes recettes restent préservées. Contrôles et résultat à compléter après exécution.


### Résultat du fond de chargement

En revue — qualification technique acquise, acceptation humaine différée. Base `9db20b0` + correctif de chargement contrôlé sur `codex/restore-native-view-selector`. Copie neuve `.local/ds-ui-02-loading/user-test-ntEb4k`, bundle **Loomata Loading Background Test.app**, identifiant `org.loomata.local.ds-ui-02-loading.user-test-ntEb4k`. Atelier 65209, Storybook 65210. Anciennes recettes, données et fenêtres conservées ; copie neuve laissée ouverte sur Button / Default, aucun brouillon.

Génération, validation des autorités, documentation générée et lint ciblé conformes ; tests politique/composition 9/9. Types et builds application/Storybook de la copie conformes. Compilation Swift SDK 26.5 et signature stricte après ouverture conformes. Aucun rechargement ou assouplissement des protections de données ; seule la propriété publique WebKit underPageBackgroundColor est ajoutée à la vue UI Lab.

Parcours desktop ciblé : 1/1 sur la copie isolée. Il vérifie les deux documents /ui-lab et /ui-lab/preview en contexte sombre **sans JavaScript** : fond calculé `rgb(23,23,23)` et texte de chargement visibles. La route / du projet ne porte pas le marqueur d’atelier. Le parcours normal clair/sombre, les quatre couleurs, dimensions 280/16/16, clavier et sauvegarde/relecture/rétablissement restent conformes. Les deux nouveaux tokens de document portent le compte de composition à 148 ; valeurs des composants éditables et protocoles inchangés.

Observation native via CUA : écran « Chargement des références… » sur fond sombre avant montage de l’atelier, puis Button / Default ; sélection de Disabled avec l’état « Chargement de l’aperçu… » sur le même fond, puis retour à Default chargé. Capsule native d’origine conservée. Ce contrôle couvre démarrage et changement de scène observés, sans revendiquer une mesure vidéo de chaque image de tous les composants. Revues design/technique séquentielles, même agent non indépendant : satisfaisantes dans ce périmètre. Revue de portée sécurité : marqueur de route borné, styles et couleur locale uniquement, aucun nouvel accès ou entrée externe.

Descriptor ignoré `.local/ds-ui-02-loading/user-test-latest.json`. [Atelier](http://127.0.0.1:65209/ui-lab), [Storybook](http://127.0.0.1:65210/). Doc updated ; prochaine action : vérification visuelle humaine sur ce nouveau bundle. Aucune publication ni nouveau chantier ouvert.
