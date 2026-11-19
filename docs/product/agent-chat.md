# Assistance personnelle dans Loomata

**Cible MVP révisée — 12 novembre 2026 :** Codex seul, conversations générales et une conversation persistante par élément, contexte automatique et moteur commun. [Périmètre canonique](loomata-workspace.md#agents-ia), [décision 033](../decisions/033-loomata-mvp-scope-and-sequence.md). Livraison initiale en T1, extension au pilotage de Planification en T3. Le contrat D ci-dessous décrit l’implémentation actuelle bornée, pas l’ensemble de cette cible. Son évolution doit être qualifiée avant activation ; les règles d’accord par fichier actuelles ne prouvent pas le futur moteur proportionné.

UI-FINAL-01 D, 10 novembre 2026. Première livraison **Codex uniquement**, demandée par le porteur ; Claude Code reste indisponible. Le chat fait partie de l’outil Loomata et travaille sur le dossier sélectionné. Il ne crée pas automatiquement un périmètre métier.

## Utilisation

Après préparation du socle, lancer `npm run loomata`, ouvrir un projet et choisir **Assistance** dans la navigation native. **Connecter Codex** prépare automatiquement le binaire officiel privé, puis présente le lien de connexion officielle à ouvrir dans le navigateur système. Chaque utilisateur utilise son propre compte ; aucune clé API ni connexion de fabrication n’est copiée. Le plan, les quotas et l’accès effectif relèvent du fournisseur. UI Lab et Storybook restent utilisables sans compte IA.

Dans la livraison dossier, le même port s’utilise avec `npm run core:host -- ai.open /chemin/du/projet` ; ouvrir l’URL locale renvoyée. Node/npm et les dépendances du socle doivent déjà être préparés : leur embarquement appartient à E. La première installation de Codex utilise le réseau ; sa version et les intégrités npm sont verrouillées. Qualification actuelle : macOS arm64 seulement.

Écrire l’objectif dans le chat. Le message apparaît progressivement ; l’assistant peut demander une liste de sources, la lecture d’un fichier texte ou proposer son remplacement complet. Une proposition affiche le chemin, la raison, le contenu actuel et le contenu proposé. **Autoriser cette modification** enregistre ce seul fichier après vérification de sa révision. **Refuser** n’écrit rien ; la décision expire après deux minutes et ne peut être rejouée. **Interrompre** annule l’échange et les accords en attente. Les écritures déjà confirmées restent enregistrées.

Les conversations sont conservées par projet et connexion dans l’état privé de cette installation. La reprise réutilise la session fournisseur ; recharger ne renvoie aucun message. Une autre connexion peut consulter l’historique, mais doit commencer une nouvelle conversation. Un historique d’un protocole non qualifié reste consultable, sans reprise automatique. Après arrêt du service d’assistance, **Recharger** dans l’app renouvelle l’adresse auprès du cœur ; en mode dossier, relancer `ai.open` puis ouvrir sa nouvelle URL. Une corruption est signalée sans remplacement silencieux des échanges.

## Contrat et limites

Le cœur expose `ai.open`, `ai.status` et `ai.interrupt` à ses seuls appelants locaux de confiance. `ai.connect` n’est pas une commande CLI directe ; le bouton de connexion appartient au canal de chat. Une origine HTTP propre sert l’interface React de l’outil, indépendamment du code mutable du projet. POST avec origine exacte et capacité propre ; le DOM ne reçoit ni commande shell, ni choix arbitraire de racine, ni capacité du writer DS.

Codex App Server **0.167.0** fonctionne dans son propre répertoire d’authentification. Outils natifs, shell, plugins, hooks, MCP, navigation et moteurs de code restent désactivés ; le profil natif refuse l’accès direct au projet et aux chemins externes. L’inférence et la connexion gérées par le fournisseur nécessitent son service distant ; le profil réseau des commandes n’est pas une promesse de fonctionnement IA hors ligne.

Le modèle retourne une enveloppe JSON fermée `loomata-actions-v1` : `respond`, `list`, `read` ou `write`. Le cœur valide et réalise les seules actions permises, puis fournit leur résultat comme données au tour suivant ; huit actions au maximum par message. Aucun code retourné n’est évalué. Les fichiers cachés/privés, secrets par chemins connus, liens et liens physiques multiples sont refusés. Lectures et propositions sont bornées ; un contenu secret placé dans un fichier public ordinaire ne peut pas être reconnu automatiquement. Les sources lues sont transmises au fournisseur lors d’une demande explicite de l’utilisateur.

Les autorités et dérivés DS, UI Lab, le chat lui-même et l’outillage sont protégés en écriture. Pour le DS, utiliser UI Lab et son writer existant. Le broker ne lance ni installation, shell, commande Git ou migration ; les modifications permises portent sur des fichiers texte du projet, un à un. L’app exécute déjà le code de développement des projets ouverts : ceux-ci doivent être de confiance. Ce confinement ne prétend pas résister à un administrateur local ou à un processus malveillant du même utilisateur qui remplace les fichiers simultanément.

État privé : `.runtime.local/agent-chat/` de l’installation ; identifiants gérés par le fournisseur, historique, reçus et capacités exclus de la liste de création des projets. Ne jamais copier ce dossier dans un projet ou un ZIP. Les exports eux-mêmes restent à réaliser en E. L’assistance d’intention spécialisée du DS conserve son propre contrat et sa connexion ; aucune migration implicite.

## Vérification

`npm run test:agent-chat` vérifie le broker et les sessions ; `npm run test:agent-chat:provider` qualifie le vrai binaire déconnecté sur des témoins synthétiques ; `npm run test:agent-chat:ui` utilise un transport explicitement simulé avec vrai HTTP/fichiers. Pour la qualification personnelle réelle, après connexion dans Loomata : `npm run test:loomata:chat -- --project /chemin/projet-jetable-prepare --live`. Cette commande envoie de vrais messages, utilise la connexion dédiée de cette installation et ajoute un témoin au seul projet jetable ; elle ne copie aucun identifiant. Elle conserve les rapports et arrête les services de ce projet.

[Résultats et réserves D](../reviews/ui-final-01-d/README.md). Références officielles : [App Server](https://learn.chatgpt.com/docs/app-server), [permissions](https://learn.chatgpt.com/docs/permissions). Interfaces expérimentales utilisées : profils nommés et schéma de sortie ; toute mise à jour du binaire requiert requalification. **Doc updated.**

## Projet utilisant le socle commun

Lorsque le projet a initialisé la [coordination Loomata](../architecture/workspace-contract.md), la vue indique la version sélectionnée et sa couverture. Les conversations générales et par élément partagent l’identité durable du projet. Une proposition approuvée rejoint le brouillon ou chantier sélectionné via le moteur ; la version principale est conservée. Une évolution concurrente rend la proposition périmée. Le compte, les accords et les outils natifs gardent les protections décrites ci-dessus. Un projet sans état de coordination conserve le chat historique borné ; il n’est pas déclaré migré automatiquement.
