// pages/api/admin/cases.js
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
        .from("cases_managed")
        .select("id, slug, title, summary, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return res.status(200).json({ cases: data });
    }

    if (req.method === "POST") {
      const { slug, title, summary } = req.body || {};
      if (!slug || !title) return res.status(400).json({ error: "slug and title required" });
      const payload = { slug: slug.trim(), title: title.trim(), summary: (summary || "").trim() };
      const { data, error } = await supabase.from("cases_managed").insert([payload]).select();
      if (error) {
        console.error("Supabase insert case error", error);
        return res.status(500).json({ error: "Failed to create case" });
      }
      return res.status(201).json({ case: data[0] });
    }

   if (req.method === "DELETE") {
  const { id, slug } = req.body;
  if (!id && !slug) {
    return res.status(400).json({ error: "id or slug required to delete" });
  }

  let query = supabase.from("cases_managed").delete();

  if (id) {
    query = query.eq("id", id);
  } else {
    query = query.eq("slug", slug);
  }

  const { error } = await query;

  if (error) {
    console.error("Supabase delete case error", error);
    return res.status(500).json({ error: "Failed to delete case" });
  }

  return res.status(200).json({ success: true });
}


    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (err) {
    console.error("API admin/cases error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
