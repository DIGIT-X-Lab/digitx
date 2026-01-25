import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobs } from '@/data/jobs';
import ThemeToggle from '@/components/ThemeToggle';
import GradientOrbs from '@/components/GradientOrbs';

const Careers = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen noise-overlay">
      <GradientOrbs />
      <div className="fixed inset-0 gradient-warmth pointer-events-none" />
      <div className="fixed inset-0 global-veil pointer-events-none" aria-hidden />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 lg:px-20 py-5 nav-scrolled">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-[hsl(var(--text-primary))] font-semibold tracking-tight hover:text-[hsl(var(--accent))] transition-colors">
            DIGITX
          </Link>
          <div className="hidden md:flex items-center gap-10">
            <a href="/#vision" className="link-subtle text-[0.8125rem]">Vision</a>
            <a href="/#focus" className="link-subtle text-[0.8125rem]">Focus</a>
            <a href="/#tools" className="link-subtle text-[0.8125rem]">Software</a>
            <a href="/#approach" className="link-subtle text-[0.8125rem]">Approach</a>
            <a href="/#people" className="link-subtle text-[0.8125rem]">People</a>
            <Link to="/careers" className="link-subtle text-[0.8125rem]">Careers</Link>
            <a href="/#connect" className="link-subtle text-[0.8125rem]">Connect</a>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Content */}
      <main className="relative pt-32 pb-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="text-label text-[hsl(var(--accent))] block mb-4">Careers</span>
            <h1 className="text-display text-3xl md:text-4xl lg:text-5xl text-[hsl(var(--text-primary))] leading-tight mb-6">
              Join Our <span className="font-serif text-[hsl(var(--accent))] italic">Team</span>
            </h1>
            <p className="text-[hsl(var(--text-secondary))] leading-[1.9] max-w-3xl">
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
                    <h2 className="text-lg md:text-xl font-semibold text-[hsl(var(--text-primary))] group-hover:text-[hsl(var(--accent))] transition-colors">
                      {job.title}
                    </h2>
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
      </main>

      {/* Footer */}
      <footer className="relative border-t border-[hsl(var(--border))] py-8 md:py-10 px-6 md:px-12 lg:px-20 bg-[hsl(var(--bg-tertiary))] transition-colors duration-500">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
              <span className="font-semibold tracking-tight text-[hsl(var(--text-primary))]">DIGITX</span>
              <span className="hidden md:inline text-[hsl(var(--text-secondary))]">·</span>
              <span className="text-xs text-[hsl(var(--text-secondary))]">LMU Klinikum Munich · Department of Radiology</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="https://www.lmu-klinikum.de/imprint?homepage=b2c7dca3b5b72d5e" target="_blank" rel="noopener noreferrer" className="text-xs text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent))] transition-colors">Impressum</a>
              <a href="https://www.lmu-klinikum.de/data_safety" target="_blank" rel="noopener noreferrer" className="text-xs text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent))] transition-colors">Datenschutz</a>
              <a href="https://www.lmu-klinikum.de/accessibility" target="_blank" rel="noopener noreferrer" className="text-xs text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent))] transition-colors">Accessibility</a>
            </div>
            <div className="text-xs text-[hsl(var(--text-secondary))]">© {new Date().getFullYear()} DIGITX Lab</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Careers;
