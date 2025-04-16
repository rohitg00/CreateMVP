import React from 'react';

interface GradientOverlayProps {
  opacity?: number;
  variant?: 'default' | 'radial' | 'conic';
  blurAmount?: number;
}

const GradientOverlay: React.FC<GradientOverlayProps> = ({ 
  opacity = 0.7,
  variant = 'default',
  blurAmount = 5
}) => {
  // Generate the gradient background based on the variant
  const getGradientBackground = () => {
    switch (variant) {
      case 'radial':
        return `radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,${opacity}) 100%)`;
      
      case 'conic':
        return `conic-gradient(
          from 180deg at 50% 50%,
          rgba(0,0,0,${opacity}) 0deg,
          rgba(0,0,0,${opacity * 0.8}) 90deg,
          rgba(0,0,0,${opacity * 0.6}) 180deg,
          rgba(0,0,0,${opacity * 0.8}) 270deg,
          rgba(0,0,0,${opacity}) 360deg
        )`;
      
      default:
        return `
          linear-gradient(to bottom, 
            rgba(0,0,0,${opacity * 0.9}) 0%, 
            rgba(0,0,0,${opacity * 0.5}) 40%, 
            rgba(0,0,0,${opacity * 0.7}) 100%
          ),
          radial-gradient(
            circle at 30% 20%, 
            transparent 0%, 
            rgba(0,0,0,${opacity * 0.4}) 70%
          )
        `;
    }
  };

  return (
    <div 
      className="fixed inset-0 -z-5 pointer-events-none"
      style={{
        background: getGradientBackground(),
        backdropFilter: `blur(${blurAmount}px)`,
        pointerEvents: 'none'
      }}
    >
      {/* Optional spotlight/vignette effect */}
      <div 
        className="absolute inset-0 mix-blend-overlay opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.3) 0%, transparent 60%)",
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default GradientOverlay; 