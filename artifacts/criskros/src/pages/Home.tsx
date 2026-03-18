import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/Navbar"
import { RegistrationForm } from "@/components/RegistrationForm"
import { Button } from "@/components/ui/button"
import { 
  Trophy, Users, Target, Zap, Building2, TrendingUp, 
  CheckCircle2, ArrowRight, PlayCircle, MapPin, Calendar, Mail
} from "lucide-react"

const NAV_LINKS = [
  { label: "Concept", href: "#concept" },
  { label: "Benefits", href: "#benefits" },
  { label: "Why Criskros", href: "#testimonials" },
  { label: "Team & Fees", href: "#team-fees" },
  { label: "About Us", href: "#about" },
  { label: "News", href: "#news" },
]

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

const FALLBACK_TESTIMONIALS = [
  { name: "Rajesh Mehta", quote: "Criskros transformed our annual sports day into something truly exceptional. The multi-sport format pushed every team member out of their comfort zone.", designation: "HR Director", company: "TechVision India" },
  { name: "Priya Nair", quote: "We had 7 people from completely different departments come together and win. Criskros is not just sport — it's the best team-building experience we've had in years.", designation: "CEO", company: "Nexus Solutions" },
  { name: "Arun Sharma", quote: "The concept of smart sports is brilliant. Strategy and fitness combined — it levels the playing field and makes everyone feel they can contribute meaningfully.", designation: "Operations Head", company: "Pinnacle Corp" },
];

const FALLBACK_NEWS = [
  { title: "Criskros Season 1 Registration Now Open", date: "March 1, 2026", description: "We are thrilled to announce that registrations for the inaugural Criskros season are now open. Teams from across India are invited to participate.", category: "Announcement" },
  { title: "What Makes Criskros Different from Regular Sports Days", date: "Feb 15, 2026", description: "Unlike traditional corporate sports events, Criskros combines multiple disciplines with strategy and team dynamics. Here's a deep dive.", category: "Feature" },
  { title: "Venue Announcement: Season 1 Location Confirmed", date: "Feb 1, 2026", description: "We are pleased to announce the venue for the first Criskros event. A world-class multi-sport facility has been confirmed.", category: "Event Update" },
];

const FALLBACK_TEAM = [
  { name: "Vikram Anand", role: "Founder & CEO", memberType: "management" },
  { name: "Sunita Reddy", role: "Co-Founder & COO", memberType: "management" },
  { name: "Kiran Patel", role: "Head of Partnerships", memberType: "management" },
];

const FALLBACK_MENTORS = [
  { name: "Dr. Arvind Rao", role: "Sports Science Advisor", memberType: "mentor" },
  { name: "Meena Krishnan", role: "Business Strategy Advisor", memberType: "advisor" },
];

export default function Home() {
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);
  const [news, setNews] = useState(FALLBACK_NEWS);
  const [management, setManagement] = useState(FALLBACK_TEAM);
  const [mentors, setMentors] = useState(FALLBACK_MENTORS);

  useEffect(() => {
    fetch('/api/cms/api/testimonials?publicationState=live')
      .then(r => r.json())
      .then(({ data }) => { if (data?.length) setTestimonials(data.map((d: any) => d)); })
      .catch(() => {});

    fetch('/api/cms/api/news-items?sort=date:desc&publicationState=live')
      .then(r => r.json())
      .then(({ data }) => {
        if (data?.length) setNews(data.map((d: any) => ({
          ...d,
          date: d.date ? new Date(d.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '',
        })));
      })
      .catch(() => {});

    fetch('/api/cms/api/team-members?sort=order:asc&publicationState=live')
      .then(r => r.json())
      .then(({ data }) => {
        if (data?.length) {
          setManagement(data.filter((d: any) => d.memberType === 'management'));
          setMentors(data.filter((d: any) => d.memberType !== 'management'));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-abstract.png`}
            alt="Abstract background"
            className="w-full h-full object-cover"
          />
          {/* Unsplash fallback for context/inspiration if generated image fails */}
          {/* marketing landing page sports stadium track abstract */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-accent/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl">
            
            <motion.h1 
              className="font-display text-5xl md:text-7xl font-black text-white leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-pink-300">Smart Sports</span> Experience
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-2xl text-blue-50 mb-10 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Where corporate teams battle across multiple sports disciplines. It's not just about athletic prowess—it's about strategy, teamwork, and dynamic execution.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button size="lg" variant="gradient" asChild className="text-lg px-8 rounded-full h-14">
                <a href="#register">Register Your Team</a>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 rounded-full h-14 border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm">
                <a href="#concept">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Watch Trailer
                </a>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Decorative angle separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-background">
            <path d="M0 120L1440 0V120H0Z" fill="currentColor" />
          </svg>
        </div>
      </section>

      {/* CONCEPT SECTION */}
      <section id="concept" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-2">The Concept</h2>
            <h3 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">What is Criskros?</h3>
            <p className="text-lg text-muted-foreground">
              Criskros is an innovative multi-sport team event designed exclusively for organizations and corporates.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="space-y-8"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-foreground mb-2">Team of 7</h4>
                  <p className="text-muted-foreground">Teams consist of exactly 7 members representing their organization. A mix of men and women is highly encouraged.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-foreground mb-2">Multi-Disciplinary</h4>
                  <p className="text-muted-foreground">Compete across diverse sports disciplines. No single sport defines the champion.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-foreground mb-2">Smart Sports</h4>
                  <p className="text-muted-foreground">It rewards strategy, team dynamics, and adaptability just as much as pure athletic strength.</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative">
                {/* team huddle high five sports */}
                <img 
                  src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=1000" 
                  alt="Team Huddle" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-8">
                  <p className="text-white font-display text-2xl font-bold">More than a game. It's a movement.</p>
                </div>
              </div>
              {/* Decorative block */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section id="benefits" className="py-24 bg-secondary/50 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-2">Why Participate?</h2>
            <h3 className="font-display text-4xl font-bold text-foreground mb-6">Benefits for Your Organization</h3>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { icon: Users, title: "Team Building", desc: "Forge unbreakable bonds outside the office environment." },
              { icon: Zap, title: "Employee Engagement", desc: "Boost morale and wellness with healthy, active competition." },
              { icon: Building2, title: "Brand Visibility", desc: "Showcase your company's vibrant culture to the corporate world." },
              { icon: TrendingUp, title: "Networking", desc: "Connect with other forward-thinking organizations." },
              { icon: Trophy, title: "Healthy Competition", desc: "Channel competitive spirits into constructive, shared goals." },
              { icon: Target, title: "The Thrill", desc: "Experience the pure adrenaline of multi-sport tournaments." },
            ].map((benefit, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md hover:border-primary/20 transition-all group"
              >
                <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                  <benefit.icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">{benefit.title}</h4>
                <p className="text-muted-foreground">{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-24 bg-background overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full">
          <img 
            src={`${import.meta.env.BASE_URL}images/pattern-mesh.png`}
            alt=""
            className="w-full h-full object-cover opacity-[0.03]"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-2">Endorsements</h2>
            <h3 className="font-display text-4xl font-bold text-foreground mb-6">Why Criskros?</h3>
            <p className="text-lg text-muted-foreground">Hear from leaders who have experienced the Criskros impact.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-primary/5 rounded-3xl p-8 relative"
              >
                <div className="text-accent/20 mb-6">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-foreground text-lg mb-8 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-foreground">{testimonial.name}</h5>
                    <p className="text-sm text-muted-foreground">{testimonial.designation || (testimonial as any).role}, {testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM & FEES SECTION */}
      <section id="team-fees" className="py-24 bg-primary text-primary-foreground relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-2">Requirements</h2>
              <h3 className="font-display text-4xl md:text-5xl font-bold mb-8">Team & Fees</h3>
              
              <div className="space-y-8 mb-8">
                <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                  <h4 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <Users className="text-accent" /> 
                    Team Composition
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-blue-50">Strictly 7 members per team</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-blue-50">All members must belong to the same organization</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-blue-50">Mix of men and women is highly encouraged</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-card text-card-foreground rounded-3xl p-8 sm:p-10 shadow-2xl relative"
            >
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-accent text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                Per Team
              </div>
              
              <h4 className="font-display text-3xl font-bold mb-2">Participation Fee</h4>
              <p className="text-muted-foreground mb-6">Secure your organization's slot in the ultimate tournament.</p>
              
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-foreground">$1,500</span>
                <span className="text-muted-foreground font-medium">/ team</span>
              </div>

              <div className="space-y-4 mb-10">
                <p className="font-bold text-sm uppercase tracking-wider text-muted-foreground">What's Included</p>
                {[
                  "Tournament entry for 7 players",
                  "Premium custom team jerseys & kits",
                  "All professional sports equipment",
                  "Catered meals and hydration stations",
                  "Access to networking gala",
                  "Professional media coverage of team"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-foreground/80 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" className="w-full" asChild>
                <a href="#register">Start Registration</a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* REGISTRATION SECTION */}
      <section id="register" className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-16">
            
            <motion.div 
              className="lg:col-span-5"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-2">Join The Event</h2>
              <h3 className="font-display text-4xl font-bold text-foreground mb-8">How to Register</h3>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {[
                  {
                    step: 1,
                    title: "Submit Interest",
                    desc: "Fill in the registration form to create a provisional booking for your team."
                  },
                  {
                    step: 2,
                    title: "Confirm Slot",
                    desc: "Pay the participation fee offline to confirm your slot and become a 'Registered Team'."
                  },
                  {
                    step: 3,
                    title: "Next Steps",
                    desc: "Organizers will contact you with team kit details, schedules, and rules."
                  }
                ].map((item) => (
                  <div key={item.step} className="relative flex items-start gap-6">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-primary text-primary font-bold flex items-center justify-center shrink-0 relative z-10 shadow-sm">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground mb-2">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="lg:col-span-7"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <RegistrationForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT US & NEWS */}
      <section id="about" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-2">The People Behind</h2>
            <h3 className="font-display text-4xl font-bold text-foreground mb-6">About Us</h3>
          </div>

          <div className="mb-20">
            <h4 className="text-2xl font-bold text-foreground mb-8 text-center">Management Team</h4>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {management.map((member, i) => (
                <div key={i} className="text-center group">
                  <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 border-4 border-background shadow-xl group-hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-white font-bold text-5xl">{member.name.charAt(0)}</span>
                  </div>
                  <h5 className="text-xl font-bold text-foreground">{member.name}</h5>
                  <p className="text-accent font-medium">{member.role}</p>
                  {(member as any).bio && <p className="text-muted-foreground text-sm mt-2 max-w-xs mx-auto">{(member as any).bio}</p>}
                </div>
              ))}
            </div>
          </div>

          {mentors.length > 0 && (
            <div className="mb-20">
              <h4 className="text-2xl font-bold text-foreground mb-8 text-center">Mentors & Advisors</h4>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                {mentors.map((member, i) => (
                  <div key={i} className="text-center group">
                    <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 border-4 border-background shadow-xl group-hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                      <span className="text-white font-bold text-5xl">{member.name.charAt(0)}</span>
                    </div>
                    <h5 className="text-xl font-bold text-foreground">{member.name}</h5>
                    <p className="text-accent font-medium">{member.role}</p>
                    {(member as any).bio && <p className="text-muted-foreground text-sm mt-2 max-w-xs mx-auto">{(member as any).bio}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div id="news" className="pt-20 border-t border-border">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-2">Updates</h2>
                <h3 className="font-display text-3xl font-bold text-foreground">News & Trivia</h3>
              </div>
              <Button variant="ghost" className="hidden sm:flex">View All</Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {news.map((item, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="aspect-video bg-muted rounded-2xl mb-4 overflow-hidden relative">
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Trophy className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    {(item as any).category && (
                      <div className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                        {(item as any).category}
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-accent mb-2">{item.date}</p>
                  <h4 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{item.title}</h4>
                  <p className="text-muted-foreground line-clamp-2">{item.description || (item as any).desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-foreground text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <img 
                src={`${import.meta.env.BASE_URL}criskros-logo.png`} 
                alt="Criskros" 
                className="h-16 w-auto mb-6 bg-white/10 p-2 rounded-lg"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <p className="text-blue-200 max-w-sm mb-6">
                The premier multi-sport event for corporates. Fostering team building, strategy, and healthy competition.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors cursor-pointer">
                    <div className="w-4 h-4 bg-white/50 rounded-sm" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3 text-blue-200">
                {NAV_LINKS.map(link => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:text-white transition-colors">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Contact Us</h4>
              <ul className="space-y-4 text-blue-200">
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-accent shrink-0" />
                  <a href="mailto:hello@criskros.com" className="hover:text-white transition-colors">hello@criskros.com</a>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-accent shrink-0" />
                  <span>Mon - Fri, 9am - 6pm</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-accent shrink-0" />
                  <span>Global Headquarters</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-blue-300">
            <p>© {new Date().getFullYear()} Criskros. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
