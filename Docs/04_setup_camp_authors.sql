-- Step 1: Create camp_authors junction table
CREATE TABLE IF NOT EXISTS camp_authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  camp_id UUID NOT NULL REFERENCES camps(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  relevance TEXT DEFAULT 'strong',  -- strong, partial, emerging, challenging
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(camp_id, author_id)
);

-- Enable RLS
ALTER TABLE camp_authors ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on camp_authors" ON camp_authors
  FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_camp_authors_camp_id ON camp_authors(camp_id);
CREATE INDEX IF NOT EXISTS idx_camp_authors_author_id ON camp_authors(author_id);

-- Step 2: Insert author-camp mappings based on known positions
-- Domain 1: Technology (Scaling Maximalist vs Grounding Realist)
-- Domain 2: Society (Ethical Steward vs Tech Utopian)
-- Domain 3: Business (Tech First, Co-Evolution, Business Whisperers, Tech Builders)
-- Domain 4: Policy (Regulatory Interventionist, Adaptive Governance, Innovation First)
-- Domain 5: Workers (Displacement Realist, Human-AI Collaboration)

INSERT INTO camp_authors (camp_id, author_id, relevance) VALUES
-- SCALING MAXIMALISTS (believe in scaling laws)
('c5dcb027-cd27-4c91-adb4-aca780d15199', '31acd4f5-dc88-4b2d-8f95-13e25be7b630', 'strong'),  -- Ilya Sutskever
('c5dcb027-cd27-4c91-adb4-aca780d15199', '7818b5f7-c15a-4c2e-a2c2-1d5b38c1c55d', 'strong'),  -- Sam Altman
('c5dcb027-cd27-4c91-adb4-aca780d15199', '79e96ca1-74df-4c35-98b3-d748ee4a404e', 'strong'),  -- Dario Amodei
('c5dcb027-cd27-4c91-adb4-aca780d15199', '975f6fa4-27b0-4c7e-8c10-5feb9a20f53a', 'strong'),  -- Yann LeCun
('c5dcb027-cd27-4c91-adb4-aca780d15199', '769a849a-1a0e-4f32-bfa7-e4dc22fd3b07', 'strong'),  -- Andrej Karpathy
('c5dcb027-cd27-4c91-adb4-aca780d15199', 'b904516b-796e-485c-a40e-8c8ddedcd4da', 'strong'),  -- Demis Hassabis
('c5dcb027-cd27-4c91-adb4-aca780d15199', 'c79c8c16-2c02-45e5-a611-edf39a59aab6', 'strong'),  -- Jensen Huang

-- GROUNDING REALISTS (skeptical of pure scaling)
('207582eb-7b32-4951-9863-32fcf05944a1', 'a71757bc-81df-4774-a2cd-38d6e439963f', 'strong'),  -- Gary Marcus
('207582eb-7b32-4951-9863-32fcf05944a1', 'e53edbee-1e4a-4925-8654-456530947e43', 'strong'),  -- Emily M. Bender
('207582eb-7b32-4951-9863-32fcf05944a1', 'ce96b8da-a541-42d7-824e-17bb1b940cf0', 'partial'), -- Yoshua Bengio
('207582eb-7b32-4951-9863-32fcf05944a1', '4def8caf-119f-454f-b886-ab657c100a14', 'partial'), -- Geoffrey Hinton

-- ETHICAL STEWARDS (focus on harms, justice, power)
('7f64838f-59a6-4c87-8373-a023b9f448cc', 'e53edbee-1e4a-4925-8654-456530947e43', 'strong'),  -- Emily M. Bender
('7f64838f-59a6-4c87-8373-a023b9f448cc', 'a5540500-36db-4156-aa7c-b2368ea14f37', 'strong'),  -- Timnit Gebru
('7f64838f-59a6-4c87-8373-a023b9f448cc', 'f22b1d72-7313-4dcc-8c37-9d53dddfceb3', 'strong'),  -- Kate Crawford
('7f64838f-59a6-4c87-8373-a023b9f448cc', '4def8caf-119f-454f-b886-ab657c100a14', 'partial'), -- Geoffrey Hinton (AI safety concerns)
('7f64838f-59a6-4c87-8373-a023b9f448cc', '61da5680-4826-4735-9d60-1b9dff85f441', 'partial'), -- Max Tegmark

-- TECH UTOPIANS (optimistic about AI upside)
('fe19ae2d-99f2-4c30-a596-c9cd92bff41b', 'beb814e9-80e5-4d1e-a5d0-c8da96f3f2c7', 'strong'),  -- Marc Andreessen
('fe19ae2d-99f2-4c30-a596-c9cd92bff41b', '926deb3e-b2ce-4353-b818-7b9a99d3c363', 'strong'),  -- Reid Hoffman
('fe19ae2d-99f2-4c30-a596-c9cd92bff41b', '98ac3dc2-ac21-4432-b378-d4da3304a94a', 'strong'),  -- Balaji Srinivasan
('fe19ae2d-99f2-4c30-a596-c9cd92bff41b', '7818b5f7-c15a-4c2e-a2c2-1d5b38c1c55d', 'partial'), -- Sam Altman
('fe19ae2d-99f2-4c30-a596-c9cd92bff41b', 'a673fd04-54a5-4110-9aca-879432c061b7', 'partial'), -- Mark Zuckerberg

-- TECH FIRST (aggressive AI adoption)
('7e9a2196-71e7-423a-889c-6902bc678eac', 'beb814e9-80e5-4d1e-a5d0-c8da96f3f2c7', 'strong'),  -- Marc Andreessen
('7e9a2196-71e7-423a-889c-6902bc678eac', '7a54343a-9725-4b01-b429-82f77292efc8', 'strong'),  -- Elon Musk
('7e9a2196-71e7-423a-889c-6902bc678eac', 'a673fd04-54a5-4110-9aca-879432c061b7', 'strong'),  -- Mark Zuckerberg
('7e9a2196-71e7-423a-889c-6902bc678eac', '46787463-913c-441c-aa48-307583e61818', 'strong'),  -- Satya Nadella
('7e9a2196-71e7-423a-889c-6902bc678eac', '5f43345f-e812-465d-8643-6afcfb8eae1d', 'strong'),  -- Sundar Pichai

-- CO-EVOLUTION (human-AI collaboration focus)
('f19021ab-a8db-4363-adec-c2228dad6298', 'ee8bf960-867f-4a4c-b0a2-b46666054def', 'strong'),  -- Fei-Fei Li
('f19021ab-a8db-4363-adec-c2228dad6298', '1bff7c51-f589-4f0f-a9a3-e0d5b6e9889c', 'strong'),  -- Ethan Mollick
('f19021ab-a8db-4363-adec-c2228dad6298', '0aa83858-397b-4783-8807-c4982e6b4643', 'strong'),  -- Andrew Ng
('f19021ab-a8db-4363-adec-c2228dad6298', '8522c131-9a81-456a-ae2b-a3b3831f282a', 'strong'),  -- Erik Brynjolfsson
('f19021ab-a8db-4363-adec-c2228dad6298', '6e768cae-216e-47cd-9e8a-55763329c0b0', 'partial'), -- Azeem Azhar

-- BUSINESS WHISPERERS (translate AI to business outcomes)
('fe9464df-b778-44c9-9593-7fb3294fa6c3', '6b4a8777-2ca9-476c-838c-c2dbeedb3a36', 'strong'),  -- Ben Thompson
('fe9464df-b778-44c9-9593-7fb3294fa6c3', 'e5da632c-b427-465f-92ca-bac1a0599487', 'strong'),  -- Jason Lemkin
('fe9464df-b778-44c9-9593-7fb3294fa6c3', '39efe8bf-b6fb-4d67-812d-4da665446750', 'strong'),  -- Allie K. Miller
('fe9464df-b778-44c9-9593-7fb3294fa6c3', '6e768cae-216e-47cd-9e8a-55763329c0b0', 'strong'),  -- Azeem Azhar

-- TECH BUILDERS (hands-on infra builders)
('a076a4ce-f14c-47b5-ad01-c8c60135a494', '769a849a-1a0e-4f32-bfa7-e4dc22fd3b07', 'strong'),  -- Andrej Karpathy
('a076a4ce-f14c-47b5-ad01-c8c60135a494', 'd0b78d52-8cdd-474d-aa86-299abdad03c1', 'strong'),  -- Clement Delangue
('a076a4ce-f14c-47b5-ad01-c8c60135a494', 'c79c8c16-2c02-45e5-a611-edf39a59aab6', 'strong'),  -- Jensen Huang
('a076a4ce-f14c-47b5-ad01-c8c60135a494', '0aa83858-397b-4783-8807-c4982e6b4643', 'partial'), -- Andrew Ng

-- REGULATORY INTERVENTIONIST (strong regulation advocates)
('e8792297-e745-4c9f-a91d-4f87dd05cea2', 'a5540500-36db-4156-aa7c-b2368ea14f37', 'strong'),  -- Timnit Gebru
('e8792297-e745-4c9f-a91d-4f87dd05cea2', 'e53edbee-1e4a-4925-8654-456530947e43', 'strong'),  -- Emily M. Bender
('e8792297-e745-4c9f-a91d-4f87dd05cea2', 'f22b1d72-7313-4dcc-8c37-9d53dddfceb3', 'strong'),  -- Kate Crawford
('e8792297-e745-4c9f-a91d-4f87dd05cea2', '61da5680-4826-4735-9d60-1b9dff85f441', 'partial'), -- Max Tegmark

-- ADAPTIVE GOVERNANCE (flexible evolving governance)
('ee10cf4f-025a-47fc-be20-33d6756ec5cd', '0c5b032e-f8d6-48d7-8cff-fdfc6044bebc', 'strong'),  -- Mustafa Suleyman
('ee10cf4f-025a-47fc-be20-33d6756ec5cd', '79e96ca1-74df-4c35-98b3-d748ee4a404e', 'strong'),  -- Dario Amodei
('ee10cf4f-025a-47fc-be20-33d6756ec5cd', 'ee8bf960-867f-4a4c-b0a2-b46666054def', 'partial'), -- Fei-Fei Li
('ee10cf4f-025a-47fc-be20-33d6756ec5cd', 'c80cff42-4567-4ccb-bda0-aa0e8a5983d2', 'partial'), -- Sam Harris

-- INNOVATION FIRST (fears regulation stifles innovation)
('331b2b02-7f8d-4751-b583-16255a6feb50', 'beb814e9-80e5-4d1e-a5d0-c8da96f3f2c7', 'strong'),  -- Marc Andreessen
('331b2b02-7f8d-4751-b583-16255a6feb50', '7a54343a-9725-4b01-b429-82f77292efc8', 'strong'),  -- Elon Musk
('331b2b02-7f8d-4751-b583-16255a6feb50', '98ac3dc2-ac21-4432-b378-d4da3304a94a', 'strong'),  -- Balaji Srinivasan
('331b2b02-7f8d-4751-b583-16255a6feb50', '975f6fa4-27b0-4c7e-8c10-5feb9a20f53a', 'partial'), -- Yann LeCun

-- DISPLACEMENT REALIST (job loss disruptions expected)
('76f0d8c5-c9a8-4a26-ae7e-18f787000e18', '4def8caf-119f-454f-b886-ab657c100a14', 'strong'),  -- Geoffrey Hinton
('76f0d8c5-c9a8-4a26-ae7e-18f787000e18', 'ce96b8da-a541-42d7-824e-17bb1b940cf0', 'partial'), -- Yoshua Bengio
('76f0d8c5-c9a8-4a26-ae7e-18f787000e18', '61da5680-4826-4735-9d60-1b9dff85f441', 'partial'), -- Max Tegmark

-- HUMAN-AI COLLABORATION (augmentation not automation)
('d8d3cec4-f8ce-49b1-9a43-bb0d952db371', '8522c131-9a81-456a-ae2b-a3b3831f282a', 'strong'),  -- Erik Brynjolfsson
('d8d3cec4-f8ce-49b1-9a43-bb0d952db371', '1bff7c51-f589-4f0f-a9a3-e0d5b6e9889c', 'strong'),  -- Ethan Mollick
('d8d3cec4-f8ce-49b1-9a43-bb0d952db371', '0aa83858-397b-4783-8807-c4982e6b4643', 'strong'),  -- Andrew Ng
('d8d3cec4-f8ce-49b1-9a43-bb0d952db371', 'ee8bf960-867f-4a4c-b0a2-b46666054def', 'strong'),  -- Fei-Fei Li
('d8d3cec4-f8ce-49b1-9a43-bb0d952db371', '39efe8bf-b6fb-4d67-812d-4da665446750', 'partial')  -- Allie K. Miller

ON CONFLICT (camp_id, author_id) DO NOTHING;
