# 014 — Tokens comme entrée de l’édition partagée

30 octobre 2026 — évolution approuvée pour implémentation, tests techniques sans E2E et Storybook courant actualisé. Remplace la visibilité générale de Styles et l’édition partagée directe dans Apparence de la décision 013.

Foundations > Tokens expose tous les styles sémantiques définis, avec nom, identité, valeur et usages identifiés. Les anciens alias ne constituent plus ce catalogue. Le clic sur un token sélectionne sa fiche dans le panneau Styles ; la consultation ne change pas l’attribution d’un composant.

Sur une story de composant, Styles est masqué. Voir ce style et Modifier le style partagé conduisent à Foundations > Tokens et sélectionnent le style concerné. Apparence conserve réutilisation, création et attribution, exception locale et le raccourci partagé ; pas de second formulaire d’édition partagée.

Styles reste disponible sur la story Tokens et utilise le brouillon commun. Les valeurs du catalogue décrivent la génération enregistrée ; la fiche Styles présente les modifications en brouillon. Un style sans usage reste consultable. Les contrôles de contraste gardent leurs résultats non mesurés et leur acquittement ; aucune mesure sur les composants absents n’est inventée.

Le moteur existant normalise une nouvelle valeur, réutilise une primitive identique de même type ou alloue une primitive nommée automatiquement. La primitive précédente n’est ni modifiée ni supprimée. Création/allocation restent en brouillon jusqu’à Enregistrer ; aucune nouvelle convention ou opération d’écriture.
