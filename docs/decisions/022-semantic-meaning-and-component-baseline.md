# 022 — Sens sémantique et base des tokens de composants

31 octobre 2026 — DS-EDIT-19, **contrat implémenté et techniquement qualifié, acceptation humaine différée**. Base inspectée 5bc6792, candidat 1c807da. La règle de sens est déjà définie par le mandat ; elle n’est pas soumise à un nouvel arbitrage. Ce document consigne son application technique ; le [bilan de qualification](../reviews/ds-edit-19-storybook-structure-and-token-meaning.md) porte les preuves et limites de cette version.

## Règle et inventaire

Une intention ou un rôle documenté et indépendant d’un composant justifie un token sémantique. La propriété CSS, une valeur égale ou une réutilisation ne suffisent pas. Un token de composant peut référencer ce rôle ou directement une primitive. Un espacement pourrait être sémantique avec une règle relationnelle établie ; les styles actuels sont audités individuellement, sans inventer cette règle a posteriori.

La [matrice complète](../reviews/ds-edit-19/token-classification.md) examine les 41 styles actuels : 17 rôles sémantiques conservés, 24 styles à retirer du catalogue actif, 137 réglages devenant autonomes parmi les 188 tokens de composants. Les références primitives et les valeurs résolues restent conservées. Ce résultat porte sur ces données ; ce n’est pas une interdiction de tokens sémantiques typographiques ou géométriques futurs. Un état reste une déclinaison du rôle, sans justification sémantique autonome.

Cette évolution remplace, lors de sa réalisation effective, la contrainte de 020 imposant un style d’origine à chaque composant et la conservation intégrale du graphe de 021. Les autres règles restent applicables. Les anciens documents conservent leur portée historique.

## Représentation v4

Pour chaque token de composant, séparer explicitement :

- `reference` : référence effective, vers un style sémantique compatible ou une primitive ;
- `style` : identité du style sémantique attribué, ou null lorsque le réglage est autonome ;
- `baseReference` : primitive de base du réglage autonome, conservée indépendamment de ses modifications locales ;
- provenance : modification locale effective et historique de migration distingués, sans inventer une attribution.

La base primitive est capturée depuis l’attribution initiale résolue, jamais depuis une exception propre. Si une attribution sémantique existe, rétablir la suit dans sa valeur partagée courante ; sinon rétablir rejoint la base primitive. Attribuer un style compatible ne détruit pas la base primitive historique. Une saisie locale modifie seulement la référence effective, pas l’attribution ni la base. Aucune opération cliente n’écrit librement une nouvelle base.

Exemple enregistré à préserver : le bouton #b51a00 reste propre avec son attribution d’action principale ; rétablir rejoint l’action principale partagée, pas #b51a00. Pour un padding autonome, modifier puis rétablir rejoint sa base primitive sans recréer un faux style neutre.

Le nom technique `style` est conservé pour limiter les ruptures des dépendants ; sa valeur est explicitement nullable et ne reçoit jamais une primitive. Ne pas introduire des champs facultatifs ambigus, de faux objets sémantiques de substitution, ni surcharger `style` avec une primitive pour contourner le type actuel.

## Migration et compatibilité

Transformer les huit sources v3 sur copie vers un ensemble préparé cohérent ; assembler un modèle v4 et publier un snapshot de version distincte. Prévoir protocole d’écriture et politique de décision d’assistance versionnés pour refuser un ancien plan ambigu. La version du canal d’aperçu n’augmente que si son format change réellement ; la génération et les décodeurs doivent empêcher tout mélange ancien/nouveau. Les versions exactes seront consignées avec l’implémentation retestée, pas déclarées acquises ici.

La [matrice structurée](../reviews/ds-edit-19/token-classification.json) garde anciennes identités, consommateurs et correspondances. Pour un style retiré : résoudre la primitive terminale, remplacer seulement les attributions sans sens établi, conserver les références propres, archiver la provenance/correspondance hors catalogue actif. Les 24 alias historiques demeurent des interfaces de compatibilité ; ceux d’un style retiré référencent sa primitive terminale, sans réintroduire ce style dans le catalogue sémantique.

L’ancienne variable CSS d’un style retiré doit être auditée dans les consommateurs : si une compatibilité est nécessaire, elle doit être une sortie historique documentée, distincte du graphe actif et sans nouvelle possibilité de propagation partagée. L’égalité attendue porte sur les valeurs résolues et rendus ; les octets du CSS peuvent changer en raison du reclassement. Les identités des 188 composants et des primitives restent stables.

Le writer doit sérialiser les nouvelles attributions/bases et leurs absences sans recréer `style`, puis relire le même modèle validé. Anciens journaux, reçus et connexions restent dans leur racine/version ; aucune conversion ou purge. Une compatibilité de lecture/migration des sources v3 ne rend pas leur service vivant compatible avec v4.

## Conséquences pour l’édition et les choix assistés

En l’absence d’attribution sémantique, la fiche ne propose ni style d’origine, ni portée partagée, ni création sémantique fondée sur la seule propriété. L’assistance locale conserve les plans bornés pour le réglage et son rétablissement ; elle ne doit pas dépendre d’un objet `assigned` fictif. Une attribution sémantique reste possible seulement avec un rôle démontré et une compatibilité vérifiée.

La définition d’une intention générique du catalogue ne prouve pas son adéquation à chaque propriété. Les règles de guidage actuelles, les options de création, les contextes d’assistance et leur politique doivent être examinés ensemble pour empêcher la recréation des 24 faux styles après migration. Aucun fournisseur réel n’est nécessaire ni autorisé implicitement.

## État et reprise

Les sources du kit et une copie de la recette enregistrée sont migrées en v4 ; les anciennes racines restent intactes. Les garanties de la fiche DS-EDIT-19 sont techniquement démontrées : édition/rétablissement dans les deux cas, alias, valeurs/rendus, persistance/récupération, plans/refus, routes et extraction autonome. Modèle v4, snapshot v3, écriture v3, politique assistée v3 et manifeste v8 sont qualifiés dans le bilan lié ci-dessus. La reprise explicite a autorisé la mise en œuvre ; aucune sélection client vérifiable n’est prétendue. La recette humaine reste à réaliser.
