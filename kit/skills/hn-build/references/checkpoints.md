# The seventeen checkpoints

**The authority on the checkpoint list.** `/hn-plan` copies the list from here into each feature file; `/hn-build` runs a feature through it.

**This file holds the order and the exit conditions. It holds no procedure.** How to write a migration, a resolver, a component or a test lives in the `hoc-`/`hor-`/`hof-`/`hos-` skills, and each checkpoint states the *work* that skill covers (`../../hn/references/structure.md`, "The division of labor").

**No checkpoint below names a package skill, and none ever may.** Each checkpoint's **Delegate to** row says what has to be covered, and the main session matches that against the equipped skills' own descriptions at run time (`../../hn/references/structure.md`, "No hora file ever names one of those skills"). **Skills Hora Kit itself ships — `/hn-accept` — are named here freely.**

---

## What a checkpoint is

A checkpoint is **a gate with one exit condition**. Passing it is not "I did some work on this" — it is that a specific, stated condition now holds.

### Three states, and only three

```markdown
- [ ] 5. Actual API                                        not passed
- [x] 5. Actual API                                        passed
- [x] 6. Worker  <!-- n/a: this feature triggers no background job -->
```

**A checkpoint may only be marked not-applicable with a written reason**, checked against that checkpoint's own "when it does not apply" line below. A bare `n/a` is a skipped checkpoint dressed as a cleared one.

**Three reasons do not come from a checkpoint's own line, and there are no others:**

| Reason | Written by | Authority |
|---|---|---|
| `built before Hora Kit was adopted` | `/hn-plan`, expanding a confirmed `<!-- built: -->`. **Checkpoint 17 is never among them** | `../../hn/references/spec-format.md`, "`built`" |
| `accepted in <earlier version>` | `/hn-plan`, on a feature re-scheduled because a listed feature's debt was paid | `../../hn/references/done-criteria.md`, "Not applicable is a state, and it needs a reason" |
| `target names no <frontend \| backend> row` | a whole skipped gate, into each of its own checkpoints | `../../hn/references/spec-format.md`, "`target`" |

**A not-applicable mark is cleared the moment its reason stops holding.** When checkpoint 17 sends the run back into a stretch marked `built before Hora Kit was adopted`, that code is being changed, so it was not simply inherited: reopen from the earliest checkpoint affected and run it for real.

### The order is a rule

**No checkpoint may be entered until every earlier one is `[x]`.** There is no exception and no fast path — several of them look independent and are not.

**Inside one checkpoint, its units do run at once** (`../SKILL.md`, "Step 5 — splitting a checkpoint into units"). Five of the checkpoints below divide into units — a table, a module, an operation, a component, a screen — and one agent takes each. The checkpoint remains one gate with one exit condition.

### Four checkpoints can send the run backwards

2, 9, 11 and 18 are **verification** gates: they check the work against something outside it. When one fails, **it clears the checkpoints it invalidates and the run returns to the earliest one cleared.**

| Gate | Checks against | Sends back to |
|---|---|---|
| 2 | the use cases, as the spec states them | checkpoint 1 (the spec itself is what has to change) |
| 9 | the use cases, against the API actually built | whichever of 3–7 has to change. Usually 3 |
| 11 | the use cases, against the screen actually designed | 11 itself, or back to 2 when a use case turns out to be wrong |
| 18 | the product, end to end | whichever checkpoint produced the shortfall, in whichever feature |

**Cycling here is the design working.** A run that never goes back has either an unusually complete spec or a verification gate that is not doing its job.

### On a repository that is not empty, a checkpoint reconciles rather than creates

**Every exit condition below reads the same against existing code; what changes is the work that satisfies it.** Checkpoint 2 against an empty repository writes migrations; against a `to-spec` feature's existing tables it changes them toward the spec's data model. The same holds down the list: 5 fixes modules that exist before writing ones that do not, 6 brings existing resolvers to the contract, 15 brings existing screens to the design.

**For a `to-spec` feature, running all seventeen gates against existing code is the work itself.** The waste case is different: **a finished feature run through seventeen gates because nobody declared `Authority: as-built`** (`../../hn/references/spec-format.md`, "Existing assets"). Do not read that case as a reason to skip gates on unfinished code.

| Gate | Checkpoints | Repository written in | Merges when |
|---|---|---|---|
| Spec | 1–2 | none (`specs/` and `.hora/` only) | — |
| Backend | 3–9 | the backend row | after 9 |
| Frontend | 10–17 | the frontend row this feature names | after 17 |
| Acceptance | 18 | none (`.hora/acceptance/` only) | — |

A feature whose `target` names no frontend skips 10–17 as a whole; one that names no backend skips 3–9. **Skipping a whole gate still means marking each of its checkpoints not-applicable, with the reason.**

---

# Spec gate

## The verification passes — 1, 8 and 10

**These three check; they do not produce.** Each walks something already written against something already built, and each has exactly one interesting outcome: it finds a shortfall, or it does not.

**They run in a verifier agent, read-only, and they run in every lane at once.** Nothing about them waits for a person while they find nothing — the happy path of a verification pass needs no conversation, and paying for them one at a time in the main session was the largest fixed cost a feature carried.

| Outcome | What happens |
|---|---|
| **nothing found** | the checkpoint passes. **The run says nothing** and the next checkpoint starts |
| **a shortfall found** | **stop the lane and surface it at once**, alone, with the evidence. A person settles it, and the fix runs where that checkpoint's own line says it belongs |

**A finding is never settled by the agent that found it, and never by any agent.** What these four uncover is almost always intent — a use case nobody can complete, a criterion that reaches forward, a screen with no path to it — and intent is not inferable (`../../hn/references/structure.md`, invariant 2). **The verifier reports; a person decides; `/hn-spec` or `/hn-plan` writes.**

**Checkpoint 10 also writes, and that part is not a check.** Filling in the shared UI/UX context file is ordinary work an agent does; only a *shortfall* in it escalates.

**What this trades is the pass a person would have made themselves.** A verifier walking use cases can miss what somebody who knows the product would have caught. Checkpoint 17's acceptance review is the backstop, and a person who wants to walk one of these themselves says so for that feature.

---

## 1. Confirm the feature is buildable

| | |
|---|---|
| **Delegate to** | the skills covering how a rough request becomes stated requirements with observable criteria. **Anything that has to change goes to `/hn-spec`** (`../../hn-spec/references/stages.md`) |
| **Runs in** | a verifier agent. The main session only on a finding ("The verification passes") |
| **Exit condition** | this feature's requirements, use cases and acceptance criteria are all written in `specs/`, each observable, **each checkable against a product in which this feature and its `depends` are built and nothing later is** — and every one of those use cases is achievable under the spec as written |
| **Not applicable when** | never. Every feature passes this |

`/hn-plan` has already verified that these exist. **This checkpoint is where they are read closely enough to build from, and walked end to end on paper against the spec.**

**Two readings, one gate.** Reading the criteria closely is what catches the one that reaches forward. Walking the use cases is what catches the one that cannot be completed — a step with no operation behind it, a screen with no way to reach it, a state the model cannot represent, two requirements that cannot both hold. **They read the same sections, in the same pass, and they escalate the same way.**

**A criterion that reaches forward sends the feature back to `/hn-spec` at stage 2, and this checkpoint does not pass while it stands** (`../../hn/references/spec-format.md`, "A criterion is checked at its own feature's gate"). `/hn-plan` stops on it first (`forward-reference`, `blocking: yes`); one that arrives here anyway is caught here.

**An unmet use case found here costs a conversation. The same one at the acceptance gate costs a rebuild.**

**The version's own acceptance criteria are not this feature's, and nothing here reads them.** The whole-version sweep is the only run that checks them (`/hn-accept`, "What is in scope").

**What is found missing here is fixed where the fix belongs**, and this is the only checkpoint that reaches `specs/` at all:

| What is missing | Fixed by |
|---|---|
| a use case, an operation's caller, a design that cannot serve a use case | **`/hn-spec`**, at the stage that owns it. It writes one approved stage at a time |
| a one-line hole — an annotation, a `target`, a typo | **`/hn-plan`**'s procedure: state it, propose the exact edit, wait for approval, write it |

---

# Backend gate

## 2. DB and API schemas

| | |
|---|---|
| **Delegate to** | DB, in this order: the logical shape of a table → the migration → the model. API surface, by kind (below). Types and constants: declaration files, and the constant convention. A new endpoint: what an endpoint is and what its auth filter does |
| **Runs in** | one implementer agent per table, and per operation's API surface (`../SKILL.md`, "Step 5 — splitting a checkpoint into units") |
| **Exit condition** | the migration, the model, the declaration files and the API surface all exist and agree with `.hora/contracts/<version>/` |
| **Not applicable when** | this feature adds no table and no operation (rare — usually a feature that only composes existing ones) |

**The API surface branches on the kind of each operation** — the kind comes from the spec, never from inference (`../../hn/references/structure.md`, invariant 2) — **and what each kind requires designing is the stack handbook's** (`docs/stack/artifacts.md`, "At schema design").

**Type interfaces and constants belong here, not with the modules at checkpoint 4.** Declaration files and enum-like constants are the schema expressed as types — the stub at checkpoint 3 already needs both. Checkpoint 4 gathers the material the real implementation runs on.

**A constant file two operations both add to is this checkpoint's shared file, and it belongs to one unit.** Give it to the unit that owns it, or run this checkpoint whole (`../SKILL.md`, "Step 5 — splitting a checkpoint into units").

**If the spec does not state an operation's kind, stop.** Raise it rather than picking a kind.

## 3. Stub API

| | |
|---|---|
| **Delegate to** | the skills covering how a stub API is written |
| **Runs in** | an implementer agent |
| **Exit condition** | a schema-accurate stub exists for every operation **another feature is waiting on**, returning hardcoded data, callable from outside |
| **Not applicable when** | this feature adds no API operation, **or nothing is waiting on one.** The common case — state which it is, do not assume it |

**A stub is for somebody else's lane, never for this one.** This feature's own frontend is built at checkpoints 11–14, after checkpoint 5 has produced the real API, so it has a real endpoint to call and a stub would be written and swapped away inside a single feature for nothing.

**What makes it applicable is a waiting dependent**: another feature whose `depends` names this one, scheduled in this version, whose frontend would otherwise sit behind this backend. `_plan.md` holds those relations, so it is read, not guessed. **Build a stub only for the operations that dependent actually calls.**

A stub lives beside the real resolver under a `stub/` folder, with the **same class name and interface** the real one will have. That sameness makes the swap at checkpoint 15 a change of endpoint rather than a rewrite.

## 4. The modules the implementation needs

| | |
|---|---|
| **Delegate to** | first the catalog (below), then the skills covering whichever of these this feature needs: an external API client, a dispatch strategy, the shared resolver container, a named subquery, a seeder. For an AI feature: agent structure, agent loops, multi-LLM providers, light RAG, prompt document stores |
| **Runs in** | the catalog check first, once for the whole checkpoint, then one implementer agent per module (`../SKILL.md`, "Step 5 — splitting a checkpoint into units") |
| **Exit condition** | **every module checkpoint 5 will import already exists and works on its own**, and nothing was written that the catalog already provides |
| **Not applicable when** | checkpoint 5 needs nothing beyond the model and the schema. State that, do not assume it |

**The exit condition is "they are there", not "some were written".** Before leaving, list what checkpoint 5 is going to import and confirm each one resolves.

**That list is gathered by the main session, from every unit together.** A unit sees the module it wrote and none of its siblings'.

### Check the catalog before writing anything

**There are more than 40 in-house packages, and the utility layer is never named in a spec, which makes it the most reinvented.** This checkpoint is where that check happens, once, for the whole feature.

**"Once" is what makes the delegate order a rule here.** One agent searches the catalog for everything this checkpoint is about to write and returns what to reuse; the module units start with that answer in hand. Left to the units, the search runs once per module and can return a different verdict on the same package each time.

The catalog is the vendored `@openreachtech/hora-ecosystem`, held at `kit/ecosystem/` in the hora repository. **How it is laid out is the catalog's own to change: read its README at run time** (`../../hn/references/structure.md`, "The division of labor").

- Keep only the packages the catalog currently tracks — that is the search space
- **Match a description of the processing about to be written against a candidate's own docs, not against a category**
- **Judge which surface a package serves from what its docs describe, never from what its name sounds like.** When two candidates address the same need, prefer the one matching the surface — unless `specs/` says otherwise
- An identifier whose name starts with `Base` is used by extending it, not directly
- **The spec overrides this.** When `specs/` states a particular way to implement something, follow that and implement it fresh
- When something looks close but there is no confidence, record it as `reinvention` (`blocking: no`) and proceed with your own implementation
- **A package that does the right thing but does it wrong is not a reason to write your own.** Match the skills covering how a defect in a dependency is worked around, and hand them to the unit that hit it

### Explicit row ids come from this feature's allocated prefix

A seeder written here, or a test fixture written later, that carries an explicit `id` **builds it from the prefix `/hn-build` allocated for this feature** (`../SKILL.md`, "Where to start"), in any table. Derive an id from that prefix alone, and leave another requester's rows unread.

## 5. Actual API

| | |
|---|---|
| **Delegate to** | by kind (below), plus the skills covering resolver input validation |
| **Runs in** | one implementer agent per operation (`../SKILL.md`, "Step 5 — splitting a checkpoint into units") |
| **Exit condition** | the real implementation exists under the same class name and interface as its stub, its input is validated, and the unit tests covering this feature's acceptance criteria pass |
| **Not applicable when** | this feature adds no API operation |

**What each kind requires implementing is the stack handbook's** (`docs/stack/artifacts.md`, "At the actual implementation") — the real thing behind the operation, under the same class name and interface as its stub.

**Write a test for each acceptance criterion, and run it.** Where a backend test lives, how it is named, how its run order is guaranteed, and how a failing suite is driven to green without weakening it are all the package's. **A test that is loosened, skipped or deleted to make the suite pass fails this checkpoint** — the exit condition is the criteria being backed, not the command exiting 0.

**"Each acceptance criterion" means this feature's own, and only those.** A behavior spanning several features is the version's, which no gate reads (`../../hn/references/spec-format.md`, "15. Version acceptance criteria").

**Leave the stub in place.** It is what the frontend is still building against until checkpoint 15.

## 6. Worker

| | |
|---|---|
| **Delegate to** | **first**, the skills covering where work belongs — the request path, a post-worker, or a background job — since that decides *whether* the rest apply. Then the skills covering whichever it chose: a side effect after the response, or a queued job with its schedule and retry |
| **Runs in** | an implementer agent |
| **Exit condition** | every piece of this feature's processing that does not belong in the request path runs where it should, and is implemented there |
| **Not applicable when** | this feature has no processing outside the request path. **Decide that with the placement skill, not by eye** |

**The placement decision comes before the implementation, and it is the part that gets skipped.** A write that looks synchronous, a side effect that looks small, a notification that looks instant — each is a candidate for a post-worker or a job.

**This is the one checkpoint where the delegate order is itself a rule**: the placement skill is what tells the rest of the checkpoint whether it has anything to do.

## 7. Security audit

| | |
|---|---|
| **Delegate to** | the skills covering a read-only security audit — what kinds of defect exist and how they are found |
| **Runs in** | **a verifier agent — read-only.** The audit finds; it does not fix |
| **Exit condition** | the audit produces no finding against this feature's code, or every finding it produced has been fixed or explicitly accepted and recorded |
| **Not applicable when** | never, for a feature that wrote backend code |

**Fixing a finding is a separate act**, done by an implementer agent afterwards, followed by re-running the audit. **The re-run is scoped to the fix, not repeated whole**: confirm each prior finding is resolved, and re-audit the files the fix touched — plus the shared surface it reached, since moving a guard or changing a shared caller can raise a finding in a file the fix did not itself edit. The standard is unchanged; only the surface is. An accepted finding is recorded as a question, never left as a silent pass.

**Run it against this feature's change set, not the whole repository** (`../SKILL.md`, "The change set of a checkpoint"). The declared surface is part of that set on purpose: a new caller wired to existing, unchanged code is still audited for auth and exposure, which the changed files alone would miss. Scoping it here keeps the finding list attributable to the work that just happened.

**Only a re-run that follows a fix is scoped to that fix.** Checkpoint 7 is also re-entered when checkpoint 8 sends the run back into 3–7; those checkpoints changed underneath it, there is no fix to scope to, and the change set is this feature's, exactly as on the first run.

## 8. Verify the use cases again, against the built API

| | |
|---|---|
| **Delegate to** | — |
| **Runs in** | a verifier agent. The main session only on a finding ("The verification passes") |
| **Exit condition** | every use case from checkpoint 1 can be completed against the API as it now exists — operation by operation, in order, with real data shapes |
| **Not applicable when** | never, for a feature that wrote backend code |

Checkpoint 1 verified the use cases against the *spec*. This verifies them against the *thing that got built*. **Walk each use case as a sequence of actual calls** and check that each step has an operation, that it returns what the next step needs, and that the shapes line up.

**Where a use case falls short, go back — usually to checkpoint 2.** Clear the checkpoints from there and say which were cleared. **Do not patch it at the edge**: adding one field on the way past is how an API drifts from its contract, which a frontend in another repository is already building against.

**This is the last chance before a frontend starts consuming it.** After this checkpoint, the backend row's `feature/<id>` branch merges into `release/<version>`.

---

# Frontend gate

## 9. Open the frontend

| | |
|---|---|
| **Delegate to** | the skills covering the frontend framework's own structure, and its environment variables |
| **Runs in** | an implementer agent |
| **Exit condition** | the pages and routes this feature needs exist and are reachable, and the environment variables pointing at the backend are wired |
| **Not applicable when** | this feature's `target` names no frontend row |

## 10. Reconfirm UI/UX and the use cases

| | |
|---|---|
| **Delegate to** | the skills covering the shared UI/UX project context |
| **Runs in** | a verifier agent. The main session only on a finding ("The verification passes") |
| **Exit condition** | the shared UI/UX context file covers this feature — its users, its screens, its rules — and every use case has a path through the interface |
| **Not applicable when** | this feature's `target` names no frontend row |

**This is the third pass over the same use cases, and it is not redundant.** 2 asked whether the spec supports them, 9 whether the API supports them, and this asks whether *a person can actually do them on a screen*.

That context file is what the UI generator (checkpoints 11, 14) and the UI auditor (checkpoint 17) both read. **Filling it in is this checkpoint's real output** — skip it and both run without a project context.

**A use case with no path through the interface goes back to checkpoint 1**, since either the interface or the use case is wrong, and only the person there can say which.

## 11. Component design

| | |
|---|---|
| **Delegate to** | the skills covering how a screen is made correct by construction; **every skill covering a component that already exists**; and the skills covering what must not be built in a component |
| **Runs in** | one implementer agent per component (`../SKILL.md`, "Step 5 — splitting a checkpoint into units") |
| **Exit condition** | each screen is broken into components, and every component either already exists in the app's own library or has a stated reason for being new |
| **Not applicable when** | this feature's `target` names no frontend row |

**Check the existing component skills before designing a new component.** The package ships one skill per component the library already has — buttons, dialogs, tables, selects, tabs, toasts and much else. **This is the checkpoint where matching against the equipped descriptions is worth doing exhaustively.**

## 12. The frontend modules the implementation needs

| | |
|---|---|
| **Delegate to** | the skills covering shared frontend logic as utility classes, and mapping backend error codes to user-facing messages |
| **Runs in** | an implementer agent |
| **Exit condition** | logic used by more than one component or page exists as a class under the app's modules folder, and this feature's backend error codes map to user-facing messages |
| **Not applicable when** | nothing in this feature is shared between two places, and it introduces no new error code. State which of the two, do not assume both |

**The form shared logic takes — a class, a function, something else — is the stack handbook's** (`docs/stack/artifacts.md`, "Shared frontend logic"); how it is written is the equipped skills'.

**Error mapping is part of this checkpoint, not of the UI checkpoint.** A backend error code with no locale entry surfaces as a raw dotted string, and checkpoint 17's review fails it under "does it tell the truth when something goes wrong".

## 13. API client

| | |
|---|---|
| **Delegate to** | by kind (below) |
| **Runs in** | an implementer agent |
| **Exit condition** | a client exists for every operation this feature uses, matching `.hora/contracts/<version>/` exactly, and it works against the stub from checkpoint 3 |
| **Not applicable when** | this feature's screen calls no API |

**What has to be built for each kind is the stack handbook's** (`docs/stack/artifacts.md`, "At the frontend's API client").

**The contract is authoritative for both sides.** Wanting to change it here means raising a question, not changing it.

**"Works against the stub" is the exit condition, not "works against the real API".** Testing against the stub proves the client matches the *contract* rather than whatever the implementation happens to return.

## 14. UI

| | |
|---|---|
| **Delegate to** | the skills covering how a screen is made correct by construction, and **every skill covering this project's CSS conventions** — writing style, layers, units, prohibitions, custom-property naming and prohibitions, property order within a selector, line height, `z-index`, spacing and margins, animation |
| **Runs in** | one implementer agent per screen (`../SKILL.md`, "Step 5 — splitting a checkpoint into units") |
| **Exit condition** | every screen this feature needs is built, accessible, responsive, and in its loading, empty and error states as well as its filled one |
| **Not applicable when** | this feature's `target` names no frontend row |

**The three states other than "filled" are the ones that get skipped and the ones acceptance fails on.** **Each of the four states belongs to its screen's own unit** — splitting them across agents would give one screen four authors and none of them the whole condition.

**What the screens here share is styling, and it goes to one unit.** A custom-property declaration, a layer or global stylesheet, and the place a screen's labels are written are each one already-existing file. **The CSS conventions themselves are a shared *reading*, never a shared file.**

## 15. Wire the data-fetching logic in

| | |
|---|---|
| **Delegate to** | the skills covering the frontend's context patterns, its API operation clients, and how a frontend test is written and placed |
| **Runs in** | an implementer agent |
| **Exit condition** | the screen shows real data from the **actual** API, not the stub, its loading and error paths are driven by real responses, and the unit tests covering this feature's frontend acceptance criteria pass |
| **Not applicable when** | this feature's screen calls no API |

**Write a test for each frontend acceptance criterion, and run it.** **A test that is loosened, skipped or deleted to make the suite pass fails this checkpoint**, and **the criteria are this feature's own**, never the version's (`../../hn/references/spec-format.md`, "15. Version acceptance criteria").

**Where checkpoint 3 built a stub, this is where it is left behind.** Since the stub and the real implementation share a class name and an interface, this is a change of endpoint, not a rewrite — and where no stub was built, this checkpoint wires the real endpoint from the start and there is nothing to swap.

**A stub that was built stays in the repository**, intact after the swap: the dependent that caused it is still developing against it.

## 16. Local test environment

| | |
|---|---|
| **Delegate to** | the skills covering how the local end-to-end container stack is built |
| **Runs in** | the main session |
| **Exit condition** | every service, role and fixture this feature needs is **written into the environment's own files** — the compose file, the env files, the seed command — and the checkpoint says what it added |
| **Not applicable when** | this feature added no service, no role and no seed data |

**This checkpoint writes the environment. It never starts it, and it runs nothing against it.** Nothing here brings a container up, signs a role in, or drives a screen. **No end-to-end run happens during development**, at this checkpoint or at any other.

**Bringing the stack up belongs to the run that is about to drive it** — `/hn-accept` step 1, which reaches it only in the three cases below (`../../hn-accept/SKILL.md`, "What is in scope"):

| The stack is brought up for | Asked for by |
|---|---|
| the whole-version sweep | **a person, every time.** The sweep stops and asks before the live part |
| a gate run whose live sweep was explicitly requested | the person who requested it, in the run |
| a gate run paying a listed feature's deferred acceptance | nobody — it is the only acceptance that code will ever have had |

**The declaration is still written here, while the feature that changed it is fresh.** What is deferred is the cost of running the stack, never the knowledge of what it takes: a live run three months later must not be left reconstructing what four separate features each needed from it.

**A feature that adds a service, a role or a fixture updates the environment here**, even when the environment as a whole already exists.

**This checkpoint's changes do not go on the feature's own branch.** They get their own `update/e2e-<what>-for-<feature-id>` branch (`../../hn/references/commits.md`).

---

# Acceptance gate

## 17. Acceptance (E2E and unit both)

| | |
|---|---|
| **Delegate to** | **the `/hn-accept` skill** |
| **Runs in** | the main session |
| **Exit condition** | `/hn-accept`, in its feature-gate form, reports a pass — the unit suites at the gate tier across **every repository**, and the acceptance review scoped to this feature |
| **Not applicable when** | never |

**The gate is scoped; the regression net is not selected.** Every repository is exercised every time, and no test is picked by inference — what a gate defers is whole DB-writing categories this feature did not touch, and the sweep runs them (`/hn-accept`, "The two tiers"). A feature that broke an earlier one's order-independent tests still fails here, in the run that broke it. What a gate also does not do by default is drive earlier features' screens end to end (`/hn-accept`, "What is in scope").

**What this gate judges is this feature's own acceptance criteria. The version's own are the sweep's, at every reach** (`../../hn/references/spec-format.md`, "A criterion is checked at its own feature's gate").

**Everything about what is reviewed and what fails lives in `/hn-accept` and the skills it delegates to.** Do not restate any of it here.

**On a failure, the run goes back to whichever checkpoint produced the shortfall — in whichever feature.** Clear those checkpoints, say which, and rebuild through a `retake/` branch (`../../hn/references/commits.md`).
