# Optimize Skill

Launch the performance-optimizer agent.

## Usage

```
/optimize [file or feature]
```

## What this does

Spawns the performance-optimizer agent to:
- Analyze bottlenecks
- Optimize slow code
- Improve bundle size
- Fix N+1 queries

## Implementation

```yaml
type: agent
agent: performance-optimizer
autorun: true
```
