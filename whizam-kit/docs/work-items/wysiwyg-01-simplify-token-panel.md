# WYSIWYG-01 — Allègement des réglages enregistrés

Cible application, base b12d1a7. Retirer « Attributions et contraste » et « Choisir dans Google Fonts » du panneau droit du UI Lab. Les champs de réglage conservent le sélecteur Type pour la famille de police et l’édition de leurs valeurs. Périmètre : TokenInspector, option de présentation de FontPicker et vérifications ciblées. Les retouches préexistantes de largeur du curseur restent isolées.

Procédures applicatives de réalisation et revue reconduites. GPT-6.1 Sol · Moyenne pour ce changement local. Vérifier les deux absences sur un composant avec typographie et l’accès au sélecteur. En cours.

**En revue après qualification technique, acceptation humaine différée.** Chromium 156 et WebKit 27.2 confirment l’absence des deux sections sur le libellé d’un champ et la présence des contrôles Taille et Type, avec leurs choix chargés. Le contrôle de types sur copie isolée, la génération et le lint ciblé passent. Le test de navigateur existant couvre ces assertions, reprises dans un parcours ciblé pour cette tranche. Revue séquentielle par le même agent. Doc updated. [Aperçu local](http://127.0.0.1:49795/ui-lab?scene=components%2FOverview).
