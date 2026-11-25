# Sauvegarde, restauration et retour de version

Les sources et les données se transmettent séparément. Un volume PostgreSQL n'est pas contenu dans le dossier du kit. Les procédures ci-dessous demandent une cible identifiée et un mandat adapté ; elles n'autorisent aucune opération sur une base réelle ou partagée par leur seule présence.

## Préparer une sauvegarde

Identifier l'instance Compose et la base à partir de la configuration privée, sans afficher les secrets. Vérifier labels, propriétaire et absence de ressource partagée. Créer un répertoire ignoré `.backups.local/` en 0700 et choisir un fichier neuf ; l'exemple suivant produit un dump synthétique privé, sans écrasement :

```bash
(umask 077; set -C; docker compose --env-file .env.local exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom --no-owner --no-acl' > .backups.local/synthetic-p5.dump)
```

Rediriger le binaire directement vers le fichier, sans l'afficher ni le versionner. Vérifier code retour, taille, permissions 0600 et empreinte SHA-256. Conserver séparément version du code, PostgreSQL et migrations. Stockage séparé, chiffrement et rétention restent à définir pour des données réelles ; une copie locale ne suffit pas à une politique durable.

## Restaurer sans remplacer la source

Dans une cible propriétaire autorisée, choisir un nom de destination neuf. S'il existe, arrêter sans le supprimer. Créer cette destination avec `createdb`, puis utiliser `pg_restore --exit-on-error --no-owner --no-acl` en lisant le dump sur l'entrée standard. Ne pas utiliser `--clean`, reset ou remplacement de volume.

Comparer contenu attendu, identifiants, dates, contraintes et journal de migrations. Vérifier le runtime compilé et les parcours pertinents sur cette destination, avec sa configuration privée. Une restauration n'est validée ni par la seule présence du fichier ni par la réussite de l'outil de dump. Le migrateur ne fournit pas de downgrade automatique.

## Retour arrière et opérations destructives

Restaurer ensemble code et sources compatibles avec le schéma. Préférer une restauration séparée vérifiée avant basculement. Ne pas supposer qu'une ancienne version sait lire un schéma plus récent.

Remplacement de base/volume, `down --volumes`, purge de sauvegardes, suppression de données ou migration irréversible exigent identité, impact, sauvegarde vérifiée et autorisation explicite. Un arrêt ordinaire utilise `down` sans volumes ; voir les [opérations](operations.md). Le retour de version du design system suit sa [politique](design-system/policy.md), sans mélange d'ancien éditeur et de nouvelles sources.

## Portée des preuves historiques

Le résumé P5 antérieur est conservé dans les sources historiques. Il concerne PostgreSQL 18.6, migration 0000, candidat `1a33aee`, données fictives et ressources dédiées. Il rapporte une restauration vérifiée avec contenu exact et runtime compilé ; son premier essai erroné et son retest restent conservés. Ce résultat ne qualifie ni le schéma d'un projet dérivé ni une nouvelle édition du kit.

Les contrôles d'une nouvelle restauration doivent identifier leur propre version, cible, données attendues et limites. Cette révision documentaire n'exécute aucune sauvegarde ou restauration PostgreSQL.
