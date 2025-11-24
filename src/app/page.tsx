import FluidHero from '@/components/3d/FluidHero';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ContactSection from '@/components/sections/ContactSection';
import ParticleBackground from '@/components/3d/ParticleBackground';

export default function Home() {
  return (
    <main className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-zinc-950 text-white selection:bg-cyan-500/30 scroll-smooth relative">
      
      <ParticleBackground />

      {/* Hero Section */}
      <section id="home" className="h-screen w-full snap-start relative z-10">
        <FluidHero />
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Skills Section */}
      <SkillsSection />

      {/* Projects Section */}
      <ProjectsSection />

      {/* Contact Section */}
      <ContactSection />
      
    </main>
  );
}
