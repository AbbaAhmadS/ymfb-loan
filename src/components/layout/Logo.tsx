import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark } from 'lucide-react';

interface LogoProps {
  variant?: 'default' | 'light' | 'dark';
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'default', 
  showText = true,
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const colorClasses = {
    default: 'text-primary',
    light: 'text-primary-foreground',
    dark: 'text-primary',
  };

  return (
    <Link to="/" className="flex items-center gap-3 group">
      <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
        <div className="absolute inset-0 bg-gradient-accent rounded-lg opacity-20 group-hover:opacity-30 transition-opacity" />
        <Landmark className={`${sizeClasses[size]} ${colorClasses[variant]} relative z-10`} />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-serif font-bold ${textSizeClasses[size]} ${colorClasses[variant]} leading-tight`}>
            YMFB
          </span>
          <span className={`text-xs ${variant === 'light' ? 'text-primary-foreground/80' : 'text-muted-foreground'} leading-tight`}>
            Yobe Microfinance Bank
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
