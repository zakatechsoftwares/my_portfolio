// pages/api/cases.js
import { createClient } from '@supabase/supabase-js'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error('Missing SUPABASE env vars')
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('cases_managed')
      .select('id, slug, title, summary, created_at')
      .order('created_at', { ascending: false })
    if (error) throw error
    return res.status(200).json({ cases: data })
  } catch (err) {
    console.error('API /api/cases error', err)
    return res.status(500).json({ error: 'Failed to fetch cases' })
  }
}
