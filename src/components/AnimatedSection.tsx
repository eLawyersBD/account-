import React from 'react';
import { motion } from 'motion/react';

export interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'fade';
  delay?: number; // Delay in ms
  duration?: number; // Duration in ms
  threshold?: number; // Intersection threshold (0.0 to 1.0)
  once?: boolean; // Only animate once when scrolled into view
  id?: string;
  as?: React.ElementType;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  threshold = 0.1,
  once = true,
  id,
}) => {
  const getVariants = () => {
    switch (animation) {
      case 'fade-up':
        return {
          hidden: { opacity: 0, y: 32, scale: 0.99 },
          visible: { opacity: 1, y: 0, scale: 1 },
        };
      case 'fade-down':
        return {
          hidden: { opacity: 0, y: -32, scale: 0.99 },
          visible: { opacity: 1, y: 0, scale: 1 },
        };
      case 'fade-left':
        return {
          hidden: { opacity: 0, x: 32 },
          visible: { opacity: 1, x: 0 },
        };
      case 'fade-right':
        return {
          hidden: { opacity: 0, x: -32 },
          visible: { opacity: 1, x: 0 },
        };
      case 'zoom-in':
        return {
          hidden: { opacity: 0, scale: 0.94 },
          visible: { opacity: 1, scale: 1 },
        };
      case 'fade':
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
    }
  };

  // Convert duration and delay to seconds if provided in ms
  const durationSec = duration > 10 ? duration / 1000 : duration;
  const delaySec = delay > 10 ? delay / 1000 : delay;

  return (
    <motion.div
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={getVariants()}
      transition={{
        duration: durationSec,
        delay: delaySec,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

