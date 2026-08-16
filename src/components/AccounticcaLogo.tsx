import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
  onClick?: () => void;
}

// Brand Logo Images provided by the user
// BLUE: https://i.ibb.co/B80P15W/BLUE.png (fits light backgrounds/navbar)
// WHITE: https://i.ibb.co/SwDdFXVY/WHITE.png (fits dark backgrounds/footer)
// BLACK: https://i.ibb.co/20LRmDrz/BLACK.png (monochrome variant)
const LOGO_BLUE = 'https://i.ibb.co/B80P15W/BLUE.png';
const LOGO_WHITE = 'https://i.ibb.co/SwDdFXVY/WHITE.png';
const LOGO_BLACK = 'https://i.ibb.co/20LRmDrz/BLACK.png';

export const AccounticcaLogoIcon: React.FC<{ sizeClass?: string; className?: string; variant?: 'dark' | 'light' }> = ({
  sizeClass = 'w-10 h-10',
  className = '',
  variant = 'dark'
}) => {
  const [imgError, setImgError] = useState(false);
  const logoSrc = variant === 'light' ? LOGO_WHITE : LOGO_BLUE;

  if (imgError) {
    return (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClass} ${className} shrink-0`}
        aria-hidden="true"
      >
        <rect x="2" y="2" width="44" height="44" rx="12" fill={variant === 'light' ? '#1E293B' : '#1D4ED8'} />
        <path d="M14 34L24 14L34 34H28L24 24L20 34H14Z" fill="white" />
      </svg>
    );
  }

  return (
    <img
      src={logoSrc}
      alt="Accounticca Logo"
      className={`${sizeClass} ${className} object-contain shrink-0`}
      onError={() => setImgError(true)}
      referrerPolicy="no-referrer"
    />
  );
};

export const AccounticcaLogo: React.FC<LogoProps> = ({
  className = '',
  iconOnly = false,
  size = 'md',
  variant = 'dark',
  onClick
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    sm: { img: 'h-7 sm:h-8 w-auto max-w-[140px]', icon: 'w-7 h-7 sm:w-8 sm:h-8', text: 'text-lg', subtext: 'text-[9px]' },
    md: { img: 'h-9 sm:h-10 w-auto max-w-[175px] sm:max-w-[200px]', icon: 'w-9 h-9 sm:w-10 sm:h-10', text: 'text-2xl', subtext: 'text-[10px]' },
    lg: { img: 'h-11 sm:h-12 w-auto max-w-[220px] sm:max-w-[250px]', icon: 'w-11 h-11 sm:w-12 sm:h-12', text: 'text-3xl', subtext: 'text-xs' }
  };

  const currentSize = sizeMap[size];
  const textColor = variant === 'light' ? 'text-white' : 'text-slate-900';
  const subtextColor = variant === 'light' ? 'text-slate-300' : 'text-slate-600';
  const logoSrc = variant === 'light' ? LOGO_WHITE : LOGO_BLUE;

  if (iconOnly) {
    return <AccounticcaLogoIcon sizeClass={currentSize.icon} className={className} variant={variant} />;
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-center select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      {!imgError ? (
        <div className="relative group-hover:opacity-90 transition-opacity duration-200 flex items-center">
          <img
            src={logoSrc}
            alt="Accounticca - Business Consultancy & Growth Advisory"
            className={`${currentSize.img} object-contain transition-transform duration-300 group-hover:scale-[1.02]`}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <div className="relative group-hover:scale-105 transition-transform duration-300">
            <AccounticcaLogoIcon sizeClass={currentSize.icon} variant={variant} />
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center space-x-2">
              <span className={`${currentSize.text} font-extrabold tracking-tight font-serif ${textColor} group-hover:text-blue-600 transition-colors leading-none`}>
                Accounticca
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-600/20 dark:border-blue-500/30 px-1.5 py-0.5 rounded-xs">
                Advisory
              </span>
            </div>
            <p className={`${currentSize.subtext} ${subtextColor} tracking-wider uppercase font-semibold mt-1 flex items-center space-x-1.5`}>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block shrink-0 animate-pulse" />
              <span>Business Consultancy & Growth Advisory</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

