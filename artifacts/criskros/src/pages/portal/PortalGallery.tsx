import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import PortalLayout from "./PortalLayout";
import { portalFetch, clearPortalSession } from "@/lib/portalAuth";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Images, Search, X } from "lucide-react";

interface GalleryItem {
  id: number;
  title: string;
  caption?: string;
  imageUrl: string;
  date?: string;
  category?: string;
}

const CATEGORIES = ["all", "event", "training", "team", "ceremony", "other"];

export default function PortalGallery() {
  const [, setLocation] = useLocation();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  useEffect(() => {
    portalFetch("/api/portal/gallery")
      .then(r => {
        if (r.status === 401) { clearPortalSession(); setLocation("/portal"); return null; }
        return r.json();
      })
      .then(d => {
        if (d?.success) setItems(d.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          caption: item.caption,
          imageUrl: item.imageUrl,
          date: item.date,
          category: item.category,
        })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(item => {
    const matchesSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.caption?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || item.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Photo Gallery</h1>
          <p className="text-gray-500 text-sm">Photos and moments from Criskros events</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search photos…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                  category === cat
                    ? "bg-[#9B30A0] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Images size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">No photos yet</p>
            <p className="text-sm mt-1">Photos will appear here once the event begins</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(item => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <div className="text-left">
                    <p className="text-white text-xs font-semibold line-clamp-1">{item.title}</p>
                    {item.category && (
                      <span className="text-white/70 text-xs capitalize">{item.category}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            onClick={() => setSelected(null)}
          >
            <X size={28} />
          </button>
          <div className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <img
              src={selected.imageUrl}
              alt={selected.title}
              className="w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
            />
            <div className="mt-4 text-white">
              <p className="font-semibold text-lg">{selected.title}</p>
              {selected.caption && <p className="text-white/60 text-sm mt-1">{selected.caption}</p>}
              <div className="flex items-center gap-3 mt-2">
                {selected.category && (
                  <Badge className="bg-[#9B30A0] text-white capitalize">{selected.category}</Badge>
                )}
                {selected.date && (
                  <span className="text-white/40 text-xs">
                    {new Date(selected.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
