import { useEffect, useRef, useCallback } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  size: number;
  baseSize: number;
  colorIndex: number;
  alpha: number;
  baseAlpha: number;
  pulsePhase: number;
  floatPhase: number;
  floatSpeed: number;
  floatAmplitude: number;
}

const ParticleSwarm = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  // Neon spectrum colors
  const colors = [
    { r: 99, g: 141, b: 255 },   // blue
    { r: 138, g: 99, b: 255 },   // indigo
    { r: 168, g: 99, b: 255 },   // purple
    { r: 220, g: 99, b: 220 },   // magenta
    { r: 255, g: 99, b: 177 },   // pink
    { r: 255, g: 130, b: 99 },   // coral
  ];

  const getColorString = (colorIndex: number, alpha: number) => {
    const c = colors[colorIndex % colors.length];
    return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
  };

  const lerpColor = (c1: number, c2: number, t: number) => {
    const color1 = colors[c1 % colors.length];
    const color2 = colors[c2 % colors.length];
    return {
      r: color1.r + (color2.r - color1.r) * t,
      g: color1.g + (color2.g - color1.g) * t,
      b: color1.b + (color2.b - color1.b) * t,
    };
  };

  const initNodes = useCallback((width: number, height: number) => {
    const nodes: Node[] = [];
    const nodeCount = Math.min(Math.floor((width * height) / 12000), 120);

    for (let i = 0; i < nodeCount; i++) {
      const baseAlpha = Math.random() * 0.5 + 0.2;
      const baseSize = Math.random() * 3 + 1.5;
      const y = Math.random() * height;
      
      nodes.push({
        x: Math.random() * width,
        y,
        vx: 0,
        vy: 0,
        targetY: y - (Math.random() * 100 + 50), // Float upward target
        size: baseSize,
        baseSize,
        colorIndex: Math.floor(Math.random() * colors.length),
        alpha: baseAlpha,
        baseAlpha,
        pulsePhase: Math.random() * Math.PI * 2,
        floatPhase: Math.random() * Math.PI * 2,
        floatSpeed: 0.003 + Math.random() * 0.005,
        floatAmplitude: 20 + Math.random() * 40,
      });
    }

    nodesRef.current = nodes;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const mouse = mouseRef.current;
    timeRef.current += 0.016;
    const time = timeRef.current;

    // Clear with slight fade for trails
    ctx.fillStyle = 'rgba(5, 5, 5, 0.08)';
    ctx.fillRect(0, 0, width, height);

    const nodes = nodesRef.current;
    const connectionDistance = 180;
    const mouseInfluenceRadius = 280;

    // Update and draw nodes
    nodes.forEach((node, i) => {
      // Antigravity float effect
      node.floatPhase += node.floatSpeed;
      const floatOffset = Math.sin(node.floatPhase) * node.floatAmplitude;
      
      // Gentle upward drift (antigravity)
      node.vy -= 0.008;
      
      // Horizontal drift
      node.vx += Math.sin(time * 0.5 + node.floatPhase) * 0.003;

      // Mouse interaction - repel on hover (antigravity style)
      const dx = node.x - mouse.x;
      const dy = node.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouseInfluenceRadius && distance > 0 && mouse.active) {
        const force = Math.pow((mouseInfluenceRadius - distance) / mouseInfluenceRadius, 2);
        const angle = Math.atan2(dy, dx);
        
        // Push away from mouse
        node.vx += Math.cos(angle) * force * 0.8;
        node.vy += Math.sin(angle) * force * 0.8;
        
        // Brighten and enlarge near mouse
        node.alpha = Math.min(node.baseAlpha + force * 0.6, 1);
        node.size = node.baseSize + force * 4;
      } else {
        node.alpha += (node.baseAlpha - node.alpha) * 0.03;
        node.size += (node.baseSize - node.size) * 0.05;
      }

      // Pulse effect
      const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.15 + 1;
      const currentSize = node.size * pulse;

      // Apply velocity with damping
      node.vx *= 0.96;
      node.vy *= 0.96;
      
      // Add subtle random movement
      node.vx += (Math.random() - 0.5) * 0.015;
      node.vy += (Math.random() - 0.5) * 0.015;

      // Speed limit
      const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
      if (speed > 3) {
        node.vx = (node.vx / speed) * 3;
        node.vy = (node.vy / speed) * 3;
      }

      node.x += node.vx;
      node.y += node.vy + floatOffset * 0.01;

      // Wrap around edges with smooth transition
      if (node.x < -50) node.x = width + 50;
      if (node.x > width + 50) node.x = -50;
      if (node.y < -100) {
        node.y = height + 100;
        node.floatPhase = Math.random() * Math.PI * 2;
      }
      if (node.y > height + 100) node.y = -100;

      // Draw glow
      const glowGradient = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, currentSize * 8
      );
      glowGradient.addColorStop(0, getColorString(node.colorIndex, node.alpha * 0.3));
      glowGradient.addColorStop(0.5, getColorString(node.colorIndex, node.alpha * 0.1));
      glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, currentSize * 8, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();

      // Draw node core
      const coreGradient = ctx.createRadialGradient(
        node.x - currentSize * 0.3, node.y - currentSize * 0.3, 0,
        node.x, node.y, currentSize
      );
      coreGradient.addColorStop(0, `rgba(255, 255, 255, ${node.alpha * 0.8})`);
      coreGradient.addColorStop(0.4, getColorString(node.colorIndex, node.alpha));
      coreGradient.addColorStop(1, getColorString(node.colorIndex, node.alpha * 0.5));
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, currentSize, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();

      // Draw connections (knowledge graph edges)
      for (let j = i + 1; j < nodes.length; j++) {
        const other = nodes[j];
        const cdx = other.x - node.x;
        const cdy = other.y - node.y;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

        if (cdist < connectionDistance) {
          const opacity = Math.pow(1 - cdist / connectionDistance, 2) * 0.4 * Math.min(node.alpha, other.alpha);
          
          // Gradient connection
          const gradient = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
          const midColor = lerpColor(node.colorIndex, other.colorIndex, 0.5);
          
          gradient.addColorStop(0, getColorString(node.colorIndex, opacity));
          gradient.addColorStop(0.5, `rgba(${midColor.r}, ${midColor.g}, ${midColor.b}, ${opacity * 1.2})`);
          gradient.addColorStop(1, getColorString(other.colorIndex, opacity));
          
          // Draw curved connection for more organic feel
          ctx.beginPath();
          const midX = (node.x + other.x) / 2 + Math.sin(time + i) * 10;
          const midY = (node.y + other.y) / 2 + Math.cos(time + j) * 10;
          
          ctx.moveTo(node.x, node.y);
          ctx.quadraticCurveTo(midX, midY, other.x, other.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = opacity * 3;
          ctx.stroke();

          // Draw energy pulse along connection
          if (opacity > 0.15) {
            const pulsePos = (Math.sin(time * 3 + i + j) + 1) / 2;
            const pulseX = node.x + cdx * pulsePos;
            const pulseY = node.y + cdy * pulsePos;
            
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 2})`;
            ctx.fill();
          }
        }
      }
    });

    // Mouse glow effect
    if (mouse.active && mouse.x > 0 && mouse.y > 0) {
      const mouseGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 250);
      mouseGlow.addColorStop(0, 'rgba(168, 99, 255, 0.08)');
      mouseGlow.addColorStop(0.3, 'rgba(255, 99, 177, 0.04)');
      mouseGlow.addColorStop(0.6, 'rgba(99, 141, 255, 0.02)');
      mouseGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = mouseGlow;
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
      initNodes(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, active: false };
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
  }, [animate, initNodes]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
};

export default ParticleSwarm;
