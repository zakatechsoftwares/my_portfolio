// pages/api/admin/comments.js
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "../../lib/adminAuthHelper";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE env vars");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  const auth = await requireAdmin(req, res);
  if (!auth.ok) return res.status(401).json({ error: "Unauthorized" });

  try {
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("comments")
        .select("id, project_id, name, message, approved, created_at, ip")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Supabase error (admin/comments GET):", error);
        return res.status(500).json({ error: "Failed to fetch comments" });
      }
      return res.status(200).json({ comments: data });
    }

    if (req.method === "POST") {
      // body: { commentId, action: 'approve' | 'delete' }
      const { commentId, action } = req.body || {};
      if (!commentId) return res.status(400).json({ error: "commentId required" });
      if (!["approve", "delete"].includes(action)) return res.status(400).json({ error: "invalid action" });

      if (action === "approve") {
        const { error } = await supabase.from("comments").update({ approved: true }).eq("id", commentId);
        if (error) {
          console.error("Supabase error (approve):", error);
          return res.status(500).json({ error: "Failed to approve comment" });
        }
        return res.status(200).json({ ok: true });
      } else {
        const { error } = await supabase.from("comments").delete().eq("id", commentId);
        if (error) {
          console.error("Supabase error (delete):", error);
          return res.status(500).json({ error: "Failed to delete comment" });
        }
        return res.status(200).json({ ok: true });
      }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (err) {
    console.error("API admin/comments error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
