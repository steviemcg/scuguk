# Scuguk's code loop, steering run and finish pass. Label an issue `agent` and the loop works it in its own
# worktree and lands it on master (New-ProjectLoops.ps1).
# Design and decisions: ~/.claude/agentloop/portfolio-loops.md; the whole system: ~/.claude/agentloop/README.md.
# Its Desk has its own config under desk/.
$AgentLoopLogDir = Join-Path $env:LOCALAPPDATA 'agentloop\scuguk-loop'
if (-not (Test-Path $AgentLoopLogDir)) { New-Item -ItemType Directory -Force $AgentLoopLogDir | Out-Null }
$Cfg = @{
  # --- GitHub ---
  Repo          = 'steviemcg/scuguk'
  Owner         = 'steviemcg'
  NamePrefix    = 'Scuguk'
  DefaultBranch = 'master'

  # --- paths (this machine) ---
  RepoRoot      = 'D:\scuguk'
  LogDir        = $AgentLoopLogDir
  PauseFlag     = (Join-Path $AgentLoopLogDir 'PAUSED')

  # --- labels ---
  AgentLabel    = 'agent'
  HoldLabel     = 'agent-hold'
  StatusLabel   = @{ InProgress = 'agent:active'; InReview = 'agent:review'; Rework = 'agent:rework'
                     Question = 'agent:question' }

  # --- whose turn it is, in pickup order ---
  # Rework first, so the loop finishes what it started, then new work. There is no Deployed (verify) turn until the
  # project's deploy is written down here and in AGENTS.md. The prompts are the shared ones in ~/.claude/agentloop/prompts;
  # the project's own rules go in AGENTS.md (`## Code turn: project rules`).
  AgentTurn     = [ordered]@{
    Rework   = @{ Prompt = 'turn.md'; RequireTag = $true }
    Ready    = @{ Prompt = 'turn.md'; RequireTag = $true }
  }
  PromptDir     = (Join-Path $HOME '.claude/agentloop/prompts')
  PromptVars    = @{ REPO = 'steviemcg/scuguk'; ENVIRONMENT = 'this machine' }
  ItemUrlFormat = 'https://github.com/steviemcg/scuguk/issues/{0}'
  WorktreeRoot  = 'D:\scuguk\.claude\worktrees'
  RestartLabel  = 'agent-restart'
  LookbackDays  = 30
  MergeLabel    = 'integrate:merge'
  PrLabel       = 'integrate:pr'
  MaxIntegrationPushRetries = 3

  # --- agent runtime and watcher ---
  AgentModel    = 'claude-opus-5-5'
  MaxTurns      = 60
  PollMinutes   = 5
  StaleMinutes  = 45
  MaxConsecutiveFailures = 3
  MaxConcurrentAgents    = 2
  UsageLimits   = @{ Enabled = $true }
  # The main checkout belongs to the loops (decided - Steve, 2026-09-30); keep it current.
  SelfUpdate    = @{ Enabled = $true; EverySeconds = 600 }
  RequiredEnv   = @()

  # --- which model works a turn (decided - Steve, 2026-09-29, grilling round 2: balance everywhere) ---
  AssignNewTo   = 'balance'
  CrossReview   = @{ Enabled = $true; TimeoutMinutes = 20; MaxConcurrent = 2; ClaudeModel = 'claude-sonnet-5' }
  Runners       = @{
    codex = @{ Model = 'gpt-6-sol'; Effort = 'high'; MaxMinutes = 180; Preamble = 'runner-codex.md'
               GitAuthorName = 'Codex Agent'; GitAuthorEmail = 'codex-agent@noreply.mcgill.nl'
               Config = @('model_auto_compact_token_limit=150000') }
  }

  # --- the steering run's ready queue: the loop starts one item from it per tick while it has a free slot ---
  ReadyFeed     = @{ Enabled = $true; QueueFile = (Join-Path $AgentLoopLogDir 'steer\ready-queue.json')
                     MaxStartsPerTick = 1; MaxAgeHours = 36; AlsoTag = @('agent-self-tag')
                     RefillTask = 'Scuguk-Steer'; RefillMinHours = 3 }
  Steer         = @{ Model = 'claude-opus-5-5'; MaxTurns = 60; Effort = 'high' }
}