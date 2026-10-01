# Scuguk's scheduled jobs. ~/.claude/agentloop/Install-Loops.ps1 reads this from origin/master and makes Task Scheduler match it
# (portfolio loops, claude-config #13). Change a job here, push, and run
#   pwsh ~/.claude/agentloop/Install-Loops.ps1 -Project scuguk            # plan
#   pwsh ~/.claude/agentloop/Install-Loops.ps1 -Project scuguk -Action install
@{
  Project = 'scuguk'
  Jobs = @(
    @{ Task = 'Scuguk-Desk'; Kind = 'desk'; Arguments = '"{agentloop}\run-hidden.vbs" "{agentloop}\Desk.ps1" -Config "{repo}\.claude\agentloop\desk\config.ps1"'; Every = 'PT1M' }

    # The filing monitor (claude-config #17): what the Desk filed in 24 hours, checked after the fact.
    @{ Task = 'Scuguk-Filing'; Kind = 'monitor'; Daily = '04:45'; StartWhenAvailable = $true; TimeLimit = 'PT60M'
       Arguments = '"{agentloop}\run-hidden.vbs" "{agentloop}\monitor\Monitor.ps1" -Repo "{repo}"' }
  )
}
