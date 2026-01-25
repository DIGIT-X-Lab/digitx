import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import GradientOrbs from '@/components/GradientOrbs';
import BlurText from '@/components/BlurText';
// import NetworkGraph from '@/components/NetworkGraph'; // Swap back to re-enable particles
import ThemeToggle from '@/components/ThemeToggle';
import { jobs } from '@/data/jobs';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const toolsSectionRef = useRef<HTMLElement>(null);
  const [toolsVisible, setToolsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => setIsLoaded(true), []);

  // Handle hash scrolling when navigating from other pages
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      // Small delay to ensure content is rendered
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);
  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for lazy loading GitHub stars
  useEffect(() => {
    const section = toolsSectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setToolsVisible(true); },
      { rootMargin: '200px' }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const focusAreas = [
    {
      num: '01',
      title: 'Autonomous Structuring of Clinical Data',
      desc: 'Make PDFs, dictated notes, images, and labs computable. Normalize names, keep provenance, and deliver structured data without endless prep.',
      example: 'Example: Radiology PDF → FHIR bundle with SNOMED/LOINC codes and time stamps preserved.',
    },
    {
      num: '02',
      title: 'Knowledge Graphs as a Common Substrate',
      desc: 'Link that data into a clinical graph that understands people, time, and relationships — not just isolated fields.',
      example: 'Example: patient → has_diagnosis → ICD/SNOMED node → linked to meds, labs, imaging, and time points with causal hints.',
    },
    {
      num: '03',
      title: 'Reasoning Interfaces for Clinicians',
      desc: 'Give clinicians ways to ask grounded questions, see the evidence path, and challenge the logic — safely and quickly.',
      example: 'Example: “Show tumor response over 6 months” → evidence-backed trend with cited sources.',
    },
    {
      num: '04',
      title: 'Scalable Infrastructure for Health Evidence',
      desc: 'Run analyses across thousands of datasets with audit trails, reproducibility, and guardrails built in.',
      example: 'Example: Cohort builder + reproducible pipelines with lineage, so results are portable across sites.',
    },
  ];

  const principles = [
    { title: 'Begin with Clinical Reality', desc: 'Health data is messy. We sit with clinicians and build for the workflows that already exist, not the ones we wish existed.' },
    { title: 'Structure Enables Intelligence', desc: 'Predictions without meaning are brittle. We encode semantics, time, and provenance so reasoning has firm ground.' },
    { title: 'LLMs Are Tools, Not Oracles', desc: 'We use language models where they help, and we always anchor them in verifiable knowledge graphs with clear evidence.' },
    { title: 'Reproducibility and Scale Matter', desc: 'Methods should generalize across institutions and populations. We test for that and build for that.' },
    { title: 'Quiet Ambition', desc: 'We take on foundational work with humility and patience. We measure progress by safer care and stronger science.' },
  ];

  const teamMembers = [
    {
      name: 'Prof. Dr. Lalith Kumar Shiyam Sundar',
      role: 'Group Lead',
      label: 'Group Lead',
      tags: ['Medical imaging', 'Multimodal integration', 'Knowledge graphs'],
      bio: 'Focuses on clinically grounded AI that fuses imaging, text, and structured data into explainable knowledge graphs for real-world decisions.',
      university: 'LMU Radiology · LMU University Hospital',
      github: 'https://github.com/LalithShiyam',
      linkedin: 'https://de.linkedin.com/in/lalith-kumar-shiyam-sundar-phd-3a2aaba0',
      scholar: 'https://scholar.google.com/citations?user=L6iMPN4AAAAJ&hl=en',
    },
    {
      name: 'Dr. Sahib Julka',
      role: 'Post Doctoral Researcher',
      label: 'Post Doctoral Researcher',
      tags: ['LLMs', 'Knowledge graphs', 'Automation'],
      bio: 'Focuses on LLM-based knowledge graph creation from clinical text and structured sources.',
      university: 'LMU University Hospital',
      github: 'https://github.com/julka01',
      linkedin: 'https://www.linkedin.com/in/julka01/',
      scholar: 'https://scholar.google.com/citations?user=GaEUyB0AAAAJ&hl=en',
    },
    {
      name: 'Sameer Singh Rawat',
      role: 'Master thesis student',
      label: 'Master thesis student',
      tags: ['AI automation', 'Ontology', 'LLMs'],
      bio: 'Focuses on automated ontology induction from medical documents using large language models.',
      university: 'Ludwig Maximilian University of Munich',
      github: 'https://github.com/SameerR007',
      linkedin: 'https://www.linkedin.com/in/sameer-s-1333a6172',
    },
  ];

  const tools = [
    {
      name: 'MosaicX',
      desc: 'Autonomous structuring engine that turns PDFs, dictated notes, images, and labs into FHIR-ready, provenance-preserved data.',
      tags: ['FHIR', 'SNOMED/LOINC', 'Provenance', 'Pipelines'],
      status: 'In development',
      github: 'https://github.com/DIGIT-X-Lab/MOSAICX',
      stars: 3,
    },
    {
      name: 'AnnotateX',
      desc: 'GUI web app for rapid text annotation to build gold standards and evaluate structured extraction.',
      tags: ['Annotation', 'Quality', 'Gold standards'],
      status: 'In development',
      github: 'https://github.com/DIGIT-X-Lab/ANNOTATEX',
      stars: 2,
    },
    {
      name: 'KnowledgeX',
      desc: 'A discovery platform that builds graphs from unstructured text with LLMs and supports grounded chat over the graph.',
      tags: ['Knowledge graph', 'LLM-grounding', 'Reasoning'],
      status: 'In development',
      github: 'https://github.com/DIGIT-X-Lab/KnowledgeX',
      stars: 0,
    },
  ];

  const imagingTools = [
    {
      name: 'MOOSE',
      desc: 'Segments 130+ tissues from CT using nnU-Net; built for multicenter PET/CT workflows and opportunistic screening.',
      tags: ['PET/CT', 'Segmentation', 'Multicenter'],
      status: 'Stable',
      github: 'https://github.com/ENHANCE-PET/MOOSE',
      paper: 'https://pubmed.ncbi.nlm.nih.gov/35772962/',
      stars: 299,
    },
    {
      name: 'FALCON',
      desc: 'One-stop total-body PET motion correction using the greedy diffeomorphic registration engine.',
      tags: ['PET/CT', 'Motion correction', 'Registration'],
      status: 'Stable',
      github: 'https://github.com/ENHANCE-PET/FALCON',
      paper: 'https://pubmed.ncbi.nlm.nih.gov/37290795/',
      stars: 48,
    },
    {
      name: 'PUMA',
      desc: 'PET segmentation–guided diffeomorphic framework for multiplexing tracers to characterise tissue biology.',
      tags: ['PET/CT', 'Segmentation', 'Diffeomorphic'],
      status: 'Stable',
      github: 'https://github.com/ENHANCE-PET/PUMA',
      paper: 'https://jnm.snmjournals.org/content/early/2025/09/18/jnumed.125.269688',
      stars: 21,
    },
  ];


  const initialStarCounts = [...tools, ...imagingTools].reduce<Record<string, number>>((acc, tool) => {
    if (tool.github && typeof tool.stars === 'number') {
      acc[tool.github] = tool.stars;
    }
    return acc;
  }, {});

  const [starCounts, setStarCounts] = useState<Record<string, number>>(initialStarCounts);

  useEffect(() => {
    if (!toolsVisible) return;

    const repos = Array.from(new Set([...tools, ...imagingTools].map(t => t.github).filter(Boolean))) as string[];
    if (!repos.length) return;

    let cancelled = false;
    const fetchStars = async () => {
      const updates: [string, number][] = [];
      await Promise.all(
        repos.map(async (repo) => {
          try {
            const path = new URL(repo).pathname.slice(1);
            const res = await fetch(`https://api.github.com/repos/${path}`);
            if (!res.ok) return;
            const data = await res.json();
            if (typeof data?.stargazers_count === 'number') {
              updates.push([repo, data.stargazers_count]);
            }
          } catch {
            /* ignore */
          }
        })
      );

      if (cancelled || !updates.length) return;
      setStarCounts(prev => {
        const next = { ...prev };
        updates.forEach(([repo, stars]) => { next[repo] = stars; });
        return next;
      });
    };

    fetchStars();
    return () => { cancelled = true; };
  }, [toolsVisible]);

  return (
    <div className="relative min-h-screen noise-overlay">
      <GradientOrbs />
      <div className="fixed inset-0 gradient-warmth pointer-events-none" />
      <div className="fixed inset-0 global-veil pointer-events-none" aria-hidden />

      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 lg:px-20 transition-all duration-500 ${navScrolled ? 'nav-scrolled py-2' : 'py-5'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="w-10 hidden md:block" />
          <div className="hidden md:flex items-center gap-10">
            <a href="#vision" className="link-subtle text-[0.8125rem]">Vision</a>
            <a href="#focus" className="link-subtle text-[0.8125rem]">Focus</a>
            <a href="#tools" className="link-subtle text-[0.8125rem]">Software</a>
            <a href="#approach" className="link-subtle text-[0.8125rem]">Approach</a>
            <a href="#people" className="link-subtle text-[0.8125rem]">People</a>
            <a href="#careers" className="link-subtle text-[0.8125rem]">Careers</a>
            <a href="#connect" className="link-subtle text-[0.8125rem]">Connect</a>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Trust rail removed for breathing room */}

      {/* Hero */}
      <section className="relative min-h-screen flex items-center px-6 md:px-12 lg:px-20 pt-28">
        <div className="hero-ambient" aria-hidden />
        <div className="max-w-7xl mx-auto w-full">
          <div className="relative z-10 max-w-6xl">
            <div className={`mb-8 ${isLoaded ? 'fade-in-up' : 'opacity-0'}`}>
              <span className="text-label">DIGITX · Lab for Digital Transformation in Healthcare</span>
            </div>
            <h1 className="text-display text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.25rem] text-[hsl(var(--text-primary))] mb-10">
              <BlurText delay={0.2}>Shaping Health</BlurText>
              <br />
              <span className="text-[hsl(var(--accent))] italic">
                <BlurText delay={0.5}>Intelligence</BlurText>
              </span>
            </h1>
            <p className={`text-lg md:text-xl text-[hsl(var(--text-secondary))] leading-[1.9] max-w-4xl mb-6 ${isLoaded ? 'fade-in-up delay-2' : 'opacity-0'}`}>
              At DIGITX, we imagine a future where clinicians aren’t slowed by fragmented data and researchers aren’t burdened by disconnected systems. By enabling medical insights to flow freely, we give people back the time and clarity needed to focus on improving lives.
            </p>
            <p className={`text-lg md:text-xl text-[hsl(var(--text-secondary))] leading-[1.9] max-w-4xl mb-8 ${isLoaded ? 'fade-in-up delay-3' : 'opacity-0'}`}>
              DIGITX is an academic lab in Radiology at LMU University Hospital, Munich. We build the quiet, rigorous infrastructure that turns raw clinical signals into structured, connected evidence — so decisions can be explained, challenged, and trusted.
            </p>
            <div className={`flex flex-wrap gap-4 ${isLoaded ? 'fade-in-up delay-4' : 'opacity-0'}`}>
              <a href="#focus" className="btn-primary btn-shimmer">Explore Our Work <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a>
              <a href="#connect" className="btn-secondary btn-glass">Get in Touch <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></a>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10">
          <div className="scroll-indicator"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7" /></svg></div>
        </div>
      </section>

      {/* Vision */}
      <section id="vision" className="relative py-28 md:py-40 px-6 md:px-12 lg:px-20 bg-[hsl(var(--bg-secondary))] transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
            <div className="lg:col-span-4">
              <span className="text-label text-[hsl(var(--accent))] block mb-4">Our Vision</span>
              <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-[hsl(var(--text-primary))]">From Raw Data to<br /><span className="font-serif text-[hsl(var(--accent))] italic">Computable Knowledge</span></h2>
            </div>
            <div className="lg:col-span-8 space-y-8">
              <div className="grid lg:grid-cols-2 gap-6 max-w-6xl w-full mx-auto">
                <div className="hero-side-card w-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-label">Why this matters</span>
                    <span className="pill-soft">Built for accountability</span>
                  </div>
                  <ul className="space-y-2 text-[hsl(var(--text-primary))]">
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Clinicians and patients should see how a conclusion was reached, not just a prediction.</li>
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Data needs meaning, provenance, and context; tools must respect the people behind it.</li>
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Every answer should be explainable and human-safe.</li>
                  </ul>
                </div>

                <div className="hero-side-card w-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-label">How we get there</span>
                    <span className="pill-soft">Reality first</span>
                  </div>
                  <ul className="space-y-2 text-[hsl(var(--text-primary))]">
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Start with clinical reality, not bigger models: what the data actually says and how it connects over time.</li>
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Encode relationships and time in knowledge graphs with strict provenance and naming.</li>
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Deliver explainable interfaces clinicians can challenge.</li>
                  </ul>
                </div>
              </div>

              <p className="text-sm uppercase tracking-[0.12em] text-[hsl(var(--text-secondary))]">Structured, connected, explainable — so every answer is traceable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section id="problem" className="relative py-32 md:py-48 px-6 md:px-12 lg:px-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-7 space-y-8 order-2 lg:order-1">
              <div className="grid lg:grid-cols-2 gap-6 max-w-6xl w-full mx-auto">
                <div className="hero-side-card w-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-label">Where it breaks</span>
                    <span className="pill-soft">Clinical reality</span>
                  </div>
                  <ul className="space-y-2 text-[hsl(var(--text-primary))]">
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Dictated reports, incompatible systems, and isolated modalities fragment the patient story.</li>
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Data trapped in PDFs and silos stays non-computable; models inherit the confusion.</li>
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Clinicians face overload while evidence sits scattered and unlinked.</li>
                  </ul>
                </div>

                <div className="hero-side-card w-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-label">Why it matters</span>
                    <span className="pill-soft">Human impact</span>
                  </div>
                  <ul className="space-y-2 text-[hsl(var(--text-primary))]">
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Patients wait while answers are buried in unstructured data.</li>
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Researchers burn months cleaning instead of testing hypotheses.</li>
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Decisions risk being made without traceable context.</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm uppercase tracking-[0.12em] text-[hsl(var(--text-secondary))]">Our central tenet: Structure first, insight follows.</p>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2 lg:text-right">
              <span className="text-label text-[hsl(var(--accent))] block mb-4">The Problem We Take Seriously</span>
              <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-[hsl(var(--text-primary))]">Healthcare is Data Rich<br /><span className="font-serif text-[hsl(var(--accent))] italic">but Insight Poor</span></h2>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section id="focus" className="relative py-32 md:py-48 px-6 md:px-12 lg:px-20 bg-[hsl(var(--bg-secondary))] transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 max-w-4xl">
            <span className="text-label text-[hsl(var(--accent))] block mb-4">What We Work On</span>
            <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-[hsl(var(--text-primary))] max-w-3xl">Foundations for <span className="font-serif text-[hsl(var(--accent))] italic">Health Intelligence</span></h2>
            <p className="text-[hsl(var(--text-secondary))] mt-6 max-w-3xl leading-[1.9]">We focus on a few foundational challenges that must be solved before healthcare can benefit from trustworthy, scalable intelligence.</p>
          </div>

          <div className="max-w-6xl">
            {focusAreas.map((area, idx) => (
              <div
                key={area.num}
                className="focus-area-row group"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="focus-area-left">
                  <span className="focus-area-num">{area.num}</span>
                </div>
                <div className="focus-area-right">
                  <h3 className="focus-area-title">{area.title}</h3>
                  <p className="text-[hsl(var(--text-secondary))] leading-[1.8] mt-2">{area.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Software */}
      <section ref={toolsSectionRef} id="tools" className="relative py-28 md:py-40 px-6 md:px-12 lg:px-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-6xl">
            <span className="text-label text-[hsl(var(--accent))] block mb-4">Software</span>
            <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-[hsl(var(--text-primary))] leading-tight">
              What We’re <span className="font-serif italic text-[hsl(var(--accent))]">Building</span>
            </h2>
            <p className="text-[hsl(var(--text-secondary))] mt-4 max-w-3xl leading-[1.9]">Open-science tools across data/LLM and imaging stacks — structured, explainable, and built for clinical accountability.</p>
          </div>

          <div className="mb-14 max-w-7xl mx-auto">
            <span className="text-label text-[hsl(var(--accent))] block mb-3">Imaging Stack</span>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {imagingTools.map((tool) => (
                <div key={tool.name} className="software-card h-full flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="software-card-title">{tool.name}</h3>
                    <span className="status-chip">{tool.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tool.tags.map((tag) => (
                      <span key={tag} className="pill-soft text-xs">{tag}</span>
                    ))}
                  </div>
                  <p className="text-[hsl(var(--text-secondary))] leading-relaxed mb-4 flex-1">{tool.desc}</p>
                  <div className="flex items-center gap-3 text-xs mt-auto">
                    {tool.github && (
                      <a
                        href={tool.github}
                        className="icon-inline"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${tool.name} on GitHub`}
                        title="View code on GitHub"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.94.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.72.08-.71.08-.71 1.15.08 1.75 1.18 1.75 1.18 1.02 1.74 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.52-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.44-2.27 1.16-3.07-.12-.29-.5-1.46.11-3.05 0 0 .95-.3 3.12 1.17a10.9 10.9 0 0 1 5.68 0c2.17-1.47 3.12-1.17 3.12-1.17.61 1.59.23 2.76.11 3.05.72.8 1.16 1.82 1.16 3.07 0 4.41-2.68 5.38-5.23 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.67.79.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                        </svg>
                        <span className="flex items-center gap-1.5">
                          GitHub
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m12 3 2.4 5.5 5.6.4-4.3 3.7 1.4 5.5L12 15.7 7 18.1l1.3-5.5-4.3-3.7 5.6-.4z" />
                          </svg>
                          {starCounts[tool.github] ?? tool.stars ?? 0}
                        </span>
                      </a>
                    )}
                    {tool.paper && (
                      <a
                        href={tool.paper}
                        className="icon-inline"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${tool.name} publication`}
                        title="Open publication"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 3h8l3 3v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
                          <path d="M13 3v6l-2-1-2 1V3" />
                          <path d="M9 11h6M9 14h6" />
                        </svg>
                        <span>Paper</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto">
            <span className="text-label text-[hsl(var(--accent))] block mb-3">LLM Stack</span>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <div key={tool.name} className="software-card h-full flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="software-card-title">{tool.name}</h3>
                    <span className="status-chip">{tool.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tool.tags.map((tag) => (
                      <span key={tag} className="pill-soft text-xs">{tag}</span>
                    ))}
                  </div>
                  <p className="text-[hsl(var(--text-secondary))] leading-relaxed mb-4 flex-1">{tool.desc}</p>
                  <div className="flex items-center gap-3 text-xs mt-auto">
                    {tool.github && (
                      <a
                        href={tool.github}
                        className="icon-inline"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${tool.name} on GitHub`}
                        title="View code on GitHub"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.94.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.72.08-.71.08-.71 1.15.08 1.75 1.18 1.75 1.18 1.02 1.74 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.52-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.44-2.27 1.16-3.07-.12-.29-.5-1.46.11-3.05 0 0 .95-.3 3.12 1.17a10.9 10.9 0 0 1 5.68 0c2.17-1.47 3.12-1.17 3.12-1.17.61 1.59.23 2.76.11 3.05.72.8 1.16 1.82 1.16 3.07 0 4.41-2.68 5.38-5.23 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.67.79.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                        </svg>
                        <span className="flex items-center gap-1.5">
                          GitHub
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m12 3 2.4 5.5 5.6.4-4.3 3.7 1.4 5.5L12 15.7 7 18.1l1.3-5.5-4.3-3.7 5.6-.4z" />
                          </svg>
                          {starCounts[tool.github] ?? tool.stars ?? 0}
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section id="approach" className="relative py-32 md:py-48 px-6 md:px-12 lg:px-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 max-w-4xl">
            <span className="text-label text-[hsl(var(--accent))] block mb-4">How We Work</span>
            <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-[hsl(var(--text-primary))]">
              <span className="font-serif text-[hsl(var(--text-primary))]">Honest Methods</span><br />
              <span className="font-serif italic text-[hsl(var(--accent))]">for a Complex Domain</span>
            </h2>
          </div>

          <div className="max-w-6xl">
            {principles.map((pr, i) => (
              <div
                key={i}
                className="principle-row group"
              >
                <div className="principle-left">
                  <span className="principle-num">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="principle-right">
                  <h3 className="principle-title">{pr.title}</h3>
                  <p className="text-[hsl(var(--text-secondary))] leading-[1.8] mt-2">{pr.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* People */}
      <section id="people" className="relative py-32 md:py-48 px-6 md:px-12 lg:px-20 bg-[hsl(var(--bg-secondary))] transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="space-y-4 max-w-7xl">
            <span className="text-label text-[hsl(var(--accent))] block">People</span>
            <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-[hsl(var(--text-primary))] leading-tight">
              A Small <span className="font-serif text-[hsl(var(--accent))] italic">Interdisciplinary Lab</span>
            </h2>
            <p className="text-[hsl(var(--text-secondary))] leading-[1.9] max-w-7xl">
              DIGITX is based at the Department of Radiology, LMU University Hospital, Munich. We bring together clinicians, informaticians, engineers, and researchers who care about building upstream foundations that translate to bedside impact. We stay small on purpose so we can stay close to the work.
            </p>
            <p className="text-[hsl(var(--text-secondary))] leading-[1.9] max-w-7xl">
              We value clarity over hype, rigor over shortcuts, and an academic culture that keeps patients and colleagues at the center of every decision.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://scholar.google.com/citations?user=L6iMPN4AAAAJ&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                title="View publications on Google Scholar"
                className="group inline-flex items-center gap-3 px-3.5 py-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--bg-primary))] text-sm font-semibold text-[hsl(var(--text-primary))] shadow-[0_10px_30px_hsl(var(--card-shadow)/0.12)] hover:bg-[hsl(var(--accent))] hover:text-white hover:border-[hsl(var(--accent))] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--accent))] active:translate-y-0.5"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(var(--accent)/0.14)] text-[hsl(var(--accent))] group-hover:bg-white group-hover:text-[hsl(var(--accent))] transition-colors duration-300">
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 10 9-5 9 5-9 5-9-5Z" />
                    <path d="M12 15v6" />
                    <path d="M7.5 12.75v3.5" />
                    <path d="M16.5 12.75v3.5" />
                  </svg>
                </span>
                <span>Google Scholar</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <a
                href="https://github.com/DIGIT-X-Lab"
                target="_blank"
                rel="noopener noreferrer"
                title="View DIGITX on GitHub"
                className="group inline-flex items-center gap-3 px-3.5 py-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--bg-primary))] text-sm font-semibold text-[hsl(var(--text-primary))] shadow-[0_10px_30px_hsl(var(--card-shadow)/0.12)] hover:bg-[hsl(var(--accent))] hover:text-white hover:border-[hsl(var(--accent))] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--accent))] active:translate-y-0.5"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(var(--accent)/0.14)] text-[hsl(var(--accent))] group-hover:bg-white group-hover:text-[hsl(var(--accent))] transition-colors duration-300">
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.42 7.86 10.95.58.11.79-.26.79-.58 0-.29-.01-1.06-.02-2.07-3.2.7-3.88-1.54-3.88-1.54-.53-1.35-1.3-1.71-1.3-1.71-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.76.41-1.27.75-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.2-3.09-.12-.29-.52-1.46.11-3.04 0 0 .98-.31 3.2 1.18a11.2 11.2 0 0 1 2.91-.39c.99 0 1.99.13 2.92.39 2.21-1.5 3.19-1.18 3.19-1.18.64 1.58.24 2.75.12 3.04.75.8 1.19 1.83 1.19 3.09 0 4.44-2.69 5.41-5.25 5.69.42.36.8 1.08.8 2.19 0 1.58-.01 2.85-.01 3.24 0 .32.21.7.8.58A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                  </svg>
                </span>
                <span>GitHub</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>

          {teamMembers.length > 0 && (
            <div className="relative max-w-7xl">
              {teamMembers.map((member, idx) => (
                <div
                  key={member.name}
                  className="team-member-row relative flex flex-col md:flex-row items-start gap-6 md:gap-10 border-b border-[hsl(var(--border))] last:border-0"
                >
                  <div className="w-full md:basis-64 shrink-0 space-y-2 relative z-10">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="team-member-name">{member.name}</div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="status-chip">{member.role}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[hsl(var(--accent))] pt-2 pb-1">
                      {member.scholar && (
                        <a
                          href={member.scholar}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} on Google Scholar`}
                          className="p-1 rounded-full hover:bg-[hsl(var(--accent)/0.15)] transition-colors duration-200"
                          title="Google Scholar"
                        >
                          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 10 9-5 9 5-9 5-9-5Z" />
                            <path d="M12 15v6" />
                            <path d="M7.5 12.75v3.5" />
                            <path d="M16.5 12.75v3.5" />
                          </svg>
                        </a>
                      )}
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} on GitHub`}
                          className="p-1 rounded-full hover:bg-[hsl(var(--accent)/0.15)] transition-colors duration-200"
                          title="GitHub"
                        >
                          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.42 7.86 10.95.58.11.79-.26.79-.58 0-.29-.01-1.06-.02-2.07-3.2.7-3.88-1.54-3.88-1.54-.53-1.35-1.3-1.71-1.3-1.71-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.76.41-1.27.75-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.2-3.09-.12-.29-.52-1.46.11-3.04 0 0 .98-.31 3.2 1.18a11.2 11.2 0 0 1 2.91-.39c.99 0 1.99.13 2.92.39 2.21-1.5 3.19-1.18 3.19-1.18.64 1.58.24 2.75.12 3.04.75.8 1.19 1.83 1.19 3.09 0 4.44-2.69 5.41-5.25 5.69.42.36.8 1.08.8 2.19 0 1.58-.01 2.85-.01 3.24 0 .32.21.7.8.58A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                          </svg>
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} on LinkedIn`}
                          className="p-1 rounded-full hover:bg-[hsl(var(--accent)/0.15)] transition-colors duration-200"
                          title="LinkedIn"
                        >
                          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.24 8.25H4.7V24H.24V8.25ZM8.61 8.25h4.24v2.14h.06c.59-1.11 2.02-2.28 4.16-2.28 4.45 0 5.27 2.93 5.27 6.74V24h-4.46v-7.12c0-1.7-.03-3.88-2.36-3.88-2.36 0-2.72 1.84-2.72 3.75V24H8.61V8.25Z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 w-full space-y-3 relative z-10 md:pl-4">
                    <div className="flex flex-wrap gap-2">
                      {member.tags.map((tag) => (
                        <span key={tag} className="pill-soft text-xs">{tag}</span>
                      ))}
                    </div>
                    <p className="text-[hsl(var(--text-secondary))] leading-relaxed">{member.bio}</p>
                    <div className="text-sm text-[hsl(var(--text-secondary))]">{member.university}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Careers */}
      <section id="careers" className="relative py-32 md:py-48 px-6 md:px-12 lg:px-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="text-label text-[hsl(var(--accent))] block mb-4">Careers</span>
            <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-[hsl(var(--text-primary))] leading-tight">
              Join Our <span className="font-serif text-[hsl(var(--accent))] italic">Team</span>
            </h2>
            <p className="text-[hsl(var(--text-secondary))] mt-6 leading-[1.9]">
              We're building the infrastructure and tools that enable health intelligence. The work is technical and foundational: clean code, clear thinking, and shipping things that actually help clinicians. If that sounds like your kind of problem, reach out.
            </p>
          </div>

          <div>
            {jobs.map((job) => (
              <Link
                key={job.id}
                to={`/careers/${job.id}`}
                className="job-row group"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg md:text-xl font-semibold text-[hsl(var(--text-primary))] group-hover:text-[hsl(var(--accent))] transition-colors">
                      {job.title}
                    </h3>
                    <span className="status-chip">{job.badge}</span>
                  </div>
                  <span className="pill-soft text-xs shrink-0">{job.type}</span>
                </div>

                {job.subtitle && (
                  <p className="text-[hsl(var(--accent))] text-sm mb-2">{job.subtitle}</p>
                )}

                <p className="text-[hsl(var(--text-secondary))] leading-relaxed mb-3">{job.shortDescription}</p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <span key={tag} className="pill-soft text-xs">{tag}</span>
                    ))}
                  </div>
                  <span className="text-sm text-[hsl(var(--accent))] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    View details
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Connect */}
      <section id="connect" className="relative py-32 md:py-48 px-6 md:px-12 lg:px-20 bg-[hsl(var(--bg-tertiary))] transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-label block mb-6">Connect</span>
            <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-[hsl(var(--text-primary))] mb-6 leading-tight">Let's Build<br /><span className="font-serif text-[hsl(var(--accent))] italic">Computable Healthcare</span></h2>
            <p className="text-lg text-[hsl(var(--text-secondary))] leading-[1.8] mb-10 max-w-lg mx-auto">If our work resonates with you — whether you're caring for patients, stewarding data, or building methods — tell us what keeps you up at night. We'll listen first.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://www.linkedin.com/company/digitx-lmu" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Follow on LinkedIn <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
              <a href="mailto:lalith.shiyam@med.uni-muenchen.de" className="btn-secondary">Get in Touch</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-[hsl(var(--border))] py-10 md:py-12 px-6 md:px-12 lg:px-20 bg-[hsl(var(--bg-tertiary))] transition-colors duration-500">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="flex items-center gap-3 text-[hsl(var(--text-primary))]">
              <span className="font-semibold tracking-tight">DIGITX</span>
              <span className="text-sm text-[hsl(var(--text-secondary))]">LMU Klinikum Munich · Department of Radiology</span>
            </div>
            <div className="footer-nav">
              <a href="#vision">Vision</a>
              <a href="#focus">Focus</a>
              <a href="#careers">Careers</a>
              <a href="#connect">Connect</a>
              <a href="https://www.linkedin.com/company/digitx-lmu" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
            <div className="text-sm text-[hsl(var(--text-secondary))]">© {new Date().getFullYear()} DIGITX Lab</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
