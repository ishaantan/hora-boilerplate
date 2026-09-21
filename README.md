# hora-boilerplate

*[日本語](https://github.com/openreachtech/hora-boilerplate/blob/main/README.ja.md)*

A template repository for building an application from a spec, driven by the `/hn` Claude Code skill.

**This one builds a web application.** A native Android or iOS one starts from [`hora-boilerplate-mobile`](https://github.com/openreachtech/hora-boilerplate-mobile) instead, which runs the same method over Kotlin and Swift rows.

## Concept

A project built from this template is made of several git repositories, nested inside one another. The outer repository (this one, cloned as `<myproject>-app`) holds the spec and the `/hn` skill; it holds no application code of its own. `/hn` clones the backend and frontend repositories inside it from `renchan-boilerplate` and `furo-boilerplate-nuxt`, reads the spec, and implements the application.

`/hn` is re-entrant: it decides where a run left off and continues from there, stopping to ask when the spec leaves something undecided. A single run is not expected to finish a whole project — it is started, and restarted, as many times as it takes.

**Work goes feature by feature, not layer by layer.** Each feature is taken through seventeen checkpoints — its spec, its backend, its frontend, then acceptance — and only once it has passed acceptance does the next feature start. The failure this avoids is building every backend task, then every frontend task, then testing, where the first time anyone finds out whether a feature *works* is after all of them are written.

This README only covers getting started. **The documentation is in [`docs/`](./docs/)** — how work gets executed, what each command does, the skills it runs on, and how to adopt the kit onto a project that already exists.

## Getting started

**The three steps below, on one page:** [`quick-start.md`](https://github.com/openreachtech/hora-core/blob/main/docs/quick-start.md) in `hora-core`. What you want goes into `specs/1.0.0/request/`, the material around it into `specs/1.0.0/annex/`, and `/hn` writes the spec with you out of it.

Adopting this onto an existing renchan / furo project instead of starting fresh? Go to [`adopting.md`](https://github.com/openreachtech/hora-core/blob/main/docs/adopting.md) in `hora-core` — the steps differ from step 1 onward, and the first decision there is whether the implementation or the spec is the authority: **`as-built`** fixes what runs today as the version, with a handful of questions and one acceptance sweep; **`to-spec`** takes half-finished code the rest of the way toward the spec.

### 0. What you need

| | |
|---|---|
| **Claude Code** | the skills run there |
| **Node and npm** | for this repository's own `npm install`, which is what puts the skills in place. See [Requirements](#requirements) |
| **A POSIX shell** | the skills run shell commands and nest git repositories. Windows `cmd` and PowerShell are not equivalent. See [Recommended](#recommended) |
| **A runner for CI** | only before opening pull requests, and only while the repository is private — that is when the workflows ask for a self-hosted runner labeled `light`. A public one runs on GitHub-hosted runners with nothing to arrange. See [Continuous integration](#continuous-integration) |

#### Requirements

| Tool | Version |
| :-- | :-- |
| Node.js | >=20.19.0 |
| npm | >=10.0.0 |

**The floor comes from `nuxt`, not from the hora packages.** `nuxt` declares
`^20.19.0 || >=22.12.0`, which rules out 20.0 through 20.18 and 22.0 through 22.11. Of the ORT
packages, `@openreachtech/hora` is the one that declares a floor at all, and it asks for 20 or
newer.

#### Recommended

| Tool | Version |
| :-- | :-- |
| Node.js | the active LTS — 24.19.0 today |
| npm | whatever that Node bundles — 11.17.0 today |

**Follow CI.** The workflows resolve `node-version: lts/*`, so the active LTS is what this
repository is built against. Install Node through nvm rather than a system package manager, so the
version stays per-project.

**npm 11.6 is where `.npmrc` starts working.** Below it, `min-release-age = 7` is ignored without a
warning, and a package published minutes ago installs. Node 20 and 22 bundle npm 10; the active LTS
bundles 11.x.

**On Windows, work inside WSL 2 (Ubuntu).** macOS and Linux run the skills natively. `sqlite3` and
`mariadb` build from source, which on Windows needs a separate toolchain. Keep the project in the
Linux filesystem — `~/<myproject>-app`, not `/mnt/c/…` — because a Windows-mounted path is slower,
and a Node installed on the Windows side reaches the WSL `PATH`.

### 1. Create `<myproject>-app`

**Recommended: use this repository as a GitHub template.** Open this repository's GitHub page, click **Use this template → Create a new repository**, and name the new repository `<myproject>-app`. GitHub starts it with a single, fresh commit — none of this template's own commit history carries over.

**If you cannot use GitHub's template feature**, clone the repository and discard the cloned history yourself, before writing anything else in it:

```sh
git clone https://github.com/openreachtech/hora-boilerplate.git <myproject>-app
cd <myproject>-app
rm -rf .git
git init
npm install
```

Do this before writing `specs/` — once the repository holds commits of its own, discarding `.git` would take those with it too.

**Either way, run `npm install` in the new repository before `/hn`. Without it there is no `/hn` to run.** The skills and agents are held at `kit/skills/` and `kit/agents/`, and a `postinstall` hook copies them into `.claude/`, where Claude Code looks. A fresh clone has an empty `.claude/` until it has run. See [`docs/skills.md`](./docs/skills.md).

### 2. Write the spec

```
/hn-spec
```

`/hn-spec` writes it with you. It reads whatever already exists at stage 0, copies the blank spec, and works through seven stages in conversation — the use cases first, then what the release will and will not carry, the numbers, the data model and the API, the screens, security, and a review of the whole thing. **Each stage is drafted in full, shown to you once, and written only after you approve it** — anything it thought of itself is marked as a proposal, so you correct a draft rather than answer a blank page. **One feature is put to you at most three times in the whole pipeline**; a fourth writes down why it was needed.

**On a project that already holds working code, you are not asked to dictate it.** Stage 0 reads the repositories and any document you point it at, drafts what they show, and puts it back for you to correct — **as a check, "I read it as this; is that right?", never as a requirement it decided.** What no reading can settle — who a feature is *for*, who *should* be allowed to call an operation, how much of it counts as finished — is asked outright, with the evidence laid out and nothing recommended. Answers come as choices wherever they can, so you correct far more than you compose.

**If you already have documents, drop them in before running this.** `specs/1.0.0/sources/` for anything that **is** the specification — requirements, an API reference — and `specs/1.0.0/annex/` for anything that only **explains** it — mockups, diagrams, an old design doc. Both ship empty, neither is required, and stage 0 confirms the split rather than asking you about each file. [`adopting.md`](https://github.com/openreachtech/hora-core/blob/main/docs/adopting.md) in `hora-core`, step 2, has the details.

**If all you have is what you want, put that in `specs/1.0.0/request/`** — a mail, a ticket, a page of bullets, in your own words. Stage 0 reads it as this version's agenda and the seven stages turn it into sections you approve one at a time. It ships empty too, nothing in it becomes spec text on its own, and `/hn-plan` never reads it.

Writing it by hand is still supported, and produces the same document:

```sh
cp specs/skeleton/spec.md specs/1.0.0/spec.md
```

[`specs/skeleton/spec.md`](./specs/skeleton/spec.md) is the blank spec — headings and table headers only. `specs/skeleton/` is not a version, so `/hn` never reads it as one.

[`spec-format.md`](./kit/skills/hn/references/spec-format.md) explains the format: what each section is for, which ones are required, and what makes `/hn` stop and ask. **Read that one; fill in the other.**

### 3. Run `/hn`

`/hn` runs `/hn-spec` first if the version has no spec yet, then fetches the boilerplates, plans the version with you, and builds and accepts **two features at a time**, reporting once per landed pair. Between pairs it stays quiet. It stops on its own only for something blocking — the planner asks in conversation, batched a stage at a time, and anything nobody can answer on the spot is written to `.hora/questions/` for you to settle by editing `specs/`.

**In normal use, `/hn` is the only command you type.** For what it is doing at each point, and for running one of the other skills directly, see [`commands.md`](https://github.com/openreachtech/hora-core/blob/main/docs/commands.md) in `hora-core`.

### Recommended: converse through the spec, let the implementation run

**`/hn-spec` is worth sitting through.** All seven of its stages are conversations — one turn each, the whole stage drafted and shown in full before anything is written — and what it proposes is where a spec stops being a list of feature names. Attention spent here is what the seventeen checkpoints later have something to build against.

**From `/hn` onwards, letting it run unattended is fine.** Fetching the boilerplates, planning, taking a feature through its checkpoints and running acceptance need nobody watching, and the design is what makes that safe: **a run that needs an answer stops instead of deciding.** The interactive checkpoints exist to settle things with a person, and a subagent is never handed one.

| | |
|---|---|
| `/hn-spec` | **be there.** Seven stages of conversation, approval per section |
| `/hn-plan` | **be there for the questions.** It asks about whatever the spec left undecided, and writes one approved edit at a time |
| `/hn-setup`, `/hn-build`, `/hn-accept` | **let them run.** They report what they did, and stop when they need you |

**Unattended does not mean unattended to the end.** A question nobody can answer on the spot is written to `.hora/questions/`, and answering it means editing `specs/` and running `/hn` again. That is the normal rhythm, not a failure.

## Continuous integration

**The workflows under `.github/workflows/` follow the repository's visibility** — a private repository runs them on a self-hosted runner labeled `light`, a public one on GitHub's `ubuntu-latest`. What the switch is for is the bill: a GitHub-hosted runner charges for every run on a private repository. `<myproject>-app` is usually private, so register a self-hosted runner with the `light` label before opening pull requests, or these workflows stay queued and never run.

**Nothing is hand-edited to choose between them, and overriding the choice is still yours to make.** All five workflows — `lint.yml`, `main-guard.yml`, `release.yml`, `fill-publish-version.yml` and `boilerplate-version.yml` — carry the same expression, so pinning one to a GitHub-hosted runner whatever the visibility means replacing it:

```yaml
    # what all five carry
    runs-on: ${{ fromJSON(github.event.repository.private && '["self-hosted", "light"]' || '["ubuntu-latest"]') }}

    # pinned, whatever the repository's visibility
    runs-on: ubuntu-latest
```

Then note the decision in `specs/<version>/spec.md`, so that everyone — and every later `/hn` run — reads the same thing rather than inferring it from the workflow files.

## Usage

`/hn` is an orchestrator. Five skills do the work:

| Skill | Does | Runs |
|---|---|---|
| [`/hn-spec`](./kit/skills/hn-spec/SKILL.md) | reads what already exists, then writes the version's spec with you through seven stages, one approved stage at a time | once per version |
| [`/hn-setup`](./kit/skills/hn-setup/SKILL.md) | fetches the boilerplates the spec declares, fills in the project's values, reads the real tree | once per version |
| [`/hn-plan`](./kit/skills/hn-plan/SKILL.md) | fixes the version, verifies the spec with you in conversation, writes the feature list | once per version |
| [`/hn-build`](./kit/skills/hn-build/SKILL.md) | takes one feature through the seventeen checkpoints | once per feature |
| [`/hn-accept`](./kit/skills/hn-accept/SKILL.md) | runs acceptance over every feature implemented so far | at each feature's last checkpoint, and once as a whole-version sweep |

```
/hn-spec ─> /hn-setup ─> /hn-plan ──┬─> /hn-build #A ─> /hn-accept ─┐
                                    ├─> /hn-build #B ─> /hn-accept ─┤
                                    └─> /hn-build #C ─> /hn-accept ─┴─> sweep ─> merge
```

**One command is not in that line: `/hn-hotfix`.** It is the only skill `/hn` never starts — whether something is an emergency is yours to decide — and it works on `main` while the release lines stay open, which `/hn` then rebases onto what it produced. [`hotfix.md`](https://github.com/openreachtech/hora-core/blob/main/docs/hotfix.md) in `hora-core` has the whole route.

Stage 0 and the seven spec stages are in [`stages.md`](./kit/skills/hn-spec/references/stages.md), what stage 0 may read in [`investigation.md`](./kit/skills/hn-spec/references/investigation.md), how anything is put to you in [`asking.md`](./kit/skills/hn/references/asking.md), and the thinking they apply — use cases first, a release that is not overloaded, roles or separate endpoints, synchronous work or a job, authorization stated per operation — in [`principles.md`](./kit/skills/hn-spec/references/principles.md).

### Adding a feature after a version has shipped

Everything above describes one version. A second version is the same five skills over a spec that is a diff.

```sh
mkdir -p specs/1.1.0/request
$EDITOR specs/1.1.0/request/csv-export.md   # what you want, in your own words
```

```
/hn-spec       drafts specs/1.1.0/spec.md from it — a DIFF: document
                 information, and the new feature. Nothing else
/hn            the usual run, from there
```

**`specs/1.1.0/spec.md` is a diff against 1.0.0**, so only the sections this version changes are written; everything else carries over by being absent, and **1.0.0 is never rewritten**. **The blank spec is not copied into it** — that would land twenty empty headings in a document that needed one new feature.

**The stages do not make you re-agree to what shipped.** A stage whose section this version does not touch passes as a **carry-over**: the previous version's answer, quoted back and confirmed. **Stages 6 and 7 never carry over for anything you add** — every new operation states who may call it, and the whole-document review reads the resolved document rather than the diff.

**First decide whether you need a new version at all.** The line is not the size of the change but whether the version has been released — `git tag -l '1.0.0'` empty means you edit `specs/1.0.0/` and the number does not change. Once released, leave it alone and start the next one. [`commands.md`](https://github.com/openreachtech/hora-core/blob/main/docs/commands.md) in `hora-core` has the whole procedure, including how the new number is chosen.

The seventeen checkpoints are in [`checkpoints.md`](./kit/skills/hn-build/references/checkpoints.md) — spec, use cases, DB and API schemas, stub API, supporting modules, real API, worker, security audit, then the frontend, then acceptance.

**Hora Kit holds the order and the gates; the procedures are separate from it.** How to write a resolver, a migration, a component or a test — and what an acceptance review looks at — all live in the `hoc-`/`hor-`/`hof-`/`hos-` skills under `kit/skills/`, matched at run time by description rather than named by any gate. See [`docs/skills.md`](./docs/skills.md).

## Documentation

| | |
|---|---|
| [`quick-start.md`](https://github.com/openreachtech/hora-core/blob/main/docs/quick-start.md) in `hora-core` | **the shortest route to a spec.** The three drop-off directories under a version, what putting a file in each one says, and what `/hn` does with them |
| [`docs/architecture.md`](./docs/architecture.md) | **what a project built from this boilerplate holds:** the four layers and where each ships from, the directories a run fills, why `.claude/` is generated, and who may write what. How the orchestrator itself runs is [`architecture.md`](https://github.com/openreachtech/hora-core/blob/main/docs/architecture.md) in `hora-core` |
| [`commands.md`](https://github.com/openreachtech/hora-core/blob/main/docs/commands.md) in `hora-core` | **what each command does.** Reads, writes, stops-when, and run-it-directly — plus what a session actually looks like |
| [`hotfix.md`](https://github.com/openreachtech/hora-core/blob/main/docs/hotfix.md) in `hora-core` | **the emergency route.** What `/hn-hotfix` does on `main`, and how the release lines left open are brought back onto it |
| [`docs/skills.md`](./docs/skills.md) | **the skills it runs on.** Why Hora Kit holds no procedure, how the skills are equipped, and what the package covers |
| [`kit/skills/hn-setup/SKILL.md`](./kit/skills/hn-setup/SKILL.md) | **the one skill this repository authors.** What it creates, what it fills in, what it records, and the five places it stops to ask you |
| [`docs/stack/`](./docs/stack/README.md) | **the stack handbook.** Everything specific to this boilerplate's technology stack — the origin catalog, the middleware, what each API kind produces — read by the hora skills at run time |
| [`about-boilerplate.md`](./about-boilerplate.md) | **the template's own version marker** — which hora-boilerplate this project started from. Not the product's version; that lives in git tags |

The rules themselves live with the skill that owns each one: [`hora/SKILL.md`](./kit/skills/hn/SKILL.md), [`structure.md`](./kit/skills/hn/references/structure.md), [`commits.md`](./kit/skills/hn/references/commits.md), [`done-criteria.md`](./kit/skills/hn/references/done-criteria.md), [`spec-format.md`](./kit/skills/hn/references/spec-format.md), [`stages.md`](./kit/skills/hn-spec/references/stages.md), [`principles.md`](./kit/skills/hn-spec/references/principles.md) and [`checkpoints.md`](./kit/skills/hn-build/references/checkpoints.md).

## Contribution

**Bug reports and feature requests are welcome**, through GitHub Issues.

**Code contributions are not being taken for now.** A fix to the kit belongs
in the repository that holds it either way, and the last paragraph of this
section says which one that is.

What follows is for work done inside this repository.

```sh
git clone https://github.com/openreachtech/hora-boilerplate.git
cd hora-boilerplate
npm install
npm run lint
```

**Raising a dependency version needs the release-age window turned off for that one command.** `.npmrc` sets `min-release-age = 7` and exempts nothing, so resolving a range raised to a version published inside that window fails with `ETARGET` rather than quietly settling for an older one. Raise the ranges in `package.json`, then refresh the lockfile with the exemption passed on the command itself.

```sh
npm install --min-release-age-exclude="<the package being raised>"
```

**Only there, and never back in `.npmrc`.** A standing exemption travels to every repository made from this one, and what it would stand in front of is `postinstall` — the hook that runs `hora:init` on every clone. Nothing else asks for the flag: `npm ci`, and any `npm install` that reuses the committed `package-lock.json`, install the locked versions whatever the window says.

**The `@openreachtech/*` packages are not among them any more.** The skills, the agents, the shared eslint config and the ecosystem catalog are all vendored under `kit/`, so raising them is a copy from upstream, not a version bump.

**Every file under `docs/` is a pair — `x.md` and `x.ja.md`.** Change one and change the other in the same commit. Two documents saying the same thing will disagree the moment only one of them is updated, and the stale one still reads as authoritative.

**Nothing under `.claude/` is edited here.** It is a copy, written by `npm install`, and the next one overwrites whatever you changed. Edit the source at `kit/skills/` or `kit/agents/` and re-run `npm run hora:init`.

**Those skills are vendored**, taken from [`hora-core`](https://github.com/openreachtech/hora-core) and the four `hora-skills-ort-*` packages and renamed to `/hn-*`, so upstream no longer reaches them — a fix released there is brought across by hand or not at all. They are English only, since Claude Code reads them rather than a person choosing a language; [`writing-style.md`](https://github.com/openreachtech/hora-core/blob/main/docs/writing-style.md) in `hora-core` is the style they are held to.

## License

This project is released under the Apache License 2.0.

For more details, please see [in the LICENSE file](./LICENSE).

## Developer

[Open Reach Tech Inc.](https://openreach.tech)

## Copyright

© 2026 Open Reach Tech Inc.
