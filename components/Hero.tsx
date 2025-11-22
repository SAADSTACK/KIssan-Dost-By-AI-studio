import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Tractor, CloudSun, Wheat } from 'lucide-react';

interface HeroProps {
  lang: Language;
}

const Hero: React.FC<HeroProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const isRtl = lang !== Language.ENGLISH;

  return (
    <div className="relative bg-gradient-to-b from-sky-300 via-sky-100 to-leaf-50 overflow-hidden min-h-[220px] sm:min-h-[288px] w-full border-b-8 border-earth-500 shadow-inner">
      
      {/* Sun and Clouds Background */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 animate-float opacity-90">
        <CloudSun className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400 drop-shadow-lg" />
      </div>
      <div className="absolute top-8 right-8 opacity-60 animate-pulse">
        <CloudSun className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
      </div>

      {/* Main Text Overlay */}
      <div className={`relative z-20 flex flex-col justify-center items-center text-center px-4 pt-10 pb-16 sm:pb-10 w-full h-full ${isRtl ? 'font-urdu' : 'font-sans'}`}>
        <div className="bg-white/30 backdrop-blur-sm p-4 sm:p-6 rounded-3xl border border-white/40 shadow-xl max-w-2xl w-full mx-auto mt-2 sm:mt-8">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-leaf-900 drop-shadow-sm mb-2 leading-tight">
            {t.welcome}
            </h2>
            <div className="inline-block bg-leaf-800/90 text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-base md:text-lg font-medium shadow-md mt-1">
            {t.subtitle}
            </div>
        </div>
      </div>

      {/* Animated Scenery Layer */}
      <div className="absolute bottom-0 w-full z-10 pointer-events-none overflow-hidden">
        {/* Crops Layer - staggered animation */}
        <div className="flex justify-between items-end px-2 mb-[-4px] overflow-hidden w-full">
            {Array.from({ length: 12 }).map((_, i) => (
                <Wheat 
                    key={i} 
                    className={`text-amber-500 w-8 h-8 sm:w-14 sm:h-14 animate-sway opacity-90 transform origin-bottom flex-shrink-0`} 
                    style={{ 
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: `${3 + (i % 3)}s`
                    }} 
                />
            ))}
        </div>

        {/* Ground Strip */}
        <div className="h-2 sm:h-3 bg-earth-600 w-full shadow-inner"></div>

        {/* Tractor Animation - Loop across screen */}
        {/* Use overflow-hidden on parent to ensure this doesn't cause scroll */}
        <div className="absolute bottom-1 sm:bottom-2 animate-drive-slow z-30 w-full">
          <Tractor className="w-12 h-12 sm:w-20 sm:h-20 text-red-600 drop-shadow-2xl transform scale-x-[-1]" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
};

export default Hero;