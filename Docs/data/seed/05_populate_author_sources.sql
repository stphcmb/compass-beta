-- Populate sources for all 32 authors with real URLs
-- Format: {"title": "...", "type": "...", "year": "...", "url": "..."}

-- 1. Reid Hoffman
UPDATE authors SET sources = '[
  {"title": "Impromptu: Amplifying Our Humanity Through AI", "type": "Book", "year": "2023", "url": "https://www.amazon.com/Impromptu-Amplifying-Our-Humanity-Through/dp/B0BXQSZK5Q"},
  {"title": "Masters of Scale Podcast", "type": "Podcast", "year": "2024", "url": "https://mastersofscale.com/"},
  {"title": "Greylock Partners Blog", "type": "Blog", "year": "2024", "url": "https://greylock.com/greymatter/"}
]'::jsonb WHERE name = 'Reid Hoffman';

-- 2. Gary Marcus
UPDATE authors SET sources = '[
  {"title": "Rebooting AI", "type": "Book", "year": "2019", "url": "https://www.penguinrandomhouse.com/books/603982/rebooting-ai-by-gary-marcus-and-ernest-davis/"},
  {"title": "Deep Learning: A Critical Appraisal", "type": "Paper", "year": "2018", "url": "https://arxiv.org/abs/1801.00631"},
  {"title": "The Road to AI We Can Trust", "type": "Substack", "year": "2024", "url": "https://garymarcus.substack.com/"}
]'::jsonb WHERE name = 'Gary Marcus';

-- 3. Fei-Fei Li
UPDATE authors SET sources = '[
  {"title": "The Worlds I See", "type": "Book", "year": "2023", "url": "https://www.penguinrandomhouse.com/books/723951/the-worlds-i-see-by-fei-fei-li/"},
  {"title": "ImageNet Large Scale Visual Recognition Challenge", "type": "Paper", "year": "2015", "url": "https://arxiv.org/abs/1409.0575"},
  {"title": "Stanford HAI", "type": "Institute", "year": "2024", "url": "https://hai.stanford.edu/"}
]'::jsonb WHERE name = 'Fei-Fei Li';

-- 4. Emily M. Bender
UPDATE authors SET sources = '[
  {"title": "On the Dangers of Stochastic Parrots", "type": "Paper", "year": "2021", "url": "https://dl.acm.org/doi/10.1145/3442188.3445922"},
  {"title": "Climbing towards NLU", "type": "Paper", "year": "2020", "url": "https://aclanthology.org/2020.acl-main.463/"},
  {"title": "Mystery AI Hype Theater 3000", "type": "Podcast", "year": "2024", "url": "https://www.mysteryai.net/"}
]'::jsonb WHERE name = 'Emily M. Bender';

-- 5. Jason Lemkin
UPDATE authors SET sources = '[
  {"title": "SaaStr Blog", "type": "Blog", "year": "2024", "url": "https://www.saastr.com/blog/"},
  {"title": "SaaStr Annual Conference", "type": "Conference", "year": "2024", "url": "https://www.saastrannual.com/"},
  {"title": "SaaStr Podcast", "type": "Podcast", "year": "2024", "url": "https://www.saastr.com/podcast/"}
]'::jsonb WHERE name = 'Jason Lemkin';

-- 6. Ilya Sutskever
UPDATE authors SET sources = '[
  {"title": "Sequence to Sequence Learning", "type": "Paper", "year": "2014", "url": "https://arxiv.org/abs/1409.3215"},
  {"title": "Language Models are Few-Shot Learners (GPT-3)", "type": "Paper", "year": "2020", "url": "https://arxiv.org/abs/2005.14165"},
  {"title": "NeurIPS 2024 Talk", "type": "Talk", "year": "2024", "url": "https://neurips.cc/"}
]'::jsonb WHERE name = 'Ilya Sutskever';

-- 7. Andrew Ng
UPDATE authors SET sources = '[
  {"title": "AI Transformation Playbook", "type": "Guide", "year": "2018", "url": "https://landing.ai/resource/ai-transformation-playbook/"},
  {"title": "Machine Learning Specialization", "type": "Course", "year": "2022", "url": "https://www.coursera.org/specializations/machine-learning-introduction"},
  {"title": "The Batch Newsletter", "type": "Newsletter", "year": "2024", "url": "https://www.deeplearning.ai/the-batch/"}
]'::jsonb WHERE name = 'Andrew Ng';

-- 8. Demis Hassabis
UPDATE authors SET sources = '[
  {"title": "AlphaFold: Protein Structure Prediction", "type": "Paper", "year": "2021", "url": "https://www.nature.com/articles/s41586-021-03819-2"},
  {"title": "Mastering the Game of Go", "type": "Paper", "year": "2016", "url": "https://www.nature.com/articles/nature16961"},
  {"title": "DeepMind Blog", "type": "Blog", "year": "2024", "url": "https://deepmind.google/discover/blog/"}
]'::jsonb WHERE name = 'Demis Hassabis';

-- 9. Satya Nadella
UPDATE authors SET sources = '[
  {"title": "Hit Refresh", "type": "Book", "year": "2017", "url": "https://www.amazon.com/Hit-Refresh-Rediscover-Microsofts-Everyone/dp/0062652508"},
  {"title": "Microsoft AI Blog", "type": "Blog", "year": "2024", "url": "https://blogs.microsoft.com/ai/"},
  {"title": "LinkedIn Posts", "type": "Social", "year": "2024", "url": "https://www.linkedin.com/in/satyanadella/"}
]'::jsonb WHERE name = 'Satya Nadella';

-- 10. Mustafa Suleyman
UPDATE authors SET sources = '[
  {"title": "The Coming Wave", "type": "Book", "year": "2023", "url": "https://www.the-coming-wave.com/"},
  {"title": "Microsoft AI CEO Announcements", "type": "Blog", "year": "2024", "url": "https://blogs.microsoft.com/blog/author/mustafa-suleyman/"},
  {"title": "TED Talk: AI and the Future", "type": "Talk", "year": "2023", "url": "https://www.ted.com/speakers/mustafa_suleyman"}
]'::jsonb WHERE name = 'Mustafa Suleyman';

-- 11. Geoffrey Hinton
UPDATE authors SET sources = '[
  {"title": "Deep Learning (Nature)", "type": "Paper", "year": "2015", "url": "https://www.nature.com/articles/nature14539"},
  {"title": "ImageNet Classification with Deep CNNs", "type": "Paper", "year": "2012", "url": "https://papers.nips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html"},
  {"title": "Nobel Prize Lecture", "type": "Lecture", "year": "2024", "url": "https://www.nobelprize.org/prizes/physics/2024/hinton/facts/"}
]'::jsonb WHERE name = 'Geoffrey Hinton';

-- 12. Yann LeCun
UPDATE authors SET sources = '[
  {"title": "Deep Learning (Nature)", "type": "Paper", "year": "2015", "url": "https://www.nature.com/articles/nature14539"},
  {"title": "A Path Towards Autonomous Machine Intelligence", "type": "Paper", "year": "2022", "url": "https://openreview.net/pdf?id=BZ5a1r-kVsf"},
  {"title": "Meta AI Blog", "type": "Blog", "year": "2024", "url": "https://ai.meta.com/blog/"}
]'::jsonb WHERE name = 'Yann LeCun';

-- 13. Sam Altman
UPDATE authors SET sources = '[
  {"title": "OpenAI Blog", "type": "Blog", "year": "2024", "url": "https://openai.com/blog/"},
  {"title": "Moore''s Law for Everything", "type": "Essay", "year": "2021", "url": "https://moores.samaltman.com/"},
  {"title": "How To Be Successful", "type": "Blog", "year": "2019", "url": "https://blog.samaltman.com/how-to-be-successful"}
]'::jsonb WHERE name = 'Sam Altman';

-- 14. Erik Brynjolfsson
UPDATE authors SET sources = '[
  {"title": "The Turing Trap", "type": "Paper", "year": "2022", "url": "https://www.amacad.org/publication/turing-trap-promise-peril-human-artificial-intelligence"},
  {"title": "The Second Machine Age", "type": "Book", "year": "2014", "url": "https://www.amazon.com/Second-Machine-Age-Prosperity-Technologies/dp/0393350649"},
  {"title": "Stanford Digital Economy Lab", "type": "Institute", "year": "2024", "url": "https://digitaleconomy.stanford.edu/"}
]'::jsonb WHERE name = 'Erik Brynjolfsson';

-- 15. Balaji Srinivasan
UPDATE authors SET sources = '[
  {"title": "The Network State", "type": "Book", "year": "2022", "url": "https://thenetworkstate.com/"},
  {"title": "Balaji.com Blog", "type": "Blog", "year": "2024", "url": "https://balajis.com/"},
  {"title": "The Network State Podcast", "type": "Podcast", "year": "2024", "url": "https://podcast.thenetworkstate.com/"}
]'::jsonb WHERE name = 'Balaji Srinivasan';

-- 16. Max Tegmark
UPDATE authors SET sources = '[
  {"title": "Life 3.0: Being Human in the Age of AI", "type": "Book", "year": "2017", "url": "https://www.amazon.com/Life-3-0-Being-Human-Artificial/dp/1101946598"},
  {"title": "Future of Life Institute", "type": "Institute", "year": "2024", "url": "https://futureoflife.org/"},
  {"title": "AI Safety Research", "type": "Papers", "year": "2024", "url": "https://space.mit.edu/home/tegmark/ai.html"}
]'::jsonb WHERE name = 'Max Tegmark';

-- 17. Yoshua Bengio
UPDATE authors SET sources = '[
  {"title": "Deep Learning (Nature)", "type": "Paper", "year": "2015", "url": "https://www.nature.com/articles/nature14539"},
  {"title": "Attention Is All You Need", "type": "Paper", "year": "2017", "url": "https://arxiv.org/abs/1706.03762"},
  {"title": "Mila - Quebec AI Institute", "type": "Institute", "year": "2024", "url": "https://mila.quebec/en/"}
]'::jsonb WHERE name = 'Yoshua Bengio';

-- 18. Andrej Karpathy
UPDATE authors SET sources = '[
  {"title": "Neural Networks: Zero to Hero", "type": "Course", "year": "2023", "url": "https://karpathy.ai/zero-to-hero.html"},
  {"title": "The Unreasonable Effectiveness of RNNs", "type": "Blog", "year": "2015", "url": "https://karpathy.github.io/2015/05/21/rnn-effectiveness/"},
  {"title": "YouTube Channel", "type": "Video", "year": "2024", "url": "https://www.youtube.com/@AndrejKarpathy"}
]'::jsonb WHERE name = 'Andrej Karpathy';

-- 19. Kate Crawford
UPDATE authors SET sources = '[
  {"title": "Atlas of AI", "type": "Book", "year": "2021", "url": "https://www.amazon.com/Atlas-AI-Power-Politics-Planetary/dp/0300209576"},
  {"title": "Excavating AI", "type": "Project", "year": "2019", "url": "https://excavating.ai/"},
  {"title": "AI Now Institute", "type": "Institute", "year": "2024", "url": "https://ainowinstitute.org/"}
]'::jsonb WHERE name = 'Kate Crawford';

-- 20. Clement Delangue
UPDATE authors SET sources = '[
  {"title": "Hugging Face Blog", "type": "Blog", "year": "2024", "url": "https://huggingface.co/blog"},
  {"title": "Transformers Library", "type": "Library", "year": "2024", "url": "https://github.com/huggingface/transformers"},
  {"title": "Hugging Face Hub", "type": "Platform", "year": "2024", "url": "https://huggingface.co/"}
]'::jsonb WHERE name = 'Clement Delangue';

-- 21. Allie K. Miller
UPDATE authors SET sources = '[
  {"title": "AI Trends Newsletter", "type": "Newsletter", "year": "2024", "url": "https://www.alliekmiller.com/newsletter"},
  {"title": "LinkedIn AI Content", "type": "Social", "year": "2024", "url": "https://www.linkedin.com/in/alliekmiller/"},
  {"title": "Machine Learning Interviews Book", "type": "Book", "year": "2023", "url": "https://www.alliekmiller.com/"}
]'::jsonb WHERE name = 'Allie K. Miller';

-- 22. Elon Musk
UPDATE authors SET sources = '[
  {"title": "xAI Announcements", "type": "Blog", "year": "2024", "url": "https://x.ai/"},
  {"title": "Tesla AI Day", "type": "Event", "year": "2023", "url": "https://www.tesla.com/AI"},
  {"title": "X/Twitter Posts", "type": "Social", "year": "2024", "url": "https://x.com/elonmusk"}
]'::jsonb WHERE name = 'Elon Musk';

-- 23. Dario Amodei
UPDATE authors SET sources = '[
  {"title": "Anthropic Research", "type": "Blog", "year": "2024", "url": "https://www.anthropic.com/research"},
  {"title": "Constitutional AI", "type": "Paper", "year": "2022", "url": "https://arxiv.org/abs/2212.08073"},
  {"title": "Core Views on AI Safety", "type": "Blog", "year": "2023", "url": "https://www.anthropic.com/news/core-views-on-ai-safety"}
]'::jsonb WHERE name = 'Dario Amodei';

-- 24. Ben Thompson
UPDATE authors SET sources = '[
  {"title": "Stratechery", "type": "Newsletter", "year": "2024", "url": "https://stratechery.com/"},
  {"title": "Exponent Podcast", "type": "Podcast", "year": "2024", "url": "https://exponent.fm/"},
  {"title": "Sharp Tech Podcast", "type": "Podcast", "year": "2024", "url": "https://sharptech.fm/"}
]'::jsonb WHERE name = 'Ben Thompson';

-- 25. Sam Harris
UPDATE authors SET sources = '[
  {"title": "Making Sense Podcast", "type": "Podcast", "year": "2024", "url": "https://www.samharris.org/podcasts"},
  {"title": "Can We Build AI Without Losing Control?", "type": "TED Talk", "year": "2016", "url": "https://www.ted.com/talks/sam_harris_can_we_build_ai_without_losing_control_over_it"},
  {"title": "Waking Up App", "type": "App", "year": "2024", "url": "https://www.wakingup.com/"}
]'::jsonb WHERE name = 'Sam Harris';

-- 26. Ethan Mollick
UPDATE authors SET sources = '[
  {"title": "Co-Intelligence: Living and Working with AI", "type": "Book", "year": "2024", "url": "https://www.amazon.com/Co-Intelligence-Living-Working-Ethan-Mollick/dp/059371671X"},
  {"title": "One Useful Thing", "type": "Substack", "year": "2024", "url": "https://www.oneusefulthing.org/"},
  {"title": "Wharton AI Research", "type": "Research", "year": "2024", "url": "https://www.wharton.upenn.edu/"}
]'::jsonb WHERE name = 'Ethan Mollick';

-- 27. Mark Zuckerberg
UPDATE authors SET sources = '[
  {"title": "Meta AI Blog", "type": "Blog", "year": "2024", "url": "https://ai.meta.com/blog/"},
  {"title": "LLaMA: Open Foundation Models", "type": "Paper", "year": "2023", "url": "https://arxiv.org/abs/2302.13971"},
  {"title": "Meta Connect Keynotes", "type": "Event", "year": "2024", "url": "https://www.metaconnect.com/"}
]'::jsonb WHERE name = 'Mark Zuckerberg';

-- 28. Jensen Huang
UPDATE authors SET sources = '[
  {"title": "NVIDIA GTC Keynotes", "type": "Event", "year": "2024", "url": "https://www.nvidia.com/gtc/"},
  {"title": "NVIDIA AI Blog", "type": "Blog", "year": "2024", "url": "https://blogs.nvidia.com/blog/category/deep-learning/"},
  {"title": "CUDA Platform", "type": "Platform", "year": "2024", "url": "https://developer.nvidia.com/cuda-zone"}
]'::jsonb WHERE name = 'Jensen Huang';

-- 29. Timnit Gebru
UPDATE authors SET sources = '[
  {"title": "On the Dangers of Stochastic Parrots", "type": "Paper", "year": "2021", "url": "https://dl.acm.org/doi/10.1145/3442188.3445922"},
  {"title": "Datasheets for Datasets", "type": "Paper", "year": "2021", "url": "https://arxiv.org/abs/1803.09010"},
  {"title": "DAIR Institute", "type": "Institute", "year": "2024", "url": "https://www.dair-institute.org/"}
]'::jsonb WHERE name = 'Timnit Gebru';

-- 30. Marc Andreessen
UPDATE authors SET sources = '[
  {"title": "Why AI Will Save the World", "type": "Essay", "year": "2023", "url": "https://a16z.com/ai-will-save-the-world/"},
  {"title": "The Techno-Optimist Manifesto", "type": "Essay", "year": "2023", "url": "https://a16z.com/the-techno-optimist-manifesto/"},
  {"title": "a16z Blog", "type": "Blog", "year": "2024", "url": "https://a16z.com/"}
]'::jsonb WHERE name = 'Marc Andreessen';

-- 31. Azeem Azhar
UPDATE authors SET sources = '[
  {"title": "Exponential: How Accelerating Technology Is Leaving Us Behind", "type": "Book", "year": "2021", "url": "https://www.amazon.com/Exponential-Accelerating-Technology-Leaving-Behind/dp/1635768276"},
  {"title": "Exponential View Newsletter", "type": "Newsletter", "year": "2024", "url": "https://www.exponentialview.co/"},
  {"title": "Exponential View Podcast", "type": "Podcast", "year": "2024", "url": "https://www.exponentialview.co/podcast/"}
]'::jsonb WHERE name = 'Azeem Azhar';

-- 32. Sundar Pichai
UPDATE authors SET sources = '[
  {"title": "Google AI Blog", "type": "Blog", "year": "2024", "url": "https://blog.google/technology/ai/"},
  {"title": "Google I/O Keynotes", "type": "Event", "year": "2024", "url": "https://io.google/"},
  {"title": "Gemini Announcements", "type": "Blog", "year": "2024", "url": "https://deepmind.google/technologies/gemini/"}
]'::jsonb WHERE name = 'Sundar Pichai';
