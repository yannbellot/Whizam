# 029 — Lanceur macOS local pour UI Lab et Storybook

**6 novembre 2026 — Réalisation LOCAL-APP-01 demandée par le porteur.** Choix techniques délégués compatibles avec l’atelier autonome ; [preuves et réserves](../reviews/local-app-01.md). Cette décision ne vaut ni acceptation humaine complète ni autorisation de publication.

Conserver l’interface web et l’édition locale. Un petit bundle AppleScript généré par les outils Apple appelle un superviseur Node puis l’app web Safari associée. Aucun conteneur natif supplémentaire, réécriture Swift, API distante ou service de session.

Ports loopback fixes par instance ; contrôle par socket Unix privé, avec identité de racine et empreinte de l’outillage. Les invocations sont sérialisées. Un état ambigu exige un diagnostic, sans adoption de tiers, effacement automatique de verrou ou signal envoyé depuis un ancien PID seul. L’état privé refuse les liens symboliques et les accès partagés.

Le writer récupère avant le démarrage de Storybook. Aucun hook de génération n’est lancé. Storybook reste lecteur ; les protections Host/Origin/capacité et les autorités DTCG/YAML ne changent pas. Le superviseur ne promet pas la persistance des brouillons navigateur.

Le lanceur **UI Lab** et la fenêtre **UI Lab Workspace** restent distincts ; deux icônes peuvent apparaître. Les raccourcis Storybook et Stop UI Lab complètent le parcours. Une disponibilité serveur n’équivaut pas à la fin du chargement client ; la lenteur initiale Safari observée reste une réserve, sans cause affirmée.

Le porteur a autorisé explicitement pendant la réalisation l’exception aux écritures limitées au dépôt pour créer l’app web Safari dans Applications de son compte, l’ajouter au Dock, masquer sa navigation puis installer les raccourcis finaux. Cette exception est propre à LOCAL-APP-01 : pas de service de session, changement de sécurité ou accès supplémentaire. Le préparateur distribué génère dans le projet ; l’installation sur un autre poste conserve ses autorisations propres.

Runtime et dépendances sont préparés au préalable. Chemins privés dans les artefacts ignorés ; déplacement avec réparation explicite et régénération. GitHub, hébergement, viewers et changement de poste restent exclus. Le [guide](../operations/local-app.md) est la référence opérationnelle ; la [fiche](../work-items/local-app-01-dock-launch.md) conserve les critères.
