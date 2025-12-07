import ParticleSwarm from '@/components/ParticleSwarm';
import FocusCard from '@/components/FocusCard';
import { useParallax } from '@/hooks/useParallax';

const Index = () => {
  const parallaxOffset = useParallax(0.3);

  const focusAreas = [
    {
      title: 'Data Architecture',
      description: 'Structuring medical datasets with semantic precision. Building foundations that connect imaging, clinical records, and real-world evidence.',
    },
    {
      title: 'Knowledge Graphs',
      description: 'Transforming fragmented clinical data into interconnected knowledge. Enabling AI systems that understand context, not just patterns.',
    },
    {
      title: 'Grounded AI',
      description: 'Large language models anchored in verifiable knowledge. Transparent reasoning that speaks for itself in natural language.',
    },
    {
      title: 'Clinical Integration',
      description: 'Where radiology meets the rest of healthcare. Breaking silos, building bridges between systems that need to communicate.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <ParticleSwarm />
      
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background/50" />
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 lg:px-16">
        <div className="font-display text-xl font-semibold tracking-tight text-foreground">
          DIGIT-X
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#mission" className="nav-link text-sm">Mission</a>
          <a href="#focus" className="nav-link text-sm">Focus</a>
          <a href="#connect" className="nav-link text-sm">Connect</a>
        </div>
      </nav>

      {/* Hero Section with Parallax */}
      <section 
        className="relative z-10 min-h-[85vh] flex flex-col justify-center px-8 lg:px-16 max-w-6xl mx-auto"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        <div className="space-y-8 parallax-slow">
          <div className="space-y-4 animate-fade-up">
            <p className="text-gradient-neon text-sm font-medium tracking-widest uppercase">
              LMU Klinikum · Department of Radiology
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="text-foreground">DIGIT</span>
              <span className="text-gradient-neon glow-text-neon">-X</span>
            </h1>
          </div>
          
          <p className="animate-fade-up-delay-1 text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-light">
            Rethinking how medical data becomes <span className="text-gradient-neon">intelligence</span>.
          </p>
          
          <p className="animate-fade-up-delay-2 text-muted-foreground/70 max-w-xl leading-relaxed">
            We work at the intersection of healthcare data, artificial intelligence, and clinical informatics — 
            building infrastructure that connects, structures, and explains.
          </p>

          <div className="animate-fade-up-delay-3 flex items-center gap-6 pt-4">
            <a 
              href="#focus" 
              className="group inline-flex items-center gap-2 text-foreground font-medium transition-colors hover:text-gradient-neon"
            >
              Explore our focus
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="relative z-10 py-32 px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="border-glow rounded-2xl p-8 md:p-12 glow-box">
            <p className="text-sm text-gradient-neon font-medium tracking-widest uppercase mb-6">
              Our Purpose
            </p>
            <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl font-light text-foreground leading-relaxed">
              "To build more than just tools — infrastructure that moves data, connects silos, 
              and makes AI a catalyst that stays{' '}
              <span className="text-gradient-neon">transparent</span> and speaks for itself."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section id="focus" className="relative z-10 py-24 px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-sm text-gradient-neon font-medium tracking-widest uppercase mb-4">
              What We Build
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Focus Areas
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {focusAreas.map((area, index) => (
              <FocusCard
                key={area.title}
                title={area.title}
                description={area.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="relative z-10 py-24 px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-gradient-neon font-medium tracking-widest uppercase mb-8">
            How We Work
          </p>
          <ul className="space-y-6">
            {[
              'Useful, reproducible, and explainable',
              'Grounded in clinical reality',
              'Technically rigorous, semantically precise',
              'Quietly ambitious about the hard things',
            ].map((principle, index) => (
              <li 
                key={index}
                className="flex items-start gap-4 text-muted-foreground group hover:text-foreground transition-colors duration-300"
              >
                <span className="principle-dot mt-2.5 group-hover:scale-150 transition-transform" />
                <span className="font-display text-lg md:text-xl">{principle}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Connect Section */}
      <section id="connect" className="relative z-10 py-32 px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gradient-neon font-medium tracking-widest uppercase mb-4">
            Early Days
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
            We're just getting started
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10">
            A new lab, still forming. If you're interested in healthcare data, knowledge graphs, 
            or building AI that explains itself — follow along.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://www.linkedin.com/company/digit-x-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Follow on LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-8 lg:px-16 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-display text-sm text-muted-foreground">
            DIGIT-X Lab · LMU Klinikum Munich
          </div>
          <div className="text-xs text-muted-foreground/50">
            Department of Radiology
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
