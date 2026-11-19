# DS-UI-03 — Comparaison visuelle à Framer

**Suivi courant :** DS-UI-06 a introduit une régression de densité dans l’inspecteur complet, signalée pendant la recette humaine. La [correction ciblée](docs/work-items/ds-ui-06-framer-regression.md) restaure les lignes compactes tout en conservant l’organisation Foundations/inspecteur/chat. Le rapport ci-dessous reste la preuve historique DS-UI-03, pas une qualification automatique des versions suivantes.

15 novembre 2026. Revue séquentielle, même agent, non indépendante. Le mandat demande une inspiration forte des contrôles et de l’inspecteur ; les fonctions Framer ne sont pas ajoutées et les calques UI Lab restent protégés.

## Références et normalisation

Source : [inspecteur Framer](docs/reviews/ds-ui-03-framer-panels/framer-inspector.png), [version normalisée](docs/reviews/ds-ui-03-framer-panels/framer-inspector-normalized.png), [navigation](docs/reviews/ds-ui-03-framer-panels/framer-navigation.png). Captures CUA réelles, thème sombre, panneau Style et breakpoint sélectionné. Original local 2912×1898, densité 2, fenêtre logique 1456×949 ; inspecteur recadré 520×1698 puis normalisé 260×849. Toolbar, avatar et nom de projet exclus des preuves versionnées.

Implémentation : [vue macOS finale](docs/reviews/ds-ui-03-framer-panels/native-final.png), [inspecteur natif normalisé](docs/reviews/ds-ui-03-framer-panels/native-inspector.png). WKWebView, Button Default, propriété Arrière-plan, attribution fermée, valeur initiale #1d4ed8, aucun brouillon. Original 2560×1888, densité 2, fenêtre logique 1280×944 ; cadre natif de 56 px en haut et panneaux superposés de 280 px. Vue réduite à 1440×1062 pour lecture ; inspecteur recadré 560×1672 puis normalisé 280×836.

Comparaison globale : captures Framer et UI Lab affichées ensemble via CUA, puis relecture de la capture native finale. Comparaison rapprochée : inspecteurs normalisés ouverts ensemble dans le même appel d’inspection d’images. Les largeurs 260/280 diffèrent intentionnellement : conserver les 280 px et les panneaux flottants 16/16 de UI Lab fait partie du périmètre.

## Historique des corrections

1. P2 : les utilitaires Tailwind importants rétablissaient bordures et radius 4 px sur recherche/valeur précise ; le champ précis gardait 40 px. Correction : règles importantes bornées aux contrôles dans la couche utilities, règles de structure hors couche ; 30 px et radius 8 px mesurés après correction. P2 : label imbriqué #666 insuffisamment contrasté sur #111, corrigé par la décision outil #999.
2. P2 au contrôle natif : les menus WebKit conservaient leur petite géométrie système. Une hauteur explicite avec menulist-button était insuffisante. Correction : le même select HTML reçoit un habillage sans appearance native et le chevron Storybook existant en décoration non interactive. Le menu, les options, les labels et les callbacks restent natifs. Types/build et changement de propriété vérifiés après correction ; champs et chevrons homogènes observés dans WKWebView.
3. Pendant l’actualisation de sources immuables de la copie, le writer a refusé la lecture. Les seuls services de cette copie fictive ont été redémarrés normalement ; aucun verrou ni garde supprimé. État initial éditable et sans brouillon retrouvé.

## Surfaces de fidélité

- Typographie : pile système de l’outil, corps 13 px, métadonnées 11 px, titres discrets. L’emphase des titres reste celle de UI Lab ; aucune police distante.
- Rythme : lignes libellé/champ, contrôles 30 px, radius 8 px, sections séparées de traits fins et espaces 16 px. Réglage placé avant Attribution dépliable ; actions existantes conservées. Panneaux 280 px, padding/radius 16 px et absence de débordement horizontal mesurés en 1280×800 et 1440×900.
- Couleurs : palette DS-UI-02 conservée (#171717/#111111/#1F1F1F/#3B3B3B), texte secondaire #999 dans l’inspecteur sombre, séparateurs #262626. Aucun token existant modifié ; décisions supplémentaires limitées au chrome outil.
- Images/icônes : aucune image nécessaire à ces contrôles. Réutilisation du chevron Storybook existant ; aucune icône de calque ni source de navigation modifiée.
- Contenu : vocabulaire et opérations UI Lab conservés. Composant/Apparence/Portée et Attribution décrivent ses fonctions réelles ; aucune fonction Framer factice.

## Interactions et limites

CUA navigateur : saisie invalide avec dernier aperçu conservé et sauvegarde désactivée ; modification valide, portée locale, Échap/retour du focus dans l’abandon, abandon confirmé ; sauvegarde #234567 avec reçu durable, rechargement/relecture, puis sauvegarde de la valeur initiale #1d4ed8. Recherche « button default » puis Échap ; attribution ouverte/refermée ; propriété Rayon des angles affichant Valeur/Unité, puis retour Arrière-plan. Après ajout du décor de select : changement de propriété rejoué et hauteur 30 px/appearance none/icône observés dans le DOM. Aucun message console de niveau error dans les deux inspections finales.

macOS : chargement final, champs actifs, comparaison visuelle et aller-retour Aperçu/UI Lab observés. Ouverture du menu déroulant par le pilote CUA natif non démontrée ; son contrôle de sélection est réalisé dans le navigateur. Une capture web après changement de propriété conserve « Chargement de l’aperçu… » : délai de retour de cette transition non qualifié ; la preuve finale est l’état initial natif stabilisé. Thème clair, VoiceOver et revue humaine physique non exécutés dans cette tranche. Ces limites ne deviennent pas des succès implicites.

Aucun écart P0/P1/P2 visuel restant dans le périmètre. Les finitions des dialogues/menu système, le contenu propre à UI Lab, la largeur 280 et les panneaux flottants sont des adaptations intentionnelles. Recette visuelle humaine attendue.

final result: passed
