import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobById } from '@/data/jobs';
import ThemeToggle from '@/components/ThemeToggle';
import GradientOrbs from '@/components/GradientOrbs';
// import NetworkGraph from '@/components/NetworkGraph'; // Swap back to re-enable particles

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const job = id ? getJobById(id) : undefined;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[hsl(var(--text-primary))] mb-4">Position not found</h1>
          <Link to="/#careers" className="text-[hsl(var(--accent))] hover:underline">
            ← Back to careers
          </Link>
        </div>
      </div>
    );
  }

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
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            to="/#careers"
            className="inline-flex items-center gap-2 text-sm text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--accent))] transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to all positions
          </Link>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="status-chip">{job.badge}</span>
              <span className="pill-soft text-xs">{job.type}</span>
            </div>
            <h1 className="text-display text-3xl md:text-4xl lg:text-5xl text-[hsl(var(--text-primary))] mb-3">
              {job.title}
            </h1>
            {job.subtitle && (
              <p className="text-[hsl(var(--accent))] text-lg">{job.subtitle}</p>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-10">
            {job.tags.map((tag) => (
              <span key={tag} className="pill-soft">{tag}</span>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-6 mb-12">
            {job.fullDescription.map((para, idx) => (
              <p key={idx} className="text-[hsl(var(--text-secondary))] leading-[1.9]">
                {para}
              </p>
            ))}
          </div>

          {/* Requirements */}
          <div className="requirements-box mb-8">
            <p className="text-sm font-semibold text-[hsl(var(--text-primary))] mb-4 uppercase tracking-wider">
              What we're looking for
            </p>
            <ul className="space-y-3">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[hsl(var(--text-secondary))] leading-relaxed">
                  <span className="w-2 h-2 rounded-full bg-[hsl(var(--accent))] shrink-0 mt-[0.55rem]" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Nice to have */}
          {job.niceToHave && job.niceToHave.length > 0 && (
            <div className="mb-12">
              <p className="text-sm font-semibold text-[hsl(var(--text-primary))] mb-4 uppercase tracking-wider">
                Nice to have
              </p>
              <ul className="space-y-3">
                {job.niceToHave.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[hsl(var(--text-secondary))]">
                    <span className="text-[hsl(var(--accent))]">+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <div className="pt-6 border-t border-[hsl(var(--border))]">
            <a
              href="mailto:lalith.shiyam@med.uni-muenchen.de"
              className="btn-primary"
            >
              {job.cta}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-[hsl(var(--border))] py-10 md:py-12 px-6 md:px-12 lg:px-20 bg-[hsl(var(--bg-tertiary))] transition-colors duration-500">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="flex items-center gap-3 text-[hsl(var(--text-primary))]">
              <span className="font-semibold tracking-tight">DIGITX</span>
              <span className="text-sm text-[hsl(var(--text-secondary))]">LMU Klinikum Munich · Department of Radiology</span>
            </div>
            <div className="footer-nav">
              <a href="/#vision">Vision</a>
              <a href="/#focus">Focus</a>
              <Link to="/careers">Careers</Link>
              <a href="/#connect">Connect</a>
            </div>
            <div className="text-sm text-[hsl(var(--text-secondary))]">© {new Date().getFullYear()} DIGITX Lab</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JobDetail;
