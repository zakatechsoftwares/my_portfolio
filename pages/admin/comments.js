// pages/admin/comments.js
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function AdminComments() {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") loadComments();
    else setComments([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function loadComments() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/comments");
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized — sign in with an admin account.");
        throw new Error("Failed to load comments");
      }
      const j = await res.json();
      setComments(j.comments || []);
    } catch (err) {
      setError(err.message || "Error loading comments");
      setComments([]);
    } finally {
      setLoading(false);
    }
  }

  async function perform(action, id) {
    setError("");
    try {
      const res = await fetch("/api/admin/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId: id, action }),
      });
      if (!res.ok) {
        const js = await res.json().catch(() => ({}));
        throw new Error(js.error || "Action failed");
      }
      await loadComments();
    } catch (err) {
      setError(err.message || "Action failed");
    }
  }

  if (status === "loading") return <div className="p-8">Loading auth…</div>;

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="p-8 bg-white rounded shadow text-center">
          <h2 className="text-xl mb-4">Admin sign in</h2>
          <button onClick={() => signIn("google")} className="px-4 py-2 bg-slate-900 text-white rounded">Sign in with Google</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Comments Admin</h1>
        <div className="flex items-center gap-3">
          <div className="text-sm">Signed in as <strong>{session.user.email}</strong></div>
          <button onClick={() => signOut()} className="px-3 py-1 border rounded">Sign out</button>
        </div>
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading && <div>Loading…</div>}

      <div className="space-y-4">
        {!loading && comments.length === 0 && <div className="text-slate-500">No comments found.</div>}
        {comments.map(c => (
          <div key={c.id} className="p-4 bg-white rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{c.name} <span className="text-xs text-slate-400">({c.project_id})</span></div>
                <div className="text-slate-700 mt-2">{c.message}</div>
                <div className="text-xs text-slate-400 mt-2">{new Date(c.created_at).toLocaleString()} • IP: {c.ip || "—"}</div>
              </div>
              <div className="flex flex-col gap-2">
                {!c.approved && <button onClick={() => perform("approve", c.id)} className="px-3 py-1 bg-cyan-600 text-white rounded">Approve</button>}
                <button onClick={() => perform("delete", c.id)} className="px-3 py-1 border rounded">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
