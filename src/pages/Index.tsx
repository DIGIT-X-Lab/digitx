import { useEffect, useState } from 'react';
import NetworkGraph from '@/components/NetworkGraph';
import ThemeToggle from '@/components/ThemeToggle';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => setIsLoaded(true), []);

  const focusAreas = [
    { num: '01', title: 'Autonomous Structuring of Clinical Data', desc: 'We develop systems that transform raw clinical inputs — notes, reports, sequences, labs — into consistent, machine-understandable structure.' },
    { num: '02', title: 'Knowledge Graphs as a Common Substrate', desc: 'Once structured, data becomes far more useful when connected. We build knowledge graphs that express clinical relationships, temporal patterns, and contextual links.' },
    { num: '03', title: 'Reasoning Interfaces for Clinicians', desc: 'We design ways for people to interact with structured knowledge safely and intuitively. LLM-based interfaces help retrieve information and explain relationships — always anchored in traceable evidence.' },
    { num: '04', title: 'Scalable Infrastructure for Health Evidence', desc: 'We build the infrastructure that allows researchers and clinicians to run analyses across thousands of datasets — making large-scale, reproducible health evidence generation accessible.' },
  ];

  const principles = [
    { title: 'Begin with Clinical Reality', desc: 'Healthcare data is messy, incomplete, and heterogeneous. We design methods grounded in real workflows and real constraints.' },
    { title: 'Structure Enables Intelligence', desc: 'We prioritize explicit structure, semantics, and clarity. Reasoning and causality require more than predictions — they require meaning.' },
    { title: 'LLMs Are Tools, Not Oracles', desc: 'We use large language models where they help, but we always ground them in structured knowledge and verification. Their outputs should be traceable, explainable, and adjustable.' },
    { title: 'Reproducibility and Scale Matter', desc: 'A method that only works on a curated dataset is not enough. We aim for systems that generalize across institutions, populations, and thousands of datasets.' },
    { title: 'Quiet Ambition', desc: 'We work on foundational problems that take time. We approach them with humility, curiosity, and a commitment to rigor.' },
  ];

  return (
    <div className="relative min-h-screen noise-overlay">
      <NetworkGraph />
      <div className="fixed inset-0 gradient-warmth pointer-events-none" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 lg:px-20 py-6 transition-all duration-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="w-10 hidden md:block" />
          <div className="hidden md:flex items-center gap-10">
            <a href="#vision" className="link-subtle text-[0.8125rem]">Vision</a>
            <a href="#focus" className="link-subtle text-[0.8125rem]">Focus</a>
            <a href="#approach" className="link-subtle text-[0.8125rem]">Approach</a>
            <a href="#people" className="link-subtle text-[0.8125rem]">People</a>
            <a href="#connect" className="link-subtle text-[0.8125rem]">Connect</a>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center px-6 md:px-12 lg:px-20 pt-28">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-3xl">
            <div className={`mb-8 ${isLoaded ? 'fade-in-up' : 'opacity-0'}`}>
              <span className="text-label">DIGITX · Lab for Digital Transformation in Healthcare</span>
            </div>
            <h1 className={`text-display text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.25rem] text-[hsl(var(--text-primary))] mb-10 ${isLoaded ? 'fade-in-up delay-1' : 'opacity-0'}`}>
              Shaping Health<br /><span className="text-[hsl(var(--accent))] italic">Intelligence</span>
            </h1>
            <p className={`text-lg md:text-xl text-[hsl(var(--text-secondary))] leading-[1.8] max-w-2xl mb-6 ${isLoaded ? 'fade-in-up delay-2' : 'opacity-0'}`}>
              Healthcare generates extraordinary amounts of information — clinical notes, diagnostic reports, procedures, labs, timelines — yet most of it is not truly usable. It isn't structured. It isn't linked. It isn't computable.
            </p>
            <p className={`text-lg md:text-xl text-[hsl(var(--text-secondary))] leading-[1.8] max-w-2xl mb-14 ${isLoaded ? 'fade-in-up delay-3' : 'opacity-0'}`}>
              DIGITX works on the foundations of health intelligence: systems that transform messy clinical data into structured, connected, computable knowledge.
            </p>
            <div className={`flex flex-wrap gap-4 ${isLoaded ? 'fade-in-up delay-4' : 'opacity-0'}`}>
              <a href="#focus" className="btn-primary">Explore Our Work <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a>
              <a href="#connect" className="btn-secondary">Get in Touch</a>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
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
            <div className="lg:col-span-8 space-y-6">
              <p className="text-lg md:text-xl text-[hsl(var(--text-secondary))] leading-[1.8]">Our vision is simple but ambitious: to build the infrastructure that turns real-world healthcare data into something machines can reason about — and humans can trust.</p>
              <p className="text-lg text-[hsl(var(--text-secondary))] leading-[1.8]">We do not believe health intelligence begins with building ever-larger multimodal models. We believe it begins with understanding what the data actually says, how different pieces relate, and how they fit into the causal fabric of health and disease.</p>
              <div className="text-lg text-[hsl(var(--text-secondary))] leading-[1.8] space-y-2">
                <p>We aim to create systems where:</p>
                <ul className="list-none space-y-2 pl-4">
                  <li className="flex items-start gap-3"><span className="text-[hsl(var(--accent))]">·</span> clinical data structures itself,</li>
                  <li className="flex items-start gap-3"><span className="text-[hsl(var(--accent))]">·</span> knowledge graphs capture the meaning behind it,</li>
                  <li className="flex items-start gap-3"><span className="text-[hsl(var(--accent))]">·</span> and clinicians can interact with this knowledge in ways that are grounded, explainable, and clinically safe.</li>
                </ul>
              </div>
              <p className="text-lg text-[hsl(var(--text-secondary))] leading-[1.8]">This is the substrate on which true health intelligence can grow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section id="problem" className="relative py-32 md:py-48 px-6 md:px-12 lg:px-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-5">
              <span className="text-label text-[hsl(var(--accent))] block mb-4">The Problem We Take Seriously</span>
              <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-[hsl(var(--text-primary))]">Healthcare is Data Rich<br /><span className="font-serif text-[hsl(var(--accent))] italic">but Insight Poor</span></h2>
            </div>
            <div className="lg:col-span-7 space-y-6">
              <p className="text-lg text-[hsl(var(--text-secondary))] leading-[1.8]">Most clinical information exists in formats that resist computation: free text, incompatible systems, isolated modalities, and fragmented patient timelines.</p>
              <p className="text-lg text-[hsl(var(--text-secondary))] leading-[1.8]">Researchers spend months preparing datasets before they can ask a single meaningful question. Clinicians face information overload without the tools to interpret it. AI systems try to learn from unstructured chaos and end up brittle, opaque, or untrustworthy.</p>
              <p className="text-lg text-[hsl(var(--text-secondary))] leading-[1.8]">We think the future of healthcare depends on something upstream: turning clinical data into structured, linkable, computable knowledge that supports reasoning, not just prediction. DIGITX exists to build that foundation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section id="focus" className="relative py-32 md:py-48 px-6 md:px-12 lg:px-20 bg-[hsl(var(--bg-secondary))] transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <span className="text-label text-[hsl(var(--accent))] block mb-4">What We Work On</span>
            <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-[hsl(var(--text-primary))] max-w-3xl">Foundations for<br /><span className="font-serif text-[hsl(var(--accent))] italic">Health Intelligence</span></h2>
            <p className="text-[hsl(var(--text-secondary))] mt-6 max-w-2xl">We focus on a small number of foundational challenges that must be solved before healthcare can benefit from trustworthy, scalable intelligence.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {focusAreas.map((area) => (
              <div key={area.num} className="pillar-card group">
                <span className="number-accent text-4xl md:text-5xl block mb-6">{area.num}</span>
                <h3 className="text-headline text-xl md:text-2xl text-[hsl(var(--text-primary))] mb-4">{area.title}</h3>
                <p className="text-[hsl(var(--text-secondary))] leading-relaxed">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section id="approach" className="relative py-32 md:py-48 px-6 md:px-12 lg:px-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-4">
              <span className="text-label text-[hsl(var(--accent))] block mb-4">How We Work</span>
              <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-[hsl(var(--text-primary))]"><span className="font-serif text-[hsl(var(--accent))] italic">Honest Methods</span><br />for a Complex Domain</h2>
            </div>
            <div className="lg:col-span-8">
              <ul className="space-y-8">
                {principles.map((pr, i) => (
                  <li key={i} className="group flex gap-6 pb-8 border-b border-[hsl(var(--border))] last:border-0">
                    <span className="flex-shrink-0 w-2 h-2 mt-3 rounded-full bg-[hsl(var(--accent))] group-hover:scale-150 transition-transform duration-300" />
                    <div>
                      <h3 className="text-headline text-xl text-[hsl(var(--text-primary))] mb-2 group-hover:text-[hsl(var(--accent))] transition-colors duration-300">{pr.title}</h3>
                      <p className="text-[hsl(var(--text-secondary))] leading-relaxed">{pr.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* People */}
      <section id="people" className="relative py-32 md:py-48 px-6 md:px-12 lg:px-20 bg-[hsl(var(--bg-secondary))] transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-4">
              <span className="text-label text-[hsl(var(--accent))] block mb-4">People</span>
              <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-[hsl(var(--text-primary))]">A Small,<br /><span className="font-serif text-[hsl(var(--accent))] italic">Interdisciplinary</span> Lab</h2>
            </div>
            <div className="lg:col-span-8 space-y-6">
              <p className="text-lg md:text-xl text-[hsl(var(--text-secondary))] leading-[1.8]">DIGITX is based at LMU Klinikum Munich and brings together clinicians, informaticians, engineers, and researchers who care about building the upstream foundations of health intelligence.</p>
              <p className="text-lg text-[hsl(var(--text-secondary))] leading-[1.8]">We value clarity over hype, rigor over shortcuts, and thoughtful progress over noise.</p>
              <div className="pt-6 border-t border-[hsl(var(--border))]">
                <h3 className="text-headline text-lg text-[hsl(var(--text-primary))] mb-4">Opportunities</h3>
                <p className="text-[hsl(var(--text-secondary))] leading-relaxed mb-4">We welcome:</p>
                <ul className="text-[hsl(var(--text-secondary))] leading-relaxed space-y-2">
                  <li className="flex items-start gap-3"><span className="text-[hsl(var(--accent))]">·</span> students seeking research projects,</li>
                  <li className="flex items-start gap-3"><span className="text-[hsl(var(--accent))]">·</span> clinicians with ideas or frustrations around data use,</li>
                  <li className="flex items-start gap-3"><span className="text-[hsl(var(--accent))]">·</span> collaborators from medicine, computer science, and informatics,</li>
                  <li className="flex items-start gap-3"><span className="text-[hsl(var(--accent))]">·</span> partners interested in building trustworthy health intelligence.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connect */}
      <section id="connect" className="relative py-32 md:py-48 px-6 md:px-12 lg:px-20 bg-[hsl(var(--bg-tertiary))] transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-label block mb-6">Connect</span>
            <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-[hsl(var(--text-primary))] mb-6 leading-tight">Let's Build<br /><span className="font-serif text-[hsl(var(--accent))] italic">Computable Healthcare</span></h2>
            <p className="text-lg text-[hsl(var(--text-secondary))] leading-[1.8] mb-10 max-w-lg mx-auto">If our work resonates with you — whether you're a clinician, a researcher, or an industry partner — we'd be happy to talk.</p>
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
      <footer className="relative py-12 md:py-16 px-6 md:px-12 lg:px-20 bg-[hsl(var(--footer-bg))] transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-[hsl(var(--footer-text))] font-semibold tracking-tight">DIGITX</div>
            <div className="text-sm text-[hsl(var(--footer-text))]/60">LMU Klinikum Munich · Department of Radiology</div>
            <div className="text-sm text-[hsl(var(--footer-text))]/40">© {new Date().getFullYear()} DIGITX Lab</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;