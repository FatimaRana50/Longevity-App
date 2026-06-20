import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

// Load .env from backend/
function loadEnv(filePath: string) {
  if (!fs.existsSync(filePath)) return
  fs.readFileSync(filePath, 'utf8').split(/\r?\n/).forEach(line => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const eq = trimmed.indexOf('=')
    if (eq === -1) return
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '')
    if (!process.env[key]) process.env[key] = val
  })
}

loadEnv(path.join(__dirname, '..', '.env'))

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env')
  process.exit(1)
}

// Inline the question data so we don't need to resolve mobile app modules
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { allQuestions } = require('../../src/data/all-questions')

const CATEGORY_MAP: Record<string, string> = {
  environmental: 'environment',
  worklife: 'work-life',
}

function mapCategory(cat: string): string {
  return CATEGORY_MAP[cat] ?? cat
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

interface Question {
  id: string
  category: string
  question: string
  optionA: { text: string; insight?: { text?: string; archetype?: string } }
  optionB: { text: string; insight?: { text?: string; archetype?: string } }
  difficulty?: string
}

const payload = (allQuestions as Question[]).map(q => ({
  category:           mapCategory(q.category),
  question_text:      q.question,
  option_a_text:      q.optionA.text,
  option_b_text:      q.optionB.text,
  option_a_insight:   q.optionA.insight?.text ?? null,
  option_b_insight:   q.optionB.insight?.text ?? null,
  option_a_archetype: q.optionA.insight?.archetype ?? null,
  option_b_archetype: q.optionB.insight?.archetype ?? null,
  difficulty:         q.difficulty ?? 'medium',
  is_active:          true,
  is_premium:         false,
}))

async function main() {
  console.log(`Seeding ${payload.length} questions…`)

  const batchSize = 25
  let processed = 0

  for (let i = 0; i < payload.length; i += batchSize) {
    const batch = payload.slice(i, i + batchSize)
    const { error } = await supabase.from('questions').insert(batch)

    if (error) {
      console.error('Error on batch starting at', i, ':', error.message)
      process.exit(1)
    }

    processed += batch.length
    console.log(`  ${processed}/${payload.length}`)
  }

  console.log(`\n✓ Done. ${payload.length} questions seeded.`)

  const counts: Record<string, number> = {}
  payload.forEach(q => { counts[q.category] = (counts[q.category] ?? 0) + 1 })
  console.log('\nBy category:')
  Object.entries(counts).sort().forEach(([cat, n]) => console.log(`  ${cat}: ${n}`))
}

main().catch(err => { console.error(err); process.exit(1) })
