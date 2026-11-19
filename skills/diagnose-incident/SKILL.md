---
name: diagnose-incident
description: "Relier un symptôme ou échec à des observations, hypothèses testées et une cause vérifiée, puis corriger dans le périmètre et retester."
---

# diagnose-incident

Entrées : symptôme, version, commande/parcours, environnement et logs expurgés. Lire docs/agents/skill-contract.md ; utilisable dès le développement local.

## Travail et sortie

Conserver l’échec initial et distinguer fait, hypothèse et cause. Inspecter le chemin réellement exécuté ; privilégier un essai discriminant borné avant relance. Ne pas transformer une erreur de fixture, accès ou outil en défaut produit sans preuve. Garder la cible et ses données isolées ; ne pas purger, changer de port silencieusement ou contourner une gate pour obtenir du vert.

Documenter cause et correction minimale avec version, résultat avant/après, retest et limite. Si le défaut relève du mandat, corriger puis relancer les seules vérifications invalidées. Si un accès/décision matériel manque, fournir le checkpoint et la prochaine action précise ; poursuivre les travaux indépendants. Aucun détail secret dans le diagnostic ni appel fournisseur réel implicite.
