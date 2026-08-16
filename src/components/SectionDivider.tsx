import React from 'react';

export type DividerVariant = 'wave' | 'slant' | 'curve' | 'layered-wave' | 'peaks' | 'asymmetric-wave';

interface SectionDividerProps {
  variant?: DividerVariant;
  position?: 'top' | 'bottom';
  fillColor?: string; // e.g. "fill-white", "fill-slate-900", "fill-slate-50", "fill-slate-950"
  heightClass?: string; // e.g. "h-12 sm:h-16 lg:h-20"
  flipX?: boolean;
  className?: string;
  glow?: boolean;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  variant = 'wave',
  position = 'bottom',
  fillColor = 'fill-white',
  heightClass = 'h-12 sm:h-16 lg:h-24',
  flipX = false,
  className = '',
  glow = false,
}) => {
  const isTop = position === 'top';
  const transformClasses = `${isTop ? 'rotate-180 -mb-px' : '-mt-px'} ${flipX ? 'scale-x-[-1]' : ''}`;

  const renderSvgContent = () => {
    switch (variant) {
      case 'slant':
        return (
          <svg
            viewBox="0 0 1440 120"
            className={`w-full ${heightClass} ${fillColor} block`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,0 L1440,96 L1440,120 L0,120 Z" />
          </svg>
        );

      case 'curve':
        return (
          <svg
            viewBox="0 0 1440 120"
            className={`w-full ${heightClass} ${fillColor} block`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,32 C480,120 960,120 1440,32 L1440,120 L0,120 Z" />
          </svg>
        );

      case 'layered-wave':
        return (
          <svg
            viewBox="0 0 1440 120"
            className={`w-full ${heightClass} block`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0,32 C320,80 640,10 960,60 C1280,110 1380,40 1440,50 L1440,120 L0,120 Z"
              className={`${fillColor} opacity-40`}
            />
            <path
              d="M0,50 C240,110 480,30 720,80 C960,130 1200,40 1440,70 L1440,120 L0,120 Z"
              className={`${fillColor}`}
            />
          </svg>
        );

      case 'peaks':
        return (
          <svg
            viewBox="0 0 1440 120"
            className={`w-full ${heightClass} ${fillColor} block`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,64 L288,16 L576,96 L864,32 L1152,80 L1440,24 L1440,120 L0,120 Z" />
          </svg>
        );

      case 'asymmetric-wave':
        return (
          <svg
            viewBox="0 0 1440 120"
            className={`w-full ${heightClass} ${fillColor} block`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,64 C180,120 360,10 540,64 C720,118 900,32 1080,75 C1260,118 1380,32 1440,48 L1440,120 L0,120 Z" />
          </svg>
        );

      case 'wave':
      default:
        return (
          <svg
            viewBox="0 0 1440 120"
            className={`w-full ${heightClass} ${fillColor} block`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,32 C320,96 640,0 960,64 C1280,128 1380,32 1440,48 L1440,120 L0,120 Z" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden leading-none z-10 pointer-events-none ${transformClasses} ${className}`}
    >
      {glow && (
        <div className="absolute inset-0 bg-blue-500/10 blur-xl pointer-events-none -z-10" />
      )}
      {renderSvgContent()}
    </div>
  );
};
