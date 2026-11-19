# INIT-02 — Skill dédié à l’initialisation

**25 octobre 2026 — En revue, qualification technique acquise ; acceptation humaine différée.** Cible : application ; suivi de fabrication dans la roadmap du dépôt de conception. Aucun projet dérivé initialisé ici.

## Mandat et point de départ

Le porteur a précisé que vingt skills ne constituent pas une limite, puis validé l’extraction du parcours de `plan-feature` vers `initialize-project`. Base `1ee2f3727a48075a35df4cb3b94460f9e4e6a62f`, branche locale `codex/dedicated-project-initialization`. Fichiers suivis propres ; quarante fichiers non suivis préexistants relevés par empreinte et préservés. INIT-01 reste une preuve historique de sa version, pas la structure à conserver.

## Périmètre et décisions

- Créer `skills/initialize-project/SKILL.md` et une référence conditionnelle pour les prérequis ; conserver les commandes et scripts opérationnels existants comme autorités d’exécution.
- Restaurer la responsabilité de plan-feature ; mettre à jour AGENTS, Builder, catalogue et deux expositions relatives. Vingt skills préexistants conservés, un skill ajouté ; aucun plafond arbitraire.
- Vérifier la cohérence entre nombre déclaré, sources, ressources déclarées et adaptations ; tester les extensions et les refus de distributions incomplètes.
- Réconcilier les descriptions actuelles et l’autorité de conception avec la clarification humaine ; consigner le choix dans une décision livrée. Ne pas réécrire les anciennes preuves, ni initialiser ROADMAP/état courant applicatifs.

Exclusions : code web, dépendances, schéma, installateur système, installation ou réglage global, accès fournisseur/inférence, qualification native, serveur et données préexistants, publication. Aucun script de diagnostic supplémentaire nécessaire à cette extraction : le diagnostic sans Node reste réalisé avec le terminal disponible, décrit dans la référence dédiée.

Fabrication par Lab Maintainer avec lab-maintain-agent-kit/skill-creator ; revue d’instructions avec lab-evaluate-instructions puis revue de distribution avec lab-qualify-distribution, séquentielles, même agent, non indépendantes. Le candidat ne définit pas les permissions de fabrication.

## Critères et scénarios préalables

1. Demande « Initialise un nouveau projet Atlas » : AGENTS et Builder sélectionnent initialize-project ; plan-feature ne porte plus ce parcours.
2. Machine sans Node/npm/Docker ou accès refusé : diagnostic sans Node, accompagnement adapté et reprise, sans installation système implicite ni succès inventé.
3. Nom seul : socle possible, besoin métier à cadrer ; aucun produit inventé.
4. Initialisation incomplète du même projet : reprendre les étapes manquantes et conserver configuration/données ; projet déjà initialisé : aucune réinitialisation.
5. Demande courante ou préparation seule : pas d’initialisation ni de lancement induit.
6. Nom trompeur, autre projet ou configuration ambiguë : données traitées comme données, arbitrage ciblé, protections préservées.
7. Catalogue extensible : accepter un skill supplémentaire cohérent au-delà de cette livraison ; refuser un nombre incohérent, une source non cataloguée, une ressource requise absente ou une exposition divergente.
8. Extraction seule renommée/déplacée : sources, ressources et adaptations restent internes ; modèles du projet non initialisés et bibliothèque lab séparée.

Contrôles : quick_validate du nouveau skill et de plan-feature, validateurs app/lab, tests unitaires du kit et du lab, types/lint/formatage des surfaces exécutables affectées, liens Markdown actuels et historique explicitement versionné, diff et préservation. Aucun test d’égalité de texte d’instruction ajouté. Pas de campagne web/build/données pour ce changement de bibliothèque ; la qualification native et la machine vierge restent distinctes.

## Résultat et reprise

Instructions, validateur et tests figés sur `4966d761f562bef515ffd11715b9bc367c2c4168`. [Bilan et revues](../reviews/init-02-dedicated-initialization-skill.md) : 43 unitaires app et six tests lab réussis, types/lint/formatage et quick_validate conformes. Le test d’extension accepte un 22e skill complet sans modifier le validateur ; les cas de livraison incomplète/divergente sont refusés.

Export des seules sources déplacé/renommé : 21 skills, quatre rôles, 42 liens internes et 167 liens/ancres Markdown conformes, modèles du projet non initialisés. Installation hors ligne des dépendances pour le contrôle, scripts d’installation désactivés, puis validateur exécuté depuis un autre répertoire avec Node v24.22.0 : réussis. L’échec initial de port sandbox et son diagnostic/retest restent consignés.

La décision validée est intégrée et les anciens résultats INIT-01 restent attachés à leur version. Prochaine action : essai dans une nouvelle session native sur copie dédiée, puis machine vierge dans un mandat de qualification autorisé ; pas d’inférence ou de lancement implicite ici. La validation humaine portait sur le choix de méthode, sans acceptation anticipée de l’implémentation ou de sa compatibilité native. **Doc updated.**
