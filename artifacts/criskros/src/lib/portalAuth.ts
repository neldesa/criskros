const TOKEN_KEY = "criskros_portal_token";
const TEAM_KEY = "criskros_portal_team";

export interface TeamInfo {
  teamName: string;
  organization: string;
  email: string;
}

export function savePortalSession(token: string, team: TeamInfo) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TEAM_KEY, JSON.stringify(team));
}

export function getPortalToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getPortalTeam(): TeamInfo | null {
  const raw = localStorage.getItem(TEAM_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function clearPortalSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TEAM_KEY);
}

export function isPortalLoggedIn(): boolean {
  return !!getPortalToken();
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export async function portalFetch(path: string, options: RequestInit = {}) {
  const token = getPortalToken();
  return fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}
