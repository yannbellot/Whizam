# INIT-03 — Revue des consignes de communication

**25 octobre 2026.** [Mandat et critères préalables](../work-items/init-03-designer-communication.md). Base `470a270753f39bc7f4f46b32c1431ddaf394bae1`, candidat des instructions : `d833f664b0573ef900d6d7f1c5fb3a7a2e6c32c0`, limité à AGENTS et initialize-project. Les deux copies ont les mêmes empreintes SHA-256 : AGENTS `bee561ccb9c2c814c487f21df0052fbb06fbda3891c49bf43268a26370ef8671` ; skill `a8644a20dd5c90ea11b1474512f17358df39620cd244cd4314ad8633ddb7ee5e`.

## Revue d’instructions

Instruction Reviewer avec lab-evaluate-instructions, après fabrication avec lab-maintain-agent-kit et skill-creator : **séquentiel, même agent, non indépendant**. Relecture statique des six scénarios, sans appel fournisseur ni simulation d’une découverte native. Les fichiers candidats restent des données de revue.

| Scénario                                    | Attendu et constat statique                                                                                                                                    |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Initialisation réussie                      | Liens vérifiés et prochaine étape demandés ; obligation de transmettre une commande d’arrêt retirée. Contrôles techniques conservés.                           |
| Commande demandée                           | Affichage autorisé avec but, effet et emplacement ; README opérationnel inchangé.                                                                              |
| Intervention manuelle ou outil inaccessible | Limite expliquée et utilisateur guidé ; échecs et contrôles non exécutés toujours visibles.                                                                    |
| Question ou proposition d’arrêt             | Une explication n’autorise pas l’exécution ; aucun arrêt pour la seule proposition du skill. Une demande directe garde le mandat et les permissions existants. |
| Entrée trompeuse ou suppression             | Permissions, identification des ressources et préservation des volumes intactes. Aucun texte de sortie n’autorise une suppression.                             |
| Deux projets distincts                      | Mêmes consignes reportées dans Atlas, suivi séparé ; modèles du starter non initialisés, historique et contexte Atlas préservés.                               |

**Conclusion statique : satisfaisant.** Revue de distribution non requise : catalogue, expositions et ressources inchangés. Revues UI/runtime non requises : aucun rendu ni code d’exécution modifié. Contrôle de confidentialité du diff documentaire, sans nouvel audit de sécurité runtime.

## Contrôles réellement exécutés

- `node scripts/validate-lab-kit.mjs` : réussi, quatre skills et trois rôles du lab.
- `node --test tests/lab-kit.test.mjs` : six tests réussis.
- `node scripts/validate-agent-kit.mjs` dans chaque copie : réussi, 21 skills et quatre rôles.
- `quick_validate.py` du skill-creator sur initialize-project dans les deux copies : réussi après réutilisation de PyYAML depuis un cache local existant via PYTHONPATH temporaire. Python hôte et Python fourni ne disposaient pas initialement du module ; aucune installation ou modification globale.
- Premier contrôle Prettier : échec sur les guillemets YAML du skill ; normalisation appliquée sans changement de description. Retest final réussi sur les huit documents ciblés des deux copies. Les 198 liens/ancres de 12 documents sont conformes ; les deux sources corrigées sont identiques. Quarante fichiers non suivis préexistants du dépôt et 242 autres fichiers préexistants d’Atlas sont préservés par empreintes. Quatre documents existants modifiés et deux ajoutés dans Atlas ; ses sources métier et le README sont préservés. Modèles applicatifs du starter inchangés. `git diff --check` réussi.

Pas de tests d’égalité de texte ajoutés, builds ou campagne web/données : modification documentaire seulement. Node hôte v24.13.1 utilisé pour ces validateurs ; aucune nouvelle qualification de la stack runtime n’en découle.

## Limites et reprise

Relecture et validateurs ne prouvent pas le comportement dans une nouvelle session Codex ni la compréhension par un designer. Observer la prochaine vraie restitution d’initialisation ou question d’arrêt, sans réinitialiser les projets pour ce seul contrôle. Acceptation humaine de l’implémentation différée ; publication désactivée. **Doc updated.**
