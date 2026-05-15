import React from 'react';

interface AvatarProps {
  avatarData: string;
  className?: string;
}

const isImageDataUrl = (str: string) => {
  return str.startsWith('data:image/');
};

export const Avatar: React.FC<AvatarProps> = ({ avatarData, className = '' }) => {
  const baseClasses = "flex items-center justify-center rounded-full overflow-hidden shadow-sm border border-white/60";

  if (isImageDataUrl(avatarData)) {
    return (
      <img 
        src={avatarData} 
        alt="Player Avatar" 
        className={`${baseClasses} object-cover ${className}`}
      />
    );
  } else {
    return (
      <span className={`${baseClasses} ${className}`}>
        {avatarData}
      </span>
    );
  }
};