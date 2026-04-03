import { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';

interface CountUpProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CountUp = ({
  target,
  duration = 2,
  suffix = '',
  prefix = '',
  className = '',
}: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });
  const [display, setDisplay] = useState(
    prefersReducedMotion ? target.toLocaleString() : '0'
  );

  useEffect(() => {
    if (!isInView || prefersReducedMotion) return;

    const controls = animate(0, target, {
      duration,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (value) => {
        setDisplay(Math.round(value).toLocaleString());
      },
    });

    return () => controls.stop();
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
};

export default CountUp;
