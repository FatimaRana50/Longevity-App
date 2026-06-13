import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { allQuestions } from '../src/data/all-questions';

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  content.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex === -1) return;
    const key = trimmed.slice(0, equalsIndex).trim();
    const value = trimmed.slice(equalsIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

const projectRoot = path.resolve(__dirname, '..');
loadEnvFile(path.join(projectRoot, '.env.local'));

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const payload = allQuestions.map(question => ({
  id: question.id,
  category: question.category,
  category_order: question.categoryOrder,
  question_number: question.questionNumber,
  question: question.question,
  option_a_text: question.optionA.text,
  option_a_insight: question.optionA.insight,
  option_b_text: question.optionB.text,
  option_b_insight: question.optionB.insight,
  difficulty: question.difficulty,
}));

async function main() {
  const batchSize = 25;
  let processed = 0;

  for (let index = 0; index < payload.length; index += batchSize) {
    const batch = payload.slice(index, index + batchSize);
    const { error } = await supabase.from('questions').upsert(batch, { onConflict: 'id' });
    if (error) {
      throw error;
    }
    processed += batch.length;
    console.log(`Upserted ${processed}/${payload.length} questions`);
  }

  console.log(`Done. Seeded or updated ${payload.length} questions.`);
}

main().catch(error => {
  console.error('Failed to seed questions:', error);
  process.exit(1);
});
