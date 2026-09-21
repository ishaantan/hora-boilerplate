# How to ask a person something

**Every skill that talks to a person stands on this file** — `/hn-spec` and its stage skills, `/hn-plan`, and `/hn-hotfix`.

**There are three ways to put something to a person, and they are not interchangeable.** Each one asks the person to do a different job.

---

## The three, and what each asks of the person

| | **A check** | **A proposal** | **A question** |
|---|---|---|---|
| What the skill is doing | stating its own understanding | offering a course of action | naming something undecided |
| What the person judges | **is this right, or wrong** | **do we take this, or not** | **what is it** |
| Where the content came from | evidence the skill read | the skill's own thinking, **or something somebody asked for that nobody has worked out yet** | nowhere yet |
| If the person says yes | it goes in **as fact** | it goes in **as an approved decision** | — |
| If the person says no | the correction goes in | it is dropped, and recorded | — |

```
a check      "I read it as this. Is that right?"
a proposal   "I suggest this. It is yours to decide."
a question   "This is not decided anywhere. What is it?"
```

**Open with the form**, not with the content. A person who has to work out whether they are being asked to verify or to decide will sometimes get it wrong, and nothing downstream can tell that they did.

**What somebody asked for is a proposal, never a check.** A request states what they want; the section drafted from it states what the product would then do, which is a step nobody has taken yet. **Say whose idea it was in the same breath**: *"you asked for this; here is what it would mean"* and *"nobody asked for this; I am suggesting it"* are both proposals, and the record distinguishes them.

**A proposal dressed as a check is the dangerous direction.** The person answers "yes, that's right" to something the skill invented, and it enters `specs/` as an existing fact.

```
"This screen shows an error state."        a check    — it is there, in the code
"This screen shows an error state."        a proposal — it is not there. You are
                                                        suggesting it should be
```

**Those two sentences are identical, and they must never both be allowed.** The second is only ever written as *"I suggest adding an error state to this screen."*

---

## What each one is recorded as

| | Recorded where |
|---|---|
| a check the person confirmed | **the section itself. Nothing else** |
| a check the person corrected | the section, corrected. The reasoning goes in `_stages.md`, "Decided in conversation" if it changes a design |
| a proposal the person took | the section itself |
| a proposal the person declined | `_stages.md`, "Proposals not taken", and a `spec-proposal` question (`blocking: no`) |
| a question nobody present can answer | the question file, in the category that fits |
| **a check nobody present can confirm** | **`spec-assumption`** (`blocking: no`), naming the reading taken |

**`spec-assumption` narrows to that last row.** A skill no longer assumes silently — it asks, and records an assumption only when the asking produced no answer. **A `spec-assumption` raised without having asked first is a defect.**

---

## Use the question tool, and make the answer selectable

**Default to `AskUserQuestion` rather than free prose.** A person who has to compose every answer from nothing answers fewer of them.

### What goes in it, and what does not

| Use the tool | Keep it in prose |
|---|---|
| a check — right, or wrong and how | **approving a section.** The whole text has to be read, and it belongs in the transcript |
| a proposal with distinguishable options | a question whose real answer is a story — a use case, a domain explanation |
| a value from a known set — availability, security level, question language | a design argument that four options would distort |
| `built:` per feature — `spec` / `backend` / `frontend` / none | |
| `baseline:` per feature — verified, or listed unaccepted | **the `Baseline` line itself.** It is a section's own declaration, approved in prose |

**Never fold a section approval into an option.** What the approval protects is that the person read the exact words (`structure.md`, invariant 1).

### How to build the options

1. **Put the most likely answer first, and mark it `(recommended)`.** After stage 0 has read the existing assets, the skill usually does know which is most likely
2. **Offer values, not blanks.** Not "how many users?" but `100 / 1,000 / 10,000`. A person corrects a number more readily than they produce one
3. **Say what each option costs** in its description
4. **Batch up to four.** One question per exchange turns a stage into an interrogation
5. **"Other" is always available**, added by the tool itself, which is what makes offering a best guess safe

### Where it does not fit, say why in one line

Ask it in prose, and say what it needs: *"this one needs a few sentences — a list of choices would flatten it."*

---

## What is never asked

**Do not ask a person to confirm something the skill is forbidden to have worked out.** Offering `built: frontend` as the recommended option because the code looks finished is inference wearing a check's clothing.

**What may be offered instead is the evidence, and the choice left open**: what was found, what it does not settle, and four options with none recommended.

| | |
|---|---|
| **legitimate** | "The attendance resolvers, their tests and the two screens are present. Whether that is finished is not something the tree can say. Which is it?" |
| **not legitimate** | "This looks built to the frontend gate — confirm?" |

**One declaration lifts this rule, for exactly what it covers: `Authority: as-built`** (`spec-format.md`, "Existing assets"). For the features it reaches, `built:` may be derived from the evidence and put up for correction, and use cases may be drafted from the screens and operations as checks. **For a `to-spec` feature, and everywhere no declaration exists, this section applies unchanged.**

**`Baseline: inventoried` lifts nothing here.** Which features are listed is asked per feature, with the evidence laid out and **no option recommended**. It is **never offered inside `built:`'s own option list** — ask it first, separately, batched up to four features like anything else.

`structure.md`, invariant 2, is the full statement of what may not be inferred.

---

## A feature's budget is three turns

**One feature is put to a person at most three times, across the whole pipeline.**

| Turn | What it carries |
|---|---|
| **1 — the draft** | everything stages 1 to 6 settle about this feature, drafted in full and put up at once |
| **2 — the findings** | whatever stage 7's review and `/hn-plan` found wrong with it, together |
| **3 — the build** | whatever a verifier found at checkpoint 1, 8 or 10 (`../../hn-build/references/checkpoints.md`) |

**A fourth turn is allowed and is never silent.** Where one is genuinely needed, take it and write the reason on the feature's own line — `<!-- asked: 4; reason: … -->`. **The budget is a cost made visible, never a gag.** A run that needed six turns and says so is honest; a run that stayed at three by guessing is the failure this whole file exists against.

**Blocking questions sit outside the budget and always have.** Anything the run cannot proceed past goes out alone and at once, and is not counted or held.

**Stage order still binds, and it is what stops turn 1 being fictional.** A stage's answers are the next stage's input, so a stage that asks the whole version's features together is still one turn — turn 1 for every feature in it. **Batch across features within a stage; never across stages within a feature.**

---

## Draft it, then ask what is wrong with the draft

**The default form is a proposal, not a question.** A question hands a person a blank page; a proposal hands them something to correct, and correcting is faster and more accurate than composing. **Where a stage can draft a defensible answer, it drafts it and labels it a proposal.**

```
question   "Who may call this operation?"                  slow, blank page
proposal   "I suggest: staff only, and a customer calling
            it gets a 403. Yours to decide."                fast, correctable
```

**This changes the form, never the authority.** A proposal is the skill's own thinking, said out loud as such, and it enters `specs/` only if somebody takes it (the table above). **It is not a check, and dressing one as the other is the failure this file opens with.**

**An open question is what is left when no draft is defensible** — where the skill would be inventing intent rather than proposing a course of action, and where the evidence points nowhere. Those still get asked, in the same turn.

**Two things are never proposed, and no budget touches them**: whether a feature is verified or merely listed, and anything `structure.md`'s invariant 2 puts in its right-hand column where no `Authority: as-built` covers it. **Those are asked with the evidence laid out and no option recommended** ("What is never asked", below).

---

## Batch, and interrupt once

**What may not be inferred is unchanged** (`structure.md`, invariant 2). This section governs *cadence* and never scope: the same things get asked, in far fewer interruptions.

- **One turn per stage, for every feature in it.** The stage's whole section goes up as a draft, and the checks, the proposals and the open questions travel with it
- **The question tool carries at most four, so keep the open ones under four.** That is what "Draft it" above is for: a proposal lives in the draft text and costs no slot, while an open question costs one. A stage that would have asked nine drafts seven of them and asks two
- **Never split a batch to make each turn smaller.** Two turns of two cost a person more than one turn of four
- **A blocking question goes out alone and at once**, outside the budget. Anything the run cannot proceed past is not held behind work that has not happened yet

**Batching the turn is allowed; batching the answer is not.** Whether a feature is verified or listed is still asked per feature, with no option recommended — four such questions may share one turn, but one answer may never cover four features (`structure.md`, invariant 2).

**Silence between batches is the point.** A run that has nothing blocking it reports nothing until its next batch or its next completed pair (`../../hn-fast/SKILL.md`, "Reporting cadence").

---

## References

| File | Content |
|---|---|
| `structure.md` | the invariants — what may not be inferred, and what approval protects |
| `spec-format.md` | the format every answer ends up written into |
| `../../hn-spec/references/investigation.md` | what evidence a check may be built on |
| `../../hn-spec/SKILL.md` | the approval model a proposal passes through |
| `../../hn-plan/SKILL.md` | the question categories, in full |
