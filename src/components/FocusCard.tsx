import { useRef, useEffect, useState, MouseEvent } from 'react';

interface FocusCardProps {
  title: string;
  description: string;
  index: number;
}

const FocusCard = ({ title, description, index }: FocusCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 150);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [index]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`focus-area-card group cursor-default ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Index number */}
      <span className="card-index">0{index + 1}</span>
      
      {/* Content */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-4">
          <span className="w-8 h-px bg-gradient-to-r from-transparent to-foreground/30 group-hover:w-12 group-hover:to-foreground/60 transition-all duration-500" />
          <h3 className="font-display text-xl md:text-2xl font-bold text-foreground tracking-tight group-hover:text-gradient-neon transition-all duration-500">
            {title}
          </h3>
        </div>
        <p className="text-muted-foreground font-body font-light leading-relaxed pl-12">
          {description}
        </p>
      </div>

      {/* Corner accent */}
      <div className="absolute bottom-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-foreground/20" />
      </div>
    </div>
  );
};

export default FocusCard;
