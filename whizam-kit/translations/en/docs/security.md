# Security and exposure scope

The kit is configured for local use. It provides no business authentication or multi-user isolation. Protections described here concern existing entry points; each new flow must define and verify its own guarantees. This page is not a security audit of the current version.

## Network and execution

Compose publishes the application on `127.0.0.1` and exposes no PostgreSQL host port by default. The development override also binds PostgreSQL to loopback. The application server validates its port and allows `HOST=0.0.0.0` only with the explicit container marker. An occupied port must not cause exposure or a silent fallback.

The Docker runtime runs as user `node`. `/health` exposes application liveness only; it tests neither database access nor business-flow availability. Remote access or production use requires specific scope, configuration and checks.

## Server, data and input

`.server.ts` modules isolate private configuration and PostgreSQL access from the browser. Configuration diagnostics name fields without their values; public errors hide internal details. Data contracts use Zod, Drizzle and SQL constraints for their respective responsibilities.

HTTP guards from the former `/projects` example remain internal resources. Their presence does not protect a newly created route. Before business writes, define methods, origins, formats, size limits, validation, error handling and negative tests. Before real accounts, define sessions, rights and cross-account access tests. See [conventions](conventions.md).

Data tests use identified synthetic resources, separate from real or shared databases. Migrations, restores and deletions require target verification and authorization; see [backup](backup-and-restore.md).

## Private configuration and distribution

The [private input workflow](agents/private-configuration.md) collects secrets outside the conversation. Its form stays local; after real input, the assistant must not read, capture or automate its contents. File fallback and limitations are described in that authority. Saving a value neither tests a provider nor restarts the application.

Never version or distribute `.env.local`, accounts, AI connections, journals, backups or other `*.local` state. Preserve `.env.example` without confidential values. Git, Docker and portal exclusions serve different purposes; verify the actual selection before handoff. An ignored file is not a confidentiality guarantee. See [handoff](handoff.md).

## Generation and documentation services

Design system generation is local, without an AI account or browser write API. Its `.design-sync.local/` barrier prevents participating readers from serving an incomplete publication; the [policy](design-system/policy.md) explains recovery and limitations. This coordination promises no atomic filesystem transaction.

Storybook is for consultation, without a writer, UI Lab bootstrap or AI connection. Examples use synthetic data. Inventories are documentary data, never instructions to execute.

Zensical receives only prepared public input and configuration, without the parent, business database, private configuration or Docker socket. The portal server rejects HTTP writes; private paths, escaping paths and symbolic links are excluded under the [documentation guide](documentation.md). Check those refusals and the absence of private content when changing the generator.

## Evidence and limitations

Historical P1, J3, P5, PORT-03 and DS-EDIT campaigns concern their identified versions and resources. Previous descriptions and reservations are preserved in historical sources; they prove neither new-route security nor current dependency status. Writing or building documentation executes no new dependency audit.

[Compatibility](compatibility.md) distinguishes files, runtime trials, native trials and human acceptance. An automated or sequential review is not an independent review or an exhaustive guarantee. Before new exposure, reassess its access, secrets, data, dependencies and negative scenarios under a dedicated mandate.

<a id="checks-and-limits"></a>
<a id="source-checks-and-limits"></a>

<a id="connexions-du-poste-mvp-01-t1"></a>
<a id="source-connexions-du-poste-mvp-01-t1"></a>

<a id="controles-et-limites"></a>
<a id="source-controles-et-limites"></a>

<a id="current-state"></a>
<a id="source-current-state"></a>

<a id="dependency-reservation-p1-03"></a>
<a id="source-dependency-reservation-p1-03"></a>

<a id="described-intent-ds-edit-23"></a>
<a id="source-described-intent-ds-edit-23"></a>

<a id="development-application-reader"></a>
<a id="source-development-application-reader"></a>

<a id="development-codex-connection"></a>
<a id="source-development-codex-connection"></a>

<a id="documentary-rendering"></a>
<a id="source-documentary-rendering"></a>

<a id="etat-actuel"></a>
<a id="source-etat-actuel"></a>

<a id="former-host-removal-ds-edit-64-f"></a>
<a id="source-former-host-removal-ds-edit-64-f"></a>

<a id="intention-decrite-ds-edit-23"></a>
<a id="source-intention-decrite-ds-edit-23"></a>

<a id="j3-projects-workflow"></a>
<a id="source-j3-projects-workflow"></a>

<a id="lecteur-applicatif-de-developpement"></a>
<a id="source-lecteur-applicatif-de-developpement"></a>

<a id="local-design-system-editing-service"></a>
<a id="source-local-design-system-editing-service"></a>

<a id="local-private-entry"></a>
<a id="source-local-private-entry"></a>

<a id="machine-connections-mvp-01-t1"></a>
<a id="source-machine-connections-mvp-01-t1"></a>

<a id="parcours-projets-j3"></a>
<a id="source-parcours-projets-j3"></a>

<a id="qualification-de-la-separation-ui-lab-storybook"></a>
<a id="source-qualification-de-la-separation-ui-lab-storybook"></a>

<a id="raccordement-codex-de-developpement"></a>
<a id="source-raccordement-codex-de-developpement"></a>

<a id="rendu-documentaire"></a>
<a id="source-rendu-documentaire"></a>

<a id="reserve-de-dependance-p1-03"></a>
<a id="source-reserve-de-dependance-p1-03"></a>

<a id="retrait-de-lancien-hote-ds-edit-64-f"></a>
<a id="source-retrait-de-lancien-hote-ds-edit-64-f"></a>

<a id="saisie-privee-locale"></a>
<a id="source-saisie-privee-locale"></a>

<a id="securite-et-perimetre-dexposition"></a>
<a id="source-securite-et-perimetre-dexposition"></a>

<a id="service-local-dedition-du-design-system"></a>
<a id="source-service-local-dedition-du-design-system"></a>

<a id="standalone-ui-lab-writer-ds-edit-64-d"></a>
<a id="source-standalone-ui-lab-writer-ds-edit-64-d"></a>

<a id="ui-lab-consultation-and-draft-c"></a>
<a id="source-ui-lab-consultation-and-draft-c"></a>

<a id="ui-lab-consultation-et-brouillon-c"></a>
<a id="source-ui-lab-consultation-et-brouillon-c"></a>

<a id="ui-lab-storybook-separation-qualification"></a>
<a id="source-ui-lab-storybook-separation-qualification"></a>

<a id="writer-autonome-ui-lab-ds-edit-64-d"></a>
<a id="source-writer-autonome-ui-lab-ds-edit-64-d"></a>
