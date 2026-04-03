import { useEffect, useState } from "react";
import PortalLayout from "./PortalLayout";
import { getPortalTeam, portalFetch, clearPortalSession } from "@/lib/portalAuth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Images, Bell, Users, Trophy, Calendar, Mail } from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  date: string;
  priority: string;
  pinned: boolean;
  content: string;
}

export default function PortalDashboard() {
  const team = getPortalTeam();
  const [, setLocation] = useLocation();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    portalFetch("/api/portal/announcements")
      .then(r => {
        if (r.status === 401) { clearPortalSession(); setLocation("/portal"); return null; }
        return r.json();
      })
      .then(d => {
        if (d?.success) setAnnouncements(d.data.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  const priorityColor: Record<string, string> = {
    urgent: "bg-red-100 text-red-700 border-red-200",
    important: "bg-amber-100 text-amber-700 border-amber-200",
    normal: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <PortalLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-[#1E2D6B] to-[#2a3f95] rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">Welcome, {team?.teamName}! 👋</h1>
              <p className="text-white/70">{team?.organization}</p>
            </div>
            <Badge className="bg-[#9B30A0] text-white border-none text-sm px-3 py-1">
              Registered Team
            </Badge>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { icon: Users, label: "Team Size", value: "7 Members" },
              { icon: Trophy, label: "Season", value: "Season 1 · 2026" },
              { icon: Calendar, label: "Event Date", value: "Coming Soon" },
            ].map(stat => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4 flex items-center gap-3">
                <stat.icon size={20} className="text-[#9B30A0] flex-shrink-0" />
                <div>
                  <p className="text-white/60 text-xs">{stat.label}</p>
                  <p className="font-semibold text-sm">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="/portal/gallery" className="group">
            <Card className="hover:border-[#9B30A0]/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <Images size={22} className="text-[#9B30A0]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Photo Gallery</p>
                  <p className="text-sm text-gray-500">Browse event photos and moments</p>
                </div>
              </CardContent>
            </Card>
          </a>
          <a href="/portal/announcements" className="group">
            <Card className="hover:border-[#9B30A0]/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Bell size={22} className="text-[#1E2D6B]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Announcements</p>
                  <p className="text-sm text-gray-500">Important updates for your team</p>
                </div>
              </CardContent>
            </Card>
          </a>
        </div>

        {/* Latest announcements */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Latest Announcements</h2>
            <a href="/portal/announcements" className="text-sm text-[#9B30A0] hover:underline">
              View all →
            </a>
          </div>
          {announcements.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-400">
                <Bell size={32} className="mx-auto mb-3 opacity-30" />
                <p>No announcements yet. Check back soon!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {announcements.map(ann => (
                <Card key={ann.id} className={ann.pinned ? "border-[#9B30A0]/30" : ""}>
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">{ann.title}</p>
                        {ann.pinned && <Badge variant="outline" className="text-xs">Pinned</Badge>}
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColor[ann.priority] || priorityColor.normal}`}>
                          {ann.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{new Date(ann.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Contact */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6 flex items-center gap-4">
            <Mail size={20} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-700">Need help or have questions?</p>
              <p className="text-sm text-gray-500">
                Reach us at{" "}
                <a href="mailto:admin@criskros.com" className="text-[#9B30A0] hover:underline">
                  admin@criskros.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
