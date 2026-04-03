import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import PortalLayout from "./PortalLayout";
import { portalFetch, clearPortalSession } from "@/lib/portalAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Pin, AlertTriangle, Info, ChevronDown, ChevronUp } from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  priority: "normal" | "important" | "urgent";
  pinned: boolean;
}

function AnnouncementCard({ ann }: { ann: Announcement }) {
  const [expanded, setExpanded] = useState(ann.pinned);

  const priorityConfig = {
    urgent: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 border-red-200", badge: "bg-red-100 text-red-700" },
    important: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50 border-amber-200", badge: "bg-amber-100 text-amber-700" },
    normal: { icon: Info, color: "text-blue-600", bg: "bg-white border-gray-200", badge: "bg-blue-100 text-blue-700" },
  };
  const cfg = priorityConfig[ann.priority];
  const Icon = cfg.icon;

  return (
    <Card className={`border ${cfg.bg} transition-all`}>
      <CardContent className="p-0">
        <button
          className="w-full text-left p-5 flex items-start gap-4"
          onClick={() => setExpanded(!expanded)}
        >
          <div className={`mt-0.5 flex-shrink-0 ${cfg.color}`}>
            <Icon size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900">{ann.title}</span>
              {ann.pinned && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Pin size={11} /> Pinned
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${cfg.badge}`}>
                {ann.priority}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(ann.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <span className="text-gray-400 flex-shrink-0 mt-0.5">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>
        {expanded && (
          <div className="px-5 pb-5 pt-0 ml-10">
            <div
              className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: ann.content }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function PortalAnnouncements() {
  const [, setLocation] = useLocation();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portalFetch("/api/portal/announcements")
      .then(r => {
        if (r.status === 401) { clearPortalSession(); setLocation("/portal"); return null; }
        return r.json();
      })
      .then(d => {
        if (d?.success) {
          const sorted = [...d.data].sort((a: Announcement, b: Announcement) => {
            if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
            const urgency: Record<string, number> = { urgent: 0, important: 1, normal: 2 };
            return (urgency[a.priority] ?? 2) - (urgency[b.priority] ?? 2);
          });
          setAnnouncements(sorted);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Announcements</h1>
          <p className="text-gray-500 text-sm">Important updates and information for your team</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Bell size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">No announcements yet</p>
            <p className="text-sm mt-1">Check back here for important updates from the organizers</p>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map(ann => (
              <AnnouncementCard key={ann.id} ann={ann} />
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
