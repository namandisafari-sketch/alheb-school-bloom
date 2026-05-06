
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
)

async function checkSchools() {
  const { data, error } = await supabase.from('schools').select('id, name')
  if (error) {
    console.error('Error fetching schools:', error)
  } else {
    console.log('Schools found:', data)
  }
}

checkSchools()
