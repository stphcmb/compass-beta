import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Use service role key to bypass RLS for administrative operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function executeCampAssignments() {
  console.log('========================================');
  console.log('EXECUTING CAMP ASSIGNMENTS');
  console.log('========================================\n');

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  // Define all assignments
  const assignments = [
    // AI Safety / X-Risk Thought Leaders
    { name: 'Nick Bostrom', campId: '7f64838f-59a6-4c87-8373-a023b9f448cc', relevance: 'strong', camp: 'Safety First' },
    { name: 'Nick Bostrom', campId: 'e8792297-e745-4c9f-a91d-4f87dd05cea2', relevance: 'partial', camp: 'Regulatory Interventionist' },
    { name: 'Stuart Russell', campId: '7f64838f-59a6-4c87-8373-a023b9f448cc', relevance: 'strong', camp: 'Safety First' },
    { name: 'Stuart Russell', campId: 'e8792297-e745-4c9f-a91d-4f87dd05cea2', relevance: 'strong', camp: 'Regulatory Interventionist' },
    { name: 'Eliezer Yudkowsky', campId: '7f64838f-59a6-4c87-8373-a023b9f448cc', relevance: 'strong', camp: 'Safety First' },
    { name: 'Eliezer Yudkowsky', campId: 'e8792297-e745-4c9f-a91d-4f87dd05cea2', relevance: 'strong', camp: 'Regulatory Interventionist' },
    { name: 'Ajeya Cotra', campId: '7f64838f-59a6-4c87-8373-a023b9f448cc', relevance: 'strong', camp: 'Safety First' },

    // Labor & Economics Experts
    { name: 'Daron Acemoglu', campId: '76f0d8c5-c9a8-4a26-ae7e-18f787000e18', relevance: 'strong', camp: 'Displacement Realist' },
    { name: 'Daron Acemoglu', campId: 'e8792297-e745-4c9f-a91d-4f87dd05cea2', relevance: 'strong', camp: 'Regulatory Interventionist' },
    { name: 'Carl Benedikt Frey', campId: '76f0d8c5-c9a8-4a26-ae7e-18f787000e18', relevance: 'strong', camp: 'Displacement Realist' },

    // Technical AI Researchers
    { name: 'Judea Pearl', campId: '207582eb-7b32-4951-9863-32fcf05944a1', relevance: 'strong', camp: 'Needs New Approaches' },
    { name: 'Percy Liang', campId: '207582eb-7b32-4951-9863-32fcf05944a1', relevance: 'strong', camp: 'Needs New Approaches' },
    { name: 'Percy Liang', campId: '7f64838f-59a6-4c87-8373-a023b9f448cc', relevance: 'strong', camp: 'Safety First' },
    { name: 'Yejin Choi', campId: '207582eb-7b32-4951-9863-32fcf05944a1', relevance: 'strong', camp: 'Needs New Approaches' },

    // AI Ethics & Fairness
    { name: 'Abeba Birhane', campId: '7f64838f-59a6-4c87-8373-a023b9f448cc', relevance: 'strong', camp: 'Safety First' },
    { name: 'Deborah Raji', campId: '7f64838f-59a6-4c87-8373-a023b9f448cc', relevance: 'strong', camp: 'Safety First' },
    { name: 'Margaret Mitchell', campId: '7f64838f-59a6-4c87-8373-a023b9f448cc', relevance: 'strong', camp: 'Safety First' },
    { name: 'Rumman Chowdhury', campId: '7f64838f-59a6-4c87-8373-a023b9f448cc', relevance: 'strong', camp: 'Safety First' },
    { name: 'Rumman Chowdhury', campId: 'ee10cf4f-025a-47fc-be20-33d6756ec5cd', relevance: 'strong', camp: 'Adaptive Governance' },
    { name: 'Suresh Venkatasubramanian', campId: 'e8792297-e745-4c9f-a91d-4f87dd05cea2', relevance: 'strong', camp: 'Regulatory Interventionist' },

    // Enterprise & Adoption
    { name: 'Bret Taylor', campId: '7e9a2196-71e7-423a-889c-6902bc678eac', relevance: 'strong', camp: 'Technology Leads' },
    { name: 'Bret Taylor', campId: 'f19021ab-a8db-4363-adec-c2228dad6298', relevance: 'strong', camp: 'Co-Evolution' },
    { name: 'Byron Deeter', campId: '7e9a2196-71e7-423a-889c-6902bc678eac', relevance: 'strong', camp: 'Technology Leads' },
    { name: 'David Cahn', campId: '7e9a2196-71e7-423a-889c-6902bc678eac', relevance: 'strong', camp: 'Technology Leads' },
    { name: 'Martin Casado', campId: '7e9a2196-71e7-423a-889c-6902bc678eac', relevance: 'strong', camp: 'Technology Leads' },
    { name: 'Rita Sallam', campId: 'f19021ab-a8db-4363-adec-c2228dad6298', relevance: 'strong', camp: 'Co-Evolution' },
    { name: 'Rita Sallam', campId: 'fe9464df-b778-44c9-9593-7fb3294fa6c3', relevance: 'strong', camp: 'Business Whisperers' },
    { name: 'Daphne Koller', campId: '7e9a2196-71e7-423a-889c-6902bc678eac', relevance: 'strong', camp: 'Technology Leads' },
    { name: 'Nat Friedman', campId: '7e9a2196-71e7-423a-889c-6902bc678eac', relevance: 'strong', camp: 'Technology Leads' },

    // Innovation & Democratization
    { name: 'Emad Mostaque', campId: 'fe19ae2d-99f2-4c30-a596-c9cd92bff41b', relevance: 'strong', camp: 'Democratize Fast' },
    { name: 'Patrick Collison', campId: '331b2b02-7f8d-4751-b583-16255a6feb50', relevance: 'strong', camp: 'Innovation First' },
    { name: 'Joshua Gans', campId: '331b2b02-7f8d-4751-b583-16255a6feb50', relevance: 'strong', camp: 'Innovation First' },

    // Governance & Policy
    { name: 'Ian Hogarth', campId: 'ee10cf4f-025a-47fc-be20-33d6756ec5cd', relevance: 'strong', camp: 'Adaptive Governance' },

    // Human-AI Collaboration
    { name: 'Avi Goldfarb', campId: 'd8d3cec4-f8ce-49b1-9a43-bb0d952db371', relevance: 'strong', camp: 'Human-AI Collaboration' },

    // OpenAI Safety Researchers
    { name: 'Lilian Weng', campId: '7f64838f-59a6-4c87-8373-a023b9f448cc', relevance: 'strong', camp: 'Safety First' },

    // Critics & Skeptics
    { name: 'Ed Zitron', campId: '207582eb-7b32-4951-9863-32fcf05944a1', relevance: 'challenges', camp: 'Needs New Approaches' },
    { name: 'Jim Covello', campId: '207582eb-7b32-4951-9863-32fcf05944a1', relevance: 'challenges', camp: 'Needs New Approaches' },
  ];

  console.log(`Total assignments to process: ${assignments.length}\n`);

  // Process each assignment
  for (const assignment of assignments) {
    try {
      // Get author ID
      const { data: author, error: authorError } = await supabase
        .from('authors')
        .select('id')
        .eq('name', assignment.name)
        .single();

      if (authorError || !author) {
        errorCount++;
        errors.push({
          author: assignment.name,
          camp: assignment.camp,
          error: `Author not found: ${assignment.name}`
        });
        console.log(`❌ ${assignment.name} → ${assignment.camp} (${assignment.relevance}): Author not found`);
        continue;
      }

      // Insert camp assignment
      const { error: insertError } = await supabase
        .from('camp_authors')
        .insert({
          author_id: author.id,
          camp_id: assignment.campId,
          relevance: assignment.relevance
        });

      if (insertError) {
        // Check if it's a duplicate key error (already assigned)
        if (insertError.code === '23505') {
          console.log(`⚠️  ${assignment.name} → ${assignment.camp} (${assignment.relevance}): Already assigned`);
        } else {
          errorCount++;
          errors.push({
            author: assignment.name,
            camp: assignment.camp,
            error: insertError.message
          });
          console.log(`❌ ${assignment.name} → ${assignment.camp} (${assignment.relevance}): ${insertError.message}`);
        }
      } else {
        successCount++;
        console.log(`✅ ${assignment.name} → ${assignment.camp} (${assignment.relevance})`);
      }

    } catch (e) {
      errorCount++;
      errors.push({
        author: assignment.name,
        camp: assignment.camp,
        error: e.message
      });
      console.log(`❌ ${assignment.name} → ${assignment.camp}: ${e.message}`);
    }
  }

  console.log('\n========================================');
  console.log('EXECUTION SUMMARY');
  console.log('========================================\n');
  console.log(`✅ Successful assignments: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);

  if (errors.length > 0) {
    console.log('\nErrors encountered:');
    errors.forEach(err => {
      console.log(`  - ${err.author} → ${err.camp}: ${err.error}`);
    });
  }

  // Verify final state
  console.log('\n========================================');
  console.log('VERIFICATION');
  console.log('========================================\n');

  const { data: verifyData, error: verifyError } = await supabase
    .from('authors')
    .select(`
      name,
      camp_authors (
        camps (
          label
        ),
        relevance
      )
    `)
    .in('name', [
      'Nick Bostrom', 'Stuart Russell', 'Daron Acemoglu', 'Judea Pearl',
      'Ajeya Cotra', 'Avi Goldfarb', 'Carl Benedikt Frey', 'Daphne Koller',
      'Joshua Gans', 'Percy Liang', 'Abeba Birhane', 'Deborah Raji',
      'Eliezer Yudkowsky', 'Emad Mostaque', 'Ian Hogarth', 'Lilian Weng',
      'Margaret Mitchell', 'Nat Friedman', 'Patrick Collison', 'Rumman Chowdhury',
      'Suresh Venkatasubramanian', 'Yejin Choi', 'Bret Taylor', 'Byron Deeter',
      'David Cahn', 'Ed Zitron', 'Jim Covello', 'Martin Casado', 'Rita Sallam'
    ])
    .order('name');

  if (verifyError) {
    console.log('Error verifying assignments:', verifyError);
  } else {
    console.log('Authors now with camp assignments:');
    verifyData.forEach(author => {
      const campCount = author.camp_authors?.length || 0;
      const camps = author.camp_authors?.map(ca =>
        `${ca.camps.label} (${ca.relevance})`
      ).join(', ') || 'None';
      console.log(`  ${author.name}: ${campCount} camp(s) - ${camps}`);
    });
  }

  console.log('\n========================================');
  console.log('DONE');
  console.log('========================================\n');
}

executeCampAssignments();
