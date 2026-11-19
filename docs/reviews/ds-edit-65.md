# DS-EDIT-65 — Contenus d’Apparence adaptés à UI Lab

4 novembre 2026. Base 5cabb45, branche `codex/ds-edit-65-workshop-appearance`. Cible application ; [mandat et critères](../work-items/ds-edit-65-workshop-appearance.md). **En revue — qualification technique acquise, acceptation humaine différée.** [Preuve sélectionnée](ds-edit-65/qualification.json).

## Résultat et conservation

La présentation d’Apparence de la version immuable 34e0aec est adaptée sous `src/ui-lab/editor` : panneau, sélecteur groupé, attribution et portées. Les imports de manager, thème, navigation et canal Storybook sont remplacés par le cycle de vie UI Lab et des liens de scènes autonomes. Le socle métier/service/protocole n’est pas modifié. Le sélecteur conserve clavier, recherche par frappe, focus et aide CSS ; le menu est positionné par géométrie mesurée et habillé par tokens.

Contenus repris : génération/brouillon, contexte avec choix pertinents, type d’attribution et référence conservée sous exception, description d’intention, valeurs chargée/brouillon, compteur et badges des composants concernés, couleur visuelle/précise, dimensions/unités préparées, nombres bornés et familles locales. Les badges AA/AAA conservent résultat, seuil, limite de mesure et correction explicite au clic. Portées locale/partagée/nouvelle intention, clarification/proposition et références d’usage sont conservées ; Annuler, conflits, sauvegarde et résultat inconnu restent raccordés au service autonome. UI Lab garde choix d’exemple, bascule mobile et abandon global. La sauvegarde attend l’aperçu même pour une attribution à valeur identique ; une visite d’usage ne change pas de sélection pendant un verrou d’enregistrement.

Onze tokens et onze primitives d’habillage ajoutés à ui-composition ; les entrées préexistantes restent identiques. Les autres autorités YAML, identités, valeurs et modèle produit sont inchangés. Génération effectuée uniquement dans des copies inactives ; les dérivés du dossier de travail proviennent de la copie propre, jamais des tests persistants. Manifeste v17 avec les quatre composants et leur CSS, sans conversion de journal.

## Contrôles exécutés et corrections

Node 24.22.0, dépendances locales du même verrou. Journaux ignorés sous `.local/ds-edit-65/`. Procédures applicatives implement-feature/design-interactions/test-user-flow/review-design/technical-review/security-review à la base du chantier ; rôles exercés successivement, même agent, **non indépendants**.

| Contrôle | Résultat et limites |
| --- | --- |
| Types, lint | Réussis dans la copie isolée puis lint de clôture depuis la racine applicative. Le premier contrôle de types dans le dossier de travail échoue sur des copies non suivies « stories 2 » ; elles restent intactes. Un appel lint de clôture depuis la racine lab ne trouvait pas la configuration ; rejoué depuis l’app. |
| Unitaire / design system | 148 unitaires, 82 DS réussis. Premier essai unitaire : liens internes omis de la fixture et ports refusés dans le sandbox ; copie complétée et essai local autorisé réussi. Le nombre de tokens de composition attendu est actualisé de 124 à 135. |
| Atelier compilé | 20 parcours qualifiés desktop/mobile : 18 réussis ensemble puis deux cas numériques supplémentaires rejoués avec succès. Première campagne : anciennes attentes de champs génériques, unité initiale supposée px, nom français d’usage et seuil AAA supposé conforme corrigés dans les tests selon la référence et les données réelles. Les cas numériques ont corrigé leurs attentes à 1–1000 et leur sélecteur de libellé composé ; aucun changement de contrat produit. |
| Écriture UI Lab | 14 parcours persistants réussis : local/partagé, rechargement, résultat perdu, conflits, assistance simulée avec clarification/proposition/application/enregistrement, popup refusée, propriétaire concurrent refusé, bootstrap et chemins privés protégés. Données synthétiques uniquement. |
| Service supplémentaire | Campagne 85 : 79 réussis, six échecs invalidés par des fixtures copiées depuis la racine que modifiaient simultanément les tests persistants. Les six scénarios sont tous rejoués avec succès sur sources stables, dans une sélection de cinq puis trois tests (deux contrôles supplémentaires). Le journal initial reste conservé ; aucune prétention de nouvelle campagne complète 85/85 propre. |
| Documentation / builds | Cinq tests documentation, types finaux, build applicatif et build Storybook réussis ; frontière serveur/client vérifiée avec refus d’un import `.server`. Avertissements Zod/Rollup et taille de bundle documentaire conservés, non bloquants. |

La première validation de génération signalait un sélecteur de token différent de son consommateur après formatage ; déclaration corrigée puis génération/DS réussies. Le lint refusait une remise à zéro synchrone de menu dans un effet ; l’état ouvert est maintenant conditionné par la disponibilité du contrôle. Aucun contournement de règle ni purge de protection.

## Revues séquentielles

**Design : satisfaisant pour les critères techniques, acceptation visuelle attendue.** Deux lectures : fidélité aux contenus/comportements de la source 34e0aec, puis utilisation clavier/mobile. [Desktop](ds-edit-65/desktop.png) et [mobile](ds-edit-65/mobile.png) examinés : habillage clair cohérent avec l’atelier, attribution lisible, contrôles et actions disponibles sans débordement horizontal constaté. Les sélecteurs sans alternative sont masqués comme dans Apparence. Couleurs de l’habillage proposées, pas acceptées au nom du designer. Aucun nouveau travail visuel sur Storybook.

**Technique : satisfaisant.** Le transport/canal reste dans Workspace, la présentation dans ses composants locaux ; aucun import Storybook dans leur graphe nouveau. Les liens directs sont limités aux scènes/bindings connus et l’inventaire conserve le retour au brouillon. Tous les nouveaux consommateurs figurent au manifeste. Le garde d’aperçu et le verrou d’écriture ne sont pas remplacés par la seule présence de champs. La campagne serveur initiale impropre et ses retests sont distingués ci-dessus.

**Sécurité proportionnée : satisfaisant dans ce périmètre, sans audit exhaustif.** Textes rendus par React, aucun HTML interprété, lien construit à partir d’identités du contrat ; sélection d’URL validée contre scènes et modèle. Pas de nouvel endpoint, dépendance, accès ou stockage privé. Le panneau n’obtient pas de capacité depuis son parent ou Storybook. Les refus du service, du second writer et de la popup sont vérifiés. Assistance fournisseur uniquement simulée, aucune connexion/inférence réelle ni secret copié. Firefox/WebKit, nouvelle extraction/Linux/SQL et accessibilité exhaustive non rejoués ; ces limites ne deviennent pas des preuves acquises.

## Recette disponible

Nouvelle racine `.local/ds-edit-65/recipe`, sans anciens reçus, compte ou propriétaire. Les neuf sources de valeurs et les entrées de composition de l’ancien Storybook sont lues sous **sa barrière compatible**, puis complétées des seuls tokens d’habillage qualifiés. Le modèle généré et celui servi conservent les **188 bindings/18 styles** enregistrés ; Button #0050c9. Les changements UI Lab abandonnés ne sont pas importés. Aucun réglage humain saisi ni sauvegardé par l’agent.

- [UI Lab — réglages Apparence adaptés](http://127.0.0.1:54139/ui-lab), lanceur détaché 34716 ; racine/journal/version dans `.local/ds-edit-65/processes.json` et `recipe.log`.
- [Storybook conservé avec Apparence](http://127.0.0.1:54138/?path=/story/components-button--default), ancienne racine 34e0aec et processus 58969 inchangés.

Navigateur intégré : atelier et aperçu prêts, champ #0050c9 éditable, attribution d’exception et référence conservée, badges AA/AAA, groupes Typographie/Couleurs/Bordures/Espacements/Contour de focus vérifiés, menu fermé par Échap, aucune modification en brouillon. Nouvelle recette stable pendant l’observation, sans notification de redémarrage Vite. Les deux racines sont **indépendantes, sans synchronisation** ; ce n’est pas une coexistence sur les mêmes données. En cas de reprise, utiliser le lanceur propre à chaque version ; ne pas écraser ni convertir ses journaux.

**Doc updated.** Préexistants conservés, aucun push/publication/CI distante, aucune acceptation A–F/J4/J5 déduite. Prochaine action : vérification humaine de l’adaptation dans UI Lab ; aucun chantier supplémentaire ouvert.
