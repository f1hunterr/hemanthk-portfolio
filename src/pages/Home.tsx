import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-[var(--bg)] text-[var(--ink)]">
      <Navbar />
      <main>
        {/* The hero runs edge to edge; everything after sits inside the hairline frame */}
        <Hero />
        <div className="frame">
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Contact />
        </div>
      </main>
      <div className="frame">
        <Footer />
      </div>
    </div>
  );
}
