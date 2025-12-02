import React from 'react';
import { motion } from 'framer-motion';

interface MascotProps {
  lookAt: { x: number; y: number }; // Values between -1 and 1
  isPasswordFocused: boolean;
  authStatus: 'idle' | 'submitting' | 'success' | 'error';
}

export const Mascot: React.FC<MascotProps> = ({ lookAt, isPasswordFocused, authStatus }) => {
  // Clamp values to keep eyes within sockets, with fallback for undefined lookAt
  const safeLookAt = lookAt || { x: 0, y: 0 };
  const eyeX = Math.max(-15, Math.min(15, safeLookAt.x * 18)); // Increased range and multiplier
  const eyeY = Math.max(-12, Math.min(12, safeLookAt.y * 15)); // Increased range and multiplier

  // Debug: uncomment to see eye positions
  console.log('Eye positions:', { eyeX, eyeY, lookAt: safeLookAt });

  // Determine emotional state
  const isHappy = authStatus === 'success';
  const isSad = authStatus === 'error';
  const isThinking = authStatus === 'submitting';

  return (
    <div className="w-32 h-32 relative mx-auto mb-2 select-none">
      <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-xl">
        {/* Body */}
        <motion.path
          d="M 50 160 C 20 160 10 120 10 90 C 10 40 50 10 100 10 C 150 10 190 40 190 90 C 190 120 180 160 150 160 Z"
          className="fill-indigo-500"
          animate={{
            fill: isSad ? '#6366f1' : isHappy ? '#8b5cf6' : '#6366f1'
          }}
          transition={{ duration: 0.5, type: "spring" }}
        />

        {/* Ears */}
        <path d="M 20 50 C 0 30 10 10 30 20" className="fill-indigo-600" />
        <path d="M 180 50 C 200 30 190 10 170 20" className="fill-indigo-600" />

        {/* Blush */}
        <motion.ellipse
          cx="45" cy="100" rx="10" ry="6"
          className="fill-pink-400/40"
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{
            opacity: (isHappy || isPasswordFocused) ? 1 : 0.5,
            scale: isHappy ? 1.2 : 1
          }}
        />
        <motion.ellipse
          cx="155" cy="100" rx="10" ry="6"
          className="fill-pink-400/40"
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{
            opacity: (isHappy || isPasswordFocused) ? 1 : 0.5,
            scale: isHappy ? 1.2 : 1
          }}
        />

        {/* Eyes Container */}
        <g>
          {/* Left Eye Background */}
          <circle cx="65" cy="75" r="25" fill="white" />
          {/* Right Eye Background */}
          <circle cx="135" cy="75" r="25" fill="white" />

          {/* Pupils / Expression Eyes */}
          {isHappy ? (
            // Happy closed eyes ^ ^
            <>
              <motion.path
                d="M 45 75 Q 65 65 85 75"
                fill="transparent" stroke="#1e1b4b" strokeWidth="5" strokeLinecap="round"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, type: "spring" }}
              />
              <motion.path
                d="M 115 75 Q 135 65 155 75"
                fill="transparent" stroke="#1e1b4b" strokeWidth="5" strokeLinecap="round"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, type: "spring" }}
              />
            </>
          ) : isSad ? (
             // Sad eyes T T
            <>
               <motion.path d="M 50 70 L 80 70" stroke="#1e1b4b" strokeWidth="4" strokeLinecap="round" />
               <motion.path d="M 65 70 L 65 85" stroke="#1e1b4b" strokeWidth="4" strokeLinecap="round" />

               <motion.path d="M 120 70 L 150 70" stroke="#1e1b4b" strokeWidth="4" strokeLinecap="round" />
               <motion.path d="M 135 70 L 135 85" stroke="#1e1b4b" strokeWidth="4" strokeLinecap="round" />
            </>
          ) : (
            // Normal tracking eyes
            <>
              <motion.g animate={{ x: isPasswordFocused ? 0 : eyeX, y: isPasswordFocused ? 10 : eyeY }}>
                <circle cx="65" cy="75" r={isThinking ? 8 : 10} fill="#1e1b4b" />
                <circle cx="68" cy="72" r="3" fill="white" />
              </motion.g>
              <motion.g animate={{ x: isPasswordFocused ? 0 : eyeX, y: isPasswordFocused ? 10 : eyeY }}>
                <circle cx="135" cy="75" r={isThinking ? 8 : 10} fill="#1e1b4b" />
                <circle cx="138" cy="72" r="3" fill="white" />
              </motion.g>
            </>
          )}
        </g>

        {/* Mouth */}
        <motion.path
          className="stroke-indigo-900 fill-transparent stroke-[6px] stroke-linecap-round"
          initial={{ d: "M 80 120 Q 100 130 120 120" }}
          animate={{
            d: isHappy
              ? "M 70 110 Q 100 150 130 110" // Big Smile
              : isSad
                ? "M 75 130 Q 100 110 125 130" // Sad frown
                : isPasswordFocused
                  ? "M 90 115 Q 100 115 110 115" // Small O (nervous)
                  : isThinking
                    ? "M 85 120 Q 100 120 115 120" // Flat line
                    : "M 80 120 Q 100 130 120 120" // Neutral Smile
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />

        {/* Hands (Cover eyes for password, Raise for success) */}
        <motion.g
          initial={{ y: 150 }}
          animate={{
            y: isPasswordFocused ? 0 : isHappy ? -20 : 150,
            x: isHappy ? [0, -5, 5, 0] : 0
          }}
          transition={{
            y: { type: "spring", stiffness: 200, damping: 20 },
            x: { repeat: isHappy ? Infinity : 0, duration: 0.5 }
          }}
        >
          {isHappy ? (
            // Hands Up
            <>
               <path d="M 20 80 C 20 50 40 30 50 30 C 60 30 60 50 50 80" className="fill-indigo-600" />
               <path d="M 180 80 C 180 50 160 30 150 30 C 140 30 140 50 150 80" className="fill-indigo-600" />
            </>
          ) : (
            // Hands covering eyes or hidden
            <>
              <path d="M 30 160 C 30 130 45 110 65 110 C 85 110 90 130 90 160" className="fill-indigo-600" />
              <path d="M 170 160 C 170 130 155 110 135 110 C 115 110 110 130 110 160" className="fill-indigo-600" />
            </>
          )}
        </motion.g>
      </svg>
    </div>
  );
};