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

    # The daily steering run (claude-config #16); the ready feed also starts it early when its queue runs dry.
    @{ Task = 'Scuguk-Steer'; Kind = 'steer'; Daily = '07:20'; StartWhenAvailable = $true; TimeLimit = 'PT45M'
       Arguments = '"{agentloop}\run-hidden.vbs" "{agentloop}\steer\Steer.ps1" -Repo "{repo}"'
       Requires = @('Goals', 'Definition of done', 'Verify', 'Deploy', 'People') }

    # The finish pass (claude-config #17): the definition of done over what reached master, overnight.
    @{ Task = 'Scuguk-Finish'; Kind = 'finish'; Daily = '01:00'; StartWhenAvailable = $true; TimeLimit = 'PT90M'
       Arguments = '"{agentloop}\run-hidden.vbs" "{agentloop}\finish\Finish.ps1" -Repo "{repo}"'
       Requires = @('Definition of done') }
  )
}
