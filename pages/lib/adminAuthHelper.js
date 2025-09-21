// lib/adminAuthHelper.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";

function isEmailAllowed(email) {
  const list = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return list.includes((email || "").toLowerCase());
}

/**
 * requireAdmin(req,res)
 * - returns { ok: true, email } if authorized
 * - returns { ok: false } if unauthorized
 *
 * Logic:
 * 1) try NextAuth session and check email against ADMIN_EMAILS
 * 2) fallback to x-admin-key header (legacy)
 */
export async function requireAdmin(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (session?.user?.email && isEmailAllowed(session.user.email)) {
      return { ok: true, email: session.user.email };
    }
  } catch (err) {
    // ignore session errors — fallback to admin key
    console.error("requireAdmin: session check failed", err);
  }

  const adminKey = req.headers["x-admin-key"] || req.body?.adminKey || req.query?.adminKey;
  if (adminKey && adminKey === process.env.COMMENTS_ADMIN_KEY) {
    return { ok: true, email: "admin-key" };
  }

  return { ok: false };
}
