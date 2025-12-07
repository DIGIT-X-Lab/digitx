import ParticleSwarm from '@/components/ParticleSwarm';
import FocusCard from '@/components/FocusCard';
import MagneticLink from '@/components/MagneticLink';
import { useParallax } from '@/hooks/useParallax';

const Index = () => {
  const parallaxOffset = useParallax(0.4);

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
      {/* Noise texture */}
      <div className="noise-overlay" />
      
      {/* Floating orbs */}
      <div className="orb w-[600px] h-[600px] -top-40 -right-40" style={{ animationDelay: '0s' }} />
      <div className="orb w-[400px] h-[400px] top-1/2 -left-40" style={{ animationDelay: '-5s' }} />
      <div className="orb w-[500px] h-[500px] -bottom-40 right-1/4" style={{ animationDelay: '-10s' }} />
      
      <ParticleSwarm />
      
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background/80" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 lg:px-16">
        <div className="font-display text-xl font-bold tracking-tight text-foreground">
          DIGIT<span className="text-gradient-neon">—</span>X
        </div>
        <div className="hidden md:flex items-center gap-10">
          <MagneticLink href="#mission">Mission</MagneticLink>
          <MagneticLink href="#focus">Focus</MagneticLink>
          <MagneticLink href="#connect">Connect</MagneticLink>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative z-10 min-h-screen flex flex-col justify-center px-8 lg:px-16"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="space-y-10 parallax-slow">
            {/* Eyebrow */}
            <div className="kinetic-reveal">
              <span className="stagger-1 text-muted-foreground text-sm tracking-[0.3em] uppercase font-body font-light">
                LMU Klinikum · Department of Radiology
              </span>
            </div>
            
            {/* Main headline */}
            <div className="relative">
              <h1 className="display-giant text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem]">
                <span className="kinetic-reveal block">
                  <span className="stagger-1 text-foreground">DIGIT</span>
                </span>
                <span className="kinetic-reveal block -mt-4 lg:-mt-8">
                  <span className="stagger-2 text-gradient-neon glow-morph inline-block">—X</span>
                </span>
              </h1>
            </div>
            
            {/* Subtitle */}
            <div className="max-w-2xl space-y-6">
              <p className="animate-fade-up-delay-1 text-xl md:text-2xl lg:text-3xl text-foreground/90 font-body font-extralight leading-relaxed tracking-wide">
                Rethinking how medical data becomes{' '}
                <span className="text-gradient-neon font-normal">intelligence</span>.
              </p>
              
              <p className="animate-fade-up-delay-2 text-muted-foreground font-body font-light leading-loose">
                We work at the intersection of healthcare data, artificial intelligence, and clinical informatics — 
                building infrastructure that connects, structures, and explains.
              </p>
            </div>

            {/* CTA */}
            <div className="animate-fade-up-delay-3 pt-4">
              <a 
                href="#focus" 
                className="group inline-flex items-center gap-4 text-foreground font-display font-medium transition-all duration-300 hover:gap-6"
              >
                <span className="w-12 h-px bg-gradient-to-r from-transparent via-foreground/50 to-foreground group-hover:w-20 transition-all duration-500" />
                <span>Explore our focus</span>
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-fade-up-delay-3">
          <div className="w-px h-16 bg-gradient-to-b from-foreground/30 to-transparent" />
          <span className="text-xs text-muted-foreground tracking-widest uppercase font-body">Scroll</span>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="relative z-10 py-40 px-8 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="hr-gradient mb-20" />
          
          <div className="grid lg:grid-cols-[1fr,2fr] gap-12 items-start">
            <div>
              <span className="text-gradient-neon font-display font-bold text-sm tracking-[0.2em] uppercase">
                Purpose
              </span>
            </div>
            
            <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground leading-tight tracking-tight">
              "To build more than just tools — 
              <span className="text-gradient-neon"> infrastructure</span> that moves data, 
              connects silos, and makes AI a catalyst that stays{' '}
              <span className="text-stroke inline-block">transparent</span>."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section id="focus" className="relative z-10 py-32 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <span className="text-gradient-neon font-display font-bold text-sm tracking-[0.2em] uppercase mb-4 block">
                What We Build
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                Focus Areas
              </h2>
            </div>
            <p className="text-muted-foreground font-body font-light max-w-md leading-relaxed">
              Four pillars that define our research direction and technical infrastructure.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
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
      <section className="relative z-10 py-32 px-8 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="hr-gradient mb-20" />
          
          <div className="grid lg:grid-cols-[1fr,2fr] gap-12">
            <div>
              <span className="text-gradient-neon font-display font-bold text-sm tracking-[0.2em] uppercase">
                How We Work
              </span>
            </div>
            
            <ul className="space-y-8">
              {[
                'Useful, reproducible, and explainable',
                'Grounded in clinical reality',
                'Technically rigorous, semantically precise',
                'Quietly ambitious about the hard things',
              ].map((principle, index) => (
                <li 
                  key={index}
                  className="flex items-start gap-6 text-foreground/70 group hover:text-foreground transition-all duration-500"
                >
                  <span className="principle-dot mt-3 group-hover:scale-150 group-hover:shadow-[0_0_30px_hsl(var(--neon-purple)/0.8)] transition-all duration-500" />
                  <span className="font-display text-xl md:text-2xl lg:text-3xl font-medium tracking-tight">{principle}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section id="connect" className="relative z-10 py-40 px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-gradient-neon font-display font-bold text-sm tracking-[0.2em] uppercase mb-6 block">
            Early Days
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 tracking-tight">
            We're just getting started
          </h2>
          <p className="text-muted-foreground font-body font-light max-w-xl mx-auto mb-14 leading-loose text-lg">
            A new lab, still forming. If you're interested in healthcare data, knowledge graphs, 
            or building AI that explains itself — follow along.
          </p>
          <a
            href="https://www.linkedin.com/company/digit-x-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Follow on LinkedIn
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="hr-gradient mb-12" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="font-display text-lg font-bold text-foreground">
              DIGIT<span className="text-gradient-neon">—</span>X
            </div>
            <div className="text-sm text-muted-foreground font-body font-light">
              LMU Klinikum Munich · Department of Radiology
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
