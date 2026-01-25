import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: 'view' | 'hover';
}

const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'view',
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const getRandomChar = useCallback(() => {
    return characters[Math.floor(Math.random() * characters.length)];
  }, [characters]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let currentIteration = 0;
    const revealedIndices = new Set<number>();

    const shouldAnimate =
      (animateOn === 'hover' && isHovering) ||
      (animateOn === 'view' && hasAnimated);

    if (!shouldAnimate) {
      setDisplayText(text);
      return;
    }

    const getNextIndex = () => {
      const textLength = text.length;
      switch (revealDirection) {
        case 'start':
          return revealedIndices.size;
        case 'end':
          return textLength - 1 - revealedIndices.size;
        case 'center': {
          const middle = Math.floor(textLength / 2);
          const offset = Math.floor(revealedIndices.size / 2);
          const nextIndex =
            revealedIndices.size % 2 === 0
              ? middle + offset
              : middle - offset - 1;
          if (nextIndex >= 0 && nextIndex < textLength && !revealedIndices.has(nextIndex)) {
            return nextIndex;
          }
          for (let i = 0; i < textLength; i++) {
            if (!revealedIndices.has(i)) return i;
          }
          return 0;
        }
        default:
          return revealedIndices.size;
      }
    };

    const shuffleText = () => {
      if (sequential) {
        const nextIndex = getNextIndex();
        if (nextIndex < text.length) {
          revealedIndices.add(nextIndex);
        }
        setDisplayText(
          text
            .split('')
            .map((char, i) => {
              if (char === ' ') return ' ';
              if (revealedIndices.has(i)) return text[i];
              return getRandomChar();
            })
            .join('')
        );
        if (revealedIndices.size >= text.length) {
          clearInterval(interval);
        }
      } else {
        currentIteration++;
        if (currentIteration >= maxIterations) {
          clearInterval(interval);
          setDisplayText(text);
        } else {
          setDisplayText(
            text
              .split('')
              .map((char, i) => {
                if (char === ' ') return ' ';
                if (Math.random() > 0.5 || currentIteration > maxIterations * 0.7) {
                  return text[i];
                }
                return getRandomChar();
              })
              .join('')
          );
        }
      }
    };

    interval = setInterval(shuffleText, speed);

    return () => clearInterval(interval);
  }, [text, speed, maxIterations, sequential, revealDirection, getRandomChar, isHovering, hasAnimated, animateOn]);

  useEffect(() => {
    if (animateOn !== 'view') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [animateOn, hasAnimated]);

  const hoverProps =
    animateOn === 'hover'
      ? {
          onMouseEnter: () => setIsHovering(true),
          onMouseLeave: () => setIsHovering(false),
        }
      : {};

  return (
    <motion.span
      ref={containerRef}
      className={parentClassName}
      {...hoverProps}
    >
      {displayText.split('').map((char, index) => {
        const isRevealed = char === text[index];
        return (
          <span
            key={index}
            className={isRevealed ? className : encryptedClassName || className}
            style={{
              opacity: isRevealed ? 1 : 0.7,
            }}
          >
            {char}
          </span>
        );
      })}
    </motion.span>
  );
};

export default DecryptedText;
