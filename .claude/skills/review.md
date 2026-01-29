# Review Skill

Launch the code-reviewer agent for quality checks.

## Usage

```
/review [optional: specific files]
```

## What this does

Spawns the code-reviewer agent to:
- Review code quality
- Check security patterns
- Verify best practices
- Ensure maintainability

## Implementation

```yaml
type: agent
agent: code-reviewer
autorun: true
```
