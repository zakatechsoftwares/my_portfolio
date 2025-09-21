// pages/api/comments.js
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const COMMENTS_ADMIN_KEY = process.env.COMMENTS_ADMIN_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE env vars: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// simple in-memory rate limiter (replace with Redis for production)
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 6
const ipStore = new Map()
function isRateLimited(ip) {
  const now = Date.now()
  const entry = ipStore.get(ip) || { count: 0, first: now }
  if (now - entry.first > RATE_LIMIT_WINDOW_MS) {
    ipStore.set(ip, { count: 1, first: now })
    return false
  }
  entry.count += 1
  ipStore.set(ip, entry)
  return entry.count > RATE_LIMIT_MAX
}

export default async function handler(req, res) {
  const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for']?.split(',')?.[0] || req.socket.remoteAddress

  try {
    if (req.method === 'GET') {
      const projectId = req.query.project_id
      const admin = (req.headers['x-admin-key'] && req.headers['x-admin-key'] === COMMENTS_ADMIN_KEY) || req.query.admin === 'true'

      if (admin && !projectId) {
        const { data, error } = await supabase
          .from('comments')
          .select('id, project_id, name, message, created_at, approved, ip')
          .order('created_at', { ascending: false })

        if (error) throw error
        return res.status(200).json({ comments: data })
      }

      if (!projectId) return res.status(400).json({ error: 'project_id required' })

      let q = supabase
        .from('comments')
        .select('id, project_id, name, message, created_at, approved')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (!admin) q = q.eq('approved', true)

      const { data, error } = await q
      if (error) throw error
      return res.status(200).json({ comments: data })
    }

    if (req.method === 'POST') {
      const { action } = req.query

      // admin operations
      if (action === 'approve' || action === 'delete') {
        const adminKey = req.headers['x-admin-key'] || req.body.adminKey
        if (!adminKey || adminKey !== COMMENTS_ADMIN_KEY) return res.status(401).json({ error: 'unauthorized' })

        const { commentId } = req.body
        if (!commentId) return res.status(400).json({ error: 'commentId required' })

        if (action === 'approve') {
          const { error } = await supabase.from('comments').update({ approved: true }).eq('id', commentId)
          if (error) throw error
          return res.status(200).json({ ok: true })
        } else {
          const { error } = await supabase.from('comments').delete().eq('id', commentId)
          if (error) throw error
          return res.status(200).json({ ok: true })
        }
      }

      // public create comment (no reCAPTCHA)
      const { project_id, name, message } = req.body || {}
      if (!project_id || !name || !message) return res.status(400).json({ error: 'project_id, name and message are required' })

      if (isRateLimited(ip)) return res.status(429).json({ error: 'Too many requests — slow down' })

      // Basic spam checks
      const urlCount = (message.match(/https?:\/\//g) || []).length

      if (urlCount > 2 || /viagra|free money|click here|buy now/i.test(message)) {
        return res.status(400).json({ error: 'Message looks like spam' })
      }

      if (message.length > 2000) return res.status(400).json({ error: 'Message too long' })

      const insert = {
        project_id,
        name: name.trim().slice(0, 100),
        message: message.trim().slice(0, 2000),
        ip,
        approved: false
      }

      const { data, error } = await supabase.from('comments').insert([insert]).select()
      if (error) throw error

      // Optionally: trigger a webhook/email to notify admin of new comment

      return res.status(201).json({ ok: true, comment: data[0] })
    }

    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (err) {
    console.error('API /api/comments error:', err && (err.stack || err.message || err))
    const message = (err && (err.message || JSON.stringify(err))) || 'Unknown error'
    return res.status(500).json({ error: message })
  }
}
