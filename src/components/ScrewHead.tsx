import React from 'react';

interface ScrewHeadProps {
  className?: string;
  rotation?: 'default' | 'alt' | 'alt2';
  id?: string;
}

export const ScrewHead: React.FC<ScrewHeadProps> = ({ className = '', rotation = 'default', id }) => {
  const rotationClass =
    rotation === 'alt' ? 'screw-alt' : rotation === 'alt2' ? 'screw-alt2' : '';

  return (
    <div
      id={id}
      aria-hidden="true"
      className={`screw ${rotationClass} shrink-0 pointer-events-none ${className}`}
    />
  );
};
