# The Scuguk Desk: answers questions about the project through Doorbell (project `scuguk`).
# Run by the shared ~/.claude/agentloop/Desk.ps1, which supplies everything a Desk has in common (see DeskDefaults.ps1). Only what
# differs from that goes here. The prompts are the shared ones (~/.claude/agentloop/desk-prompts); what is particular to this
# project is prompts\about.md.
$Cfg = @{
  ProjectKey    = 'scuguk'
  DefaultBranch = 'master'
}