# UI-01 — Nommer clairement l’exemple de projet test

**25 octobre 2026 — En revue : qualification technique acquise, acceptation humaine différée.** [Fiche et critères](../work-items/ui-01-project-example-label.md), [brief](../product/brief.md), [spécification](../product/features/projects.md). Base `a7f5897e47eabbe7c7645b4676cc2ce570dac9a1`, diff UI-01 identifié par les empreintes ci-dessous. Changement rédactionnel limité, sans nouvelle qualification globale du kit.

## Résultat

La liste /projects et son titre d’onglet portent « Exemple de projet test ». La navigation principale et le lien d’entrée depuis l’accueil reprennent ce nom. Une explication visible précise que les fiches fictives servent à démontrer les formulaires et l’enregistrement des données, et qu’elles ne créent pas de nouvelles applications. Routes, fiches, schéma, accès, styles et dépendances conservés. Brief, spécification et README synchronisés. Pas de story de cette page à modifier.

## Vérifications réalisées

Depuis une copie source propre, sans configuration privée ni dépendances installées copiées, Node 24.22.0/npm 11.8.0 sur macOS arm64 : installation npm ci hors ligne depuis le cache de téléchargement, typecheck, lint et formatage réussis. `npm run test:projects` réussit : **10 tests**, 8 parcours puis 2 lectures après un nouveau processus, Chromium 156.0.8078.4 en desktop 1280×800 et mobile 390×844, PostgreSQL 18.6 dédié. Aucun échec, ignoré ou flaky. Le runner construit l’application et nettoie ses seuls conteneur/volume/réseau par identité.

Le parcours existant passe désormais par le nouveau lien d’accueil, contrôle le titre de l’onglet, le h1, le lien de navigation et la phrase indiquant qu’aucune application n’est créée ; il vérifie aussi le débordement de la liste. Les captures desktop/mobile ont été inspectées : titre lisible, action repliée sur une ligne distincte sur mobile, explication entièrement visible, sans débordement horizontal. Les parcours de création/modification/refus/panne/reprise et redémarrage continuent de réussir. Pas de nouvelle suite de tests miroir ni de modification du comportement métier.

Une prévisualisation isolée est construite depuis ces mêmes sources : application/PostgreSQL healthy, HTTP 200 et texte/titre servis conformes. L’instance de recette précédente reste sur son candidat figé, avec contenu de base identique par empreinte. Les 42 conteneurs présents avant cette campagne et les 40 fichiers non suivis initiaux sont préservés. Les logs bruts, rapports JSON et captures de fabrication restent locaux ; les résultats et empreintes utiles sont consignés ici.

Le contrôle structurel `npm run validate:agent-kit` réussit également : 20 skills, 4 rôles, références et frontmatter valides.

## Revues ciblées

Mode **séquentiel, même agent, non indépendant**. Design Reviewer : conformité au libellé et à l’explication demandés, puis lisibilité/hiérarchie et retour à la ligne aux deux formats : **satisfaisant**, sans acceptation humaine déduite. Vérification technique ciblée : routes et code métier inchangés, source exécutée raccordée au diff, contrôles et persistance réussis : **satisfaisant**. Pas de nouvelle revue sécurité complète : cette correction ne change aucun accès, secret, traitement d’entrée, schéma ou dépendance ; les réserves de sécurité du kit restent applicables. Aucune modification de tokens ou de composants partagés.

## Sources exécutées

SHA-256 des fichiers applicatifs et du scénario modifié, identiques entre la source et la copie testée :

| Fichier | SHA-256 |
|---|---|
| `app/routes/projects-index.tsx` | `f3f4e14ad68749df8648eca6ac1c538415f8e23f9f6734ab769a3d1275d28e35` |
| `app/routes/projects-layout.tsx` | `259b807e11ed0f19717d32ac6d60f00171df6019de4099ef75aed5c83952e8d0` |
| `src/App.tsx` | `31c043d4741d5ba334e7d6eb6a64deaf9a6b41feee703533bda6419c2a3577a5` |
| `tests/project-e2e/flows.spec.ts` | `e6e51e199b6a209f88928ca69535a9767b0a45881db9d7018b77c3a1401c904f` |

Les ajouts documentaires de bilan ne changent pas ces sources. Les preuves de recette antérieures gardent leur version `5f02643` ; elles ne sont pas présentées comme une nouvelle campagne complète sur UI-01. Le paquet de reprise antérieur reste figé ; choisir explicitement la version lors d’une future transmission. Aucun tag, push, Actions, hébergement ou déploiement. **Doc updated.**
