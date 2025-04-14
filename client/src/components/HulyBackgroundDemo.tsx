import { useState } from 'react';
import { motion } from 'framer-motion';
import HulyBackground from './HulyBackground';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';

const HulyBackgroundDemo = () => {
  const [showGlassmorphism, setShowGlassmorphism] = useState(false);
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [enableParallax, setEnableParallax] = useState(true);
  const [starDensity, setStarDensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [showAurora, setShowAurora] = useState(true);
  
  const intensityValue = intensity === 'low' ? 0 : intensity === 'medium' ? 50 : 100;
  
  const handleIntensityChange = (value: number[]) => {
    if (value[0] < 33) {
      setIntensity('low');
    } else if (value[0] < 66) {
      setIntensity('medium');
    } else {
      setIntensity('high');
    }
  };
  
  const handleStarDensityChange = (value: number[]) => {
    if (value[0] < 33) {
      setStarDensity('low');
    } else if (value[0] < 66) {
      setStarDensity('medium');
    } else {
      setStarDensity('high');
    }
  };
  
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      <HulyBackground 
        showGlassmorphism={showGlassmorphism}
        intensity={intensity}
        enableParallax={enableParallax}
        starDensity={starDensity}
        showAurora={showAurora}
      />
      
      <motion.div 
        className="relative z-10 max-w-md w-full p-8 glassmorphism rounded-2xl border border-white/10 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg glow-effect rotate-12">
          <Sparkles className="h-10 w-10 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mt-8 mb-2 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 text-glow">
            Huly-Inspired Background
          </span>
        </h1>
        
        <p className="text-center text-white/70 mb-8">
          Customize your cosmic experience
        </p>
        
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 bg-white/5 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <Label htmlFor="glassmorphism" className="text-white font-medium">Glass Panel</Label>
                <Switch 
                  id="glassmorphism" 
                  checked={showGlassmorphism} 
                  onCheckedChange={setShowGlassmorphism} 
                />
              </div>
            </div>
            
            <div className="space-y-2 bg-white/5 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <Label htmlFor="parallax" className="text-white font-medium">Parallax</Label>
                <Switch 
                  id="parallax" 
                  checked={enableParallax} 
                  onCheckedChange={setEnableParallax} 
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2 bg-white/5 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="aurora" className="text-white font-medium">Aurora Waves</Label>
              <Switch 
                id="aurora" 
                checked={showAurora} 
                onCheckedChange={setShowAurora} 
              />
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-60"></div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="intensity" className="text-white font-medium">Effect Intensity</Label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/70 min-w-[30px]">Low</span>
              <Slider
                id="intensity"
                value={[intensityValue]}
                onValueChange={handleIntensityChange}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-white/70 min-w-[30px] text-right">High</span>
            </div>
            <div className="text-center text-sm text-white/80 mt-1 py-1 px-3 bg-white/10 rounded-full inline-block">
              {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="starDensity" className="text-white font-medium">Star Density</Label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/70 min-w-[30px]">Low</span>
              <Slider
                id="starDensity"
                value={[starDensity === 'low' ? 0 : starDensity === 'medium' ? 50 : 100]}
                onValueChange={handleStarDensityChange}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-white/70 min-w-[30px] text-right">High</span>
            </div>
            <div className="text-center text-sm text-white/80 mt-1 py-1 px-3 bg-white/10 rounded-full inline-block">
              {starDensity.charAt(0).toUpperCase() + starDensity.slice(1)}
            </div>
          </div>
          
          <div className="pt-4">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white glow-effect py-6 rounded-xl text-lg font-medium"
              onClick={() => {
                setShowGlassmorphism(false);
                setIntensity('medium');
                setEnableParallax(true);
                setStarDensity('medium');
                setShowAurora(true);
              }}
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HulyBackgroundDemo;