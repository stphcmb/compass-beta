/**
 * Script to import an existing style guide as a voice profile
 *
 * Usage:
 *   npx tsx scripts/import-voice-profile.ts <style-guide-path> <profile-name> [user-id]
 *
 * Example:
 *   npx tsx scripts/import-voice-profile.ts \
 *     Docs/constructive-confrontation-style-guide.md \
 *     "Constructive Confrontation" \
 *     user_2abc123
 */

import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase environment variables')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function importVoiceProfile(
  styleGuidePath: string,
  profileName: string,
  userId: string
) {
  // Read the style guide file
  const fullPath = path.resolve(process.cwd(), styleGuidePath)

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Style guide file not found: ${fullPath}`)
  }

  const styleGuide = fs.readFileSync(fullPath, 'utf-8')
  console.log(`Read style guide: ${styleGuide.length} characters`)

  // Insert into database
  const { data, error } = await supabase
    .from('voice_profiles')
    .insert({
      clerk_user_id: userId,
      name: profileName,
      description: `Imported from ${path.basename(styleGuidePath)}`,
      style_guide: styleGuide,
      source_samples: null,
      is_active: false,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to insert profile: ${error.message}`)
  }

  console.log(`\nSuccessfully imported voice profile!`)
  console.log(`  ID: ${data.id}`)
  console.log(`  Name: ${data.name}`)
  console.log(`  User: ${data.clerk_user_id}`)
  console.log(`  Style Guide Length: ${data.style_guide?.length || 0} chars`)

  return data
}

// Main execution
const args = process.argv.slice(2)

if (args.length < 2) {
  console.log(`
Usage: npx ts-node scripts/import-voice-profile.ts <style-guide-path> <profile-name> [user-id]

Arguments:
  style-guide-path  Path to the markdown style guide file
  profile-name      Name for the voice profile
  user-id           Clerk user ID (default: 'demo-user')

Example:
  npx ts-node scripts/import-voice-profile.ts \\
    Docs/constructive-confrontation-style-guide.md \\
    "Constructive Confrontation" \\
    user_2abc123
`)
  process.exit(1)
}

const styleGuidePath = args[0]
const profileName = args[1]
const userId = args[2] || 'demo-user'

importVoiceProfile(styleGuidePath, profileName, userId)
  .then(() => {
    console.log('\nDone!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\nError:', error.message)
    process.exit(1)
  })
