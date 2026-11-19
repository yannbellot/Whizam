# UI-DESKTOP-01 — Cible desktop uniquement

11 novembre 2026 — application ; demande explicite de mise à jour documentaire pour les prochaines modifications. Base `8bd50c9`, branche de travail `codex/ui-lab-storybook-style`. Le diff UI-LAB-02 en cours est autorisé séparément et conservé ; aucune écriture sur les fichiers non suivis préexistants.

## Préparation et critères

Inscrire desktop uniquement dans l’intention produit, sa décision, les instructions applicatives, les principes, les guides et l’autorité de conception concernée. Retirer l’obligation future de conception/recette mobile pour Loomata et ses outils. Les projets dérivés conservent leur brief propre. Les preuves anciennes, media queries et tests mobiles existants ne sont pas supprimés par ce mandat documentaire. Aucun blocage technique par user-agent ni modification des composants demandés.

Le cahier des charges QUA-03 exigeait une recette mobile et desktop : la décision explicite du porteur remplace cette exigence pour Loomata, tout en laissant les projets dérivés définir leurs formats. Le responsive continue de couvrir les tailles de fenêtres desktop. Critères : une autorité claire, renvois internes valides, absence d’obligation mobile actuelle contradictoire dans les instructions/guides concernés, modèles de roadmap/état livrés non initialisés.

Procédure lab-maintain-agent-kit du catalogue lab, depuis sa source canonique ; rôle Lab Maintainer, puis Instruction Reviewer séquentiel, même agent, non indépendant. GPT-6.1 Sol · Moyenne recommandé pour les références produit/instructions croisées ; aucun réglage modifié. Vérifications : revue des scénarios futurs et validateurs documentaires/kit ; aucune nouvelle campagne runtime nécessaire pour cette règle.

## Résultat

**En revue — qualification documentaire acquise, acceptation humaine différée. Doc updated.** Décision 032 actée par la demande explicite du porteur.

Sources actualisées : AGENTS applicatif, intention Loomata, décision 032, principes du design system, README et guide UI Lab ; QUA-03 et version 1.14 du cahier des charges racine, autorité de conception de l’app. Suivi consolidé dans la roadmap/état racine. Les modèles de suivi livrés restent non initialisés. Les adaptations, tests et preuves mobiles existants sont préservés ; aucun retrait de code mobile ni changement de permissions/publication.

Contrôles : `npm run validate:agent-kit` PASS (21 skills/quatre rôles), `node scripts/validate-lab-kit.mjs` PASS (quatre skills/trois rôles), 95 destinations documentaires locales vérifiées, ancres nouvelles relues, génération documentaire et diff conformes. Aucun essai fournisseur ou preuve de rechargement natif des instructions revendiqués.

Instruction Reviewer via lab-evaluate-instructions, revue **séquentielle, même agent, non indépendante** : satisfaisante. Scénarios relus : (1) prochaine retouche UI Lab → formats desktop seulement, clavier/focus conservés ; (2) demande documentaire seule → aucune suppression implicite de CSS/tests mobiles ; (3) ancien rapport mobile présenté comme obligation → décision 032 et QUA-03 mis à jour priment pour Loomata ; (4) projet dérivé dont le brief exige du mobile → son propre mandat prévaut, sans élargir la cible de Loomata. Les quatre attendus sont exprimés par les références et règles finales ; relecture de scénarios, pas test comportemental indépendant. Distribution Reviewer ciblé, séquentiel et non indépendant : satisfaisant pour la sélection documentaire. Consigne, référence produit, décision 032 et deux fiches UI-LAB-02/UI-DESKTOP-01 présentes dans l’inventaire de sources ; cibles internes existantes vérifiées. Aucune adaptation ou exposition native modifiée ; aucune nouvelle campagne complète d’extraction revendiquée.

Risque résiduel : mentions historiques nombreuses conservées, à lire sous la décision actuelle ; efficacité lors de la prochaine intervention à observer. Reprise : appliquer le périmètre desktop aux prochaines tranches ; la campagne finale UI-LAB-02 a été relancée sur desktop uniquement (sept contrôles réussis), sans transformer les anciens tests mobiles en obligation.
