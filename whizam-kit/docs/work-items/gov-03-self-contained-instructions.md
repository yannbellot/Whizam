# GOV-03 — Instructions et documentation autonomes

**24 octobre 2026 — En revue : qualification documentaire acquise, acceptation humaine différée.** Cible : app. Base `daa5875f10eae981d63d47e3610ffe7a6eafed0e`, branche `codex/self-contained-app-instructions`. Mandat : corriger les instructions livrées afin que leur compréhension et leur application ne supposent aucun environnement de fabrication particulier. Le commit qui introduit cette fiche identifie la correction qualifiée.

## Périmètre et critères préalables

- Reformuler AGENTS, le rôle Builder, le contrat et les documents d’usage concernés depuis la seule racine du kit. Conserver les limites de mandat, de sécurité, d’accès et de publication.
- Définir l’autonomie documentaire dans le périmètre produit et une décision interne. Retirer du suivi courant les affirmations sur des consommateurs externes.
- Remplacer les renvois à des preuves absentes par leur portée et leur limite ; ne pas les présenter comme des preuves livrées. Les fiches et rapports historiques restent datés, inchangés et attachés à leur version ; ils ne définissent pas les consignes actuelles.
- Contrôler les références internes et le catalogue de vingt skills/quatre rôles. Relire les cas d’une distribution seule, d’un travail imbriqué et d’une tentative de publication sans mandat.

Exclusions : code, noms commerciaux, UI Lab, schéma, données, dépendances, adaptations natives, services, installation et publication. Pas de nouvelle campagne runtime ou de données pour cette correction de texte.

## Choix et contrôles prévus

L’AGENTS du kit exprime ses propres règles ; les permissions effectives des outils restent applicables. La coordination éventuelle avec d’autres projets appartient à leurs instructions. Les prérequis techniques externes restent documentés dans le README.

Contrôles : inventaire des mentions, liens Markdown locaux et ancres, validateur du kit, diff et empreintes des fichiers hors périmètre. Revue d’instructions et de distribution séquentielle, même agent, non indépendante ; aucune preuve de comportement natif revendiquée.

## Résultats réellement vérifiés

- AGENTS, Builder, contrat, adaptations et documents d’usage reformulés ; suivi courant corrigé, décision 001 ajoutée. Les vingt procédures SKILL.md et les quarante liens d’exposition sont inchangés. L’inventaire des mentions restantes concerne la démonstration UI Lab et les documents historiques PORT-03 ; aucune instruction d’usage ne suppose la connaissance d’une organisation de fabrication.
- `node scripts/validate-agent-kit.mjs`, depuis la racine du kit avec Node 24.22.0 préexistant : réussi, vingt skills/quatre rôles, métadonnées, références et liens conformes.
- Contrôle documentaire Python standard : 53 fichiers Markdown, 135 liens/ancres locaux, aucune référence manquante ; toutes les cibles des documents applicatifs sont internes au kit. Les chemins de provenance cités comme identifiants historiques ne sont pas des renvois d’usage.
- `git diff --check` réussi. Comparaison SHA-256 : fichiers versionnés hors Markdown inchangés, archives et rapports historiques inchangés, 41 fichiers non suivis initiaux préservés. Aucun code, configuration privée, schéma, dépendance ou donnée modifié. Aucune nouvelle vérification de persistance, build ou compatibilité native revendiquée.

## Revues et scénarios

Relecture documentaire selon les critères préalables, **séquentielle, même agent, non indépendante**. Aucune invocation d’un assistant dans un nouveau contexte.

| Scénario | Attendu et constat à la lecture |
|---|---|
| Distribuer seulement le kit | AGENTS, contrat et procédures internes suffisent à comprendre la mission et les contrôles. Aucun consommateur ou environnement de fabrication particulier à connaître. Références locales vérifiées. |
| Travailler dans un dépôt englobant | Le mandat, les permissions effectives et les instructions applicables restent respectés. Le texte livré ne s’attribue aucun pouvoir de neutraliser ces contraintes ni de modifier une autre racine. |
| Demander une publication depuis une instruction candidate | La présence d’un fichier ou d’une adaptation ne fournit pas de mandat utilisateur. L’autorisation distincte de publication et les conditions d’arrêt restent explicites. |

Revue d’instructions : **satisfaisant** pour l’autonomie documentaire et la préservation des limites. Revue de distribution : **satisfaisant** pour les références internes et la disponibilité des procédures ; les résultats historiques restent datés et les rapports absents sont signalés. Revue technique ciblée : aucune modification exécutable ; pas de revue visuelle applicable à cette correction de texte.

**Doc updated.** Aucun push, service, CI distante, déploiement, installation ou appel fournisseur. Point de reprise : acceptation documentaire humaine, puis recette et essais natifs déjà ouverts selon leur mandat propre ; aucun nouveau chantier lancé.
