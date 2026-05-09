# LOWI Claude Setup — Setup Guide for Lindsey

This package replicates Conrad's Claude environment on your machine. Two interfaces are covered:

- **Cowork** — the Claude desktop app's visual session mode (with plugins, connectors, and built-in PowerPoint/Word/PDF tooling).
- **Claude Code CLI** — terminal-based Claude that runs the same skills against any folder on your Mac. Useful for long-running jobs, scripting, and the Gerty remote server.

The installer copies the LOWI skills and your personal `CLAUDE.md` into **both** environments automatically. Plugins and connectors are Cowork-only.

Follow the steps in order.

---

## Step 1 — Install Claude Code CLI (one-time, ~2 minutes)

Open **Terminal** (Applications → Utilities → Terminal) and run:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

This installs the `claude` command to `~/.local/bin/claude`. Restart Terminal after install, then verify:

```bash
claude --version
```

You should see a version number (e.g. `2.1.117 (Claude Code)`). On first run inside a folder, type `claude` and follow the login prompt — it uses your existing Claude account.

---

## Step 2 — Install Python + Document Packages (one-time, ~3 minutes)

Several Claude skills (`docx`, `xlsx`, `pptx`, `pdf`) generate and edit Office files by running Python under the hood. macOS ships with Python 3.9 already, so you only need to install the packages.

In Terminal:

```bash
pip3 install --user \
  python-docx openpyxl python-pptx pandas xlsxwriter \
  pdfplumber pypdf PyMuPDF pillow reportlab \
  requests beautifulsoup4 lxml
```

This is the same package set Conrad runs locally. It enables Claude to:

| Package(s) | Used By |
|---|---|
| `python-docx` | The `docx` skill — Word document creation/editing |
| `openpyxl`, `pandas`, `xlsxwriter` | The `xlsx` skill — spreadsheet creation, formulas, charts |
| `python-pptx` | The `pptx` skill — slide deck generation |
| `pdfplumber`, `pypdf`, `PyMuPDF`, `reportlab` | The `pdf` skill — PDF reading, merging, form-filling, OCR |
| `pillow` | Image handling across all skills |
| `requests`, `beautifulsoup4`, `lxml` | Web scraping and HTML parsing inside research skills |

Verify with:

```bash
python3 -c "import docx, openpyxl, pptx, pdfplumber; print('OK')"
```

You should see `OK`.

---

## Step 3 — Run the Installer Script (Automated)

This handles all custom LOWI skills and your personal context file. It installs into **both** Cowork and Claude Code CLI.

In Terminal:

```bash
bash ~/Desktop/lowi-claude-setup/install.sh
```

*(Adjust the path if you saved the folder somewhere other than your Desktop.)*

The script installs the following skills:

| Skill | What It Does |
|---|---|
| `lowi-brand-guidelines` | Enforces LOWI brand voice, tone, and visual standards across all deliverables |
| `lowi-business-model` | Deep context on LOWI's DPP structure, financing thesis, and value proposition |
| `lowi-deep-academic-research` | Sourced, evidence-based research for white papers, briefings, and proposals |
| `lowi-rfi-rfp-response` | Drafts and reviews responses to federal solicitations (RFI, RFP, Sources Sought) |
| `gerty-2021-1` | Recipe for launching long-running Claude Code sessions on Gerty (the remote server) |
| `lisl` | Personal fitness coach — weekly workout planning and ski conditioning |
| `skill-creator` | Build and improve new skills directly inside Claude |

Skills are copied into:

- `~/Library/Application Support/Claude/.claude/skills/` — picked up by Cowork
- `~/.claude/skills/` — picked up by Claude Code CLI

The script also installs `CLAUDE.md` — your personal context file — into both:

- `~/Library/Application Support/Claude/CLAUDE.md` (Cowork)
- `~/.claude/CLAUDE.md` (CLI)

Claude reads this file automatically in every session. **Open it and add any personal details you want Claude to always know** (background, preferences, communication style, etc.). Either copy is fine to edit — the installer keeps them in sync on next run.

---

## Step 4 — Install Cowork Plugins (Manual, ~5 minutes)

Plugins are published by Anthropic and must be installed through the Cowork interface. They cannot be transferred as files. **This step is Cowork-only — Claude Code CLI does not use these plugins.**

1. Open the **Claude desktop app** and enter a Cowork session.
2. Click **Customize** (top-right gear/settings icon).
3. Select **Personal plugins → +** (the plus icon at the top of the left panel).
4. Search for and install each of the following:

| Plugin | What It Provides |
|---|---|
| **Pdf viewer** | Interactive PDF viewing, annotation, form-filling, and signing |
| **Productivity** | Task management, daily planning, and workspace memory |
| **Design** | Design critique, UX copy, accessibility audits, dev handoff specs |
| **Cowork Plugin Management** | Tools for customizing and creating new plugins |

These are all free Anthropic-published plugins available directly in the marketplace.

---

## Step 5 — Connect Connectors (Manual, OAuth)

Connectors require you to authenticate with your own accounts. Conrad's credentials cannot be transferred. **Cowork-only step.**

In **Customize → Connectors → +**, connect the following:

### Web Connectors
- **Canva** — Sign in with your Canva account. Once connected, Claude can browse, summarize, and generate Canva designs.
- **Google Calendar** — Sign in with your Google account. Claude can read your calendar, suggest times, and create events.

### Desktop Connectors (Already Included)
The following desktop connectors come built into Cowork and require no installation:
- **Claude in Chrome** — Browsing agent (enable in Settings → Desktop app)
- **pdf-viewer** — Installed with the Pdf viewer plugin above
- **PowerPoint (By Anthropic)** — Available by default
- **Word (By Anthropic)** — Available by default

---

## Step 6 — Restart Claude

Quit and reopen the Claude desktop app. All skills will be active immediately. You can verify by typing `/lowi-brand-guidelines` or `/lowi-business-model` in any Cowork session — Claude should recognize and load them.

For the CLI side, the next `claude` session you start in any folder will pick up the skills and your `CLAUDE.md` automatically. Try it:

```bash
cd ~/Desktop
claude
```

…then type `/lowi-business-model` to confirm the skill loads.

---

## Customizing Your Personal Context

Your `CLAUDE.md` file contains your role, the LOWI messaging guardrails, and key team members. Conrad's version also includes personal background (flying, locations, etc.). If you want Claude to know similar things about you — travel schedule, communication preferences, areas of focus — add them directly to `CLAUDE.md`. Claude reads this file at the start of every session.

To edit (either copy works — both load the same content after install):

```bash
open -a TextEdit ~/Library/"Application Support"/Claude/CLAUDE.md
# or, for the CLI copy:
open -a TextEdit ~/.claude/CLAUDE.md
```

---

## Cowork vs. Claude Code CLI — When to Use Which

| Task | Use |
|---|---|
| Reviewing a PDF visually, dragging in a Canva file, having Claude open Word/PowerPoint | **Cowork** |
| Editing a folder full of files on your laptop, running long jobs, scripting, anything terminal-y | **Claude Code CLI** |
| Launching jobs on Gerty (the LOWI remote server) | **Claude Code CLI** (using the `gerty-2021-1` skill) |

Both interfaces share the same skills and CLAUDE.md after Step 3, so you can move between them freely.

---

## Questions

Contact Conrad or ask Claude directly — once your setup is complete, typing "help me understand my Cowork setup" in a session will walk you through everything that's installed.
