import React from 'react';
import '@/styles/components/Button.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  className = '',
  disabled = false,
  style,
  type = 'button'
}) => {
  return (
    <button
      onClick={onClick}
      className={`btn btn--${variant} ${className}`}
      disabled={disabled}
      style={style}
      type={type}
    >
      {children}
    </button>
  );
};


export default Button;