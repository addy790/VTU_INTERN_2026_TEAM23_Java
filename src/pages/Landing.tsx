import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, GraduationCap, Building2, ShieldCheck, Briefcase, Sparkles, BarChart3, Calendar, Bell } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useRole, type Role } from "@/context/RoleContext";

const roles: { id: Role; title: string; desc: string; icon: any; href: string }[] = [
  { id: "student", title: "Student", desc: "Apply to drives, track your pipeline & interviews.", icon: GraduationCap, href: "/student" },
  { id: "admin", title: "TPO / Admin", desc: "Run the placement season end-to-end with analytics.", icon: ShieldCheck, href: "/admin" },
  { id: "coordinator", title: "Coordinator", desc: "Verify profiles, manage applications & comms.", icon: Briefcase, href: "/coordinator" },
  { id: "recruiter", title: "Recruiter", desc: "Discover candidates, shortlist & schedule interviews.", icon: Building2, href: "/recruiter" },
];

const features = [
  { icon: BarChart3, title: "Real placement intelligence", body: "Department-wise analytics, company hiring funnels, and live placement-rate signals." },
  { icon: Calendar, title: "Interview-ready scheduling", body: "Calendar with rounds, modes, and timezone-aware reminders for every stakeholder." },
  { icon: Bell, title: "Notifications that matter", body: "Toast + inbox UI tuned for actionable updates — never noisy, never missed." },
  { icon: Sparkles, title: "Designed for trust", body: "Editorial typography, considered density, and accessibility built into every screen." },
];

const Landing = () => {
  const navigate = useNavigate();

  const enter = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen hero-bg">
      {/* Nav */}
      <header className="container flex items-center justify-between py-6">
        <Logo />
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#roles" className="hover:text-foreground transition-colors">Roles</a>
          <a href="#metrics" className="hover:text-foreground transition-colors">Outcomes</a>
        </nav>
        <button
          onClick={() => navigate("/auth")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/60 px-3.5 py-2 text-sm hover:bg-secondary transition-colors"
        >
          Sign in <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </header>

      {/* Hero */}
      <section className="container relative pt-12 md:pt-20 pb-16">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-glow shadow-glow" />
            Placement season 2026 is live · 118 offers this month
          </div>
          <h1 className="mt-6 font-display text-5xl md:text-7xl font-semibold leading-[1.02] tracking-tight">
            The <span className="text-gradient-maroon">placement OS</span><br />
            top universities run on.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            PAT unifies students, coordinators, TPOs and recruiters in a single, calm workspace —
            from drive creation to offer letter, with the rigor of a modern SaaS.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
              onClick={() => navigate("/auth")}
            <a href="#roles" className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-5 py-3 text-sm hover:bg-secondary transition-colors">
              Pick a role
            </a>
          </div>

          {/* Metric strip */}
          <div id="metrics" className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
            {[
              { k: "94%", v: "Placement rate" },
              { k: "320+", v: "Recruiters" },
              { k: "26 LPA", v: "Median package" },
              { k: "12k+", v: "Students managed" },
            ].map(s => (
              <div key={s.v} className="surface-card p-4">
                <div className="font-display text-2xl md:text-3xl font-semibold">{s.k}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="container py-16 md:py-24">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="text-xs uppercase tracking-widest text-accent">Choose your view</div>
            <h2 className="font-display text-3xl md:text-4xl font-medium mt-2">A workspace shaped to each role.</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Demo any role instantly. State persists locally, so you can switch and return without losing context.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((r, i) => (
            <button
              key={r.id}
              onClick={() => navigate("/auth")}
              className="group text-left surface-card p-6 hover:shadow-elegant hover:border-primary/40 transition-all animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="h-10 w-10 rounded-lg bg-gradient-maroon grid place-items-center shadow-glow">
                <r.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="mt-5 font-display text-xl">{r.title}</div>
              <p className="mt-1.5 text-sm text-muted-foreground">{r.desc}</p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm text-accent group-hover:gap-2.5 transition-all">
                Enter dashboard <ArrowRight className="h-4 w-4" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-16 md:py-24 border-t border-border">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <div className="text-xs uppercase tracking-widest text-accent">Built for placement teams</div>
            <h2 className="font-display text-3xl md:text-5xl font-medium mt-3 leading-[1.05]">
              Less spreadsheet chaos.<br />More confident decisions.
            </h2>
            <p className="mt-5 text-muted-foreground max-w-md">
              PAT replaces the tangle of forms, emails and group chats with a single source of truth — auditable, beautiful, and shockingly fast.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map(f => (
              <div key={f.title} className="surface-card p-5">
                <div className="h-9 w-9 rounded-md bg-secondary grid place-items-center text-accent">
                  <f.icon className="h-4 w-4" />
                </div>
                <div className="mt-4 font-medium">{f.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="surface-card p-10 md:p-14 text-center bg-gradient-noir relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
          <h3 className="relative font-display text-3xl md:text-4xl font-medium">Ready to see your season run smoother?</h3>
          <p className="relative mt-3 text-muted-foreground">Pick any role above to enter a fully interactive demo.</p>
          <div className="relative mt-7 flex justify-center gap-3 flex-wrap">
            <button onClick={() => navigate("/auth")} className="inline-flex items-center gap-2 rounded-lg bg-gradient-maroon px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow">
              Get Started <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => navigate("/auth")} className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-5 py-3 text-sm">
              Sign In
            </button>
          </div>
        </div>
      </section>

      <footer className="container border-t border-border py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-3"><Logo size="sm" /><span>© 2026 PAT — Placement Automation System</span></div>
        <div className="flex gap-5">
          <Link to="/student" className="hover:text-foreground">Student</Link>
          <Link to="/admin" className="hover:text-foreground">Admin</Link>
          <Link to="/coordinator" className="hover:text-foreground">Coordinator</Link>
          <Link to="/recruiter" className="hover:text-foreground">Recruiter</Link>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
