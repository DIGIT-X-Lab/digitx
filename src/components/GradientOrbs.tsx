import { useEffect, useState } from 'react';

const GradientOrbs = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {/* Large primary orb - top left */}
      <div
        className="absolute rounded-full animate-drift-slow"
        style={{
          width: '60vw',
          height: '60vw',
          maxWidth: '900px',
          maxHeight: '900px',
          top: '-15%',
          left: '-15%',
          background: isDark
            ? 'radial-gradient(circle, hsla(18, 70%, 50%, 0.25) 0%, transparent 60%)'
            : 'radial-gradient(circle, hsla(18, 76%, 48%, 0.28) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Secondary orb - right side */}
      <div
        className="absolute rounded-full animate-drift-medium"
        style={{
          width: '50vw',
          height: '50vw',
          maxWidth: '700px',
          maxHeight: '700px',
          top: '15%',
          right: '-10%',
          background: isDark
            ? 'radial-gradient(circle, hsla(155, 35%, 50%, 0.18) 0%, transparent 60%)'
            : 'radial-gradient(circle, hsla(155, 30%, 42%, 0.20) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Tertiary orb - bottom */}
      <div
        className="absolute rounded-full animate-drift-slow-reverse"
        style={{
          width: '55vw',
          height: '55vw',
          maxWidth: '800px',
          maxHeight: '800px',
          bottom: '-10%',
          left: '15%',
          background: isDark
            ? 'radial-gradient(circle, hsla(18, 60%, 55%, 0.18) 0%, transparent 60%)'
            : 'radial-gradient(circle, hsla(18, 60%, 58%, 0.22) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Small accent orb */}
      <div
        className="absolute rounded-full animate-drift-medium-reverse"
        style={{
          width: '35vw',
          height: '35vw',
          maxWidth: '500px',
          maxHeight: '500px',
          top: '55%',
          right: '10%',
          background: isDark
            ? 'radial-gradient(circle, hsla(18, 80%, 55%, 0.15) 0%, transparent 60%)'
            : 'radial-gradient(circle, hsla(18, 76%, 52%, 0.18) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />
    </div>
  );
};

export default GradientOrbs;
