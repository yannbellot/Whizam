# WYSIWYG-01 — Couleurs hexadécimales et transparence

Cible application, base `6ea8927`. Afficher les couleurs CSS du panneau droit en hexadécimal et visualiser l’alpha sur un damier. Utiliser le sélecteur natif avec alpha lorsque le navigateur le permet, et le sélecteur natif RVB accompagné d’un curseur de transparence sinon. Le contrat opaque actuel des tokens enregistrés reste applicable. Périmètre : champs de couleur du panneau CSS, styles et vérifications. Les retouches préexistantes du curseur sont isolées.

Procédures applicatives de réalisation et de revue reconduites. GPT-6.1 Sol · Moyenne. Vérifier le rendu, l’édition et l’annulation, les champs de contour et les deux chemins de sélection. Mesurer la taille calculée des repères à quatre valeurs.

**En revue après qualification technique, acceptation humaine différée.** Dans la galerie, fond, texte et côtés affichent le sRGB en six chiffres et l’alpha en huit. Sur le fond, l’événement du contrôle natif WebKit 27.2 et le curseur de repli Chromium 156 projettent la même valeur. Damier, annulation et saisie RGBA d’un côté vérifiés. Les quatre repères de côté mesurent 12 px dans les deux moteurs. Le dialogue système natif lui-même et le parcours intégral Pages restent à vérifier en recette. L’assertion de régression partagée couvre la saisie, le rendu et le damier.

Types et génération sur copie isolée, formatage, diff, présence au manifeste et six tests d’export conformes. Lint ciblé sans erreur avec l’avertissement préexistant sur un effet de l’inspecteur. Revue design et technique séquentielle par le même agent. Doc updated. Reprise sur l’[aperçu local](http://127.0.0.1:49629/ui-lab?scene=components%2FOverview).
