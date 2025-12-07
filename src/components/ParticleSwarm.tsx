import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  colorIndex: number;
  alpha: number;
  baseAlpha: number;
}

const ParticleSwarm = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  // Gemini-style neon colors
  const colors = [
    { r: 99, g: 141, b: 255 },   // blue
    { r: 168, g: 99, b: 255 },   // purple
    { r: 255, g: 99, b: 177 },   // pink
    { r: 255, g: 130, b: 99 },   // coral
  ];

  const getColorString = (colorIndex: number, alpha: number) => {
    const c = colors[colorIndex];
    return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
  };

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const particleCount = Math.min(Math.floor((width * height) / 8000), 180);

    for (let i = 0; i < particleCount; i++) {
      const baseAlpha = Math.random() * 0.4 + 0.1;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        colorIndex: Math.floor(Math.random() * colors.length),
        alpha: baseAlpha,
        baseAlpha,
      });
    }

    particlesRef.current = particles;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const mouse = mouseRef.current;

    ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
    ctx.fillRect(0, 0, width, height);

    const particles = particlesRef.current;
    const connectionDistance = 120;
    const mouseInfluenceRadius = 200;

    particles.forEach((particle, i) => {
      const dx = mouse.x - particle.x;
      const dy = mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouseInfluenceRadius && distance > 0) {
        const force = (mouseInfluenceRadius - distance) / mouseInfluenceRadius;
        const angle = Math.atan2(dy, dx);
        
        particle.vx += Math.cos(angle) * force * 0.02;
        particle.vy += Math.sin(angle) * force * 0.02;
        particle.alpha = Math.min(particle.baseAlpha + force * 0.5, 0.9);
      } else {
        particle.alpha += (particle.baseAlpha - particle.alpha) * 0.05;
      }

      particle.vx *= 0.98;
      particle.vy *= 0.98;
      particle.vx += (Math.random() - 0.5) * 0.02;
      particle.vy += (Math.random() - 0.5) * 0.02;

      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      if (speed > 1.5) {
        particle.vx = (particle.vx / speed) * 1.5;
        particle.vy = (particle.vy / speed) * 1.5;
      }

      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = getColorString(particle.colorIndex, particle.alpha);
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const other = particles[j];
        const cdx = other.x - particle.x;
        const cdy = other.y - particle.y;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

        if (cdist < connectionDistance) {
          const opacity = (1 - cdist / connectionDistance) * 0.12 * particle.alpha;
          const gradient = ctx.createLinearGradient(particle.x, particle.y, other.x, other.y);
          gradient.addColorStop(0, getColorString(particle.colorIndex, opacity));
          gradient.addColorStop(1, getColorString(other.colorIndex, opacity));
          
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    if (mouse.x > 0 && mouse.y > 0) {
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
      gradient.addColorStop(0, 'rgba(168, 99, 255, 0.04)');
      gradient.addColorStop(0.5, 'rgba(255, 99, 177, 0.02)');
      gradient.addColorStop(1, 'rgba(99, 141, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: 0, y: 0 };
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
};

export default ParticleSwarm;
