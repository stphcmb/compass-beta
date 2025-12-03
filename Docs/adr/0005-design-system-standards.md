# ADR 0005 – Design System Standards for Compass

## Status
**Accepted**

## Context

As Compass grows, we needed to establish consistent UI/UX design standards to ensure:
- Consistent user experience across all features
- Efficient development (reusable patterns)
- Accessibility compliance (WCAG 2.1 AA)
- Performance optimization
- Mobile-first responsive design
- Clear guidelines for future contributors

Without a design system, decisions would be made ad-hoc, leading to:
- Inconsistent UI patterns
- Accessibility issues
- Performance problems
- Difficult maintenance
- Slower feature development

## Decision

Establish a **comprehensive design system** documented in `UI_UX_DESIGN_GUIDE.md` with:

### 1. Visual Design Principles
- **Color palette**: 5 domain colors + primary/neutral/status colors
- **Typography**: System font stack, 4-level heading scale, 1.6 line height for readability
- **Spacing**: 8px base unit system (xs to 3xl)
- **Visual hierarchy**: Primary/secondary/tertiary element distinction

### 2. Component Standards
- **SearchBar**: Autofocus, clear button, loading states
- **CampAccordion**: Expand/collapse, camp filtering, keyboard support
- **AuthorCard**: Consistent layout, hover states, touch-friendly
- **WhiteSpacePanel**: Desktop-only notes panel

### 3. Accessibility Requirements
- **WCAG 2.1 AA compliance**: Minimum 4.5:1 text contrast
- **Semantic HTML**: Proper landmarks, headings, ARIA labels
- **Keyboard navigation**: All interactive elements accessible via keyboard
- **Screen reader support**: Meaningful labels and status updates

### 4. Responsive Design
- **Mobile-first approach**: Design for 320px up
- **Breakpoints**: 768px (tablet), 1024px (desktop), 1280px (large)
- **Touch targets**: Minimum 44x44px for interactive elements
- **Fluid layouts**: Relative units (rem, %) instead of fixed pixels

### 5. Performance Standards
- **Core Web Vitals targets**:
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1
- **Bundle size**: < 200KB gzipped
- **Image optimization**: Next.js Image, WebP format, lazy loading

## Consequences

### Positive

✅ **Consistency**: All features follow same design language
✅ **Accessibility**: WCAG 2.1 AA compliance ensures inclusive design
✅ **Development speed**: Reusable patterns accelerate feature development
✅ **Quality**: Clear standards prevent common UI/UX mistakes
✅ **Maintainability**: Easy to update across entire app
✅ **Performance**: Built-in performance requirements
✅ **Collaboration**: Clear guidelines for multiple contributors
✅ **User experience**: Predictable, learnable interface

### Negative / Tradeoffs

⚠️ **Initial overhead**: Time spent documenting vs building features
⚠️ **Learning curve**: New contributors must learn the system
⚠️ **Rigidity**: May feel constrained by standards in edge cases
⚠️ **Maintenance**: Design system itself needs updates

### Mitigation

- **For overhead**: Design system pays off quickly through faster development
- **For learning curve**: Comprehensive documentation with examples
- **For rigidity**: Allow exceptions with documented rationale (new ADR)
- **For maintenance**: Quarterly review process established

## Alternatives Considered

### Alternative A: No Formal Design System
**Approach**: Make design decisions case-by-case

**Why rejected**:
- Leads to inconsistency
- Accessibility often overlooked
- Harder to onboard contributors
- Technical debt accumulates
- Slower development over time

### Alternative B: Adopt Existing Design System (Material UI, Chakra)
**Approach**: Use pre-built component library

**Why rejected**:
- Generic look and feel (not unique to Compass)
- Larger bundle size
- Less control over accessibility/performance
- Tailwind + custom components is faster for our needs
- Overengineered for current scope

### Alternative C: Minimal Style Guide Only
**Approach**: Document colors/typography only, no component standards

**Why rejected**:
- Insufficient for accessibility compliance
- No interaction patterns documented
- No performance standards
- Component behavior inconsistent
- Missing responsive design guidelines

### Alternative D: Design-First Tools (Figma Component Library)
**Approach**: Build in Figma first, document separately

**Why rejected**:
- Solo developer workflow (faster to code directly)
- Keeping Figma + docs in sync is overhead
- Code is source of truth (Next.js + Tailwind)
- Can add Figma later if team grows

## Implementation Notes

### File Organization

```
Docs/specs/
  └── UI_UX_DESIGN_GUIDE.md      # Comprehensive guide

styles/
  └── tokens.css                 # Design tokens (to create)

components/
  ├── SearchBar.tsx              # Follows standards
  ├── CampAccordion.tsx          # Follows standards
  ├── AuthorCard.tsx             # Follows standards
  └── WhiteSpacePanel.tsx        # Follows standards
```

### Design Tokens

Create `styles/tokens.css` with all standard values:

```css
:root {
  /* Colors */
  --color-primary: #2563eb;
  --color-text-primary: #111827;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  /* ... */

  /* Typography */
  --font-size-base: 1rem;
  --line-height-base: 1.6;
  /* ... */
}
```

### Component Documentation

Each component should document:
- Purpose
- Props interface
- States (default, hover, focus, loading, error)
- Accessibility requirements
- Responsive behavior
- Usage examples

### Testing Requirements

All components must pass:
- [ ] WCAG 2.1 AA contrast ratios (axe DevTools)
- [ ] Keyboard navigation (manual test)
- [ ] Screen reader compatibility (VoiceOver/NVDA)
- [ ] Mobile responsiveness (320px-1920px)
- [ ] Performance budgets (Lighthouse)

### Review Process

**Before implementing new components**:
1. Check if existing component can be used
2. Design follows established patterns
3. Meets accessibility requirements
4. Passes performance budgets
5. Document in design guide if new pattern

**Quarterly design system review**:
1. Analyze usage analytics
2. Review accessibility audits
3. Check performance metrics
4. Update standards based on learnings
5. Communicate changes to team

## Related Decisions

- ADR 0003: Use Next.js + Vercel (enables SSR, Image optimization)
- ADR 0004: Author Deduplication (UX decision informed by design standards)

## Future Enhancements

### Short Term
- Create `styles/tokens.css` with all design tokens
- Add Storybook for component documentation
- Set up automated accessibility testing (jest-axe)

### Medium Term
- Build component library with documented states
- Add visual regression testing (Chromatic)
- Implement design system versioning

### Long Term
- Consider Figma component library (if team grows)
- Build design system microsite
- Create interactive component playground

## Date
Decided: December 2, 2024
Documented: December 2, 2024

## References
- [Compass Design System](../specs/COMPASS_DESIGN_SYSTEM.md) - Complete unified design system
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Next.js Image Optimization](https://nextjs.org/docs/api-reference/next/image)
- [Web.dev Accessibility](https://web.dev/accessible/)
- [Swiss Design Principles](https://www.smashingmagazine.com/2009/07/lessons-from-swiss-style-graphic-design/)
- [Japanese Minimalism in Web Design](https://www.toptal.com/designers/ui/minimalist-web-design)
