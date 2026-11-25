# Sauvegarde, restauration et retour de version

Périmètre éprouvé : PostgreSQL 18.6, schéma/migration 0000, code candidat 1a33aee. Données fictives et ressources dédiées uniquement. Le rapport historique P5-03 n’est pas inclus dans ce kit ; les résultats résumés ci-dessous ne qualifient pas une nouvelle version. Aucune procédure sur base réelle ou partagée n’est autorisée par cette documentation.

## Préparer une sauvegarde

Identifier le projet Compose et la source dans sa configuration locale privée ; vérifier les labels et l’absence de ressource partagée. Créer un répertoire ignoré `.backups.local/`, permissions 0700, et un fichier neuf en 0600 sans écrasement. Depuis la racine du clone dédié, le dump provient de :

```bash
(umask 077; set -C; docker compose --env-file .env.local exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom --no-owner --no-acl' > .backups.local/synthetic-p5.dump)
```

Rediriger sa sortie binaire directement vers ce fichier neuf avec protection contre l’écrasement ; ne pas l’afficher ni le versionner. Vérifier code retour, taille et SHA-256. Conserver séparément SHA du code, version PostgreSQL et migrations. Une copie locale n’est pas une politique de sauvegarde durable : stockage séparé/chiffrement/rétention restent à définir avant données réelles.

## Restaurer sans remplacer la source

Vérifier qu’un nom de destination neuf n’existe pas ; sinon arrêter, ne pas le supprimer. Dans le seul cluster de test propriétaire, `createdb` crée cette destination puis `pg_restore --exit-on-error --no-owner --no-acl` y lit le dump par stdin. Utiliser l’utilisateur synthétique de la configuration sans afficher son mot de passe. Ne pas utiliser `--clean`, reset ou remplacement de volume.

Comparer nombre et contenu exacts, identifiants et dates ; contrôler contraintes et journal Drizzle. Démarrer une instance jetable du **runtime compilé livré** sur la destination, via DATABASE_URL passée en environnement, et vérifier migrations/bootstrap idempotents et parcours lisible. P5 a prouvé trois lignes restaurées, quatre dans la source après ajout post-snapshot, contrainte de nom vide refusée et application compilée lisant seulement le snapshot. Le migrateur ne fournit pas de downgrade automatique.

## Retour arrière et opérations destructives

Un retour de code demande une version compatible avec le schéma présent ; l’unique migration actuelle a été vérifiée avec le même candidat, aucune compatibilité future n’est promise. Privilégier une restauration séparée vérifiée avant tout basculement. Remplacer une base ou un volume, `down --volumes`, purge de sauvegarde, suppression de données ou migration irréversible détruit un état : identité, sauvegarde vérifiée, impact et autorisation explicite sont préalables hors ressources de test créées pour la campagne. Le démarrage courant reste `down` sans volumes pour conserver les données.

Les campagnes P5 ont nettoyé seulement leurs conteneurs/volume/réseau identifiés ; leurs dumps synthétiques restent privés et ignorés. Le premier contrôle utilisait à tort un source absent de l’image : cet échec est conservé, puis retest du runtime distribué réussi. Il ne révèle pas un échec de restauration ni un source manquant dans la distribution attendue.
