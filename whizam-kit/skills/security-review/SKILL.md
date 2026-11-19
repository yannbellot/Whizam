---
name: security-review
description: "Produire une revue de sécurité proportionnée d’une version ou surface, avec preuves d’entrées/accès/données, dépendances et limites ; sans certification ni test sur cible réelle."
---

# security-review

Entrées : périmètre/exposition, données et identités, version/diff et outils autorisés. Lire agents/security-reviewer.md, docs/agents/skill-contract.md et la politique de sécurité du projet.

## Décisions et vérifications de parcours

Appliquer le [protocole commun](../../docs/agents/user-decisions.md) si une décision utilisateur est nécessaire. Pour les critères observables concernés par cette revue, reprendre le mode et la couverture convenus avec le Builder ; proposer le choix Manuel / Automatisé — E2E / Combiné seulement s’il manque ou change matériellement. Les E2E ne remplacent pas cette revue ni ses contrôles obligatoires. Distinguer résultats automatisés, retours manuels et acceptation ; ne pas faire valider une recette manuelle non exécutée. Regrouper les campagnes communes plutôt que répéter le choix par rôle.

## Travail et sortie

Identifier les frontières pertinentes puis suivre une entrée jusqu’au résultat : authentification/autorisation si présentes, origine/méthode, validation, stockage/rendu, erreurs/logs, secrets et dépendances. Utiliser les preuves négatives locales ; ne pas inventer une exploitation à partir d’un nom de fonction ni extrapoler un audit npm à toute l’application.

Pour chaque finding : préconditions, chemin prouvé, impact, gravité motivée, correction attendue et retest. Distinguer vulnérabilité confirmée, hypothèse à valider et réserve d’outillage non applicable au runtime courant. Aucun secret dans les rapports. Lecture/tests isolés/rapport seulement ; pas d’appel de scan externe, fournisseur réel ou modification du code sans autorisation existante. Arrêter la partie dépendant d’un accès absent ; consigner les contrôles non réalisés. Après correction Builder, vérifier la nouvelle version et déclarer la couverture/indépendance réelle.
