// pages/projectWithComments.js
import { useEffect, useState } from "react"
import Link from "next/link"

export default function ProjectWithCommentsPage() {
  const [projects, setProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [errorProjects, setErrorProjects] = useState("")

useEffect(() => {
  async function load() {
    setLoadingProjects(true)
    setErrorProjects("")           // clear any previous error
    try {
      const res = await fetch("/api/projects")
      if (!res.ok) {
        // API returned non-2xx — treat as error
        const body = await res.text().catch(() => "")
        // throw new Error(body || `Request failed with status ${res.status}`)
      }
      const json = await res.json().catch(() => ({}))
      setProjects(json.projects || []) // empty array is fine — not an error
    } catch (err) {
      console.error("load projects error", err)
      setErrorProjects(err.message || "Failed to load projects")
      setProjects([]) // ensure UI has an empty array
    } finally {
      setLoadingProjects(false)
    }
  }
  load()
}, [])


  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Projects & viewer feedback</h1>
          <Link href="/" className="text-sm text-slate-600 hover:underline">Back home</Link>
        </div>

        {loadingProjects && <div>Loading projects…</div>}
        {errorProjects && <div className="text-red-600 mb-4">{errorProjects}</div>}

        <div className="grid gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.slug || p.id} project={p} />
          ))}
          {!loadingProjects && projects.length === 0 && <div className="text-slate-500">No projects found.</div>}
        </div>
      </main>
    </div>
  )
}

function ProjectCard({ project }) {
  // project: { id, slug, title, description, web_url, mobile_url, tags }
  const slug = project.slug || String(project.id)
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
    // optimistic
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

      // replace optimistic with returned record
      const inserted = data.comment
      setComments((s) => [inserted, ...(s || []).filter((c) => String(c.id) !== tempId)])
      setForm({ name: "", message: "" })
    } catch (err) {
      console.error("post comment error", err)
      setError(err.message || "Could not post comment — try again later")
      // rollback optimistic
      setComments((s) => (s || []).filter((c) => !String(c.id).startsWith("temp-")))
    } finally {
      setPosting(false)
    }
  }

  return (
    <article className="bg-white rounded-lg shadow-sm p-6">
      <div className="md:flex md:items-start md:justify-between">
        <div>
          <h3 className="text-xl font-semibold">{project.title}</h3>
          {project.description && <p className="text-slate-700 mt-2">{project.description}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            {(project.tags || []).map((t) => (
              <span key={t} className="text-xs px-2 py-1 bg-slate-100 rounded-md">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {project.web_url && (
              <a href={project.web_url} target="_blank" rel="noreferrer" className="px-3 py-2 border rounded-md text-sm">
                View web
              </a>
            )}
            {project.mobile_url && (
              <a href={project.mobile_url} target="_blank" rel="noreferrer" className="px-3 py-2 border rounded-md text-sm">
                View mobile
              </a>
            )}
            <button onClick={() => setOpen((v) => !v)} className="px-3 py-2 bg-slate-900 text-white rounded-md text-sm">
              {open ? "Close" : "Share feedback"}
            </button>
          </div>
        </div>

        <div className="mt-4 md:mt-0 text-sm text-slate-500 text-right min-w-[140px]">
          <div>Added: {new Date(project.created_at).toLocaleDateString()}</div>
        </div>
      </div>

      {open && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-medium mb-3">What viewers are saying</h4>

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
