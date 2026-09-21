---
name: hn-setup
description: Create the repositories the spec declares from the stack handbook, fill in the project's values, and read what was fetched in place. Idempotent — creates only what is missing, and re-evaluates on every version. Invoked by /hn, or directly as /hn-setup.
---

# hn-setup

Create the repositories the spec declares, fill in this project's values, and read the real tree that arrived.

Read `../hn/references/structure.md` first — the repository layout, where a per-repository command runs, and the invariants. **This skill is read-only on `specs/`.**

**It holds no knowledge of any technology stack.** Which boilerplate fills a declared row, what gets filled in, and what to read once it is there all come from the **stack handbook**:

```
docs/stack/README.md             the origin catalog — every value the spec's `Origin` column may take
docs/stack/origins/<origin>.md   one document per origin, read top to bottom for each declared row
```

The handbook is read-only, and the real tree outranks it — on any disagreement the tree wins and the disagreement is reported. **A missing handbook, or a missing entry a step needs, is a stop-and-ask naming exactly what is missing.** Never substitute an assumption about the stack, and never scaffold one: a project created before its boilerplate carried a handbook gets one by copying `docs/stack/` from a boilerplate version that has it.

**Idempotent, and re-evaluated on every version.** Anything already there is passed over; repositories arrive in later versions, so passing once is not the end of it.

## What this skill does

```
1. Create only the repositories that are missing, from the declaration and the handbook
2. Fill in the values that carry this project's name
3. Read what was fetched, in place, and record what was read
```

**Record each row's test command in `.hora/tree/<repository>.md`.** It is what `/hn-accept` runs at every reach, and the only thing later runs need from this one about testing. **Nothing here wires a cache, and no cache exists to wire** — suites are tiered by what a run is for, not by what changed (`../hn-accept/SKILL.md`, "The two tiers").

---

## 1. Create what is missing

**Which repositories to create is declared by the spec's repository layout section**, which must be written in the entry point (`specs/<version>/spec.md`). Written in a feature file, it does not count as the declaration.

| Detection | Action |
|---|---|
| No repository layout section | **stop and ask** |
| No project name in `specs/<version>/spec.md` | **stop and ask.** Never derive it from the directory name, and never take it from a declared Source |
| An `Origin` value the handbook's catalog does not list | **stop and ask** |
| A row count outside the origin's stated bounds | **stop and ask** |
| No table of servers | **stop and ask** |

Settle the project name first. **Once it is settled, fill in this repository's own `package.json`** (`name` / `description`) — it ships with the same placeholder a fetched boilerplate does. **Leave `version` and `private` as they are.**

Then, for each declared row, in order — **the content of steps 1–2 and 5–8 comes from the row's origin document:**

```
0. Settle this row's directory (below), and register it in the exclusion lists
1. Find the version to fetch, as the origin document directs — a released state,
   never an unreleased head (../hn/references/structure.md, invariant 3)
2. Fetch it into that directory, from the source the origin document names
3. rm -rf <dir>/.git && git -C <dir> init && git -C <dir> checkout -b release/<version>
4. git -C <dir> commit --allow-empty -m "Release <version>" (the branch's opening
   marker — see ../hn/references/commits.md)
5. Fill in every value the origin document lists, with this project's values
6. Place every file the origin document lists, deciding anything spec-dependent
   from the spec's declared sections, as the document directs
7. Install dependencies, as the origin document directs
8. Copy the skills the origin document declares into <dir>/.claude/skills/,
   each only if it is not already there — never overwriting an existing copy
```

### Step 0 — the row's directory, and excluding it

**A row's directory is `<project name>-<declared row>`, unless the layout's optional `Directory` column says otherwise.**

| The `Directory` column is | Treatment |
|---|---|
| **omitted** | `<project name>-<declared row>`. Fetch the boilerplate into it if it is missing |
| **written** | look for exactly that directory, **and never fetch.** If it is not there, **stop and ask** |

**Register the directory in both of this repository's own exclusion lists, unless it already matches them.**

```
.gitignore          /*-backend*/ and /*-frontend*/ already cover a default name
eslint.config.js    `ignores` already covers '*-backend*/' and '*-frontend*/'
```

Add one entry per unmatched directory, to both files, and **report that you added it.** Write the entry exactly as declared, with no wildcard around it. **Both failures are silent** — an unexcluded repository is committed wholesale into this one, and the root's eslint walks into a repository whose config is not its own.

### When the directory already exists

**Skip steps 1–4 for that row**, however it got there. A row with a `Directory` column always takes this path, and so does a private boilerplate a human placed beforehand because a non-interactive fetch had no credentials.

- `../hn/references/commits.md`'s branch rule still applies: fetch and branch from `origin/main` if `release/<version>` is missing, with the same empty marker once created
- **Still run steps 5 onward** — each is its own idempotent check, not an all-or-nothing skip
- Its history is untouched. `.git` is discarded and re-initialized only for a row this run fetched, so that somebody else's commits never land on a product repository's `main`

### Closing the step

Make an initial commit in each repository this run created, on the `release/<version>` branch from step 3, after the empty marker from step 4. Keep the boilerplate's own files separate from the values this run filled in:

```
Initial commit from <boilerplate> <fetched version>
Fulfill project values for <myproject>
```

---

## 2. Read what was fetched, in place

**Bake in no boilerplate convention** — the newest released state is always fetched, so anything written down here would eventually disagree with it. The order to read in:

1. If there is a `CLAUDE.md`, read it — the authority, updated by the maintainer along with the code
2. Otherwise read the tree in place. **The minimum is the origin document's own read checklist** (`docs/stack/origins/<origin>.md`, "What to read once it is there")

This step stays even after a `CLAUDE.md` exists.

### Record what was read, and at what version

Write it to `.hora/tree/<repository>.md`:

```markdown
# myproject-backend
<!-- boilerplate: <name> <fetched version> -->

## Directory layout
...
```

- **Re-read and rewrite it whenever the recorded version no longer matches the row's own.** Otherwise, trust what is recorded
- **This is a cache, not a source.** On any disagreement, the tree wins and the record is rewritten from it

---

## References

| File | Content |
|---|---|
| `../../../docs/stack/README.md` | the stack handbook: the origin catalog, and what each origin document answers |
| `../hn/references/structure.md` | the layout, the per-repository command rule, the invariants |
| `../hn/references/commits.md` | the branch each created repository starts on |
