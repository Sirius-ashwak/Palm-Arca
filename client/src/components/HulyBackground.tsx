import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface HulyBackgroundProps {
  className?: string;
  showGlassmorphism?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  enableParallax?: boolean;
  starDensity?: 'low' | 'medium' | 'high';
  showAurora?: boolean;
}

const HulyBackground = ({ 
  className = '',
  showGlassmorphism = false,
  intensity = 'medium',
  enableParallax = true,
  starDensity = 'medium',
  showAurora = true
}: HulyBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Calculate intensity multipliers
  const intensityMultiplier = intensity === 'low' ? 0.6 : intensity === 'high' ? 1.4 : 1;
  const glowIntensity = intensityMultiplier;
  const animationSpeed = 1 / intensityMultiplier; // Inverse relationship - higher intensity = faster animations
  
  // Calculate star count based on density
  const getStarCount = () => {
    switch (starDensity) {
      case 'low': return 50;
      case 'high': return 200;
      case 'medium':
      default: return 100;
    }
  };
  
  // Effect for parallax movement on mouse move
  useEffect(() => {
    if (!enableParallax) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) - 0.5;
      const y = (clientY / window.innerHeight) - 0.5;
      
      setMousePosition({ x, y });
      
      // Get all elements with the parallax class
      const elements = container.querySelectorAll('.parallax-element');
      
      elements.forEach((el) => {
        const depth = parseFloat(el.getAttribute('data-depth') || '0.1');
        const moveX = x * depth * 40 * intensityMultiplier; // Apply intensity to movement
        const moveY = y * depth * 40 * intensityMultiplier;
        
        (el as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [enableParallax, intensityMultiplier]);
  
  // Generate random stars
  const generateStars = (count: number) => {
    return Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 2 + 1;
      const isLarge = Math.random() > 0.95; // 5% chance of being a larger star
      
      return (
        <motion.div
          key={i}
          className={`absolute rounded-full ${isLarge ? 'bg-blue-300' : 'bg-white'} ${enableParallax ? 'parallax-element' : ''}`}
          data-depth={0.05 + Math.random() * 0.15}
          style={{
            width: isLarge ? `${size + 1}px` : `${size}px`,
            height: isLarge ? `${size + 1}px` : `${size}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.2,
            boxShadow: isLarge ? `0 0 ${4 * glowIntensity}px ${1 * glowIntensity}px rgba(147, 197, 253, 0.7)` : 'none',
          }}
          animate={{
            opacity: [0.2, isLarge ? 0.9 : 0.7, 0.2],
          }}
          transition={{
            duration: (2 + Math.random() * 5) * animationSpeed,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      );
    });
  };
  
  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className} bg-space`}
      style={{
        zIndex: -1,
      }}
    >
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
        }}
      />
      
      {/* Pixel grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 0 0 L 0 1 L 20 1 L 20 0 Z' fill='%23ffffff'/%3E%3Cpath d='M 0 0 L 1 0 L 1 20 L 0 20 Z' fill='%23ffffff'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
        }}
      />
      
      {/* Aurora effect - subtle northern lights */}
      {showAurora && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Bottom aurora glow */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-[40vh] animate-pulse-slow"
            style={{
              background: `linear-gradient(to top, 
                rgba(124, 58, 237, ${0.12 * glowIntensity}) 0%, 
                rgba(124, 58, 237, 0) 100%)`,
              opacity: 0.8,
              filter: `blur(${30 * intensityMultiplier}px)`,
              mixBlendMode: 'screen',
            }}
          />
          
          {/* Animated aurora waves */}
          <motion.div 
            className={`absolute bottom-0 left-0 right-0 h-[25vh] ${enableParallax ? 'parallax-element' : ''} aurora-wave`}
            data-depth="0.05"
            style={{
              backgroundImage: `
                linear-gradient(to right, 
                  rgba(79, 70, 229, 0) 0%, 
                  rgba(79, 70, 229, ${0.2 * glowIntensity}) 20%, 
                  rgba(124, 58, 237, ${0.3 * glowIntensity}) 40%, 
                  rgba(139, 92, 246, ${0.2 * glowIntensity}) 60%, 
                  rgba(167, 139, 250, ${0.3 * glowIntensity}) 80%, 
                  rgba(79, 70, 229, 0) 100%
                )`,
              opacity: 0.7,
              filter: `blur(${40 * intensityMultiplier}px)`,
              mixBlendMode: 'screen',
              transformOrigin: 'bottom',
            }}
            animate={{
              scaleY: [0.8, 1.1, 0.9, 1.2, 0.8],
              y: [0, -10, 5, -15, 0],
            }}
            transition={{
              duration: 20 * animationSpeed,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <motion.div 
            className={`absolute bottom-0 left-0 right-0 h-[20vh] ${enableParallax ? 'parallax-element' : ''} aurora-wave-slow`}
            data-depth="0.08"
            style={{
              backgroundImage: `
                linear-gradient(to right, 
                  rgba(37, 99, 235, 0) 0%, 
                  rgba(37, 99, 235, ${0.2 * glowIntensity}) 30%, 
                  rgba(59, 130, 246, ${0.3 * glowIntensity}) 50%, 
                  rgba(96, 165, 250, ${0.2 * glowIntensity}) 70%, 
                  rgba(37, 99, 235, 0) 100%
                )`,
              opacity: 0.6,
              filter: `blur(${35 * intensityMultiplier}px)`,
              mixBlendMode: 'screen',
              transformOrigin: 'bottom',
            }}
            animate={{
              scaleY: [0.9, 1.2, 0.8, 1.1, 0.9],
              y: [0, -15, -5, -20, 0],
            }}
            transition={{
              duration: 25 * animationSpeed,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          
          {/* Additional subtle aurora wave */}
          <motion.div 
            className={`absolute bottom-[5vh] left-0 right-0 h-[15vh] ${enableParallax ? 'parallax-element' : ''} aurora-wave-fast`}
            data-depth="0.12"
            style={{
              backgroundImage: `
                linear-gradient(to right, 
                  rgba(192, 132, 252, 0) 0%, 
                  rgba(192, 132, 252, ${0.15 * glowIntensity}) 20%, 
                  rgba(216, 180, 254, ${0.25 * glowIntensity}) 50%, 
                  rgba(192, 132, 252, ${0.15 * glowIntensity}) 80%, 
                  rgba(192, 132, 252, 0) 100%
                )`,
              opacity: 0.5,
              filter: `blur(${30 * intensityMultiplier}px)`,
              mixBlendMode: 'screen',
              transformOrigin: 'bottom',
            }}
            animate={{
              scaleY: [1, 1.3, 0.9, 1.2, 1],
              y: [0, -8, 3, -12, 0],
            }}
            transition={{
              duration: 15 * animationSpeed,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          
          {/* Subtle top aurora */}
          <motion.div 
            className={`absolute top-0 left-0 right-0 h-[15vh] ${enableParallax ? 'parallax-element' : ''}`}
            data-depth="0.03"
            style={{
              backgroundImage: `
                linear-gradient(to bottom, 
                  rgba(79, 70, 229, ${0.1 * glowIntensity}) 0%, 
                  rgba(79, 70, 229, 0) 100%
                )`,
              opacity: 0.4,
              filter: `blur(${30 * intensityMultiplier}px)`,
              mixBlendMode: 'screen',
            }}
            animate={{
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 15 * animationSpeed,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      )}
      
      {/* Vertical glow beam in center */}
      <motion.div 
        className={`absolute left-1/2 top-0 bottom-0 w-[2px] ${enableParallax ? 'parallax-element' : ''} glow-effect`}
        data-depth="0.1"
        style={{
          background: 'linear-gradient(to bottom, rgba(120, 87, 255, 0), rgba(120, 87, 255, 0.8), rgba(120, 87, 255, 0))',
          transform: 'translateX(-50%)',
          boxShadow: `0 0 ${20 * glowIntensity}px ${5 * glowIntensity}px rgba(120, 87, 255, 0.5)`,
        }}
        animate={{
          opacity: [0.7, 1, 0.7],
          width: ['2px', `${2 + glowIntensity}px`, '2px'],
        }}
        transition={{
          duration: 4 * animationSpeed,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Secondary vertical beams */}
      <motion.div 
        className={`absolute left-[30%] top-0 bottom-0 w-[1px] ${enableParallax ? 'parallax-element' : ''}`}
        data-depth="0.15"
        style={{
          background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0), rgba(59, 130, 246, 0.5), rgba(59, 130, 246, 0))',
          boxShadow: `0 0 ${8 * glowIntensity}px ${2 * glowIntensity}px rgba(59, 130, 246, 0.3)`,
        }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 5 * animationSpeed,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      
      <motion.div 
        className={`absolute left-[70%] top-0 bottom-0 w-[1px] ${enableParallax ? 'parallax-element' : ''}`}
        data-depth="0.12"
        style={{
          background: 'linear-gradient(to bottom, rgba(147, 51, 234, 0), rgba(147, 51, 234, 0.5), rgba(147, 51, 234, 0))',
          boxShadow: `0 0 ${8 * glowIntensity}px ${2 * glowIntensity}px rgba(147, 51, 234, 0.3)`,
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6 * animationSpeed,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      
      {/* Bottom left radial glow */}
      <motion.div 
        className={`absolute bottom-0 left-0 w-[400px] h-[400px] ${enableParallax ? 'parallax-element' : ''}`}
        data-depth="0.2"
        style={{
          background: `radial-gradient(circle, rgba(65, 105, 225, ${0.3 * glowIntensity}) 0%, rgba(65, 105, 225, 0) 70%)`,
          borderRadius: '50%',
          transform: 'translate(-50%, 50%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8 * animationSpeed,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Bottom right radial glow */}
      <motion.div 
        className={`absolute bottom-0 right-0 w-[400px] h-[400px] ${enableParallax ? 'parallax-element' : ''}`}
        data-depth="0.15"
        style={{
          background: `radial-gradient(circle, rgba(147, 51, 234, ${0.3 * glowIntensity}) 0%, rgba(147, 51, 234, 0) 70%)`,
          borderRadius: '50%',
          transform: 'translate(50%, 50%)',
        }}
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10 * animationSpeed,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      
      {/* Top center glow */}
      <motion.div 
        className={`absolute top-0 left-1/2 w-[500px] h-[250px] ${enableParallax ? 'parallax-element' : ''}`}
        data-depth="0.1"
        style={{
          background: `radial-gradient(ellipse, rgba(59, 130, 246, ${0.2 * glowIntensity}) 0%, rgba(59, 130, 246, 0) 70%)`,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 7 * animationSpeed,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Mouse-following glow - only show if parallax is enabled */}
      {enableParallax && (
        <motion.div 
          className="absolute w-[300px] h-[300px] pointer-events-none"
          style={{
            background: `radial-gradient(circle, rgba(120, 87, 255, ${0.15 * glowIntensity}) 0%, rgba(120, 87, 255, 0) 70%)`,
            borderRadius: '50%',
            left: `calc(${(mousePosition.x + 0.5) * 100}% - 150px)`,
            top: `calc(${(mousePosition.y + 0.5) * 100}% - 150px)`,
            transition: 'left 0.3s ease-out, top 0.3s ease-out',
            opacity: 0.7 * glowIntensity,
            mixBlendMode: 'screen',
          }}
        />
      )}
      
      {/* Subtle stars/dots */}
      <div className="absolute inset-0">
        {generateStars(getStarCount())}
      </div>
      
      {/* Horizontal light streaks */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: intensity === 'low' ? 3 : intensity === 'high' ? 8 : 5 }).map((_, i) => {
          const top = 15 + Math.random() * 70; // Random position between 15% and 85% of the screen
          const width = 100 + Math.random() * 200; // Random width
          const opacity = (0.1 + Math.random() * 0.2) * glowIntensity; // Random opacity with intensity applied
          const delay = Math.random() * 5; // Random delay
          
          return (
            <motion.div
              key={i}
              className={`absolute h-[0.5px] ${enableParallax ? 'parallax-element' : ''}`}
              data-depth={0.05 + Math.random() * 0.1}
              style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%)',
                top: `${top}%`,
                width: `${width}px`,
                opacity: opacity,
                left: '-100px',
              }}
              animate={{
                left: ['0%', '100%'],
              }}
              transition={{
                duration: (7 + Math.random() * 10) * animationSpeed,
                repeat: Infinity,
                ease: "linear",
                delay: delay,
              }}
            />
          );
        })}
      </div>
      
      {/* Glassmorphism panel - conditionally rendered */}
      {showGlassmorphism && (
        <motion.div 
          className={`absolute left-1/2 top-1/2 w-[80%] max-w-[800px] h-[70%] ${enableParallax ? 'parallax-element' : ''} glassmorphism`}
          data-depth="0.05"
          style={{
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      )}
    </div>
  );
};

export default HulyBackground;