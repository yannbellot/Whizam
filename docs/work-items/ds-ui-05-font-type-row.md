# DS-UI-05 — Ligne Type pour la famille typographique

15 novembre 2026 — Application, réalisation autorisée. Base `532ff94`, branche codex/ui-lab-font-type-row. Racine Git vérifiée ; aucun changement suivi préexistant, copies non suivies conservées.

Mandat : afficher Type à gauche et le sélecteur de famille à droite ; retirer le spécimen. FontPicker et feuille de chrome concernés ; catalogue/import/validation/portée inchangés. Réutiliser InspectorSelect et les dimensions existantes. Procédure implement-feature et revues design/technique à la version de base ; séquentiel, même agent, non indépendant. GPT-6.1 Sol · Moyenne recommandé. Contrôles : types/lint/génération et inspection du champ ; aucun import distant de police nécessaire.

## Résultat

**En revue — qualification web acquise, acceptation humaine différée ; fenêtre native non actualisée pour préserver le brouillon utilisateur.** Doc updated. Version : réalisation sur base `532ff94`.

FontPicker affiche Type et InspectorSelect sur une même ligne ; le spécimen est retiré du DOM. Tokens existants réutilisés ; import, catalogue et callbacks inchangés. Trois attentes de tests adaptées au nouveau libellé (appearance.spec.ts et fonts.spec.ts), sans exécution des campagnes d’import réseau. Types de la copie autonome, lint ciblé et génération conformes. CUA navigateur 1280×800 : Type à x=1001, champ à x=1089, centres verticaux alignés, hauteur 30 px ; spécimen absent (0 occurrence). [Capture](../reviews/ds-ui-05-font-type-row/inspector.png). Aucun import de police ni sauvegarde effectué pendant ce contrôle.

Les services de la copie fictive ont été redémarrés pour charger le nouveau module. L’inspection finale de la fenêtre native a constaté un brouillon ouvert (famille et graisse), conservé en mémoire : aucune actualisation ni abandon de cette fenêtre. Son ancien module affiche encore le libellé précédent. Reprise : enregistrer ou abandonner ce brouillon selon le choix de l’utilisateur, puis actualiser la vue ; ne jamais le faire implicitement.

Revues design/technique séquentielles, même agent, non indépendantes : alignement conforme, même select HTML et mêmes options, aucun changement métier. Revue de portée sécurité sans nouvelle entrée ni permission. Risque résiduel : affichage natif à recontrôler après résolution du brouillon ; contrôles d’import existants non rejoués car comportement inchangé. Aucune publication.
