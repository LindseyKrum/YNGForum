#!/usr/bin/env bash
# ============================================================
# LOWI Claude Setup — Installer
# Run this script once after receiving the lowi-claude-setup
# directory. It copies skills and your personal context file
# into the correct directories for BOTH Cowork (Claude desktop)
# and the Claude Code CLI.
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Cowork (Claude desktop app) paths
COWORK_BASE="$HOME/Library/Application Support/Claude"
COWORK_SKILLS="$COWORK_BASE/.claude/skills"
COWORK_CLAUDE_MD="$COWORK_BASE/CLAUDE.md"

# Claude Code CLI paths
CLI_BASE="$HOME/.claude"
CLI_SKILLS="$CLI_BASE/skills"
CLI_CLAUDE_MD="$CLI_BASE/CLAUDE.md"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   LOWI Claude Setup Installer                ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ── 1. Verify we're on macOS ─────────────────────────────────
if [[ "$(uname)" != "Darwin" ]]; then
  echo "ERROR: This installer is designed for macOS only."
  exit 1
fi

# ── 2. Verify at least one Claude environment is present ─────
COWORK_PRESENT=0
CLI_PRESENT=0

if [[ -d "$COWORK_BASE" ]]; then
  COWORK_PRESENT=1
fi

if command -v claude >/dev/null 2>&1 || [[ -x "$HOME/.local/bin/claude" ]]; then
  CLI_PRESENT=1
fi

if [[ $COWORK_PRESENT -eq 0 && $CLI_PRESENT -eq 0 ]]; then
  echo "ERROR: Neither the Claude desktop app nor the Claude Code CLI was detected."
  echo "       Install at least one before re-running this installer:"
  echo "         • Claude desktop app: https://claude.ai/download"
  echo "         • Claude Code CLI:    curl -fsSL https://claude.ai/install.sh | bash"
  exit 1
fi

if [[ $COWORK_PRESENT -eq 1 ]]; then
  echo "✓ Detected Cowork (Claude desktop app)"
fi
if [[ $CLI_PRESENT -eq 1 ]]; then
  echo "✓ Detected Claude Code CLI"
else
  echo "⚠ Claude Code CLI not detected — skills will still be staged at"
  echo "    $CLI_SKILLS"
  echo "  so they activate the moment you install the CLI."
fi
echo ""

# ── 3. Install skills (to both Cowork and CLI) ───────────────
SKILLS=(
  "lowi-brand-guidelines"
  "lowi-business-model"
  "lowi-deep-academic-research"
  "lowi-rfi-rfp-response"
  "gerty-2021-1"
  "lisl"
  "skill-creator"
)

install_skills_to() {
  local label="$1"
  local dest_root="$2"
  echo "Installing skills → $label"
  echo "  $dest_root"
  mkdir -p "$dest_root"
  for skill in "${SKILLS[@]}"; do
    local src="$SCRIPT_DIR/skills/$skill"
    local dest="$dest_root/$skill"
    if [[ -d "$src" ]]; then
      if [[ -d "$dest" ]]; then
        echo "  ↻  Updating: $skill"
        rm -rf "$dest"
      else
        echo "  +  Installing: $skill"
      fi
      cp -r "$src" "$dest"
      chmod -R u+rw "$dest"
    else
      echo "  ✗  Skipping (not found in package): $skill"
    fi
  done
  echo ""
}

install_skills_to "Cowork" "$COWORK_SKILLS"
install_skills_to "Claude Code CLI" "$CLI_SKILLS"

# ── 4. Install CLAUDE.md (personal context) to both ──────────
install_claude_md_to() {
  local label="$1"
  local dest="$2"
  local dest_dir
  dest_dir="$(dirname "$dest")"
  mkdir -p "$dest_dir"
  if [[ -f "$dest" ]]; then
    local backup="${dest}.backup.$(date +%Y%m%d_%H%M%S)"
    echo "  ↻  $label: backing up existing CLAUDE.md to:"
    echo "      $backup"
    cp "$dest" "$backup"
  else
    echo "  +  $label: installing CLAUDE.md"
  fi
  cp "$SCRIPT_DIR/CLAUDE.md" "$dest"
  echo "      $dest"
}

echo "Installing personal context file (CLAUDE.md):"
install_claude_md_to "Cowork " "$COWORK_CLAUDE_MD"
install_claude_md_to "CLI    " "$CLI_CLAUDE_MD"
echo ""
echo "(You can edit either copy at any time — re-run the installer to re-sync.)"

# ── 5. Python prerequisite check ─────────────────────────────
echo ""
echo "Checking Python document-processing packages..."
if command -v python3 >/dev/null 2>&1; then
  MISSING=()
  for mod in docx openpyxl pptx pdfplumber pypdf PIL pandas; do
    if ! python3 -c "import $mod" 2>/dev/null; then
      MISSING+=("$mod")
    fi
  done
  if [[ ${#MISSING[@]} -eq 0 ]]; then
    echo "  ✓ All document-processing packages present."
  else
    echo "  ⚠ Missing Python packages: ${MISSING[*]}"
    echo "    Run this to install them (see README Step 2 for the full list):"
    echo ""
    echo "      pip3 install --user python-docx openpyxl python-pptx pandas xlsxwriter \\"
    echo "        pdfplumber pypdf PyMuPDF pillow reportlab \\"
    echo "        requests beautifulsoup4 lxml"
    echo ""
  fi
else
  echo "  ⚠ python3 not found. macOS ships with it at /usr/bin/python3 —"
  echo "    if it's missing, install Xcode Command Line Tools: xcode-select --install"
fi

# ── 6. Done ──────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   Installation complete.                     ║"
echo "║   Restart Claude desktop to apply changes.   ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "Next steps (manual — see README.md):"
echo "  1. Install Cowork plugins from the plugin marketplace"
echo "     (Pdf viewer, Productivity, Design, Cowork Plugin Management)"
echo "  2. Connect Canva and Google Calendar in Customize > Connectors"
echo "  3. (Optional) Open a terminal and run \`claude\` in any folder"
echo "     to verify the CLI side picks up the skills."
echo ""
