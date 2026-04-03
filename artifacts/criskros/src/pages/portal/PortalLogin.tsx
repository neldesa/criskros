import { useState } from "react";
import { useLocation } from "wouter";
import { savePortalSession, portalFetch } from "@/lib/portalAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PortalLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await portalFetch("/api/portal/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      savePortalSession(data.token, data.team);
      setLocation("/portal/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "linear-gradient(135deg, #1E2D6B 0%, #0f1a3e 100%)" }}
    >
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#9B30A0] flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-white font-bold text-2xl tracking-wide">CRISKROS</span>
          </div>
          <p className="text-white/70 text-sm">Team Portal</p>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-md text-white shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-xl">Team Login</CardTitle>
            <CardDescription className="text-white/60">
              Sign in to access your team's portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="team@organization.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#9B30A0]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#9B30A0]"
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 rounded-md px-3 py-2">{error}</p>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#9B30A0] hover:bg-[#7d2582] text-white font-semibold py-2.5"
              >
                {loading ? "Signing in…" : "Sign In"}
              </Button>
            </form>
            <p className="text-center text-white/40 text-xs mt-6">
              Don't have access? Contact{" "}
              <a href="mailto:admin@criskros.com" className="text-[#9B30A0] hover:underline">
                admin@criskros.com
              </a>
            </p>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <a href="/" className="text-white/40 text-sm hover:text-white/70 transition-colors">
            ← Back to main site
          </a>
        </div>
      </div>
    </div>
  );
}
