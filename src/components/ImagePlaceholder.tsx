import React from 'react';

interface ImagePlaceholderProps {
  src: string;
  alt: string;
  className?: string;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ src, alt, className = "" }) => {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-slate-200 ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
};
