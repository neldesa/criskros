import { useLocation } from "wouter";
import { getPortalTeam, clearPortalSession } from "@/lib/portalAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, Images, Bell, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

interface PortalLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/gallery", label: "Gallery", icon: Images },
  { href: "/portal/announcements", label: "Announcements", icon: Bell },
];

export default function PortalLayout({ children }: PortalLayoutProps) {
  const [location, setLocation] = useLocation();
  const team = getPortalTeam();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    clearPortalSession();
    setLocation("/portal");
  }

  const initials = team?.teamName
    ? team.teamName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "T";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top nav */}
      <header className="bg-[#1E2D6B] text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center gap-2 font-bold text-lg tracking-wide">
              <div className="w-7 h-7 rounded-full bg-[#9B30A0] flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span>CRISKROS</span>
            </a>
            <span className="text-white/30 hidden sm:block">|</span>
            <span className="text-white/60 text-sm hidden sm:block">Team Portal</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location === item.href
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full hover:bg-white/10 px-2 py-1 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#9B30A0] text-white text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-white/80 hidden sm:block max-w-[140px] truncate">
                    {team?.teamName}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="font-medium text-sm truncate">{team?.teamName}</p>
                  <p className="text-xs text-gray-500 truncate">{team?.organization}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut size={14} className="mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              className="md:hidden text-white/70 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-white/10 px-4 py-2 flex flex-col gap-1">
            {navItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  location === item.href
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
