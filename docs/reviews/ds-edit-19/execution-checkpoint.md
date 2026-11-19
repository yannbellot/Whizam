# DS-EDIT-19 — Point historique après inventaire

**Point d’arrêt historique, dépassé par la reprise explicite du porteur et la réalisation.** Voir le [bilan final](../ds-edit-19-storybook-structure-and-token-meaning.md). Aucune nouvelle attente de sélection ne découle de ce document.

31 octobre 2026 — application, base 5bc6792, branche codex/ds-edit-19. Mandat de réalisation explicite reçu. **En cours : inventaire effectué ; migration et navigation non commencées. Doc updated.**

## Travail réalisé

Lecture des autorités, contrats, générateurs, writer, choix d’assistance et routes. [Matrice des 41 styles](token-classification.md), [correspondances par token](token-classification.json), [routage des 18 fichiers de stories/MDX suivis](story-routing.json), [contrat cible proposé](../../decisions/022-semantic-meaning-and-component-baseline.md). La règle de sens n’est pas rouverte. Aucun type de valeur n’est globalement interdit comme sémantique.

Les 17 styles conservés portent lecture neutre/secondaire, surface, délimitation, action principale, focus, disponibilité et feedback. Les 24 styles sans rôle propre démontré concernent des choix de géométrie et de typographie génériques ; 137 bindings doivent devenir autonomes, les 188 identités de composants étant conservées. Les 24 alias historiques sont inventoriés. Les six positions de navigation restent prévues ; aucun Pattern/Template réel n’a été qualifié par cet inventaire, aucune page factice ajoutée.

Les modèles canoniques et enregistrés ont été copiés dans .local/ds-edit-19/preflight.local.json avec les empreintes des 85 préexistants. Le CSS courant a un témoin privé. Les sources suivies de l’app n’ont pas évolué depuis DS-EDIT-18 hors documentation ; ses preuves visuelles restent historiques, aucune nouvelle comparaison de rendu revendiquée. Le modèle enregistré du bouton conserve #b51a00 et l’attribution actions.primary. Le port 54118 n’avait aucun écouteur lors de l’inspection ciblée ; aucun serveur lancé, arrêté ou actualisé dans cette tranche.

## Difficulté observée et recommandation

Le plan préparatoire identifiait une migration au niveau élevé. L’inspection des chemins effectifs montre que le changement n’est pas une simple possibilité d’attribution nulle :

1. contract.ts valide un style existant pour chacun des 188 bindings ; la validation des opérations parcourt aussi cette attribution avec une assertion non nulle. operations.ts/restore la recopie comme référence effective. Un champ optionnel seul casse le rétablissement.
2. draft.ts couple valeur projetée, portée partagée et exception à binding.style. Panel.tsx et SemanticStyles.tsx supposent aussi cet objet présent. Le writer store.mjs ne sérialise aujourd’hui que style/reference/provenance, sans base autonome.
3. style-decision.ts déréférence assigned.id/intention avant de construire même un plan local ; les recommandations et compatibilités du catalogue peuvent recréer un faux style géométrique. Les plans d’assistance restent liés aux empreintes de génération/politique et aux opérations bornées : les adapter seulement côté UI laisserait une incohérence serveur.
4. Les alias historiques et les anciennes variables CSS sont des interfaces de compatibilité distinctes des styles actifs à retirer ; le snapshot, les schémas fermés et la récupération doivent refuser les mélanges de versions sans perdre une référence propre enregistrée.

La vérification conjointe de ces chemins, de la migration et des refus, tout en préservant deux comportements de rétablissement, justifie **GPT-6.1 Sol · Très élevée (xhigh)** pour B et ses dépendants. Aucune supériorité de modèle ni garantie de réussite alléguée. Selon AGENTS.md racine, section Configuration : « Si une difficulté observée justifie très élevé (xhigh) […] recommander le niveau puis s’arrêter avant de poursuivre la partie concernée. Attendre la sélection manuelle et une demande explicite de reprise. » Aucun réglage du client n’est modifié ou prétendu vérifié ; aucun sous-agent ou fournisseur invoqué.

## Vérifications et limites

Inspection structurée des données existantes et relecture documentaire seulement. Les totaux et correspondances des matrices sont contrôlés contre les 41 styles/188 bindings/24 alias du témoin. Les liens locaux, le diff et les empreintes des préexistants sont vérifiés avant le commit de reprise. Types, tests unitaires/contractuels, builds, parcours, récupération et extraction v4 ne sont pas exécutés : aucun changement runtime n’a été commencé. Aucune revue de réalisation acquise ; revues design/technique/sécurité toujours prévues, séquentielles et non indépendantes sans délégation autorisée.

Reprise : sélectionner manuellement GPT-6.1 Sol · Très élevée, puis demander explicitement « Reprends DS-EDIT-19 ». Relire ce point, les matrices et 022, confirmer le contrat minimal puis commencer la migration sur copies ; C/D suivent B. Aucun arbitrage supplémentaire sur la définition sémantique demandé. Les critères d’acceptation humaine, G/J5 et modèles app restent distincts. Aucun push, installation ou publication.
