# DS-EDIT-75 — Qualification des familles Google Fonts

5 novembre 2026 — réalisation sur base `f33eff6`, branche `codex/ds-edit-75-google-fonts`. Cible : application ; [fiche](../../work-items/ds-edit-75-google-fonts.md), [décision 028](../../decisions/028-local-google-fonts.md). Autorisation explicite de l’option et des téléchargements obtenue avant réalisation. Procédures applicatives implement-feature, test-user-flow puis review-design, technical-review et security-review, versions de la base. Rôles successifs, même agent, non indépendants. Aucun sous-agent, push, CI ou déploiement.

## Résultat observé

Catalogue initial de quatre familles normales variables : Inter, Roboto, Montserrat, Lora. Recherche locale, filtre par catégorie, plage de graisses, spécimen français et sélection de famille. Les actions de portée et Enregistrer restent celles du panneau ; aucune modification des tailles/interlignes/graisses ou valeur produit initiale. Les noms CSS internes ADL évitent de remplacer les anciennes piles lors d’un simple import.

TTF complets et OFL officiels figés au commit du catalogue ; taille, SHA-256 et cmap français vérifiés. Import protégé et sérialisé, deux fichiers synchronisés dans un dossier immuable avant référence, sans registre mutable additionnel. Annuler conserve le cache importé ; aucune collecte automatique. Les sources DTCG sont toujours la seule autorité des valeurs/références. Le writer refuse une ressource absente/altérée ou une graisse incompatible avant sa transaction ; règles @font-face produites par le générateur commun.

Les fichiers ajoutés au public pendant une session sont servis explicitement par le service local : le cache initial des fichiers publics de Vite ne les découvrait pas après renommage atomique d’un dossier. Le serveur statique Storybook connaît désormais le type MIME TTF. La projection DTCG conserve les noms à espaces dans la valeur éditeur, tandis que la sortie CSS garde son échappement propre.

## Contrôles exécutés

Copies isolées `.local/ds-edit-75/test`, puis `verify` pour la récupération finale stable, Node 24.22.0 et npm du runtime local. Aucune installation globale. Les recettes existantes et leurs journaux restent intacts.

| Contrôle | Résultat |
| --- | --- |
| typecheck, lint | Conformes sur copie sans doublons non suivis |
| test:design-system | 107 tests réussis, dont quatre tests de polices |
| docs:design-system:check | Documents générés à jour |
| test:boundaries | Build isolé conforme, import client de module serveur refusé |
| test:design-editor:server | 65 tests réussis avant ajout du cas ciblé polices ; suite couvrant store/HTTP et interruptions par fichier |
| Test HTTP ciblé polices | Réussi : origine/capacité/méthode, champs étrangers, traversée et identité inconnue refusés sans écriture |
| test:design-editor | 32 parcours compilés desktop/mobile réussis, build app compris |
| test:design-editor:persistence | 16 parcours desktop/mobile réussis, dont filtre/recherche et refus réseau |
| test:design-editor:recovery | Quatre scénarios refusal/SIGKILL à 1280/390 réussis, sources de campagne inchangées |
| build-storybook | Réussi |
| Contrats sur fichiers réels | Quatre cmap réels, installation immuable, réutilisation sans réseau, sauvegarde DTCG/redémarrage, refus de graisse incompatible et de fichier corrompu réussis |
| Imports réels via navigateur | Montserrat puis Roboto : chargement effectif dans l’iframe, sauvegarde, rechargement et vérification du fichier local réussis |
| Extraction/renommage/déplacement | Copie sans Git, comptes ou journaux, dépendances physiques, builds app/Storybook ; les deux chargent Montserrat avec réseau externe bloqué |

Les traces de commandes et scripts de campagne sont sous `.local/ds-edit-75/`. Preuves sélectionnées : [desktop](font-desktop.png), [mobile](font-mobile.png). Les captures ne prouvent pas à elles seules l’import ou la persistance ; ces résultats proviennent des parcours et relectures effectives. `font-contracts.log`, `browser-qualified.log`, `browser-roboto.log`, `portable.log` conservent les contrôles supplémentaires.

## Échecs et corrections conservés

- Premier typecheck depuis la racine app : doublons préexistants `* 2.tsx` avec imports obsolètes. Préservés, vérification poursuivie sur copie des sources suivies et du chantier.
- Premiers ports locaux et navigateur refusés par le sandbox ; campagnes relancées avec autorisation d’exécution locale. Pas de suppression de protection.
- Première copie dev avec node_modules symbolique : refus normal de Vite hors allowlist. Copie physique utilisée ; aucune extension de la liste de confiance.
- Première publication d’une famille : échec de sauvegarde sur le nom à espaces échappé comme CSS pendant la projection éditeur. Correction de la projection ; test DTCG ajouté, puis imports/sauvegardes/relectures Montserrat et Roboto réussis.
- Ancienne assertion UI « Familles locales préparées » remplacée par l’accès Google Fonts ; les 32 parcours sont retestés. Le test HTTP ciblé a d’abord attendu 422 au lieu du 400 de schéma existant : attente corrigée et refus retestés. Le test nouveau de filtre utilisait getByLabel exact sur un label contenant les options : sélection par rôle/nom accessible du combobox, sans affaiblir le contrôle fonctionnel.
- Première récupération desktop réussie, puis contrôle de conservation de la source de campagne échoué : la copie avait été actualisée pendant cette exécution. Retest sur copie `verify` stable ; aucune source utilisateur concernée. Certains journaux initiaux partagés par deux lancements comportent des octets nuls ; les résultats finaux utiles sont consignés ci-dessus, pas déduits des fins de ces journaux.

## Revues séquentielles

**Design — avec réserves non bloquantes.** Aucune maquette externe fournie : fidélité examinée contre la fiche et le panneau existant. Deux lectures : conservation des contrôles/portées et expérience du choix. Rendus 1280 × 800 / 390 × 844 inspectés : familles lisibles, recherche/catégorie natives, spécimen et plages visibles, messages textuels ; choix exposé sans compte IA. Capture mobile du panneau final sans débordement horizontal. Réserve : panneau long et catalogue initial de quatre familles ; acceptation humaine de ce compromis différée. Aucune certification d’accessibilité ni essai utilisateur revendiqué.

**Technique/QA — satisfaisant dans la couverture déclarée.** Entrée catalogue → import immuable → contrôle des ressources → référence DTCG → CSS partagé suivie. Correction du round-trip à espaces retestée. Reprise et refus contrôlés, portabilité réelle démontrée, variations locales conservées par les opérations existantes. Aucune dépendance nouvelle ; ancien format/reçus conservés. Les contrôles obligatoires du tableau sont satisfaits ; maintien de la réserve de recette humaine.

**Sécurité — avec limites explicites, sans finding bloquant identifié dans la surface inspectée.** Requête fonts/import derrière les contrôles origin/Host/capacité/méthode du service ; identité bornée, aucune URL client. Téléchargement HTTPS uniquement sous commit Google fixe, sans redirection, budget de taille/temps, empreintes et glyphes contrôlés. Chemins et parents refusant les liens symboliques ; fichiers publics limités au catalogue et contrôlés avant lecture. Réponses d’erreur sans secret ni détail de poste. Import réel autorisé, tests négatifs et revue du code ; aucune certification ni scan distant. Réserve opérationnelle : catalogue daté, police corrompue refusée sans écrasement et ressource inutilisée conservée. Pas de nettoyage destructif implicite.

## Reprise

En revue — qualification technique acquise, acceptation humaine différée. Les anciennes recettes, leur modèle enregistré et les comptes n’ont pas été modifiés ; les copies de campagne contiennent des changements de police fictifs. Recette humaine du choix, de la densité et de la portée partagée restant à faire, sans acceptation J4/J5 ou publication. Doc updated.
