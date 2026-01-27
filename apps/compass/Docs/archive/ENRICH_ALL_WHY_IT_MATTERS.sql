-- STATUS: DEPRECATED - Contains placeholder IDs. Use ENRICH_ALL_WHY_IT_MATTERS_FINAL.sql
-- 
-- This file contains placeholder IDs and is superseded by the _FINAL version which has actual database UUIDs.
-- See data/enrichment/ENRICH_ALL_WHY_IT_MATTERS_FINAL.sql for the canonical version.
--
-- =====================================================
-- WHY IT MATTERS - Domain-Specific Context (All 91 Relationships)
-- =====================================================
-- This enriches all author-camp relationships with domain-specific
-- "why it matters" context that explains their significance in that
-- particular domain and camp.
-- =====================================================

-- =====================================================
-- HIGH PRIORITY: Multi-Domain Authors (9 authors, ~31 relationships)
-- =====================================================

-- -----------------------------------------------------
-- MARC ANDREESSEN (6 camps across 4 domains)
-- -----------------------------------------------------

-- AI Technical Capabilities → Needs New Approaches (Partial/Challenges scaling criticism)
UPDATE camp_authors
SET why_it_matters = 'As one of Silicon Valley''s most influential investors, Andreessen''s belief that scaling will deliver AGI represents the mainstream VC perspective funding most AI development. His pushback against "we need new approaches" narratives shapes billions in capital allocation toward scaling-focused labs.'
WHERE id = 'f8e6a8d0-8c9e-4f3a-9b5c-1d2e3f4a5b6c';

-- AI & Society → Democratize Fast (Strong agreement)
UPDATE camp_authors
SET why_it_matters = 'Andreessen champions unrestricted AI deployment and open-sourcing as essential for innovation. His "techno-optimist manifesto" directly opposes safety-first approaches, making him the most vocal advocate for rapid, decentralized AI proliferation in the tech industry.'
WHERE id = 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6';

-- AI & Society → Safety First (Challenges safety movement)
UPDATE camp_authors
SET why_it_matters = 'Andreessen publicly dismisses AI safety concerns as "moral panic" and regulatory capture attempts. His essay "Why AI Will Save the World" represents the strongest counter-narrative to x-risk focused safety research, influencing how tech leaders frame AI risks.'
WHERE id = 'b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7';

-- Enterprise AI Adoption → Technology Must Lead (Strong agreement)
UPDATE camp_authors
SET why_it_matters = 'Andreessen advocates that enterprises must adopt AI aggressively or face obsolescence. His venture capital firm a16z has invested billions based on this thesis, directly shaping which AI enterprise products get funded and which businesses pursue AI-first strategies.'
WHERE id = 'c3d4e5f6-g7h8-9i0j-1k2l-m3n4o5p6q7r8';

-- AI Governance → Innovation First (Strong agreement)
UPDATE camp_authors
SET why_it_matters = 'Andreessen is the most prominent voice in tech opposing AI regulation, framing it as stifling innovation and benefiting incumbents. His political influence and funding make him central to the deregulation wing of AI policy debates in Washington.'
WHERE id = 'd4e5f6g7-h8i9-0j1k-2l3m-n4o5p6q7r8s9';

-- AI Governance → Regulatory Interventionist (Challenges regulation)
UPDATE camp_authors
SET why_it_matters = 'Andreessen argues that AI regulation will create regulatory capture favoring big tech incumbents while crushing startups. This perspective directly counters regulatory interventionist arguments and is frequently cited by industry lobbyists opposing AI safety legislation.'
WHERE id = 'e5f6g7h8-i9j0-1k2l-3m4n-o5p6q7r8s9t0';

-- -----------------------------------------------------
-- EMILY M. BENDER (6 camps across 3 domains)
-- -----------------------------------------------------

-- AI Technical → Needs New Approaches (Strong agreement on limitations)
UPDATE camp_authors
SET why_it_matters = 'Bender''s "stochastic parrots" paper fundamentally challenged the scaling paradigm, arguing LLMs lack true understanding. As a computational linguist, her technical critique of language model limitations has become the academic foundation for skepticism about AGI-via-scaling.'
WHERE id = '8f7e6d5c-4b3a-2918-0706-f5e4d3c2b1a0';

-- AI Technical → Scaling Will Deliver (Challenges scaling optimism)
UPDATE camp_authors
SET why_it_matters = 'Bender challenges claims that scaling alone will achieve AGI, arguing it conflates performance with understanding. Her work provides the intellectual ammunition for researchers skeptical of massive compute investments, directly opposing the industry consensus on scaling laws.'
WHERE id = '9f8e7d6c-5b4a-3029-1817-g6f5e4d3c2b1';

-- AI & Society → Safety First (Strong on actual harms)
UPDATE camp_authors
SET why_it_matters = 'Bender redirects safety discourse from speculative x-risks to documented harms: bias, labor exploitation, environmental costs. Her focus on "here and now" harms challenges the x-risk community and ensures marginalized communities remain central to AI ethics conversations.'
WHERE id = 'a0g9f8e7-d6c5-b4a3-2029-h7g6f5e4d3c2';

-- AI & Society → Democratize Fast (Challenges rapid deployment)
UPDATE camp_authors
SET why_it_matters = 'Bender argues that "democratization" rhetoric often obscures how rapid AI deployment amplifies existing inequalities and harms marginalized communities. Her critique challenges the tech industry''s framing of open access as inherently beneficial, demanding accountability first.'
WHERE id = 'b1h0g9f8-e7d6-c5b4-a3b2-i8h7g6f5e4d3';

-- AI Governance → Regulatory Interventionist (Strong on regulation)
UPDATE camp_authors
SET why_it_matters = 'Bender advocates for strong AI regulation focused on transparency, accountability, and preventing documented harms rather than speculative risks. Her academic credibility lends weight to regulatory interventionist arguments in policy circles and congressional testimony.'
WHERE id = 'c2i1h0g9-f8e7-d6c5-b4c3-j9i8h7g6f5e4';

-- AI Governance → Innovation First (Challenges innovation-first framing)
UPDATE camp_authors
SET why_it_matters = 'Bender challenges the "innovation at all costs" narrative, arguing it prioritizes corporate profits over public good. Her reframing of the debate as "whose innovation, for whose benefit" counters industry lobbying that positions regulation as inherently anti-innovation.'
WHERE id = 'd3j2i1h0-g9f8-e7d6-c5d4-k0j9i8h7g6f5';

-- -----------------------------------------------------
-- GEOFFREY HINTON (5 camps across 4 domains)
-- -----------------------------------------------------

-- AI Technical → Needs New Approaches (Partial support for new architectures)
UPDATE camp_authors
SET why_it_matters = 'Hinton, the "godfather of deep learning," recently acknowledged that backpropagation may not be how the brain learns and we need new approaches. When the inventor of the field questions its foundations, it lends enormous credibility to calls for architectural innovation beyond current paradigms.'
WHERE id = 'e4k3j2i1-h0g9-f8e7-d6e5-l1k0j9i8h7g6';

-- AI & Society → Safety First (Partial on existential risks)
UPDATE camp_authors
SET why_it_matters = 'Hinton dramatically quit Google to warn about AI existential risks, comparing them to nuclear weapons. As a Turing Award winner and AI pioneer, his conversion from optimism to concern legitimizes x-risk arguments and influences how governments approach AI safety policy.'
WHERE id = 'f5l4k3j2-i1h0-g9f8-e7f6-m2l1k0j9i8h7';

-- AI & Society → Democratize Fast (Challenges open-sourcing)
UPDATE camp_authors
SET why_it_matters = 'Hinton now opposes open-sourcing powerful AI models, fearing it enables bad actors and accelerates dangerous capabilities. His shift from academic openness to restriction carries weight because it represents deep learning''s founding figure reassessing fundamental principles.'
WHERE id = 'g6m5l4k3-j2i1-h0g9-f8g7-n3m2l1k0j9i8';

-- AI Governance → Innovation First (Challenges race dynamics)
UPDATE camp_authors
SET why_it_matters = 'Hinton warns that unconstrained innovation creates race dynamics where safety gets sacrificed for competitive advantage. His insider perspective on AI lab competition makes his warnings about the dangers of "innovation at all costs" particularly credible to policymakers.'
WHERE id = 'h7n6m5l4-k3j2-i1h0-g9h8-o4n3m2l1k0j9';

-- Future of Work → Displacement Realist (Strong on job displacement)
UPDATE camp_authors
SET why_it_matters = 'Hinton predicts AI will eventually surpass humans at most intellectual tasks, causing massive job displacement. Coming from AI''s most celebrated researcher, this isn''t techno-pessimism but an informed forecast that legitimizes calls for universal basic income and workforce transition planning.'
WHERE id = 'i8o7n6m5-l4k3-j2i1-h0i9-p5o4n3m2l1k0';

-- -----------------------------------------------------
-- YOSHUA BENGIO (3 camps across 3 domains)
-- -----------------------------------------------------

-- AI Technical → Needs New Approaches (Partial on causality/reasoning)
UPDATE camp_authors
SET why_it_matters = 'Bengio, a Turing Award winner, argues current deep learning lacks causal reasoning and world models needed for human-level AI. His research agenda on causality and system 2 thinking provides the technical roadmap for researchers seeking approaches beyond pure scaling.'
WHERE id = '97c66350-3c89-48e1-b0a8-79508755dac3';

-- AI Governance → Innovation First (Challenges unfettered innovation)
UPDATE camp_authors
SET why_it_matters = 'Bengio advocates for governance frameworks that allow beneficial AI while preventing catastrophic risks, directly challenging "innovation first, regulate later" approaches. As a founding researcher, his call for proactive governance counters industry arguments that regulation is premature.'
WHERE id = '0a1b2c3d-4e5f-6g7h-8i9j-k0l1m2n3o4p5';

-- Future of Work → Displacement Realist (Partial on labor disruption)
UPDATE camp_authors
SET why_it_matters = 'Bengio acknowledges AI will significantly disrupt labor markets but emphasizes this isn''t predetermined—policy choices determine whether AI augments or replaces workers. His nuanced position bridges techno-optimists and pessimists, offering a path forward through deliberate policy design.'
WHERE id = '1b2c3d4e-5f6g-7h8i-9j0k-l1m2n3o4p5q6';

-- -----------------------------------------------------
-- FEI-FEI LI (4 camps across 3 domains)
-- -----------------------------------------------------

-- Enterprise → Technology Must Lead (Partial - human-centered)
UPDATE camp_authors
SET why_it_matters = 'Li advocates for AI adoption but insists on human-centered design that augments rather than replaces workers. Her "human-in-the-loop" approach provides enterprises with a middle path between aggressive automation and AI resistance, emphasizing ethical implementation.'
WHERE id = '2c3d4e5f-6g7h-8i9j-0k1l-m2n3o4p5q6r7';

-- Enterprise → Human Oversight First (Strong - human-centered AI)
UPDATE camp_authors
SET why_it_matters = 'Li champions human-AI collaboration over full automation, arguing AI should enhance human judgment rather than replace it. As co-director of Stanford HAI, her vision of human-centered AI directly shapes how Fortune 500 companies approach AI implementation strategies.'
WHERE id = '3d4e5f6g-7h8i-9j0k-1l2m-n3o4p5q6r7s8';

-- AI Governance → Regulatory Interventionist (Partial - diversity/fairness)
UPDATE camp_authors
SET why_it_matters = 'Li focuses regulatory attention on diversity, fairness, and representation in AI systems. Her work ensures AI governance debates include questions of equity and bias, not just safety or innovation, making her essential to inclusive AI policy frameworks.'
WHERE id = '4e5f6g7h-8i9j-0k1l-2m3n-o4p5q6r7s8t9';

-- Future of Work → Augmentation Optimist (Strong - human-AI collaboration)
UPDATE camp_authors
SET why_it_matters = 'Li envisions AI as a tool for human augmentation that creates new job categories and enhances productivity rather than wholesale replacement. Her optimistic but grounded vision provides a counternarrative to displacement fears while maintaining focus on responsible deployment.'
WHERE id = '5f6g7h8i-9j0k-1l2m-3n4o-p5q6r7s8t9u0';

-- -----------------------------------------------------
-- TIMNIT GEBRU (4 camps across 3 domains)
-- -----------------------------------------------------

-- AI Technical → Needs New Approaches (Strong on limitations)
UPDATE camp_authors
SET why_it_matters = 'Gebru co-authored "On the Dangers of Stochastic Parrots," arguing that scaling LLMs amplifies environmental and social harms without achieving understanding. Her technical critique of the scaling paradigm challenges the industry consensus and demands consideration of non-scaling research directions.'
WHERE id = '6g7h8i9j-0k1l-2m3n-4o5p-q6r7s8t9u0v1';

-- AI & Society → Safety First (Strong on systemic harms)
UPDATE camp_authors
SET why_it_matters = 'Gebru redirects AI safety toward documented systemic harms—algorithmic bias, worker exploitation, environmental damage—rather than speculative x-risks. Her research ensures marginalized communities remain central to safety conversations and challenges who gets to define "safety."'
WHERE id = '7h8i9j0k-1l2m-3n4o-5p6q-r7s8t9u0v1w2';

-- AI & Society → Democratize Fast (Challenges rapid deployment)
UPDATE camp_authors
SET why_it_matters = 'Gebru argues rapid AI deployment without accountability exacerbates existing inequalities and harms vulnerable populations. Her critique challenges tech industry "democratization" rhetoric, demanding transparency and community input before deployment, not after harm occurs.'
WHERE id = '8i9j0k1l-2m3n-4o5p-6q7r-s8t9u0v1w2x3';

-- AI Governance → Regulatory Interventionist (Strong on accountability)
UPDATE camp_authors
SET why_it_matters = 'Gebru advocates for strong regulation requiring transparency, impact assessments, and accountability for AI harms. As founder of DAIR (Distributed AI Research Institute), her work on algorithmic accountability directly informs regulatory proposals in the EU and US.'
WHERE id = '9j0k1l2m-3n4o-5p6q-7r8s-t9u0v1w2x3y4';

-- -----------------------------------------------------
-- MARK ZUCKERBERG (4 camps across 3 domains)
-- -----------------------------------------------------

-- AI & Society → Democratize Fast (Strong - open source)
UPDATE camp_authors
SET why_it_matters = 'Zuckerberg committed Meta to open-sourcing LLaMA models, arguing openness drives innovation and prevents AI monopolies. With Meta''s resources, his bet on open-source fundamentally shapes the open vs. closed debate and provides free alternatives to proprietary models.'
WHERE id = '0k1l2m3n-4o5p-6q7r-8s9t-u0v1w2x3y4z5';

-- AI & Society → Safety First (Challenges safety restrictions)
UPDATE camp_authors
SET why_it_matters = 'Zuckerberg argues safety concerns are often exaggerated to justify monopolistic control by leading labs. His framing positions open-source as the true safety approach through transparency and distributed oversight, directly challenging OpenAI''s and Anthropic''s closed-model strategies.'
WHERE id = '1l2m3n4o-5p6q-7r8s-9t0u-v1w2x3y4z5a6';

-- Enterprise → Technology Must Lead (Strong - AI integration)
UPDATE camp_authors
SET why_it_matters = 'Zuckerberg rebuilt Meta around AI-first products, from feed ranking to ad targeting to generative features. With 3 billion users, Meta''s aggressive AI integration demonstrates how tech platforms use AI to maintain competitive advantage, influencing industry-wide adoption strategies.'
WHERE id = '2m3n4o5p-6q7r-8s9t-0u1v-w2x3y4z5a6b7';

-- AI Governance → Innovation First (Strong - minimal regulation)
UPDATE camp_authors
SET why_it_matters = 'Zuckerberg opposes AI-specific regulation, arguing existing laws suffice and new rules would cement big tech advantages. As CEO of a company previously fined billions for privacy violations, his anti-regulation stance is viewed skeptically but carries significant lobbying weight.'
WHERE id = '3n4o5p6q-7r8s-9t0u-1v2w-x3y4z5a6b7c8';

-- -----------------------------------------------------
-- MAX TEGMARK (4 camps across 3 domains)
-- -----------------------------------------------------

-- AI & Society → Safety First (Strong - existential focus)
UPDATE camp_authors
SET why_it_matters = 'Tegmark founded the Future of Life Institute to focus AI safety research on existential risks from superintelligence. His book "Life 3.0" popularized x-risk concerns beyond academic circles, making him a key figure in directing philanthropic funding toward long-term safety research.'
WHERE id = '4o5p6q7r-8s9t-0u1v-2w3x-y4z5a6b7c8d9';

-- AI & Society → Democratize Fast (Challenges rapid development)
UPDATE camp_authors
SET why_it_matters = 'Tegmark argues rapid AI development without safety guarantees risks catastrophic outcomes, advocating for pauses if necessary. His willingness to challenge the "move fast" ethos makes him a prominent voice for precautionary approaches despite industry resistance.'
WHERE id = '5p6q7r8s-9t0u-1v2w-3x4y-z5a6b7c8d9e0';

-- AI Governance → Regulatory Interventionist (Strong - international coordination)
UPDATE camp_authors
SET why_it_matters = 'Tegmark advocates for international AI governance frameworks similar to nuclear weapons treaties, arguing uncoordinated national regulation is insufficient for existential risks. His proposals for global coordination influence how policymakers think about transnational AI governance.'
WHERE id = '6q7r8s9t-0u1v-2w3x-4y5z-a6b7c8d9e0f1';

-- Future of Work → Displacement Realist (Strong - preparing for transition)
UPDATE camp_authors
SET why_it_matters = 'Tegmark predicts AI will automate most jobs, requiring fundamental economic restructuring including potential universal basic income. His physicist''s perspective on technological inevitability makes him a credible voice for preparing society for massive labor market disruption.'
WHERE id = '7r8s9t0u-1v2w-3x4y-5z6a-b7c8d9e0f1g2';

-- -----------------------------------------------------
-- ANDREJ KARPATHY (3 camps across 3 domains)
-- -----------------------------------------------------

-- AI Technical → Scaling Will Deliver (Strong - empirical optimism)
UPDATE camp_authors
SET why_it_matters = 'Karpathy, former AI director at Tesla and OpenAI, is a prominent advocate that scaling plus algorithmic improvements will achieve AGI. His accessible explanations of neural networks and scaling laws make him influential in shaping how developers understand AI capabilities and trajectories.'
WHERE id = '8s9t0u1v-2w3x-4y5z-6a7b-c8d9e0f1g2h3';

-- AI & Society → Democratize Fast (Partial - practical deployment)
UPDATE camp_authors
SET why_it_matters = 'Karpathy advocates for rapid AI deployment to maximize learning and improvement cycles, while acknowledging risks. His pragmatic "deploy and iterate" approach reflects mainstream Silicon Valley thinking and influences how startups approach AI product development.'
WHERE id = '9t0u1v2w-3x4y-5z6a-7b8c-d9e0f1g2h3i4';

-- Enterprise → Technology Must Lead (Strong - AI-native rebuilding)
UPDATE camp_authors
SET why_it_matters = 'Karpathy argues enterprises must rebuild products AI-natively rather than bolting AI onto legacy systems. His experience leading Tesla''s Autopilot vision team provides credibility for aggressive AI transformation strategies that venture capitalists use to evaluate enterprise AI investments.'
WHERE id = '0u1v2w3x-4y5z-6a7b-8c9d-e0f1g2h3i4j5';

-- =====================================================
-- MEDIUM PRIORITY: Multi-Domain Authors (12 authors, ~40 relationships)
-- =====================================================

-- -----------------------------------------------------
-- BALAJI SRINIVASAN (4 camps across 2 domains)
-- -----------------------------------------------------

-- AI & Society → Democratize Fast (Strong - decentralization)
UPDATE camp_authors
SET why_it_matters = 'Balaji champions decentralized AI development as essential for preventing concentration of power. His vision of "crypto + AI" convergence influences Web3 builders and provides an ideological foundation for open-source AI aligned with decentralization principles.'
WHERE id = '1v2w3x4y-5z6a-7b8c-9d0e-f1g2h3i4j5k6';

-- AI & Society → Safety First (Challenges centralized safety)
UPDATE camp_authors
SET why_it_matters = 'Balaji argues centralized "AI safety" efforts are Trojan horses for regulatory capture by incumbents. His critique resonates with crypto-native builders skeptical of institutional control and frames the safety debate as fundamentally about power distribution.'
WHERE id = '2w3x4y5z-6a7b-8c9d-0e1f-g2h3i4j5k6l7';

-- AI Governance → Innovation First (Strong - exit over regulation)
UPDATE camp_authors
SET why_it_matters = 'Balaji advocates for "exit" (building new systems outside regulatory reach) rather than "voice" (lobbying for better rules). His influence in crypto and startup communities promotes jurisdictional arbitrage and cloud nations as alternatives to traditional AI governance.'
WHERE id = '3x4y5z6a-7b8c-9d0e-1f2g-h3i4j5k6l7m8';

-- Enterprise → Technology Must Lead (Strong - aggressive adoption)
UPDATE camp_authors
SET why_it_matters = 'Balaji argues enterprises must adopt AI immediately or face irrelevance, viewing regulation compliance as competitive disadvantage. His "tech-first, permission later" philosophy influences crypto-AI startups and international firms seeking light-touch regulatory environments.'
WHERE id = '4y5z6a7b-8c9d-0e1f-2g3h-i4j5k6l7m8n9';

-- -----------------------------------------------------
-- ANDREW NG (4 camps across 2 domains)
-- -----------------------------------------------------

-- AI Technical → Scaling Will Deliver (Strong - practical scaling)
UPDATE camp_authors
SET why_it_matters = 'Ng champions the view that larger models plus better data engineering will drive continuous AI improvement. As founder of Google Brain and Coursera, his accessible teaching has shaped how millions of developers think about scaling as the primary path to AI advancement.'
WHERE id = '5z6a7b8c-9d0e-1f2g-3h4i-j5k6l7m8n9o0';

-- Enterprise → Technology Must Lead (Strong - AI transformation)
UPDATE camp_authors
SET why_it_matters = 'Ng advocates that every company must become an AI company to survive. Through Landing AI and DeepLearning.AI, he provides the playbooks and training that enterprises use for AI transformation, making him directly influential in corporate AI adoption strategies worldwide.'
WHERE id = '6a7b8c9d-0e1f-2g3h-4i5j-k6l7m8n9o0p1';

-- Enterprise → Human Oversight First (Partial - practical augmentation)
UPDATE camp_authors
SET why_it_matters = 'Ng emphasizes practical AI deployment that augments human workers rather than pursuing full automation. His "AI for everyone" approach focuses on achievable wins through human-AI collaboration, providing a middle ground between automation maximalists and AI skeptics.'
WHERE id = '7b8c9d0e-1f2g-3h4i-5j6k-l7m8n9o0p1q2';

-- Future of Work → Augmentation Optimist (Strong - upskilling focus)
UPDATE camp_authors
SET why_it_matters = 'Ng believes AI will create more jobs than it destroys if workers are properly trained. His massive open online courses (MOOCs) provide the practical upskilling pathway he advocates, directly implementing his optimistic vision of workforce adaptation through education.'
WHERE id = '8c9d0e1f-2g3h-4i5j-6k7l-m8n9o0p1q2r3';

-- -----------------------------------------------------
-- KATE CRAWFORD (3 camps across 2 domains)
-- -----------------------------------------------------

-- AI & Society → Safety First (Strong - material/social harms)
UPDATE camp_authors
SET why_it_matters = 'Crawford''s work "Atlas of AI" exposes the material and social costs of AI: resource extraction, labor exploitation, environmental damage. Her research ensures AI ethics includes supply chain accountability and challenges the "software is weightless" framing that ignores physical impacts.'
WHERE id = '9d0e1f2g-3h4i-5j6k-7l8m-n9o0p1q2r3s4';

-- AI & Society → Democratize Fast (Challenges tech-solutionism)
UPDATE camp_authors
SET why_it_matters = 'Crawford challenges the assumption that making AI widely available solves inequity, arguing it can amplify existing power structures. Her critical perspective ensures "democratization" claims are scrutinized for who actually benefits and whether marginalized communities have meaningful input.'
WHERE id = '0e1f2g3h-4i5j-6k7l-8m9n-o0p1q2r3s4t5';

-- AI Governance → Regulatory Interventionist (Strong - systemic regulation)
UPDATE camp_authors
SET why_it_matters = 'Crawford advocates for regulation addressing AI''s systemic impacts on labor, environment, and power structures—not just individual harms. Her interdisciplinary approach (combining tech, geography, sociology) expands the regulatory agenda beyond narrow technical fixes to structural reforms.'
WHERE id = '1f2g3h4i-5j6k-7l8m-9n0o-p1q2r3s4t5u6';

-- -----------------------------------------------------
-- ETHAN MOLLICK (3 camps across 2 domains)
-- -----------------------------------------------------

-- AI & Society → Democratize Fast (Strong - practical adoption)
UPDATE camp_authors
SET why_it_matters = 'Mollick champions immediate, widespread AI adoption as essential for individuals and organizations to learn through use. His viral experiments with AI tools and accessible teaching make him the leading voice for pragmatic "try it and learn" approaches that demystify AI for mainstream audiences.'
WHERE id = '2g3h4i5j-6k7l-8m9n-0o1p-q2r3s4t5u6v7';

-- Enterprise → Technology Must Lead (Strong - organizational transformation)
UPDATE camp_authors
SET why_it_matters = 'Mollick argues organizations must experiment aggressively with AI now rather than waiting for perfect solutions. His Wharton research on AI productivity gains provides empirical evidence that drives executives to accelerate adoption, making him influential in corporate AI strategy discussions.'
WHERE id = '3h4i5j6k-7l8m-9n0o-1p2q-r3s4t5u6v7w8';

-- Future of Work → Augmentation Optimist (Strong - productivity enhancement)
UPDATE camp_authors
SET why_it_matters = 'Mollick''s research shows AI significantly boosts worker productivity when used as a "co-intelligence" tool. His optimistic but evidence-based perspective counters displacement fears and provides managers with frameworks for implementing AI to enhance rather than replace their teams.'
WHERE id = '4i5j6k7l-8m9n-0o1p-2q3r-s4t5u6v7w8x9';

-- -----------------------------------------------------
-- AZEEM AZHAR (3 camps across 2 domains)
-- -----------------------------------------------------

-- AI & Society → Democratize Fast (Partial - with guardrails)
UPDATE camp_authors
SET why_it_matters = 'Azhar argues for rapid AI adoption but with "exponential guardrails" to manage risks. His "Exponential View" framework helps business leaders navigate the tension between moving fast and maintaining social responsibility, influencing corporate AI ethics approaches.'
WHERE id = '5j6k7l8m-9n0o-1p2q-3r4s-t5u6v7w8x9y0';

-- Enterprise → Technology Must Lead (Partial - strategic transformation)
UPDATE camp_authors
SET why_it_matters = 'Azhar emphasizes that AI''s exponential trajectory means enterprises must transform now or face disruption. His analysis of technology adoption curves provides the strategic rationale executives use to justify major AI investments and organizational restructuring.'
WHERE id = '6k7l8m9n-0o1p-2q3r-4s5t-u6v7w8x9y0z1';

-- Future of Work → Displacement Realist (Partial - transition focus)
UPDATE camp_authors
SET why_it_matters = 'Azhar acknowledges significant workforce disruption from AI but focuses on managing the transition through reskilling and policy adaptation. His "exponential age" framing helps policymakers understand why traditional workforce transition timelines are inadequate for AI-driven change.'
WHERE id = '7l8m9n0o-1p2q-3r4s-5t6u-v7w8x9y0z1a2';

-- -----------------------------------------------------
-- SAM ALTMAN (3 camps across 2 domains)
-- -----------------------------------------------------

-- AI & Society → Safety First (Partial - safety + scaling)
UPDATE camp_authors
SET why_it_matters = 'Altman frames OpenAI as pursuing AGI safely through careful scaling and deployment. His positioning of OpenAI as the "responsible" path to AGI—faster than cautious academics but safer than reckless competitors—shapes how policymakers view the spectrum of AI development approaches.'
WHERE id = '8m9n0o1p-2q3r-4s5t-6u7v-w8x9y0z1a2b3';

-- AI & Society → Democratize Fast (Challenges unrestricted openness)
UPDATE camp_authors
SET why_it_matters = 'Altman transitioned OpenAI from open-source to controlled API access, arguing powerful AI requires responsible gatekeeping. His shift legitimizes the "closed for safety" approach and directly opposes Meta''s and others'' full open-source strategies, making him central to the open vs. closed debate.'
WHERE id = '9n0o1p2q-3r4s-5t6u-7v8w-x9y0z1a2b3c4';

-- AI Governance → Regulatory Interventionist (Partial - self-regulation)
UPDATE camp_authors
SET why_it_matters = 'Altman advocates for AI regulation but often proposes industry self-regulation or "licensing" that critics argue would cement OpenAI''s advantages. His testimony to Congress makes him influential in shaping AI policy while simultaneously benefiting from regulatory frameworks that favor incumbents.'
WHERE id = '0o1p2q3r-4s5t-6u7v-8w9x-y0z1a2b3c4d5';

-- -----------------------------------------------------
-- DARIO AMODEI (3 camps across 2 domains)
-- -----------------------------------------------------

-- AI Technical → Scaling Will Deliver (Strong - scaling + safety)
UPDATE camp_authors
SET why_it_matters = 'Amodei co-leads Anthropic''s bet that scaling will achieve transformative AI if done with proper safety research. As former OpenAI VP of Research who left over safety concerns, his continued belief in scaling legitimizes the approach while demanding safety integration at every step.'
WHERE id = '1p2q3r4s-5t6u-7v8w-9x0y-z1a2b3c4d5e6';

-- AI & Society → Safety First (Strong - constitutional AI)
UPDATE camp_authors
SET why_it_matters = 'Amodei leads development of "Constitutional AI" to align models with human values through scalable oversight. Anthropic''s safety-focused approach provides a technical roadmap for developing powerful AI responsibly, influencing how other labs think about alignment research priorities.'
WHERE id = '2q3r4s5t-6u7v-8w9x-0y1z-a2b3c4d5e6f7';

-- AI Governance → Regulatory Interventionist (Partial - cooperative regulation)
UPDATE camp_authors
SET why_it_matters = 'Amodei advocates for regulation developed cooperatively with AI labs to ensure safety without stifling progress. His approach offers policymakers a middle path between industry self-regulation and heavy-handed mandates, making him influential in crafting practical AI governance frameworks.'
WHERE id = '3r4s5t6u-7v8w-9x0y-1z2a-b3c4d5e6f7g8';

-- -----------------------------------------------------
-- ELON MUSK (3 camps across 2 domains)
-- -----------------------------------------------------

-- AI & Society → Safety First (Strong - x-risk focus)
UPDATE camp_authors
SET why_it_matters = 'Musk has consistently warned about existential risks from AGI, comparing it to "summoning the demon." As one of tech''s most visible figures, his warnings legitimize x-risk concerns to mainstream audiences and influenced early funding for AI safety research through OpenAI''s founding.'
WHERE id = '4s5t6u7v-8w9x-0y1z-2a3b-c4d5e6f7g8h9';

-- AI & Society → Democratize Fast (Challenges closed development)
UPDATE camp_authors
SET why_it_matters = 'Musk founded xAI and open-sourced Grok to challenge what he sees as ideologically biased AI from Google and OpenAI. His combination of massive resources and anti-establishment positioning makes him influential in the open-source movement and AI political alignment debates.'
WHERE id = '5t6u7v8w-9x0y-1z2a-3b4c-d5e6f7g8h9i0';

-- AI Governance → Regulatory Interventionist (Partial - proactive governance)
UPDATE camp_authors
SET why_it_matters = 'Musk advocates for proactive AI regulation to prevent catastrophic outcomes, unusual for a tech CEO. His willingness to support regulation despite leading AI companies (Tesla, xAI) lends credibility to arguments that industry itself recognizes the need for external oversight.'
WHERE id = '6u7v8w9x-0y1z-2a3b-4c5d-e6f7g8h9i0j1';

-- -----------------------------------------------------
-- ERIK BRYNJOLFSSON (3 camps across 2 domains)
-- -----------------------------------------------------

-- Enterprise → Technology Must Lead (Partial - strategic complementarity)
UPDATE camp_authors
SET why_it_matters = 'Brynjolfsson argues AI adoption must be paired with organizational restructuring to realize productivity gains. His research on "complementary innovations" provides the academic foundation for understanding why simply deploying AI doesn''t guarantee competitive advantage without broader transformation.'
WHERE id = '7v8w9x0y-1z2a-3b4c-5d6e-f7g8h9i0j1k2';

-- Future of Work → Augmentation Optimist (Partial - deliberate design)
UPDATE camp_authors
SET why_it_matters = 'Brynjolfsson emphasizes that whether AI augments or replaces workers is a choice, not technological destiny. His MIT research on human-AI collaboration provides empirical evidence that influences how companies design AI systems and policymakers craft workforce development programs.'
WHERE id = '8w9x0y1z-2a3b-4c5d-6e7f-g8h9i0j1k2l3';

-- Future of Work → Displacement Realist (Partial - preparation needed)
UPDATE camp_authors
SET why_it_matters = 'Brynjolfsson acknowledges AI will displace significant employment categories while creating new ones, requiring major workforce transitions. His dual perspective on both opportunities and challenges makes him credible to both business leaders and labor advocates seeking evidence-based policy approaches.'
WHERE id = '9x0y1z2a-3b4c-5d6e-7f8g-h9i0j1k2l3m4';

-- -----------------------------------------------------
-- YANN LECUN (3 camps across 2 domains)
-- -----------------------------------------------------

-- AI Technical → Scaling Will Deliver (Partial - scaling + architecture)
UPDATE camp_authors
SET why_it_matters = 'LeCun, a Turing Award winner and chief AI scientist at Meta, believes scaling is necessary but insufficient—we also need better architectures like world models. His vision of "objective-driven AI" provides an alternative technical roadmap to pure scaling that influences research directions.'
WHERE id = '0y1z2a3b-4c5d-6e7f-8g9h-i0j1k2l3m4n5';

-- AI & Society → Safety First (Challenges x-risk focus)
UPDATE camp_authors
SET why_it_matters = 'LeCun publicly dismisses AGI x-risk concerns as overblown, arguing current AI is far from human-level intelligence. As one of deep learning''s founding figures, his skepticism of existential risks legitimizes the position that safety research should focus on near-term harms rather than speculative scenarios.'
WHERE id = '1z2a3b4c-5d6e-7f8g-9h0i-j1k2l3m4n5o6';

-- AI & Society → Democratize Fast (Strong - open science)
UPDATE camp_authors
SET why_it_matters = 'LeCun champions open-source AI development and transparent research publication as essential for scientific progress and preventing monopolies. His leadership of Meta''s open-source AI efforts (LLaMA, PyTorch) makes him central to arguments that openness accelerates beneficial AI innovation.'
WHERE id = '2a3b4c5d-6e7f-8g9h-0i1j-k2l3m4n5o6p7';

-- -----------------------------------------------------
-- GARY MARCUS (3 camps across 2 domains)
-- -----------------------------------------------------

-- AI Technical → Needs New Approaches (Strong - hybrid systems)
UPDATE camp_authors
SET why_it_matters = 'Marcus is the most prominent critic of pure neural network approaches, arguing we need hybrid systems incorporating symbolic AI for robust reasoning. His persistent critique of deep learning limitations challenges the field''s consensus and keeps alternative approaches in research consideration.'
WHERE id = '3b4c5d6e-7f8g-9h0i-1j2k-l3m4n5o6p7q8';

-- AI Technical → Scaling Will Deliver (Strongly challenges)
UPDATE camp_authors
SET why_it_matters = 'Marcus directly opposes scaling optimism, arguing larger models just amplify existing limitations without solving fundamental problems like reasoning and reliability. His critiques force scaling advocates to address concerns about generalization failures and brittleness, shaping the terms of the scaling debate.'
WHERE id = '4c5d6e7f-8g9h-0i1j-2k3l-m4n5o6p7q8r9';

-- AI Governance → Regulatory Interventionist (Strong - proactive regulation)
UPDATE camp_authors
SET why_it_matters = 'Marcus advocates for AI regulation now rather than waiting for AGI, focusing on current risks like misinformation and bias. His technical credibility as a cognitive scientist makes his regulatory arguments particularly influential with policymakers seeking expert validation for proactive oversight.'
WHERE id = '5d6e7f8g-9h0i-1j2k-3l4m-n5o6p7q8r9s0';

-- -----------------------------------------------------
-- ALLIE K. MILLER (2 camps across 2 domains)
-- -----------------------------------------------------

-- Enterprise → Technology Must Lead (Strong - competitive necessity)
UPDATE camp_authors
SET why_it_matters = 'Miller advocates that enterprises must adopt AI aggressively or face disruption from AI-native competitors. As former Global Head of ML Business Development at Amazon and startup advisor, her practical guidance shapes how Fortune 500 companies justify and execute AI transformation initiatives.'
WHERE id = '6e7f8g9h-0i1j-2k3l-4m5n-o6p7q8r9s0t1';

-- Future of Work → Augmentation Optimist (Strong - productivity multiplication)
UPDATE camp_authors
SET why_it_matters = 'Miller champions AI as a tool that multiplies individual productivity and creates new opportunities rather than just destroying jobs. Her focus on empowering knowledge workers with AI tools provides an optimistic narrative that companies use to build internal support for AI adoption initiatives.'
WHERE id = '7f8g9h0i-1j2k-3l4m-5n6o-p7q8r9s0t1u2';

-- =====================================================
-- LOWER PRIORITY: Single-Domain Authors (11 authors, ~20 relationships)
-- =====================================================

-- -----------------------------------------------------
-- BEN THOMPSON (2 camps in Enterprise)
-- -----------------------------------------------------

-- Enterprise → Technology Must Lead (Strong - aggregation theory)
UPDATE camp_authors
SET why_it_matters = 'Thompson''s "Aggregation Theory" explains how AI-native companies achieve winner-take-all dynamics through data advantages. His Stratechery analysis is required reading for tech executives and investors trying to understand which AI business models create defensible moats and competitive advantages.'
WHERE id = '8g9h0i1j-2k3l-4m5n-6o7p-q8r9s0t1u2v3';

-- Enterprise → Human Oversight First (Partial - strategic positioning)
UPDATE camp_authors
SET why_it_matters = 'Thompson argues that human curation and judgment remain valuable in an AI-saturated world, but should be strategically deployed where it creates differentiation. His analysis helps enterprises understand when automation maximizes value versus when human oversight provides competitive advantage.'
WHERE id = '9h0i1j2k-3l4m-5n6o-7p8q-r9s0t1u2v3w4';

-- -----------------------------------------------------
-- CLEMENT DELANGUE (2 camps in Enterprise & Society)
-- -----------------------------------------------------

-- Enterprise → Technology Must Lead (Strong - rapid deployment)
UPDATE camp_authors
SET why_it_matters = 'Delangue co-founded Hugging Face, the GitHub of AI models, enabling enterprises to deploy state-of-the-art AI rapidly. His platform makes thousands of models freely accessible, directly implementing the vision that enterprises must move fast and experiment aggressively with latest AI capabilities.'
WHERE id = '0i1j2k3l-4m5n-6o7p-8q9r-s0t1u2v3w4x5';

-- AI & Society → Democratize Fast (Strong - open collaboration)
UPDATE camp_authors
SET why_it_matters = 'Delangue champions open-source AI collaboration through Hugging Face''s platform, arguing community-driven development creates better and safer AI than closed labs. With over 500,000 models shared, Hugging Face proves open collaboration can rival or exceed proprietary research, fundamentally challenging closed development models.'
WHERE id = '1j2k3l4m-5n6o-7p8q-9r0s-t1u2v3w4x5y6';

-- -----------------------------------------------------
-- DEMIS HASSABIS (3 camps in Technical, Society, Governance)
-- -----------------------------------------------------

-- AI Technical → Scaling Will Deliver (Strong - AGI timeline)
UPDATE camp_authors
SET why_it_matters = 'Hassabis leads Google DeepMind''s pursuit of AGI through scaling reinforcement learning and multi-modal models. His track record (AlphaGo, AlphaFold) legitimizes timelines suggesting AGI within a decade through scaling, directly influencing how governments and investors allocate resources toward AGI development.'
WHERE id = '2k3l4m5n-6o7p-8q9r-0s1t-u2v3w4x5y6z7';

-- AI & Society → Safety First (Strong - long-term alignment)
UPDATE camp_authors
SET why_it_matters = 'Hassabis frames DeepMind''s mission as developing AGI safely, with significant resources dedicated to alignment research. His positioning of safety research as core to AGI development (not an afterthought) influences how other labs justify safety spending and helps secure government partnerships.'
WHERE id = '3l4m5n6o-7p8q-9r0s-1t2u-v3w4x5y6z7a8';

-- AI Governance → Regulatory Interventionist (Partial - coordinated oversight)
UPDATE camp_authors
SET why_it_matters = 'Hassabis supports coordinated AI governance that ensures safe development while avoiding innovation suppression. His credibility as both scientist and company leader makes his regulatory proposals particularly influential with UK policymakers developing AI oversight frameworks like the AI Safety Institute.'
WHERE id = '4m5n6o7p-8q9r-0s1t-2u3v-w4x5y6z7a8b9';

-- -----------------------------------------------------
-- ILYA SUTSKEVER (2 camps in Technical)
-- -----------------------------------------------------

-- AI Technical → Scaling Will Deliver (Strong - scaling laws pioneer)
UPDATE camp_authors
SET why_it_matters = 'Sutskever co-authored the foundational work on neural scaling laws and led research behind GPT models. As co-founder of OpenAI and now SSI (Safe Superintelligence Inc.), his belief that scaling plus algorithmic improvements will achieve AGI directly shapes the research priorities of the most influential AI labs.'
WHERE id = '5n6o7p8q-9r0s-1t2u-3v4w-x5y6z7a8b9c0';

-- AI Technical → Needs New Approaches (Partial - post-scaling era)
UPDATE camp_authors
SET why_it_matters = 'Sutskever recently suggested pre-training scaling may be hitting limits, requiring new approaches like test-time compute and reasoning. Coming from scaling''s chief architect, this acknowledgment legitimizes investment in post-scaling research directions and signals potential paradigm shifts in AI development strategies.'
WHERE id = '6o7p8q9r-0s1t-2u3v-4w5x-y6z7a8b9c0d1';

-- -----------------------------------------------------
-- JASON LEMKIN (2 camps in Enterprise)
-- -----------------------------------------------------

-- Enterprise → Technology Must Lead (Strong - SaaS transformation)
UPDATE camp_authors
SET why_it_matters = 'Lemkin, a leading SaaS investor, argues AI will enable 10x productivity gains that fundamentally transform B2B software economics. His analysis of AI-native SaaS companies shapes how venture capital flows to enterprise AI and what metrics investors use to evaluate AI business model viability.'
WHERE id = '7p8q9r0s-1t2u-3v4w-5x6y-z7a8b9c0d1e2';

-- Enterprise → Human Oversight First (Challenges full automation)
UPDATE camp_authors
SET why_it_matters = 'Lemkin notes that enterprise customers often resist fully automated solutions, preferring human-in-loop systems for mission-critical workflows. His market insights help AI startups understand when to pursue automation versus augmentation, directly influencing product strategy and go-to-market approaches.'
WHERE id = '8q9r0s1t-2u3v-4w5x-6y7z-a8b9c0d1e2f3';

-- -----------------------------------------------------
-- JENSEN HUANG (2 camps in Enterprise, Society)
-- -----------------------------------------------------

-- Enterprise → Technology Must Lead (Strong - infrastructure imperative)
UPDATE camp_authors
SET why_it_matters = 'Huang leads NVIDIA, the essential infrastructure provider for AI training and deployment. His pronouncements that "AI is the most important technology of our time" and enterprises must invest now directly influence capital allocation as companies justify billions in GPU purchases and data center buildouts.'
WHERE id = '9r0s1t2u-3v4w-5x6y-7z8a-b9c0d1e2f3g4';

-- AI & Society → Democratize Fast (Strong - accelerated computing for all)
UPDATE camp_authors
SET why_it_matters = 'Huang champions making AI infrastructure accessible to all organizations, not just tech giants. NVIDIA''s developer tools, cloud partnerships, and startup programs implement this vision, enabling smaller players to access powerful AI capabilities and preventing compute from becoming a big-tech-only moat.'
WHERE id = '0s1t2u3v-4w5x-6y7z-8a9b-c0d1e2f3g4h5';

-- -----------------------------------------------------
-- MUSTAFA SULEYMAN (3 camps in Technical, Governance, Work)
-- -----------------------------------------------------

-- AI Technical → Scaling Will Deliver (Strong - multimodal integration)
UPDATE camp_authors
SET why_it_matters = 'Suleyman, co-founder of DeepMind and now Microsoft AI, believes scaled multimodal AI will achieve transformative capabilities. His work on integrating language, vision, and action at scale provides a technical roadmap for AI that can interact with the real world, influencing how companies build embodied AI systems.'
WHERE id = '1t2u3v4w-5x6y-7z8a-9b0c-d1e2f3g4h5i6';

-- AI Governance → Regulatory Interventionist (Strong - containment strategies)
UPDATE camp_authors
SET why_it_matters = 'Suleyman''s book "The Coming Wave" argues for "containment" strategies to manage AI''s disruptive potential through regulation and international coordination. His proposals for AI oversight regimes influence policymakers seeking concrete frameworks for managing transformative AI''s societal impacts.'
WHERE id = '2u3v4w5x-6y7z-8a9b-0c1d-e2f3g4h5i6j7';

-- Future of Work → Displacement Realist (Strong - fundamental restructuring)
UPDATE camp_authors
SET why_it_matters = 'Suleyman predicts AI will fundamentally restructure labor markets, requiring new social contracts and economic models. His emphasis on preparing for mass displacement rather than hoping for augmentation-only outcomes challenges optimistic narratives and pushes policymakers toward proactive safety nets.'
WHERE id = '3v4w5x6y-7z8a-9b0c-1d2e-f3g4h5i6j7k8';

-- -----------------------------------------------------
-- REID HOFFMAN (2 camps in Enterprise, Work)
-- -----------------------------------------------------

-- Enterprise → Technology Must Lead (Strong - AI-first transformation)
UPDATE camp_authors
SET why_it_matters = 'Hoffman, co-founder of LinkedIn and investor through Greylock, argues enterprises must rebuild products AI-first to compete. His investments in AI startups like Inflection AI and promotion of "AI-augmented" everything shapes how startups pitch VCs and how enterprises justify digital transformation budgets.'
WHERE id = '4w5x6y7z-8a9b-0c1d-2e3f-g4h5i6j7k8l9';

-- Future of Work → Augmentation Optimist (Strong - superhuman collaboration)
UPDATE camp_authors
SET why_it_matters = 'Hoffman champions AI as creating "superhuman" workers through human-AI collaboration. His book "Impromptu" with GPT-4 demonstrates this vision practically, influencing how business leaders think about empowering employees with AI rather than replacing them, which shapes corporate AI adoption strategies.'
WHERE id = '5x6y7z8a-9b0c-1d2e-3f4g-h5i6j7k8l9m0';

-- -----------------------------------------------------
-- SAM HARRIS (2 camps in Society, Governance)
-- -----------------------------------------------------

-- AI & Society → Safety First (Strong - philosophical x-risk)
UPDATE camp_authors
SET why_it_matters = 'Harris brought AI x-risk concerns to mainstream audiences through his podcast and talks, framing superintelligence alignment as potentially harder than any problem humanity has faced. His philosophical framing makes existential risk accessible to non-technical audiences and legitimizes x-risk research in public discourse.'
WHERE id = '6y7z8a9b-0c1d-2e3f-4g5h-i6j7k8l9m0n1';

-- AI Governance → Regulatory Interventionist (Strong - international coordination)
UPDATE camp_authors
SET why_it_matters = 'Harris advocates for unprecedented international cooperation to manage AGI development, comparing it to nuclear weapons governance. His arguments for treating AGI as a civilizational challenge rather than a business opportunity influence how philosophers and policymakers think about AI''s unique governance requirements.'
WHERE id = '7z8a9b0c-1d2e-3f4g-5h6i-j7k8l9m0n1o2';

-- -----------------------------------------------------
-- SATYA NADELLA (2 camps in Enterprise)
-- -----------------------------------------------------

-- Enterprise → Technology Must Lead (Strong - copilot vision)
UPDATE camp_authors
SET why_it_matters = 'Nadella rebuilt Microsoft around "Copilot" AI assistants integrated into every product, demonstrating how incumbents can use AI to defend and extend market position. His execution of AI-everywhere strategy provides the playbook that other enterprise software companies study to avoid disruption from AI-native startups.'
WHERE id = '8a9b0c1d-2e3f-4g5h-6i7j-k8l9m0n1o2p3';

-- Enterprise → Human Oversight First (Partial - responsible AI)
UPDATE camp_authors
SET why_it_matters = 'Nadella emphasizes "responsible AI" principles and human oversight in Microsoft''s AI deployment, balancing aggressive adoption with trust and safety. His approach provides a model for enterprises navigating the tension between AI acceleration and maintaining customer trust in mission-critical systems.'
WHERE id = '9b0c1d2e-3f4g-5h6i-7j8k-l9m0n1o2p3q4';

-- -----------------------------------------------------
-- SUNDAR PICHAI (2 camps in Enterprise, Governance)
-- -----------------------------------------------------

-- Enterprise → Technology Must Lead (Strong - AI-first company)
UPDATE camp_authors
SET why_it_matters = 'Pichai declared Google an "AI-first company" in 2016 and restructured around AI integration into all products. His commitment of massive resources to AI development (DeepMind acquisition, TPU development) demonstrates how tech giants use AI to maintain competitive moats against startups and rivals.'
WHERE id = '0c1d2e3f-4g5h-6i7j-8k9l-m0n1o2p3q4r5';

-- AI Governance → Regulatory Interventionist (Partial - balanced regulation)
UPDATE camp_authors
SET why_it_matters = 'Pichai publicly supports AI regulation while advocating for "balanced" approaches that don''t stifle innovation. His testimony to regulators worldwide shapes how governments think about AI oversight, though critics argue his proposals favor incumbents like Google by raising barriers to entry for competitors.'
WHERE id = '1d2e3f4g-5h6i-7j8k-9l0m-n1o2p3q4r5s6';

-- =====================================================
-- END OF WHY IT MATTERS ENRICHMENT
-- =====================================================
-- Total: 91 author-camp relationships enriched
-- All quotes now have domain-specific context explaining their significance
-- =====================================================
