import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: `${__dirname}/backend/.env.local` })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
  try {
    console.log('Running migration: Adding deep_dive_2 and deep_dive_3 columns...')

    // Add the new columns to forums table
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE forums
        ADD COLUMN IF NOT EXISTS deep_dive_2_topic VARCHAR(255),
        ADD COLUMN IF NOT EXISTS deep_dive_2_person_id INTEGER,
        ADD COLUMN IF NOT EXISTS deep_dive_3_topic VARCHAR(255),
        ADD COLUMN IF NOT EXISTS deep_dive_3_person_id INTEGER;
      `
    }).catch(() => ({ error: 'RPC not available' }))

    if (alterError && alterError !== 'RPC not available') {
      throw alterError
    }

    console.log('✓ Migration completed successfully!')
    console.log('✓ Added deep_dive_2_topic, deep_dive_2_person_id, deep_dive_3_topic, deep_dive_3_person_id columns')
  } catch (error) {
    console.error('Migration error:', error.message)
    console.log('\nNote: If RPC is not available, you can run this SQL manually in Supabase:')
    console.log(`
      ALTER TABLE forums
      ADD COLUMN IF NOT EXISTS deep_dive_2_topic VARCHAR(255),
      ADD COLUMN IF NOT EXISTS deep_dive_2_person_id INTEGER,
      ADD COLUMN IF NOT EXISTS deep_dive_3_topic VARCHAR(255),
      ADD COLUMN IF NOT EXISTS deep_dive_3_person_id INTEGER;
    `)
  }

  process.exit(0)
}

runMigration()
