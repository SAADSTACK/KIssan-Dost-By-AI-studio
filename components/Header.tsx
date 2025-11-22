import React from 'react';
import { Language } from '../types';
import { Leaf, Globe, Wifi, WifiOff } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface HeaderProps {
  currentLang: Language;
  setLang: (lang: Language) => void;
  isOnline: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentLang, setLang, isOnline }) => {
  const t = TRANSLATIONS[currentLang];
  
  return (
    <header className="bg-leaf-900/95 backdrop-blur-sm text-white shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-5xl mx-auto px-4 py-2 sm:py-3 flex justify-between items-center">
        
        {/* Logo Area */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-white/10 p-1.5 sm:p-2 rounded-xl backdrop-blur-md border border-white/20 shadow-inner">
            <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-leaf-400" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base sm:text-xl font-bold tracking-wide leading-none">Kissan Dost</h1>
            <span className="text-[9px] sm:text-xs text-leaf-300 uppercase tracking-wider font-medium mt-0.5">AI Advisor</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
            {/* Connectivity Status */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold border transition-colors duration-300 ${
                isOnline 
                ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-100' 
                : 'bg-red-900/40 border-red-500/50 text-red-100'
            }`}>
                {isOnline ? <Wifi size={12} className="sm:w-[14px] sm:h-[14px]" /> : <WifiOff size={12} className="sm:w-[14px] sm:h-[14px]" />}
                <span className="hidden xs:inline">
                    {isOnline ? t.online_mode : t.offline_mode}
                </span>
            </div>

            {/* Language Selector */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5 border border-white/10">
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-leaf-200" />
                <select 
                    value={currentLang}
                    onChange={(e) => setLang(e.target.value as Language)}
                    className="bg-transparent text-xs sm:text-sm font-medium focus:outline-none cursor-pointer text-white appearance-none pr-2 sm:pr-4"
                    style={{ backgroundImage: 'none' }}
                >
                    <option value={Language.ENGLISH} className="text-gray-900 bg-white">English</option>
                    <option value={Language.URDU} className="text-gray-900 bg-white">اردو (Urdu)</option>
                    <option value={Language.PUNJABI} className="text-gray-900 bg-white">پنجابی (Punjabi)</option>
                </select>
              </div>
            </div>
        </div>

      </div>
    </header>
  );
};

export default Header;