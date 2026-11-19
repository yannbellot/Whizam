# MVP-01-SOCLE — Qualification du socle commun

12 novembre 2026. Cible : application, fabrication suivie dans le lab. Mandat : « Reprends MVP-01-SOCLE jusqu’à sa qualification. » Version qualifiée : `7ff7f8c`, branche locale `codex/mvp-01-common-foundation`, arbre applicatif `a302ed7a4bf43089d2ced9492514d8e62d78f53a`. **En revue — qualification technique acquise, acceptation humaine différée.** SOC-01 à SOC-12 satisfaits dans la portée et les limites ci-dessous ; aucun contrôle obligatoire restant en échec. Les arrêts et essais précédents sont conservés dans le [journal historique](README.md).

## Résultat et périmètre

Le même noyau conserve les identités et les relations, publie les modifications de l’inspecteur et de Codex avec une révision commune, reprend les transactions interrompues et distingue brouillon, commit et intégration. Un clone reconstruit les traces partageables depuis Git. Le [contrat autonome](../../architecture/workspace-contract.md) décrit formats, opérations et limites ; la [fiche](../../work-items/mvp-01-common-foundation.md) définit S1–S6 et SOC-01 à SOC-12.

S1 : contrats purs et inventaire DS réel ; S2 : traces publiques, journal privé et reconstruction ; S3 : moteur, adaptateurs DS/Codex et préconditions ; S4 : worktrees, récupération et décisions d’intégration ; S5 : conversations contextualisées et essai fournisseur réel ; S6 : projections, interface de qualification, campagnes et revues. Aucun backend distinct, stockage SQLite, migration de données personnelles ou dépendance Figma ajouté. Les écrans métier T1–T3 restent hors mandat.

## Environnement, versions et méthode

Base reprise : `69a3fc6`. Réalisation : `a98a0e5` ; contrôle du raccordement natif : `5a9e2b6` ; refus d’écraser une trace préexistante au bootstrap : `bf8915c` ; frontière des sources du brouillon et test de regroupement réel : `4ee6dc2` ; témoins privés du test natif et lint : `ec219c0` ; diagnostic natif et contrat de frontière : `7ff7f8c`. Les commits suivants de preuves/suivi ne changent pas ce runtime.

Procédures applicatives `implement-feature`, `test-user-flow`, `update-project-docs`, puis `technical-review`, `security-review`, `review-design`, sources versionnées dans le kit. Rôles exercés séquentiellement par le même agent, **non indépendants**. Aucun sous-agent. Recommandation Très élevée conservée après la reprise explicite ; réglage du poste non modifié ni prétendu vérifié.

Campagne principale sur copie complète des fichiers suivis, isolée sous `.local/mvp-01-socle/qualification`, sans parent applicatif requis. Installation `npm ci --offline --no-audit --no-fund` réussie, 451 paquets, cache privé existant. Node v24.22.0, Chromium fourni au projet, macOS arm64 avec AppKit/WKWebView, SDK 26.5 installé ; PostgreSQL testé dans des ressources Docker jetables identifiées. Le SDK 27.0 installé est incompatible avec le compilateur : repli documenté du script existant vers 26.5, sans changement système.

Les commandes ci-dessous partent de la copie applicative. L’exécutable Node/npm vient du runtime local documenté. Le fournisseur simulé sert aux erreurs déterministes ; **SOC-08 utilise réellement le compte dédié de Loomata**, App Server officiel épinglé 0.167.0, historique de test isolé. Ni authentification ni historique personnel copié. La fenêtre personnelle n’est pas relancée.

## Matrice des critères

| Critère | Preuve et portée démontrée |
|---|---|
| SOC-01 | Contrat représentatif : deux pages, définition et variante, deux occurrences, token, parcours conditionnel et retour ; relations typées, identités stables au renommage et rejet des incohérences. Collecte des identités DTCG réelles ; aucun inventaire universel des pages revendiqué. |
| SOC-02 | Qualification des demandes sans lancement implicite, liens multiples préservés. Test Git réel de deux commits : deux tâches et deux chantiers existants, même chantier dans plusieurs commits, SHA et date retrouvés ; aucune duplication des tâches. |
| SOC-03 | Clone local neuf sans état privé : reconstruction du modèle et des liens du checkpoint à son vrai commit. Conversations et brouillon non commité exclus explicitement. |
| SOC-04 | Writer DS réel et Codex utilisent le moteur commun ; révision combinée de l’inspecteur, accord Codex périmé refusé, préimages et portée contrôlées ; annulation après réouverture sans écrasement concurrent. |
| SOC-05 | Brouillon unique durable, reprises injectées aux frontières de publication et véritable SIGKILL ; reçus idempotents, propriétaire vivant/ambigu conservé, octets inconnus refusés et préservés avec le journal. |
| SOC-06 | Brouillon et chantier isolé en parallèle, conflit Git conservant les deux versions, conflit fonctionnel sur cible commune malgré fichiers distincts ; aperçu d’une seule racine identifiée. Commit et intégration observés séparément. |
| SOC-07 | Conversation générale et conversation unique par élément, retrouvée après renommage/réouverture ; contexte renouvelé à chaque envoi/accord, interruptions et reprise sans double écriture. Tests simulés et fournisseur réel. |
| SOC-08 | Quatre étapes réelles réussies : compte dédié connecté, proposition contextualisée approuvée via le moteur sur le brouillon avec principale préservée, interruption sans accord en attente ni double action, reprise du même thread officiel. [Résumé expurgé](live.json). |
| SOC-09 | Révision commune et états appliqué/en vérification/contrôles réussis ; preuve invalidée après évolution, modification externe après contrôle refusée au commit et affichée incertaine ; fichier non reconnu signalé en couverture partielle. |
| SOC-10 | Automatique non critique sans effet visible ; visible avec accord humain ou délégation E2E explicite et succès exact ; échec/péremption bloquent ; critique toujours humain, couverture partielle humaine. Décision conservée par commit distinct, reprise après interruption testée. |
| SOC-11 | Port fermé aux sorties du modèle ; broker sans shell arbitraire, refus privé/extérieur/liens/hardlinks/action inconnue et accords non rejouables ; origine étrangère refusée en HTTP réel. Traces publiques séparées des conversations, capacités et authentification privées ; copie et export contrôlés. |
| SOC-12 | Copie autonome, non réinitialisation des anciens projets et conservation d’une trace préexistante ; parcours web desktop 1280 × 800 et 1440 × 900, clavier et défilement ; régressions DS, projets/chat/exports. Quinze scénarios natifs réussis avec même cœur, racine sélectionnée effectivement utilisée, arrêt/reprise et refus HTTP privés vérifiés. [Preuve native expurgée](native.json). |

## Campagnes et résultats

Les journaux bruts restent dans les sorties ignorées de la fabrication. Les [résumés des commandes](commands.json), [scénarios desktop](desktop.json), deux captures synthétiques et scénarios natifs sont versionnés ici sans chemins personnels, identifiants fournisseur ou capacités.

| Commande | Résultat observé |
|---|---|
| `npm run typecheck`, `npm run lint`, `npm run format:check` | Réussis ; types/builds rejoués après le correctif Vite, lint corrigé puis rejoué. |
| `npm test` | 171 tests réussis, dont contrats et planification du socle. |
| `npm run test:workspace` | 21 tests réussis sur le candidat final : 16 moteur/Git et 5 adaptateurs. |
| `npm run test:boundaries` | Réussi. |
| `npm run build`, `npm run build-storybook` | Réussis, rejoués après modification des configurations Vite. |
| `npm run test:integration` | 14 tests PostgreSQL réussis ; ressources de test propres nettoyées. |
| `npm run test:design-system` | 114 tests réussis. |
| `npm run test:design-editor:server` | 66 tests réussis sur la campagne complète et au retest du manifeste final. |
| `npm run test:core-host`, `npm run test:agent-chat` | 4 et 13 tests réussis. |
| `npm run test:project-lifecycle`, `npm run test:exports` | 8 et 6 tests réussis. |
| `npm run docs:design-system:check`, `npm run validate:agent-kit` | Réussis ; aucun changement de valeur des autorités DS. |
| `npm run test:workspace:ui` | Trois scénarios réussis : deux formats desktop et refus d’origine étrangère. Fournisseur simulé, vrai HTTP. |
| `npm run test:workspace:live` | Quatre étapes réussies avec Codex réel, sur sources `a98a0e5` ; aucun changement ultérieur du transport ou de l’adaptateur Codex. |
| `npm run test:loomata` | Régression initiale : 15 scénarios natifs réussis. Complément `LOOMATA_WORKSPACE_TEST=1` sur le candidat final : 15 scénarios réussis, aperçu du worktree sélectionné et six refus HTTP de témoins privés vérifiés. |

L’installation autonome est réelle, les sources de la copie ont été actualisées exactement pour les retests ciblés ; la combinaison de campagnes est explicitée, sans prétendre que chaque commande a été rejouée après chaque correction documentaire.

## Échecs rencontrés et corrections

- Contrôle global initial : déclarations Node manquantes et types navigateur traversant la frontière Node. Ajout de déclarations ciblées et d’un pont spécialisé ; typecheck complet réussi ensuite.
- Inventaire initial : une chaîne propriétaire de recette CSS était prise pour une définition de composant. Filtrage des propriétaires de composants connus ; retest DS et inventaire réussi.
- Essais ciblés initiaux : ordre de nettoyage d’une fixture incorrect et comparaison trop forte de l’annulation DS. Disposers fermés avant nettoyage ; annulation vérifiée sur références/réglages effectifs et primitives d’origine, avec primitives désormais inutilisées conservées. Retests réussis.
- Relecture du moteur : une projection dont les octets avaient changé pouvait encore afficher une couverture complète. Le test reproduit l’écart ; invalidation de couverture et état affiché corrigés, commit toujours refusé ; retest réussi.
- Relecture Git : les overrides de hooks et signature ont été retirés ; les hooks locaux restent respectés. Une trace préexistante au bootstrap est refusée avant création de Git, témoin conservé octet pour octet.
- Outillage : tentative sandbox d’écoute locale refusée, puis essai autorisé sur loopback ; image Docker web excluant volontairement les instructions/skills, donc inadéquate pour leurs tests. Campagne complète rejouée dans la copie native avec les vrais fichiers, sans modifier les exclusions pour réussir.
- Navigateur : lancement initial avec headless shell bloqué ; canal Chromium déjà retenu par le dépôt utilisé avec succès. Sorties rendues uniques par exécution pour qu’un essai tardif ne remplace plus un autre rapport.
- Test natif du brouillon : refus Vite car le motif privé reconnaissait aussi son ancêtre `.runtime.local`. La nouvelle frontière reste stricte, n’autorise que la racine physique sélectionnée et refuse ses chemins privés, `.git`, `.env` et certificats. Les refus HTTP de témoins privés sont ajoutés au parcours. Première relance invalide à cause de témoins de test créés avec permissions trop ouvertes ; corrigés en 0700, sans assouplir le writer. Lint d’une échappée regex superflue corrigé puis retesté.
- Une relance native a ensuite dépassé 90 secondes à l’arrêt après 14 scénarios réussis. Pas de cause établie : démarrage/arrêt du même témoin par le port commun réussi (arrêt en 3 secondes), puis nouveau parcours natif complet réussi sans correctif runtime supplémentaire. Diagnostics de statut ajoutés au harness. Réserve d’observation conservée ; ne pas présenter cet incident comme un défaut corrigé ni supprimer un verrou pour le contourner.

## Revues applicables

**Technical Reviewer / QA, séquentiel non indépendant.** Lecture entrée → validation → journal → sources → preuve → Git → reconstruction, adaptateurs et reprise. Les corrections de couverture, de protection de la trace initiale et de prévisualisation ont été réattribuées au Builder puis retestées. Les transitions de crash, refus d’index inconnu et séparation commit/intégration sont éprouvées. Conclusion sur `7ff7f8c` : satisfaisant pour le socle ; aucun défaut bloquant confirmé restant, incident d’arrêt non reproduit conservé comme réserve d’observation.

**Security Reviewer, séquentiel non indépendant.** Lecture du port de confiance, capacités HTTP, broker, chemins privés et liens, journaux/reçus et copies. La révision ne vaut jamais accord du fournisseur ; le modèle ne peut pas attester lui-même une intégration ou exécuter un shell. Authentification dédiée, journaux de test séparés et preuve expurgée. Aucun secret/version d’état privé sélectionné. Textes partageables choisis par l’appelant de confiance, pas d’expurgation automatique garantie. Les six refus HTTP finaux sont réussis sur les deux services. Conclusion sur `7ff7f8c` : pas de défaut bloquant identifié dans cette revue proportionnée au runtime local, sans scan externe ni certification.

**Design Reviewer, séquentiel non indépendant.** Pas de maquette Figma fournie pour cette interface minimale : fidélité à Figma indéterminée. Relecture des [captures 1280](desktop-1280.png) et [1440](desktop-1440.png), sélection d’état et d’élément, conversation contextualisée, clavier/focus visible, absence de débordement horizontal et défilement vérifiés par interaction. Réutilisation des contrôles/tokens existants. La page de qualification ne remplace pas l’atelier métier T1 et reste longue ; aucune acceptation visuelle humaine déduite de cette revue. Aucun défaut bloquant constaté sur le parcours desktop qualifié.

## Réserves, reprise et recette humaine

Les sources sont l’autorité partageable ; les worktrees, conversations et authentifications restent privés. Une reprise depuis un clone ne récupère donc pas un brouillon non commité. Un avancement de la base principale bloque conservatoirement la fusion et conserve les versions, sans rebase automatique. Les impacts non reconnus restent en couverture partielle ; aucun graphe universel d’analyse de code ou de parcours revendiqué.

L’adaptateur DS instantané couvre trois opérations déterministes. Nouvelles définitions, import de police, pages/variantes, Figma et interfaces complètes relèvent des tranches suivantes. L’annulation conserve les primitives devenues inutilisées. Ces limites sont exposées dans le contrat et les refus, pas présentées comme capacités T1 réalisées. Plateforme native éprouvée : cet hôte macOS arm64 ; autre machine/signature/distribution non qualifiées ici.

Pour la recette groupée P5-05/P5-08, dans une copie synthétique : ouvrir un brouillon, constater la version sélectionnée, retrouver une conversation après renommage/réouverture, accepter une proposition puis vérifier le seul aperçu sélectionné, arrêter/reprendre, distinguer commit et intégration, lire le refus d’un conflit sans perdre les versions. Les commandes et tests livrés permettent la reprise technique sans ce fil de conversation. Le tiers humain et l’appréciation du designer restent à recueillir dans le [dossier unique](../../../../docs/final-acceptance.md).

Vérification documentaire finale : 578 liens locaux contrôlés sans cible absente (existence, sans recette exhaustive des ancres), diff conforme, sélection exacte des preuves et suivi. Aucun marqueur de credential ou chemin personnel dans les preuves sélectionnées ; captures synthétiques relues. Modèles de suivi applicatifs, autorités de valeurs DS et fichiers non suivis préexistants inchangés. Intégration locale par avance rapide dans main prévue après le commit de ce dossier, sans réécriture d’historique.

Doc updated. Aucun push, déploiement, publication ou acceptation de J5. Prochaine tranche possible après conclusion : MVP-01-T1, avec mandat distinct et accès au fichier Figma pilote à qualifier.
