import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, Check, Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  success?: boolean;
}

export const AuthInput: React.FC<InputProps> = ({ 
  label, 
  icon: Icon, 
  error, 
  success,
  value, 
  className,
  onFocus,
  onBlur,
  type,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const hasValue = value && value.toString().length > 0;
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  
  // Logic for floating label
  const isFloating = isFocused || hasValue;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const togglePasswordVisibility = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent focus loss on the input
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col gap-1 w-full relative mb-5">
      <motion.div 
        className="relative"
        animate={error ? { x: [0, -6, 6, -6, 6, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <div className={`
          relative w-full border-2 rounded-xl px-4 py-3.5
          transition-all duration-300 flex items-center
          ${error 
            ? 'border-red-300 bg-white' 
            : success
              ? 'border-green-400 bg-white shadow-md shadow-green-100'
              : isFocused 
                ? 'border-indigo-400 bg-white shadow-lg shadow-indigo-100' 
                : 'border-gray-200 bg-white hover:border-gray-300'
          }
        `}>
          {Icon && (
            <Icon 
              className={`mr-3 w-5 h-5 transition-colors duration-300 flex-shrink-0
                ${error ? 'text-red-400' : success ? 'text-green-500' : isFocused ? 'text-indigo-500' : 'text-gray-400'}
              `} 
            />
          )}

          <div className="flex-1 relative">
            {/* Label */}
            <motion.label
              initial={false}
              animate={{
                y: isFloating ? -28 : 0, // Move up to sit on border
                x: isFloating ? (Icon ? -32 : -10) : 0, // Align left when floating
                scale: isFloating ? 0.85 : 1,
                color: error ? '#f87171' : success ? '#4ade80' : isFocused ? '#6366f1' : '#9ca3af',
                fontWeight: isFloating ? 700 : 500,
              }}
              className={`absolute left-0 top-0 pointer-events-none origin-left flex items-center h-full truncate max-w-full
                ${isFloating ? 'z-20 bg-white px-1' : 'z-0'} 
              `}
            >
              {label}
            </motion.label>
            
            {/* Input */}
            <input
              className="w-full h-full bg-transparent outline-none text-gray-800 font-semibold text-base py-0.5 z-10 relative"
              value={value}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={success}
              type={inputType}
              {...props}
            />
          </div>

          {/* Password Toggle */}
          {isPassword && !success && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              onMouseDown={(e) => e.preventDefault()}
              className="ml-2 text-gray-400 hover:text-indigo-500 transition-colors focus:outline-none flex-shrink-0 z-20"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute right-4 text-green-500 flex-shrink-0"
              >
                <Check size={20} strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {error && (
          <motion.span 
            initial={{ opacity: 0, height: 0, y: -5 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -5 }}
            className="text-xs text-red-500 font-bold ml-1 block"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};
