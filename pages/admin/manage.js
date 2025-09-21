// pages/admin/manage.js
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function AdminManage() {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [projForm, setProjForm] = useState({
    slug: "",
    title: "",
    description: "",
    web_url: "",
    mobile_url: "",
    tags: "",
  });
  const [caseForm, setCaseForm] = useState({ slug: "", title: "", summary: "" });

  useEffect(() => {
    if (status === "authenticated") {
      loadAll();
    } else {
      setProjects([]);
      setCases([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function loadAll() {
    setError("");
    setLoading(true);
    try {
      await Promise.all([loadProjects(), loadCases()]);
    } catch (e) {
      // handled in individual functions
    } finally {
      setLoading(false);
    }
  }

  async function fetchWithAuth(url, opts = {}) {
    // All calls rely on NextAuth cookie session (server checks session)
    const res = await fetch(url, opts);
    if (res.status === 401) {
      throw new Error("Unauthorized — you must be an allowed admin.");
    }
    return res;
  }

  async function loadProjects() {
    try {
      const res = await fetch("/api/admin/projects");
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized — sign in with an admin account.");
        throw new Error("Failed to load projects");
      }
      const j = await res.json();
      setProjects(j.projects || []);
    } catch (err) {
      setError(err.message || "Error loading projects");
      setProjects([]);
    }
  }

  async function loadCases() {
    try {
      const res = await fetch("/api/admin/cases");
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized — sign in with an admin account.");
        throw new Error("Failed to load cases");
      }
      const j = await res.json();
      setCases(j.cases || []);
    } catch (err) {
      setError(err.message || "Error loading cases");
      setCases([]);
    }
  }

  async function createProject(e) {
    e.preventDefault();
    setError("");
    try {
      const body = {
        slug: projForm.slug,
        title: projForm.title,
        description: projForm.description,
        web_url: projForm.web_url,
        mobile_url: projForm.mobile_url,
        tags: projForm.tags,
      };
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const js = await res.json().catch(() => ({}));
        throw new Error(js.error || "Failed to create project");
      }
      setProjForm({ slug: "", title: "", description: "", web_url: "", mobile_url: "", tags: "" });
      await loadProjects();
    } catch (err) {
      setError(err.message || "Create project failed");
    }
  }

  async function deleteProject(id, slug) {
    if (!confirm("Delete this project?")) return;
    setError("");
    try {
      const res = await fetch("/api/admin/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, slug }),
      });
      if (!res.ok) {
        const js = await res.json().catch(() => ({}));
        throw new Error(js.error || "Failed to delete project");
      }
      await loadProjects();
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  }

  async function createCase(e) {
    e.preventDefault();
    setError("");
    try {
      const body = { slug: caseForm.slug, title: caseForm.title, summary: caseForm.summary };
      const res = await fetch("/api/admin/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const js = await res.json().catch(() => ({}));
        throw new Error(js.error || "Failed to create case");
      }
      setCaseForm({ slug: "", title: "", summary: "" });
      await loadCases();
    } catch (err) {
      setError(err.message || "Create case failed");
    }
  }

  async function deleteCase(id, slug) {
    if (!confirm("Delete this case?")) return;
    setError("");
    try {
      const res = await fetch("/api/admin/cases", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id,slug }),
      });
      if (!res.ok) {
        const js = await res.json().catch(() => ({}));
        throw new Error(js.error || "Failed to delete case");
      }
      await loadCases();
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  }

  // UI
  if (status === "loading") {
    return <div className="p-8">Loading auth…</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="p-8 bg-white rounded shadow max-w-lg w-full text-center">
          <h2 className="text-xl mb-4">Admin sign in</h2>
          <p className="text-slate-600 mb-4">Sign in with a Google account that is allowed to manage this site.</p>
          <button onClick={() => signIn("google")} className="px-4 py-2 bg-slate-900 text-white rounded">Sign in with Google</button>
          <div className="mt-4 text-sm text-slate-500">Use the account(s) listed in <code>ADMIN_EMAILS</code>.</div>
        </div>
      </div>
    );
  }

  // Signed-in UI
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admin — Manage Projects & Cases</h1>
        <div className="flex items-center gap-3">
          <div className="text-sm">Signed in as <strong>{session.user.email}</strong></div>
          <button onClick={() => signOut()} className="px-3 py-1 border rounded">Sign out</button>
        </div>
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading && <div className="mb-4">Loading…</div>}

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Projects</h2>
          <form onSubmit={createProject} className="space-y-2 mb-4">
            <input placeholder="slug (unique)" value={projForm.slug} onChange={(e) => setProjForm(p => ({ ...p, slug: e.target.value }))} className="w-full px-3 py-2 border rounded" />
            <input placeholder="title" value={projForm.title} onChange={(e) => setProjForm(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 border rounded" />
            <input placeholder="web_url" value={projForm.web_url} onChange={(e) => setProjForm(p => ({ ...p, web_url: e.target.value }))} className="w-full px-3 py-2 border rounded" />
            <input placeholder="mobile_url" value={projForm.mobile_url} onChange={(e) => setProjForm(p => ({ ...p, mobile_url: e.target.value }))} className="w-full px-3 py-2 border rounded" />
            <input placeholder="tags (comma separated)" value={projForm.tags} onChange={(e) => setProjForm(p => ({ ...p, tags: e.target.value }))} className="w-full px-3 py-2 border rounded" />
            <textarea placeholder="description" value={projForm.description} onChange={(e) => setProjForm(p => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 border rounded" />
            <div><button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded">Create project</button></div>
          </form>

          <div className="space-y-3">
            {projects.map(p => (
              <div key={p.id} className="p-3 border rounded flex justify-between items-start">
                <div>
                  <div className="font-semibold">{p.title} <span className="text-xs text-slate-400">({p.slug})</span></div>
                  <div className="text-sm text-slate-600">{p.web_url || p.mobile_url}</div>
                </div>
                <div>
                  <button onClick={() => deleteProject(p.id, p.slug)} className="px-2 py-1 border rounded text-sm">Delete</button>
                </div>
              </div>
            ))}
            {projects.length === 0 && <div className="text-slate-500">No projects yet.</div>}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Cases managed</h2>
          <form onSubmit={createCase} className="space-y-2 mb-4">
            <input placeholder="slug (unique)" value={caseForm.slug} onChange={(e) => setCaseForm(c => ({ ...c, slug: e.target.value }))} className="w-full px-3 py-2 border rounded" />
            <input placeholder="title" value={caseForm.title} onChange={(e) => setCaseForm(c => ({ ...c, title: e.target.value }))} className="w-full px-3 py-2 border rounded" />
            <textarea placeholder="summary" value={caseForm.summary} onChange={(e) => setCaseForm(c => ({ ...c, summary: e.target.value }))} className="w-full px-3 py-2 border rounded" />
            <div><button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded">Create case</button></div>
          </form>

          <div className="space-y-3">
            {cases.map(c => (
              <div key={c.id} className="p-3 border rounded flex justify-between items-start">
                <div>
                  <div className="font-semibold">{c.title} <span className="text-xs text-slate-400">({c.slug})</span></div>
                  <div className="text-sm text-slate-600">{c.summary}</div>
                </div>
                <div>
                  <button onClick={() => deleteCase(c.id, c.slug)} className="px-2 py-1 border rounded text-sm">Delete</button>
                </div>
              </div>
            ))}
            {cases.length === 0 && <div className="text-slate-500">No cases yet.</div>}
          </div>
        </div>
      </section>
    </div>
  );
}
