---
name: gerty-2021-1
description: Operational recipe for launching headless Claude Code sessions on Gerty 2021 (SSH alias `gerty`, the always-on remote server, user `claude.lowi.ai`, Tailscale 100.83.12.83). Use when starting, monitoring, or attaching to long-running tmux Claude jobs on the remote server, or when hitting the macOS keychain "Not logged in" error under SSH (solved with `--bare` + `--mcp-config`). Covers SSH connection, launch.sh + mcp-config.json templates, tmux conventions, and the already-configured auto-permission settings.
---

# Gerty 2021 — headless Claude Code launch recipe

Recipe card. Verified end-to-end 2026-04-27 with Claude Code v2.1.119.

## SSH connection

Already aliased on Gerty 2026 in `~/.ssh/config`:

```
Host gerty
    HostName 100.83.12.83
    User claude.lowi.ai
    IdentityFile ~/.ssh/id_ed25519_gerty
    StrictHostKeyChecking no
```

- Non-interactive: `ssh gerty '<command>'`
- Interactive (with TTY, for `tmux attach`): `ssh -t gerty '<command>'`
- Force interactive zsh (loads `~/.zshrc`, where `ANTHROPIC_API_KEY` is set): wrap in `zsh -i -c "..."`. Required for any command that depends on PATH or env from `.zshrc`, since non-interactive SSH skips it.

## Why `--bare` is required

Default `claude` startup on Gerty 2021 under SSH shows "Welcome back Conrad" but rejects messages with "Not logged in · Please run /login". Cause: the macOS keychain is locked under headless SSH (no GUI session), so OAuth credentials can't be read. `--bare` skips the keychain entirely and uses `ANTHROPIC_API_KEY` directly.

Side effects of `--bare`: skips hooks, LSP, plugin sync, auto-memory, `CLAUDE.md` auto-discovery, and built-in tools other than Bash/Edit/Read. **WebSearch and WebFetch are NOT available** — use Tavily MCP for web access. Persistent MCP registrations from `~/.claude.json` do NOT load under `--bare` either — pass `--mcp-config <path>` explicitly.

## Pre-flight (one-shot from Gerty 2026)

```bash
ssh gerty 'echo "user: $(whoami)"; ~/.npm-global/bin/claude --version; /opt/homebrew/bin/tmux ls 2>&1 | head -10'
```

Expect: `user: claude.lowi.ai`, claude version, tmux session list (or "no server running").

## Canonical launch recipe

Each long-running job lives in its own work directory under `~/lowi-work/<task-name>/` on Gerty 2021. Inside it:

1. **`mcp-config.json`** — canonical content (Tavily; add AgentMail or memory if needed for the task):

   ```json
   {
     "mcpServers": {
       "tavily": {
         "command": "npx",
         "args": ["-y", "tavily-mcp@latest"],
         "env": {
           "TAVILY_API_KEY": "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"
         }
       }
     }
   }
   ```

2. **`kickoff_prompt.md`** — full task prompt as a single file.

3. **`launch.sh`** (chmod +x) — picks up `ANTHROPIC_API_KEY` via `#!/bin/zsh -i`:

   ```bash
   #!/bin/zsh -i
   cd ~/lowi-work/<task-name> || exit 1
   PROMPT="$(cat ~/lowi-work/<task-name>/kickoff_prompt.md)"
   exec claude \
       --bare \
       --mcp-config ~/lowi-work/<task-name>/mcp-config.json \
       --dangerously-skip-permissions \
       --add-dir ~/lowi-work/<task-name> \
       --name <task-name> \
       --model opus \
       --effort xhigh \
       --append-system-prompt "Running --bare on Gerty. Tools: Bash, Edit, Read, tavily_*. No Write — use bash heredocs (cat > f <<'EOF'). No WebSearch/WebFetch — use tavily_search/tavily_extract. Today is $(date +%Y-%m-%d)." \
       "$PROMPT"
   ```

4. **Launch in detached tmux** (no TTY needed):

   ```bash
   ssh gerty '/opt/homebrew/bin/tmux new-session -d -s <task-name> -x 220 -y 50 \
     -c ~/lowi-work/<task-name> "~/lowi-work/<task-name>/launch.sh 2>&1 | tee logs/run.log"'
   ```

   Always use full path `/opt/homebrew/bin/tmux` from non-interactive SSH (not on default PATH). `-x 220 -y 50` prevents UI wrap.

## tmux session conventions

- **Session names** are short kebab-case task IDs that match the work directory (`dubrovnik-tps`, `merlin-pass-14`). One session per task.
- **List sessions:** `ssh gerty '/opt/homebrew/bin/tmux ls'`
- **Check before creating:** if `tmux ls` already shows a session with your target name, decide deliberately — kill the old one (`tmux kill-session -t NAME`) or pick a new name. Don't silently clobber.
- **Capture without attaching** (preferred for monitoring):
  ```bash
  ssh gerty '/opt/homebrew/bin/tmux capture-pane -t <task-name> -p | tail -40'
  ```
- **Attach interactively from Gerty 2026** (detach with `Ctrl+b d`):
  ```bash
  ssh -t gerty '/opt/homebrew/bin/tmux attach -t <task-name>'
  ```
- **Send a follow-up prompt to a live session:**
  ```bash
  ssh gerty '/opt/homebrew/bin/tmux load-buffer -t <task-name> /tmp/prompt.txt && \
             /opt/homebrew/bin/tmux paste-buffer -t <task-name>'
  ssh gerty '/opt/homebrew/bin/tmux send-keys -t <task-name> Enter'
  ```
- **Tear down when done:** `ssh gerty '/opt/homebrew/bin/tmux kill-session -t <task-name>'`

## Why unattended runs don't hang

Gerty 2021's `~/.claude/settings.json` is already configured for unattended use:

```json
{
  "env": { "TAVILY_API_KEY": "..." },
  "permissions": { "defaultMode": "auto" },
  "skipAutoPermissionPrompt": true,
  "skipDangerousModePermissionPrompt": true
}
```

Combined with `--dangerously-skip-permissions` in `launch.sh`, no permission prompt ever blocks. Do **not** narrow these — Conrad has explicitly reaffirmed the broad posture (the whole point of Gerty 2021 is unattended remote execution).

## Verifying a launch worked

After kicking off, capture the pane and confirm the response is task work, not auth failure:

```bash
ssh gerty '/opt/homebrew/bin/tmux capture-pane -t <task-name> -p | tail -40'
```

- ✅ `⏺ Reading N files…` or normal task output → running.
- ❌ `Not logged in · Please run /login` → `--bare` flag missing or `ANTHROPIC_API_KEY` not loaded (check that `launch.sh` shebang is `#!/bin/zsh -i`).
- ❌ `command not found: claude` → use full path `~/.npm-global/bin/claude` or wrap in `zsh -i -c "..."`.

## Quick smoke test

To confirm the recipe still works end-to-end (one-shot, prints and exits):

```bash
ssh gerty '/opt/homebrew/bin/tmux new-session -d -s smoke -x 220 -y 50 \
  "zsh -i -c \"~/.npm-global/bin/claude --bare -p \\\"Reply with the literal token VERIFIED.\\\" 2>&1 | tee /tmp/smoke.log; sleep 5\""'
sleep 25
ssh gerty 'cat /tmp/smoke.log; /opt/homebrew/bin/tmux kill-session -t smoke 2>/dev/null'
```

Expect `VERIFIED` in the log. Verified working 2026-04-27.

## Reference paths on Gerty 2021

| Thing | Path |
|---|---|
| User | `claude.lowi.ai` |
| Claude Code CLI | `~/.npm-global/bin/claude` (symlink to `claude.exe`) |
| tmux | `/opt/homebrew/bin/tmux` |
| Settings | `~/.claude/settings.json` |
| Persistent MCP registrations (interactive only) | `~/.claude.json` |
| Working dirs for headless jobs | `~/lowi-work/<task-name>/` |
| Shell init (sets `ANTHROPIC_API_KEY`, PATH) | `~/.zshrc` |
