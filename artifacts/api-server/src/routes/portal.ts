import { Router } from "express";
import { db, teamAccountsTable, portalTeamsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const router = Router();

const JWT_SECRET = process.env.PORTAL_JWT_SECRET || "criskros-portal-secret-change-in-production";

export interface PortalTokenPayload {
  teamAccountId: number;
  email: string;
  teamName: string;
  organization: string;
  source?: string;
}

export function requirePortalAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET) as PortalTokenPayload;
    (req as any).portalUser = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// POST /api/portal/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Try Strapi-managed portal_teams table first
    const strapiAccount = await db
      .select()
      .from(portalTeamsTable)
      .where(eq(portalTeamsTable.email, normalizedEmail))
      .then(rows => rows[0]);

    if (strapiAccount && strapiAccount.isActive && strapiAccount.password) {
      const valid = await bcrypt.compare(password, strapiAccount.password);
      if (valid) {
        const payload: PortalTokenPayload = {
          teamAccountId: strapiAccount.id,
          email: strapiAccount.email,
          teamName: strapiAccount.teamName || "",
          organization: strapiAccount.organization || "",
          source: "portal_teams",
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
        return res.json({
          success: true,
          token,
          team: {
            teamName: strapiAccount.teamName,
            organization: strapiAccount.organization,
            email: strapiAccount.email,
          },
        });
      }
    }

    // Fallback: try legacy team_accounts table
    const legacyAccount = await db
      .select()
      .from(teamAccountsTable)
      .where(eq(teamAccountsTable.email, normalizedEmail))
      .then(rows => rows[0]);

    if (!legacyAccount || !legacyAccount.isActive) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, legacyAccount.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    await db
      .update(teamAccountsTable)
      .set({ lastLoginAt: new Date() })
      .where(eq(teamAccountsTable.id, legacyAccount.id));

    const payload: PortalTokenPayload = {
      teamAccountId: legacyAccount.id,
      email: legacyAccount.email,
      teamName: legacyAccount.teamName,
      organization: legacyAccount.organization,
      source: "team_accounts",
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
    return res.json({
      success: true,
      token,
      team: {
        teamName: legacyAccount.teamName,
        organization: legacyAccount.organization,
        email: legacyAccount.email,
      },
    });
  } catch (err) {
    console.error("Portal login error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
});

// GET /api/portal/me
router.get("/me", requirePortalAuth, async (req, res) => {
  try {
    const user = (req as any).portalUser as PortalTokenPayload;

    if (user.source === "portal_teams") {
      const account = await db
        .select()
        .from(portalTeamsTable)
        .where(eq(portalTeamsTable.id, user.teamAccountId))
        .then(rows => rows[0]);

      if (!account) return res.status(404).json({ error: "Account not found" });

      return res.json({
        success: true,
        team: {
          id: account.id,
          teamName: account.teamName,
          organization: account.organization,
          email: account.email,
        },
      });
    }

    // Legacy team_accounts lookup
    const account = await db
      .select()
      .from(teamAccountsTable)
      .where(eq(teamAccountsTable.id, user.teamAccountId))
      .then(rows => rows[0]);

    if (!account) return res.status(404).json({ error: "Account not found" });

    return res.json({
      success: true,
      team: {
        id: account.id,
        teamName: account.teamName,
        organization: account.organization,
        email: account.email,
        lastLoginAt: account.lastLoginAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// GET /api/portal/gallery — fetches from Strapi
router.get("/gallery", requirePortalAuth, async (req, res) => {
  try {
    const strapiUrl = process.env.STRAPI_URL || "http://localhost:9000";
    const response = await fetch(
      `${strapiUrl}/api/gallery-items?sort=date:desc&populate=image&pagination[pageSize]=100`
    );
    if (!response.ok) {
      return res.json({ success: true, data: [] });
    }
    const data = await response.json();
    return res.json({ success: true, data: data.data || [] });
  } catch (err) {
    console.error("Gallery fetch error:", err);
    return res.json({ success: true, data: [] });
  }
});

// GET /api/portal/announcements — fetches from Strapi
router.get("/announcements", requirePortalAuth, async (req, res) => {
  try {
    const strapiUrl = process.env.STRAPI_URL || "http://localhost:9000";
    const response = await fetch(
      `${strapiUrl}/api/portal-announcements?sort=date:desc&pagination[pageSize]=50`
    );
    if (!response.ok) {
      return res.json({ success: true, data: [] });
    }
    const data = await response.json();
    return res.json({ success: true, data: data.data || [] });
  } catch (err) {
    console.error("Announcements fetch error:", err);
    return res.json({ success: true, data: [] });
  }
});

// POST /api/portal/create-account — admin only (legacy, kept for backward compatibility)
router.post("/create-account", async (req, res) => {
  try {
    const adminToken = req.headers["x-admin-token"];
    if (adminToken !== (process.env.PORTAL_ADMIN_TOKEN || "criskros-admin-2026")) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { email, password, teamName, organization, registrationId } = req.body;
    if (!email || !password || !teamName || !organization) {
      return res.status(400).json({ error: "email, password, teamName, organization are required" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [account] = await db
      .insert(teamAccountsTable)
      .values({
        email: email.toLowerCase().trim(),
        passwordHash,
        teamName,
        organization,
        registrationId: registrationId || null,
        isActive: true,
      })
      .returning();

    return res.status(201).json({
      success: true,
      data: {
        id: account.id,
        email: account.email,
        teamName: account.teamName,
        organization: account.organization,
      },
    });
  } catch (err: any) {
    if (err.code === "23505" || err.cause?.code === "23505") {
      return res.status(409).json({ error: "An account with this email already exists" });
    }
    console.error("Create account error:", err);
    return res.status(500).json({ error: "Failed to create account" });
  }
});

export default router;
