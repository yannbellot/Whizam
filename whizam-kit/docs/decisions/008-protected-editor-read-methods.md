# 008 — Lectures protégées de l’éditeur par POST

29 octobre 2026 — décision autorisée explicitement par le porteur pendant DS-EDIT-01 D.

La spécification A exigeait GET pour le snapshot et refus d’Origin absent sur les API protégées. Un essai Chromium 156 isolé confirme que fetch GET vers la même origine omet Origin et ignore sa définition manuelle, en modes cors et same-origin. La garde écrite rendait donc cette lecture inaccessible au panneau.

Le porteur autorise les lectures de snapshot et d’état de requête par **POST JSON**, avec `{}` ou `{requestId}` ; l’en-tête Origin demeure obligatoire et identique, avec Host exact, capacité en en-tête et absence de CORS. POST save conserve son contrat A. La capacité est injectée uniquement dans le document local du manager, jamais dans les assets générés, URL ou logs. Pas d’endpoint public de découverte de session ; le document local est son bootstrap.

Les réponses de données de lecture sont respectivement `{snapshot, revision, rootId}` et le statut de requestId A ; les erreurs de lecture sans identifiant exploitable sont expurgées. rootId est une empreinte opaque de l’identité réelle de racine, sans chemin. Le document local porte la même identité : un renouvellement de capacité après redémarrage refuse une racine différente réutilisant le même port. Les enveloppes de requête/réponse d’enregistrement restent inchangées. Les lectures restent sans cache et n’enregistrent aucune autorité. L’empreinte C n’est pas une baseRevision de fichiers. Le mode statique ne reçoit aucune capacité et reste sans service d’écriture.

Cette évolution ne réduit aucune protection HTTP ou fichier. Elle ne crée pas d’identité de compte et ne protège pas contre un processus local disposant déjà des droits de l’utilisateur. Preuve de protocole et tests locaux dans le suivi de fabrication ; aucune qualification de navigateur supplémentaire déduite.
