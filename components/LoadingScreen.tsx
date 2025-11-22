import React from 'react';
import { Tractor, Wheat, CloudSun } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-b from-sky-100 to-earth-50 flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute top-10 left-10 animate-pulse opacity-50">
          <CloudSun className="text-yellow-400 w-24 h-24" />
      </div>
      <div className="absolute top-20 right-10 animate-pulse opacity-30 animation-delay-500">
          <CloudSun className="text-yellow-400 w-16 h-16" />
      </div>

      {/* Central Logo Area */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="bg-white p-6 rounded-full shadow-2xl border-4 border-leaf-100 mb-8 animate-bounce">
           <Tractor size={64} className="text-leaf-600" />
        </div>
        
        <h1 className="text-3xl font-black text-leaf-900 tracking-tight mb-2 font-sans">
          Kissan Dost
        </h1>
        <p className="text-leaf-700 font-medium mb-8 text-sm uppercase tracking-widest">
          AI Agriculture Advisor
        </p>

        {/* Loading Dots */}
        <div className="flex gap-3">
           <div className="w-3 h-3 bg-leaf-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
           <div className="w-3 h-3 bg-earth-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
           <div className="w-3 h-3 bg-leaf-600 rounded-full animate-bounce"></div>
        </div>
      </div>

      {/* Bottom Landscape Animation */}
      <div className="absolute bottom-0 w-full overflow-hidden">
         {/* Grass/Crops */}
         <div className="flex justify-between px-4 w-full opacity-30 mb-2">
             {Array.from({ length: 8 }).map((_, i) => (
                 <Wheat key={i} className="text-earth-600 w-10 h-10 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
             ))}
         </div>
         <div className="h-3 bg-earth-600 w-full opacity-50"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;