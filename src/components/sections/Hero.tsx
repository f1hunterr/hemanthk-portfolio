import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Download, Mail, Server, Users, Monitor, Cpu, Briefcase, Github, Linkedin } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

const TITLES = [
  "IT Manager & Infrastructure Lead",
  "Automation & Systems Specialist",
  "Network & Security Operations",
  "Server Infrastructure Engineer",
];

export function Hero() {
  const [titleIdx, setTitleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "pause" | "deleting">("typing");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const current = TITLES[titleIdx];
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (displayed.length < current.length) {
        timer = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 65);
      } else {
        timer = setTimeout(() => setPhase("pause"), 1800);
      }
    } else if (phase === "pause") {
      timer = setTimeout(() => setPhase("deleting"), 100);
    } else {
      if (displayed.length > 0) {
        timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
      } else {
        setTitleIdx((i) => (i + 1) % TITLES.length);
        setPhase("typing");
      }
    }

    return () => clearTimeout(timer);
  }, [displayed, phase, titleIdx, reduceMotion]);

  const handleScrollTo = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleDownloadResume = () => {
    window.open(`${import.meta.env.BASE_URL}resume.html`, '_blank', 'noopener,noreferrer');
  };

  const stats = [
    { value: "200+", label: "Systems Managed", icon: <Monitor className="w-5 h-5" /> },
    { value: "100+", label: "Remote Users", icon: <Users className="w-5 h-5" /> },
    { value: "6+", label: "Years Experience", icon: <Briefcase className="w-5 h-5" /> },
    { value: "10+", label: "Projects Delivered", icon: <Cpu className="w-5 h-5" /> },
    { value: "5+", label: "Servers Maintained", icon: <Server className="w-5 h-5" /> },
  ];

  return (
    <section id="home" className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-white dark:bg-background overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #1f3a5f 0%, transparent 70%)", transform: "translate(20%, -30%)" }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center max-w-6xl mx-auto">

          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-block text-sm font-semibold text-primary uppercase tracking-widest px-3 py-1 bg-primary/8 rounded-full border border-primary/15">
                IT & Automation Manager · HOBB
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-950/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                Open to Work
              </span>
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-[2.75rem] xl:text-5xl font-bold text-foreground mb-4 leading-tight"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Hemanth K
            </h1>

            <p
              className="text-base md:text-lg font-medium text-primary mb-5 leading-snug min-h-[1.75rem]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {reduceMotion ? TITLES[0] : displayed}
              {!reduceMotion && (
                <span className="animate-pulse ml-0.5 inline-block w-0.5 h-5 bg-primary align-middle" aria-hidden="true" />
              )}
            </p>

            <p className="text-base text-muted-foreground mb-8 leading-relaxed max-w-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
              Building reliable IT systems, automating day-to-day operations, and managing infrastructure at scale — with hands-on experience across servers, networks, and enterprise IT environments.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-0">
              <Button
                size="lg"
                className="gap-2 font-medium"
                style={{ backgroundColor: "var(--portfolio-navy)", color: "#fff" }}
                onClick={() => handleScrollTo("#projects")}
                data-testid="button-view-projects"
              >
                View Projects
                <ArrowDown size={17} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 font-medium border-primary/40 text-primary hover:bg-primary hover:text-white hover:border-primary transition-colors"
                onClick={handleDownloadResume}
                data-testid="button-download-resume"
              >
                <Download size={17} />
                Download Resume
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="gap-2 font-medium"
                onClick={() => handleScrollTo("#contact")}
                data-testid="button-contact-me"
              >
                <Mail size={17} />
                Contact Me
              </Button>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <a
                href="https://www.linkedin.com/in/hemanth-k-8609b4255"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={17} />
              </a>
              <a
                href="https://github.com/f1hunterr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                aria-label="GitHub"
              >
                <Github size={17} />
              </a>
              <a
                href="https://wa.me/918088461724?text=Hi%20Hemanth%2C%20I%20came%20across%20your%20portfolio%20and%20would%20like%20to%20connect!"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:text-[#25D366] hover:border-[#25D366]/40 transition-colors"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon size={17} />
              </a>
            </div>
          </motion.div>

          {/* Right: Profile Photo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center md:justify-end"
          >
            <div className="relative mx-6 sm:mx-4 md:mx-0">
              <div
                className="w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-2xl overflow-hidden shadow-xl"
                style={{ border: "4px solid var(--portfolio-navy)" }}
              >
                <img
                  src={`${import.meta.env.BASE_URL}profile.jpg`}
                  alt="Hemanth K"
                  width={640}
                  height={791}
                  fetchPriority="high"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Floating badge: top-right */}
              <div className="absolute -top-4 -right-4 bg-white dark:bg-card rounded-xl shadow-md px-3 py-2 border border-border text-xs font-semibold text-primary" style={{ fontFamily: "'Poppins', sans-serif" }}>
                200+ Systems
              </div>
              {/* Floating badge: bottom-left */}
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-card rounded-xl shadow-md px-3 py-2 border border-border text-xs font-semibold text-primary" style={{ fontFamily: "'Poppins', sans-serif" }}>
                HOBB
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-16 max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center text-center py-5 px-4 rounded-xl border border-border bg-secondary/60 shadow-sm hover:shadow-md hover:border-primary/25 transition-all last:col-span-2 last:sm:col-span-1"
              >
                <span className="text-primary/60 mb-2">{stat.icon}</span>
                <span
                  className="text-2xl font-bold text-foreground mb-0.5"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground font-medium leading-tight text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
