# Duplicate Sources Report
**Generated:** 2025-12-11
**Total Authors Checked:** 107
**Authors with Duplicates:** 32

## Summary

This report identifies authors in the database who have duplicate source entries. Each duplicate has been verified to have identical titles, URLs, types, and years.

## Critical Issues

### Joy Buolamwini
**Duplicates Found:** 2
**Total Sources:** 5

1. **MIT Media Lab** (appears 2x)
   - Type: Research
   - Year: 2024
   - URL: https://www.media.mit.edu/people/joyab/overview/

2. **Unmasking AI: My Mission to Protect What Is Human in a World of Machines** (appears 2x)
   - Type: Book
   - Year: 2023
   - URL: https://www.penguinrandomhouse.com/books/645999/unmasking-ai-by-joy-buolamwini-phd/

**Recommended Action:** Remove one duplicate of each and add 2 new credible sources such as:
- Algorithmic Justice League (Organization)
- TED Talk: How I'm fighting bias in algorithms
- Academic publications

## All Authors with Duplicate Sources

### High Profile Authors (Priority)

1. **Gary Marcus** - 5 sources total
   - Duplicate: Marcus on AI (Substack)
   - Duplicate: Rebooting AI: Building Artificial Intelligence We Can Trust

2. **Vinod Khosla** - 5 sources total
   - Duplicate: Khosla Ventures
   - Duplicate: Vinod Khosla on Twitter/X

3. **Leopold Aschenbrenner** - 5 sources total
   - Duplicate: Situational Awareness: The Decade Ahead
   - Duplicate: Leopold Aschenbrenner on Twitter/X

4. **Martin Casado** - 5 sources total
   - Duplicate: Andreessen Horowitz
   - Duplicate: a16z AI Research

5. **Sarah Guo** - 5 sources total
   - Duplicate: Conviction - Founder & Managing Partner
   - Duplicate: Conviction Blog

### Technology Leaders

6. **Bret Taylor** - 5 sources total
   - Duplicate: Sierra - Co-founder & CEO
   - Duplicate: Bret Taylor on Twitter/X

7. **Ali Ghodsi** - 7 sources total
   - Duplicate: Databricks - Co-founder & CEO
   - Duplicate: Databricks YouTube Channel
   - Duplicate: Databricks Blog - Ali Ghodsi

8. **Werner Vogels** - 5 sources total
   - Duplicate: All Things Distributed (Personal Blog)
   - Duplicate: Amazon Web Services - CTO

9. **Linus Torvalds** - 5 sources total
   - Duplicate: GitHub - Linux Kernel
   - Duplicate: Linux Foundation

10. **Charity Majors** - 5 sources total
    - Duplicate: Honeycomb - Co-founder & CTO
    - Duplicate: Charity.wtf Blog

### Research & Academia

11. **Divya Siddarth** - 6 sources total
    - Duplicate: Collective Intelligence Project
    - Duplicate: RadicalxChange Foundation
    - Duplicate: Divya Siddarth on Twitter/X

12. **Subbarao Kambhampati** - 5 sources total
    - Duplicate: Arizona State University
    - Duplicate: Research Papers on arXiv

13. **Seth Lazar** - 6 sources total
    - Duplicate: Seth Lazar Personal Site
    - Duplicate: Australian National University
    - Duplicate: Research Papers on arXiv

14. **Carl Benedikt Frey** - 5 sources total
    - Duplicate: Oxford Martin School
    - Duplicate: The Technology Trap: Capital, Labor, and Power in the Age of Automation

15. **Kenneth Stanley** - 5 sources total
    - Duplicate: Why Greatness Cannot Be Planned
    - Duplicate: UCF Computer Science

16. **Avi Goldfarb** - 5 sources total
    - Duplicate: Rotman School of Management
    - Duplicate: Prediction Machines: The Simple Economics of AI

17. **Sasha Luccioni** - 5 sources total
    - Duplicate: Hugging Face - Climate Lead
    - Duplicate: Google Scholar - Sasha Luccioni

### Policy & Regulation

18. **Margrethe Vestager** - 5 sources total
    - Duplicate: European Commission - Executive VP
    - Duplicate: EU Digital Strategy

19. **Amba Kak** - 5 sources total
    - Duplicate: AI Now Institute - Director
    - Duplicate: Amba Kak on Twitter/X

20. **Janet Haven** - 5 sources total
    - Duplicate: Data & Society Research Institute
    - Duplicate: Janet Haven on Twitter/X

21. **Elizabeth Kelly** - 5 sources total
    - Duplicate: NIST AI Risk Management Framework
    - Duplicate: NIST AI Program

### Investment & Business

22. **David Cahn** - 5 sources total
    - Duplicate: Sequoia Capital
    - Duplicate: Sequoia AI Reports

23. **Byron Deeter** - 6 sources total
    - Duplicate: Bessemer Venture Partners
    - Duplicate: State of the Cloud Report
    - Duplicate: Byron Deeter on Twitter/X

24. **Jim Covello** - 5 sources total
    - Duplicate: Goldman Sachs Research
    - Duplicate: Goldman Sachs AI Research

25. **Satyen Sangani** - 5 sources total
    - Duplicate: Alation - Co-founder & CEO
    - Duplicate: Alation Blog - Satyen Sangani

26. **Rita Sallam** - 5 sources total
    - Duplicate: Gartner - VP Analyst
    - Duplicate: Gartner AI Research

### Content Creators & Analysts

27. **David Shapiro** - 6 sources total
    - Duplicate: David Shapiro YouTube Channel
    - Duplicate: David Shapiro GitHub
    - Duplicate: David Shapiro Resources

28. **Shawn "swyx" Wang** - 5 sources total
    - Duplicate: Latent Space Podcast
    - Duplicate: swyx.io Blog

29. **Zvi Mowshowitz** - 5 sources total
    - Duplicate: Don't Worry About the Vase (Substack)
    - Duplicate: LessWrong - Zvi

30. **Ed Zitron** - 5 sources total
    - Duplicate: Where's Your Ed At (Newsletter)
    - Duplicate: Ed Zitron's Substack

31. **Simon Willison** - 5 sources total
    - Duplicate: Simon Willison's Weblog
    - Duplicate: Simon Willison GitHub

## Recommended Actions

### Immediate (High Priority)
1. **Remove all duplicate entries** - This is data corruption that should be fixed
2. **For Joy Buolamwini specifically**, replace duplicates with:
   - Algorithmic Justice League website
   - TED Talk on bias in algorithms
   - Academic publications or recent interviews

### Short Term
1. Create a database constraint to prevent duplicate source entries
2. Run a cleanup script to deduplicate all 32 authors
3. Review and add diverse source types for each author

### Long Term
1. Implement source validation in the admin interface
2. Add data quality checks in the import process
3. Regular audits of source data

## Script for Cleanup

The analysis script is available at:
`scripts/analyze_duplicate_sources.mjs`

To check for duplicates again in the future:
```bash
node --env-file=.env.local scripts/analyze_duplicate_sources.mjs
```
