import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { MOCK_MARKET_DATA, MOCK_WEATHER_ALERTS, MOCK_WEATHER_FORECAST, TRANSLATIONS } from '../constants';
import { 
  TrendingUp, TrendingDown, Minus, 
  CloudRain, ThermometerSun, Sun, Cloud, CloudLightning, CloudSun, 
  Wind, Droplets 
} from 'lucide-react';

interface DashboardProps {
  lang: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ lang }) => {
  const isRtl = lang !== Language.ENGLISH;
  const t = TRANSLATIONS[lang];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching delay when language changes or tab loads
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [lang]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="text-amber-400" size={32} />;
      case 'cloudy': return <Cloud className="text-gray-400" size={32} />;
      case 'partly_cloudy': return <CloudSun className="text-orange-300" size={32} />;
      case 'rain': return <CloudRain className="text-blue-400" size={32} />;
      case 'storm': return <CloudLightning className="text-purple-500" size={32} />;
      default: return <Sun className="text-amber-400" size={32} />;
    }
  };

  const getDayLabel = (offset: number) => {
    if (offset === 0) return t.today;
    if (offset === 1) return t.tomorrow;
    
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const locale = lang === Language.ENGLISH ? 'en-US' : 'ur-PK';
    return date.toLocaleDateString(locale, { weekday: 'short' });
  };

  const getConditionLabel = (condition: string) => {
      const key = `condition_${condition}` as keyof typeof t;
      return t[key] || condition;
  };

  if (isLoading) {
      return (
          <div className="space-y-8 animate-pulse p-2 sm:p-0">
              {/* Weather Skeleton */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 h-auto">
                  <div className="h-6 bg-gray-100 rounded-full w-48 mb-6"></div>
                  <div className="grid gap-4 mb-8">
                      <div className="h-24 bg-gray-50 rounded-2xl border border-gray-100"></div>
                      <div className="h-24 bg-gray-50 rounded-2xl border border-gray-100"></div>
                  </div>
                  <div className="flex gap-4 overflow-hidden">
                      {[1,2,3,4,5].map(i => (
                          <div key={i} className="h-32 w-32 bg-gray-50 rounded-2xl flex-shrink-0"></div>
                      ))}
                  </div>
              </div>
               {/* Market Skeleton */}
              <div>
                   <div className="h-6 bg-gray-100 rounded-full w-64 mb-4"></div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[1,2,3,4].map(i => (
                          <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 h-32">
                               <div className="flex justify-between mb-3">
                                   <div className="h-5 bg-gray-100 rounded w-24"></div>
                                   <div className="h-8 w-8 bg-gray-100 rounded-lg"></div>
                               </div>
                               <div className="h-8 bg-gray-100 rounded w-32 mb-2"></div>
                               <div className="h-4 bg-gray-100 rounded w-20"></div>
                          </div>
                      ))}
                   </div>
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-8 animate-fade-in p-2 sm:p-0">
      
      {/* Weather Section Container */}
      <div className="bg-gradient-to-br from-sky-50 to-white rounded-3xl p-4 sm:p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-sky-100">
          
          {/* Alerts Header */}
          <h3 className={`text-xl font-bold text-gray-800 flex items-center gap-2 mb-4 ${isRtl ? 'flex-row-reverse text-right font-urdu' : ''}`}>
            {lang === Language.ENGLISH ? 'Weather Alerts' : 'موسمی انتباہ'}
          </h3>

          {/* Alerts Grid */}
          <div className="grid gap-4 mb-8">
              {MOCK_WEATHER_ALERTS.map((alert, index) => (
                  <div key={index} className={`p-4 sm:p-5 rounded-2xl flex items-start gap-4 sm:gap-5 shadow-sm transition-transform hover:-translate-y-1 bg-white border ${
                      alert.type === 'rain' 
                      ? 'border-blue-100' 
                      : 'border-orange-100'
                  } ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                      
                      <div className={`p-2.5 sm:p-3 rounded-xl flex-shrink-0 ${alert.type === 'rain' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'}`}>
                          {alert.type === 'rain' ? <CloudRain size={24} className="sm:w-7 sm:h-7" /> : <ThermometerSun size={24} className="sm:w-7 sm:h-7" />}
                      </div>
                      
                      <div className="flex-1">
                          <p className={`font-semibold text-gray-800 text-base sm:text-lg leading-snug ${isRtl ? 'font-urdu' : ''}`}>{alert.message}</p>
                          <div className={`mt-2 flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                              <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-md ${
                                  alert.type === 'rain' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                              }`}>
                                  {alert.severity}
                              </span>
                          </div>
                      </div>
                  </div>
              ))}
          </div>

          {/* Forecast Header */}
          <h3 className={`text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2 mb-4 pt-4 border-t border-sky-100 ${isRtl ? 'flex-row-reverse text-right font-urdu' : ''}`}>
             <Sun className="text-amber-500" size={24} />
             {t.weather_forecast}
          </h3>

          {/* 5-Day Forecast Horizontal Scroll */}
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2 sm:mx-0 sm:px-0">
             {MOCK_WEATHER_FORECAST.map((day) => (
                 <div key={day.dayOffset} className="min-w-[130px] sm:min-w-[150px] flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center transition-all hover:shadow-md hover:border-sky-200">
                     <span className={`text-sm font-bold text-gray-500 mb-2 block ${isRtl && day.dayOffset > 1 ? 'font-urdu' : ''}`}>
                         {getDayLabel(day.dayOffset)}
                     </span>
                     <div className="mb-3 p-2 bg-sky-50 rounded-full">
                         {getWeatherIcon(day.condition)}
                     </div>
                     <span className={`text-sm font-bold text-gray-800 mb-1 ${isRtl ? 'font-urdu' : ''}`}>
                         {getConditionLabel(day.condition)}
                     </span>
                     <div className="flex items-center gap-2 text-gray-700 font-black text-lg sm:text-xl my-1">
                        <span>{day.tempMax}°</span>
                        <span className="text-gray-300 text-base font-normal">/</span>
                        <span className="text-gray-400 text-base">{day.tempMin}°</span>
                     </div>
                     
                     {/* Details */}
                     <div className="w-full pt-3 mt-2 border-t border-gray-50 flex justify-between text-[10px] sm:text-xs text-gray-400">
                         <div className="flex flex-col items-center gap-1">
                             <Droplets size={12} />
                             <span>{day.humidity}%</span>
                         </div>
                         <div className="flex flex-col items-center gap-1">
                             <Wind size={12} />
                             <span>{day.windSpeed}km</span>
                         </div>
                     </div>
                 </div>
             ))}
          </div>

      </div>

      {/* Market Rates */}
      <div>
        <h3 className={`text-xl font-bold text-gray-800 mb-4 ${isRtl ? 'text-right font-urdu' : ''}`}>
            {lang === Language.ENGLISH ? 'Real-time Mandi Rates' : 'منڈی کے تازہ ترین نرخ'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_MARKET_DATA.map((rate, index) => (
                <div key={index} className="bg-white p-5 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-100 hover:border-leaf-200 hover:shadow-lg transition-all group">
                    <div className={`flex justify-between items-start mb-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <h4 className="font-bold text-leaf-900 text-lg group-hover:text-leaf-700 transition-colors">{rate.crop}</h4>
                        <div className={`p-1.5 rounded-lg ${
                            rate.trend === 'up' ? 'bg-green-100 text-green-600' : 
                            rate.trend === 'down' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                            {rate.trend === 'up' && <TrendingUp size={20} />}
                            {rate.trend === 'down' && <TrendingDown size={20} />}
                            {rate.trend === 'stable' && <Minus size={20} />}
                        </div>
                    </div>
                    <div className={`text-2xl font-black text-gray-800 mb-2 ${isRtl ? 'text-right' : ''}`}>{rate.price}</div>
                    <div className={`text-xs font-medium text-gray-400 flex items-center gap-1.5 uppercase tracking-wide ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                        {rate.location}
                    </div>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;