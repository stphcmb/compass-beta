-- =====================================================
-- WHY IT MATTERS - Domain-Specific Context (All 91 Relationships)
-- =====================================================
-- This enriches all author-camp relationships with domain-specific
-- "why it matters" context that explains their significance in that
-- particular domain and camp.
-- =====================================================

-- =====================================================
-- ALLIE K. MILLER (2 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Miller advocates that enterprises must adopt AI aggressively or face disruption from AI-native competitors. As former Global Head of ML Business Development at Amazon and startup advisor, her practical guidance shapes how Fortune 500 companies justify and execute AI transformation initiatives.'
WHERE id = '122ec724-4e64-43f0-8d47-a0895f57ff32';

UPDATE camp_authors
SET why_it_matters = 'Miller champions AI as a tool that multiplies individual productivity and creates new opportunities rather than just destroying jobs. Her focus on empowering knowledge workers with AI tools provides an optimistic narrative that companies use to build internal support for AI adoption initiatives.'
WHERE id = '60b3e6d3-6039-48b4-876f-e30b1c6ee319';

-- =====================================================
-- ANDREJ KARPATHY (3 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Karpathy, former AI director at Tesla and OpenAI, is a prominent advocate that scaling plus algorithmic improvements will achieve AGI. His accessible explanations of neural networks and scaling laws make him influential in shaping how developers understand AI capabilities and trajectories.'
WHERE id = '6229d19c-0ce0-4088-a929-e394f42c0aea';

UPDATE camp_authors
SET why_it_matters = 'Karpathy advocates for rapid AI deployment to maximize learning and improvement cycles, while acknowledging risks. His pragmatic "deploy and iterate" approach reflects mainstream Silicon Valley thinking and influences how startups approach AI product development.'
WHERE id = 'b31d46a8-37f8-4e26-a317-dd80a099068e';

UPDATE camp_authors
SET why_it_matters = 'Karpathy argues enterprises must rebuild products AI-natively rather than bolting AI onto legacy systems. His experience leading Tesla''s Autopilot vision team provides credibility for aggressive AI transformation strategies that venture capitalists use to evaluate enterprise AI investments.'
WHERE id = 'd5aba000-8a94-48c0-aadd-bfddb98151b8';

-- =====================================================
-- ANDREW NG (4 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Ng believes AI will create more jobs than it destroys if workers are properly trained. His massive open online courses (MOOCs) provide the practical upskilling pathway he advocates, directly implementing his optimistic vision of workforce adaptation through education.'
WHERE id = 'c47b1350-9233-4b22-a25b-75cdb08ea934';

UPDATE camp_authors
SET why_it_matters = 'Ng advocates that every company must become an AI company to survive. Through Landing AI and DeepLearning.AI, he provides the playbooks and training that enterprises use for AI transformation, making him directly influential in corporate AI adoption strategies worldwide.'
WHERE id = '033be339-5990-4ebf-b052-913582daa732';

UPDATE camp_authors
SET why_it_matters = 'Ng emphasizes practical AI deployment that augments human workers rather than pursuing full automation. His "AI for everyone" approach focuses on achievable wins through human-AI collaboration, providing a middle ground between automation maximalists and AI skeptics.'
WHERE id = 'df1fdb2d-2693-4a23-8701-3fbf460cf802';

UPDATE camp_authors
SET why_it_matters = 'Ng acknowledges AI will displace significant employment categories while creating new ones, requiring major workforce transitions. His dual perspective on both opportunities and challenges makes him credible to both business leaders and labor advocates seeking evidence-based policy approaches.'
WHERE id = '1671759f-ed9e-445a-8479-70a967f6115c';

-- =====================================================
-- AZEEM AZHAR (3 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Azhar argues for rapid AI adoption but with "exponential guardrails" to manage risks. His "Exponential View" framework helps business leaders navigate the tension between moving fast and maintaining social responsibility, influencing corporate AI ethics approaches.'
WHERE id = '0ebb72a4-5f4b-4c05-923d-3b09e2bb6087';

UPDATE camp_authors
SET why_it_matters = 'Azhar emphasizes that AI''s exponential trajectory means enterprises must transform now or face disruption. His analysis of technology adoption curves provides the strategic rationale executives use to justify major AI investments and organizational restructuring.'
WHERE id = 'a1256858-2f0e-4c09-8245-5ccb1b479c8e';

UPDATE camp_authors
SET why_it_matters = 'Azhar acknowledges significant workforce disruption from AI but focuses on managing the transition through reskilling and policy adaptation. His "exponential age" framing helps policymakers understand why traditional workforce transition timelines are inadequate for AI-driven change.'
WHERE id = 'cbbeb9aa-7a49-4a98-b2be-7dc0e578fa1e';

-- =====================================================
-- BALAJI SRINIVASAN (4 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Balaji advocates for "exit" (building new systems outside regulatory reach) rather than "voice" (lobbying for better rules). His influence in crypto and startup communities promotes jurisdictional arbitrage and cloud nations as alternatives to traditional AI governance.'
WHERE id = 'f40e0f0b-dc8a-4154-957a-c45df4537a85';

UPDATE camp_authors
SET why_it_matters = 'Balaji argues centralized "AI safety" efforts are Trojan horses for regulatory capture by incumbents. His critique resonates with crypto-native builders skeptical of institutional control and frames the safety debate as fundamentally about power distribution.'
WHERE id = '12361822-257e-481c-84d0-61682510288a';

UPDATE camp_authors
SET why_it_matters = 'Balaji champions decentralized AI development as essential for preventing concentration of power. His vision of "crypto + AI" convergence influences Web3 builders and provides an ideological foundation for open-source AI aligned with decentralization principles.'
WHERE id = '0b691851-0c8c-4f25-a48e-d02fd45ed20a';

UPDATE camp_authors
SET why_it_matters = 'Balaji argues enterprises must adopt AI immediately or face irrelevance, viewing regulation compliance as competitive disadvantage. His "tech-first, permission later" philosophy influences crypto-AI startups and international firms seeking light-touch regulatory environments.'
WHERE id = '447fef18-6155-4753-a422-6d6b3f2e47fa';

-- =====================================================
-- BEN THOMPSON (1 relationship)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Thompson''s "Aggregation Theory" explains how AI-native companies achieve winner-take-all dynamics through data advantages. His Stratechery analysis is required reading for tech executives and investors trying to understand which AI business models create defensible moats and competitive advantages.'
WHERE id = '95799f60-8f13-49de-9cfd-9d876ca99792';

-- =====================================================
-- CLEMENT DELANGUE (1 relationship)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Delangue co-founded Hugging Face, the GitHub of AI models, enabling enterprises to deploy state-of-the-art AI rapidly. His platform makes thousands of models freely accessible, directly implementing the vision that enterprises must move fast and experiment aggressively with latest AI capabilities.'
WHERE id = '9a90ce2f-7405-4fd9-a88d-67e683f2e3d0';

-- =====================================================
-- DARIO AMODEI (3 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Amodei co-leads Anthropic''s bet that current deep learning approaches have fundamental limitations requiring new methods. His focus on mechanistic interpretability and Constitutional AI represents a research agenda seeking approaches beyond pure scaling to achieve reliable, steerable AI systems.'
WHERE id = '852631e2-8a0a-40c2-89cb-4de31d72b832';

UPDATE camp_authors
SET why_it_matters = 'Amodei advocates for regulation developed cooperatively with AI labs to ensure safety without stifling progress. His approach offers policymakers a middle path between industry self-regulation and heavy-handed mandates, making him influential in crafting practical AI governance frameworks.'
WHERE id = '9be5e67f-2fe4-431d-b5ef-c19b3f26bb58';

UPDATE camp_authors
SET why_it_matters = 'Amodei co-leads Anthropic''s bet that scaling will achieve transformative AI if done with proper safety research. As former OpenAI VP of Research who left over safety concerns, his continued belief in scaling legitimizes the approach while demanding safety integration at every step.'
WHERE id = '26502839-a166-41f3-855d-00d62ab22d44';

-- =====================================================
-- DEMIS HASSABIS (1 relationship)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Hassabis leads Google DeepMind''s pursuit of AGI through scaling reinforcement learning and multi-modal models. His track record (AlphaGo, AlphaFold) legitimizes timelines suggesting AGI within a decade through scaling, directly influencing how governments and investors allocate resources toward AGI development.'
WHERE id = 'a5e5120f-aa2a-454d-a41f-6ea6be88d3b1';

-- =====================================================
-- ELON MUSK (3 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Musk rebuilt Tesla and SpaceX around AI-driven automation and autonomy, demonstrating aggressive technology deployment. His companies serve as case studies for AI-first transformation and influence how other enterprises think about deploying AI to achieve competitive advantage and operational efficiency.'
WHERE id = '933c2e87-aa33-4c88-9d36-caa29087fb54';

UPDATE camp_authors
SET why_it_matters = 'Musk advocates for proactive AI regulation to prevent catastrophic outcomes, unusual for a tech CEO. His willingness to support regulation despite leading AI companies (Tesla, xAI) lends credibility to arguments that industry itself recognizes the need for external oversight.'
WHERE id = '6bcbc507-bfb9-4528-a1e9-19b018c51d22';

UPDATE camp_authors
SET why_it_matters = 'Musk founded xAI to develop "maximally curious" AI and advocates for AI governance that evolves with the technology. His support for adaptive frameworks over rigid rules influences how policymakers think about creating flexible governance structures that can respond to rapid AI advancement.'
WHERE id = '75fcf6a1-0f45-4191-aee7-33ddc98c61df';

-- =====================================================
-- EMILY M. BENDER (6 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Bender challenges claims that scaling alone will achieve AGI, arguing it conflates performance with understanding. Her work provides the intellectual ammunition for researchers skeptical of massive compute investments, directly opposing the industry consensus on scaling laws.'
WHERE id = 'f12f1a71-f130-4026-a053-6881b3b32f2f';

UPDATE camp_authors
SET why_it_matters = 'Bender''s "stochastic parrots" paper fundamentally challenged the scaling paradigm, arguing LLMs lack true understanding. As a computational linguist, her technical critique of language model limitations has become the academic foundation for skepticism about AGI-via-scaling.'
WHERE id = 'b154157d-7a37-4ab1-a69d-fa62b3a687ef';

UPDATE camp_authors
SET why_it_matters = 'Bender advocates for strong AI regulation focused on transparency, accountability, and preventing documented harms rather than speculative risks. Her academic credibility lends weight to regulatory interventionist arguments in policy circles and congressional testimony.'
WHERE id = 'd070d45e-f3ab-4347-a278-79c50e5e0ba3';

UPDATE camp_authors
SET why_it_matters = 'Bender challenges the "innovation at all costs" narrative, arguing it prioritizes corporate profits over public good. Her reframing of the debate as "whose innovation, for whose benefit" counters industry lobbying that positions regulation as inherently anti-innovation.'
WHERE id = '0bfff8b1-938b-4b98-ac2c-1e76cdb4a7b0';

UPDATE camp_authors
SET why_it_matters = 'Bender argues that "democratization" rhetoric often obscures how rapid AI deployment amplifies existing inequalities and harms marginalized communities. Her critique challenges the tech industry''s framing of open access as inherently beneficial, demanding accountability first.'
WHERE id = 'c795a127-ff1f-43da-9454-ab694c4de1dd';

UPDATE camp_authors
SET why_it_matters = 'Bender redirects safety discourse from speculative x-risks to documented harms: bias, labor exploitation, environmental costs. Her focus on "here and now" harms challenges the x-risk community and ensures marginalized communities remain central to AI ethics conversations.'
WHERE id = 'ed446e50-b918-426a-b857-720ee06a7d1f';

-- =====================================================
-- ERIK BRYNJOLFSSON (3 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Brynjolfsson argues AI adoption must be paired with organizational restructuring to realize productivity gains. His research on "complementary innovations" provides the academic foundation for understanding why simply deploying AI doesn''t guarantee competitive advantage without broader transformation.'
WHERE id = '2fd11ddd-e66e-40d8-85de-c5cafcbe2888';

UPDATE camp_authors
SET why_it_matters = 'Brynjolfsson emphasizes that whether AI augments or replaces workers is a choice, not technological destiny. His MIT research on human-AI collaboration provides empirical evidence that influences how companies design AI systems and policymakers craft workforce development programs.'
WHERE id = 'cf6b15a9-cdd6-440b-99a9-03428308ac57';

UPDATE camp_authors
SET why_it_matters = 'Brynjolfsson advocates that every company must become an AI company to survive, but emphasizes strategic complementarity over pure technology deployment. His research shows that AI value comes from pairing technology with organizational innovation, influencing how enterprises approach transformation.'
WHERE id = 'b9d03383-e394-4bdc-8f77-117d5ab4867c';

-- =====================================================
-- ETHAN MOLLICK (3 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Mollick argues organizations must experiment aggressively with AI now rather than waiting for perfect solutions. His Wharton research on AI productivity gains provides empirical evidence that drives executives to accelerate adoption, making him influential in corporate AI strategy discussions.'
WHERE id = '2f6bb308-f17f-44be-8675-4df00180b5f6';

UPDATE camp_authors
SET why_it_matters = 'Mollick''s research shows AI significantly boosts worker productivity when used as a "co-intelligence" tool. His optimistic but evidence-based perspective counters displacement fears and provides managers with frameworks for implementing AI to enhance rather than replace their teams.'
WHERE id = '6d7baa5a-99e8-4b45-9cde-35e1e35ce902';

UPDATE camp_authors
SET why_it_matters = 'Mollick argues AI adoption must be paired with organizational restructuring, not just technology deployment. His research shows successful AI implementation requires rethinking workflows and roles, challenging pure technology-led approaches and providing a more nuanced transformation framework.'
WHERE id = 'e208de0d-c80e-47db-b9c1-e55bfcfe5482';

-- =====================================================
-- FEI-FEI LI (4 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Li envisions AI as a tool for human augmentation that creates new job categories and enhances productivity rather than wholesale replacement. Her optimistic but grounded vision provides a counternarrative to displacement fears while maintaining focus on responsible deployment.'
WHERE id = 'c7a71a7f-33df-4ea7-b87d-0e1b0ec4b81e';

UPDATE camp_authors
SET why_it_matters = 'Li champions human-AI collaboration over full automation, arguing AI should enhance human judgment rather than replace it. As co-director of Stanford HAI, her vision of human-centered AI directly shapes how Fortune 500 companies approach AI implementation strategies.'
WHERE id = '68a0fa23-d17e-455e-b257-711de80ea8c7';

UPDATE camp_authors
SET why_it_matters = 'Li focuses regulatory attention on diversity, fairness, and representation in AI systems. Her work ensures AI governance debates include questions of equity and bias, not just safety or innovation, making her essential to inclusive AI policy frameworks.'
WHERE id = '4c2ad5b9-a3a9-4e5a-8ae8-ca7ae12b00f1';

UPDATE camp_authors
SET why_it_matters = 'Li advocates for AI adoption but insists on human-centered design that augments rather than replaces workers. Her "human-in-the-loop" approach provides enterprises with a middle path between aggressive automation and AI resistance, emphasizing ethical implementation.'
WHERE id = '0b9b803e-5af0-40d8-962e-d35fa68b3794';

-- =====================================================
-- GARY MARCUS (3 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Marcus directly opposes scaling optimism, arguing larger models just amplify existing limitations without solving fundamental problems like reasoning and reliability. His critiques force scaling advocates to address concerns about generalization failures and brittleness, shaping the terms of the scaling debate.'
WHERE id = '9344cd1b-a4ce-4fd7-94d9-48f18e5e03cc';

UPDATE camp_authors
SET why_it_matters = 'Marcus argues AI will displace many jobs while requiring fundamentally new approaches to achieve reliable automation. His skepticism about current AI''s capabilities challenges overly optimistic workforce transition narratives and pushes for more conservative planning around displacement risks.'
WHERE id = 'c49b13f0-b176-4901-b375-039ec73ff4cd';

UPDATE camp_authors
SET why_it_matters = 'Marcus is the most prominent critic of pure neural network approaches, arguing we need hybrid systems incorporating symbolic AI for robust reasoning. His persistent critique of deep learning limitations challenges the field''s consensus and keeps alternative approaches in research consideration.'
WHERE id = '13d472c6-8c21-4d5b-bff5-4bf66420f79d';

-- =====================================================
-- GEOFFREY HINTON (5 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Hinton, the "godfather of deep learning," recently acknowledged that backpropagation may not be how the brain learns and we need new approaches. When the inventor of the field questions its foundations, it lends enormous credibility to calls for architectural innovation beyond current paradigms.'
WHERE id = '2a5acf65-d75f-4673-a347-1d37c68dc0ea';

UPDATE camp_authors
SET why_it_matters = 'Hinton now opposes open-sourcing powerful AI models, fearing it enables bad actors and accelerates dangerous capabilities. His shift from academic openness to restriction carries weight because it represents deep learning''s founding figure reassessing fundamental principles.'
WHERE id = 'c4598a1f-6a43-4c4a-90e9-acd72feaa4a7';

UPDATE camp_authors
SET why_it_matters = 'Hinton warns that unconstrained innovation creates race dynamics where safety gets sacrificed for competitive advantage. His insider perspective on AI lab competition makes his warnings about the dangers of "innovation at all costs" particularly credible to policymakers.'
WHERE id = '8bdaabdf-b822-4bee-a68a-b21272edc4f5';

UPDATE camp_authors
SET why_it_matters = 'Hinton dramatically quit Google to warn about AI existential risks, comparing them to nuclear weapons. As a Turing Award winner and AI pioneer, his conversion from optimism to concern legitimizes x-risk arguments and influences how governments approach AI safety policy.'
WHERE id = '1216c3a3-b070-429f-9f12-338bcab20dc6';

UPDATE camp_authors
SET why_it_matters = 'Hinton predicts AI will eventually surpass humans at most intellectual tasks, causing massive job displacement. Coming from AI''s most celebrated researcher, this isn''t techno-pessimism but an informed forecast that legitimizes calls for universal basic income and workforce transition planning.'
WHERE id = 'c058f1cb-3927-4ac4-8bff-58229ad09595';

-- =====================================================
-- ILYA SUTSKEVER (2 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Sutskever co-authored the foundational work on neural scaling laws and led research behind GPT models. As co-founder of OpenAI and now SSI (Safe Superintelligence Inc.), his belief that scaling plus algorithmic improvements will achieve AGI directly shapes the research priorities of the most influential AI labs.'
WHERE id = '7754317c-7847-4850-8748-67ecea4a1103';

UPDATE camp_authors
SET why_it_matters = 'Sutskever recently suggested pre-training scaling may be hitting limits, requiring new approaches like test-time compute and reasoning. Coming from scaling''s chief architect, this acknowledgment legitimizes investment in post-scaling research directions and signals potential paradigm shifts in AI development strategies.'
WHERE id = 'e2c7700e-a5b2-4008-8d2b-432c09eeff8f';

-- =====================================================
-- JASON LEMKIN (1 relationship)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Lemkin, a leading SaaS investor, argues AI will enable 10x productivity gains that fundamentally transform B2B software economics. His analysis of AI-native SaaS companies shapes how venture capital flows to enterprise AI and what metrics investors use to evaluate AI business model viability.'
WHERE id = 'c573cb47-7c74-430a-9b57-9c606d810c56';

-- =====================================================
-- JENSEN HUANG (2 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Huang leads NVIDIA, the essential infrastructure provider for AI training and deployment. His pronouncements that "AI is the most important technology of our time" and enterprises must invest now directly influence capital allocation as companies justify billions in GPU purchases and data center buildouts.'
WHERE id = '05ff01dc-10bf-44a9-938b-86b93bea7c6d';

UPDATE camp_authors
SET why_it_matters = 'Huang built NVIDIA into the infrastructure backbone enabling AI scaling through specialized hardware (GPUs, TPUs). His vision of "accelerated computing" provides the technical foundation that makes scaling possible, directly influencing which AI approaches get pursued based on hardware economics.'
WHERE id = 'e4cdbce3-3890-4202-a0ad-3b5c08b99c60';

-- =====================================================
-- KATE CRAWFORD (3 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Crawford advocates for regulation addressing AI''s systemic impacts on labor, environment, and power structures—not just individual harms. Her interdisciplinary approach (combining tech, geography, sociology) expands the regulatory agenda beyond narrow technical fixes to structural reforms.'
WHERE id = '48a7fee8-3fb4-45db-b247-28757e473add';

UPDATE camp_authors
SET why_it_matters = 'Crawford challenges the assumption that making AI widely available solves inequity, arguing it can amplify existing power structures. Her critical perspective ensures "democratization" claims are scrutinized for who actually benefits and whether marginalized communities have meaningful input.'
WHERE id = '582c209e-2ddb-4d73-b384-11d0d0aa4b56';

UPDATE camp_authors
SET why_it_matters = 'Crawford''s work "Atlas of AI" exposes the material and social costs of AI: resource extraction, labor exploitation, environmental damage. Her research ensures AI ethics includes supply chain accountability and challenges the "software is weightless" framing that ignores physical impacts.'
WHERE id = '5d9b7e1e-6217-4361-8460-b3baf8caa579';

-- =====================================================
-- MARC ANDREESSEN (6 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Andreessen argues that AI regulation will create regulatory capture favoring big tech incumbents while crushing startups. This perspective directly counters regulatory interventionist arguments and is frequently cited by industry lobbyists opposing AI safety legislation.'
WHERE id = '6f8970e2-4d22-4a3b-a3b3-f95dfe88f5f5';

UPDATE camp_authors
SET why_it_matters = 'Andreessen publicly dismisses AI safety concerns as "moral panic" and regulatory capture attempts. His essay "Why AI Will Save the World" represents the strongest counter-narrative to x-risk focused safety research, influencing how tech leaders frame AI risks.'
WHERE id = '75c6e27a-1157-449e-b300-7f9c9cf8f4c6';

UPDATE camp_authors
SET why_it_matters = 'Andreessen advocates that enterprises must adopt AI aggressively or face obsolescence. His venture capital firm a16z has invested billions based on this thesis, directly shaping which AI enterprise products get funded and which businesses pursue AI-first strategies.'
WHERE id = '8730c5b5-5e90-4513-9d3b-9e11518724c2';

UPDATE camp_authors
SET why_it_matters = 'Andreessen is the most prominent voice in tech opposing AI regulation, framing it as stifling innovation and benefiting incumbents. His political influence and funding make him central to the deregulation wing of AI policy debates in Washington.'
WHERE id = 'd58e24e1-c5c2-427b-931a-67d05a3e6010';

UPDATE camp_authors
SET why_it_matters = 'As one of Silicon Valley''s most influential investors, Andreessen''s belief that scaling will deliver AGI represents the mainstream VC perspective funding most AI development. His pushback against "we need new approaches" narratives shapes billions in capital allocation toward scaling-focused labs.'
WHERE id = '82dabe64-74ff-4a21-a302-8e6964d3986c';

UPDATE camp_authors
SET why_it_matters = 'Andreessen champions unrestricted AI deployment and open-sourcing as essential for innovation. His "techno-optimist manifesto" directly opposes safety-first approaches, making him the most vocal advocate for rapid, decentralized AI proliferation in the tech industry.'
WHERE id = '635553ea-fe0f-4200-8c36-a42b6b200137';

-- =====================================================
-- MARK ZUCKERBERG (4 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Zuckerberg opposes AI-specific regulation, arguing existing laws suffice and new rules would cement big tech advantages. As CEO of a company previously fined billions for privacy violations, his anti-regulation stance is viewed skeptically but carries significant lobbying weight.'
WHERE id = 'a62aabc0-446e-41f2-a9a9-fd591b6803ed';

UPDATE camp_authors
SET why_it_matters = 'Zuckerberg argues safety concerns are often exaggerated to justify monopolistic control by leading labs. His framing positions open-source as the true safety approach through transparency and distributed oversight, directly challenging OpenAI''s and Anthropic''s closed-model strategies.'
WHERE id = '658a548b-3c9f-4821-a2c3-a24fbbf67857';

UPDATE camp_authors
SET why_it_matters = 'Zuckerberg rebuilt Meta around AI-first products, from feed ranking to ad targeting to generative features. With 3 billion users, Meta''s aggressive AI integration demonstrates how tech platforms use AI to maintain competitive advantage, influencing industry-wide adoption strategies.'
WHERE id = '9afd5fe0-5748-4f12-b3ec-cff3c2744f80';

UPDATE camp_authors
SET why_it_matters = 'Zuckerberg committed Meta to open-sourcing LLaMA models, arguing openness drives innovation and prevents AI monopolies. With Meta''s resources, his bet on open-source fundamentally shapes the open vs. closed debate and provides free alternatives to proprietary models.'
WHERE id = '7ea50f9a-a440-4be3-9868-cd3187533800';

-- =====================================================
-- MAX TEGMARK (4 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Tegmark founded the Future of Life Institute to focus AI safety research on existential risks from superintelligence. His book "Life 3.0" popularized x-risk concerns beyond academic circles, making him a key figure in directing philanthropic funding toward long-term safety research.'
WHERE id = '6e64ebba-44ba-42ca-9b2d-a14c0cd464fb';

UPDATE camp_authors
SET why_it_matters = 'Tegmark advocates for international AI governance frameworks similar to nuclear weapons treaties, arguing uncoordinated national regulation is insufficient for existential risks. His proposals for global coordination influence how policymakers think about transnational AI governance.'
WHERE id = '2b3efdf8-2e44-44c7-b751-969f78ec1001';

UPDATE camp_authors
SET why_it_matters = 'Tegmark argues rapid AI development without safety guarantees risks catastrophic outcomes, advocating for pauses if necessary. His willingness to challenge the "move fast" ethos makes him a prominent voice for precautionary approaches despite industry resistance.'
WHERE id = '67e2f520-074a-4694-9763-1f6c49515618';

UPDATE camp_authors
SET why_it_matters = 'Tegmark predicts AI will automate most jobs, requiring fundamental economic restructuring including potential universal basic income. His physicist''s perspective on technological inevitability makes him a credible voice for preparing society for massive labor market disruption.'
WHERE id = '89ee7fa9-04d3-43b6-aaba-8609aa9846e3';

-- =====================================================
-- MUSTAFA SULEYMAN (1 relationship)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Suleyman''s book "The Coming Wave" argues for "containment" strategies to manage AI''s disruptive potential through regulation and international coordination. His proposals for AI oversight regimes influence policymakers seeking concrete frameworks for managing transformative AI''s societal impacts.'
WHERE id = 'cd93de59-e9b3-4d06-a1cd-1aa58af15fdf';

-- =====================================================
-- REID HOFFMAN (1 relationship)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Hoffman champions AI as creating "superhuman" workers through human-AI collaboration. His book "Impromptu" with GPT-4 demonstrates this vision practically, influencing how business leaders think about empowering employees with AI rather than replacing them, which shapes corporate AI adoption strategies.'
WHERE id = 'aeb1d6d7-5b96-413d-aabd-5219df678250';

-- =====================================================
-- SAM ALTMAN (3 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Altman positions OpenAI as pursuing AGI through scaling with proper safety research. His framing of OpenAI as the "responsible" path to AGI—faster than cautious academics but safer than reckless competitors—shapes how policymakers view the spectrum of AI development approaches.'
WHERE id = 'b28de600-9040-478c-a357-fa3543448698';

UPDATE camp_authors
SET why_it_matters = 'Altman transitioned OpenAI from open-source to controlled API access, arguing powerful AI requires responsible gatekeeping. His shift legitimizes the "closed for safety" approach and directly opposes Meta''s and others'' full open-source strategies, making him central to the open vs. closed debate.'
WHERE id = '93f1a584-5e47-4a36-b057-3933a04c13df';

UPDATE camp_authors
SET why_it_matters = 'Altman acknowledges current approaches may hit limits but argues incremental innovations will extend scaling''s effectiveness. His position represents mainstream AI lab thinking that scaling remains the primary path forward, even as challenges with pure pre-training emerge.'
WHERE id = 'e4d2ddfe-e24d-4043-84ca-28f06bb7fe0a';

-- =====================================================
-- SAM HARRIS (2 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Harris warns that unconstrained AI innovation creates race dynamics where safety gets sacrificed for competitive advantage. His philosophical framing makes existential risk accessible to non-technical audiences and legitimizes calls for international coordination to slow dangerous development.'
WHERE id = '2c05700a-8d2c-4f76-8ddc-853c321ad109';

UPDATE camp_authors
SET why_it_matters = 'Harris advocates for unprecedented international cooperation to manage AGI development, comparing it to nuclear weapons governance. His arguments for treating AGI as a civilizational challenge rather than a business opportunity influence how philosophers and policymakers think about AI''s unique governance requirements.'
WHERE id = '3509af39-44dd-496a-99bc-53a9796e7613';

-- =====================================================
-- SATYA NADELLA (2 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Nadella rebuilt Microsoft around "Copilot" AI assistants integrated into every product, demonstrating how incumbents can use AI to defend and extend market position. His execution of AI-everywhere strategy provides the playbook that other enterprise software companies study to avoid disruption from AI-native startups.'
WHERE id = '86e40b2f-61a7-4120-977e-901b80a6c088';

UPDATE camp_authors
SET why_it_matters = 'Nadella acknowledges AI will displace some jobs while creating new ones, emphasizing the need for workforce reskilling. His balanced perspective helps enterprises navigate the tension between AI-driven productivity gains and workforce concerns, making transformation more politically feasible.'
WHERE id = 'cb8c5ca5-d743-41a6-9804-8edaa11202f4';

-- =====================================================
-- SUNDAR PICHAI (1 relationship)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Pichai declared Google an "AI-first company" in 2016 and restructured around AI integration into all products. His commitment of massive resources to AI development (DeepMind acquisition, TPU development) demonstrates how tech giants use AI to maintain competitive moats against startups and rivals.'
WHERE id = '02f7614b-9200-4910-8bfd-ff029be2303a';

-- =====================================================
-- TIMNIT GEBRU (4 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Gebru argues rapid AI deployment without accountability exacerbates existing inequalities and harms vulnerable populations. Her critique challenges tech industry "democratization" rhetoric, demanding transparency and community input before deployment, not after harm occurs.'
WHERE id = '8abe467a-a595-4450-b615-1672ffe64539';

UPDATE camp_authors
SET why_it_matters = 'Gebru co-authored "On the Dangers of Stochastic Parrots," arguing that scaling LLMs amplifies environmental and social harms without achieving understanding. Her technical critique of the scaling paradigm challenges the industry consensus and demands consideration of non-scaling research directions.'
WHERE id = '3f447a72-5e06-488e-8f8f-af5c4bcebc3c';

UPDATE camp_authors
SET why_it_matters = 'Gebru redirects AI safety toward documented systemic harms—algorithmic bias, worker exploitation, environmental damage—rather than speculative x-risks. Her research ensures marginalized communities remain central to safety conversations and challenges who gets to define "safety."'
WHERE id = '44c93cab-3845-4a9f-abfc-b5e4716eb45c';

UPDATE camp_authors
SET why_it_matters = 'Gebru advocates for strong regulation requiring transparency, impact assessments, and accountability for AI harms. As founder of DAIR (Distributed AI Research Institute), her work on algorithmic accountability directly informs regulatory proposals in the EU and US.'
WHERE id = 'd8ba538c-a2a6-4579-bb5a-cc51746d5828';

-- =====================================================
-- YANN LECUN (3 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'LeCun recently suggested pre-training scaling may be hitting limits, requiring new approaches like world models and objective-driven AI. Coming from a Turing Award winner who pioneered deep learning, this acknowledgment legitimizes investment in post-scaling research directions.'
WHERE id = 'ff8ce976-52b0-4d95-bcf0-5d7fc04945e2';

UPDATE camp_authors
SET why_it_matters = 'LeCun, a Turing Award winner and chief AI scientist at Meta, believes scaling is necessary but insufficient—we also need better architectures like world models. His vision of "objective-driven AI" provides an alternative technical roadmap to pure scaling that influences research directions.'
WHERE id = '1a2b3d59-5494-416a-9989-7da42dbb269f';

UPDATE camp_authors
SET why_it_matters = 'LeCun supports thoughtful AI governance but opposes heavy-handed regulation that would stifle research and favor incumbents. His measured stance provides a middle ground between anti-regulation absolutists and regulatory interventionists, influencing how academic researchers approach policy debates.'
WHERE id = '4bc4b92f-4de9-4c26-ae5d-9da55c39b20e';

-- =====================================================
-- YOSHUA BENGIO (3 relationships)
-- =====================================================

UPDATE camp_authors
SET why_it_matters = 'Bengio advocates for governance frameworks that allow beneficial AI while preventing catastrophic risks, directly challenging "innovation first, regulate later" approaches. As a founding researcher, his call for proactive governance counters industry arguments that regulation is premature.'
WHERE id = '2323aaea-13db-4ba8-8e7a-b420b05c7207';

UPDATE camp_authors
SET why_it_matters = 'Bengio acknowledges AI will significantly disrupt labor markets but emphasizes this isn''t predetermined—policy choices determine whether AI augments or replaces workers. His nuanced position bridges techno-optimists and pessimists, offering a path forward through deliberate policy design.'
WHERE id = '57925e1f-75d1-46fc-937b-7057dfbb9006';

UPDATE camp_authors
SET why_it_matters = 'Bengio, a Turing Award winner, argues current deep learning lacks causal reasoning and world models needed for human-level AI. His research agenda on causality and system 2 thinking provides the technical roadmap for researchers seeking approaches beyond pure scaling.'
WHERE id = '97c66350-3c89-48e1-b0a8-79508755dac3';

-- =====================================================
-- END OF WHY IT MATTERS ENRICHMENT
-- =====================================================
-- Total: 91 author-camp relationships enriched
-- All quotes now have domain-specific context explaining their significance
-- =====================================================
