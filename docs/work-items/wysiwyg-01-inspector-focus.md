# WYSIWYG-01 — Contour de focus des champs

Cible application, base 19d10b7. La zone défilante de l’inspecteur coupe le contour des commandes qui touchent son bord. Déplacer le retrait horizontal du panneau à l’intérieur de cette zone et réserver un espace lors du défilement clavier. Le CSS de l’inspecteur est le seul fichier d’implémentation concerné. Les modifications en cours sur la largeur du curseur sont isolées.

Procédures applicatives implement-feature, review-design et technical-review reconduites. GPT-6.1 Sol · Moyenne pour la correction locale. Vérifications prévues sur Chromium et WebKit, comparaison au rendu précédent, navigation clavier et contrôle de génération. En cours.

**En revue après qualification technique, acceptation humaine différée.** Le contrôle dans les deux navigateurs mesure 0 px entre le champ Fond et le bord droit défilant avant la correction, puis 16 px pour un contour et son décalage de 4 px. Le contour du contrôle de largeur reste visible après déplacement du focus et défilement au clavier. Chromium 156 et WebKit 27.2, génération des tokens, trois tests de composition, formatage CSS et diff conformes. Revue séquentielle par le même agent. Doc updated. [Nouvel aperçu local](http://127.0.0.1:64269/ui-lab?scene=components%2FOverview).
