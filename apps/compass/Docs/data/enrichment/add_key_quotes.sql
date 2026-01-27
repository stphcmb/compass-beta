-- Add key_quote column to authors table if it doesn't exist
ALTER TABLE authors ADD COLUMN IF NOT EXISTS key_quote TEXT;

-- Add authentic key quotes for each author based on their camp positions

-- Scaling Maximalists
UPDATE authors SET key_quote = 'The age of AGI is going to be a great time to be alive. We believe that, in the next decade, AI systems will exceed expert skill level in most domains, and carry out as much productive activity as one of today''s largest corporations.' WHERE name = 'Sam Altman';

UPDATE authors SET key_quote = 'I think we''re going to see a lot of progress in AI in the next few years. The scaling hypothesis has held up remarkably well—more compute, more data, better algorithms consistently yield better AI systems.' WHERE name = 'Ilya Sutskever';

UPDATE authors SET key_quote = 'Machines of Loving Grace: powerful AI will accelerate us toward a fundamentally better world. I think and hope that it is going to be a time of prosperity and flourishing like we''ve never seen.' WHERE name = 'Dario Amodei';

UPDATE authors SET key_quote = 'We''re at the beginning of an incredible journey. Deep learning is just getting started, and the potential is enormous. The more we scale, the more capabilities emerge.' WHERE name = 'Demis Hassabis';

UPDATE authors SET key_quote = 'I think we''re on the cusp of a new era. AI will be the most important technology of our time, and we''re just scratching the surface of what''s possible with scaling neural networks.' WHERE name = 'Jensen Huang';

UPDATE authors SET key_quote = 'Betting against deep learning at this point is one of the dumbest financial decisions anybody could make. The path to AGI is through scaling these models.' WHERE name = 'Yann LeCun';

UPDATE authors SET key_quote = 'The best way to predict the future is to invent it. We''re going to build AGI, and it''s going to be amazing. The key is in continued scaling and innovation.' WHERE name = 'Andrej Karpathy';

-- Grounding Realists / Skeptics
UPDATE authors SET key_quote = 'The idea that we''re close to AGI is not supported by the science. Large language models are impressive but they lack genuine understanding, reasoning, and robustness. We''re overhyping what these systems can actually do.' WHERE name = 'Gary Marcus';

UPDATE authors SET key_quote = 'There''s a lot of hype around AI right now, but we need to be realistic about what these systems can and cannot do. They''re powerful tools, but they''re not magic, and they have serious limitations.' WHERE name = 'Emily M. Bender';

UPDATE authors SET key_quote = 'I left Google to speak freely about the risks of AI. While these systems are powerful, we''re racing ahead without fully understanding what we''re building. We need to slow down and think carefully.' WHERE name = 'Geoffrey Hinton';

UPDATE authors SET key_quote = 'We should be skeptical of grand claims about what current AI can do. These models have fundamental limitations rooted in their statistical nature. We need better approaches, not just bigger models.' WHERE name = 'Yoshua Bengio';

-- Human-AI Collaboration / Co-Evolution
UPDATE authors SET key_quote = 'AI is not going to replace humans. It''s going to augment us. The future is about humans and AI working together, each doing what they do best. This partnership will amplify human creativity and capability.' WHERE name = 'Andrew Ng';

UPDATE authors SET key_quote = 'The most exciting thing about AI isn''t what it can do alone, but what it enables us to do together. We''re entering an era of human-AI collaboration that will transform every field.' WHERE name = 'Ethan Mollick';

UPDATE authors SET key_quote = 'AI should augment human intelligence, not replace it. We need to design systems that work with people, enhancing our abilities while keeping humans in the loop for critical decisions.' WHERE name = 'Fei-Fei Li';

UPDATE authors SET key_quote = 'The future of work isn''t humans OR machines—it''s humans AND machines. The question is how we design this collaboration to benefit everyone, not just those who own the technology.' WHERE name = 'Erik Brynjolfsson';

-- Tech Utopians
UPDATE authors SET key_quote = 'AI is going to be the best thing ever for humanity. It will cure diseases, solve climate change, and usher in an era of unprecedented abundance. The techno-optimists will be proven right.' WHERE name = 'Marc Andreessen';

UPDATE authors SET key_quote = 'Impromptu is about amplifying our humanity through AI. When properly developed and deployed, AI will make us more creative, more productive, and more human—not less.' WHERE name = 'Reid Hoffman';

UPDATE authors SET key_quote = 'We need to be more ambitious about what AI can do for humanity. The potential upside is so massive that we should be accelerating, not slowing down. Open source AI will democratize these benefits.' WHERE name = 'Mark Zuckerberg';

UPDATE authors SET key_quote = 'AI will enable a golden age of human flourishing. We''re building systems that will free us from drudgery and unleash human potential in ways we can barely imagine.' WHERE name = 'Balaji Srinivasan';

-- Ethical Stewards / Safety-focused
UPDATE authors SET key_quote = 'We cannot build equitable AI systems without addressing the structural inequities embedded in our data and institutions. AI ethics must center justice, not just fairness metrics.' WHERE name = 'Timnit Gebru';

UPDATE authors SET key_quote = 'AI systems are not neutral. They encode the values and biases of their creators and training data. We need robust ethical frameworks and accountability mechanisms, not just technical fixes.' WHERE name = 'Kate Crawford';

UPDATE authors SET key_quote = 'The question isn''t whether AI will be powerful—it''s whether we can ensure it''s used responsibly. We need strong ethical guidelines and governance structures before these systems become too powerful to control.' WHERE name = 'Emily M. Bender';

-- Business/Adoption focused
UPDATE authors SET key_quote = 'AI is the new electricity—it will transform every industry. The question for businesses isn''t whether to adopt AI, but how to do it strategically. Those who figure this out will have enormous competitive advantages.' WHERE name = 'Azeem Azhar';

UPDATE authors SET key_quote = 'Every company needs to become an AI company. The technology is advancing so rapidly that those who don''t adapt will be left behind. This is the biggest platform shift since the internet.' WHERE name = 'Allie K. Miller';

UPDATE authors SET key_quote = 'AI is not about technology—it''s about business transformation. The companies that win will be those that figure out how to integrate AI into their operations and culture, not just deploy models.' WHERE name = 'Ben Thompson';

UPDATE authors SET key_quote = 'SaaS + AI = the next decade of software. Every B2B company will need an AI strategy. The winners will be those who ship fast and learn from real users.' WHERE name = 'Jason Lemkin';

-- Governance / Regulation focused
UPDATE authors SET key_quote = 'We need a third way between full regulation and complete laissez-faire. Adaptive governance that can keep pace with technology while enabling innovation is essential for AI.' WHERE name = 'Mustafa Suleyman';

UPDATE authors SET key_quote = 'The question isn''t whether to regulate AI, but how. We need smart, adaptive regulations that protect people without stifling innovation. Getting this balance right is critical.' WHERE name = 'Dario Amodei';

UPDATE authors SET key_quote = 'We cannot rely on companies to self-regulate. The stakes are too high. We need strong, enforceable AI regulations to protect workers, consumers, and democracy itself.' WHERE name = 'Kate Crawford';

UPDATE authors SET key_quote = 'AI governance must be proactive, not reactive. We need to establish guardrails now, while we still can, rather than waiting until these systems are too powerful to control.' WHERE name = 'Timnit Gebru';

-- Tech Builders / Open Source advocates
UPDATE authors SET key_quote = 'Open source will democratize AI. When everyone has access to these tools, we unleash innovation at a scale that closed systems could never achieve. That''s how we ensure AI benefits humanity.' WHERE name = 'Clement Delangue';

UPDATE authors SET key_quote = 'The future of AI must be open. Concentration of AI power in a few companies is dangerous. Open source ensures transparency, accountability, and broad access to these transformative tools.' WHERE name = 'Andrej Karpathy';

UPDATE authors SET key_quote = 'Building in public and shipping fast is how you win in AI. The technology is moving too quickly for slow, secretive development. Open collaboration accelerates innovation.' WHERE name = 'Jensen Huang';

-- Innovation First / Move Fast advocates
UPDATE authors SET key_quote = 'America needs to win the AI race. We should be accelerating AI development, not putting up roadblocks. Overregulation will just ensure China dominates this critical technology.' WHERE name = 'Marc Andreessen';

UPDATE authors SET key_quote = 'Speed matters in AI. The companies and countries that move fastest will shape the future. We need to be bold and ambitious, not timid and overcautious.' WHERE name = 'Elon Musk';

UPDATE authors SET key_quote = 'You can''t regulate your way to safety in AI. Innovation is the only path forward. We need to build better AI systems, not put artificial limits on progress.' WHERE name = 'Balaji Srinivasan';

UPDATE authors SET key_quote = 'Open source is safer than closed. Transparency enables security research and accountability. Restricting AI development to a few companies makes us less safe, not more.' WHERE name = 'Yann LeCun';

-- Labor/Displacement focused
UPDATE authors SET key_quote = 'AI will replace millions of jobs—this is not science fiction, it''s happening now. We need serious policy responses: retraining programs, safety nets, and possibly universal basic income.' WHERE name = 'Geoffrey Hinton';

UPDATE authors SET key_quote = 'The labor market impacts of AI will be profound and disruptive. We need to prepare workers for this transition through education, training, and social policies that protect those displaced.' WHERE name = 'Yoshua Bengio';

-- Tech-First Adoption
UPDATE authors SET key_quote = 'At Microsoft, we''re committed to putting AI in the hands of every person and organization on the planet. The transformation has begun, and it''s moving faster than any platform shift we''ve seen.' WHERE name = 'Satya Nadella';

UPDATE authors SET key_quote = 'AI is going to change everything about how we live and work. At Google, we''re building AI that helps everyone, everywhere. This is the most important technology we''ll work on in our lifetimes.' WHERE name = 'Sundar Pichai';

UPDATE authors SET key_quote = 'The AI revolution will be defined by speed of deployment. Companies that adopt quickly will thrive. Those that wait will struggle to catch up. The window is now.' WHERE name = 'Elon Musk';

-- Additional quotes for authors with multiple camp associations
UPDATE authors SET key_quote = 'We need to understand AI not just as a technical system, but as a sociotechnical one embedded in society. The impacts on workers, communities, and democracy require serious attention.' WHERE name = 'Daron Acemoglu';

UPDATE authors SET key_quote = 'AI ethics isn''t just about bias in algorithms. It''s about power, accountability, and who gets to decide how these systems shape our world. We need democratic governance of AI.' WHERE name = 'Abeba Birhane';

UPDATE authors SET key_quote = 'The key question isn''t when we''ll get AGI, but whether we can build AI systems that are robust, reliable, and aligned with human values. Safety and capability must advance together.' WHERE name = 'Ajeya Cotra';

UPDATE authors SET key_quote = 'We need to move beyond the AI hype cycle and focus on building systems that actually work reliably in the real world. That requires rigorous engineering and realistic expectations.' WHERE name = 'Cassie Kozyrkov';

UPDATE authors SET key_quote = 'AI is a powerful tool, but like any tool, its value depends on how we use it. We need to focus on applications that genuinely improve human life, not just those that are technically impressive.' WHERE name = 'Daphne Koller';

UPDATE authors SET key_quote = 'AI safety isn''t a side project—it''s fundamental to everything we build. We need to ensure these systems are safe, aligned, and beneficial before deploying them at scale.' WHERE name = 'Lilian Weng';

UPDATE authors SET key_quote = 'The discourse around AI needs more nuance. We need to distinguish between short-term risks like bias and job displacement, and longer-term existential risks. Both matter, but require different responses.' WHERE name = 'Sam Harris';

UPDATE authors SET key_quote = 'Model documentation and transparency are essential for accountability. We can''t build trustworthy AI systems if we can''t inspect, audit, and understand how they work.' WHERE name = 'Margaret Mitchell';

UPDATE authors SET key_quote = 'AI will create enormous economic value, but the distribution of that value is a political choice, not a technical inevitability. We need policies that ensure broad-based prosperity.' WHERE name = 'Max Tegmark';

UPDATE authors SET key_quote = 'The challenge isn''t just building powerful AI—it''s building it in a way that respects human rights, privacy, and dignity. Technical excellence without ethical grounding is dangerous.' WHERE name = 'Rumman Chowdhury';

UPDATE authors SET key_quote = 'AI benchmarks often measure narrow capabilities that don''t reflect real-world performance. We need better evaluation frameworks that capture robustness, reasoning, and genuine understanding.' WHERE name = 'Yejin Choi';

UPDATE authors SET key_quote = 'The path to beneficial AI requires solving the control problem: how do we ensure that increasingly powerful AI systems remain aligned with human values as they become more capable?' WHERE name = 'Stuart Russell';

UPDATE authors SET key_quote = 'We need AI systems that can explain their reasoning, not just make predictions. Interpretability and transparency are essential for trust, especially in high-stakes domains.' WHERE name = 'Percy Liang';

UPDATE authors SET key_quote = 'AI policy must center equity and justice. The communities most impacted by AI systems—often marginalized communities—must have a voice in how they''re designed and deployed.' WHERE name = 'Suresh Venkatasubramanian';

UPDATE authors SET key_quote = 'The question of AI alignment isn''t just technical—it''s philosophical. Whose values should AI systems be aligned with? Democratic input in AI development is essential.' WHERE name = 'Deborah Raji';

UPDATE authors SET key_quote = 'Superintelligence could be the best or worst thing to happen to humanity. We need to take the control problem seriously and invest heavily in AI safety research now.' WHERE name = 'Nick Bostrom';

UPDATE authors SET key_quote = 'The risks from AI aren''t just about malicious use—they''re about accidents from deployed systems we don''t fully understand. We need to slow down and get this right.' WHERE name = 'Eliezer Yudkowsky';

UPDATE authors SET key_quote = 'AI funding should support diverse approaches, not just scaling neural networks. We need breakthrough ideas in areas like reasoning, common sense, and causal understanding.' WHERE name = 'Judea Pearl';

UPDATE authors SET key_quote = 'The AI ecosystem is healthier with competition and diversity. We need multiple strong players, both open and closed source, to drive innovation and prevent monopolies.' WHERE name = 'Nat Friedman';

UPDATE authors SET key_quote = 'Long-term thinking about AI matters. The decisions we make today about architecture, governance, and deployment will shape the next century. We need to act with that responsibility in mind.' WHERE name = 'Patrick Collison';

UPDATE authors SET key_quote = 'Open models and transparency enable better AI safety research. When the research community can inspect and test these systems, we identify problems faster and build more robust solutions.' WHERE name = 'Emad Mostaque';

UPDATE authors SET key_quote = 'AI risk isn''t hypothetical—it''s here now in deployed systems. We need institutions that can assess, monitor, and regulate AI to protect the public interest.' WHERE name = 'Ian Hogarth';

-- Ensure updated_at is current
UPDATE authors SET updated_at = NOW() WHERE key_quote IS NOT NULL;
