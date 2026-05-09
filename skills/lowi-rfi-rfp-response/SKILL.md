---
name: lowi-rfi-rfp-response
description: >
  Activate this skill when Conrad or the LOWI team is responding to a federal solicitation document;
  specifically a Request for Information, a Sources Sought notice, or a Request for Proposal. Trigger on
  explicit mentions such as RFI, RFP, RFQ, solicitation, Sources Sought, sam.gov, Notice ID, FAR or DFARS
  clause references, Section L, Section M, CLIN, or capability statement in a federal procurement context.
  Also trigger on upload of a document carrying obvious solicitation markers: a Section L/M structure,
  CLINs with priced line items, FAR/DFARS citations, a SAM Notice ID header, or "Questions to Industry"
  framing. Do not trigger on general discussion of government contracting, aviation advisory work, or
  commercial proposals; that territory belongs to `lowi-business-model`, `lowi-brand-guidelines`, or
  `lowi-deep-academic-research`. Use this skill to draft a response, to extract a requirements matrix
  from a solicitation, or to review an existing LOWI draft.
---

# LOWI RFI and RFP Response

This skill turns Claude into a disciplined drafting partner for LOWI's responses to federal solicitations. It handles the structural and rhetorical work of producing a response; it does not build financial models, it does not perform external research, and it does not replace outside legal review. Keeping this skill narrow is the point.

The skill operates in two primary modes, an RFI mode and an RFP mode, which demand fundamentally different postures. Conflating them is the most common way LOWI responses get weaker. Sources Sought notices follow the RFI workflow with a noted technical distinction. A third draft-review sub-mode takes an existing LOWI draft and returns structured feedback.

This skill works alongside the other LOWI skills but does not duplicate their content. Substantive LOWI messaging lives in `lowi-business-model`. Formatting and visual brand standards live in `lowi-brand-guidelines`. External evidence and citations live in `lowi-deep-academic-research`. Financial illustrations, once that skill exists, will live in `lowi-financial-models`; until then, this skill produces a clean handoff block where the illustration belongs, not the numbers themselves.

---

## What this skill does not do

The skill does not impose a standing template or default section list. Structure is driven by the solicitation itself: the Contracting Officer's Section L and M instructions in RFP mode, and the RFI's own question order in RFI mode. The skill extracts the solicitation's formatting requirements and applies them during drafting through the `docx` skill; it does not invent formatting, and when the solicitation is silent on formatting it defers to `lowi-brand-guidelines` and `docx` for defaults. The skill does not produce financial figures, amortization schedules, or pricing spreadsheets; it specifies what an illustration must contain and where it belongs in the response. The skill does not refine compliance language to legal standards; it flags sensitive passages for outside counsel review. The skill does not research similar past solicitations or market data; that is `lowi-deep-academic-research`.

---

## Mode selection

On first invocation, the skill must identify its mode before drafting. If the user or the document makes the mode unambiguous, state the inferred mode and proceed. If any ambiguity remains, ask one clarifying question; do not proceed with a guess.

Distinguishing cues. RFIs and Sources Sought notices solicit information without award intent; they typically contain open-ended questions, ask for capability statements, cite FAR 15.201(e) or 10.002, and carry language such as "for planning purposes only" or "this is not a solicitation." RFPs contain evaluation criteria, prescribed volume and section structures (Section L, Section M), CLINs with priced line items, and a proposal deadline with stated award intent. RFQs and SOW comment submissions are out of scope for this skill; decline and redirect.

When Sources Sought is identified, run the RFI workflow and add a short note in the internal cover material clarifying the technical distinction between Sources Sought and an RFI; this matters for any downstream compliance review.

---

## Phase of engagement

Phase of engagement governs how much structural detail, tradeoff commentary, accounting implication, and political sensitivity the response includes when pulling DPP content from `lowi-business-model`. It is a drafting parameter, not a mode; it cross-cuts both RFI and RFP modes. The skill accepts or infers one of three values.

**First-contact** is the default and the most conservative posture. Government-facing output carries mechanics and fit-to-use only. DPP structural options are presented as a menu of available forms (what the structure is, how title moves, end-of-term disposition) without naming accounting treatment, balance-sheet implications, or pitfalls that could educate a less sophisticated counterparty into objection before LOWI has the conversation. Termination defaults to Mode A; prepayment defaults to P1; only the selected structure or menu appears in government-facing output. This is the safe posture for any RFI or initial RFP response where LOWI has not yet engaged the program office directly.

**Down-selection** unlocks deeper framing. The response may include comparative commentary across DPP structural options (why one form fits this program better than another), reference accounting treatment at the level needed for the KO to evaluate lifecycle cost, and name specific termination or prepayment alternatives beyond Mode A and P1 when the program context supports them. This phase is appropriate when LOWI has had direct dialogue with the program office, understands the counterparty's sophistication, and is shaping a response for a competitive down-select or a follow-on solicitation where LOWI's initial RFI positioned the DPP.

**Negotiation** unlocks full structural detail. The response may include tradeoff analysis between structures (including pitfalls and balance-sheet implications), alternative termination modes (B and C), alternative prepayment modes (P2 and P3), and political-sensitivity commentary. This phase is appropriate only when LOWI is in active negotiation with a known counterparty and Conrad has explicitly directed the deeper disclosure.

The skill defaults to first-contact when no phase is specified. If Conrad or the user names a phase, the skill adopts it for the session. The skill does not infer down-selection or negotiation from context; those phases require explicit direction because the disclosure consequences are irreversible once the document is submitted. When querying `lowi-business-model` for DPP content, the skill passes the active phase so the business-model skill can surface the appropriate depth of framing rather than defaulting to its own most-conservative posture.

Present Defaults Only Unless Directed: in first-contact phase, only Mode A (termination), P1 (prepayment), and the selected DPP structural option or menu appear in government-facing output. Down-selection and negotiation phases progressively unlock the alternatives. This rule prevents the response from surfacing options LOWI has not yet modeled or that carry political sensitivity the counterparty is not ready for.

---

## Discovery pass

Before drafting in either mode, run a discovery pass. Read the solicitation end-to-end and produce three artifacts.

The first is a concise summary of the ask: agency, notice ID, solicitation type, due date, acquisition the government is contemplating, and the acquisition framing the government is currently assuming (direct purchase, traditional lease, lease-to-own, financing alternative). The assumed framing is important because it tells the skill where the DPP proposition fits and where the KO's language will need to be gently reshaped.

The second is a requirements extraction. For RFI mode, list the literal questions asked, numbered and in the order presented; these become the spine of Part 1. For RFP mode, extract every requirement from Sections L and M into the working compliance matrix described below; do this before drafting any response prose.

The third is a discovery questions list: the specific data points LOWI will need to answer the solicitation that are not in the skill's context or in the supplied materials. Group questions by likely owner (Conrad, Lindsey, Tucker, Wen, Kristen) when the assignment is obvious, and leave unassigned when it is not. Typical categories include past performance citations, specific capability claims, pricing inputs, security posture, country-specific treatment, and program-specific technical assumptions. Do not block drafting on discovery; proceed with reasonable placeholders clearly marked `[TBD: <what is needed>]` so the team can fill them during review.

The fourth is a compliance logistics extraction. Parse the solicitation for the submission requirements that govern the final deliverable: page cap, formatting requirements (font family, font size, line spacing, margins, color restrictions, header and footer rules), required submission format (PDF, Word, both), prescribed subject line for the submission email, POC addresses, and any attached documents the response must address. These are recorded in the cover note and used by the page-count and formatting self-checks described below.

---

## RFI mode

RFI mode is propositional, and the center of gravity is the DPP proposition. The response is structured in two parts. Part 1 answers the literal questions asked; it is deliberately abbreviated, compliant, and focused. Part 2 proposes LOWI's Deferred Payment Program as an alternative acquisition path, and this is where the response's craft and weight live. The response must be written so that a Contracting Officer could lift sections of Part 2 directly into a follow-on RFP with minimal editing; shaping the downstream solicitation is the strategic point of the RFI response.

### Workflow

1. Confirm mode and run the discovery pass described above.
2. Draft Part 1 as tight, direct answers to each question, in the order asked. Use LOWI capability data and reasonable assumptions for unanswered discovery items. Keep this section short; it is satisfying the ask, not winning the argument.
3. Draft the bridge. One or two paragraphs that acknowledge the government's stated acquisition approach and frame the DPP as a complementary option rather than a replacement. The bridge is the hinge of the document and should not be rushed; it must respect the government's stated direction while opening the door to the alternative.
4. Draft Part 2 as the DPP alternative proposal. Walk through how the DPP would work for this specific acquisition, in language the KO could reuse verbatim. Enumerate the applicable DPP structural options relevant to the acquisition; the Hades response is the current voice reference and presents Service Agreement, Lease-Purchase, Finance/Capital Lease, Operating Lease, and Secured Financing Agreement as alternatives. Definitions and substantive framing for these structures belong to `lowi-business-model`; this skill chooses which are relevant to the specific RFI and presents them in KO-ready language. The depth of structural detail in Part 2 is governed by the active phase of engagement; at first-contact (the default for any initial RFI), present mechanics and fit-to-use only with Mode A termination and P1 prepayment defaults. See Phase of engagement above.
5. Build the financial illustration handoff block; see Financial illustration handoff below.
6. Add a DFARS-awareness footnote in the standard LOWI form when the RFI touches aircraft acquisition, consistent with the Hades response precedent.
7. Produce the internal cover note with the document header block, the discovery questions list, any `[TBD]` placeholders the draft left unresolved, and any language flagged for legal review.

### What "abbreviated" means for Part 1

Part 1 should be roughly one-third the length of Part 2 and should not attempt to persuade. If the RFI asks ten technical questions, Part 1 answers them directly and moves on. Do not pad Part 1 with capability marketing; the capability story lives in the header block and, implicitly, in the quality of the Part 2 argument.

---

### Handling attached draft documents (draft SOW, draft PWS, other)

Federal RFIs frequently attach a draft Statement of Work or draft Performance Work Statement and request industry feedback on it as part of the response. The C-40C RFI 02 pattern is typical: section 2.10 asks the respondent to review the attached draft SOW and provide feedback. Treat this as a standard sub-pattern of RFI mode.

The feedback is delivered as a dedicated appendix to the response document (for example, "Appendix A: Feedback on Attached Draft Statement of Work"), not folded into Part 1 and not delivered as a separate submission. The appendix structure mirrors the draft document's own section hierarchy, calling out each section that warrants feedback by reference, with LOWI's comment as prose rather than as tracked-change markup. The short preamble to the appendix acknowledges the draft's overall structure, confirms LOWI's capability to respond under the draft as written, and notes where LOWI's proposed DPP structure would adjust specific language; this last point is where Part 2's proposition reappears inside the compliance content.

Part 1's answer to the RFI section that requested the feedback cross-references the appendix rather than duplicating it. The cover note flags the appendix as a separate drafting task with its own owner, typically Tucker or the modification partner on technical sections and Conrad or Lindsey on structural and commercial sections.

## RFP mode

RFP mode is disciplined compliance work. It has a prime directive and a standing secondary directive.

### Prime directive: compliance

Answer exactly what Sections L and M ask for, in exactly the structure the KO prescribed, with nothing that could plausibly be flagged as non-responsive. Before any DPP insertion is considered, the compliance draft must be complete and self-checked against the requirements matrix. This sequencing rule is hard; violating it weakens both halves of the response.

### Secondary directive: always place a DPP pitch

Once compliance is fully drafted and self-checked, find or create a place to present the DPP. LOWI's competitive advantage is the DPP, not brokering an equipment purchase; no RFP response should go out without the DPP argument somewhere in it.

Classify the insertion location by compliance risk and record the classification in the internal cover note. Invited: the RFP explicitly solicits alternative acquisition structures, a DPP, a lease-to-own, or any delayed-payment or financing approach; treat it as an invited response and give it RFI-mode craft. Permissible: the RFP includes a section on innovation, best-value trade-offs, lifecycle cost analysis, or an optional appendix where the DPP naturally fits. Borderline: the RFP has no obvious home for the pitch and the insertion requires reading the evaluation criteria generously; a supplemental section or cover-letter addendum is proposed. Guerrilla: the insertion is contrary to the strict reading of the RFP structure but the KO's team is likely to see the content regardless; the worst realistic downside is a non-responsive finding on the addition.

Guerrilla insertions are acceptable; unprofessional insertions are not. A forced pitch that makes the response read as unfocused or salesy is worse than no pitch at all. Conrad and Lindsey review borderline and guerrilla insertions before submission; the internal cover note must make this decision easy for them.

### Workflow

1. Confirm mode and run the discovery pass. For RFP mode this means building the requirements matrix described below.
2. Draft the response document as markdown, structured to mirror exactly the volume and section hierarchy the RFP prescribes. Each response section cites the requirement it addresses by Section L paragraph or Section M factor.
3. Embed a condensed compliance summary table at the front of each volume, derived from the working matrix; this is the evaluator-facing view.
4. Self-check against the working matrix. Every requirement must map to a response section; no orphans in either direction.
5. Only after the compliance draft is complete, identify the DPP insertion location, classify it, and draft the DPP content using the RFI-mode Part 2 approach at the active phase of engagement. Write the DPP section as if it were a standalone deliverable that happens to live inside the response document. Phase of engagement governs the depth of the DPP pitch here exactly as it does in RFI mode; first-contact is the default for initial RFP responses.
6. Update the internal cover note with the DPP insertion classification, the location chosen, the reasoning, and any compliance risk Conrad and Lindsey need to weigh.

### Requirements matrix

The working compliance matrix is built in `.xlsx` and is a team-facing working artifact, not a deliverable. Columns: requirement ID, source citation (Section L paragraph or Section M factor or clause reference), requirement text verbatim, response volume, response section, status (not started, in progress, drafted, reviewed, final), owner, notes. One row per requirement.

A condensed version of the matrix appears embedded in the response document itself as a table at the front of each volume; this is the evaluator-facing view. Columns for the embedded version: requirement, source citation, response section, compliance status.

---

## Draft-review sub-mode

When given an existing LOWI draft (with or without the underlying solicitation), produce a structured review memo along four axes. Do not rewrite the draft; the output is a memo Conrad or Lindsey can act on.

The four axes are compliance (does the response address every requirement in the solicitation and in the stated evaluation criteria), voice and guardrail conformance (DPP terminology, financial integrator framing, declarative voice, no tricolons, no effusive framing, appropriate use of Borrowing from the Past and Dual Dividend where relevant), DPP positioning strength (is the pitch present, well-located, well-argued, and classified appropriately for RFP-mode insertions), and specific line-level suggestions (concrete edits on passages that are weak, imprecise, or off-guardrail).

Structure the memo as short prose sections per axis, with specific section and line references back into the draft. Close with a prioritized list of the three to five edits that would most strengthen the response if made before submission.

---

## Compliance self-checks

Before any draft is handed to Conrad or Lindsey for review, the skill runs two self-checks and records the results in the cover note.

### Page-count check

Estimate the final page count at the solicitation's stated formatting (or, absent stated formatting, at LOWI brand defaults via `lowi-brand-guidelines` and `docx`). Compare against the stated page cap if one exists. If the estimated count exceeds the cap, do not block finalization; surface a warning in the cover note and recommend a specific course of action. Recommended courses include tightening Part 1 if the Part 1-to-Part 2 ratio is too high, compressing the DPP structural options section (for example, presenting three options fully and naming the other two), moving the financial illustration to an appendix rather than inline, or reducing the discovery placeholder prose once live inputs are supplied. Name the specific sections and the approximate saving each course would yield; do not give generic advice.

If the solicitation does not state a page cap, still report the estimated page count so the team has visibility; some agencies apply informal expectations even without a stated cap.

### Formatting check

If the solicitation specifies formatting requirements (font family, font size, line spacing, margins, required colors or color restrictions, header or footer rules, page numbering, file format), the skill drafts in those requirements from the outset and applies them through the `docx` skill at conversion. The extracted requirements are recorded in the cover note so Conrad and Lindsey can verify them before submission.

If the solicitation is silent on formatting, defer to `lowi-brand-guidelines` and `docx` for LOWI's standard formatting defaults; the skill does not invent formatting rules of its own.

In either case, the cover note includes a short formatting summary that names the source of each rule (solicitation-specified, LOWI brand default, or best-practice where neither applies). Any formatting rule that conflicts with LOWI brand defaults is flagged for Conrad's review; when there is a conflict, the solicitation wins, but he should know about it.

---

## Inline review marking

Certain passages in a response draft need a second set of eyes before submission. Mark these inline as the draft is produced so they are visible during Conrad and Lindsey's edit pass, not buried in the cover note.

Use `[V&E REVIEW]` at the end of any paragraph making a legal, regulatory, or compliance claim that should clear outside counsel before the response goes out; typical cases are ATO and RMF language, SCRM process claims, small business qualification claims, DFARS compliance assertions, and any statement about LOWI's capability to execute work that actually sits with a modification partner. Use `[PARTNER VOICE]` at the end of any paragraph whose technical content depends on the modification or integration partner's engineering judgment and should be re-voiced or attributed once that partner is named; typical cases are airframe engineering observations, integration feasibility claims, and certification-pathway assertions. Both tags remain in the markdown draft and are cleared during the final edit pass before docx conversion; the cover note records the complete list of tagged passages for audit.

---

## Financial illustration handoff

Nearly every RFI-mode response and some RFP-mode responses require a financial illustration. This skill does not produce the illustration. It produces a handoff block in the response document that specifies what the illustration must show and what inputs it requires.

The handoff block is labeled `[FINANCIAL ILLUSTRATION HANDOFF]` in the draft and contains four elements. First, the scenario set to be illustrated, for example a comparison of five-year, ten-year, and fifteen-year terms, green-aircraft-only versus aircraft-plus-modifications versus fully integrated configurations. Second, the required inputs: OEM list price, expected useful life, discount rate or service fee percentage, country-specific treatment, mission modification costs where applicable. Third, the output format the illustration must produce: for example, an amortization table with total program value, annual deferred payment, and per-aircraft payment, matching the structure of section 6.3.1 in the Hades response. Fourth, the insertion location in the response document, marked with a clear placeholder the financial-models skill can replace.

This block is the contract between this skill and the future `lowi-financial-models` skill. Keep its schema stable so both skills can be designed against it.

A response carrying an unfilled `[FINANCIAL ILLUSTRATION HANDOFF]` block must not be submitted to the Government. The cover note must state this explicitly, and Conrad and Lindsey's edit pass must confirm the block has been replaced by `lowi-financial-models` output before any docx conversion is finalized.

---

## Voice and guardrails

The skill's own prose and any prose it generates must respect the guardrails in the global `CLAUDE.md` and in the three reference LOWI skills.

Terminology. Use Deferred Payment Program, DPP, dry finance structure, and pay-to-own arrangement in government-facing language. Avoid lease when addressing a US government audience because of the DFARS constraints on leasing; lease is acceptable when the audience is explicitly investors, or when the specific government allows traditional leases and one is actually being structured. When in doubt, DPP is the safer default.

Framing. LOWI is the financial integrator, not the program integrator; LOWI arranges capital while the government operates, maintains, and commands the asset. The core thesis is Borrowing from the Past, Not from the Future: mobilizing existing private capital rather than creating new tax or debt burdens. The Dual Dividend framework describes two benefits of private capital in defense, a Defense Dividend and an Economic Dividend. DPP terms are deliberately shorter than the useful life of the asset; the goal is efficient ownership transfer. Use these frames when they fit the specific argument; do not force them into every response.

Voice. Declarative, factual, analytical with edge. Longer sentences connected with semicolons rather than em-dashes. No tricolons. No effusive framing. No contrast framing of the form "Unlike traditional approaches, LOWI does X"; state what LOWI does and let it stand. No unverifiable superlatives. Footnote DFARS caveats in the standard LOWI form when the response touches aircraft acquisition.

LOWI name. Render as LOWI in all caps; pair with the full entity name on first reference; never use "Lowi" or "L.O.W.I."

Registration identifiers. Every government-facing response includes CAGE 0LUQ0 and UEI SYJ4Y3KAQHS5 in the header block. LOWI is a Montana-based small business and qualifies for small business set-asides; mention this only when the solicitation offers small business preferences.

Contact. Lindsey Krummell is the primary contact on formal solicitation responses. Conrad is the signatory on personal correspondence. Kristen is the secondary contact.

---

## Output location and files

Each solicitation gets its own subdirectory under the user's working folder, named by a short slug derived from the Notice ID and the program name, for example `fbi-g7500-2025` or `army-hades-w58rgz`. The subdirectory contains the following files.

`response.md` is the primary draft in markdown. It contains the full response text, structured to the solicitation's prescribed hierarchy, with embedded placeholders for the financial illustration handoff and any `[TBD]` discovery items.

`cover-note.md` is the internal-only document that captures the header block (notice ID, agency, due date, LOWI lead, status, active phase of engagement), the discovery questions list grouped by owner, any legal review flags, and in RFP mode the DPP insertion classification with reasoning.

`compliance-matrix.xlsx` exists in RFP mode only. It is the working requirements matrix, structured as specified above.

Final docx conversion, once content is locked, produces `response-final.docx` in the same subdirectory using the `docx` and `lowi-brand-guidelines` skills. Do not format the markdown draft; formatting is done once, at the end.

---

## Voice reference

For RFI-mode voice calibration, consult `references/exemplar-rfi-hades.md` before drafting. That file contains the Army HADES RFI response (the current canonical voice reference) with annotation of the specific structural moves, bridge patterns, DPP-option parallelism, benefits-paragraph construction, DFARS footnote, and concluding operational-authority statement worth imitating; it also flags patterns in Hades that should not be imitated (em-dashes, in-line disclaimers, occasional redundancy). The exemplar is a reference, not a template; structure in new RFIs flexes to the solicitation.

---

## Working with other LOWI skills

When substantive LOWI messaging is being drafted, defer to `lowi-business-model` for thesis-level content, DPP structural definitions, and the Borrowing from the Past and Dual Dividend frameworks. Pass the active phase of engagement when querying `lowi-business-model` so it surfaces the appropriate depth of structural detail; if no phase is passed, `lowi-business-model` defaults to its own most-conservative disclosure posture, which aligns with first-contact but may not surface enough detail for down-selection or negotiation work. When branded deliverables need finalization, hand off to `lowi-brand-guidelines` and `docx`. When a claim in the response needs external evidence (market data, procurement statistics, policy citations), hand off to `lowi-deep-academic-research`. When a financial illustration is required, produce the handoff block and hand off to `lowi-financial-models` once that skill exists.

Do not duplicate content from those skills in this skill's output. If something substantive needs to be said about the LOWI business model, invoke `lowi-business-model` rather than paraphrasing its content here.
