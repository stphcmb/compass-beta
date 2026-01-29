# Debug Skill

Launch the debug-specialist agent for systematic debugging.

## Usage

```
/debug [optional error description]
```

## What this does

Spawns the debug-specialist agent to:
- Investigate runtime errors
- Analyze test failures
- Debug integration issues
- Trace performance problems

## Implementation

```yaml
type: agent
agent: debug-specialist
autorun: true
```
