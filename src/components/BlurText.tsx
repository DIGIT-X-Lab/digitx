import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useAnimation, Variants } from 'framer-motion';

interface BlurTextProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  animateBy?: 'words' | 'characters';
}

const BlurText = ({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  animateBy = 'words',
}: BlurTextProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);

  const elements = animateBy === 'words'
    ? children.split(' ')
    : children.split('');

  useEffect(() => {
    if (isInView && !hasAnimated) {
      controls.start('visible');
      setHasAnimated(true);
    }
  }, [isInView, controls, hasAnimated]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: animateBy === 'words' ? 0.08 : 0.03,
        delayChildren: delay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 8,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.span
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      style={{ display: 'inline' }}
    >
      {elements.map((element, index) => (
        <motion.span
          key={index}
          variants={itemVariants}
          style={{
            display: 'inline-block',
            whiteSpace: animateBy === 'words' ? 'pre' : 'pre-wrap',
          }}
        >
          {element}
          {animateBy === 'words' && index < elements.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default BlurText;
