import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "./ui/button"
import { motion, AnimatePresence } from "framer-motion"

const NAV_LINKS = [
  { label: "Concept", href: "#concept" },
  { label: "Benefits", href: "#benefits" },
  { label: "Why Criskros", href: "#testimonials" },
  { label: "Team & Fees", href: "#team-fees" },
  { label: "About Us", href: "#about" },
  { label: "News", href: "#news" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 z-50 relative">
          <img 
            src={`${import.meta.env.BASE_URL}criskros-logo.png`} 
            alt="Criskros Logo" 
            className="h-10 md:h-12 w-auto object-contain drop-shadow-md"
            onError={(e) => {
              // Fallback to text if image fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<span class="font-display font-black text-2xl text-primary tracking-tight">CRIS<span class="text-accent">KROS</span></span>');
            }}
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`text-sm font-semibold transition-colors hover:text-accent ${
                    isScrolled ? "text-foreground" : "text-white"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button asChild variant={isScrolled ? "gradient" : "accent"} className="rounded-full px-8">
            <a href="#register">Register Now</a>
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className={`md:hidden z-50 relative p-2 rounded-full ${
            isScrolled || isMobileMenuOpen ? "text-foreground" : "text-white"
          }`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 right-0 bg-white shadow-xl pt-24 pb-8 px-6 flex flex-col gap-6 md:hidden"
            >
              <ul className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-semibold text-foreground hover:text-accent block py-2 border-b border-border/50"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <Button asChild variant="gradient" className="w-full mt-4" size="lg">
                <a href="#register" onClick={() => setIsMobileMenuOpen(false)}>
                  Register Now
                </a>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
