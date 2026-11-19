# 005 — Accompagner l'installation et reprendre le runtime du projet

**26 octobre 2026 — périmètre approuvé par le porteur ; qualification par plateforme à démontrer.**

## Contexte

Le kit doit accompagner un designer sans Node/npm ni Docker, une fois son assistant opérationnel et le kit récupéré. Les installations de dépendances déjà vérifiées utilisaient des runtimes préexistants. Le script setup-local prépare seulement la configuration ; il exige Node. Les quatre séquences du démarrage selon la décision 004 restent inchangées.

## Décision

Préciser les parcours macOS 26 sur Mac à puce M et Ubuntu 24.04 LTS arm64 dans la [référence d'environnement](../../skills/initialize-project/references/environment-setup.md), source canonique du diagnostic, de l'accompagnement et de la reprise. Windows constitue une tranche ultérieure ; les autres plateformes restent non qualifiées.

Conserver les installations Node/npm compatibles. Sinon privilégier une installation ignorée dans le projet depuis les archives officielles vérifiées ; l'installation machine reste un choix explicite/repli. Les cibles de versions restent .nvmrc/packageManager, leurs plages compatibles dans engines. Le runtime appartient à la machine, pas aux sources distribuées.

Une aide POSIX `scripts/with-runtime.sh` retrouve le couple compatible à chaque commande, conserve les arguments et codes d'échec, fixe les chemins enfants et le cache npm local sans modifier le terminal parent. Sa nécessité est étayée par le terminal observé en Node 24.13.1, inférieur à la cible du kit : un chemin disponible dans une ancienne conversation ne suffit pas à une reprise. L'aide ne télécharge ni n'installe d'outil et ne remplace pas setup-local.

Docker est accompagné selon l'OS : Desktop sur Mac, Engine et plugin Compose sur Ubuntu. Les opérations système et leurs permissions sont expliquées ; les consentements, secrets et redémarrages restent humains. Aucun changement global, remplacement d'installation ou élargissement d'accès implicite. La VM reste un moyen de test du fabricant, jamais une dépendance utilisateur.

## Qualification et conséquences

Installation complète, interruptions, reprise et préservation sont éprouvées séparément par OS/architecture. Une extraction, une simulation de PATH ou une campagne Linux ne qualifie pas une machine macOS vierge. Un essai technique ne prouve pas l'efficacité native d'un assistant ni la compréhension d'un designer. La [compatibilité](../compatibility.md) conserve ces limites ; aucun nouveau skill, orchestrateur ou installateur universel.
