import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const AuthButton: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  icon,
  className = '',
  ...props 
}) => {
  
  const baseStyles = "relative overflow-hidden rounded-xl font-bold py-3 px-6 flex items-center justify-center gap-2 transition-all duration-200 outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-400 focus:ring-indigo-300",
    secondary: "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200 hover:shadow-pink-400 focus:ring-pink-300",
    outline: "border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm",
    ghost: "bg-transparent text-indigo-600 hover:bg-indigo-50",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </motion.button>
  );
};
