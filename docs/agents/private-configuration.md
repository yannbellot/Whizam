# Configuration privée accompagnée

## Parcours de l’assistant

1. Identifier les champs réellement nécessaires au mandat et expliquer leur usage. Réutiliser les configurations présentes : ne pas demander un secret déjà utilisable. Vérifier seulement présence/non-vide, sans afficher de valeur ni charger `.env.local` dans le contexte. Ne jamais lire `process.env` en bloc.
2. Depuis la racine réelle du projet, lancer le script livré avec les seuls noms/types de champs : `node scripts/configure-secrets.mjs ATLAS_SMTP_USER:email ATLAS_SMTP_APP_PASSWORD:password`. Ces noms Atlas sont un exemple, pas une fonction métier du kit. Pour d’autres projets, utiliser leurs noms de variables serveur. Aucun secret en argument, variable de commande ou fichier temporaire transmis à l’assistant. Utiliser `sh scripts/with-runtime.sh node …` si le runtime compatible l’exige.
3. Garder le processus actif et ouvrir l’URL locale retournée dans un onglet navigateur. Dans Codex, découvrir l’outil `open_in_codex`, puis fournir `target: { type: "browser", url: URL_RETOURNÉE }`. Si indisponible, présenter le lien local au designer. Ne pas ouvrir de serveur distant ni utiliser Sites pour cette saisie.
4. Laisser le designer saisir lui-même. Ne pas inspecter le DOM, photographier, enregistrer ou automatiser une session contenant des secrets réels ; utiliser uniquement des valeurs fictives pour les essais. Ne pas demander les valeurs dans la conversation ou les questionnaires natifs. Le formulaire ne préremplit aucune valeur existante.
5. Après sa confirmation, vérifier seulement que les champs requis sont présents et non vides, avec un diagnostic booléen expurgé. Ne pas faire de `cat`, de diff ou de recherche affichant les lignes du fichier. Aucun journal du corps HTTP. Une confirmation d’enregistrement n’est pas une preuve de connexion SMTP. Vérifier séparément le mandat d’un éventuel appel fournisseur, envoi, redémarrage ou déploiement.

## Comportement livré

Le script Node sans dépendance écoute exclusivement `127.0.0.1` sur un port libre. Une capacité aléatoire par session, Host exact, Origin exact pour POST, refus cross-site, absence de CORS, CSP, protection contre l’embarquement et absence de cache limitent les accès navigateur. L’URL de session est temporaire : ne pas la publier dans la documentation ou les rapports.

Seuls les champs explicitement nommés sont modifiés dans `.env.local` ; les autres lignes restent conservées. Les doublons, liens symboliques, liens physiques multiples, fichiers non réguliers, configurations complexes/multilignes et changements détectés depuis l’ouverture sont refusés. L’écriture passe par un fichier privé éphémère puis remplacement atomique, en mode 0600. Les mots de passe sont masqués, aucune valeur existante n’est renvoyée et les réponses ne contiennent jamais les valeurs saisies. Les apostrophes, NUL et retours à la ligne sont refusés ; les valeurs sont sérialisées entre apostrophes pour conserver notamment les `$` littéraux. Les variables `VITE_`/`PUBLIC_` sont interdites à ce parcours privé.

Enregistrer ou Annuler ferme le service. La session expire après vingt minutes ; Ctrl+C ou l’arrêt du processus ferme aussi l’écoute. Une annulation ou une expiration conserve le fichier initial. L’outil ne lance ni l’application, ni Docker, ni un fournisseur. Les processus applicatifs déjà lancés ne rechargent pas automatiquement leur environnement.

Ce mécanisme reste local au poste : `.env.local` est en clair et lisible par les processus disposant des mêmes droits. Il ne constitue pas un coffre-fort ni une isolation contre un poste compromis. Ne pas éditer la configuration en parallèle : les contrôles de changement ne garantissent pas l’absence de course avec un écrivain externe entre le dernier contrôle et le remplacement. Aucun secret, état de session ni fichier `*.local` ne doit être distribué, exporté, commité ou publié dans le portail documentaire.

## Repli fichier dans Codex

Si le formulaire échoue, si la configuration est complexe ou si le designer préfère l’éditeur, découvrir `open_in_codex` et fournir `target: { type: "file", path: CHEMIN_ABSOLU_ENV_LOCAL }`. L’ouverture UI ne demande pas à l’assistant de lire le fichier ; ne pas lui faire inspecter ensuite son contenu. Prévenir que les secrets sont visibles dans l’éditeur. Le fichier reste accessible selon les permissions ordinaires du poste et de l’agent : ce repli ne crée aucune protection technique contre une lecture ultérieure.

En l’absence d’outil d’ouverture, fournir un lien Markdown portant le libellé « Configuration privée », avec le chemin absolu réel comme destination entre chevrons, sans échappements ni chevrons imbriqués, puis attendre la confirmation d’enregistrement seulement. Un refus de permission impose de signaler la limite, sans contournement. Ne pas présenter le repli comme une saisie masquée ou comme la garantie d’un onglet éditable : le rendu dépend du client.

## Vérifications

Depuis le kit : `node --test tests/private-configuration.test.mjs`. Les essais utilisent un dossier temporaire et des valeurs fictives, sans fournisseur réel. Les contrôles automatiques et l’ouverture effective dans un client sont deux preuves distinctes ; seule une recette utilisateur peut accepter le confort de saisie dans sa version de Codex.
