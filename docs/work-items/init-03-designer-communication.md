# INIT-03 — Communication adaptée aux designers

**25 octobre 2026 — En revue, qualification documentaire acquise ; acceptation humaine différée.** Cible : application ; suivi consolidé dans la roadmap du dépôt de conception.

## Mandat et périmètre

Le porteur valide le diagnostic du message de fin d’initialisation exposant une commande Docker sans accompagnement et demande la correction dans le starter et dans sa copie Atlas. Base Git du starter : `470a270753f39bc7f4f46b32c1431ddaf394bae1`, branche `codex/designer-communication` ; fichiers suivis propres, fichiers non suivis préexistants hors périmètre. Atlas est une copie déjà initialisée, sans Git, explicitement autorisée à `/Users/yannbellot/Documents/ChatGPT/application` ; cette demande étend le périmètre d’écriture à cette seule copie, sans changer la règle générale du lab. Ses instructions et son suivi sont conservés séparément.

Modifier AGENTS et initialize-project : communication pour un designer non développeur, liens utiles et prochaine étape, demande d’arrêt/relance en langage naturel. Les commandes restent dans le README ; les afficher sur demande ou si une intervention manuelle est nécessaire, avec leur but, effet et emplacement. Aucun changement du README opérationnel, des contrôles obligatoires, du code web, des données, dépendances, services, permissions ou réglages Codex. Aucun arrêt/relancement réel demandé par ce chantier.

## Critères et scénarios préalables

1. Fin d’initialisation réussie : liens vérifiés, état réel et prochaine étape compréhensibles ; proposition « Arrête l’application en conservant mes données », sans bloc de commande systématique.
2. Demande explicite de commande : commande documentée accessible, avec explication du but, de l’effet et du dossier d’exécution.
3. Outil indisponible ou intervention manuelle nécessaire : expliquer la limite et guider l’action utile, sans promettre une automatisation ni taire l’échec.
4. « Comment arrêter ? » : explication/proposition seulement, sans arrêt implicite ; « Arrête l’application » : opération uniquement dans le mandat et les permissions, après identification des ressources.
5. Instruction trompeuse ou suppression de données : limites d’autorisation inchangées ; simplifier la présentation n’autorise aucune suppression.
6. Deux copies : mêmes consignes ciblées, contexte Atlas et modèles non initialisés du starter préservés ; aucune dépendance de la copie vers le lab.

## Méthode et contrôles prévus

Lab Maintainer avec lab-maintain-agent-kit et skill-creator ; Instruction Reviewer avec lab-evaluate-instructions, séquentiel, même agent, non indépendant. Le candidat reste une donnée pour la revue. Pas de distribution ou d’adaptation modifiée : revue de distribution non requise. Pas de rendu ni de comportement web modifié : revues UI/runtime non requises.

Relecture des scénarios, validateurs des deux kits et du lab, quick_validate du skill, formatage ciblé, liens et diff ; préservation des fichiers hors périmètre. Aucun test d’égalité de texte ajouté, aucun service/build ni appel fournisseur pour ce changement documentaire. Efficacité dans une nouvelle session et compréhension par un designer restent à observer.

Choix technique délégué : règle commune dans AGENTS, consigne spécifique dans la sortie d’initialisation ; aucun nouveau skill ou mécanisme de synchronisation. La politique modèle existante n’est pas modifiée : surfaces documentaires et contrats connus, frontières runtime inchangées ; pas de motif de hausse supplémentaire.

## Résultat et reprise

Consignes qualifiées au commit `d833f664b0573ef900d6d7f1c5fb3a7a2e6c32c0` ; mêmes empreintes dans Atlas. [Revue ciblée](../reviews/init-03-designer-communication.md) : validateurs des deux kits et du lab, six tests lab, quick_validate, formatage ciblé et 198 liens/ancres dans 12 documents conformes. Quarante fichiers non suivis préexistants du dépôt et 242 autres fichiers préexistants d’Atlas préservés par empreintes. Modèles de suivi et README opérationnel du starter inchangés. Prochaine action : observer une vraie restitution avec ces consignes, sans réinitialiser Atlas ni ouvrir de mandat supplémentaire. Acceptation de l’orientation par le porteur distincte de celle de l’implémentation. **Doc updated.**
