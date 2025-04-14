import { useState, useCallback } from 'react';

interface HulyBackgroundOptions {
  showGlassmorphism?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  enableParallax?: boolean;
  starDensity?: 'low' | 'medium' | 'high';
  showAurora?: boolean;
}

interface HulyBackgroundControls {
  options: HulyBackgroundOptions;
  toggleGlassmorphism: () => void;
  setIntensity: (intensity: 'low' | 'medium' | 'high') => void;
  toggleParallax: () => void;
  setStarDensity: (density: 'low' | 'medium' | 'high') => void;
  toggleAurora: () => void;
  reset: () => void;
}

const defaultOptions: HulyBackgroundOptions = {
  showGlassmorphism: false,
  intensity: 'medium',
  enableParallax: true,
  starDensity: 'medium',
  showAurora: true,
};

export function useHulyBackground(initialOptions?: Partial<HulyBackgroundOptions>): HulyBackgroundControls {
  const [options, setOptions] = useState<HulyBackgroundOptions>({
    ...defaultOptions,
    ...initialOptions,
  });

  const toggleGlassmorphism = useCallback(() => {
    setOptions((prev) => ({
      ...prev,
      showGlassmorphism: !prev.showGlassmorphism,
    }));
  }, []);

  const setIntensity = useCallback((intensity: 'low' | 'medium' | 'high') => {
    setOptions((prev) => ({
      ...prev,
      intensity,
    }));
  }, []);

  const toggleParallax = useCallback(() => {
    setOptions((prev) => ({
      ...prev,
      enableParallax: !prev.enableParallax,
    }));
  }, []);

  const toggleAurora = useCallback(() => {
    setOptions((prev) => ({
      ...prev,
      showAurora: !prev.showAurora,
    }));
  }, []);

  const setStarDensity = useCallback((starDensity: 'low' | 'medium' | 'high') => {
    setOptions((prev) => ({
      ...prev,
      starDensity,
    }));
  }, []);

  const reset = useCallback(() => {
    setOptions(defaultOptions);
  }, []);

  return {
    options,
    toggleGlassmorphism,
    setIntensity,
    toggleParallax,
    toggleAurora,
    setStarDensity,
    reset,
  };
}