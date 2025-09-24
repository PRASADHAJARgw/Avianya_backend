import React from 'react';

interface NodeConnectionProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
}

export const NodeConnection: React.FC<NodeConnectionProps> = ({ from, to }) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  
  // Control points for bezier curve
  const cp1x = from.x + Math.abs(dx) * 0.5;
  const cp1y = from.y;
  const cp2x = to.x - Math.abs(dx) * 0.5;
  const cp2y = to.y;

  const path = `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`;

  return (
    <g>
      {/* Shadow path */}
      <path
        d={path}
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="3"
        fill="none"
        transform="translate(1, 1)"
      />
      {/* Main path */}
      <path
        d={path}
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        fill="none"
        className="drop-shadow-sm"
      />
      {/* Animated dots */}
      <circle r="3" fill="hsl(var(--primary))">
        <animateMotion dur="2s" repeatCount="indefinite" path={path} />
      </circle>
    </g>
  );
};