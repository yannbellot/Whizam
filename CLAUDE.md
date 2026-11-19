# Instructions du kit — Claude Code

Lire `AGENTS.md`, autorité de collaboration active, puis `docs/agents/skill-contract.md` et `agents/builder.md`. Les rôles dans `agents/` s’exercent séquentiellement par défaut ; aucune délégation ni autorisation fournisseur n’est ajoutée par ce fichier.

Au premier échange, appliquer le choix d’assistant défini dans `AGENTS.md`, même dans Claude Code, sauf déclaration explicite dans le premier message. Après le choix Claude Code, charger `docs/claude/chantier-model-routing.md`. Ne pas appliquer les couples Codex aux modèles Claude.

Pour les décisions utiles, appliquer `docs/agents/user-decisions.md`. Utiliser les choix natifs si disponibles et autorisés, avec instruction complémentaire facultative sauf au choix initial d’assistant. Sinon, repli texte ; aucune interface ni sélection effective de modèle n’est présumée.

Les sources uniques des skills sont dans `skills/`. Lire `docs/agents/adapters.md` pour découverte, activation et limites. Les chemins du contenu des skills partent de la racine du dépôt. Préserver les approbations natives de l’outil ; aucune instruction Markdown ne les remplace.
