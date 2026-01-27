# Module README Template

Use this template when creating README files for major modules (components, lib, app sections, etc.).

---

# [Module Name]

[Brief one-sentence description of what this module does]

## Purpose

[1-2 paragraphs explaining the purpose and scope of this module. What problems does it solve? What is it responsible for?]

## Key Exports/Components

### [Component/Function Name 1]

**Location:** `path/to/file.ts`

**Purpose:** [Brief description]

**Usage:**
```typescript
// Example usage
import { Something } from './path'

const example = <Something prop="value" />
```

**Props/Parameters:**
- `param1` (type): Description
- `param2` (type): Description

**Related:**
- See [ADR-NNNN](../../adr/NNNN-title.md) for architectural context
- See [OtherComponent](#othercomponent) for related functionality

### [Component/Function Name 2]

[Repeat structure for other major exports]

## Directory Structure

```
module-name/
├── ComponentA.tsx       # Description
├── ComponentB.tsx       # Description
├── utils/              # Helper utilities
│   └── helpers.ts
├── types.ts            # TypeScript definitions
├── index.ts            # Public exports
└── README.md           # This file
```

## Common Patterns

### Pattern 1: [Name]

[Explain a common pattern used in this module]

```typescript
// Example code demonstrating the pattern
```

**When to use:** [Guidance on when this pattern applies]

**Example:** See `ComponentX.tsx:45` for a real-world example

### Pattern 2: [Name]

[Additional patterns as needed]

## Usage Guidelines

### Do's ✅

- [Guideline 1: e.g., "Always memoize expensive computations with useMemo"]
- [Guideline 2: e.g., "Use TypeScript interfaces from types.ts"]
- [Guideline 3: e.g., "Follow the naming convention ComponentName.tsx"]

### Don'ts ❌

- [Anti-pattern 1: e.g., "Don't import from internal utils directly"]
- [Anti-pattern 2: e.g., "Avoid inline styles, use Tailwind classes"]

## Testing

### Running Tests

```bash
npm test path/to/module
```

### Test Strategy

[Explain the testing approach for this module]

- **Unit tests:** [What's covered]
- **Integration tests:** [What's covered]
- **E2E tests:** [What's covered, if applicable]

### Example Test

```typescript
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  it('should do something', () => {
    // Test example
  })
})
```

## Dependencies

### Internal Dependencies

- `../other-module` - [Why this dependency exists]
- `../../lib/utils` - [Why this dependency exists]

### External Dependencies

- `react` - [Why needed]
- `some-library` - [Why needed]

## Performance Considerations

[If applicable, document performance considerations]

- [Consideration 1: e.g., "Large lists use virtualization"]
- [Consideration 2: e.g., "Components are lazy-loaded"]

## Accessibility

[If applicable, document accessibility features]

- [Feature 1: e.g., "All components support keyboard navigation"]
- [Feature 2: e.g., "ARIA labels provided for screen readers"]

## Migration Guide

[If this module replaces an older approach, explain migration]

### Migrating from [Old Approach]

1. [Step 1]
2. [Step 2]
3. [Step 3]

## Related Documentation

- [ADR-NNNN: Relevant Architectural Decision](../../adr/NNNN-title.md)
- [Related Module Documentation](../other-module/README.md)
- [External Documentation](https://example.com)

## FAQ

### [Common Question 1]?

[Answer]

### [Common Question 2]?

[Answer]

## Maintenance

**Last Updated:** YYYY-MM-DD

**Maintainer:** [Team or person responsible]

**Known Issues:**
- [Issue 1 with link to GitHub issue]
- [Issue 2 with link to GitHub issue]

---

## Notes for Using This Template

When creating a module README:

1. Copy this template to the module directory
2. Remove sections that don't apply (e.g., if no accessibility features, remove that section)
3. Keep it concise - link to ADRs for architectural details
4. Update as the module evolves
5. Include concrete examples over abstract descriptions
6. Remove this "Notes for Using This Template" section
