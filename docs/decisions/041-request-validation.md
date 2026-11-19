# 041 — Analyser les demandes et valider l’exécution

**Date :** 19 novembre 2026.  
**Statut :** logique approuvée par le porteur du kit ; application documentaire à soumettre à revue.

> Extension du 19 novembre 2026 : la [décision 042](042-assistant-choice-and-claude-routing.md) ajoute le choix préalable d’assistant et une politique Claude Code. Les mentions de Codex seul ci-dessous décrivent la portée initiale ; AGENTS définit le traitement courant.

## Décision

Adopter le [traitement des demandes dans AGENTS](../../AGENTS.md#traitement-des-demandes-et-validation-de-lexécution) : réponse informative directe ; proposition et validation avant une modification nouvelle dépassant le seuil mineur ; exécution directe d’une modification mineure selon les critères documentés, puis confirmation brève. La validation couvre les contrôles et corrections nécessaires au périmètre annoncé, sans répétition pour les précisions déjà couvertes.

Dans Codex, suivre le couple modèle/niveau de la [politique courante](../codex/chantier-model-routing.md). L’afficher à la première recommandation ou s’il change, jamais systématiquement après chaque question. Une première recommandation ou son changement impose une validation avant l’exécution concernée, y compris mineure. Une configuration inchangée ne dispense pas de validation d’un nouveau périmètre non mineur.

## Portée et conséquences

Cette décision remplace la disposition d’affichage systématique de la décision 003 et les dispositions d’exécution immédiate d’une demande initiale dans le parcours 004. Les seuils qualitatifs de choix de modèle/effort sont conservés. Les autres assistants appliquent la validation commune sans équivalence de modèles inventée. Le choix manuel du client, ses instructions prioritaires et ses permissions restent applicables ; aucun mécanisme technique de blocage n’est ajouté.

Le suivi permet la reprise du périmètre validé et de la dernière recommandation connue. Son absence ne prouve pas un réglage du client. Ni validation d’exécution, ni contrôle structurel ne valent acceptation humaine du résultat ou qualification native d’un assistant. Les preuves historiques restent datées et ne qualifient pas cette révision.
