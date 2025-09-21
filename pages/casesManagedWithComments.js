// pages/casesManagedWithComments.js
import { useEffect, useState } from "react"
import Link from "next/link"

export default function CasesManagedWithCommentsPage() {
  const [cases, setCases] = useState([])
  const [loadingCases, setLoadingCases] = useState(true)
  const [errorCases, setErrorCases] = useState("")

  useEffect(() => {
  async function load() {
    setLoadingCases(true)
    setErrorCases("")
    try {
      const res = await fetch("/api/cases")
      if (!res.ok) {
        const body = await res.text().catch(() => "")
        // throw new Error(body || `Request failed with status ${res.status}`)
      }
      const json = await res.json().catch(() => ({}))
      setCases(json.cases || [])
    } catch (err) {
      console.error("load cases error", err)
      setErrorCases(err.message || "Failed to load cases")
      setCases([])
    } finally {
      setLoadingCases(false)
    }
  }
  load()
}, [])


  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Cases I managed</h1>
          <Link href="/" className="text-sm text-slate-600 hover:underline">Back home</Link>
        </div>

        {loadingCases && <div>Loading cases…</div>}
        {errorCases && <div className="text-red-600 mb-4">{errorCases}</div>}

        <div className="grid gap-6">
          {cases.map((c) => (
            <CaseCard key={c.slug || c.id} caseItem={c} />
          ))}
          {!loadingCases && cases.length === 0 && <div className="text-slate-500">No cases found.</div>}
        </div>
      </main>
    </div>
  )
}

function CaseCard({ caseItem }) {
  // caseItem: { id, slug, title, summary }
  const slug = caseItem.slug || String(caseItem.id)
  const [open, setOpen] = useState(false)
  const [comments, setComments] = useState([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [form, setForm] = useState({ name: "", message: "" })
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (open && comments.length === 0) fetchComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  async function fetchComments() {
    setError("")
    setLoadingComments(true)
    try {
      const res = await fetch(`/api/comments?project_id=${encodeURIComponent(slug)}`)
      if (!res.ok) throw new Error("Failed to load comments")
      const json = await res.json()
      setComments(json.comments || [])
    } catch (err) {
      console.error("fetchComments error", err)
      setError(err.message || "Could not load comments")
      setComments([])
    } finally {
      setLoadingComments(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    if (!form.name.trim() || !form.message.trim()) {
      setError("Please provide your name and a short message")
      return
    }

    setPosting(true)
    const tempId = `temp-${Date.now()}`
    const optimistic = {
      id: tempId,
      project_id: slug,
      name: form.name.trim(),
      message: form.message.trim(),
      created_at: new Date().toISOString(),
      approved: false,
      pending: true,
    }
    setComments((s) => [optimistic, ...(s || [])])

    try {
      const body = { project_id: slug, name: form.name.trim(), message: form.message.trim() }
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to post comment")

      const inserted = data.comment
      setComments((s) => [inserted, ...(s || []).filter((c) => String(c.id) !== tempId)])
      setForm({ name: "", message: "" })
    } catch (err) {
      console.error("post comment error", err)
      setError(err.message || "Could not post comment — try again later")
      setComments((s) => (s || []).filter((c) => !String(c.id).startsWith("temp-")))
    } finally {
      setPosting(false)
    }
  }

  return (
    <article className="bg-white rounded-lg shadow-sm p-6">
      <div className="md:flex md:justify-between">
        <div>
          <h3 className="text-lg font-semibold">{caseItem.title}</h3>
          {caseItem.summary && <p className="text-slate-700 mt-2">{caseItem.summary}</p>}
        </div>

        <div className="mt-4 md:mt-0 md:text-right">
          <button onClick={() => setOpen((v) => !v)} className="px-3 py-2 bg-slate-900 text-white rounded-md">
            {open ? "Close" : "View comments"}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-medium mb-3">What viewers are saying about this case</h4>

          {loadingComments ? (
            <div className="text-slate-500">Loading comments…</div>
          ) : (
            <div className="space-y-3">
              {error && <div className="text-red-600">{error}</div>}
              {(!comments || comments.length === 0) && <div className="text-slate-500">No comments yet — be the first to leave feedback.</div>}
              {(comments || []).map((c) => (
                <div key={c.id} className="p-3 bg-slate-50 rounded-md">
                  <div className="text-sm font-semibold">{c.name}</div>
                  <div className="text-slate-700 mt-1">{c.message}</div>
                  <div className="text-xs text-slate-400 mt-2">
                    {new Date(c.created_at).toLocaleString()}
                    {c.pending || c.approved === false ? " • Pending moderation" : ""}
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input name="name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Your name" className="md:col-span-1 px-3 py-2 border rounded-md" />
              <textarea name="message" value={form.message} onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))} placeholder="Share your experience or feedback" className="md:col-span-2 px-3 py-2 border rounded-md" rows={3} />
            </div>

            <div className="mt-3">
              {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
              <button disabled={posting} type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-md">{posting ? "Posting…" : "Post comment"}</button>
              <button type="button" onClick={() => setForm({ name: "", message: "" })} className="ml-3 px-3 py-2 border rounded-md">Clear</button>
            </div>
          </form>
        </div>
      )}
    </article>
  )
}
