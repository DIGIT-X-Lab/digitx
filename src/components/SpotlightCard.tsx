// src/components/SpotlightCard.tsx
import { useRef, useState } from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'hsl(18 76% 48% / 0.08)',
}: SpotlightCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      className={`spotlight-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--spot-x': `${position.x}px`,
        '--spot-y': `${position.y}px`,
        '--spot-color': spotlightColor,
        '--spot-opacity': isHovered ? '1' : '0',
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default SpotlightCard;
