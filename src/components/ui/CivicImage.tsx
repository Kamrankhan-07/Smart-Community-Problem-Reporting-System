import React, { useState } from 'react';
import { Camera } from 'lucide-react';

interface CivicImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const CivicImage: React.FC<CivicImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel = 'Civic Inspection Photo',
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-100 text-slate-500 border border-slate-200 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Camera className="w-6 h-6 text-slate-400 mb-1.5" strokeWidth={1.75} />
        <span className="text-xs font-medium text-slate-500 px-2 text-center truncate max-w-full">
          {fallbackLabel}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
